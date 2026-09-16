#!/usr/bin/env node
/**
 * SBS-ROLE-TASK-FIRST-IA-IMPL-SLICE-1 browser smoke.
 * Synthetic FIELD_STAFF presentation only. No LIVE WRITE / auth / schema mutation.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.SBS_ROLE_TASK_IA_ARTIFACTS_DIR ?? "/tmp/sbs-role-task-first-ia-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SBS_ROLE_TASK_IA_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.SBS_ROLE_TASK_IA_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.SBS_ROLE_TASK_IA_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.js"
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
  nodePaths: [process.env.SBS_ROLE_TASK_IA_NODE_PATH ?? "/tmp/node_modules"],
});

fs.writeFileSync(
  path.join(__dirname, "index.html"),
  '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="smoke-production.css"></head><body><div id="root"></div><script src="smoke-bundle.js"></script></body></html>',
);

const server = http.createServer((request, response) => {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const relativePath = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(
    __dirname,
    path.normalize(relativePath).replace(/^(\.\.[/\\])+/, ""),
  );
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
await new Promise((resolve) => server.listen(4197, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_ROLE_TASK_IA_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const baseUrl = "http://127.0.0.1:4197/index.html";
const results = [];

async function inspectProductState(page) {
  return page.evaluate(() => {
    const taskRoot = document.querySelector('[data-role-task-ia="FIELD_STAFF"]');
    const selected = document.querySelector('[data-role-task-selected="true"]');
    const labels = [...document.querySelectorAll("[data-role-task-nav]")].map(
      (element) => element.textContent?.trim() ?? "",
    );
    const legacyNav = document.querySelector('[data-shell-ux="primary-navigation"]');
    const demoBanner = document.querySelector('[data-shell-ux="demo-banner"]');
    const demoRole = document.querySelector('[data-shell-ux="demo-presentation-role-entry"]');
    const siteSelector = document.querySelector('[data-shell-ux="site-selector"]');
    const roleHint = document.querySelector('[data-shell-ux="presentation-role-hint"]');
    const overviewHeading = document.querySelector('[data-dashboard-ux="overview-heading"]');
    const taskHeading = document.querySelector('[data-role-task-ia="FIELD_STAFF"] [role="heading"]');
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const text = document.body.textContent ?? "";
    return {
      taskDestination: taskRoot?.getAttribute("data-role-task-destination") ?? "",
      selectedDestination: selected?.getAttribute("data-role-task-nav") ?? "",
      labels,
      shellDestination: shell?.getAttribute("data-shell-ux-destination") ?? "",
      selectedUser: shell?.getAttribute("data-shell-ux-user-detail") ?? "",
      taskHeading: taskHeading?.textContent?.trim() ?? "",
      legacyNavDisplay: legacyNav ? window.getComputedStyle(legacyNav).display : "missing",
      demoBannerDisplay: demoBanner ? window.getComputedStyle(demoBanner).display : "missing",
      demoRoleDisplay: demoRole ? window.getComputedStyle(demoRole).display : "missing",
      siteSelectorDisplay: siteSelector ? window.getComputedStyle(siteSelector).display : "missing",
      roleHintDisplay: roleHint ? window.getComputedStyle(roleHint).display : "missing",
      overviewHeadingDisplay: overviewHeading
        ? window.getComputedStyle(overviewHeading).display
        : "missing",
      hasRecordSearchGlobal: Boolean(document.querySelector('[data-role-task-nav="D-FIND-RECORD"]')),
      hasHostStatusCopy: text.includes("シェル表示の準備ができました"),
      noHorizontalOverflow:
        document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    };
  });
}

async function openPage(name, viewport) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await page.waitForSelector('[data-role-task-destination="D-TODAY"]');
  return { name, page, pageErrors };
}

async function capture(name, page) {
  const file = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

{
  const { page, pageErrors } = await openPage("first-paint-desktop", {
    width: 1280,
    height: 900,
  });
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-TODAY" &&
    state.selectedDestination === "D-TODAY" &&
    state.labels.join("|") === "今日|手順|記録する|未記録|探す" &&
    state.taskHeading === "今日の支援" &&
    state.shellDestination === "overview" &&
    state.legacyNavDisplay === "none" &&
    state.demoBannerDisplay === "none" &&
    state.demoRoleDisplay === "none" &&
    state.siteSelectorDisplay === "none" &&
    state.roleHintDisplay === "none" &&
    state.overviewHeadingDisplay === "none" &&
    !state.hasRecordSearchGlobal &&
    !state.hasHostStatusCopy &&
    state.noHorizontalOverflow &&
    pageErrors.length === 0;
  results.push({ name: "first-paint-desktop", pass, state, pageErrors, shot: await capture("first-paint-desktop", page) });
  await page.close();
}

for (const [destination, expectedShell] of [
  ["D-PROCEDURE", "users"],
  ["D-RECORD-WRITE", "users"],
  ["D-FIND-PERSON", "users"],
]) {
  const { page, pageErrors } = await openPage(destination, { width: 1280, height: 900 });
  await page.click(`[data-role-task-nav="${destination}"]`);
  await page.waitForFunction(
    (expected) =>
      document
        .querySelector('[data-role-task-ia="FIELD_STAFF"]')
        ?.getAttribute("data-role-task-destination") === expected,
    {},
    destination,
  );
  await page.waitForSelector('[data-demo-ux="users-list"]');
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === destination &&
    state.selectedDestination === destination &&
    state.shellDestination === expectedShell &&
    state.selectedUser === "none" &&
    pageErrors.length === 0;
  results.push({ name: destination, pass, state, pageErrors, shot: await capture(destination, page) });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("D-UNRECORDED", { width: 1280, height: 900 });
  await page.click('[data-role-task-nav="D-UNRECORDED"]');
  await page.waitForSelector('[data-demo-ux="users-list"]');
  await page.waitForFunction(() => {
    const chip = document.querySelector(
      '[data-demo-ux="users-filter-chip"][data-demo-ux-filter="未記録"]',
    );
    return chip?.getAttribute("data-demo-ux-filter-selected") === "true";
  });
  const state = await inspectProductState(page);
  const filter = await page.evaluate(() => ({
    chip: document
      .querySelector('[data-demo-ux="users-list"]')
      ?.getAttribute("data-demo-ux-filter-chip"),
    count: document
      .querySelector('[data-demo-ux="users-list"]')
      ?.getAttribute("data-demo-ux-filter-count"),
  }));
  const pass =
    state.taskDestination === "D-UNRECORDED" &&
    state.selectedDestination === "D-UNRECORDED" &&
    state.shellDestination === "users" &&
    filter.chip === "未記録" &&
    pageErrors.length === 0;
  results.push({
    name: "D-UNRECORDED",
    pass,
    state,
    filter,
    pageErrors,
    shot: await capture("D-UNRECORDED", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("first-paint-mobile", { width: 390, height: 844 });
  const state = await inspectProductState(page);
  const pass =
    state.taskDestination === "D-TODAY" && state.noHorizontalOverflow && pageErrors.length === 0;
  results.push({
    name: "first-paint-mobile",
    pass,
    state,
    pageErrors,
    shot: await capture("first-paint-mobile", page),
  });
  await page.close();
}

await browser.close();
server.close();

const evidence = {
  slice: "SBS-ROLE-TASK-FIRST-IA-IMPL-SLICE-1",
  browserSmoke: "synthetic",
  results,
  pass: results.every((result) => result.pass),
};
fs.writeFileSync(path.join(artifactsDir, "evidence.json"), JSON.stringify(evidence, null, 2));

console.log(JSON.stringify(evidence, null, 2));
if (!evidence.pass) {
  process.exitCode = 1;
}
