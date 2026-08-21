#!/usr/bin/env node
/**
 * DEMO-1 browser smoke — FIELD_STAFF synthetic entry checklist.
 * Mirrors DEMO_1_FIELD_STAFF_FIXTURE / ScaffoldShellWebPart entry.
 * Synthetic only — no SharePoint / Deploy / live I/O.
 *
 * Checklist:
 * 1. Overview
 * 2. Today Support
 * 3. Users
 * 4. User Detail
 * 5. Current Procedure
 * 6. Record Form
 * 7. Daily Records
 * 8. Tablet width
 * 9. Keyboard-only
 * 10. Network / Console
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.DEMO1_ARTIFACTS_DIR ?? "/opt/cursor/artifacts/demo-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.DEMO1_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.DEMO1_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.DEMO1_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs"
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
    "src/shell/procedure/AbcObservationPresentationUx.module.scss",
    "src/shell/procedure/ProcedureRecordCorrectionUx.module.scss",
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
  nodePaths: ["/tmp/node_modules", "/tmp/node_modules_demo1/node_modules"],
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
    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] ?? "text/plain",
    });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(4195, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4195";

const chromePath =
  process.env.DEMO1_CHROME_PATH ??
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
const networkHits = [];
const consoleErrors = [];

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
  const pageErrors = [];
  page.on("pageerror", (error) => {
    pageErrors.push(`pageerror: ${error.message}`);
    consoleErrors.push(`pageerror: ${error.message}`);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      if (text.includes("favicon") || text.includes("Failed to load resource")) {
        return;
      }
      pageErrors.push(`console: ${text}`);
      consoleErrors.push(`console: ${text}`);
    }
  });
  page.on("request", (request) => {
    const url = request.url();
    if (isSharePointOrGraphRequest(url)) {
      networkHits.push({ url, method: request.method() });
    }
  });
  if (viewport) {
    await page.setViewport(viewport);
  }
  await page.goto(`${base}/index.html?${query}`, { waitUntil: "networkidle0" });
  return { page, pageErrors };
}

async function screenshot(page, name) {
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  return shot;
}

async function tabUntil(page, predicate, maxTabs = 56) {
  for (let index = 0; index < maxTabs; index += 1) {
    const active = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        tag: el?.tagName ?? "",
        text: (el?.textContent ?? "").trim().slice(0, 80),
        kioskUx: el?.getAttribute("data-kiosk-ux") ?? "",
        nav: el?.getAttribute("data-shell-ux-nav") ?? "",
        field: el?.getAttribute("data-field-workflow") ?? "",
        users: el?.getAttribute("data-users-ux") ?? "",
      };
    });
    if (predicate(active)) {
      return { found: true, tabs: index, active };
    }
    await page.keyboard.press("Tab");
  }
  return { found: false, tabs: maxTabs, active: null };
}

const entryQuery =
  "viewMode=ready&siteSelection=SITE-ISG&destination=overview&presentationRole=FIELD_STAFF&saveState=unsaved";

// --- 1 Overview + 2 Today Support (desktop entry) ---
{
  const { page, pageErrors } = await openPage(entryQuery, {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  });
  const layout = await page.evaluate(() => {
    const root = document.documentElement;
    const demoRoot = document.querySelector('[data-demo-1="field-staff-entry"]');
    const dashboard = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
    const heading = document.querySelector('[data-dashboard-ux="overview-heading"]');
    const todayPrimary = document.querySelector('[data-kiosk-ux="today-support-primary"]');
    const list = document.querySelector('[data-kiosk-ux="today-support-list"]');
    const items = [...document.querySelectorAll('[data-kiosk-ux="today-support-item"]')];
    const firstSection = dashboard?.querySelector("section");
    const navLabels = [...document.querySelectorAll("[data-shell-ux-nav]")].map(
      (button) => button.textContent?.trim() ?? "",
    );
    return {
      demoRoot: Boolean(demoRoot),
      demoSite: demoRoot?.getAttribute("data-demo-1-site") ?? "",
      demoRole: demoRoot?.getAttribute("data-demo-1-role") ?? "",
      overviewPresent: Boolean(dashboard),
      overviewHeading: heading?.textContent?.trim() ?? "",
      todaySupportPrimary: Boolean(todayPrimary),
      todaySupportFirstSection: firstSection === todayPrimary,
      todaySupportHeading: todayPrimary?.querySelector("h2")?.textContent?.trim() ?? "",
      itemCount: items.length,
      listPresent: Boolean(list),
      navLabels,
      horizontalOverflow: root.scrollWidth > root.clientWidth,
    };
  });
  await screenshot(page, "01-overview-today-support");
  record("1-overview", layout.overviewPresent && /概要/.test(layout.overviewHeading), layout);
  record(
    "2-today-support",
    layout.todaySupportPrimary &&
      layout.todaySupportFirstSection &&
      layout.listPresent &&
      layout.itemCount > 0 &&
      /今日の支援/.test(layout.todaySupportHeading),
    layout,
  );
  record(
    "entry-fixture",
    layout.demoRoot && layout.demoSite === "SITE-ISG" && layout.demoRole === "FIELD_STAFF",
    layout,
  );
  record("desktop-no-overflow", layout.horizontalOverflow === false, layout);
  record("overview-page-errors", pageErrors.length === 0, { pageErrors });
  await page.close();
}

// --- 3 Users + 4 User Detail ---
{
  const { page, pageErrors } = await openPage(entryQuery, {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  });
  await page.click('[data-shell-ux-nav="users"]');
  await page.waitForSelector('[data-demo-ux="users-list"]', { timeout: 8000 });
  const usersState = await page.evaluate(() => {
    const heading = document.querySelector('[data-demo-ux="users-heading"]');
    const list = document.querySelector('[data-demo-ux="users-list"]');
    const rows = [...document.querySelectorAll('[data-demo-ux="users-row"]')];
    return {
      destination: document
        .querySelector("[data-shell-ux-nav][aria-current='page']")
        ?.getAttribute("data-shell-ux-nav"),
      heading: heading?.textContent?.trim() ?? "",
      listPresent: Boolean(list),
      rowCount: rows.length,
    };
  });
  await screenshot(page, "03-users");

  const openedDetail = await page.evaluate(() => {
    const preferred =
      document.querySelector(
        '[data-demo-ux-user-id="user-a"] [data-demo-ux="users-detail-button"]',
      ) ?? document.querySelector('[data-demo-ux="users-detail-button"]');
    if (preferred instanceof HTMLElement) {
      preferred.click();
      return preferred.textContent?.trim().slice(0, 60) ?? "clicked";
    }
    return "";
  });
  if (openedDetail) {
    await page.waitForSelector('[data-demo-ux="user-detail"]', { timeout: 8000 }).catch(() => undefined);
  }
  const detailState = await page.evaluate(() => {
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const heading = detail?.querySelector("h1, h2");
    return {
      detailPresent: Boolean(detail),
      heading: heading?.textContent?.trim() ?? "",
      bodySnippet: (detail?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 120),
    };
  });
  await screenshot(page, "04-user-detail");
  record(
    "3-users",
    usersState.destination === "users" && usersState.listPresent && usersState.rowCount > 0,
    usersState,
  );
  record("4-user-detail", detailState.detailPresent === true, { openedDetail, detailState });
  record("users-page-errors", pageErrors.length === 0, { pageErrors });
  await page.close();
}

// --- 5 Current Procedure + 6 Record Form ---
{
  const { page, pageErrors } = await openPage(entryQuery, {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  });
  await page.waitForSelector('[data-kiosk-ux="today-support-list"]', { timeout: 8000 });
  const openable = await page.$(
    '[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]',
  );
  if (openable) {
    await openable.click();
  } else {
    const any = await page.$('[data-kiosk-ux="tap-occurrence-button"]');
    if (any) await any.click();
  }
  await page.waitForSelector('[data-field-workflow="current-procedure"]', { timeout: 8000 });
  const procedure = await page.evaluate(() => {
    const root = document.querySelector('[data-field-workflow="current-procedure"]');
    const cta = document.querySelector('[data-field-workflow="record-procedure-cta"]');
    return {
      present: Boolean(root),
      status: root?.getAttribute("data-kiosk-occurrence-status") ?? "",
      canStart: root?.getAttribute("data-kiosk-can-start-record") ?? "",
      ctaPresent: Boolean(cta),
      ctaDisabled: cta instanceof HTMLButtonElement ? cta.disabled : null,
      heading: root?.querySelector("h1, h2")?.textContent?.trim() ?? "",
    };
  });
  await screenshot(page, "05-current-procedure");

  let form = { present: false };
  if (procedure.ctaPresent && procedure.ctaDisabled === false) {
    await page.click('[data-field-workflow="record-procedure-cta"]');
    await page.waitForSelector('[data-field-workflow="procedure-record-form"]', {
      timeout: 8000,
    });
    form = await page.evaluate(() => {
      const root = document.querySelector('[data-field-workflow="procedure-record-form"]');
      return {
        present: Boolean(root),
        heading: root?.querySelector("h1, h2")?.textContent?.trim() ?? "",
        saveDisabled:
          document.querySelector('[data-field-workflow="procedure-record-save"]') instanceof
          HTMLButtonElement
            ? document.querySelector('[data-field-workflow="procedure-record-save"]').disabled
            : null,
      };
    });
    await screenshot(page, "06-record-form");
  } else {
    // Still assert Current Procedure blocks Record Form when canStart=false.
    form = await page.evaluate(() => ({
      present: Boolean(document.querySelector('[data-field-workflow="procedure-record-form"]')),
      blockedByCanStart: true,
    }));
    await screenshot(page, "06-record-form-blocked");
  }

  record("5-current-procedure", procedure.present, procedure);
  record(
    "6-record-form",
    procedure.canStart === "true" ? form.present === true : form.present === false,
    { procedure, form },
  );
  record("procedure-page-errors", pageErrors.length === 0, { pageErrors });
  await page.close();
}

// --- 7 Daily Records ---
{
  const { page, pageErrors } = await openPage(entryQuery, {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  });
  await page.click('[data-shell-ux-nav="records"]');
  await page.waitForFunction(
    () => {
      const current = document
        .querySelector("[data-shell-ux-nav][aria-current='page']")
        ?.getAttribute("data-shell-ux-nav");
      return current === "records";
    },
    { timeout: 8000 },
  );
  const records = await page.evaluate(() => {
    const root = document.querySelector('[data-demo-ux="daily-records"]');
    const heading = document.querySelector('[data-demo-ux="daily-record-heading"]');
    return {
      destination: document
        .querySelector("[data-shell-ux-nav][aria-current='page']")
        ?.getAttribute("data-shell-ux-nav"),
      present: Boolean(root),
      heading: heading?.textContent?.trim() ?? "",
      bodySnippet: (root?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 160),
    };
  });
  await screenshot(page, "07-daily-records");
  record("7-daily-records", records.destination === "records" && records.present, records);
  record("records-page-errors", pageErrors.length === 0, { pageErrors });
  await page.close();
}

// --- 8 Tablet width (768) ---
{
  const { page, pageErrors } = await openPage(entryQuery, {
    width: 768,
    height: 1024,
    deviceScaleFactor: 1,
  });
  const tablet = await page.evaluate(() => {
    const root = document.documentElement;
    const todayPrimary = document.querySelector('[data-kiosk-ux="today-support-primary"]');
    const dashboard = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
    return {
      innerWidth: window.innerWidth,
      horizontalOverflow: root.scrollWidth > root.clientWidth,
      overviewPresent: Boolean(dashboard),
      todaySupportPrimary: Boolean(todayPrimary),
    };
  });
  await screenshot(page, "08-tablet-768");
  // Navigate users/records at tablet too.
  await page.click('[data-shell-ux-nav="users"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector("[data-shell-ux-nav][aria-current='page']")
        ?.getAttribute("data-shell-ux-nav") === "users",
    { timeout: 8000 },
  );
  const tabletUsersOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  await screenshot(page, "08-tablet-users");
  record(
    "8-tablet-width",
    tablet.innerWidth === 768 &&
      tablet.horizontalOverflow === false &&
      tabletUsersOverflow === false &&
      tablet.overviewPresent &&
      tablet.todaySupportPrimary,
    { tablet, tabletUsersOverflow },
  );
  record("tablet-page-errors", pageErrors.length === 0, { pageErrors });
  await page.close();
}

// --- 9 Keyboard-only ---
{
  const { page, pageErrors } = await openPage(entryQuery, {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
  });
  await page.waitForSelector('[data-kiosk-ux="today-support-list"]', { timeout: 8000 });
  const toOccurrence = await tabUntil(
    page,
    (active) => active.kioskUx === "tap-occurrence-button",
  );
  let keyboardPath = {
    toOccurrence,
    procedureOpened: false,
    formOpened: false,
    visibleFocus: false,
  };
  if (toOccurrence.found) {
    const focusBefore = await page.evaluate(() => {
      const el = document.activeElement;
      if (!(el instanceof HTMLElement)) return false;
      const style = window.getComputedStyle(el);
      return (
        (style.outlineStyle !== "none" && Number.parseFloat(style.outlineWidth) > 0) ||
        (style.boxShadow !== "none" && style.boxShadow.length > 0)
      );
    });
    await page.keyboard.press("Enter");
    await page.waitForSelector('[data-field-workflow="current-procedure"]', { timeout: 8000 });
    keyboardPath.procedureOpened = true;
    keyboardPath.visibleFocus = focusBefore;
    const toRecordCta = await tabUntil(
      page,
      (active) => active.field === "record-procedure-cta",
    );
    if (toRecordCta.found) {
      const ctaDisabled = await page.evaluate(() => {
        const cta = document.querySelector('[data-field-workflow="record-procedure-cta"]');
        return cta instanceof HTMLButtonElement ? cta.disabled : true;
      });
      if (!ctaDisabled) {
        await page.keyboard.press("Enter");
        await page.waitForSelector('[data-field-workflow="procedure-record-form"]', {
          timeout: 8000,
        });
        keyboardPath.formOpened = true;
      } else {
        // Disabled CTA is acceptable keyboard evidence when occurrence cannot start.
        keyboardPath.formOpened = false;
        keyboardPath.formBlocked = true;
      }
    }
    await screenshot(page, "09-keyboard-path");
  }
  // Destination traversal overview → users → records
  await page.goto(`${base}/index.html?${entryQuery}`, { waitUntil: "networkidle0" });
  const toUsersNav = await tabUntil(page, (active) => active.nav === "users");
  if (toUsersNav.found) {
    await page.keyboard.press("Enter");
  }
  const onUsers = await page.evaluate(
    () =>
      document
        .querySelector("[data-shell-ux-nav][aria-current='page']")
        ?.getAttribute("data-shell-ux-nav") === "users",
  );
  const toRecordsNav = await tabUntil(page, (active) => active.nav === "records");
  if (toRecordsNav.found) {
    await page.keyboard.press("Enter");
  }
  const onRecords = await page.evaluate(
    () =>
      document
        .querySelector("[data-shell-ux-nav][aria-current='page']")
        ?.getAttribute("data-shell-ux-nav") === "records",
  );
  await screenshot(page, "09-keyboard-nav");
  record(
    "9-keyboard-only",
    toOccurrence.found &&
      keyboardPath.procedureOpened &&
      toUsersNav.found &&
      onUsers &&
      toRecordsNav.found &&
      onRecords,
    { keyboardPath, toUsersNav, onUsers, toRecordsNav, onRecords },
  );
  record("keyboard-page-errors", pageErrors.length === 0, { pageErrors });
  await page.close();
}

// --- 10 Network / Console (aggregate) ---
record("10-network-no-sharepoint-graph", networkHits.length === 0, { networkHits });
record("10-console-no-errors", consoleErrors.length === 0, {
  consoleErrors: consoleErrors.slice(0, 20),
});

await browser.close();
server.close();

const report = {
  unit: "DEMO-1",
  kind: "browser review / synthetic FIELD_STAFF entry smoke",
  date: new Date().toISOString(),
  mainBasis: "3922dece1f8a76c09e385d7b786e08b375559215",
  fixture: "DEMO_1_FIELD_STAFF_FIXTURE",
  presentationOnly: true,
  liveTenantIoAuthorized: false,
  sharePointRestAuthorized: false,
  artifactsDir,
  checklist: [
    "1. Overview",
    "2. Today Support",
    "3. Users",
    "4. User Detail",
    "5. Current Procedure",
    "6. Record Form",
    "7. Daily Records",
    "8. Tablet width",
    "9. Keyboard-only",
    "10. Network / Console",
  ],
  checks,
  pass: checks.every((check) => check.pass),
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    {
      pass: report.pass,
      artifactsDir,
      checks: checks.length,
      failed: checks.filter((c) => !c.pass).map((c) => c.id),
    },
    null,
    2,
  ),
);
if (!report.pass) {
  process.exit(1);
}
