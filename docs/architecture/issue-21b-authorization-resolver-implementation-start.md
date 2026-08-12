# #21-B — Authorization Context Resolver Orchestration（synthetic）— Implementation Start

```text
Issue: #21
Unit: #21-B — Authorization Context Resolver Orchestration（synthetic）
Status: Implementation Start AUTHORIZED / delivery in Draft PR
Decision ID: Decision-ISSUE-21B-AUTHORIZATION-RESOLVER-1 = Accepted / LOCKED
Selection / Acceptance / IR: MERGED via PR #294
Independent Review: PASS（P0=0 / P1=0；P2 OPEN non-blocking）
Human Implementation Start: GO（2026-08-12）
Baseline tip: 93da240278be91f1b68f4c27171b23058f3db63e
PR: (this Implementation Draft PR)
Issue #21 Close: NOT AUTHORIZED
#21-C auto-start: FORBIDDEN
#22 adapter continuation: NOT AUTHORIZED
#23 E2E ownership / execution: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
Graph / Entra / SharePoint / live I/O / UI / Deploy mutations: 0
```

Depends on（再 Decision しない）:
[`decision-issue-21b-authorization-resolver-selection.md`](./decision-issue-21b-authorization-resolver-selection.md)
[`decision-issue-21b-authorization-resolver-acceptance.md`](./decision-issue-21b-authorization-resolver-acceptance.md)
[`decision-issue-21b-authorization-resolver-independent-review.md`](./decision-issue-21b-authorization-resolver-independent-review.md)
[`issue-21a-authorization-sitecontext-implementation-start.md`](./issue-21a-authorization-sitecontext-implementation-start.md)
[`contracts-v1.md`](./contracts-v1.md)

## Authority

```text
PR #294 Merge = Selection / Acceptance / IR boundary only
PR #294 merge ≠ Implementation Start

This document records the separate Human GO for Implementation Start
and the delivery evidence for the synthetic resolver slice.
```

## Implemented surface

```text
Types:
  AuthorizationPrincipal

Ports:
  SiteMembershipProvider
  AuthorizationContextResolver

Composer / orchestration:
  composeAuthorizationContext
  evaluateResolvedAuthorizationAccess
    → compose then reuse evaluateAuthorizationAccess（no re-implementation）

Synthetic double:
  InMemorySiteMembershipProvider
```

## Fail-closed coverage

| Case | Expected |
|---|---|
| principal EMPTY / UNKNOWN / FETCH_FAILED | propagate；DENY via evaluateAuthorizationAccess |
| memberships EMPTY / UNKNOWN / FETCH_FAILED | propagate；DENY |
| inactive/disabled | principal EMPTY only（no AccountStatus） |
| zero memberships | DENY（selection-required or not-in-membership） |
| single membership without selection | SITE_SELECTION_REQUIRED |
| multiple memberships without selection | SITE_SELECTION_REQUIRED |
| no first/array-order inference | SelectedSiteId stays null / explicit only |
| selected ∉ memberships | SITE_NOT_IN_MEMBERSHIP |
| unknown/deprecated SiteId | INVALID_CONTEXT |
| malformed provider data | UNKNOWN / AUTH_EMPTY / AUTH_UNKNOWN |

## Explicit OUT（unchanged）

```text
AccountStatus enum / new account-status vocabulary
AUTH-001〜009 prose invention
Microsoft Graph / Entra API / real groups / real disable lookup
SharePoint REST / permission probing
#22 / #22B / binder / live tenant I/O
#23 E2E ownership or execution
#28 presentation changes
#68〜#71
Issue #21 body mutation / Close
#21-C auto-start
Deploy / Production
```

## Verification

```text
baseline: 93da240278be91f1b68f4c27171b23058f3db63e
verify:ci: PASS（local）
  verify:skills: PASS
  lint: PASS
  format:check: PASS
  typecheck: PASS
  npm test: PASS — 554 / 554（#21-B file: 14 / 14 PASS）
  check:contracts-boundaries: PASS
  check:scope: PASS（8 changed files；contracts + evidence docs only）

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
This Implementation Start ≠ #21-C
This Implementation Start ≠ Graph / Entra / SharePoint integration
This Implementation Start ≠ #23 E2E
This Implementation Start ≠ Ready / Merge auto-progress
```
