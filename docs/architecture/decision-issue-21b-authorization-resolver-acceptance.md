# #21-B — Authorization Context Resolver Orchestration（synthetic）— Human Acceptance（SELECT）

この文書は、**#21-B — Authorization Context Resolver Orchestration（synthetic）** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-issue-21b-authorization-resolver-selection.md`](./decision-issue-21b-authorization-resolver-selection.md)

Depends on（再 Decision しない）:
[`decision-issue-21a-authorization-sitecontext-acceptance.md`](./decision-issue-21a-authorization-sitecontext-acceptance.md)
[`issue-21a-authorization-sitecontext-implementation-start.md`](./issue-21a-authorization-sitecontext-implementation-start.md)
[`contracts-v1.md`](./contracts-v1.md)
Issue #21-A COMPLETE（PR #292 + PR #293）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-21B-AUTHORIZATION-RESOLVER-1
Status: Accepted / LOCKED（Selection boundary）
Human Decision: SELECT #21-B — Authorization Context Resolver Orchestration（synthetic）
Human Acceptance date: 2026-08-12
Issue: #21
PR: (this Selection / Acceptance / Independence Review PR)
Baseline tip: 40c21f4cc8a6e05a28387051dcec289f1bab7eca

Selected:
  Authorization Context Resolver Orchestration（synthetic）

Implementation Start: NOT AUTHORIZED（separate Human GO）
Issue #21 Close: NOT AUTHORIZED
#21-C / live Entra–SharePoint: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
#23 E2E ownership / execution: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT #21-B — Authorization Context Resolver Orchestration（synthetic）
Decision-ISSUE-21B-AUTHORIZATION-RESOLVER-1: Accepted / LOCKED

Meaning:
  authorize the next #21 independently implementable slice boundary now
  keep Implementation Start as a later separate Human GO
  keep Issue #21 OPEN / KEEP OPEN after #21-A
```

## Accepted Scope

```text
IN:
  resolver orchestration（application / contracts layer）
  multi-site membership-capable provider port(s)
  compose → AuthorizationContext
  zero / one / multiple membership synthetic cases
  LookupResult EMPTY / UNKNOWN / FETCH_FAILED propagation
  inactive / disabled only via LookupResult fail-closed mapping
  synthetic in-memory doubles
  repository-local tests
  reuse evaluateAuthorizationAccess / Role ×7 / AUTHORIZED_SITE_IDS

SiteId tokens:
  SITE-ISG
  SITE-HOM
```

## Boundary

```text
SELECT #21-B ≠ Implementation Start
SELECT #21-B ≠ Issue #21 Close
SELECT #21-B ≠ Graph / Entra / real membership / real disable lookup
SELECT #21-B ≠ SharePoint REST / permission probing
SELECT #21-B ≠ #22 adapter / live I/O / binder host wiring
SELECT #21-B ≠ #23 E2E ownership or execution
SELECT #21-B ≠ browser UI / #28 presentation / #68〜#71
SELECT #21-B ≠ AccountStatus enum invention
SELECT #21-B ≠ AUTH-001〜009 prose invention
SELECT #21-B ≠ Deploy / Microsoft 365 mutation
SELECT #21-B ≠ Issue #21 GitHub body mutation

#21-A evaluateAuthorizationAccess = reuse（do not re-implement access decision）
single-site AuthenticatedIdentity alone = insufficient for multi-site compose
Issue #21 body tip / Implementation HOLD markers = STALE
  repository Accepted / LOCKED docs + this Decision govern the slice boundary
```

## Current execution snapshot

```text
Selection = SELECTED / LOCKED
Selection docs PR = this draft（Ready / Merge = HUMAN-ONLY）
Independence Review = PASS（recorded；≠ Implementation Start）
Implementation Start = NOT AUTHORIZED
Issue #21 = OPEN / KEEP OPEN
#21-A = COMPLETE
#22 = OPEN / PARTIAL（independent）
#23 = OPEN（verification owner；not this slice）
#28 = CLOSED / COMPLETE（presentation）
#68〜#71 = NOT STARTED / OUT
```

## Next

```text
1. Independence Review（docs-only；this Decision materials）
2. await separate Human Implementation Start Decision
3. only after Implementation Start GO: code + synthetic doubles + tests
4. Issue #21 Close remains later / separate
5. Selection / Acceptance merge ≠ Implementation Start
6. Issue body SoT refresh remains Human-only / separate
```

## Reference

- Selection: `decision-issue-21b-authorization-resolver-selection.md`
- Independence Review: `decision-issue-21b-authorization-resolver-independent-review.md`
- Prior: `decision-issue-21a-authorization-sitecontext-acceptance.md`
- Issue #21 remains OPEN; Close = NOT AUTHORIZED
