/**
 * Expected physical schema for the provisioned ProcedureRecord List.
 * Canonical: PR-MAP-NAMES-1 + TITLE-NONE + unique pair observed at provisioning COMPLETE.
 *
 * This verifies REST field descriptors. It does not create items.
 */

import { PROCEDURE_RECORD_RESULTS } from "../../../domain/procedure-record";
import { normalizeSharePointGuid } from "./list-binding";
import { PROCEDURE_RECORD_PHYSICAL_COLUMNS } from "./physical-columns";
import { PROCEDURE_RECORD_TEST_ONLY_LIST_GUID } from "./test-only-provisioned-list";

export const PROCEDURE_RECORD_PR_RESULT_CHOICES = PROCEDURE_RECORD_RESULTS;

export const PROCEDURE_RECORD_INDEX_CANDIDATE_COLUMNS = [
  PROCEDURE_RECORD_PHYSICAL_COLUMNS.userId,
  PROCEDURE_RECORD_PHYSICAL_COLUMNS.localDate,
  PROCEDURE_RECORD_PHYSICAL_COLUMNS.planId,
] as const;

export const PROCEDURE_RECORD_FORBIDDEN_COLUMN_INTERNAL_NAMES = [
  "schemaId",
  "schemaVersion",
  "dtoVersion",
  "TimeZone",
] as const;

export type ObservedPhysicalField = Readonly<{
  InternalName: string;
  StaticName?: string;
  Title?: string;
  TypeAsString?: string;
  Required?: boolean;
  EnforceUniqueValues?: boolean;
  Indexed?: boolean;
  Choices?: readonly string[];
  FillInChoice?: boolean;
  DefaultValue?: string | null;
  MaxLength?: number;
  Hidden?: boolean;
}>;

export type ObservedListIdentity = Readonly<{
  Id: string;
  Title: string;
  ItemCount: number;
}>;

export type ProcedureRecordSchemaVerification =
  Readonly<{ ok: true }> | Readonly<{ ok: false; reasons: readonly string[] }>;

type ExpectedTextColumn = Readonly<{
  InternalName: string;
  Title: string;
  TypeAsString: "Text";
  Required: true;
  EnforceUniqueValues: boolean;
  Indexed: boolean;
  MaxLength: 255;
}>;

const UNIQUE_TEXT = {
  TypeAsString: "Text",
  Required: true,
  EnforceUniqueValues: true,
  Indexed: true,
  MaxLength: 255,
} as const;

const REQUIRED_TEXT = {
  TypeAsString: "Text",
  Required: true,
  EnforceUniqueValues: false,
  Indexed: false,
  MaxLength: 255,
} as const;

export const PROCEDURE_RECORD_EXPECTED_PR_TEXT_COLUMNS: readonly ExpectedTextColumn[] = [
  { InternalName: "prRecordId", Title: "実施記録ID", ...UNIQUE_TEXT },
  { InternalName: "prIdempotencyKey", Title: "冪等キー", ...UNIQUE_TEXT },
  { InternalName: "prPayloadFingerprint", Title: "ペイロード指紋", ...REQUIRED_TEXT },
  { InternalName: "prOrganizationId", Title: "組織ID", ...REQUIRED_TEXT },
  { InternalName: "prSiteId", Title: "事業所ID", ...REQUIRED_TEXT },
  { InternalName: "prUserId", Title: "利用者ID", ...REQUIRED_TEXT },
  { InternalName: "prProcedureId", Title: "手順ID", ...REQUIRED_TEXT },
  { InternalName: "prProcedureVersion", Title: "手順版", ...REQUIRED_TEXT },
  { InternalName: "prApprovalState", Title: "承認状態", ...REQUIRED_TEXT },
  { InternalName: "prLocalDate", Title: "実施暦日", ...REQUIRED_TEXT },
  { InternalName: "prPlanId", Title: "計画ID", ...REQUIRED_TEXT },
  { InternalName: "prPlanVersion", Title: "計画版", ...REQUIRED_TEXT },
  { InternalName: "prPerformedAt", Title: "実施日時", ...REQUIRED_TEXT },
  { InternalName: "prRecordedAt", Title: "記録日時", ...REQUIRED_TEXT },
  { InternalName: "prRecordedBy", Title: "記録者", ...REQUIRED_TEXT },
];

function fieldByInternalName(
  fields: readonly ObservedPhysicalField[],
  internalName: string,
): ObservedPhysicalField | undefined {
  return fields.find((field) => field.InternalName === internalName);
}

