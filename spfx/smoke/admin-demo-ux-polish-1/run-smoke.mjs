#!/usr/bin/env node
/**
 * ADMIN-DEMO-UX-POLISH-1 browser smoke — unified demo acceptance.
 * Synthetic fixture only. No SharePoint / Deploy / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.ADUX_ARTIFACTS_DIR ?? "/opt/cursor/artifacts/admin-demo-ux-polish-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.ADUX_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.ADUX_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.ADUX_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs"
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ?? sassModule.default?.compile ?? (await import("sass")).compile;

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const scssPaths = [
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/dashboard/TodaySupportDayBoardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
  "src/shell/users/SupportPlanUx.module.scss",
  "src/shell/procedure/CurrentProcedureUx.module.scss",
  "src/shell/procedure/ProcedureRecordFormUx.module.scss",
  "src/shell/review/ReviewDueStateUx.module.scss",
];

function compileProductionCss() {
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  const compiled = scssPaths
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
        .map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(k)}`)
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

await new Promise((resolve) => server.listen(4194, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4194";

const liveWriteRequests = [];
const checks = [];
let allPass = true;

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

const FORBIDDEN_SUCCESS = ["保存成功", "本番保存済み", "記録完了", "SharePointへ保存済み"];

async function launchBrowser(viewport) {
  return puppeteer.launch({
    executablePath: process.env.ADUX_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
    headless: true,
    args: ["--no-sandbox", "--disable-gpu", `--window-size=${viewport.width},${viewport.height}`],
    defaultViewport: viewport,
  });
}

async function openPage(browser, query) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      if (
        text.includes("favicon") ||
        text.includes("404") ||
        text.includes("Failed to load resource")
      ) {
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
  await page.goto(`${base}/${query}`, { waitUntil: "networkidle0" });
  return { page, errors };
}

async function clickVisible(page, selector) {
  await page.waitForSelector(selector);
  const clicked = await page.$eval(selector, (el) => {
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (!(el instanceof HTMLElement) || el.getClientRects().length === 0) {
      return false;
    }
    el.click();
    return true;
  });
  if (!clicked) {
    throw new Error(`clickVisible: ${selector} was not an HTMLElement with a layout box`);
  }
}

function pushCheck(name, pass, found, shot, errors) {
  const ok = Boolean(pass) && (!errors || errors.length === 0);
  checks.push({ name, found, shot, pass: ok, pageErrors: errors ?? [] });
  allPass = allPass && ok;
}

const tablet = { width: 390, height: 844 };
const desktop = { width: 1280, height: 900 };

const fieldBrowser = await launchBrowser(tablet);
try {
  const { page, errors } = await openPage(
    fieldBrowser,
    "?viewMode=ready&siteSelection=SITE-ISG&destination=users&saveState=unsaved",
  );

  const initial = await page.evaluate(() => {
    const cta = document.querySelector('[data-field-staff="next-unrecorded-user"]');
    const banner = document.querySelector('[data-shell-ux="demo-banner"]');
    const roleEntry = document.querySelector('[data-shell-ux="demo-presentation-role-entry"]');
    const note = document.querySelector('[data-field-staff="demo-hold-unrecorded-note"]');
    const chrome = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const unrecorded = [...document.querySelectorAll('[data-demo-ux-status="unrecorded"]')].map(
      (el) => el.textContent?.trim() ?? "",
    );
    return {
      ctaLabel: cta?.textContent?.trim() ?? "",
      ctaUserId: cta?.getAttribute("data-field-staff-next-unrecorded-user-id") ?? "",
      ctaDisabled: cta instanceof HTMLButtonElement ? cta.disabled : true,
      banner: banner?.textContent?.trim() ?? "",
      hasRoleEntry: Boolean(roleEntry),
      note: note?.textContent?.trim() ?? "",
      role: chrome?.getAttribute("data-shell-ux-presentation-role") ?? "",
      unrecordedCount: unrecorded.length,
      text: document.body?.textContent ?? "",
    };
  });
  const initialPass =
    initial.ctaUserId === "user-a" &&
    initial.ctaLabel.includes("Aさん") &&
    initial.ctaDisabled === false &&
    initial.banner.includes("DEMO") &&
    initial.hasRoleEntry &&
    initial.note.includes("デモでは保存しない") &&
    initial.role === "FIELD_STAFF" &&
    initial.unrecordedCount === 2 &&
    FORBIDDEN_SUCCESS.every((token) => initial.text.indexOf(token) < 0);
  const initialShot = path.join(artifactsDir, "a-field-staff-initial-list-390.png");
  await page.screenshot({ path: initialShot, fullPage: true });
  pushCheck("A-initial-list-next-unrecorded", initialPass, initial, initialShot, errors);

  await clickVisible(page, '[data-field-staff="next-unrecorded-user"]');
  await page.waitForSelector('[data-demo-ux="user-detail"]');
  await clickVisible(page, '[data-field-workflow="open-current-procedure"]');
  await page.waitForSelector('[data-field-workflow="current-procedure"]');
  const procedure = await page.evaluate(() => {
    const el = document.querySelector('[data-field-workflow="current-procedure"]');
    return {
      planVersion: el?.getAttribute("data-field-workflow-plan-version") ?? "",
      procedureId: el?.getAttribute("data-field-workflow-procedure-id") ?? "",
    };
  });
  pushCheck(
    "A-current-support-procedure",
    procedure.planVersion === "3" && procedure.procedureId === "synthetic-procedure-p3",
    procedure,
    path.join(artifactsDir, "a-current-procedure-390.png"),
    errors,
  );
  await page.screenshot({
    path: path.join(artifactsDir, "a-current-procedure-390.png"),
    fullPage: true,
  });

  await clickVisible(page, '[data-field-workflow="record-procedure-cta"]');
  await page.waitForSelector('[data-field-workflow="procedure-record-form"]');
  await clickVisible(
    page,
    '[data-field-workflow-result="PERFORMED_WITH_ADAPTATION"] input[type="radio"]',
  );
  await clickVisible(page, '[data-field-workflow="procedure-record-save"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-field-workflow="procedure-record-form"]')
        ?.getAttribute("data-field-workflow-save-state") === "save_failed",
  );
  const saveFeedback = await page.evaluate(() => {
    const form = document.querySelector('[data-field-workflow="procedure-record-form"]');
    const status = document.querySelector('[data-field-workflow="save-status"]');
    const text = `${status?.textContent ?? ""}\n${form?.textContent ?? ""}`;
    return {
      saveState: form?.getAttribute("data-field-workflow-save-state") ?? "",
      hold: form?.getAttribute("data-field-workflow-demo-save-hold") ?? "",
      text,
      hasDemoHold: text.includes("デモでは保存しません"),
      hasConfirm: text.includes("入力内容の確認まで行えます"),
      hasNotWritten: text.includes("書き込まれていません"),
    };
  });
  const savePass =
    saveFeedback.saveState === "save_failed" &&
    saveFeedback.hold === "true" &&
    saveFeedback.hasDemoHold &&
    saveFeedback.hasConfirm &&
    saveFeedback.hasNotWritten &&
    FORBIDDEN_SUCCESS.every((token) => saveFeedback.text.indexOf(token) < 0);
  const saveShot = path.join(artifactsDir, "a-demo-save-hold-390.png");
  await page.screenshot({ path: saveShot, fullPage: true });
  pushCheck("A-demo-save-non-persistent", savePass, saveFeedback, saveShot, errors);

  await clickVisible(page, '[data-shell-ux-nav="users"]');
  await page.waitForSelector('[data-demo-ux="users-list"]');
  const returned = await page.evaluate(() => {
    const rowA = document.querySelector('[data-demo-ux-user-id="user-a"]');
    const unrecorded = [...document.querySelectorAll('[data-demo-ux-status="unrecorded"]')].map(
      (el) => el.textContent?.trim() ?? "",
    );
    const recordedToday = [
      ...document.querySelectorAll('[data-field-staff-synthetic-recorded-for-today="true"]'),
    ].map((el) => el.textContent?.trim() ?? "");
    const note = document.querySelector('[data-field-staff="demo-hold-unrecorded-note"]');
    const next = document.querySelector('[data-field-staff="next-unrecorded-user"]');
    const text = document.body?.textContent ?? "";
    return {
      aUnrecorded: Boolean(rowA?.querySelector('[data-demo-ux-status="unrecorded"]')),
      unrecordedCount: unrecorded.length,
      aRecordedToday: recordedToday.some((label) => (rowA?.textContent ?? "").includes(label)),
      recordedTodayOnA: (rowA?.textContent ?? "").includes("本日記録した"),
      note: note?.textContent?.trim() ?? "",
      nextUserId: next?.getAttribute("data-field-staff-next-unrecorded-user-id") ?? "",
      nextLabel: next?.textContent?.trim() ?? "",
      textHasSuccess: ["保存成功", "本番保存済み", "記録完了"].some((token) =>
        text.includes(token),
      ),
    };
  });
  const returnPass =
    returned.aUnrecorded &&
    returned.unrecordedCount === 2 &&
    returned.recordedTodayOnA === false &&
    returned.note.includes("未記録") &&
    returned.nextUserId === "user-e" &&
    returned.textHasSuccess === false;
  const returnShot = path.join(artifactsDir, "a-return-list-unrecorded-390.png");
  await page.screenshot({ path: returnShot, fullPage: true });
  pushCheck("A-return-list-semantically-consistent", returnPass, returned, returnShot, errors);

  const overflow = await page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const banner = document.querySelector('[data-shell-ux="demo-banner"]');
    const cta = document.querySelector('[data-field-staff="next-unrecorded-user"]');
    const ctaBox = cta instanceof HTMLElement ? cta.getBoundingClientRect() : null;
    return {
      horizontalOverflow:
        root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1,
      bannerVisible: banner instanceof HTMLElement && banner.getClientRects().length > 0,
      ctaUsable:
        cta instanceof HTMLButtonElement &&
        !cta.disabled &&
        Boolean(ctaBox) &&
        ctaBox.width > 0 &&
        ctaBox.height >= 40,
    };
  });
  const overflowShot = path.join(artifactsDir, "f-tablet-390-no-overflow.png");
  await page.screenshot({ path: overflowShot, fullPage: true });
  pushCheck(
    "F-tablet-390-visual",
    !overflow.horizontalOverflow && overflow.bannerVisible && overflow.ctaUsable,
    overflow,
    overflowShot,
    errors,
  );

  await clickVisible(page, '[data-field-staff="next-unrecorded-user"]');
  const nextReached = await page.evaluate(() => {
    const focused = document.activeElement;
    const row = focused?.closest?.("[data-demo-ux-user-id]");
    return {
      userId: row?.getAttribute("data-demo-ux-user-id") ?? "",
      unrecordedCount: document.querySelectorAll('[data-demo-ux-status="unrecorded"]').length,
    };
  });
  pushCheck(
    "B-next-actionable-user-no-kpi-mutation",
    nextReached.userId === "user-e" && nextReached.unrecordedCount === 2,
    nextReached,
    path.join(artifactsDir, "b-next-unrecorded-e.png"),
    errors,
  );
  await page.screenshot({
    path: path.join(artifactsDir, "b-next-unrecorded-e.png"),
    fullPage: true,
  });

  await page.close();
} finally {
  await fieldBrowser.close();
}

const pcBrowser = await launchBrowser(desktop);
try {
  const { page, errors } = await openPage(
    pcBrowser,
    "?viewMode=ready&siteSelection=SITE-ISG&destination=users&saveState=unsaved",
  );

  const roleBefore = await page.$eval('[data-shell-ux="app-shell-chrome"]', (el) =>
    el.getAttribute("data-shell-ux-presentation-role"),
  );
  await clickVisible(page, '[data-shell-ux-demo-role="PLANNER"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-presentation-role") === "PLANNER",
  );
  await clickVisible(page, '[data-demo-ux-detail-preview="true"]');
  await page.waitForSelector('[data-demo-ux="user-detail"]');
  await clickVisible(page, '[data-demo-ux="user-detail-open-plan"]');
  await page.waitForSelector('[data-demo-ux="support-plan"]');
  const plannerPlan = await page.evaluate(() => {
    const status = document.querySelector('[data-planning-pc="status"]');
    const nextConcept = document.querySelector('[data-review-new-version="next-version-concept"]');
    const createCta = document.querySelector('[data-review-new-version="create-cta"]');
    const text = document.body?.textContent ?? "";
    const role = document
      .querySelector('[data-shell-ux="app-shell-chrome"]')
      ?.getAttribute("data-shell-ux-presentation-role");
    return {
      status: status?.textContent?.trim() ?? "",
      hasNextConcept: Boolean(nextConcept),
      createDisabled: createCta instanceof HTMLButtonElement ? createCta.disabled : false,
      hasV2Record:
        text.includes("計画版 2") || text.includes("planVersion") || text.includes("版 2"),
      textHasV2: text.includes("2"),
      role,
      roleBeforeOk: true,
    };
  });
  const plannerShot = path.join(artifactsDir, "c-planner-entry-no-url.png");
  await page.screenshot({ path: plannerShot, fullPage: true });
  pushCheck(
    "C-planner-entry-discoverable",
    roleBefore === "FIELD_STAFF" &&
      plannerPlan.role === "PLANNER" &&
      plannerPlan.status === "適用中" &&
      plannerPlan.hasNextConcept &&
      plannerPlan.createDisabled,
    { roleBefore, ...plannerPlan },
    plannerShot,
    errors,
  );

  await page.click('[data-planning-pc-version="2"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-review-new-version="version-compare"]')),
  );
  const compare = await page.evaluate(() => {
    const past = document.querySelector('[data-review-new-version="compare-past"]');
    const current = document.querySelector('[data-review-new-version="compare-current"]');
    const text = document.body?.textContent ?? "";
    return {
      pastHasV2: (past?.textContent ?? "").includes("synthetic v2 method"),
      currentHasV3: (current?.textContent ?? "").includes("写真カード"),
      historicalOn2: text.includes("計画版 2") || text.includes("版 2"),
    };
  });
  const compareShot = path.join(artifactsDir, "c-planner-v2-compare.png");
  await page.screenshot({ path: compareShot, fullPage: true });
  pushCheck(
    "C-support-plan-v3-active-v2-historical",
    compare.pastHasV2 && compare.currentHasV3,
    compare,
    compareShot,
    errors,
  );

  await clickVisible(page, '[data-planning-pc="review-cta"]');
  await page.waitForSelector('[data-review-new-version="from-review-cta"]');
  await clickVisible(page, '[data-review-new-version="from-review-cta"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-review-new-version="next-version-concept"]')
        ?.getAttribute("data-review-new-version-highlighted") === "true",
  );
  await clickVisible(page, '[data-shell-ux-nav="overview"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-destination") === "overview",
  );
  await clickVisible(page, '[data-shell-ux-nav="users"]');
  await page.waitForSelector('[data-demo-ux="users-list"]');
  await clickVisible(page, '[data-demo-ux-detail-preview="true"]');
  await page.waitForSelector('[data-demo-ux="user-detail"]');
  await clickVisible(page, '[data-demo-ux="user-detail-open-plan"]');
  await page.waitForSelector('[data-demo-ux="support-plan"]');
  const highlightGone = await page.evaluate(() => {
    const concept = document.querySelector('[data-review-new-version="next-version-concept"]');
    const chrome = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    return {
      highlighted: concept?.getAttribute("data-review-new-version-highlighted") ?? "",
      fromReview: chrome?.getAttribute("data-review-new-version-from-review") ?? "",
    };
  });
  const highlightShot = path.join(artifactsDir, "d-highlight-cleared-after-leave-users.png");
  await page.screenshot({ path: highlightShot, fullPage: true });
  pushCheck(
    "D-highlight-cleared-after-leave-users",
    highlightGone.highlighted === "false" && highlightGone.fromReview === "false",
    highlightGone,
    highlightShot,
    errors,
  );

  await clickVisible(page, '[data-shell-ux-nav="users"]');
  await page.waitForSelector('[data-demo-ux="users-list"]');
  await clickVisible(page, '[data-shell-ux-demo-role="ADMIN_AUDIT"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-presentation-role") === "ADMIN_AUDIT",
  );
  await clickVisible(page, '[data-demo-ux-detail-preview="true"]');
  await page.waitForSelector('[data-demo-ux="user-detail"]');
  await clickVisible(page, '[data-demo-ux="user-detail-open-plan"]');
  await page.waitForSelector('[data-demo-ux="support-plan"]');
  const admin = await page.evaluate(() => {
    const createCta = document.querySelector('[data-review-new-version="create-cta"]');
    const mutationButtons = [
      ...document.querySelectorAll('[data-demo-ux="support-plan-mutation-button"]'),
    ];
    const readNote = document.querySelector('[data-demo-ux="support-plan-admin-read-note"]');
    const enabledMutation = mutationButtons.filter(
      (el) => el instanceof HTMLButtonElement && !el.disabled,
    );
    return {
      hasCreateCta: Boolean(createCta),
      enabledMutationCount: enabledMutation.length,
      readNote: readNote?.textContent?.trim() ?? "",
    };
  });
  const adminShot = path.join(artifactsDir, "e-admin-audit-read-only.png");
  await page.screenshot({ path: adminShot, fullPage: true });
  pushCheck(
    "E-admin-audit-read-oriented",
    !admin.hasCreateCta && admin.enabledMutationCount === 0 && admin.readNote.length > 0,
    admin,
    adminShot,
    errors,
  );

  await page.close();
} finally {
  await pcBrowser.close();
}

const noLive = liveWriteRequests.length === 0;
pushCheck("no-sharepoint-requests", noLive, { liveWriteRequests }, "", []);

const report = {
  slice: "ADMIN-DEMO-UX-POLISH-1",
  kind: "browser smoke / unified admin demo UX polish",
  date: new Date().toISOString(),
  viewports: { fieldStaff: tablet, plannerAdmin: desktop },
  allPass,
  checks,
  liveWriteRequests,
};

fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

server.close();
console.log(JSON.stringify({ allPass, artifactsDir, cases: checks.length }, null, 2));
process.exit(allPass ? 0 : 1);
