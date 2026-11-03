import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  FRESHNESS_MAX_AGE_MS,
  FRESHNESS_REQUEST_TIMEOUT_MS,
  FRESHNESS_REVALIDATION_INTERVAL_MS,
  ProcedureFreshnessController,
  type FreshnessTarget,
  type FreshnessVerificationRequest,
} from "../../src/domain/support-plan-freshness";

type Deferred<T> = Readonly<{
  promise: Promise<T>;
  resolve: (value: T) => void;
}>;

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((accept) => {
    resolve = accept;
  });
  return { promise, resolve };
}

class ManualRuntime {
  private time = 0;
  private nextTimer = 1;
  private readonly timers = new Map<number, Readonly<{ due: number; callback: () => void }>>();

  public wallNowMs(): number {
    return this.time;
  }

  public monotonicNowMs(): number {
    return this.time;
  }

  public setTimeout(callback: () => void, delayMs: number): number {
    const id = this.nextTimer++;
    this.timers.set(id, { due: this.time + delayMs, callback });
    return id;
  }

  public clearTimeout(id: unknown): void {
    if (typeof id === "number") this.timers.delete(id);
  }

  public async advanceBy(delayMs: number): Promise<void> {
    const target = this.time + delayMs;
    for (;;) {
      const due = [...this.timers.entries()]
        .filter(([, timer]) => timer.due <= target)
        .sort((left, right) => left[1].due - right[1].due)[0];
      if (!due) break;
      this.time = due[1].due;
      this.timers.delete(due[0]);
      due[1].callback();
      await flush();
    }
    this.time = target;
    await flush();
  }

  public async elapseWithoutRunningTimers(delayMs: number): Promise<void> {
    this.time += delayMs;
    await flush();
  }
}

function flush(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}

function target(userId: string, targetKey: string): FreshnessTarget {
  return {
    scope: { organizationId: "org-a", siteId: "site-a", userId },
    targetKey,
  };
}

function resolved(request: FreshnessVerificationRequest, revision: number, value: string) {
  return {
    status: "RESOLVED" as const,
    scope: request.target.scope,
    targetKey: request.target.targetKey,
    revision,
    consistency: "DOUBLE_READ_VERIFIED" as const,
    value,
  };
}

