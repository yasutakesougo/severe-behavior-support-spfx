# Decision-AS-SP-ADAPTER-1 — SharePoint / adapter boundary Decision packet（read-only compare）

この文書は、Fourteenth residual（SELECTED / A — SharePoint / adapter）後の
**application save contract と SharePoint persistence adapter の責務境界**
についての比較用 Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: bb3f65dc9a2d87052cbdbaccd0bedfa618106f57
Decision ID: Decision-AS-SP-ADAPTER-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: PB-1 + EM-1 + CV-1 + D6-1 + UP-1
Human Selected:
  Port I/O:                 PB-1
  Error mapping:            EM-1
  Conversion location:      CV-1
  DEC-6 relation:           D6-1
  Persistence unavailable:  UP-1
Depends on:
  decision-ilb-1-fourteenth-residual-sharepoint-adapter-selection.md（SELECTED / A）
  decision-assessment-snapshot-application-save-acceptance.md（LOCKED — SC-1 + FR-1）
  decision-dec-009-snapshot-save-timing-acceptance.md（LOCKED — 再 Decision しない）
  assessment-snapshot-complete-contract.md（PR-J domain）
  decision-assessment-snapshot-schema-id-value-naming-acceptance.md
  decision-assessment-snapshot-schema-version-acceptance.md
  sharepoint-contract-mapping.md（DEC-6 HOLD 参照）
Implementation Start: HOLD
SharePoint implementation: DO NOT START
DEC-6 concrete mapping: NOT DECIDED
Adapter boundary: Accepted / LOCKED（PB-1 + EM-1 + CV-1 + D6-1 + UP-1）
Application / adapter code implementation: DO NOT START
Schema ID / schemaVersion / dtoVersion code assignment: HOLD / NOT STARTED
Schema / DTO code: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Deploy / real data / real tenant: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 本 packet の問い

```text
Question:
  application save contract（SC-1 / FR-1）と
  SharePoint persistence adapter の責務境界をどうするか。
```

比較対象の判断単位:

```text
1. port の入力 / 出力境界
2. SharePoint固有エラー → FR-1 の変換責務
3. read / write conversion の責務位置
4. DEC-6 との関係（具体写像は本 packet で決めない）
5. persistence unavailable 時の fail-closed
```

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| 作成途中 | 下書き扱い | DEC-009 |
| 正式記録 | 確定時に保存 | DEC-009 |
| 確定後修正 | 元保持＋新版 | DEC-009 |
| 確定済み上書き | NOT ADOPTED | DEC-009 |
| 履歴 | 保持 | DEC-009 |
| domain 完全契約 | `validateAssessmentSnapshot` 等 | PR-J |
| Schema ID 文字列 | `…assessment-snapshot.snapshot` | Decision-AS-SCHEMA-ID-1 |
| schemaVersion / dtoVersion | `1.0.0` / `1.0.0` | Decision-AS-SCHEMA-VERSION-1 |
| Save candidate | SC-1（validated snapshot + intent） | Decision-AS-APP-SAVE-1 |
| Failure results | FR-1（判別可能な fail-closed） | Decision-AS-APP-SAVE-1 |
| FR-1 初期語彙 | `VALIDATION_FAILED` / `PERSISTENCE_UNAVAILABLE` / `OVERWRITE_FORBIDDEN` / `MALFORMED_INTENT` | Decision-AS-APP-SAVE-1 |
| コード割当 | NOT STARTED | living sync |

```text
MUST NOT re-open in this packet:
  DEC-009 業務意味
  Decision-AS-APP-SAVE-1（SC-1 / FR-1）の再定義
  PR-J domain 型・validator の再定義
  Schema ID / SemVer 文字列の変更
  FindingCode / A-5
  post-retention deletion
```

## 3. Port I/O 境界候補（比較履歴）

| ID | port 入出力 | 結果 |
|---|---|---|
| **PB-1** | 入力 = SC-1 語彙；出力 = FR-1 語彙 | **Accepted** |
| **PB-2** | 入力/出力に DTO / SharePoint item 形を混在 | NOT SELECTED |
| **PB-3** | 入力/出力が raw SharePoint REST / PnP | NOT SELECTED |
| **PB-HOLD** | 未決定のまま | NOT SELECTED |
| **PB-X** | Human 明示 | NOT SELECTED |

```text
NOT candidates:
  SC-1 を崩して raw unknown を port 入力にする
  FR-1 を boolean / 黙殺成功へ倒す
  Site URL / List name を port 契約の必須定数として本 packet で固定する
```

## 4. SharePoint 固有エラー → FR-1 変換責務（比較履歴）

| ID | 変換責務 | 結果 |
|---|---|---|
| **EM-1** | adapter が SharePoint 固有エラーを FR-1 へ写像 | **Accepted** |
| **EM-2** | application が SharePoint 固有エラーを直接解釈 | NOT SELECTED |
| **EM-3** | throw / 未分類例外のまま上位へ | NOT SELECTED |
| **EM-HOLD** | 未決定のまま | NOT SELECTED |
| **EM-X** | Human 明示 | NOT SELECTED |

失敗時 MUST NOT（LOCKED）:

