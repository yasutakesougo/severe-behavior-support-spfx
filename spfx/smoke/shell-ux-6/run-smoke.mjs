#!/usr/bin/env node
/**
 * SHELL-UX-6 browser smoke runner (Chrome via puppeteer-core).
 * Scope: unauthenticated fail-closed presentation only.
 * No auth judgment / Entra / token / role / redirect / live I/O.
 */
import * as esbuild from "/tmp/node_modules/esbuild/lib/main.js";
import puppeteer from "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/shell-ux-6-browser-smoke";
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

await new Promise((resolve) => server.listen(4178, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4178";

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
    "unauthenticated-panel",
    "viewMode=unauthenticated&siteSelection=SITE-ISG",
    () => {
      const panel = document.querySelector('[data-shell-ux="unauthenticated-panel"]');
      const body = document.querySelector('[data-shell-ux="unauthenticated-body"]');
      const noPii = document.querySelector('[data-shell-ux="unauthenticated-no-pii"]');
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const user = document.querySelector('[data-shell-ux="user-display"]');
      const suppressed = document.querySelector('[data-shell-ux="user-display-suppressed"]');
      const siteSelector = document.querySelector('[data-shell-ux="site-selector"]');
      const text = document.body?.textContent ?? "";
      const slice = document
        .querySelector("[data-shell-ux-slice]")
        ?.getAttribute("data-shell-ux-slice");
      return {
        pass:
          Boolean(panel) &&
          Boolean(body) &&
          Boolean(noPii) &&
          Boolean(suppressed) &&
          !ready &&
          !user &&
          !siteSelector &&
          !text.includes("Smoke Operator Sensitive Name") &&
          (body?.textContent ?? "").includes("個人情報および業務データは表示していません") &&
          slice === "SHELL-UX-6",
        panel: Boolean(panel),
        ready: Boolean(ready),
        user: Boolean(user),
        slice,
      };
    },
  )) && allPass;

allPass =
  (await smokeCase(
    "ready-still-works",
    "viewMode=ready&siteSelection=SITE-ISG&saveState=saved",
    () => {
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const panel = document.querySelector('[data-shell-ux="unauthenticated-panel"]');
      const user = document.querySelector('[data-shell-ux="user-display"]');
      return {
        pass: Boolean(ready) && !panel && Boolean(user),
        ready: Boolean(ready),
        panel: Boolean(panel),
      };
    },
  )) && allPass;

allPass =
  (await smokeCase(
    "nav-disabled-when-unauthenticated",
    "viewMode=unauthenticated&siteSelection=SITE-ISG",
    () => {
      const buttons = [...document.querySelectorAll(".navButton, button")].filter((el) =>
        ["概要", "利用者", "記録"].includes(el.textContent?.trim() ?? ""),
      );
      const allDisabled = buttons.length >= 3 && buttons.every((b) => b.disabled);
      return { pass: allDisabled, count: buttons.length };
    },
  )) && allPass;

// Keyboard: skip link still focusable
{
  const page = await browser.newPage();
  const url = `${base}/index.html?viewMode=unauthenticated&siteSelection=SITE-ISG`;
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

// Tablet
{
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });
  const url = `${base}/index.html?viewMode=unauthenticated&siteSelection=SITE-ISG`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const ok = await page.evaluate(() => {
    const text = document.body?.textContent ?? "";
    return (
      Boolean(document.querySelector('[data-shell-ux="unauthenticated-panel"]')) &&
      !document.querySelector('[data-shell-ux="ready-region"]') &&
      !text.includes("Smoke Operator Sensitive Name")
    );
  });
  const shot = path.join(artifactsDir, "tablet-unauthenticated.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: "tablet-unauthenticated", url, found: { ok }, shot, pass: ok });
  allPass = allPass && ok;
  await page.close();
}

const report = {
  unit: "SHELL-UX-6",
  kind: "browser smoke / unauthenticated fail-closed presentation",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "SHELL-UX-6",
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    membershipLookupAuthorized: false,
    authJudgmentAuthorized: false,
    entraTokenHandlingAuthorized: false,
    roleResolutionAuthorized: false,
    redirectSignInOrchestrationAuthorized: false,
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
