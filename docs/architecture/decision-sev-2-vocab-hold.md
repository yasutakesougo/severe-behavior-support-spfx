# Decision-SEV-2-VOCAB — FindingSeverity formal vocabulary HOLD

この文書は、**Decision-SEV-2-VOCAB**（FindingSeverity 正式値・意味）の
**HOLD 正本**である。

値を採択しない。AI による値の補完・推測は行わない。
**Decision-SEV-2-ASSIGN とは別判断**であり、本 HOLD を ASSIGN の一括確定に使わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SEV-2-VOCAB
Status: HOLD
Selected: V-C
main before this canonicalization: eda043929d26377a37343abcbf296edbda793b00
PR #113 / Decision-SEV-1 canonicalization: MERGED
SEV-1: Accepted / Option A / CANONICALIZED ON MAIN
Depends on packet: decision-sev-2-finding-severity-boundary.md
```

上位入口:

- [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)
- [`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)
- [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

### Human Decision（durable）

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

## HOLD 内容

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

- FindingSeverity の正式値・意味・順序は **NOT DEFINED** のままである。
- purpose source 方針は [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md) で固定済み（MHLW-first）。
- ローカル発明の severity taxonomy は **FORBIDDEN**。
- 正式値の個数・名称・意味・順序を、制度一次資料なしに決めない。
- `low` / `medium` / `high` 等を AI / 実装側が補完しない（従来禁止の維持）。
- 架空説明用ラベル（例: A/B/C）は **採用候補ではない**。
- 本 HOLD は判断不能による失敗ではなく、未決定業務ルールを設計しない **fail-closed** である。

## 次に確認する問い（値より手前）

旧問い「FindingSeverity を何に使いたいか」は使わない。
修正後の問い（purpose source 正本に従う）:

```text
厚労省の制度上、強度行動障害・生活介護・重度障害者支援加算等について、
段階・区分・閾値・優先度を表す正式な概念が存在し、
それを Finding に保持する必要があるか？
```

次工程は SEV-2-ASSIGN ではなく、独立調査単位 **SEV-2-CONCEPT-INV**
（厚労省一次資料での正式概念有無確認）。詳細は purpose source 正本。

正式概念が無い場合は FindingSeverity 自体の削除・不採用も候補とする。
正式概念がある場合のみ、その正式名称・値・意味・適用条件を VOCAB 候補にする。

Issue #8 新 DEC 記録経路（Decision-SEV-1 Option A）:

```text
VOCAB 再評価結果が Accepted（正式値あり）→ Issue #8 新 DEC に記録
VOCAB 再評価結果が 不採用 / 契約除外 → Issue #8 新 DEC に不採用 Decision を記録
HOLD 継続 → Issue #8 新 DEC 本文はまだ記録しない
不採用時: SEV-2-ASSIGN = N/A / DO NOT START
実装への自動進行: FORBIDDEN
```

「値定義後のみ Issue #8 に書く」は **禁止**。不採用も ownership / change control の対象である。

## 分離（維持）

| 単位 | 状態 |
|---|---|
| Decision-SEV-1 ownership | Accepted / Option A / main canonical |
| SEV-2-PURPOSE | RECORDED（MHLW-first） |
| SEV-2-CONCEPT-INV | OPEN / NOT STARTED |
| **SEV-2-VOCAB**（本 Decision） | **HOLD / V-C** |
| SEV-2-ASSIGN | CANDIDATE / NOT SELECTED（本 HOLD で確定しない） |
| TypeScript 型 / validator / 実装 | NOT STARTED |
| FindingIdentity / stable Finding ID | UNCHANGED |
| SharePoint / tenant / M365 / Entra / Deploy | NO-GO |
| real data | PROHIBITED |

## 実装ゲート

```text
Decision-SEV-2-VOCAB: HOLD（V-C）
Formal values / Meanings / Ordering: NOT DEFINED
Implementation Start (Severity vocabulary): N/A（開始しない）
src/** / tests/**: 変更しない
SEV-2-ASSIGN: 本 Decision では進めない（CANDIDATE / NOT SELECTED）
Bundle Accepted with ASSIGN: FORBIDDEN
Next SEV action: SEV-2-CONCEPT-INV（MHLW primary-source concept investigation）
Issue #24 Close: NO-GO
```

## 対象外

- SEV-2-ASSIGN の Accepted / HOLD 判定（別判断）
- SEV-2-CONCEPT-INV の調査結果確定（別単位・未着手）
- `FindingSeverity` 型・validator・fixture
- 完全 Finding 契約の Severity 欄実装
- Issue #8 DEC 本文の値列挙（UNASSIGNED / NOT DEFINED）
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
```
