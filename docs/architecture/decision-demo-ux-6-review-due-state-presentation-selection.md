# DEMO-UX-6 — Review status & due-state presentation Selection

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-6 — Review status & due-state presentation
Decision: Decision-DEMO-UX-6-REVIEW-DUE-STATE-PRESENTATION-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-12）
Baseline main: 6eeb188a958caff208b24443ae17d66bb10e2f8b
Implementation Start: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

## Selected scope

DEMO-UX-6 は、責任者レビュー用の presentation-only slice として以下を選定する。

- 見直し状況の一覧・要約表示
- 期限状態の文字ラベル表示
- `期限接近` / `確認待ち` 等の状態を合成データで視認できること
- 制度・業務上の表示とシステム状態を混同しないこと
- 既存 Overview / Users / User detail / Support plan / Daily record presentation を維持すること
- PC責任者レビューで主要業務フローの続きとして説明できること

## Presentation boundary

このSelectionは **表示責務のみ** を固定する。

期限状態や見直し状態は synthetic fixture の表示値として扱い、計算・判定ロジックを新たに確定しない。

```text
presentationOnly = true
syntheticReviewStatusPresentation = IN
syntheticDueStatePresentation = IN
liveReviewStatusRead = OUT
liveDueStateCalculation = OUT
reviewMutation = OUT
evaluationMutation = OUT
SharePoint / binder / adapter live I/O = OUT
Entra / Graph / auth / role mutation = OUT
real user data = OUT
Production deploy = OUT
```

## Explicit OUT

- GOV-RULE の新規決定・変更
- 期限接近開始日の計算実装
- due / overdue の実業務判定実装
- 見直し周期・期限基準日の再決定
- 評価・見直しの作成 / 更新 / 完了 mutation
- SharePoint REST / binder / adapter live wiring
- 実利用者データ
- Production deploy
- Issue #299 Close
- Implementation Start / Ready / Merge の自動進行

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

次の Human gate は `DEMO-UX-6 Implementation Start GO`。
