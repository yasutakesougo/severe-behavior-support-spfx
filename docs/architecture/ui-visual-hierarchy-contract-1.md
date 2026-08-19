# UI Visual Hierarchy Contract v1

```text
Program: UI-AGENT-SYSTEM-V1
Unit: UI-VISUAL-HIERARCHY-CONTRACT-1 — Product UI Contract layer
Status: SELECTED / LOCKED（docs materialization；Fresh Review PASS）
Decision:
  Decision-UI-VISUAL-HIERARCHY-CONTRACT-1
  N-1 SELECT
  H-01..H-07 ALL ADOPT
  selection:
    docs/architecture/decision-ui-visual-hierarchy-contract-1-selection.md
Authority:
  docs/architecture/dads-application-style-guide-v1.md
  docs/architecture/dads-04-design-tokens.md
  docs/architecture/visual-polish-1-foundations.md
  docs/architecture/ui-component-catalog-v1.md
  docs/architecture/ui-screen-templates-v1.md
  GitHub #392 Role / Device / Visual Polish
Parent policy: #392
PLANNER application owner: #444（別 GO）
FIELD_STAFF application owner: #448（別 GO）
Observed main at materialization:
  5890822de6e5df1e1901732a71adc66d4a9d1879
Kind: Product UI Contract — Visual Hierarchy
GitHub tracking Issue: 未採番（親 Issue を増やさない）
Screen application / code / SCSS mutation: NOT AUTHORIZED
Fresh Review: PASS（docs/architecture/ui-visual-hierarchy-contract-1-fresh-review.md）
P2 purity correction: COMPLETE（docs/architecture/ui-visual-hierarchy-contract-1-p2-purity-correction.md）
Draft PR publication: THIS GO
Ready / Merge: NOT AUTHORIZED
LIVE WRITE / Deploy: NOT AUTHORIZED
```

## 1. Purpose

本 Contract は、業務意味を変えずに **何を強く・弱く・少なく見せるか** の横断正本である。

```text
Domain / Contracts          ← 何を意味するか
Visual Principles（DADS-03） ← どう見えるか・操作するか（原則）
Component Catalog           ← どの component で表現するか
Screen Templates            ← どの screen 骨格か
UI Semantic Rules           ← 意味を壊していないか（UI-SEM-01..05）
Visual Hierarchy（本文書）  ← 何を強く・弱く見せるか
```

Catalog / Templates / UI-SEM / DADS-03 を置き換えない。

```text
目標 ≠ 新デザインシステム
目標 ≠ 画面の具体配置
目標 = 横断の情報階層・余白・CTA ウェイト・card / density 規則
```

業務意味は対象外。

```text
OUT
  いつから「見直し時期」と判定するか（#442）
  SupportPlan lifecycle 意味（#419）
  save 5-state 意味
  TRACK A #448 functional residual
```

## 2. Namespace KEEP

情報階層に裸の `PRIMARY / SECONDARY / TERTIARY` を使わない。

| 名前 | 正本 | 意味 |
|---|---|---|
| `EMPHASIS-1` / `EMPHASIS-2` / `EMPHASIS-3` | 本文書 N-1 | 情報の視覚ランク |
| `SBS_ACTION.primary` / `secondary` / `tertiary` | VP-1 tokens | CTA の視覚ウェイト |
| DADS-03 §4.1 `primary` label | Style Guide | 要確認 / 未記録 / 期限接近 |
| `textPrimary` / `textSecondary` | DADS-04 / VP-1 | 本文色 / 補助色。ランク名にしない |

H-05 の PRIMARY は **`SBS_ACTION` のみ** を指す。

## 3. EMPHASIS ranks（N-1 / H-03）

画面内の情報は 3 段の強調ランクを持つ。業務意味は変えない。同じ語彙でも視覚ランクは変えてよい。

| Rank | 意味 |
|---|---|
| `EMPHASIS-1` | その view で最も強く見せる情報 |
| `EMPHASIS-2` | 判断に必要だが主役ではない |
| `EMPHASIS-3` | 通常は弱く / 少なく。必要時だけ |

具体割当（誰の名前を EMPHASIS-1 にするか、Plan metadata を EMPHASIS-3 にするか）は SCREEN-SPECIFIC。

- PLANNER 一覧 7 要素 → `#444`
- FIELD_STAFF Plan metadata → `#448`

## 4. Typography（H-01）

既存 `SBS_TYPOGRAPHY` alias を使う。新 font-size スケールは禁止。

| 用途 | Alias |
|---|---|
| destination 主見出し | `pageTitle` |
| section 見出し | `sectionTitle` |
| EMPHASIS-1 本文 | `body` + semibold（見出しが必要な塊は `sectionTitle`） |
| EMPHASIS-2 本文 | `body` regular |
| EMPHASIS-3 | `meta` |

