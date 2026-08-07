import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ASIA_TOKYO_TIME_ZONE,
  evaluateAccess,
  type AuthenticatedIdentity,
  type LookupResult,
} from "../../src/contracts";
import {
  HANDOFF_STATUS_ALLOWED_TRANSITIONS,
  HANDOFF_TRANSITION_ROLE_POLICY,
  getHandoffTransitionRequiredRoles,
  hasRolePolicyForEveryAllowedHandoffEdge,
} from "../../src/domain";

const context = {
  OrganizationId: "synthetic-org-001",
  SiteId: "synthetic-site-001",
  TimeZone: ASIA_TOKYO_TIME_ZONE,
} as const;

function identityWithRoles(
  roles: AuthenticatedIdentity["Roles"]
): LookupResult<AuthenticatedIdentity> {
  return {
    status: "FOUND",
    value: {
      Subject: "synthetic-subject-001",
      OrganizationId: context.OrganizationId,
      SiteId: context.SiteId,
      Roles: roles,
    },
  };
}

describe("Handoff transition role policy", () => {
  it("covers every accepted Handoff edge exactly once", () => {
    assert.equal(hasRolePolicyForEveryAllowedHandoffEdge(), true);
    assert.equal(
      HANDOFF_TRANSITION_ROLE_POLICY.length,
      HANDOFF_STATUS_ALLOWED_TRANSITIONS.length
    );

    for (const [from, to] of HANDOFF_STATUS_ALLOWED_TRANSITIONS) {
      const matches = HANDOFF_TRANSITION_ROLE_POLICY.filter(
        ([policyFrom, policyTo]) => policyFrom === from && policyTo === to
      );
      assert.equal(matches.length, 1);
    }
  });

  it("allows PLANNER or SERVICE_MANAGER for non-closing accepted edges", () => {
    const result = getHandoffTransitionRequiredRoles("pending", "included");
    assert.deepEqual(result, {
      ok: true,
      requiredRoles: ["PLANNER", "SERVICE_MANAGER"],
    });

    if (!result.ok) return;

    assert.deepEqual(
      evaluateAccess({
        context,
        identity: identityWithRoles(["PLANNER"]),
        requiredRoles: result.requiredRoles,
      }),
      { decision: "ALLOW", reason: "ROLE_ALLOWED" }
    );

    assert.deepEqual(
      evaluateAccess({
        context,
        identity: identityWithRoles(["SERVICE_MANAGER"]),
        requiredRoles: result.requiredRoles,
      }),
      { decision: "ALLOW", reason: "ROLE_ALLOWED" }
    );
  });

  it("requires SERVICE_MANAGER for acknowledged -> closed", () => {
    const result = getHandoffTransitionRequiredRoles(
      "acknowledged",
      "closed"
    );
    assert.deepEqual(result, {
      ok: true,
      requiredRoles: ["SERVICE_MANAGER"],
    });

    if (!result.ok) return;

    assert.deepEqual(
      evaluateAccess({
        context,
        identity: identityWithRoles(["PLANNER"]),
        requiredRoles: result.requiredRoles,
      }),
      { decision: "DENY", reason: "ROLE_NOT_ALLOWED" }
    );

    assert.deepEqual(
      evaluateAccess({
        context,
        identity: identityWithRoles(["SERVICE_MANAGER"]),
        requiredRoles: result.requiredRoles,
      }),
      { decision: "ALLOW", reason: "ROLE_ALLOWED" }
    );
  });

  it("does not grant admin or technical roles implicit Handoff authority", () => {
    const result = getHandoffTransitionRequiredRoles("pending", "included");
    assert.equal(result.ok, true);
    if (!result.ok) return;

    for (const role of ["SITE_ADMIN", "ORG_ADMIN", "SYSTEM_ADMIN"] as const) {
      assert.deepEqual(
        evaluateAccess({
          context,
          identity: identityWithRoles([role]),
          requiredRoles: result.requiredRoles,
        }),
        { decision: "DENY", reason: "ROLE_NOT_ALLOWED" }
      );
    }
  });

  it("rejects denied and malformed edges before role evaluation", () => {
    assert.deepEqual(
      getHandoffTransitionRequiredRoles("pending", "closed"),
      { ok: false, code: "INVALID_TRANSITION" }
    );
    assert.deepEqual(
      getHandoffTransitionRequiredRoles("unknown", "pending"),
      { ok: false, code: "MALFORMED_INPUT" }
    );
    assert.deepEqual(
      getHandoffTransitionRequiredRoles(null, "pending"),
      { ok: false, code: "MALFORMED_INPUT" }
    );
  });
});
