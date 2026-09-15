#!/usr/bin/env node
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";
import puppeteer from "puppeteer-core";
import { compile } from "sass";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const artifactsDir = process.env.HRUI_ARTIFACTS_DIR ?? path.join(__dirname, "artifacts");
fs.mkdirSync(artifactsDir, { recursive: true });

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const css = normalizeSpfxThemeCss(
  compile(path.join(repoRoot, "src/shell/monitoring/MonitoringViewUx.module.scss"), {
    style: "expanded",
  }).css,
);
fs.writeFileSync(
  path.join(__dirname, "smoke-production.css"),
  `html,body{margin:0;padding:0;box-sizing:border-box}*,*::before,*::after{box-sizing:inherit}${css}`,
);

const scssStubPlugin = {
  name: "scss-module-stub",
  setup(build) {
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, "utf8");
      const keys = new Set();
      for (const match of text.matchAll(/\.([A-Za-z_][\w-]*)\s*[,:{]/g)) keys.add(match[1]);
      const entries = [...keys]
        .map((key) => `${JSON.stringify(key)}:${JSON.stringify(key)}`)
        .join(",");
      return { contents: `export default {${entries}};`, loader: "js" };
    });
  },
};

await esbuild.build({
  entryPoints: [path.join(__dirname, "smoke-entry.tsx")],
  bundle: true,
  outfile: path.join(__dirname, "smoke-bundle.js"),
  format: "iife",
  platform: "browser",
  loader: { ".ts": "ts", ".tsx": "tsx" },
  plugins: [scssStubPlugin],
  define: { "process.env.NODE_ENV": '"production"' },
});

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "index.html" : url.pathname.replace(/^\//, "");
  const filePath = path.join(__dirname, rel);
  if (!filePath.startsWith(__dirname)) return res.writeHead(403).end("forbidden");
  fs.readFile(filePath, (error, data) => {
    if (error) return res.writeHead(404).end("not found");
    const type = filePath.endsWith(".html")
      ? "text/html; charset=utf-8"
      : filePath.endsWith(".js")
        ? "application/javascript; charset=utf-8"
        : "text/css; charset=utf-8";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
});
await new Promise((resolve) => server.listen(4191, "127.0.0.1", resolve));

const browser = await puppeteer.launch({
  executablePath: process.env.HRUI_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

const checks = [];
const viewports = [
  { name: "pc", width: 1280, height: 900 },
  { name: "narrow", width: 390, height: 844 },
];
const cases = ["v2", "v1", "v3", "mismatch", "malformed"];

for (const viewport of viewports) {
  for (const testCase of cases) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    const url = `http://127.0.0.1:4191/index.html?case=${testCase}`;
    await page.goto(url, { waitUntil: "networkidle0" });
    const observed = await page.evaluate((activeCase) => {
      const root = document.querySelector("[data-human-review-status]");
      const text = document.body.textContent ?? "";
      const recordCount = document.querySelectorAll("[data-human-review-record-id]").length;
      const noHorizontalOverflow = document.documentElement.scrollWidth <= window.innerWidth;
      const status = root?.getAttribute("data-human-review-status") ?? "";
      let semanticPass = false;
      if (activeCase === "v2") {
        semanticPass =
          status === "RESOLVED" &&
          text.includes("UserId user-a") &&
          text.includes("planId synthetic-plan-001") &&
          text.includes("計画版 2") &&
          text.includes("synthetic-procedure-p2-v1") &&
          text.includes("一部変更して実施") &&
          text.includes("評価・承認・変更要否の判断は人が行います") &&
          text.includes("個別の事実資料") &&
          Boolean(document.querySelector('[data-human-review-person-identity="true"]')) &&
          Boolean(document.querySelector('[data-human-review-role-cue="materials"]')) &&
          text.includes("実施できなかった") &&
          text.includes("実施できなかった事実の記録です。職員の失敗表示ではありません。") &&
          Boolean(document.querySelector('[data-human-review-result-fact="NOT_PERFORMED"]')) &&
          !/失敗(?!表示ではありません)/.test(text) &&
          recordCount === 3;
      } else if (activeCase === "v1") {
        semanticPass =
          status === "RESOLVED" &&
          text.includes("この計画版・対象期間に一致する実施記録はありません。") &&
          text.includes("0件であることは、「実施できなかった」という結果を意味しません。") &&
          !text.includes("失敗") &&
          recordCount === 0;
      } else if (activeCase === "v3") {
        semanticPass =
          status === "RESOLVED" &&
          text.includes("計画版 3") &&
          text.includes("個別の事実資料") &&
          Boolean(document.querySelector('[data-human-review-person-identity="true"]')) &&
          recordCount === 1;
      } else if (activeCase === "mismatch") {
        semanticPass =
          status === "CONTEXT_MISMATCH" && text.includes("別の資料への置換は行いません");
      } else {
        semanticPass =
          status === "MALFORMED_INPUT" && text.includes("見直し資料を安全に表示できません");
      }
      return { status, recordCount, noHorizontalOverflow, semanticPass };
    }, testCase);
    const pass = observed.semanticPass && observed.noHorizontalOverflow && pageErrors.length === 0;
    const screenshot = path.join(artifactsDir, `${viewport.name}-${testCase}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    checks.push({ viewport, testCase, observed, pageErrors, pass, screenshot });
    await page.close();
  }
}

await browser.close();
await new Promise((resolve) => server.close(resolve));

const report = {
  slice: "HUMAN-REVIEW-UI-SLICE-A",
  viewports,
  checks,
  passed: checks.every((check) => check.pass),
};
fs.writeFileSync(path.join(artifactsDir, "report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
