/**
 * LOOKUP-B: SiteId → per-site provisioned List GUID.
 * Display Name and server-relative URL are not List identity.
 * This module does not invent a tenant GUID.
 */

import { isNonEmptyString } from "../../../domain/validation";

export type ProcedureRecordListBinding = Readonly<{
  organizationId: string;
  siteId: string;
  /** Runtime-injected List GUID. Synthetic tests use a labeled token only. */
  listGuid: string;
}>;

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
