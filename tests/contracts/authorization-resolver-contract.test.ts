import assert from "node:assert/strict";
import { test } from "node:test";
import {
  InMemorySiteMembershipProvider,
  composeAuthorizationContext,
  evaluateResolvedAuthorizationAccess,
  type AuthorizationPrincipal,
  type AuthorizedSiteId,
  type LookupResult,
  type Role,
  type SiteMembership,
} from "../../src/contracts";

const ORG = "synthetic-organization-001";
const SUBJECT = "synthetic-subject-001";
const USER = "synthetic-user-001";

const principal: AuthorizationPrincipal = {
  Subject: SUBJECT,
  UserId: USER,
  OrganizationId: ORG,
};

const foundPrincipal = (): LookupResult<AuthorizationPrincipal> => ({
  status: "FOUND",
  value: principal,
});

const site = (siteId: AuthorizedSiteId, roles: readonly Role[]): SiteMembership => ({
  SiteId: siteId,
  Roles: roles,
});

const foundMemberships = (
  memberships: readonly SiteMembership[],
): LookupResult<readonly SiteMembership[]> => ({
  status: "FOUND",
  value: memberships,
});

test("composes AuthorizationContext from principal, memberships, and explicit selection", () => {
  const composed = composeAuthorizationContext({
    principal: foundPrincipal(),
    memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
    selectedSiteId: "SITE-ISG",
  });
  assert.equal(composed.status, "FOUND");
  if (composed.status !== "FOUND") return;
  assert.equal(composed.value.Subject, SUBJECT);
  assert.equal(composed.value.UserId, USER);
  assert.equal(composed.value.OrganizationId, ORG);
  assert.equal(composed.value.SiteContext.SelectedSiteId, "SITE-ISG");
  assert.deepEqual(composed.value.SiteContext.Memberships, [site("SITE-ISG", ["SUPPORTER"])]);
});

test("allows resolved access when selection matches membership and role", () => {
  assert.deepEqual(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }),
    { decision: "ALLOW", reason: "ROLE_ALLOWED" },
  );
});

test("propagates principal EMPTY / UNKNOWN / FETCH_FAILED without success", () => {
  assert.deepEqual(
    composeAuthorizationContext({
      principal: { status: "EMPTY" },
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: "SITE-ISG",
    }),
    { status: "EMPTY" },
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: { status: "EMPTY" },
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_EMPTY",
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: { status: "UNKNOWN", reason: "NOT_AUTHENTICATED" },
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_UNKNOWN",
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: { status: "FETCH_FAILED", code: "synthetic-principal-fetch-failed" },
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_FETCH_FAILED",
  );
});

test("maps inactive/disabled principal only via LookupResult EMPTY (no AccountStatus)", () => {
  // Inactive / disabled accounts are represented as provider EMPTY — no new vocabulary.
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: { status: "EMPTY" },
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).decision,
    "DENY",
  );
});

test("propagates membership EMPTY / UNKNOWN / FETCH_FAILED without success", () => {
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: { status: "EMPTY" },
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_EMPTY",
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: { status: "UNKNOWN", reason: "INDETERMINATE" },
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_UNKNOWN",
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: { status: "FETCH_FAILED", code: "synthetic-membership-fetch-failed" },
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_FETCH_FAILED",
  );
});

test("zero membership must not authorize", () => {
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([]),
      selectedSiteId: null,
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_SELECTION_REQUIRED",
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([]),
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_NOT_IN_MEMBERSHIP",
  );
});

test("single membership without explicit selection must not silently authorize", () => {
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: null,
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_SELECTION_REQUIRED",
  );
});

test("multiple memberships without selection must fail closed", () => {
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([
        site("SITE-ISG", ["SUPPORTER"]),
        site("SITE-HOM", ["VIEWER"]),
      ]),
      selectedSiteId: null,
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_SELECTION_REQUIRED",
  );
});

