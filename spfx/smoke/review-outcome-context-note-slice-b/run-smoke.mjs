#!/usr/bin/env node
/**
 * REVIEW-OUTCOME-CONTEXT-NOTE-SLICE-B browser acceptance.
 * Synthetic fixtures only. No LIVE I/O / Deploy / SharePoint.
 */
import fs from "node:fs";
import http from "node:http";
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

function compileScss(relativePath) {
  const fullPath = path.join(repoRoot, relativePath);
  const compiled = compile(fullPath, { style: "expanded" }).css;
  return normalizeSpfxThemeCss(compiled);
}

const monitoringCss = compileScss(
  "src/shell/monitoring/MonitoringViewUx.module.scss",
);
const captureCss = compileScss(
  "src/shell/monitoring/ReviewOutcomeCaptureView.module.scss",
);
const baseCss =
  "html,body{margin:0;padding:16px;box-sizing:border-box;background:#f3f2f1}" +
  "*,*::before,*::after{box-sizing:inherit}";

fs.writeFileSync(
  path.join(__dirname, "smoke-production.css"),
  `${baseCss}${monitoringCss}\n${captureCss}`,
);

const scssStubPlugin = {
  name: "scss-module-stub",
  setup(build) {
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, "utf8");
      const keys = new Set();
      const pattern = /\.([A-Za-z_][\w-]*)\s*[,:{]/g;

      for (const match of text.matchAll(pattern)) {
        keys.add(match[1]);
      }

      const entries = [...keys]
        .map((key) => `${JSON.stringify(key)}:${JSON.stringify(key)}`)
        .join(",");

      return {
        contents: `export default {${entries}};`,
        loader: "js",
      };
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

function contentTypeFor(filePath) {
  if (filePath.endsWith(".html")) {
    return "text/html; charset=utf-8";
  }
  if (filePath.endsWith(".js")) {
    return "application/javascript; charset=utf-8";
  }
  return "text/css; charset=utf-8";
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const relativePath =
    url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
  const filePath = path.join(__dirname, relativePath);

  if (!filePath.startsWith(__dirname)) {
    response.writeHead(403).end("forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404).end("not found");
      return;
    }
    response.writeHead(200, { "Content-Type": contentTypeFor(filePath) });
    response.end(data);
  });
});

await new Promise((resolve) => {
  server.listen(4195, "127.0.0.1", resolve);
});

