#!/usr/bin/env node
/**
 * SHELL-UX-3 browser smoke runner (Chrome via puppeteer-core).
 * Scope: display-only multi-site selector + unselected stop. No membership / live I/O.
 */
import * as esbuild from "/tmp/node_modules/esbuild/lib/main.js";
import puppeteer from "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/shell-ux-3-browser-smoke";
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

await new Promise((resolve) => server.listen(4175, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4175";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

async function smokeCase(name, query, assertFn) {
  const page = await browser.newPage();
  const url = `${base}/index.html?${query}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const found = await page.evaluate(assertFn);
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({ name, url, found, shot, pass });
  await page.close();
  return pass;
}

let allPass = true;

allPass =
  (await smokeCase(
    "unselected-stop",
    "viewMode=ready&saveState=unsaved&siteSelection=unselected",
    () => {
      const selector = document.querySelector('[data-shell-ux="site-selector"]');
      const stop = document.querySelector('[data-shell-ux="site-unselected-stop"]');
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const unselectedOpt = document.querySelector('[data-shell-ux="site-option-unselected"]');
      const navDisabled = [...document.querySelectorAll(".navButton")].every((b) => b.disabled);
      const slice = document
        .querySelector("[data-shell-ux-slice]")
        ?.getAttribute("data-shell-ux-slice");
      return {
        pass:
          Boolean(selector) &&
          Boolean(stop) &&
          !ready &&
          unselectedOpt?.checked === true &&
          navDisabled &&
          slice === "SHELL-UX-3" &&
          (stop?.textContent ?? "").includes("未選択"),
        selector: Boolean(selector),
        stop: Boolean(stop),
        ready: Boolean(ready),
        navDisabled,
        slice,
      };
    },
  )) && allPass;

allPass =
  (await smokeCase(
    "selected-isg-ready",
    "viewMode=ready&saveState=saved&siteSelection=SITE-ISG",
    () => {
      const stop = document.querySelector('[data-shell-ux="site-unselected-stop"]');
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const label = document.querySelector('[data-shell-ux="current-site-label"]');
      const isg = document.querySelector('[data-shell-ux="site-option-SITE-ISG"]');
      const navEnabled = [...document.querySelectorAll(".navButton")].every((b) => !b.disabled);
      return {
        pass:
          !stop &&
          Boolean(ready) &&
          Boolean(label) &&
          (label?.textContent ?? "").includes("SITE-ISG") &&
          isg?.checked === true &&
          navEnabled,
        stop: Boolean(stop),
        ready: Boolean(ready),
        label: label?.textContent ?? null,
        navEnabled,
      };
    },
  )) && allPass;

allPass =
  (await smokeCase(
    "selected-hom-ready",
    "viewMode=ready&saveState=unsaved&siteSelection=SITE-HOM",
    () => {
      const label = document.querySelector('[data-shell-ux="current-site-label"]');
      const hom = document.querySelector('[data-shell-ux="site-option-SITE-HOM"]');
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const stop = document.querySelector('[data-shell-ux="site-unselected-stop"]');
      return {
        pass:
          !stop &&
          Boolean(ready) &&
          hom?.checked === true &&
          (label?.textContent ?? "").includes("SITE-HOM"),
        label: label?.textContent ?? null,
        ready: Boolean(ready),
        stop: Boolean(stop),
      };
    },
  )) && allPass;

// Interactive: unselected → select ISG clears stop
{
  const page = await browser.newPage();
  const url = `${base}/index.html?viewMode=ready&siteSelection=unselected`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.click('[data-shell-ux="site-option-SITE-ISG"]');
  const after = await page.evaluate(() => {
    const stop = document.querySelector('[data-shell-ux="site-unselected-stop"]');
    const ready = document.querySelector('[data-shell-ux="ready-region"]');
    const isg = document.querySelector('[data-shell-ux="site-option-SITE-ISG"]');
    return {
      stop: Boolean(stop),
      ready: Boolean(ready),
      isgChecked: isg?.checked === true,
    };
  });
  const pass = !after.stop && after.ready && after.isgChecked;
  const shot = path.join(artifactsDir, "interactive-select-isg.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: "interactive-select-isg", url, found: after, shot, pass });
  allPass = allPass && pass;
  await page.close();
}

// Keyboard: Tab reaches site selector radio
{
  const page = await browser.newPage();
  const url = `${base}/index.html?viewMode=ready&siteSelection=unselected`;
  await page.goto(url, { waitUntil: "networkidle0" });
  // skip link first, then move into header controls
  await page.keyboard.press("Tab");
  let reached = false;
  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        name: el?.getAttribute?.("name") ?? null,
        value: el?.getAttribute?.("value") ?? null,
        shell: el?.getAttribute?.("data-shell-ux") ?? null,
      };
    });
    if (active.name === "shell-ux-site-selection") {
      reached = true;
      break;
    }
  }
  const shot = path.join(artifactsDir, "keyboard-site-selector.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-site-selector",
    url,
    found: { reached },
    shot,
    pass: reached,
  });
  allPass = allPass && reached;
  await page.close();
}

// Tablet unselected
{
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });
  const url = `${base}/index.html?viewMode=ready&siteSelection=unselected`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const ok = await page.evaluate(() => {
    return (
      Boolean(document.querySelector('[data-shell-ux="site-selector"]')) &&
      Boolean(document.querySelector('[data-shell-ux="site-unselected-stop"]')) &&
      !document.querySelector('[data-shell-ux="ready-region"]')
    );
  });
  const shot = path.join(artifactsDir, "tablet-unselected.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: "tablet-unselected", url, found: { ok }, shot, pass: ok });
  allPass = allPass && ok;
  await page.close();
}

const report = {
  unit: "SHELL-UX-3",
  kind: "browser smoke / multi-site selector",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "SHELL-UX-3",
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    membershipLookupAuthorized: false,
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
