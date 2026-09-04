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
      if (path.isAbsolute(spec) && fs.existsSync(spec)) {
        return pathToFileURL(spec).href;
      }
    }
  }
  throw new Error("puppeteer-core not found");
}

const productHeadResponse = await fetch("http://127.0.0.1:4194/product-head.txt");
const productHead = productHeadResponse.ok ? (await productHeadResponse.text()).trim() : "";
const expectedProductHead = process.env.SBS_MGMT_LOOP_B_EXPECTED_PRODUCT_HEAD ?? null;
const productBasisValid =
  /^[0-9a-f]{40}$/.test(productHead) &&
  (expectedProductHead === null || productHead === expectedProductHead);

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
    const overlay = document.querySelector(
      '[data-sbs-mgmt-plan-activation-c-staff-overlay="true"]',
    );
    const reviewReadback = document.querySelector("[data-review-outcome-readback='true']");
    return {
      query: query?.getAttribute("data-sbs-mgmt-plan-activation-c-query") ?? null,
      ready: Boolean(ready),
      overlaySticky: overlay instanceof HTMLElement && overlay.style.position === "sticky",
      reviewReadback: reviewReadback?.textContent?.trim() ?? "",
      draftPresent: Boolean(draft),
      applyPresent: apply instanceof HTMLButtonElement && !apply.disabled,
      applyText: apply?.textContent?.trim() ?? "",
      title: document.title,
    };
  });
}

async function collectAfterApply(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-demo-ux="support-plan"]');
    const headerVersion = document.querySelector('[data-planning-pc="version"]');
    const planSection = document.querySelector('[data-process-visibility-ui-v1="plan"]');
    const versionButtons = [
      ...document.querySelectorAll('[data-planning-pc-version]'),
    ];
    const currentButtons = versionButtons.filter(
      (entry) => entry.getAttribute("data-planning-pc-version-current") === "true",
    );
    const firstVersion = versionButtons[0] ?? null;
    const active = document.querySelector(
      '[data-sbs-mgmt-plan-activation-c-active-version="true"]',
    );
    const history = document.querySelector('[data-sbs-mgmt-plan-activation-c-history="true"]');
    return {
      rootCurrentVersion: root?.getAttribute("data-planning-pc-current-version") ?? null,
      headerVersion: headerVersion?.textContent?.trim() ?? "",
      planSectionText: planSection?.textContent?.trim() ?? "",
      activeText: active?.textContent?.trim() ?? "",
      historyText: history?.textContent?.trim() ?? "",
      currentVersionCount: currentButtons.length,
      firstVersion: firstVersion?.getAttribute("data-planning-pc-version") ?? null,
      firstVersionIsCurrent:
        firstVersion?.getAttribute("data-planning-pc-version-current") === "true",
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

await page.click('[data-sbs-mgmt-plan-activation-c-action="apply"]');
await page.waitForSelector('[data-sbs-mgmt-plan-activation-c="applied"]');
const afterApply = await collectAfterApply(page);
await page.screenshot({
  path: path.join(artifactsDir, "staff-arrival-after-apply-1280.png"),
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

const afterApplyConsistent =
  afterApply.rootCurrentVersion === "4" &&
  afterApply.headerVersion.includes("版 4") &&
  afterApply.planSectionText.includes("版 4") &&
  afterApply.activeText.includes("現在適用中: 版 4") &&
  afterApply.historyText.includes("過去版: 版 3") &&
  afterApply.currentVersionCount === 1 &&
  afterApply.firstVersion === "4" &&
  afterApply.firstVersionIsCurrent;

const pass =
  productBasisValid &&
  beforeApply.query === "beforeApply" &&
  beforeApply.ready &&
  beforeApply.overlaySticky &&
  beforeApply.reviewReadback.includes("変更が必要") &&
  beforeApply.title.includes("適用待機") &&
  beforeApply.draftPresent &&
  beforeApply.applyPresent &&
  beforeApply.applyText.includes("版 4") &&
  beforeApply.applyText.includes("を適用開始する") &&
  afterApplyConsistent &&
  coldList.applyPresent === false &&
  coldPlan.applyPresent === false &&
  coldPlan.draftPresent === false;

const report = {
  pass,
  productBasis: {
    observedHead: productHead || null,
    expectedHead: expectedProductHead,
    valid: productBasisValid,
  },
  beforeApply,
  afterApply: {
    ...afterApply,
    consistent: afterApplyConsistent,
  },
  coldList,
  coldPlan,
};
console.log(JSON.stringify(report, null, 2));
if (!pass) {
  process.exit(1);
}
