# Decision-AS-TENANT-CONFIRM-1 — tenant confirmation GO Decision packet（read-only compare）

この文書は、Seventeenth residual（SELECTED / A — tenant confirmation GO）後の
**read-only tenant confirmation / primary-evidence acquisition GO** についての
比較用 Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-tenant-confirm-acceptance.md`](./decision-assessment-snapshot-tenant-confirm-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 78748790a442578ed138933dcc69cad05ed11bb3
Decision ID: Decision-AS-TENANT-CONFIRM-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: RO-1 + EV-1 + RB-1 + XG-1
Human Selected:
  Read-only scope:     RO-1
  Evidence bar:        EV-1
  Recording boundary:  RB-1
  NO-GO exclusions:    XG-1
Depends on:
  decision-ilb-1-seventeenth-residual-tenant-confirm-selection.md（SELECTED / A）
  decision-ilb-1-seventeenth-residual-decision-selection-packet.md（CONSUMED）
  decision-assessment-snapshot-sp-placement-acceptance.md（LOCKED — SV-1+LV-1+CN-1+SC-1）
  decision-assessment-snapshot-dec6-mapping-acceptance.md（LOCKED — LF-1+RW-1+MF-1+VR-1）
  decision-assessment-snapshot-sp-adapter-acceptance.md（LOCKED）
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Tenant confirmation GO boundary: Accepted / LOCKED（RO-1 + EV-1 + RB-1 + XG-1）
Tenant confirmation execution authorization: Accepted / LOCKED（ES-1 + TB-1 + EO-1 + FG-1）
Tenant confirmation execution: AUTHORIZED / NOT STARTED
Site / List / Internal Column Name values: NOT CONFIRMED / HOLD
tenant changes: NO-GO
List / column creation: NO-GO
Schema / DTO code: HOLD / NOT STARTED
Deploy / real data: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 本 packet の問い

```text
Question:
  read-only tenant confirmation GO として、
  何を許可し、何を証拠とし、どこに記録し、何を禁止するか。
```

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
  GO Accepted ≠ 具体値確定 ≠ 確認実行完了。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| Site / List / Internal Name 確定根拠 | SV-1 / LV-1 / CN-1 | Decision-AS-SP-PLACEMENT-1 |
| SoT / config | SC-1 | Decision-AS-SP-PLACEMENT-1 |
| DEC-6 mapping rules | LF-1+RW-1+MF-1+VR-1 | Decision-AS-DEC6-MAPPING-1 |
| adapter 境界 | PB-1+EM-1+CV-1+D6-1+UP-1 | Decision-AS-SP-ADAPTER-1 |

## 3. read-only confirmation scope（比較履歴）

| ID | GO が許可する範囲 | 結果 |
|---|---|---|
| **RO-1** | Site / List / Internal Name の read-only 確認・取得のみ | **Accepted** |
| **RO-2** | 確認中に欠落 List / 列を作成してよい | NOT SELECTED |
| **RO-3** | 確認と同時に adapter 実装・接続試験まで含む | NOT SELECTED |
| **RO-HOLD** | GO 範囲未決定 | NOT SELECTED |
| **RO-X** | Human 明示 | NOT SELECTED |

## 4. primary-evidence bar（比較履歴）

| ID | 証拠の条件 | 結果 |
|---|---|---|
| **EV-1** | 実テナント一次情報のみ。命名案・推測・Display Name 推論は不可 | **Accepted** |
| **EV-2** | 設計メモ・命名提案を一次情報扱い | NOT SELECTED |
| **EV-3** | TypeScript / Schema ID から逆算 | NOT SELECTED |
| **EV-HOLD** | 証拠基準未決定 | NOT SELECTED |
| **EV-X** | Human 明示 | NOT SELECTED |

## 5. recording boundary（比較履歴）

| ID | 確認後の記録場所 | 結果 |
|---|---|---|
| **RB-1** | deployment configuration（SC-1）。contract へ環境値直書き同一視しない | **Accepted** |
| **RB-2** | 確認前でも repository contract に仮値を Accepted として書く | NOT SELECTED |
| **RB-3** | 記録せず runtime discovery のみ | NOT SELECTED |
| **RB-HOLD** | 記録境界未決定 | NOT SELECTED |
| **RB-X** | Human 明示 | NOT SELECTED |

## 6. explicit NO-GO exclusions（比較履歴）

| ID | 本 GO から除外するもの | 結果 |
|---|---|---|
| **XG-1** | tenant changes / List·列作成 / Deploy / Implementation Start / SharePoint 実装 / Schema·DTO code | **Accepted** |
| **XG-2** | 確認 GO に List/列作成を含める | NOT SELECTED |
| **XG-3** | 確認 GO に Implementation Start を含める | NOT SELECTED |
| **XG-HOLD** | 除外境界未決定 | NOT SELECTED |
| **XG-X** | Human 明示 | NOT SELECTED |

## 7. Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation: RO-1 + EV-1 + RB-1 + XG-1
Human Decision: RO-1 + EV-1 + RB-1 + XG-1（Accepted / LOCKED）
Agent recommendation alone was NOT Acceptance evidence.
```

## 8. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| read-only GO 範囲（RO-*） | **Accepted / RO-1** |
| 証拠基準（EV-*） | **Accepted / EV-1** |
| 記録境界（RB-*） | **Accepted / RB-1** |
| NO-GO 除外（XG-*） | **Accepted / XG-1** |
| Site / List / Internal Name 具体値 | OUT / NOT CONFIRMED / HOLD |
| tenant confirmation 実行 | OUT / NOT STARTED（自動開始しない） |
| tenant changes / List・列作成 | OUT / NO-GO |
| Implementation Start / SharePoint 実装 | OUT / HOLD |
| FindingCode / A-5 / post-retention | OUT |

## 9. Human Decision（固定）

```text
Read-only scope:     RO-1
Evidence bar:        EV-1
Recording boundary:  RB-1
NO-GO exclusions:    XG-1
```

```text
After Acceptance:
  Tenant confirmation GO boundary: LOCKED（Acceptance 正本）
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
  treat this compare packet alone as the LOCKED Acceptance（use Acceptance 正本）
  auto-execute tenant confirmation from Acceptance alone
  invent Site / List / Internal Name
  change tenant / create Lists / columns
  Implementation Start / SharePoint implementation
  Deploy / real data
  reopen FindingCode / A-5
  auto-start post-retention
```

## 11. Next after Human Decision

```text
Decision-AS-TENANT-CONFIRM-1: Accepted / LOCKED / RO-1 + EV-1 + RB-1 + XG-1
  → decision-assessment-snapshot-tenant-confirm-acceptance.md
Decision-AS-TENANT-CONFIRM-EXEC-1: Accepted / LOCKED / ES-1 + TB-1 + EO-1 + FG-1
  → decision-assessment-snapshot-tenant-confirm-exec-acceptance.md
Tenant confirmation execution: AUTHORIZED / NOT STARTED
Site / List / Internal Name values: NOT CONFIRMED / HOLD
Ready / Merge: NOT RUN by this Decision
```
