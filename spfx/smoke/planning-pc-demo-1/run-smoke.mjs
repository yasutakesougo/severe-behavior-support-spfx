#!/usr/bin/env node
/**
 * PLANNING-PC-DEMO-1 browser smoke runner (Chrome via puppeteer-core).
 * Scope: PLANNER support plan graph + nested review materials navigation.
 * No live plan mutation / auth judgment / adapter / live I/O / Schema change.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.PPC_ARTIFACTS_DIR ?? "/opt/cursor/artifacts/planning-pc-demo-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.PPC_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.PPC_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.PPC_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs"
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

await new Promise((resolve) => server.listen(4189, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4189";

const browser = await puppeteer.launch({
  executablePath: process.env.PPC_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];
let allPass = true;

async function openSupportPlan(page) {
  await page.click('[data-demo-ux-detail-preview="true"]');
  await page.waitForFunction(() => Boolean(document.querySelector('[data-demo-ux="user-detail"]')));
  await page.click('[data-demo-ux="user-detail-open-plan"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
  );
}

function assertPlannerSupportPlan() {
  const plan = document.querySelector('[data-demo-ux="support-plan"]');
  const text = document.body?.textContent ?? "";
  const status = document.querySelector('[data-planning-pc="status"]');
  const version = document.querySelector('[data-planning-pc="version"]');
  const procedures = document.querySelector('[data-planning-pc="current-procedures"]');
  const records = document.querySelector('[data-planning-pc="recent-records"]');
  const versions = document.querySelector('[data-planning-pc="version-list"]');
  const reviewCta = document.querySelector('[data-planning-pc="review-cta"]');
  const mutationButtons = [
    ...document.querySelectorAll('[data-demo-ux="support-plan-mutation-button"]'),
  ];
  const forbidden = ["最終承認者", "承認済み"];
  const headings = [...document.querySelectorAll("h2")].map((el) => el.textContent?.trim() ?? "");
  return {
    pass:
      Boolean(plan) &&
      (status?.textContent ?? "").trim() === "適用中" &&
      (version?.textContent ?? "").includes("版 3") &&
      Boolean(procedures) &&
      Boolean(records) &&
      Boolean(versions) &&
      Boolean(reviewCta) &&
      mutationButtons.every((button) => button.disabled) &&
      headings.includes("現在の支援手順") &&
      headings.includes("最近の支援手順記録") &&
      headings.includes("過去の版") &&
      text.indexOf("環境調整") >= 0 &&
      text.indexOf("proc-rec-v2-001") < 0 &&
      text.indexOf("計画版 2") >= 0 &&
      forbidden.every((token) => text.indexOf(token) < 0),
    statusText: status?.textContent ?? "",
    versionText: version?.textContent ?? "",
    hasProcedures: Boolean(procedures),
    hasRecords: Boolean(records),
    hasVersions: Boolean(versions),
    hasReviewCta: Boolean(reviewCta),
  };
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openSupportPlan(page);
  const found = await page.evaluate(assertPlannerSupportPlan);
  found.pageErrors = errors;
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, "planner-support-plan.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: "planner-support-plan-graph", url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openSupportPlan(page);
  await page.click('[data-planning-pc="review-cta"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="review-due-state"]')),
  );
  const found = await page.evaluate(() => {
    const review = document.querySelector('[data-demo-ux="review-due-state"]');
    const plan = document.querySelector('[data-demo-ux="support-plan"]');
    const back = document.querySelector('[data-demo-ux="review-due-back"]');
    const shell = document.querySelector('[data-planning-pc-review-from-plan="true"]');
    return {
      pass:
        Boolean(review) &&
        !plan &&
        Boolean(back) &&
        (back?.textContent ?? "").includes("支援計画") &&
        Boolean(shell),
      backText: back?.textContent ?? "",
      shellReviewFromPlan: shell?.getAttribute("data-planning-pc-review-from-plan") ?? "",
    };
  });
  found.pageErrors = errors;
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, "planner-review-materials.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "planner-review-materials-nested",
    url,
    found,
    shot,
    pass,
    pageErrors: errors,
  });
  allPass = allPass && pass;

  await page.click('[data-demo-ux="review-due-back"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
  );
  const backFound = await page.evaluate(() => ({
    planPresent: Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
    reviewPresent: Boolean(document.querySelector('[data-demo-ux="review-due-state"]')),
  }));
  const backPass = backFound.planPresent && !backFound.reviewPresent && errors.length === 0;
  const backShot = path.join(artifactsDir, "planner-back-to-support-plan.png");
  await page.screenshot({ path: backShot, fullPage: true });
  checks.push({
    name: "planner-back-to-support-plan",
    url,
    found: { ...backFound, pageErrors: errors },
    shot: backShot,
    pass: backPass,
    pageErrors: errors,
  });
  allPass = allPass && backPass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=FIELD_STAFF`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openSupportPlan(page);
  const found = await page.evaluate(() => {
    const text = document.body?.textContent ?? "";
    const procedures = document.querySelector('[data-planning-pc="current-procedures"]');
    const reviewCta = document.querySelector('[data-planning-pc="review-cta"]');
    const goals = document.querySelectorAll('[data-demo-ux="support-plan-goal"]');
    return {
      pass:
        goals.length === 2 &&
        !procedures &&
        !reviewCta &&
        text.indexOf("適用中") >= 0 &&
        text.indexOf("最終承認者") < 0,
      goals: goals.length,
      hasProcedures: Boolean(procedures),
      hasReviewCta: Boolean(reviewCta),
    };
  });
  found.pageErrors = errors;
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, "field-staff-support-plan-regression.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "field-staff-demo-ux-4-regression",
    url,
    found,
    shot,
    pass,
    pageErrors: errors,
  });
  allPass = allPass && pass;
  await page.close();
}

const report = {
  unit: "PLANNING-PC-DEMO-1",
  kind: "browser smoke / Planning PC synthetic support plan graph",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "PLANNING-PC-DEMO-1",
    presentationOnly: true,
    syntheticPlanningPcNavigationAuthorized: true,
    schemaChangeAuthorized: false,
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
