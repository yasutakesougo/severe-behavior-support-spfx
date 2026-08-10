import { isNonEmptyString, isRecord, isValidIsoDateTime } from "./validation";

/**
 * Minimal traceability reference between a support record identity and the
 * SupportPlanVersion it was recorded against.
 *
 * This contract does not define the support record body, workflow state,
 * statutory-record equivalence, or any SharePoint representation.
 */
export type SupportRecordTraceRef = Readonly<{
  RecordId: string;
  planId: string;
  planVersion: number;
  recordedAt: string;
  recordedBy: string;
}>;

export function validateSupportRecordTraceRef(value: unknown): value is SupportRecordTraceRef {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isNonEmptyString(value.RecordId) &&
    isNonEmptyString(value.planId) &&
    typeof value.planVersion === "number" &&
    Number.isInteger(value.planVersion) &&
    value.planVersion >= 1 &&
    isValidIsoDateTime(value.recordedAt) &&
    isNonEmptyString(value.recordedBy)
  );
}
