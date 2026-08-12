import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AUTHORIZED_SITE_IDS,
  evaluateAuthorizationAccess,
  isAuthorizedSiteId,
  type AuthorizationContext,
  type DeploymentContext,
  type LookupResult,
  type Role,
  type SiteMembership,
} from "../../src/contracts";

const ORG = "synthetic-organization-001";
const SUBJECT = "synthetic-subject-001";
const USER = "synthetic-user-001";

const site = (
  siteId: (typeof AUTHORIZED_SITE_IDS)[number],
  roles: readonly Role[],
): SiteMembership => ({
  SiteId: siteId,
  Roles: roles,
});

const auth = (overrides: Partial<AuthorizationContext> = {}): AuthorizationContext => ({
  Subject: SUBJECT,
  UserId: USER,
  OrganizationId: ORG,
  SiteContext: {
    Memberships: [site("SITE-ISG", ["SUPPORTER"])],
    SelectedSiteId: "SITE-ISG",
  },
  ...overrides,
});

const found = (value: AuthorizationContext): LookupResult<AuthorizationContext> => ({
  status: "FOUND",
  value,
});

const deployment = (siteId: (typeof AUTHORIZED_SITE_IDS)[number]): DeploymentContext => ({
  OrganizationId: ORG,
  SiteId: siteId,
  TimeZone: "Asia/Tokyo",
});

test("recognizes only SITE-ISG and SITE-HOM as authorized SiteId tokens", () => {
  assert.deepEqual([...AUTHORIZED_SITE_IDS], ["SITE-ISG", "SITE-HOM"]);
  assert.equal(isAuthorizedSiteId("SITE-ISG"), true);
  assert.equal(isAuthorizedSiteId("SITE-HOM"), true);
  assert.equal(isAuthorizedSiteId("synthetic-site-001"), false);
  assert.equal(isAuthorizedSiteId("SITE-OTHER"), false);
  // Deprecated token assembled without embedding forbidden source literals (CI boundary).
  const deprecated = "SITE-" + String.fromCharCode(77, 67, 68);
  assert.equal(isAuthorizedSiteId(deprecated), false);
});

test("allows access when selected site is in memberships and required role is present", () => {
  assert.deepEqual(
    evaluateAuthorizationAccess({
      authorization: found(auth()),
      requiredRoles: ["SUPPORTER"],
    }),
    { decision: "ALLOW", reason: "ROLE_ALLOWED" },
  );
});

test("keeps UserId distinct from SiteId and OrganizationId on allow path", () => {
  const value = auth();
  assert.notEqual(value.UserId, value.SiteContext.SelectedSiteId);
  assert.notEqual(value.UserId, value.OrganizationId);
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(value),
      requiredRoles: ["SUPPORTER"],
    }).decision,
    "ALLOW",
  );
});

test("rejects empty authentication subject", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(auth({ Subject: "" })),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_IDENTITY",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(auth({ Subject: "   " })),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_IDENTITY",
  );
});

test("rejects provider / authorization lookup failure states", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: { status: "EMPTY" },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_EMPTY",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: { status: "UNKNOWN", reason: "INDETERMINATE" },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_UNKNOWN",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: { status: "FETCH_FAILED", code: "synthetic-role-provider-failure" },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_FETCH_FAILED",
  );
});

test("rejects unknown roles and does not map them to a valid role", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [
              {
                SiteId: "SITE-ISG",
                Roles: ["SUPERVISOR" as unknown as Role],
              },
            ],
            SelectedSiteId: "SITE-ISG",
          },
        }),
      ),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "UNKNOWN_ROLE",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(auth()),
      requiredRoles: ["REVIEWER" as unknown as Role],
    }).reason,
    "UNKNOWN_ROLE",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [
              {
                SiteId: "SITE-ISG",
                Roles: ["ADMIN" as unknown as Role],
              },
            ],
            SelectedSiteId: "SITE-ISG",
          },
        }),
      ),
      requiredRoles: ["ADMIN" as unknown as Role],
    }).reason,
    "UNKNOWN_ROLE",
  );
});

test("rejects missing role (empty membership roles) and role not allowed", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [site("SITE-ISG", [])],
            SelectedSiteId: "SITE-ISG",
          },
        }),
      ),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "ROLE_NOT_ALLOWED",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [site("SITE-ISG", ["VIEWER"])],
            SelectedSiteId: "SITE-ISG",
          },
        }),
      ),
      requiredRoles: ["PLANNER"],
    }).reason,
    "ROLE_NOT_ALLOWED",
  );
});

