#!/usr/bin/env node
/**
 * SBS-MGMT-LOOP-B / B12 browser smoke.
 * Synthetic/session-only. No persistence, SharePoint, M365, Deploy, or LIVE WRITE.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const entry = path.join(spfxRoot, "smoke/support-plan-review-new-version-demo-1/smoke-entry.tsx");
const outDir = __dirname;
const artifactsDir =
  process.env.SBS_MGMT_LOOP_B_ARTIFACTS_DIR ?? "/tmp/sbs-mgmt-loop-b-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SBS_MGMT_LOOP_B_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.SBS_MGMT_LOOP_B_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.SBS_MGMT_LOOP_B_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.js"
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss = sassModule.compile ?? sassModule.default?.compile;

const scssPaths = [
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
  "src/shell/users/SupportPlanUx.module.scss",
  "src/shell/users/SupportPlanManagementListUx.module.scss",
  "src/shell/review/ReviewDueStateUx.module.scss",
  "src/shell/monitoring/MonitoringViewUx.module.scss",
  "src/shell/monitoring/ReviewOutcomeCaptureView.module.scss",
];

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const css = scssPaths
  .map((rel) =>
    normalizeSpfxThemeCss(compileScss(path.join(spfxRoot, rel), { style: "expanded" }).css),
  )
  .join("\n");
fs.writeFileSync(path.join(outDir, "smoke-production.css"), css);

const scssStubPlugin = {
  name: "scss-module-stub",
  setup(build) {
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, "utf8");
      const keys = new Set();
      for (const match of text.matchAll(/\.([A-Za-z_][\w-]*)\s*[,:{]/g)) keys.add(match[1]);
      const entries = [...keys]
        .map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(key)}`)
        .join(",\n");
      return { contents: `export default {\n${entries}\n};`, loader: "js" };
    });
  },
};

await esbuild.build({
  entryPoints: [entry],
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
  nodePaths: [process.env.SBS_MGMT_LOOP_B_NODE_PATH ?? "/tmp/node_modules"],
});

fs.writeFileSync(
  path.join(outDir, "index.html"),
  '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="smoke-production.css"></head><body><div id="root"></div><script src="smoke-bundle.js"></script></body></html>',
);

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(outDir, path.normalize(rel).replace(/^(\.\.[/\\])+/, ""));
  fs.readFile(filePath, (error, data) => {
    if (error) return res.writeHead(404).end("not found");
    const ext = path.extname(filePath);
    const type =
      ext === ".html" ? "text/html" : ext === ".css" ? "text/css" : "application/javascript";
    res.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(4194, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_MGMT_LOOP_B_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

async function openSupportPlan(page) {
  const url =
    "http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER";
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click(
    '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]',
  );
  await page.waitForSelector('[data-demo-ux="support-plan"]');
  await page.waitForSelector('[data-review-outcome-reason-input="true"]');
}

async function runHappyPath(name, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  const pageErrors = [];
  const externalRequests = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    const reqUrl = request.url();
    if (!reqUrl.startsWith("http://127.0.0.1:4194/")) {
      externalRequests.push(reqUrl);
    }
  });
  await openSupportPlan(page);
  await page.type(
    '[data-review-outcome-reason-input="true"]',
    "Synthetic B12 human decision reason",
  );
  await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
  await page.waitForSelector('[data-review-outcome-readback="true"]');
  await page.waitForFunction(() => {
    const button = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    return button instanceof HTMLButtonElement && !button.disabled;
  });

  const preStart = await page.evaluate(() => {
    const start = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    const createCta = document.querySelector('[data-review-new-version="create-cta"]');
    const predecessor = document.querySelector('[data-planning-pc="review-cta"]');
    const primaryActions = document.querySelectorAll('[data-sbs-action="primary"]');
    const currentVersion = document.querySelector('[data-planning-pc-version-current="true"]');
    const liveWrite = document.querySelector("[data-sbs-mgmt-loop-b-live-write]");
    const sourceSafety = document.querySelector('[data-sbs-mgmt-loop-b-source-safety="true"]');
    const startText = start?.textContent ?? "";
    const sourceSafetyText = sourceSafety?.textContent ?? "";
    return {
      startEnabled: start instanceof HTMLButtonElement && !start.disabled,
      startIsPrimary: start?.getAttribute("data-sbs-action") === "primary",
      startHasNoCreateCta: start?.getAttribute("data-review-new-version") !== "create-cta",
      // SBS-MGMT-HOME-CORRECTION-1 S-DRAFT: pre-start must not invent Draft N+1
      // from conceptualNextVersion. Draft version appears only after draft exists.
      startLabelClear:
        startText.includes("支援内容の見直しを始める") &&
        startText.includes("次版の準備") &&
        !startText.includes("版 4") &&
        !startText.includes("の下書き"),
      sourceSafetyClear:
        sourceSafetyText.includes("現在使用中の版 3 は変更しません") &&
        sourceSafetyText.includes("下書きができたときだけ未適用として示します") &&
        !sourceSafetyText.includes("の下書きを別に作ります"),
      createCtaDisabled:
        createCta instanceof HTMLButtonElement &&
        createCta.disabled &&
        createCta.getAttribute("data-sbs-action") === "tertiary",
      predecessorDemoted:
        predecessor?.getAttribute("data-sbs-action") === "tertiary" &&
        predecessor?.getAttribute("data-sbs-mgmt-loop-b-predecessor") === "demoted",
      primaryCount: primaryActions.length,
      currentVersionLabel: currentVersion?.textContent ?? "",
      liveWriteFalse: liveWrite?.getAttribute("data-sbs-mgmt-loop-b-live-write") === "false",
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });

  await page.click('[data-sbs-mgmt-loop-b-action="start-revision"]');
  await page.waitForSelector('[data-sbs-mgmt-loop-b-draft="true"]');
  // Repeated click must not create a second draft.
  await page.evaluate(() => {
    const start = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    if (start instanceof HTMLButtonElement) start.click();
  });

  const found = await page.evaluate(() => {
    const text = document.body?.textContent ?? "";
    const drafts = document.querySelectorAll('[data-sbs-mgmt-loop-b-draft="true"]');
    const draft = drafts[0];
    const boundary = document.querySelector('[data-sbs-mgmt-loop-b-boundary="true"]');
    const decision = document.querySelector('[data-sbs-mgmt-loop-b-decision="CHANGE_REQUIRED"]');
    const reason = document.querySelector('[data-sbs-mgmt-loop-b-reason="true"]');
    const primaryActions = document.querySelectorAll('[data-sbs-action="primary"]');
    const currentVersion = document.querySelector('[data-planning-pc-version-current="true"]');
    const createCta = document.querySelector('[data-review-new-version="create-cta"]');
    const startGone = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    const liveWrite = document.querySelector("[data-sbs-mgmt-loop-b-live-write]");
    const activeVersion = document.querySelector('[data-sbs-mgmt-loop-b-active-version="true"]');
    const draftLifecycle = document.querySelector('[data-sbs-mgmt-loop-b-draft-lifecycle="true"]');
    const apply = document.querySelector('[data-sbs-mgmt-plan-activation-c-action="apply"]');
    const applyText = apply?.textContent ?? "";
    const nextVersionNumber = document.querySelector(
      '[data-review-new-version="next-version-number"]',
    );
    const nextVersionBlock = document.querySelector(
      '[data-review-new-version="next-version-concept"]',
    );
    const nextVersionText = nextVersionBlock?.textContent ?? "";
    const headingTexts = [...document.querySelectorAll("h2")].map((el) => el.textContent?.trim());
    return {
      draftCount: drafts.length,
      draftHasNPlusOne: (draftLifecycle?.textContent ?? "").includes("下書き: 版 4"),
      draftKeepsSourceN: (activeVersion?.textContent ?? "").includes("適用中: 版 3"),
      draftSessionOnly: (boundary?.textContent ?? "").includes("本番には保存されていません"),
      activeVersionClear: (activeVersion?.textContent ?? "").includes("適用中: 版 3"),
      draftNotApplied: (draftLifecycle?.textContent ?? "").includes("下書き: 版 4"),
      removedLongDraftCopy: !(draft?.textContent ?? "").includes("変更内容の下書き"),
      removedSourceUnchangedCopy: !(draft?.textContent ?? "").includes("元の版: 3（変更しない）"),
      removedDraftLifecycleSentence: !(draft?.textContent ?? "").includes(
        "は下書きです。まだ適用開始されていません",
      ),
      removedDraftStatusLine: !(draft?.textContent ?? "").includes("状態: 下書き / 本番未保存"),
      // CTA-ROLE-CLARIFICATION-1: competing cold chrome hidden while draft exists.
      nextVersionHeadingGoneWhileDraft: !headingTexts.includes("次の版の考え方"),
      conceptualNextGoneWhileDraft:
        nextVersionNumber === null &&
        !nextVersionText.includes("次に重ねる概念上の版は 4") &&
        !nextVersionText.includes("次に重ねる概念上の版"),
      createCtaCopyGoneWhileDraft: !nextVersionText.includes("次の版を作る（表示専用）"),
      coldExplanationGoneWhileDraft:
        !nextVersionText.includes("次回の変更は新しい版を作ります") &&
        document.querySelector('[data-review-new-version="immutability-note"]') === null,
      keepsInvalidatingNotesWhileDraft:
        nextVersionText.includes("観察の不足だけでは") &&
        nextVersionText.includes("見直し期限の超過だけでは"),
      boundaryNoLiveWrite: (boundary?.textContent ?? "").includes("本番には保存されていません"),
      liveWriteFalse: liveWrite?.getAttribute("data-sbs-mgmt-loop-b-live-write") === "false",
      decisionPresent: Boolean(decision),
      reasonPresent: Boolean(reason),
      reasonTextPresent: text.includes("Synthetic B12 human decision reason"),
      primaryCountAfterDraft: primaryActions.length,
      currentVersionStillN: (currentVersion?.textContent ?? "").includes("版 3"),
      // CTA-ROLE-CLARIFICATION-1: display-only create-cta is hidden while draft exists.
      createCtaAbsentWhileDraft: createCta === null,
      startActionCleared: startGone === null,
      applyPresent: apply instanceof HTMLButtonElement && !apply.disabled,
      applyIsPrimary: apply?.getAttribute("data-sbs-action") === "primary",
      applyLabelClear: applyText.includes("版 4") && applyText.includes("を適用開始する"),
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });

  await page.click('[data-sbs-mgmt-plan-activation-c-action="apply"]');
  await page.waitForSelector('[data-sbs-mgmt-plan-activation-c="applied"]');

  const afterApply = await page.evaluate(() => {
    const applied = document.querySelector('[data-sbs-mgmt-plan-activation-c="applied"]');
    const appliedText = applied?.textContent ?? "";
    const active = document.querySelector(
      '[data-sbs-mgmt-plan-activation-c-active-version="true"]',
    );
    const history = document.querySelector('[data-sbs-mgmt-plan-activation-c-history="true"]');
    const receipt = document.querySelector('[data-sbs-mgmt-plan-activation-c-receipt="true"]');
    const nextVersionNumber = document.querySelector(
      '[data-review-new-version="next-version-number"]',
    );
    const nextVersionBlock = document.querySelector(
      '[data-review-new-version="next-version-concept"]',
    );
    const nextVersionText = nextVersionBlock?.textContent ?? "";
    const details = document.getElementById("planner-process-details-heading")?.closest("section");
    const draftGone = document.querySelector('[data-sbs-mgmt-loop-b-draft="true"]');
    const applyGone = document.querySelector('[data-sbs-mgmt-plan-activation-c-action="apply"]');
    const currentVersion = document.querySelector('[data-planning-pc-version-current="true"]');
    const liveWrite = document.querySelector("[data-sbs-mgmt-plan-activation-c-live-write]");
    const primaryActions = document.querySelectorAll('[data-sbs-action="primary"]');
    const headingTexts = [...document.querySelectorAll("h2")].map((el) => el.textContent?.trim());
    const createCta = document.querySelector('[data-review-new-version="create-cta"]');
    return {
      appliedPresent: Boolean(applied),
      activeIsV4: (active?.textContent ?? "").includes("現在適用中: 版 4"),
      historyIsV3: (history?.textContent ?? "").includes("過去版: 版 3"),
      receiptPresent: (receipt?.textContent ?? "").includes("適用:"),
      receiptInDetails: Boolean(details?.contains(receipt)),
      receiptNotInAppliedPrimary: !appliedText.includes("適用:"),
      conceptualMismatchGone:
        nextVersionNumber === null && !appliedText.includes("次に重ねる概念上の版"),
      nextVersionHeadingGone: !headingTexts.includes("次の版の考え方"),
      afterApplyShortNotes:
        nextVersionText.includes("次に変更するときは、新しい版を作ります。") &&
        nextVersionText.includes("現在の版はそのまま残ります。"),
      afterApplyKeepsInvalidatingNotes:
        nextVersionText.includes("観察の不足だけでは") &&
        nextVersionText.includes("見直し期限の超過だけでは"),
      // POST-APPLY-CREATE-CTA-CLARIFICATION-1: display-only create-cta must not return after Apply.
      createCtaAbsentAfterApply: createCta === null,
      createCtaCopyGoneAfterApply: !nextVersionText.includes("次の版を作る（表示専用）"),
      draftCleared: draftGone === null,
      applyCleared: applyGone === null,
      currentVersionIsV4: (currentVersion?.textContent ?? "").includes("版 4"),
      liveWriteFalse:
        liveWrite?.getAttribute("data-sbs-mgmt-plan-activation-c-live-write") === "false",
      primaryCountAfterApply: primaryActions.length,
      overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });

  const pass =
    preStart.startEnabled &&
    preStart.startIsPrimary &&
    preStart.startHasNoCreateCta &&
    preStart.startLabelClear &&
    preStart.sourceSafetyClear &&
    preStart.createCtaDisabled &&
    preStart.predecessorDemoted &&
    preStart.primaryCount === 1 &&
    preStart.liveWriteFalse &&
    !preStart.overflowX &&
    (preStart.currentVersionLabel.includes("版 3") || preStart.currentVersionLabel.includes("3")) &&
    found.draftCount === 1 &&
    found.draftHasNPlusOne &&
    found.draftKeepsSourceN &&
    found.draftSessionOnly &&
    found.activeVersionClear &&
    found.draftNotApplied &&
    found.removedLongDraftCopy &&
    found.removedSourceUnchangedCopy &&
    found.removedDraftLifecycleSentence &&
    found.removedDraftStatusLine &&
    found.boundaryNoLiveWrite &&
    found.liveWriteFalse &&
    found.decisionPresent &&
    found.reasonPresent &&
    found.reasonTextPresent &&
    found.primaryCountAfterDraft === 1 &&
    found.currentVersionStillN &&
    found.createCtaAbsentWhileDraft &&
    found.nextVersionHeadingGoneWhileDraft &&
    found.conceptualNextGoneWhileDraft &&
    found.createCtaCopyGoneWhileDraft &&
    found.coldExplanationGoneWhileDraft &&
    found.keepsInvalidatingNotesWhileDraft &&
    found.startActionCleared &&
    found.applyPresent &&
    found.applyIsPrimary &&
    found.applyLabelClear &&
    !found.overflowX &&
    afterApply.appliedPresent &&
    afterApply.activeIsV4 &&
    afterApply.historyIsV3 &&
    afterApply.receiptPresent &&
    afterApply.receiptInDetails &&
    afterApply.receiptNotInAppliedPrimary &&
    afterApply.conceptualMismatchGone &&
    afterApply.nextVersionHeadingGone &&
    afterApply.afterApplyShortNotes &&
    afterApply.afterApplyKeepsInvalidatingNotes &&
    afterApply.createCtaAbsentAfterApply &&
    afterApply.createCtaCopyGoneAfterApply &&
    afterApply.draftCleared &&
    afterApply.applyCleared &&
    afterApply.currentVersionIsV4 &&
    afterApply.liveWriteFalse &&
    afterApply.primaryCountAfterApply <= 1 &&
    !afterApply.overflowX &&
    externalRequests.length === 0;

  const screenshot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  await page.close();
  return {
    name,
    width,
    height,
    pass,
    preStart,
    found,
    afterApply,
    externalRequests,
    pageErrors,
    screenshot,
  };
}

async function runNoChangeBlocked(name, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  const pageErrors = [];
  const externalRequests = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    const reqUrl = request.url();
    if (!reqUrl.startsWith("http://127.0.0.1:4194/")) {
      externalRequests.push(reqUrl);
    }
  });
  await openSupportPlan(page);
  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForSelector('[data-review-outcome-readback="true"]');
  // Parent SupportPlan decision marker propagates via useEffect after capture readback.
  await page.waitForSelector('[data-sbs-mgmt-loop-b-decision="NO_CHANGE"]');
  const found = await page.evaluate(() => {
    const start = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    const createCta = document.querySelector('[data-review-new-version="create-cta"]');
    const draft = document.querySelector('[data-sbs-mgmt-loop-b-draft="true"]');
    const decision = document.querySelector('[data-sbs-mgmt-loop-b-decision="NO_CHANGE"]');
    const liveWrite = document.querySelector("[data-sbs-mgmt-loop-b-live-write]");
    return {
      startAbsent: start === null,
      createCtaDisabled: createCta instanceof HTMLButtonElement && createCta.disabled,
      draftAbsent: draft === null,
      decisionPresent: Boolean(decision),
      liveWriteFalse: liveWrite?.getAttribute("data-sbs-mgmt-loop-b-live-write") === "false",
    };
  });
  const pass =
    found.startAbsent &&
    found.createCtaDisabled &&
    found.draftAbsent &&
    found.decisionPresent &&
    found.liveWriteFalse &&
    externalRequests.length === 0;
  const screenshot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  await page.close();
  return { name, width, height, pass, found, externalRequests, pageErrors, screenshot };
}

async function runHistoricalStaleBlocked(name, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height });
  const pageErrors = [];
  const externalRequests = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    const reqUrl = request.url();
    if (!reqUrl.startsWith("http://127.0.0.1:4194/")) {
      externalRequests.push(reqUrl);
    }
  });
  await openSupportPlan(page);
  await page.type(
    '[data-review-outcome-reason-input="true"]',
    "Synthetic B12 human decision reason",
  );
  await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
  await page.waitForSelector('[data-review-outcome-readback="true"]');
  await page.waitForSelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
  // Select historical v2 — must not enable N+2 / must clear or block start on stale selection.
  await page.click('[data-planning-pc-version="2"]');
  await page.waitForFunction(() => {
    const selected = document.querySelector('[data-planning-pc-version="2"]');
    return selected?.getAttribute("aria-pressed") === "true";
  });
  const found = await page.evaluate(() => {
    const start = document.querySelector('[data-sbs-mgmt-loop-b-action="start-revision"]');
    const createCta = document.querySelector('[data-review-new-version="create-cta"]');
    const draft = document.querySelector('[data-sbs-mgmt-loop-b-draft="true"]');
    const currentVersion = document.querySelector('[data-planning-pc-version-current="true"]');
    const liveWrite = document.querySelector("[data-sbs-mgmt-loop-b-live-write]");
    return {
      startAbsent: start === null,
      createCtaDisabled: createCta instanceof HTMLButtonElement && createCta.disabled,
      draftAbsent: draft === null,
      currentStillN: (currentVersion?.textContent ?? "").includes("版 3"),
      liveWriteFalse: liveWrite?.getAttribute("data-sbs-mgmt-loop-b-live-write") === "false",
      textHasNoNPlusTwoDraft: !(document.body?.textContent ?? "").includes("下書き: 版 5"),
    };
  });
  const pass =
    found.startAbsent &&
    found.createCtaDisabled &&
    found.draftAbsent &&
    found.currentStillN &&
    found.liveWriteFalse &&
    found.textHasNoNPlusTwoDraft &&
    externalRequests.length === 0;
  const screenshot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: screenshot, fullPage: true });
  await page.close();
  return { name, width, height, pass, found, externalRequests, pageErrors, screenshot };
}

const cases = [
  await runHappyPath("desktop-1280x900", 1280, 900),
  await runHappyPath("mobile-390x844", 390, 844),
  await runNoChangeBlocked("desktop-no-change-blocked", 1280, 900),
  await runNoChangeBlocked("mobile-no-change-blocked", 390, 844),
  await runHistoricalStaleBlocked("desktop-historical-stale-blocked", 1280, 900),
  await runHistoricalStaleBlocked("mobile-historical-stale-blocked", 390, 844),
];
await browser.close();
server.close();

const pass = cases.every(
  (item) => item.pass && item.pageErrors.length === 0 && item.externalRequests.length === 0,
);
const report = {
  unit: "SBS-MGMT-LOOP-B",
  acceptance: "B12",
  pass,
  liveWriteAuthorized: false,
  externalRequests: 0,
  cases,
};
fs.writeFileSync(path.join(artifactsDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!pass) process.exit(1);
