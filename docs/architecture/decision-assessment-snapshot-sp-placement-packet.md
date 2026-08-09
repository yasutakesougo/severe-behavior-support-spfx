# Decision-AS-SP-PLACEMENT-1 — Site / List / Internal Column Name Decision packet（read-only compare）

この文書は、Sixteenth residual（SELECTED / A — Site / List / Internal Column Name）後の
**実値確定の根拠・確認方法・configuration 境界**についての
比較用 Human Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 52474cb5993b0d4b24fbdaeccf934a5e96d3d1b1
Decision ID: Decision-AS-SP-PLACEMENT-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
Depends on:
  decision-ilb-1-sixteenth-residual-sp-placement-selection.md（SELECTED / A）
  decision-assessment-snapshot-dec6-mapping-acceptance.md（LOCKED — LF-1+RW-1+MF-1+VR-1）
  decision-assessment-snapshot-sp-adapter-acceptance.md（LOCKED — PB-1+EM-1+CV-1+D6-1+UP-1）
  decision-assessment-snapshot-application-save-acceptance.md（LOCKED — SC-1 + FR-1）
  decision-dec-009-snapshot-save-timing-acceptance.md（LOCKED — 再 Decision しない）
  sharepoint-contract-mapping.md（DEC-6 / Contract側先例）
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Site value: NOT CONFIRMED / HOLD
List value: NOT CONFIRMED / HOLD
Internal Column Name: NOT CONFIRMED / HOLD
Schema / DTO code assignment: HOLD / NOT STARTED
Schema / DTO code: HOLD
tenant changes: NO-GO
Deploy / real data / real tenant: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
value invention as Accepted without confirmed primary evidence: FORBIDDEN
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
本 packet に候補・Agent recommendation が書いてあっても Accepted にはならない。
採択は明示 Human Decision / Acceptance が必要。

本 packet は Site / List / Internal Column Name の具体値を発明しない。
現状の実テナント確認は NO-GO のため、具体値は NOT CONFIRMED / HOLD のまま。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| DEC-6 mapping rules | LF-1 + RW-1 + MF-1 + VR-1 | Decision-AS-DEC6-MAPPING-1 |
| Port / error / conversion | PB-1 / EM-1 / CV-1 / D6-1 / UP-1 | Decision-AS-SP-ADAPTER-1 |
| Save candidate / failures | SC-1 / FR-1 | Decision-AS-APP-SAVE-1 |
| Schema ID / SemVer | LOCKED 文字列 / 1.0.0 | SCHEMA-ID-1 / SCHEMA-VERSION-1 |
| コード割当 | NOT STARTED | living sync |

```text
MUST NOT re-open in this packet:
  DEC-009 / APP-SAVE / SP-ADAPTER / DEC6-MAPPING rules
  Schema ID / SemVer 文字列の変更
  FindingCode / A-5
  post-retention deletion
```

## 3. 現状の具体値（確認前・発明禁止）

| 項目 | 現状 |
|---|---|
| Site value | **NOT CONFIRMED / HOLD** |
| List value | **NOT CONFIRMED / HOLD** |
| Internal Column Name | **NOT CONFIRMED / HOLD** |

```text
実テナント確認: NO-GO（本 packet 時点）
したがって具体値を Accepted に埋めない。
本 Decision で閉じるのは確認方法と fail-closed / SoT 境界のみ。
```

## 4. Site value confirmation（比較・未採択）

| ID | Site 確定根拠 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **SV-1** | 実 SharePoint / tenant の確認済み一次情報のみで Site を確定。未確認なら HOLD。推測・命名案を Accepted 値にしない | 発明を防ぐ | 確認 GO まで値は空 | |
| **SV-2** | 命名規則・例示 URL から Site を仮確定 | 文書が進む | 本番不一致・誤接続 | |
| **SV-3** | Schema ID / 製品名から Site を推論 | 設定が薄い | Contract≠Site 分離を崩す | |
| **SV-HOLD** | 確認方法も未決定 | 遅延可 | placement が空転 | |
| **SV-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

## 5. List value confirmation（比較・未採択）

| ID | List 確定根拠 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **LV-1** | 実 List の確認済み一次情報のみで List を確定。未作成 / 未確認なら HOLD | 未作成 List を確定扱いにしない | List 作成 GO が別ゲート | |
| **LV-2** | 論理契約名から List 名を仮置きして Accepted | 実装が速い | 実 List と乖離 | |
| **LV-3** | SupportPlan List を流用・同一視 | 設定削減 | 集約混在・権限境界破壊 | |
| **LV-HOLD** | 確認方法も未決定 | 遅延可 | placement が空転 | |
| **LV-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

