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
});

function auditCorrectionSaveWiringSourceMarkers() {
  const correctionTsx = fs.readFileSync(
    path.join(repoRoot, "src/shell/procedure/ProcedureRecordCorrection.tsx"),
    "utf8",
  );
  const procedureCorrectionTs = fs.readFileSync(
    path.join(repoRoot, "src/shell/procedure/procedure-correction.ts"),
    "utf8",
  );
  const procedureCopyTs = fs.readFileSync(
    path.join(repoRoot, "src/shell/procedure/procedure-copy.ts"),
    "utf8",
  );
  const persistSource = fs.readFileSync(
    path.join(repoRoot, "src/shell/procedure/procedure-correction-persist.ts"),
    "utf8",
  );
  const persistExists = persistSource.includes("persistStaffProcedureRecordCorrectionFromForm");
  const draftExists = fs.existsSync(
    path.join(repoRoot, "src/shell/procedure/procedure-correction-draft.ts"),
  );
  const bundleExists = fs.existsSync(
    path.join(repoRoot, "src/sbs-domain/correction-persist.bundle.js"),
  );
  const bundleDtsExists = fs.existsSync(
    path.join(repoRoot, "src/sbs-domain/correction-persist.bundle.d.ts"),
  );
  const boundaryNote = procedureCopyTs.match(
    /FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE[\s\S]*?as const;/,
  )?.[0];

  const markersOk =
    correctionTsx.includes('data-field-workflow="procedure-correction-save"') &&
    correctionTsx.includes(
      'data-field-workflow-save-path={saveWiringActive ? "submitCorrection" : "none"}',
    ) &&
    correctionTsx.includes("FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1") &&
    procedureCorrectionTs.includes("correctionSaveWiringAuthorized: true") &&
    persistExists &&
    draftExists &&
    bundleExists &&
    bundleDtsExists &&
    boundaryNote !== undefined &&
    !boundaryNote.includes("未接続");

  record("CORRECTION-SAVE-WIRING-T1-source-markers", markersOk, {
    wiredSaveMarker: correctionTsx.includes('data-field-workflow="procedure-correction-save"'),
    submitCorrectionPath: correctionTsx.includes("submitCorrection"),
    sliceId: correctionTsx.includes("FIELD-STAFF-CORRECTION-UI-SAVE-WIRING-SLICE-1"),
    persistModule: persistExists,
    draftModule: draftExists,
    bundle: bundleExists,
    boundaryNoteWired: boundaryNote !== undefined && !boundaryNote.includes("未接続"),
  });
  return markersOk;
}

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
const fieldStaffScrollMinimumReductionPx = 704;

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

auditCorrectionSaveWiringSourceMarkers();
record("CORRECTION-SAVE-WIRING-T2-compile-smoke", true, {
  esbuildBundle: true,
  productionCssIncludesCorrectionUx: productionCss.length > 0,
});

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
        fieldStaff: el?.getAttribute("data-field-staff") ?? "",
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

async function focusKey(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    return [
      el?.tagName ?? "",
      el?.id ?? "",
      el?.getAttribute("data-field-workflow") ?? "",
      el?.getAttribute("data-kiosk-ux") ?? "",
      el?.getAttribute("data-shell-ux") ?? "",
      el?.getAttribute("data-shell-ux-demo-role") ?? "",
      el?.getAttribute("name") ?? "",
      el?.getAttribute("value") ?? "",
    ].join(":");
  });
}

