import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decodePhysicalRow,
  decodeReasonCodes,
  encodePhysicalRow,
  encodeReasonCodes,
  encodeRequiredText,
  encodeSupersedesSnapshotId,
} from "../../../../src/adapters/sharepoint/assessment-snapshot/conversion.js";
import { FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS } from "../../../../src/adapters/sharepoint/assessment-snapshot/derived-envelope.js";
import { ASSESSMENT_SNAPSHOT_PHYSICAL_COLUMNS } from "../../../../src/adapters/sharepoint/assessment-snapshot/physical-columns.js";
import { validSnapshot } from "./fixtures.js";

describe("AssessmentSnapshot conversion MAP-AS-001..008 + 010", () => {
  it("MAP-AS-001/005/008: non-empty exact pass-through; no trim-to-accept", () => {
    const encoded = encodePhysicalRow(
      validSnapshot({
        snapshotId: "  keep-spaces  ",
        ruleSetVersion: "  ver  ",
        inputFingerprint: "fp-exact",
      }),
    );
    assert.equal(encoded.ok, true);
    if (!encoded.ok) return;
    assert.equal(encoded.row.snapshotId, "  keep-spaces  ");
    assert.equal(encoded.row.ruleSetVersion, "  ver  ");
    assert.equal(encoded.row.inputFingerprint, "fp-exact");
  });

  it("MAP-AS-001/005/008: whitespace-only / null / missing / type mismatch fail; no trim", () => {
    assert.equal(encodeRequiredText("   ").ok, false);
    assert.equal(encodeRequiredText("").ok, false);
    assert.equal(encodeRequiredText(null).ok, false);
    assert.equal(encodeRequiredText(undefined).ok, false);
    assert.equal(encodeRequiredText(1).ok, false);

    assert.equal(encodePhysicalRow(validSnapshot({ snapshotId: "   " })).ok, false);
    assert.equal(encodePhysicalRow(validSnapshot({ ruleSetVersion: "\t" })).ok, false);
    assert.equal(
      encodePhysicalRow(validSnapshot({ inputFingerprint: null as unknown as string })).ok,
      false,
    );

    const decodedBlank = decodePhysicalRow({
      snapshotId: "  ",
      recordStatus: "draft",
      result: "NO_FINDINGS",
      reasonCodes: "[]",
      ruleSetVersion: "v1",
      periodStart: "2026-03-01",
      periodEnd: "2026-03-15",
      inputFingerprint: "fp1",
    });
    assert.equal(decodedBlank.ok, false);

    const decodedMissing = decodePhysicalRow({
      snapshotId: "s1",
      recordStatus: "draft",
      result: "NO_FINDINGS",
      reasonCodes: "[]",
      ruleSetVersion: "v1",
      periodStart: "2026-03-01",
      periodEnd: "2026-03-15",
      inputFingerprint: undefined as unknown as string,
    });
    assert.equal(decodedMissing.ok, false);
  });

  it("MAP-AS-002/003: accepted Choice values only; unknown fails; labels not keys", () => {
    const ok = encodePhysicalRow(
      validSnapshot({
        recordStatus: "finalized",
        result: "FINDINGS_PRESENT",
      }),
    );
    assert.equal(ok.ok, true);
    if (!ok.ok) return;
    assert.equal(ok.row.recordStatus, "finalized");
    assert.equal(ok.row.result, "FINDINGS_PRESENT");

    assert.equal(encodePhysicalRow(validSnapshot({ recordStatus: "Draft" as "draft" })).ok, false);
    assert.equal(
      encodePhysicalRow(validSnapshot({ result: "No Findings" as "NO_FINDINGS" })).ok,
      false,
    );
    assert.equal(
      encodePhysicalRow(validSnapshot({ result: "INDETERMINATE" as "NO_FINDINGS" })).ok,
      false,
    );

    const decodedLabel = decodePhysicalRow({
      snapshotId: "s1",
      recordStatus: "下書き",
      result: "NO_FINDINGS",
      reasonCodes: "[]",
      ruleSetVersion: "v1",
      periodStart: "2026-03-01",
      periodEnd: "2026-03-15",
      inputFingerprint: "fp1",
    });
    assert.equal(decodedLabel.ok, false);
  });

  it("MAP-AS-004: compact JSON string[]; order preserved; duplicates/malformed fail; no CSV", () => {
    const encoded = encodeReasonCodes(["RC_Z", "RC_A", "RC_M"]);
    assert.equal(encoded.ok, true);
    if (!encoded.ok) return;
    assert.equal(encoded.value, '["RC_Z","RC_A","RC_M"]');

    assert.equal(encodeReasonCodes(["RC_A", "RC_A"]).ok, false);
    assert.equal(encodeReasonCodes(["", "RC_A"]).ok, false);
    assert.equal(encodeReasonCodes("RC_A,RC_B").ok, false);
    assert.equal(encodeReasonCodes(["not-a-reason"]).ok, false);

    const decoded = decodeReasonCodes('["RC_Z","RC_A","RC_M"]');
    assert.equal(decoded.ok, true);
    if (!decoded.ok) return;
    assert.deepEqual(decoded.value, ["RC_Z", "RC_A", "RC_M"]);

    assert.equal(decodeReasonCodes("RC_A,RC_B").ok, false);
    assert.equal(decodeReasonCodes('["RC_A","RC_A"]').ok, false);
    assert.equal(decodeReasonCodes('{"a":1}').ok, false);
    assert.equal(decodeReasonCodes('["RC_A",1]').ok, false);
  });

  it("MAP-AS-006/007: YYYY-MM-DD preserved; impossible date fails; no TZ rewrite", () => {
    const encoded = encodePhysicalRow(
      validSnapshot({ periodStart: "2026-02-28", periodEnd: "2026-02-28" }),
    );
    assert.equal(encoded.ok, true);
    if (!encoded.ok) return;
    assert.equal(encoded.row.periodStart, "2026-02-28");
    assert.equal(encoded.row.periodEnd, "2026-02-28");

    assert.equal(encodePhysicalRow(validSnapshot({ periodStart: "2026-02-29" })).ok, false);
    assert.equal(encodePhysicalRow(validSnapshot({ periodEnd: "2026-03-15T00:00:00Z" })).ok, false);
    assert.equal(encodePhysicalRow(validSnapshot({ periodStart: "03/15/2026" })).ok, false);

    const wireMidnight = decodePhysicalRow({
      snapshotId: "s1",
      recordStatus: "draft",
      result: "NO_FINDINGS",
      reasonCodes: "[]",
      ruleSetVersion: "v1",
      periodStart: "2026-03-15T00:00:00Z",
      periodEnd: "2026-03-15T00:00:00.000Z",
      inputFingerprint: "fp1",
    });
    assert.equal(wireMidnight.ok, true);
    if (!wireMidnight.ok) return;
    assert.equal(wireMidnight.snapshot.periodStart, "2026-03-15");
    assert.equal(wireMidnight.snapshot.periodEnd, "2026-03-15");
  });

  it("MAP-AS-010: omit / exact string; empty / whitespace / logical null fail", () => {
    const omit = encodeSupersedesSnapshotId(undefined);
    assert.equal(omit.ok, true);
    if (!omit.ok) return;
    assert.equal(omit.value, undefined);

    const exact = encodeSupersedesSnapshotId("  keep  ");
    assert.equal(exact.ok, true);
    if (!exact.ok) return;
    assert.equal(exact.value, "  keep  ");

    assert.equal(encodeSupersedesSnapshotId("").ok, false);
    assert.equal(encodeSupersedesSnapshotId("   ").ok, false);
    assert.equal(encodeSupersedesSnapshotId(null as unknown as string).ok, false);

    const decodedAbsent = decodePhysicalRow({
      snapshotId: "s1",
      recordStatus: "finalized",
      result: "NO_FINDINGS",
      reasonCodes: "[]",
      ruleSetVersion: "v1",
      periodStart: "2026-03-01",
      periodEnd: "2026-03-15",
      inputFingerprint: "fp1",
      supersedesSnapshotId: null,
    });
    assert.equal(decodedAbsent.ok, true);
    if (!decodedAbsent.ok) return;
    assert.equal(decodedAbsent.snapshot.supersedesSnapshotId, undefined);

    assert.equal(
      decodePhysicalRow({
        snapshotId: "s1",
        recordStatus: "finalized",
        result: "NO_FINDINGS",
        reasonCodes: "[]",
        ruleSetVersion: "v1",
        periodStart: "2026-03-01",
        periodEnd: "2026-03-15",
        inputFingerprint: "fp1",
        supersedesSnapshotId: "",
      }).ok,
      false,
    );
    assert.equal(
      decodePhysicalRow({
        snapshotId: "s1",
        recordStatus: "finalized",
        result: "NO_FINDINGS",
        reasonCodes: "[]",
        ruleSetVersion: "v1",
        periodStart: "2026-03-01",
        periodEnd: "2026-03-15",
        inputFingerprint: "fp1",
        supersedesSnapshotId: "   ",
      }).ok,
      false,
    );
  });

  it("MAP-AS-009: no persistence mapping for findingIds", () => {
    const names = ASSESSMENT_SNAPSHOT_PHYSICAL_COLUMNS as readonly string[];
    assert.ok(!names.includes("findingIds"));
    assert.ok((FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS as readonly string[]).includes("findingIds"));

    const withFindings = encodePhysicalRow(validSnapshot({ findingIds: ["finding-a"] }));
    assert.equal(withFindings.ok, true);
    if (!withFindings.ok) return;
    assert.equal(Object.prototype.hasOwnProperty.call(withFindings.row, "findingIds"), false);
  });

  it("ENV-001..003: derived only; not emitted as SharePoint item fields", () => {
    const encoded = encodePhysicalRow(validSnapshot());
    assert.equal(encoded.ok, true);
    if (!encoded.ok) return;
    const keys = Object.keys(encoded.row);
    for (const forbidden of FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS) {
      assert.ok(!keys.includes(forbidden), `must not emit ${forbidden}`);
    }
  });
});
