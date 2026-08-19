# Decision Packet — UI-VISUAL-HIERARCHY-CONTRACT-1

この文書は **UI-VISUAL-HIERARCHY-CONTRACT-1** の Human Decision 用選択票である。
Product UI Contract の第4層（何を強く・弱く見せるか）について、
H-01〜H-07 を **個別に** `ADOPT / DEFER / REJECT` する。

7項目から 1 つだけ選ぶ ballot ではない。
Human が N-1 SELECT + H-01〜H-07 ALL ADOPT を選んだあと、
本 packet は歴史的 ballot として残す。

Selection record:
[`decision-ui-visual-hierarchy-contract-1-selection.md`](./decision-ui-visual-hierarchy-contract-1-selection.md)

本 packet の CONSUME は Implementation Start ではない。
Contract 本文は別 GO で materialized した（[`ui-visual-hierarchy-contract-1.md`](./ui-visual-hierarchy-contract-1.md)）。
Merge / 画面適用はこの packet からは出ない。
`#444` / `#448` の画面改修 GO ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-UI-VISUAL-HIERARCHY-CONTRACT-1
Kind: Human Decision packet
Status: CONSUMED（Human Selected N-1 / H-01..H-07 ALL ADOPT）
Agent auto-select: FORBIDDEN
Parent policy: #392
PLANNER owner: #444
FIELD_STAFF owner: #448
Observed main at packet:
  5890822de6e5df1e1901732a71adc66d4a9d1879
TRACK B read-only reconciliation: COMPLETE / CLOSED / STOP
Reconciliation input: TRACK B 分類結果（working-tree 比較。main SSOT ではない）
Selection record:
  decision-ui-visual-hierarchy-contract-1-selection.md
Contract body:
  docs/architecture/ui-visual-hierarchy-contract-1.md
Contract materialization: GO CONSUMED
Implementation Start: NOT AUTHORIZED
LIVE WRITE: HOLD
Deploy: HOLD
Issue mutation: NOT AUTHORIZED
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

---

## 0. CURRENT

```text
CURRENT

Decision-UI-VISUAL-HIERARCHY-CONTRACT-1
CONSUMED

Reconciliation:
COMPLETE
non-main SSOT

N-*:
N-1 SELECTED

H-01〜H-07:
ALL ADOPT

Contract:
ADDED（docs materialization）
Fresh Review: PASS
P2 purity correction: COMPLETE
Draft PR publication: THIS GO
Ready / Merge: NOT AUTHORIZED

Implementation:
NOT AUTHORIZED

#444 / #448 screen application:
NOT AUTHORIZED

ACTION:
STOP
（NEXT = Human Ready / Merge。本 Draft PR では許可しない）
```

TRACK B 比較ファイル
[`ui-visual-hierarchy-contract-1-reconciliation.md`](./ui-visual-hierarchy-contract-1-reconciliation.md)
は **比較入力** であり、Contract / Selection の SSOT ではない。
本 packet はそれを main 正本として引用しない。入力は「TRACK B で提示された分類結果」である。

上位入口（main 上の正本）:

- [`dads-application-style-guide-v1.md`](./dads-application-style-guide-v1.md)
- [`dads-04-design-tokens.md`](./dads-04-design-tokens.md)
- [`visual-polish-1-foundations.md`](./visual-polish-1-foundations.md)
- [`ui-component-catalog-v1.md`](./ui-component-catalog-v1.md)
- [`ui-screen-templates-v1.md`](./ui-screen-templates-v1.md)
- [`ui-agent-impl-3-eslint-ui-sem.md`](./ui-agent-impl-3-eslint-ui-sem.md)

---

## 1. 判断単位

Contract は **何を強く・弱くするかの規則** まで。
具体的な画面改修は owner Issue へ返す。

```text
Product UI Contract

Component Catalog     何の部品を使うか     置換しない
Screen Templates      画面の骨格           置換しない
UI Semantic Rules     意味を壊していないか 置換しない
Visual Hierarchy      何を強く・弱く見せるか  ← 本 ballot
```

業務意味は対象外。

