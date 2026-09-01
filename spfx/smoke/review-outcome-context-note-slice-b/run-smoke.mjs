#!/usr/bin/env node
/**
 * REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B browser acceptance.
 * Synthetic fixtures only. No LIVE I/O / Deploy / SharePoint.
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
  "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js",
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

const COPY = {
  undecided: "見直し結果: 未判断",
  noChange: "デモ上の見直し結果: 変更なし",
  changeRequired: "デモ上の見直し結果: 変更が必要",
  revisionPending: "次の計画版はまだ作成されていません",
};

function observeState(page, expected) {
  return page.evaluate((value) => {
    const text = document.body.textContent ?? "";
    const q = (selector) => document.querySelector(selector);
    const buttons = [...document.querySelectorAll("[data-review-outcome-action]")];
    const textarea = q('[data-review-outcome-note-input="true"]');
    const scope = q('[data-human-review-scope-meta="true"]')?.textContent ?? "";
    const person = q('[data-human-review-person-identity="true"]')?.textContent?.trim() ?? "";
    const noteReadback = q('[data-review-outcome-note-readback="true"]')?.textContent ?? null;
    const noHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth + 1;
    const controlsDisabled = buttons.every((button) => button.disabled);
    const controlsEnabled = buttons.every((button) => !button.disabled);
    const hasUndecided = text.includes("見直し結果: 未判断");
    const hasNoChange = text.includes("デモ上の見直し結果: 変更なし");
    const hasChangeRequired = text.includes("デモ上の見直し結果: 変更が必要");
    const hasRevisionPending = text.includes("次の計画版はまだ作成されていません");
    const noteMatches =
      value.noteText === null
        ? noteReadback === null
        : noteReadback?.includes(value.noteText) === true;

    const common =
      Boolean(q('[data-human-review-status="RESOLVED"]')) &&
      person === value.person &&
      scope.includes(value.planVersionLabel) &&
      text.includes("個別の事実資料") &&
      text.includes("見直しの補足メモ（任意）") &&
      text.includes("次の計画内容ではありません") &&
      text.includes("本番には保存されていません") &&
      !text.includes("次の計画版を作成") &&
      q("[data-review-outcome-capture]")?.getAttribute("data-live-write-authorized") === "false" &&
      buttons.length === 2 &&
      Boolean(textarea) &&
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
        noteReadback === null;
    } else if (value.mode === "noChange") {
      statePass =
        hasNoChange &&
        !hasUndecided &&
        !hasChangeRequired &&
        !hasRevisionPending &&
        controlsDisabled &&
        textarea.disabled === true &&
        noteMatches;
    } else if (value.mode === "changeRequired") {
      statePass =
        hasChangeRequired &&
        hasRevisionPending &&
        !hasUndecided &&
        controlsDisabled &&
        textarea.disabled === true &&
        noteMatches;
    }

    return {
      pass: common && statePass,
      person,
      scope,
      hasUndecided,
      hasNoChange,
      hasChangeRequired,
      controlsDisabled,
      controlsEnabled,
      textareaValue: textarea?.value ?? null,
      counter: q('[data-review-outcome-note-count="true"]')?.textContent?.trim() ?? null,
      noteReadback,
      noHorizontalOverflow,
    };
  }, expected);
}

async function saveScreenshot(page, viewportName, stateName) {
  const screenshotPath = path.join(artifactsDir, `${viewportName}-${stateName}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}

async function switchContext(page) {
  await page.click('[data-smoke-switch-context="true"]');
}

async function waitForPerson(page, person) {
  await page.waitForFunction(
    (expectedPerson) =>
      document.querySelector('[data-human-review-person-identity="true"]')?.textContent?.trim() ===
      expectedPerson,
    {},
    person,
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

  // R1-R3 context-switch matrix (snapshot A v3 ↔ snapshot B v4)
  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForFunction(() =>
    document.body.textContent?.includes("デモ上の見直し結果: 変更なし"),
  );
  const captureA = await observeState(page, {
    mode: "noChange",
    person: "Aさん",
    planVersionLabel: "計画版 3",
    noteText: null,
  });

  await switchContext(page);
  await waitForPerson(page, "Bさん");
  const r1 = await observeState(page, {
    mode: "undecided",
    person: "Bさん",
    planVersionLabel: "計画版 4",
    noteText: null,
  });
  const r1Shot = await saveScreenshot(page, viewport.name, "r1-a-captured-b-undecided");

  await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
  await page.waitForFunction(() =>
    document.body.textContent?.includes("次の計画版はまだ作成されていません"),
  );
  const r2 = await observeState(page, {
    mode: "changeRequired",
    person: "Bさん",
    planVersionLabel: "計画版 4",
    noteText: null,
  });
  const r2NoAReappear =
    (await page.evaluate(() => {
      const text = document.body.textContent ?? "";
      return !text.includes("デモ上の見直し結果: 変更なし");
    })) === true;
  const r2Pass = r2.pass && r2NoAReappear;
  const r2Shot = await saveScreenshot(page, viewport.name, "r2-b-captured");

  await switchContext(page);
  await waitForPerson(page, "Aさん");
  const r3State = await page.evaluate(() => {
    const text = document.body.textContent ?? "";
    const buttons = [...document.querySelectorAll("[data-review-outcome-action]")];
    return {
      hasNoChange: text.includes("デモ上の見直し結果: 変更なし"),
      hasChangeRequired: text.includes("デモ上の見直し結果: 変更が必要"),
      hasUndecided: text.includes("見直し結果: 未判断"),
      controlsDisabled: buttons.every((button) => button.disabled),
      scope: document.querySelector('[data-human-review-scope-meta="true"]')?.textContent ?? "",
    };
  });
  const r3NoBCarryOver = !r3State.hasChangeRequired;
  const r3ARecurrence =
    r3State.hasNoChange &&
    !r3State.hasUndecided &&
    r3State.controlsDisabled &&
    r3State.scope.includes("計画版 3");
  const r3Pass = r3NoBCarryOver && r3ARecurrence;
  const r3Shot = await saveScreenshot(page, viewport.name, "r3-a-recurrence");

  // R4a: uncaptured A draft → B → draft/error reset (error path covered in component tests)
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.type('[data-review-outcome-note-input="true"]', "Aの未確定メモ");
  await switchContext(page);
  await waitForPerson(page, "Bさん");
  const r4a = await observeState(page, {
    mode: "undecided",
    person: "Bさん",
    planVersionLabel: "計画版 4",
    noteText: null,
  });
  const r4aPass = r4a.pass;
  const r4aShot = await saveScreenshot(page, viewport.name, "r4a-draft-reset");

  // R4b: captured A with note → B → local buffer reset
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.type('[data-review-outcome-note-input="true"]', "継続して観察したい");
  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForFunction(() =>
    document.body.textContent?.includes("補足メモ: 継続して観察したい"),
  );
  await switchContext(page);
  await waitForPerson(page, "Bさん");
  const r4b = await observeState(page, {
    mode: "undecided",
    person: "Bさん",
    planVersionLabel: "計画版 4",
    noteText: null,
  });
  const r4bNoAReadback = (await page.evaluate(() => {
    const text = document.body.textContent ?? "";
    return (
      !text.includes("デモ上の見直し結果: 変更なし") &&
      !text.includes("補足メモ: 継続して観察したい")
    );
  })) === true;
  const r4bPass = r4b.pass && r4bNoAReadback;
  const r4bShot = await saveScreenshot(page, viewport.name, "r4b-buffer-reset");

  // Boundary: 255 UTF-16 code units without horizontal overflow
  await page.goto(url, { waitUntil: "networkidle0" });
  await switchContext(page);
  await waitForPerson(page, "Bさん");
  await page.type('[data-review-outcome-note-input="true"]', "a".repeat(255));
  const boundary = await page.evaluate(() => {
    const counter = document
      .querySelector('[data-review-outcome-note-count="true"]')
      ?.textContent?.trim();
    const textarea = document.querySelector('[data-review-outcome-note-input="true"]');
    return {
      counter,
      valueLength: textarea?.value.length ?? null,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    };
  });
  const boundaryPass =
    boundary.counter === "255 / 255" &&
    boundary.valueLength === 255 &&
    boundary.noHorizontalOverflow;

  const pass =
    captureA.pass &&
    r1.pass &&
    r2Pass &&
    r3Pass &&
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
      R1: { ...r1, pass: r1.pass },
      R2: { ...r2, noAReappear: r2NoAReappear, pass: r2Pass },
      R3: { state: r3State, noBCarryOver: r3NoBCarryOver, aRecurrence: r3ARecurrence, pass: r3Pass },
      R4a: { ...r4a, pass: r4aPass },
      R4b: { ...r4b, noAReadback: r4bNoAReadback, pass: r4bPass },
      boundary: { ...boundary, pass: boundaryPass },
    },
    pageErrors,
    externalRequests,
    pass,
    screenshots: {
      r1Shot,
      r2Shot,
      r3Shot,
      r4aShot,
      r4bShot,
    },
  });

  allPass = allPass && pass;
  await page.close();
}

await browser.close();
server.close();

const report = {
  unit: "REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B",
  kind: "rendered browser acceptance / synthetic outcome context note",
  head: process.env.REVIEW_OUTCOME_NOTE_HEAD ?? null,
  date: new Date().toISOString(),
  acceptanceMatrix: {
    R1: "capture A → B undecided / A decision+note absent / controls enabled / textarea empty",
    R2: "capture B → B readback only / controls disabled / A cannot reappear",
    R3: "B → A recurrence → A prior capture isolated / B mismatch absent / A readback restored",
    R4a: "uncaptured A draft+error → B → draft/error reset",
    R4b: "captured A note → B → buffer reset / no A readback on B",
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
