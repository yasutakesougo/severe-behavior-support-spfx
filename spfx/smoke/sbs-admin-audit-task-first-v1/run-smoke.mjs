#!/usr/bin/env node
/**
 * ADMIN-AUDIT-TASK-FIRST-V1 browser smoke.
 * Synthetic ADMIN_AUDIT presentation only. No LIVE WRITE / auth / schema mutation.
 * Smoke PASS != AA-HTA PASS. This harness does not consume AA-HTA.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spfxRoot = path.join(__dirname, "../..");
const artifactsDir =
  process.env.SBS_ADMIN_AUDIT_TF_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/sbs-admin-audit-task-first-v1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.SBS_ADMIN_AUDIT_TF_ESBUILD_PATH ??
    process.env.SBS_PLANNER_TL_IA_ESBUILD_PATH ??
    process.env.SBS_ROLE_TASK_IA_ESBUILD_PATH ??
    path.join(spfxRoot, "node_modules/esbuild/lib/main.js")
);
const puppeteerModule = await import(
  process.env.SBS_ADMIN_AUDIT_TF_PUPPETEER_PATH ??
    process.env.SBS_PLANNER_TL_IA_PUPPETEER_PATH ??
    process.env.SBS_ROLE_TASK_IA_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.SBS_ADMIN_AUDIT_TF_SASS_PATH ??
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
    process.env.SBS_ADMIN_AUDIT_TF_NODE_PATH ??
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
await new Promise((resolve) => server.listen(4202, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_ADMIN_AUDIT_TF_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const baseUrl = "http://127.0.0.1:4202/index.html";
const results = [];

async function inspect(page) {
  return page.evaluate(() => {
    const taskRoot = document.querySelector("[data-role-task-ia]");
    const adminRoot = document.querySelector('[data-role-task-ia="ADMIN_AUDIT"]');
    const fieldRoot = document.querySelector('[data-role-task-ia="FIELD_STAFF"]');
    const plannerRoot = document.querySelector('[data-role-task-ia="PLANNER"]');
    const labels = [...document.querySelectorAll("nav [data-role-task-global]")].map(
      (element) => element.textContent?.trim() ?? "",
    );
    const taskNavs = document.querySelectorAll("[data-role-task-ia] nav");
    const legacyNav = document.querySelector('[data-shell-ux="primary-navigation"]');
    const readyRegion = document.querySelector('[data-shell-ux="ready-region-content"]');
    const taskTop = taskRoot?.getBoundingClientRect().top ?? Number.NaN;
    const productBody = readyRegion
      ? [...readyRegion.children].find((element) => element !== taskRoot)
      : undefined;
    const productBodyTop = productBody?.getBoundingClientRect().top ?? Number.NaN;
    const heading =
      document.querySelector("[data-role-task-ia] [role='heading']")?.textContent?.trim() ?? "";
    return {
      taskRole: taskRoot?.getAttribute("data-role-task-ia") ?? "",
      taskDestination: taskRoot?.getAttribute("data-role-task-destination") ?? "",
      activeGlobal: taskRoot?.getAttribute("data-role-task-active-global") ?? "",
      restoreStatus: taskRoot?.getAttribute("data-role-task-restore-status") ?? "",
      restoreRequested: taskRoot?.getAttribute("data-role-task-restore-requested") ?? "",
      homeIdentity: taskRoot?.getAttribute("data-role-task-home-identity") ?? "",
      approval: adminRoot?.getAttribute("data-role-task-approval") ?? "",
      evidenceAcceptance: adminRoot?.getAttribute("data-role-task-evidence-acceptance") ?? "",
      publish: adminRoot?.getAttribute("data-role-task-publish") ?? "",
      deploy: adminRoot?.getAttribute("data-role-task-deploy") ?? "",
      deleteAuth: adminRoot?.getAttribute("data-role-task-delete") ?? "",
      liveWrite: adminRoot?.getAttribute("data-role-task-live-write") ?? "",
      labels,
      heading,
      taskNavCount: taskNavs.length,
      legacyNavPresent: Boolean(legacyNav),
      taskTop,
      productBodyTop,
      taskBeforeProduct:
        Number.isFinite(taskTop) && Number.isFinite(productBodyTop) && taskTop < productBodyTop,
      shellDestination:
        document
          .querySelector('[data-shell-ux="app-shell-chrome"]')
          ?.getAttribute("data-shell-ux-destination") ?? "",
      adminAuditAdapter:
        document
          .querySelector('[data-shell-ux="app-shell-chrome"]')
          ?.getAttribute("data-admin-audit-adapter") ?? "",
      adminPresent: Boolean(adminRoot),
      fieldPresent: Boolean(fieldRoot),
      plannerPresent: Boolean(plannerRoot),
      hasRecordSearchGlobal: Boolean(
        document.querySelector('nav [data-role-task-nav="D-FIND-RECORD"]'),
      ),
      failClosedCopy:
        document.querySelector('[data-role-task-fail-closed="true"]')?.textContent?.trim() ?? "",
      orientationCopy:
        document.querySelector('[data-role-task-orientation="今どこ"]')?.textContent ?? "",
      noHorizontalOverflow:
        document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1,
    };
  });
}

async function openPage(query = "", viewport = { width: 1280, height: 900 }) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  const url = query ? `${baseUrl}?${query}` : baseUrl;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForSelector("[data-role-task-ia]");
  return { page, pageErrors };
}

async function capture(name, page) {
  const file = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

async function selectDemoRole(page, role) {
  const selector = `[data-shell-ux-demo-role="${role}"]`;
  await page.waitForSelector(selector);
  await page.$eval(selector, (el) => {
    el.scrollIntoView({ block: "center" });
  });
  await page.click(selector);
}

{
  const { page, pageErrors } = await openPage("", { width: 1280, height: 900 });
  const state = await inspect(page);
  const pass =
    state.taskRole === "ADMIN_AUDIT" &&
    state.taskDestination === "D-OPS" &&
    state.activeGlobal === "GLOBAL-OPS" &&
    state.labels.join("|") === "運用確認|証跡|探す" &&
    state.heading === "運用確認" &&
    state.legacyNavPresent === false &&
    state.taskNavCount === 1 &&
    !state.hasRecordSearchGlobal &&
    !state.fieldPresent &&
    !state.plannerPresent &&
    state.approval === "false" &&
    state.evidenceAcceptance === "false" &&
    state.publish === "false" &&
    state.deploy === "false" &&
    state.deleteAuth === "false" &&
    state.liveWrite === "false" &&
    state.orientationCopy.includes("D-OPS") &&
    state.taskBeforeProduct &&
    state.noHorizontalOverflow &&
    pageErrors.length === 0;
  results.push({
    name: "first-paint-desktop",
    pass,
    state,
    pageErrors,
    shot: await capture("first-paint-desktop", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("", { width: 1280, height: 900 });
  const state = await inspect(page);
  const pass =
    state.taskRole === "ADMIN_AUDIT" && state.taskBeforeProduct && pageErrors.length === 0;
  results.push({
    name: "correction-visual-order",
    pass,
    state,
    pageErrors,
    shot: await capture("correction-visual-order", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("", { width: 390, height: 844 });
  const state = await inspect(page);
  const pass =
    state.taskRole === "ADMIN_AUDIT" &&
    state.taskDestination === "D-OPS" &&
    state.labels.join("|") === "運用確認|証跡|探す" &&
    state.legacyNavPresent === false &&
    state.taskNavCount === 1 &&
    state.noHorizontalOverflow &&
    pageErrors.length === 0;
  results.push({
    name: "first-paint-mobile",
    pass,
    state,
    pageErrors,
    shot: await capture("first-paint-mobile", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage();
  await page.click('[data-role-task-global="GLOBAL-EVIDENCE"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="ADMIN_AUDIT"]')
        ?.getAttribute("data-role-task-destination") === "D-EVIDENCE",
  );
  const evidence = await inspect(page);
  await page.click('[data-role-task-global="GLOBAL-FIND-PERSON"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="ADMIN_AUDIT"]')
        ?.getAttribute("data-role-task-destination") === "D-FIND-PERSON",
  );
  const find = await inspect(page);
  await page.click('[data-role-task-global="GLOBAL-OPS"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="ADMIN_AUDIT"]')
        ?.getAttribute("data-role-task-destination") === "D-OPS",
  );
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-shell-ux="app-shell-chrome"]')
        ?.getAttribute("data-shell-ux-destination") === "overview",
  );
  const back = await inspect(page);
  const pass =
    evidence.taskDestination === "D-EVIDENCE" &&
    evidence.heading === "証跡" &&
    evidence.legacyNavPresent === false &&
    find.taskDestination === "D-FIND-PERSON" &&
    find.heading === "利用者を探す" &&
    !find.hasRecordSearchGlobal &&
    back.taskDestination === "D-OPS" &&
    back.heading === "運用確認" &&
    pageErrors.length === 0;
  results.push({
    name: "global-navigation",
    pass,
    state: { evidence, find, back },
    pageErrors,
    shot: await capture("global-navigation", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage();
  await page.click('[data-role-task-global="GLOBAL-EVIDENCE"]');
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-role-task-ia="ADMIN_AUDIT"]');
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    return (
      root?.getAttribute("data-role-task-destination") === "D-EVIDENCE" &&
      root?.getAttribute("data-role-task-active-global") === "GLOBAL-EVIDENCE" &&
      shell?.getAttribute("data-shell-ux-destination") === "records" &&
      shell?.getAttribute("data-admin-audit-task-destination") === "D-EVIDENCE"
    );
  });
  const evidence = await inspect(page);
  await page.click('[data-role-task-global="GLOBAL-FIND-PERSON"]');
  await page.waitForFunction(() => {
    const root = document.querySelector('[data-role-task-ia="ADMIN_AUDIT"]');
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    return (
      root?.getAttribute("data-role-task-destination") === "D-FIND-PERSON" &&
      root?.getAttribute("data-role-task-active-global") === "GLOBAL-FIND-PERSON" &&
      shell?.getAttribute("data-shell-ux-destination") === "users" &&
      shell?.getAttribute("data-admin-audit-task-destination") === "D-FIND-PERSON"
    );
  });
  const find = await inspect(page);
  const pass =
    evidence.taskDestination === "D-EVIDENCE" &&
    evidence.activeGlobal === "GLOBAL-EVIDENCE" &&
    evidence.shellDestination === "records" &&
    evidence.homeIdentity === "D-OPS" &&
    find.taskDestination === "D-FIND-PERSON" &&
    find.activeGlobal === "GLOBAL-FIND-PERSON" &&
    find.shellDestination === "users" &&
    find.homeIdentity === "D-OPS" &&
    pageErrors.length === 0;
  results.push({
    name: "correction-adapter-destination-sync",
    pass,
    state: { evidence, find },
    pageErrors,
    shot: await capture("correction-adapter-destination-sync", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage();
  await page.click('[data-role-task-global="GLOBAL-EVIDENCE"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="ADMIN_AUDIT"]')
        ?.getAttribute("data-role-task-destination") === "D-EVIDENCE",
  );
  const evidence = await inspect(page);
  await page.click('[data-role-task-global="GLOBAL-FIND-PERSON"]');
  await page.waitForFunction(
    () =>
      document
        .querySelector('[data-role-task-ia="ADMIN_AUDIT"]')
        ?.getAttribute("data-role-task-destination") === "D-FIND-PERSON",
  );
  const find = await inspect(page);
  const pass =
    evidence.taskDestination === "D-EVIDENCE" &&
    evidence.homeIdentity === "D-OPS" &&
    find.taskDestination === "D-FIND-PERSON" &&
    find.homeIdentity === "D-OPS" &&
    pageErrors.length === 0;
  results.push({
    name: "correction-home-identity-invariant",
    pass,
    state: { evidence, find },
    pageErrors,
    shot: await capture("correction-home-identity-invariant", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("destination=D-HOME");
  const state = await inspect(page);
  const pass =
    state.taskDestination === "D-OPS" &&
    state.heading === "運用確認" &&
    state.homeIdentity === "D-OPS" &&
    state.restoreStatus === "restored" &&
    state.restoreRequested === "D-HOME" &&
    state.legacyNavPresent === false &&
    pageErrors.length === 0;
  results.push({
    name: "d-home-identity-restore",
    pass,
    state,
    pageErrors,
    shot: await capture("d-home-identity-restore", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("destination=D-AUDIT");
  const state = await inspect(page);
  const pass =
    state.restoreStatus === "fail-closed" &&
    state.restoreRequested === "D-AUDIT" &&
    state.restoreStatus !== "restored" &&
    state.failClosedCopy.includes("推測して運用確認へ進めていません") &&
    pageErrors.length === 0;
  results.push({
    name: "invalid-restore-fail-closed",
    pass,
    state,
    pageErrors,
    shot: await capture("invalid-restore-fail-closed", page),
  });
  await page.close();
}

{
  const { page, pageErrors } = await openPage("role=FIELD_STAFF");
  const first = await inspect(page);
  await selectDemoRole(page, "ADMIN_AUDIT");
  await page.waitForFunction(
    () =>
      document.querySelector("[data-role-task-ia]")?.getAttribute("data-role-task-ia") ===
        "ADMIN_AUDIT" &&
      document
        .querySelector('[data-role-task-ia="ADMIN_AUDIT"]')
        ?.getAttribute("data-role-task-destination") === "D-OPS",
  );
  const intoAdmin = await inspect(page);
  await selectDemoRole(page, "FIELD_STAFF");
  await page.waitForFunction(
    () =>
      document.querySelector("[data-role-task-ia]")?.getAttribute("data-role-task-ia") ===
      "FIELD_STAFF",
  );
  const awayField = await inspect(page);
  await selectDemoRole(page, "ADMIN_AUDIT");
  await page.waitForFunction(
    () =>
      document.querySelector("[data-role-task-ia]")?.getAttribute("data-role-task-ia") ===
      "ADMIN_AUDIT",
  );
  await selectDemoRole(page, "PLANNER");
  await page.waitForFunction(
    () =>
      document.querySelector("[data-role-task-ia]")?.getAttribute("data-role-task-ia") ===
      "PLANNER",
  );
  const awayPlanner = await inspect(page);
  const pass =
    first.taskRole === "FIELD_STAFF" &&
    first.taskDestination === "D-TODAY" &&
    intoAdmin.taskRole === "ADMIN_AUDIT" &&
    intoAdmin.taskDestination === "D-OPS" &&
    intoAdmin.labels.join("|") === "運用確認|証跡|探す" &&
    intoAdmin.legacyNavPresent === false &&
    !intoAdmin.fieldPresent &&
    awayField.taskRole === "FIELD_STAFF" &&
    awayField.taskDestination === "D-TODAY" &&
    !awayField.adminPresent &&
    awayPlanner.taskRole === "PLANNER" &&
    awayPlanner.taskDestination === "D-HOME" &&
    awayPlanner.labels.join("|") === "今の工程|探す" &&
    !awayPlanner.adminPresent &&
    pageErrors.length === 0;
  results.push({
    name: "role-switch-into-and-away",
    pass,
    state: { first, intoAdmin, awayField, awayPlanner },
    pageErrors,
    shot: await capture("role-switch-into-and-away", page),
  });
  await page.close();
}

await browser.close();
server.close();

const evidence = {
  slice: "ADMIN-AUDIT-TASK-FIRST-V1",
  browserSmoke: "synthetic",
  aaHta: "NOT CONSUMED",
  smokePassIsNotAaHtaPass: true,
  implementationHead: process.env.SBS_ADMIN_AUDIT_TF_IMPLEMENTATION_HEAD ?? "local",
  results,
  pass: results.every((result) => result.pass),
};

if (JSON.stringify(evidence).includes("AA-HTA PASS")) {
  throw new Error("Smoke output must not claim AA-HTA PASS");
}

fs.writeFileSync(path.join(artifactsDir, "evidence.json"), JSON.stringify(evidence, null, 2));

console.log(JSON.stringify(evidence, null, 2));
if (!evidence.pass) {
  process.exitCode = 1;
}
