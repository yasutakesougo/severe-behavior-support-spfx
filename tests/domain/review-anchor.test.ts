import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

describe("Review anchor domain unit (GOV-RULE-05)", () => {
  it("does not embed reviewDueDate calculation or 90-day semantics", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-anchor.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function validateReviewAnchorPolicy(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "review anchor validator must be present");
    const afterStart = source.slice(start);

    assert.equal(afterStart.includes("duration_days"), false);
    assert.equal(/\b90\b/.test(afterStart), false);
    assert.equal(afterStart.includes("reviewDueDate"), false);
    assert.equal(afterStart.includes("evaluateReviewDueRelativeToAsOf"), false);
    assert.equal(afterStart.includes("validateReviewCadence"), false);
  });

  it("does not adopt a physical previous_review_date field representation", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-anchor.ts",
    );
    const source = readFileSync(sourcePath, "utf8");

    assert.equal(source.includes("SharePoint"), false);
    assert.equal(source.includes("effectiveFrom"), false);
    assert.equal(source.includes("previousReviewDate:"), false);
    assert.equal(source.includes("previousReviewDateField"), false);
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

    assert.equal(fnBody.includes("ReviewAnchorPolicy"), false);
    assert.equal(fnBody.includes("validateReviewAnchorPolicy"), false);
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
    const marker = "export function validateReviewCadence(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "review cadence validator must remain present");
    const afterStart = source.slice(start);
    const nextExport = afterStart.indexOf("\nexport ", marker.length);
    const fnBody = nextExport === -1 ? afterStart : afterStart.slice(0, nextExport);

    assert.equal(fnBody.includes("ReviewAnchorPolicy"), false);
    assert.equal(fnBody.includes("validateReviewAnchorPolicy"), false);
    assert.equal(source.includes('unit: "month"'), true);
    assert.equal(source.includes('precision: "approximate"'), true);
  });
});
