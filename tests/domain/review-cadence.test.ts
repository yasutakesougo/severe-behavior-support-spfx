import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

describe("Review cadence domain unit (GOV-RULE-06)", () => {
  it("does not embed duration_days or 90-day cadence semantics", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/review-cadence.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function validateReviewCadence(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "review cadence validator must be present");
    const afterStart = source.slice(start);

    assert.equal(afterStart.includes("duration_days"), false);
    assert.equal(/\b90\b/.test(afterStart), false);
    assert.equal(afterStart.includes("reviewDueDate"), false);
    assert.equal(afterStart.includes("evaluateReviewDueRelativeToAsOf"), false);
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

    assert.equal(fnBody.includes("ReviewCadence"), false);
    assert.equal(fnBody.includes("validateReviewCadence"), false);
    assert.equal(fnBody.includes('return "BEFORE_DUE"'), true);
    assert.equal(fnBody.includes('return "DUE"'), true);
    assert.equal(fnBody.includes('return "OVERDUE"'), true);
    assert.equal(fnBody.includes('return "MALFORMED_INPUT"'), true);
  });
});
