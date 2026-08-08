# Decision-SEV-2-CONCEPT-INV — MHLW official concept investigation result

この文書は、**SEV-2-CONCEPT-INV**（厚労省一次資料での正式概念有無調査）の
**結果正本**である。

本単位は **調査結果の記録**であり、SEV-2-VOCAB Accepted ではない。
SEV-2-ASSIGN / 実装を開始しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit ID: SEV-2-CONCEPT-INV
Status: COMPLETED / OFFICIAL_CONCEPT_EXISTS
Kind: investigation result（Decision Accepted ではない）
SEV-2-VOCAB: HOLD / V-C（維持。本結果で Accepted しない）
SEV-2-ASSIGN: CANDIDATE / NOT SELECTED（開始しない）
Implementation: NOT STARTED
Depends on: Decision-SEV-2-PURPOSE（MHLW-first）
main before this canonicalization: e8176293c63b78e3e6763e59ada05fd71751e1ff
PR #115 / SEV-2-PURPOSE: MERGED
```

上位入口:

- [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)
- [`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)
- [`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)
- [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

### Human investigation evidence（durable）

```text
Human investigation: Explicit Human CONCEPT-INV result on 2026-08-08
Result: COMPLETED / OFFICIAL_CONCEPT_EXISTS
Agent execution evidence: NOT Human Decision evidence
SEV-2-VOCAB Acceptance: NOT IMPLIED
```

## 調査結論

```text
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS
Official concept: 行動関連項目合計点数
Source class: 障害支援区分認定調査
Source kind: MHLW statutory / regulatory sources
Official thresholds confirmed: >= 10 ; >= 18
Generic severity taxonomy: NOT FOUND
low / medium / high: NOT OFFICIAL / DO NOT ADOPT
```

意味:

- 制度上の正式概念は **存在する**。
- ただし `low` / `medium` / `high` のような **汎用 Severity taxonomy ではない**。
- 厚労省の正式概念は、障害支援区分認定調査の **行動関連項目** の合計点数と、
  その点数に対する制度上の閾値である。
- 告示では、コミュニケーション、説明の理解、大声・奇声、自傷、他害、突発的行動などの
  行動関連項目について、頻度等を 0〜2 点で評価し、その合計点を制度判定に利用する。

## 確認した制度上の閾値（値採択ではない）

| 閾値 | 制度上の位置づけ（要約） | FindingSeverity 値としての採択 |
|---|---|---|
| **10点以上** | 行動関連項目を用いた対象者基準。生活介護の重度障害者支援加算（Ⅱ）等で、区分6かつ行動関連項目合計10点以上の利用者を対象とする要件を含む | **しない** |
| **18点以上** | 特定の報酬上の対象者基準。現行生活介護通知では、18点以上の利用者について中核的人材養成研修修了者等が支援計画シート等を作成して提供する場合の追加加算（150単位）等が明記される。告示第556号でも10点以上と別基準として規定 | **しない** |

```text
FindingSeverity = "10+" | "18+" : FORBIDDEN as immediate VOCAB adoption
Reason:
  10点と18点は Severity の値ではなく、
  同じ数値スコアに対して制度ごとに適用される閾値（regulatory predicates）である。
```

## データモデル上の分離（設計推論・未 Accepted）

一次資料から強く支持される方向（まだ Domain / Contract Accepted ではない）:

```text
Underlying official fact:
  behaviorRelatedItemsTotalScore
  Example values: 10, 18, 21, ...（整数スコア。Severity label ではない）

Derived regulatory predicates:
  isBehaviorRelatedScoreAtLeast10
  isBehaviorRelatedScoreAtLeast18

Applicable scheme / rule:
  重度障害者支援加算
  生活介護
  その他の制度判定
  + RuleSetVersion（判定時点の制度ルール）
```

意味:

- 「Severity を保存する」のではなく、
  **制度上の原値（行動関連項目合計点）** と **どの制度ルールで判定したか** を保持する。
- 将来閾値が変わっても、保存済みの `high` を解釈し直す必要がない。
- 原値と RuleSetVersion を使って、その時点の制度ルールで再判定できる。

```text
This section: design inference from primary sources
Status: NOT ACCEPTED as Domain / Contract / VOCAB
TypeScript / validator / fixture: NOT STARTED
```

## FindingSeverity に対する含意

```text
Generic FindingSeverity field as MHLW canonical:
  NO BASIS FOUND to adopt as official vocabulary
Official concept found:
  YES — 行動関連項目合計点数（+ regulatory thresholds / predicates）
Immediate map to FindingSeverity enum:
  FORBIDDEN
```

現時点では、FindingSeverity という汎用フィールド自体を制度正本として採択する根拠は見つかっていない。

## 次の Human Decision（SEV-2-VOCAB 再評価）候補

本 CONCEPT-INV 結果を受けた **比較候補**。まだ選択・Accepted しない。

| Option | 概要 | 含意 |
|---|---|---|
| **A** | FindingSeverity を **不採用 / 契約から除外**する。代わりに行動関連項目合計点 + 制度判定結果 + RuleSetVersion を明示モデル化する | Issue #8 新 DEC に不採用 Decision を記録。SEV-2-ASSIGN = N/A / DO NOT START |
| **B** | FindingSeverity を残す。ただし MHLW のどの正式概念を何に写像するかを **別途正本化**する | 写像正本なしに値を採択しない。ASSIGN は写像確定後 |

```text
Current preference signal (not Acceptance):
  Option A is the stronger candidate given primary-source alignment
SEV-2-VOCAB Status: HOLD / V-C（維持）
Human SEV-2-VOCAB re-evaluation: REQUIRED / NOT RUN
```

## 禁止（本結果から自動進行しない）

```text
SEV-2-VOCAB Accepted: NOT IMPLIED
SEV-2-ASSIGN start: FORBIDDEN
TypeScript type addition: FORBIDDEN
validator / fixture: FORBIDDEN
implementation: FORBIDDEN
FindingSeverity = "10+" | "18+" | low | medium | high: FORBIDDEN
src/** / tests/**: 変更しない
```

## 正しい次工程

```text
1. SEV-2-CONCEPT-INV — COMPLETED（本単位）
2. Human SEV-2-VOCAB re-evaluation
   - HOLD 継続
   - または Option A（不採用 / 契約除外）→ Issue #8 新 DEC
   - または Option B（残置 + MHLW 写像の別正本化）
3. Accepted（正式値あり）または 不採用 の場合のみ Issue #8 新 DEC 記録
4. ASSIGN / 実装は VOCAB 結果に従う（不採用なら N/A）
```

## 分離（維持）

| 単位 | 状態 |
|---|---|
| Decision-SEV-1 ownership | Accepted / Option A |
| SEV-2-PURPOSE | RECORDED（MHLW-first） |
| **SEV-2-CONCEPT-INV**（本単位） | **COMPLETED / OFFICIAL_CONCEPT_EXISTS** |
| SEV-2-VOCAB | HOLD / V-C（値 NOT DEFINED） |
| SEV-2-ASSIGN | CANDIDATE / NOT SELECTED |
| TypeScript 型 / validator / 実装 | NOT STARTED |
| FindingIdentity / stable Finding ID | UNCHANGED |
| SharePoint / tenant / M365 / Entra / Deploy | NO-GO |
| real data | PROHIBITED |

## 対象外

- SEV-2-VOCAB の Accepted / 不採用の確定（次の Human Decision）
- SEV-2-ASSIGN
- Domain 型・validator・fixture・完全 Finding 実装
- 行動関連点数の既存 domain 契約の再定義（本単位では触らない）
- SharePoint / adapter / UI / deploy / 実データ
- Issue #8 DEC 番号の推測採番

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
Immediate FindingSeverity enum from thresholds: FORBIDDEN
```
