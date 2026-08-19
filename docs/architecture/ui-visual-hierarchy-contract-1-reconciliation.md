# UI-VISUAL-HIERARCHY-CONTRACT-1 — read-only reconciliation

Status: **COMPARISON ONLY**
Date: 2026-08-19
Mutation: **NONE**
Implementation: **NONE**
Contract LOCK: **NOT AUTHORIZED**

```text
NO implementation
NO source / test / schema modification
NO Product UI Contract body add / LOCK
NO GitHub Issue create / comment / close
NO commit / push / PR / merge / deploy
NO SharePoint / App Catalog / M365 / Entra / production write
```

Next gate (Human Decision; not started): whether to add **UI-VISUAL-HIERARCHY-CONTRACT-1** as a Product UI Contract layer from the MISSING rows below.

---

## 1. CURRENT / TRACK B

```text
CURRENT
main:
5890822de6e5df1e1901732a71adc66d4a9d1879

#392:
OPEN / parent SSOT

#444:
OPEN / PLANNER owner

#448:
OPEN / FIELD_STAFF remaining owner
FIELD-STAFF-TODAY-TABLET-UX-RECONCILIATION-1: COMPLETE / READ-ONLY

TRACK A
#448 functional / workflow residual
NOT THIS PACKET

TRACK B
UI-VISUAL-HIERARCHY-CONTRACT-1
read-only existing-contract reconciliation
THIS PACKET

Implementation:
NOT AUTHORIZED

LIVE WRITE:
HOLD

Deploy / Redeploy:
NOT AUTHORIZED
```

観測正本は **origin/main `5890822`**。ローカル作業ブランチは使わない。

`#444` Decision 文書と `SupportPlanManagementList` は main に存在する。本パケットはそれらを read-only 参照する。

---

## 2. Product UI Contract 4層（置換しない）

既存 UI-AGENT-SYSTEM-V1 を置き換えない。第4層候補だけを突合する。

```text
Product UI Contract

Component Catalog
「何の部品を使うか」
docs/architecture/ui-component-catalog-v1.md

Screen Templates
「画面の骨格をどう作るか」
docs/architecture/ui-screen-templates-v1.md

UI Semantic Rules
「意味を壊していないか」
docs/architecture/ui-agent-impl-3-eslint-ui-sem.md
UI-SEM-01..05

Visual Hierarchy Contract  ← 未 LOCK。本パケットの対象
「何を強く・弱く見せるか」
```

上位 Visual Principles は Product UI Contract の外にある。

```text
DADS-03 Style Guide     どう見えるか・操作するか（原則）
DADS-04 / VP-1 tokens   値と alias。画面適用規則ではない
#392 Role / Device      誰が何を先に見るか（優先）。密度契約語は持たない
```

本パケットは `design-context` / `design-review` 判定を出さない。Architecture Gate PASS も出さない。

業務意味は対象外。

```text
IN
  何を強く・弱く・少なく見せるか

OUT
  いつから「見直し時期」と判定するか（#442）
  SupportPlan lifecycle 意味（#419）
  save 5-state 意味
  ABC / correction / cancellation の業務導線不足（TRACK A / #448）
```

---

## 3. 分類語

| 語 | 意味 |
|---|---|
| ALREADY COVERED | 既存正本が、横断規則として答えている |
| PARTIALLY COVERED | トークン・原則・画面 Decision はあるが、横断の使い分け規則が無い |
| MISSING | 横断 Contract として答えが無い |
| CONFLICT | 同じ語が別の層で別の意味を持つ |
| SCREEN-SPECIFIC / NOT CONTRACT | 画面 owner（`#444` / `#448`）の適用。Contract 本文にしない |

7項目のどれも **ALREADY COVERED 単独では終わらない**。トークンや画面 Decision はあっても、「何を強く見せるか」の横断規則は未 LOCK である。

---

## 4. 7×正本 分類表

### 4.1 Typography hierarchy — PARTIALLY COVERED

| 正本 | 既にあるもの | 足りないもの |
|---|---|---|
| DADS-03 §6.2 / §6.6 | 読みやすさ・階層の基礎。h1 は 1 画面 1 つ。具体値は DADS-04 | role 別の大きさ。情報ランクへの割当 |
| DADS-04 / VP-1 | `SBS_TYPOGRAPHY`: `pageTitle` / `sectionTitle` / `body` / `meta`。scale 100–500 | alias を PRIMARY 情報に使う規則 |
| Catalog / Templates / UI-SEM | heading slot と h1 汚染禁止。視覚階層ではない | — |
| `#392` | Tablet を主装置とするだけ | 大きめ Typography の数値規則 |
| `#444` | DestinationList + h1「支援計画」 | 行内 7 要素の type rank |
| `#448` 現状 | Users 行の `personLabel` と `planSummary` がどちらも `font-size-body` | Plan metadata を meta へ落とす適用 |

