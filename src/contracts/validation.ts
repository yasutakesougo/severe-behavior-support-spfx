import {
  ASIA_TOKYO_TIME_ZONE,
  type ApprovedProcedureReference,
  type DeploymentContext,
  type ExecutionRecord,
  type LocalDate,
  type ValidationError,
  type ValidationResult,
} from "./types";

const error = (code: ValidationError["code"], path: string): ValidationError => ({ code, path });

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const requiredString = (value: unknown, path: string): ValidationError | undefined => {
  if (value === undefined || value === null) return error("REQUIRED", path);
  if (typeof value !== "string") return error("TYPE", path);
  if (value.trim().length === 0) return error("EMPTY", path);
  return undefined;
};

const isCalendarDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
};

export const parseLocalDate = (value: unknown, path = "LocalDate"): ValidationResult<LocalDate> => {
  if (typeof value !== "string") return { ok: false, errors: [error(value == null ? "REQUIRED" : "TYPE", path)] };
  if (!isCalendarDate(value)) return { ok: false, errors: [error("FORMAT", path)] };
  return { ok: true, value: value as LocalDate };
};

export const validateDeploymentContext = (value: unknown): ValidationResult<DeploymentContext> => {
  if (!isRecord(value)) return { ok: false, errors: [error("TYPE", "DeploymentContext")] };

  const errors = [
    requiredString(value.OrganizationId, "OrganizationId"),
    requiredString(value.SiteId, "SiteId"),
    value.TimeZone === undefined
      ? error("REQUIRED", "TimeZone")
      : value.TimeZone !== ASIA_TOKYO_TIME_ZONE
        ? error("VALUE", "TimeZone")
        : undefined,
  ].filter((item): item is ValidationError => item !== undefined);

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      OrganizationId: value.OrganizationId as string,
      SiteId: value.SiteId as string,
      TimeZone: ASIA_TOKYO_TIME_ZONE,
    },
  };
};

export const validateApprovedProcedureReference = (
  value: unknown,
): ValidationResult<ApprovedProcedureReference> => {
  if (!isRecord(value)) return { ok: false, errors: [error("TYPE", "Procedure")] };

  const errors = [
    requiredString(value.ProcedureId, "Procedure.ProcedureId"),
    requiredString(value.ProcedureVersion, "Procedure.ProcedureVersion"),
    value.ApprovalState === undefined
      ? error("REQUIRED", "Procedure.ApprovalState")
      : value.ApprovalState !== "APPROVED"
        ? error("APPROVAL_STATE", "Procedure.ApprovalState")
        : undefined,
  ].filter((item): item is ValidationError => item !== undefined);

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      ProcedureId: value.ProcedureId as string,
      ProcedureVersion: value.ProcedureVersion as string,
      ApprovalState: "APPROVED",
    },
  };
};

export const validateExecutionRecord = (value: unknown): ValidationResult<ExecutionRecord> => {
  if (!isRecord(value)) return { ok: false, errors: [error("TYPE", "ExecutionRecord")] };

  const context = validateDeploymentContext({
    OrganizationId: value.OrganizationId,
    SiteId: value.SiteId,
    TimeZone: value.TimeZone,
  });
  const procedure = validateApprovedProcedureReference(value.Procedure);
  const localDate = parseLocalDate(value.LocalDate);
  const errors = [
    ...(!context.ok ? context.errors : []),
    ...(!procedure.ok ? procedure.errors : []),
    ...(!localDate.ok ? localDate.errors : []),
    requiredString(value.UserId, "UserId"),
    requiredString(value.RecordId, "RecordId"),
    requiredString(value.IdempotencyKey, "IdempotencyKey"),
    requiredString(value.PayloadFingerprint, "PayloadFingerprint"),
  ].filter((item): item is ValidationError => item !== undefined);

  if (errors.length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      OrganizationId: value.OrganizationId as string,
      SiteId: value.SiteId as string,
      UserId: value.UserId as string,
      TimeZone: ASIA_TOKYO_TIME_ZONE,
      RecordId: value.RecordId as string,
      IdempotencyKey: value.IdempotencyKey as string,
      Procedure: procedure.ok ? procedure.value : (value.Procedure as ApprovedProcedureReference),
      LocalDate: localDate.ok ? localDate.value : (value.LocalDate as LocalDate),
      PayloadFingerprint: value.PayloadFingerprint as string,
    },
  };
};
