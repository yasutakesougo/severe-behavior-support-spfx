import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { evaluateObservationPeriodMembership, toAsiaTokyoCalendarDay } from "../../src/domain";

describe("evaluateObservationPeriodMembership domain unit", () => {
  it("reuses shared Asia/Tokyo calendar helper for membership bounds", () => {
    const from = "2026-08-05T16:00:00.000Z";
    const to = "2026-08-20T00:00:00.000Z";
    const asOf = "2026-08-05T16:00:00.000Z";

    assert.equal(toAsiaTokyoCalendarDay(from), "2026-08-06");
    assert.equal(evaluateObservationPeriodMembership(from, to, asOf), "IN_PERIOD");
  });

  it("does not read now or embed institutional observation-day constants", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/support-plan.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function evaluateObservationPeriodMembership(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "function declaration must be present");
    const afterStart = source.slice(start);
    const nextExport = afterStart.indexOf("\nexport ", marker.length);
    const fnBody = nextExport === -1 ? afterStart : afterStart.slice(0, nextExport);

    assert.equal(fnBody.includes("Date.now"), false);
    assert.equal(/\bnew Date\(\s*\)/.test(fnBody), false);
    assert.equal(/\bOBSERVATION_DAYS\b/.test(fnBody), false);
    assert.equal(/\bINSTITUTIONAL\b/.test(fnBody), false);
    assert.equal(fnBody.includes("toAsiaTokyoCalendarDay"), true);
    assert.equal(fnBody.includes('return "OUTSIDE_PERIOD"'), true);
  });
});
