# Decision-SEV-2-VOCAB — FindingSeverity NOT ADOPTED（Option A）

この文書は、**Decision-SEV-2-VOCAB** 再評価の
**Accepted 正本**（repository mirror）である。

FindingSeverity をこのアプリの正式な domain concept として **不採用**し、
domain 契約から除外する。

```text
Human Decision: Accepted / Option A / NOT ADOPTED
Canonical ownership / change control: Issue #8 / DEC-018
SEV-2-VOCAB canonical: COMPLETE
Issue #8 comment ID: 5225426738
SEV-2-ASSIGN: N/A / DO NOT START
Implementation auto-start: FORBIDDEN
```

最終 canonical ownership / change control は Decision-SEV-1 Option A に従い
**Issue #8 / DEC-018** である。本 docs はその mirror である。

本単位は **VOCAB 不採用 Decision** である。
代替概念の型・schema・実装開始ではない。
**SEV-2-ASSIGN ではない**（N/A / DO NOT START）。
次の substantive unit は **未選定**。

先行 HOLD 記録: [`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)（V-C / historical）
再評価 packet: [`decision-sev-2-vocab-reevaluation-packet.md`](./decision-sev-2-vocab-reevaluation-packet.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SEV-2-VOCAB
Human Decision: Accepted / Option A（Re-evaluation）
Canonical status: COMPLETE
Canonical ownership / change control: Issue #8 / DEC-018
Issue #8 comment ID: 5225426738
FindingSeverity: NOT ADOPTED / REMOVED FROM DOMAIN CONTRACT
SEV-2-ASSIGN: N/A / DO NOT START
Implementation: NOT STARTED
Implementation auto-start: FORBIDDEN
Next substantive unit: NOT SELECTED
Depends on: Decision-SEV-1 Accepted（Option A）
Depends on: Decision-SEV-2-PURPOSE RECORDED（MHLW-first）
Depends on: SEV-2-CONCEPT-INV COMPLETED / OFFICIAL_CONCEPT_EXISTS
Prior state: PENDING_ISSUE_8_DEC_RECORD（PR #118 MERGED）
main before this canonicalization: ecc7fcff4777a6c74ae41cea3d2125e8be95c4e9
PR #118 / SEV-2-VOCAB Human Decision record: MERGED
```

上位入口:

- [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)
- [`decision-sev-2-vocab-reevaluation-packet.md`](./decision-sev-2-vocab-reevaluation-packet.md)
- [`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)
- [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)
- [`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

### Human Decision（durable）

```text
Human Decision: Explicit Human GO on 2026-08-08
Decision-SEV-2-VOCAB Re-evaluation: Accepted
Selected: Option A
FindingSeverity: NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
Canonical status: COMPLETE
Canonical ownership / change control: Issue #8 / DEC-018
Issue #8 comment ID: 5225426738
Implementation: NOT STARTED
Implementation auto-start: FORBIDDEN
Next substantive unit: NOT SELECTED
```

```text
Agent execution evidence: NOT Human Decision evidence
```

## Accepted 内容

```text
Status: Accepted
Selected: Option A
DEC-018: Accepted

FindingSeverity: NOT ADOPTED
Meaning:
  FindingSeverity を正式な domain concept / vocabulary として採択しない。
  domain 契約から除外する。

Generic FindingSeverity taxonomy: DO NOT ADOPT
Formal values: N/A（不採用のため定義しない）
Meanings: N/A
Ordering: N/A

FindingSeverity TypeScript type: DO NOT CREATE
FindingSeverity validator: DO NOT CREATE
SEV-2-ASSIGN: N/A / DO NOT START

Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
```

### Canonical ownership（Decision-SEV-1 Option A）

```text
Canonical ownership / change control: Issue #8 / DEC-018
Issue #8 comment ID: 5225426738
SEV-2-VOCAB canonical: COMPLETE
Numbering basis:
  Issue #8 ledger was DEC-001〜DEC-017
  DEC-018 was absent from all Issue #8 comments before assignment
```

### 根拠（CONCEPT-INV / PURPOSE との整合）

```text
Official concept confirmed: 行動関連項目合計点数
Official thresholds confirmed: >= 10 ; >= 18（Severity enum 値ではない）
Generic severity taxonomy: NOT FOUND
low / medium / high: NOT OFFICIAL / DO NOT ADOPT
```

厚労省一次資料で確認された正式概念は Severity ラベルではなく、
**行動関連項目合計点数** と **制度上の閾値適用** である。
FindingSeverity を残すことは、制度にない抽象概念をアプリ側で新設することになり、
SEV-2-PURPOSE（MHLW-first / ローカル severity taxonomy FORBIDDEN）と衝突する。

禁止の維持:

```text
FindingSeverity = "10+" | "18+": NOT ADOPTED as vocabulary
low / medium / high / critical / moderate / severe: DO NOT ADOPT
Local invented severity taxonomy: FORBIDDEN
AI vocabulary invention: prohibited
```

### 代替として検討対象になる概念（未実装・未契約）

本 Accepted は代替概念の **方向** のみを固定する。
型・schema・validator・実装は **決定しない**。
次の substantive unit も **未選定**。

```text
Instead (direction only / NOT STARTED / NOT SELECTED as next unit):
  behaviorRelatedItemsTotalScore
  regulatory evaluation / predicates
  applicable scheme / rule
  RuleSetVersion
```

意味:

- 「10点以上」「18点以上」を Severity 値へ変換しない。
- 原値と制度判定の根拠（適用ルール / RuleSetVersion）を扱う方向とする。
- 代替モデルの契約化・実装開始には **別 Entry Criteria + Human Implementation Start** が必要。
- 本単位では代替概念 Entry Criteria を開始しない。

## Issue #8 記録（完了）

```text
DEC-018: Accepted
Decision: FindingSeverity = NOT ADOPTED
Canonical ownership / change control: Issue #8 / DEC-018
Comment ID: 5225426738
SEV-2-VOCAB canonical: COMPLETE
```

## 分離（維持）

| 単位 | 状態 |
|---|---|
| Decision-SEV-1 ownership | Accepted / Option A |
| SEV-2-PURPOSE | RECORDED（MHLW-first） |
| SEV-2-CONCEPT-INV | COMPLETED / OFFICIAL_CONCEPT_EXISTS |
| **SEV-2-VOCAB Human Decision** | **Accepted / Option A / FindingSeverity NOT ADOPTED** |
| **SEV-2-VOCAB Canonical** | **COMPLETE（Issue #8 / DEC-018 / comment 5225426738）** |
| SEV-2-ASSIGN | **N/A / DO NOT START** |
| 代替概念の型 / schema / 実装 | NOT STARTED（次 unit 未選定） |
| FindingIdentity / stable Finding ID | UNCHANGED |
| SharePoint / tenant / M365 / Entra / Deploy | NO-GO |
| real data | PROHIBITED |

## 実装ゲート

```text
Decision-SEV-2-VOCAB: Accepted / Option A
Canonical status: COMPLETE（Issue #8 / DEC-018）
FindingSeverity: NOT ADOPTED
Implementation Start (Severity vocabulary): N/A（不採用のため開始しない）
SEV-2-ASSIGN: N/A / DO NOT START
Implementation auto-start: FORBIDDEN
src/** / tests/**: 変更しない
代替モデル実装: 別 Entry Criteria + Human Implementation Start まで FORBIDDEN
Next substantive unit: NOT SELECTED
Issue #24 Close: NO-GO（他 HOLD が残る）
```

## 対象外

- 代替概念（合計点 / predicates / scheme / RuleSetVersion）の型・schema・validator 確定
- SEV-2-ASSIGN（N/A）
- FindingSeverity TypeScript 型 / validator / fixture
- 完全 Finding 契約の Severity 欄実装
- 次 substantive unit の選定
- SharePoint / adapter / UI / deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
tenant changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Decision では変更しない
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Local invented severity taxonomy: FORBIDDEN
AI vocabulary invention: prohibited
SEV-2-ASSIGN auto progression: FORBIDDEN
Implementation auto-start: FORBIDDEN
```
