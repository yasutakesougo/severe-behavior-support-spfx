import type { SupportPlanScope } from "./support-plan-repository";

export const FRESHNESS_MAX_AGE_MS = 60_000;
export const FRESHNESS_REVALIDATION_INTERVAL_MS = 30_000;
export const FRESHNESS_REQUEST_TIMEOUT_MS = 10_000;
const MAX_RETRIES = 1;

export type FreshnessTarget = Readonly<{
  scope: SupportPlanScope;
  targetKey: string;
}>;

export type FreshnessClock = Readonly<{
  wallNowMs(): number;
  monotonicNowMs(): number;
}>;

export type FreshnessScheduler = Readonly<{
  setTimeout(callback: () => void, delayMs: number): unknown;
  clearTimeout(handle: unknown): void;
}>;

export type FreshnessVerificationRequest = Readonly<{
  target: FreshnessTarget;
  generation: number;
  requestId: string;
  minimumRevision: number;
  wallNowMs: number;
  monotonicNowMs: number;
  signal: AbortSignal;
}>;

export type FreshnessVerificationResult<TValue> =
  | Readonly<{
      status: "RESOLVED";
      scope: SupportPlanScope;
      targetKey: string;
      revision: number;
      consistency: "DOUBLE_READ_VERIFIED";
      value: TValue;
    }>
  | Readonly<{ status: "ERROR"; reasonCode?: string }>
  | Readonly<{ status: "UNRESOLVED"; reasonCode?: string }>;

export type FreshnessToken = Readonly<{
  scope: SupportPlanScope;
  targetKey: string;
  generation: number;
  requestId: string;
  revision: number;
  startedAtWallMs: number;
  startedAtMonotonicMs: number;
  expiresAtWallMs: number;
  expiresAtMonotonicMs: number;
  consistency: "DOUBLE_READ_VERIFIED";
}>;

export type FreshnessDisplayPermit<TValue> = Readonly<{
  projection: TValue;
  token: FreshnessToken;
}>;

export type FreshnessState =
  | Readonly<{ status: "HIDDEN" }>
  | Readonly<{ status: "LOADING" }>
  | Readonly<{ status: "RESOLVED"; revision: number; requestId: string }>
  | Readonly<{ status: "FETCH_FAILED"; reasonCode: string }>;

type ActiveRequest = Readonly<{
  request: FreshnessVerificationRequest;
  controller: AbortController;
  timeout: unknown;
  attempt: number;
}>;

type FreshnessControllerOptions<TValue> = Readonly<{
  verify(
    request: FreshnessVerificationRequest,
  ): Promise<FreshnessVerificationResult<TValue> | unknown>;
  clock: FreshnessClock;
  scheduler: FreshnessScheduler;
  createRequestId(sequence: number): string;
}>;

/**
 * Local, storage-independent freshness state machine. It does not connect to a
 * production data source and only accepts a result explicitly marked as the
 * Reader's successful before/data/after double-read.
 */
export class ProcedureFreshnessController<TValue> {
  private target?: FreshnessTarget;
  private generation = 0;
  private requestSequence = 0;
  private readonly usedRequestIds = new Set<string>();
  private hidden = true;
  private activeRequest?: ActiveRequest;
  private revalidationTimer?: unknown;
  private permit?: FreshnessDisplayPermit<TValue>;
  private readonly latestRevisionByFacility = new Map<string, number>();
  private currentState: FreshnessState = { status: "HIDDEN" };

  public constructor(private readonly options: FreshnessControllerOptions<TValue>) {}

  public get state(): FreshnessState {
    return this.currentState;
  }

  public enter(target: FreshnessTarget): void {
    this.cancelCurrentWork();
    this.generation += 1;
    this.usedRequestIds.clear();
    this.permit = undefined;
    this.target = undefined;
    this.hidden = false;
    try {
      this.target = freezeTarget(target);
    } catch {
      this.currentState = { status: "FETCH_FAILED", reasonCode: "INVALID_TARGET" };
      return;
    }
    this.currentState = { status: "LOADING" };
    this.beginAttempt(0);
  }

  public hide(): void {
    if (this.hidden) return;
    this.hidden = true;
    this.generation += 1;
    this.cancelCurrentWork();
    this.permit = undefined;
    this.currentState = { status: "HIDDEN" };
  }

  /** Duplicate pageshow/visibility events for the active target are coalesced. */
  public resume(target: FreshnessTarget): void {
    if (!this.hidden && sameTarget(this.target, target)) return;
    this.enter(target);
  }

