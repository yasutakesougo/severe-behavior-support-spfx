#!/usr/bin/env node
/**
 * MONITORING-REVIEW-AUTHORITY-HANDOFF browser smoke.
 * Synthetic fixtures only. No LIVE I/O / Deploy / SharePoint.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.MONITORING_REVIEW_AUTHORITY_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/monitoring-review-authority-handoff-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

async function importWithFallback(primaryPath, fallbackPath) {
  try {
    return await import(primaryPath);
  } catch {
    return import(fallbackPath);
  }
}

const esbuildModule = await importWithFallback(
  "/tmp/node_modules/esbuild/lib/main.js",
  "/tmp/hr-smoke-runner/node_modules/esbuild/lib/main.js",
);
const puppeteerModule = await importWithFallback(
  "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js",
  "/tmp/hr-smoke-runner/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js",
);
const sassModule = await importWithFallback(
  "/tmp/node_modules/sass/sass.node.mjs",
  "/tmp/hr-smoke-runner/node_modules/sass/sass.node.mjs",
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compile = sassModule.compile ?? sassModule.default?.compile;

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const monitoringCss = normalizeSpfxThemeCss(
  compile(path.join(repoRoot, "src/shell/monitoring/MonitoringViewUx.module.scss"), {
    style: "expanded",
  }).css,
);
const captureCss = normalizeSpfxThemeCss(
  compile(path.join(repoRoot, "src/shell/monitoring/ReviewOutcomeCaptureView.module.scss"), {
    style: "expanded",
  }).css,
);
fs.writeFileSync(
  path.join(__dirname, "smoke-production.css"),
  `html,body{margin:0;padding:16px;box-sizing:border-box;background:#f3f2f1}*,*::before,*::after{box-sizing:inherit}${monitoringCss}\n${captureCss}`,
);

const scssStubPlugin = {
  name: "scss-module-stub",
  setup(build) {
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, "utf8");
      const keys = new Set();
      for (const match of text.matchAll(/\.([A-Za-z_][\w-]*)\s*[,:{]/g)) keys.add(match[1]);
      const entries = [...keys]
        .map((key) => `${JSON.stringify(key)}:${JSON.stringify(key)}`)
        .join(",");
      return { contents: `export default {${entries}};`, loader: "js" };
    });
  },
};

await esbuild.build({
  entryPoints: [path.join(__dirname, "smoke-entry.tsx")],
  bundle: true,
  outfile: path.join(__dirname, "smoke-bundle.js"),
  format: "iife",
  platform: "browser",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  plugins: [scssStubPlugin],
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  define: { "process.env.NODE_ENV": '"production"' },
  nodePaths: [path.join(repoRoot, "node_modules")],
});

const html = `<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Monitoring review authority handoff smoke</title><link rel="stylesheet" href="/smoke-production.css"></head><body><div id="root"></div><script src="/smoke-bundle.js"></script></body></html>`;
const server = http.createServer((req, res) => {
  const pathname = new URL(req.url ?? "/", "http://127.0.0.1").pathname;
  if (pathname === "/" || pathname === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(html);
  }
  const rel = pathname.replace(/^\//, "");
  const filePath = path.join(__dirname, rel);
  if (!filePath.startsWith(__dirname)) return res.writeHead(403).end("forbidden");
  fs.readFile(filePath, (error, data) => {
    if (error) return res.writeHead(404).end("not found");
    const type = filePath.endsWith(".js")
      ? "application/javascript; charset=utf-8"
      : "text/css; charset=utf-8";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(4198, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath:
    process.env.MONITORING_REVIEW_AUTHORITY_CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
  defaultViewport: { width: 1440, height: 1000 },
});

const page = await browser.newPage();
const pageErrors = [];
page.on("pageerror", (error) => pageErrors.push(error.message));
await page.goto("http://127.0.0.1:4198/index.html", { waitUntil: "networkidle0" });
const observed = await page.evaluate(() =>
  [...document.querySelectorAll("[data-rba]")].map((article) => {
    const q = (selector) => article.querySelector(selector);
    const capture = q("[data-review-outcome-capture]");
    return {
      id: article.getAttribute("data-rba"),
      authority: q("[data-monitoring-review-authority]")?.getAttribute(
        "data-monitoring-review-authority",
      ),
      humanStatus: q("[data-human-review-status]")?.getAttribute("data-human-review-status"),
      planVersion: q("[data-human-review-plan-version]")?.getAttribute(
        "data-human-review-plan-version",
      ),
      zeroRecords: q('[data-human-review-empty="true"]') !== null,
      notPerformed: q('[data-human-review-result="NOT_PERFORMED"]') !== null,
      capturePresent: Boolean(capture),
      captureActionPresent: q("[data-review-outcome-action]") !== null,
      reviewMaterialsPresent:
        q("[data-human-review-plan-version], [data-human-review-record-list]") !== null,
      text: article.textContent ?? "",
    };
  }),
);

const expected = {
  "RBA-1": (value) => value.authority === "FOUND" && value.humanStatus === "RESOLVED",
  "RBA-2A": (value) =>
    value.authority === "UNRESOLVED" &&
    value.humanStatus === "UNRESOLVED" &&
    !value.capturePresent &&
    !value.captureActionPresent &&
    !value.reviewMaterialsPresent,
  "RBA-2B": (value) =>
    value.authority === "UNRESOLVED" &&
    value.humanStatus === "UNRESOLVED" &&
    !value.capturePresent &&
    !value.captureActionPresent &&
    !value.reviewMaterialsPresent,
  "RBA-2C": (value) =>
    value.authority === "UNRESOLVED" &&
    value.humanStatus === "UNRESOLVED" &&
    !value.capturePresent &&
    !value.captureActionPresent &&
    !value.reviewMaterialsPresent,
  "RBA-3": (value) => value.authority === "FOUND" && value.humanStatus === "CONTEXT_MISMATCH",
  "RBA-4-exact": (value) =>
    value.authority === "FOUND" && value.humanStatus === "RESOLVED" && value.planVersion === "2",
  "RBA-4-mismatch": (value) =>
    value.authority === "FOUND" && value.humanStatus === "CONTEXT_MISMATCH",
  "RBA-5": (value) => value.authority === "UNRESOLVED" && value.humanStatus === "UNRESOLVED",
  "RBA-6": (value) => value.authority === "FOUND" && value.humanStatus === "UNRESOLVED",
  "RBA-7": (value) =>
    value.authority === "FOUND" &&
    value.humanStatus === "RESOLVED" &&
    value.zeroRecords &&
    !value.notPerformed,
  "RBA-8": (value) =>
    value.authority === "FOUND" &&
    value.humanStatus === "RESOLVED" &&
    value.notPerformed &&
    !value.zeroRecords,
};
const checks = observed.map((value) => ({
  id: value.id,
  observed: value,
  pass: Boolean(expected[value.id]?.(value)) && pageErrors.length === 0,
}));
const allPass =
  observed.length === Object.keys(expected).length && checks.every((check) => check.pass);
const report = {
  unit: "MONITORING-REVIEW-AUTHORITY-HANDOFF",
  kind: "rendered browser smoke / synthetic authority handoff",
  head: process.env.MONITORING_REVIEW_AUTHORITY_HEAD ?? null,
  date: new Date().toISOString(),
  allPass,
  pageErrors,
  checks,
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(__dirname, "smoke-report.json"), JSON.stringify(report, null, 2));
await page.screenshot({
  path: path.join(artifactsDir, "monitoring-review-authority-handoff.png"),
  fullPage: true,
});
await page.close();
await browser.close();
server.close();
console.log(JSON.stringify({ allPass, artifactsDir, cases: checks.length }, null, 2));
process.exit(allPass ? 0 : 1);
