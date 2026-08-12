# #21-A — Authorization / SiteContext Pure Contract Boundary — Implementation Start

```text
Issue: #21
Unit: #21-A — Authorization / SiteContext Pure Contract Boundary
Status: Implementation Start AUTHORIZED / delivery in Draft PR
Decision ID: Decision-ISSUE-21A-AUTHORIZATION-SITECONTEXT-1 = Accepted / LOCKED
Selection / Acceptance / IR: MERGED via PR #292
Independent Review: PASS（Independent = YES；P0=0 / P1=0；P2 OPEN non-blocking）
Human Implementation Start: GO（2026-08-12）
Baseline tip: 32f9da406bc13a18bc4ebbce20c36258282908e5
PR: #293（Implementation Draft；Ready / Merge = HUMAN-ONLY）
Issue #21 Close: NOT AUTHORIZED
#21-B auto-start: FORBIDDEN
#22 adapter continuation: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
Graph / Entra / SharePoint / live I/O / UI / Deploy mutations: 0
```

Depends on（再 Decision しない）:
[`decision-issue-21a-authorization-sitecontext-selection.md`](./decision-issue-21a-authorization-sitecontext-selection.md)
[`decision-issue-21a-authorization-sitecontext-acceptance.md`](./decision-issue-21a-authorization-sitecontext-acceptance.md)
[`decision-issue-21a-authorization-sitecontext-independent-review.md`](./decision-issue-21a-authorization-sitecontext-independent-review.md)
[`contracts-v1.md`](./contracts-v1.md)

## Authority

```text
PR #292 Merge = Selection / Acceptance / IR boundary only
PR #292 merge ≠ Implementation Start

This document records the separate Human GO for Implementation Start
and the delivery evidence for the pure-contract slice.
```

## Implemented contract behavior

```text
Types:
  AUTHORIZED_SITE_IDS / AuthorizedSiteId
  SiteMembership
  SiteContext
  AuthorizationContext
  AccessDecision reasons += SITE_SELECTION_REQUIRED | SITE_NOT_IN_MEMBERSHIP

Ports:
  AuthorizationAccessPolicy（pure；no I/O）

Resolver:
  evaluateAuthorizationAccess
    → explicit SelectedSiteId + Memberships match
    → reuse evaluateAccess for org/site/role fail-closed
  isAuthorizedSiteId
```

## Fail-closed coverage

| Case | Reason |
|---|---|
| empty authentication subject | INVALID_IDENTITY |
| unknown role（membership or requiredRoles） | UNKNOWN_ROLE |
| missing / empty membership roles | ROLE_NOT_ALLOWED |
| empty requiredRoles | NO_REQUIRED_ROLE |
| provider / auth lookup EMPTY | AUTH_EMPTY |
| provider / auth lookup UNKNOWN | AUTH_UNKNOWN |
| provider / auth lookup FETCH_FAILED | AUTH_FETCH_FAILED |
| OrganizationId mismatch | ORGANIZATION_MISMATCH |
| SiteId mismatch vs deployment context | SITE_MISMATCH |
| selected SiteId ∉ memberships | SITE_NOT_IN_MEMBERSHIP |
| multi-site / any membership without explicit selection | SITE_SELECTION_REQUIRED |
| malformed / incomplete AuthorizationContext | INVALID_IDENTITY / INVALID_CONTEXT |
| deprecated / non-authorized SiteId token | INVALID_CONTEXT |
| no inference from membership array order | covered by selected≠first tests |

## Authorized SiteId tokens

```text
SITE-ISG
SITE-HOM
```

FORBIDDEN in this slice:

```text
hard-coded SharePoint URLs
/sites/sbs-*
/sites/severe-support-*
SITE-MCD / MCD / SITE-MACHIDA
site inference from URL
```

## Explicit OUT（unchanged）

```text
Microsoft Graph / Entra API / group creation / real membership
Conditional Access
SharePoint permission probing / REST
#22 / #22B / binder host wiring / live tenant I/O
transfer / retirement runtime
Entra group removal automation
business UI / #68〜#71
SPFx shell presentation changes
Issue #21 body mutation / Close
Deploy / Production
AUTH-001〜009 prose invention
```

## Verification

```text
baseline: 32f9da406bc13a18bc4ebbce20c36258282908e5
verify:ci: PASS（local）
  verify:skills: PASS
  lint: PASS
  format:check: PASS
  typecheck: PASS
  npm test: PASS — 540 / 540（#21-A file: 16 / 16 PASS）
  check:contracts-boundaries: PASS
  check:scope: PASS（6 changed files；contracts + evidence docs only）

OUT-scope mutation confirmation:
  Graph / Entra dependency added = 0
  SharePoint dependency added = 0
  live I/O = 0
  UI mutation = 0
  #22 mutation = 0
  M365 mutation = 0
```

## Non-claims

```text
This Implementation Start ≠ Issue #21 Close
This Implementation Start ≠ #21-B
This Implementation Start ≠ Graph / Entra / SharePoint integration
This Implementation Start ≠ Ready / Merge auto-progress
```
