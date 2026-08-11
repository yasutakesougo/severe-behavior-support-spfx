#!/usr/bin/env node
/**
 * C-F′ browser smoke runner (Chrome via puppeteer-core).
 * Scope: primary-nav keyboard traversal evidence only.
 * No destination routing, auth judgment, REST, binder, or live I/O.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = __dirname;
const artifactsDir =
  process.env.CF_ARTIFACTS_DIR ?? "/opt/cursor/artifacts/c-f-prime-browser-smoke";
fs.mkdirSync(artifactsDir, { recursive: true });

const esbuildModule = await import(
  process.env.CF_ESBUILD_PATH ?? "/tmp/node_modules/esbuild/lib/main.js"
);
const puppeteerModule = await import(
  process.env.CF_PUPPETEER_PATH ??
    "/tmp/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js"
);
const esbuild = esbuildModule.default ?? esbuildModule;
const puppeteer = puppeteerModule.default ?? puppeteerModule;

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
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
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

await new Promise((resolve) => server.listen(4179, "127.0.0.1", resolve));
const base = "http://127.0.0.1:4179";
const browser = await puppeteer.launch({
  executablePath: process.env.CF_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
  defaultViewport: { width: 1280, height: 900 },
});

const checks = [];

async function openPage(query) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console: ${message.text()}`);
    }
  });
  const url = `${base}/index.html?${query}`;
  await page.goto(url, { waitUntil: "networkidle0" });
  return { page, url, errors };
}

async function activeNav(page) {
  return page.evaluate(() => {
    const active = document.activeElement;
    return {
      id: active?.getAttribute("data-shell-ux-nav") ?? null,
      text: active?.textContent?.trim() ?? "",
      tag: active?.tagName ?? "",
    };
  });
}

async function pressShiftTab(page) {
  await page.keyboard.down("Shift");
  await page.keyboard.press("Tab");
  await page.keyboard.up("Shift");
}

function record(name, url, found, shot, errors) {
  const pass = Boolean(found.pass) && errors.length === 0;
  checks.push({ name, url, found, shot, errors, pass });
  return pass;
}

let allPass = true;

{
  const { page, url, errors } = await openPage(
    "viewMode=ready&siteSelection=SITE-ISG&saveState=saved",
  );
  const initial = await page.evaluate(() => {
    const nav = document.querySelector('[data-shell-ux="primary-navigation"]');
    const buttons = [...document.querySelectorAll("[data-shell-ux-nav]")];
    return {
      title: document.title,
      nav: Boolean(nav),
      labels: buttons.map((button) => button.textContent?.trim() ?? ""),
      ids: buttons.map((button) => button.getAttribute("data-shell-ux-nav")),
      disabled: buttons.map((button) =>
        button instanceof HTMLButtonElement ? button.disabled : null,
      ),
      ready: Boolean(document.querySelector('[data-shell-ux="ready-region"]')),
    };
  });

  await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("[data-shell-ux-nav]")];
    const clicks = Object.fromEntries(
      buttons.map((button) => [button.getAttribute("data-shell-ux-nav"), 0]),
    );
    for (const button of buttons) {
      const id = button.getAttribute("data-shell-ux-nav");
      button.addEventListener("click", () => {
        clicks[id] += 1;
      });
    }
    window.__cFPrimeClicks = clicks;
  });

  await page.evaluate(() => document.querySelector('[data-shell-ux-nav="overview"]')?.focus());
  const focusOrder = [await activeNav(page)];
  await page.keyboard.press("Tab");
  focusOrder.push(await activeNav(page));
  await page.keyboard.press("Tab");
  focusOrder.push(await activeNav(page));
  await pressShiftTab(page);
  focusOrder.push(await activeNav(page));
  await pressShiftTab(page);
  focusOrder.push(await activeNav(page));

  await page.evaluate(() => document.querySelector('[data-shell-ux-nav="overview"]')?.focus());
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  const activation = await page.evaluate(() => ({
    clicks: window.__cFPrimeClicks,
    href: window.location.href,
  }));
  const shot = path.join(artifactsDir, "ready-keyboard-traversal.png");
  await page.screenshot({ path: shot, fullPage: true });
  const expectedFocusOrder = ["overview", "users", "records", "users", "overview"];
  allPass =
    record(
      "ready-keyboard-traversal",
      url,
      {
        pass:
          initial.title.includes("C-F′") &&
          initial.nav &&
          initial.ready &&
          initial.labels.join("|") === "概要|利用者|記録" &&
          initial.ids.join("|") === "overview|users|records" &&
          initial.disabled.every((disabled) => disabled === false) &&
          focusOrder.map((entry) => entry.id).join("|") === expectedFocusOrder.join("|") &&
          activation.clicks.overview === 2 &&
          activation.clicks.users === 0 &&
          activation.clicks.records === 0 &&
          activation.href === url,
        initial,
        focusOrder,
        expectedFocusOrder,
        activation,
      },
      shot,
      errors,
    ) && allPass;
  await page.close();
}

for (const [name, query] of [
  ["unselected", "viewMode=ready&siteSelection=unselected"],
  ["unauthenticated", "viewMode=unauthenticated&siteSelection=SITE-ISG"],
]) {
  const { page, url, errors } = await openPage(query);
  await page.evaluate(() => {
    window.__cFPrimeBlockedClicks = 0;
    for (const button of document.querySelectorAll("[data-shell-ux-nav]")) {
      button.addEventListener("click", () => {
        window.__cFPrimeBlockedClicks += 1;
      });
    }
  });
  const blocked = await page.evaluate(() => {
    const buttons = [...document.querySelectorAll("[data-shell-ux-nav]")];
    return {
      disabled: buttons.map((button) =>
        button instanceof HTMLButtonElement ? button.disabled : null,
      ),
      ready: Boolean(document.querySelector('[data-shell-ux="ready-region"]')),
    };
  });
  for (let index = 0; index < 20; index += 1) {
    await page.keyboard.press("Tab");
  }
  blocked.activeNav = await page.evaluate(
    () => document.activeElement?.getAttribute("data-shell-ux-nav") ?? null,
  );
  blocked.noBlockedClick = await page.evaluate(() => window.__cFPrimeBlockedClicks === 0);
  const shot = path.join(artifactsDir, `${name}-blocked.png`);
  await page.screenshot({ path: shot, fullPage: true });
  allPass =
    record(
      `${name}-nav-blocked`,
      url,
      {
        pass:
          blocked.disabled.length === 3 &&
          blocked.disabled.every((disabled) => disabled === true) &&
          blocked.activeNav === null &&
          !blocked.ready &&
          blocked.noBlockedClick,
        blocked,
      },
      shot,
      errors,
    ) && allPass;
  await page.close();
}

{
  const { page, url, errors } = await openPage("viewMode=ready&siteSelection=SITE-ISG");
  await page.setViewport({ width: 768, height: 1024 });
  const tablet = await page.evaluate(() => {
    const nav = document.querySelector('[data-shell-ux="primary-navigation"]');
    const buttons = [...document.querySelectorAll("[data-shell-ux-nav]")];
    return {
      width: window.innerWidth,
      nav: Boolean(nav),
      buttonCount: buttons.length,
      allVisible: buttons.every((button) => {
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      }),
    };
  });
  const shot = path.join(artifactsDir, "tablet-keyboard-navigation.png");
  await page.screenshot({ path: shot, fullPage: true });
  allPass =
    record(
      "tablet-keyboard-navigation",
      url,
      {
        pass: tablet.width === 768 && tablet.nav && tablet.buttonCount === 3 && tablet.allVisible,
        tablet,
      },
      shot,
      errors,
    ) && allPass;
  await page.close();
}

const report = {
  unit: "C-F′",
  kind: "browser smoke / primary navigation keyboard traversal evidence",
  date: new Date().toISOString(),
  scope: {
    destinationsImplemented: false,
    liveTenantIoAuthorized: false,
    sharePointRestAuthorized: false,
    binderHostWiringAuthorized: false,
    membershipLookupAuthorized: false,
    authJudgmentAuthorized: false,
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