根拠:

- `spfx/src/shell/tokens/semantic.ts` — `SBS_TYPOGRAPHY`
- `spfx/src/shell/users/UsersUx.module.scss` — `.personLabel` と `.planSummary` が同じ body サイズ。`.attentionNote` は semibold で利用者名と同程度
- `spfx/src/shell/dashboard/DashboardUx.module.scss` — `.kpiCount` が `1.5rem`（scale 最大 `1.25rem` の外。INV-22 dialect）

新フォントスケールは発明しない。不足は **alias の使い分け** である。

### 4.2 Spacing hierarchy — PARTIALLY COVERED

| 正本 | 既にあるもの | 足りないもの |
|---|---|---|
| DADS-03 §6.2 / INV-22 | 方言差は必須修正ではない | グループ余白 vs 装飾余白 |
| DADS-04 / VP-1 | `SBS_SPACE` 1–6（`0.25rem` … `2rem`） | 情報グループへの割当 |
| `#448` | `USERS_LIST_COMPACT_DENSITY`（≤768px gap/padding）。44px は維持 | 横断の density 語との接続 |
| `#444` | compact KPI 方針 | strip vs card の余白規則 |

根拠:

- `spfx/src/shell/tokens/raw.ts` — `SBS_RAW_SPACE`
- `spfx/src/shell/users/users-list-compact.ts`

### 4.3 PRIMARY / SECONDARY / TERTIARY — CONFLICT + MISSING

**CONFLICT（名前）。** 同じ語が既に 3 用途ある。

| 既存の使い方 | 層 | 意味 |
|---|---|---|
| DADS-03 §4.1 `primary` label | 提示語彙 | 要確認 / 未記録 / 期限接近を一次ラベルにする。情報ランクではない |
| `SBS_ACTION` `primary` / `secondary` / `tertiary` | VP-1 tokens | **操作の視覚ウェイト**。「画面に最重要 CTA を増やしすぎない」 |
| `SBS_COLOR.textPrimary` / `textSecondary` | tokens | 本文色 / 補助色。情報ランクではない |
| 今回欲しい PRIMARY / SECONDARY / TERTIARY | 未 LOCK | **行・カード内の情報の強弱**（例: 利用者名 PRIMARY、Plan metadata TERTIARY） |

`SBS_ACTION` は CTA 階層（§4.5）の正本候補である。情報階層に同じ語を流用すると、エージェントがボタン weight と行内強調を混ぜる。

情報ランク規則そのものは **MISSING**。

画面観測（LOCK しない）:

- FIELD_STAFF Users 行: `personLabel` / `planSummary` / `attentionNote` が近い強さ
- Today ボード: `activityTitle` と `手順ID: … (v…)` が同時に見える
- PLANNER 一覧: 7 要素は意味分離済み。type rank は未固定。`version` / `observation` / `reviewWindow` は同じ `.meta`

### 4.4 Status / Action separation — PARTIALLY COVERED

| 正本 | 既にあるもの | 足りないもの |
|---|---|---|
| Catalog | `StatusBadge` = 状態 label。CTA は別 button。SaveStateNotice ≠ StatusBadge | 1 カード上の視覚ウェイト |
| DADS-03 §4.2 | save QUIET vs EMPHASIZED | status chrome vs 要対応 chrome |
| `#444` Decision | **状態 ≠ 要対応** LOCKED。承認バッジを制度要件にしない | 横断 Contract ではない（画面 Decision） |
| `#448` 現状 | 未記録バッジ、session overlay、M2、詳細 CTA が同一カード | 混在の整理は SCREEN-SPECIFIC |

PLANNER の状態/要対応分離は `#444` が owner。Contract は「状態チャネルと操作チャネルを同じ強さで並べない」までを候補にし、判定意味は `#419` / `#442` に残す。

### 4.5 CTA hierarchy — PARTIALLY COVERED