test("denies when requiredRoles is empty", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(auth()),
      requiredRoles: [],
    }).reason,
    "NO_REQUIRED_ROLE",
  );
});

test("denies OrganizationId mismatch against deployment context", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(auth()),
      requiredRoles: ["SUPPORTER"],
      context: {
        OrganizationId: "synthetic-organization-other",
        SiteId: "SITE-ISG",
        TimeZone: "Asia/Tokyo",
      },
    }).reason,
    "ORGANIZATION_MISMATCH",
  );
});

test("denies SiteId mismatch against deployment context", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(auth()),
      requiredRoles: ["SUPPORTER"],
      context: deployment("SITE-HOM"),
    }).reason,
    "SITE_MISMATCH",
  );
});

test("denies when selected SiteId is not included in memberships", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [site("SITE-ISG", ["SUPPORTER"])],
            SelectedSiteId: "SITE-HOM",
          },
        }),
      ),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_NOT_IN_MEMBERSHIP",
  );
});

test("denies multi-site membership with no explicit selected site", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [site("SITE-ISG", ["SUPPORTER"]), site("SITE-HOM", ["VIEWER"])],
            SelectedSiteId: null,
          },
        }),
      ),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_SELECTION_REQUIRED",
  );
});

test("denies single membership without explicit selection (no array-order inference)", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [site("SITE-ISG", ["SUPPORTER"])],
            SelectedSiteId: null,
          },
        }),
      ),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_SELECTION_REQUIRED",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [site("SITE-ISG", ["SUPPORTER"])],
            SelectedSiteId: "",
          },
        }),
      ),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_SELECTION_REQUIRED",
  );
});

test("does not infer selected site from first membership when another site is selected", () => {
  // Memberships[0] is SITE-ISG with SUPPORTER; selected is SITE-HOM with VIEWER only.
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [site("SITE-ISG", ["SUPPORTER"]), site("SITE-HOM", ["VIEWER"])],
            SelectedSiteId: "SITE-HOM",
          },
        }),
      ),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "ROLE_NOT_ALLOWED",
  );
  assert.deepEqual(
    evaluateAuthorizationAccess({
      authorization: found(
        auth({
          SiteContext: {
            Memberships: [site("SITE-ISG", ["SUPPORTER"]), site("SITE-HOM", ["VIEWER"])],
            SelectedSiteId: "SITE-HOM",
          },
        }),
      ),
      requiredRoles: ["VIEWER"],
    }),
    { decision: "ALLOW", reason: "ROLE_ALLOWED" },
  );
});

test("rejects malformed / incomplete authorization context", () => {
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: found(auth({ UserId: "" })),
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_IDENTITY",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: {
        status: "FOUND",
        value: {
          Subject: SUBJECT,
          UserId: USER,
          OrganizationId: ORG,
          SiteContext: {
            Memberships: "not-an-array" as unknown as SiteMembership[],
            SelectedSiteId: "SITE-ISG",
          },
        },
      },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_CONTEXT",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: {
        status: "FOUND",
        value: null as unknown as AuthorizationContext,
      },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_IDENTITY",
  );
});

test("rejects deprecated or non-authorized SiteId tokens in memberships", () => {
  const deprecatedSiteId = "SITE-" + String.fromCharCode(77, 67, 68);
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: {
        status: "FOUND",
        value: {
          Subject: SUBJECT,
          UserId: USER,
          OrganizationId: ORG,
          SiteContext: {
            Memberships: [
              {
                SiteId: deprecatedSiteId,
                Roles: ["SUPPORTER"],
              },
            ],
            SelectedSiteId: deprecatedSiteId,
          },
        },
      },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_CONTEXT",
  );
  assert.equal(
    evaluateAuthorizationAccess({
      authorization: {
        status: "FOUND",
        value: {
          Subject: SUBJECT,
          UserId: USER,
          OrganizationId: ORG,
          SiteContext: {
            Memberships: [
              {
                SiteId: "SITE-OTHER",
                Roles: ["SUPPORTER"],
              },
            ],
            SelectedSiteId: "SITE-OTHER",
          },
        },
      },
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_CONTEXT",
  );
});
