#!/usr/bin/env node
/**
 * DEMO-UX-2 browser smoke runner (Chrome via puppeteer-core).
 * Scope: users list presentation skeleton with production SCSS/CSS applied.
 * No live users data / auth judgment / adapter / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-2-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import("/tmp/node_modules/esbuild/lib/main.js");
const puppeteerModule = await import(
  "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import("/tmp/node_modules/sass/sass.node.mjs");
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ??
  sassModule.default?.compile ??
  (await import("sass")).compile;

const shellUxScssPath = path.join(repoRoot, "src/shell/ux/ShellUx.module.scss");
const dashboardUxScssPath = path.join(repoRoot, "src/shell/dashboard/DashboardUx.module.scss");
const usersUxScssPath = path.join(repoRoot, "src/shell/users/UsersUx.module.scss");

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
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  return `${resetCss}\n${shellCss}\n${dashboardCss}\n${usersCss}`;
}

function cssRuleContains(css, selector, declarations) {
  const match = new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`, "s").exec(css);
  return Boolean(match) && declarations.every((declaration) => match[1].includes(declaration));
}

const productionCss = compileProductionCss();
const productionCssPath = path.join(outDir, "smoke-production.css");
fs.writeFileSync(productionCssPath, productionCss);

const productionCssChecks = {
  usersListWidthSafety: cssRuleContains(productionCss, "usersList", [
    "min-width: 0;",
    "max-width: 100%;",
  ]),
  userRowDesktopColumns: cssRuleContains(productionCss, "userRow", [
    "grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) auto;",
  ]),
  userRowTabletStack: productionCss.includes("@media (max-width: 768px)") &&
    /\.userRow\s*\{[^}]*grid-template-columns:\s*1fr;/s.test(productionCss),
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

await new Promise((resolve) => server.listen(4184, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4184";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

function assertUsersList(expectedRowColumns) {
  const root = document.documentElement;
  const body = document.body;
  const usersList = document.querySelector('[data-demo-ux="users-list"]');
  const heading = document.querySelector('[data-demo-ux="users-heading"]');
  const note = document.querySelector('[data-demo-ux="users-presentation-note"]');
  const summary = document.querySelector('[data-demo-ux="users-summary-label"]');
  const rows = document.querySelectorAll('[data-demo-ux="users-row"]');
  const badges = document.querySelectorAll('[data-demo-ux="users-status-badge"]');
  const filterChips = [...document.querySelectorAll('[data-demo-ux="users-filter-chip"]')];
  const detailButtons = [...document.querySelectorAll('[data-demo-ux="users-detail-button"]')];
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const selectedNav = document.querySelector('[data-shell-ux-nav="users"]');
  const placeholder = document.querySelector('[data-shell-ux="destination-placeholder"]');
  const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
  const text = document.body?.textContent ?? "";
  const slice = document
    .querySelector("[data-demo-ux-slice]")
    ?.getAttribute("data-demo-ux-slice");
  const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
  const firstRow = document.querySelector('[data-demo-ux="users-row"]');
  const rowStyle = firstRow instanceof HTMLElement ? window.getComputedStyle(firstRow) : null;
  const usersListStyle = usersList instanceof HTMLElement ? window.getComputedStyle(usersList) : null;
  const tracked = [usersList, ...document.querySelectorAll("[data-shell-ux-nav]")]
    .filter((element) => element instanceof HTMLElement)
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        right: rect.right,
        width: rect.width,
      };
    });
  const viewportWidth = root.clientWidth;
  const cssApplied =
    usersListStyle?.display === "flex" &&
    rowStyle?.display === "grid" &&
    stylesheetLinks.includes("./smoke-production.css");
  const gridTemplateColumns = rowStyle?.gridTemplateColumns ?? "";
  const horizontalOverflow =
    root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
  const rightEdgeWithinViewport = tracked.every((rect) => rect.right <= viewportWidth + 1);
  const filtersDisabled = filterChips.every(
    (button) => button.disabled && button.getAttribute("aria-disabled") === "true",
  );
  const detailsDisabled = detailButtons.every(
    (button) => button.disabled && button.getAttribute("aria-disabled") === "true",
  );
  const resolvedColumnCount = gridTemplateColumns
    .trim()
    .split(/\s+/)
    .filter((track) => track.length > 0).length;
  const columnsMatch =
    expectedRowColumns === 1
      ? resolvedColumnCount === 1
      : resolvedColumnCount >= expectedRowColumns;
  return {
    pass:
      Boolean(usersList) &&
      (heading?.textContent ?? "").trim() === "利用者" &&
      (note?.textContent ?? "").includes("業務データには接続されていません") &&
      (summary?.textContent ?? "").includes("全8名") &&
      rows.length === 8 &&
      badges.length >= 8 &&
      filtersDisabled &&
      detailsDisabled &&
      Boolean(demo) &&
      Boolean(site) &&
      selectedNav?.getAttribute("aria-current") === "page" &&
      !placeholder &&
      !overview &&
      text.indexOf("Aさん") >= 0 &&
      text.indexOf("要確認") >= 0 &&
      text.indexOf("未記録") >= 0 &&
      text.indexOf("期限間近") >= 0 &&
      text.indexOf("利用可能です") < 0 &&
      slice === "DEMO-UX-2" &&
      cssApplied &&
      columnsMatch &&
      !horizontalOverflow &&
      rightEdgeWithinViewport,
    heading: heading?.textContent?.trim() ?? "",
    rowCount: rows.length,
    expectedRowColumns,
    stylesheetLinks,
    cssApplied,
    gridTemplateColumns,
    horizontalOverflow,
    rightEdgeWithinViewport,
  };
}

function assertOverviewDashboard() {
  const dashboard = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
  const usersList = document.querySelector('[data-demo-ux="users-list"]');
  const heading = document.querySelector('[data-dashboard-ux="overview-heading"]');
  const selectedNav = document.querySelector('[data-shell-ux-nav="overview"]');
  return {
    pass:
      Boolean(dashboard) &&
      !usersList &&
      (heading?.textContent ?? "").trim() === "概要" &&
      selectedNav?.getAttribute("aria-current") === "page",
    heading: heading?.textContent?.trim() ?? "",
  };
}

function assertRecordsPlaceholder() {
  const placeholder = document.querySelector('[data-shell-ux="destination-placeholder"]');
  const usersList = document.querySelector('[data-demo-ux="users-list"]');
  const heading = document.querySelector('[data-shell-ux="destination-heading"]');
  const selectedNav = document.querySelector('[data-shell-ux-nav="records"]');
  return {
    pass:
      Boolean(placeholder) &&
      placeholder?.getAttribute("data-shell-ux-destination") === "records" &&
      !usersList &&
      (heading?.textContent ?? "").trim() === "記録" &&
      selectedNav?.getAttribute("aria-current") === "page",
    heading: heading?.textContent?.trim() ?? "",
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
    "desktop-users-list",
    "viewMode=ready&siteSelection=SITE-ISG&destination=users",
    assertUsersList,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
    [3],
  )) && allPass;

allPass =
  (await smokeCase(
    "desktop-overview-unchanged",
    "viewMode=ready&siteSelection=SITE-ISG&destination=overview",
    assertOverviewDashboard,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
  )) && allPass;

allPass =
  (await smokeCase(
    "desktop-records-placeholder",
    "viewMode=ready&siteSelection=SITE-ISG&destination=records",
    assertRecordsPlaceholder,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
  )) && allPass;

allPass =
  (await smokeCase(
    "tablet-users-list",
    "viewMode=ready&siteSelection=SITE-HOM&destination=users",
    assertUsersList,
    { width: 768, height: 1024, deviceScaleFactor: 1 },
    [1],
  )) && allPass;

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.focus('[data-shell-ux-nav="overview"]');
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  const state = await page.evaluate(() => {
    const heading = document.activeElement;
    const usersList = document.querySelector('[data-demo-ux="users-list"]');
    const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
    const placeholder = document.querySelector('[data-shell-ux="destination-placeholder"]');
    const selected = document.querySelector('[data-shell-ux-nav-selected="true"]');
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const shellStyle = shell instanceof HTMLElement ? window.getComputedStyle(shell) : null;
    const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
      (link) => link.getAttribute("href") ?? "",
    );
    const root = document.documentElement;
    const body = document.body;
    return {
      activeText: heading?.textContent?.trim() ?? "",
      activeData: heading?.getAttribute("data-demo-ux") ?? "",
      selectedNav: selected?.getAttribute("data-shell-ux-nav") ?? "",
      usersListPresent: Boolean(usersList),
      overviewPresent: Boolean(overview),
      placeholderDest: placeholder?.getAttribute("data-shell-ux-destination") ?? "",
      cssApplied:
        shellStyle?.display === "flex" && stylesheetLinks.includes("./smoke-production.css"),
      horizontalOverflow:
        root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1,
    };
  });
  const keyboardPass =
    state.selectedNav === "users" &&
    state.activeData === "users-heading" &&
    state.activeText === "利用者" &&
    state.usersListPresent &&
    !state.overviewPresent &&
    !state.placeholderDest &&
    state.cssApplied &&
    !state.horizontalOverflow &&
    errors.length === 0;

  const shot = path.join(artifactsDir, "keyboard-overview-to-users.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-overview-to-users",
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
  unit: "DEMO-UX-2",
  kind: "browser smoke / users list presentation skeleton with production CSS",
  date: new Date().toISOString(),
  cssSource: {
    shellUxScssPath,
    dashboardUxScssPath,
    usersUxScssPath,
    productionCssPath,
    productionCssChecks,
  },
  sliceFlags: {
    id: "DEMO-UX-2",
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    adapterFetchAuthorized: false,
    authJudgmentAuthorized: false,
    liveUsersDataAuthorized: false,
    userDetailNavigationAuthorized: false,
    filterExecutionAuthorized: false,
  },
  allPass,
  checks,
};

fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

console.log(JSON.stringify({ allPass, artifactsDir, cases: checks.length, productionCssChecks }, null, 2));
process.exit(allPass ? 0 : 1);
