#!/usr/bin/env node
/**
 * HUMAN-REVIEW-STAFF-PARTIAL-IA-CLARITY-1 browser acceptance.
 * Proves A1 identity hierarchy + A2 overview/materials role cues on MonitoringView composition.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.IA_CLARITY_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/human-review-staff-partial-ia-clarity-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import("/tmp/node_modules/esbuild/lib/main.js").catch(() =>
  import("/tmp/hr-smoke-runner/node_modules/esbuild/lib/main.js"),
);
const puppeteerModule = await import(
  "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
).catch(
  () =>
    import("/tmp/hr-smoke-runner/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"),
);
const sassModule = await import("/tmp/node_modules/sass/sass.node.mjs").catch(() =>
  import("/tmp/hr-smoke-runner/node_modules/sass/sass.node.mjs"),
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compile = sassModule.compile ?? sassModule.default?.compile;

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const css = normalizeSpfxThemeCss(
  compile(path.join(repoRoot, "src/shell/monitoring/MonitoringViewUx.module.scss"), {
    style: "expanded",
  }).css,
);
fs.writeFileSync(
  path.join(__dirname, "smoke-production.css"),
  `html,body{margin:0;padding:16px;box-sizing:border-box;background:#f3f2f1}*,*::before,*::after{box-sizing:inherit}${css}`,
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

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
  const filePath = path.join(__dirname, rel);
  if (!filePath.startsWith(__dirname)) return res.writeHead(403).end("forbidden");
  fs.readFile(filePath, (error, data) => {
    if (error) return res.writeHead(404).end("not found");
    const type = filePath.endsWith(".html")
      ? "text/html; charset=utf-8"
      : filePath.endsWith(".js")
        ? "application/javascript; charset=utf-8"
        : "text/css; charset=utf-8";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(4193, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.IA_CLARITY_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const cases = [
  { name: "v3-current-nonzero", query: "v3", expectRecords: 1, expectScene: true },
  { name: "v2-historical-failclosed-label", query: "v2", expectRecords: 3, expectScene: false },
  { name: "v1-zero-record", query: "v1", expectRecords: 0, expectScene: false },
];

const checks = [];
let allPass = true;

for (const testCase of cases) {
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const url = `http://127.0.0.1:4193/index.html?case=${testCase.query}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const observed = await page.evaluate((expected) => {
    const text = document.body.textContent ?? "";
    const monitoringIdentity = document.querySelector('[data-monitoring-person-identity="true"]');
    const reviewIdentity = document.querySelector('[data-human-review-person-identity="true"]');
    const summaryCue = document.querySelector('[data-monitoring-role-cue="summary"]');
    const materialsCue = document.querySelector('[data-human-review-role-cue="materials"]');
    const scopeMeta = document.querySelector('[data-monitoring-scope-meta="true"]');
    const technical = document.querySelector('[data-human-review-technical-detail="true"]');
    const recordCount = document.querySelectorAll("[data-human-review-record-id]").length;
    const sceneCount = document.querySelectorAll('[data-human-review-scene-label="true"]').length;
    const noHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth + 1;
    const identityPrimary =
      Boolean(monitoringIdentity) &&
      monitoringIdentity.textContent?.trim() === "Aさん" &&
      Boolean(reviewIdentity) &&
      reviewIdentity.textContent?.trim() === "Aさん" &&
      Boolean(scopeMeta) &&
      (scopeMeta.textContent ?? "").includes("計画版") &&
      text.indexOf("Aさん") < text.indexOf("計画版");
    const roleClarity =
      summaryCue?.textContent?.trim() === "期間の件数確認" &&
      materialsCue?.textContent?.trim() === "個別の事実資料" &&
      text.includes("支援の良否、効果、計画変更の要否はこの画面では判定しません") &&
      text.includes("評価・承認・変更要否の判断は人が行います");
    const invariants =
      Boolean(document.querySelector('[data-monitoring-summary-only="true"]')) &&
      !text.includes("版管理") &&
      (expected.expectRecords === 0
        ? text.includes("0件であることは、「実施できなかった」という結果を意味しません。")
        : true) &&
      recordCount === expected.expectRecords &&
      (expected.expectScene ? sceneCount === 1 : sceneCount === 0);
    return {
      identityPrimary,
      roleClarity,
      invariants,
      technicalPresent: Boolean(technical),
      recordCount,
      sceneCount,
      noHorizontalOverflow,
      textSample: text.slice(0, 240),
    };
  }, testCase);
  const pass =
    observed.identityPrimary &&
    observed.roleClarity &&
    observed.invariants &&
    observed.technicalPresent &&
    observed.noHorizontalOverflow &&
    pageErrors.length === 0;
  const shot = path.join(artifactsDir, `${testCase.name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: testCase.name, url, observed, pageErrors, pass, shot });
  allPass = allPass && pass;
  await page.close();
}

await browser.close();
server.close();

const report = {
  unit: "HUMAN-REVIEW-STAFF-PARTIAL-IA-CLARITY-1",
  kind: "rendered browser acceptance / Track A identity + role clarity",
  date: new Date().toISOString(),
  allPass,
  checks,
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(__dirname, "smoke-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ allPass, artifactsDir, cases: checks.length }, null, 2));
process.exit(allPass ? 0 : 1);
