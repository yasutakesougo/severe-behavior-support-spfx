#!/usr/bin/env node
/**
 * VP-7 optical alignment browser smoke — runtime evidence for PR #503.
 * Synthetic fixture only. No SharePoint / Deploy / live I/O.
 *
 * Verifies:
 * - desktop / tablet / narrow before-after same-condition comparison
 * - focus ring unchanged
 * - hit area unchanged
 * - horizontal overflow unchanged
 * - console errors = 0
 * - SharePoint / Graph requests = 0
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir =
  process.env.VP7_ARTIFACTS_DIR ?? "/opt/cursor/artifacts/vp-7-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const exactHead = process.env.VP7_EXACT_HEAD ?? "7542797e8b95a58e26cee075bbc2eb89e9e47e03";
const definitionBase =
  process.env.VP7_DEFINITION_BASE ?? "0f42ca3e7c77d5094620978a77f95e7d0e104150";

const esbuildModule = await import(
  process.env.VP7_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.VP7_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const sassModule = await import(process.env.VP7_SASS_PATH ?? "/tmp/node_modules/sass/sass.node.mjs");
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ?? sassModule.default?.compile ?? (await import("sass")).compile;

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

function readCorrectionScss() {
  return fs.readFileSync(
    path.join(repoRoot, "src/shell/procedure/ProcedureRecordCorrectionUx.module.scss"),
    "utf8",
  );
}

function stripBeforeOpticalOffset(scss) {
  return scss.replace(/\n\.resultOption input \{\n  margin-top: [^;]+;\n\}\n?/u, "\n");
}

function compileProductionCss(correctionScssRelPath) {
  const paths = [
    "src/shell/primitives/Primitives.module.scss",
    correctionScssRelPath,
  ];
  const resetCss = `
    html, body { margin: 0; padding: 0; box-sizing: border-box; font-size: 16px; }
    *, *::before, *::after { box-sizing: inherit; }
  `;
  const compiled = paths
    .map((rel) =>
      normalizeSpfxThemeCss(compileScss(path.join(repoRoot, rel), { style: "expanded" }).css),
    )
    .join("\n");
  return `${resetCss}\n${compiled}`;
}

const afterScss = readCorrectionScss();
const beforeScss = stripBeforeOpticalOffset(afterScss);
if (beforeScss === afterScss) {
  throw new Error("VP-7 smoke: before SCSS strip did not remove optical offset rule");
}
if (!afterScss.includes(".resultOption input")) {
  throw new Error("VP-7 smoke: after SCSS missing .resultOption input rule");
}

const beforeScssPath = path.join(repoRoot, "src/shell/procedure/.vp7-smoke-before.module.scss");
fs.writeFileSync(beforeScssPath, beforeScss);

const afterCss = compileProductionCss("src/shell/procedure/ProcedureRecordCorrectionUx.module.scss");
const beforeCss = compileProductionCss("src/shell/procedure/.vp7-smoke-before.module.scss");
fs.writeFileSync(path.join(outDir, "smoke-production-after.css"), afterCss);
fs.writeFileSync(path.join(outDir, "smoke-production-before.css"), beforeCss);

for (const [variant, cssName] of [
  ["before", "smoke-production-before.css"],
  ["after", "smoke-production-after.css"],
]) {
  fs.writeFileSync(
    path.join(outDir, `index-${variant}.html`),
    `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>VP-7 optical alignment browser smoke (${variant})</title>
    <link rel="icon" href="data:," />
    <link rel="stylesheet" href="./${cssName}" />
  </head>
  <body>
    <div id="root"></div>
    <script src="./smoke-bundle.js"></script>
  </body>
</html>`,
  );
}

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

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "/index-after.html" : url.pathname;
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

await new Promise((resolve) => server.listen(4197, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4197";

const browser = await puppeteer.launch({
  executablePath: process.env.VP7_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
  defaultViewport: { width: 1440, height: 900 },
});

const checks = [];
let allPass = true;
const sharePointGraphRequests = [];

function isSharePointOrGraphRequest(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    return (
      host.includes("sharepoint.com") ||
      host.includes("graph.microsoft.com") ||
      pathname.includes("/_api/")
    );
  } catch {
    return false;
  }
}

function record(name, pass, details) {
  checks.push({ name, pass, details });
  allPass = allPass && pass;
  console.log(pass ? `PASS ${name}` : `FAIL ${name}`, details);
}

function approxEqual(a, b, tolerance = 0.5) {
  return Math.abs(a - b) <= tolerance;
}

async function measureSurface(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-field-workflow="procedure-record-correction"]');
    const firstOption = document.querySelector('[data-field-workflow="correction-result-option"]');
    const firstInput = firstOption?.querySelector("input");
    const docEl = document.documentElement;
    const body = document.body;
    const inputStyle = firstInput ? window.getComputedStyle(firstInput) : null;
    const optionStyle = firstOption ? window.getComputedStyle(firstOption) : null;
    const optionRect = firstOption?.getBoundingClientRect();
    const inputRect = firstInput?.getBoundingClientRect();
    return {
      correctionPresent: Boolean(root),
      optionCount: document.querySelectorAll('[data-field-workflow="correction-result-option"]').length,
      inputMarginTop: inputStyle ? parseFloat(inputStyle.marginTop) : null,
      optionMinHeight: optionStyle ? parseFloat(optionStyle.minHeight) : null,
      optionWidth: optionRect?.width ?? null,
      optionHeight: optionRect?.height ?? null,
      inputWidth: inputRect?.width ?? null,
      inputHeight: inputRect?.height ?? null,
      horizontalOverflow:
        Math.max(docEl.scrollWidth, body.scrollWidth) >
        Math.max(docEl.clientWidth, body.clientWidth) + 1,
      scrollWidth: Math.max(docEl.scrollWidth, body.scrollWidth),
      clientWidth: Math.max(docEl.clientWidth, body.clientWidth),
    };
  });
}

async function measureFocusRing(page) {
  await page.focus('[data-field-workflow="correction-result-option"] input');
  return page.evaluate(() => {
    const focused = document.activeElement;
    const option = focused?.closest('[data-field-workflow="correction-result-option"]');
    const optionStyle = option ? window.getComputedStyle(option) : null;
    const outlineWidth = optionStyle ? parseFloat(optionStyle.outlineWidth) : 0;
    const outlineStyle = optionStyle?.outlineStyle ?? "none";
    const outlineColor = optionStyle?.outlineColor ?? "";
    return {
      focusedTag: focused?.tagName ?? "",
      focusedType: focused?.getAttribute("type") ?? "",
      optionFound: Boolean(option),
      outlineWidth,
      outlineStyle,
      outlineColor,
      focusVisible: Boolean(option?.matches(":has(input:focus-visible)")),
    };
  });
}

async function runViewportCase(viewportName, viewport) {
  let beforeMetrics;
  let afterMetrics;
  let beforeFocus;
  let afterFocus;

  for (const variant of ["before", "after"]) {
    const page = await browser.newPage();
    const errors = [];
    const variantRequests = [];
    page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
    page.on("console", (message) => {
      if (message.type() === "error") {
        const text = message.text();
        if (text.includes("favicon.ico")) {
          return;
        }
        errors.push(`console.error: ${text}`);
      }
    });
    page.on("request", (request) => {
      if (isSharePointOrGraphRequest(request.url())) {
        variantRequests.push(request.url());
        sharePointGraphRequests.push(request.url());
      }
    });

    await page.setViewport(viewport);
    await page.goto(`${base}/index-${variant}.html`, { waitUntil: "networkidle0" });
    await page.waitForSelector('[data-field-workflow="procedure-record-correction"]', {
      timeout: 8000,
    });

    const metrics = await measureSurface(page);
    const focus = await measureFocusRing(page);
    const shot = path.join(artifactsDir, `${viewportName}-${variant}.png`);
    await page.screenshot({ path: shot, fullPage: true });

    if (variant === "before") {
      beforeMetrics = metrics;
      beforeFocus = focus;
    } else {
      afterMetrics = metrics;
      afterFocus = focus;
    }

    record(`${viewportName}-${variant}-render`, metrics.correctionPresent && metrics.optionCount === 3, {
      metrics,
      focus,
      screenshot: shot,
    });
    record(`${viewportName}-${variant}-console-errors`, errors.length === 0, { errors });
    record(`${viewportName}-${variant}-network-boundary`, variantRequests.length === 0, {
      variantRequests,
    });
    record(`${viewportName}-${variant}-overflow`, metrics.horizontalOverflow === false, {
      scrollWidth: metrics.scrollWidth,
      clientWidth: metrics.clientWidth,
    });
    record(`${viewportName}-${variant}-focus-ring`, focus.outlineWidth > 0 && focus.outlineStyle !== "none", {
      focus,
    });

  await page.close();
  }

  record(`${viewportName}-before-no-explicit-offset`, beforeMetrics.inputMarginTop < afterMetrics.inputMarginTop, {
    beforeInputMarginTop: beforeMetrics.inputMarginTop,
    afterInputMarginTop: afterMetrics.inputMarginTop,
  });
  record(`${viewportName}-after-space-1-offset`, approxEqual(afterMetrics.inputMarginTop, 4), {
    inputMarginTop: afterMetrics.inputMarginTop,
  });
  record(`${viewportName}-hit-area-unchanged`, approxEqual(beforeMetrics.optionWidth, afterMetrics.optionWidth) &&
    approxEqual(beforeMetrics.optionHeight, afterMetrics.optionHeight), {
    before: {
      width: beforeMetrics.optionWidth,
      height: beforeMetrics.optionHeight,
    },
    after: {
      width: afterMetrics.optionWidth,
      height: afterMetrics.optionHeight,
    },
  });
  record(`${viewportName}-input-size-unchanged`, approxEqual(beforeMetrics.inputWidth, afterMetrics.inputWidth) &&
    approxEqual(beforeMetrics.inputHeight, afterMetrics.inputHeight), {
    before: {
      width: beforeMetrics.inputWidth,
      height: beforeMetrics.inputHeight,
    },
    after: {
      width: afterMetrics.inputWidth,
      height: afterMetrics.inputHeight,
    },
  });
  record(`${viewportName}-focus-ring-unchanged`, approxEqual(beforeFocus.outlineWidth, afterFocus.outlineWidth) &&
    beforeFocus.outlineStyle === afterFocus.outlineStyle, {
    before: beforeFocus,
    after: afterFocus,
  });
}

try {
  await runViewportCase("desktop", { width: 1440, height: 900, deviceScaleFactor: 1 });
  await runViewportCase("tablet", { width: 768, height: 1024, deviceScaleFactor: 1 });
  await runViewportCase("narrow", { width: 390, height: 844, deviceScaleFactor: 1 });

  const summary = {
    allPass,
    exactHead,
    definitionBase,
    cases: checks.length,
    passed: checks.filter((entry) => entry.pass).length,
    failed: checks.filter((entry) => !entry.pass).length,
    sharePointGraphRequests: sharePointGraphRequests.length,
    artifactsDir,
  };
  fs.writeFileSync(path.join(artifactsDir, "summary.json"), JSON.stringify({ summary, checks }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  if (!allPass) {
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  server.close();
  if (fs.existsSync(beforeScssPath)) {
    fs.unlinkSync(beforeScssPath);
  }
}
