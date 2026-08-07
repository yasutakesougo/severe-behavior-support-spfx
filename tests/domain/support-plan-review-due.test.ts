import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import {
  evaluateReviewDueRelativeToAsOf,
  toAsiaTokyoCalendarDay,
} from "../../src/domain";

describe("evaluateReviewDueRelativeToAsOf domain unit", () => {
  it("reuses shared Asia/Tokyo calendar helper for due and asOf", () => {
    const due = "2026-08-05T16:00:00.000Z";
    const asOf = "2026-08-05T16:00:00.000Z";

    assert.equal(toAsiaTokyoCalendarDay(due), "2026-08-06");
    assert.equal(evaluateReviewDueRelativeToAsOf(due, asOf), "DUE");
  });

  it("does not read now, embed approaching-day constants, or calculate due dates", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/support-plan.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function evaluateReviewDueRelativeToAsOf(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "function declaration must be present");
    const afterStart = source.slice(start);
    const nextExport = afterStart.indexOf("\nexport ", marker.length);
    const fnBody =
      nextExport === -1 ? afterStart : afterStart.slice(0, nextExport);

    assert.equal(fnBody.includes("Date.now"), false);
    assert.equal(/\bnew Date\(\s*\)/.test(fnBody), false);
    assert.equal(/\bAPPROACHING\b/.test(fnBody), false);
    assert.equal(/\bOBSERVATION_DAYS\b/.test(fnBody), false);
    assert.equal(/\bINSTITUTIONAL\b/.test(fnBody), false);
    assert.equal(fnBody.includes("toAsiaTokyoCalendarDay"), true);
    assert.equal(fnBody.includes("return \"OVERDUE\""), true);
  });
});
