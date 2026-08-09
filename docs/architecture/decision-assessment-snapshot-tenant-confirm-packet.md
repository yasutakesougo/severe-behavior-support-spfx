# Decision-AS-TENANT-CONFIRM-1 — tenant confirmation GO Decision packet（read-only compare）

この文書は、Seventeenth residual（SELECTED / A — tenant confirmation GO）後の
**read-only tenant confirmation / primary-evidence acquisition GO** についての
比較用 Human Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 78748790a442578ed138933dcc69cad05ed11bb3
Decision ID: Decision-AS-TENANT-CONFIRM-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
Depends on:
  decision-ilb-1-seventeenth-residual-tenant-confirm-selection.md（SELECTED / A）
  decision-ilb-1-seventeenth-residual-decision-selection-packet.md（CONSUMED）
  decision-assessment-snapshot-sp-placement-acceptance.md（LOCKED — SV-1+LV-1+CN-1+SC-1）
  decision-assessment-snapshot-dec6-mapping-acceptance.md（LOCKED — LF-1+RW-1+MF-1+VR-1）
  decision-assessment-snapshot-sp-adapter-acceptance.md（LOCKED）
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Tenant confirmation execution: NOT STARTED
Site / List / Internal Column Name values: NOT CONFIRMED / HOLD
tenant changes: NO-GO
List / column creation: NO-GO
Schema / DTO code: HOLD / NOT STARTED
Deploy / real data: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
value invention as Accepted without primary evidence: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 本 packet の問い

```text
Question:
  read-only tenant confirmation GO として、
  何を許可し、何を証拠とし、どこに記録し、何を禁止するか。
```

比較対象の判断単位:

```text
1. RO — read-only confirmation scope
2. EV — primary-evidence bar
3. RB — recording boundary（SC-1 整合）
4. XG — explicit NO-GO exclusions
```

```text
本 packet に候補・Agent recommendation が書いてあっても Accepted にはならない。
採択は明示 Human Decision / Acceptance が必要。

GO Accepted ≠ 具体 Site/List/Internal Name 確定
GO Accepted ≠ tenant confirmation 実行完了
現状値は NOT CONFIRMED / HOLD のまま。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| Site 確定根拠 | SV-1 | Decision-AS-SP-PLACEMENT-1 |
| List 確定根拠 | LV-1 | Decision-AS-SP-PLACEMENT-1 |
| Internal Name 確定根拠 | CN-1 | Decision-AS-SP-PLACEMENT-1 |
| SoT / config | SC-1 | Decision-AS-SP-PLACEMENT-1 |
| DEC-6 mapping rules | LF-1+RW-1+MF-1+VR-1 | Decision-AS-DEC6-MAPPING-1 |
| adapter 境界 | PB-1+EM-1+CV-1+D6-1+UP-1 | Decision-AS-SP-ADAPTER-1 |

```text
MUST NOT re-open:
  SP-PLACEMENT / DEC6-MAPPING / SP-ADAPTER / APP-SAVE / DEC-009
  FindingCode / A-5
  post-retention deletion
