#!/usr/bin/env node
/**
 * DASHBOARD-UX-1 browser smoke runner (Chrome via puppeteer-core).
 * Scope: overview presentation skeleton with production SCSS/CSS applied.
 * No live overview data / auth judgment / adapter / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/dashboard-ux-1-browser-smoke";
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

/** Replace SPFx theme token strings with their declared CSS defaults. */
function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

function compileProductionCss() {
  const shellCss = normalizeSpfxThemeCss(compileScss(shellUxScssPath, { style: "expanded" }).css);
  const dashboardCss = normalizeSpfxThemeCss(
    compileScss(dashboardUxScssPath, { style: "expanded" }).css,
  );
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  return `${resetCss}\n${shellCss}\n${dashboardCss}`;
}

function cssRuleContains(css, selector, declarations) {
  const match = new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`, "s").exec(css);
  return Boolean(match) && declarations.every((declaration) => match[1].includes(declaration));
}

const productionCss = compileProductionCss();
const productionCssPath = path.join(outDir, "smoke-production.css");
fs.writeFileSync(productionCssPath, productionCss);

const productionCssChecks = {
  kpiGridDesktopColumns: cssRuleContains(productionCss, "kpiGrid", [
    "grid-template-columns: repeat(4, minmax(0, 1fr));",
  ]),
  kpiGridTabletColumns:
    productionCss.includes("@media (max-width: 768px)") &&
    /\.kpiGrid\s*\{[^}]*grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/s.test(
      productionCss,
    ),
  kpiGridNarrowColumns:
    productionCss.includes("@media (max-width: 480px)") &&
    productionCss.includes("grid-template-columns: 1fr;"),
  overviewDashboardWidthSafety: cssRuleContains(productionCss, "overviewDashboard", [
    "min-width: 0;",
    "max-width: 100%;",
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

await new Promise((resolve) => server.listen(4183, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4183";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

function assertOverviewDashboard(expectedColumns) {
  const root = document.documentElement;
  const body = document.body;
  const dashboard = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
  const heading = document.querySelector('[data-dashboard-ux="overview-heading"]');
  const note = document.querySelector('[data-dashboard-ux="overview-presentation-note"]');
  const kpiGrid = document.querySelector('[data-dashboard-ux="overview-kpi-grid"]');
  const kpiCards = document.querySelectorAll('[data-dashboard-ux="overview-kpi-card"]');
  const actionItems = document.querySelectorAll('[data-dashboard-ux="overview-action-item"]');
  const recentItems = document.querySelectorAll('[data-dashboard-ux="overview-recent-item"]');
  const actionButtons = [
    ...document.querySelectorAll('[data-dashboard-ux="overview-action-button"]'),
  ];
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const selectedNav = document.querySelector('[data-shell-ux-nav="overview"]');
  const placeholder = document.querySelector('[data-shell-ux="destination-placeholder"]');
  const text = document.body?.textContent ?? "";
  const slice = document
    .querySelector("[data-dashboard-ux-slice]")
    ?.getAttribute("data-dashboard-ux-slice");
  const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
  const kpiStyle = kpiGrid instanceof HTMLElement ? window.getComputedStyle(kpiGrid) : null;
  const dashboardStyle =
    dashboard instanceof HTMLElement ? window.getComputedStyle(dashboard) : null;
  const tracked = [dashboard, kpiGrid, ...document.querySelectorAll("[data-shell-ux-nav]")]
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
    kpiStyle?.display === "grid" &&
    dashboardStyle?.display === "flex" &&
    stylesheetLinks.includes("./smoke-production.css");
  const kpiGridTemplateColumns = kpiStyle?.gridTemplateColumns ?? "";
  const horizontalOverflow =
    root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
  const rightEdgeWithinViewport = tracked.every((rect) => rect.right <= viewportWidth + 1);
  const buttonsDisabled = actionButtons.every(
    (button) => button.disabled && button.getAttribute("aria-disabled") === "true",
  );
  const resolvedColumnCount = kpiGridTemplateColumns
    .trim()
    .split(/\s+/)
    .filter((track) => track.length > 0).length;
  const repeatMatch = /repeat\((\d+),/.exec(kpiGridTemplateColumns);
  const columnCount = repeatMatch ? Number(repeatMatch[1]) : resolvedColumnCount;
  const columnsMatch = columnCount === expectedColumns;
  return {
    pass:
      Boolean(dashboard) &&
      (heading?.textContent ?? "").trim() === "概要" &&
      (note?.textContent ?? "").includes("業務データには接続されていません") &&
      kpiCards.length === 4 &&
      actionItems.length === 3 &&
      recentItems.length === 2 &&
      buttonsDisabled &&
      Boolean(demo) &&
      Boolean(site) &&
      selectedNav?.getAttribute("aria-current") === "page" &&
      !placeholder &&
      text.indexOf("今日の支援状況") >= 0 &&
      text.indexOf("今日やること") >= 0 &&
      text.indexOf("最近の記録") >= 0 &&
      text.indexOf("利用可能です") < 0 &&
      slice === "DASHBOARD-UX-1" &&
      cssApplied &&
      columnsMatch &&
      !horizontalOverflow &&
      rightEdgeWithinViewport,
    heading: heading?.textContent?.trim() ?? "",
    kpiCount: kpiCards.length,
    expectedColumns,
    stylesheetLinks,
    cssApplied,
    kpiGridTemplateColumns,
    columnCount,
    horizontalOverflow,
    rightEdgeWithinViewport,
    layout: {
      innerWidth: window.innerWidth,
      devicePixelRatio: window.devicePixelRatio,
      documentClientWidth: root.clientWidth,
      documentScrollWidth: root.scrollWidth,
      bodyClientWidth: body.clientWidth,
      bodyScrollWidth: body.scrollWidth,
    },
  };
}

function assertUsersPlaceholder() {
  const root = document.documentElement;
  const body = document.body;
  const placeholder = document.querySelector('[data-shell-ux="destination-placeholder"]');
  const dashboard = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
  const heading = document.querySelector('[data-shell-ux="destination-heading"]');
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
  const stylesheetLinks = [...document.querySelectorAll('link[rel="stylesheet"]')].map(
    (link) => link.getAttribute("href") ?? "",
  );
  const shellStyle = shell instanceof HTMLElement ? window.getComputedStyle(shell) : null;
  const cssApplied =
    shellStyle?.display === "flex" && stylesheetLinks.includes("./smoke-production.css");
  const horizontalOverflow =
    root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1;
  return {
    pass:
      Boolean(placeholder) &&
      placeholder?.getAttribute("data-shell-ux-destination") === "users" &&
      (heading?.textContent ?? "").trim() === "利用者" &&
      !dashboard &&
      Boolean(demo) &&
      Boolean(site) &&
      cssApplied &&
      !horizontalOverflow,
    heading: heading?.textContent?.trim() ?? "",
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
    "desktop-overview-dashboard",
    "viewMode=ready&siteSelection=SITE-ISG&destination=overview",
    assertOverviewDashboard,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
    [4],
  )) && allPass;

allPass =
  (await smokeCase(
    "desktop-users-placeholder",
    "viewMode=ready&siteSelection=SITE-ISG&destination=users",
    assertUsersPlaceholder,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
  )) && allPass;

allPass =
  (await smokeCase(
    "tablet-overview-dashboard",
    "viewMode=ready&siteSelection=SITE-HOM&destination=overview",
    assertOverviewDashboard,
    { width: 768, height: 1024, deviceScaleFactor: 1 },
    [2],
  )) && allPass;

allPass =
  (await smokeCase(
    "desktop-200-percent-equivalent",
    "viewMode=ready&siteSelection=SITE-ISG&destination=overview",
    assertOverviewDashboard,
    { width: 640, height: 900, deviceScaleFactor: 2 },
    [2],
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
    const dashboard = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
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
      activeData: heading?.getAttribute("data-shell-ux") ?? "",
      selectedNav: selected?.getAttribute("data-shell-ux-nav") ?? "",
      dashboardPresent: Boolean(dashboard),
      placeholderDest: placeholder?.getAttribute("data-shell-ux-destination") ?? "",
      cssApplied:
        shellStyle?.display === "flex" && stylesheetLinks.includes("./smoke-production.css"),
      horizontalOverflow:
        root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1,
    };
  });
  const keyboardPass =
    state.selectedNav === "users" &&
    state.activeData === "destination-heading" &&
    state.activeText === "利用者" &&
    !state.dashboardPresent &&
    state.placeholderDest === "users" &&
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
  unit: "DASHBOARD-UX-1",
  kind: "browser smoke / overview presentation skeleton with production CSS",
  date: new Date().toISOString(),
  cssSource: {
    shellUxScssPath,
    dashboardUxScssPath,
    productionCssPath,
    productionCssChecks,
  },
  sliceFlags: {
    id: "DASHBOARD-UX-1",
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    adapterFetchAuthorized: false,
    authJudgmentAuthorized: false,
    liveOverviewDataAuthorized: false,
    kpiNavigationAuthorized: false,
    actionExecutionAuthorized: false,
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
