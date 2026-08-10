import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSyntheticAssessmentSnapshotRepository } from "../../../../src/adapters/sharepoint/assessment-snapshot/synthetic-repository.js";
import { SyntheticAssessmentSnapshotListStore } from "../../../../src/adapters/sharepoint/assessment-snapshot/synthetic-list-store.js";
import { SPFX_SPHTTPCLIENT_HOST_SEAM } from "../../../../src/adapters/sharepoint/assessment-snapshot/transport-seam.js";
import {
  ASSESSMENT_SNAPSHOT_DTO_VERSION,
  ASSESSMENT_SNAPSHOT_SCHEMA_ID,
  ASSESSMENT_SNAPSHOT_SCHEMA_VERSION,
} from "../../../../src/adapters/sharepoint/assessment-snapshot/physical-columns.js";
import { getAssessmentSnapshotDerivedEnvelope } from "../../../../src/adapters/sharepoint/assessment-snapshot/derived-envelope.js";
import { validFinalizedSnapshot, validSnapshot } from "./fixtures.js";

describe("AssessmentSnapshot synthetic repository — FR-1 / UP-1 / MAP-AS-010", () => {
  it("draft create succeeds; lookup round-trips physical fields", async () => {
    const store = new SyntheticAssessmentSnapshotListStore();
    const repo = createSyntheticAssessmentSnapshotRepository(store);
    const result = await repo.save({
      snapshot: validSnapshot(),
      intent: "draft",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.equal(result.kind, "SAVED");
    assert.equal(typeof result.listItemId, "number");

    const looked = await repo.findBySnapshotId("snap-001");
    assert.equal(looked.kind, "FOUND");
    if (looked.kind !== "FOUND") return;
    assert.equal(looked.snapshot.snapshotId, "snap-001");
    assert.equal(looked.snapshot.recordStatus, "draft");
    assert.deepEqual(looked.snapshot.reasonCodes, ["RC_ALPHA", "RC_BETA"]);
    assert.equal(looked.snapshot.findingIds, undefined);
  });

  it("ENV-001..003 derived constants available; never on prepared REST fields", async () => {
    const store = new SyntheticAssessmentSnapshotListStore();
    const repo = createSyntheticAssessmentSnapshotRepository(store);
    await repo.save({ snapshot: validSnapshot(), intent: "draft" });
    assert.deepEqual(getAssessmentSnapshotDerivedEnvelope(), {
      schemaId: ASSESSMENT_SNAPSHOT_SCHEMA_ID,
      schemaVersion: ASSESSMENT_SNAPSHOT_SCHEMA_VERSION,
      dtoVersion: ASSESSMENT_SNAPSHOT_DTO_VERSION,
    });
    assert.ok(repo.lastPreparedFields);
    assert.equal("schemaId" in repo.lastPreparedFields, false);
    assert.equal("schemaVersion" in repo.lastPreparedFields, false);
    assert.equal("dtoVersion" in repo.lastPreparedFields, false);
    assert.equal("findingIds" in repo.lastPreparedFields, false);
  });

  it("MAP-AS-010 create omit vs exact supersedes; update clear vs omit", async () => {
    const store = new SyntheticAssessmentSnapshotListStore();
    const repo = createSyntheticAssessmentSnapshotRepository(store);

    const created = await repo.save({
      snapshot: validSnapshot({ snapshotId: "s-omit" }),
      intent: "draft",
    });
    assert.equal(created.ok, true);
    assert.ok(repo.lastPreparedFields);
    assert.equal("supersedesSnapshotId" in repo.lastPreparedFields, false);

    const withSup = await repo.save({
      snapshot: validFinalizedSnapshot({
        snapshotId: "s-sup",
        supersedesSnapshotId: "  prior  ",
      }),
      intent: "finalize",
    });
    assert.equal(withSup.ok, true);
    assert.ok(repo.lastPreparedFields);
    assert.equal(repo.lastPreparedFields.supersedesSnapshotId, "  prior  ");

    // Seed a draft row that already has supersedes physically, then clear via logical absence.
    store.insert({
      snapshotId: "s-clear",
      recordStatus: "draft",
      result: "NO_FINDINGS",
      reasonCodes: "[]",
      ruleSetVersion: "ruleset-1.0.0",
      periodStart: "2026-03-01",
      periodEnd: "2026-03-15",
      inputFingerprint: "fp-clear",
      supersedesSnapshotId: "old-link",
    });
    const cleared = await repo.save({
      snapshot: validSnapshot({
        snapshotId: "s-clear",
        inputFingerprint: "fp-clear",
      }),
      intent: "draft",
    });
    assert.equal(cleared.ok, true);
    assert.ok(repo.lastPreparedFields);
    assert.equal(repo.lastPreparedFields.supersedesSnapshotId, null);
    const afterClear = store.findBySnapshotId("s-clear");
    assert.equal(afterClear.kind, "row");
    if (afterClear.kind !== "row") return;
    assert.equal(
      Object.prototype.hasOwnProperty.call(afterClear.row, "supersedesSnapshotId"),
      false,
    );

    // Update omit: prior absent + logical absent → key absent on body; store unchanged.
    const omitSave = await repo.save({
      snapshot: validSnapshot({
        snapshotId: "s-clear",
        inputFingerprint: "fp-clear-2",
      }),
      intent: "draft",
    });
    assert.equal(omitSave.ok, true);
    assert.ok(repo.lastPreparedFields);
    assert.equal("supersedesSnapshotId" in repo.lastPreparedFields, false);
  });

  it("MAP-AS-010 empty/whitespace supersedes fail-closed with no store mutation", async () => {
    const store = new SyntheticAssessmentSnapshotListStore();
    const repo = createSyntheticAssessmentSnapshotRepository(store);
    const before = store.snapshotRows().length;

    const empty = await repo.save({
      snapshot: validFinalizedSnapshot({
        snapshotId: "bad-empty",
        supersedesSnapshotId: "",
      }),
      intent: "finalize",
    });
    assert.equal(empty.ok, false);
    if (empty.ok) return;
    assert.equal(empty.code, "VALIDATION_FAILED");
    assert.equal(store.snapshotRows().length, before);
    assert.equal(repo.lastPreparedFields, null);

    const ws = await repo.save({
      snapshot: validFinalizedSnapshot({
        snapshotId: "bad-ws",
        supersedesSnapshotId: "  ",
      }),
      intent: "finalize",
    });
    assert.equal(ws.ok, false);
    if (ws.ok) return;
    assert.equal(ws.code, "VALIDATION_FAILED");
    assert.equal(store.snapshotRows().length, before);
  });

  it("FR-1: VALIDATION_FAILED / MALFORMED_INTENT / OVERWRITE_FORBIDDEN", async () => {
    const store = new SyntheticAssessmentSnapshotListStore();
    const repo = createSyntheticAssessmentSnapshotRepository(store);

    const invalid = await repo.save({
      snapshot: validSnapshot({ snapshotId: "" }),
      intent: "draft",
    });
    assert.equal(invalid.ok, false);
    if (invalid.ok) return;
    assert.equal(invalid.code, "VALIDATION_FAILED");

    const badIntent = await repo.save({
      snapshot: validSnapshot({ snapshotId: "x1" }),
      intent: "unknown" as "draft",
    });
    assert.equal(badIntent.ok, false);
    if (badIntent.ok) return;
    assert.equal(badIntent.code, "MALFORMED_INTENT");

    const first = await repo.save({
      snapshot: validFinalizedSnapshot({ snapshotId: "locked-1" }),
      intent: "finalize",
    });
    assert.equal(first.ok, true);

    const overwrite = await repo.save({
      snapshot: validFinalizedSnapshot({
        snapshotId: "locked-1",
        inputFingerprint: "fp-other",
      }),
      intent: "finalize",
    });
    assert.equal(overwrite.ok, false);
    if (overwrite.ok) return;
    assert.equal(overwrite.code, "OVERWRITE_FORBIDDEN");
  });

  it("FR-1 / UP-1: persistence unavailable is distinguishable; never success", async () => {
    const store = new SyntheticAssessmentSnapshotListStore();
    store.setMode("transport_error");
    const repo = createSyntheticAssessmentSnapshotRepository(store);
    const result = await repo.save({
      snapshot: validSnapshot({ snapshotId: "unavail-1" }),
      intent: "draft",
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.code, "PERSISTENCE_UNAVAILABLE");

    store.setMode("forbidden");
    const forbidden = await repo.save({
      snapshot: validSnapshot({ snapshotId: "forbid-1" }),
      intent: "draft",
    });
    assert.equal(forbidden.ok, false);
    if (forbidden.ok) return;
    assert.equal(forbidden.code, "PERSISTENCE_UNAVAILABLE");
  });

  it("synthetic-only: host seam unbound; no live SPHttpClient", () => {
    assert.equal(SPFX_SPHTTPCLIENT_HOST_SEAM.bindWhenAvailable, false);
    assert.equal(SPFX_SPHTTPCLIENT_HOST_SEAM.kind, "spfx-sphttpclient-when-available");
  });

  it("correct-as-new-version creates new item; does not mutate prior final", async () => {
    const store = new SyntheticAssessmentSnapshotListStore();
    const repo = createSyntheticAssessmentSnapshotRepository(store);
    const prior = await repo.save({
      snapshot: validFinalizedSnapshot({ snapshotId: "v1" }),
      intent: "finalize",
    });
    assert.equal(prior.ok, true);

    const next = await repo.save({
      snapshot: validFinalizedSnapshot({
        snapshotId: "v2",
        supersedesSnapshotId: "v1",
      }),
      intent: "correct-as-new-version",
    });
    assert.equal(next.ok, true);
    if (!next.ok) return;
    assert.equal(next.kind, "SAVED");
    const v1 = store.findBySnapshotId("v1");
    assert.equal(v1.kind, "row");
    if (v1.kind !== "row") return;
    assert.equal(v1.row.recordStatus, "finalized");
    const v2 = store.findBySnapshotId("v2");
    assert.equal(v2.kind, "row");
    if (v2.kind !== "row") return;
    assert.equal(v2.row.supersedesSnapshotId, "v1");
  });

  it("conversion/transport failure MUST NOT return success", async () => {
    const store = new SyntheticAssessmentSnapshotListStore();
    const repo = createSyntheticAssessmentSnapshotRepository(store);
    const badChoice = await repo.save({
      snapshot: validSnapshot({
        recordStatus: "Draft" as "draft",
      }),
      intent: "draft",
    });
    assert.equal(badChoice.ok, false);
    if (badChoice.ok) return;
    assert.equal(badChoice.code, "VALIDATION_FAILED");
    assert.equal(store.snapshotRows().length, 0);
  });
});
