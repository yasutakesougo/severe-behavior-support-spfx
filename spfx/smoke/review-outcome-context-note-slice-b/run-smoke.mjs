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

const esbuildModule = await import("/tmp/node_modules/esbuild/lib/main.js").catch(
  () => import("/tmp/hr-smoke-runner/node_modules/esbuild/lib/main.js"),
);
const puppeteerModule =
  await import("/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js").catch(
    () =>
      import("/tmp/hr-smoke-runner/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"),
  );
const sassModule = await import("/tmp/node_modules/sass/sass.node.mjs").catch(
  () => import("/tmp/hr-smoke-runner/node_modules/sass/sass.node.mjs"),
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

  async function observe({ decisionCopy, revisionPending, noteText, disabled, person = "Aさん" }) {
    return page.evaluate(
      ({ decisionCopy, revisionPending, noteText, disabled, person }) => {
        const text = document.body.textContent ?? "";
        const q = (selector) => document.querySelector(selector);
        const buttons = [...document.querySelectorAll("[data-review-outcome-action]")];
        const textarea = q('[data-review-outcome-note-input="true"]');
        const scope = q('[data-human-review-scope-meta="true"]')?.textContent ?? "";
        const personText = q('[data-human-review-person-identity="true"]')?.textContent?.trim();
        const capture = q("[data-review-outcome-capture]");
        const liveWrite = capture?.getAttribute("data-live-write-authorized");
        const noteReadback = q('[data-review-outcome-note-readback="true"]')?.textContent ?? null;
        const noHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth + 1;
        const common =
          Boolean(q('[data-human-review-status="RESOLVED"]')) &&
          personText === person &&
          scope.includes("計画版 3") &&
          text.includes("個別の事実資料") &&
          text.includes("見直しの補足メモ（任意）") &&
          text.includes("次の計画内容ではありません") &&
          text.includes("本番には保存されていません") &&
          !text.includes("次の計画版を作成") &&
          liveWrite === "false" &&
          buttons.length === 2 &&
          Boolean(textarea) &&
          noHorizontalOverflow;
        const noteMatches = noteText === null ? noteReadback === null : noteReadback?.includes(noteText);
        return {
          pass:
            common &&
            text.includes(decisionCopy) &&
            text.includes("次の計画版はまだ作成されていません") === revisionPending &&
            buttons.every((button) => button.disabled === disabled) &&
            textarea.disabled === disabled &&
            noteMatches,
          textareaValue: textarea?.value ?? null,
          counter: q('[data-review-outcome-note-count="true"]')?.textContent?.trim() ?? null,
          noHorizontalOverflow,
        };
      },
      { decisionCopy, revisionPending, noteText, disabled, person },
    );
  }

  await page.goto(url, { waitUntil: "networkidle0" });
  const undecided = await observe({
    decisionCopy: "見直し結果: 未判断",
    revisionPending: false,
    noteText: null,
    disabled: false,
  });
  const undecidedShot = path.join(artifactsDir, `${viewport.name}-undecided.png`);
  await page.screenshot({ path: undecidedShot, fullPage: true });

  await page.type('[data-review-outcome-note-input="true"]', "継続して観察したい");
  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForFunction(
    () => document.body.textContent?.includes("補足メモ: 継続して観察したい") === true,
  );
  const noChangeWithNote = await observe({
    decisionCopy: "デモ上の見直し結果: 変更なし",
    revisionPending: false,
    noteText: "継続して観察したい",
    disabled: true,
  });
  const noChangeShot = path.join(artifactsDir, `${viewport.name}-no-change-with-note.png`);
  await page.screenshot({ path: noChangeShot, fullPage: true });

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
  await page.waitForFunction(
    () => document.body.textContent?.includes("次の計画版はまだ作成されていません") === true,
  );
  const changeRequiredBlank = await observe({
    decisionCopy: "デモ上の見直し結果: 変更が必要",
    revisionPending: true,
    noteText: null,
    disabled: true,
  });
  const changeRequiredShot = path.join(artifactsDir, `${viewport.name}-change-required-blank.png`);
  await page.screenshot({ path: changeRequiredShot, fullPage: true });

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.type('[data-review-outcome-note-input="true"]', "Aの未確定メモ");
  await page.click('[data-smoke-switch-context="true"]');
  await page.waitForFunction(
    () =>
      document.querySelector('[data-human-review-person-identity="true"]')?.textContent?.trim() ===
      "Bさん",
  );
  const contextReset = await observe({
    decisionCopy: "見直し結果: 未判断",
    revisionPending: false,
    noteText: null,
    disabled: false,
    person: "Bさん",
  });
  const resetPass =
    contextReset.pass && contextReset.textareaValue === "" && contextReset.counter === "0 / 255";
  const resetShot = path.join(artifactsDir, `${viewport.name}-context-reset.png`);
  await page.screenshot({ path: resetShot, fullPage: true });

  await page.type('[data-review-outcome-note-input="true"]', "a".repeat(255));
  const boundary = await page.evaluate(() => {
    const counter = document
      .querySelector('[data-review-outcome-note-count="true"]')
      ?.textContent?.trim();
    const textarea = document.querySelector('[data-review-outcome-note-input="true"]');
    return {
      counter,
      valueLength: textarea?.value.length,
      noHorizontalOverflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    };
  });
  const boundaryPass =
    boundary.counter === "255 / 255" &&
    boundary.valueLength === 255 &&
    boundary.noHorizontalOverflow;

  const pass =
    undecided.pass &&
    noChangeWithNote.pass &&
    changeRequiredBlank.pass &&
    resetPass &&
    boundaryPass &&
    pageErrors.length === 0 &&
    externalRequests.length === 0;
  checks.push({
    viewport,
    url,
    undecided,
    noChangeWithNote,
    changeRequiredBlank,
    contextReset,
    resetPass,
    boundary,
    boundaryPass,
    pageErrors,
    externalRequests,
    pass,
    screenshots: { undecidedShot, noChangeShot, changeRequiredShot, resetShot },
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
  allPass,
  checks,
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(__dirname, "smoke-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ allPass, artifactsDir, viewports: checks.length }, null, 2));
process.exit(allPass ? 0 : 1);
