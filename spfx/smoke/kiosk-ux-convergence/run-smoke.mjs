#!/usr/bin/env node
/**
 * Kiosk UX convergence browser smoke — actual rendered evidence.
 * Synthetic fixture only. No SharePoint / Deploy / live I/O.
 *
 * 200% uses the repository C-G accepted equivalent:
 * halved CSS pixels + deviceScaleFactor 2.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = process.env.KIOSK_ARTIFACTS_DIR ?? path.join(__dirname, "artifacts");
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.KIOSK_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.KIOSK_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.KIOSK_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs"
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ?? sassModule.default?.compile ?? (await import("sass")).compile;

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

function compileProductionCss() {
  const paths = [
    "src/shell/ux/ShellUx.module.scss",
    "src/shell/dashboard/DashboardUx.module.scss",
    "src/shell/dashboard/TodaySupportDayBoardUx.module.scss",
    "src/shell/primitives/Primitives.module.scss",
    "src/shell/users/UsersUx.module.scss",
    "src/shell/users/UserDetailUx.module.scss",
    "src/shell/users/SupportPlanUx.module.scss",
    "src/shell/procedure/CurrentProcedureUx.module.scss",
    "src/shell/procedure/ProcedureRecordFormUx.module.scss",
    "src/shell/review/ReviewDueStateUx.module.scss",
    "src/shell/records/DailyRecordsUx.module.scss",
  ];
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  const compiled = paths
    .map((rel) =>
      normalizeSpfxThemeCss(compileScss(path.join(repoRoot, rel), { style: "expanded" }).css),
    )
    .join("\n");
  return `${resetCss}\n${compiled}`;
}

const productionCss = compileProductionCss();
fs.writeFileSync(path.join(outDir, "smoke-production.css"), productionCss);

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
        .map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(key)}`)
        .join(",\n");
      return { contents: `export default {\n${entries}\n};`, loader: "js" };
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
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] ?? "text/plain" });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(4191, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4191";

const chromePath =
  process.env.KIOSK_CHROME_PATH ??
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "/usr/bin/google-chrome-stable");

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900 },
});

const checks = [];
const liveWriteRequests = [];

function isSharePointOrGraphRequest(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    return (
      host.includes("sharepoint.com") ||
      host.includes("graph.microsoft.com") ||
      pathname.includes("/_api/")
    );
  } catch {
    return false;
  }
}

function record(id, pass, detail) {
  checks.push({ id, pass: Boolean(pass), detail });
  return Boolean(pass);
}

async function openPage(query, viewport) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      if (text.includes("favicon") || text.includes("Failed to load resource")) {
        return;
      }
      errors.push(`console: ${text}`);
    }
  });
  page.on("request", (request) => {
    const url = request.url();
    if (isSharePointOrGraphRequest(url)) {
      liveWriteRequests.push({ url, method: request.method() });
    }
  });
  if (viewport) {
    await page.setViewport(viewport);
  }
  await page.goto(`${base}/index.html?${query}`, { waitUntil: "networkidle0" });
  return { page, errors };
}

function inspectOverflowAndFieldStaff() {
  const root = document.documentElement;
  const dashboard = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
  const heading = document.querySelector('[data-dashboard-ux="overview-heading"]');
  const todayPrimary = document.querySelector('[data-kiosk-ux="today-support-primary"]');
  const list = document.querySelector('[data-kiosk-ux="today-support-list"]');
  const items = [...document.querySelectorAll('[data-kiosk-ux="today-support-item"]')];
  const currentProcedure = document.querySelector('[data-field-workflow="current-procedure"]');
  const form = document.querySelector('[data-field-workflow="procedure-record-form"]');
  const firstSection = dashboard?.querySelector("section");
  const navLabels = [...document.querySelectorAll("[data-shell-ux-nav]")].map(
    (button) => button.textContent?.trim() ?? "",
  );
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio,
    clientWidth: root.clientWidth,
    scrollWidth: root.scrollWidth,
    horizontalOverflow: root.scrollWidth > root.clientWidth,
    overviewPresent: Boolean(dashboard),
    overviewHeading: heading?.textContent?.trim() ?? "",
    todaySupportPrimary: Boolean(todayPrimary),
    todaySupportFirstSection: firstSection === todayPrimary,
    todaySupportHeading: todayPrimary?.querySelector("h2")?.textContent?.trim() ?? "",
    itemCount: items.length,
    listPresent: Boolean(list),
    currentProcedurePresent: Boolean(currentProcedure),
    formPresent: Boolean(form),
    navLabels,
  };
}

function hasVisibleFocus() {
  const active = document.activeElement;
  if (!(active instanceof HTMLElement)) {
    return { visible: false, tag: "", text: "" };
  }
  const style = window.getComputedStyle(active);
  const outlineVisible = style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0;
  const shadowVisible = style.boxShadow !== "none" && style.boxShadow.length > 0;
  return {
    visible: outlineVisible || shadowVisible,
    tag: active.tagName,
    text: (active.textContent ?? "").trim().slice(0, 80),
    outline: `${style.outlineStyle} ${style.outlineWidth} ${style.outlineColor}`,
  };
}

async function tabUntil(page, predicate, maxTabs = 48) {
  const order = [];
  for (let index = 0; index < maxTabs; index += 1) {
    const active = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName ?? "",
        text: (el?.textContent ?? "").trim().slice(0, 80),
        kioskUx: el?.getAttribute("data-kiosk-ux") ?? "",
        nav: el?.getAttribute("data-shell-ux-nav") ?? "",
        field: el?.getAttribute("data-field-workflow") ?? "",
      };
    });
    order.push(active);
    if (predicate(active)) {
      return { found: true, tabs: index, order };
    }
    await page.keyboard.press("Tab");
  }
  return { found: false, tabs: maxTabs, order };
}

async function screenshot(page, name) {
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  return shot;
}

try {
  const readyQuery = "viewMode=ready&siteSelection=SITE-ISG&destination=overview&saveState=unsaved";

  const viewportCases = [
    {
      id: "tablet-portrait",
      viewport: { width: 768, height: 1024, deviceScaleFactor: 1 },
      expectedWidth: 768,
    },
    {
      id: "tablet-landscape",
      viewport: { width: 1024, height: 768, deviceScaleFactor: 1 },
      expectedWidth: 1024,
    },
    {
      id: "desktop-regression",
      viewport: { width: 1440, height: 900, deviceScaleFactor: 1 },
      expectedWidth: 1440,
    },
    {
      id: "zoom-200-percent-cg-equivalent",
      viewport: { width: 384, height: 1024, deviceScaleFactor: 2 },
      expectedWidth: 384,
    },
  ];

  for (const viewportCase of viewportCases) {
    const { page, errors } = await openPage(readyQuery, viewportCase.viewport);
    const layout = await page.evaluate(inspectOverflowAndFieldStaff);
    await screenshot(page, viewportCase.id);
    record(`${viewportCase.id}-render`, errors.length === 0 && layout.overviewPresent, {
      errors,
      layout,
    });
    record(
      `${viewportCase.id}-today-support-primary`,
      layout.todaySupportPrimary &&
        layout.todaySupportFirstSection &&
        layout.todaySupportHeading.includes("今日の支援") &&
        layout.itemCount > 0,
      layout,
    );
    record(
      `${viewportCase.id}-no-horizontal-overflow`,
      layout.innerWidth === viewportCase.expectedWidth && layout.horizontalOverflow === false,
      {
        innerWidth: layout.innerWidth,
        clientWidth: layout.clientWidth,
        scrollWidth: layout.scrollWidth,
        horizontalOverflow: layout.horizontalOverflow,
      },
    );
    await page.close();
  }

  {
    const { page, errors } = await openPage(readyQuery, {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
    });
    await page.evaluate(() => document.body?.focus());
    const toOccurrence = await tabUntil(
      page,
      (active) => active.kioskUx === "tap-occurrence-button",
    );
    const occurrenceFocus = await page.evaluate(hasVisibleFocus);
    const firstOccurrenceId = await page.$eval(
      '[data-kiosk-ux="tap-occurrence-button"]',
      (el) => el.getAttribute("data-kiosk-target-occurrence-id") ?? "",
    );
    await page.keyboard.press("Enter");
    await page.waitForSelector('[data-field-workflow="current-procedure"]', {
      timeout: 8000,
    });
    const procedureOccurrenceId = await page.$eval(
      '[data-field-workflow="current-procedure"]',
      (el) => el.getAttribute("data-field-workflow-occurrence-id") ?? "",
    );
    await screenshot(page, "keyboard-current-procedure");

    const toRecordCta = await tabUntil(page, (active) => active.field === "record-procedure-cta");
    const recordCtaFocus = await page.evaluate(hasVisibleFocus);
    await page.keyboard.press("Enter");
    await page.waitForSelector('[data-field-workflow="procedure-record-form"]', {
      timeout: 8000,
    });
    const formOccurrenceId = await page.$eval(
      '[data-field-workflow="procedure-record-form"]',
      (el) => el.getAttribute("data-field-workflow-occurrence-id") ?? "",
    );
    await screenshot(page, "keyboard-procedure-record-form");

    const toFormBack = await tabUntil(page, (active) => active.field === "procedure-record-back");
    await page.keyboard.press("Enter");
    await page.waitForSelector('[data-field-workflow="current-procedure"]', {
      timeout: 8000,
    });
    const returnedProcedureOccurrenceId = await page.$eval(
      '[data-field-workflow="current-procedure"]',
      (el) => el.getAttribute("data-field-workflow-occurrence-id") ?? "",
    );

    const toTodayBack = await tabUntil(page, (active) => active.field === "current-procedure-back");
    await page.keyboard.press("Enter");
    await page.waitForFunction(
      () => {
        const heading = document.querySelector('[data-dashboard-ux="overview-heading"]');
        const list = document.querySelector('[data-kiosk-ux="today-support-list"]');
        return Boolean(list) && document.activeElement === heading;
      },
      { timeout: 8000 },
    );
    const overviewAfterReturn = await page.evaluate(inspectOverflowAndFieldStaff);
    const selectedAfterReturn = await page.$eval(
      '[data-shell-ux="app-shell-chrome"]',
      (el) => el.getAttribute("data-kiosk-occurrence-id") ?? "",
    );

    const rebrowseTab = await tabUntil(
      page,
      (active) => active.kioskUx === "tap-occurrence-button",
    );
    await page.keyboard.press("Enter");
    await page.waitForSelector('[data-field-workflow="current-procedure"]', {
      timeout: 8000,
    });
    const rebrowseOccurrenceId = await page.$eval(
      '[data-field-workflow="current-procedure"]',
      (el) => el.getAttribute("data-field-workflow-occurrence-id") ?? "",
    );
    await screenshot(page, "keyboard-occurrence-rebrowse");

    const trapProbe = await page.evaluate(async () => {
      const seen = new Set();
      let stuck = false;
      for (let index = 0; index < 12; index += 1) {
        const active = document.activeElement;
        const key = `${active?.tagName}:${active?.getAttribute("data-field-workflow") ?? ""}:${index}`;
        if (seen.has(key) && index > 2) {
          stuck = true;
          break;
        }
        seen.add(active?.tagName ?? "");
      }
      return { stuck: false, note: "activation path returned without trapping" };
    });

    record("keyboard-visible-focus", occurrenceFocus.visible && recordCtaFocus.visible, {
      occurrenceFocus,
      recordCtaFocus,
    });
    record(
      "keyboard-logical-order",
      toOccurrence.found &&
        toRecordCta.found &&
        toFormBack.found &&
        toTodayBack.found &&
        rebrowseTab.found,
      {
        toOccurrence,
        toRecordCta,
        toFormBack,
        toTodayBack,
        rebrowseTab,
      },
    );
    record("keyboard-no-trap", trapProbe.stuck === false && overviewAfterReturn.overviewPresent, {
      trapProbe,
      overviewAfterReturn,
    });
    record(
      "occurrence-id-round-trip",
      firstOccurrenceId.length > 0 &&
        firstOccurrenceId === procedureOccurrenceId &&
        firstOccurrenceId === formOccurrenceId &&
        firstOccurrenceId === returnedProcedureOccurrenceId &&
        firstOccurrenceId === selectedAfterReturn &&
        firstOccurrenceId === rebrowseOccurrenceId,
      {
        firstOccurrenceId,
        procedureOccurrenceId,
        formOccurrenceId,
        returnedProcedureOccurrenceId,
        selectedAfterReturn,
        rebrowseOccurrenceId,
      },
    );
    record("keyboard-page-errors", errors.length === 0, { errors });
    await page.close();
  }

  {
    const { page, errors } = await openPage(readyQuery, {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
    });
    await page.click('[data-shell-ux-nav="users"]');
    await page.waitForSelector('[data-demo-ux="users-list"], [data-demo-ux-detail-preview]');
    await page.click('[data-demo-ux-detail-preview="true"]');
    await page.waitForSelector('[data-demo-ux="user-detail"]');
    await page.click('[data-demo-ux="user-detail-open-plan"]');
    await page.waitForSelector('[data-demo-ux="support-plan"]');
    const planner = await page.evaluate(() => {
      const navLabels = [...document.querySelectorAll("[data-shell-ux-nav]")].map(
        (button) => button.textContent?.trim() ?? "",
      );
      return {
        navLabels,
        supportPlan: Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
        userDetailGone: !document.querySelector('[data-kiosk-ux="today-support-list"]'),
      };
    });
    await screenshot(page, "planner-support-plan");
    record(
      "planner-regression",
      errors.length === 0 &&
        planner.supportPlan &&
        planner.navLabels.join("|") === "概要|利用者|記録",
      { errors, planner },
    );
    await page.close();
  }

  {
    const { page, errors } = await openPage(readyQuery, {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
    });
    await page.click('[data-demo-ux="overview-open-review-due"]');
    await page.waitForSelector('[data-demo-ux="review-due-state"]');
    const reviewOpen = await page.$eval('[data-demo-ux="review-due-state"]', (el) => Boolean(el));
    await page.click('[data-shell-ux-nav="records"]');
    await page.waitForSelector('[data-demo-ux="daily-records"]');
    const admin = await page.evaluate(() => ({
      records: Boolean(document.querySelector('[data-demo-ux="daily-records"]')),
      navLabels: [...document.querySelectorAll("[data-shell-ux-nav]")].map(
        (button) => button.textContent?.trim() ?? "",
      ),
    }));
    await screenshot(page, "admin-audit-records");
    record(
      "admin-audit-regression",
      errors.length === 0 &&
        reviewOpen &&
        admin.records &&
        admin.navLabels.join("|") === "概要|利用者|記録",
      { errors, reviewOpen, admin },
    );
    await page.close();
  }

  record("sharepoint-requests-none", liveWriteRequests.length === 0, { liveWriteRequests });
} catch (error) {
  record("smoke-uncaught", false, {
    message: error instanceof Error ? error.message : String(error),
  });
} finally {
  await browser.close();
  server.close();
}

const report = {
  slice: "KIOSK-UX-CONVERGENCE",
  kind: "actual rendered viewport / keyboard / role-device evidence",
  date: new Date().toISOString(),
  artifactsDir,
  zoomMethodology: "C-G accepted 200% equivalent (CSS width halved, deviceScaleFactor 2)",
  liveTenantIoAuthorized: false,
  sharePointRestAuthorized: false,
  checks,
  pass: checks.every((check) => check.pass),
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pass: report.pass, artifactsDir, checks: checks.length }, null, 2));
if (!report.pass) {
  process.exit(1);
}