  /**
   * Records an externally observed facility revision. A token below this
   * monotone lower bound can no longer be rendered, even if it was once valid.
   */
  public observeRevision(scope: SupportPlanScope, revision: number): void {
    if (!Number.isSafeInteger(revision) || revision < 0) return;
    const key = facilityKey(scope);
    const current = this.latestRevisionByFacility.get(key) ?? 0;
    if (revision <= current) return;
    this.latestRevisionByFacility.set(key, revision);
    if (
      this.permit &&
      sameScope(this.permit.token.scope, scope) &&
      this.permit.token.revision < revision
    ) {
      this.permit = undefined;
      if (this.activeRequest) this.currentState = { status: "LOADING" };
      else this.currentState = { status: "FETCH_FAILED", reasonCode: "REVISION_ADVANCED" };
    }
  }

  /** Rechecks the token on every render; timer punctuality is not trusted. */
  public getDisplayPermit(target: FreshnessTarget): FreshnessDisplayPermit<TValue> | undefined {
    const candidate = this.permit;
    if (this.hidden || !candidate) return undefined;
    if (
      !sameTarget(this.target, target) ||
      !sameTarget({ scope: candidate.token.scope, targetKey: candidate.token.targetKey }, target) ||
      candidate.token.generation !== this.generation
    ) {
      this.invalidatePermit("DISPLAY_CONTEXT_MISMATCH");
      return undefined;
    }
    if (candidate.token.revision < this.latestRevision(candidate.token.scope)) {
      this.invalidatePermit("REVISION_ADVANCED");
      return undefined;
    }
    const now = this.readClock();
    if (!now) {
      this.invalidatePermit("CLOCK_READ_FAILED");
      return undefined;
    }
    if (!isFreshAt(candidate.token, now.wallNowMs, now.monotonicNowMs)) {
      this.invalidatePermit("FRESHNESS_EXPIRED");
      return undefined;
    }
    return candidate;
  }

  private beginAttempt(attempt: number): void {
    if (this.hidden || !this.target || this.activeRequest) return;

    let wallNowMs: number;
    let monotonicNowMs: number;
    try {
      wallNowMs = this.options.clock.wallNowMs();
      monotonicNowMs = this.options.clock.monotonicNowMs();
    } catch {
      this.permit = undefined;
      this.currentState = { status: "FETCH_FAILED", reasonCode: "CLOCK_READ_FAILED" };
      return;
    }
    let requestId: string;
    try {
      requestId = this.options.createRequestId(++this.requestSequence);
    } catch {
      this.permit = undefined;
      this.currentState = { status: "FETCH_FAILED", reasonCode: "REQUEST_ID_CREATION_FAILED" };
      return;
    }
    if (
      typeof requestId !== "string" ||
      requestId.length === 0 ||
      this.usedRequestIds.has(requestId) ||
      !Number.isFinite(wallNowMs) ||
      !Number.isFinite(monotonicNowMs)
    ) {
      this.permit = undefined;
      this.currentState = { status: "FETCH_FAILED", reasonCode: "INVALID_REQUEST_CONTEXT" };
      return;
    }
    this.usedRequestIds.add(requestId);

    const controller = new AbortController();
    const request: FreshnessVerificationRequest = Object.freeze({
      target: this.target,
      generation: this.generation,
      requestId,
      minimumRevision: this.latestRevision(this.target.scope),
      wallNowMs,
      monotonicNowMs,
      signal: controller.signal,
    });
    const activeRef: { current?: ActiveRequest } = {};
    let timeoutSchedulingFailed = false;
    const timeout = (() => {
      try {
        return this.options.scheduler.setTimeout(() => {
          const active = activeRef.current;
          if (active) this.failAttempt(active, "REQUEST_TIMEOUT");
        }, FRESHNESS_REQUEST_TIMEOUT_MS);
      } catch {
        timeoutSchedulingFailed = true;
        return undefined;
      }
    })();
    if (timeoutSchedulingFailed) {
      this.permit = undefined;
      this.currentState = { status: "FETCH_FAILED", reasonCode: "TIMEOUT_SCHEDULING_FAILED" };
      return;
    }
    const active: ActiveRequest = { request, controller, timeout, attempt };
    activeRef.current = active;
    this.activeRequest = active;
    this.currentState = { status: "LOADING" };

    void Promise.resolve()
      .then(() => this.options.verify(request))
      .then(
        (result) => {
          try {
            this.acceptResult(active, result);
          } catch {
            this.failResponseProcessing(active);
          }
        },
        () => this.failAttempt(active, "VERIFICATION_FAILED"),
      );
  }

