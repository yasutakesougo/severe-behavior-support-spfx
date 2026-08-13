#!/usr/bin/env node
/**
 * DEMO-UX-11 browser smoke runner (Chrome via puppeteer-core).
 * Scope: screen-level synthetic bands removed; global banner + mutation/Family/fail-closed kept.
 * No save / SharePoint write / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-11-browser-smoke";
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

await new Promise((resolve) => server.listen(4193, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4193";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];
let allPass = true;

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

await runCase(
  "overview-no-screen-band-keeps-boundaries",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) =>
    page.evaluate(() => {
      const banner = document.querySelector('[data-shell-ux="demo-banner"]');
      const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
      const screenNote = document.querySelector('[data-dashboard-ux="overview-presentation-note"]');
      const kpiLegacy = document.querySelector('[data-dashboard-ux="overview-kpi-note"]');
      const reviewLegacy = document.querySelector('[data-dashboard-ux="overview-review-due-note"]');
      const familyR = document.querySelector('[data-demo-ux="overview-kpi-family-r-note"]');
      const actionNote = document.querySelector('[data-dashboard-ux="overview-action-note"]');
      const bannerText = banner?.textContent ?? "";
      return {
        pass:
          overview?.getAttribute("data-demo-ux-11-slice") === "DEMO-UX-11" &&
          Boolean(banner) &&
          bannerText.indexOf("合成表示専用") >= 0 &&
          bannerText.indexOf("live SharePoint 接続なし") >= 0 &&
          !screenNote &&
          !kpiLegacy &&
          !reviewLegacy &&
          (familyR?.textContent ?? "").indexOf("利用者一覧の状態バッジ件数と同じ定義") >= 0 &&
          (actionNote?.textContent ?? "").indexOf("画面間移動のみ") >= 0 &&
          (actionNote?.textContent ?? "").indexOf("保存") >= 0,
        banner: bannerText.trim(),
        hasScreenNote: Boolean(screenNote),
      };
    }),
);

await runCase(
  "users-consolidated-filter-hint",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) =>
    page.evaluate(() => {
      const list = document.querySelector('[data-demo-ux="users-list"]');
      const screenNote = document.querySelector('[data-demo-ux="users-presentation-note"]');
      const filterNote = document.querySelector('[data-demo-ux="users-filter-note"]');
      const hint = document.querySelector('[data-demo-ux="users-filter-hint"]');
      const familyR = document.querySelector('[data-demo-ux="users-metric-family-r-note"]');
      const detail = document.querySelector('[data-demo-ux="users-detail-note"]');
      const banner = document.querySelector('[data-shell-ux="demo-banner"]');
      return {
        pass:
          list?.getAttribute("data-demo-ux-11-slice") === "DEMO-UX-11" &&
          Boolean(banner) &&
          !screenNote &&
          !filterNote &&
          (hint?.textContent ?? "").indexOf("絞り込みできます") >= 0 &&
          (hint?.textContent ?? "").indexOf("業務検索には未接続") >= 0 &&
          (familyR?.textContent ?? "").indexOf("概要と同じ定義") >= 0 &&
          (detail?.textContent ?? "").indexOf("合成詳細プレビューがある利用者のみ") >= 0 &&
          (detail?.textContent ?? "").indexOf("業務データの詳細画面には接続されていません") >= 0,
        hint: hint?.textContent?.trim() ?? "",
      };
    }),
);

await runCase(
  "records-keeps-mutation-boundary",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=records`,
  async (page) =>
    page.evaluate(() => {
      const records = document.querySelector('[data-demo-ux="daily-records"]');
      const screenNote = document.querySelector('[data-demo-ux="daily-record-presentation-note"]');
      const draft = document.querySelector('[data-demo-ux="daily-record-draft-hint"]');
      const mutation = document.querySelector('[data-demo-ux="daily-record-mutation-note"]');
      const buttons = [
        ...document.querySelectorAll('[data-demo-ux="daily-record-mutation-button"]'),
      ];
      const banner = document.querySelector('[data-shell-ux="demo-banner"]');
      return {
        pass:
          records?.getAttribute("data-demo-ux-11-slice") === "DEMO-UX-11" &&
          Boolean(banner) &&
          !screenNote &&
          (draft?.textContent ?? "").indexOf("保存されません") >= 0 &&
          (mutation?.textContent ?? "").indexOf("実保存なし") >= 0 &&
          buttons.length === 2 &&
          buttons.every((button) => button.disabled),
      };
    }),
);

await runCase(
  "review-keeps-family-a-and-mutation",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux="overview-open-review-due"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="review-due-state"]')),
    );
    return page.evaluate(() => {
      const review = document.querySelector('[data-demo-ux="review-due-state"]');
      const screenNote = document.querySelector('[data-demo-ux="review-due-presentation-note"]');
      const familyA = document.querySelector('[data-demo-ux="review-due-family-a-note"]');
      const mutation = document.querySelector('[data-demo-ux="review-due-mutation-note"]');
      const awaiting = document.querySelector('[data-demo-ux="review-due-summary-awaiting"]');
      const banner = document.querySelector('[data-shell-ux="demo-banner"]');
      return {
        pass:
          review?.getAttribute("data-demo-ux-11-slice") === "DEMO-UX-11" &&
          Boolean(banner) &&
          !screenNote &&
          (familyA?.textContent ?? "").indexOf("確認対象一覧と同じ母集団") >= 0 &&
          (mutation?.textContent ?? "").indexOf("実行できません") >= 0 &&
          (awaiting?.textContent ?? "").indexOf("要確認 3件") >= 0,
      };
    });
  },
);

await runCase(
  "preserve-access-denied",
  `${base}/index.html?viewMode=access_denied&siteSelection=SITE-ISG&saveState=save_failed`,
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
  "preserve-unselected-stop",
  `${base}/index.html?viewMode=ready&siteSelection=unselected&destination=overview`,
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
  "preserve-save-outcome-unknown",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&saveState=save_outcome_unknown`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      return {
        pass:
          text.indexOf("保存結果不明") >= 0 &&
          text.indexOf("成功・失敗のいずれにも丸めません") >= 0,
      };
    }),
);

await runCase(
  "preserve-users-filter-count",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => {
    await page.click('[data-demo-ux-filter="期限接近"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-demo-ux="users-list"]')
          ?.getAttribute("data-demo-ux-filter-count") === "3",
    );
    return page.evaluate(() => {
      const list = document.querySelector('[data-demo-ux="users-list"]');
      return {
        pass:
          list?.getAttribute("data-demo-ux-8-slice") === "DEMO-UX-8" &&
          list?.getAttribute("data-demo-ux-filter-count") === "3",
      };
    });
  },
);

const report = {
  allPass,
  cases: checks,
  slice: "DEMO-UX-11",
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

if (!allPass) {
  console.error("DEMO-UX-11 browser smoke FAILED");
  process.exit(1);
}
console.log("DEMO-UX-11 browser smoke PASS", `${checks.length} / ${checks.length}`);
