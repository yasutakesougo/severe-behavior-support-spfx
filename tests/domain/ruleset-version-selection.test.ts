import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { selectRuleSetVersion, toAsiaTokyoCalendarDay } from "../../src/domain";

describe("selectRuleSetVersion domain unit", () => {
  it("reuses shared Asia/Tokyo calendar helper for asOf and bounds", () => {
    const asOf = "2026-08-05T16:00:00.000Z";
    assert.equal(toAsiaTokyoCalendarDay(asOf), "2026-08-06");

    const result = selectRuleSetVersion(
      [
        {
          ruleSetVersion: "synthetic-ruleset-unit",
          effectiveFrom: "2026-08-05T16:00:00.000Z",
          effectiveTo: "2026-08-05T16:00:00.000Z",
        },
      ],
      asOf,
    );

    assert.deepEqual(result, {
      ok: true,
      decision: "SELECTED",
      ruleSetVersion: "synthetic-ruleset-unit",
    });
  });

  it("does not read now, SharePoint, or use version/array-order tie-break", () => {
    const sourcePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../src/domain/ruleset-version.ts",
    );
    const source = readFileSync(sourcePath, "utf8");
    const marker = "export function selectRuleSetVersion(";
    const start = source.indexOf(marker);
    assert.ok(start >= 0, "function declaration must be present");
    const afterStart = source.slice(start);
    const nextExport = afterStart.indexOf("\nexport ", marker.length);
    const fnBody = nextExport === -1 ? afterStart : afterStart.slice(0, nextExport);

    assert.equal(fnBody.includes("Date.now"), false);
    assert.equal(/\bnew Date\(\s*\)/.test(fnBody), false);
    assert.equal(/\bSharePoint\b/.test(fnBody), false);
    assert.equal(/\.sort\(/.test(fnBody), false);
    assert.equal(/\blocalCompare\b/.test(fnBody), false);
    assert.equal(/semver/i.test(fnBody), false);
    assert.equal(fnBody.includes("toAsiaTokyoCalendarDay"), true);
    assert.equal(fnBody.includes("CONFLICT"), true);
    assert.equal(fnBody.includes("NONE"), true);
  });
});
