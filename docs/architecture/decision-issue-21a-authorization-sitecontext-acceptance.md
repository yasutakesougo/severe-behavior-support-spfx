# #21-A — Authorization / SiteContext Pure Contract Boundary — Human Acceptance（SELECT）

この文書は、**#21-A — Authorization / SiteContext Pure Contract Boundary** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-issue-21a-authorization-sitecontext-selection.md`](./decision-issue-21a-authorization-sitecontext-selection.md)

Depends on（再 Decision しない）:
[`contracts-v1.md`](./contracts-v1.md)
Issue #7 CLOSED（formal Role ×7 / evaluateAccess）
Issue #28 CLOSED（current-site / multi-site presentation；auth truth OUT）
GOV-STAFF-01〜05 Accepted / LOCKED（runtime OUT of #21-A）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-21A-AUTHORIZATION-SITECONTEXT-1
Status: Accepted / LOCKED（Selection boundary）
Human Decision: SELECT #21-A — Authorization / SiteContext Pure Contract Boundary
Human Acceptance date: 2026-08-12
Issue: #21
PR: #292（Selection / Acceptance / Independence Review only）
Baseline tip: a21f5dc0acaa43f18ee6b4a10e1cd0f8ae6db3b4

Selected:
  Authorization / SiteContext Pure Contract Boundary

Implementation Start: NOT AUTHORIZED（separate Human GO）
Issue #21 Close: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
#4 live tenant work: NOT AUTHORIZED by this SELECT
#19 residual Close: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT #21-A — Authorization / SiteContext Pure Contract Boundary
Decision-ISSUE-21A-AUTHORIZATION-SITECONTEXT-1: Accepted / LOCKED

Meaning:
  authorize the next #21 independently implementable slice boundary now
  keep Implementation Start as a later separate Human GO
  do not treat stale Issue #21 body HOLD / #19+#4 blanket as blocking this slice
```

## Accepted Scope

```text
IN:
  formal Role reuse
  AuthorizationContext / SiteContext contracts
  fail-closed resolver result types
  unknown / missing role rejection
  empty requiredRoles rejection
  provider / auth lookup failure rejection（contract-level）
  UserId / SiteId / OrganizationId separation
  multi-site membership → selection-required deny（auth truth）
  synthetic fixtures
  contract / unit tests（pure range）

SiteId tokens for fixtures:
  SITE-ISG
  SITE-HOM
```

## Boundary

```text
SELECT #21-A ≠ Implementation Start
SELECT #21-A ≠ Issue #21 Close
SELECT #21-A ≠ Graph / Entra API / real membership resolution
SELECT #21-A ≠ SharePoint permission probing
SELECT #21-A ≠ #22 adapter / live I/O / binder host wiring
SELECT #21-A ≠ transfer / retirement runtime
SELECT #21-A ≠ Entra group removal automation
SELECT #21-A ≠ business UI / #68〜#71
SELECT #21-A ≠ Deploy / Microsoft 365 mutation
SELECT #21-A ≠ SharePoint URL hard-coding（sbs-* / severe-support-*）
SELECT #21-A ≠ Issue #21 GitHub body mutation

#28 current-site / multi-site chrome = presentation COMPLETE
  ≠ authorization truth
Issue #21 body tip / Implementation HOLD markers = STALE
  repository Accepted / LOCKED docs + this Decision govern the slice boundary
```

## Current execution snapshot

```text
Selection = SELECTED / LOCKED
Selection docs PR = #292（draft；Ready / Merge = HUMAN-ONLY）
Independence Review = PASS（recorded；≠ Implementation Start）
Implementation Start = NOT AUTHORIZED
Issue #21 = OPEN / KEEP OPEN
#22 = OPEN / PARTIAL（independent）
#28 = CLOSED / COMPLETE（presentation）
#68〜#71 = NOT STARTED / OUT
```

## Next

```text
1. Independence Review（docs-only；this Decision materials）
2. await separate Human Implementation Start Decision
3. only after Implementation Start GO: code + synthetic fixtures + contract tests
4. Issue #21 Close remains later / separate
5. Selection / Acceptance merge ≠ Implementation Start
6. Issue body SoT refresh remains Human-only / separate
```

## Reference

- Selection: `decision-issue-21a-authorization-sitecontext-selection.md`
- Independence Review: `decision-issue-21a-authorization-sitecontext-independent-review.md`
- Prior: `contracts-v1.md`
- Issue #7 CLOSED；Issue #28 CLOSED；Issue #21 remains OPEN
- Close = NOT AUTHORIZED
