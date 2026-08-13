#!/usr/bin/env node
/**
 * DEMO-UX-14 browser smoke runner (Chrome via puppeteer-core).
 * Scope: saving progress cue + interaction pause appearance (RPF-007).
 * No save / SharePoint write / live I/O / saving→saved auto-complete.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-14-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import("/tmp/node_modules/esbuild/lib/main.js");
const puppeteerModule =
  await import("/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js");
const sassModule = await import("/tmp/node_modules/sass/sass.node.mjs");
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ?? sassModule.default?.compile ?? (await import("sass")).compile;

const scssPaths = [
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
  "src/shell/users/SupportPlanUx.module.scss",
  "src/shell/records/DailyRecordsUx.module.scss",
  "src/shell/review/ReviewDueStateUx.module.scss",
].map((p) => path.join(repoRoot, p));

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const resetCss = `
  html, body { margin: 0; padding: 0; box-sizing: border-box; }
  *, *::before, *::after { box-sizing: inherit; }
`;
const productionCss =
  resetCss +
  "\n" +
  scssPaths
    .map((scssPath) => normalizeSpfxThemeCss(compileScss(scssPath, { style: "expanded" }).css))
    .join("\n");
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
      return {
        contents: `export default {\n${entries}\n};`,
        loader: "js",
      };
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
  external: [],
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
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] ?? "text/plain" });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(4196, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4196";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];
let allPass = true;

const SAVE_CASES = [
  {
    state: "unsaved",
    label: "未保存",
    emphasis: "quiet",
    live: "polite",
    expectDescription: false,
    expectProgress: false,
    expectPause: false,
  },
  {
    state: "saving",
    label: "保存中",
    emphasis: "emphasized",
    live: "polite",
    expectDescription: true,
    expectProgress: true,
    expectPause: true,
  },
  {
    state: "saved",
    label: "保存済み",
    emphasis: "quiet",
    live: "polite",
    expectDescription: false,
    expectProgress: false,
    expectPause: false,
  },
  {
    state: "save_failed",
    label: "保存失敗",
    emphasis: "emphasized",
    live: "assertive",
    expectDescription: true,
    expectProgress: false,
    expectPause: false,
  },
  {
    state: "save_outcome_unknown",
    label: "保存結果不明",
    emphasis: "emphasized",
    live: "assertive",
    expectDescription: true,
    expectProgress: false,
    expectPause: false,
  },
];

async function runCase(name, url, assertFn) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0" });
  const found = await assertFn(page);
  if (errors.length > 0) {
    found.pass = false;
    found.pageErrors = errors;
  }
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({ name, url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;
  await page.close();
  console.log(pass ? `PASS ${name}` : `FAIL ${name}`, found);
}

for (const entry of SAVE_CASES) {
  await runCase(
    `save-${entry.state}`,
    `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview&saveState=${entry.state}`,
    async (page) =>
      page.evaluate((expected) => {
        const chrome = document.querySelector('[data-shell-ux="app-shell-chrome"]');
        const presentation = document.querySelector('[data-shell-ux="save-state-presentation"]');
        const badge = document.querySelector('[data-shell-ux="save-state"]');
        const description = document.querySelector('[data-shell-ux="save-state-description"]');
        const progress = document.querySelector('[data-shell-ux="save-state-progress-cue"]');
        const pauseNote = document.querySelector(
          '[data-shell-ux="saving-interaction-pause-note"]',
        );
        const ready = document.querySelector('[data-shell-ux="ready-region"]');
        const banner = document.querySelector('[data-shell-ux="demo-banner"]');
        const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
        const navButtons = [...document.querySelectorAll("[data-shell-ux-nav]")];
        const badgeText = badge?.textContent?.trim() ?? "";
        const descriptionText = description?.textContent?.trim() ?? "";
        const pauseText = pauseNote?.textContent?.trim() ?? "";
        const descriptionOk = expected.expectDescription
          ? Boolean(description) && descriptionText.length > 0
          : !description;
        const progressOk = expected.expectProgress
          ? Boolean(progress) &&
            presentation?.getAttribute("data-saving-progress") === "true" &&
            presentation?.getAttribute("aria-busy") === "true" &&
            (progress?.textContent ?? "").includes("進行中")
          : !progress &&
            presentation?.getAttribute("data-saving-progress") === "false" &&
            presentation?.getAttribute("aria-busy") !== "true";
        const pauseOk = expected.expectPause
          ? Boolean(pauseNote) &&
            pauseText.includes("一時停止") &&
            pauseText.includes("実保存なし") &&
            chrome?.getAttribute("data-shell-ux-saving-pause") === "true" &&
            ready?.getAttribute("data-shell-ux-saving-pause") === "true" &&
            ready?.getAttribute("aria-busy") === "true" &&
            navButtons.length > 0 &&
            navButtons.every(
              (btn) =>
                btn.disabled === true &&
                btn.getAttribute("data-shell-ux-nav-saving-paused") === "true",
            )
          : !pauseNote &&
            chrome?.getAttribute("data-shell-ux-saving-pause") === "false" &&
            ready?.getAttribute("data-shell-ux-saving-pause") === "false" &&
            ready?.getAttribute("aria-busy") !== "true" &&
            navButtons.every(
              (btn) => btn.getAttribute("data-shell-ux-nav-saving-paused") === "false",
            );
        const unknownIndependent =
          expected.state !== "save_outcome_unknown" ||
          (!badgeText.includes("保存失敗") &&
            !badgeText.includes("保存済み") &&
            !descriptionText.includes("保存失敗") &&
            !descriptionText.includes("保存済み") &&
            descriptionText.includes("丸めません"));
        const savingNotSuccess =
          expected.state !== "saving" ||
          (badgeText === "保存中" &&
            !badgeText.includes("保存済み") &&
            descriptionText.includes("実保存なし") &&
            !descriptionText.includes("保存済み"));
        const mutationStillDisabled = ![
          ...document.querySelectorAll('[data-demo-ux="daily-record-mutation-button"]'),
          ...document.querySelectorAll('[data-demo-ux="review-due-mutation-button"]'),
          ...document.querySelectorAll('[data-demo-ux="support-plan-mutation-button"]'),
        ].some((btn) => !btn.disabled);
        return {
          pass:
            presentation?.getAttribute("data-demo-ux-14-slice") === "DEMO-UX-14" &&
            chrome?.getAttribute("data-demo-ux-14-slice") === "DEMO-UX-14" &&
            presentation?.getAttribute("data-save-state") === expected.state &&
            presentation?.getAttribute("data-save-emphasis") === expected.emphasis &&
            badge?.getAttribute("data-save-state") === expected.state &&
            badge?.getAttribute("data-save-emphasis") === expected.emphasis &&
            badgeText === expected.label &&
            badge?.getAttribute("aria-live") === expected.live &&
            (badge?.getAttribute("aria-label") ?? "").includes(expected.label) &&
            descriptionOk &&
            progressOk &&
            pauseOk &&
            unknownIndependent &&
            savingNotSuccess &&
            mutationStillDisabled &&
            Boolean(banner) &&
            Boolean(overview),
          badgeText,
          descriptionText,
          pauseText,
          progressPresent: Boolean(progress),
          pausePresent: Boolean(pauseNote),
          emphasis: badge?.getAttribute("data-save-emphasis") ?? null,
          savingPause: chrome?.getAttribute("data-shell-ux-saving-pause") ?? null,
        };
      }, entry),
  );
}

await runCase(
  "saving-nav-stays-disabled",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview&saveState=saving`,
  async (page) => {
    const before = await page.evaluate(() => ({
      destination: document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-destination"),
      overview: Boolean(document.querySelector('[data-dashboard-ux="overview-dashboard"]')),
    }));
    await page.click('[data-shell-ux-nav="users"]');
    await new Promise((resolve) => setTimeout(resolve, 200));
    const after = await page.evaluate(() => ({
      destination: document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-destination"),
      overview: Boolean(document.querySelector('[data-dashboard-ux="overview-dashboard"]')),
      usersList: Boolean(document.querySelector('[data-demo-ux="users-list"]')),
    }));
    return {
      pass:
        before.destination === "overview" &&
        before.overview === true &&
        after.destination === "overview" &&
        after.overview === true &&
        after.usersList !== true,
      before,
      after,
    };
  },
);

await runCase(
  "preserve-unselected-stop",
  `${base}/index.html?viewMode=ready&siteSelection=unselected&destination=overview&saveState=saving`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      return {
        pass:
          text.indexOf("事業所が未選択です") >= 0 &&
          !document.querySelector('[data-dashboard-ux="overview-dashboard"]') &&
          !document.querySelector('[data-shell-ux="ready-region"]'),
      };
    }),
);

await runCase(
  "preserve-access-denied",
  `${base}/index.html?viewMode=access_denied&siteSelection=SITE-ISG&saveState=saving`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      const banner = document.querySelector('[data-shell-ux="demo-banner"]');
      return {
        pass:
          Boolean(banner) &&
          text.indexOf("アクセス不可") >= 0 &&
          text.indexOf("個人情報は表示していません") >= 0 &&
          !document.querySelector('[data-dashboard-ux="overview-dashboard"]'),
      };
    }),
);

await runCase(
  "preserve-save-outcome-unknown-non-collapse",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&saveState=save_outcome_unknown`,
  async (page) =>
    page.evaluate(() => {
      const badge = document.querySelector('[data-shell-ux="save-state"]');
      const description = document.querySelector('[data-shell-ux="save-state-description"]');
      const progress = document.querySelector('[data-shell-ux="save-state-progress-cue"]');
      const pauseNote = document.querySelector(
        '[data-shell-ux="saving-interaction-pause-note"]',
      );
      const text = `${badge?.textContent ?? ""}\n${description?.textContent ?? ""}`;
      return {
        pass:
          badge?.getAttribute("data-save-state") === "save_outcome_unknown" &&
          badge?.getAttribute("data-save-emphasis") === "emphasized" &&
          text.indexOf("保存結果不明") >= 0 &&
          text.indexOf("成功・失敗のいずれにも丸めません") >= 0 &&
          text.indexOf("保存失敗") < 0 &&
          text.indexOf("保存済み") < 0 &&
          !progress &&
          !pauseNote,
      };
    }),
);

await runCase(
  "hierarchy-quiet-saved-no-progress",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview&saveState=saved`,
  async (page) =>
    page.evaluate(() => {
      const badge = document.querySelector('[data-shell-ux="save-state"]');
      const description = document.querySelector('[data-shell-ux="save-state-description"]');
      const progress = document.querySelector('[data-shell-ux="save-state-progress-cue"]');
      const pauseNote = document.querySelector(
        '[data-shell-ux="saving-interaction-pause-note"]',
      );
      const familyR = document.querySelector('[data-demo-ux="overview-kpi-family-r-note"]');
      return {
        pass:
          badge?.getAttribute("data-save-emphasis") === "quiet" &&
          badge?.textContent?.trim() === "保存済み" &&
          !description &&
          !progress &&
          !pauseNote &&
          Boolean(familyR),
      };
    }),
);

const report = {
  allPass,
  cases: checks,
  slice: "DEMO-UX-14",
  sliceFlags: {
    id: "DEMO-UX-14",
    presentationOnly: true,
    saveProgressUiAuthorized: true,
    savingInteractionPauseAppearanceAuthorized: true,
    savingAutoCompleteAuthorized: false,
    saveMutationAuthorized: false,
    sharePointWriteAuthorized: false,
  },
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

if (!allPass) {
  console.error("DEMO-UX-14 browser smoke FAILED");
  process.exit(1);
}
console.log(`DEMO-UX-14 browser smoke PASS (${checks.length} cases)`);
