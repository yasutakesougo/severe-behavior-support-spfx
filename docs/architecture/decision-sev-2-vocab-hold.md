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

## 次に確認する問い（値より手前）— CONCEPT-INV 完了後

SEV-2-CONCEPT-INV は **COMPLETED**（[`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)）。

```text
Official concept: 行動関連項目合計点数
Official thresholds: >= 10 ; >= 18（Severity enum 値ではない）
Generic FindingSeverity taxonomy: NOT FOUND
low / medium / high: NOT OFFICIAL / DO NOT ADOPT
```

次は **Human SEV-2-VOCAB 再評価**（本 HOLD の解除または継続）。未 Accepted。

| Option | 内容 |
|---|---|
| **A** | FindingSeverity を不採用 / 契約から除外。行動関連項目合計点 + 制度判定結果 + RuleSetVersion を明示モデル化 |
| **B** | FindingSeverity を残す。MHLW 正式概念の写像を別途正本化（`"10+"` / `"18+"` 直写は不適切） |
| **HOLD 継続** | 値 NOT DEFINED を維持 |

```text
Primary-source alignment: Option A is the stronger candidate（investigation judgment）
SEV-2-VOCAB Accepted: NO
Next SEV action: Human SEV-2-VOCAB re-evaluation
Do not start: SEV-2-ASSIGN / TypeScript / validator / fixture / implementation
```

Issue #8 新 DEC 記録経路（Decision-SEV-1 Option A）:

```text
VOCAB 再評価結果が Accepted（正式値あり / 写像あり）→ Issue #8 新 DEC に記録
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
| SEV-2-CONCEPT-INV | COMPLETED / OFFICIAL_CONCEPT_EXISTS |
| **SEV-2-VOCAB**（本 Decision） | **HOLD / V-C**（再評価待ち） |
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
Next SEV action: Human SEV-2-VOCAB re-evaluation
Issue #24 Close: NO-GO
```

## 対象外

- SEV-2-ASSIGN の Accepted / HOLD 判定（別判断）
- SEV-2-VOCAB Accepted / 不採用の確定（再評価は Human Decision）
- `FindingSeverity` 型・validator・fixture
- FindingSeverity = "10+" / "18+" の採択
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
