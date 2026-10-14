#!/usr/bin/env node
/**
 * Technical observation for Human PL-HTA Re-Run checklist.
 * Observation only. Does not establish PL-HTA PASS.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const puppeteer = (await import("/tmp/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js"))
  .default;
const artifactsDir =
  process.env.SBS_PL_HTA_RERUN_ARTIFACTS_DIR ??
  "/opt/cursor/artifacts/sbs-planner-pl-hta-rerun-human";
fs.mkdirSync(artifactsDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.SBS_PL_HTA_RERUN_CHROME_PATH ?? "/usr/bin/google-chrome-stable",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1280,900"],
});

async function observe(statePath, label) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  const url = `http://127.0.0.1:4217/${statePath}`;
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector('[data-pl-hta-rerun-harness="true"]', { timeout: 15000 });
  const observed = await page.evaluate(() => {
    const q = (sel) => document.querySelector(sel);
    const text = document.body?.innerText ?? "";
    const monitoring = q('[data-monitoring-role="summary"]');
    const human = q("#human-review-materials");
    const dMonitor = q('[data-role-task-product-body="D-MONITOR"]');
    const notPerformed = [...document.querySelectorAll('[data-human-review-result="NOT_PERFORMED"]')].map(
      (el) => el.closest("[data-human-review-record-id]")?.getAttribute("data-human-review-record-id"),
    );
    return {
      hasDMonitorBody: Boolean(dMonitor),
      hasOverviewDashboard: Boolean(q('[data-dashboard-ux="overview-dashboard"]')),
      destinationAttr:
        q('[data-role-task-destination]')?.getAttribute("data-role-task-destination") ?? "",
      personVisible: text.includes("Aさん"),
      userIdVisible: text.includes("user-a"),
      planIdVisible: text.includes("synthetic-plan-001"),
      orgVisible: text.includes("synthetic-org-001"),
      siteVisible: text.includes("SITE-ISG"),
      periodVisible: text.includes("2026/08/01") || text.includes("2026-08-01"),
      periodEndVisible: text.includes("2026/08/31") || text.includes("2026-08-31"),
      reviewAuthority: monitoring?.getAttribute("data-monitoring-review-authority") ?? "",
      humanReviewStatus: human?.getAttribute("data-human-review-status") ?? "",
      planVersion: monitoring?.getAttribute("data-monitoring-plan-version") ?? "",
      recordCount: monitoring?.getAttribute("data-monitoring-record-count") ?? "",
      hasZeroCopy: Boolean(q('[data-monitoring-empty-notice="true"]')) || text.includes("この期間・計画版に一致する実施記録はありません"),
      hasZeroNotNotPerformed: Boolean(q('[data-monitoring-zero-not-not-performed="true"]')),
      hasNotPerformedResult: Boolean(q('[data-human-review-result="NOT_PERFORMED"]')),
      notPerformedRecordIds: notPerformed,
      hasV2_003: Boolean(q('[data-human-review-record-id="synthetic-monitoring-v2-003"]')),
      has実施できなかった: text.includes("実施できなかった"),
      blankRoot: (document.getElementById("root")?.childElementCount ?? 0) === 0,
      bodySnippet: text.slice(0, 1200),
    };
  });
  const shot = path.join(artifactsDir, `${label}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  await page.close();
  return { url, pageErrors, observed, screenshot: shot };
}

const stateA = await observe("state-a", "state-a");
const stateB = await observe("state-b", "state-b");

const stateAPass =
  stateA.pageErrors.length === 0 &&
  stateA.observed.hasDMonitorBody &&
  !stateA.observed.hasOverviewDashboard &&
  stateA.observed.personVisible &&
  stateA.observed.userIdVisible &&
  stateA.observed.planIdVisible &&
  stateA.observed.orgVisible &&
  stateA.observed.siteVisible &&
  stateA.observed.periodVisible &&
  stateA.observed.periodEndVisible &&
  stateA.observed.reviewAuthority === "FOUND" &&
  stateA.observed.humanReviewStatus === "RESOLVED" &&
  stateA.observed.planVersion === "1" &&
  stateA.observed.recordCount === "0" &&
  stateA.observed.hasZeroCopy &&
  stateA.observed.hasZeroNotNotPerformed &&
  !stateA.observed.hasNotPerformedResult &&
  !stateA.observed.blankRoot;

const stateBPass =
  stateB.pageErrors.length === 0 &&
  stateB.observed.hasDMonitorBody &&
  !stateB.observed.hasOverviewDashboard &&
  stateB.observed.personVisible &&
  stateB.observed.userIdVisible &&
  stateB.observed.planIdVisible &&
  stateB.observed.orgVisible &&
  stateB.observed.siteVisible &&
  stateB.observed.periodVisible &&
  stateB.observed.periodEndVisible &&
  stateB.observed.reviewAuthority === "FOUND" &&
  stateB.observed.humanReviewStatus === "RESOLVED" &&
  stateB.observed.planVersion === "2" &&
  stateB.observed.recordCount === "3" &&
  stateB.observed.hasV2_003 &&
  stateB.observed.hasNotPerformedResult &&
  stateB.observed.notPerformedRecordIds.includes("synthetic-monitoring-v2-003") &&
  stateB.observed.has実施できなかった &&
  !stateB.observed.hasZeroCopy &&
  !stateB.observed.blankRoot;

const report = {
  boundHead: "4647223e82d175e35748a5107bef6e322f316935",
  note: "Technical observation only. HARNESS READY / this report ≠ PL-HTA PASS. Reviewer remains HUMAN.",
  stateA: { ...stateA, technicalPass: stateAPass },
  stateB: { ...stateB, technicalPass: stateBPass },
  bothTechnicalPass: stateAPass && stateBPass,
};

fs.writeFileSync(path.join(artifactsDir, "observation.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(stateAPass && stateBPass ? 0 : 1);
