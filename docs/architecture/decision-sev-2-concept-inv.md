# Decision-SEV-2-CONCEPT-INV — MHLW official concept investigation result

この文書は、**SEV-2-CONCEPT-INV**（厚労省一次資料による正式概念調査）の
**結果正本**である。

本単位は **investigation result** である。
**SEV-2-VOCAB Accepted ではない**。
**SEV-2-ASSIGN でもない**。
VOCAB HOLD（V-C）は、Human 再評価まで維持する。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit ID: SEV-2-CONCEPT-INV
Kind: investigation result（Decision Accepted ではない）
Status: COMPLETED / OFFICIAL_CONCEPT_EXISTS
SEV-2-PURPOSE: RECORDED（MHLW-first）
SEV-2-VOCAB: HOLD / V-C（維持。本結果で Accepted しない）
SEV-2-ASSIGN: CANDIDATE / NOT SELECTED（進めない）
Implementation: NOT STARTED
Depends on: Decision-SEV-2-PURPOSE
main before this canonicalization: e8176293c63b78e3e6763e59ada05fd71751e1ff
PR #115 / SEV-2-PURPOSE: MERGED
```

上位入口:

- [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)
- [`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)
- [`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

### Human investigation record（durable）

```text
Human CONCEPT-INV: Explicit Human investigation on 2026-08-08
Scope: MHLW current primary sources
  - 障害支援区分認定調査（行動関連項目）
  - 生活介護 実施上の留意事項（2026-05-28 最終改正を含む）
  - 厚労省告示第556号（10点以上 / 18点以上の別基準）
Agent execution evidence: NOT Human investigation evidence
```

## 調査結果

```text
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS
Official concept: 行動関連項目合計点数
Source: 障害支援区分認定調査 / MHLW statutory-regulatory sources
Official thresholds confirmed: >= 10 ; >= 18
Generic severity taxonomy: NOT FOUND
low / medium / high: NOT OFFICIAL / DO NOT ADOPT
```

### 公式概念（存在する）

厚労省の正式概念は、障害支援区分認定調査の **行動関連項目** の合計点数と、
その点数に対する **制度上の閾値** である。

- コミュニケーション、説明の理解、大声・奇声、自傷、他害、突発的行動等を
  頻度等により **0〜2点** で評価する。
- その **合計点** を制度判定に利用する。

### 確認した閾値（Severity 値ではない）

| 閾値 | 制度上の位置づけ（調査記録） |
|---|---|
| **10点以上** | 行動関連項目を用いた対象者基準。生活介護の重度障害者支援加算（Ⅱ）等の要件に現れる |
| **18点以上** | 特定の報酬上の対象者基準。中核的人材養成研修修了者等が支援計画シート等を作成して生活介護を提供する場合の加算等に現れる |

```text
FindingSeverity = "10+" | "18+"
  : NOT APPROPRIATE as direct vocabulary adoption
```

10点と18点は「Severity の enum 値」ではなく、
**同一の数値スコアに対して制度・加算ルールごとに適用される閾値** である。

### 汎用 Severity taxonomy

```text
Generic software severity taxonomy: NOT FOUND in MHLW primary sources
low / medium / high: NOT OFFICIAL / DO NOT ADOPT
Local invented severity labels: FORBIDDEN（SEV-2-PURPOSE 維持）
```

## データモデル分離（調査に基づく設計推論・未 Accepted）

本節は一次資料からの **設計上の推論** である。
VOCAB Accepted・型契約・実装開始を意味しない。

```text
Underlying official fact:
  behaviorRelatedItemsTotalScore
  examples: 10, 18, 21, ...

Derived regulatory predicates:
  isBehaviorRelatedScoreAtLeast10
  isBehaviorRelatedScoreAtLeast18

Applicable scheme / rule:
  重度障害者支援加算
  生活介護
  その他の制度判定
  (+ RuleSetVersion)
```

```text
Store Severity label: NOT supported by investigation as official field
Store official score + which rule judged it: STRONGLY SUPPORTED by primary sources
```

将来閾値が変わっても、保存済み `high` を再解釈する必要がない。
原値と `RuleSetVersion` で、その時点の制度ルールを再適用できる、という推論である。

既存 domain の行動関連点数（0〜24）・点数帯分類は
[`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md) に既にある。
本調査はその制度原値の存在を確認するものであり、
既存点数帯を FindingSeverity として再定義しない。