```text
OUT of this Decision
  いつから「見直し時期」と判定するか（#442）
  SupportPlan lifecycle 意味（#419）
  save 5-state 意味
  TRACK A #448 functional residual
```

### 1.1 選定順

**N-* は先に決める。** Human は N-1 を先に SELECT し、その後 H-03 を ADOPT した。

```text
1. N-*  SELECT ONE（情報階層の呼称）
2. H-01 .. H-07  各 ADOPT / DEFER / REJECT
   H-03 は N-* の後
```

H-01 / H-02 / H-04 / H-05 / H-06 / H-07 は N-* を待たなくてよい。
H-03 ADOPT を Contract 本文にするには N-* が SELECTED である必要がある。

各 H は独立。1 件の ADOPT が他を自動 ADOPT しない。
H-01 ADOPT かつ H-03 ADOPT のときだけ、強調ランクを既存 Typography alias へ写す接続を後続 Contract が書いてよい。

| ID | 問い | 依存注記 |
|---|---|---|
| N-* | 情報階層の呼称（SELECT ONE） | **先に決める。** H-03 本文化の前提。N-1 SELECTED |
| H-01 | Typography hierarchy | 独立。新スケール禁止 |
| H-02 | Spacing hierarchy | 独立。INV-22 一括解消はしない |
| H-03 | Information emphasis hierarchy | **N-* の後。** 裸の PRIMARY は使わない |
| H-04 | Status / Action separation | 独立。`#419` / `#442` 意味は触らない |
| H-05 | CTA hierarchy | 独立。**CTA 名前空間**（`SBS_ACTION`） |
| H-06 | Card usage rules | 独立。配置は `#444` |
| H-07 | Density by role | 独立。具体非表示は `#448` |

選択語:

```text
N-*     SELECT ONE of N-1 / N-2 / N-3（または命名全体を後回しにするなら未選定のまま）
ADOPT   後続 Contract 本文の候補として採用する（本文 LOCK はこの packet ではしない）
DEFER   今は Contract に入れない。後で再投票してよい
REJECT  横断規則にしない。画面 owner の任意適用に残すか、捨てる
```

Human GO が本 ballot を CONSUME した。下記は Selection record が正本。

### 1.2 Human ballot（CONSUMED）

```text
Decision-UI-VISUAL-HIERARCHY-CONTRACT-1

N-* Information hierarchy naming:
N-1 SELECTED
  N-1 EMPHASIS-1 / EMPHASIS-2 / EMPHASIS-3
  N-2 NOT SELECTED
  N-3 NOT SELECTED

H-01 Typography hierarchy:
ADOPT

H-02 Spacing hierarchy:
ADOPT

H-03 Information emphasis hierarchy:
ADOPT

H-04 Status / Action separation:
ADOPT

H-05 CTA hierarchy:
ADOPT

H-06 Card usage rules:
ADOPT

H-07 Density by role:
ADOPT
```

---

## 2. 名称サブ票 N-*（H-03 の前提。SELECT ONE。N-1 SELECTED）

情報階層に裸の `PRIMARY / SECONDARY / TERTIARY` を使わない。
衝突する既存語は KEEP する。

```text
KEEP
  SBS_ACTION.primary / secondary / tertiary
  = CTA visual weight only

KEEP
  DADS-03 §4.1 “primary label”
  = 要確認 / 未記録 / 期限接近 の提示語彙

KEEP
  SBS_COLOR.textPrimary / textSecondary
  = 本文色 / 補助色。情報ランク名にしない
```

N-* は ADOPT/DEFER/REJECT ではなく **SELECT ONE**。Human は **N-1** を選んだ。

### N-1 — EMPHASIS-1 / EMPHASIS-2 / EMPHASIS-3 — SELECTED

```text
EMPHASIS-1  その view で最も強く見せる情報
EMPHASIS-2  判断に必要だが主役ではない
EMPHASIS-3  通常は弱く / 少なく。必要時だけ
```

`SBS_ACTION` と名前空間が分かれる。SELECTED。

### N-2 — CONTENT-PRIMARY / CONTENT-SECONDARY / CONTENT-TERTIARY — NOT SELECTED

