import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  selectRuleSetVersion,
  toAsiaTokyoCalendarDay,
} from "../../src/domain";

function candidate(
  ruleSetVersion: string,
  effectiveFrom: string,
  effectiveTo: string,
): Record<string, unknown> {
  return { ruleSetVersion, effectiveFrom, effectiveTo };
}

describe("RuleSetVersion selection contract (Issue #24)", () => {
  const asOf = "2026-06-15T00:00:00.000Z";

  it("適用対象がちょうど1件 → SELECTED（返却文字列は入力と同一）", () => {
    const version = "synthetic-ruleset-v1.0.0";
    const result = selectRuleSetVersion(
      [
        candidate(
          version,
          "2026-01-01T00:00:00.000Z",
          "2026-12-31T00:00:00.000Z",
        ),
        candidate(
          "synthetic-ruleset-v0.9.0",
          "2025-01-01T00:00:00.000Z",
          "2025-12-31T00:00:00.000Z",
        ),
      ],
      asOf,
    );

    assert.deepEqual(result, {
      ok: true,
      decision: "SELECTED",
      ruleSetVersion: version,
    });
  });

  it("適用対象0件 → NONE", () => {
    assert.deepEqual(
      selectRuleSetVersion(
        [
          candidate(
            "synthetic-ruleset-past",
            "2025-01-01T00:00:00.000Z",
            "2025-12-31T00:00:00.000Z",
          ),
        ],
        asOf,
      ),
      { ok: false, code: "NONE" },
    );

    assert.deepEqual(selectRuleSetVersion([], asOf), {
      ok: false,
      code: "NONE",
    });
  });

  it("適用対象2件以上（期間重複） → CONFLICT", () => {
    assert.deepEqual(
      selectRuleSetVersion(
        [
          candidate(
            "synthetic-ruleset-a",
            "2026-01-01T00:00:00.000Z",
            "2026-12-31T00:00:00.000Z",
          ),
          candidate(
            "synthetic-ruleset-b",
            "2026-06-01T00:00:00.000Z",
            "2026-06-30T00:00:00.000Z",
          ),
        ],
        asOf,
      ),
      { ok: false, code: "CONFLICT" },
    );
  });

  it("候補配列の順序を入れ替えても同一結果", () => {
    const left = [
      candidate(
        "synthetic-ruleset-z",
        "2026-01-01T00:00:00.000Z",
        "2026-12-31T00:00:00.000Z",
      ),
      candidate(
        "synthetic-ruleset-a",
        "2025-01-01T00:00:00.000Z",
        "2025-12-31T00:00:00.000Z",
      ),
    ];
    const right = [...left].reverse();

    assert.deepEqual(
      selectRuleSetVersion(left, asOf),
      selectRuleSetVersion(right, asOf),
    );
  });

  it("version 文字列の辞書順・見かけの新旧で SELECTED へ倒さない", () => {
    const result = selectRuleSetVersion(
      [
        candidate(
          "synthetic-ruleset-v9.9.9",
          "2026-01-01T00:00:00.000Z",
          "2026-12-31T00:00:00.000Z",
        ),
        candidate(
          "synthetic-ruleset-v1.0.0",
          "2026-06-01T00:00:00.000Z",
          "2026-06-30T00:00:00.000Z",
        ),
      ],
      asOf,
    );

    assert.deepEqual(result, { ok: false, code: "CONFLICT" });
  });

  it("asOf / effectiveFrom / effectiveTo のいずれか不正 → MALFORMED_INPUT", () => {
    const valid = [
      candidate(
        "synthetic-ruleset-v1",
        "2026-01-01T00:00:00.000Z",
        "2026-12-31T00:00:00.000Z",
      ),
    ];

    assert.deepEqual(selectRuleSetVersion(valid, "not-a-date"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(
      selectRuleSetVersion(
        [
          candidate(
            "synthetic-ruleset-v1",
            "bad-from",
            "2026-12-31T00:00:00.000Z",
          ),
        ],
        asOf,
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      selectRuleSetVersion(
        [
          candidate(
            "synthetic-ruleset-v1",
            "2026-01-01T00:00:00.000Z",
            "bad-to",
          ),
        ],
        asOf,
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("fromDay > toDay → MALFORMED_INPUT", () => {
    assert.deepEqual(
      selectRuleSetVersion(
        [
          candidate(
            "synthetic-ruleset-inverted",
            "2026-12-31T00:00:00.000Z",
            "2026-01-01T00:00:00.000Z",
          ),
        ],
        asOf,
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("candidates が配列でない / 要素欠損 → MALFORMED_INPUT", () => {
    assert.deepEqual(selectRuleSetVersion(null, asOf), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(selectRuleSetVersion({}, asOf), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(selectRuleSetVersion([42], asOf), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(
      selectRuleSetVersion(
        [{ effectiveFrom: "2026-01-01T00:00:00.000Z", effectiveTo: "2026-12-31T00:00:00.000Z" }],
        asOf,
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      selectRuleSetVersion(
        [
          {
            ruleSetVersion: "synthetic-ruleset-v1",
            effectiveFrom: "2026-01-01T00:00:00.000Z",
          },
        ],
        asOf,
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      selectRuleSetVersion(
        [{ ruleSetVersion: " ", effectiveFrom: "2026-01-01T00:00:00.000Z", effectiveTo: "2026-12-31T00:00:00.000Z" }],
        asOf,
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("同一 ruleSetVersion の重複候補 → MALFORMED_INPUT", () => {
    assert.deepEqual(
      selectRuleSetVersion(
        [
          candidate(
            "synthetic-ruleset-same",
            "2026-01-01T00:00:00.000Z",
            "2026-03-31T00:00:00.000Z",
          ),
          candidate(
            "synthetic-ruleset-same",
            "2026-04-01T00:00:00.000Z",
            "2026-12-31T00:00:00.000Z",
          ),
        ],
        asOf,
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("UTC瞬間が前日でも Asia/Tokyo 暦日へ変換する", () => {
    // 2026-06-14T16:00:00.000Z == 2026-06-15T01:00:00+09:00
    assert.equal(
      toAsiaTokyoCalendarDay("2026-06-14T16:00:00.000Z"),
      "2026-06-15",
    );

    const result = selectRuleSetVersion(
      [
        candidate(
          "synthetic-ruleset-tokyo-day",
          "2026-06-14T16:00:00.000Z",
          "2026-06-14T16:00:00.000Z",
        ),
      ],
      "2026-06-14T16:30:00.000Z",
    );

    assert.deepEqual(result, {
      ok: true,
      decision: "SELECTED",
      ruleSetVersion: "synthetic-ruleset-tokyo-day",
    });
  });

  it("不正入力を SELECTED / NONE へ倒さない（部分成功しない）", () => {
    assert.deepEqual(
      selectRuleSetVersion(
        [
          candidate(
            "synthetic-ruleset-valid",
            "2026-01-01T00:00:00.000Z",
            "2026-12-31T00:00:00.000Z",
          ),
          {
            ruleSetVersion: "synthetic-ruleset-bad",
            effectiveFrom: "not-iso",
            effectiveTo: "2026-12-31T00:00:00.000Z",
          },
        ],
        asOf,
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("暦日閉区間の両端を含む", () => {
    const bounds = [
      candidate(
        "synthetic-ruleset-bounds",
        "2026-06-01T00:00:00.000Z",
        "2026-06-30T00:00:00.000Z",
      ),
    ];

    assert.equal(
      selectRuleSetVersion(bounds, "2026-06-01T00:00:00.000Z").ok,
      true,
    );
    // 2026-06-30T14:00:00.000Z == 2026-06-30T23:00:00+09:00（終端暦日に含む）
    assert.equal(
      selectRuleSetVersion(bounds, "2026-06-30T14:00:00.000Z").ok,
      true,
    );
    assert.deepEqual(
      selectRuleSetVersion(bounds, "2026-05-31T00:00:00.000Z"),
      { ok: false, code: "NONE" },
    );
  });
});
