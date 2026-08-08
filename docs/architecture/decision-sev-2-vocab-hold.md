# Decision-SEV-2-VOCAB — FindingSeverity formal vocabulary HOLD（historical）

この文書は、**Decision-SEV-2-VOCAB** の **HOLD（V-C）履歴正本**である。

**現正本（Accepted / Option A / NOT ADOPTED）:**
[`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)

再評価 packet:
[`decision-sev-2-vocab-reevaluation-packet.md`](./decision-sev-2-vocab-reevaluation-packet.md)

```text
Superseded by: decision-sev-2-vocab-not-adopted.md
Current Status: Accepted / Option A / FindingSeverity NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
```

以下は HOLD 時点の記録（変更しない履歴）。

## 基準（HOLD 時点）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SEV-2-VOCAB
Status: HOLD（historical）
Selected: V-C
main before this canonicalization: eda043929d26377a37343abcbf296edbda793b00
PR #113 / Decision-SEV-1 canonicalization: MERGED
SEV-1: Accepted / Option A / CANONICALIZED ON MAIN
Depends on packet: decision-sev-2-finding-severity-boundary.md
```

上位入口:

- [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)
- [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)
- [`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)
- [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

### Human Decision（HOLD 時点・durable）

```text
Human Decision: Explicit Human HOLD on 2026-08-08
Decision-SEV-2-VOCAB: HOLD
Selected: V-C
Formal values: NOT DEFINED
Meanings: NOT DEFINED
Ordering: NOT DEFINED
Issue #8 DEC number: UNASSIGNED
```

```text
Agent execution evidence: NOT Human Decision evidence
```

## HOLD 内容（履歴）

```text
Status: HOLD
Selected: V-C

Formal values: NOT DEFINED
Meanings: NOT DEFINED
Ordering: NOT DEFINED
Issue #8 DEC number: UNASSIGNED

Reason:
FindingSeverity の正式値・意味について、
厚労省制度上の正式概念が未確認のまま値を定義できない。
AIによる値の補完・推測は行わない。
```

意味:

- FindingSeverity の正式値・意味・順序は **NOT DEFINED** のままである（HOLD 時点）。
- purpose source 方針は [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md) で固定済み（MHLW-first）。
- ローカル発明の severity taxonomy は **FORBIDDEN**。
- 正式値の個数・名称・意味・順序を、制度一次資料なしに決めない。
- `low` / `medium` / `high` 等を AI / 実装側が補完しない（従来禁止の維持）。
- 架空説明用ラベル（例: A/B/C）は **採用候補ではない**。
- 本 HOLD は判断不能による失敗ではなく、未決定業務ルールを設計しない **fail-closed** である。

## 再評価結果（追記）

SEV-2-CONCEPT-INV 完了後の Human 再評価により、本 HOLD は解除された。

```text
SEV-2-VOCAB Re-evaluation: Accepted
Selected: Option A
FindingSeverity: NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
正本: decision-sev-2-vocab-not-adopted.md
```

## 分離（HOLD 時点の記録）

| 単位 | 状態（HOLD 時点） |
|---|---|
| Decision-SEV-1 ownership | Accepted / Option A / main canonical |
| SEV-2-PURPOSE | RECORDED（MHLW-first） |
| SEV-2-CONCEPT-INV | COMPLETED / OFFICIAL_CONCEPT_EXISTS |
| **SEV-2-VOCAB**（本 Decision） | **HOLD / V-C**（再評価待ち）→ 現在は Accepted / Option A |
| SEV-2-ASSIGN | CANDIDATE / NOT SELECTED → 現在は N/A / DO NOT START |
| TypeScript 型 / validator / 実装 | NOT STARTED |
| FindingIdentity / stable Finding ID | UNCHANGED |
| SharePoint / tenant / M365 / Entra / Deploy | NO-GO |
| real data | PROHIBITED |

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
```