| 正本 | 既にあるもの | 足りないもの |
|---|---|---|
| VP-1 `SBS_ACTION` | primary = 画面の最重要操作を増やしすぎない。secondary / tertiary 定義あり | 画面が token を消費していない |
| DADS-03 §6.7 / §6.1 | 操作可能に見えるものは操作可能。主要 CTA へ鍵盤到達 | 1 view 1 PRIMARY の強制 |
| Templates | destination を CTA で変えない（UI-SEM-05） | CTA 視覚ウェイト |
| 実装 | ADMIN の Today CTA は `tapButtonQuiet`。FIELD は通常 `tapButton` | FIELD Today は枠ごとに同ウェイト CTA |

根拠:

- `SBS_ACTION` の参照は `semantic.ts` と `tokens.test.ts` のみ。screen TSX は未使用
- `TodaySupportDayBoard.tsx` — 各枠が同じ `tapButton`
- UsersList — 行 CTA「詳細」と「次の未記録の利用者」が並び得る

どのボタンを残すかは SCREEN-SPECIFIC。Contract 候補は「1 view に PRIMARY CTA は 1 つ。戻る / 確認は TERTIARY」まで。

### 4.6 Card usage rules — PARTIALLY COVERED

| 正本 | 既にあるもの | 足りないもの |
|---|---|---|
| DADS-03 §7 Cards | 必要時のみ。KPI 等の非操作ブロックをカード過剰にしない | strip / row / card の使い分け表 |
| Overview | Family R KPI は `.kpiCard` × 4 | metric strip への変換規則 |
| `#444` | compact KPI（Family P）。大きなダッシュボード化禁止 | 実装はまだ `.kpiCard` × 3 |
| `#448` | Today の `itemCard` は選択可能な予定。Users 行もカード型 | Plan metadata をカード内で弱める適用 |

KPI card → metric strip は **SCREEN-SPECIFIC / `#444`**。DADS-03 は既に「KPI をカード過剰にしない」と書いてあるので、新 primitive は不要。

### 4.7 Density by role — PARTIALLY COVERED

| 正本 | 既にあるもの | 足りないもの |
|---|---|---|
| Templates | role は **強調順のみ**。destination / nav を変えない | LOW / MEDIUM / HIGH の契約語 |
| `#392` ROLE-UI-01/02/03 | FIELD = Tablet / 今日・未記録。PLANNER = PC / 見直し。ADMIN = 未完了・期限 | 密度の数値 |
| `presentation-role.ts` | Overview / UserDetail / SupportPlan の block 順 | 表示量（何を隠すか） |
| `#448` | compact tablet Users。44px 維持。8 人 roster | 18 人は TRACK A。密度契約ではない |
| `#444` | Planning PC。高密度 7 列テーブルに戻さない | PLANNER MEDIUM の定義 |

`supportPlanBlockOrderForRole("FIELD_STAFF")` は `procedures` / `versions` を並べない。これは骨格順であり、「Plan metadata を通常非表示」の Contract ではない。非表示適用は `#448` SCREEN-SPECIFIC。

LOW / MEDIUM / HIGH を Contract 語にするなら **MISSING**。

---

## 5. CONFLICT 解消案（候補。採用しない）

本節は Human Decision 用の候補である。SELECTED にしない。

```text
KEEP
  SBS_ACTION.primary / secondary / tertiary
  = CTA visual weight only
  do not reuse for row/card information rank

KEEP
  DADS-03 §4.1 “primary label”
  = 要確認 / 未記録 / 期限接近 の提示語彙
  do not reuse as information rank

CANDIDATE A
  information rank を EMPHASIS-1 / EMPHASIS-2 / EMPHASIS-3 と呼ぶ

CANDIDATE B
  information rank を CONTENT-PRIMARY / CONTENT-SECONDARY / CONTENT-TERTIARY と呼ぶ
  （CTA の SBS_ACTION と語を並べるが接頭辞で分ける）

CANDIDATE C
  information rank を PRIMARY / SECONDARY / TERTIARY のまま使い、
  Contract 冒頭で SBS_ACTION と非互換と書く
  （衝突が残る。非推奨）
```

色トークン `textPrimary` / `textSecondary` は情報ランク名にしない。

---

## 6. SCREEN-SPECIFIC / NOT CONTRACT

横断 Contract に書かない。owner へ残す。

### 6.1 `#444` PLANNER

```text
KPI card → metric strip
今日やること → Action Queue
一覧 row の情報ランク適用
status badge 削減
状態と要対応の分離（Decision 済み。視覚ウェイト適用は残）
CTA 優先順位（詳細 XOR 新規作成）
SupportPlan detail hierarchy
section navigation + content layout
```

