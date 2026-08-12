#!/usr/bin/env node
/**
 * DEMO-UX-3 browser smoke runner (Chrome via puppeteer-core).
 * Scope: user detail presentation skeleton with production SCSS/CSS applied.
 * No live users / detail route / auth judgment / adapter / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-3-browser-smoke";
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

/** Replace SPFx theme token strings with their declared CSS defaults. */
function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

function compileProductionCss() {
  const shellCss = normalizeSpfxThemeCss(compileScss(shellUxScssPath, { style: "expanded" }).css);
  const dashboardCss = normalizeSpfxThemeCss(
    compileScss(dashboardUxScssPath, { style: "expanded" }).css,
  );
  const usersCss = normalizeSpfxThemeCss(compileScss(usersUxScssPath, { style: "expanded" }).css);
  const userDetailCss = normalizeSpfxThemeCss(
    compileScss(userDetailUxScssPath, { style: "expanded" }).css,
  );
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  return `${resetCss}\n${shellCss}\n${dashboardCss}\n${usersCss}\n${userDetailCss}`;
}

function cssRuleContains(css, selector, declarations) {
  const match = new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`, "s").exec(css);
  return Boolean(match) && declarations.every((declaration) => match[1].includes(declaration));
}

const productionCss = compileProductionCss();
const productionCssPath = path.join(outDir, "smoke-production.css");
fs.writeFileSync(productionCssPath, productionCss);

const productionCssChecks = {
  userDetailWidthSafety: cssRuleContains(productionCss, "userDetail", [
    "min-width: 0;",
    "max-width: 100%;",
  ]),
  supportListDesktopColumns: cssRuleContains(productionCss, "supportList", [
    "grid-template-columns: repeat(3, minmax(0, 1fr));",
  ]),
  supportListTabletStack:
    productionCss.includes("@media (max-width: 768px)") &&
    /\.supportList\s*,\s*\.stateGrid\s*\{[^}]*grid-template-columns:\s*1fr;/s.test(productionCss),
  stateGridDesktopColumns: cssRuleContains(productionCss, "stateGrid", [
    "grid-template-columns: repeat(2, minmax(0, 1fr));",
  ]),
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

await new Promise((resolve) => server.listen(4185, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4185";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

function assertUsersListWithPreview() {
  const root = document.documentElement;
  const body = document.body;
  const usersList = document.querySelector('[data-demo-ux="users-list"]');
  const detail = document.querySelector('[data-demo-ux="user-detail"]');
  const previewButtons = [...document.querySelectorAll('[data-demo-ux-detail-preview="true"]')];
  const disabledButtons = [...document.querySelectorAll('[data-demo-ux-detail-preview="false"]')];
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const selectedNav = document.querySelector('[data-shell-ux-nav="users"]');
  const slice = document
    .querySelector("[data-demo-ux-3-slice]")
    ?.getAttribute("data-demo-ux-3-slice");
  const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
  const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
  const shellStyle = shell instanceof HTMLElement ? window.getComputedStyle(shell) : null;
  const cssApplied =
    shellStyle?.display === "flex" && stylesheetLinks.includes("./smoke-production.css");
  const horizontalOverflow =
    root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
  const text = body?.textContent ?? "";
  return {
    pass:
      Boolean(usersList) &&
      !detail &&
      previewButtons.length === 1 &&
      !previewButtons[0]?.disabled &&
      disabledButtons.length === 7 &&
      disabledButtons.every((button) => button.disabled) &&
      Boolean(demo) &&
      Boolean(site) &&
      selectedNav?.getAttribute("aria-current") === "page" &&
      text.indexOf("利用可能です") < 0 &&
      slice === "DEMO-UX-3" &&
      cssApplied &&
      !horizontalOverflow,
    previewCount: previewButtons.length,
    disabledCount: disabledButtons.length,
    stylesheetLinks,
    cssApplied,
    horizontalOverflow,
    slice,
  };
}

function assertUserDetail(expectedSupportColumns) {
  const root = document.documentElement;
  const body = document.body;
  const detail = document.querySelector('[data-demo-ux="user-detail"]');
  const usersList = document.querySelector('[data-demo-ux="users-list"]');
  const note = document.querySelector('[data-demo-ux="user-detail-presentation-note"]');
  const back = document.querySelector('[data-demo-ux="user-detail-back"]');
  const sectionLabels = [
    ...document.querySelectorAll('[data-demo-ux="user-detail-section-label"]'),
  ].map((el) => el.textContent?.trim() ?? "");
  const headings = [...document.querySelectorAll("h2")].map((el) => el.textContent?.trim() ?? "");
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const slice = document
    .querySelector("[data-demo-ux-3-slice]")
    ?.getAttribute("data-demo-ux-3-slice");
  const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
  const supportList = document.querySelector(".supportList");
  const stateGrid = document.querySelector(".stateGrid");
  const detailStyle = detail instanceof HTMLElement ? window.getComputedStyle(detail) : null;
  const supportStyle =
    supportList instanceof HTMLElement ? window.getComputedStyle(supportList) : null;
  const stateStyle = stateGrid instanceof HTMLElement ? window.getComputedStyle(stateGrid) : null;
  const cssApplied =
    detailStyle?.display === "flex" &&
    supportStyle?.display === "grid" &&
    stylesheetLinks.includes("./smoke-production.css");
  const supportColumns = (supportStyle?.gridTemplateColumns ?? "")
    .trim()
    .split(/\s+/)
    .filter((track) => track.length > 0).length;
  const stateColumns = (stateStyle?.gridTemplateColumns ?? "")
    .trim()
    .split(/\s+/)
    .filter((track) => track.length > 0).length;
  const horizontalOverflow =
    root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
  const text = body?.textContent ?? "";
  const currentSupportIndex = headings.indexOf("現在の支援");
  const planIndex = headings.indexOf("支援計画");
  const recordsIndex = headings.indexOf("最近の記録");
  const evaluationIndex = headings.indexOf("評価");
  const historyIndex = headings.indexOf("履歴");
  const businessIndex = headings.indexOf("制度・業務情報（合成表示）");
  const systemIndex = headings.indexOf("システム状態");
  const orderOk =
    currentSupportIndex >= 0 &&
    planIndex > currentSupportIndex &&
    recordsIndex > planIndex &&
    evaluationIndex > recordsIndex &&
    historyIndex > evaluationIndex &&
    businessIndex > historyIndex &&
    systemIndex > historyIndex;
  const columnsMatch =
    expectedSupportColumns === 1
      ? supportColumns === 1 && stateColumns === 1
      : supportColumns === expectedSupportColumns && stateColumns === 2;
  return {
    pass:
      Boolean(detail) &&
      !usersList &&
      (note?.textContent ?? "").includes("業務データ") &&
      Boolean(back) &&
      !back?.disabled &&
      sectionLabels.join("|") === "概要|支援計画|記録|評価|履歴" &&
      orderOk &&
      text.indexOf("Aさん") >= 0 &&
      text.indexOf("環境調整") >= 0 &&
      text.indexOf("表示サンプル（live保存なし）") >= 0 &&
      text.indexOf("利用可能です") < 0 &&
      Boolean(demo) &&
      Boolean(site) &&
      slice === "DEMO-UX-3" &&
      cssApplied &&
      columnsMatch &&
      !horizontalOverflow,
    sectionLabels,
    headings,
    supportColumns,
    stateColumns,
    expectedSupportColumns,
    stylesheetLinks,
    cssApplied,
    horizontalOverflow,
  };
}

async function smokeCase(name, query, assertFn, viewport, args = []) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  if (viewport) {
    await page.setViewport(viewport);
  }
  const url = `${base}/index.html?${query}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const found = await page.evaluate(assertFn, ...args);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({ name, url, found, shot, pass, viewport: viewport ?? null, pageErrors: errors });
  await page.close();
  return pass;
}

