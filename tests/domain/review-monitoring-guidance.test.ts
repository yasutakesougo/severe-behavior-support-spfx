import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

describe("Review monitoring guidance domain unit (Decision-RD-3)", () => {
  it("does not embed day-count, 90-day, or overdue engine semantics", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-monitoring-guidance.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function validateReviewMonitoringGuidancePolicy(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "review monitoring guidance validator must be present");
    const afterStart = source.slice(start);

    assert.equal(afterStart.includes("duration_days"), false);
    assert.equal(/\b90\b/.test(afterStart), false);
    assert.equal(/\b30\b/.test(afterStart), false);
    assert.equal(afterStart.includes("reviewDueDate"), false);
    assert.equal(afterStart.includes("evaluateReviewDueRelativeToAsOf"), false);
    assert.equal(afterStart.includes("OVERDUE"), false);
    assert.equal(afterStart.includes("approachWindow"), false);
  });

  it("does not implement notification delivery, due calculation, or SupportPlan wiring", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-monitoring-guidance.ts",
    );
    const source = readFileSync(sourcePath, "utf8");

    assert.equal(source.includes("targetReviewMonth"), false);
    assert.equal(source.includes("calculateTarget"), false);
    assert.equal(source.includes("sendNotification"), false);
    assert.equal(source.includes("deliveryChannel"), false);
    assert.equal(source.includes("SharePoint"), false);
    assert.equal(source.includes("SupportPlan"), false);
    assert.equal(source.includes("validateSupportPlan"), false);
    assert.equal(source.includes("validateReviewCadence"), false);
    assert.equal(source.includes("validateReviewAnchorPolicy"), false);
    assert.equal(source.includes("validateReviewNoticePolicy"), false);
  });

  it("leaves evaluateReviewDueRelativeToAsOf implementation unchanged in support-plan.ts", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/support-plan.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function evaluateReviewDueRelativeToAsOf(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "relative due function must remain present");
    const afterStart = source.slice(start);
    const nextExport = afterStart.indexOf("\nexport ", marker.length);
    const fnBody = nextExport === -1 ? afterStart : afterStart.slice(0, nextExport);

    assert.equal(fnBody.includes("ReviewMonitoringGuidancePolicy"), false);
    assert.equal(fnBody.includes("validateReviewMonitoringGuidancePolicy"), false);
    assert.equal(fnBody.includes('return "BEFORE_DUE"'), true);
    assert.equal(fnBody.includes('return "DUE"'), true);
    assert.equal(fnBody.includes('return "OVERDUE"'), true);
    assert.equal(fnBody.includes('return "MALFORMED_INPUT"'), true);
  });

  it("leaves review-cadence implementation unchanged", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-cadence.ts",
    );
    const source = readFileSync(sourcePath, "utf8");

    assert.equal(source.includes("ReviewMonitoringGuidancePolicy"), false);
    assert.equal(source.includes("validateReviewMonitoringGuidancePolicy"), false);
    assert.equal(source.includes('unit: "month"'), true);
    assert.equal(source.includes('precision: "approximate"'), true);
  });

  it("leaves review-anchor implementation unchanged", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-anchor.ts",
    );
    const source = readFileSync(sourcePath, "utf8");

    assert.equal(source.includes("ReviewMonitoringGuidancePolicy"), false);
    assert.equal(source.includes("validateReviewMonitoringGuidancePolicy"), false);
    assert.equal(source.includes('first: "support_plan_effective_from"'), true);
    assert.equal(source.includes('subsequent: "previous_review_date"'), true);
  });

  it("leaves review-notice implementation unchanged", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-notice.ts",
    );
    const source = readFileSync(sourcePath, "utf8");

    assert.equal(source.includes("ReviewMonitoringGuidancePolicy"), false);
    assert.equal(source.includes("validateReviewMonitoringGuidancePolicy"), false);
    assert.equal(source.includes('kind: "calendar_month"'), true);
    assert.equal(source.includes('trigger: "enter_target_review_month"'), true);
  });
});