function sameChoices(actual: readonly string[] | undefined, expected: readonly string[]): boolean {
  if (!actual || actual.length !== expected.length) {
    return false;
  }
  return expected.every((token, index) => actual[index] === token);
}

export function verifyProcedureRecordPhysicalSchema(
  list: ObservedListIdentity,
  fields: readonly ObservedPhysicalField[],
): ProcedureRecordSchemaVerification {
  const reasons: string[] = [];
  const listGuid = normalizeSharePointGuid(list.Id);
  if (listGuid !== PROCEDURE_RECORD_TEST_ONLY_LIST_GUID) {
    reasons.push("list-guid-mismatch");
  }
  if (list.Title !== "支援手順実施記録") {
    reasons.push("list-display-name-mismatch");
  }
  if (list.ItemCount !== 0) {
    reasons.push("item-count-not-zero");
  }

  for (const expected of PROCEDURE_RECORD_EXPECTED_PR_TEXT_COLUMNS) {
    const actual = fieldByInternalName(fields, expected.InternalName);
    if (!actual) {
      reasons.push(`missing:${expected.InternalName}`);
      continue;
    }
    if (actual.StaticName !== undefined && actual.StaticName !== expected.InternalName) {
      reasons.push(`static-name:${expected.InternalName}`);
    }
    if (actual.Title !== expected.Title) {
      reasons.push(`display-name:${expected.InternalName}`);
    }
    if (actual.TypeAsString !== expected.TypeAsString) {
      reasons.push(`type:${expected.InternalName}`);
    }
    if (actual.Required !== expected.Required) {
      reasons.push(`required:${expected.InternalName}`);
    }
    if (actual.EnforceUniqueValues !== expected.EnforceUniqueValues) {
      reasons.push(`unique:${expected.InternalName}`);
    }
    if (actual.Indexed !== expected.Indexed) {
      reasons.push(`indexed:${expected.InternalName}`);
    }
    if (actual.MaxLength !== expected.MaxLength) {
      reasons.push(`max-length:${expected.InternalName}`);
    }
  }

  const prResult = fieldByInternalName(fields, PROCEDURE_RECORD_PHYSICAL_COLUMNS.result);
  if (!prResult) {
    reasons.push("missing:prResult");
  } else {
    if (prResult.Title !== "実施結果") {
      reasons.push("display-name:prResult");
    }
    if (prResult.TypeAsString !== "Choice") {
      reasons.push("type:prResult");
    }
    if (prResult.Required !== true) {
      reasons.push("required:prResult");
    }
    if (prResult.EnforceUniqueValues !== false) {
      reasons.push("unique:prResult");
    }
    if (prResult.Indexed !== false) {
      reasons.push("indexed:prResult");
    }
    if (prResult.FillInChoice !== false) {
      reasons.push("fill-in:prResult");
    }
    if (prResult.DefaultValue !== null && prResult.DefaultValue !== undefined) {
      reasons.push("default:prResult");
    }
    if (!sameChoices(prResult.Choices, PROCEDURE_RECORD_PR_RESULT_CHOICES)) {
      reasons.push("choices:prResult");
    }
  }

  const title = fieldByInternalName(fields, "Title");
  if (!title) {
    reasons.push("missing:Title");
  } else {
    if (title.InternalName !== "Title") {
      reasons.push("internal-name:Title");
    }
    if (title.Required !== false) {
      reasons.push("required:Title");
    }
    if (title.EnforceUniqueValues === true) {
      reasons.push("unique:Title");
    }
  }

  for (const forbidden of PROCEDURE_RECORD_FORBIDDEN_COLUMN_INTERNAL_NAMES) {
    if (fieldByInternalName(fields, forbidden)) {
      reasons.push(`forbidden-column:${forbidden}`);
    }
  }

  const uniqueFields = fields.filter(
    (field) => field.EnforceUniqueValues === true && field.Hidden !== true,
  );
  for (const field of uniqueFields) {
    if (field.InternalName !== "prRecordId" && field.InternalName !== "prIdempotencyKey") {
      reasons.push(`extra-unique:${field.InternalName}`);
    }
  }

  for (const candidate of PROCEDURE_RECORD_INDEX_CANDIDATE_COLUMNS) {
    const actual = fieldByInternalName(fields, candidate);
    if (actual?.Indexed === true) {
      reasons.push(`extra-index:${candidate}`);
    }
  }

  if (reasons.length > 0) {
    return { ok: false, reasons };
  }
  return { ok: true };
}
