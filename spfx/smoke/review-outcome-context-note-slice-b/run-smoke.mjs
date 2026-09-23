#!/usr/bin/env node
/**
 * REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B browser acceptance.
 * Synthetic fixtures only. No LIVE I/O / Deploy / SharePoint.
 *
 * Product basis: #558 corrected HEAD (capturedReviewMatchesMaterials / current-only epoch).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.REVIEW_OUTCOME_NOTE_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/review-outcome-context-note-slice-b-browser-smoke";
const PRODUCT_BASIS_HEAD =
  process.env.REVIEW_OUTCOME_PRODUCT_BASIS_HEAD ?? "3e4a035c3e70474e28dd26fbdfb49ab794c23090";

fs.mkdirSync(artifactsDir, { recursive: true });

async function importWithFallback(primaryPath, fallbackPath) {
  try {
    return await import(primaryPath);
  } catch {
    return import(fallbackPath);
  }
}

const esbuildModule = await importWithFallback(
  "/tmp/node_modules/esbuild/lib/main.js",
  "/tmp/hr-smoke-runner/node_modules/esbuild/lib/main.js",
);
const puppeteerModule = await importWithFallback(
  "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js",
  "/tmp/hr-smoke-runner/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js",
);
const sassModule = await importWithFallback(
  "/tmp/node_modules/sass/sass.node.mjs",
  "/tmp/hr-smoke-runner/node_modules/sass/sass.node.mjs",
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compile = sassModule.compile ?? sassModule.default?.compile;

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const monitoringCss = normalizeSpfxThemeCss(
  compile(path.join(repoRoot, "src/shell/monitoring/MonitoringViewUx.module.scss"), {
    style: "expanded",
  }).css,
);
const captureCss = normalizeSpfxThemeCss(
  compile(path.join(repoRoot, "src/shell/monitoring/ReviewOutcomeCaptureView.module.scss"), {
    style: "expanded",
  }).css,
);
fs.writeFileSync(
  path.join(__dirname, "smoke-production.css"),
  `html,body{margin:0;padding:16px;box-sizing:border-box;background:#f3f2f1}*,*::before,*::after{box-sizing:inherit}${monitoringCss}\n${captureCss}`,
);

const scssStubPlugin = {
  name: "scss-module-stub",
  setup(build) {
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, "utf8");
      const keys = new Set();
      for (const match of text.matchAll(/\.([A-Za-z_][\w-]*)\s*[,:{]/g)) keys.add(match[1]);
      const entries = [...keys]
        .map((key) => `${JSON.stringify(key)}:${JSON.stringify(key)}`)
        .join(",");
      return { contents: `export default {${entries}};`, loader: "js" };
    });
  },
};

await esbuild.build({
  entryPoints: [path.join(__dirname, "smoke-entry.tsx")],
  bundle: true,
  outfile: path.join(__dirname, "smoke-bundle.js"),
  format: "iife",
  platform: "browser",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  plugins: [scssStubPlugin],
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  define: { "process.env.NODE_ENV": '"production"' },
  nodePaths: [path.join(repoRoot, "node_modules")],
});

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
  const filePath = path.join(__dirname, rel);
  if (!filePath.startsWith(__dirname)) return res.writeHead(403).end("forbidden");
  fs.readFile(filePath, (error, data) => {
    if (error) return res.writeHead(404).end("not found");
    const type = filePath.endsWith(".html")
      ? "text/html; charset=utf-8"
      : filePath.endsWith(".js")
        ? "application/javascript; charset=utf-8"
        : "text/css; charset=utf-8";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(4195, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.REVIEW_OUTCOME_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const viewports = [
  { name: "desktop-1280x900", width: 1280, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844 },
];

const PERSON = "Aさん";
const PLAN_VERSION_LABEL = "計画版 3";
const RECORD_A = "record-a";
const RECORD_B = "record-b";

function observeState(page, expected) {
  return page.evaluate((value) => {
    const text = document.body.textContent ?? "";
    const q = (selector) => document.querySelector(selector);
    const buttons = [...document.querySelectorAll("[data-review-outcome-action]")];
    const textarea = q('[data-review-outcome-reason-input="true"]');
    const scope = q('[data-human-review-scope-meta="true"]')?.textContent ?? "";
    const person = q('[data-human-review-person-identity="true"]')?.textContent?.trim() ?? "";
    const recordId =
      q("[data-human-review-record-id]")?.getAttribute("data-human-review-record-id") ?? "";
    const reasonReadback = q('[data-review-outcome-reason-readback="true"]')?.textContent ?? null;
    const noHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth + 1;
    const controlsDisabled = buttons.every((button) => button.disabled);
    const controlsEnabled = buttons.every((button) => !button.disabled);
    const hasUndecided = text.includes("見直し結果: 未判断");
    const hasNoChange = text.includes("デモ上の見直し結果: 変更なし");
    const hasChangeRequired = text.includes("デモ上の見直し結果: 変更が必要");
    const hasRevisionPending = text.includes("次の計画版はまだ作成されていません");
    const reasonMatches =
      value.reasonText === null
        ? reasonReadback === null
        : reasonReadback?.includes(value.reasonText) === true;

    const common =
      q('[data-monitoring-review-authority="FOUND"]') !== null &&
      Boolean(q('[data-human-review-status="RESOLVED"]')) &&
      person === value.person &&
      recordId === value.recordId &&
      scope.includes(value.planVersionLabel) &&
      text.includes("個別の事実資料") &&
      text.includes("判断理由") &&
      text.includes("本番には保存されていません") &&
      !text.includes("次の計画版を作成") &&
      q("[data-review-outcome-capture]")?.getAttribute("data-live-write-authorized") === "false" &&
      (value.mode === "undecided"
        ? buttons.length === 2 && Boolean(textarea)
        : buttons.length === 0 && textarea === null) &&
      noHorizontalOverflow;

    let statePass = false;
    if (value.mode === "undecided") {
      statePass =
        hasUndecided &&
        !hasNoChange &&
        !hasChangeRequired &&
        controlsEnabled &&
        textarea.disabled === false &&
        textarea.value === "" &&
        reasonReadback === null;
    } else if (value.mode === "noChange") {
      statePass =
        hasNoChange &&
        !hasUndecided &&
        !hasChangeRequired &&
        !hasRevisionPending &&
        controlsDisabled &&
        textarea === null &&
        reasonMatches;
    } else if (value.mode === "changeRequired") {
      statePass =
        hasChangeRequired &&
        !hasUndecided &&
        controlsDisabled &&
        textarea === null &&
        reasonMatches;
    }

    return {
      pass: common && statePass,
      person,
      recordId,
      scope,
      hasUndecided,
      hasNoChange,
      hasChangeRequired,
      controlsDisabled,
      controlsEnabled,
      textareaValue: textarea?.value ?? null,
      reasonReadback,
      noHorizontalOverflow,
    };
  }, expected);
}

async function saveScreenshot(page, viewportName, stateName) {
  const screenshotPath = path.join(artifactsDir, `${viewportName}-${stateName}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}

async function switchSnapshot(page) {
  await page.click('[data-smoke-switch-context="true"]');
}

async function waitForRecordId(page, recordId) {
  await page.waitForFunction(
    (expectedRecordId) =>
      document
        .querySelector("[data-human-review-record-id]")
        ?.getAttribute("data-human-review-record-id") === expectedRecordId,
    {},
    recordId,
  );
}

const checks = [];
let allPass = true;

for (const viewport of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height });
  const pageErrors = [];
  const externalRequests = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("request", (request) => {
    const requestUrl = new URL(request.url());
    if (requestUrl.hostname !== "127.0.0.1") externalRequests.push(request.url());
  });
  const url = "http://127.0.0.1:4195/index.html";

  await page.goto(url, { waitUntil: "networkidle0" });
  await waitForRecordId(page, RECORD_A);

  // R1: capture snapshot A → same-key snapshot B → undecided / A absent / controls enabled
  await page.type('[data-review-outcome-reason-input="true"]', "reason A");
  await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
  await page.waitForFunction(() => document.body.textContent?.includes("判断理由: reason A"));
  const captureA = await observeState(page, {
    mode: "changeRequired",
    person: PERSON,
    recordId: RECORD_A,
    planVersionLabel: PLAN_VERSION_LABEL,
    reasonText: "reason A",
  });

  await switchSnapshot(page);
  await waitForRecordId(page, RECORD_B);
  const r1 = await observeState(page, {
    mode: "undecided",
    person: PERSON,
    recordId: RECORD_B,
    planVersionLabel: PLAN_VERSION_LABEL,
    reasonText: null,
  });
  const r1NoAReadback =
    (await page.evaluate(() => {
      const text = document.body.textContent ?? "";
      return (
        !text.includes("デモ上の見直し結果: 変更が必要") && !text.includes("判断理由: reason A")
      );
    })) === true;
  const r1Pass = r1.pass && r1NoAReadback;
  const r1Shot = await saveScreenshot(page, viewport.name, "r1-b-undecided");

  // R2: capture B → B readback only / controls disabled / A cannot reappear
  await page.type('[data-review-outcome-reason-input="true"]', "reason B");
  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForFunction(() => document.body.textContent?.includes("判断理由: reason B"));
  const r2 = await observeState(page, {
    mode: "noChange",
    person: PERSON,
    recordId: RECORD_B,
    planVersionLabel: PLAN_VERSION_LABEL,
    reasonText: "reason B",
  });
  const r2NoAReappear =
    (await page.evaluate(() => {
      const text = document.body.textContent ?? "";
      return !text.includes("判断理由: reason A");
    })) === true;
  const r2Pass = r2.pass && r2NoAReappear;
  const r2Shot = await saveScreenshot(page, viewport.name, "r2-b-captured");

  // R3: B → A recurrence → MISMATCH → undecided → recapture allowed
  await switchSnapshot(page);
  await waitForRecordId(page, RECORD_A);
  const r3 = await observeState(page, {
    mode: "undecided",
    person: PERSON,
    recordId: RECORD_A,
    planVersionLabel: PLAN_VERSION_LABEL,
    reasonText: null,
  });
  const r3NoBCarryOver =
    (await page.evaluate(() => {
      const text = document.body.textContent ?? "";
      return !text.includes("デモ上の見直し結果: 変更なし") && !text.includes("判断理由: reason B");
    })) === true;
  const r3Pass = r3.pass && r3NoBCarryOver;
  const r3Shot = await saveScreenshot(page, viewport.name, "r3-a-mismatch-undecided");

  await page.type('[data-review-outcome-reason-input="true"]', "reason renewed");
  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForFunction(() => document.body.textContent?.includes("判断理由: reason renewed"));
  const r3Recapture = await observeState(page, {
    mode: "noChange",
    person: PERSON,
    recordId: RECORD_A,
    planVersionLabel: PLAN_VERSION_LABEL,
    reasonText: "reason renewed",
  });
  const r3RecaptureIsolated =
    (await page.evaluate(() => {
      const text = document.body.textContent ?? "";
      const readbacks = [
        ...document.querySelectorAll('[data-review-outcome-reason-readback="true"]'),
      ];
      return (
        readbacks.length === 1 &&
        readbacks[0]?.textContent === "判断理由: reason renewed" &&
        !text.includes("判断理由: reason A") &&
        !text.includes("判断理由: reason B")
      );
    })) === true;
  const r3RecapturePass = r3Recapture.pass && r3RecaptureIsolated;

  // R4a: uncaptured A draft → snapshot B → draft reset
  await page.goto(url, { waitUntil: "networkidle0" });
  await waitForRecordId(page, RECORD_A);
  await page.type('[data-review-outcome-reason-input="true"]', "Aの未確定理由");
  await switchSnapshot(page);
  await waitForRecordId(page, RECORD_B);
  const r4a = await observeState(page, {
    mode: "undecided",
    person: PERSON,
    recordId: RECORD_B,
    planVersionLabel: PLAN_VERSION_LABEL,
    reasonText: null,
  });
  const r4aPass = r4a.pass;
  const r4aShot = await saveScreenshot(page, viewport.name, "r4a-draft-reset");

  // R4b: captured A reason → snapshot B → buffer reset
  await page.goto(url, { waitUntil: "networkidle0" });
  await waitForRecordId(page, RECORD_A);
  await page.type('[data-review-outcome-reason-input="true"]', "継続して観察したい");
  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForFunction(() =>
    document.body.textContent?.includes("判断理由: 継続して観察したい"),
  );
  await switchSnapshot(page);
  await waitForRecordId(page, RECORD_B);
  const r4b = await observeState(page, {
    mode: "undecided",
    person: PERSON,
    recordId: RECORD_B,
    planVersionLabel: PLAN_VERSION_LABEL,
    reasonText: null,
  });
  const r4bNoAReadback =
    (await page.evaluate(() => {
      const text = document.body.textContent ?? "";
      return (
        !text.includes("デモ上の見直し結果: 変更なし") &&
        !text.includes("判断理由: 継続して観察したい")
      );
    })) === true;
  const r4bPass = r4b.pass && r4bNoAReadback;
  const r4bShot = await saveScreenshot(page, viewport.name, "r4b-buffer-reset");

  // Boundary: 255 UTF-16 code units without horizontal overflow
  await page.goto(url, { waitUntil: "networkidle0" });
  await switchSnapshot(page);
  await waitForRecordId(page, RECORD_B);
  await page.type('[data-review-outcome-reason-input="true"]', "a".repeat(255));
  const boundary = await page.evaluate(() => {
    const textarea = document.querySelector('[data-review-outcome-reason-input="true"]');
    return {
      valueLength: textarea?.value.length ?? null,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    };
  });
  const boundaryPass = boundary.valueLength === 255 && boundary.noHorizontalOverflow;

  const pass =
    captureA.pass &&
    r1Pass &&
    r2Pass &&
    r3Pass &&
    r3RecapturePass &&
    r4aPass &&
    r4bPass &&
    boundaryPass &&
    pageErrors.length === 0 &&
    externalRequests.length === 0;

  checks.push({
    viewport,
    url,
    scenarios: {
      captureA,
      R1: { ...r1, noAReadback: r1NoAReadback, pass: r1Pass },
      R2: { ...r2, noAReappear: r2NoAReappear, pass: r2Pass },
      R3: {
        mismatchUndecided: { ...r3, noBCarryOver: r3NoBCarryOver, pass: r3Pass },
        recapture: { ...r3Recapture, isolated: r3RecaptureIsolated, pass: r3RecapturePass },
      },
      R4a: { ...r4a, pass: r4aPass },
      R4b: { ...r4b, noAReadback: r4bNoAReadback, pass: r4bPass },
      boundary: { ...boundary, pass: boundaryPass },
    },
    pageErrors,
    externalRequests,
    pass,
    screenshots: { r1Shot, r2Shot, r3Shot, r4aShot, r4bShot },
  });

  allPass = allPass && pass;
  await page.close();
}

await browser.close();
server.close();

const report = {
  unit: "REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B",
  kind: "rendered browser acceptance / synthetic outcome context note",
  productBasisHead: PRODUCT_BASIS_HEAD,
  smokeHead: process.env.REVIEW_OUTCOME_NOTE_HEAD ?? null,
  date: new Date().toISOString(),
  acceptanceMatrix: {
    R1: "capture snapshot A → same-key snapshot B → undecided / A decision reason absent / controls enabled / textarea empty",
    R2: "capture snapshot B → B readback only / controls disabled / A cannot reappear",
    R3: "B → A recurrence → MISMATCH → undecided / B decision reason absent / recapture allowed as new epoch",
    R4a: "uncaptured A draft → snapshot B → draft reset",
    R4b: "captured A decision reason → snapshot B → buffer reset / no A readback on B",
    viewport: "1280×900 + 390×844",
    pageErrors: 0,
    externalRequests: 0,
    horizontalOverflow: 0,
  },
  allPass,
  checks,
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(__dirname, "smoke-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ allPass, artifactsDir, viewports: checks.length }, null, 2));
process.exit(allPass ? 0 : 1);