  private acceptResult(active: ActiveRequest, value: unknown): void {
    if (!this.isCurrent(active)) return;
    this.clearActive(active);

    if (!isResolvedResult<TValue>(value)) {
      this.failAfterClearing(active, reasonFrom(value));
      return;
    }

    const { request } = active;
    if (
      !sameScope(value.scope, request.target.scope) ||
      value.targetKey !== request.target.targetKey ||
      !sameTarget(this.target, request.target) ||
      request.generation !== this.generation
    ) {
      this.failAfterClearing(active, "RESPONSE_TARGET_MISMATCH");
      return;
    }

    const latestRevision = this.latestRevision(request.target.scope);
    if (value.revision < Math.max(request.minimumRevision, latestRevision)) {
      this.failAfterClearing(active, "STALE_REVISION");
      return;
    }

    const completed = this.readClock();
    if (!completed) {
      this.failAfterClearing(active, "CLOCK_READ_FAILED");
      return;
    }
    const requestElapsedMs = Math.max(
      completed.wallNowMs - request.wallNowMs,
      completed.monotonicNowMs - request.monotonicNowMs,
    );
    if (requestElapsedMs >= FRESHNESS_REQUEST_TIMEOUT_MS) {
      this.failAfterClearing(active, "REQUEST_TIMEOUT");
      return;
    }
    const token: FreshnessToken = Object.freeze({
      scope: request.target.scope,
      targetKey: request.target.targetKey,
      generation: request.generation,
      requestId: request.requestId,
      revision: value.revision,
      startedAtWallMs: request.wallNowMs,
      startedAtMonotonicMs: request.monotonicNowMs,
      expiresAtWallMs: request.wallNowMs + FRESHNESS_MAX_AGE_MS,
      expiresAtMonotonicMs: request.monotonicNowMs + FRESHNESS_MAX_AGE_MS,
      consistency: "DOUBLE_READ_VERIFIED",
    });
    if (!isFreshAt(token, completed.wallNowMs, completed.monotonicNowMs)) {
      this.failAfterClearing(active, "VERIFICATION_EXPIRED_BEFORE_COMPLETION");
      return;
    }

    const facility = facilityKey(request.target.scope);
    this.latestRevisionByFacility.set(facility, Math.max(latestRevision, value.revision));
    this.permit = { projection: value.value, token };
    this.currentState = {
      status: "RESOLVED",
      revision: value.revision,
      requestId: request.requestId,
    };
    this.scheduleRevalidation(request.generation, request.target);
  }

  private failAttempt(active: ActiveRequest, reasonCode: string): void {
    if (!this.isCurrent(active)) return;
    this.clearActive(active);
    active.controller.abort();
    this.failAfterClearing(active, reasonCode);
  }

  private failResponseProcessing(active: ActiveRequest): void {
    if (this.hidden || !this.isCurrentGeneration(active.request)) return;
    if (this.activeRequest === active) {
      this.clearActive(active);
      active.controller.abort();
    }
    this.failAfterClearing(active, "RESPONSE_PROCESSING_FAILED");
  }

  private failAfterClearing(active: ActiveRequest, reasonCode: string): void {
    this.permit = undefined;
    if (active.attempt < MAX_RETRIES && this.isCurrentGeneration(active.request)) {
      this.currentState = { status: "LOADING" };
      this.beginAttempt(active.attempt + 1);
      return;
    }
    this.currentState = { status: "FETCH_FAILED", reasonCode };
  }

  private scheduleRevalidation(generation: number, target: FreshnessTarget): void {
    this.clearRevalidationTimer();
    try {
      this.revalidationTimer = this.options.scheduler.setTimeout(() => {
        this.revalidationTimer = undefined;
        if (
          this.hidden ||
          generation !== this.generation ||
          !sameTarget(this.target, target) ||
          this.activeRequest
        ) {
          return;
        }
        this.beginAttempt(0);
      }, FRESHNESS_REVALIDATION_INTERVAL_MS);
    } catch {
      this.invalidatePermit("REVALIDATION_SCHEDULING_FAILED");
    }
  }

  private isCurrent(active: ActiveRequest): boolean {
    return (
      this.activeRequest === active && !this.hidden && this.isCurrentGeneration(active.request)
    );
  }

