#!/usr/bin/env node
/**
 * SBS-PLANNER-TOP-LEVEL-IA-V1 rendered browser smoke.
 * Synthetic role/cycle fixtures only. No live I/O, auth mutation, SharePoint write, or deploy.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.PLANNER_TL_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/sbs-planner-top-level-ia-v1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.PLANNER_TL_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.PLANNER_TL_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(
  process.env.PLANNER_TL_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs"
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ?? sassModule.default?.compile ?? (await import("sass")).compile;

const scssPaths = [
  "src/shell/ux/ShellUx.module.scss",
  "src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss",
];

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

function normalizeCssModulesGlobal(css) {
  return css.replace(/:global\(([^)]+)\)/g, "$1");
}

function compileProductionCss() {
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  const compiled = scssPaths
    .map((rel) => {
      const css = compileScss(path.join(repoRoot, rel), { style: "expanded" }).css;
      return normalizeCssModulesGlobal(normalizeSpfxThemeCss(css));
    })
    .join("\n");
  return `${resetCss}\n${compiled}`;
}

fs.writeFileSync(path.join(outDir, "smoke-production.css"), compileProductionCss());

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

fs.writeFileSync(
  path.join(outDir, "index.html"),
  `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="stylesheet" href="./smoke-production.css" />
  <title>SBS PLANNER Top-Level Smoke</title>
</head>
<body>
  <div id="root"></div>
  <script src="./smoke-bundle.js"></script>
</body>
</html>`,
);

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
  executablePath: process.env.PLANNER_TL_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];
let allPass = true;

async function openCase(name, query, evaluateCase, interact) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  const url = `${base}/index.html?${query}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.waitForFunction(() =>
    Boolean(document.querySelector('[data-shell-ux="app-shell-chrome"]')),
  );
  if (interact) {
    await interact(page);
  }
  const found = await page.evaluate(evaluateCase);
  const pass = Boolean(found.pass) && errors.length === 0;
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name, url, found: { ...found, pageErrors: errors }, shot, pass });
  allPass = allPass && pass;
  await page.close();
}

await openCase(
  "planner-first-paint-unknown",
  "sbsPresentationRole=PLANNER",
  () => {
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const planner = document.querySelector('[data-role-task-ia="PLANNER"]');
    const field = document.querySelector('[data-role-task-ia="FIELD_STAFF"]');
    const globals = [...(planner?.querySelectorAll("[data-planner-global]") ?? [])];
    const labels = globals.map((el) => (el.textContent ?? "").trim());
    const targets = globals.map((el) => el.getAttribute("data-role-task-nav"));
    const primary = planner?.querySelector("[data-planner-primary-action]");
    const legacy = document.querySelector('[data-shell-ux="primary-navigation"]');
    return {
      pass:
        shell?.getAttribute("data-shell-ux-presentation-role") === "PLANNER" &&
        planner?.getAttribute("data-role-task-destination") === "D-HOME" &&
        planner?.getAttribute("data-planner-current-cycle") === "unknown" &&
        labels.join("|") === "今の工程|探す" &&
        targets.join("|") === "D-HOME|D-FIND-PERSON" &&
        primary?.getAttribute("data-planner-primary-action") === "D-HOME" &&
        primary?.hasAttribute("disabled") === true &&
        getComputedStyle(planner).display !== "none" &&
        Boolean(field) &&
        getComputedStyle(field).display === "none" &&
        Boolean(legacy) &&
        getComputedStyle(legacy).display === "none" &&
        (planner?.textContent ?? "").indexOf("D-RECORD-WRITE") < 0,
      role: shell?.getAttribute("data-shell-ux-presentation-role") ?? "",
      destination: planner?.getAttribute("data-role-task-destination") ?? "",
      labels,
      targets,
      primaryTarget: primary?.getAttribute("data-planner-primary-action") ?? "",
      legacyDisplay: legacy ? getComputedStyle(legacy).display : "missing",
      fieldDisplay: field ? getComputedStyle(field).display : "missing",
      plannerDisplay: planner ? getComputedStyle(planner).display : "missing",
    };
  },
);

await openCase(
  "planner-cycle-3-record-read",
  `sbsPresentationRole=PLANNER&sbsPlannerCycle=${encodeURIComponent("③")}`,
  () => {
    const planner = document.querySelector('[data-role-task-ia="PLANNER"]');
    const read = planner?.querySelector('[data-planner-record-read="true"]');
    const buttons = [...(planner?.querySelectorAll("button") ?? [])].map(
      (el) => (el.textContent ?? "").trim(),
    );
    return {
      pass:
        planner?.getAttribute("data-role-task-destination") === "D-RECORD-READ" &&
        planner?.getAttribute("data-planner-current-cycle") === "③" &&
        Boolean(read) &&
        read?.getAttribute("data-planner-read-only") === "true" &&
        (planner?.textContent ?? "").includes("記録を見る") &&
        buttons.every((label) => !label.includes("作成") && label !== "記録する") &&
        (planner?.textContent ?? "").indexOf("D-RECORD-WRITE") < 0,
      destination: planner?.getAttribute("data-role-task-destination") ?? "",
      cycle: planner?.getAttribute("data-planner-current-cycle") ?? "",
      readOnly: read?.getAttribute("data-planner-read-only") ?? "",
      buttons,
    };
  },
  async (page) => {
    await page.waitForFunction(() => {
      const button = document.querySelector('[data-planner-primary-action="D-FIND-RECORD"]');
      return Boolean(button) && !button.disabled;
    });
    await page.click('[data-planner-primary-action="D-FIND-RECORD"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-role-task-ia="PLANNER"]')
          ?.getAttribute("data-role-task-destination") === "D-FIND-RECORD",
    );
    await page.click('[data-planner-synthetic-record="synthetic-planner-record-1"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-role-task-ia="PLANNER"]')
          ?.getAttribute("data-role-task-destination") === "D-RECORD-READ",
    );
  },
);

await openCase(
  "planner-global-find-person",
  "sbsPresentationRole=PLANNER",
  () => {
    const planner = document.querySelector('[data-role-task-ia="PLANNER"]');
    const globalFind = planner?.querySelector('[data-planner-global="GLOBAL-FIND-PERSON"]');
    return {
      pass:
        planner?.getAttribute("data-role-task-destination") === "D-FIND-PERSON" &&
        globalFind?.getAttribute("data-role-task-nav") === "D-FIND-PERSON" &&
        (planner?.textContent ?? "").includes("利用者を探す") &&
        planner?.getAttribute("data-role-task-destination") !== "D-FIND-RECORD",
      destination: planner?.getAttribute("data-role-task-destination") ?? "",
      globalFindTarget: globalFind?.getAttribute("data-role-task-nav") ?? "",
    };
  },
  async (page) => {
    await page.click('[data-planner-global="GLOBAL-FIND-PERSON"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-role-task-ia="PLANNER"]')
          ?.getAttribute("data-role-task-destination") === "D-FIND-PERSON",
    );
  },
);

await openCase(
  "planner-cycle-4-monitor",
  `sbsPresentationRole=PLANNER&sbsPlannerCycle=${encodeURIComponent("④")}`,
  () => {
    const planner = document.querySelector('[data-role-task-ia="PLANNER"]');
    return {
      pass:
        planner?.getAttribute("data-role-task-destination") === "D-MONITOR" &&
        (planner?.textContent ?? "").includes("モニタリング"),
      destination: planner?.getAttribute("data-role-task-destination") ?? "",
    };
  },
  async (page) => {
    await page.click('[data-planner-primary-action="D-MONITOR"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-role-task-ia="PLANNER"]')
          ?.getAttribute("data-role-task-destination") === "D-MONITOR",
    );
  },
);

await openCase(
  "field-staff-regression",
  "",
  () => {
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const field = document.querySelector('[data-role-task-ia="FIELD_STAFF"]');
    const planner = document.querySelector('[data-role-task-ia="PLANNER"]');
    const labels = [...(field?.querySelectorAll("[data-role-task-global]") ?? [])].map(
      (el) => (el.textContent ?? "").trim(),
    );
    return {
      pass:
        shell?.getAttribute("data-shell-ux-presentation-role") === "FIELD_STAFF" &&
        field?.getAttribute("data-role-task-destination") === "D-TODAY" &&
        labels.join("|") === "今日|手順|記録する|未記録|探す" &&
        getComputedStyle(field).display !== "none" &&
        Boolean(planner) &&
        getComputedStyle(planner).display === "none",
      role: shell?.getAttribute("data-shell-ux-presentation-role") ?? "",
      destination: field?.getAttribute("data-role-task-destination") ?? "",
      labels,
      fieldDisplay: field ? getComputedStyle(field).display : "missing",
      plannerDisplay: planner ? getComputedStyle(planner).display : "missing",
    };
  },
);

const report = {
  unit: "SBS-PLANNER-TOP-LEVEL-IA-V1",
  kind: "rendered browser smoke / PLANNER Top-Level Task-First",
  date: new Date().toISOString(),
  writeCount: 0,
  mutationCount: 0,
  liveWriteCount: 0,
  sharePointWriteCount: 0,
  liveWriteAuthorized: false,
  deployAuthorized: false,
  humanTaskPassClaimed: false,
  allPass,
  checks,
};

fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

console.log(JSON.stringify({ allPass, artifactsDir, cases: checks.length }, null, 2));
process.exit(allPass ? 0 : 1);