let allPass = Object.values(productionCssChecks).every(Boolean);

allPass =
  (await smokeCase(
    "desktop-users-list-preview",
    "viewMode=ready&siteSelection=SITE-ISG&destination=users",
    assertUsersListWithPreview,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
  )) && allPass;

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click('[data-demo-ux-detail-preview="true"]');
  const found = await page.evaluate(assertUserDetail, 3);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, "desktop-user-detail.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({
    name: "desktop-user-detail",
    url,
    found,
    shot,
    pass,
    viewport: { width: 1280, height: 900, deviceScaleFactor: 1 },
    pageErrors: errors,
  });
  allPass = allPass && pass;

  await page.click('[data-demo-ux="user-detail-back"]');
  await page.waitForFunction(() => {
    const usersList = document.querySelector('[data-demo-ux="users-list"]');
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const heading = document.querySelector('[data-demo-ux="users-heading"]');
    return (
      Boolean(usersList) &&
      !detail &&
      document.activeElement === heading &&
      (heading?.textContent ?? "").trim() === "利用者"
    );
  });
  const backState = await page.evaluate(() => {
    const usersList = document.querySelector('[data-demo-ux="users-list"]');
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const heading = document.activeElement;
    return {
      usersListPresent: Boolean(usersList),
      detailPresent: Boolean(detail),
      activeData: heading?.getAttribute("data-demo-ux") ?? "",
      activeText: heading?.textContent?.trim() ?? "",
    };
  });
  const backPass =
    backState.usersListPresent &&
    !backState.detailPresent &&
    backState.activeData === "users-heading" &&
    backState.activeText === "利用者" &&
    errors.length === 0;
  const backShot = path.join(artifactsDir, "desktop-back-to-users.png");
  await page.screenshot({ path: backShot, fullPage: true });
  checks.push({
    name: "desktop-back-to-users",
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
  await page.click('[data-demo-ux-detail-preview="true"]');
  const found = await page.evaluate(assertUserDetail, 1);
  found.pageErrors = errors;
  if (errors.length > 0) {
    found.pass = false;
  }
  const shot = path.join(artifactsDir, "tablet-user-detail.png");
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({
    name: "tablet-user-detail",
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
  await page.focus('[data-demo-ux-detail-preview="true"]');
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => {
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const usersList = document.querySelector('[data-demo-ux="users-list"]');
    const heading = document.querySelector('[data-demo-ux="user-detail-heading"]');
    return (
      Boolean(detail) &&
      !usersList &&
      document.activeElement === heading &&
      (heading?.textContent ?? "").trim() === "Aさん"
    );
  });
  const state = await page.evaluate(() => {
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const usersList = document.querySelector('[data-demo-ux="users-list"]');
    const heading = document.activeElement;
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const shellStyle = shell instanceof HTMLElement ? window.getComputedStyle(shell) : null;
    const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
      (link) => link.getAttribute("href") ?? "",
    );
    const root = document.documentElement;
    const body = document.body;
    return {
      detailPresent: Boolean(detail),
      usersListPresent: Boolean(usersList),
      activeText: heading?.textContent?.trim() ?? "",
      activeData: heading?.getAttribute("data-demo-ux") ?? "",
      activeTag: heading?.tagName ?? "",
      cssApplied:
        shellStyle?.display === "flex" && stylesheetLinks.includes("./smoke-production.css"),
      horizontalOverflow:
        root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1,
    };
  });
  const keyboardPass =
    state.detailPresent &&
    !state.usersListPresent &&
    state.activeTag === "H1" &&
    state.activeData === "user-detail-heading" &&
    state.activeText === "Aさん" &&
    state.cssApplied &&
    !state.horizontalOverflow &&
    errors.length === 0;
  const shot = path.join(artifactsDir, "keyboard-users-to-detail.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-users-to-detail",
    url,
    found: { ...state, pageErrors: errors },
    shot,
    pass: keyboardPass,
    pageErrors: errors,
  });
  allPass = allPass && keyboardPass;
  await page.close();
}

const report = {
  unit: "DEMO-UX-3",
  kind: "browser smoke / user detail presentation skeleton with production CSS",
  date: new Date().toISOString(),
  cssSource: {
    shellUxScssPath,
    dashboardUxScssPath,
    usersUxScssPath,
    userDetailUxScssPath,
    productionCssPath,
    productionCssChecks,
  },
  sliceFlags: {
    id: "DEMO-UX-3",
    presentationOnly: true,
    syntheticUserDetailNavigationAuthorized: true,
    liveUserDetailNavigationAuthorized: false,
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
