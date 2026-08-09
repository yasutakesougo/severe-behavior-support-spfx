# Decision-AS-SP-PLACEMENT-1 — Site / List / Internal Column Name Decision packet（read-only compare）

この文書は、Sixteenth residual（SELECTED / A — Site / List / Internal Column Name）後の
**実値確定の根拠・確認方法・configuration 境界**についての
比較用 Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 52474cb5993b0d4b24fbdaeccf934a5e96d3d1b1
Decision ID: Decision-AS-SP-PLACEMENT-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: SV-1 + LV-1 + CN-1 + SC-1
Human Selected:
  Site confirmation:         SV-1
  List confirmation:         LV-1
  Internal Column Name:      CN-1
  Source-of-truth / config:  SC-1
Depends on:
  decision-ilb-1-sixteenth-residual-sp-placement-selection.md（SELECTED / A）
  decision-assessment-snapshot-dec6-mapping-acceptance.md（LOCKED — LF-1+RW-1+MF-1+VR-1）
  decision-assessment-snapshot-sp-adapter-acceptance.md（LOCKED — PB-1+EM-1+CV-1+D6-1+UP-1）
  decision-assessment-snapshot-application-save-acceptance.md（LOCKED — SC-1 + FR-1）
  decision-dec-009-snapshot-save-timing-acceptance.md（LOCKED — 再 Decision しない）
  sharepoint-contract-mapping.md（DEC-6 / Contract側先例）
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Placement confirmation rules: Accepted / LOCKED（SV-1 + LV-1 + CN-1 + SC-1）
Site value: NOT CONFIRMED / HOLD
List value: NOT CONFIRMED / HOLD
Internal Column Name: NOT CONFIRMED / HOLD
Schema / DTO code assignment: HOLD / NOT STARTED
Schema / DTO code: HOLD
tenant changes: NO-GO
Deploy / real data / real tenant: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 本 packet の問い

```text
Question:
  Site / List / Internal Column Name を実値として確定するとき、
  何を根拠にし、どこに置き、未確認時はどう fail-closed するか。
```

比較対象の判断単位:

```text
1. SV — Site value confirmation
2. LV — List value confirmation
3. CN — Internal Column Name confirmation
4. SC — source-of-truth / configuration boundary
```

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
  具体 Site / List / Internal Column Name 値は発明せず NOT CONFIRMED / HOLD。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| DEC-6 mapping rules | LF-1 + RW-1 + MF-1 + VR-1 | Decision-AS-DEC6-MAPPING-1 |
| Port / error / conversion | PB-1 / EM-1 / CV-1 / D6-1 / UP-1 | Decision-AS-SP-ADAPTER-1 |
| Save candidate / failures | SC-1 / FR-1 | Decision-AS-APP-SAVE-1 |
| Schema ID / SemVer | LOCKED 文字列 / 1.0.0 | SCHEMA-ID-1 / SCHEMA-VERSION-1 |
| コード割当 | NOT STARTED | living sync |

## 3. 現状の具体値（確認前・発明禁止）

| 項目 | 現状 |
|---|---|
| Site value | **NOT CONFIRMED / HOLD** |
| List value | **NOT CONFIRMED / HOLD** |
| Internal Column Name | **NOT CONFIRMED / HOLD** |

## 4. Site value confirmation（比較履歴）

| ID | Site 確定根拠 | 結果 |
|---|---|---|
| **SV-1** | 確認済み一次情報のみ。未確認なら HOLD。推測禁止 | **Accepted** |
| **SV-2** | 命名規則・例示 URL から仮確定 | NOT SELECTED |
| **SV-3** | Schema ID / 製品名から推論 | NOT SELECTED |
| **SV-HOLD** | 確認方法も未決定 | NOT SELECTED |
| **SV-X** | Human 明示 | NOT SELECTED |

## 5. List value confirmation（比較履歴）

