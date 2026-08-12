#!/usr/bin/env node
/**
 * DEMO-UX-9 browser smoke runner (Chrome via puppeteer-core).
 * Scope: incomplete select → input image follow → local edit → discard on leave.
 * No save / SharePoint write / live I/O / persisted draft.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");
const outDir = __dirname;
const artifactsDir = "/opt/cursor/artifacts/demo-ux-9-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import("/tmp/node_modules/esbuild/lib/main.js");
const puppeteerModule =
  await import("/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js");
const sassModule = await import("/tmp/node_modules/sass/sass.node.mjs");
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const compileScss =
  sassModule.compile ?? sassModule.default?.compile ?? (await import("sass")).compile;

const scssPaths = [
  "src/shell/ux/ShellUx.module.scss",
  "src/shell/dashboard/DashboardUx.module.scss",
  "src/shell/users/UsersUx.module.scss",
  "src/shell/users/UserDetailUx.module.scss",
  "src/shell/users/SupportPlanUx.module.scss",
  "src/shell/records/DailyRecordsUx.module.scss",
  "src/shell/review/ReviewDueStateUx.module.scss",
].map((p) => path.join(repoRoot, p));

function normalizeSpfxThemeCss(css) {
  return css.replace(/"\[theme:[^,]+,\s*default:\s*([^"\]]+)\]"/g, "$1");
}

const resetCss = `
  html, body { margin: 0; padding: 0; box-sizing: border-box; }
  *, *::before, *::after { box-sizing: inherit; }
`;
const productionCss =
  resetCss +
  "\n" +
  scssPaths
    .map((scssPath) => normalizeSpfxThemeCss(compileScss(scssPath, { style: "expanded" }).css))
    .join("\n");
fs.writeFileSync(path.join(outDir, "smoke-production.css"), productionCss);

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
  ".css": "text/css; charset=utf-8",
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

await new Promise((resolve) => server.listen(4191, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4191";

const browser = await puppeteer.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];
let allPass = true;

async function runCase(name, url, assertFn) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0" });
  const found = await assertFn(page);
  if (errors.length > 0) {
    found.pass = false;
    found.pageErrors = errors;
  }
  const shot = path.join(artifactsDir, `${name}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const pass = Boolean(found.pass);
  checks.push({ name, url, found, shot, pass, pageErrors: errors });
  allPass = allPass && pass;
  await page.close();
  console.log(pass ? `PASS ${name}` : `FAIL ${name}`, found);
}

await runCase(
  "incomplete-default-selects-a",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=records`,
  async (page) =>
    page.evaluate(() => {
      const records = document.querySelector('[data-demo-ux="daily-records"]');
      const person = document.querySelector('[data-demo-ux="daily-record-input-person"]');
      const draft = document.querySelector('[data-demo-ux="daily-record-input-draft"]');
      const selected = document.querySelector(
        '[data-demo-ux-incomplete-id="incomplete-a"][data-demo-ux-incomplete-selected="true"]',
      );
      const mutations = [
        ...document.querySelectorAll('[data-demo-ux="daily-record-mutation-button"]'),
      ];
      const recent = document.querySelectorAll('[data-demo-ux="daily-record-recent-item"]');
      const headings = [...document.querySelectorAll("h2")].map(
        (el) => el.textContent?.trim() ?? "",
      );
      const text = document.body?.textContent ?? "";
      return {
        pass:
          Boolean(records) &&
          records?.getAttribute("data-demo-ux-9-slice") === "DEMO-UX-9" &&
          records?.getAttribute("data-demo-ux-incomplete-selected") === "incomplete-a" &&
          Boolean(selected) &&
          person?.value === "Aさん" &&
          (draft?.value ?? "").includes("Aさん") &&
          (draft?.value ?? "").includes("未保存") &&
          !draft?.disabled &&
          mutations.length === 2 &&
          mutations.every((button) => button.disabled) &&
          recent.length === 3 &&
          headings.indexOf("未完了確認") < headings.indexOf("記録入力イメージ") &&
          headings.indexOf("記録入力イメージ") < headings.indexOf("最近の記録") &&
          text.indexOf("実保存なし") >= 0 &&
          text.indexOf("閲覧サンプル") >= 0,
        person: person?.value ?? "",
        draftPrefix: (draft?.value ?? "").slice(0, 40),
        recent: recent.length,
      };
    }),
);

await runCase(
  "select-b-follows-input-image",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=records`,
  async (page) => {
    await page.click('[data-demo-ux-incomplete-id="incomplete-b"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-demo-ux="daily-records"]')
          ?.getAttribute("data-demo-ux-incomplete-selected") === "incomplete-b",
    );
    return page.evaluate(() => {
      const person = document.querySelector('[data-demo-ux="daily-record-input-person"]');
      const draft = document.querySelector('[data-demo-ux="daily-record-input-draft"]');
      const selectedB = document.querySelector(
        '[data-demo-ux-incomplete-id="incomplete-b"][aria-selected="true"]',
      );
      return {
        pass:
          person?.value === "Bさん" &&
          (draft?.value ?? "").includes("Bさん") &&
          (draft?.value ?? "").includes("要確認") &&
          Boolean(selectedB),
        person: person?.value ?? "",
        draftPrefix: (draft?.value ?? "").slice(0, 40),
      };
    });
  },
);

await runCase(
  "local-edit-then-discard-on-leave",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=records`,
  async (page) => {
    const marker = "SMOKE_LOCAL_DRAFT_MARKER_NOT_PERSISTED";
    await page.focus('[data-demo-ux="daily-record-input-draft"]');
    await page.evaluate(() => {
      const draft = document.querySelector('[data-demo-ux="daily-record-input-draft"]');
      if (!(draft instanceof HTMLTextAreaElement)) {
        throw new Error("draft missing");
      }
      draft.select();
    });
    await page.keyboard.type(marker, { delay: 0 });
    const beforeLeave = await page.evaluate(() => {
      const draft = document.querySelector('[data-demo-ux="daily-record-input-draft"]');
      return draft instanceof HTMLTextAreaElement ? draft.value : "";
    });
    await page.click('[data-shell-ux-nav="overview"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-dashboard-ux="overview-dashboard"]')),
    );
    await page.click('[data-shell-ux-nav="records"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="daily-records"]')),
    );
    return page.evaluate(
      (editedBefore, markerText) => {
        const draft = document.querySelector('[data-demo-ux="daily-record-input-draft"]');
        const value = draft instanceof HTMLTextAreaElement ? draft.value : "";
        return {
          pass:
            editedBefore.includes(markerText) &&
            !value.includes(markerText) &&
            value.includes("Aさん") &&
            value.includes("未保存"),
          editedBefore: editedBefore.slice(0, 48),
          afterReturn: value.slice(0, 48),
        };
      },
      beforeLeave,
      marker,
    );
  },
);

await runCase(
  "preserve-today-action-a",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=overview`,
  async (page) => {
    await page.click('[data-demo-ux-today-action="action-a"]');
    await page.waitForFunction(() =>
      Boolean(document.querySelector('[data-demo-ux="daily-records"]')),
    );
    return page.evaluate(() => {
      const records = document.querySelector('[data-demo-ux="daily-records"]');
      const incomplete = document.querySelector('[data-demo-ux="daily-record-incomplete-list"]');
      return {
        pass: Boolean(records) && Boolean(incomplete),
      };
    });
  },
);

await runCase(
  "preserve-users-filter-counts",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users`,
  async (page) => {
    await page.click('[data-demo-ux-filter="未記録"]');
    await page.waitForFunction(
      () =>
        document
          .querySelector('[data-demo-ux="users-list"]')
          ?.getAttribute("data-demo-ux-filter-count") === "2",
    );
    return page.evaluate(() => {
      const list = document.querySelector('[data-demo-ux="users-list"]');
      const rows = document.querySelectorAll('[data-demo-ux="users-row"]');
      return {
        pass:
          list?.getAttribute("data-demo-ux-8-slice") === "DEMO-UX-8" &&
          list?.getAttribute("data-demo-ux-filter-chip") === "未記録" &&
          rows.length === 2,
        count: rows.length,
      };
    });
  },
);

await runCase(
  "preserve-access-denied",
  `${base}/index.html?viewMode=access_denied&siteSelection=SITE-ISG&saveState=save_failed`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      return {
        pass:
          text.indexOf("アクセス不可") >= 0 &&
          !document.querySelector('[data-demo-ux="daily-records"]'),
      };
    }),
);

await runCase(
  "preserve-unselected-stop",
  `${base}/index.html?viewMode=ready&siteSelection=unselected&destination=records`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      return {
        pass:
          text.indexOf("事業所が未選択です") >= 0 &&
          !document.querySelector('[data-demo-ux="daily-records"]') &&
          !document.querySelector('[data-shell-ux="ready-region"]'),
      };
    }),
);

await runCase(
  "preserve-save-outcome-unknown",
  `${base}/index.html?viewMode=ready&siteSelection=SITE-ISG&saveState=save_outcome_unknown`,
  async (page) =>
    page.evaluate(() => {
      const text = document.body?.textContent ?? "";
      return {
        pass:
          text.indexOf("保存結果不明") >= 0 &&
          text.indexOf("成功・失敗のいずれにも丸めません") >= 0,
      };
    }),
);

const report = {
  allPass,
  cases: checks,
  slice: "DEMO-UX-9",
};
fs.writeFileSync(path.join(artifactsDir, "smoke-report.json"), JSON.stringify(report, null, 2));
fs.writeFileSync(path.join(outDir, "smoke-report.json"), JSON.stringify(report, null, 2));

await browser.close();
server.close();

if (!allPass) {
  console.error("DEMO-UX-9 browser smoke FAILED");
  process.exit(1);
}
console.log("DEMO-UX-9 browser smoke PASS", `${checks.length} / ${checks.length}`);
