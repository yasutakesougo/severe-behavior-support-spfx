#!/usr/bin/env node
/**
 * DEMO-UX-6 browser smoke runner (Chrome via puppeteer-core).
 * Scope: review status & due-state presentation skeleton with production SCSS/CSS.
 * No live due calculation / review mutation / auth judgment / adapter / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.DEMO_UX_6_ARTIFACTS_DIR ?? "/opt/cursor/artifacts/demo-ux-6-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.DEMO_UX_6_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.DEMO_UX_6_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.DEMO_UX_6_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs"
);
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
const reviewDueUxScssPath = path.join(repoRoot, "src/shell/review/ReviewDueStateUx.module.scss");

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
    reviewDueUxScssPath,
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
  reviewDueWidthSafety: cssRuleContains(productionCss, "reviewDueState", [
    "min-width: 0;",
    "max-width: 100%;",
  ]),
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

await new Promise((resolve) => server.listen(4188, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4188";

const browser = await puppeteer.launch({
  executablePath: process.env.DEMO_UX_6_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

function assertReviewDueState(expectedStateColumns) {
  const root = document.documentElement;
  const body = document.body;
  const panel = document.querySelector('[data-demo-ux="review-due-state"]');
  const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
  const heading = document.querySelector('[data-demo-ux="review-due-heading"]');
  const note = document.querySelector('[data-demo-ux="review-due-presentation-note"]');
  const calcNote = document.querySelector('[data-demo-ux="review-due-calculation-note"]');
  const basis = document.querySelector('[data-demo-ux="review-due-semantic-basis"]');
  const originBasis = document.querySelector('[data-demo-ux="review-due-origin-basis"]');
  const dueBasis = document.querySelector('[data-demo-ux="review-due-due-basis"]');
  const approachingBasis = document.querySelector('[data-demo-ux="review-due-approaching-basis"]');
  const items = document.querySelectorAll('[data-demo-ux="review-due-attention-item"]');
  const statusLabels = document.querySelectorAll('[data-demo-ux="review-status-label"]');
  const dueLabels = document.querySelectorAll('[data-demo-ux="due-state-label"]');
  const reviewMaterials = document.querySelectorAll('[data-field-workflow="review-material-item"]');
  const mutationButtons = [
    ...document.querySelectorAll('[data-demo-ux="review-due-mutation-button"]'),
  ];
  const back = document.querySelector('[data-demo-ux="review-due-back"]');
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const slice = document
    .querySelector("[data-demo-ux-6-slice]")
    ?.getAttribute("data-demo-ux-6-slice");
  const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
  const stateGrid = document.querySelector(".stateGrid");
  const panelStyle = panel instanceof HTMLElement ? window.getComputedStyle(panel) : null;
  const stateStyle = stateGrid instanceof HTMLElement ? window.getComputedStyle(stateGrid) : null;
  const cssApplied =
    panelStyle?.display === "flex" && stylesheetLinks.includes("./smoke-production.css");
  const stateColumns = (stateStyle?.gridTemplateColumns ?? "")
    .trim()
    .split(/\s+/)
    .filter((track) => track.length > 0).length;
  const horizontalOverflow =
    root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
  const text = body?.textContent ?? "";
  const headings = [...document.querySelectorAll("h2")].map((el) => el.textContent?.trim() ?? "");
  const orderOk =
    headings.indexOf("基準日・due・通知開始") >= 0 &&
    headings.indexOf("見直し・期限の要約") > headings.indexOf("基準日・due・通知開始") &&
    headings.indexOf("確認が必要な対象") > headings.indexOf("見直し・期限の要約") &&
    headings.indexOf("見直し操作（表示専用）") > headings.indexOf("確認が必要な対象") &&
    headings.indexOf("制度・業務情報（合成表示）") > headings.indexOf("見直し操作（表示専用）") &&
    headings.indexOf("システム状態") > headings.indexOf("見直し操作（表示専用）");
  return {
    pass:
      Boolean(panel) &&
      !overview &&
      (heading?.textContent ?? "").trim() === "見直し状況" &&
      !note &&
      (demo?.textContent ?? "").includes("live SharePoint 接続なし") &&
      (calcNote?.textContent ?? "").includes("合成表示ラベル") &&
      items.length === 3 &&
      statusLabels.length === 3 &&
      dueLabels.length === 2 &&
      reviewMaterials.length === 2 &&
      [...statusLabels].every((el) => (el.textContent ?? "").includes("要確認")) &&
      [...statusLabels].every((el) => !(el.textContent ?? "").includes("確認待ち")) &&
      [...dueLabels].every((el) => (el.textContent ?? "").includes("期限接近")) &&
      [...dueLabels].every((el) => !(el.textContent ?? "").includes("期限間近")) &&
      mutationButtons.length === 2 &&
      mutationButtons.every((button) => button.disabled) &&
      Boolean(back) &&
      !back?.disabled &&
      orderOk &&
      text.indexOf("利用可能です") < 0 &&
      Boolean(demo) &&
      Boolean(site) &&
      slice === "DEMO-UX-6" &&
      Boolean(basis) &&
      (originBasis?.textContent ?? "").trim().length > 0 &&
      (dueBasis?.textContent ?? "").trim() ===
        "reviewDueDate は caller-supplied の基準日です。固定90日や自動失効には変換しません。" &&
      (approachingBasis?.textContent ?? "").trim() ===
        "通知開始は見直し対象の暦月に入った時点です。30日前などの日数固定窓は使いません。" &&
      (approachingBasis?.textContent ?? "").includes("見直し対象の暦月") &&
      (approachingBasis?.textContent ?? "").includes("使いません") &&
      !(approachingBasis?.textContent ?? "").includes("30日前です") &&
      cssApplied &&
      stateColumns === expectedStateColumns &&
      !horizontalOverflow,
    items: items.length,
    reviewMaterials: reviewMaterials.length,
    stateColumns,
    expectedStateColumns,
    cssApplied,
    horizontalOverflow,
    slice,
    originBasis: (originBasis?.textContent ?? "").trim(),
    dueBasis: (dueBasis?.textContent ?? "").trim(),
    approachingBasis: (approachingBasis?.textContent ?? "").trim(),
  };
}

async function openReviewDue(page) {
  await page.click('[data-demo-ux-review-due-preview="true"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="review-due-state"]')),
  );
}

let allPass = Object.values(productionCssChecks).every(Boolean);

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview&reviewCycle=subsequent`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openReviewDue(page);
  const found = await page.evaluate(assertReviewDueState, 2);
  found.pageErrors = errors;
  found.expectedOriginBasis = "継続基準日: 前回見直し日";
  found.pass =
    Boolean(found.pass) && found.originBasis === found.expectedOriginBasis && errors.length === 0;
  const shot = path.join(artifactsDir, "desktop-review-due-subsequent-anchor.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({
    name: "desktop-review-due-subsequent-anchor",
    url,
    found,
    shot,
    pass,
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
  await openReviewDue(page);
  const found = await page.evaluate(assertReviewDueState, 2);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, "desktop-review-due.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({ name: "desktop-review-due", url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;

  await page.click('[data-field-workflow="review-material-open"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-field-workflow="review-observation-association"]')),
  );
  const associationState = await page.evaluate(() => {
    const association = document.querySelector(
      '[data-field-workflow="review-observation-association"]',
    );
    const evidence = document.querySelectorAll(
      '[data-field-workflow="review-observation-evidence-list"] li',
    );
    const detail = document.querySelector('[data-field-workflow="review-material-detail"]');
    return {
      state: association?.getAttribute("data-field-workflow-association-state") ?? "",
      evidence: [...evidence].map((item) => item.textContent?.trim() ?? ""),
      detailVersion: detail?.getAttribute("data-field-workflow-plan-version") ?? "",
      pageErrors: errors,
    };
  });
  const associationPass =
    associationState.state === "ASSOCIATED" &&
    associationState.detailVersion === "2" &&
    associationState.evidence.length === 2 &&
    associationState.evidence[0]?.includes("synthetic-observation-v2-001") &&
    associationState.evidence[1]?.includes("synthetic-observation-v2-002") &&
    errors.length === 0;
  const associationShot = path.join(artifactsDir, "desktop-review-observation-association.png");
  await page.screenshot({ path: associationShot, fullPage: true });
  checks.push({
    name: "desktop-review-observation-association",
    url,
    found: associationState,
    shot: associationShot,
    pass: associationPass,
    pageErrors: errors,
  });
  allPass = allPass && associationPass;

  await page.click('[data-demo-ux="review-due-back"]');
  await page.waitForFunction(() => {
    const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
    const panel = document.querySelector('[data-demo-ux="review-due-state"]');
    const heading = document.querySelector('[data-dashboard-ux="overview-heading"]');
    return Boolean(overview) && !panel && document.activeElement === heading;
  });
  const backState = await page.evaluate(() => {
    const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
    const panel = document.querySelector('[data-demo-ux="review-due-state"]');
    const heading = document.activeElement;
    return {
      overviewPresent: Boolean(overview),
      panelPresent: Boolean(panel),
      activeData: heading?.getAttribute("data-dashboard-ux") ?? "",
      activeText: heading?.textContent?.trim() ?? "",
    };
  });
  const backPass =
    backState.overviewPresent &&
    !backState.panelPresent &&
    backState.activeData === "overview-heading" &&
    backState.activeText === "概要" &&
    errors.length === 0;
  const backShot = path.join(artifactsDir, "desktop-back-to-overview.png");
  await page.screenshot({ path: backShot, fullPage: true });
  checks.push({
    name: "desktop-back-to-overview",
    url,
    found: { ...backState, pageErrors: errors },
    shot: backShot,
    pass: backPass,
    pageErrors: errors,
  });
  allPass = allPass && backPass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 768, height: 1024, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-HOM&destination=overview`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openReviewDue(page);
  const found = await page.evaluate(assertReviewDueState, 1);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, "tablet-review-due.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({
    name: "tablet-review-due",
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
  await page.focus('[data-demo-ux="overview-open-review-due"]');
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => {
    const panel = document.querySelector('[data-demo-ux="review-due-state"]');
    const heading = document.querySelector('[data-demo-ux="review-due-heading"]');
    return Boolean(panel) && document.activeElement === heading;
  });
  const state = await page.evaluate(() => {
    const panel = document.querySelector('[data-demo-ux="review-due-state"]');
    const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
    const heading = document.activeElement;
    const mutationButtons = [
      ...document.querySelectorAll('[data-demo-ux="review-due-mutation-button"]'),
    ];
    return {
      panelPresent: Boolean(panel),
      overviewPresent: Boolean(overview),
      activeData: heading?.getAttribute("data-demo-ux") ?? "",
      activeText: heading?.textContent?.trim() ?? "",
      mutationsDisabled: mutationButtons.every((button) => button.disabled),
    };
  });
  const keyboardPass =
    state.panelPresent &&
    !state.overviewPresent &&
    state.activeData === "review-due-heading" &&
    state.activeText === "見直し状況" &&
    state.mutationsDisabled &&
    errors.length === 0;
  const shot = path.join(artifactsDir, "keyboard-overview-to-review-due.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-overview-to-review-due",
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
    const panel = document.querySelector('[data-demo-ux="review-due-state"]');
    const entry = document.querySelector('[data-demo-ux-review-due-preview="true"]');
    const demo = document.querySelector('[data-shell-ux="demo-banner"]');
    return {
      overviewPresent: Boolean(overview),
      panelPresent: Boolean(panel),
      entryPresent: Boolean(entry),
      demoPresent: Boolean(demo),
    };
  });
  const overviewPass =
    overviewState.overviewPresent &&
    !overviewState.panelPresent &&
    overviewState.entryPresent &&
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
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=records`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const recordsState = await page.evaluate(() => {
    const records = document.querySelector('[data-demo-ux="daily-records"]');
    const panel = document.querySelector('[data-demo-ux="review-due-state"]');
    const demo = document.querySelector('[data-shell-ux="demo-banner"]');
    return {
      recordsPresent: Boolean(records),
      panelPresent: Boolean(panel),
      demoPresent: Boolean(demo),
    };
  });
  const recordsPass =
    recordsState.recordsPresent &&
    !recordsState.panelPresent &&
    recordsState.demoPresent &&
    errors.length === 0;
  const shot = path.join(artifactsDir, "desktop-records-baseline.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "desktop-records-baseline",
    url,
    found: { ...recordsState, pageErrors: errors },
    shot,
    pass: recordsPass,
    pageErrors: errors,
  });
  allPass = allPass && recordsPass;
  await page.close();
}

const report = {
  unit: "DEMO-UX-6",
  kind: "browser smoke / review status & due-state presentation skeleton with production CSS",
  date: new Date().toISOString(),
  cssSource: {
    shellUxScssPath,
    dashboardUxScssPath,
    usersUxScssPath,
    userDetailUxScssPath,
    supportPlanUxScssPath,
    dailyRecordsUxScssPath,
    reviewDueUxScssPath,
    productionCssPath,
    productionCssChecks,
  },
  sliceFlags: {
    id: "DEMO-UX-6",
    presentationOnly: true,
    syntheticReviewDuePresentationAuthorized: true,
    liveReviewStatusReadAuthorized: false,
    liveDueStateCalculationAuthorized: false,
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    adapterFetchAuthorized: false,
    authJudgmentAuthorized: false,
    liveReviewDataAuthorized: false,
    reviewMutationAuthorized: false,
    evaluationMutationAuthorized: false,
    govRuleDecisionAuthorized: false,
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
