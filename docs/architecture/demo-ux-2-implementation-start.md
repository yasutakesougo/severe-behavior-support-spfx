# DEMO-UX-2 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-2 — Users list presentation
Status: Implementation Start COMPLETE（presentation）
Human Selection: SELECTED / LOCKED（Issue #299 comment 2026-08-12）
Depends on: DASHBOARD-UX-1 MERGED / COMPLETE
Human Implementation Start: GO（2026-08-12）
Baseline tip: 6e66830e80c32325ca64786d7cd3889acccef246
Branch: cursor/demo-ux-2-users-list-0bf8
#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
#71 admin-ui: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
Issue #299 Human Slice Selection comment（DEMO-UX-2 SELECTED / LOCKED）
[`dashboard-design-v1.md`](./dashboard-design-v1.md)
[`dashboard-ux-1-implementation-start.md`](./dashboard-ux-1-implementation-start.md)

## Authority

```text
Issue #299 Selection = design slice boundary only
Selection ≠ Implementation Start

This document records the separate Human GO for Implementation Start.
```

## Authorized IN

```text
利用者一覧の presentation-only skeleton
完全合成データ / props / fixture のみ
既存 AppShellChrome readyRegion 配下（destination = users）
責任者レビュー用の一覧構造・情報密度・視認性確認
状態バッジ（要確認 / 未記録 / 期限間近 / 通常）— テキスト併記
disabled filter chips / disabled detail buttons
既存 primary navigation（概要 / 利用者 / 記録）の維持
既存 fail-closed / site selection / skip link / keyboard / focus / responsive boundary
DASHBOARD-UX-1 overview skeleton の維持
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
利用者詳細 / 支援計画 / 記録 / 見直しの本実装
filter / detail の live 実行
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
DEMO_UX_SLICE.id = DEMO-UX-2
DEMO_UX_SLICE.liveTenantIoAuthorized = false
DEMO_UX_SLICE.sharePointRestAuthorized = false
DEMO_UX_SLICE.binderHostWiringAuthorized = false
DEMO_UX_SLICE.adapterFetchAuthorized = false
DEMO_UX_SLICE.authJudgmentAuthorized = false
DEMO_UX_SLICE.liveUsersDataAuthorized = false
DEMO_UX_SLICE.userDetailNavigationAuthorized = false
DEMO_UX_SLICE.filterExecutionAuthorized = true（updated by DEMO-UX-8）
users list = presentation skeleton only（must not appear as connected business UI）
records destination = SHELL-UX-7 placeholder unchanged
```

## Fail-closed

```text
合成データを live 業務データに見せない
filter / detail を実行可能な本番操作に見せない
authorization 済みに見せない
retrieval_failed を正常 0 件に見せない（本 slice では live retrieval なし）
demo / synthetic boundary を維持する
```

## Delivered surface

```text
spfx/src/shell/users/*
spfx/src/shell/ux/AppShellChrome.tsx（users branch only）
spfx/smoke/demo-ux-2/*
docs/architecture/demo-ux-2-browser-smoke.md
```

## Stop / HOLD

```text
Do not Ready / Merge this PR automatically
Do not Close #299 / #28 / #71
Do not enable live I/O / REST / binder wiring
Do not implement user detail / plans / records business screens
STOP at Draft PR after evidence
```
