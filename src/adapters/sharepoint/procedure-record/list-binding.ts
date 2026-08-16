/**
 * LOOKUP-B: logical SiteId → per-site provisioned List GUID.
 * Display Name and server-relative URL are not List identity.
 * Physical SharePoint Site ID is not logical SiteId.
 */

import { isNonEmptyString } from "../../../domain/validation";
import { PROCEDURE_RECORD_TEST_ONLY_LIST_GUID } from "./test-only-provisioned-list";

export type ProcedureRecordListBinding = Readonly<{
  organizationId: string;
  siteId: string;
  /** Runtime-injected List GUID. Synthetic tests may use a labeled token. */
  listGuid: string;
}>;

const SHAREPOINT_GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function normalizeSharePointGuid(value: string): string | null {
  if (!isNonEmptyString(value)) {
    return null;
  }
  const normalized = value
    .trim()
    .replace(/^\{|\}$/g, "")
    .toLowerCase();
  return SHAREPOINT_GUID_RE.test(normalized) ? normalized : null;
}

export function resolveProcedureRecordListGuid(
  bindings: Readonly<Record<string, string>>,
  siteId: string,
): string | null {
  if (!isNonEmptyString(siteId)) {
    return null;
  }
  const guid = bindings[siteId];
  if (!isNonEmptyString(guid)) {
    return null;
  }
  return guid;
}

export function isUsableListBinding(binding: ProcedureRecordListBinding): boolean {
  return (
    isNonEmptyString(binding.organizationId) &&
    isNonEmptyString(binding.siteId) &&
    isNonEmptyString(binding.listGuid)
  );
}

/**
 * Live / provisioned binding: List GUID must be a real GUID, and must not
 * equal the caller-supplied logical SiteId.
 */
export function isUsableLiveListBinding(binding: ProcedureRecordListBinding): boolean {
  if (!isUsableListBinding(binding)) {
    return false;
  }
  const listGuid = normalizeSharePointGuid(binding.listGuid);
  if (listGuid === null) {
    return false;
  }
  const siteAsGuid = normalizeSharePointGuid(binding.siteId);
  if (siteAsGuid !== null && siteAsGuid === listGuid) {
    return false;
  }
  return true;
}

export function bindProcedureRecordList(input: {
  organizationId: string;
  siteId: string;
  listGuid: string;
}): ProcedureRecordListBinding | null {
  const binding: ProcedureRecordListBinding = {
    organizationId: input.organizationId,
    siteId: input.siteId,
    listGuid: input.listGuid,
  };
  if (!isUsableLiveListBinding(binding)) {
    return null;
  }
  const normalized = normalizeSharePointGuid(input.listGuid);
  if (normalized === null) {
    return null;
  }
  return {
    organizationId: input.organizationId,
    siteId: input.siteId,
    listGuid: normalized,
  };
}

export function bindTestOnlyProvisionedProcedureRecordList(input: {
  organizationId: string;
  siteId: string;
}): ProcedureRecordListBinding | null {
  return bindProcedureRecordList({
    organizationId: input.organizationId,
    siteId: input.siteId,
    listGuid: PROCEDURE_RECORD_TEST_ONLY_LIST_GUID,
  });
}

export function procedureRecordSiteIdToListGuidMap(
  binding: ProcedureRecordListBinding,
): Readonly<Record<string, string>> {
  return { [binding.siteId]: binding.listGuid };
}
