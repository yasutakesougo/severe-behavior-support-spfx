#!/usr/bin/env node
/**
 * REVIEW-OUTCOME-CAPTURE-SLICE-A rendered browser acceptance.
 * Synthetic fixtures only. No LIVE I/O / Deploy / SharePoint.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.REVIEW_OUTCOME_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/review-outcome-capture-slice-a-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import("/tmp/node_modules/esbuild/lib/main.js").catch(
  () => import("/tmp/hr-smoke-runner/node_modules/esbuild/lib/main.js"),
);
const puppeteerModule =
  await import("/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js").catch(
    () =>
      import("/tmp/hr-smoke-runner/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"),
  );
const sassModule = await import("/tmp/node_modules/sass/sass.node.mjs").catch(
  () => import("/tmp/hr-smoke-runner/node_modules/sass/sass.node.mjs"),
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
      for (const match of text.matchAll(/\.([A-Za-z_][\w-]*)\s*[,:{]/g)) {
        keys.add(match[1]);
      }
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
await new Promise((resolve) => server.listen(4194, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath:
    process.env.REVIEW_OUTCOME_CHROME_PATH ??
    process.env.IA_CLARITY_CHROME_PATH ??
    "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const viewports = [
  { name: "desktop-1280x900", width: 1280, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844 },
];

function phaseCheckScript(expectedDecision) {
  const text = document.body.textContent ?? "";
  const buttons = [...document.querySelectorAll("[data-review-outcome-action]")];
  const materials = Boolean(document.querySelector('[data-human-review-status="RESOLVED"]'));
  const person = document
    .querySelector('[data-human-review-person-identity="true"]')
    ?.textContent?.trim();
  const scope = document.querySelector('[data-human-review-scope-meta="true"]')?.textContent ?? "";
  const liveWrite = document
    .querySelector("[data-review-outcome-capture]")
    ?.getAttribute("data-live-write-authorized");
  const presentationOnly = document
    .querySelector("[data-review-outcome-capture]")
    ?.getAttribute("data-presentation-only");
  const noHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth + 1;
  const noN1Control = !text.includes("次の計画版を作成");
  const common =
    materials &&
    person === "Aさん" &&
    scope.includes("計画版 3") &&
    text.includes("個別の事実資料") &&
    text.includes("見直し資料") &&
    text.includes("本番には保存されていません") &&
    liveWrite === "false" &&
    presentationOnly === "true" &&
    buttons.length === 2 &&
    noHorizontalOverflow &&
    noN1Control;

  if (expectedDecision === "UNDECIDED") {
    return {
      pass:
        common &&
        text.includes("見直し結果: 未判断") &&
        buttons.every((button) => !button.disabled),
      text,
      materials,
      person,
      scope,
      liveWrite,
      presentationOnly,
      noHorizontalOverflow,
      noN1Control,
      disabledCount: buttons.filter((button) => button.disabled).length,
    };
  }

  const changeRequired = expectedDecision === "CHANGE_REQUIRED";
  return {
    pass:
      common &&
      text.includes(
        changeRequired
          ? "デモ上の見直し結果: 変更が必要"
          : "デモ上の見直し結果: 変更なし",
      ) &&
      (changeRequired ? text.includes("次の計画版はまだ作成されていません") : true) &&
      buttons.every((button) => button.disabled),
    text,
    materials,
    person,
    scope,
    liveWrite,
    presentationOnly,
    noHorizontalOverflow,
    noN1Control,
    disabledCount: buttons.filter((button) => button.disabled).length,
  };
}

const checks = [];
let allPass = true;

for (const viewport of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const url = "http://127.0.0.1:4194/index.html";
  await page.goto(url, { waitUntil: "networkidle0" });

  const undecided = await page.evaluate(phaseCheckScript, "UNDECIDED");
  const undecidedShot = path.join(artifactsDir, `${viewport.name}-undecided.png`);
  await page.screenshot({ path: undecidedShot, fullPage: true });

  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForFunction(
    () => document.body.textContent?.includes("デモ上の見直し結果: 変更なし") === true,
  );
  const noChange = await page.evaluate(phaseCheckScript, "NO_CHANGE");
  const noChangeShot = path.join(artifactsDir, `${viewport.name}-no-change.png`);
  await page.screenshot({ path: noChangeShot, fullPage: true });

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
  await page.waitForFunction(
    () => document.body.textContent?.includes("次の計画版はまだ作成されていません") === true,
  );
  const changeRequired = await page.evaluate(phaseCheckScript, "CHANGE_REQUIRED");
  const changeRequiredShot = path.join(artifactsDir, `${viewport.name}-change-required.png`);
  await page.screenshot({ path: changeRequiredShot, fullPage: true });

  const pass = undecided.pass && noChange.pass && changeRequired.pass && pageErrors.length === 0;
  checks.push({
    viewport,
    url,
    undecided,
    noChange,
    changeRequired,
    pageErrors,
    pass,
    screenshots: { undecidedShot, noChangeShot, changeRequiredShot },
  });
  allPass = allPass && pass;
  await page.close();
}

await browser.close();
server.close();

const report = {
  unit: "REVIEW-OUTCOME-CAPTURE-SLICE-A",
  kind: "rendered browser acceptance / synthetic outcome capture",
  head: process.env.REVIEW_OUTCOME_HEAD ?? null,
  date: new Date().toISOString(),
  allPass,
  checks,
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(__dirname, "smoke-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ allPass, artifactsDir, viewports: checks.length }, null, 2));
process.exit(allPass ? 0 : 1);
