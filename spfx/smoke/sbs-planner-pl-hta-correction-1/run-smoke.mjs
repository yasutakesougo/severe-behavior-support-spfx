#!/usr/bin/env node
/**
 * SBS-PLANNER-PL-HTA-CORRECTION-1 dedicated browser smoke.
 * Synthetic / presentation only. No LIVE WRITE / auth / schema / Deploy.
 * ?cycle= is forbidden as D-PLAN / D-MONITOR bind proof.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.SBS_PLANNER_PL_HTA_CORR_1_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/sbs-planner-pl-hta-correction-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SBS_PLANNER_PL_HTA_CORR_1_ESBUILD_PATH ??
    process.env.SBS_PLANNER_ROLE_BINDING_ESBUILD_PATH ??
    process.env.SBS_PLANNER_TL_IA_ESBUILD_PATH ??
    path.join(spfxRoot, "node_modules/esbuild/lib/main.js")
);
const puppeteerModule = await import(
  process.env.SBS_PLANNER_PL_HTA_CORR_1_PUPPETEER_PATH ??
    process.env.SBS_PLANNER_ROLE_BINDING_PUPPETEER_PATH ??
    process.env.SBS_PLANNER_TL_IA_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.SBS_PLANNER_PL_HTA_CORR_1_SASS_PATH ??
    process.env.SBS_PLANNER_ROLE_BINDING_SASS_PATH ??
    process.env.SBS_PLANNER_TL_IA_SASS_PATH ??
    path.join(spfxRoot, "node_modules/sass/sass.node.js")
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss = sassModule.compile ?? sassModule.default?.compile;

function normalizeSpfxThemeCss(css) {
  return css
    .replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1")
    .replace(/:global\(([^)]+)\)/g, "$1");
}

const scssPaths = [
  "src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss",
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/ux/Vp1DemoSeparation.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/dashboard/TodaySupportDayBoardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
  "src/shell/users/SupportPlanUx.module.scss",
  "src/shell/users/SupportPlanManagementListUx.module.scss",
  "src/shell/users/ManagementHomeUx.module.scss",
  "src/shell/monitoring/MonitoringViewUx.module.scss",
  "src/shell/primitives/Primitives.module.scss",
];
const css = scssPaths
  .map((relativePath) =>
    normalizeSpfxThemeCss(
      compileScss(path.join(spfxRoot, relativePath), { style: "expanded" }).css,
    ),
  )
  .join("\n");
fs.writeFileSync(path.join(__dirname, "smoke-production.css"), css);

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
        .map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(key)}`)
        .join(",\n");
      return { contents: `export default {\n${entries}\n};`, loader: "js" };
    });
  },
};

await esbuild.build({
  entryPoints: [path.join(__dirname, "smoke-entry.tsx")],
  bundle: true,
  outfile: path.join(__dirname, "smoke-bundle.js"),
  format: "iife",
  platform: "browser",
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  plugins: [scssStubPlugin],
  define: { "process.env.NODE_ENV": '"production"' },
  nodePaths: [
    process.env.SBS_PLANNER_PL_HTA_CORR_1_NODE_PATH ??
      process.env.SBS_PLANNER_ROLE_BINDING_NODE_PATH ??
      process.env.SBS_PLANNER_TL_IA_NODE_PATH ??
      path.join(spfxRoot, "node_modules"),
  ],
});

fs.writeFileSync(
  path.join(__dirname, "index.html"),
  '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="smoke-production.css"></head><body><div id="root"></div><script src="smoke-bundle.js"></script></body></html>',
);

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const relativePath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(__dirname, path.normalize(relativePath).replace(/^(\.\.[/\\])+/, ""));
  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(404).end("not found");
      return;
    }
    const extension = path.extname(filePath);
    const contentType =
      extension === ".html"
        ? "text/html"
        : extension === ".css"
          ? "text/css"
          : "application/javascript";
    response.writeHead(200, { "Content-Type": `${contentType}; charset=utf-8` });
    response.end(data);
  });
});
await new Promise((resolve) => server.listen(4202, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath:
    process.env.SBS_PLANNER_PL_HTA_CORR_1_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const baseUrl = "http://127.0.0.1:4202/index.html";
const results = [];

async function inspect(page) {
  return page.evaluate(() => {
    const plannerRoot = document.querySelector('[data-role-task-ia="PLANNER"]');
    const chrome = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const primaryAction = document.querySelector('[data-role-task-primary-action="true"]');
    const bodyText = document.body.innerText ?? "";
    const globals = [...document.querySelectorAll("nav [data-role-task-global]")].map(
      (element) => ({
        id: element.getAttribute("data-role-task-global") ?? "",
        dest: element.getAttribute("data-role-task-nav") ?? "",
        label: element.textContent?.trim() ?? "",
      }),
    );
    return {
      chromeRole: chrome?.getAttribute("data-shell-ux-presentation-role") ?? "",
      destination: plannerRoot?.getAttribute("data-role-task-destination") ?? "",
      cycle: plannerRoot?.getAttribute("data-role-task-cycle") ?? "",
      context: plannerRoot?.getAttribute("data-role-task-person-plan-context") ?? "",
      globals,
      globalCount: globals.length,
      findPersonIsSearch: globals.some(
        (item) => item.label === "探す" && item.dest === "D-FIND-PERSON",
      ),
      findPersonIsPlan: globals.some((item) => item.label === "探す" && item.dest === "D-PLAN"),
      findPersonIsRecord: globals.some(
        (item) => item.label === "探す" && item.dest === "D-FIND-RECORD",
      ),
      primaryActionDisabled: primaryAction ? primaryAction.disabled : true,
      hasSupportPlan: Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
      hasMonitoringHost: Boolean(
        document.querySelector('[data-role-task-product-body="D-MONITOR"]'),
      ),
      hasZeroNotNotPerformed: Boolean(
        document.querySelector("[data-monitoring-zero-not-not-performed]"),
      ),
      hasOverviewDashboard: Boolean(
        document.querySelector("[data-dashboard-ux='overview-dashboard']"),
      ),
      hasList: Boolean(document.querySelector('[data-demo-ux="support-plan-mgmt-row-list"]')),
      hasSynthDetail: Boolean(
        document.querySelector('[data-demo-ux="support-plan-mgmt-synth-detail"]'),
      ),
      failClosed: Boolean(document.querySelector("[data-role-task-fail-closed]")),
      processNavLabels: [...document.querySelectorAll("[data-planning-pc-section-nav]")].map(
        (element) => element.textContent?.trim() ?? "",
      ),
      currentLabel:
        document.querySelector('[data-demo-ux="support-plan-lifecycle"]')?.textContent ?? "",
      bodyHasTodaySupport: bodyText.includes("今日の支援"),
      bodyHasSmokePass: bodyText.includes("Browser Smoke PASS") || bodyText.includes("allPass"),
      bodyHasZeroCopy: bodyText.includes(
        "0件であることは、「実施できなかった」という結果を意味しません。",
      ),
      bodyHasNotPerformed: bodyText.includes("実施できなかった"),
      bodyHasCurrent: bodyText.includes("現行版"),
      bodyHasDraftOrNext: bodyText.includes("下書き") || bodyText.includes("次版"),
      cycleQueryUsed: window.location.search.includes("cycle="),
    };
  });
}

async function selectDemoRole(page, role) {
  const selector = `[data-shell-ux-demo-role="${role}"]`;
  await page.waitForSelector(selector);
  await page.$eval(selector, (el) => {
    el.scrollIntoView({ block: "center" });
  });
  await page.click(selector);
}

async function openPage(viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await page.waitForSelector('[data-role-task-ia="FIELD_STAFF"]');
  return { page, pageErrors };
}

async function becomePlanner(page) {
  await selectDemoRole(page, "PLANNER");
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-presentation-role") === "PLANNER" &&
      Boolean(document.querySelector('[data-role-task-ia="PLANNER"]')),
  );
}

async function screenshot(page, name) {
  await page.screenshot({
    path: path.join(artifactsDir, name),
    fullPage: true,
  });
}

async function runSequence(viewport, suffix) {
  const { page, pageErrors } = await openPage(viewport);
  await becomePlanner(page);
  const noContext = await inspect(page);
  const sc1 =
    noContext.destination === "D-HOME" &&
    noContext.cycle === "unknown" &&
    noContext.context === "none" &&
    noContext.primaryActionDisabled &&
    !noContext.cycleQueryUsed &&
    pageErrors.length === 0;
  await screenshot(page, `01-no-context-unknown-fail-closed${suffix}.png`);

  await page.click('[data-role-task-global="GLOBAL-FIND-PERSON"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-FIND-PERSON",
  );
  await page.waitForSelector('[data-demo-ux="support-plan-mgmt-row-list"]');
  const findPerson = await inspect(page);
  const sc8 =
    findPerson.destination === "D-FIND-PERSON" &&
    findPerson.findPersonIsSearch &&
    !findPerson.findPersonIsPlan &&
    !findPerson.findPersonIsRecord &&
    findPerson.hasList &&
    !findPerson.hasSupportPlan &&
    findPerson.globalCount === 2;
  await screenshot(page, `02-find-person-list-not-d-plan${suffix}.png`);

  await page.click(
    'button[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-b"]',
  );
  await page.waitForSelector('[data-demo-ux="support-plan-mgmt-synth-detail"]');
  const synth = await inspect(page);
  const sc3b =
    synth.hasSynthDetail &&
    synth.context === "none" &&
    synth.cycle === "unknown" &&
    synth.primaryActionDisabled &&
    !synth.hasSupportPlan;
  await screenshot(page, `03-synthetic-detail-not-context${suffix}.png`);

  await page.click('[data-demo-ux="support-plan-mgmt-back"]');
  await page.waitForSelector('[data-demo-ux="support-plan-mgmt-row-list"]');
  await page.click(
    'button[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]',
  );
  await page.waitForSelector('[data-demo-ux="support-plan"]');
  const acquired = await inspect(page);
  const sc3a =
    acquired.hasSupportPlan &&
    acquired.context === "live" &&
    acquired.cycle === "②" &&
    acquired.destination === "D-FIND-PERSON";
  await screenshot(page, `04-existing-plan-establishes-context${suffix}.png`);

  await page.click('[data-role-task-global="GLOBAL-CURRENT-CYCLE"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-HOME" &&
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-cycle") === "②",
  );
  await page.click('[data-role-task-primary-action="true"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-PLAN" &&
      Boolean(document.querySelector('[data-demo-ux="support-plan"]')),
  );
  const dPlan = await inspect(page);
  const sc4 =
    dPlan.destination === "D-PLAN" &&
    dPlan.hasSupportPlan &&
    dPlan.bodyHasCurrent &&
    dPlan.bodyHasDraftOrNext &&
    !dPlan.hasOverviewDashboard &&
    dPlan.processNavLabels.join("|") === "① 計画|② 支援|③ 記録|④ モニタリング|⑤ 見直し|⑥ 次版準備";
  const sc7 = !dPlan.hasOverviewDashboard;
  await screenshot(page, `05-d-plan-bound-support-plan${suffix}.png`);
  await screenshot(page, `08-no-overview-as-d-plan${suffix}.png`);

  await page.click('[data-planning-pc-section-nav="planner-process-monitoring-heading"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-cycle") === "④",
  );
  await page.click('[data-role-task-global="GLOBAL-CURRENT-CYCLE"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-HOME" &&
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-cycle") === "④",
  );
  await page.click('[data-role-task-primary-action="true"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-MONITOR" &&
      Boolean(document.querySelector('[data-role-task-product-body="D-MONITOR"]')),
  );
  const dMonitor = await inspect(page);
  const sc5 =
    dMonitor.destination === "D-MONITOR" &&
    dMonitor.hasMonitoringHost &&
    !dMonitor.hasOverviewDashboard;
  const sc6 =
    dMonitor.hasZeroNotNotPerformed && dMonitor.bodyHasZeroCopy && dMonitor.bodyHasNotPerformed;
  const sc14 = !dMonitor.bodyHasSmokePass;
  await screenshot(page, `06-d-monitor-bound-monitoring-view${suffix}.png`);
  await screenshot(page, `07-zero-not-not-performed${suffix}.png`);

  const pass =
    sc1 && sc8 && sc3b && sc3a && sc4 && sc7 && sc5 && sc6 && sc14 && pageErrors.length === 0;
  results.push({
    name: `pl-hta-correction-1${suffix || "-desktop"}`,
    pass,
    viewport,
    checks: { sc1, sc8, sc3b, sc3a, sc4, sc7, sc5, sc6, sc14 },
    state: { noContext, findPerson, synth, acquired, dPlan, dMonitor },
    pageErrors,
  });
  await page.close();
  return pass;
}

const desktopPass = await runSequence({ width: 1280, height: 900 }, "");
const mobilePass = await runSequence({ width: 390, height: 844 }, "-390");
const allPass = desktopPass && mobilePass;

const payload = {
  unit: "SBS-PLANNER-PL-HTA-CORRECTION-1",
  implementationHead: process.env.SBS_PLANNER_PL_HTA_CORR_1_IMPLEMENTATION_HEAD ?? "",
  allPass,
  smokePassIsNotBusinessCompletion: true,
  results,
};
fs.writeFileSync(
  path.join(artifactsDir, "smoke-results.json"),
  `${JSON.stringify(payload, null, 2)}\n`,
);

await browser.close();
server.close();

if (!allPass) {
  console.error(JSON.stringify(payload, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(payload, null, 2));