| ID | List 確定根拠 | 結果 |
|---|---|---|
| **LV-1** | 実 List の確認済み一次情報のみ。未作成/未確認なら HOLD | **Accepted** |
| **LV-2** | 論理契約名から List 名を仮置き | NOT SELECTED |
| **LV-3** | SupportPlan List を流用・同一視 | NOT SELECTED |
| **LV-HOLD** | 確認方法も未決定 | NOT SELECTED |
| **LV-X** | Human 明示 | NOT SELECTED |

## 6. Internal Column Name confirmation（比較履歴）

| ID | Internal Name 確定根拠 | 結果 |
|---|---|---|
| **CN-1** | 実 Internal Column Name を確認して確定。Display/TS 名から推論しない | **Accepted** |
| **CN-2** | Display Name を Internal Name とみなす | NOT SELECTED |
| **CN-3** | TypeScript / domain 名を Internal Name にする | NOT SELECTED |
| **CN-HOLD** | 確認方法も未決定 | NOT SELECTED |
| **CN-X** | Human 明示 | NOT SELECTED |

## 7. source-of-truth / configuration boundary（比較履歴）

| ID | SoT / config 境界 | 結果 |
|---|---|---|
| **SC-1** | logical mapping = repository contract；環境値 = deployment configuration | **Accepted** |
| **SC-2** | Site/List/Internal Name を repository contract へ直書き | NOT SELECTED |
| **SC-3** | runtime discovery のみ | NOT SELECTED |
| **SC-HOLD** | 境界も未決定 | NOT SELECTED |
| **SC-X** | Human 明示 | NOT SELECTED |

## 8. Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation: SV-1 + LV-1 + CN-1 + SC-1
Human Decision: SV-1 + LV-1 + CN-1 + SC-1（Accepted / LOCKED）
Agent recommendation alone was NOT Acceptance evidence.
```

## 9. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| Site 確定根拠（SV-*） | **Accepted / SV-1** |
| List 確定根拠（LV-*） | **Accepted / LV-1** |
| Internal Name 確定根拠（CN-*） | **Accepted / CN-1** |
| SoT / config 境界（SC-*） | **Accepted / SC-1** |
| Site / List / Internal Name 具体値 | OUT / NOT CONFIRMED / HOLD |
| 実テナント確認・SharePoint 変更 | OUT / NO-GO |
| SharePoint / adapter コード実装 | OUT / DO NOT START |
| Schema / DTO コード割当 | OUT / HOLD |
| FindingCode / A-5 | OUT |
| post-retention deletion | OUT / AUTO-START FORBIDDEN |
| Implementation Start | HOLD |

## 10. Human Decision（固定）

```text
Site confirmation:         SV-1
List confirmation:         LV-1
Internal Column Name:      CN-1
Source-of-truth / config:  SC-1
```

```text
After Acceptance:
  Placement confirmation rules: LOCKED（Acceptance 正本）
  Site / List / Internal Column Name values: NOT CONFIRMED / HOLD
  Implementation Start: HOLD
  SharePoint implementation: DO NOT START
  tenant changes: NO-GO
  TypeScript / application / adapter: DO NOT START
  Schema / DTO: HOLD
  FindingCode / A-5: HOLD
  Post-retention deletion: OPEN / AUTO-START FORBIDDEN
  Deploy / real data / real tenant: NO-GO
```

## 11. Explicit prohibitions

```text
Do NOT:
  treat this compare packet alone as the LOCKED Acceptance（use Acceptance 正本）
  invent Site URL / List name / Internal Column Name
  perform tenant confirmation / SharePoint / Entra / M365 changes from this packet
  start SharePoint / adapter / application / DTO code
  reopen FindingCode / A-5
  auto-start post-retention deletion
  Deploy / real data
```

## 12. Next after Human Decision

```text
Decision-AS-SP-PLACEMENT-1: Accepted / LOCKED / SV-1 + LV-1 + CN-1 + SC-1
  → decision-assessment-snapshot-sp-placement-acceptance.md
Site / List / Internal Name values: NOT CONFIRMED / HOLD
Implementation Start: HOLD
tenant changes: NO-GO
Ready / Merge: NOT RUN by this Decision
```
