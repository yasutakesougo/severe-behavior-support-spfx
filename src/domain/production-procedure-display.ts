import {
  FRESHNESS_MAX_AGE_MS,
  type FreshnessTarget,
  type FreshnessToken,
} from "./support-plan-freshness";

export type ProductionProcedureDisplayInput<TValue> = Readonly<{
  lookupStatus?: unknown;
  source?: unknown;
  projection?: TValue;
  token?: FreshnessToken;
}>;

export type ProductionDisplayExpectation = Readonly<{
  target: FreshnessTarget;
  generation: number;
  requestId: string;
  minimumRevision: number;
  wallNowMs: number;
  monotonicNowMs: number;
}>;

export type ProductionProcedureDisplay<TValue> =
  | Readonly<{ status: "HIDDEN" }>
  | Readonly<{ status: "VISIBLE"; projection: TValue; token: FreshnessToken }>;

/**
 * Isolated production-only display boundary. It is intentionally not wired to
 * CurrentProcedure's existing synthetic/legacy compatibility path.
 */
export function getProductionProcedureDisplay<TValue>(
  input: ProductionProcedureDisplayInput<TValue>,
  expected: ProductionDisplayExpectation,
): ProductionProcedureDisplay<TValue> {
  const token = input.token;
  if (
    !isFreshnessTarget(expected.target) ||
    input.lookupStatus !== "RESOLVED" ||
    input.source !== "PRODUCTION" ||
    input.projection === undefined ||
    !token ||
    !validTokenWindow(token) ||
    !Number.isSafeInteger(expected.generation) ||
    !Number.isSafeInteger(expected.minimumRevision) ||
    expected.minimumRevision < 0 ||
    typeof expected.requestId !== "string" ||
    expected.requestId.length === 0 ||
    token.consistency !== "DOUBLE_READ_VERIFIED" ||
    token.generation !== expected.generation ||
    token.requestId !== expected.requestId ||
    token.revision < expected.minimumRevision ||
    token.targetKey !== expected.target.targetKey ||
    !sameScope(token.scope, expected.target.scope) ||
    !isFreshAt(token, expected.wallNowMs, expected.monotonicNowMs)
  ) {
    return { status: "HIDDEN" };
  }

  return { status: "VISIBLE", projection: input.projection, token };
}

function validTokenWindow(value: unknown): value is FreshnessToken {
  if (!value || typeof value !== "object") return false;
  const token = value as FreshnessToken;
  return (
    isFreshnessTarget({
      scope: token.scope,
      targetKey: token.targetKey,
    }) &&
    Number.isSafeInteger(token.generation) &&
    token.generation > 0 &&
    typeof token.requestId === "string" &&
    token.requestId.length > 0 &&
    Number.isSafeInteger(token.revision) &&
    token.revision >= 0 &&
    Number.isFinite(token.startedAtWallMs) &&
    Number.isFinite(token.startedAtMonotonicMs) &&
    token.expiresAtWallMs === token.startedAtWallMs + FRESHNESS_MAX_AGE_MS &&
    token.expiresAtMonotonicMs === token.startedAtMonotonicMs + FRESHNESS_MAX_AGE_MS
  );
}

function isFreshnessTarget(value: unknown): value is FreshnessTarget {
  if (!value || typeof value !== "object") return false;
  const target = value as Record<string, unknown>;
  return (
    typeof target.targetKey === "string" && target.targetKey.length > 0 && isScope(target.scope)
  );
}

function isScope(value: unknown): value is FreshnessTarget["scope"] {
  if (!value || typeof value !== "object") return false;
  const scope = value as Record<string, unknown>;
  return [scope.organizationId, scope.siteId, scope.userId].every(
    (part) => typeof part === "string" && part.length > 0,
  );
}

function isFreshAt(token: FreshnessToken, wallNowMs: number, monotonicNowMs: number): boolean {
  if (!Number.isFinite(wallNowMs) || !Number.isFinite(monotonicNowMs)) return false;
  const wallElapsed = wallNowMs - token.startedAtWallMs;
  const monotonicElapsed = monotonicNowMs - token.startedAtMonotonicMs;
  return (
    wallElapsed >= 0 &&
    monotonicElapsed >= 0 &&
    wallNowMs < token.expiresAtWallMs &&
    monotonicNowMs < token.expiresAtMonotonicMs &&
    Math.max(wallElapsed, monotonicElapsed) < FRESHNESS_MAX_AGE_MS
  );
}

function sameScope(
  left: Readonly<{ organizationId: string; siteId: string; userId: string }>,
  right: Readonly<{ organizationId: string; siteId: string; userId: string }>,
): boolean {
  return (
    left.organizationId === right.organizationId &&
    left.siteId === right.siteId &&
    left.userId === right.userId
  );
}
