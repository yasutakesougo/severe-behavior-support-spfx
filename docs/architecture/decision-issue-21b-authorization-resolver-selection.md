# #21-B — Authorization Context Resolver Orchestration（synthetic）— Human Selection Packet

この文書は、Issue #21 の次独立スライスとして
**#21-B — Authorization Context Resolver Orchestration（synthetic）** を固定する
docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-21B-AUTHORIZATION-RESOLVER-1
Kind: Human Selection（Issue #21 next independently implementable slice）
Status: SELECTED / LOCKED（GO boundary）
Human Decision: SELECT #21-B — Authorization Context Resolver Orchestration（synthetic）
Date: 2026-08-12
PR: (this Selection / Acceptance / Independence Review PR)

Baseline:
  main tip = 40c21f4cc8a6e05a28387051dcec289f1bab7eca
  #21-A = COMPLETE（PR #292 Selection + PR #293 Implementation）
  Decision-ISSUE-21A-AUTHORIZATION-SITECONTEXT-1 = Accepted / LOCKED
  Issue #21 = OPEN / KEEP OPEN（body STALE）
  #22 overall = OPEN / PARTIAL
  #23 P0 acceptance = OPEN / design READY / execution HOLD
  #28 presentation boundary = CLOSED / COMPLETE
  #68〜#71 business UI = NOT STARTED

Candidate origin:
  Issue #21 post-#21-A reassessment（read-only）
  Human explicit: SELECT #21-B

Implementation Start: NOT AUTHORIZED（separate Human GO）
Issue #21 Close: NOT AUTHORIZED
#21-C / live Entra–SharePoint slice: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human）
```

## 1. Why this slice now

```text
#21-A は AuthorizationContext / SiteContext を評価する純契約を完了した。
一方、principal + memberships + selection を AuthorizationContext へ合成する層は未着手。

既存 AuthenticationProvider / RoleProvider は単一 SiteId の
AuthenticatedIdentity / Role[] 形であり、multi-site AuthorizationContext 合成を担えない。
次の独立ギャップは synthetic provider doubles による resolver orchestration である。

#4 live tenant / #22 / #23 E2E は本スライスに不要。
```

## 2. Selected unit

```text
#21-B
Authorization Context Resolver Orchestration（synthetic）
```

## 3. Locked reuse（再 Decision しない）

| Item | Status | Notes |
|---|---|---|
| Decision-ISSUE-21A-AUTHORIZATION-SITECONTEXT-1 | Accepted / LOCKED | #21-A boundary |
| AuthorizationContext / SiteContext / SiteMembership | DELIVERED | PR #293 |
| AUTHORIZED_SITE_IDS = SITE-ISG / SITE-HOM | LOCKED | URL hard-code OUT |
| evaluateAuthorizationAccess | DELIVERED | reuse；do not re-implement |
| formal Role ×7 | LOCKED | no second enum |
| LookupResult EMPTY / UNKNOWN / FETCH_FAILED | LOCKED | fail-closed vocabulary |
| #28 presentation | COMPLETE | display-only；≠ auth compose |

## 4. Authorized IN（Selection scope）

```text
IN:
  pure / application-layer resolver orchestration
  provider port(s) that can supply multi-site membership inputs
    （do not force-fit single-site AuthenticatedIdentity alone）
  compose provider results → AuthorizationContext
  zero / one / multiple membership synthetic cases
  propagate provider EMPTY / UNKNOWN / FETCH_FAILED without new success paths
  inactive / disabled only as LookupResult fail-closed mapping
    （no new AccountStatus enum invention）
  synthetic in-memory provider doubles
  repository-local integration-style / contract tests
  reuse evaluateAuthorizationAccess / formal Role ×7 / AUTHORIZED_SITE_IDS
```

## 5. Explicit OUT / FORBIDDEN

```text
OUT:
  Microsoft Graph / Entra API / real groups / real disable directory lookup
  SharePoint REST / permission probing
  #22 adapter / #22B / binder host wiring / live tenant I/O
  browser UI / #28 presentation changes / #68〜#71
  #23 E2E ownership or execution
  AUTH-001〜009 prose invention
  AccountStatus / disabled enum invention beyond LookupResult mapping
  SharePoint URL hard-coding（sbs-* / severe-support-*）
  Issue #21 Close
  Issue #21 GitHub body mutation（Human-only / 別工程）
  Implementation Start（this Selection alone）
  #21-C / live Entra–SharePoint slice auto-select
  Ready / Merge auto-progress
```

## 6. Independence Check（candidate recorded at Selection）

```text
#19 GOV-STAFF = NOT REQUIRED
#4 live tenant = NOT REQUIRED
#22 adapter = NOT REQUIRED
#23 P0 acceptance execution = NOT REQUIRED
#28 presentation = COMPLETE / NOT REQUIRED for compose
#68〜#71 = NOT REQUIRED

Independence Verdict Candidate:
  Independent = YES — CANDIDATE
  Reason:
    synthetic provider doubles only
    no live I/O
    no Entra / SharePoint mutation
    reuses #21-A evaluateAuthorizationAccess
    does not take #23 E2E ownership
```

正式 Independence Review は Selection / Acceptance 正本化後に実施する。

## 7. Stop condition

```text
Decision-ISSUE-21B-AUTHORIZATION-RESOLVER-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO

Still NOT AUTHORIZED:
  code Implementation Start
  Issue #21 Close
  #21-C / live Entra–SharePoint
  #22 / #23 / #68〜#71 continuation
  Graph / Entra / SharePoint / Deploy
```

## Reference

- Acceptance: `decision-issue-21b-authorization-resolver-acceptance.md`
- Independence Review: `decision-issue-21b-authorization-resolver-independent-review.md`
- Prior: `decision-issue-21a-authorization-sitecontext-acceptance.md`
- Prior: `issue-21a-authorization-sitecontext-implementation-start.md`
- Prior: `contracts-v1.md`
- Issue #21 remains OPEN; Close = NOT AUTHORIZED
- Next gate after Selection docs: Independence Review → separate Implementation Start Decision