## 6. Internal Column Name confirmation（比較・未採択）

| ID | Internal Name 確定根拠 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **CN-1** | SharePoint が実際に保持する Internal Column Name を確認して確定。Display Name / TypeScript 名から推論しない | LF-1 / naming 非同一視と整合 | 列未作成なら HOLD | |
| **CN-2** | Display Name を Internal Name とみなす | UX に近い | ローカライズ・改名で壊れる | |
| **CN-3** | TypeScript / domain フィールド名を Internal Name にする | 実装対称 | Contract≠列の分離を崩す | |
| **CN-HOLD** | 確認方法も未決定 | 遅延可 | mapping 表が推測で埋まる | |
| **CN-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
MUST NOT:
  未確認 Internal Name を確定値として mapping 表へ書く
  Display Name / TS 名からの推論を Accepted 根拠にする
```

## 7. source-of-truth / configuration boundary（比較・未採択）

| ID | SoT / config 境界 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **SC-1** | mapping 正本と deployment/config 値を分離。logical mapping は repository contract。tenant/site/list/internal-name の環境値は deployment configuration | 契約と環境値の混線を防ぐ | config 置き場の運用が別途必要 | |
| **SC-2** | Site/List/Internal Name を repository contract 正本へ直書きして Accepted | 一箇所参照 | 環境差分・秘密情報・tenant 変更が contract を汚染 | |
| **SC-3** | すべて runtime discovery のみ（正本なし） | 柔軟 | 再現性・監査・fail-closed が弱い | |
| **SC-HOLD** | 境界も未決定 | 遅延可 | LF-1 表と環境値の置き場が曖昧 | |
| **SC-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

## 8. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  Site confirmation:              SV-1
  List confirmation:              LV-1
  Internal Column Name:           CN-1
  Source-of-truth / config:       SC-1

Rationale（比較用）:
  実テナント一次情報なしでは値を埋めず HOLD。
  確認方法と SoT 境界だけ先に閉じ、logical mapping（LF-1）と環境値を分離する。

This is NOT Human Acceptance evidence.
Human must explicitly Accept SV-* / LV-* / CN-* / SC-*（組み合わせ可）.
```

## 9. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| Site 確定根拠（SV-*） | **比較対象** |
| List 確定根拠（LV-*） | **比較対象** |
| Internal Name 確定根拠（CN-*） | **比較対象** |
| SoT / config 境界（SC-*） | **比較対象** |
| Site / List / Internal Name 具体値 | OUT / NOT CONFIRMED / HOLD |
| 実テナント確認・SharePoint 変更 | OUT / NO-GO |
| SharePoint / adapter コード実装 | OUT / DO NOT START |
| Schema / DTO コード割当 | OUT / HOLD |
| DEC-6 mapping rules / SP-ADAPTER 境界 | OUT（LOCKED） |
| FindingCode / A-5 | OUT |
| post-retention deletion | OUT / AUTO-START FORBIDDEN |
| Implementation Start | HOLD |

## 10. Human Decision（未選択）

Human は次を明示する（未記載は NOT DECIDED）。

```text
Site confirmation:         SV-1 / SV-2 / SV-3 / SV-HOLD / SV-X:<text>
List confirmation:         LV-1 / LV-2 / LV-3 / LV-HOLD / LV-X:<text>
Internal Column Name:      CN-1 / CN-2 / CN-3 / CN-HOLD / CN-X:<text>
Source-of-truth / config:  SC-1 / SC-2 / SC-3 / SC-HOLD / SC-X:<text>
```

```text
Until explicit Human Acceptance:
  Decision-AS-SP-PLACEMENT-1: OPEN / NOT ACCEPTED
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
  treat this compare packet as Acceptance
  invent Site URL / List name / Internal Column Name
  treat naming proposals as Accepted values
  perform tenant confirmation / SharePoint / Entra / M365 changes from this packet
  re-decide DEC-009 / APP-SAVE / SP-ADAPTER / DEC6-MAPPING
  lock SV-* / LV-* / CN-* / SC-* by Agent recommendation alone
  start SharePoint / adapter / application / DTO code
  assign schemaId / schemaVersion / dtoVersion into TypeScript
  reopen FindingCode / A-5
  auto-start post-retention deletion
  Deploy / real data
```

## 12. Next after Human Acceptance（将来）

```text
If Human Accepts SV-* + LV-* + CN-* + SC-*:
  → write Acceptance LOCKED doc（別手順）
  → concrete Site / List / Internal Name remain NOT CONFIRMED / HOLD
     until primary evidence + separate confirmation GO
  → still NOT auto Implementation Start
  → tenant changes / Deploy remain NO-GO unless newly authorized
Else:
  → remain HOLD
```
