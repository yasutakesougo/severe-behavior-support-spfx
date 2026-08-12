# SHELL-UX-7 — Implementation Start

```text
Issue: #28
Unit: SHELL-UX-7 — Safe Navigation Destination Placeholders
Status: Implementation Start AUTHORIZED（in progress → complete on delivery）
Human Selection: Decision-SHELL-UX-7-NAVIGATION-DESTINATION-PLACEHOLDERS-1 = Accepted / LOCKED
Selection merge: b69740d04abcc5b21601e928b0b90980dbe5439b（PR #290）
Human Implementation Start: GO（2026-08-12）
Independence: PASS（Independent = YES；P0=0 / P1=0；P2 OPEN non-blocking）
Baseline tip: b69740d04abcc5b21601e928b0b90980dbe5439b
PR: TBD（implementation Draft）
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
#68〜#71 business UI: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-shell-ux-7-navigation-destination-placeholders-selection.md`](./decision-shell-ux-7-navigation-destination-placeholders-selection.md)
[`decision-shell-ux-7-navigation-destination-placeholders-acceptance.md`](./decision-shell-ux-7-navigation-destination-placeholders-acceptance.md)
[`decision-shell-ux-7-navigation-destination-placeholders-independent-review.md`](./decision-shell-ux-7-navigation-destination-placeholders-independent-review.md)

## Authority

```text
#290 Merge = Selection / Acceptance / IR boundary only
#290 merge ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
presentation-only destination surface
existing primary navigation vocabulary only:
  overview → 概要
  users    → 利用者
  records  → 記録
selected destination state
destination heading
未接続 destination の明示
current site / demo indicators の維持
visual + accessibility selected state
focus management
fixture-driven tests
browser smoke
implementation-specific documentation / evidence
```

## Explicit OUT

```text
Plans / Administration primary-nav expansion
#70 / #71 future contract 確定
#68〜#71 business UI implementation
#21 authorization truth
#22 adapter continuation
REST / binder / live I/O
SharePoint / M365 / Entra mutation
Deploy / Production
Issue #28 Close
Issue #28 body mutation
unrelated refactor
```

## Boundary markers

```text
SHELL_UX_SLICE.id = SHELL-UX-7
SHELL_UX_SLICE.liveTenantIoAuthorized = false
SHELL_UX_SLICE.sharePointRestAuthorized = false
SHELL_UX_SLICE.binderHostWiringAuthorized = false
SHELL_UX_SLICE.membershipLookupAuthorized = false
SHELL_UX_SLICE.authJudgmentAuthorized = false
SHELL_UX_SLICE.businessDestinationAuthorized = false
SHELL_UX_SLICE.plansAdministrationNavExpansionAuthorized = false
未接続 destination = presentation-only placeholder（must not appear usable）
```

## Fail-closed

```text
未接続 destination を利用可能な業務画面に見せない
live data が存在するように見せない
authorization 済みに見せない
完成済み business UI に見せない
current site / demo indication を消さない
```

## Stop / HOLD

```text
Do not Ready / Merge this PR automatically
Do not Close #28
Do not mutate Issue #28 body
Do not continue #21 / #22 / #68〜#71
Do not expand primary nav beyond 概要 / 利用者 / 記録
Do not enable liveTenantIoAuthorized / REST / binder wiring
STOP at Draft PR after evidence
```
