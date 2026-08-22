/**
 * VP-2 — staff-visible copy purity helpers.
 * Internal props / data-* may still carry technical ids; textContent must not.
 */

/** Substrings that must not appear in staff-facing textContent. */
export const VP2_STAFF_VISIBLE_FORBIDDEN_TOKENS = [
  "SharePoint",
  "in-memory",
  "fake",
  "append-only",
  "WRITE",
  "submitCorrection",
  "submitCancellation",
  "planId",
  "ProcedureId",
  "OccurrenceId",
  "RecordId",
  "CorrectionId",
  "LifecycleEventId",
  "FIELD-WORKFLOW",
  "Deploy",
  "persistence",
  "Slice C",
  "ProcedureRecord",
  "resolver",
  "saveState",
] as const;

export type Vp2StaffVisibleForbiddenToken =
  (typeof VP2_STAFF_VISIBLE_FORBIDDEN_TOKENS)[number];

/** Opaque fixture-style actor ids such as staff-1 must not be shown as 記録者. */
const OPAQUE_STAFF_ID_PATTERN = /^[a-z][a-z0-9]*-\d+$/i;

export function isOpaqueStaffActorId(value: string | undefined | null): boolean {
  if (!value) {
    return true;
  }
  return OPAQUE_STAFF_ID_PATTERN.test(value.trim());
}

export function findVp2StaffVisibleForbiddenTokens(
  text: string,
): Vp2StaffVisibleForbiddenToken[] {
  return VP2_STAFF_VISIBLE_FORBIDDEN_TOKENS.filter((token) => text.includes(token));
}

export function staffVisibleTextAvoidsVp2ForbiddenTokens(text: string): boolean {
  return findVp2StaffVisibleForbiddenTokens(text).length === 0;
}