CTA の `SBS_ACTION` と語を並べ、接頭辞で分ける。衝突は残る。

### N-3 — PRIMARY / SECONDARY / TERTIARY のまま — 非推奨 / NOT SELECTED

Contract 冒頭で非互換と書いても、エージェントが `SBS_ACTION` と混ぜやすい。

N-1 SELECTED のため H-03 ADOPT は呼称付きで CONSUME できる。Contract 本文は別 GO。

---

## 3. Options（H-01〜H-07）

### H-01 — Typography hierarchy — SELECTED ADOPT

既存: DADS-03 §6.2 / §6.6。`SBS_TYPOGRAPHY` `pageTitle` / `sectionTitle` / `body` / `meta`。新スケールは発明しない。

ADOPT 時に LOCK する規則:

```text
横断の文字階層は既存 alias を使う。
pageTitle / sectionTitle は destination 骨格（Templates）のまま。
本文の強弱は body semibold と meta で足りる。
INV-22 dialect の一括解消はしない。
```

H-03 も ADOPT なら、後続 Contract が強調ランクをこの alias へ写してよい。H-01 単独では情報ランク名を導入しない。

- **ADOPT — SELECTED**
- DEFER — NOT SELECTED
- REJECT — NOT SELECTED

### H-02 — Spacing hierarchy — SELECTED ADOPT

既存: `SBS_SPACE` 1–6。tablet compact の具体値は `#448` 適用。

ADOPT 時に LOCK する規則:

```text
情報グループ間は space.4 以上
グループ内は space.1–2
INV-22 一括 dialect 解消はしない
```

- **ADOPT — SELECTED**
- DEFER — NOT SELECTED
- REJECT — NOT SELECTED

### H-03 — Information emphasis hierarchy — SELECTED ADOPT

**N-* の後。** 呼称は N-*。裸の PRIMARY / SECONDARY / TERTIARY は使わない。

既存: 行内の強弱規則は Catalog / Templates / UI-SEM に無い。VP-1 `SBS_ACTION` は操作ウェイトであり、情報ランクではない。

ADOPT 時に LOCK する規則:

```text
画面内の情報は 3 段の強調ランクを持つ。
業務意味は変えない。同じ語彙でも視覚ランクは変えてよい。
```

SCREEN-SPECIFIC に落とすもの: PLANNER 7 要素の具体割当（`#444`）、Plan metadata を何段にするか（`#448`）。

- **ADOPT — SELECTED**
- DEFER — NOT SELECTED
- REJECT — NOT SELECTED

### H-04 — Status / Action separation — SELECTED ADOPT

既存: Catalog は `StatusBadge` と CTA を別部品。`#444` は状態 ≠ 要対応を意味として LOCK。視覚ウェイトの横断規則は無い。

ADOPT 時に LOCK する規則:

```text
状態チャネルと操作チャネルを同じ視覚ウェイトで並べない。
判定意味（#419 / #442）は変えない。
```

SCREEN-SPECIFIC: PLANNER の badge 削減、FIELD_STAFF カード上の未記録 / overlay / M2 の並べ方。

- **ADOPT — SELECTED**
- DEFER — NOT SELECTED
- REJECT — NOT SELECTED

### H-05 — CTA hierarchy（`SBS_ACTION` 名前空間） — SELECTED ADOPT

ここでの PRIMARY / TERTIARY は **`SBS_ACTION` のみ**。H-03 / N-* と混ぜない。

既存: `SBS_ACTION` token はある。screen は未消費。

ADOPT 時に LOCK する規則:

```text
1 view の SBS_ACTION.primary CTA は 1 つ。
戻る / 確認は SBS_ACTION.tertiary。
どの業務操作が存在するかは変えない。
```

SCREEN-SPECIFIC: Today 枠ごとの CTA、次の未記録と行詳細の同時強調。

- **ADOPT — SELECTED**
- DEFER — NOT SELECTED
- REJECT — NOT SELECTED

### H-06 — Card usage rules — SELECTED ADOPT

既存: DADS-03 §7「KPI 等の非操作ブロックをカード過剰にしない」。Overview / PLANNER list はまだ `.kpiCard`。

