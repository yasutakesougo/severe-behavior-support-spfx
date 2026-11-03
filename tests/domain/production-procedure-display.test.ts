import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { FRESHNESS_MAX_AGE_MS } from "../../src/domain/support-plan-freshness";
import {
  getProductionProcedureDisplay,
  type ProductionDisplayExpectation,
} from "../../src/domain/production-procedure-display";

const target = {
  scope: { organizationId: "org-a", siteId: "site-a", userId: "user-a" },
  targetKey: "target-a",
};

const token = {
  scope: target.scope,
  targetKey: target.targetKey,
  generation: 3,
  requestId: "req-3",
  revision: 12,
  startedAtWallMs: 1000,
  startedAtMonotonicMs: 500,
  expiresAtWallMs: 1000 + FRESHNESS_MAX_AGE_MS,
  expiresAtMonotonicMs: 500 + FRESHNESS_MAX_AGE_MS,
  consistency: "DOUBLE_READ_VERIFIED" as const,
};

const expected: ProductionDisplayExpectation = {
  target,
  generation: 3,
  requestId: "req-3",
  minimumRevision: 12,
  wallNowMs: 2000,
  monotonicNowMs: 1500,
};

describe("production-only procedure display gate", () => {
  it("TC-UI-PRODUCTION-LEGACY-REJECT-01 requires explicit production RESOLVED and a current matching token", () => {
    assert.deepEqual(
      getProductionProcedureDisplay(
        { lookupStatus: "RESOLVED", source: "PRODUCTION", projection: "verified body", token },
        expected,
      ),
      { status: "VISIBLE", projection: "verified body", token },
    );
  });

  it("TC-UI-PRODUCTION-LEGACY-REJECT-01 rejects synthetic, legacy, and status-free inputs", () => {
    for (const input of [
      { lookupStatus: "SYNTHETIC_V3", source: "SYNTHETIC", projection: "body", token },
      { lookupStatus: "RESOLVED", source: "SYNTHETIC", projection: "body", token },
      { lookupStatus: undefined, projection: "legacy body", token },
    ]) {
      assert.deepEqual(getProductionProcedureDisplay(input, expected), { status: "HIDDEN" });
    }
  });

  it("rejects stale, wrong-scope, wrong-generation, and older-revision tokens", () => {
    const cases = [
      { ...expected, wallNowMs: token.expiresAtWallMs },
      { ...expected, target: { ...target, scope: { ...target.scope, userId: "user-b" } } },
      { ...expected, generation: expected.generation + 1 },
      { ...expected, requestId: "old-request" },
      { ...expected, minimumRevision: token.revision + 1 },
    ];

    for (const expectation of cases) {
      assert.deepEqual(
        getProductionProcedureDisplay(
          { lookupStatus: "RESOLVED", source: "PRODUCTION", projection: "body", token },
          expectation,
        ),
        { status: "HIDDEN" },
      );
    }
  });

  it("keeps the first re-entry render hidden for an expired monotonic deadline or prior revision token", () => {
    const staleCases = [
      { ...expected, wallNowMs: token.startedAtWallMs, monotonicNowMs: token.expiresAtMonotonicMs },
      { ...expected, generation: expected.generation + 1, requestId: "re-entry-request" },
      { ...expected, minimumRevision: token.revision + 1 },
    ];
    for (const expectation of staleCases) {
      assert.deepEqual(
        getProductionProcedureDisplay(
          { lookupStatus: "RESOLVED", source: "PRODUCTION", projection: "old body", token },
          expectation,
        ),
        { status: "HIDDEN" },
      );
    }
  });
});
