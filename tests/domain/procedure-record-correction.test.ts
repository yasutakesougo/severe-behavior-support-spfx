import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createHash } from "node:crypto";
import type { LocalDate } from "../../src/contracts/types";
import {
  assembleProcedureRecordCorrection,
  freezeProcedureRecordCorrectionPayload,
  mintProcedureRecordCorrectionIdentity,
  orderProcedureRecordCorrections,
  PROCEDURE_RECORD_CORRECTION_ID_NAMESPACE,
  PROCEDURE_RECORD_CORRECTION_IDEMPOTENCY_NAMESPACE,
  PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR,
  PROCEDURE_RECORD_CORRECTION_LIVE_WRITE_AUTHORIZED,
  projectLatestCorrectionFacts,
  rejectForbiddenCorrectionClientFields,
  validateProcedureRecordCorrection,
  type FieldStaffCorrectionAuthContext,
  type ProcedureRecordCorrection,
  type ProcedureRecordCorrectionOriginalBinding,
} from "../../src/domain/procedure-record-correction";
import {
  classifyProcedureRecordCorrectionLookups,
  createInMemoryProcedureRecordCorrectionPersistencePort,
  createLiveWriteHoldProcedureRecordCorrectionStoragePort,
  persistProcedureRecordCorrection,
  type ProcedureRecordCorrectionPersistencePort,
} from "../../src/domain/procedure-record-correction-persistence";
import {
  SYNTHETIC_PLAN_ID,
  SYNTHETIC_PLAN_ORG_ID,
  SYNTHETIC_PLAN_SITE_ID,
  SYNTHETIC_PLAN_USER_ID,
} from "./support-plan-fixtures";
import {
  SYNTHETIC_PROCEDURE_P2_ID,
  SYNTHETIC_PROCEDURE_P2_VERSION,
  SYNTHETIC_PROCEDURE_RECORD_ID,
  SYNTHETIC_PROCEDURE_RECORDED_BY,
} from "./procedure-record-fixtures";

const NOW_ISO = "2026-08-20T10:00:00+09:00";
const PERFORMED_AT = "2026-08-12T14:05:00+09:00";
const ORIGINAL_RECORDED_AT = "2026-08-12T15:32:00+09:00";

const AUTHORIZED: FieldStaffCorrectionAuthContext = {
  status: "AUTHORIZED",
  correctedBy: "field-staff-actor-001",
};

const ORIGINAL_BINDING: ProcedureRecordCorrectionOriginalBinding = {
  originalRecordId: SYNTHETIC_PROCEDURE_RECORD_ID,
  OrganizationId: SYNTHETIC_PLAN_ORG_ID,
  SiteId: SYNTHETIC_PLAN_SITE_ID,
  UserId: SYNTHETIC_PLAN_USER_ID,
  Procedure: {
    ProcedureId: SYNTHETIC_PROCEDURE_P2_ID,
    ProcedureVersion: SYNTHETIC_PROCEDURE_P2_VERSION,
    ApprovalState: "APPROVED",
  },
  planId: SYNTHETIC_PLAN_ID,
  planVersion: 2,
  originalRecordedAt: ORIGINAL_RECORDED_AT,
  originalRecordedBy: SYNTHETIC_PROCEDURE_RECORDED_BY,
  originalLocalDate: "2026-08-12" as LocalDate,
};

function validClient(
  overrides?: Partial<{
    originalRecordId: string;
    result: unknown;
    performedAt: string;
    reason: string;
  }>,
) {
  return {
    originalRecordId: SYNTHETIC_PROCEDURE_RECORD_ID,
    result: "PERFORMED_WITH_ADAPTATION" as const,
    performedAt: PERFORMED_AT,
    reason: "記録時刻の訂正が必要だったため",
    ...overrides,
  };
}

function assembleValid(overrides?: {
  client?: Partial<ReturnType<typeof validClient>>;
  auth?: FieldStaffCorrectionAuthContext;
  correctedAtIso?: string;
}) {
  return assembleProcedureRecordCorrection({
    client: validClient(overrides?.client),
    originalBinding: ORIGINAL_BINDING,
    auth: overrides?.auth ?? AUTHORIZED,
    correctedAtIso: overrides?.correctedAtIso,
    nowIso: NOW_ISO,
  });
}

