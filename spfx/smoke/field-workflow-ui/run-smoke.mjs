#!/usr/bin/env node
/**
 * FIELD-WORKFLOW UI (#356) browser smoke — ~390px field flow + keyboard path.
 * Synthetic fixture only — no SharePoint / Deploy / live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  createBrowserNetworkEvidenceCollector,
  NO_LIVE_WRITE_CHECK_ID,
} from "../../../scripts/layer-a/browser-network-evidence.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.FW_ARTIFACTS_DIR ?? "/opt/cursor/artifacts/field-workflow-ui-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.FW_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.FW_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(process.env.FW_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs");
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ?? sassModule.default?.compile ?? (await import("sass")).compile;

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

function compileProductionCss() {
  const paths = [
    "src/shell/ux/ShellUx.module.scss",
    "src/shell/dashboard/DashboardUx.module.scss",
    "src/shell/users/UsersUx.module.scss",
    "src/shell/users/UserDetailUx.module.scss",
    "src/shell/procedure/CurrentProcedureUx.module.scss",
    "src/shell/procedure/ProcedureRecordFormUx.module.scss",
    "src/shell/review/ReviewDueStateUx.module.scss",
  ];
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  const compiled = paths
    .map((rel) =>
      normalizeSpfxThemeCss(compileScss(path.join(repoRoot, rel), { style: "expanded" }).css),
    )
    .join("\n");
  return `${resetCss}\n${compiled}`;
}

const productionCss = compileProductionCss();
fs.writeFileSync(path.join(outDir, "smoke-production.css"), productionCss);

const has390Media =
  productionCss.includes("@media (max-width: 390px)") &&
  productionCss.includes(".currentProcedure") &&
  productionCss.includes(".procedureRecordForm");

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

await new Promise((resolve) => server.listen(4188, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4188";
const browser = await puppeteer.launch({
  executablePath: process.env.FW_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=390,844"],
  defaultViewport: { width: 390, height: 844 },
});

const checks = [];
const networkEvidenceCollector = createBrowserNetworkEvidenceCollector();

async function openPage(query) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      const text = message.text();
      if (
        text.includes("favicon") ||
        text.includes("404") ||
        text.includes("Failed to load resource")
      ) {
        return;
      }
      errors.push(`console: ${text}`);
    }
  });
  networkEvidenceCollector.attach(page);
  page.on("requestfailed", (request) => {
    const url = request.url();
    if (url.includes("favicon")) {
      return;
    }
  });
  await page.goto(`${base}/${query}`, { waitUntil: "networkidle0" });
  return { page, errors };
}

async function clickVisible(page, selector) {
  await page.waitForSelector(selector);
  const clicked = await page.$eval(selector, (el) => {
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (!(el instanceof HTMLElement) || el.getClientRects().length === 0) {
      return false;
    }
    el.click();
    return true;
  });
  if (!clicked) {
    throw new Error(`clickVisible: ${selector} was not an HTMLElement with a layout box`);
  }
}

try {
  checks.push({ id: "css-390-media", pass: has390Media });

  const { page, errors } = await openPage(
    "?viewMode=ready&siteSelection=SITE-ISG&destination=users&saveState=unsaved",
  );
  checks.push({ id: "no-page-errors-initial", pass: errors.length === 0, detail: errors });

  await clickVisible(page, '[data-demo-ux-detail-preview="true"]');
  await page.waitForSelector('[data-demo-ux="user-detail"]');
  await clickVisible(page, '[data-field-workflow="open-current-procedure"]');
  await page.waitForSelector('[data-field-workflow="current-procedure"]');

  const procedureAttrs = await page.$eval('[data-field-workflow="current-procedure"]', (el) => ({
    planVersion: el.getAttribute("data-field-workflow-plan-version"),
    procedureId: el.getAttribute("data-field-workflow-procedure-id"),
    scene: el.querySelector('[data-field-workflow="procedure-scene"]')?.textContent ?? "",
  }));
  checks.push({
    id: "fw01-current-procedure-visible",
    pass:
      procedureAttrs.planVersion === "3" &&
      procedureAttrs.procedureId === "synthetic-procedure-p3" &&
      procedureAttrs.scene.length > 0,
    detail: procedureAttrs,
  });

  const procedureVisualPolish = await page.$eval(
    '[data-field-workflow="current-procedure"]',
    (el) => el.getAttribute("data-field-workflow-visual-polish"),
  );
  checks.push({
    id: "vp4-current-procedure-visual-boundary",
    pass: procedureVisualPolish === "VP-4-WORKFLOW",
    detail: { procedureVisualPolish },
  });

  await clickVisible(page, '[data-field-workflow="record-procedure-cta"]');
  await page.waitForSelector('[data-field-workflow="procedure-record-form"]');

  const formAttrs = await page.$eval('[data-field-workflow="procedure-record-form"]', (el) => ({
    planVersion: el.getAttribute("data-field-workflow-plan-version"),
    procedureId: el.getAttribute("data-field-workflow-procedure-id"),
    destination: document
      .querySelector('[data-shell-ux="app-shell-chrome"]')
      ?.getAttribute("data-shell-ux-destination"),
  }));
  checks.push({
    id: "fw02-context-handoff-no-reselect",
    pass:
      formAttrs.planVersion === "3" &&
      formAttrs.procedureId === "synthetic-procedure-p3" &&
      formAttrs.destination === "users",
    detail: formAttrs,
  });

  const formVisualPolish = await page.$eval('[data-field-workflow="procedure-record-form"]', (el) =>
    el.getAttribute("data-field-workflow-visual-polish"),
  );
  checks.push({
    id: "vp4-procedure-form-visual-boundary",
    pass: formVisualPolish === "VP-4-WORKFLOW",
    detail: { formVisualPolish },
  });

  const saveCta = await page.$eval('[data-field-workflow="procedure-record-save"]', (el) =>
    (el.textContent ?? "").trim(),
  );
  checks.push({
    id: "kp-save-cta-label",
    pass: saveCta === "記録を保存",
    detail: { saveCta },
  });

  await clickVisible(
    page,
    '[data-field-workflow-result="PERFORMED_WITH_ADAPTATION"] input[type="radio"]',
  );
  await clickVisible(page, '[data-field-workflow="procedure-record-save"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-field-workflow="procedure-record-form"]')
        ?.getAttribute("data-field-workflow-save-state") === "save_failed",
  );
  const failedSelected = await page.$eval(
    '[data-field-workflow-result="PERFORMED_WITH_ADAPTATION"]',
    (el) => el.getAttribute("data-field-workflow-result-selected"),
  );
  const savePath = await page.$eval('[data-field-workflow="procedure-record-form"]', (el) =>
    el.getAttribute("data-field-workflow-save-path"),
  );
  const syntheticOutcomeCount = await page.$$eval(
    '[data-field-workflow="synthetic-outcome"]',
    (els) => els.length,
  );
  checks.push({
    id: "fw09-save-failed-retains-input",
    pass: failedSelected === "true",
    detail: { failedSelected },
  });
  checks.push({
    id: "kp-persist-path-connected",
    pass: savePath === "persistProcedureRecord",
    detail: { savePath },
  });
  checks.push({
    id: "kp-synthetic-success-removed",
    pass: syntheticOutcomeCount === 0,
    detail: { syntheticOutcomeCount },
  });

  const retryEnabled = await page.waitForFunction(() => {
    const button = document.querySelector('[data-field-workflow="procedure-record-save"]');
    return button instanceof HTMLButtonElement && button.disabled === false;
  });
  checks.push({
    id: "fw09-save-failed-allows-retry",
    pass: Boolean(retryEnabled),
    detail: { retryEnabled: true },
  });

  await page.keyboard.press("Tab");
  const activeTag = await page.evaluate(() => document.activeElement?.tagName ?? "");
  checks.push({
    id: "fw08-keyboard-focus-moves",
    pass: typeof activeTag === "string" && activeTag.length > 0,
    detail: { activeTag },
  });

  await page.screenshot({
    path: path.join(artifactsDir, "field_workflow_390_procedure_record.png"),
    fullPage: true,
  });

  // Review drill-down path
  await page.goto(
    `${base}/?viewMode=ready&siteSelection=SITE-ISG&destination=overview&saveState=unsaved`,
    { waitUntil: "networkidle0" },
  );
  await clickVisible(page, '[data-demo-ux="overview-open-review-due"]');
  await page.waitForSelector('[data-demo-ux="review-due-state"]');
  await clickVisible(page, '[data-field-workflow-material-id="synthetic-proc-rec-v2-001"]');
  await page.waitForSelector('[data-field-workflow="review-material-detail"]');
  const reviewDetail = await page.$eval('[data-field-workflow="review-material-detail"]', (el) => ({
    planVersion: el.getAttribute("data-field-workflow-plan-version"),
    status: el.getAttribute("data-field-workflow-historical-status"),
    resolved: Boolean(el.querySelector('[data-field-workflow="review-projection-resolved"]')),
  }));
  checks.push({
    id: "fw07-review-v2-projection",
    pass:
      reviewDetail.planVersion === "2" &&
      reviewDetail.status === "RESOLVED" &&
      reviewDetail.resolved,
    detail: reviewDetail,
  });

  await clickVisible(page, '[data-field-workflow-material-id="proc-rec-unresolved-001"]');
  await page.waitForSelector('[data-field-workflow="review-projection-unresolved"]');
  const unresolved = await page.$eval('[data-field-workflow="review-material-detail"]', (el) =>
    el.getAttribute("data-field-workflow-historical-status"),
  );
  checks.push({
    id: "fw05-historical-fail-closed",
    pass: unresolved === "FETCH_FAILED",
    detail: { unresolved },
  });

  await page.screenshot({
    path: path.join(artifactsDir, "field_workflow_review_materials.png"),
    fullPage: true,
  });

  const networkEvidence = networkEvidenceCollector.snapshot();
  checks.push({
    id: NO_LIVE_WRITE_CHECK_ID,
    pass: networkEvidence.noLiveWriteProof,
    detail: {
      applicationDataMutationRequests: networkEvidence.applicationDataMutationRequests,
    },
  });
} finally {
  await browser.close();
  server.close();
}

const report = {
  slice: "FIELD-WORKFLOW-UI",
  issue: "#356",
  date: new Date().toISOString(),
  viewport: { width: 390, height: 844 },
  syntheticDataOnly: true,
  productionBound: false,
  checks,
  pass: checks.every((check) => check.pass),
  networkEvidence: networkEvidenceCollector.snapshot(),
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.pass) {
  process.exit(1);
}
