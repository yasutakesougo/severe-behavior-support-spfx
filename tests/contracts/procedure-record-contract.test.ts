import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { LookupResult } from "../../src/contracts/types";
import type { SupportPlanVersion } from "../../src/domain";
import {
  PROCEDURE_RECORD_RESULTS,
  PROCEDURE_RECORD_SCHEMA_ID,
  PROCEDURE_RECORD_SCHEMA_VERSION,
  deriveSupportRecordTraceRefFromProcedureRecord,
  planVersionForProcedureRecordProjection,
  procedureRecordFingerprintMaterial,
  procedureRecordMatchesBinding,
  projectProcedureRecordSupportContent,
  resolveHistoricalPlanVersionForProcedureRecord,
  toProcedureRecordDto,
  validateProcedureRecord,
  validateProcedureRecordDto,
} from "../../src/domain/procedure-record";
import {
  createSyntheticFw05PlanVersion2,
  createSyntheticFw05PlanVersion3,
  createSyntheticFw05V2Binding,
  createSyntheticProcedureRecord,
  createSyntheticProcedureRecordDto,
} from "../domain/procedure-record-fixtures";

describe("ProcedureRecord contract (Issue #352 / B-PKG-1)", () => {
  it("exposes DEC-1 Schema ID and Version", () => {
    assert.equal(PROCEDURE_RECORD_SCHEMA_ID, "severe-behavior-support.procedure-record.record");
    assert.equal(PROCEDURE_RECORD_SCHEMA_VERSION, "1.0.0");
  });

  it("accepts the locked minimal shape and DTO envelope", () => {
    const record = createSyntheticProcedureRecord();
    assert.equal(validateProcedureRecord(record), true);
    const dto = toProcedureRecordDto(record);
    assert.equal(dto.schemaId, PROCEDURE_RECORD_SCHEMA_ID);
    assert.equal(dto.dtoVersion, dto.schemaVersion);
    assert.equal(validateProcedureRecordDto(dto), true);
  });

  it("locks result vocabulary and rejects FAILED-style values", () => {
    assert.deepEqual(
      [...PROCEDURE_RECORD_RESULTS],
      ["PERFORMED_AS_PLANNED", "PERFORMED_WITH_ADAPTATION", "NOT_PERFORMED"],
    );
    const valid = createSyntheticProcedureRecord({ result: "PERFORMED_WITH_ADAPTATION" });
    assert.equal(validateProcedureRecord(valid), true);
    assert.equal(
      validateProcedureRecord(createSyntheticProcedureRecord({ result: "NOT_PERFORMED" })),
      true,
    );
    assert.equal(
      validateProcedureRecord({
        ...createSyntheticProcedureRecord(),
        result: "FAILED" as "PERFORMED_AS_PLANNED",
      }),
      false,
    );
  });

  it("requires dual clocks with recordedAt >= performedAt and LocalDate from performedAt Tokyo day", () => {
    const valid = createSyntheticProcedureRecord();
    assert.equal(validateProcedureRecord(valid), true);

    assert.equal(
      validateProcedureRecord({
        ...valid,
        recordedAt: "2026-08-12T14:00:00+09:00",
        performedAt: "2026-08-12T14:05:00+09:00",
      }),
      false,
    );

    assert.equal(
      validateProcedureRecord({
        ...valid,
        LocalDate: "2026-08-11" as typeof valid.LocalDate,
      }),
      false,
    );
  });

  it("reuses ApprovedProcedureReference and rejects procedure body fields as required surface", () => {
    const record = createSyntheticProcedureRecord();
    assert.deepEqual(Object.keys(record.Procedure).sort(), [
      "ApprovalState",
      "ProcedureId",
      "ProcedureVersion",
    ]);
    assert.equal(record.Procedure.ApprovalState, "APPROVED");
    assert.equal(
      validateProcedureRecord({
        ...record,
        Procedure: { ...record.Procedure, ApprovalState: "DRAFT" as "APPROVED" },
      }),
      false,
    );
  });

  it("requires PayloadFingerprint material to cover plan/procedure/result/clocks/recordedBy", () => {
    const record = createSyntheticProcedureRecord();
    assert.deepEqual(procedureRecordFingerprintMaterial(record), {
      planId: record.planId,
      planVersion: record.planVersion,
      ProcedureId: record.Procedure.ProcedureId,
      ProcedureVersion: record.Procedure.ProcedureVersion,
      result: record.result,
      performedAt: record.performedAt,
      recordedAt: record.recordedAt,
      recordedBy: record.recordedBy,
    });
    assert.equal(validateProcedureRecord({ ...record, PayloadFingerprint: "" }), false);
  });

  it("aligns with Issue A binding on org/site/user/plan/procedure values", () => {
    const record = createSyntheticProcedureRecord();
    const binding = createSyntheticFw05V2Binding();
    assert.equal(procedureRecordMatchesBinding(record, binding), true);
    assert.equal(procedureRecordMatchesBinding(record, { ...binding, planVersion: 3 }), false);
  });

  it("derives SupportRecordTraceRef without making TraceRef a second body canonical", () => {
    const record = createSyntheticProcedureRecord();
    assert.deepEqual(deriveSupportRecordTraceRefFromProcedureRecord(record), {
      RecordId: record.RecordId,
      planId: record.planId,
      planVersion: record.planVersion,
      recordedAt: record.recordedAt,
      recordedBy: record.recordedBy,
    });
  });

  it("rejects schemaId / schemaVersion / dtoVersion mismatches", () => {
    const valid = createSyntheticProcedureRecordDto();
    assert.equal(
      validateProcedureRecordDto({
        ...valid,
        schemaId: "severe-behavior-support.procedure-record.other",
      }),
      false,
    );
    assert.equal(
      validateProcedureRecordDto({
        ...valid,
        schemaVersion: "2.0.0",
        dtoVersion: "2.0.0",
      }),
      false,
    );
  });
});

