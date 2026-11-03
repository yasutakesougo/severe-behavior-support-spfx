import { sha256Hex } from "./sha256";
import type { SupportPlanScope } from "./support-plan-repository";

export type SupportPlanRowKind = "H" | "V" | "C";

export type SupportPlanRowIdentity = Readonly<{
  rowKind: SupportPlanRowKind;
  rowKey: string;
  canonicalKey: string;
}>;

export type SupportPlanRowHash = (canonicalKey: string) => string;

export const SUPPORT_PLAN_ROW_KEY_MAX_LENGTH = 255;

export function isCanonicalSupportPlanRowKey(
  rowKind: unknown,
  canonicalKey: unknown,
): canonicalKey is string {
  if (
    !["H", "V", "C"].includes(String(rowKind)) ||
    typeof canonicalKey !== "string" ||
    canonicalKey.length === 0
  ) {
    return false;
  }

  let tuple: unknown;
  try {
    tuple = JSON.parse(canonicalKey);
  } catch {
    return false;
  }
  if (
    !Array.isArray(tuple) ||
    tuple.some((part) => typeof part !== "string" || !isWellFormedUnicode(part)) ||
    JSON.stringify(tuple) !== canonicalKey ||
    tuple[0] !== "rk1" ||
    tuple[1] !== rowKind
  ) {
    return false;
  }

  if (rowKind === "H") {
    return tuple.length === 6 && tuple.slice(2).every(isNonEmptyString);
  }
  if (rowKind === "V") {
    return (
      tuple.length === 7 &&
      tuple.slice(2, 6).every(isNonEmptyString) &&
      /^[1-9][0-9]*$/.test(tuple[6]) &&
      Number.isSafeInteger(Number(tuple[6])) &&
      String(Number(tuple[6])) === tuple[6]
    );
  }
  return tuple.length === 4 && tuple.slice(2).every(isNonEmptyString);
}

export function createHeaderRowIdentity(
  input: SupportPlanScope & Readonly<{ planId: string }>,
  hash: SupportPlanRowHash = sha256Hex,
): SupportPlanRowIdentity {
  validateIdentifiers([input.organizationId, input.siteId, input.userId, input.planId]);
  return createIdentity(
    "H",
    ["rk1", "H", input.organizationId, input.siteId, input.userId, input.planId],
    hash,
  );
}

export function createVersionRowIdentity(
  input: SupportPlanScope & Readonly<{ planId: string; version: number }>,
  hash: SupportPlanRowHash = sha256Hex,
): SupportPlanRowIdentity {
  validateIdentifiers([input.organizationId, input.siteId, input.userId, input.planId]);
  if (!Number.isSafeInteger(input.version) || input.version < 1) {
    throw new RangeError("SupportPlan RowKey version must be a positive safe integer");
  }

  return createIdentity(
    "V",
    [
      "rk1",
      "V",
      input.organizationId,
      input.siteId,
      input.userId,
      input.planId,
      String(input.version),
    ],
    hash,
  );
}

export function createControlRowIdentity(
  input: Readonly<{ organizationId: string; siteId: string }>,
  hash: SupportPlanRowHash = sha256Hex,
): SupportPlanRowIdentity {
  validateIdentifiers([input.organizationId, input.siteId]);
  return createIdentity("C", ["rk1", "C", input.organizationId, input.siteId], hash);
}

/** Candidate indexed key for scope + plan searches; not a SharePoint schema claim. */
export function createPlanKey(
  input: SupportPlanScope & Readonly<{ planId: string }>,
  hash: SupportPlanRowHash = sha256Hex,
): string {
  validateIdentifiers([input.organizationId, input.siteId, input.userId, input.planId]);
  const digest = hash(
    JSON.stringify(["pk1", input.organizationId, input.siteId, input.userId, input.planId]),
  );
  if (!/^[\da-fA-F]{64}$/.test(digest)) {
    throw new TypeError("SupportPlan PlanKey hash must be a 64-character SHA-256 digest");
  }
  return `pk1:${digest.toLowerCase()}`;
}

function createIdentity(
  kind: SupportPlanRowKind,
  tuple: readonly string[],
  hash: SupportPlanRowHash,
): SupportPlanRowIdentity {
  const canonicalKey = JSON.stringify(tuple);
  const digest = hash(canonicalKey);
  if (!/^[\da-fA-F]{64}$/.test(digest)) {
    throw new TypeError("SupportPlan RowKey hash must be a 64-character SHA-256 hex digest");
  }

  const rowKey = ["rk1", kind.toLowerCase(), digest.toLowerCase()].join(":");
  if (rowKey.length > SUPPORT_PLAN_ROW_KEY_MAX_LENGTH) {
    throw new RangeError("SupportPlan RowKey exceeds the configured maximum length");
  }
  return Object.freeze({ rowKind: kind, rowKey, canonicalKey });
}

function validateIdentifiers(values: readonly string[]): void {
  for (const value of values) {
    if (typeof value !== "string" || value.length === 0) {
      throw new TypeError("SupportPlan RowKey identifiers must not be empty");
    }
    if (!isWellFormedUnicode(value)) {
      throw new TypeError("SupportPlan RowKey identifiers must contain well-formed Unicode");
    }
  }
}

function isWellFormedUnicode(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const current = value.charCodeAt(index);
    if (current >= 0xd800 && current <= 0xdbff) {
      const next = value.charCodeAt(index + 1);
      if (!(next >= 0xdc00 && next <= 0xdfff)) return false;
      index += 1;
    } else if (current >= 0xdc00 && current <= 0xdfff) {
      return false;
    }
  }
  return true;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}