正本: `docs/architecture/decision-support-plan-management-list-ui-1-selection.md`（main）。実装 surface: `SupportPlanManagementList.tsx`。Implementation Start を本パケットから導出しない。

### 6.2 `#448` FIELD_STAFF

```text
Plan metadata を通常非表示（hierarchy 適用。機能不足ではない）
touch-first / 時間順の強調
大きめ Typography の画面適用
Today 枠 CTA の 1 PRIMARY 化
Users 行で未記録 / overlay / M2 の視覚分離
```

次は機能不足と混同しない。TRACK A（18人、ABC、訂正、取消、今日の利用者、runtime evidence）は本パケットの対象外。

`FIELD-STAFF-MULTI-USER-SCALE-1` を第一候補へ戻さない。

### 6.3 ADMIN / AUDIT

後続。本ゲートで画面設計しない。Overview の KPI 先頭と confirm CTA は既存 `presentation-role.ts` の強調順のみ。

---

## 7. MISSING — 後続 Contract 候補

LOCK しない。Human がどれを Contract 本文にするか選ぶ。

| ID | 候補規則 | 置き換えない相手 |
|---|---|---|
| H-01 | 情報ランクを 3 段で定義する（名前は §5 候補） | `SBS_ACTION`、DADS-03 primary label |
| H-02 | 情報ランクを `SBS_TYPOGRAPHY` alias へ写す（PRIMARY≈body semibold、TERTIARY≈meta） | 新 font-size スケール |
| H-03 | 余白は情報グループに `space.4+`、グループ内は `space.1–2` | INV-22 一括 dialect 解消 |
| H-04 | 状態チャネルと操作チャネルを同じ視覚ウェイトで並べない | `#419` / `#442` の判定意味 |
| H-05 | 1 view の PRIMARY CTA は 1 つ。戻る / 確認は TERTIARY。`SBS_ACTION` を消費する | どの業務操作が存在するか |
| H-06 | 非操作 KPI は card にしない（strip / inline metric）。操作単位だけ card / row | 新 KPI primitive |
| H-07 | role density 語: FIELD_STAFF = LOW（tablet、少情報）、PLANNER = MEDIUM、ADMIN = 件数優先。nav / destination は変えない | Templates の強調順、`#392` 優先リスト |

H-07 の「不要な Plan metadata を通常非表示」は規則の帰結であり、`#448` が適用する。

---

## 8. 画面観測メモ（分類の根拠。欠陥票ではない）

| 観測 | 分類への使い方 |
|---|---|
| Users `.personLabel` と `.planSummary` が同じ `font-size-body` | Typography / 情報ランクが PARTIAL / MISSING |
| Overview `.kpiCount` が `1.5rem` | スケール外 dialect。新スケール発明の根拠にしない |
| Overview / PLANNER list が `.kpiCard` | Card usage PARTIAL。strip 化は `#444` |
| `SBS_ACTION` 未消費 | CTA hierarchy PARTIAL |
| PLANNER 行は状態 badge と `要対応:` を分離済み | Status/Action の意味分離は画面 Decision。視覚ランクは未固定 |
| FIELD_STAFF Today は 1 列、他 role は `denseDesktopLayout` | Density PARTIAL。LOW/MEDIUM/HIGH 語は MISSING |

---

## 9. Explicit OUT

```text
UI-HIERARCHY-SYSTEM 親Issue
Product UI Contract 本文の追加 / LOCK
Typography token の新スケール
#448 TRACK A exact-slice 選定 / 実装
#444 Implementation Start
FIELD-STAFF-MULTI-USER-SCALE-1 の自動第一候補化
Plan metadata 非表示の実装
TRACK C current-SHA runtime / smoke
LIVE WRITE / Deploy
Issue mutation / comment 投稿
#68 / #69 / #70 / #356 / #299 reopen
```

---

## 10. STOP

```text
UI-VISUAL-HIERARCHY-CONTRACT-1
READ-ONLY RECONCILIATION
COMPLETE

Contract:
NOT ADDED
NOT LOCKED

Human Decision（別ゲート）:
  MISSING H-01..H-07 のどれを Contract 本文にするか
  §5 の情報ランク呼称（A / B / C）
  追加後の適用順:
    #444 PLANNER → #448 FIELD_STAFF → ADMIN / AUDIT

ACTION:
STOP
```
