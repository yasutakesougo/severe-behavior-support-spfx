#!/usr/bin/env node
/**
 * SHELL-UX-7 browser smoke runner (Chrome via puppeteer-core).
 * Scope: safe navigation destination placeholders only.
 * No business UI / auth judgment / adapter / live I/O.
 */
import * as esbuild from "/tmp/node_modules/esbuild/lib/main.js";
import puppeteer from "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/shell-ux-7-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

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
      return {
        contents: `export default {\n${entries}\n};`,
        loader: "js",
      };
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
  external: [],
});

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
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404).end("not found");
      return;
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] ?? "text/plain" });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(4182, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4182";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

async function smokeCase(name, query, assertFn, viewport, args = []) {
  const page = await browser.newPage();
  if (viewport) {
    await page.setViewport(viewport);
  }
  const url = `${base}/index.html?${query}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const found = await page.evaluate(assertFn, ...args);
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({ name, url, found, shot, pass, viewport: viewport ?? null });
  await page.close();
  return pass;
}

function assertDestination(expectedId, expectedLabel) {
  const placeholder = document.querySelector('[data-shell-ux="destination-placeholder"]');
  const heading = document.querySelector('[data-shell-ux="destination-heading"]');
  const body = document.querySelector('[data-shell-ux="destination-disconnected-body"]');
  const note = document.querySelector('[data-shell-ux="destination-disconnected-note"]');
  const demo = document.querySelector('[data-shell-ux="demo-banner"]');
  const site = document.querySelector('[data-shell-ux="current-site-label"]');
  const selectedNav = document.querySelector(`[data-shell-ux-nav="${expectedId}"]`);
  const selectedButtons = [...document.querySelectorAll('[data-shell-ux-nav-selected="true"]')];
  const labels = [...document.querySelectorAll("[data-shell-ux-nav]")].map(
    (el) => el.textContent?.trim() ?? "",
  );
  const text = document.body?.textContent ?? "";
  const slice = document
    .querySelector("[data-shell-ux-slice]")
    ?.getAttribute("data-shell-ux-slice");
  const noOverflow =
    document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1;
  return {
    pass:
      Boolean(placeholder) &&
      placeholder?.getAttribute("data-shell-ux-destination") === expectedId &&
      (heading?.textContent ?? "").trim() === expectedLabel &&
      (body?.textContent ?? "").includes("業務データには接続されていません") &&
      (note?.textContent ?? "").includes("利用可能な業務画面ではありません") &&
      Boolean(demo) &&
      Boolean(site) &&
      selectedNav?.getAttribute("aria-current") === "page" &&
      selectedButtons.length === 1 &&
      selectedButtons[0]?.getAttribute("data-shell-ux-nav") === expectedId &&
      labels.join("|") === "概要|利用者|記録" &&
      labels.indexOf("支援計画") < 0 &&
      labels.indexOf("管理") < 0 &&
      text.indexOf("利用可能です") < 0 &&
      slice === "SHELL-UX-7" &&
      noOverflow,
    expectedId,
    expectedLabel,
    heading: heading?.textContent?.trim() ?? "",
    labels,
    slice,
    noOverflow,
  };
}

let allPass = true;

allPass =
  (await smokeCase(
    "desktop-overview",
    "viewMode=ready&siteSelection=SITE-ISG&destination=overview",
    assertDestination,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
    ["overview", "概要"],
  )) && allPass;

allPass =
  (await smokeCase(
    "desktop-users",
    "viewMode=ready&siteSelection=SITE-ISG&destination=users",
    assertDestination,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
    ["users", "利用者"],
  )) && allPass;

allPass =
  (await smokeCase(
    "desktop-records",
    "viewMode=ready&siteSelection=SITE-ISG&destination=records",
    assertDestination,
    { width: 1280, height: 900, deviceScaleFactor: 1 },
    ["records", "記録"],
  )) && allPass;

// Keyboard-only destination traversal + focus movement
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`;
  await page.goto(url, { waitUntil: "networkidle0" });

  // Focus first nav button, move to Users with keyboard activation.
  await page.focus('[data-shell-ux-nav="overview"]');
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  let state = await page.evaluate(() => {
    const heading = document.activeElement;
    const selected = document.querySelector('[data-shell-ux-nav-selected="true"]');
    return {
      activeText: heading?.textContent?.trim() ?? "",
      activeData: heading?.getAttribute("data-shell-ux") ?? "",
      selectedNav: selected?.getAttribute("data-shell-ux-nav") ?? "",
      ariaCurrent: selected?.getAttribute("aria-current") ?? "",
      placeholder: document
        .querySelector('[data-shell-ux="destination-placeholder"]')
        ?.getAttribute("data-shell-ux-destination"),
      demo: Boolean(document.querySelector('[data-shell-ux="demo-banner"]')),
      site: Boolean(document.querySelector('[data-shell-ux="current-site-label"]')),
    };
  });
  let keyboardPass =
    state.selectedNav === "users" &&
    state.ariaCurrent === "page" &&
    state.placeholder === "users" &&
    state.activeData === "destination-heading" &&
    state.activeText === "利用者" &&
    state.demo &&
    state.site;

  await page.focus('[data-shell-ux-nav="users"]');
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  state = await page.evaluate(() => {
    const heading = document.activeElement;
    const selected = document.querySelector('[data-shell-ux-nav-selected="true"]');
    return {
      activeText: heading?.textContent?.trim() ?? "",
      activeData: heading?.getAttribute("data-shell-ux") ?? "",
      selectedNav: selected?.getAttribute("data-shell-ux-nav") ?? "",
      placeholder: document
        .querySelector('[data-shell-ux="destination-placeholder"]')
        ?.getAttribute("data-shell-ux-destination"),
    };
  });
  keyboardPass =
    keyboardPass &&
    state.selectedNav === "records" &&
    state.placeholder === "records" &&
    state.activeData === "destination-heading" &&
    state.activeText === "記録";

  const shot = path.join(artifactsDir, "keyboard-destination-traversal.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-destination-traversal",
    url,
    found: state,
    shot,
    pass: keyboardPass,
  });
  allPass = allPass && keyboardPass;
  await page.close();
}

allPass =
  (await smokeCase(
    "tablet-users",
    "viewMode=ready&siteSelection=SITE-HOM&destination=users",
    assertDestination,
    { width: 768, height: 1024, deviceScaleFactor: 1 },
    ["users", "利用者"],
  )) && allPass;

allPass =
  (await smokeCase(
    "desktop-200-percent-equivalent",
    "viewMode=ready&siteSelection=SITE-ISG&destination=overview",
    assertDestination,
    { width: 640, height: 900, deviceScaleFactor: 2 },
    ["overview", "概要"],
  )) && allPass;

const report = {
  unit: "SHELL-UX-7",
  kind: "browser smoke / safe navigation destination placeholders",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "SHELL-UX-7",
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    membershipLookupAuthorized: false,
    authJudgmentAuthorized: false,
    businessDestinationAuthorized: false,
    plansAdministrationNavExpansionAuthorized: false,
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
