#!/usr/bin/env node
/**
 * SBS-MGMT-LOOP-B / B12 browser smoke.
 * Synthetic/session-only. No persistence, SharePoint, M365, Deploy, or LIVE WRITE.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const entry = path.join(spfxRoot, "smoke/support-plan-review-new-version-demo-1/smoke-entry.tsx");
const outDir = __dirname;
const artifactsDir =
  process.env.SBS_MGMT_LOOP_B_ARTIFACTS_DIR ?? "/tmp/sbs-mgmt-loop-b-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SBS_MGMT_LOOP_B_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.SBS_MGMT_LOOP_B_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.SBS_MGMT_LOOP_B_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.js"
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss = sassModule.compile ?? sassModule.default?.compile;

const scssPaths = [
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
  "src/shell/users/SupportPlanUx.module.scss",
  "src/shell/users/SupportPlanManagementListUx.module.scss",
  "src/shell/review/ReviewDueStateUx.module.scss",
  "src/shell/monitoring/MonitoringViewUx.module.scss",
  "src/shell/monitoring/ReviewOutcomeCaptureView.module.scss",
];

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const css = scssPaths
  .map((rel) =>
    normalizeSpfxThemeCss(compileScss(path.join(spfxRoot, rel), { style: "expanded" }).css),
  )
  .join("\n");
fs.writeFileSync(path.join(outDir, "smoke-production.css"), css);

const scssStubPlugin = {
  name: "scss-module-stub",
  setup(build) {
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, "utf8");
      const keys = new Set();
      for (const match of text.matchAll(/\.([A-Za-z_][\w-]*)\s*[,:{]/g)) keys.add(match[1]);
      const entries = [...keys]
        .map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(key)}`)
        .join(",\n");
      return { contents: `export default {\n${entries}\n};`, loader: "js" };
    });
  },
};

await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  outfile: path.join(outDir, "smoke-bundle.js"),
  format: "iife",
  platform: "browser",
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  plugins: [scssStubPlugin],
  define: { "process.env.NODE_ENV": '"production"' },
  nodePaths: [process.env.SBS_MGMT_LOOP_B_NODE_PATH ?? "/tmp/node_modules"],
});

fs.writeFileSync(
  path.join(outDir, "index.html"),
  '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="smoke-production.css"></head><body><div id="root"></div><script src="smoke-bundle.js"></script></body></html>',
);

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(outDir, path.normalize(rel).replace(/^(\.\.[/\\])+/, ""));
  fs.readFile(filePath, (error, data) => {
    if (error) return res.writeHead(404).end("not found");
    const ext = path.extname(filePath);
    const type =
      ext === ".html" ? "text/html" : ext === ".css" ? "text/css" : "application/javascript";
    res.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(4194, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_MGMT_LOOP_B_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

async function runCase(name, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const url =
    "http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER";
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click(
    '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]',
  );
  await page.waitForSelector('[data-demo-ux="support-plan"]');
  await page.waitForSelector('[data-review-outcome-reason-input="true"]');
  await page.type(
    '[data-review-outcome-reason-input="true"]',
    "Synthetic B12 human decision reason",
  );
  await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
  await page.waitForSelector('[data-review-outcome-readback="true"]');
  await page.waitForFunction(() => {
    const button = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    return button instanceof HTMLButtonElement && !button.disabled;
  });

  const preStart = await page.evaluate(() => {
    const start = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    const predecessor = document.querySelector('[data-planning-pc="review-cta"]');
    const disabledPredecessor = document.querySelector(
      '[data-sbs-mgmt-loop-b-action="start-revision-disabled"]',
    );
    const primaryActions = document.querySelectorAll('[data-sbs-action="primary"]');
    const currentVersion = document.querySelector('[data-planning-pc-version-current="true"]');
    return {
      startEnabled: start instanceof HTMLButtonElement && !start.disabled,
      startIsPrimary: start?.getAttribute("data-sbs-action") === "primary",
      predecessorDemoted:
        predecessor?.getAttribute("data-sbs-action") === "tertiary" &&
        predecessor?.getAttribute("data-sbs-mgmt-loop-b-predecessor") === "demoted",
      disabledPredecessorAbsent: disabledPredecessor === null,
      primaryCount: primaryActions.length,
      currentVersionLabel: currentVersion?.textContent ?? "",
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });

  await page.click('[data-sbs-mgmt-loop-b-action="start-revision"]');
  await page.waitForSelector('[data-sbs-mgmt-loop-b-draft="true"]');

  const found = await page.evaluate(() => {
    const text = document.body?.textContent ?? "";
    const draft = document.querySelector('[data-sbs-mgmt-loop-b-draft="true"]');
    const boundary = document.querySelector('[data-sbs-mgmt-loop-b-boundary="true"]');
    const decision = document.querySelector('[data-sbs-mgmt-loop-b-decision="CHANGE_REQUIRED"]');
    const reason = document.querySelector('[data-sbs-mgmt-loop-b-reason="true"]');
    const primaryActions = document.querySelectorAll('[data-sbs-action="primary"]');
    const currentVersion = document.querySelector('[data-planning-pc-version-current="true"]');
    const startGone = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    return {
      draftPresent: Boolean(draft),
      decisionPresent: Boolean(decision),
      reasonPresent: Boolean(reason),
      draftHasNPlusOne: (draft?.textContent ?? "").includes("変更内容の下書き: 版 4"),
      draftKeepsSourceN: (draft?.textContent ?? "").includes("元の版: 3（変更しない）"),
      draftSessionOnly: (draft?.textContent ?? "").includes("下書き / 本番未保存"),
      boundaryNoLiveWrite: (boundary?.textContent ?? "").includes("本番には保存されていません"),
      reasonTextPresent: text.includes("Synthetic B12 human decision reason"),
      primaryCountAfterDraft: primaryActions.length,
      currentVersionStillN: (currentVersion?.textContent ?? "").includes("版 3"),
      startActionCleared: startGone === null,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      draftText: draft?.textContent ?? "",
      boundaryText: boundary?.textContent ?? "",
    };
  });

  const pass =
    preStart.startEnabled &&
    preStart.startIsPrimary &&
    preStart.predecessorDemoted &&
    preStart.disabledPredecessorAbsent &&
    preStart.primaryCount === 1 &&
    !preStart.overflowX &&
    (preStart.currentVersionLabel.includes("版 3") || preStart.currentVersionLabel.includes("3")) &&
    found.draftPresent &&
    found.decisionPresent &&
    found.reasonPresent &&
    found.draftHasNPlusOne &&
    found.draftKeepsSourceN &&
    found.draftSessionOnly &&
    found.boundaryNoLiveWrite &&
    found.reasonTextPresent &&
    found.primaryCountAfterDraft === 1 &&
    found.currentVersionStillN &&
    found.startActionCleared &&
    !found.overflowX;

  const screenshot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  await page.close();
  return { name, width, height, pass, preStart, found, pageErrors, screenshot };
}

const cases = [
  await runCase("desktop-1280x900", 1280, 900),
  await runCase("mobile-390x844", 390, 844),
];
await browser.close();
server.close();

const pass = cases.every((item) => item.pass && item.pageErrors.length === 0);
const report = { unit: "SBS-MGMT-LOOP-B", acceptance: "B12", pass, cases };
fs.writeFileSync(path.join(artifactsDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!pass) process.exit(1);
