#!/usr/bin/env node
/**
 * CORR-1G browser smoke.
 * Synthetic FIELD_STAFF presentation only. No LIVE WRITE / auth / schema mutation.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.SBS_ROLE_TASK_IA_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/sbs-role-task-first-ia-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SBS_ROLE_TASK_IA_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.SBS_ROLE_TASK_IA_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.SBS_ROLE_TASK_IA_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.js"
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss = sassModule.compile ?? sassModule.default?.compile;

function normalizeSpfxThemeCss(css) {
  return css
    .replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1")
    .replace(/:global\(([^)]+)\)/g, "$1");
}

const scssPaths = [
  "src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss",
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/dashboard/TodaySupportDayBoardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
];
const css = scssPaths
  .map((relativePath) =>
    normalizeSpfxThemeCss(
      compileScss(path.join(spfxRoot, relativePath), { style: "expanded" }).css,
    ),
  )
  .join("\n");
fs.writeFileSync(path.join(__dirname, "smoke-production.css"), css);

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
  outfile: path.join(__dirname, "smoke-bundle.js"),
  format: "iife",
  platform: "browser",
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  plugins: [scssStubPlugin],
  define: { "process.env.NODE_ENV": '"production"' },
  nodePaths: [process.env.SBS_ROLE_TASK_IA_NODE_PATH ?? "/tmp/node_modules"],
});

fs.writeFileSync(
  path.join(__dirname, "index.html"),
  '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="smoke-production.css"></head><body><div id="root"></div><script src="smoke-bundle.js"></script></body></html>',
);

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const relativePath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(__dirname, path.normalize(relativePath).replace(/^(\.\.[/\\])+/, ""));
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404).end("not found");
      return;
    }
    const extension = path.extname(filePath);
    const contentType =
      extension === ".html"
        ? "text/html"
        : extension === ".css"
          ? "text/css"
          : "application/javascript";
    response.writeHead(200, { "Content-Type": `${contentType}; charset=utf-8` });
    response.end(data);
  });
});
await new Promise((resolve) => server.listen(4197, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_ROLE_TASK_IA_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const baseUrl = "http://127.0.0.1:4197/index.html";
const results = [];

async function inspectProductState(page) {
  return page.evaluate(() => {
    const taskRoot = document.querySelector('[data-role-task-ia="FIELD_STAFF"]');
    const selected = document.querySelector('[data-role-task-selected="true"]');
    const labels = [...document.querySelectorAll("nav [data-role-task-global]")].map(
      (element) => element.textContent?.trim() ?? "",
    );
    const legacyNav = document.querySelector('[data-shell-ux="primary-navigation"]');
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const text = document.body.textContent ?? "";
    return {
      taskDestination: taskRoot?.getAttribute("data-role-task-destination") ?? "",
      activeGlobal: taskRoot?.getAttribute("data-role-task-active-global") ?? "",
      selectedGlobal: selected?.getAttribute("data-role-task-global") ?? "",
      labels,
      shellDestination: shell?.getAttribute("data-shell-ux-destination") ?? "",
      taskHeading:
        document
          .querySelector('[data-role-task-ia="FIELD_STAFF"] [role="heading"]')
          ?.textContent?.trim() ?? "",
      object: taskRoot?.getAttribute("data-role-task-object") ?? "",
      occurrence: taskRoot?.getAttribute("data-role-task-occurrence") ?? "",
      legacyNavDisplay: legacyNav ? window.getComputedStyle(legacyNav).display : "missing",
      hasRecordSearchGlobal: Boolean(
        document.querySelector('[data-role-task-nav="D-FIND-RECORD"]'),
      ),
      hasCurrentProcedure: Boolean(
        document.querySelector('[data-field-workflow="current-procedure"]'),
      ),
      currentProcedureLookupStatus:
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-lookup-status") ?? "",
      currentProcedureOccurrenceId:
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-occurrence-id") ?? "",
      currentProcedureUserId:
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-user") ?? "",
      currentProcedurePlanId:
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-plan-id") ?? "",
      currentProcedurePlanVersion:
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-plan-version") ?? "",
      currentProcedureProcedureId:
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-procedure-id") ?? "",
      currentProcedureProcedureVersion:
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-procedure-version") ?? "",
      currentProcedureBackLabel:
        document
          .querySelector('[data-field-workflow="current-procedure-back"]')
          ?.textContent?.trim() ?? "",
      hasProcedureUnresolvedSection: Boolean(
        document.querySelector('[data-field-workflow="procedure-unresolved-section"]'),
      ),
      procedureUnresolvedReason:
        document
          .querySelector('[data-field-workflow="procedure-unresolved-note"]')
          ?.textContent?.trim() ?? "",
      hasProcedureFlow: Boolean(document.querySelector('[data-field-workflow="procedure-flow"]')),
      procedureSceneText:
        document.querySelector('[data-field-workflow="procedure-scene"]')?.textContent?.trim() ??
        "",
      procedurePerformTexts: Array.from(
        document.querySelectorAll('[data-field-workflow="procedure-perform"] li'),
      ).map((el) => el.textContent?.trim() ?? ""),
      hasRecordProcedureCta: Boolean(
        document.querySelector('[data-field-workflow="record-procedure-cta"]'),
      ),
      hasRecordCorrectionCta: Boolean(
        document.querySelector('[data-field-workflow="record-correction-cta"]'),
      ),
      hasRecordCancellationCta: Boolean(
        document.querySelector('[data-field-workflow="record-cancellation-cta"]'),
      ),
      hasAbcObservationCta: Boolean(
        document.querySelector('[data-field-workflow="abc-observation-cta"]'),
      ),
      hasProcedureOperationSection: Boolean(
        document.querySelector('[aria-labelledby="field-workflow-record-cta-heading"]'),
      ),
      hasUserDetail: Boolean(document.querySelector('[data-demo-ux="user-detail"]')),
      hasProcedureRecordForm: Boolean(
        document.querySelector('[data-field-workflow="procedure-record-form"]'),
      ),
      hasUsersList: Boolean(document.querySelector('[data-demo-ux="users-list"]')),
      orientationCopy:
        document.querySelector('[data-role-task-orientation="今どこ"]')?.textContent ?? "",
      noHorizontalOverflow:
        document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    };
  });
}

async function openPage(name, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await page.waitForSelector('[data-role-task-destination="D-TODAY"]');
  return { name, page, pageErrors };
}

async function capture(name, page) {
  const file = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

{
  const { page, pageErrors } = await openPage("first-paint-desktop", {
    width: 1280,
    height: 900,
  });
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-TODAY" &&
    state.activeGlobal === "GLOBAL-TODAY" &&
    state.labels.join("|") === "今日|手順|記録する|未記録|探す" &&
    state.taskHeading === "今日の支援" &&
    state.object === "false" &&
    state.occurrence === "false" &&
    state.shellDestination === "overview" &&
    state.legacyNavDisplay === "none" &&
    !state.hasRecordSearchGlobal &&
    !state.hasHostStatusCopy &&
    state.orientationCopy.includes("D-TODAY") &&
    state.noHorizontalOverflow &&
    pageErrors.length === 0;
  results.push({
    name: "first-paint-desktop",
    pass,
    state,
    pageErrors,
    shot: await capture("first-paint-desktop", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("today-pa-acquire", { width: 1280, height: 900 });
  await page.waitForSelector(
    '[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]',
  );
  await page.click('[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-PROCEDURE" &&
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-object") === "true",
  );
  const acquired = await inspectProductState(page);
  await page.click('[data-role-task-global="GLOBAL-TODAY"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-TODAY" &&
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-object") === "true",
  );
  const stickyToday = await inspectProductState(page);
  await page.waitForSelector('[data-role-task-clear-occurrence="true"]');
  await page.click('[data-role-task-clear-occurrence="true"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-object") === "false",
  );
  const cleared = await inspectProductState(page);
  const pass =
    acquired.taskDestination === "D-PROCEDURE" &&
    acquired.object === "true" &&
    acquired.taskHeading === "手順" &&
    stickyToday.taskDestination === "D-TODAY" &&
    stickyToday.object === "true" &&
    cleared.object === "false" &&
    cleared.occurrence === "false" &&
    pageErrors.length === 0;
  results.push({
    name: "today-pa-acquire",
    pass,
    state: { acquired, stickyToday, cleared },
    pageErrors,
    shot: await capture("today-pa-acquire", page),
  });
  await page.close();
}

{
  // UNVERIFIED RESIDUAL RISKS (Documented per SBS-U6-B-A2-W2A specification):
  // 1. Same Target Key re-entry synchronous cache reuse before fresh resolution settlement.
  // 2. Stale procedure body reuse if dataSource content is modified without bumping dataSourceRevision.
  // These risks are not verified by this synthetic smoke test and are marked as UNVERIFIED / FOLLOW-UP REQUIRED.
  const EXPECTED_OCCURRENCE_ID = "e518a51d6c45a6541747d80439d9d0d9879b46d4d7ef9e359596a3833feac795";
  const EXPECTED_SCENE = "朝の朝礼・視覚スケジュールの確認（09:30）";
  const EXPECTED_PERFORM_TEXTS = [
    "次の活動内容を絵カードやスケジュール表で事前に提示する。",
    "本人のペースに合わせて指示を短く区切り、受容的な態度で接する。",
    "着席や準備ができた段階で具体的に褒めて認める。",
  ];

  function matchesCanonicalSpecification(state) {
    return (
      state.currentProcedureOccurrenceId === EXPECTED_OCCURRENCE_ID &&
      state.currentProcedureUserId === "user-a" &&
      state.currentProcedurePlanId === "plan-001" &&
      state.currentProcedurePlanVersion === "1" &&
      state.currentProcedureProcedureId === "proc-morning" &&
      state.currentProcedureProcedureVersion === "v1" &&
      state.procedureSceneText === EXPECTED_SCENE &&
      state.procedurePerformTexts.length === EXPECTED_PERFORM_TEXTS.length &&
      state.procedurePerformTexts.every((text, index) => text === EXPECTED_PERFORM_TEXTS[index])
    );
  }

  const { page, pageErrors } = await openPage("sufficient-global-restore", {
    width: 1280,
    height: 900,
  });
  await page.waitForSelector(
    '[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]',
  );
  const initialOccurrenceId = await page.$eval(
    '[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]',
    (el) => el.getAttribute("data-kiosk-target-occurrence-id") ?? "",
  );
  await page.click('[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]');
  await page.waitForSelector('[data-field-workflow="current-procedure"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-field-workflow="current-procedure"]')
        ?.getAttribute("data-field-workflow-lookup-status") === "RESOLVED",
  );
  await page.waitForSelector('[data-field-workflow="procedure-flow"]');

  await page.click('[data-role-task-global="GLOBAL-TODAY"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-TODAY" &&
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-object") === "true",
  );

  let procedureReEntryStatusSequence = [];
  try {
    await page.evaluate(() => {
      window.__sbsProcedureLookupStatusSequence = [];
      const target = document.querySelector('[data-shell-ux="app-shell-chrome"]') || document.body;
      const observer = new MutationObserver(() => {
        const el = document.querySelector('[data-field-workflow="current-procedure"]');
        if (el) {
          const status = el.getAttribute("data-field-workflow-lookup-status");
          if (status) {
            const seq = window.__sbsProcedureLookupStatusSequence;
            if (seq[seq.length - 1] !== status) {
              seq.push(status);
            }
          }
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-field-workflow-lookup-status"],
      });
      window.__sbsProcedureObserver = observer;
    });

    await page.click('[data-role-task-global="GLOBAL-PROCEDURE"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-role-task-ia="FIELD_STAFF"]')
          ?.getAttribute("data-role-task-destination") === "D-PROCEDURE" &&
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-lookup-status") === "RESOLVED",
    );
    await page.waitForSelector('[data-field-workflow="procedure-flow"]');
  } finally {
    procedureReEntryStatusSequence = await page.evaluate(() => {
      if (window.__sbsProcedureObserver) {
        window.__sbsProcedureObserver.disconnect();
        delete window.__sbsProcedureObserver;
      }
      const seq = window.__sbsProcedureLookupStatusSequence || [];
      delete window.__sbsProcedureLookupStatusSequence;
      return seq;
    });
  }
  const procedureRestored = await inspectProductState(page);

  await page.click('[data-role-task-global="GLOBAL-TODAY"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-TODAY",
  );
  await page.click('[data-role-task-global="GLOBAL-UNRECORDED"]');
  await page.waitForSelector(
    '[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]',
  );
  await page.click('[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-RECORD-WRITE" &&
      document
        .querySelector('[data-field-workflow="current-procedure"]')
        ?.getAttribute("data-field-workflow-lookup-status") === "RESOLVED",
  );
  await page.waitForSelector('[data-field-workflow="procedure-flow"]');

  await page.click('[data-role-task-global="GLOBAL-TODAY"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-TODAY" &&
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-occurrence") === "true",
  );

  let recordReEntryStatusSequence = [];
  try {
    await page.evaluate(() => {
      window.__sbsRecordLookupStatusSequence = [];
      const target = document.querySelector('[data-shell-ux="app-shell-chrome"]') || document.body;
      const observer = new MutationObserver(() => {
        const el = document.querySelector('[data-field-workflow="current-procedure"]');
        if (el) {
          const status = el.getAttribute("data-field-workflow-lookup-status");
          if (status) {
            const seq = window.__sbsRecordLookupStatusSequence;
            if (seq[seq.length - 1] !== status) {
              seq.push(status);
            }
          }
        }
      });
      observer.observe(target, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-field-workflow-lookup-status"],
      });
      window.__sbsRecordObserver = observer;
    });

    await page.click('[data-role-task-global="GLOBAL-RECORD-WRITE"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-role-task-ia="FIELD_STAFF"]')
          ?.getAttribute("data-role-task-destination") === "D-RECORD-WRITE" &&
        document
          .querySelector('[data-field-workflow="current-procedure"]')
          ?.getAttribute("data-field-workflow-lookup-status") === "RESOLVED",
    );
    await page.waitForSelector('[data-field-workflow="procedure-flow"]');
  } finally {
    recordReEntryStatusSequence = await page.evaluate(() => {
      if (window.__sbsRecordObserver) {
        window.__sbsRecordObserver.disconnect();
        delete window.__sbsRecordObserver;
      }
      const seq = window.__sbsRecordLookupStatusSequence || [];
      delete window.__sbsRecordLookupStatusSequence;
      return seq;
    });
  }
  const recordRestored = await inspectProductState(page);

  const pass =
    Boolean(initialOccurrenceId) &&
    initialOccurrenceId === EXPECTED_OCCURRENCE_ID &&
    // 1. D-PROCEDURE 復帰時の検証
    procedureRestored.taskDestination === "D-PROCEDURE" &&
    procedureRestored.currentProcedureLookupStatus === "RESOLVED" &&
    !procedureRestored.hasProcedureUnresolvedSection &&
    procedureRestored.hasProcedureFlow &&
    matchesCanonicalSpecification(procedureRestored) &&
    procedureRestored.currentProcedureBackLabel === "← 今日の支援" &&
    !procedureRestored.hasRecordProcedureCta &&
    !procedureRestored.hasRecordCorrectionCta &&
    !procedureRestored.hasRecordCancellationCta &&
    !procedureRestored.hasAbcObservationCta &&
    !procedureRestored.hasProcedureOperationSection &&
    !procedureRestored.hasProcedureRecordForm &&
    !procedureRestored.hasUserDetail &&
    !procedureRestored.hasUsersList &&
    // 2. D-RECORD-WRITE 復帰時の検証
    recordRestored.taskDestination === "D-RECORD-WRITE" &&
    recordRestored.currentProcedureLookupStatus === "RESOLVED" &&
    !recordRestored.hasProcedureUnresolvedSection &&
    recordRestored.hasProcedureFlow &&
    matchesCanonicalSpecification(recordRestored) &&
    recordRestored.currentProcedureBackLabel === "← 今日の支援" &&
    !recordRestored.hasRecordProcedureCta &&
    !recordRestored.hasRecordCorrectionCta &&
    !recordRestored.hasRecordCancellationCta &&
    !recordRestored.hasAbcObservationCta &&
    !recordRestored.hasProcedureOperationSection &&
    !recordRestored.hasProcedureRecordForm &&
    !recordRestored.hasUserDetail &&
    !recordRestored.hasUsersList &&
    // 3. ページエラー 0 件
    pageErrors.length === 0;

  results.push({
    name: "sufficient-global-restore",
    pass,
    state: {
      initialOccurrenceId,
      procedureRestored,
      recordRestored,
      procedureReEntryStatusSequence,
      recordReEntryStatusSequence,
    },
    pageErrors,
    shot: await capture("sufficient-global-restore", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("unrecorded-option-a", { width: 1280, height: 900 });
  await page.click('[data-role-task-global="GLOBAL-UNRECORDED"]');
  await page.waitForSelector(
    '[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]',
  );
  await page.click('[data-kiosk-status="未実施"] [data-kiosk-ux="tap-occurrence-button"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-RECORD-WRITE" &&
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-occurrence") === "true",
  );
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-RECORD-WRITE" &&
    state.object === "true" &&
    state.occurrence === "true" &&
    state.taskHeading === "記録する" &&
    pageErrors.length === 0;
  results.push({
    name: "unrecorded-option-a",
    pass,
    state,
    pageErrors,
    shot: await capture("unrecorded-option-a", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("procedure-fallback", { width: 1280, height: 900 });
  await page.click('[data-role-task-global="GLOBAL-PROCEDURE"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-TODAY",
  );
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-TODAY" &&
    state.selectedGlobal === "GLOBAL-PROCEDURE" &&
    state.shellDestination === "overview" &&
    state.orientationCopy.includes("D-TODAY") &&
    pageErrors.length === 0;
  results.push({
    name: "procedure-fallback",
    pass,
    state,
    pageErrors,
    shot: await capture("procedure-fallback", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("record-write-fallback", {
    width: 1280,
    height: 900,
  });
  await page.click('[data-role-task-global="GLOBAL-RECORD-WRITE"]');
  await page.waitForSelector('[data-demo-ux="users-list"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-UNRECORDED",
  );
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-UNRECORDED" &&
    state.selectedGlobal === "GLOBAL-RECORD-WRITE" &&
    state.shellDestination === "users" &&
    pageErrors.length === 0;
  results.push({
    name: "record-write-fallback",
    pass,
    state,
    pageErrors,
    shot: await capture("record-write-fallback", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("find-person", { width: 1280, height: 900 });
  await page.click('[data-role-task-global="GLOBAL-FIND-PERSON"]');
  await page.waitForSelector('[data-demo-ux="users-list"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-FIND-PERSON",
  );
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-FIND-PERSON" &&
    !state.hasRecordSearchGlobal &&
    pageErrors.length === 0;
  results.push({
    name: "find-person",
    pass,
    state,
    pageErrors,
    shot: await capture("find-person", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("unrecorded", { width: 1280, height: 900 });
  await page.click('[data-role-task-global="GLOBAL-UNRECORDED"]');
  await page.waitForSelector('[data-demo-ux="users-list"]');
  await page.waitForFunction(() => {
    const chip = document.querySelector(
      '[data-demo-ux="users-filter-chip"][data-demo-ux-filter="未記録"]',
    );
    return chip?.getAttribute("data-demo-ux-filter-selected") === "true";
  });
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-UNRECORDED" &&
    state.selectedGlobal === "GLOBAL-UNRECORDED" &&
    pageErrors.length === 0;
  results.push({
    name: "unrecorded",
    pass,
    state,
    pageErrors,
    shot: await capture("unrecorded", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("today-return", { width: 1280, height: 900 });
  await page.click('[data-role-task-global="GLOBAL-PROCEDURE"]');
  await page.waitForSelector('[data-role-task-destination="D-TODAY"]');
  await page.click('[data-role-task-global="GLOBAL-TODAY"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === "D-TODAY",
  );
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-TODAY" &&
    state.selectedGlobal === "GLOBAL-TODAY" &&
    state.taskHeading === "今日の支援" &&
    pageErrors.length === 0;
  results.push({
    name: "today-return",
    pass,
    state,
    pageErrors,
    shot: await capture("today-return", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("first-paint-mobile", { width: 390, height: 844 });
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-TODAY" && state.noHorizontalOverflow && pageErrors.length === 0;
  results.push({
    name: "first-paint-mobile",
    pass,
    state,
    pageErrors,
    shot: await capture("first-paint-mobile", page),
  });
  await page.close();
}

await browser.close();
server.close();

const evidence = {
  slice: "SBS-ROLE-TASK-FIRST-IA-V1-CORR-1G",
  browserSmoke: "synthetic",
  implementationHead: process.env.SBS_ROLE_TASK_IA_IMPLEMENTATION_HEAD ?? "local",
  results,
  pass: results.every((result) => result.pass),
};
fs.writeFileSync(path.join(artifactsDir, "evidence.json"), JSON.stringify(evidence, null, 2));

console.log(JSON.stringify(evidence, null, 2));
if (!evidence.pass) {
  process.exitCode = 1;
}
