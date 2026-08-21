/**
 * Locked TP-1 physical schema verification for ProcedureRecordLifecycleEvent.
 * This verifier is read-only and performs no provisioning.
 */

import {
  PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS,
  PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES,
} from "./physical-columns";
import { normalizeLifecycleEventSharePointGuid } from "./list-binding";

export type ObservedLifecycleEventPhysicalField = Readonly<{
  InternalName: string;
  StaticName?: string;
  TypeAsString?: string;
  Required?: boolean;
  EnforceUniqueValues?: boolean;
  Indexed?: boolean;
  Choices?: readonly string[];
  FillInChoice?: boolean;
  MaxLength?: number;
  Hidden?: boolean;
}>;

export type ObservedLifecycleEventListIdentity = Readonly<{
  Id: string;
  Title: string;
  ItemCount: number;
}>;

export type ProcedureRecordLifecycleEventSchemaVerification =
  | Readonly<{ ok: true }>
  | Readonly<{ ok: false; reasons: readonly string[] }>;

type ExpectedTextColumn = Readonly<{
  InternalName: string;
  Required: boolean;
  EnforceUniqueValues: boolean;
  Indexed: boolean;
  MaxLength: 255;
}>;

export const PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS: readonly ExpectedTextColumn[] =
  [
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.schemaVersion,
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
    },
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.lifecycleEventId,
      Required: true,
      EnforceUniqueValues: true,
      Indexed: true,
      MaxLength: 255,
    },
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.lifecycleIdempotencyKey,
      Required: true,
      EnforceUniqueValues: true,
      Indexed: true,
      MaxLength: 255,
    },
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.lifecyclePayloadFingerprint,
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
    },
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.targetRecordId,
      Required: true,
      EnforceUniqueValues: false,
      Indexed: true,
      MaxLength: 255,
    },
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.replacementRecordId,
      Required: false,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
    },
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.recordedAt,
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
    },
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.recordedBy,
      Required: true,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
    },
    {
      InternalName: PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.reason,
      Required: false,
      EnforceUniqueValues: false,
      Indexed: false,
      MaxLength: 255,
    },
  ];

function fieldByInternalName(
  fields: readonly ObservedLifecycleEventPhysicalField[],
  internalName: string,
): ObservedLifecycleEventPhysicalField | undefined {
  return fields.find((field) => field.InternalName === internalName);
}

function sameChoices(actual: readonly string[] | undefined, expected: readonly string[]): boolean {
  if (!actual || actual.length !== expected.length) {
    return false;
  }
  return expected.every((token, index) => actual[index] === token);
}

export function verifyProcedureRecordLifecycleEventPhysicalSchema(
  expectedListGuid: string,
  list: ObservedLifecycleEventListIdentity,
  fields: readonly ObservedLifecycleEventPhysicalField[],
): ProcedureRecordLifecycleEventSchemaVerification {
  const reasons: string[] = [];
  const actualGuid = normalizeLifecycleEventSharePointGuid(list.Id);
  const expectedGuid = normalizeLifecycleEventSharePointGuid(expectedListGuid);

  if (expectedGuid === null || actualGuid !== expectedGuid) {
    reasons.push("list-guid-mismatch");
  }
  if (list.Title !== PROCEDURE_RECORD_LIFECYCLE_EVENT_LIST_DISPLAY_NAME) {
    reasons.push("list-display-name-mismatch");
  }

  for (const expected of PROCEDURE_RECORD_LIFECYCLE_EVENT_EXPECTED_TEXT_COLUMNS) {
    const actual = fieldByInternalName(fields, expected.InternalName);
    if (!actual) {
      reasons.push(`missing:${expected.InternalName}`);
      continue;
    }
    if (actual.StaticName !== undefined && actual.StaticName !== expected.InternalName) {
      reasons.push(`static-name:${expected.InternalName}`);
    }
    if (actual.TypeAsString !== "Text") {
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

  const eventType = fieldByInternalName(
    fields,
    PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType,
  );
  if (!eventType) {
    reasons.push(`missing:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`);
  } else {
    if (
      eventType.StaticName !== undefined &&
      eventType.StaticName !== PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType
    ) {
      reasons.push(`static-name:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`);
    }
    if (eventType.TypeAsString !== "Choice") {
      reasons.push(`type:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`);
    }
    if (eventType.Required !== true) {
      reasons.push(`required:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`);
    }
    if (eventType.EnforceUniqueValues !== false) {
      reasons.push(`unique:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`);
    }
    if (eventType.Indexed !== false) {
      reasons.push(`indexed:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`);
    }
    if (eventType.FillInChoice !== false) {
      reasons.push(`fill-in:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`);
    }
    if (!sameChoices(eventType.Choices, PROCEDURE_RECORD_LIFECYCLE_EVENT_TYPES)) {
      reasons.push(`choices:${PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.eventType}`);
    }
  }

  const title = fieldByInternalName(fields, "Title");
  if (!title) {
    reasons.push("missing:Title");
  } else {
    if (title.Required !== false) {
      reasons.push("required:Title");
    }
    if (title.EnforceUniqueValues === true) {
      reasons.push("unique:Title");
    }
  }

  const lockedUnique = new Set([
    PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.lifecycleEventId,
    PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.lifecycleIdempotencyKey,
  ]);
  const lockedIndexed = new Set([
    PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.lifecycleEventId,
    PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.lifecycleIdempotencyKey,
    PROCEDURE_RECORD_LIFECYCLE_EVENT_PHYSICAL_COLUMNS.targetRecordId,
  ]);

  for (const field of fields) {
    if (!field.InternalName.startsWith("life") || field.Hidden === true) {
      continue;
    }
    if (field.EnforceUniqueValues === true && !lockedUnique.has(field.InternalName)) {
      reasons.push(`extra-unique:${field.InternalName}`);
    }
    if (field.Indexed === true && !lockedIndexed.has(field.InternalName)) {
      reasons.push(`extra-index:${field.InternalName}`);
    }
  }

  return reasons.length === 0 ? { ok: true } : { ok: false, reasons };
}