## FindingSeverity フィールドについての調査結論

```text
Generic FindingSeverity field as MHLW canonical concept: NOT FOUND
Official concept that exists instead: 行動関連項目合計点数 (+ regulatory thresholds)
```

したがって、現時点で FindingSeverity という汎用フィールド自体を
制度正本として採択する根拠は、本調査では見つかっていない。

## 次の Human Decision（SEV-2-VOCAB 再評価）— 未決

本結果を受けて比較する候補は実質次の 2 つ。
**まだ Accepted していない。**

| Option | 内容 |
|---|---|
| **A** | FindingSeverity を **不採用 / 契約から除外**する。代わりに行動関連項目合計点 + 制度判定結果 + RuleSetVersion を明示モデル化する |
| **B** | FindingSeverity を残す。ただし MHLW のどの正式概念を何に写像するかを **別途正本化**する必要がある |

```text
Primary-source alignment (investigation judgment): Option A is the stronger candidate
SEV-2-VOCAB Accepted: NO（再評価待ち）
Selected option: NOT SELECTED
```

Option A 採択時:

```text
Issue #8 新 DEC: REQUIRED（Decision-SEV-1 Option A / non-adoption path）
SEV-2-ASSIGN: N/A / DO NOT START
Implementation auto-start: FORBIDDEN
```

Option B 採択時:

```text
Mapping Decision / VOCAB values: REQUIRED before implementation
SEV-2-ASSIGN: 別 Human Decision（VOCAB Accepted 後のみ）
FindingSeverity = "10+" | "18+" への安易な写像: FORBIDDEN without separate canon
```

## 停止点

```text
SEV-2-CONCEPT-INV: RESULT AVAILABLE（本正本）
Next: Human SEV-2-VOCAB re-evaluation（Option A / B / HOLD 継続）
Do not start:
  SEV-2-ASSIGN
  TypeScript FindingSeverity type
  validator
  fixture
  implementation
```

## 分離（維持）

| 単位 | 状態 |
|---|---|
| Decision-SEV-1 ownership | Accepted / Option A |
| SEV-2-PURPOSE | RECORDED（MHLW-first） |
| **SEV-2-CONCEPT-INV**（本単位） | **COMPLETED / OFFICIAL_CONCEPT_EXISTS** |
| SEV-2-VOCAB | HOLD / V-C（再評価待ち。本結果で Accepted しない） |
| SEV-2-ASSIGN | CANDIDATE / NOT SELECTED |
| TypeScript / validator / 実装 | NOT STARTED |
| FindingIdentity / stable Finding ID | UNCHANGED |
| SharePoint / tenant / M365 / Entra / Deploy | NO-GO |
| real data | PROHIBITED |

## 対象外

- SEV-2-VOCAB の Accepted / 不採用の確定（Human 再評価）
- SEV-2-ASSIGN
- FindingSeverity = "10+" / "18+" の採択
- `low` / `medium` / `high` の採択
- 既存 `classifyBehaviorScore` / 点数帯の再定義
- TypeScript 型・validator・fixture・完全 Finding 実装
- Issue #8 DEC 番号の推測採番
- SharePoint / adapter / UI / deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
tenant changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本単位では変更しない
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Local invented severity taxonomy: FORBIDDEN
AI vocabulary invention: prohibited
SEV-2-VOCAB auto-Accept from this investigation: FORBIDDEN
SEV-2-ASSIGN auto progression: FORBIDDEN
```
