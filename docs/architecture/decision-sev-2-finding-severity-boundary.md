# Decision-SEV-2 — FindingSeverity boundary decision packet

この文書は、**Decision-SEV-2** の **decision packet** である。
単位ごとに状態が異なる。VOCAB は Accepted（不採用）。ASSIGN は N/A。

Decision-SEV-1（Option A / Issue #8 新 DEC 方式）Accepted 後の
**次 substantive unit** として、FindingSeverity の残判断を固定する。

**必須分離:** vocabulary（採用または不採用）と、assignment algorithm / caller-supplied 境界を
**別判断単位**として扱う。一括 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision packet: Decision-SEV-2
Status: OPEN（単位ごとに状態が異なる）
SEV-2-PURPOSE: RECORDED（MHLW-first）— decision-sev-2-purpose-source.md
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS — decision-sev-2-concept-inv.md
SEV-2-VOCAB: Accepted / Option A / NOT ADOPTED；Canonical COMPLETE（Issue #8 / DEC-018） — decision-sev-2-vocab-not-adopted.md
SEV-2-ASSIGN: N/A / DO NOT START
Implementation: NOT STARTED
Depends on: Decision-SEV-1 Accepted（Option A）
main before this packet: 08d4a2533f31b94ff86df50cb28c7a93b8426928
SEV-1 Accepted canonical: decision-sev-1-finding-severity-vocabulary-ownership.md
SEV-2-VOCAB Human Decision (HOLD): Explicit Human HOLD on 2026-08-08（V-C / historical）
SEV-2-PURPOSE Human Decision: Explicit Human purpose-source policy on 2026-08-08
SEV-2-CONCEPT-INV Human decision: Investigation result accepted / recorded on 2026-08-08
SEV-2-CONCEPT-INV investigation execution: Agent-assisted MHLW primary-source research
SEV-2-VOCAB Human Decision (Re-evaluation): Explicit Human GO on 2026-08-08（Option A / NOT ADOPTED）
SEV-2-VOCAB Canonical status: COMPLETE（Issue #8 / DEC-018）
```

SEV-1 の Human Acceptance と Agent execution evidence は混同しない。
CONCEPT-INV の調査実行（agent-assisted）と Human の結果受理も混同しない。
Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)
- [`decision-sev-2-vocab-reevaluation-packet.md`](./decision-sev-2-vocab-reevaluation-packet.md)
- [`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)
- [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)
- [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 前提（変更しない）

```text
Decision-SEV-1: Accepted / Option A
Canonical ownership / change control: Issue #8 に新しい DEC を追加する方式
Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
src/** / tests/**: 本 packet では変更しない
```

Issue #8 の不採用 DEC は **DEC-018**（comment `5225426738`）として記録済み。
本 packet は DEC 番号を推測採番しない（採番は Issue #8 台帳側で完了）。

## 判断単位の分離（必須）

| Unit ID | 判断単位 | 本 packet での状態 | 混ぜてはならないもの |
|---|---|---|---|
| **SEV-2-PURPOSE** | FindingSeverity **purpose source**（MHLW-first 方針） | **RECORDED**（[`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)） | 値一覧・assignment |
| **SEV-2-CONCEPT-INV** | 厚労省一次資料での **正式概念有無** 調査 | **COMPLETED / OFFICIAL_CONCEPT_EXISTS**（[`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)） | VOCAB Accepted・ASSIGN・実装 |
| **SEV-2-VOCAB** | FindingSeverity **正式値・意味**、または **不採用 Decision**（Issue #8 新 DEC が最終 canonical） | **Human Decision Accepted / Option A / NOT ADOPTED**；**Canonical COMPLETE（Issue #8 / DEC-018）**（[`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)） | assignment 主体・算出アルゴリズム |
| **SEV-2-ASSIGN** | Severity **assignment algorithm / caller-supplied 境界** | **N/A / DO NOT START**（不採用のため） | 値一覧そのものの採択 |


```text
Independent acceptance: REQUIRED
Bundle Accepted: FORBIDDEN
Order preference:
  SEV-2-PURPOSE → SEV-2-CONCEPT-INV → SEV-2-VOCAB →
  Issue #8 DEC（Accepted values OR non-adoption）→
  SEV-2-ASSIGN（Accepted values の場合のみ）
  （不採用時 ASSIGN は N/A。
   enum 検証を伴う assignment は VOCAB Accepted 後が安全だったが、
   本再評価では不採用のため ASSIGN 自体が不要）
```

旧 backlog 表記「Severity assignment boundary（値・意味・判定主体）」は、
VOCAB と ASSIGN に **分割**し、さらに PURPOSE / CONCEPT-INV を前置する。
不採用 Decision も Decision-SEV-1 Option A に従い Issue #8 新 DEC で正本化する。

---

## Unit SEV-2-VOCAB — Formal vocabulary（値・意味） / 不採用

### 問い

Issue #8 新規 DEC に記録する FindingSeverity の **正式値集合** と、
各値の **業務上の意味** は何か。
または、FindingSeverity 自体を **不採用**するか。

### 制約

```text
Ownership: Issue #8 新 DEC（Decision-SEV-1 Option A）
Purpose source: MHLW / statutory-regulatory source first（SEV-2-PURPOSE）
Local invented severity taxonomy: FORBIDDEN
暗黙採用禁止: low / medium / high 等を正本未確定のまま使わない
FindingIdentity キーへの Severity 追加: 禁止（UNCHANGED）
stable Finding ID 入力への Severity 混入: 禁止
agent による値捏造: 禁止
```

### 再評価オプション（履歴）

| Option | 概要 | 結果 |
|---|---|---|
| **A** | FindingSeverity **不採用 / 契約から除外** | **Selected / Accepted** |
| **B** | FindingSeverity 維持 + MHLW 写像の別途正本化 | Not selected |
| **HOLD** | 値 NOT DEFINED を維持 | Superseded |

旧 V-A / V-B / V-C（値採択候補）は、CONCEPT-INV 後の再評価枠（A/B/HOLD）へ移行した。

### SEV-2-VOCAB Human Decision（記録済み）

Accepted 正本 mirror: [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)

```text
Decision-SEV-2-VOCAB Human Decision: Accepted
Selected: Option A（Re-evaluation）
FindingSeverity: NOT ADOPTED
Formal values: N/A
Meanings: N/A
Ordering: N/A
SEV-2-ASSIGN: N/A / DO NOT START
Canonical status: COMPLETE
Canonical ownership / change control: Issue #8 / DEC-018
Issue #8 comment ID: 5225426738
Instead (direction only / NOT STARTED):
  behaviorRelatedItemsTotalScore
  regulatory evaluation / predicates
  applicable scheme / rule
  RuleSetVersion
```

Issue #8 / DEC-018（comment `5225426738`）記録済み。repository docs は Accepted 正本 mirror。

HOLD 履歴: [`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)

再評価 packet: [`decision-sev-2-vocab-reevaluation-packet.md`](./decision-sev-2-vocab-reevaluation-packet.md)

### SEV-2-VOCAB で決めないこと（維持）

- 代替概念の型名・schema・validator 実装
- SharePoint 列
- FindingCode カタログ
- 完全 Finding の他フィールド

---

## Unit SEV-2-ASSIGN — Assignment algorithm / caller-supplied 境界

### 状態（不採用後）

```text
SEV-2-ASSIGN: N/A / DO NOT START
Reason: FindingSeverity NOT ADOPTED（SEV-2-VOCAB Option A）
```

FindingSeverity 自体を採択しないため、Severity assignment algorithm /
caller-supplied 境界の Human Decision は **開始しない**。

### 旧候補オプション（履歴・適用しない）

| Option | 概要 |
|---|---|
| **A-A** | caller-supplied |
| **A-B** | domain-computed |
| **A-C** | hybrid |
| **A-D** | HOLD |

```text
SEV-2-ASSIGN progression after non-adoption: FORBIDDEN
```

---

## 推奨レビュー順（実績）

```text
1. Independent Review of this packet（判断単位分離・Option 網羅・暗黙値禁止）— done via PR #113 line
2. Human Decision of SEV-2-VOCAB — HOLD / V-C（historical）
3. Human purpose-source policy — SEV-2-PURPOSE
4. SEV-2-CONCEPT-INV — COMPLETED
5. SEV-2-VOCAB 再評価 — Human Decision Accepted / Option A / NOT ADOPTED
6. Issue #8 へ不採用 DEC 本文を記録 — **DEC-018**（comment `5225426738`）
7. repository docs を最終 Accepted 正本 mirror へ昇格 — 本単位
8. ASSIGN / Severity 実装 — N/A（不採用）
9. 代替概念モデル — 次 substantive unit 未選定（Entry Criteria 未開始）
```

```text
Next SEV action:
  Next substantive unit: NOT SELECTED
  代替概念の Entry Criteria / 実装: NOT STARTED
  SEV-2-ASSIGN: N/A / DO NOT START
SEV-2-CONCEPT-INV:
  COMPLETED / OFFICIAL_CONCEPT_EXISTS
SEV-2-VOCAB:
  Human Decision Accepted / Option A / FindingSeverity NOT ADOPTED
  Canonical status: COMPLETE（Issue #8 / DEC-018）
SEV-2-ASSIGN:
  N/A / DO NOT START
Do not start:
  SEV-2-ASSIGN / TypeScript FindingSeverity / validator / fixture /
  代替モデル実装
```

## OUT / 混ぜないもの

- SEV-2-VOCAB と SEV-2-ASSIGN の一括 Accepted
- PURPOSE / CONCEPT-INV / VOCAB / ASSIGN の一括確定
- FindingSeverity 不採用時に Issue #8 新 DEC 記録を省略すること
- 「値定義後のみ」Issue #8 に書くこと（不採用 Decision も記録対象）
- `low` / `medium` / `high` の暗黙正本化
- ローカル発明の severity taxonomy
- FindingIdentity / stable Finding ID の変更
- `src/**` / `tests/**` 変更
- 完全 Finding 実装 / FindingSeverity 型追加
- FindingCode カタログ Decision（FC-1 / FC-2 / FC-3 / FC-4 / FC-5 / FC-6）
- AssessmentSnapshot 保存・DTO
- SharePoint / tenant / Microsoft 365 / Entra ID / Deploy
- real data

## Gate

```text
Decision-SEV-1: Accepted（Option A）
Decision-SEV-2 packet: OPEN（単位別）
SEV-2-PURPOSE: RECORDED（MHLW-first）
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS
SEV-2-VOCAB: Accepted / Option A / FindingSeverity NOT ADOPTED
SEV-2-VOCAB Canonical: COMPLETE（Issue #8 / DEC-018 / comment 5225426738）
SEV-2-ASSIGN: N/A / DO NOT START
Independent acceptance: REQUIRED
Implementation: NOT STARTED
Issue #24 Close: NO-GO
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

Live gate（Ready / Merge / review 進行）は PR body / Issue comment のみ。
repository docs には書かない。

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
tenant changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 packet では変更しない
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Local invented severity taxonomy: FORBIDDEN
AI vocabulary invention: prohibited
```
