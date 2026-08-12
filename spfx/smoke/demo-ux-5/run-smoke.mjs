#!/usr/bin/env node
/**
 * DEMO-UX-5 browser smoke runner (Chrome via puppeteer-core).
 * Scope: daily record presentation skeleton with production SCSS/CSS applied.
 * No live record mutation / auth judgment / adapter / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-5-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import("/tmp/node_modules/esbuild/lib/main.js");
const puppeteerModule =
  await import("/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js");
const sassModule = await import("/tmp/node_modules/sass/sass.node.mjs");
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ?? sassModule.default?.compile ?? (await import("sass")).compile;

const shellUxScssPath = path.join(repoRoot, "src/shell/ux/ShellUx.module.scss");
const dashboardUxScssPath = path.join(repoRoot, "src/shell/dashboard/DashboardUx.module.scss");
const usersUxScssPath = path.join(repoRoot, "src/shell/users/UsersUx.module.scss");
const userDetailUxScssPath = path.join(repoRoot, "src/shell/users/UserDetailUx.module.scss");
const supportPlanUxScssPath = path.join(repoRoot, "src/shell/users/SupportPlanUx.module.scss");
const dailyRecordsUxScssPath = path.join(repoRoot, "src/shell/records/DailyRecordsUx.module.scss");

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

function compileProductionCss() {
  const parts = [
    shellUxScssPath,
    dashboardUxScssPath,
    usersUxScssPath,
    userDetailUxScssPath,
    supportPlanUxScssPath,
    dailyRecordsUxScssPath,
  ].map((scssPath) => normalizeSpfxThemeCss(compileScss(scssPath, { style: "expanded" }).css));
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  return `${resetCss}\n${parts.join("\n")}`;
}

function cssRuleContains(css, selector, declarations) {
  const match = new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`, "s").exec(css);
  return Boolean(match) && declarations.every((declaration) => match[1].includes(declaration));
}

const productionCss = compileProductionCss();
const productionCssPath = path.join(outDir, "smoke-production.css");
fs.writeFileSync(productionCssPath, productionCss);

const productionCssChecks = {
  dailyRecordsWidthSafety: cssRuleContains(productionCss, "dailyRecords", ["min-width: 0;"]),
  stateGridDesktopColumns: cssRuleContains(productionCss, "stateGrid", [
    "grid-template-columns: repeat(2, minmax(0, 1fr));",
  ]),
  stateGridTabletStack:
    productionCss.includes("@media (max-width: 768px)") &&
    /\.stateGrid\s*\{[^}]*grid-template-columns:\s*minmax\(0,\s*1fr\);/s.test(productionCss),
};

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
        .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(k)}`)
        .join(",\n");
      return {
        contents: `export default {\n${entries}\n};`,
        loader: "js",
      };
    });
  },
};

await esbuild.build({
  entryPoints: [path.join(__dirname, "smoke-entry.tsx")],
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
  external: [],
});

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(outDir, path.normalize(rel).replace(/^(\.\.[/\\])+/, ""));
  if (!filePath.startsWith(outDir)) {
    res.writeHead(403).end("forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] ?? "text/plain" });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(4187, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4187";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

function assertDailyRecords(expectedStateColumns) {
  const root = document.documentElement;
  const body = document.body;
  const records = document.querySelector('[data-demo-ux="daily-records"]');
  const placeholder = document.querySelector('[data-shell-ux="destination-placeholder"]');
  const heading = document.querySelector('[data-demo-ux="daily-record-heading"]');
  const note = document.querySelector('[data-demo-ux="daily-record-presentation-note"]');
  const incomplete = document.querySelectorAll(
    '[data-demo-ux="daily-record-incomplete-list"] > li',
  );
  const recent = document.querySelectorAll('[data-demo-ux="daily-record-recent-list"] > li');
  const mutationButtons = [
    ...document.querySelectorAll('[data-demo-ux="daily-record-mutation-button"]'),
  ];
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const slice = document
    .querySelector("[data-demo-ux-5-slice]")
    ?.getAttribute("data-demo-ux-5-slice");
  const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
  const stateGrid = document.querySelector(".stateGrid");
  const recordsStyle = records instanceof HTMLElement ? window.getComputedStyle(records) : null;
  const stateStyle = stateGrid instanceof HTMLElement ? window.getComputedStyle(stateGrid) : null;
  const cssApplied =
    recordsStyle?.display === "flex" && stylesheetLinks.includes("./smoke-production.css");
  const stateColumns = (stateStyle?.gridTemplateColumns ?? "")
    .trim()
    .split(/\s+/)
    .filter((track) => track.length > 0).length;
  const horizontalOverflow =
    root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
  const text = body?.textContent ?? "";
  const headings = [...document.querySelectorAll("h2")].map((el) => el.textContent?.trim() ?? "");
  const orderOk =
    headings.indexOf("未完了確認") >= 0 &&
    headings.indexOf("記録入力イメージ") > headings.indexOf("未完了確認") &&
    headings.indexOf("最近の記録") > headings.indexOf("記録入力イメージ") &&
    headings.indexOf("制度・業務情報（合成表示）") > headings.indexOf("最近の記録") &&
    headings.indexOf("システム状態") > headings.indexOf("最近の記録");
  return {
    pass:
      Boolean(records) &&
      !placeholder &&
      (heading?.textContent ?? "").trim() === "日々の記録" &&
      (note?.textContent ?? "").includes("業務データには接続されていません") &&
      incomplete.length === 2 &&
      recent.length === 3 &&
      mutationButtons.length === 2 &&
      mutationButtons.every((button) => button.disabled) &&
      orderOk &&
      text.indexOf("本日の支援記録が未入力") >= 0 &&
      text.indexOf("synthetic fixture only") >= 0 &&
      text.indexOf("利用可能です") < 0 &&
      text.indexOf("この画面は未接続です") < 0 &&
      Boolean(demo) &&
      Boolean(site) &&
      slice === "DEMO-UX-5" &&
      cssApplied &&
      stateColumns === expectedStateColumns &&
      !horizontalOverflow,
    incomplete: incomplete.length,
    recent: recent.length,
    stateColumns,
    expectedStateColumns,
    cssApplied,
    horizontalOverflow,
    slice,
  };
}

let allPass = Object.values(productionCssChecks).every(Boolean);

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=records`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const found = await page.evaluate(assertDailyRecords, 2);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, "desktop-daily-records.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({ name: "desktop-daily-records", url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-HOM&destination=records`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const found = await page.evaluate(assertDailyRecords, 1);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, "tablet-daily-records.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({
    name: "tablet-daily-records",
    url,
    found,
    shot,
    pass,
    viewport: { width: 768, height: 1024, deviceScaleFactor: 1 },
    pageErrors: errors,
  });
  allPass = allPass && pass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.focus('[data-shell-ux-nav="records"]');
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => {
    const records = document.querySelector('[data-demo-ux="daily-records"]');
    const heading = document.querySelector('[data-demo-ux="daily-record-heading"]');
    return Boolean(records) && document.activeElement === heading;
  });
  const state = await page.evaluate(() => {
    const records = document.querySelector('[data-demo-ux="daily-records"]');
    const placeholder = document.querySelector('[data-shell-ux="destination-placeholder"]');
    const heading = document.activeElement;
    const mutationButtons = [
      ...document.querySelectorAll('[data-demo-ux="daily-record-mutation-button"]'),
    ];
    return {
      recordsPresent: Boolean(records),
      placeholderPresent: Boolean(placeholder),
      activeData: heading?.getAttribute("data-demo-ux") ?? "",
      activeText: heading?.textContent?.trim() ?? "",
      mutationsDisabled: mutationButtons.every((button) => button.disabled),
    };
  });
  const keyboardPass =
    state.recordsPresent &&
    !state.placeholderPresent &&
    state.activeData === "daily-record-heading" &&
    state.activeText === "日々の記録" &&
    state.mutationsDisabled &&
    errors.length === 0;
  const shot = path.join(artifactsDir, "keyboard-nav-to-records.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-nav-to-records",
    url,
    found: { ...state, pageErrors: errors },
    shot,
    pass: keyboardPass,
    pageErrors: errors,
  });
  allPass = allPass && keyboardPass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const overviewState = await page.evaluate(() => {
    const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
    const records = document.querySelector('[data-demo-ux="daily-records"]');
    const demo = document.querySelector('[data-shell-ux="demo-banner"]');
    return {
      overviewPresent: Boolean(overview),
      recordsPresent: Boolean(records),
      demoPresent: Boolean(demo),
    };
  });
  const overviewPass =
    overviewState.overviewPresent &&
    !overviewState.recordsPresent &&
    overviewState.demoPresent &&
    errors.length === 0;
  const shot = path.join(artifactsDir, "desktop-overview-baseline.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "desktop-overview-baseline",
    url,
    found: { ...overviewState, pageErrors: errors },
    shot,
    pass: overviewPass,
    pageErrors: errors,
  });
  allPass = allPass && overviewPass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const listState = await page.evaluate(() => {
    const usersList = document.querySelector('[data-demo-ux="users-list"]');
    const records = document.querySelector('[data-demo-ux="daily-records"]');
    const demo = document.querySelector('[data-shell-ux="demo-banner"]');
    return {
      usersListPresent: Boolean(usersList),
      recordsPresent: Boolean(records),
      demoPresent: Boolean(demo),
    };
  });
  const listPass =
    listState.usersListPresent &&
    !listState.recordsPresent &&
    listState.demoPresent &&
    errors.length === 0;
  const shot = path.join(artifactsDir, "desktop-users-list-baseline.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "desktop-users-list-baseline",
    url,
    found: { ...listState, pageErrors: errors },
    shot,
    pass: listPass,
    pageErrors: errors,
  });
  allPass = allPass && listPass;
  await page.close();
}

const report = {
  unit: "DEMO-UX-5",
  kind: "browser smoke / daily record presentation skeleton with production CSS",
  date: new Date().toISOString(),
  cssSource: {
    shellUxScssPath,
    dashboardUxScssPath,
    usersUxScssPath,
    userDetailUxScssPath,
    supportPlanUxScssPath,
    dailyRecordsUxScssPath,
    productionCssPath,
    productionCssChecks,
  },
  sliceFlags: {
    id: "DEMO-UX-5",
    presentationOnly: true,
    syntheticDailyRecordPresentationAuthorized: true,
    liveDailyRecordNavigationAuthorized: false,
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    adapterFetchAuthorized: false,
    authJudgmentAuthorized: false,
    liveRecordDataAuthorized: false,
    dailyActivityRecordsReuseAuthorized: false,
    recordMutationAuthorized: false,
    evaluationMutationAuthorized: false,
  },
  allPass,
  checks,
};

fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

console.log(
  JSON.stringify({ allPass, artifactsDir, cases: checks.length, productionCssChecks }, null, 2),
);
process.exit(allPass ? 0 : 1);
