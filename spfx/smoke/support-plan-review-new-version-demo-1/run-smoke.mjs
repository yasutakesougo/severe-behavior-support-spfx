#!/usr/bin/env node
/**
 * SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1 browser smoke.
 * Scope: version compare + review materials → next-version concept.
 * No persistence / Draft workflow / Schema change / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.RNVD_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/support-plan-review-new-version-demo-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.RNVD_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.RNVD_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.RNVD_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs"
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

await new Promise((resolve) => server.listen(4193, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4193";

const browser = await puppeteer.launch({
  executablePath: process.env.RNVD_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];
let allPass = true;

async function openPlannerSupportPlan(page) {
  await page.click(
    '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]',
  );
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
  );
}

async function openUsersListSupportPlan(page) {
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
  const reviewCta = document.querySelector('[data-planning-pc="review-cta"]');
  const reviewBadge = document.querySelector('[data-demo-ux="support-plan-review-status-badge"]');
  const nextConcept = document.querySelector('[data-review-new-version="next-version-concept"]');
  const createCta = document.querySelector('[data-review-new-version="create-cta"]');
  const primaryActions = document.querySelectorAll('[data-sbs-action="primary"]');
  const forbidden = ["最終承認者", "承認済み"];
  const headings = [...document.querySelectorAll("h2")].map((el) => el.textContent?.trim() ?? "");
  return {
    pass:
      Boolean(plan) &&
      (status?.textContent ?? "").trim() === "適用中" &&
      Boolean(reviewCta) &&
      reviewCta?.getAttribute("data-sbs-action") === "primary" &&
      Boolean(reviewBadge) &&
      primaryActions.length === 1 &&
      Boolean(nextConcept) &&
      createCta instanceof HTMLButtonElement &&
      createCta.disabled &&
      headings.includes("次の版の考え方") &&
      headings.includes("過去の版") &&
      text.indexOf("計画は上書きせず") >= 0 &&
      text.indexOf("観察の不足だけでは") >= 0 &&
      text.indexOf("見直し期限の超過だけでは") >= 0 &&
      text.indexOf("次に重ねる概念上の版は 4") >= 0 &&
      text.indexOf("計画版 2") >= 0 &&
      forbidden.every((token) => text.indexOf(token) < 0),
    statusText: status?.textContent ?? "",
    reviewBadgeText: reviewBadge?.textContent ?? "",
    hasNextConcept: Boolean(nextConcept),
    createDisabled: createCta instanceof HTMLButtonElement ? createCta.disabled : false,
  };
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openPlannerSupportPlan(page);
  const found = await page.evaluate(assertPlannerSupportPlan);
  found.pageErrors = errors;
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, "planner-next-version-concept.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: "planner-next-version-concept", url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openPlannerSupportPlan(page);
  await page.click('[data-planning-pc-version="2"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-review-new-version="version-compare"]')),
  );
  const found = await page.evaluate(() => {
    const compare = document.querySelector('[data-review-new-version="version-compare"]');
    const past = document.querySelector('[data-review-new-version="compare-past"]');
    const current = document.querySelector('[data-review-new-version="compare-current"]');
    const text = document.body?.textContent ?? "";
    return {
      pass:
        Boolean(compare) &&
        (past?.textContent ?? "").includes("synthetic v2 method") &&
        (current?.textContent ?? "").includes("写真カード") &&
        text.indexOf("計画版 2") >= 0 &&
        !text.includes("synthetic-proc-rec-v2-001"),
      pastText: (past?.textContent ?? "").slice(0, 200),
      currentText: (current?.textContent ?? "").slice(0, 200),
    };
  });
  found.pageErrors = errors;
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, "planner-version-compare-v2.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: "planner-version-compare-v2", url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openPlannerSupportPlan(page);
  await page.click('[data-planning-pc="review-cta"]');
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-review-new-version="from-review-cta"]')),
  );
  await page.click(
    '[data-field-workflow="review-material-open"][data-field-workflow-material-id="synthetic-proc-rec-v2-001"]',
  );
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-field-workflow="review-projection-resolved"]')),
  );
  const reviewFound = await page.evaluate(() => {
    const cta = document.querySelector('[data-review-new-version="from-review-cta"]');
    const text = document.body?.textContent ?? "";
    return {
      pass:
        Boolean(cta) && text.indexOf("plan v2") >= 0 && text.indexOf("最新版へ付け替えない") >= 0,
      cta: cta?.textContent?.trim() ?? "",
    };
  });
  const reviewPass = Boolean(reviewFound.pass) && errors.length === 0;
  const reviewShot = path.join(artifactsDir, "planner-review-to-next-version.png");
  await page.screenshot({ path: reviewShot, fullPage: true });
  checks.push({
    name: "planner-review-materials-next-version-cta",
    url,
    found: { ...reviewFound, pageErrors: errors },
    shot: reviewShot,
    pass: reviewPass,
    pageErrors: errors,
  });
  allPass = allPass && reviewPass;

  await page.click('[data-review-new-version="from-review-cta"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-review-new-version="next-version-concept"]')
        ?.getAttribute("data-review-new-version-highlighted") === "true",
  );
  const conceptFound = await page.evaluate(() => {
    const concept = document.querySelector('[data-review-new-version="next-version-concept"]');
    const highlighted = concept?.getAttribute("data-review-new-version-highlighted");
    const chrome = document.querySelector('[data-review-new-version-from-review="true"]');
    return {
      pass: highlighted === "true" && Boolean(chrome) && Boolean(concept),
      highlighted,
    };
  });
  const conceptPass = Boolean(conceptFound.pass) && errors.length === 0;
  const conceptShot = path.join(artifactsDir, "planner-next-version-from-review.png");
  await page.screenshot({ path: conceptShot, fullPage: true });
  checks.push({
    name: "planner-review-to-next-version-concept",
    url,
    found: { ...conceptFound, pageErrors: errors },
    shot: conceptShot,
    pass: conceptPass,
    pageErrors: errors,
  });
  allPass = allPass && conceptPass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=ADMIN_AUDIT`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openUsersListSupportPlan(page);
  const found = await page.evaluate(() => {
    const nextConcept = document.querySelector('[data-review-new-version="next-version-concept"]');
    const createCta = document.querySelector('[data-review-new-version="create-cta"]');
    const status = document.querySelector('[data-planning-pc="status"]');
    const text = document.body?.textContent ?? "";
    const forbidden = ["最終承認者", "承認済み"];
    return {
      pass:
        Boolean(nextConcept) &&
        !createCta &&
        (status?.textContent ?? "").trim() === "適用中" &&
        text.indexOf("計画は上書きせず") >= 0 &&
        forbidden.every((token) => text.indexOf(token) < 0),
      hasNextConcept: Boolean(nextConcept),
      hasCreateCta: Boolean(createCta),
      statusText: status?.textContent ?? "",
    };
  });
  found.pageErrors = errors;
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, "admin-audit-next-version-concept.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "admin-audit-next-version-concept",
    url,
    found,
    shot,
    pass,
    pageErrors: errors,
  });
  allPass = allPass && pass;
  await page.close();
}

{
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=FIELD_STAFF`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await openUsersListSupportPlan(page);
  const found = await page.evaluate(() => {
    const nextConcept = document.querySelector('[data-review-new-version="next-version-concept"]');
    const compare = document.querySelector('[data-review-new-version="version-compare"]');
    const text = document.body?.textContent ?? "";
    return {
      pass:
        !nextConcept && !compare && text.indexOf("適用中") >= 0 && text.indexOf("最終承認者") < 0,
      hasNextConcept: Boolean(nextConcept),
    };
  });
  found.pageErrors = errors;
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, "field-staff-next-version-hidden.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "field-staff-next-version-hidden",
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
  unit: "SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1",
  kind: "browser smoke / version compare and next-version concept",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "SUPPORT-PLAN-REVIEW-NEW-VERSION-DEMO-1",
    presentationOnly: true,
    versionPersistenceAuthorized: false,
    draftWorkflowAuthorized: false,
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
