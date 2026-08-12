#!/usr/bin/env node
/**
 * DEMO-UX-8 browser smoke runner (Chrome via puppeteer-core).
 * Scope: users list status filter counts (RPF-003).
 * No save mutation / SharePoint write / live I/O / RPF-002 / multi-select.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-8-browser-smoke";
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

await new Promise((resolve) => server.listen(4190, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4190";

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

async function assertFilterCount(page, chipLabel, expectedCount, expectedSummaryPart) {
  if (chipLabel !== "すべて") {
    await page.click(`[data-demo-ux-filter="${chipLabel}"]`);
    await page.waitForFunction(
      (label, count) => {
        const list = document.querySelector('[data-demo-ux="users-list"]');
        return (
          list?.getAttribute("data-demo-ux-filter-chip") === label &&
          list?.getAttribute("data-demo-ux-filter-count") === String(count)
        );
      },
      {},
      chipLabel,
      expectedCount,
    );
  }
  return page.evaluate(
    (label, count, summaryPart) => {
      const list = document.querySelector('[data-demo-ux="users-list"]');
      const rows = [...document.querySelectorAll('[data-demo-ux="users-row"]')];
      const chips = [...document.querySelectorAll('[data-demo-ux="users-filter-chip"]')];
      const selected = chips.find((chip) => chip.getAttribute("data-demo-ux-filter") === label);
      const summary = document.querySelector('[data-demo-ux="users-summary-label"]');
      const slice =
        list?.getAttribute("data-demo-ux-8-slice") ??
        document.querySelector("[data-demo-ux-8-slice]")?.getAttribute("data-demo-ux-8-slice");
      return {
        pass:
          Boolean(list) &&
          rows.length === count &&
          list?.getAttribute("data-demo-ux-filter-count") === String(count) &&
          list?.getAttribute("data-demo-ux-filter-chip") === label &&
          selected?.getAttribute("aria-pressed") === "true" &&
          selected?.getAttribute("data-demo-ux-filter-selected") === "true" &&
          !selected?.disabled &&
          chips.every((chip) => !chip.disabled) &&
          chips.filter((chip) => chip.getAttribute("aria-pressed") === "true").length === 1 &&
          (summary?.textContent ?? "").includes(summaryPart) &&
          slice === "DEMO-UX-8",
        rowCount: rows.length,
        chip: list?.getAttribute("data-demo-ux-filter-chip") ?? "",
        summary: summary?.textContent?.trim() ?? "",
        slice,
      };
    },
    chipLabel,
    expectedCount,
    expectedSummaryPart,
  );
}

await runCase(
  "users-filter-all-8",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => assertFilterCount(page, "すべて", 8, "全8名"),
);

await runCase(
  "users-filter-needs-review-3",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => assertFilterCount(page, "要確認", 3, "3名（要確認・合成データ）"),
);

await runCase(
  "users-filter-unrecorded-2",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => assertFilterCount(page, "未記録", 2, "2名（未記録・合成データ）"),
);

await runCase(
  "users-filter-due-soon-3",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => assertFilterCount(page, "期限接近", 3, "3名（期限接近・合成データ）"),
);

await runCase(
  "preserve-today-action-a",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux-today-action="action-a"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="daily-records"]')),
    );
    return page.evaluate(() => {
      const records = document.querySelector('[data-demo-ux="daily-records"]');
      const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
      return {
        pass: Boolean(records) && !overview,
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
      return {
        pass:
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

const report = {
  allPass,
  cases: checks,
  slice: "DEMO-UX-8",
  expectedCounts: {
    すべて: 8,
    要確認: 3,
    未記録: 2,
    期限接近: 3,
  },
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

if (!allPass) {
  console.error("DEMO-UX-8 browser smoke FAILED");
  process.exit(1);
}
console.log("DEMO-UX-8 browser smoke PASS", `${checks.length} / ${checks.length}`);
