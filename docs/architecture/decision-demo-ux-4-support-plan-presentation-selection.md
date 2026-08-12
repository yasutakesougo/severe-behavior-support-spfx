# DEMO-UX-4 — Support Plan Presentation — Human Selection Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-DEMO-UX-4-SUPPORT-PLAN-PRESENTATION-1
Kind: Human Selection Packet（Phase 1 slice）
Status: SELECTED / LOCKED
Human instruction: DEMO-UX-4 / Support plan presentation Selection GO
Date: 2026-08-12
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Baseline main: 506d522a3f223e1b6bc89c991a595e1399c0a968
Depends on: DEMO-UX-3 MERGED / COMPLETE（PR #306）
```

Depends on（再 Decision しない）:
[`dashboard-design-v1.md`](./dashboard-design-v1.md)
[`demo-ux-3-implementation-start.md`](./demo-ux-3-implementation-start.md)
[`responsible-person-demo-v1.md`](../roadmap/responsible-person-demo-v1.md)
Issue #299 review path step 4（支援計画を確認する）

## Human Selection

```text
Human Decision: SELECT DEMO-UX-4
Selected slice:
  ID: DEMO-UX-4
  Name: Support plan presentation
  Parent: #299 RESPONSIBLE-PERSON-DEMO-V1
```

## Authorized selection scope

```text
支援計画の presentation-only skeleton
完全合成データ / props / fixture のみ
DEMO-UX-3 利用者詳細との表示上の連続性
責任者レビュー用の支援計画情報構造・優先順位・視認性確認
制度・業務情報とシステム状態の分離を維持
既存 AppShellChrome / primary navigation / fail-closed /
  site-selection / keyboard-focus / responsive-accessibility boundary を維持
PC表示を主対象とし、既存 responsive boundary を維持
```

## Explicit OUT（Selection 時点）

```text
DEMO-UX-4 Implementation Start
code / SCSS mutation
Draft PR for implementation
SharePoint REST / binder / adapter live I/O
Entra / Graph / auth / role mutation
実利用者データ
支援計画の作成・編集・保存
記録 / 評価 / 見直しの本実装
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
skip link
keyboard / focus behavior
existing responsive / accessibility boundary
demo / synthetic boundary markers
```

## Gate

```text
DEMO-UX-4 = SELECTED / LOCKED

This selection does NOT authorize:
  Implementation Start
  branch creation for implementation code
  code / SCSS changes
  Draft PR for implementation
  Ready / Merge
  SharePoint / Entra mutation
  Production deploy
  Issue #299 / #28 Close

Next Human gate: DEMO-UX-4 Implementation Start GO
```
