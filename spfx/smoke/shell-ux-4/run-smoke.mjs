#!/usr/bin/env node
/**
 * SHELL-UX-4 browser smoke runner (Chrome via puppeteer-core).
 * Scope: partial-retrieval presentation only. No adapter fetch / judgment / live I/O.
 */
import * as esbuild from "/tmp/node_modules/esbuild/lib/main.js";
import puppeteer from "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/shell-ux-4-browser-smoke";
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

await new Promise((resolve) => server.listen(4176, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4176";

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
    "partial-separated",
    "viewMode=partial_retrieval_failed&siteSelection=SITE-ISG&saveState=unsaved",
    () => {
      const panel = document.querySelector('[data-shell-ux="partial-retrieval-panel"]');
      const warning = document.querySelector('[data-shell-ux="partial-retrieval-warning"]');
      const succeeded = document.querySelector('[data-shell-ux="partial-retrieval-succeeded"]');
      const failed = document.querySelector('[data-shell-ux="partial-retrieval-failed"]');
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const fullFail = document.querySelector('[data-shell-ux="retrieval-failed-panel"]');
      const slice = document
        .querySelector("[data-shell-ux-slice]")
        ?.getAttribute("data-shell-ux-slice");
      const warningText = warning?.textContent ?? "";
      return {
        pass:
          Boolean(panel) &&
          Boolean(succeeded) &&
          Boolean(failed) &&
          !ready &&
          !fullFail &&
          slice === "SHELL-UX-4" &&
          warningText.includes("全件正常ではありません") &&
          (succeeded?.querySelectorAll('[data-shell-ux="partial-retrieval-succeeded-item"]')
            .length ?? 0) >= 1 &&
          (failed?.querySelectorAll('[data-shell-ux="partial-retrieval-failed-item"]').length ??
            0) >= 1,
        panel: Boolean(panel),
        ready: Boolean(ready),
        warningText,
        slice,
      };
    },
  )) && allPass;

allPass =
  (await smokeCase(
    "not-collapsed-to-full-success",
    "viewMode=partial_retrieval_failed&siteSelection=SITE-ISG",
    () => {
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const warning = document.querySelector('[data-shell-ux="partial-retrieval-warning"]');
      const failedItems = document.querySelectorAll(
        '[data-shell-ux="partial-retrieval-failed-item"]',
      );
      const text = document.body?.textContent ?? "";
      return {
        pass:
          !ready &&
          failedItems.length >= 1 &&
          (warning?.textContent ?? "").includes("全件正常ではありません") &&
          !text.includes("全件正常です"),
        ready: Boolean(ready),
        failedCount: failedItems.length,
      };
    },
  )) && allPass;

allPass =
  (await smokeCase(
    "ready-still-works",
    "viewMode=ready&siteSelection=SITE-ISG&saveState=saved",
    () => {
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const partial = document.querySelector('[data-shell-ux="partial-retrieval-panel"]');
      return {
        pass: Boolean(ready) && !partial,
        ready: Boolean(ready),
        partial: Boolean(partial),
      };
    },
  )) && allPass;

// Keyboard: skip link still focusable under partial mode
{
  const page = await browser.newPage();
  const url = `${base}/index.html?viewMode=partial_retrieval_failed&siteSelection=SITE-ISG`;
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.keyboard.press("Tab");
  const active = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      text: el?.textContent?.trim() ?? "",
      className: el?.className ?? "",
    };
  });
  const focusPass = active.text === "メイン内容へスキップ" || /skip/i.test(active.className ?? "");
  const shot = path.join(artifactsDir, "keyboard-skip-focus.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-skip-focus",
    url,
    found: { focusPass, active },
    shot,
    pass: focusPass,
  });
  allPass = allPass && focusPass;
  await page.close();
}

// Tablet partial
{
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });
  const url = `${base}/index.html?viewMode=partial_retrieval_failed&siteSelection=SITE-ISG`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const ok = await page.evaluate(() => {
    return (
      Boolean(document.querySelector('[data-shell-ux="partial-retrieval-panel"]')) &&
      Boolean(document.querySelector('[data-shell-ux="partial-retrieval-succeeded"]')) &&
      Boolean(document.querySelector('[data-shell-ux="partial-retrieval-failed"]')) &&
      !document.querySelector('[data-shell-ux="ready-region"]')
    );
  });
  const shot = path.join(artifactsDir, "tablet-partial.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: "tablet-partial", url, found: { ok }, shot, pass: ok });
  allPass = allPass && ok;
  await page.close();
}

const report = {
  unit: "SHELL-UX-4",
  kind: "browser smoke / partial-retrieval presentation",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "SHELL-UX-4",
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    membershipLookupAuthorized: false,
    adapterFetchAuthorized: false,
    outcomeJudgmentAuthorized: false,
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
