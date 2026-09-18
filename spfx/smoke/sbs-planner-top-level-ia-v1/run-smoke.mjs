#!/usr/bin/env node
/**
 * SBS-PLANNER-TOP-LEVEL-IA-V1 browser smoke.
 * Synthetic PLANNER presentation only. No LIVE WRITE / auth / schema mutation.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.SBS_PLANNER_TL_IA_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/sbs-planner-top-level-ia-v1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SBS_PLANNER_TL_IA_ESBUILD_PATH ??
    process.env.SBS_ROLE_TASK_IA_ESBUILD_PATH ??
    path.join(spfxRoot, "node_modules/esbuild/lib/main.js")
);
const puppeteerModule = await import(
  process.env.SBS_PLANNER_TL_IA_PUPPETEER_PATH ??
    process.env.SBS_ROLE_TASK_IA_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
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
    process.env.SBS_PLANNER_TL_IA_NODE_PATH ??
      process.env.SBS_ROLE_TASK_IA_NODE_PATH ??
      path.join(spfxRoot, "node_modules"),
  ],
});

fs.writeFileSync(
  path.join(__dirname, "index.html"),
  '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="smoke-production.css"></head><body><div id="root"></div><script src="smoke-bundle.js"></script></body></html>',
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
await new Promise((resolve) => server.listen(4198, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_PLANNER_TL_IA_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const baseUrl = "http://127.0.0.1:4198/index.html";
const results = [];

async function inspect(page) {
  return page.evaluate(() => {
    const taskRoot = document.querySelector('[data-role-task-ia="PLANNER"]');
    const labels = [...document.querySelectorAll("nav [data-role-task-global]")].map(
      (element) => element.textContent?.trim() ?? "",
    );
    const legacyNav = document.querySelector('[data-shell-ux="primary-navigation"]');
    return {
      taskDestination: taskRoot?.getAttribute("data-role-task-destination") ?? "",
      activeGlobal: taskRoot?.getAttribute("data-role-task-active-global") ?? "",
      cycle: taskRoot?.getAttribute("data-role-task-cycle") ?? "",
      recordCreate: taskRoot?.getAttribute("data-role-task-record-create") ?? "",
      labels,
      taskHeading:
        document
          .querySelector('[data-role-task-ia="PLANNER"] [role="heading"]')
          ?.textContent?.trim() ?? "",
      legacyNavDisplay: legacyNav ? window.getComputedStyle(legacyNav).display : "missing",
      hasRecordSearchGlobal: Boolean(
        document.querySelector('nav [data-role-task-nav="D-FIND-RECORD"]'),
      ),
      hasCreateCta: Boolean(document.querySelector('[data-role-task-record-create-cta="true"]')),
      orientationCopy:
        document.querySelector('[data-role-task-orientation="今どこ"]')?.textContent ?? "",
    };
  });
}

async function openPage() {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await page.waitForSelector('[data-role-task-ia="PLANNER"]');
  return { page, pageErrors };
}

{
  const { page, pageErrors } = await openPage();
  const state = await inspect(page);
  const pass =
    state.taskDestination === "D-HOME" &&
    state.activeGlobal === "GLOBAL-CURRENT-CYCLE" &&
    state.cycle === "unknown" &&
    state.labels.join("|") === "今の工程|探す" &&
    state.taskHeading === "今の工程" &&
    state.legacyNavDisplay === "none" &&
    !state.hasRecordSearchGlobal &&
    state.recordCreate === "false" &&
    !state.hasCreateCta &&
    state.orientationCopy.includes("D-HOME") &&
    pageErrors.length === 0;
  results.push({ name: "first-paint-unknown", pass, state, pageErrors });
  await page.screenshot({
    path: path.join(artifactsDir, "first-paint-unknown.png"),
    fullPage: true,
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage();
  await page.click('[data-role-task-cycle-set="③"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-cycle") === "③",
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
    state.taskDestination === "D-RECORD-READ" &&
    state.taskHeading === "記録を見る" &&
    state.recordCreate === "false" &&
    !state.hasCreateCta &&
    pageErrors.length === 0;
  results.push({ name: "cycle-3-find-record-read", pass, state, pageErrors });
  await page.screenshot({
    path: path.join(artifactsDir, "cycle-3-find-record-read.png"),
    fullPage: true,
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage();
  await page.click('[data-role-task-global="GLOBAL-FIND-PERSON"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="PLANNER"]')
        ?.getAttribute("data-role-task-destination") === "D-FIND-PERSON",
  );
  const state = await inspect(page);
  const pass =
    state.taskDestination === "D-FIND-PERSON" &&
    state.taskHeading === "利用者を探す" &&
    !state.hasRecordSearchGlobal &&
    pageErrors.length === 0;
  results.push({ name: "global-find-person", pass, state, pageErrors });
  await page.screenshot({
    path: path.join(artifactsDir, "global-find-person.png"),
    fullPage: true,
  });
  await page.close();
}

await browser.close();
server.close();

const allPass = results.every((entry) => entry.pass);
const summary = {
  implementationHead: process.env.SBS_PLANNER_TL_IA_IMPLEMENTATION_HEAD ?? "local",
  allPass,
  results,
};
fs.writeFileSync(path.join(artifactsDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
if (!allPass) {
  process.exit(1);
}