```

## 3. read-only confirmation scope（比較・未採択）

| ID | GO が許可する範囲 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **RO-1** | 実 SharePoint の Site / List / Internal Column Name を read-only で確認・取得する許可のみ | SV-1/LV-1/CN-1 と整合 | 変更操作と混同しやすい | |
| **RO-2** | 確認中に欠落 List / 列があれば作成してよい | 前進が速い | tenant 変更 NO-GO を破る | |
| **RO-3** | 確認と同時に adapter 実装・接続試験まで含む | 一括 | Implementation Start と混線 | |
| **RO-HOLD** | GO 範囲未決定 | 遅延可 | 選定が空転 | |
| **RO-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

## 4. primary-evidence bar（比較・未採択）

| ID | 証拠の条件 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **EV-1** | 実テナント上の一次情報のみ（実オブジェクトの確認記録）。命名案・推測・Display Name 推論は証拠にしない | SV-1/LV-1/CN-1 と整合 | 確認 GO なしでは値を埋められない | |
| **EV-2** | 設計メモ・命名提案を一次情報扱いしてよい | 文書が埋まる | 発明確定 | |
| **EV-3** | TypeScript / Schema ID から逆算した値を証拠にする | 実装対称 | Contract≠配置の分離を崩す | |
| **EV-HOLD** | 証拠基準未決定 | 遅延可 | 偽確定が入りやすい | |
| **EV-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

## 5. recording boundary（比較・未採択）

| ID | 確認後の記録場所 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **RB-1** | 確認済み値は deployment configuration（SC-1）側へ。repository logical mapping 正本へ環境値を直書きして同一視しない。未確認のまま Accepted 値にしない | SC-1 整合 | config 置き場の運用が別途必要 | |
| **RB-2** | 確認前でも repository contract に仮値を Accepted として書く | 実装が先に進む | 発明確定・環境汚染 | |
| **RB-3** | 記録せず runtime discovery のみ | 柔軟 | 再現性・監査が弱い | |
| **RB-HOLD** | 記録境界未決定 | 遅延可 | SC-1 と衝突 | |
| **RB-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

## 6. explicit NO-GO exclusions（比較・未採択）

| ID | 本 GO から除外するもの | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **XG-1** | tenant changes / List作成 / 列作成 / Deploy / real data mutation / Implementation Start / SharePoint implementation / Schema·DTO code は NO-GO または HOLD のまま | 確認 GO と実装 GO を分離 | 確認作業が「何もできない」と誤読されうる | |
| **XG-2** | 確認 GO に List/列作成を含める | 欠落をその場で埋める | placement NO-GO 破壊 | |
| **XG-3** | 確認 GO に Implementation Start を含める | 一括前進 | 複数ゲート混線 | |
| **XG-HOLD** | 除外境界未決定 | 遅延可 | scope creep | |
| **XG-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
MUST NOT from this GO alone:
  change tenant / Entra / M365 settings
  create or modify Lists / columns
  Deploy / mutate real data
  start adapter / application / DTO code
  invent Site / List / Internal Name values
```

## 7. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  Read-only scope:     RO-1
  Evidence bar:        EV-1
  Recording boundary:  RB-1
  NO-GO exclusions:    XG-1

Rationale（比較用）:
  SV-1/LV-1/CN-1/SC-1 を壊さず、read-only 確認許可だけを切り出す。
  具体値は一次情報取得後まで NOT CONFIRMED / HOLD。

This is NOT Human Acceptance evidence.
Human must explicitly Accept RO-* / EV-* / RB-* / XG-*（組み合わせ可）.
```

## 8. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| read-only GO 範囲（RO-*） | **比較対象** |
| 証拠基準（EV-*） | **比較対象** |
| 記録境界（RB-*） | **比較対象** |
| NO-GO 除外（XG-*） | **比較対象** |
| Site / List / Internal Name 具体値 | OUT / NOT CONFIRMED / HOLD |
| tenant confirmation 実行そのもの | OUT（別手順；本 Acceptance 後も自動開始しない） |
| tenant changes / List・列作成 | OUT / NO-GO |
| Implementation Start / SharePoint 実装 | OUT / HOLD |
| FindingCode / A-5 / post-retention | OUT |

## 9. Human Decision（未選択）

```text
Read-only scope:     RO-1 / RO-2 / RO-3 / RO-HOLD / RO-X:<text>
Evidence bar:        EV-1 / EV-2 / EV-3 / EV-HOLD / EV-X:<text>
Recording boundary:  RB-1 / RB-2 / RB-3 / RB-HOLD / RB-X:<text>
NO-GO exclusions:    XG-1 / XG-2 / XG-3 / XG-HOLD / XG-X:<text>
```

```text
Until explicit Human Acceptance:
  Decision-AS-TENANT-CONFIRM-1: OPEN / NOT ACCEPTED
  Tenant confirmation execution: NOT STARTED
  Site / List / Internal Name values: NOT CONFIRMED / HOLD
  tenant changes / List / column creation: NO-GO
  Implementation Start: HOLD
  SharePoint implementation: DO NOT START
  Schema / DTO: HOLD
  Deploy / real data: NO-GO
  FindingCode / A-5: HOLD
  Post-retention: OPEN / AUTO-START FORBIDDEN
```

## 10. Explicit prohibitions

```text
Do NOT:
  treat this compare packet as Acceptance
  execute tenant confirmation from this packet alone
  invent Site / List / Internal Name
  change tenant / create Lists / columns
  lock RO/EV/RB/XG by Agent recommendation alone
  Implementation Start / SharePoint implementation
  Deploy / real data
  reopen FindingCode / A-5
  auto-start post-retention
```

## 11. Next after Human Acceptance（将来）

```text
If Human Accepts RO-* + EV-* + RB-* + XG-*:
  → write Acceptance LOCKED doc（別手順）
  → still NOT auto-execute tenant confirmation
  → concrete values remain NOT CONFIRMED until primary evidence recorded
  → tenant changes / implementation remain NO-GO / HOLD
Else:
  → remain HOLD
```
