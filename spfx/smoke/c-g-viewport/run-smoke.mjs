#!/usr/bin/env node
/**
 * C-G browser smoke runner (Chrome via puppeteer-core).
 * Scope: PC/tablet horizontal-scroll and 200% equivalent viewport evidence.
 * No destination routing, auth judgment, REST, binder, or live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir =
  process.env.CG_ARTIFACTS_DIR ?? "/opt/cursor/artifacts/c-g-viewport-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.CG_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.CG_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;

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

const productionCss = await fs.promises.readFile(
  path.join(__dirname, "../../src/shell/ux/ShellUx.module.scss"),
  "utf8",
);

function cssRuleContains(selector, declarations) {
  const match = new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`, "s").exec(productionCss);
  return Boolean(match) && declarations.every((declaration) => match[1].includes(declaration));
}

const productionCssChecks = {
  appShellWidthSafety: cssRuleContains("appShell", ["min-width: 0;", "max-width: 100%;"]),
  shellMainWidthSafety: cssRuleContains("shellMain", ["min-width: 0;", "max-width: 100%;"]),
  readyRegionWrapSafety: cssRuleContains("readyRegion", ["overflow-wrap: anywhere;"]),
};

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
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

await new Promise((resolve) => server.listen(4181, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4181";
const browser = await puppeteer.launch({
  executablePath: process.env.CG_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900, deviceScaleFactor: 1 },
});

const checks = [];

async function inspectPage(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const shell = document.querySelector('[data-shell-ux="app-shell-chrome"]');
    const navButtons = [...document.querySelectorAll("[data-shell-ux-nav]")];
    const wideContent = document.querySelector('[data-c-g="wide-content"]');
    const rects = [shell, ...navButtons, wideContent]
      .filter((element) => element instanceof HTMLElement)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        };
      });
    const viewportWidth = root.clientWidth;
    return {
      viewport: {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio,
      },
      document: {
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
        bodyClientWidth: body.clientWidth,
        bodyScrollWidth: body.scrollWidth,
      },
      horizontalOverflow:
        root.scrollWidth > root.clientWidth + 1 || body.scrollWidth > body.clientWidth + 1,
      rightEdgeWithinViewport: rects.every((rect) => rect.right <= viewportWidth + 1),
      allVisible: rects.every((rect) => rect.width > 0 && rect.height > 0),
      nav: {
        labels: navButtons.map((button) => button.textContent?.trim() ?? ""),
        count: navButtons.length,
      },
      wideContentPresent: Boolean(wideContent),
      rects,
    };
  });
}

async function runCase(name, viewport, expected) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      errors.push(`console:${message.type()}: ${message.text()}`);
    }
  });
  await page.setViewport(viewport);
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const layout = await inspectPage(page);
  const pass =
    layout.viewport.innerWidth === expected.cssWidth &&
    layout.viewport.devicePixelRatio === expected.devicePixelRatio &&
    layout.nav.count === 3 &&
    layout.nav.labels.join("|") === "概要|利用者|記録" &&
    layout.wideContentPresent &&
    !layout.horizontalOverflow &&
    layout.rightEdgeWithinViewport &&
    layout.allVisible &&
    errors.length === 0;
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name, url, viewport, expected, layout, errors, shot, pass });
  await page.close();
  return pass;
}

let allPass = Object.values(productionCssChecks).every(Boolean);
allPass =
  (await runCase(
    "tablet-100-percent",
    { width: 768, height: 1024, deviceScaleFactor: 1 },
    { cssWidth: 768, devicePixelRatio: 1, equivalentZoom: 100 },
  )) && allPass;
allPass =
  (await runCase(
    "tablet-200-percent-equivalent",
    { width: 384, height: 1024, deviceScaleFactor: 2 },
    { cssWidth: 384, devicePixelRatio: 2, equivalentZoom: 200, referenceWidth: 768 },
  )) && allPass;
allPass =
  (await runCase(
    "desktop-200-percent-equivalent",
    { width: 640, height: 900, deviceScaleFactor: 2 },
    { cssWidth: 640, devicePixelRatio: 2, equivalentZoom: 200, referenceWidth: 1280 },
  )) && allPass;

const report = {
  unit: "C-G",
  kind: "browser smoke / PC-tablet horizontal-scroll and 200% equivalent viewport evidence",
  date: new Date().toISOString(),
  productionCssChecks,
  scope: {
    destinationsImplemented: false,
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    membershipLookupAuthorized: false,
    authJudgmentAuthorized: false,
    businessDataIncluded: false,
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