```text
MUST NOT:
  SharePoint タイムアウト / 権限不足 / 接続失敗を保存成功へ倒す
  部分書き込み成功を全体成功として返す
  未実装 port を成功レスポンスや黙殺にする
```

## 5. read / write conversion 責務位置（比較履歴）

| ID | conversion 位置 | 結果 |
|---|---|---|
| **CV-1** | read/write conversion は adapter 内 | **Accepted** |
| **CV-2** | application が列変換を持つ | NOT SELECTED |
| **CV-3** | domain が列名 / Internal Name を知る | NOT SELECTED |
| **CV-HOLD** | 未決定のまま | NOT SELECTED |
| **CV-X** | Human 明示 | NOT SELECTED |

```text
本軸で決めないもの（UNCHANGED）:
  Site URL / List name
  Internal Column Name
  実 SharePoint 列型
  実テナント設定
  DEC-6 具体写像の Accepted
```

## 6. DEC-6 との関係（比較履歴）

| ID | DEC-6 関係 | 結果 |
|---|---|---|
| **D6-1** | 責務境界のみ。DEC-6 具体列変換は別 Entry | **Accepted** |
| **D6-2** | 本 Decision で DEC-6 具体写像まで同時 Accepted | NOT SELECTED |
| **D6-HOLD** | 境界も写像も未決のまま | NOT SELECTED |
| **D6-X** | Human 明示 | NOT SELECTED |

```text
DEC-6 concrete mapping: NOT DECIDED（D6-1 により維持）
SharePoint implementation: DO NOT START
```

## 7. persistence unavailable 時の fail-closed（比較履歴）

| ID | unavailable 時 | 結果 |
|---|---|---|
| **UP-1** | FR-1 `PERSISTENCE_UNAVAILABLE`（または同等）。成功へ倒さない | **Accepted** |
| **UP-2** | 空成功 / no-op 成功 | NOT SELECTED |
| **UP-3** | 例外のみ / 結果契約なし | NOT SELECTED |
| **UP-HOLD** | 未決定のまま | NOT SELECTED |
| **UP-X** | Human 明示 | NOT SELECTED |

```text
MUST NOT:
  persistence unavailable を draft/finalize 成功として扱う
  接続失敗を VALIDATION_FAILED に誤写像して業務データ欠陥へ見せる
  Deploy / 実テナント到達を本 packet の前提にする
```

## 8. Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation: PB-1 + EM-1 + CV-1 + D6-1 + UP-1
Human Decision: PB-1 + EM-1 + CV-1 + D6-1 + UP-1（Accepted / LOCKED）
Agent recommendation alone was NOT Acceptance evidence.
```

## 9. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| Port I/O 境界（PB-*） | **Accepted / PB-1** |
| SP error → FR-1 変換責務（EM-*） | **Accepted / EM-1** |
| read/write conversion 位置（CV-*） | **Accepted / CV-1** |
| DEC-6 関係（D6-*） | **Accepted / D6-1**（具体写像は NOT DECIDED） |
| unavailable fail-closed（UP-*） | **Accepted / UP-1** |
| DEC-009 / SC-1 / FR-1 本体 | OUT（LOCKED） |
| DEC-6 具体列写像 | OUT / NOT DECIDED |
| Site URL / List / Internal Name / 実列 | OUT |
| SharePoint / adapter コード実装 | OUT / DO NOT START |
| Schema / DTO コード割当 | OUT |
| FindingCode / A-5 | OUT |
| post-retention deletion | OUT / AUTO-START FORBIDDEN |
| Implementation Start | HOLD |

## 10. Human Decision（固定）

```text
Port I/O:                 PB-1
Error mapping:            EM-1
Conversion location:      CV-1
DEC-6 relation:           D6-1
Persistence unavailable:  UP-1
```

```text
After Acceptance:
  Adapter boundary: LOCKED（Acceptance 正本）
  Implementation Start: HOLD
  SharePoint implementation: DO NOT START
  DEC-6 concrete mapping: NOT DECIDED
  TypeScript / application / adapter: DO NOT START
  Schema ID / schemaVersion / dtoVersion code assignment: DO NOT START
  Schema / DTO: HOLD
  FindingCode / A-5: HOLD
  Post-retention deletion: OPEN / AUTO-START FORBIDDEN
  Deploy / real data / real tenant: NO-GO
```

## 11. Explicit prohibitions

```text
Do NOT:
  treat this compare packet alone as the LOCKED Acceptance（use Acceptance 正本）
  re-decide DEC-009 or Decision-AS-APP-SAVE-1
  start SharePoint / adapter / application / DTO code
  invent Site URL / List name / Internal Column Name / tenant settings
  Accept DEC-6 concrete mapping from this packet
  assign schemaId / schemaVersion / dtoVersion into TypeScript
  reopen FindingCode / A-5
  auto-start post-retention deletion
  Deploy / change real SharePoint / Entra / M365
```

## 12. Next after Human Decision

```text
Decision-AS-SP-ADAPTER-1: Accepted / LOCKED / PB-1 + EM-1 + CV-1 + D6-1 + UP-1
  → decision-assessment-snapshot-sp-adapter-acceptance.md
Implementation Start: HOLD
SharePoint implementation: DO NOT START
DEC-6 concrete mapping: NOT DECIDED
Ready / Merge: NOT RUN by this Decision
```
