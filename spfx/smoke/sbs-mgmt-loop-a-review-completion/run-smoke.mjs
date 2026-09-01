#!/usr/bin/env node
/**
 * SBS-MGMT-LOOP-A (#552) rendered browser acceptance.
 * Synthetic fixtures only. No LIVE I/O / Deploy / SharePoint.
 */
import { execFileSync } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const repositoryRoot = path.join(spfxRoot, "..");
const artifactsDir =
  process.env.SBS_MGMT_LOOP_A_ARTIFACTS_DIR ?? "/tmp/sbs-mgmt-loop-a-review-completion";
const PRODUCT_BASIS_HEAD =
  process.env.SBS_MGMT_LOOP_A_PRODUCT_BASIS_HEAD ??
  execFileSync("git", ["rev-parse", "HEAD"], { cwd: repositoryRoot, encoding: "utf8" }).trim();

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
  compile(path.join(spfxRoot, "src/shell/monitoring/MonitoringViewUx.module.scss"), {
    style: "expanded",
  }).css,
);
const captureCss = normalizeSpfxThemeCss(
  compile(path.join(spfxRoot, "src/shell/monitoring/ReviewOutcomeCaptureView.module.scss"), {
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
  nodePaths: [path.join(spfxRoot, "node_modules")],
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
await new Promise((resolve) => server.listen(4197, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_MGMT_LOOP_A_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const viewports = [
  { name: "desktop-1280x900", width: 1280, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844 },
];

function observe(page) {
  return page.evaluate(() => {
    const text = document.body.textContent ?? "";
    const q = (selector) => document.querySelector(selector);
    const buttons = [...document.querySelectorAll("[data-review-outcome-action]")];
    const reason = q('[data-review-outcome-reason-input="true"]');
    const note = q('[data-review-outcome-note-input="true"]');
    const reasonReadback = q('[data-review-outcome-reason-readback="true"]')?.textContent ?? null;
    const noteReadback = q('[data-review-outcome-note-readback="true"]')?.textContent ?? null;
    const recordId =
      q("[data-human-review-record-id]")?.getAttribute("data-human-review-record-id") ?? null;
    return {
      text,
      recordId,
      reasonValue: reason?.value ?? null,
      noteValue: note?.value ?? null,
      reasonDisabled: reason?.disabled ?? null,
      noteDisabled: note?.disabled ?? null,
      buttonsDisabled: buttons.length === 2 && buttons.every((button) => button.disabled),
      buttonsEnabled: buttons.length === 2 && buttons.every((button) => !button.disabled),
      reasonReadback,
      noteReadback,
      zeroState: Boolean(q('[data-human-review-empty="true"]')),
      liveWrite:
        q("[data-review-outcome-capture]")?.getAttribute("data-live-write-authorized") ?? null,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    };
  });
}

async function setSnapshot(page, snapshot) {
  await page.click(`[data-smoke-snapshot="${snapshot}"]`);
  if (snapshot === "ZERO") {
    await page.waitForSelector('[data-human-review-empty="true"]');
    return;
  }
  const expectedRecordId = snapshot === "A" ? "record-a" : "record-b";
  await page.waitForFunction(
    (recordId) =>
      document
        .querySelector("[data-human-review-record-id]")
        ?.getAttribute("data-human-review-record-id") === recordId,
    {},
    expectedRecordId,
  );
}

async function screenshot(page, viewport, name) {
  const output = path.join(artifactsDir, `${viewport}-${name}.png`);
  await page.screenshot({ path: output, fullPage: true });
  return output;
}

function check(name, pass, details = {}) {
  return { name, pass: Boolean(pass), details };
}

const checks = [];
let allPass = true;

try {
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

    await page.goto("http://127.0.0.1:4197/index.html", { waitUntil: "networkidle0" });
    await setSnapshot(page, "A");

    const initial = await observe(page);
    checks.push(
      check(
        `${viewport.name}: common boundary`,
        initial.text.includes("Aさん") &&
          initial.text.includes("計画版 3") &&
          initial.text.includes("判断理由") &&
          initial.text.includes("見直しの補足メモ（任意）") &&
          initial.text.includes("本番には保存されていません") &&
          initial.liveWrite === "false" &&
          initial.buttonsEnabled &&
          initial.noHorizontalOverflow,
        initial,
      ),
    );

    await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
    await page.waitForFunction(() =>
      document.body.textContent?.includes("「変更が必要」を記録する場合は、判断理由を入力してください。"),
    );
    const blankChange = await observe(page);
    checks.push(
      check(
        `${viewport.name}: R3 blank CHANGE_REQUIRED blocked`,
        blankChange.text.includes("見直し結果: 未判断") &&
          blankChange.text.includes(
            "「変更が必要」を記録する場合は、判断理由を入力してください。",
          ) &&
          blankChange.reasonReadback === null &&
          blankChange.noteReadback === null &&
          blankChange.buttonsEnabled,
        blankChange,
      ),
    );

    await page.type('[data-review-outcome-reason-input="true"]', "reason A");
    await page.type('[data-review-outcome-note-input="true"]', "memo A");
    await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
    await page.waitForFunction(() => document.body.textContent?.includes("判断理由: reason A"));
    const capturedA = await observe(page);
    checks.push(
      check(
        `${viewport.name}: R2/R9 capture A reason+note immutable`,
        capturedA.text.includes("デモ上の見直し結果: 変更が必要") &&
          capturedA.reasonReadback === "判断理由: reason A" &&
          capturedA.noteReadback === "補足メモ: memo A" &&
          capturedA.buttonsDisabled &&
          capturedA.reasonDisabled === true &&
          capturedA.noteDisabled === true,
        capturedA,
      ),
    );
    await screenshot(page, viewport.name, "captured-a");

    await setSnapshot(page, "B");
    const mismatchB = await observe(page);
    checks.push(
      check(
        `${viewport.name}: R9 A→B mismatch undecided`,
        mismatchB.recordId === "record-b" &&
          mismatchB.text.includes("見直し結果: 未判断") &&
          mismatchB.reasonReadback === null &&
          mismatchB.noteReadback === null &&
          mismatchB.reasonValue === "" &&
          mismatchB.noteValue === "" &&
          mismatchB.buttonsEnabled,
        mismatchB,
      ),
    );

    await page.type('[data-review-outcome-note-input="true"]', "memo B");
    await page.click('[data-review-outcome-action="NO_CHANGE"]');
    await page.waitForFunction(() => document.body.textContent?.includes("補足メモ: memo B"));
    const capturedB = await observe(page);
    checks.push(
      check(
        `${viewport.name}: R1 NO_CHANGE blank reason`,
        capturedB.text.includes("デモ上の見直し結果: 変更なし") &&
          capturedB.reasonReadback === null &&
          capturedB.noteReadback === "補足メモ: memo B" &&
          capturedB.buttonsDisabled,
        capturedB,
      ),
    );

    await setSnapshot(page, "A");
    const recurrenceA = await observe(page);
    checks.push(
      check(
        `${viewport.name}: R10 B→A recurrence new epoch`,
        recurrenceA.recordId === "record-a" &&
          recurrenceA.text.includes("見直し結果: 未判断") &&
          recurrenceA.reasonReadback === null &&
          recurrenceA.noteReadback === null &&
          recurrenceA.reasonValue === "" &&
          recurrenceA.noteValue === "" &&
          recurrenceA.buttonsEnabled,
        recurrenceA,
      ),
    );

    await page.type('[data-review-outcome-reason-input="true"]', "reason renewed");
    await page.type('[data-review-outcome-note-input="true"]', "memo renewed");
    await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
    await page.waitForFunction(() => document.body.textContent?.includes("判断理由: reason renewed"));
    const recapturedA = await observe(page);
    checks.push(
      check(
        `${viewport.name}: R10 recapture A replaces current only`,
        recapturedA.reasonReadback === "判断理由: reason renewed" &&
          recapturedA.noteReadback === "補足メモ: memo renewed" &&
          !recapturedA.text.includes("reason A") &&
          !recapturedA.text.includes("memo A") &&
          !recapturedA.text.includes("memo B"),
        recapturedA,
      ),
    );

    await setSnapshot(page, "ZERO");
    const zeroUndecided = await observe(page);
    checks.push(
      check(
        `${viewport.name}: zero-record remains factual`,
        zeroUndecided.zeroState &&
          zeroUndecided.text.includes("この計画版・対象期間に一致する実施記録はありません。") &&
          zeroUndecided.text.includes("0件であることは、「実施できなかった」という結果を意味しません。") &&
          zeroUndecided.text.includes("見直し結果: 未判断") &&
          zeroUndecided.reasonReadback === null,
        zeroUndecided,
      ),
    );
    await page.click('[data-review-outcome-action="NO_CHANGE"]');
    await page.waitForFunction(() => document.body.textContent?.includes("デモ上の見直し結果: 変更なし"));
    const zeroNoChange = await observe(page);
    checks.push(
      check(
        `${viewport.name}: R4 zero-record NO_CHANGE blank reason`,
        zeroNoChange.zeroState &&
          zeroNoChange.reasonReadback === null &&
          zeroNoChange.noteReadback === null &&
          zeroNoChange.buttonsDisabled,
        zeroNoChange,
      ),
    );

    await page.goto("http://127.0.0.1:4197/index.html", { waitUntil: "networkidle0" });
    await setSnapshot(page, "A");
    await page.type('[data-review-outcome-reason-input="true"]', "uncommitted A reason");
    await page.type('[data-review-outcome-note-input="true"]', "uncommitted A memo");
    await setSnapshot(page, "B");
    const uncommittedReset = await observe(page);
    checks.push(
      check(
        `${viewport.name}: R11 uncommitted A→B reset`,
        uncommittedReset.reasonValue === "" &&
          uncommittedReset.noteValue === "" &&
          uncommittedReset.reasonReadback === null &&
          uncommittedReset.noteReadback === null &&
          !uncommittedReset.text.includes("uncommitted A reason") &&
          !uncommittedReset.text.includes("uncommitted A memo"),
        uncommittedReset,
      ),
    );

    checks.push(
      check(
        `${viewport.name}: browser safety`,
        pageErrors.length === 0 && externalRequests.length === 0,
        { pageErrors, externalRequests },
      ),
    );
    await screenshot(page, viewport.name, "final-b-reset");
    await page.close();
  }

  for (const entry of checks) {
    if (!entry.pass) allPass = false;
  }

  const report = {
    unit: "SBS-MGMT-LOOP-A",
    issue: 552,
    productBasisHead: PRODUCT_BASIS_HEAD,
    generatedAt: new Date().toISOString(),
    viewports,
    checks,
    pass: allPass,
    liveWriteAuthorized: false,
  };
  fs.writeFileSync(path.join(artifactsDir, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log(allPass ? "SBS-MGMT-LOOP-A SMOKE PASS" : "SBS-MGMT-LOOP-A SMOKE FAIL");
  if (!allPass) process.exitCode = 1;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