ADOPT 時に LOCK する規則:

```text
非操作 KPI は card にしない（strip / inline metric）。
操作単位だけ card / row にしてよい。
新 KPI primitive は増やさない。
```

SCREEN-SPECIFIC: KPI card → metric strip の具体配置は `#444`。本規則の ADOPT ≠ その実装 GO。

- **ADOPT — SELECTED**
- DEFER — NOT SELECTED
- REJECT — NOT SELECTED

### H-07 — Density by role — SELECTED ADOPT

既存: Templates は強調順のみ。`#392` ROLE-UI-01/02/03 は優先リスト。LOW / MEDIUM / HIGH の契約語は無い。

ADOPT 時に LOCK する規則:

```text
FIELD_STAFF = LOW（tablet、少情報、touch-first）
PLANNER = MEDIUM
ADMIN / AUDIT = 件数優先
nav / destination は変えない（UI-SEM-05 / Templates）
```

SCREEN-SPECIFIC: Plan metadata 通常非表示、Today / Users の具体 density は `#448`。本規則の ADOPT ≠ 非表示実装 GO。

- **ADOPT — SELECTED**
- DEFER — NOT SELECTED
- REJECT — NOT SELECTED

---

## 4. SCREEN-SPECIFIC / NOT THIS BALLOT

横断規則に混ぜない。owner へ残す。

### `#444` PLANNER

```text
KPI card → metric strip の具体配置
PLANNER row hierarchy の具体配置
今日やること → Action Queue
SupportPlan detail hierarchy
section navigation + content layout
```

### `#448` FIELD_STAFF

```text
Plan metadata 通常非表示
Today / Users の具体的 density
touch-first / 時間順の画面適用
大きめ Typography の画面適用
```

ADMIN / AUDIT の画面設計は後続。本 packet で決めない。

---

## 5. 明示的 OUT

```text
H-01〜H-07 から 1 件だけ選ぶこと
Agent による ADOPT 推測
N-* の自動 SELECTED（N-1 推奨 ≠ 採用）
N-* 未選定のまま H-03 を Contract 本文にすること
UI-HIERARCHY-SYSTEM 親Issue
Product UI Contract 本文ファイルの追加 / LOCK
Typography token の新スケール
#444 Implementation Start
#448 TRACK A exact-slice 選定 / 実装
FIELD-STAFF-MULTI-USER-SCALE-1 の自動第一候補化
Plan metadata 非表示の実装
KPI strip の実装
TRACK C current-SHA runtime / smoke
GitHub Issue / comment 投稿
LIVE WRITE / Deploy
Issue close
Ready / Merge auto-progress
#68 / #69 / #70 / #356 / #299 reopen
#419 / #442 判定意味の変更
```

---

## 6. Human Selection 後の工程（実装ではない）

Human が ballot を埋めたあとも、一気に実装しない。

```text
Human Selection
↓
Decision packet CONSUME / selection record
↓ STOP

別 GO
UI-VISUAL-HIERARCHY-CONTRACT-1
Contract materialization
↓
Fresh Review PASS（2026-08-19）
↓
P2 CONTRACT-PURITY CORRECTION COMPLETE
↓
DRAFT PR PUBLICATION = THIS GO
↓ STOP

Ready / Merge: NOT AUTHORIZED（別 GO）

その後の別 track
#444 PLANNER screen-specific application
#448 FIELD_STAFF screen-specific application
```

selection record は別ファイル。本 packet を CONSUME しても Contract 本文 LOCK にも Implementation Start にもならない。

---

## 7. Stop condition

```text
This packet is CONSUMED.
Selection record:
  decision-ui-visual-hierarchy-contract-1-selection.md
N-1 SELECTED
H-01..H-07 ALL ADOPT
Contract body materialized:
  docs/architecture/ui-visual-hierarchy-contract-1.md

Do not auto-start #444 / #448 application.
Do not treat materialization or Draft PR as Ready / Merge.

NEXT:
  Human Ready GO → Human Merge GO
  （本 Draft PR では許可しない）

ACTION:
STOP
```
