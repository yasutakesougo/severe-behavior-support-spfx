# UI-VISUAL-HIERARCHY-CONTRACT-1 — Contract materialization

この文書は **UI-VISUAL-HIERARCHY-CONTRACT-1** の Contract 本文固定記録である。
Human GO: `CONTRACT MATERIALIZATION GO`（2026-08-19）。

Selection:
[`decision-ui-visual-hierarchy-contract-1-selection.md`](./decision-ui-visual-hierarchy-contract-1-selection.md)

Contract body:
[`ui-visual-hierarchy-contract-1.md`](./ui-visual-hierarchy-contract-1.md)

本 GO は screen / SCSS / React mutation ではない。
`#444` / `#448` Implementation Start ではない。
Fresh Review は PASS。Commit / Push / PR は未実施。Ready / Merge は PR 作成後のゲートであり、現時点では到達不能。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: UI-VISUAL-HIERARCHY-CONTRACT-1
Kind: docs-only Contract materialization
Status: MATERIALIZED / FRESH REVIEW PASS
Human GO: CONTRACT MATERIALIZATION GO
Fresh Review: PASS
  docs/architecture/ui-visual-hierarchy-contract-1-fresh-review.md
P2 purity correction: COMPLETE
  docs/architecture/ui-visual-hierarchy-contract-1-p2-purity-correction.md
Draft PR publication: THIS GO
Ready / Merge: NOT AUTHORIZED
Date: 2026-08-19
Decision: N-1 SELECT / H-01..H-07 ALL ADOPT
Observed main:
  5890822de6e5df1e1901732a71adc66d4a9d1879
Screen application: NOT AUTHORIZED
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. In scope

```text
docs/architecture/ui-visual-hierarchy-contract-1.md
Catalog / Templates 4層参照の追記
design-context / design-review の Visual Hierarchy 参照
Selection 記録の materialization 状態更新
```

## 2. Explicit OUT

```text
Fresh Review の自動 PASS
Ready / Merge
PR 作成 / push
#444 / #448 screen application
KPI strip / Plan metadata 実装
generator / lint 新ルール
SharePoint / LIVE WRITE / Deploy
```

## 3. Acceptance（this GO）

1. Contract 本文が N-1 / H-01..H-07 を規則として固定している
2. `EMPHASIS-*` と `SBS_ACTION` が別名前空間である
3. SCREEN-SPECIFIC が `#444` / `#448` に残っている
4. Catalog / Templates を置換していない
5. 画面コードを変えていない

## 4. Next

```text
Fresh Review PASS
P2 CONTRACT-PURITY CORRECTION COMPLETE
DRAFT PR PUBLICATION = THIS GO
↓ STOP

Ready / Merge: NOT AUTHORIZED（別 GO）

その後の別 track
#444 PLANNER
#448 FIELD_STAFF
```
