#!/usr/bin/env node
/**
 * DEMO-UX-13 browser smoke runner (Chrome via puppeteer-core).
 * Scope: fixture-backed Users list detail preview (A+C enabled; B/D–H disabled).
 * Support-plan remains A-only. No live detail / SharePoint write / RPF-007.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-13-browser-smoke";
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

await new Promise((resolve) => server.listen(4195, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4195";

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
  "users-list-ac-enabled-bdh-disabled",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) =>
    page.evaluate(() => {
      const list = document.querySelector('[data-demo-ux="users-list"]');
      const note = document.querySelector('[data-demo-ux="users-detail-note"]');
      const banner = document.querySelector('[data-shell-ux="demo-banner"]');
      const rows = [...document.querySelectorAll('[data-demo-ux="users-row"]')];
      const byId = {};
      for (const row of rows) {
        const id = row.getAttribute("data-demo-ux-user-id");
        const button = row.querySelector('[data-demo-ux="users-detail-button"]');
        byId[id] = {
          enabled: button?.getAttribute("data-demo-ux-detail-preview") === "true",
          disabledAttr: Boolean(button?.disabled),
        };
      }
      const noteText = note?.textContent ?? "";
      const enabledOk =
        byId["user-a"]?.enabled === true &&
        byId["user-c"]?.enabled === true &&
        byId["user-a"]?.disabledAttr === false &&
        byId["user-c"]?.disabledAttr === false;
      const disabledIds = ["user-b", "user-d", "user-e", "user-f", "user-g", "user-h"];
      const disabledOk = disabledIds.every(
        (id) => byId[id]?.enabled === false && byId[id]?.disabledAttr === true,
      );
      return {
        pass:
          list?.getAttribute("data-demo-ux-13-slice") === "DEMO-UX-13" &&
          Boolean(banner) &&
          enabledOk &&
          disabledOk &&
          noteText.indexOf("合成詳細プレビューがある利用者のみ") >= 0 &&
          noteText.indexOf("業務データの詳細画面には接続されていません") >= 0 &&
          noteText.indexOf("Aさんのみ") < 0,
        byId,
        noteText: noteText.trim(),
      };
    }),
);

await runCase(
  "open-c-detail-from-list-no-support-plan",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => {
    await page.click('[data-demo-ux-user-id="user-c"] [data-demo-ux="users-detail-button"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="user-detail"]')),
    );
    return page.evaluate(() => {
      const detail = document.querySelector('[data-demo-ux="user-detail"]');
      const heading = document.querySelector('[data-demo-ux="user-detail-heading"]');
      const planPreview = document.querySelector('[data-demo-ux-plan-preview="true"]');
      const supportPlan = document.querySelector('[data-demo-ux="support-plan"]');
      const text = document.body?.textContent ?? "";
      return {
        pass:
          Boolean(detail) &&
          (heading?.textContent ?? "").indexOf("Cさん") >= 0 &&
          !planPreview &&
          !supportPlan &&
          text.indexOf("live保存なし") >= 0,
        heading: heading?.textContent?.trim() ?? "",
        hasPlanPreview: Boolean(planPreview),
      };
    });
  },
);

await runCase(
  "open-a-detail-keeps-support-plan",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => {
    await page.click('[data-demo-ux-user-id="user-a"] [data-demo-ux="users-detail-button"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="user-detail"]')),
    );
    return page.evaluate(() => {
      const heading = document.querySelector('[data-demo-ux="user-detail-heading"]');
      const planPreview = document.querySelector('[data-demo-ux-plan-preview="true"]');
      return {
        pass: (heading?.textContent ?? "").indexOf("Aさん") >= 0 && Boolean(planPreview),
        heading: heading?.textContent?.trim() ?? "",
        hasPlanPreview: Boolean(planPreview),
      };
    });
  },
);

await runCase(
  "filter-needs-review-keeps-availability-rule",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => {
    await page.click('[data-demo-ux-filter="要確認"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-demo-ux="users-list"]')
          ?.getAttribute("data-demo-ux-filter-count") === "3",
    );
    return page.evaluate(() => {
      const rows = [...document.querySelectorAll('[data-demo-ux="users-row"]')];
      const byId = {};
      for (const row of rows) {
        const id = row.getAttribute("data-demo-ux-user-id");
        const button = row.querySelector('[data-demo-ux="users-detail-button"]');
        byId[id] = button?.getAttribute("data-demo-ux-detail-preview") === "true";
      }
      return {
        pass:
          Object.keys(byId).sort().join(",") === "user-a,user-c,user-f" &&
          byId["user-a"] === true &&
          byId["user-c"] === true &&
          byId["user-f"] === false,
        byId,
      };
    });
  },
);

await runCase(
  "preserve-overview-c-today-action",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux-today-action="action-c"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="user-detail"]')),
    );
    return page.evaluate(() => {
      const heading = document.querySelector('[data-demo-ux="user-detail-heading"]');
      const planPreview = document.querySelector('[data-demo-ux-plan-preview="true"]');
      const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
      return {
        pass:
          (heading?.textContent ?? "").indexOf("Cさん") >= 0 &&
          !planPreview &&
          shell?.getAttribute("data-shell-ux-user-detail") === "user-c",
        heading: heading?.textContent?.trim() ?? "",
      };
    });
  },
);

await runCase(
  "preserve-unselected-stop",
  `${base}/index.html?viewMode=ready&siteSelection=unselected&destination=users`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      return {
        pass:
          text.indexOf("事業所が未選択です") >= 0 &&
          !document.querySelector('[data-demo-ux="users-list"]'),
      };
    }),
);

await runCase(
  "preserve-access-denied",
  `${base}/index.html?viewMode=access_denied&siteSelection=SITE-ISG&destination=users`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      const banner = document.querySelector('[data-shell-ux="demo-banner"]');
      return {
        pass:
          Boolean(banner) &&
          text.indexOf("アクセス不可") >= 0 &&
          !document.querySelector('[data-demo-ux="users-list"]'),
      };
    }),
);

const report = {
  allPass,
  cases: checks,
  slice: "DEMO-UX-13",
  sliceFlags: {
    id: "DEMO-UX-13",
    presentationOnly: true,
    detailPreviewExpansionAuthorized: true,
    fixtureBackedDetailPreviewOnly: true,
    supportPlanExpansionAuthorized: false,
    newEightUserDetailCatalogAuthorized: false,
    sharePointWriteAuthorized: false,
  },
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

if (!allPass) {
  console.error("DEMO-UX-13 browser smoke FAILED");
  process.exit(1);
}
console.log(`DEMO-UX-13 browser smoke PASS (${checks.length} cases)`);
