/**
 * LIVE-SP-2 read-only application integration for AssessmentSnapshots.
 *
 * This facade intentionally narrows the existing transport to read-only use.
 * It performs no tenant I/O until `readBySnapshotId` is invoked; authenticated
 * live invocation remains separately Human-gated.
 */

import type {
  AssessmentSnapshotListTransport,
  AssessmentSnapshotTransportReadResult,
} from "./transport-types";

export type AssessmentSnapshotReadTransport = Pick<
  AssessmentSnapshotListTransport,
  "getBySnapshotId"
>;

export type AssessmentSnapshotReadModel = Readonly<{
  listItemId: number;
  snapshotId: string;
  recordStatus: "draft" | "finalized";
  result: "NO_FINDINGS" | "FINDINGS_PRESENT" | "NOT_APPLICABLE";
  reasonCodes: readonly string[];
  ruleSetVersion: string;
  periodStart: string;
  periodEnd: string;
  inputFingerprint: string;
  supersedesSnapshotId?: string;
}>;

export type AssessmentSnapshotRuntimeReadResult =
  | Readonly<{ status: "success"; snapshot: AssessmentSnapshotReadModel }>
  | Readonly<{ status: "not_found" }>
  | Readonly<{ status: "forbidden" }>
  | Readonly<{ status: "retrieval_failed" }>;

export interface AssessmentSnapshotReadIntegration {
  readBySnapshotId(snapshotId: string): Promise<AssessmentSnapshotRuntimeReadResult>;
}

export function createAssessmentSnapshotReadIntegration(
  transport: AssessmentSnapshotReadTransport,
): AssessmentSnapshotReadIntegration {
  return {
    async readBySnapshotId(snapshotId: string): Promise<AssessmentSnapshotRuntimeReadResult> {
      if (!isNonEmptyString(snapshotId)) {
        return { status: "retrieval_failed" };
      }

      let transportResult: AssessmentSnapshotTransportReadResult;
      try {
        transportResult = await transport.getBySnapshotId(snapshotId);
      } catch {
        return { status: "retrieval_failed" };
      }

      if (!transportResult.ok) {
        if (transportResult.failure === "NOT_FOUND") {
          return { status: "not_found" };
        }
        if (transportResult.failure === "FORBIDDEN") {
          return { status: "forbidden" };
        }
        return { status: "retrieval_failed" };
      }

      const decoded = decodeReadModel(snapshotId, transportResult);
      if (!decoded) {
        return { status: "retrieval_failed" };
      }

      return { status: "success", snapshot: decoded };
    },
  };
}

function decodeReadModel(
  requestedSnapshotId: string,
  result: Extract<AssessmentSnapshotTransportReadResult, { readonly ok: true }>,
): AssessmentSnapshotReadModel | undefined {
  if (!Number.isInteger(result.listItemId) || result.listItemId <= 0) {
    return undefined;
  }

  const fields = result.fields;
  const snapshotId = decodeRequiredText(fields.snapshotId);
  const recordStatus = decodeRecordStatus(fields.recordStatus);
  const snapshotResult = decodeResult(fields.result);
  const reasonCodes = decodeReasonCodes(fields.reasonCodes);
  const ruleSetVersion = decodeRequiredText(fields.ruleSetVersion);
  const periodStart = decodeCivilDate(fields.periodStart);
  const periodEnd = decodeCivilDate(fields.periodEnd);
  const inputFingerprint = decodeRequiredText(fields.inputFingerprint);
  const supersedesSnapshotId = decodeOptionalRequiredText(fields.supersedesSnapshotId);

  if (
    snapshotId === undefined ||
    recordStatus === undefined ||
    snapshotResult === undefined ||
    reasonCodes === undefined ||
    ruleSetVersion === undefined ||
    periodStart === undefined ||
    periodEnd === undefined ||
    inputFingerprint === undefined ||
    supersedesSnapshotId === null
  ) {
    return undefined;
  }

  if (snapshotId !== requestedSnapshotId || periodEnd < periodStart) {
    return undefined;
  }

  return {
    listItemId: result.listItemId,
    snapshotId,
    recordStatus,
    result: snapshotResult,
    reasonCodes,
    ruleSetVersion,
    periodStart,
    periodEnd,
    inputFingerprint,
    ...(supersedesSnapshotId !== undefined ? { supersedesSnapshotId } : {}),
  };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function decodeRequiredText(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value : undefined;
}

function decodeOptionalRequiredText(value: unknown): string | undefined | null {
  if (value === undefined || value === null) {
    return undefined;
  }
  return isNonEmptyString(value) ? value : null;
}

function decodeRecordStatus(value: unknown): "draft" | "finalized" | undefined {
  return value === "draft" || value === "finalized" ? value : undefined;
}

function decodeResult(
  value: unknown,
): "NO_FINDINGS" | "FINDINGS_PRESENT" | "NOT_APPLICABLE" | undefined {
  if (value === "NO_FINDINGS" || value === "FINDINGS_PRESENT" || value === "NOT_APPLICABLE") {
    return value;
  }
  return undefined;
}

function decodeReasonCodes(value: unknown): readonly string[] | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return undefined;
  }

  if (!Array.isArray(parsed)) {
    return undefined;
  }

  const seen = new Set<string>();
  const reasonCodes: string[] = [];
  for (const item of parsed) {
    if (typeof item !== "string" || !/^[A-Z][A-Z0-9_]{1,63}$/.test(item) || seen.has(item)) {
      return undefined;
    }
    seen.add(item);
    reasonCodes.push(item);
  }
  return reasonCodes;
}

function decodeCivilDate(value: unknown): string | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }
  if (isValidIsoDate(value)) {
    return value;
  }

  const match = /^(\d{4}-\d{2}-\d{2})T00:00:00(?:\.\d+)?Z$/.exec(value);
  const datePart = match?.[1];
  return datePart && isValidIsoDate(datePart) ? datePart : undefined;
}

function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
