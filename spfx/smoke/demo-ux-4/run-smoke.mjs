#!/usr/bin/env node
/**
 * DEMO-UX-4 browser smoke runner (Chrome via puppeteer-core).
 * Scope: support plan presentation skeleton with production SCSS/CSS applied.
 * No live plan mutation / auth judgment / adapter / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-4-browser-smoke";
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
  supportPlanWidthSafety: cssRuleContains(productionCss, "supportPlan", [
    "min-width: 0;",
    "max-width: 100%;",
  ]),
  stateGridDesktopColumns: cssRuleContains(productionCss, "stateGrid", [
    "grid-template-columns: repeat(2, minmax(0, 1fr));",
  ]),
  stateGridTabletStack:
    productionCss.includes("@media (max-width: 768px)") &&
    /\.stateGrid\s*\{[^}]*grid-template-columns:\s*1fr;/s.test(productionCss),
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

await new Promise((resolve) => server.listen(4186, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4186";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

function assertSupportPlan(expectedStateColumns) {
  const root = document.documentElement;
  const body = document.body;
  const plan = document.querySelector('[data-demo-ux="support-plan"]');
  const detail = document.querySelector('[data-demo-ux="user-detail"]');
  const heading = document.querySelector('[data-demo-ux="support-plan-heading"]');
  const note = document.querySelector('[data-demo-ux="support-plan-presentation-note"]');
  const goals = document.querySelectorAll('[data-demo-ux="support-plan-goal"]');
  const actions = document.querySelectorAll('[data-demo-ux="support-plan-action"]');
  const mutationButtons = [
    ...document.querySelectorAll('[data-demo-ux="support-plan-mutation-button"]'),
  ];
  const back = document.querySelector('[data-demo-ux="support-plan-back"]');
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const slice = document
    .querySelector("[data-demo-ux-4-slice]")
    ?.getAttribute("data-demo-ux-4-slice");
  const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
  const stateGrid = document.querySelector(".stateGrid");
  const planStyle = plan instanceof HTMLElement ? window.getComputedStyle(plan) : null;
  const stateStyle = stateGrid instanceof HTMLElement ? window.getComputedStyle(stateGrid) : null;
  const cssApplied =
    planStyle?.display === "flex" && stylesheetLinks.includes("./smoke-production.css");
  const stateColumns = (stateStyle?.gridTemplateColumns ?? "")
    .trim()
    .split(/\s+/)
    .filter((track) => track.length > 0).length;
  const horizontalOverflow =
    root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
  const text = body?.textContent ?? "";
  const headings = [...document.querySelectorAll("h2")].map((el) => el.textContent?.trim() ?? "");
  const orderOk =
    headings.indexOf("計画の概要") >= 0 &&
    headings.indexOf("支援の目標") > headings.indexOf("計画の概要") &&
    headings.indexOf("具体的な支援内容") > headings.indexOf("支援の目標") &&
    headings.indexOf("見直し状況") > headings.indexOf("具体的な支援内容") &&
    headings.indexOf("制度・業務情報（合成表示）") > headings.indexOf("見直し状況") &&
    headings.indexOf("システム状態") > headings.indexOf("見直し状況");
  return {
    pass:
      Boolean(plan) &&
      !detail &&
      (heading?.textContent ?? "").trim() === "支援計画" &&
      !note &&
      (demo?.textContent ?? "").includes("live SharePoint 接続なし") &&
      goals.length === 2 &&
      actions.length === 3 &&
      mutationButtons.length === 3 &&
      mutationButtons.every((button) => button.disabled) &&
      Boolean(back) &&
      !back?.disabled &&
      orderOk &&
      text.indexOf("環境調整") >= 0 &&
      text.indexOf("要確認") >= 0 &&
      text.indexOf("確認待ち") < 0 &&
      text.indexOf("利用可能です") < 0 &&
      Boolean(demo) &&
      Boolean(site) &&
      slice === "DEMO-UX-4" &&
      cssApplied &&
      stateColumns === expectedStateColumns &&
      !horizontalOverflow,
    goals: goals.length,
    actions: actions.length,
    stateColumns,
    expectedStateColumns,
    cssApplied,
    horizontalOverflow,
    slice,
  };
}

async function openSupportPlan(page) {
  await page.click('[data-demo-ux-detail-preview="true"]');
  await page.waitForFunction(() => Boolean(document.querySelector('[data-demo-ux="user-detail"]')));
  await page.click('[data-demo-ux="user-detail-open-plan"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
  );
}

let allPass = Object.values(productionCssChecks).every(Boolean);

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openSupportPlan(page);
  const found = await page.evaluate(assertSupportPlan, 2);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, "desktop-support-plan.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({ name: "desktop-support-plan", url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;

  await page.click('[data-demo-ux="support-plan-back"]');
  await page.waitForFunction(() => {
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const plan = document.querySelector('[data-demo-ux="support-plan"]');
    const heading = document.querySelector('[data-demo-ux="user-detail-heading"]');
    return Boolean(detail) && !plan && document.activeElement === heading;
  });
  const backState = await page.evaluate(() => {
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const plan = document.querySelector('[data-demo-ux="support-plan"]');
    const heading = document.activeElement;
    return {
      detailPresent: Boolean(detail),
      planPresent: Boolean(plan),
      activeData: heading?.getAttribute("data-demo-ux") ?? "",
      activeText: heading?.textContent?.trim() ?? "",
    };
  });
  const backPass =
    backState.detailPresent &&
    !backState.planPresent &&
    backState.activeData === "user-detail-heading" &&
    backState.activeText === "Aさん" &&
    errors.length === 0;
  const backShot = path.join(artifactsDir, "desktop-back-to-user-detail.png");
  await page.screenshot({ path: backShot, fullPage: true });
  checks.push({
    name: "desktop-back-to-user-detail",
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
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-HOM&destination=users`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openSupportPlan(page);
  const found = await page.evaluate(assertSupportPlan, 1);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, "tablet-support-plan.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({
    name: "tablet-support-plan",
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
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click('[data-demo-ux-detail-preview="true"]');
  await page.waitForFunction(() => Boolean(document.querySelector('[data-demo-ux="user-detail"]')));
  await page.focus('[data-demo-ux="user-detail-open-plan"]');
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => {
    const plan = document.querySelector('[data-demo-ux="support-plan"]');
    const heading = document.querySelector('[data-demo-ux="support-plan-heading"]');
    return Boolean(plan) && document.activeElement === heading;
  });
  const state = await page.evaluate(() => {
    const plan = document.querySelector('[data-demo-ux="support-plan"]');
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const heading = document.activeElement;
    const mutationButtons = [
      ...document.querySelectorAll('[data-demo-ux="support-plan-mutation-button"]'),
    ];
    return {
      planPresent: Boolean(plan),
      detailPresent: Boolean(detail),
      activeData: heading?.getAttribute("data-demo-ux") ?? "",
      activeText: heading?.textContent?.trim() ?? "",
      mutationsDisabled: mutationButtons.every((button) => button.disabled),
    };
  });
  const keyboardPass =
    state.planPresent &&
    !state.detailPresent &&
    state.activeData === "support-plan-heading" &&
    state.activeText === "支援計画" &&
    state.mutationsDisabled &&
    errors.length === 0;
  const shot = path.join(artifactsDir, "keyboard-detail-to-plan.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-detail-to-plan",
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
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const listState = await page.evaluate(() => {
    const usersList = document.querySelector('[data-demo-ux="users-list"]');
    const plan = document.querySelector('[data-demo-ux="support-plan"]');
    const demo = document.querySelector('[data-shell-ux="demo-banner"]');
    return {
      usersListPresent: Boolean(usersList),
      planPresent: Boolean(plan),
      demoPresent: Boolean(demo),
    };
  });
  const listPass =
    listState.usersListPresent &&
    !listState.planPresent &&
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
  unit: "DEMO-UX-4",
  kind: "browser smoke / support plan presentation skeleton with production CSS",
  date: new Date().toISOString(),
  cssSource: {
    shellUxScssPath,
    dashboardUxScssPath,
    usersUxScssPath,
    userDetailUxScssPath,
    supportPlanUxScssPath,
    productionCssPath,
    productionCssChecks,
  },
  sliceFlags: {
    id: "DEMO-UX-4",
    presentationOnly: true,
    syntheticSupportPlanNavigationAuthorized: true,
    liveSupportPlanNavigationAuthorized: false,
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    adapterFetchAuthorized: false,
    authJudgmentAuthorized: false,
    liveUsersDataAuthorized: false,
    planMutationAuthorized: false,
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
