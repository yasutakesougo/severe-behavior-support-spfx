#!/usr/bin/env node
/**
 * SHELL-UX-5 browser smoke runner (Chrome via puppeteer-core).
 * Scope: error-code + correlationId inquiry presentation only.
 * No generation / classification / REST / live I/O.
 */
import * as esbuild from "/tmp/node_modules/esbuild/lib/main.js";
import puppeteer from "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/shell-ux-5-browser-smoke";
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

await new Promise((resolve) => server.listen(4177, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4177";

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
    "inquiry-on-retrieval-failed",
    "viewMode=retrieval_failed&siteSelection=SITE-ISG&saveState=unsaved",
    () => {
      const panel = document.querySelector('[data-shell-ux="retrieval-failed-panel"]');
      const inquiry = document.querySelector('[data-shell-ux="error-inquiry-display"]');
      const errorCode = document.querySelector('[data-shell-ux="error-code"]');
      const correlationId = document.querySelector('[data-shell-ux="correlation-id"]');
      const copyText = document.querySelector('[data-shell-ux="error-inquiry-text"]');
      const copyBtn = document.querySelector('[data-shell-ux="error-inquiry-copy"]');
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const slice = document
        .querySelector("[data-shell-ux-slice]")
        ?.getAttribute("data-shell-ux-slice");
      const textValue = copyText?.value ?? "";
      return {
        pass:
          Boolean(panel) &&
          Boolean(inquiry) &&
          Boolean(errorCode) &&
          Boolean(correlationId) &&
          Boolean(copyBtn) &&
          !ready &&
          slice === "SHELL-UX-5" &&
          (errorCode?.textContent ?? "").includes("SHELL-UX-5-SYNTH-E001") &&
          (correlationId?.textContent ?? "").includes("shell-ux-5-synth-corr") &&
          textValue.includes("エラーコード:") &&
          textValue.includes("相関ID:"),
        panel: Boolean(panel),
        inquiry: Boolean(inquiry),
        slice,
        textValue,
      };
    },
  )) && allPass;

allPass =
  (await smokeCase(
    "inquiry-on-access-denied",
    "viewMode=access_denied&siteSelection=SITE-ISG",
    () => {
      const panel = document.querySelector('[data-shell-ux="access-denied-panel"]');
      const inquiry = document.querySelector('[data-shell-ux="error-inquiry-display"]');
      const errorCode = document.querySelector('[data-shell-ux="error-code"]');
      return {
        pass: Boolean(panel) && Boolean(inquiry) && Boolean(errorCode),
        panel: Boolean(panel),
        inquiry: Boolean(inquiry),
      };
    },
  )) && allPass;

allPass =
  (await smokeCase(
    "ready-hides-inquiry",
    "viewMode=ready&siteSelection=SITE-ISG&saveState=saved",
    () => {
      const ready = document.querySelector('[data-shell-ux="ready-region"]');
      const inquiry = document.querySelector('[data-shell-ux="error-inquiry-display"]');
      const fail = document.querySelector('[data-shell-ux="retrieval-failed-panel"]');
      return {
        pass: Boolean(ready) && !inquiry && !fail,
        ready: Boolean(ready),
        inquiry: Boolean(inquiry),
      };
    },
  )) && allPass;

// Keyboard: Tab reaches copy button under retrieval_failed
{
  const page = await browser.newPage();
  const url = `${base}/index.html?viewMode=retrieval_failed&siteSelection=SITE-ISG`;
  await page.goto(url, { waitUntil: "networkidle0" });
  let reachedCopy = false;
  for (let i = 0; i < 20; i += 1) {
    await page.keyboard.press("Tab");
    const active = await page.evaluate(() => {
      const el = document.activeElement;
      return {
        shellUx: el?.getAttribute?.("data-shell-ux") ?? "",
        tag: el?.tagName ?? "",
        text: el?.textContent?.trim() ?? "",
      };
    });
    if (active.shellUx === "error-inquiry-copy" || active.text.includes("問い合わせ情報をコピー")) {
      reachedCopy = true;
      break;
    }
  }
  const shot = path.join(artifactsDir, "keyboard-copy-focus.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "keyboard-copy-focus",
    url,
    found: { reachedCopy },
    shot,
    pass: reachedCopy,
  });
  allPass = allPass && reachedCopy;
  await page.close();
}

// Tablet inquiry
{
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });
  const url = `${base}/index.html?viewMode=retrieval_failed&siteSelection=SITE-ISG`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const ok = await page.evaluate(() => {
    return (
      Boolean(document.querySelector('[data-shell-ux="error-inquiry-display"]')) &&
      Boolean(document.querySelector('[data-shell-ux="error-code"]')) &&
      Boolean(document.querySelector('[data-shell-ux="correlation-id"]')) &&
      !document.querySelector('[data-shell-ux="ready-region"]')
    );
  });
  const shot = path.join(artifactsDir, "tablet-inquiry.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: "tablet-inquiry", url, found: { ok }, shot, pass: ok });
  allPass = allPass && ok;
  await page.close();
}

const report = {
  unit: "SHELL-UX-5",
  kind: "browser smoke / error-code + correlationId inquiry presentation",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "SHELL-UX-5",
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    membershipLookupAuthorized: false,
    adapterFetchAuthorized: false,
    outcomeJudgmentAuthorized: false,
    errorCodeGenerationAuthorized: false,
    adapterFailureClassificationAuthorized: false,
    telemetryBackendAuthorized: false,
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