describe("ProcedureRecordCorrection domain contract", () => {
  it("assembles a valid correction with result and performedAt", () => {
    const assembled = assembleValid();
    assert.equal(assembled.ok, true);
    if (!assembled.ok) {
      return;
    }
    assert.equal(assembled.correction.originalRecordId, SYNTHETIC_PROCEDURE_RECORD_ID);
    assert.equal(assembled.correction.result, "PERFORMED_WITH_ADAPTATION");
    assert.equal(assembled.correction.performedAt, PERFORMED_AT);
    assert.equal(assembled.correction.reason, "記録時刻の訂正が必要だったため");
    assert.equal(assembled.correction.correctedAt, NOW_ISO);
    assert.equal(assembled.correction.correctedBy, "field-staff-actor-001");
    assert.equal(validateProcedureRecordCorrection(assembled.correction), true);
  });

  it("rejects missing or blank reason", () => {
    assert.equal(assembleValid({ client: { reason: "" } }).ok, false);
    assert.equal(assembleValid({ client: { reason: "   " } }).ok, false);
  });

  it("rejects a client originalRecordId that does not match the authoritative binding", () => {
    const assembled = assembleValid({ client: { originalRecordId: "other-original-record" } });
    assert.equal(assembled.ok, false);
  });

  it("rejects forbidden client fields for original binding and derived/system values", () => {
    assert.equal(
      rejectForbiddenCorrectionClientFields({
        ...validClient(),
        correctedBy: "attacker",
      }).ok,
      false,
    );
    assert.equal(
      rejectForbiddenCorrectionClientFields({
        ...validClient(),
        correctedAt: NOW_ISO,
      }).ok,
      false,
    );
    assert.equal(
      rejectForbiddenCorrectionClientFields({
        ...validClient(),
        OrganizationId: "other-org",
      }).ok,
      false,
    );
    assert.equal(
      rejectForbiddenCorrectionClientFields({
        ...validClient(),
        originalLocalDate: "2026-08-12",
      }).ok,
      false,
    );
    assert.equal(
      rejectForbiddenCorrectionClientFields({
        ...validClient(),
        LocalDate: "2026-08-12",
      }).ok,
      false,
    );
  });

  it("rejects unavailable authentication or FIELD_STAFF authorization fail-closed", () => {
    assert.equal(assembleValid({ auth: { status: "NOT_AUTHENTICATED" } }).ok, false);
    assert.equal(assembleValid({ auth: { status: "NOT_AUTHORIZED" } }).ok, false);
    assert.equal(assembleValid({ auth: { status: "INDETERMINATE" } }).ok, false);
  });

  it("mints deterministic CorrectionId and separate IdempotencyKey with versioned namespaces", () => {
    const assembled = assembleValid({ correctedAtIso: NOW_ISO });
    assert.equal(assembled.ok, true);
    if (!assembled.ok) {
      return;
    }

    const frozen = freezeProcedureRecordCorrectionPayload({
      result: assembled.correction.result,
      performedAt: assembled.correction.performedAt,
      reason: assembled.correction.reason,
      correctedAt: assembled.correction.correctedAt,
      correctedBy: assembled.correction.correctedBy,
    });
    assert.ok(frozen.includes(PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR));

    const framed = [SYNTHETIC_PROCEDURE_RECORD_ID, frozen].join(
      PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR,
    );
    const expectedCorrectionId = createHash("sha256")
      .update(
        `${PROCEDURE_RECORD_CORRECTION_ID_NAMESPACE}${PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR}${framed}`,
      )
      .digest("hex");
    const expectedIdempotencyKey = createHash("sha256")
      .update(
        `${PROCEDURE_RECORD_CORRECTION_IDEMPOTENCY_NAMESPACE}${PROCEDURE_RECORD_CORRECTION_IDENTITY_SEPARATOR}${framed}`,
      )
      .digest("hex");

    assert.equal(assembled.correction.CorrectionId, expectedCorrectionId);
    assert.equal(assembled.correction.IdempotencyKey, expectedIdempotencyKey);
    assert.notEqual(assembled.correction.CorrectionId, assembled.correction.IdempotencyKey);

    const minted = mintProcedureRecordCorrectionIdentity(SYNTHETIC_PROCEDURE_RECORD_ID, frozen);
    assert.equal(minted.CorrectionId, assembled.correction.CorrectionId);
    assert.equal(minted.IdempotencyKey, assembled.correction.IdempotencyKey);
  });

  it("reuses both identities for the same frozen payload retry", () => {
    const first = assembleValid({ correctedAtIso: NOW_ISO });
    const second = assembleValid({ correctedAtIso: NOW_ISO });
    assert.equal(first.ok && second.ok, true);
    if (!first.ok || !second.ok) {
      return;
    }
    assert.equal(first.correction.CorrectionId, second.correction.CorrectionId);
    assert.equal(first.correction.IdempotencyKey, second.correction.IdempotencyKey);
  });

  it("does not reuse prior submit identity when the frozen payload changes", () => {
    const first = assembleValid({
      correctedAtIso: NOW_ISO,
      client: { reason: "理由A" },
    });
    const second = assembleValid({
      correctedAtIso: NOW_ISO,
      client: { reason: "理由B" },
    });
    assert.equal(first.ok && second.ok, true);
    if (!first.ok || !second.ok) {
      return;
    }
    assert.notEqual(first.correction.CorrectionId, second.correction.CorrectionId);
    assert.notEqual(first.correction.IdempotencyKey, second.correction.IdempotencyKey);
  });

  it("keeps liveWriteAuthorized false", () => {
    assert.equal(PROCEDURE_RECORD_CORRECTION_LIVE_WRITE_AUTHORIZED, false);
  });

  it("accepts same Asia/Tokyo calendar day with a different clock time", () => {
    const assembled = assembleValid({
      client: { performedAt: "2026-08-12T23:50:00+09:00" },
    });
    assert.equal(assembled.ok, true);
    if (!assembled.ok) {
      return;
    }
    assert.equal(assembled.correction.performedAt, "2026-08-12T23:50:00+09:00");
    assert.equal(assembled.correction.originalLocalDate, "2026-08-12");
  });

  it("rejects performedAt on a different Asia/Tokyo calendar day", () => {
    const assembled = assembleValid({
      client: { performedAt: "2026-08-20T00:10:00+09:00" },
    });
    assert.equal(assembled.ok, false);
  });
});

