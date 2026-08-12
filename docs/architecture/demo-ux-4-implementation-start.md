# DEMO-UX-4 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-4 — Support plan presentation
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: SELECTED / LOCKED（decision-demo-ux-4-support-plan-presentation-selection.md）
Human Implementation Start: GO（2026-08-12）
Depends on: DEMO-UX-3 MERGED / COMPLETE（PR #306）
Baseline main: 506d522a3f223e1b6bc89c991a595e1399c0a968
Branch: cursor/demo-ux-4-support-plan-0bf8
Browser smoke: PASS / VERIFIED（demo-ux-4-browser-smoke.md）
Heft test: 52 / 52 PASS
#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-demo-ux-4-support-plan-presentation-selection.md`](./decision-demo-ux-4-support-plan-presentation-selection.md)
[`decision-demo-ux-4-support-plan-presentation-acceptance.md`](./decision-demo-ux-4-support-plan-presentation-acceptance.md)
[`demo-ux-3-implementation-start.md`](./demo-ux-3-implementation-start.md)
[`dashboard-design-v1.md`](./dashboard-design-v1.md)

## Authority

```text
Issue #299 / Selection docs = design slice boundary only
Selection ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
支援計画の presentation-only skeleton
完全合成データ / props / fixture のみ
DEMO-UX-3 利用者詳細からの synthetic local preview（Aさん）
計画概要 / 支援目標 / 具体的支援内容 / 見直し状況
制度・業務情報とシステム状態の表示分離
disabled 作成・編集・保存 controls
既存 primary navigation / fail-closed / site selection / skip link の維持
keyboard / focus / responsive / accessibility boundary の維持
fixture-driven unit tests
browser smoke evidence
implementation-specific documentation
```

## Explicit OUT

```text
SharePoint REST / binder / adapter live I/O
Entra / Graph / membership mutation
実利用者データ
live support plan route / deep link
支援計画の作成・編集・保存（実行）
記録 / 評価 / 見直しの本実装
auth / token / role judgment
Production deploy
Issue #299 Close
Issue #28 Close
Ready / Merge auto-progress
unrelated refactor
```

## Presentation navigation boundary

DEMO-UX-3 では利用者詳細の支援計画欄は期間表示のみだった。

DEMO-UX-4 では、責任者が支援計画の情報構造を確認できるよう、`Aさん` 詳細から synthetic local preview で支援計画画面を開く。

この画面遷移は `AppShellChrome` 内の React state だけで行う。

```text
DEMO_UX_4_SLICE.id = DEMO-UX-4
syntheticSupportPlanNavigationAuthorized = true
liveSupportPlanNavigationAuthorized = false
planMutationAuthorized = false
liveUsersDataAuthorized = false
sharePointRestAuthorized = false
binderHostWiringAuthorized = false
adapterFetchAuthorized = false
authJudgmentAuthorized = false
```

## Delivered surface

```text
spfx/src/shell/users/SupportPlan.tsx
spfx/src/shell/users/SupportPlanUx.module.scss
spfx/src/shell/users/support-plan-*
spfx/src/shell/users/UserDetail.tsx（plan preview entry）
spfx/src/shell/ux/AppShellChrome.tsx（local plan preview state）
spfx/smoke/demo-ux-4/*
docs/architecture/demo-ux-4-browser-smoke.md
```

## Stop / HOLD

```text
Do not Ready / Merge automatically
Do not Close #299 / #28
Do not enable live I/O / REST / binder wiring
Do not implement plan mutation / records / evaluation screens
STOP at Draft PR after evidence
```
