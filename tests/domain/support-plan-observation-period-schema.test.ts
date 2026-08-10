import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

describe("SupportPlan observation period logical schema domain unit (Decision-OP-3)", () => {
  it("does not embed institutional day-count constants in logical schema implementation", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/support-plan.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function validateSupportPlanObservationPeriodLogical(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "logical schema validator must be present");
    const afterStart = source.slice(start);
    const nextSection = afterStart.indexOf("\n// ==========================================");
    const fnBody = nextSection === -1 ? afterStart : afterStart.slice(0, nextSection);

    assert.equal(fnBody.includes("duration_days"), false);
    assert.equal(/\b30\b/.test(fnBody), false);
    assert.equal(/\b90\b/.test(fnBody), false);
    assert.equal(fnBody.includes("3-month"), false);
    assert.equal(fnBody.includes("3 month"), false);
    assert.equal(fnBody.includes("INSTITUTIONAL"), false);
  });

  it("leaves evaluateObservationPeriodMembership implementation unchanged", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/support-plan.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function evaluateObservationPeriodMembership(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "membership function must remain present");
    const afterStart = source.slice(start);
    const nextExport = afterStart.indexOf("\nexport ", marker.length);
    const fnBody = nextExport === -1 ? afterStart : afterStart.slice(0, nextExport);

    assert.equal(fnBody.includes("observationPeriodFrom"), false);
    assert.equal(fnBody.includes("observationPeriodTo"), false);
    assert.equal(fnBody.includes("validateSupportPlanObservationPeriodLogical"), false);
    assert.equal(fnBody.includes('return "IN_PERIOD"'), true);
    assert.equal(fnBody.includes('return "OUTSIDE_PERIOD"'), true);
    assert.equal(fnBody.includes('return "MALFORMED_INPUT"'), true);
  });
});
