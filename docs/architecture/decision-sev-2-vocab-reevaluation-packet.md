# Decision Packet — SEV-2-VOCAB Re-evaluation

この文書は、**Decision-SEV-2-VOCAB** 再評価の Decision Packet である。
比較材料と Human Decision 記録を正本化する。

Accepted 正本: [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Packet: Decision-SEV-2-VOCAB Re-evaluation
Status: CONSUMED（Human Decision recorded）
Selected: Option A
FindingSeverity: NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
main at packet baseline: b0cc1f75be274fda04f16bc339de76b1bd8cec8c
PR #117 merge ancestor: PASS
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Current canonical state（再評価時点）

```text
SEV-2-PURPOSE:        RECORDED / MHLW-first
SEV-2-CONCEPT-INV:    COMPLETED / OFFICIAL_CONCEPT_EXISTS
SEV-2-VOCAB:          HOLD / V-C / NOT ACCEPTED（再評価前）
SEV-2-ASSIGN:         CANDIDATE / NOT SELECTED（再評価前）
Implementation:       NOT STARTED
Decision-SEV-1:       Accepted / Option A
Issue #8 DEC number:  UNASSIGNED
```

問い:

> FindingSeverity をこのアプリの正式な domain concept として残す必要があるか。

## 2. CONCEPT-INV findings（事実）

```text
Official concept:              行動関連項目合計点数
Official thresholds confirmed: >= 10 ; >= 18
Generic severity taxonomy:     NOT FOUND
low / medium / high:           NOT OFFICIAL / DO NOT ADOPT
FindingSeverity = "10+"|"18+": NOT APPROPRIATE as direct vocabulary adoption
```

```text
INFERENCE: Underlying official fact ≈ behaviorRelatedItemsTotalScore
INFERENCE: Derived regulatory predicates ≈ score >= 10 / score >= 18 等
INFERENCE: Applicable scheme / rule (+ RuleSetVersion) を分けて持つ方が一次資料に整合しやすい
INFERENCE: Store Severity label は公式フィールドとして支持されない
```

## 3. Option A — FindingSeverity 不採用 / 契約から除外

```text
Generic FindingSeverity:     DO NOT ADOPT
SEV-2-ASSIGN:                N/A / DO NOT START
FindingSeverity TS type:     DO NOT CREATE
FindingSeverity validator:   DO NOT CREATE
```

代替検討方向（型・schema・実装は本 packet で決定しない）:

- `behaviorRelatedItemsTotalScore`
- regulatory evaluation / predicates
- applicable scheme / rule
- `RuleSetVersion`

## 4. Option B — FindingSeverity 維持 + MHLW 写像の別途正本化

成立条件（Human 明示が必要。本 packet では値確定しない）:

1. FindingSeverity が何を表現するか
2. MHLW のどの正式概念を source とするか
3. 正式値集合
4. 各値の意味
5. ordering の有無
6. 行動関連項目合計点との写像
7. 制度閾値との関係
8. RuleSetVersion との関係

禁止: `"10+"` / `"18+"` 直写、low/medium/high 等の AI 発明。

## 5. Option C — HOLD 継続

```text
Formal values / Meanings / Ordering: NOT DEFINED
SEV-2-ASSIGN: CANDIDATE / NOT SELECTED
Issue #8 最終 DEC 本文: まだ作成しない
```

## 6. Comparison matrix（要約）

| 観点 | A | B | HOLD |
|---|---|---|---|
| MHLW 直接整合 | **FACT:** 汎用 Severity NOT FOUND → 不採用は衝突しない | **FACT:** 一次資料に Severity 無し。写像必須 | 判断保留 |
| ローカル発明 | **INFERENCE:** 避けやすい | Human 写像未明示ならリスク残 | 発明なし |
| 制度改定耐性 | **INFERENCE:** 原値+RuleSetVersion 再適用しやすい | **INFERENCE:** ラベル再解釈が必要になりやすい | 未評価 |
| RuleSetVersion | **INFERENCE:** 自然に結びやすい | 関係定義が別途必要 | 未定義 |
| 後続 Decision 数 | Issue #8 不採用 DEC。ASSIGN N/A | Mapping + VOCAB + ASSIGN | DEC 未作成 |

## 7. Risks / implications

| ID | Kind | Content |
|---|---|---|
| R-1 | FACT | A/B 確定時は Issue #8 新 DEC 記録が必須（番号 UNASSIGNED） |
| R-2 | FACT | ASSIGN / TS / validator / 実装への自動進行は禁止 |
| R-3 | INFERENCE | Option A 採択後も代替モデル契約が無いと実装へ進めない |

## 8. Agent recommendation（履歴）

```text
Agent recommendation:
Option A is the stronger candidate
Human Decision at recommendation time: NOT MADE
```

## 9. Human Decision（記録済み）

```text
Decision-SEV-2-VOCAB Re-evaluation
Selected: A

If A:
  FindingSeverity = NOT ADOPTED
  SEV-2-ASSIGN = N/A / DO NOT START

Issue #8 DEC number:
  UNASSIGNED

Implementation:
  NOT STARTED
```

正本: [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)

## 10. Explicit stop boundary（Accepted 後も維持）

```text
Do not auto-start:
  SEV-2-ASSIGN
  TypeScript FindingSeverity type
  validator / fixture
  代替モデル実装
  Issue #8 DEC 番号推測採番
  SharePoint / tenant / M365 / Entra / Deploy
  real data
```
