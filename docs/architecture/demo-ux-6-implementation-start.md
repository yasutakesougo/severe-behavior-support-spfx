# DEMO-UX-6 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-6 — Review status & due-state presentation
Status: Implementation Start COMPLETE（presentation）+ browser smoke PASS
Human Selection: SELECTED / LOCKED（Decision-DEMO-UX-6-REVIEW-DUE-STATE-PRESENTATION-1）
Human Implementation Start: GO（2026-08-12）
Depends on: DEMO-UX-5 MERGED / COMPLETE（PR #310）
Baseline main: 6eeb188a958caff208b24443ae17d66bb10e2f8b
Selection branch: chatgpt/demo-ux-6-review-due-state-selection（PR #311）
Branch: cursor/demo-ux-6-review-due-state-21d0
Browser smoke: PASS / VERIFIED（demo-ux-6-browser-smoke.md）
Heft test: 60 / 60 PASS
#299 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

Depends on（再 Decision しない）:
[`decision-demo-ux-6-review-due-state-presentation-selection.md`](./decision-demo-ux-6-review-due-state-presentation-selection.md)
[`decision-demo-ux-6-review-due-state-presentation-acceptance.md`](./decision-demo-ux-6-review-due-state-presentation-acceptance.md)
[`demo-ux-5-implementation-start.md`](./demo-ux-5-implementation-start.md)
[`dashboard-design-v1.md`](./dashboard-design-v1.md)

## Authority

Human instruction `DEMO-UX-6 Implementation Start GO` authorizes this presentation-only implementation slice.

Selection and Implementation Start do not authorize Ready, Merge, live I/O, due calculation, review mutation, or Production deploy.

## Authorized IN

```text
見直し状況 / 期限状態の presentation-only skeleton
完全合成データ / props / fixture のみ
概要からの synthetic local preview（React state）
確認待ち / 期限接近 等の表示ラベル
制度・業務情報とシステム状態の表示分離
disabled 見直し完了 / 評価更新 controls
既存 AppShellChrome / fail-closed / site selection / skip link の維持
keyboard / focus / responsive / accessibility boundary の維持
fixture-driven unit tests
implementation-specific documentation
browser smoke harness / evidence
```

## Explicit OUT

```text
SharePoint REST / binder / adapter live I/O
Entra / Graph / membership mutation
実利用者データ
due / overdue / 期限接近の計算ロジック実装
GOV-RULE の新規決定・変更
見直し / 評価 mutation 実行
auth / token / role judgment
Production deploy
Issue #299 Close
Ready / Merge auto-progress
primary nav expansion beyond 概要 / 利用者 / 記録
unrelated refactor
```

## Presentation navigation boundary

DASHBOARD-UX-1 概要に、見直し状況の synthetic local preview 入口を追加する。

画面遷移は `AppShellChrome` 内の React state だけで行う。

```text
DEMO_UX_6_SLICE.id = DEMO-UX-6
presentationOnly = true
syntheticReviewDuePresentationAuthorized = true
liveReviewStatusReadAuthorized = false
liveDueStateCalculationAuthorized = false
liveTenantIoAuthorized = false
sharePointRestAuthorized = false
binderHostWiringAuthorized = false
adapterFetchAuthorized = false
authJudgmentAuthorized = false
liveReviewDataAuthorized = false
reviewMutationAuthorized = false
evaluationMutationAuthorized = false
govRuleDecisionAuthorized = false
```

## Design alignment

`responsible-person-demo-v1.md` review path steps 6–7 と
`dashboard-design-v1.md` の期限接近 / 確認待ち表示方針を入力とする。

期限ラベルは fixture 表示値であり、計算意味論を確定しない。

## Verification state

```text
Unit test source: added
Local Heft build/test: PASS（60 / 60）
Browser smoke: PASS / VERIFIED（6 / 6）
Format check: PASS
GitHub CI: evaluate after Draft PR creation
```

## Delivered surface

```text
spfx/src/shell/review/ReviewDueState.tsx
spfx/src/shell/review/ReviewDueStateUx.module.scss
spfx/src/shell/review/review-due-*
spfx/src/shell/review/index.ts
spfx/src/shell/dashboard/OverviewDashboard.tsx（preview entry）
spfx/src/shell/ux/AppShellChrome.tsx（local review due preview state）
spfx/src/shell/ux/index.ts（DEMO-UX-6 exports）
spfx/smoke/demo-ux-6/*
docs/architecture/demo-ux-6-browser-smoke.md
```

## Stop / HOLD

```text
Do not Ready / Merge automatically
Do not Close #299
Do not enable live I/O / REST / binder wiring
Do not implement due calculation / review mutation
STOP at Draft PR after verification evidence
```
