import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

describe("Retention complete-deletion prohibition domain unit (GOV-AUD-05 / DEC-012)", () => {
  it("does not implement purge/cleanup jobs or post-retention authorization", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/retention-complete-deletion-prohibition.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function validateRetentionCompleteDeletionProhibitionPolicy(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "retention prohibition validator must be present");
    const afterStart = source.slice(start);

    assert.equal(afterStart.includes("purge"), false);
    assert.equal(afterStart.includes("cleanupJob"), false);
    assert.equal(afterStart.includes("SharePoint"), false);
    assert.equal(afterStart.includes("deleteItem"), false);
    assert.equal(afterStart.includes("authorizeDeletion"), false);
  });

  it("does not wire SupportPlan, FindingCode, or review-due engines", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/retention-complete-deletion-prohibition.ts",
    );
    const source = readFileSync(sourcePath, "utf8");

    assert.equal(source.includes("SupportPlan"), false);
    assert.equal(source.includes("FindingCode"), false);
    assert.equal(source.includes("evaluateReviewDueRelativeToAsOf"), false);
    assert.equal(source.includes("validateReviewMonitoringGuidancePolicy"), false);
    assert.equal(source.includes("validateReviewNoticePolicy"), false);
  });

  it("leaves review-monitoring-guidance implementation unchanged", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-monitoring-guidance.ts",
    );
    const source = readFileSync(sourcePath, "utf8");

    assert.equal(source.includes("RetentionCompleteDeletionProhibitionPolicy"), false);
    assert.equal(source.includes("validateRetentionCompleteDeletionProhibitionPolicy"), false);
    assert.equal(source.includes('kind: "informational_cadence_guide"'), true);
    assert.equal(source.includes('guideText: "3か月に1回程度"'), true);
  });
});