INV-22 dialect の一括解消はしない。スケール外の値を新正本にしない。

## 5. Spacing（H-02）

既存 `SBS_SPACE` を使う。

```text
情報グループ間  space.4 以上
グループ内      space.1–2
```

tablet compact の具体値は `#448` SCREEN-SPECIFIC。INV-22 一括解消はしない。

## 6. Status / Action（H-04）

状態チャネルと操作チャネルを同じ視覚ウェイトで並べない。

```text
StatusBadge / 状態 label  = 状態チャネル
要対応 / CTA / 記録開始   = 操作チャネル
#444 状態 ≠ 要対応（意味）= UNCHANGED
#419 / #442 判定意味      = UNCHANGED
```

badge 削減の具体配置は `#444`。FIELD_STAFF カード上の未記録 / overlay / M2 の並べ方は `#448`。

## 7. CTA hierarchy（H-05）

`SBS_ACTION` を消費する。情報ランクと混ぜない。

```text
1 view の SBS_ACTION.primary は 1 つ
戻る / 確認 = SBS_ACTION.tertiary
どの業務操作が存在するかは変えない
```

Today 枠ごと CTA、次の未記録と行詳細の同時強調は SCREEN-SPECIFIC。

## 8. Card usage（H-06）

```text
非操作 KPI は card にしない（strip / inline metric）
操作単位だけ card / row にしてよい
新 KPI primitive は増やさない
```

KPI card → metric strip の具体配置は `#444`。本規則の存在 ≠ その実装 GO。

## 9. Density by role（H-07）

Templates の強調順と UI-SEM-05 を維持する。nav / destination は変えない。

| presentationRole | Density | 原則 |
|---|---|---|
| `FIELD_STAFF` | LOW | tablet、少情報、touch-first |
| `PLANNER` | MEDIUM | Planning PC |
| `ADMIN_AUDIT` | 件数優先 | 未完了 / 期限 / 記録状況。編集権限は増やさない |

Plan metadata 通常非表示、Today / Users の具体 density は `#448`。本規則の存在 ≠ 非表示実装 GO。

## 10. How agents use this contract

- `design-context`: 対象 view の EMPHASIS-1 を 1 つ固定する。`SBS_ACTION.primary` を 1 つ固定する。無い / 複数なら HOLD。新 token スケールを発明しない
- `design-review`: 差分が §11 forbidden に当たるかを監査する
- 画面の具体割当不足を FAIL にしない。SCREEN-SPECIFIC は `#444` / `#448` の別 GO
- Domain 意味変更が必要なら **別 Decision**

## 11. Forbidden substitutions

```text
EMPHASIS-* を SBS_ACTION.primary と呼ぶ
SBS_ACTION.primary を情報ランクに使う
DADS-03 primary label（要確認）を EMPHASIS 名に使う
textPrimary を情報ランク名に使う
新 font-size スケール / 新 KPI primitive
1 view に SBS_ACTION.primary を複数置く
非操作 KPI を新しい card family にする
presentationRole で destination / primary nav を変える（UI-SEM-05）
状態と要対応を同じ視覚ウェイトで畳む
save_failed と save_outcome_unknown を丸める
#419 / #442 の判定意味を見た目都合で変える
```

## 12. SCREEN-SPECIFIC / NOT THIS CONTRACT

### `#444` PLANNER

```text
KPI card → metric strip の具体配置
PLANNER row の EMPHASIS 割当
今日やること → Action Queue
SupportPlan detail hierarchy
section navigation + content layout
```

### `#448` FIELD_STAFF

```text
Plan metadata 通常非表示
Today / Users の具体 density
touch-first / 時間順の画面適用
大きめ Typography の画面適用
```

ADMIN / AUDIT 画面の具体適用は後続 track。

## 13. Explicit OUT

```text
#444 / #448 Implementation Start
KPI strip 実装
Plan metadata 非表示実装
TRACK A functional residual
SCSS / React / fixture mutation
Typography 新スケール
UI-HIERARCHY-SYSTEM 親Issue
LIVE WRITE / Deploy
Issue mutation
#68 / #69 / #70 / #356 / #299 reopen
```

## 14. Next

```text
THIS
Contract materialization COMPLETE
Fresh Review PASS
P2 CONTRACT-PURITY CORRECTION COMPLETE
DRAFT PR PUBLICATION = THIS GO
↓ STOP

Ready / Merge: NOT AUTHORIZED（別 GO）
PR 番号は PR body（repository docs に live gate を書かない）

その後の別 track
#444 PLANNER screen-specific application
#448 FIELD_STAFF screen-specific application
```
