#!/usr/bin/env node
/**
 * SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 browser smoke.
 * FE-F002 proof = operate Demo presentation-role entrance.
 * Synthetic presentation only. No LIVE WRITE / auth / schema mutation.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.SBS_PLANNER_ROLE_BINDING_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/sbs-planner-product-role-binding-v1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SBS_PLANNER_ROLE_BINDING_ESBUILD_PATH ??
    process.env.SBS_PLANNER_TL_IA_ESBUILD_PATH ??
    process.env.SBS_ROLE_TASK_IA_ESBUILD_PATH ??
    path.join(spfxRoot, "node_modules/esbuild/lib/main.js")
);
const puppeteerModule = await import(
  process.env.SBS_PLANNER_ROLE_BINDING_PUPPETEER_PATH ??
    process.env.SBS_PLANNER_TL_IA_PUPPETEER_PATH ??
    process.env.SBS_ROLE_TASK_IA_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.SBS_PLANNER_ROLE_BINDING_SASS_PATH ??
    process.env.SBS_PLANNER_TL_IA_SASS_PATH ??
    process.env.SBS_ROLE_TASK_IA_SASS_PATH ??
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
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/dashboard/TodaySupportDayBoardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
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
    process.env.SBS_PLANNER_ROLE_BINDING_NODE_PATH ??
      process.env.SBS_PLANNER_TL_IA_NODE_PATH ??
      process.env.SBS_ROLE_TASK_IA_NODE_PATH ??
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
await new Promise((resolve) => server.listen(4201, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_PLANNER_ROLE_BINDING_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const baseUrl = "http://127.0.0.1:4201/index.html";
const results = [];

async function inspect(page) {
  return page.evaluate(() => {
    const chrome = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const plannerRoot = document.querySelector('[data-role-task-ia="PLANNER"]');
    const fieldRoot = document.querySelector('[data-role-task-ia="FIELD_STAFF"]');
    const roleEntry = document.querySelector('[data-shell-ux="demo-presentation-role-entry"]');
    const primaryNav = document.querySelector('[data-shell-ux="primary-navigation"]');
    const siteSelector = document.querySelector('[data-shell-ux="site-selector"]');
    const demoBanner = document.querySelector('[data-shell-ux="demo-banner"]');
    const labels = [...document.querySelectorAll("nav [data-role-task-global]")].map(
      (element) => element.textContent?.trim() ?? "",
    );
    const primaryAction = document.querySelector('[data-role-task-primary-action="true"]');
    const nowLabel = [...document.querySelectorAll("nav [data-role-task-global]")].find((el) =>
      (el.textContent ?? "").includes("今の工程"),
    );
    const findLabel = [...document.querySelectorAll("nav [data-role-task-global]")].find((el) =>
      (el.textContent ?? "").includes("探す"),
    );
    return {
      chromeRole: chrome?.getAttribute("data-shell-ux-presentation-role") ?? "",
      plannerPresent: Boolean(plannerRoot),
      fieldPresent: Boolean(fieldRoot),
      taskRole: (plannerRoot ?? fieldRoot)?.getAttribute("data-role-task-ia") ?? "",
      taskDestination:
        (plannerRoot ?? fieldRoot)?.getAttribute("data-role-task-destination") ?? "",
      activeGlobal: (plannerRoot ?? fieldRoot)?.getAttribute("data-role-task-active-global") ?? "",
      cycle: plannerRoot?.getAttribute("data-role-task-cycle") ?? "",
      labels,
      roleEntryDisplay: roleEntry ? window.getComputedStyle(roleEntry).display : "missing",
      roleEntryEnabled: Boolean(
        document.querySelector('[data-shell-ux-demo-role="PLANNER"]:not([disabled])'),
      ),
      primaryNavDisplay: primaryNav ? window.getComputedStyle(primaryNav).display : "missing",
      siteSelectorDisplay: siteSelector
        ? window.getComputedStyle(siteSelector).display
        : "missing",
      demoBannerDisplay: demoBanner ? window.getComputedStyle(demoBanner).display : "missing",
      hasRecordSearchGlobal: Boolean(
        document.querySelector('nav [data-role-task-nav="D-FIND-RECORD"]'),
      ),
      hasCycleFixtures: Boolean(document.querySelector('[data-role-task-cycle-fixtures="true"]')),
      hasCycleSetControls: Boolean(document.querySelector("[data-role-task-cycle-set]")),
      nowVisible: Boolean(
        nowLabel && window.getComputedStyle(nowLabel).display !== "none" && nowLabel.offsetParent,
      ),
      findVisible: Boolean(
        findLabel &&
          window.getComputedStyle(findLabel).display !== "none" &&
          findLabel.offsetParent,
      ),
      primaryActionDisabled: primaryAction ? primaryAction.disabled : true,
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
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

async function openPage(query = "", viewport = { width: 1280, height: 900 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const url = query ? `${baseUrl}?${query}` : baseUrl;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector('[data-role-task-ia="FIELD_STAFF"]');
  return { page, pageErrors };
}

{
  const { page, pageErrors } = await openPage();
  const first = await inspect(page);
  const firstPass =
    first.taskRole === "FIELD_STAFF" &&
    first.chromeRole === "FIELD_STAFF" &&
    first.taskDestination === "D-TODAY" &&
    first.roleEntryDisplay !== "none" &&
    first.roleEntryDisplay !== "missing" &&
    first.roleEntryEnabled &&
    first.primaryNavDisplay === "none" &&
    pageErrors.length === 0;
  await selectDemoRole(page, "PLANNER");
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-presentation-role") === "PLANNER" &&
      Boolean(document.querySelector('[data-role-task-ia="PLANNER"]')),
  );
  const planner = await inspect(page);
  const plannerPass =
    planner.chromeRole === "PLANNER" &&
    planner.taskRole === "PLANNER" &&
    planner.taskDestination === "D-HOME" &&
    planner.labels.join("|") === "今の工程|探す" &&
    !planner.hasRecordSearchGlobal &&
    !planner.fieldPresent &&
    planner.primaryNavDisplay === "none" &&
    planner.siteSelectorDisplay === "none" &&
    planner.demoBannerDisplay === "none" &&
    !planner.hasCycleFixtures &&
    !planner.hasCycleSetControls;
  await page.click('[data-role-task-global="GLOBAL-FIND-PERSON"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-FIND-PERSON",
  );
  const findPerson = await inspect(page);
  const findPass =
    findPerson.taskDestination === "D-FIND-PERSON" && !findPerson.hasRecordSearchGlobal;
  await selectDemoRole(page, "FIELD_STAFF");
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-presentation-role") === "FIELD_STAFF" &&
      Boolean(document.querySelector('[data-role-task-ia="FIELD_STAFF"]')) &&
      !document.querySelector('[data-role-task-ia="PLANNER"]'),
  );
  const restored = await inspect(page);
  const restorePass =
    restored.chromeRole === "FIELD_STAFF" &&
    restored.taskRole === "FIELD_STAFF" &&
    restored.taskDestination === "D-TODAY" &&
    !restored.plannerPresent;
  const pass = firstPass && plannerPass && findPass && restorePass && pageErrors.length === 0;
  results.push({
    name: "demo-role-field-staff-planner-field-staff",
    pass,
    state: { first, planner, findPerson, restored, firstPass, plannerPass, findPass, restorePass },
    pageErrors,
  });
  await page.screenshot({
    path: path.join(artifactsDir, "demo-role-bind-desktop.png"),
    fullPage: true,
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage(`cycle=${encodeURIComponent("③")}`);
  await selectDemoRole(page, "PLANNER");
  await page.waitForFunction(
    () =>
      document.querySelector('[data-role-task-ia="PLANNER"]')?.getAttribute("data-role-task-cycle") ===
      "③",
  );
  await page.click('[data-role-task-primary-action="true"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-FIND-RECORD",
  );
  await page.click('[data-role-task-select-record="synthetic-record-1"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-RECORD-READ",
  );
  const state = await inspect(page);
  const pass =
    state.chromeRole === "PLANNER" &&
    state.taskDestination === "D-RECORD-READ" &&
    !state.hasRecordSearchGlobal &&
    !state.hasCycleFixtures &&
    !state.hasCycleSetControls &&
    pageErrors.length === 0;
  results.push({ name: "demo-planner-cycle-3-record-read", pass, state, pageErrors });
  await page.screenshot({
    path: path.join(artifactsDir, "demo-planner-cycle-3-record-read.png"),
    fullPage: true,
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage(`cycle=${encodeURIComponent("③")}`, {
    width: 390,
    height: 844,
  });
  await selectDemoRole(page, "PLANNER");
  await page.waitForFunction(() => Boolean(document.querySelector('[data-role-task-ia="PLANNER"]')));
  const state = await inspect(page);
  const primary = await page.$('[data-role-task-primary-action="true"]');
  const primaryBox = primary ? await primary.boundingBox() : null;
  const pass =
    state.chromeRole === "PLANNER" &&
    state.taskRole === "PLANNER" &&
    state.nowVisible &&
    state.findVisible &&
    state.roleEntryDisplay !== "none" &&
    state.roleEntryEnabled &&
    !state.primaryActionDisabled &&
    primaryBox !== null &&
    primaryBox.height >= 40 &&
    state.overflow <= 8 &&
    !state.hasCycleSetControls &&
    pageErrors.length === 0;
  results.push({
    name: "demo-planner-mobile-390x844",
    pass,
    state: { ...state, primaryBox },
    pageErrors,
  });
  await page.screenshot({
    path: path.join(artifactsDir, "demo-planner-mobile-390x844.png"),
    fullPage: true,
  });
  await page.close();
}

await browser.close();
server.close();

const allPass = results.every((entry) => entry.pass);
const summary = {
  implementationHead: process.env.SBS_PLANNER_ROLE_BINDING_IMPLEMENTATION_HEAD ?? "local",
  allPass,
  results,
};
fs.writeFileSync(path.join(artifactsDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (!allPass) {
  process.exit(1);
}