describe("ProcedureRecord FW-05 historical binding (Issue #352 / B-PKG-1)", () => {
  it("FW05-HIST-01: record stays on v2/P2 after v3/P3 becomes Active; projection uses v2", () => {
    const historicalRecord = createSyntheticProcedureRecord({
      planVersion: 2,
      Procedure: {
        ProcedureId: "synthetic-procedure-p2",
        ProcedureVersion: "synthetic-procedure-p2-v1",
        ApprovalState: "APPROVED",
      },
    });
    const planV2 = createSyntheticFw05PlanVersion2();
    const planV3 = createSyntheticFw05PlanVersion3();

    assert.equal(validateProcedureRecord(historicalRecord), true);
    assert.equal(planVersionForProcedureRecordProjection(historicalRecord), 2);
    assert.equal(historicalRecord.planVersion, 2);
    assert.notEqual(planV3.version, historicalRecord.planVersion);

    const projected = projectProcedureRecordSupportContent(historicalRecord, planV2);
    assert.ok(projected);
    assert.equal(projected.planVersion, 2);
    assert.deepEqual(projected.supportMethods, planV2.supportMethods);

    assert.equal(projectProcedureRecordSupportContent(historicalRecord, planV3), null);
  });

  it("FW05-HIST-02: EMPTY/UNKNOWN/FETCH_FAILED historical lookup does not fall back to v3", () => {
    const historicalRecord = createSyntheticProcedureRecord({ planVersion: 2 });
    const planV3 = createSyntheticFw05PlanVersion3();

    const emptyLookup: LookupResult<SupportPlanVersion> = { status: "EMPTY" };
    const unknownLookup: LookupResult<SupportPlanVersion> = {
      status: "UNKNOWN",
      reason: "INDETERMINATE",
    };
    const failedLookup: LookupResult<SupportPlanVersion> = {
      status: "FETCH_FAILED",
      code: "synthetic-fetch-failed",
    };

    assert.deepEqual(
      resolveHistoricalPlanVersionForProcedureRecord(historicalRecord, emptyLookup),
      { status: "UNRESOLVED", reason: "EMPTY" },
    );
    assert.deepEqual(
      resolveHistoricalPlanVersionForProcedureRecord(historicalRecord, unknownLookup),
      { status: "UNRESOLVED", reason: "UNKNOWN" },
    );
    assert.deepEqual(
      resolveHistoricalPlanVersionForProcedureRecord(historicalRecord, failedLookup),
      { status: "UNRESOLVED", reason: "FETCH_FAILED" },
    );

    // Explicitly forbid using Active v3 as a silent substitute for unresolved historical v2.
    assert.equal(planV3.version, 3);
    assert.notEqual(planV3.version, historicalRecord.planVersion);
    assert.equal(projectProcedureRecordSupportContent(historicalRecord, planV3), null);
  });

  it("FW05-HIST-02: FOUND historical version must match record planId/planVersion", () => {
    const historicalRecord = createSyntheticProcedureRecord({ planVersion: 2 });
    const wrongVersion: LookupResult<SupportPlanVersion> = {
      status: "FOUND",
      value: createSyntheticFw05PlanVersion3(),
    };
    assert.deepEqual(
      resolveHistoricalPlanVersionForProcedureRecord(historicalRecord, wrongVersion),
      { status: "UNRESOLVED", reason: "VERSION_MISMATCH" },
    );

    const matched: LookupResult<SupportPlanVersion> = {
      status: "FOUND",
      value: createSyntheticFw05PlanVersion2(),
    };
    const resolved = resolveHistoricalPlanVersionForProcedureRecord(historicalRecord, matched);
    assert.equal(resolved.status, "RESOLVED");
    if (resolved.status === "RESOLVED") {
      assert.equal(resolved.value.version, 2);
    }
  });
});
