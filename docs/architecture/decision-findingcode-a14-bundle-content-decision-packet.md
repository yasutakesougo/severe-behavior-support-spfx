# Decision Packet — FindingCode A-1〜A-4 bundle content

この文書は、**HUMAN_FINDINGCODE_BUSINESS_CATALOG_BUNDLE_CONTENT_DECISION**
（FindingCode business catalog の A-1〜A-4 bundle 内容）の
**Human Decision Packet** である。

値・採番・mapping・DEC 番号の採択・Accepted ではない。
Agent が FindingCode 値を発明しない。
Implementation Start ではない。
A-5 / FC-7 を開始しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: HUMAN_FINDINGCODE_BUSINESS_CATALOG_BUNDLE_CONTENT_DECISION
Kind: Human Decision packet
Status: READY_FOR_HUMAN_DECISION
Structure authority: a-class-structure-acceptance.md（Bundle A-1〜A-4 / Separate A-5）
FC Decision Exit Review: ACCEPTED
Decision-FC-1〜FC-6: Accepted（logical）
PR #139 / Implementation Entry Decision Re-audit: MERGED
  merge commit: 99c8b24f0fa22f502803f4ae772c976886aed261
  merged head: d58e947abdf97f011ac9054fec0058f143671b2f
main baseline: 99c8b24f0fa22f502803f4ae772c976886aed261
A-1〜A-4 content: UNDECIDED
A-5: OUT / separate later
Issue #8 FindingCode DEC number: UNASSIGNED
Implementation Entry satisfaction: NOT EVALUATED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
FC-7: NOT CREATED
FindingCode value invention: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`a-class-structure-acceptance.md`](./a-class-structure-acceptance.md)
- [`fc-decision-exit-review.md`](./fc-decision-exit-review.md)
- [`fc-decision-exit-review-acceptance.md`](./fc-decision-exit-review-acceptance.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
A-class structure: ACCEPTED
  Bundle: A-1 + A-2 + A-3 + A-4 = one FindingCode business catalog Decision
  Separate: A-5 representation strategy = later Human Decision

FC-1: Issue #8 new business DEC owns catalog change control（番号 UNASSIGNED）
FC-2〜FC-6: delivery / snapshot / identifier / ownership-ref logical contracts Accepted
FindingCode remains caller-supplied until business catalog content Accepted
Identity assembly: UNCHANGED
FindingSeverity: NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
GOV-RULE-05〜08: Accepted（08 = NOT ADOPTED）— 本 packet と混ぜない
```

問い（本 packet）:

> Issue #8 FindingCode business catalog として、
> A-1 値一覧 / A-2 採番 / A-3 criterionId mapping / A-4 DEC 番号・台帳登録
> を、Human がどう確定するか（または当面 HOLD するか）。

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| A-class structure | Bundle A-1〜A-4 / Separate A-5 | Accepted / 触らない |
| **A-1** | FindingCode business catalog values | **本 packet** |
| **A-2** | FindingCode numbering | **本 packet** |
| **A-3** | criterionId mapping | **本 packet** |
| **A-4** | Issue #8 FindingCode DEC number / ledger | **本 packet** |
| A-5 | catalogVersionIdentifier representation strategy | OUT / 混ぜない |
| FC-1〜FC-6 | ownership / logical contracts | Accepted / 触らない |
| FC-7 | （存在しない） | NOT CREATED |
| Implementation Entry satisfaction | Entry checklist 充足判定 | OUT / 別 Human Decision |
| Implementation Start | code / Schema / UI | HOLD / 混ぜない |
| GOV-RULE / RD-3 / AS-EC-1 | 別 track | 混ぜない |

```text
A-1〜A-4 = one bundle Decision（structure Accepted）
A-5 ≠ this packet
Agent MUST NOT invent:
  FindingCode values
  numbering scheme
  criterionId mapping rows
  Issue #8 DEC number
```

## 3. Human が埋める必須面（発明禁止）

本 packet は **空欄の Human 入力面** を固定する。Agent は中身を埋めない。

### A-1 — FindingCode business catalog values

```text
Human must supply:
  - 採用する FindingCode 値の有限集合（または「値一覧を当面採択しない」明示）
  - 各値の業務意味（日本語正本）
  - 追加・廃止の change-control が Issue #8 DEC に従うことの確認
MUST NOT:
  AI / Agent による値補完
  FindingSeverity の再導入
```

### A-2 — FindingCode numbering

```text
Human must supply:
  - 採番規則（プレフィックス / 連番 / 固定コード表 等）
  - 安定性（一度発行したコードの再利用可否）
  - A-1 値集合との整合
```

### A-3 — criterionId mapping

```text
Human must supply:
  - FindingCode ↔ criterionId の対応表（または mapping 方針の Human 正本）
  - 未対応 / 複数対応を許すかどうか
  - fail-closed 時の扱い（未知コード拒否等）の業務意図
```

### A-4 — Issue #8 FindingCode DEC number / ledger

```text
Human must supply:
  - Issue #8 台帳上の DEC 番号（または採番手順の Human 実行結果）
  - DEC 本文の配置（Issue #8 comment / docs mirror 方針）
MUST NOT:
  Agent による DEC 番号の推測採番
```

## 4. Options（process — 値は発明しない）

### Option A — Human supplies complete A-1〜A-4 bundle now

```text
Meaning:
  Human が A-1〜A-4 の内容を一括提示し、Acceptance へ進める
Required Human artifacts:
  values + numbering + criterionId mapping + Issue #8 DEC number/ledger
Does NOT include:
  A-5 / Implementation Entry satisfaction / Implementation Start
```

### Option B — HOLD / defer bundle content

```text
Meaning:
  A-1〜A-4 content を当面 UNDECIDED のまま残す
  本 gate に留まる（Acceptance しない）
Effects:
  FindingCode Implementation Entry: 依然未充足
  Implementation Start: HOLD
```

### Option C — Human-authored Issue #8 DEC body first（same bundle）

```text
Meaning:
  Human が Issue #8 上で FindingCode business DEC 本文を先に確定し、
  repository はその mirror / Acceptance evidence のみを後続で記録する
Constraint:
  A-1〜A-4 が同一 bundle であること（structure）は維持
  DEC 番号（A-4）未採番のまま Acceptance 完了とみなさない
Does NOT include:
  A-5 / Implementation Start
```

### Option D — Explicit Human other

```text
Meaning:
  Human が A〜C 以外の進め方を明示する
Constraint:
  A-1〜A-4 をカバーするか、明示的に HOLD するかを欠かさない
  structure（Bundle A-1〜A-4 / Separate A-5）を破壊しない
  Agent 値発明を許可しない
```

## 5. 禁止事項（本 packet）

```text
FORBIDDEN in this packet:
  invent FindingCode values / labels / enums
  invent numbering
  invent criterionId mapping rows
  invent or guess Issue #8 DEC number
  start A-5 (UUID / hash / semver / DEC-number strategy)
  create FC-7
  claim Implementation Entry satisfaction
  Implementation Start / Schema / TypeScript / validator / fixture
  SharePoint / M365 / Entra / Deploy / real data
  reopen FindingSeverity / SEV-2-ASSIGN
  mix GOV-RULE due/overdue or 90-day rules
```

## 6. Gate

```text
HUMAN_FINDINGCODE_BUSINESS_CATALOG_BUNDLE_CONTENT_DECISION:
  READY_FOR_HUMAN_DECISION
Selected Option: UNSELECTED
A-1 values: UNDECIDED
A-2 numbering: UNDECIDED
A-3 criterionId mapping: UNDECIDED
A-4 Issue #8 DEC number: UNASSIGNED
A-5: OUT
Independent Review: NOT DONE（PR 進行で実施）
Implementation Entry satisfaction: NOT EVALUATED
Implementation Start: HOLD
```

## 7. Human への依頼

次のいずれかを明示する:

1. **Option A** — A-1〜A-4 の内容を提示（Acceptance 候補へ）
2. **Option B** — HOLD / defer（gate 維持）
3. **Option C** — Issue #8 DEC 本文を先に Human 確定（bundle 維持）
4. **Option D** — その他（A-1〜A-4 の扱いを明示）

Agent は選択前に catalog 値を書かない。
Acceptance / Entry satisfaction / Implementation Start は別 Gate。
