/**
 * Slice E physical binding.
 * Site identity + List GUID are the physical isolation boundary.
 * Display name and server-relative URL are not List identity.
 */

import { isNonEmptyString } from "../../../domain/validation";

export type ProcedureRecordLifecycleEventListBinding = Readonly<{
  siteIdentity: string;
  listGuid: string;
}>;

const SHAREPOINT_GUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export function normalizeLifecycleEventSharePointGuid(value: string): string | null {
  if (!isNonEmptyString(value)) {
    return null;
  }
  const normalized = value.trim().replace(/^\{|\}$/g, "").toLowerCase();
  return SHAREPOINT_GUID_RE.test(normalized) ? normalized : null;
}

export function isUsableProcedureRecordLifecycleEventListBinding(
  binding: ProcedureRecordLifecycleEventListBinding,
): boolean {
  return (
    isNonEmptyString(binding.siteIdentity) &&
    normalizeLifecycleEventSharePointGuid(binding.listGuid) !== null
  );
}

export function bindProcedureRecordLifecycleEventList(input: {
  siteIdentity: string;
  listGuid: string;
}): ProcedureRecordLifecycleEventListBinding | null {
  const normalizedGuid = normalizeLifecycleEventSharePointGuid(input.listGuid);
  if (!isNonEmptyString(input.siteIdentity) || normalizedGuid === null) {
    return null;
  }
  return {
    siteIdentity: input.siteIdentity.trim(),
    listGuid: normalizedGuid,
  };
}
