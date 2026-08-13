#!/usr/bin/env node
/**
 * DEMO-UX-10 browser smoke runner (Chrome via puppeteer-core).
 * Scope: Family R Overview↔Users counts, Family A Review summary↔list,
 * non-equivalence notes, preserve DEMO-UX-7/8/9 + fail-closed gates.
 * No save / SharePoint write / live I/O / business-rule calculation.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-10-browser-smoke";
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

await new Promise((resolve) => server.listen(4192, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4192";

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
  "overview-family-r-counts-and-note",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) =>
    page.evaluate(() => {
      const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
      const note = document.querySelector('[data-demo-ux="overview-kpi-family-r-note"]');
      const needs = document.querySelector('[data-dashboard-ux-kpi="needs_review"]');
      const unrecorded = document.querySelector('[data-dashboard-ux-kpi="unrecorded"]');
      const due = document.querySelector('[data-dashboard-ux-kpi="deadline_near"]');
      const text = note?.textContent ?? "";
      return {
        pass:
          overview?.getAttribute("data-demo-ux-10-slice") === "DEMO-UX-10" &&
          needs?.getAttribute("data-demo-ux-kpi-count") === "3" &&
          unrecorded?.getAttribute("data-demo-ux-kpi-count") === "2" &&
          due?.getAttribute("data-demo-ux-kpi-count") === "3" &&
          needs?.getAttribute("data-demo-ux-metric-family") === "roster" &&
          due?.getAttribute("data-demo-ux-metric-family") === "roster" &&
          text.indexOf("利用者一覧の状態バッジ件数と同じ定義") >= 0 &&
          text.indexOf("見直し画面の件数とは母集団が異なります") >= 0 &&
          text.indexOf("見直し画面の件数と同じ") < 0,
        needs: needs?.getAttribute("data-demo-ux-kpi-count"),
        due: due?.getAttribute("data-demo-ux-kpi-count"),
        note: text.slice(0, 80),
      };
    }),
);

await runCase(
  "users-family-r-filter-matches-overview",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => {
    async function countFor(chip, expected) {
      await page.click(`[data-demo-ux-filter="${chip}"]`);
      await page.waitForFunction(
        (label, count) =>
          document
            .querySelector('[data-demo-ux="users-list"]')
            ?.getAttribute("data-demo-ux-filter-chip") === label &&
          document
            .querySelector('[data-demo-ux="users-list"]')
            ?.getAttribute("data-demo-ux-filter-count") === String(count),
        {},
        chip,
        expected,
      );
      return page.evaluate(() => {
        const list = document.querySelector('[data-demo-ux="users-list"]');
        return {
          count: Number(list?.getAttribute("data-demo-ux-filter-count") ?? -1),
          family: list?.getAttribute("data-demo-ux-metric-family") ?? "",
          note:
            document.querySelector('[data-demo-ux="users-metric-family-r-note"]')?.textContent ??
            "",
        };
      });
    }
    const needs = await countFor("要確認", 3);
    const unrecorded = await countFor("未記録", 2);
    const due = await countFor("期限接近", 3);
    return {
      pass:
        needs.count === 3 &&
        unrecorded.count === 2 &&
        due.count === 3 &&
        needs.family === "roster" &&
        needs.note.indexOf("概要の要確認/未記録/期限接近と同じ定義") >= 0 &&
        needs.note.indexOf("見直し画面とは母集団が異なります") >= 0,
      needs,
      unrecorded,
      due,
    };
  },
);

await runCase(
  "review-family-a-summary-matches-list",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux="overview-open-review-due"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="review-due-state"]')),
    );
    return page.evaluate(() => {
      const review = document.querySelector('[data-demo-ux="review-due-state"]');
      const awaiting = document.querySelector('[data-demo-ux="review-due-summary-awaiting"]');
      const dueSoon = document.querySelector('[data-demo-ux="review-due-summary-due-soon"]');
      const note = document.querySelector('[data-demo-ux="review-due-family-a-note"]');
      const items = [...document.querySelectorAll('[data-demo-ux="review-due-attention-item"]')];
      const statusLabels = items.map(
        (item) =>
          item.querySelector('[data-demo-ux="review-status-label"]')?.textContent?.trim() ?? "",
      );
      const dueLabels = items
        .map((item) => item.querySelector('[data-demo-ux="due-state-label"]')?.textContent?.trim())
        .filter(Boolean);
      const awaitingText = awaiting?.textContent ?? "";
      const dueText = dueSoon?.textContent ?? "";
      const noteText = note?.textContent ?? "";
      return {
        pass:
          review?.getAttribute("data-demo-ux-10-slice") === "DEMO-UX-10" &&
          items.length === 3 &&
          statusLabels.filter((label) => label === "要確認").length === 3 &&
          dueLabels.length === 2 &&
          awaitingText.indexOf("要確認 3件") >= 0 &&
          dueText.indexOf("期限接近 2件") >= 0 &&
          noteText.indexOf("確認対象一覧と同じ母集団") >= 0 &&
          noteText.indexOf("利用者一覧の要確認/期限接近件数とは対象者が異なります") >= 0 &&
          noteText.indexOf("利用者一覧と同じ定義") < 0,
        awaitingText: awaitingText.trim(),
        dueText: dueText.trim(),
        itemCount: items.length,
        dueLabelCount: dueLabels.length,
      };
    });
  },
);

await runCase(
  "preserve-today-action-b-to-review",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux-today-action="action-b"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="review-due-state"]')),
    );
    return page.evaluate(() => ({
      pass: Boolean(document.querySelector('[data-demo-ux="review-due-state"]')),
    }));
  },
);

await runCase(
  "preserve-daily-record-incomplete",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=records`,
  async (page) =>
    page.evaluate(() => {
      const records = document.querySelector('[data-demo-ux="daily-records"]');
      return {
        pass:
          records?.getAttribute("data-demo-ux-9-slice") === "DEMO-UX-9" &&
          Boolean(document.querySelector('[data-demo-ux="daily-record-incomplete-list"]')),
      };
    }),
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
  slice: "DEMO-UX-10",
  expected: {
    familyR: { needs_review: 3, unrecorded: 2, deadline_near: 3 },
    familyA: { awaiting: 3, dueSoon: 2, attentionItems: 3 },
  },
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

if (!allPass) {
  console.error("DEMO-UX-10 browser smoke FAILED");
  process.exit(1);
}
console.log("DEMO-UX-10 browser smoke PASS", `${checks.length} / ${checks.length}`);
