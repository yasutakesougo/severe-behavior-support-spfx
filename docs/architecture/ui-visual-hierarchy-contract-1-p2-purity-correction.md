# UI-VISUAL-HIERARCHY-CONTRACT-1 — P2 Contract-purity correction

この文書は **UI-VISUAL-HIERARCHY-CONTRACT-1** の docs-only purity correction 記録である。
Human GO: `P2 CONTRACT-PURITY CORRECTION GO`（2026-08-19）。

Finding:
`VH-FR-P2-1` in [`ui-visual-hierarchy-contract-1-fresh-review.md`](./ui-visual-hierarchy-contract-1-fresh-review.md)

Contract body:
[`ui-visual-hierarchy-contract-1.md`](./ui-visual-hierarchy-contract-1.md) §9

本 GO は Fresh Review を FAIL に戻さない。
本 correction は Draft PR / Ready / Merge / `#444` / `#448` 画面適用ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: UI-VISUAL-HIERARCHY-CONTRACT-1
Kind: docs-only Contract purity correction
Status: CORRECTED / TARGETED REVIEW PASS
Human GO: P2 CONTRACT-PURITY CORRECTION GO
Date: 2026-08-19
Observed main:
  5890822de6e5df1e1901732a71adc66d4a9d1879
Finding: VH-FR-P2-1 CLOSED
Ready / Merge: NOT AUTHORIZED
Screen application: NOT AUTHORIZED
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Change

Contract §9 PLANNER 行から `#444` 固有の否定形を外す。横断本体は Selection H-07 どおり `PLANNER = MEDIUM`。

| Location | Before | After |
|---|---|---|
| `ui-visual-hierarchy-contract-1.md` §9 PLANNER 原則 | `Planning PC。7 列高密度テーブルに戻さない` | `Planning PC` |

Selection H-07 本文は元から `PLANNER = MEDIUM` のみ。変更しない。
`ui-visual-hierarchy-contract-1-reconciliation.md` は TRACK B 比較入力（working-tree / 非 SSOT）。歴史記録として残す。

## 2. Explicit OUT

```text
Draft PR PUBLICATION
Commit / Push
Ready / Merge
#444 / #448 screen application
KPI strip / Plan metadata 実装
LIVE WRITE / Deploy
Issue mutation
Fresh Review の FAIL 化
```

## 3. Targeted review

| # | Check | Result |
|---|---|---|
| T1 | 変更は Contract §9 の 1 句のみ | **PASS** |
| T2 | H-07 横断本体 `PLANNER = MEDIUM` が残る | **PASS** |
| T3 | 「7 列高密度テーブルに戻さない」が Contract 本文から消えた | **PASS** |
| T4 | Selection / N-1 / H-01..H-07 を再 Decision していない | **PASS** |
| T5 | Catalog / Templates / UI-SEM / DADS-03 を置換していない | **PASS** |
| T6 | `EMPHASIS-*` と `SBS_ACTION` の分離を崩していない | **PASS** |
| T7 | 画面コード / SCSS mutation が無い | **PASS** |
| T8 | Draft PR / Ready / Merge を本 GO が許可しない | **PASS** |

```text
P0 = 0
P1 = 0
P2 OPEN against this correction = 0
VH-FR-P2-1: CLOSED
Targeted Review: PASS
```

## 4. Next

```text
THIS GO
P2 CONTRACT-PURITY CORRECTION
Targeted Review PASS
↓
DRAFT PR PUBLICATION = unit publication GO
↓ STOP

Ready / Merge: NOT AUTHORIZED（別 GO）
```
