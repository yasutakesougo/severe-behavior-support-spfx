#!/usr/bin/env node
/**
 * STAFF-ARRIVAL-1 focused verification.
 * Assumes serve-smoke is already listening on :4194.
 * No product mutation. No LIVE WRITE.
 */
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const repoRoot = path.join(path.dirname(new URL(import.meta.url).pathname), "../../..");

function resolvePuppeteer() {
  const candidates = [
    process.env.SBS_MGMT_LOOP_B_PUPPETEER_PATH,
    path.join(repoRoot, "node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"),
    path.join(repoRoot, "spfx/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"),
    "/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js",
  ].filter(Boolean);
  for (const spec of candidates) {
    try {
      return pathToFileURL(require.resolve(spec)).href;
    } catch {
      try {
        return pathToFileURL(spec).href;
      } catch {
        // continue
      }
    }
  }
  throw new Error("puppeteer-core not found");
}

const puppeteerModule = await import(resolvePuppeteer());
const puppeteer = puppeteerModule.default ?? puppeteerModule;
const artifactsDir = process.env.SBS_STAFF_ARRIVAL_ARTIFACTS_DIR ?? "/opt/cursor/artifacts";
fs.mkdirSync(artifactsDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_MGMT_LOOP_B_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu"],
});

async function collect(page) {
  return page.evaluate(() => {
    const apply = document.querySelector('[data-sbs-mgmt-plan-activation-c-action="apply"]');
    const draft = document.querySelector('[data-sbs-mgmt-loop-b-draft="true"]');
    const query = document.querySelector("[data-sbs-mgmt-plan-activation-c-query]");
    const ready = document.querySelector('[data-sbs-mgmt-plan-activation-c-staff-check="ready"]');
    return {
      query: query?.getAttribute("data-sbs-mgmt-plan-activation-c-query") ?? null,
      ready: Boolean(ready),
      draftPresent: Boolean(draft),
      applyPresent: apply instanceof HTMLButtonElement && !apply.disabled,
      applyText: apply?.textContent?.trim() ?? "",
    };
  });
}

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

await page.goto(
  "http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply",
  { waitUntil: "networkidle0" },
);
await page.waitForSelector('[data-sbs-mgmt-plan-activation-c-staff-check="ready"]', {
  timeout: 25000,
});
await page.waitForSelector('[data-sbs-mgmt-plan-activation-c-action="apply"]');
const beforeApply = await collect(page);
await page.screenshot({
  path: path.join(artifactsDir, "staff-arrival-before-apply-1280.png"),
  fullPage: true,
});

await page.goto(
  "http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER",
  { waitUntil: "networkidle0" },
);
await page.waitForSelector('[data-demo-ux="support-plan-mgmt-action"]');
const coldList = await collect(page);
await page.click(
  '[data-demo-ux="support-plan-mgmt-action"][data-support-plan-mgmt-user-id="user-a"]',
);
await page.waitForSelector('[data-demo-ux="support-plan"]');
const coldPlan = await collect(page);
await page.screenshot({
  path: path.join(artifactsDir, "staff-arrival-cold-1280.png"),
  fullPage: true,
});

await browser.close();

const pass =
  beforeApply.query === "beforeApply" &&
  beforeApply.ready &&
  beforeApply.draftPresent &&
  beforeApply.applyPresent &&
  beforeApply.applyText.includes("版 4") &&
  beforeApply.applyText.includes("を適用開始する") &&
  coldList.applyPresent === false &&
  coldPlan.applyPresent === false &&
  coldPlan.draftPresent === false;

const report = { pass, beforeApply, coldList, coldPlan };
console.log(JSON.stringify(report, null, 2));
if (!pass) {
  process.exit(1);
}
