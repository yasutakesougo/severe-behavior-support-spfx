# UI-VISUAL-HIERARCHY-CONTRACT-1 — Human Selection

この文書は **Decision-UI-VISUAL-HIERARCHY-CONTRACT-1** の
Human Decision 記録である。

Decision packet:
[`decision-ui-visual-hierarchy-contract-1-packet.md`](./decision-ui-visual-hierarchy-contract-1-packet.md)

本 Selection は Implementation Start ではない。
Contract 本文は別 GO で materialized した。
code / fixture / SharePoint / LIVE WRITE / Deploy を許可しない。
`#444` / `#448` の画面適用を自動開始しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-UI-VISUAL-HIERARCHY-CONTRACT-1
Kind: Human Selection（Visual Hierarchy Contract axes）
Status: SELECTED / LOCKED
Human Decision:
  N-1 SELECT
  H-01 ADOPT
  H-02 ADOPT
  H-03 ADOPT
  H-04 ADOPT
  H-05 ADOPT
  H-06 ADOPT
  H-07 ADOPT
Date: 2026-08-19
Observed main at packet:
  5890822de6e5df1e1901732a71adc66d4a9d1879
Authoritative main at Selection:
  5890822de6e5df1e1901732a71adc66d4a9d1879
Agent auto-select: FORBIDDEN（this Selection is Human）

Parent policy: #392
PLANNER owner: #444
FIELD_STAFF owner: #448

Contract body: ADDED（docs；Fresh Review PASS；Draft PR this GO）
Contract materialization: GO CONSUMED 2026-08-19
Fresh Review: PASS
  docs/architecture/ui-visual-hierarchy-contract-1-fresh-review.md
  docs/architecture/ui-visual-hierarchy-contract-1.md
  docs/architecture/ui-visual-hierarchy-contract-1-materialization.md
P2 purity correction: COMPLETE
  docs/architecture/ui-visual-hierarchy-contract-1-p2-purity-correction.md
Draft PR publication: THIS GO
Ready / Merge: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED（screens）
#444 / #448 screen application: NOT AUTHORIZED
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

---

## 1. Why this Decision now

```text
TRACK B read-only reconciliation は COMPLETE である。
横断の「何を強く・弱く見せるか」を軸ごとに採否する。
具体配置（KPI strip / Plan metadata 非表示）は画面 owner に残す。
```

## 2. Selected meaning

| ID | 問い | Selected | 意味 |
|---|---|---|---|
| N-* | 情報階層の呼称 | **N-1** | `EMPHASIS-1` / `EMPHASIS-2` / `EMPHASIS-3`。`SBS_ACTION.primary` と名前空間を分ける |
| H-01 | Typography hierarchy | **ADOPT** | 既存 `SBS_TYPOGRAPHY` alias を横断階層にする。新スケールは作らない |
| H-02 | Spacing hierarchy | **ADOPT** | グループ間 `space.4+`、グループ内 `space.1–2`。INV-22 一括解消はしない |
| H-03 | Information emphasis | **ADOPT** | 情報は 3 段の強調ランクを持つ。呼称は N-1。裸の PRIMARY は使わない |
| H-04 | Status / Action | **ADOPT** | 状態チャネルと操作チャネルを同じ視覚ウェイトで並べない。`#419` / `#442` 意味は変えない |
| H-05 | CTA hierarchy | **ADOPT** | 1 view の `SBS_ACTION.primary` は 1。戻る / 確認は `SBS_ACTION.tertiary` |
| H-06 | Card usage | **ADOPT** | 非操作 KPI は card にしない。操作単位だけ card / row |
| H-07 | Density by role | **ADOPT** | FIELD_STAFF = LOW、PLANNER = MEDIUM、ADMIN = 件数優先。nav / destination は変えない |

N-2 / N-3 は NOT SELECTED。
H-01〜H-07 に DEFER / REJECT は無い。

## 3. Locked implications

### N-1 — EMPHASIS namespace

```text
EMPHASIS-1  その view で最も強く見せる情報
EMPHASIS-2  判断に必要だが主役ではない
EMPHASIS-3  通常は弱く / 少なく。必要時だけ

KEEP SBS_ACTION.primary / secondary / tertiary = CTA visual weight
KEEP DADS-03 §4.1 primary label = 要確認 / 未記録 / 期限接近
KEEP SBS_COLOR.textPrimary / textSecondary = 色。情報ランク名にしない
H-05 の PRIMARY は SBS_ACTION のみ
```

### H-01 ADOPT — Typography

```text
pageTitle / sectionTitle = destination 骨格（Templates）
本文の強弱 = body semibold と meta
H-03 接続: EMPHASIS-1 ≈ body semibold（または sectionTitle）
           EMPHASIS-3 ≈ meta
新 font-size スケール = FORBIDDEN
```

### H-02 ADOPT — Spacing

```text
情報グループ間 = space.4 以上
グループ内 = space.1–2
tablet compact の具体値 = #448 SCREEN-SPECIFIC
```

### H-03 ADOPT — Information emphasis

```text
画面内情報は EMPHASIS-1 / 2 / 3 を持つ
業務意味は変えない。同じ語彙でも視覚ランクは変えてよい
PLANNER 7 要素の具体割当 = #444
Plan metadata を何段にするか = #448
```

### H-04 ADOPT — Status / Action

```text
状態チャネル ≠ 操作チャネル（視覚ウェイト）
#444 状態 ≠ 要対応（意味）は維持
判定意味 #419 / #442 = UNCHANGED
```

### H-05 ADOPT — CTA

```text
1 view に SBS_ACTION.primary は 1
戻る / 確認 = SBS_ACTION.tertiary
どの業務操作が存在するかは変えない
```

### H-06 ADOPT — Card

```text
非操作 KPI = strip / inline metric。card にしない
操作単位だけ card / row
新 KPI primitive = FORBIDDEN
KPI strip の具体配置 = #444 SCREEN-SPECIFIC
```

### H-07 ADOPT — Density by role

```text
FIELD_STAFF = LOW（tablet、少情報、touch-first）
PLANNER = MEDIUM
ADMIN / AUDIT = 件数優先
nav / destination UNCHANGED（UI-SEM-05 / Templates）
Plan metadata 通常非表示 = #448 SCREEN-SPECIFIC
```

## 4. Explicit OUT（this Selection）

```text
Contract materialization（GO CONSUMED；docs）
Fresh Review（PASS；docs/architecture/ui-visual-hierarchy-contract-1-fresh-review.md）
Commit / Push / Draft PR（未実施。別 GO）
Ready / Merge of Contract body（PR 作成後のゲート）
#444 PLANNER screen application
#448 FIELD_STAFF screen application
KPI strip 実装
Plan metadata 非表示実装
TRACK A functional residual
LIVE WRITE / Deploy
Issue mutation / GitHub ballot 投稿
Typography 新スケール
#68 / #69 / #70 / #356 / #299 reopen
```

## 5. Next gate

```text
THIS
Contract materialization COMPLETE
Fresh Review PASS
P2 CONTRACT-PURITY CORRECTION COMPLETE
DRAFT PR PUBLICATION = THIS GO
↓ STOP

Ready / Merge: NOT AUTHORIZED（別 GO）

その後の別 track
#444 PLANNER screen-specific application
#448 FIELD_STAFF screen-specific application
```

## 6. Stop

```text
SELECTED / LOCKED
Contract body: ADDED
Fresh Review: PASS
P2 purity correction: COMPLETE
Draft PR publication: THIS GO
Ready / Merge: NOT AUTHORIZED
Implementation: NOT AUTHORIZED
ACTION: STOP
```