describe("RISK-02 synthetic freshness and display gate", () => {
  it("TC-TTL-01 revalidates at 30 seconds, hides at 60 seconds, and accepts a new post-expiry check", async () => {
    const runtime = new ManualRuntime();
    const pending: Deferred<ReturnType<typeof resolved>>[] = [];
    const requests: FreshnessVerificationRequest[] = [];
    const controller = new ProcedureFreshnessController<string>({
      verify(request) {
        requests.push(request);
        const result = deferred<ReturnType<typeof resolved>>();
        pending.push(result);
        return result.promise;
      },
      clock: runtime,
      scheduler: runtime,
      createRequestId: (sequence) => "request-" + sequence,
    });
    const current = target("user-a", "target-a");

    controller.enter(current);
    await flush();
    assert.equal(requests.length, 1);
    await runtime.advanceBy(5_000);
    pending[0].resolve(resolved(requests[0], 4, "body-a"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "body-a");

    await runtime.advanceBy(FRESHNESS_REVALIDATION_INTERVAL_MS - 1);
    assert.equal(requests.length, 1);
    await runtime.advanceBy(1);
    assert.equal(requests.length, 2);
    assert.equal(controller.getDisplayPermit(current)?.projection, "body-a");

    await runtime.elapseWithoutRunningTimers(
      FRESHNESS_MAX_AGE_MS - FRESHNESS_REVALIDATION_INTERVAL_MS,
    );
    assert.equal(controller.getDisplayPermit(current), undefined);
    pending[1].resolve(resolved(requests[1], 5, "body-b"));
    await flush();
    assert.equal(requests.length, 3);
    assert.equal(controller.state.status, "LOADING");
    assert.equal(controller.getDisplayPermit(current), undefined);
    pending[2].resolve(resolved(requests[2], 6, "body-c"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "body-c");
  });

  it("TC-RETRY-01 times out, retries once, stops after retry failure, and resumes only on re-entry", async () => {
    const runtime = new ManualRuntime();
    const pending: Deferred<unknown>[] = [];
    const requests: FreshnessVerificationRequest[] = [];
    const controller = new ProcedureFreshnessController<string>({
      verify(request) {
        requests.push(request);
        const result = deferred<unknown>();
        pending.push(result);
        return result.promise;
      },
      clock: runtime,
      scheduler: runtime,
      createRequestId: (sequence) => "request-" + sequence,
    });
    const current = target("user-a", "target-a");

    controller.enter(current);
    await flush();
    await runtime.advanceBy(FRESHNESS_REQUEST_TIMEOUT_MS);
    assert.equal(requests.length, 2);
    assert.equal(requests[0].signal.aborted, true);

    pending[0].resolve(resolved(requests[0], 1, "late-old"));
    pending[1].resolve({ status: "ERROR", reasonCode: "synthetic network failure" });
    await flush();
    assert.equal(controller.state.status, "FETCH_FAILED");
    assert.equal(controller.getDisplayPermit(current), undefined);

    await runtime.advanceBy(FRESHNESS_REVALIDATION_INTERVAL_MS * 3);
    assert.equal(requests.length, 2);

    controller.enter(current);
    await flush();
    assert.equal(requests.length, 3);
    pending[2].resolve(resolved(requests[2], 1, "recovered"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "recovered");
  });

  it("TC-ASYNC-01 discards old-generation responses and coalesces duplicate resume events", async () => {
    const runtime = new ManualRuntime();
    const pending: Deferred<ReturnType<typeof resolved>>[] = [];
    const requests: FreshnessVerificationRequest[] = [];
    const controller = new ProcedureFreshnessController<string>({
      verify(request) {
        requests.push(request);
        const result = deferred<ReturnType<typeof resolved>>();
        pending.push(result);
        return result.promise;
      },
      clock: runtime,
      scheduler: runtime,
      createRequestId: (sequence) => "request-" + sequence,
    });
    const firstTarget = target("user-a", "target-a");
    const nextTarget = target("user-b", "target-b");

    controller.enter(firstTarget);
    await flush();
    controller.enter(nextTarget);
    await flush();
    assert.equal(requests.length, 2);

    pending[0].resolve(resolved(requests[0], 8, "old-user-body"));
    await flush();
    assert.equal(controller.getDisplayPermit(nextTarget), undefined);

    controller.hide();
    controller.resume(nextTarget);
    controller.resume(nextTarget);
    await flush();
    assert.equal(requests.length, 3);

    pending[2].resolve(resolved(requests[2], 9, "current-body"));
    await flush();
    assert.equal(controller.getDisplayPermit(nextTarget)?.projection, "current-body");

    pending[1].resolve(resolved(requests[1], 9, "old-generation-body"));
    await flush();
    assert.equal(controller.getDisplayPermit(nextTarget)?.projection, "current-body");
  });

  it("TC-UI-SAME-TARGET-REENTRY-01 hides the prior body before a same-target request resolves", async () => {
    const runtime = new ManualRuntime();
    const pending: Deferred<ReturnType<typeof resolved>>[] = [];
    const requests: FreshnessVerificationRequest[] = [];
    const controller = new ProcedureFreshnessController<string>({
      verify(request) {
        requests.push(request);
        const result = deferred<ReturnType<typeof resolved>>();
        pending.push(result);
        return result.promise;
      },
      clock: runtime,
      scheduler: runtime,
      createRequestId: (sequence) => "request-" + sequence,
    });
    const current = target("user-a", "target-a");

    controller.enter(current);
    await flush();
    pending[0].resolve(resolved(requests[0], 4, "body-a"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "body-a");

    controller.enter(current);
    assert.equal(controller.getDisplayPermit(current), undefined);
    await flush();
    assert.equal(requests.length, 2);
    pending[1].resolve(resolved(requests[1], 5, "body-b"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "body-b");
  });

  it("clears the prior body when a new target is invalid", async () => {
    const runtime = new ManualRuntime();
    const pending: Deferred<ReturnType<typeof resolved>>[] = [];
    const requests: FreshnessVerificationRequest[] = [];
    const controller = new ProcedureFreshnessController<string>({
      verify(request) {
        requests.push(request);
        const result = deferred<ReturnType<typeof resolved>>();
        pending.push(result);
        return result.promise;
      },
      clock: runtime,
      scheduler: runtime,
      createRequestId: (sequence) => "request-" + sequence,
    });
    const current = target("user-a", "target-a");

    controller.enter(current);
    await flush();
    pending[0].resolve(resolved(requests[0], 1, "body-a"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "body-a");

    controller.enter(target("", ""));
    assert.equal(controller.getDisplayPermit(current), undefined);
    assert.deepEqual(controller.state, { status: "FETCH_FAILED", reasonCode: "INVALID_TARGET" });
  });

  it("TC-READ-02 rejects a response older than a revision observed after request start", async () => {
    const runtime = new ManualRuntime();
    const pending: Deferred<unknown>[] = [];
    const requests: FreshnessVerificationRequest[] = [];
    const controller = new ProcedureFreshnessController<string>({
      verify(request) {
        requests.push(request);
        const result = deferred<unknown>();
        pending.push(result);
        return result.promise;
      },
      clock: runtime,
      scheduler: runtime,
      createRequestId: (sequence) => "request-" + sequence,
    });
    const current = target("user-a", "target-a");

    controller.enter(current);
    await flush();
    controller.observeRevision(current.scope, 7);
    pending[0].resolve(resolved(requests[0], 6, "stale-revision"));
    await flush();
    assert.equal(requests.length, 2);
    assert.equal(controller.getDisplayPermit(current), undefined);

    pending[1].resolve(resolved(requests[1], 7, "current-revision"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "current-revision");
  });

  it("invalidates a rendered body when the observed facility revision advances", async () => {
    const runtime = new ManualRuntime();
    const pending: Deferred<unknown>[] = [];
    const requests: FreshnessVerificationRequest[] = [];
    const controller = new ProcedureFreshnessController<string>({
      verify(request) {
        requests.push(request);
        const result = deferred<unknown>();
        pending.push(result);
        return result.promise;
      },
      clock: runtime,
      scheduler: runtime,
      createRequestId: (sequence) => "request-" + sequence,
    });
    const current = target("user-a", "target-a");

    controller.enter(current);
    await flush();
    pending[0].resolve(resolved(requests[0], 6, "body-a"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "body-a");

    await runtime.advanceBy(FRESHNESS_REVALIDATION_INTERVAL_MS);
    controller.observeRevision(current.scope, 7);
    assert.equal(controller.getDisplayPermit(current), undefined);
    pending[1].resolve(resolved(requests[1], 6, "stale-body"));
    await flush();
    assert.equal(requests.length, 3);
    pending[2].resolve(resolved(requests[2], 7, "body-b"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "body-b");
  });

  it("rejects render-time stale permits even if the expiry timer has not run", async () => {
    const runtime = new ManualRuntime();
    const pending = deferred<ReturnType<typeof resolved>>();
    const requests: FreshnessVerificationRequest[] = [];
    const controller = new ProcedureFreshnessController<string>({
      verify(request) {
        requests.push(request);
        return pending.promise;
      },
      clock: runtime,
      scheduler: runtime,
      createRequestId: (sequence) => "request-" + sequence,
    });
    const current = target("user-a", "target-a");

    controller.enter(current);
    await flush();
    pending.resolve(resolved(requests[0], 1, "body"));
    await flush();
    assert.equal(controller.getDisplayPermit(current)?.projection, "body");
    await runtime.elapseWithoutRunningTimers(FRESHNESS_MAX_AGE_MS);
    assert.equal(controller.getDisplayPermit(current), undefined);
  });
});
