/**
 * DERIVED reconstruction (Decision-PROCEDURE-RECORD-MAPPING-1 M5).
 * Must never be emitted as SharePoint item fields.
 */

import {
  PROCEDURE_RECORD_DTO_VERSION,
  PROCEDURE_RECORD_SCHEMA_ID,
  PROCEDURE_RECORD_SCHEMA_VERSION,
  PROCEDURE_RECORD_TIME_ZONE,
} from "./physical-columns";

export type ProcedureRecordDerivedEnvelope = Readonly<{
  schemaId: typeof PROCEDURE_RECORD_SCHEMA_ID;
  schemaVersion: typeof PROCEDURE_RECORD_SCHEMA_VERSION;
  dtoVersion: typeof PROCEDURE_RECORD_DTO_VERSION;
  TimeZone: typeof PROCEDURE_RECORD_TIME_ZONE;
}>;

export function getProcedureRecordDerivedEnvelope(): ProcedureRecordDerivedEnvelope {
  return {
    schemaId: PROCEDURE_RECORD_SCHEMA_ID,
    schemaVersion: PROCEDURE_RECORD_SCHEMA_VERSION,
    dtoVersion: PROCEDURE_RECORD_DTO_VERSION,
    TimeZone: PROCEDURE_RECORD_TIME_ZONE,
  };
}

/** Keys that must never appear on REST item field payloads. */
export const FORBIDDEN_SHAREPOINT_ITEM_FIELD_KEYS = [
  "schemaId",
  "schemaVersion",
  "dtoVersion",
  "TimeZone",
  "Title",
] as const;