test("never infers selected site from first/array-order membership", () => {
  const composed = composeAuthorizationContext({
    principal: foundPrincipal(),
    memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"]), site("SITE-HOM", ["VIEWER"])]),
    selectedSiteId: null,
  });
  assert.equal(composed.status, "FOUND");
  if (composed.status !== "FOUND") return;
  assert.equal(composed.value.SiteContext.SelectedSiteId, null);
  assert.notEqual(
    composed.value.SiteContext.SelectedSiteId,
    composed.value.SiteContext.Memberships[0]?.SiteId,
  );

  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([
        site("SITE-ISG", ["SUPPORTER"]),
        site("SITE-HOM", ["VIEWER"]),
      ]),
      selectedSiteId: "SITE-HOM",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "ROLE_NOT_ALLOWED",
  );
  assert.deepEqual(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([
        site("SITE-ISG", ["SUPPORTER"]),
        site("SITE-HOM", ["VIEWER"]),
      ]),
      selectedSiteId: "SITE-HOM",
      requiredRoles: ["VIEWER"],
    }),
    { decision: "ALLOW", reason: "ROLE_ALLOWED" },
  );
});

test("selected site outside memberships must fail closed", () => {
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: "SITE-HOM",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_NOT_IN_MEMBERSHIP",
  );
});

test("unknown/deprecated SiteId must fail closed", () => {
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([
        {
          SiteId: "SITE-OTHER",
          Roles: ["SUPPORTER"],
        },
      ]),
      selectedSiteId: "SITE-OTHER",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_CONTEXT",
  );
  const deprecated = "SITE-" + String.fromCharCode(77, 67, 68);
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: foundMemberships([
        {
          SiteId: deprecated,
          Roles: ["SUPPORTER"],
        },
      ]),
      selectedSiteId: deprecated,
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "INVALID_CONTEXT",
  );
});

test("malformed provider data must fail closed", () => {
  assert.deepEqual(
    composeAuthorizationContext({
      principal: foundPrincipal(),
      memberships: {
        status: "FOUND",
        value: "not-an-array" as unknown as readonly SiteMembership[],
      },
      selectedSiteId: "SITE-ISG",
    }),
    { status: "UNKNOWN", reason: "INDETERMINATE" },
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: {
        status: "FOUND",
        value: {
          Subject: "",
          UserId: USER,
          OrganizationId: ORG,
        },
      },
      memberships: foundMemberships([site("SITE-ISG", ["SUPPORTER"])]),
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_EMPTY",
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships: {
        status: "FOUND",
        value: [{ SiteId: "SITE-ISG", Roles: "SUPPORTER" as unknown as readonly Role[] }],
      },
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "AUTH_UNKNOWN",
  );
});

test("InMemorySiteMembershipProvider resolves synthetic memberships without tenant I/O", async () => {
  const provider = new InMemorySiteMembershipProvider([
    {
      principalKey: InMemorySiteMembershipProvider.keyFor(principal),
      memberships: foundMemberships([
        site("SITE-ISG", ["SUPPORTER"]),
        site("SITE-HOM", ["VIEWER"]),
      ]),
    },
  ]);
  const memberships = await provider.resolveMemberships(principal);
  assert.equal(memberships.status, "FOUND");
  assert.deepEqual(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships,
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["SUPPORTER"],
    }),
    { decision: "ALLOW", reason: "ROLE_ALLOWED" },
  );
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: foundPrincipal(),
      memberships,
      selectedSiteId: null,
      requiredRoles: ["SUPPORTER"],
    }).reason,
    "SITE_SELECTION_REQUIRED",
  );
  const missing = await provider.resolveMemberships({
    Subject: "synthetic-subject-missing",
    UserId: "synthetic-user-missing",
    OrganizationId: ORG,
  });
  assert.deepEqual(missing, { status: "EMPTY" });
});

test("does not infer roles from email/display name/URL/SharePoint path fields", () => {
  const pollutedPrincipal = {
    Subject: SUBJECT,
    UserId: USER,
    OrganizationId: ORG,
    displayName: "Planner Person",
    email: "ignored-value",
    url: "ignored-path",
  } as AuthorizationPrincipal & {
    displayName: string;
    email: string;
    url: string;
  };
  assert.equal(
    evaluateResolvedAuthorizationAccess({
      principal: { status: "FOUND", value: pollutedPrincipal },
      memberships: foundMemberships([site("SITE-ISG", ["VIEWER"])]),
      selectedSiteId: "SITE-ISG",
      requiredRoles: ["PLANNER"],
    }).reason,
    "ROLE_NOT_ALLOWED",
  );
});
