# DASHBOARD-UX-1 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DASHBOARD-UX-1 — Overview presentation skeleton
Status: Implementation Start COMPLETE（presentation）
Human Selection: SELECTED / LOCKED（Issue #299 comment 2026-08-12）
Design input: dashboard-design-v1.md（PR #253 / ACCEPTED）
Human Implementation Start: GO（2026-08-12）
Baseline tip: 045e95d（dashboard-design-v1 merge）
Branch: cursor/dashboard-ux-1-overview-aeda
#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
#71 admin-ui: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`dashboard-design-v1.md`](./dashboard-design-v1.md)
Issue #299 Human Slice Selection comment（DASHBOARD-UX-1 SELECTED / LOCKED）

## Authority

```text
Issue #299 Selection = design slice boundary only
Selection ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
overview presentation skeleton（概要ダッシュボード）
完全合成データ / props / fixture のみ
既存 AppShellChrome readyRegion 配下（destination = overview）
DESIGN-4 low-fidelity prototype に沿った構成:
  今日の支援状況（KPI cards）
  今日やること
  最近の記録
presentation-only disconnected / synthetic boundary markers
既存 primary navigation（概要 / 利用者 / 記録）の維持
既存 fail-closed / site selection / skip link / keyboard / focus / responsive boundary
PC表示を主対象とした layout skeleton
fixture-driven unit tests
browser smoke evidence
implementation-specific documentation
```

## Explicit OUT

```text
SharePoint REST / binder / adapter live I/O
Entra / Graph / membership mutation
実利用者データ
KPI カードからの live 絞り込み遷移
利用者一覧 / 利用者詳細 / 支援計画 / 記録 / 見直しの本実装
#71 finding / 管理ダッシュボード
#21 authorization truth
#22 adapter continuation
auth / token / role judgment
Production deploy
Issue #299 Close
Issue #28 Close
Ready / Merge auto-progress
unrelated refactor
```

## Boundary markers

```text
DASHBOARD_UX_SLICE.id = DASHBOARD-UX-1
DASHBOARD_UX_SLICE.liveTenantIoAuthorized = false
DASHBOARD_UX_SLICE.sharePointRestAuthorized = false
DASHBOARD_UX_SLICE.binderHostWiringAuthorized = false
DASHBOARD_UX_SLICE.adapterFetchAuthorized = false
DASHBOARD_UX_SLICE.authJudgmentAuthorized = false
DASHBOARD_UX_SLICE.liveOverviewDataAuthorized = false
DASHBOARD_UX_SLICE.kpiNavigationAuthorized = false
DASHBOARD_UX_SLICE.actionExecutionAuthorized = false
overview = presentation skeleton only（must not appear as connected business UI）
users / records destinations = SHELL-UX-7 placeholders unchanged
```

## Fail-closed

```text
合成データを live 業務データに見せない
KPI / action を実行可能な本番操作に見せない
authorization 済みに見せない
retrieval_failed を正常 0 件に見せない（本 slice では live retrieval なし）
demo / synthetic boundary を維持する
```

## Delivered surface

```text
spfx/src/shell/dashboard/*
spfx/src/shell/ux/AppShellChrome.tsx（overview branch only）
spfx/smoke/dashboard-ux-1/*
docs/architecture/dashboard-ux-1-browser-smoke.md
```

## Stop / HOLD

```text
Do not Ready / Merge this PR automatically
Do not Close #299 / #28 / #71
Do not enable live I/O / REST / binder wiring
Do not implement users / records / admin business screens
STOP at Draft PR after evidence
```
