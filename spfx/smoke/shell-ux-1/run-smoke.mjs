#!/usr/bin/env node
/**
 * SHELL-UX-1 browser smoke runner (Chrome via puppeteer-core).
 * Scope: presentation chrome only. No SharePoint / binder / live I/O.
 */
import * as esbuild from "/tmp/node_modules/esbuild/lib/main.js";
import puppeteer from "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/shell-ux-1-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const scssStubPlugin = {
  name: "scss-module-stub",
  setup(build) {
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      // Export CSS-module keys as themselves so smoke CSS stubs apply.
      const text = await fs.promises.readFile(args.path, "utf8");
      const keys = new Set();
      for (const match of text.matchAll(/\.([A-Za-z_][\w-]*)\s*[,:{]/g)) {
        keys.add(match[1]);
      }
      const entries = [...keys].map((k) => `  ${JSON.stringify(k)}: ${JSON.stringify(k)}`).join(",\n");
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

await new Promise((resolve) => server.listen(4173, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4173";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

async function smokeCase(name, query, requiredSelectors, optionalAbsent = []) {
  const page = await browser.newPage();
  const url = `${base}/index.html?${query}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const found = {};
  for (const sel of requiredSelectors) {
    found[sel] = Boolean(await page.$(sel));
  }
  const absent = {};
  for (const sel of optionalAbsent) {
    absent[sel] = Boolean(await page.$(sel));
  }
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const pass =
    Object.values(found).every(Boolean) && Object.values(absent).every((v) => v === false);
  checks.push({ name, url, found, absent, shot, pass });
  await page.close();
  return pass;
}

const common = [
  '[data-shell-ux="app-shell-chrome"]',
  '[data-shell-ux="demo-banner"]',
  '[data-shell-ux="current-site-label"]',
  '[data-shell-ux="save-state"]',
  '[data-shell-ux="user-display"]',
];

let allPass = true;
allPass =
  (await smokeCase("ready-unsaved", "viewMode=ready&saveState=unsaved", [
    ...common,
    '[data-shell-ux="ready-region"]',
    '[data-shell-ux="shell-body"]',
  ])) && allPass;

allPass =
  (await smokeCase(
    "loading",
    "viewMode=loading&saveState=saving",
    [...common, '[data-shell-ux="loading-panel"]'],
    ['[data-shell-ux="ready-region"]']
  )) && allPass;

allPass =
  (await smokeCase(
    "access-denied",
    "viewMode=access_denied&saveState=save_failed",
    [...common, '[data-shell-ux="access-denied-panel"]'],
    ['[data-shell-ux="ready-region"]']
  )) && allPass;

allPass =
  (await smokeCase(
    "retrieval-failed",
    "viewMode=retrieval_failed&saveState=save_outcome_unknown",
    [...common, '[data-shell-ux="retrieval-failed-panel"]'],
    ['[data-shell-ux="ready-region"]']
  )) && allPass;

// Keyboard focus affordance: skip link becomes focusable target
{
  const page = await browser.newPage();
  await page.goto(`${base}/index.html?viewMode=ready&saveState=saved`, {
    waitUntil: "networkidle0",
  });
  await page.keyboard.press("Tab");
  const active = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      className: el?.className,
      text: el?.textContent?.trim(),
    };
  });
  const focusPass = active.text === "メイン内容へスキップ" || /skip/i.test(active.className ?? "");
  const shot = path.join(artifactsDir, "keyboard-skip-focus.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-skip-focus",
    url: `${base}/index.html?viewMode=ready&saveState=saved`,
    found: { skipFocus: focusPass, active },
    absent: {},
    shot,
    pass: focusPass,
  });
  allPass = allPass && focusPass;
  await page.close();
}

// Tablet viewport smoke
{
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(`${base}/index.html?viewMode=ready&saveState=saved`, {
    waitUntil: "networkidle0",
  });
  const ok = Boolean(await page.$('[data-shell-ux="app-shell-chrome"]'));
  const shot = path.join(artifactsDir, "tablet-ready.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "tablet-ready",
    url: `${base}/index.html?viewMode=ready&saveState=saved`,
    found: { chrome: ok },
    absent: {},
    shot,
    pass: ok,
  });
  allPass = allPass && ok;
  await page.close();
}

const report = {
  unit: "SHELL-UX-1",
  kind: "browser smoke / IR P2 closeout",
  date: new Date().toISOString(),
  sliceFlags: {
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
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
