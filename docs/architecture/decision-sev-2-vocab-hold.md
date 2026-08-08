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
FindingSeverity の業務上の用途・正式値・意味について、
Human が根拠を持って定義できる一次情報がまだない。
AIによる値の補完・推測は行わない。
```

意味:

- FindingSeverity は「見つかった問題の重さラベル」になり得るが、**重さの定義・必要ラベル集合が業務ルールとして未確定**である。
- 正式値の個数・名称・意味・順序を、根拠なしに決めない。
- `low` / `medium` / `high` 等を AI / 実装側が補完しない（従来禁止の維持）。
- 架空説明用ラベル（例: A/B/C）は **採用候補ではない**。
- 本 HOLD は判断不能による失敗ではなく、未決定業務ルールを設計しない **fail-closed** である。

## 次に確認する問い（値より手前）

値の段階数を決める前に、Human が一次情報で答えられる必要がある。

```text
このアプリで FindingSeverity という項目は、
そもそも何のために必要なのか？
```

用途・必要性・使い方が説明できるようになってから、正式値・意味・順序を定義する。

## 分離（維持）

| 単位 | 状態 |
|---|---|
| Decision-SEV-1 ownership | Accepted / Option A / main canonical |
| **SEV-2-VOCAB**（本 Decision） | **HOLD / V-C** |
| SEV-2-ASSIGN | CANDIDATE / NOT ACCEPTED（本 HOLD で確定しない） |
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
SEV-2-ASSIGN: 本 Decision では進めない
Bundle Accepted with ASSIGN: FORBIDDEN
Issue #24 Close: NO-GO
```

## 対象外

- SEV-2-ASSIGN の Accepted / HOLD 判定（別判断）
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
AI vocabulary invention: prohibited
```
