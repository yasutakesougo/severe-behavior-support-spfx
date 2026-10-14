#!/usr/bin/env node
/**
 * Human PL-HTA Re-Run interactive serve.
 * STATE A = /state-a (planVersion 1 / 0件)
 * STATE B = /state-b (planVersion 2 / NOT_PERFORMED)
 * Bound product HEAD must be 4647223e82d175e35748a5107bef6e322f316935 unless overridden.
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
const entry = path.join(__dirname, "smoke-entry.tsx");
const outDir = __dirname;
const port = Number(process.env.SBS_PL_HTA_RERUN_PORT ?? 4217);
const expectedHead =
  process.env.SBS_PL_HTA_RERUN_EXPECTED_PRODUCT_HEAD ??
  "4647223e82d175e35748a5107bef6e322f316935";

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
if (productSourceHead !== expectedHead) {
  console.error(
    `Product HEAD mismatch: expected ${expectedHead}, observed ${productSourceHead}.`,
  );
  process.exit(1);
}
fs.writeFileSync(path.join(outDir, "product-head.txt"), `${productSourceHead}\n`);

const esbuildHref =
  process.env.SBS_PL_HTA_RERUN_ESBUILD_PATH ??
  resolveImport([
    path.join(spfxRoot, "node_modules/esbuild/lib/main.js"),
    path.join(repoRoot, "node_modules/esbuild/lib/main.js"),
    "/tmp/node_modules/esbuild/lib/main.js",
    "esbuild/lib/main.js",
  ]);
const sassHref =
  process.env.SBS_PL_HTA_RERUN_SASS_PATH ??
  resolveImport([
    path.join(spfxRoot, "node_modules/sass/sass.node.js"),
    path.join(repoRoot, "node_modules/sass/sass.node.js"),
    "/tmp/node_modules/sass/sass.node.js",
    "sass/sass.node.js",
  ]);

if (!esbuildHref || !sassHref) {
  console.error(
    "Missing esbuild/sass. From spfx/ run npm ci, or set SBS_PL_HTA_RERUN_ESBUILD_PATH / SBS_PL_HTA_RERUN_SASS_PATH.",
  );
  process.exit(1);
}

const esbuildModule = await import(esbuildHref);
const sassModule = await import(sassHref);
const esbuild = esbuildModule.default ?? esbuildModule;
const compileScss = sassModule.compile ?? sassModule.default?.compile;

const scssPaths = [
  "src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss",
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/ux/Vp1DemoSeparation.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/dashboard/TodaySupportDayBoardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
  "src/shell/users/SupportPlanUx.module.scss",
  "src/shell/users/SupportPlanManagementListUx.module.scss",
  "src/shell/users/ManagementHomeUx.module.scss",
  "src/shell/monitoring/MonitoringViewUx.module.scss",
  "src/shell/primitives/Primitives.module.scss",
];

function normalizeSpfxThemeCss(css) {
  return css
    .replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1")
    .replace(/:global\(([^)]+)\)/g, "$1");
}

console.log(`Building Human PL-HTA Re-Run harness from ${productSourceHead}...`);
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
  process.env.SBS_PL_HTA_RERUN_NODE_PATH,
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

const html = `<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Human PL-HTA Re-Run</title>
  <link rel="stylesheet" href="/smoke-production.css" />
</head>
<body>
  <div id="root"></div>
  <script src="/smoke-bundle.js"></script>
</body>
</html>
`;
fs.writeFileSync(path.join(outDir, "index.html"), html);

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://127.0.0.1:${port}`);
  let rel = url.pathname;
  if (rel === "/" || rel === "/state-a" || rel === "/state-b" || rel === "/state-a/" || rel === "/state-b/") {
    rel = "/index.html";
  }
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
      ".js": "application/javascript",
    };
    const type = contentTypes[ext] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));

console.log("");
console.log(`HARNESS READY @ product HEAD ${productSourceHead} (technical only ≠ PL-HTA PASS).`);
console.log(`STATE A (v1 / 0件): http://127.0.0.1:${port}/state-a`);
console.log(`STATE B (v2 / NOT_PERFORMED): http://127.0.0.1:${port}/state-b`);
console.log("Leave this process running for Human visual judgment.");
