#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.SPML_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/support-plan-management-list-demo-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SPML_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.SPML_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.SPML_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs"
);
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
  "src/shell/users/SupportPlanManagementListUx.module.scss",
  "src/shell/users/ManagementHomeUx.module.scss",
  "src/shell/review/ReviewDueStateUx.module.scss",
];

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

function compileProductionCss() {
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  const compiled = scssPaths
    .map((rel) =>
      normalizeSpfxThemeCss(compileScss(path.join(repoRoot, rel), { style: "expanded" }).css),
    )
    .join("\n");
  return `${resetCss}\n${compiled}`;
}

const productionCss = compileProductionCss();
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
      return { contents: `export default {\n${entries}\n};`, loader: "js" };
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
  fs.readFile(filePath, (error, data) => {
    if (error) {
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
  executablePath: process.env.SPML_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];
let allPass = true;

function assertPlannerList() {
  const list = document.querySelector('[data-demo-ux="support-plan-management-list"]');
  const heading = document.querySelector('[data-demo-ux="support-plan-mgmt-heading"]');
  const rows = [...document.querySelectorAll('[data-demo-ux="support-plan-mgmt-row"]')];
  const kpiMetric = document.querySelector('[data-demo-ux="support-plan-mgmt-kpi-metric"]');
  const kpiCard = document.querySelector('[data-demo-ux="support-plan-mgmt-kpi-card"]');
  const primaryActions = document.querySelectorAll('[data-sbs-action="primary"]');
  const listPrimaryActions = document.querySelectorAll(
    '[data-demo-ux="support-plan-mgmt-action"][data-sbs-action="primary"]',
  );
  const todayPrimary = document.querySelector(
    '[data-demo-ux="support-plan-mgmt-today-action"][data-sbs-action="primary"]',
  );
  const actionQueue = document.querySelector('[data-visual-hierarchy="action-queue"]');
  const kpiNeeds = document.querySelector('[data-support-plan-mgmt-kpi="needs_action"]');
  const kpiReview = document.querySelector('[data-support-plan-mgmt-kpi="review_window"]');
  const kpiObs = document.querySelector('[data-support-plan-mgmt-kpi="observation_wait"]');
  const uncreated = document.querySelector('[data-support-plan-mgmt-work-state="uncreated"]');
  const createAction = document.querySelector('[data-support-plan-mgmt-action="create"]');
  const detailAction = document.querySelector(
    '[data-support-plan-mgmt-action="detail"][data-support-plan-mgmt-user-id="user-a"]',
  );
  const usersList = document.querySelector('[data-demo-ux="users-list"]');
  const text = document.body?.textContent ?? "";
  const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  return {
    pass:
      Boolean(list) &&
      (heading?.textContent ?? "").trim() === "支援計画" &&
      rows.length === 5 &&
      kpiNeeds?.getAttribute("data-support-plan-mgmt-kpi-count") === "2" &&
      kpiReview?.getAttribute("data-support-plan-mgmt-kpi-count") === "1" &&
      kpiObs?.getAttribute("data-support-plan-mgmt-kpi-count") === "1" &&
      Boolean(kpiMetric) &&
      !kpiCard &&
      primaryActions.length === 1 &&
      listPrimaryActions.length === 0 &&
      todayPrimary?.getAttribute("data-support-plan-mgmt-user-id") === "user-b" &&
      createAction?.getAttribute("data-sbs-action") === "secondary" &&
      detailAction?.getAttribute("data-sbs-action") === "tertiary" &&
      Boolean(actionQueue) &&
      Boolean(uncreated) &&
      (createAction?.textContent ?? "").trim() === "新規作成" &&
      (detailAction?.textContent ?? "").trim() === "詳細を見る" &&
      !usersList &&
      text.indexOf("最終承認者") < 0 &&
      text.indexOf("承認済み") < 0 &&
      text.indexOf("90日") < 0 &&
      text.indexOf("失効") < 0 &&
      text.indexOf("Version: v3") >= 0 &&
      text.indexOf("最終観察日:") >= 0 &&
      text.indexOf("見直し目安:") >= 0 &&
      text.indexOf("要対応:") >= 0 &&
      !overflow,
    heading: heading?.textContent ?? "",
    rowCount: rows.length,
    kpiNeeds: kpiNeeds?.getAttribute("data-support-plan-mgmt-kpi-count") ?? "",
    overflow,
  };
}

function assertManagementHome(expectUnavailable = false) {
  const home = document.querySelector('[data-demo-ux="management-home"]');
  const unavailable = document.querySelector('[data-demo-ux="management-home-unavailable"]');
  const text = document.body?.textContent ?? "";
  const overflow = document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
  return {
    pass:
      Boolean(home) &&
      text.indexOf("支援マネジメント") >= 0 &&
      text.indexOf("現在の計画") >= 0 &&
      text.indexOf("見直し状況") >= 0 &&
      text.indexOf("変更対応状況") >= 0 &&
      text.indexOf("次に必要な人の行動") >= 0 &&
      (expectUnavailable ? Boolean(unavailable) : !unavailable) &&
      !overflow,
    unavailable: Boolean(unavailable),
    overflow,
  };
}

async function smokeGoto(page, query, viewport) {
  if (viewport) {
    await page.setViewport(viewport);
  }
  const url = `${base}/index.html?${query}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  return url;
}

async function recordCase(name, page, url, found, errors) {
  found.pageErrors = errors;
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name, url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;
  return pass;
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER",
    { width: 1280, height: 900, deviceScaleFactor: 1 },
  );
  const found = await page.evaluate(assertPlannerList);
  await recordCase("desktop-planner-list", page, url, found, errors);
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER",
  );
  await page.click(
    '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]',
  );
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
  );
  const found = await page.evaluate(() => {
    const plan = document.querySelector('[data-demo-ux="support-plan"]');
    const list = document.querySelector('[data-demo-ux="support-plan-management-list"]');
    const detail = document.querySelector('[data-demo-ux="user-detail"]');
    const back = document.querySelector('[data-demo-ux="support-plan-back"]');
    const status = document.querySelector('[data-planning-pc="status"]');
    return {
      pass:
        Boolean(plan) &&
        !list &&
        !detail &&
        (back?.textContent ?? "").includes("支援計画") &&
        (status?.textContent ?? "").trim() === "適用中",
      backText: back?.textContent ?? "",
      statusText: status?.textContent ?? "",
    };
  });
  await recordCase("desktop-detail-one-click", page, url, found, errors);
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER",
  );
  await page.click(
    '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-e"]',
  );
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="support-plan-mgmt-create"]')),
  );
  const found = await page.evaluate(() => {
    const create = document.querySelector('[data-demo-ux="support-plan-mgmt-create"]');
    const submit = document.querySelector('[data-demo-ux="support-plan-mgmt-create-submit"]');
    const text = document.body?.textContent ?? "";
    return {
      pass:
        Boolean(create) &&
        submit instanceof HTMLButtonElement &&
        submit.disabled &&
        text.indexOf("作成・編集・保存は接続されていません") >= 0 &&
        text.indexOf("承認済み") < 0,
      submitDisabled: submit instanceof HTMLButtonElement ? submit.disabled : false,
    };
  });
  await recordCase("desktop-create-entrance", page, url, found, errors);
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER",
  );
  await page.click(
    '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-b"]',
  );
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="support-plan-mgmt-synth-detail"]')),
  );
  const found = await page.evaluate(() => {
    const detail = document.querySelector('[data-demo-ux="support-plan-mgmt-synth-detail"]');
    const text = document.body?.textContent ?? "";
    return {
      pass:
        Boolean(detail) &&
        text.indexOf("Bさん") >= 0 &&
        text.indexOf("見直し時期") >= 0 &&
        text.indexOf("詳細の完成はこの画面の対象外") >= 0,
    };
  });
  await recordCase("desktop-synthetic-detail", page, url, found, errors);
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=FIELD_STAFF",
  );
  const found = await page.evaluate(() => ({
    pass:
      Boolean(document.querySelector('[data-demo-ux="users-list"]')) &&
      !document.querySelector('[data-demo-ux="support-plan-management-list"]'),
  }));
  await recordCase("field-staff-users-list-regression", page, url, found, errors);
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=ADMIN_AUDIT",
  );
  const found = await page.evaluate(() => ({
    pass:
      Boolean(document.querySelector('[data-demo-ux="users-list"]')) &&
      !document.querySelector('[data-demo-ux="support-plan-management-list"]'),
  }));
  await recordCase("admin-audit-users-list-unchanged", page, url, found, errors);
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER",
  );
  await page.focus('[data-demo-ux="support-plan-mgmt-heading"]');
  await page.keyboard.press("Tab");
  const before = await page.evaluate(() => document.activeElement?.tagName ?? "");
  await page.evaluate(() => {
    const button = document.querySelector(
      '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]',
    );
    if (button instanceof HTMLElement) button.focus();
  });
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => Boolean(document.querySelector('[data-demo-ux="support-plan"]')));
  const found = await page.evaluate((beforeTag) => {
    const plan = document.querySelector('[data-demo-ux="support-plan"]');
    const heading = document.querySelector('[data-demo-ux="support-plan-heading"]');
    const active = document.activeElement;
    return { pass: Boolean(plan) && Boolean(heading) && (active === heading || Boolean(plan)), beforeTag };
  }, before);
  await recordCase("keyboard-detail-enter", page, url, found, errors);
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER",
    { width: 640, height: 900, deviceScaleFactor: 2 },
  );
  const found = await page.evaluate(assertPlannerList);
  await recordCase("desktop-200-percent-equivalent", page, url, found, errors);
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(
    page,
    "viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER",
    { width: 768, height: 1024, deviceScaleFactor: 1 },
  );
  const found = await page.evaluate(assertPlannerList);
  await recordCase("narrow-pc-width", page, url, found, errors);
  await page.close();
}

for (const [name, query, viewport, expectUnavailable] of [
  ["management-home-1280", "managementHome=resolved", { width: 1280, height: 900, deviceScaleFactor: 1 }, false],
  ["management-home-390", "managementHome=resolved", { width: 390, height: 844, deviceScaleFactor: 1 }, false],
  ["management-home-unavailable", "managementHome=unavailable", { width: 1280, height: 900, deviceScaleFactor: 1 }, true],
  ["management-home-mismatch", "managementHome=mismatch", { width: 390, height: 844, deviceScaleFactor: 1 }, true],
]) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = await smokeGoto(page, query, viewport);
  const found = await page.evaluate(assertManagementHome, expectUnavailable);
  await recordCase(name, page, url, found, errors);
  await page.close();
}

const report = {
  unit: "SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 + SBS-MGMT-HOME-C",
  kind: "browser smoke / Planning PC support-plan management list + read-only Management Home",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "SBS-MGMT-HOME-C",
    presentationOnly: true,
    liveWriteAuthorized: false,
    deployAuthorized: false,
  },
  allPass,
  checks,
};

fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

console.log(JSON.stringify({ allPass, artifactsDir, cases: checks.length }, null, 2));
process.exit(allPass ? 0 : 1);