async function assertRecordFormBlockedForStatus(page, status) {
  await page.click(`[data-kiosk-status="${status}"] [data-kiosk-ux="tap-occurrence-button"]`);
  await page.waitForSelector('[data-field-workflow="current-procedure"]', {
    timeout: 8000,
  });
  const before = await page.evaluate((expectedStatus) => {
    const procedure = document.querySelector('[data-field-workflow="current-procedure"]');
    const statusText = document.querySelector('[data-kiosk-ux="occurrence-status-text"]');
    const cta = document.querySelector('[data-field-workflow="record-procedure-cta"]');
    const form = document.querySelector('[data-field-workflow="procedure-record-form"]');
    return {
      procedurePresent: Boolean(procedure),
      occurrenceStatus: procedure?.getAttribute("data-kiosk-occurrence-status") ?? "",
      canStart: procedure?.getAttribute("data-kiosk-can-start-record") ?? "",
      statusText: (statusText?.textContent ?? "").replace(/\s+/g, " ").trim(),
      expectedStatus,
      ctaDisabled: cta instanceof HTMLButtonElement ? cta.disabled : true,
      ctaAriaDisabled: cta?.getAttribute("aria-disabled") ?? "",
      ctaCanStart: cta?.getAttribute("data-kiosk-can-start-record") ?? "",
      formPresent: Boolean(form),
    };
  }, status);

  const cta = await page.$('[data-field-workflow="record-procedure-cta"]');
  let clickReachedDisabledControl = false;
  if (cta) {
    try {
      await cta.click({ delay: 20 });
      clickReachedDisabledControl = true;
    } catch {
      clickReachedDisabledControl = false;
    }
  }
  const formAfterNormalAction = await page.evaluate(() =>
    Boolean(document.querySelector('[data-field-workflow="procedure-record-form"]')),
  );

  await screenshot(page, `occurrence-${status}-current-procedure`);
  await page.click('[data-field-workflow="current-procedure-back"]');
  await page.waitForSelector('[data-kiosk-ux="today-support-list"]', { timeout: 8000 });

  return {
    ...before,
    clickReachedDisabledControl,
    formAfterNormalAction,
    blocked:
      before.procedurePresent &&
      before.occurrenceStatus === status &&
      before.statusText.includes(status) &&
      before.canStart === "false" &&
      before.ctaDisabled &&
      before.ctaAriaDisabled === "true" &&
      before.ctaCanStart === "false" &&
      before.formPresent === false &&
      formAfterNormalAction === false,
  };
}

async function assertCorrectionPathForStatus(page, status) {
  await page.click(`[data-kiosk-status="${status}"] [data-kiosk-ux="tap-occurrence-button"]`);
  await page.waitForSelector('[data-field-workflow="current-procedure"]', { timeout: 8000 });
  const procedure = await page.evaluate((expectedStatus) => {
    const root = document.querySelector('[data-field-workflow="current-procedure"]');
    const correction = document.querySelector('[data-field-workflow="record-correction-cta"]');
    const recordCta = document.querySelector('[data-field-workflow="record-procedure-cta"]');
    return {
      expectedStatus,
      currentProcedurePresent: Boolean(root),
      currentProcedureStatus: root?.getAttribute("data-kiosk-occurrence-status") ?? "",
      correctionPresent: Boolean(correction),
      correctionLabel: (correction?.textContent ?? "").trim(),
      recordCtaPresent: Boolean(recordCta),
    };
  }, status);
  await page.click('[data-field-workflow="record-correction-cta"]');
  await page.waitForSelector('[data-field-workflow="procedure-record-correction"]', {
    timeout: 8000,
  });
  const correction = await page.evaluate(() => {
    const root = document.querySelector('[data-field-workflow="procedure-record-correction"]');
    const wiredSave = document.querySelector('[data-field-workflow="procedure-correction-save"]');
    const disabledSave = document.querySelector(
      '[data-field-workflow="procedure-correction-save-disabled"]',
    );
    return {
      correctionPresent: Boolean(root),
      saveWired: Boolean(wiredSave),
      saveDisabledOnly: Boolean(disabledSave) && !wiredSave,
      savePath: root?.getAttribute("data-field-workflow-save-path") ?? "",
      shellCorrectionState:
        document
          .querySelector('[data-shell-ux="app-shell-chrome"]')
          ?.getAttribute("data-shell-ux-procedure-correction") ?? "",
    };
  });
  await screenshot(page, `occurrence-${status}-correction`);
  await page.click('[data-field-workflow="procedure-correction-back"]');
  await page.waitForSelector('[data-field-workflow="current-procedure"]', { timeout: 8000 });
  await page.click('[data-field-workflow="current-procedure-back"]');
  await page.waitForSelector('[data-kiosk-ux="today-support-list"]', { timeout: 8000 });
  return {
    procedure,
    correction,
    ok:
      procedure.currentProcedurePresent &&
      procedure.currentProcedureStatus === status &&
      procedure.correctionPresent &&
      procedure.correctionLabel.includes("訂正") &&
      !procedure.recordCtaPresent &&
      correction.correctionPresent &&
      correction.saveWired &&
      !correction.saveDisabledOnly &&
      correction.savePath === "submitCorrection" &&
      correction.shellCorrectionState === "open",
  };
}

