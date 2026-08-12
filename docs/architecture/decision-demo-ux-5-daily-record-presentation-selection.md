# DEMO-UX-5 — Daily Record Presentation — Human Selection Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-DEMO-UX-5-DAILY-RECORD-PRESENTATION-1
Kind: Human Selection Packet（Phase 1 slice）
Status: SELECTED / LOCKED
Human instruction: DEMO-UX-5 / Daily record presentation Selection GO
Date: 2026-08-12
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Baseline main: 88e9711ad015d7ed9dd73395506b81bf8cf2ed9e
Depends on: DEMO-UX-4 MERGED / COMPLETE（PR #308）
```

Depends on（再 Decision しない）:
[`dashboard-design-v1.md`](./dashboard-design-v1.md)
[`demo-ux-4-implementation-start.md`](./demo-ux-4-implementation-start.md)
[`responsible-person-demo-v1.md`](../roadmap/responsible-person-demo-v1.md)
Issue #299 review path step 5（日々の記録を確認する）

## Human Selection

```text
Human Decision: SELECT DEMO-UX-5
Selected slice:
  ID: DEMO-UX-5
  Name: Daily record presentation
  Parent: #299 RESPONSIBLE-PERSON-DEMO-V1
```

## Authorized selection scope

```text
日々の記録の presentation-only skeleton
完全合成データ / props / fixture のみ
DEMO-UX-3 利用者詳細 / DEMO-UX-4 支援計画との表示上の連続性
責任者レビュー用の記録情報構造・優先順位・視認性確認
記録画面候補責務（入力 / 未完了確認 / 最近の記録）の見え方確認
制度・業務情報とシステム状態の分離を維持
既存 AppShellChrome / primary navigation（概要 / 利用者 / 記録）/
  fail-closed / site-selection / keyboard-focus / responsive-accessibility
  boundary を維持
PC表示を主対象とし、既存 responsive boundary を維持
既存 DailyActivityRecords tenant evidence は REFERENCE ONLY として扱う
```

## Explicit OUT（Selection 時点）

```text
DEMO-UX-5 Implementation Start
code / SCSS mutation
Draft PR for implementation
SharePoint REST / binder / adapter live I/O
Entra / Graph / auth / role mutation
実利用者データ
日々の記録の作成・編集・保存
DailyActivityRecords の再利用 / schema mutation / live list wiring
評価 / 見直しの本実装
Production deploy
Issue #299 Close
Issue #28 Close
```

## Preserved boundaries

```text
unauthenticated fail-closed
site selection block
概要 / 利用者 / 記録 primary navigation
DEMO-UX-2 users list skeleton
DEMO-UX-3 user detail skeleton（Aさん synthetic local preview）
DEMO-UX-4 support plan skeleton（Aさん synthetic local preview）
SHELL-UX-7 記録 destination placeholder を誤って完成業務画面に見せない
skip link
keyboard / focus behavior
existing responsive / accessibility boundary
demo / synthetic boundary markers
DailyActivityRecords existing-app evidence = REFERENCE ONLY
```

## Gate

```text
DEMO-UX-5 = SELECTED / LOCKED

This selection does NOT authorize:
  Implementation Start
  branch creation for implementation code
  code / SCSS changes
  Draft PR for implementation
  Ready / Merge
  SharePoint / Entra mutation
  Production deploy
  Issue #299 / #28 Close

Next Human gate: DEMO-UX-5 Implementation Start GO
```
