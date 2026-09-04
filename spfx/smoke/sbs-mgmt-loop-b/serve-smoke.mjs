#!/usr/bin/env node
/**
 * STAFF-ARRIVAL-1 interactive serve.
 * Always esbuilds smoke-entry and its product imports from the current checkout.
 * No SharePoint / Deploy / LIVE WRITE.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const spfxRoot = path.join(__dirname, "../..");
const repoRoot = path.join(spfxRoot, "..");
const entry = path.join(spfxRoot, "smoke/support-plan-review-new-version-demo-1/smoke-entry.tsx");
const outDir = __dirname;
const port = Number(process.env.SBS_MGMT_LOOP_B_PORT ?? 4194);

function resolveImport(specifiers) {
  for (const specifier of specifiers) {
    try {
      return pathToFileURL(require.resolve(specifier)).href;
    } catch {
      // continue
    }
  }
  return null;
}

function readCheckoutHead() {
  return execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "inherit"],
  }).trim();
}

const productSourceHead = readCheckoutHead();
const expectedProductSourceHead = process.env.SBS_MGMT_LOOP_B_EXPECTED_PRODUCT_HEAD ?? null;
if (expectedProductSourceHead && productSourceHead !== expectedProductSourceHead) {
  console.error(
    `Product HEAD mismatch: expected ${expectedProductSourceHead}, observed ${productSourceHead}.`,
  );
  process.exit(1);
}
fs.writeFileSync(path.join(outDir, "product-head.txt"), `${productSourceHead}\n`);

const esbuildHref =
  process.env.SBS_MGMT_LOOP_B_ESBUILD_PATH ??
  resolveImport([
    path.join(spfxRoot, "node_modules/esbuild/lib/main.js"),
    path.join(repoRoot, "node_modules/esbuild/lib/main.js"),
    "/tmp/node_modules/esbuild/lib/main.js",
    "esbuild/lib/main.js",
  ]);
const sassHref =
  process.env.SBS_MGMT_LOOP_B_SASS_PATH ??
  resolveImport([
    path.join(spfxRoot, "node_modules/sass/sass.node.js"),
    path.join(repoRoot, "node_modules/sass/sass.node.js"),
    "/tmp/node_modules/sass/sass.node.js",
    "sass/sass.node.js",
  ]);

if (!esbuildHref || !sassHref) {
  console.error(
    "Missing esbuild/sass. From repo root run:\n" +
      "  npm install esbuild sass --no-save\n" +
      "or set SBS_MGMT_LOOP_B_ESBUILD_PATH / SBS_MGMT_LOOP_B_SASS_PATH.",
  );
  process.exit(1);
}

const esbuildModule = await import(esbuildHref);
const sassModule = await import(sassHref);
const esbuild = esbuildModule.default ?? esbuildModule;
const compileScss = sassModule.compile ?? sassModule.default?.compile;

const scssPaths = [
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
  "src/shell/users/SupportPlanUx.module.scss",
  "src/shell/users/SupportPlanManagementListUx.module.scss",
  "src/shell/review/ReviewDueStateUx.module.scss",
  "src/shell/monitoring/MonitoringViewUx.module.scss",
  "src/shell/monitoring/ReviewOutcomeCaptureView.module.scss",
];

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

console.log(`Building synthetic Planning-PC smoke bundle from ${productSourceHead}...`);
const css = scssPaths
  .map((rel) =>
    normalizeSpfxThemeCss(compileScss(path.join(spfxRoot, rel), { style: "expanded" }).css),
  )
  .join("\n");
fs.writeFileSync(path.join(outDir, "smoke-production.css"), css);

const scssStubPlugin = {
  name: "scss-module-stub",
  setup(build) {
    build.onLoad({ filter: /\.module\.scss$/ }, async (args) => {
      const text = await fs.promises.readFile(args.path, "utf8");
      const keys = new Set();
      for (const match of text.matchAll(/\.([A-Za-z_][\w-]*)\s*[,:{]/g)) keys.add(match[1]);
      const entries = [...keys]
        .map((key) => `  ${JSON.stringify(key)}: ${JSON.stringify(key)}`)
        .join(",\n");
      return { contents: `export default {\n${entries}\n};`, loader: "js" };
    });
  },
};

const nodePaths = [
  process.env.SBS_MGMT_LOOP_B_NODE_PATH,
  path.join(spfxRoot, "node_modules"),
  path.join(repoRoot, "node_modules"),
  "/tmp/node_modules",
].filter(Boolean);

await esbuild.build({
  entryPoints: [entry],
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
  nodePaths,
});

fs.writeFileSync(
  path.join(outDir, "index.html"),
  '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="smoke-production.css"></head><body><div id="root"></div><script src="smoke-bundle.js"></script></body></html>',
);

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = path.join(outDir, path.normalize(rel).replace(/^(\.\.[/\\])+/, ""));
  if (!filePath.startsWith(outDir)) {
    return res.writeHead(403).end("forbidden");
  }
  fs.readFile(filePath, (error, data) => {
    if (error) return res.writeHead(404).end("not found");
    const ext = path.extname(filePath);
    const contentTypes = {
      ".html": "text/html",
      ".css": "text/css",
      ".txt": "text/plain",
    };
    const type = contentTypes[ext] ?? "application/javascript";
    res.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

const staffBeforeApplyUrl = `http://127.0.0.1:${port}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply`;
const coldUrl = `http://127.0.0.1:${port}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER`;
console.log("");
console.log(`Verification harness ready @ product HEAD ${productSourceHead} (no LIVE WRITE).`);
console.log(`Staff Apply 前: ${staffBeforeApplyUrl}`);
console.log("  → harness drives the product DOM from this exact checkout until 「版 4 を適用開始する」.");
console.log(`Cold / default: ${coldUrl}`);
console.log("  → empty session; Apply must stay unmounted.");
console.log("Ctrl+C to stop.");
