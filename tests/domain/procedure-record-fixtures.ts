import type { LocalDate } from "../../src/contracts/types";
import type { ProcedureRecord, ProcedureRecordDto, SupportPlanVersion } from "../../src/domain";
import { toProcedureRecordDto } from "../../src/domain/procedure-record";
import { createSyntheticSupportPlanVersionProcedureBinding } from "./support-plan-version-procedure-binding-fixtures";
import {
  SYNTHETIC_PLAN_ID,
  SYNTHETIC_PLAN_ORG_ID,
  SYNTHETIC_PLAN_SITE_ID,
  SYNTHETIC_PLAN_USER_ID,
  createSyntheticPlanVersion1,
  createSyntheticPlanVersion2,
} from "./support-plan-fixtures";

export const SYNTHETIC_PROCEDURE_RECORD_ID = "synthetic-procedure-record-001";
export const SYNTHETIC_PROCEDURE_RECORD_IDEMPOTENCY = "synthetic-procedure-idempotency-001";
export const SYNTHETIC_PROCEDURE_RECORD_FINGERPRINT = "synthetic-procedure-fingerprint-001";
export const SYNTHETIC_PROCEDURE_RECORDED_BY = "synthetic-subject-001";

/** FW05-HIST-01: historical v2 procedure identity */
export const SYNTHETIC_PROCEDURE_P2_ID = "synthetic-procedure-p2";
export const SYNTHETIC_PROCEDURE_P2_VERSION = "synthetic-procedure-p2-v1";
/** Later Active v3 procedure identity (must not rebound historical records) */
export const SYNTHETIC_PROCEDURE_P3_ID = "synthetic-procedure-p3";
export const SYNTHETIC_PROCEDURE_P3_VERSION = "synthetic-procedure-p3-v1";

export function createSyntheticProcedureRecord(
  overrides?: Partial<ProcedureRecord> & {
    Procedure?: Partial<ProcedureRecord["Procedure"]>;
  },
): ProcedureRecord {
  const { Procedure: procedureOverrides, ...rest } = overrides ?? {};
  const performedAt = "2026-08-12T14:05:00+09:00";
  return {
    OrganizationId: SYNTHETIC_PLAN_ORG_ID,
    SiteId: SYNTHETIC_PLAN_SITE_ID,
    UserId: SYNTHETIC_PLAN_USER_ID,
    TimeZone: "Asia/Tokyo",
    RecordId: SYNTHETIC_PROCEDURE_RECORD_ID,
    IdempotencyKey: SYNTHETIC_PROCEDURE_RECORD_IDEMPOTENCY,
    PayloadFingerprint: SYNTHETIC_PROCEDURE_RECORD_FINGERPRINT,
    Procedure: {
      ProcedureId: SYNTHETIC_PROCEDURE_P2_ID,
      ProcedureVersion: SYNTHETIC_PROCEDURE_P2_VERSION,
      ApprovalState: "APPROVED",
      ...procedureOverrides,
    },
    LocalDate: "2026-08-12" as LocalDate,
    planId: SYNTHETIC_PLAN_ID,
    planVersion: 2,
    result: "PERFORMED_AS_PLANNED",
    performedAt,
    recordedAt: "2026-08-12T15:32:00+09:00",
    recordedBy: SYNTHETIC_PROCEDURE_RECORDED_BY,
    ...rest,
  };
}

export function createSyntheticProcedureRecordDto(
  overrides?: Partial<ProcedureRecord> & {
    Procedure?: Partial<ProcedureRecord["Procedure"]>;
  },
): ProcedureRecordDto {
  return toProcedureRecordDto(createSyntheticProcedureRecord(overrides));
}

/** Binding aligned to FW05 historical v2 / P2 record. */
export function createSyntheticFw05V2Binding() {
  return createSyntheticSupportPlanVersionProcedureBinding({
    planId: SYNTHETIC_PLAN_ID,
    planVersion: 2,
    Procedure: {
      ProcedureId: SYNTHETIC_PROCEDURE_P2_ID,
      ProcedureVersion: SYNTHETIC_PROCEDURE_P2_VERSION,
      ApprovalState: "APPROVED",
    },
  });
}

export function createSyntheticFw05PlanVersion2(
  overrides?: Partial<SupportPlanVersion>,
): SupportPlanVersion {
  return createSyntheticPlanVersion2({
    planId: SYNTHETIC_PLAN_ID,
    version: 2,
    supportMethods: ["synthetic v2 method — photo card then wait"],
    precautions: ["synthetic v2 precaution — no sudden voice"],
    ...overrides,
  });
}

export function createSyntheticFw05PlanVersion3(
  overrides?: Partial<SupportPlanVersion>,
): SupportPlanVersion {
  return createSyntheticPlanVersion1({
    planId: SYNTHETIC_PLAN_ID,
    version: 3,
    supportMethods: ["synthetic v3 method — must not project onto v2 records"],
    precautions: ["synthetic v3 precaution — must not replace v2"],
    ...overrides,
  });
}