const browser = await puppeteer.launch({
  executablePath:
    process.env.REVIEW_OUTCOME_CHROME_PATH ??
    "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const viewports = [
  { name: "desktop-1280x900", width: 1280, height: 900 },
  { name: "mobile-390x844", width: 390, height: 844 },
];
const checks = [];
let allPass = true;

async function observe(page, expected) {
  return page.evaluate((value) => {
    const query = (selector) => document.querySelector(selector);
    const text = document.body.textContent ?? "";
    const buttons = [
      ...document.querySelectorAll("[data-review-outcome-action]"),
    ];
    const textarea = query('[data-review-outcome-note-input="true"]');
    const scope =
      query('[data-human-review-scope-meta="true"]')?.textContent ?? "";
    const person = query(
      '[data-human-review-person-identity="true"]',
    )?.textContent?.trim();
    const capture = query("[data-review-outcome-capture]");
    const liveWrite = capture?.getAttribute("data-live-write-authorized");
    const noteReadback = query(
      '[data-review-outcome-note-readback="true"]',
    )?.textContent;
    const noOverflow =
      document.documentElement.scrollWidth <= window.innerWidth + 1;
    const hasCommonCopy =
      text.includes("見直しの補足メモ（任意）") &&
      text.includes("次の計画内容ではありません") &&
      text.includes("本番には保存されていません");
    const hasNoCreateControl = !text.includes("次の計画版を作成");
    const hasResolved = Boolean(
      query('[data-human-review-status="RESOLVED"]'),
    );
    const hasExpectedNote =
      value.noteText === null
        ? noteReadback === undefined
        : noteReadback?.includes(value.noteText) === true;
    const hasPendingCopy = text.includes(
      "次の計画版はまだ作成されていません",
    );
    const controlsMatch =
      buttons.length === 2 &&
      buttons.every((button) => button.disabled === value.disabled) &&
      textarea?.disabled === value.disabled;

    return {
      pass:
        hasResolved &&
        person === value.person &&
        scope.includes("計画版") &&
        hasCommonCopy &&
        hasNoCreateControl &&
        liveWrite === "false" &&
        noOverflow &&
        text.includes(value.decisionCopy) &&
        hasPendingCopy === value.revisionPending &&
        hasExpectedNote &&
        controlsMatch,
      counter:
        query('[data-review-outcome-note-count="true"]')?.textContent?.trim() ??
        null,
      noHorizontalOverflow: noOverflow,
      noteReadback: noteReadback ?? null,
      textareaValue: textarea?.value ?? null,
    };
  }, expected);
}

async function saveScreenshot(page, viewportName, stateName) {
  const fileName = `${viewportName}-${stateName}.png`;
  const screenshotPath = path.join(artifactsDir, fileName);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}

for (const viewport of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const url = "http://127.0.0.1:4195/index.html";

  await page.goto(url, { waitUntil: "networkidle0" });
  const undecided = await observe(page, {
    decisionCopy: "見直し結果: 未判断",
    revisionPending: false,
    noteText: null,
    disabled: false,
    person: "Aさん",
  });
  const undecidedShot = await saveScreenshot(
    page,
    viewport.name,
    "undecided",
  );

  await page.type(
    '[data-review-outcome-note-input="true"]',
    "継続して観察したい",
  );
  await page.click('[data-review-outcome-action="NO_CHANGE"]');
  await page.waitForFunction(() => {
    return document.body.textContent?.includes(
      "補足メモ: 継続して観察したい",
    );
  });
  const noChangeWithNote = await observe(page, {
    decisionCopy: "デモ上の見直し結果: 変更なし",
    revisionPending: false,
    noteText: "継続して観察したい",
    disabled: true,
    person: "Aさん",
  });
  const noChangeShot = await saveScreenshot(
    page,
    viewport.name,
    "no-change-with-note",
  );

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click('[data-review-outcome-action="CHANGE_REQUIRED"]');
  await page.waitForFunction(() => {
    return document.body.textContent?.includes(
      "次の計画版はまだ作成されていません",
    );
  });
  const changeRequiredBlank = await observe(page, {
    decisionCopy: "デモ上の見直し結果: 変更が必要",
    revisionPending: true,
    noteText: null,
    disabled: true,
    person: "Aさん",
  });
  const changeRequiredShot = await saveScreenshot(
    page,
    viewport.name,
    "change-required-blank",
  );

  await page.goto(url, { waitUntil: "networkidle0" });
  await page.type(
    '[data-review-outcome-note-input="true"]',
    "Aの未確定メモ",
  );
  await page.click('[data-smoke-switch-context="true"]');
  await page.waitForFunction(() => {
    const identity = document.querySelector(
      '[data-human-review-person-identity="true"]',
    );
    return identity?.textContent?.trim() === "Bさん";
  });
  const contextReset = await observe(page, {
    decisionCopy: "見直し結果: 未判断",
    revisionPending: false,
    noteText: null,
    disabled: false,
    person: "Bさん",
  });
  const resetPass =
    contextReset.pass &&
    contextReset.textareaValue === "" &&
    contextReset.counter === "0 / 255";
  const resetShot = await saveScreenshot(
    page,
    viewport.name,
    "context-reset",
  );

  await page.type(
    '[data-review-outcome-note-input="true"]',
    "a".repeat(255),
  );
  const boundary = await page.evaluate(() => {
    const counter = document.querySelector(
      '[data-review-outcome-note-count="true"]',
    );
    const textarea = document.querySelector(
      '[data-review-outcome-note-input="true"]',
    );
    return {
      counter: counter?.textContent?.trim() ?? null,
      valueLength: textarea?.value.length ?? null,
      noHorizontalOverflow:
        document.documentElement.scrollWidth <= window.innerWidth + 1,
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
    pageErrors.length === 0;

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
    pass,
    screenshots: {
      undecidedShot,
      noChangeShot,
      changeRequiredShot,
      resetShot,
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
  allPass,
  checks,
};

const reportJson = JSON.stringify(report, null, 2);
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), reportJson);
fs.writeFileSync(path.join(__dirname, "smoke-report.json"), reportJson);
console.log(
  JSON.stringify(
    { allPass, artifactsDir, viewports: checks.length },
    null,
    2,
  ),
);
process.exit(allPass ? 0 : 1);