  private isCurrentGeneration(request: FreshnessVerificationRequest): boolean {
    return request.generation === this.generation && sameTarget(this.target, request.target);
  }

  private clearActive(active: ActiveRequest): void {
    this.options.scheduler.clearTimeout(active.timeout);
    if (this.activeRequest === active) this.activeRequest = undefined;
  }

  private clearRevalidationTimer(): void {
    if (this.revalidationTimer !== undefined) {
      this.options.scheduler.clearTimeout(this.revalidationTimer);
      this.revalidationTimer = undefined;
    }
  }

  private cancelCurrentWork(): void {
    this.clearRevalidationTimer();
    const active = this.activeRequest;
    if (active) {
      this.options.scheduler.clearTimeout(active.timeout);
      this.activeRequest = undefined;
      active.controller.abort();
    }
  }

  private latestRevision(scope: SupportPlanScope): number {
    return this.latestRevisionByFacility.get(facilityKey(scope)) ?? 0;
  }

  private invalidatePermit(reasonCode: string): void {
    this.permit = undefined;
    this.currentState = this.activeRequest
      ? { status: "LOADING" }
      : { status: "FETCH_FAILED", reasonCode };
  }

  private readClock(): Readonly<{ wallNowMs: number; monotonicNowMs: number }> | undefined {
    try {
      const wallNowMs = this.options.clock.wallNowMs();
      const monotonicNowMs = this.options.clock.monotonicNowMs();
      if (!Number.isFinite(wallNowMs) || !Number.isFinite(monotonicNowMs)) return undefined;
      return { wallNowMs, monotonicNowMs };
    } catch {
      return undefined;
    }
  }
}

function isResolvedResult<TValue>(
  value: unknown,
): value is Extract<FreshnessVerificationResult<TValue>, { status: "RESOLVED" }> {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.status === "RESOLVED" &&
    candidate.consistency === "DOUBLE_READ_VERIFIED" &&
    typeof candidate.targetKey === "string" &&
    Number.isSafeInteger(candidate.revision) &&
    (candidate.revision as number) >= 0 &&
    isScope(candidate.scope) &&
    "value" in candidate
  );
}

function reasonFrom(value: unknown): string {
  if (value && typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    if (typeof candidate.reasonCode === "string" && candidate.reasonCode.length > 0) {
      return candidate.reasonCode;
    }
  }
  return "VERIFICATION_NOT_RESOLVED";
}

function isScope(value: unknown): value is SupportPlanScope {
  if (!value || typeof value !== "object") return false;
  const scope = value as Record<string, unknown>;
  return (
    typeof scope.organizationId === "string" &&
    scope.organizationId.length > 0 &&
    typeof scope.siteId === "string" &&
    scope.siteId.length > 0 &&
    typeof scope.userId === "string" &&
    scope.userId.length > 0
  );
}

function freezeTarget(target: FreshnessTarget): FreshnessTarget {
  if (!target.targetKey || !isScope(target.scope)) {
    throw new TypeError("Freshness target requires a complete scope and target key");
  }
  return Object.freeze({
    scope: Object.freeze({
      organizationId: target.scope.organizationId,
      siteId: target.scope.siteId,
      userId: target.scope.userId,
    }),
    targetKey: target.targetKey,
  });
}

function sameScope(left: SupportPlanScope | undefined, right: SupportPlanScope): boolean {
  return Boolean(
    left &&
    left.organizationId === right.organizationId &&
    left.siteId === right.siteId &&
    left.userId === right.userId,
  );
}

function sameTarget(left: FreshnessTarget | undefined, right: FreshnessTarget): boolean {
  return Boolean(left && left.targetKey === right.targetKey && sameScope(left.scope, right.scope));
}

function facilityKey(scope: SupportPlanScope): string {
  return JSON.stringify([scope.organizationId, scope.siteId]);
}

function isFreshAt(token: FreshnessToken, wallNowMs: number, monotonicNowMs: number): boolean {
  if (!Number.isFinite(wallNowMs) || !Number.isFinite(monotonicNowMs)) return false;
  const wallElapsed = wallNowMs - token.startedAtWallMs;
  const monotonicElapsed = monotonicNowMs - token.startedAtMonotonicMs;
  if (wallElapsed < 0 || monotonicElapsed < 0) return false;
  if (wallNowMs >= token.expiresAtWallMs || monotonicNowMs >= token.expiresAtMonotonicMs) {
    return false;
  }
  return Math.max(wallElapsed, monotonicElapsed) < FRESHNESS_MAX_AGE_MS;
}
