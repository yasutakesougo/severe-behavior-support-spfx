# DEMO-UX-5 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-5 — Daily record presentation
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-5-DAILY-RECORD-PRESENTATION-1）
Human Implementation Start: GO（2026-08-12）
Human Verification: GO（2026-08-12）
Depends on: DEMO-UX-4 MERGED / COMPLETE（PR #308）
Baseline main: 88e9711ad015d7ed9dd73395506b81bf8cf2ed9e
Selection commit: 41d6c26e528782e8cfcb198214b512f450716982（PR #309 branch）
Branch: chatgpt/demo-ux-5-daily-record
PR: #310
Browser smoke: PASS / VERIFIED（demo-ux-5-browser-smoke.md）
Heft test: 56 / 56 PASS
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

## Authority

Human instruction `DEMO-UX-5 Implementation Start GO` authorizes this presentation-only implementation slice.

Human instruction `PR #310 Verification GO` authorizes local verification evidence recording for this Draft PR.

Selection / Implementation Start / Verification do not authorize Ready, Merge, live I/O, record mutation, or Production deploy.

## Authorized IN

```text
日々の記録 presentation-only skeleton
完全合成データ / props / fixture のみ
primary navigation「記録」destination への synthetic presentation
記録入力 / 未完了確認 / 最近の記録の3責務
制度・業務情報とシステム状態の表示分離
disabled record create / save controls
既存 AppShellChrome / fail-closed / site selection / skip link の維持
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
日々の記録の作成・編集・保存（実行）
DailyActivityRecords reuse / schema mutation / live list wiring
評価 / 見直し本実装
auth / token / role judgment
Production deploy
Issue #299 Close
Ready / Merge auto-progress
unrelated refactor
```

## Presentation boundary

`records` destination は SHELL-UX-7 placeholder から DEMO-UX-5 synthetic presentation へ置き換える。

この変更は presentation-only であり、既存 tenant の `DailyActivityRecords` を新SPFxのデータソースとして扱わない。

```text
DEMO_UX_5_SLICE.id = DEMO-UX-5
presentationOnly = true
syntheticDailyRecordPresentationAuthorized = true
liveDailyRecordNavigationAuthorized = false
liveTenantIoAuthorized = false
sharePointRestAuthorized = false
binderHostWiringAuthorized = false
adapterFetchAuthorized = false
authJudgmentAuthorized = false
liveRecordDataAuthorized = false
dailyActivityRecordsReuseAuthorized = false
recordMutationAuthorized = false
evaluationMutationAuthorized = false
```

## Design alignment

`dashboard-design-v1.md` DESIGN-3 §6.3 を入力とする。

記録画面は以下の3責務を明示する。

1. 記録入力
2. 未完了確認
3. 最近の記録

分析グラフは主目的にしない。

## Verification state

```text
Unit test source: added
Local Heft build/test: PASS（56 / 56）
Browser smoke: PASS / VERIFIED（5 / 5）
Format check: PASS
GitHub CI contracts: PASS on head before verification commit（evaluate again after push）
```

## Delivered surface

```text
spfx/src/shell/records/DailyRecords.tsx
spfx/src/shell/records/DailyRecordsUx.module.scss
spfx/src/shell/records/daily-record-*
spfx/src/shell/records/index.ts
spfx/src/shell/ux/AppShellChrome.tsx（records destination）
spfx/src/shell/ux/index.ts（DEMO-UX-5 exports）
spfx/smoke/demo-ux-5/*
docs/architecture/demo-ux-5-browser-smoke.md
```

## Stop / HOLD

```text
Do not Ready / Merge automatically
Do not Close #299
Do not enable live I/O / REST / binder wiring
Do not implement record mutation / evaluation / review screens
STOP at Draft PR after verification evidence
```
