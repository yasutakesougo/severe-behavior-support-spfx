# DEMO-UX-5 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-5 — Daily record presentation
Status: Implementation Start GO / IN PROGRESS（presentation）
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-5-DAILY-RECORD-PRESENTATION-1）
Human Implementation Start: GO（2026-08-12）
Depends on: DEMO-UX-4 MERGED / COMPLETE（PR #308）
Baseline main: 88e9711ad015d7ed9dd73395506b81bf8cf2ed9e
Selection commit: 41d6c26e528782e8cfcb198214b512f450716982（PR #309 branch）
Branch: chatgpt/demo-ux-5-daily-record
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

## Authority

Human instruction `DEMO-UX-5 Implementation Start GO` authorizes this presentation-only implementation slice.

Selection and Implementation Start do not authorize Ready, Merge, live I/O, record mutation, or Production deploy.

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
Local Heft build/test: NOT RUN
Browser smoke: NOT RUN
Format check: NOT RUN
GitHub CI: evaluate after Draft PR creation
```

未実行の検証は PASS として扱わない。

## Delivered surface

```text
spfx/src/shell/records/DailyRecords.tsx
spfx/src/shell/records/DailyRecordsUx.module.scss
spfx/src/shell/records/daily-record-*
spfx/src/shell/records/index.ts
spfx/src/shell/ux/AppShellChrome.tsx（records destination）
```

## Stop / HOLD

```text
Do not Ready / Merge automatically
Do not Close #299
Do not enable live I/O / REST / binder wiring
Do not implement record mutation / evaluation / review screens
STOP at Draft PR for verification and review
```