describe("ProcedureRecordCorrection fake persistence port", () => {
  it("submits append-only and returns saved after read-back", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const result = await port.submitCorrection(
      {
        client: validClient(),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: NOW_ISO,
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    assert.equal(result.saveState, "saved");
    assert.ok(result.correction);
    assert.equal(port.liveWriteAuthorized, false);
    assert.equal(port.storage.appendCalls, 1);

    const history = await port.listCorrections(SYNTHETIC_PROCEDURE_RECORD_ID);
    assert.equal(history.corrections.length, 1);
    assert.equal(history.corrections[0]?.CorrectionId, result.correction?.CorrectionId);
  });

  it("replays duplicate/idempotent submit without a second append", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const request = {
      client: validClient(),
      originalBinding: ORIGINAL_BINDING,
      correctedAtIso: NOW_ISO,
      nowIso: NOW_ISO,
    };
    const first = await port.submitCorrection(request, AUTHORIZED);
    const second = await port.submitCorrection(request, AUTHORIZED);
    assert.equal(first.saveState, "saved");
    assert.equal(second.saveState, "saved");
    assert.equal(first.correction?.CorrectionId, second.correction?.CorrectionId);
    assert.equal(port.storage.appendCalls, 1);
  });

  it("maps definite append failure to save_failed", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort({
      appendMode: "definite_failure",
    });
    const result = await port.submitCorrection(
      {
        client: validClient(),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: NOW_ISO,
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    assert.equal(result.saveState, "save_failed");
    assert.equal(port.storage.appendCalls, 1);
  });

  it("maps indeterminate append without committed row to save_outcome_unknown and does not mint a new identity", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort({
      appendMode: "indeterminate",
    });
    const request = {
      client: validClient(),
      originalBinding: ORIGINAL_BINDING,
      correctedAtIso: NOW_ISO,
      nowIso: NOW_ISO,
    };
    const first = await port.submitCorrection(request, AUTHORIZED);
    assert.equal(first.saveState, "save_outcome_unknown");
    assert.equal(port.storage.appendCalls, 1);
    assert.equal(port.storage.byCorrectionId.size, 0);

    const second = await port.submitCorrection(request, AUTHORIZED);
    assert.equal(second.saveState, "save_outcome_unknown");
    assert.equal(second.correction?.CorrectionId, first.correction?.CorrectionId);
    assert.equal(second.correction?.IdempotencyKey, first.correction?.IdempotencyKey);
    assert.equal(port.storage.appendCalls, 2);
  });

  it("reconciles indeterminate append when the row is already present without creating a new identity", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const request = {
      client: validClient(),
      originalBinding: ORIGINAL_BINDING,
      correctedAtIso: NOW_ISO,
      nowIso: NOW_ISO,
    };
    const saved = await port.submitCorrection(request, AUTHORIZED);
    assert.equal(saved.saveState, "saved");
    assert.ok(saved.correction);

    port.storage.appendMode = "indeterminate";
    const unknownThenReplay = await persistProcedureRecordCorrection(
      saved.correction,
      port.storage,
    );
    assert.equal(unknownThenReplay, "saved");
    assert.equal(port.storage.byCorrectionId.size, 1);
  });

  it("preserves append-only multiple-correction history with stable same-timestamp ordering", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const first = await port.submitCorrection(
      {
        client: validClient({ reason: "first-correction" }),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: NOW_ISO,
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    const second = await port.submitCorrection(
      {
        client: validClient({
          reason: "second-correction",
          result: "NOT_PERFORMED",
        }),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: NOW_ISO,
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    assert.equal(first.saveState, "saved");
    assert.equal(second.saveState, "saved");
    assert.notEqual(first.correction?.CorrectionId, second.correction?.CorrectionId);

    const history = await port.listCorrections(SYNTHETIC_PROCEDURE_RECORD_ID);
    assert.equal(history.corrections.length, 2);
    const ordered = orderProcedureRecordCorrections(history.corrections);
    assert.deepEqual(
      ordered.map((item) => item.CorrectionId),
      [...ordered]
        .sort((a, b) => {
          if (a.correctedAt !== b.correctedAt) {
            return a.correctedAt < b.correctedAt ? -1 : 1;
          }
          return a.CorrectionId < b.CorrectionId ? -1 : 1;
        })
        .map((item) => item.CorrectionId),
    );

    const latest = projectLatestCorrectionFacts(history.corrections);
    assert.equal(latest?.CorrectionId, ordered[ordered.length - 1]?.CorrectionId);
  });

  it("orders mixed-offset correctedAt values by instant", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const earlierInstant = await port.submitCorrection(
      {
        client: validClient({ reason: "earlier-instant" }),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: "2026-08-20T10:30:00+01:00",
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    const laterInstant = await port.submitCorrection(
      {
        client: validClient({ reason: "later-instant", result: "NOT_PERFORMED" }),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: "2026-08-20T10:00:00Z",
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    assert.equal(earlierInstant.saveState, "saved");
    assert.equal(laterInstant.saveState, "saved");

    const history = await port.listCorrections(SYNTHETIC_PROCEDURE_RECORD_ID);
    assert.deepEqual(
      history.corrections.map((item) => item.reason),
      ["earlier-instant", "later-instant"],
    );
    assert.equal(projectLatestCorrectionFacts(history.corrections)?.reason, "later-instant");
  });

  it("exposes only append submit and history read — no update/delete/lifecycle methods", () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const keys = Object.keys(port).filter((key) => key !== "storage");
    assert.deepEqual(keys.sort(), ["listCorrections", "liveWriteAuthorized", "submitCorrection"]);

    const storageRecord = port.storage as unknown as Record<string, unknown>;
    const storageKeys = Object.getOwnPropertyNames(port.storage).filter(
      (key) =>
        typeof storageRecord[key] === "function" ||
        key === "byCorrectionId" ||
        key === "byIdempotencyKey" ||
        key === "appendCalls" ||
        key === "appendMode",
    );
    assert.ok(storageKeys.includes("append"));
    assert.ok(storageKeys.includes("findByCorrectionId"));
    assert.ok(storageKeys.includes("findByIdempotencyKey"));
    assert.ok(storageKeys.includes("listByOriginalRecordId"));
    assert.equal(storageKeys.includes("update"), false);
    assert.equal(storageKeys.includes("delete"), false);
    assert.equal(storageKeys.includes("createLifecycleEvent"), false);
  });

  it("keeps save_failed and save_outcome_unknown distinguishable on the hold port", async () => {
    const hold = createLiveWriteHoldProcedureRecordCorrectionStoragePort();
    const assembled = assembleValid({ correctedAtIso: NOW_ISO });
    assert.equal(assembled.ok, true);
    if (!assembled.ok) {
      return;
    }
    assert.equal(await persistProcedureRecordCorrection(assembled.correction, hold), "save_failed");

    const unavailable = classifyProcedureRecordCorrectionLookups(
      assembled.correction,
      { status: "UNKNOWN", reason: "INDETERMINATE" },
      { status: "UNKNOWN", reason: "INDETERMINATE" },
    );
    assert.equal(unavailable.kind, "LOOKUP_UNAVAILABLE");
  });

  it("fails closed when submit auth is unavailable without calling append", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const result = await port.submitCorrection(
      {
        client: validClient(),
        originalBinding: ORIGINAL_BINDING,
        nowIso: NOW_ISO,
      },
      { status: "NOT_AUTHORIZED" },
    );
    assert.equal(result.saveState, "save_failed");
    assert.equal(result.appendCalled, false);
    assert.equal(port.storage.appendCalls, 0);
  });

  it("does not mutate an original ProcedureRecord shape via the correction port", async () => {
    const port: ProcedureRecordCorrectionPersistencePort =
      createInMemoryProcedureRecordCorrectionPersistencePort();
    await port.submitCorrection(
      {
        client: validClient(),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: NOW_ISO,
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    assert.equal(
      "update" in port || "delete" in port || "replace" in port || "cancel" in port,
      false,
    );
  });

  it("does not append a cross-date performedAt and does not rewrite originalLocalDate", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const originalLocalDate = ORIGINAL_BINDING.originalLocalDate;
    const result = await port.submitCorrection(
      {
        client: validClient({ performedAt: "2026-08-20T00:10:00+09:00" }),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: NOW_ISO,
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    assert.equal(result.saveState, "save_failed");
    assert.equal(result.appendCalled, false);
    assert.equal(port.storage.appendCalls, 0);
    assert.equal(ORIGINAL_BINDING.originalLocalDate, originalLocalDate);
    const history = await port.listCorrections(SYNTHETIC_PROCEDURE_RECORD_ID);
    assert.equal(history.corrections.length, 0);
  });

  it("isolates listed entities from the internal store", async () => {
    const port = createInMemoryProcedureRecordCorrectionPersistencePort();
    const saved = await port.submitCorrection(
      {
        client: validClient(),
        originalBinding: ORIGINAL_BINDING,
        correctedAtIso: NOW_ISO,
        nowIso: NOW_ISO,
      },
      AUTHORIZED,
    );
    assert.equal(saved.saveState, "saved");
    const history = await port.listCorrections(SYNTHETIC_PROCEDURE_RECORD_ID);
    const listed = history.corrections[0] as {
      reason: string;
      Procedure: { ProcedureId: string };
    };
    listed.reason = "mutated-from-list";
    listed.Procedure.ProcedureId = "mutated-procedure";
    (history.corrections as ProcedureRecordCorrection[]).push(
      history.corrections[0] as ProcedureRecordCorrection,
    );

    const after = await port.listCorrections(SYNTHETIC_PROCEDURE_RECORD_ID);
    assert.equal(after.corrections.length, 1);
    assert.equal(after.corrections[0]?.reason, "記録時刻の訂正が必要だったため");
    assert.equal(after.corrections[0]?.Procedure.ProcedureId, SYNTHETIC_PROCEDURE_P2_ID);

    const lookup = await port.storage.findByCorrectionId(saved.correction?.CorrectionId ?? "");
    assert.equal(lookup.status, "FOUND");
    if (lookup.status === "FOUND") {
      assert.equal(lookup.value.reason, "記録時刻の訂正が必要だったため");
    }
  });
});

describe("ProcedureRecordCorrection validation edge cases", () => {
  it("rejects CorrectionId equal to IdempotencyKey", () => {
    const assembled = assembleValid({ correctedAtIso: NOW_ISO });
    assert.equal(assembled.ok, true);
    if (!assembled.ok) {
      return;
    }
    const broken: ProcedureRecordCorrection = {
      ...assembled.correction,
      IdempotencyKey: assembled.correction.CorrectionId,
    };
    assert.equal(validateProcedureRecordCorrection(broken), false);
  });
});