try {
  const readyQuery = "viewMode=ready&siteSelection=SITE-ISG&destination=overview&saveState=unsaved";

  {
    const { page, errors } = await openPage(
      "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=FIELD_STAFF&scale=18",
      { width: 768, height: 1024, deviceScaleFactor: 1 },
    );
    const roster = await page.evaluate((minimumReduction) => {
      const root = document.querySelector('[data-shell-ux="smoke-root"]');
      const list = document.querySelector('[data-demo-ux="users-row-list"]');
      const readRosterState = () => {
        const rows = list ? [...list.querySelectorAll('[data-demo-ux="users-row"]')] : [];
        const detailButtons = list
          ? [...list.querySelectorAll('[data-demo-ux="users-detail-button"]')]
          : [];
        const enabledDetailButtons = detailButtons.filter(
          (button) =>
            button.getAttribute("data-demo-ux-detail-preview") === "true" && !button.disabled,
        );
        const disabledDetailButtons = detailButtons.filter((button) => button.disabled);
        const contexts = rows.map((row) => ({
          id: row.getAttribute("data-demo-ux-user-id") ?? "",
          label: row.querySelector(".personLabel")?.textContent?.trim() ?? "",
          detailPreview:
            row
              .querySelector('[data-demo-ux="users-detail-button"]')
              ?.getAttribute("data-demo-ux-detail-preview") ?? "false",
        }));
        const ids = contexts.map(({ id }) => id);
        const labels = contexts.map(({ label }) => label);
        return {
          rowCount: rows.length,
          uniqueIds: new Set(ids).size === ids.length,
          uniqueLabels: new Set(labels).size === labels.length,
          requiredContext: contexts.every(({ id, label }) => id.length > 0 && label.length > 0),
          detailPreviewCount: contexts.filter(({ detailPreview }) => detailPreview === "true")
            .length,
          enabledDetailActionCount: enabledDetailButtons.length,
          disabledDetailControlCount: disabledDetailButtons.length,
          visibleDisabledDetailControlCount: disabledDetailButtons.filter(
            (button) => window.getComputedStyle(button).display !== "none",
          ).length,
          disclosureButtonCount: document.querySelectorAll(
            '[data-field-staff="roster-secondary-disclosure"]',
          ).length,
          metadataCount: document.querySelectorAll('[data-field-staff="roster-secondary-metadata"]')
            .length,
          metadataExpandedCount: document.querySelectorAll(
            '[data-field-staff="roster-secondary-metadata"][data-field-staff-expanded="true"]',
          ).length,
          clientHeight: document.documentElement.clientHeight,
          scrollHeight: document.documentElement.scrollHeight,
          horizontalOverflow:
            document.documentElement.scrollWidth > document.documentElement.clientWidth,
          contexts,
        };
      };

      const enabledDetailButtons = list
        ? [
            ...list.querySelectorAll(
              '[data-demo-ux="users-detail-button"][data-demo-ux-detail-preview="true"]:not(:disabled)',
            ),
          ]
        : [];
      const disabledDetailButtons = list
        ? [...list.querySelectorAll('[data-demo-ux="users-detail-button"][disabled]')]
        : [];
      const restoredDisplay = enabledDetailButtons[0]
        ? window.getComputedStyle(enabledDetailButtons[0]).display
        : "";
      const originalStyles = disabledDetailButtons.map((button) => ({
        button,
        styleAttribute: button.getAttribute("style"),
      }));
      const canMeasureBaseline =
        enabledDetailButtons.length > 0 &&
        restoredDisplay.length > 0 &&
        restoredDisplay !== "none" &&
        disabledDetailButtons.length === 16;

      let baselineState;
      let candidateState;
      let temporaryBaselineOverrideRemoved = false;
      let temporaryBaselineOverrideMismatchCount = 0;
      if (canMeasureBaseline) {
        for (const button of disabledDetailButtons) {
          button.style.setProperty("display", restoredDisplay, "important");
        }
        baselineState = readRosterState();

        for (const { button, styleAttribute } of originalStyles) {
          if (styleAttribute === null) {
            button.removeAttribute("style");
            if (button.getAttribute("style") !== null) {
              button.removeAttribute("style");
            }
          } else {
            button.setAttribute("style", styleAttribute);
          }
        }
        temporaryBaselineOverrideMismatchCount = originalStyles.filter(
          ({ button, styleAttribute }) => button.getAttribute("style") !== styleAttribute,
        ).length;
        temporaryBaselineOverrideRemoved = temporaryBaselineOverrideMismatchCount === 0;
        candidateState = readRosterState();
      } else {
        candidateState = readRosterState();
      }

      const baselineScrollHeight = baselineState?.scrollHeight ?? null;
      const candidateScrollHeight = candidateState.scrollHeight;
      const absoluteReduction =
        baselineScrollHeight === null ? null : baselineScrollHeight - candidateScrollHeight;
      return {
        scenario: root?.getAttribute("data-field-staff-scale-scenario") ?? "",
        ...candidateState,
        baselineProvenance: "same-page-dom-visibility-restore",
        baselineRowCount: baselineState?.rowCount ?? null,
        candidateRowCount: candidateState.rowCount,
        baselineEnabledDetailActionCount: baselineState?.enabledDetailActionCount ?? null,
        candidateEnabledDetailActionCount: candidateState.enabledDetailActionCount,
        baselineDisabledDetailControlCount: baselineState?.disabledDetailControlCount ?? null,
        candidateDisabledDetailControlCount: candidateState.disabledDetailControlCount,
        baselineVisibleDisabledDetailControlCount:
          baselineState?.visibleDisabledDetailControlCount ?? null,
        candidateVisibleDisabledDetailControlCount:
          candidateState.visibleDisabledDetailControlCount,
        baselineScrollHeight,
        candidateScrollHeight,
        absoluteReduction,
        minimumReduction,
        restoredDisplay,
        temporaryBaselineOverrideRemoved,
        temporaryBaselineOverrideMismatchCount,
      };
    }, fieldStaffScrollMinimumReductionPx);
    const beforeFilter = roster;
    await page.$eval('[data-demo-ux="users-heading"]', (heading) => heading.focus());
    const keyboardToDisclosure = await tabUntil(
      page,
      (active) => active.fieldStaff === "roster-secondary-disclosure",
    );
    const disclosureFocus = await page.evaluate(hasVisibleFocus);
    await page.keyboard.press("Enter");
    const keyboardDisclosureState = await page.$eval(
      '[data-field-staff="roster-secondary-disclosure"][data-field-staff-user-id="user-a"]',
      (button) => ({
        expanded: button.getAttribute("aria-expanded") ?? "",
        controls: button.getAttribute("aria-controls") ?? "",
      }),
    );
    const expandedAfterKeyboard = await page.evaluate(() => ({
      expandedCount: document.querySelectorAll(
        '[data-field-staff="roster-secondary-metadata"][data-field-staff-expanded="true"]',
      ).length,
      firstMetadataText:
        document
          .querySelector(
            '[data-field-staff="roster-secondary-metadata"][data-field-staff-user-id="user-a"]',
          )
          ?.textContent?.trim() ?? "",
      scrollHeight: document.documentElement.scrollHeight,
    }));
    const keyboardToDetail = await tabUntil(
      page,
      (active) => active.tag === "BUTTON" && active.text === "詳細を見る",
    );
    const keyboardFocus = await page.evaluate(hasVisibleFocus);
    await page.keyboard.press("Enter");
    await page.waitForSelector('[data-demo-ux="user-detail"]', { timeout: 8000 });
    const keyboardDetailContext = await page.$eval(
      '[data-demo-ux="user-detail"] [data-demo-ux="user-detail-heading"]',
      (heading) => heading.textContent?.trim() ?? "",
    );
    await page.click('[data-demo-ux="user-detail-back"]');
    await page.waitForSelector('[data-demo-ux="users-row-list"]', { timeout: 8000 });
    await page.click('[data-demo-ux="users-filter-chip"][data-demo-ux-filter="未記録"]');
    const filteredCount = await page.$eval(
      '[data-demo-ux="users-row-list"]',
      (list) => list.querySelectorAll('[data-demo-ux="users-row"]').length,
    );
    await page.click('[data-demo-ux="users-filter-chip"][data-demo-ux-filter="すべて"]');
    await page.click('[data-demo-ux-detail-preview="true"]');
    await page.waitForSelector('[data-demo-ux="user-detail"]', { timeout: 8000 });
    const detailContext = await page.$eval(
      '[data-demo-ux="user-detail"] [data-demo-ux="user-detail-heading"]',
      (heading) => heading.textContent?.trim() ?? "",
    );
    await page.click('[data-demo-ux="user-detail-back"]');
    await page.waitForSelector('[data-demo-ux="users-row-list"]', { timeout: 8000 });
    const afterReturn = await page.$eval(
      '[data-demo-ux="users-row-list"]',
      (list) => list.querySelectorAll('[data-demo-ux="users-row"]').length,
    );
    const pass =
      errors.length === 0 &&
      beforeFilter.scenario === "18" &&
      beforeFilter.rowCount === 18 &&
      beforeFilter.uniqueIds &&
      beforeFilter.uniqueLabels &&
      beforeFilter.requiredContext &&
      beforeFilter.detailPreviewCount === 2 &&
      beforeFilter.enabledDetailActionCount === 2 &&
      beforeFilter.disabledDetailControlCount === 16 &&
      beforeFilter.visibleDisabledDetailControlCount === 0 &&
      beforeFilter.disclosureButtonCount === 18 &&
      beforeFilter.metadataCount === 18 &&
      beforeFilter.metadataExpandedCount === 0 &&
      beforeFilter.scrollHeight > beforeFilter.clientHeight &&
      keyboardToDisclosure.found &&
      disclosureFocus.visible &&
      keyboardDisclosureState.expanded === "true" &&
      keyboardDisclosureState.controls === "users-roster-secondary-user-a" &&
      expandedAfterKeyboard.expandedCount === 1 &&
      expandedAfterKeyboard.firstMetadataText.includes("支援計画") &&
      expandedAfterKeyboard.scrollHeight > beforeFilter.scrollHeight &&
      beforeFilter.horizontalOverflow === false &&
      beforeFilter.baselineProvenance === "same-page-dom-visibility-restore" &&
      beforeFilter.baselineRowCount === 18 &&
      beforeFilter.candidateRowCount === 18 &&
      beforeFilter.baselineEnabledDetailActionCount === 2 &&
      beforeFilter.candidateEnabledDetailActionCount === 2 &&
      beforeFilter.baselineDisabledDetailControlCount === 16 &&
      beforeFilter.candidateDisabledDetailControlCount === 16 &&
      beforeFilter.baselineVisibleDisabledDetailControlCount === 16 &&
      beforeFilter.candidateVisibleDisabledDetailControlCount === 0 &&
      beforeFilter.restoredDisplay.length > 0 &&
      beforeFilter.restoredDisplay !== "none" &&
      beforeFilter.temporaryBaselineOverrideRemoved &&
      beforeFilter.baselineScrollHeight > beforeFilter.candidateScrollHeight &&
      beforeFilter.absoluteReduction >= beforeFilter.minimumReduction &&
      beforeFilter.minimumReduction === fieldStaffScrollMinimumReductionPx &&
      keyboardToDetail.found &&
      keyboardFocus.visible &&
      keyboardDetailContext === "Aさん" &&
      filteredCount === 7 &&
      detailContext === "Aさん" &&
      afterReturn === 18;
    record("field-staff-18-user-scale-context-safety", pass, {
      errors,
      beforeFilter,
      keyboardToDetail,
      keyboardFocus,
      keyboardDetailContext,
      keyboardToDisclosure,
      disclosureFocus,
      keyboardDisclosureState,
      expandedAfterKeyboard,
      filteredCount,
      detailContext,
      afterReturn,
      interactionBurden: {
        rosterRows: beforeFilter.rowCount,
        listClientHeight: beforeFilter.clientHeight,
        listScrollHeight: beforeFilter.scrollHeight,
        verticalScrollRequired: beforeFilter.scrollHeight > beforeFilter.clientHeight,
        baselineProvenance: beforeFilter.baselineProvenance,
        baselineScrollHeight: beforeFilter.baselineScrollHeight,
        candidateScrollHeight: beforeFilter.candidateScrollHeight,
        absoluteReduction: beforeFilter.absoluteReduction,
        minimumReduction: beforeFilter.minimumReduction,
        baselineVisibleDisabledDetailControlCount:
          beforeFilter.baselineVisibleDisabledDetailControlCount,
        candidateVisibleDisabledDetailControlCount:
          beforeFilter.candidateVisibleDisabledDetailControlCount,
        enabledDetailActionCount: beforeFilter.candidateEnabledDetailActionCount,
        disabledDetailControlCount: beforeFilter.candidateDisabledDetailControlCount,
        restoredDisplay: beforeFilter.restoredDisplay,
        temporaryBaselineOverrideRemoved: beforeFilter.temporaryBaselineOverrideRemoved,
      },
    });
    await screenshot(page, "field-staff-18-user-scale-context-safety");
    await page.close();

    const { page: desktopPage, errors: desktopErrors } = await openPage(
      "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=FIELD_STAFF&scale=18",
      { width: 1440, height: 900, deviceScaleFactor: 1 },
    );
    const desktopDisclosure = await desktopPage.evaluate(() => {
      const button = document.querySelector('[data-field-staff="roster-secondary-disclosure"]');
      const metadata = document.querySelector('[data-field-staff="roster-secondary-metadata"]');
      return {
        rowCount: document.querySelectorAll('[data-demo-ux="users-row"]').length,
        buttonDisplay: button instanceof HTMLElement ? window.getComputedStyle(button).display : "",
        metadataDisplay:
          metadata instanceof HTMLElement ? window.getComputedStyle(metadata).display : "",
        horizontalOverflow:
          document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    record(
      "field-staff-roster-disclosure-desktop-unchanged",
      desktopErrors.length === 0 &&
        desktopDisclosure.rowCount === 18 &&
        desktopDisclosure.buttonDisplay === "none" &&
        desktopDisclosure.metadataDisplay !== "none" &&
        desktopDisclosure.horizontalOverflow === false,
      { errors: desktopErrors, desktopDisclosure },
    );
    await desktopPage.close();
  }

  if (process.env.KIOSK_SCALE_ONLY === "1") {
    const scaleReport = {
      slice: "FIELD-STAFF-PHASE8-ROSTER-CONTEXT-PRESERVING-DISCLOSURE-1",
      kind: "focused synthetic 18-user roster disclosure browser smoke",
      date: new Date().toISOString(),
      liveTenantIoAuthorized: false,
      sharePointRestAuthorized: false,
      checks,
      pass: checks.every((check) => check.pass),
    };
    fs.writeFileSync(
      path.join(artifactsDir, "smoke-report.json"),
      JSON.stringify(scaleReport, null, 2),
    );
    await browser.close();
    server.close();
    console.log(
      JSON.stringify({ pass: scaleReport.pass, artifactsDir, checks: checks.length }, null, 2),
    );
    process.exit(scaleReport.pass ? 0 : 1);
  }

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

    const toAbcCta = await tabUntil(page, (active) => active.field === "abc-observation-cta");
    const abcCtaFocus = await page.evaluate(hasVisibleFocus);
    await page.keyboard.press("Enter");
    await page.waitForSelector('[data-field-workflow="abc-observation-presentation"]', {
      timeout: 8000,
    });
    await page.waitForFunction(
      () =>
        document.activeElement ===
        document.querySelector('[data-field-workflow="abc-observation-heading"]'),
      { timeout: 8000 },
    );
    const abcPresentation = await page.evaluate(() => {
      const root = document.querySelector('[data-field-workflow="abc-observation-presentation"]');
      const heading = document.querySelector('[data-field-workflow="abc-observation-heading"]');
      const fields = document.querySelector('[data-field-workflow="abc-observation-fields"]');
      return {
        present: Boolean(root),
        slice: root?.getAttribute("data-field-workflow-abc-slice") ?? "",
        userId: root?.getAttribute("data-field-workflow-user") ?? "",
        heading: heading?.textContent?.trim() ?? "",
        fields: fields?.textContent?.trim() ?? "",
        saveControls: document.querySelectorAll(
          '[data-field-workflow="abc-observation-presentation"] input, [data-field-workflow="abc-observation-presentation"] textarea, [data-field-workflow="abc-observation-presentation"] select',
        ).length,
      };
    });
    const abcHeadingFocus = await page.evaluate(hasVisibleFocus);
    await page.click('[data-field-workflow="abc-observation-back"]');
    await page.waitForSelector('[data-field-workflow="current-procedure"]', { timeout: 8000 });

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

    const forwardKeys = [];
    for (let index = 0; index < 16; index += 1) {
      await page.keyboard.press("Tab");
      forwardKeys.push(await focusKey(page));
    }
    const uniqueForward = new Set(forwardKeys);
    const afterForward = forwardKeys[forwardKeys.length - 1];
    await page.keyboard.down("Shift");
    await page.keyboard.press("Tab");
    await page.keyboard.up("Shift");
    const afterShift = await focusKey(page);
    const trapProbe = {
      uniqueForwardCount: uniqueForward.size,
      movedForward: uniqueForward.size > 1,
      shiftTabMoved: afterShift !== afterForward,
      afterForward,
      afterShift,
      forwardKeys,
    };

    record("keyboard-visible-focus", occurrenceFocus.visible && recordCtaFocus.visible, {
      occurrenceFocus,
      recordCtaFocus,
    });
    record(
      "field-staff-abc-read-only-path",
      toAbcCta.found &&
        abcCtaFocus.visible &&
        abcPresentation.present &&
        abcPresentation.slice === "FIELD-STAFF-ABC-PRESENTATION-1" &&
        abcPresentation.userId === "user-a" &&
        abcPresentation.heading === "ABC観察" &&
        abcPresentation.fields.includes("Antecedent") &&
        abcPresentation.fields.includes("Behavior") &&
        abcPresentation.fields.includes("Consequence") &&
        abcPresentation.saveControls === 0 &&
        abcHeadingFocus.visible,
      { toAbcCta, abcCtaFocus, abcPresentation, abcHeadingFocus },
    );
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
    record(
      "keyboard-no-trap",
      trapProbe.movedForward && trapProbe.shiftTabMoved && overviewAfterReturn.overviewPresent,
      {
        trapProbe,
        overviewAfterReturn,
      },
    );
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
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
    });
    const unrecorded = await page.evaluate(() => {
      const item = document.querySelector(
        '[data-kiosk-status="未実施"][data-kiosk-can-start-record="true"]',
      );
      const button = item?.querySelector('[data-kiosk-ux="tap-occurrence-button"]');
      return {
        present: Boolean(item),
        canStart: item?.getAttribute("data-kiosk-can-start-record") ?? "",
        actionLabel: (button?.textContent ?? "").trim(),
      };
    });
    await page.click(
      '[data-kiosk-status="未実施"][data-kiosk-can-start-record="true"] [data-kiosk-ux="tap-occurrence-button"]',
    );
    await page.waitForSelector('[data-field-workflow="current-procedure"]', { timeout: 8000 });
    const unrecordedProcedure = await page.evaluate(() => {
      const procedure = document.querySelector('[data-field-workflow="current-procedure"]');
      const cta = document.querySelector('[data-field-workflow="record-procedure-cta"]');
      return {
        status: procedure?.getAttribute("data-kiosk-occurrence-status") ?? "",
        statusText: (
          document.querySelector('[data-kiosk-ux="occurrence-status-text"]')?.textContent ?? ""
        )
          .replace(/\s+/g, " ")
          .trim(),
        canStart: procedure?.getAttribute("data-kiosk-can-start-record") ?? "",
        ctaDisabled: cta instanceof HTMLButtonElement ? cta.disabled : true,
      };
    });
    await page.click('[data-field-workflow="record-procedure-cta"]');
    await page.waitForSelector('[data-field-workflow="procedure-record-form"]', { timeout: 8000 });
    const unrecordedFormPresent = await page.evaluate(() =>
      Boolean(document.querySelector('[data-field-workflow="procedure-record-form"]')),
    );
    await screenshot(page, "occurrence-unrecorded-record-form");
    record(
      "unrecorded-record-action",
      errors.length === 0 &&
        unrecorded.present &&
        unrecorded.canStart === "true" &&
        unrecordedProcedure.status === "未実施" &&
        unrecordedProcedure.statusText.includes("未実施") &&
        unrecordedProcedure.canStart === "true" &&
        unrecordedProcedure.ctaDisabled === false &&
        unrecordedFormPresent,
      { errors, unrecorded, unrecordedProcedure, unrecordedFormPresent },
    );
    await page.close();
  }

  {
    const { page, errors } = await openPage(readyQuery, {
      width: 768,
      height: 1024,
      deviceScaleFactor: 1,
    });
    const recorded = await assertCorrectionPathForStatus(page, "記録済み");
    const cancelled = await assertCorrectionPathForStatus(page, "取消済み");
    const conflict = await assertRecordFormBlockedForStatus(page, "確認が必要");
    record("recorded-correction-path", errors.length === 0 && recorded.ok, {
      errors,
      recorded,
    });
    record("cancelled-correction-path", errors.length === 0 && cancelled.ok, {
      errors,
      cancelled,
    });
    record("conflict-record-prevention", errors.length === 0 && conflict.blocked, {
      errors,
      conflict,
    });
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
