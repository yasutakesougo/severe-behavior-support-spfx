#!/usr/bin/env node
/**
 * DEMO-UX-7 browser smoke runner (Chrome via puppeteer-core).
 * Scope: terminology canon + Overview today-actions navigation.
 * No save mutation / SharePoint write / live I/O / filter execution.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-7-browser-smoke";
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

await new Promise((resolve) => server.listen(4189, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4189";

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
  "overview-terminology-canon",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      const slice = document
        .querySelector("[data-demo-ux-7-slice]")
        ?.getAttribute("data-demo-ux-7-slice");
      const enabled = [...document.querySelectorAll('[data-demo-ux-today-action-enabled="true"]')];
      return {
        pass:
          Boolean(document.querySelector('[data-dashboard-ux="overview-dashboard"]')) &&
          text.indexOf("要確認") >= 0 &&
          text.indexOf("未記録") >= 0 &&
          text.indexOf("期限接近") >= 0 &&
          text.indexOf("期限間近") < 0 &&
          text.indexOf("確認待ち") < 0 &&
          text.indexOf("確認対象") < 0 &&
          enabled.length === 3 &&
          slice === "DEMO-UX-7" &&
          text.indexOf("画面間移動のみ") >= 0,
        enabled: enabled.length,
        slice,
      };
    }),
);

await runCase(
  "today-action-a-to-records",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux-today-action="action-a"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="daily-records"]')),
    );
    return page.evaluate(() => {
      const records = document.querySelector('[data-demo-ux="daily-records"]');
      const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
      const dest = document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-destination");
      const heading = document.querySelector('[data-demo-ux="daily-record-heading"]');
      return {
        pass:
          Boolean(records) &&
          !overview &&
          dest === "records" &&
          (heading?.textContent ?? "").includes("日々の記録"),
        dest,
        heading: heading?.textContent?.trim() ?? "",
      };
    });
  },
);

await runCase(
  "today-action-b-to-review-due",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux-today-action="action-b"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="review-due-state"]')),
    );
    return page.evaluate(() => {
      const panel = document.querySelector('[data-demo-ux="review-due-state"]');
      const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
      const statusLabels = [...document.querySelectorAll('[data-demo-ux="review-status-label"]')];
      const dueLabels = [...document.querySelectorAll('[data-demo-ux="due-state-label"]')];
      return {
        pass:
          Boolean(panel) &&
          !overview &&
          statusLabels.every((el) => (el.textContent ?? "").includes("要確認")) &&
          statusLabels.every((el) => !(el.textContent ?? "").includes("確認待ち")) &&
          dueLabels.every((el) => (el.textContent ?? "").includes("期限接近")) &&
          dueLabels.every((el) => !(el.textContent ?? "").includes("期限間近")),
        statusCount: statusLabels.length,
        dueCount: dueLabels.length,
      };
    });
  },
);

await runCase(
  "today-action-c-to-user-detail",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux-today-action="action-c"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="user-detail"]')),
    );
    return page.evaluate(() => {
      const detail = document.querySelector('[data-demo-ux="user-detail"]');
      const overview = document.querySelector('[data-dashboard-ux="overview-dashboard"]');
      const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
      const heading = document.querySelector('[data-demo-ux="user-detail-heading"]');
      return {
        pass:
          Boolean(detail) &&
          !overview &&
          shell?.getAttribute("data-shell-ux-destination") === "users" &&
          shell?.getAttribute("data-shell-ux-user-detail") === "user-c" &&
          (heading?.textContent ?? "").includes("Cさん"),
        userDetail: shell?.getAttribute("data-shell-ux-user-detail"),
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
  slice: "DEMO-UX-7",
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

if (!allPass) {
  console.error("DEMO-UX-7 browser smoke FAILED");
  process.exit(1);
}
console.log("DEMO-UX-7 browser smoke PASS", `${checks.length} / ${checks.length}`);
