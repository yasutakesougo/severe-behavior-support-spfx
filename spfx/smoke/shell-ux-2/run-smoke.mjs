#!/usr/bin/env node
/**
 * SHELL-UX-2 browser smoke runner (Chrome via puppeteer-core).
 * Scope: save-state presentation surface only. No SharePoint / binder / live I/O.
 */
import * as esbuild from "/tmp/node_modules/esbuild/lib/main.js";
import puppeteer from "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/shell-ux-2-browser-smoke";
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

await new Promise((resolve) => server.listen(4174, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4174";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

const SAVE_CASES = [
  { state: "unsaved", label: "未保存", live: "polite", emphasis: "quiet", expectDescription: false },
  { state: "saving", label: "保存中", live: "polite", emphasis: "emphasized", expectDescription: true },
  { state: "saved", label: "保存済み", live: "polite", emphasis: "quiet", expectDescription: false },
  {
    state: "save_failed",
    label: "保存失敗",
    live: "assertive",
    emphasis: "emphasized",
    expectDescription: true,
  },
  {
    state: "save_outcome_unknown",
    label: "保存結果不明",
    live: "assertive",
    emphasis: "emphasized",
    expectDescription: true,
  },
];

async function smokeSaveState(entry) {
  const page = await browser.newPage();
  const url = `${base}/index.html?viewMode=ready&saveState=${entry.state}`;
  await page.goto(url, { waitUntil: "networkidle0" });

  const result = await page.evaluate((expected) => {
    const presentation = document.querySelector('[data-shell-ux="save-state-presentation"]');
    const badge = document.querySelector('[data-shell-ux="save-state"]');
    const description = document.querySelector('[data-shell-ux="save-state-description"]');
    const slice = document.querySelector("[data-shell-ux-slice]");
    return {
      hasPresentation: Boolean(presentation),
      hasBadge: Boolean(badge),
      hasDescription: Boolean(description),
      saveStateAttr: badge?.getAttribute("data-save-state") ?? null,
      presentationState: presentation?.getAttribute("data-save-state") ?? null,
      badgeEmphasis: badge?.getAttribute("data-save-emphasis") ?? null,
      presentationEmphasis: presentation?.getAttribute("data-save-emphasis") ?? null,
      badgeText: badge?.textContent?.trim() ?? null,
      descriptionText: description?.textContent?.trim() ?? null,
      role: badge?.getAttribute("role") ?? null,
      ariaLive: badge?.getAttribute("aria-live") ?? null,
      ariaLabel: badge?.getAttribute("aria-label") ?? null,
      sliceId: slice?.getAttribute("data-shell-ux-slice") ?? null,
      expectedLabel: expected.label,
      expectedLive: expected.live,
      expectedState: expected.state,
      expectedEmphasis: expected.emphasis,
      expectDescription: expected.expectDescription,
    };
  }, entry);

  const descriptionOk = entry.expectDescription
    ? result.hasDescription && Boolean(result.descriptionText)
    : !result.hasDescription;
  const pass =
    result.hasPresentation &&
    result.hasBadge &&
    descriptionOk &&
    result.saveStateAttr === entry.state &&
    result.presentationState === entry.state &&
    result.badgeEmphasis === entry.emphasis &&
    result.presentationEmphasis === entry.emphasis &&
    result.badgeText === entry.label &&
    result.role === "status" &&
    result.ariaLive === entry.live &&
    (result.ariaLabel ?? "").includes(entry.label) &&
    result.sliceId === "SHELL-UX-2" &&
    // independence: unknown must not render fail/saved labels
    (entry.state !== "save_outcome_unknown" ||
      (!result.badgeText?.includes("保存失敗") &&
        !result.badgeText?.includes("保存済み") &&
        !(result.descriptionText ?? "").includes("保存失敗") &&
        !(result.descriptionText ?? "").includes("保存済み")));

  const shot = path.join(artifactsDir, `save-${entry.state}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({ name: `save-${entry.state}`, url, found: result, absent: {}, shot, pass });
  await page.close();
  return pass;
}

let allPass = true;
for (const entry of SAVE_CASES) {
  allPass = (await smokeSaveState(entry)) && allPass;
}

// Tablet viewport — unknown remains independent
{
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });
  const url = `${base}/index.html?viewMode=ready&saveState=save_outcome_unknown`;
  await page.goto(url, { waitUntil: "networkidle0" });
  const ok = await page.evaluate(() => {
    const badge = document.querySelector('[data-shell-ux="save-state"]');
    const description = document.querySelector('[data-shell-ux="save-state-description"]');
    return (
      badge?.getAttribute("data-save-state") === "save_outcome_unknown" &&
      badge?.getAttribute("data-save-emphasis") === "emphasized" &&
      badge?.textContent?.includes("保存結果不明") === true &&
      Boolean(description?.textContent) &&
      !badge.textContent.includes("保存失敗")
    );
  });
  const shot = path.join(artifactsDir, "tablet-save-outcome-unknown.png");
  await page.screenshot({ path: shot, fullPage: true });
  checks.push({
    name: "tablet-save-outcome-unknown",
    url,
    found: { ok },
    absent: {},
    shot,
    pass: ok,
  });
  allPass = allPass && ok;
  await page.close();
}

// Keyboard skip link still works with deepened chrome
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

const report = {
  unit: "SHELL-UX-2",
  kind: "browser smoke / save-state presentation",
  date: new Date().toISOString(),
  sliceFlags: {
    id: "SHELL-UX-2",
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
