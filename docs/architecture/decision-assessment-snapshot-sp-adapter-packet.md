# Decision-AS-SP-ADAPTER-1 — SharePoint / adapter boundary Decision packet（read-only compare）

この文書は、Fourteenth residual（SELECTED / A — SharePoint / adapter）後の
**application save contract と SharePoint persistence adapter の責務境界**
についての比較用 Human Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: bb3f65dc9a2d87052cbdbaccd0bedfa618106f57
Decision ID: Decision-AS-SP-ADAPTER-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
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
Adapter boundary concrete design: HOLD / NOT DECIDED
Schema ID / schemaVersion / dtoVersion code assignment: HOLD / NOT STARTED
Schema / DTO code: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Deploy / real data / real tenant: NO-GO
value invention as Accepted without Human Decision: FORBIDDEN
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
本 packet に候補・Agent recommendation が書いてあっても Accepted にはならない。
採択は明示 Human Decision / Acceptance が必要。
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

## 3. Port I/O 境界候補（比較・未採択）

| ID | port 入出力 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **PB-1** | 入力 = SC-1 語彙（validated `AssessmentSnapshot` + intent）；出力 = FR-1 語彙 | application は SharePoint 形を見ない | SC-1/FR-1 と整合；domain 非依存を維持しやすい | port 形状の文書固定が別 Acceptance になる |
| **PB-2** | 入力/出力に DTO / SharePoint item 形を混在 | adapter 前段が薄い | application が物理列へ結合しやすい；Schema/DTO HOLD と衝突 | |
| **PB-3** | 入力/出力が raw SharePoint REST / PnP | 実装直結 | 技術契約が業務契約を侵食する | |
| **PB-HOLD** | 未決定のまま | 遅延可 | adapter 境界が進まない | |
| **PB-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
NOT candidates:
  SC-1 を崩して raw unknown を port 入力にする
  FR-1 を boolean / 黙殺成功へ倒す
  Site URL / List name を port 契約の必須定数として本 packet で固定する
```

## 4. SharePoint 固有エラー → FR-1 変換責務（比較・未採択）

| ID | 変換責務 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **EM-1** | adapter が SharePoint 固有エラーを FR-1 へ写像し、application は FR-1 のみ扱う | SP 語彙を application から隔離 | fail-closed と監査しやすい | 写像表の粒度は別固定が必要になり得る |
| **EM-2** | application が SharePoint 固有エラーを直接解釈 | 変換層が薄い | SP 依存が application に漏れる | |
| **EM-3** | throw / 未分類例外のまま上位へ | 実装が最短 | FR-1 契約と衝突；成功黙殺と区別困難 | |
| **EM-HOLD** | 未決定のまま | 遅延可 | unavailable / 権限失敗の扱いが不定 | |
| **EM-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

最低限の比較前提（LOCKED 志向・採択ではない）:

```text
MUST NOT:
  SharePoint タイムアウト / 権限不足 / 接続失敗を保存成功へ倒す
  部分書き込み成功を全体成功として返す
  未実装 port を成功レスポンスや黙殺にする
```

## 5. read / write conversion 責務位置（比較・未採択）

| ID | conversion 位置 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **CV-1** | read/write conversion は adapter 内。application / domain は論理語彙のみ | DEC-6 を adapter Entry に閉じられる | domain 純度を維持 | DEC-6 具体写像は別 Decision のまま |
| **CV-2** | application が列変換を持つ | UI 近傍で完結しやすく見える | SharePoint 依存が application に混入 | |
| **CV-3** | domain が列名 / Internal Name を知る | 一見一箇所 | domain 非依存方針と衝突 | |
| **CV-HOLD** | 未決定のまま | 遅延可 | 境界が曖昧なまま実装誘惑が増える | |
| **CV-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
本軸で決めないもの:
  Site URL / List name
  Internal Column Name
  実 SharePoint 列型
  実テナント設定
  DEC-6 具体写像の Accepted
```

## 6. DEC-6 との関係（比較前提・具体写像は NOT DECIDED）

| ID | DEC-6 関係 | 意味 | 結果方針 |
|---|---|---|---|
| **D6-1** | 本 Decision は adapter / application 責務境界のみ。DEC-6 具体列変換は別 Entry / 別 Human GO | 境界と写像を分離 | **比較推奨寄り**（採択ではない） |
| **D6-2** | 本 Decision で DEC-6 具体写像まで同時 Accepted | 一括固定 | Site/List/列未確定のため危険 |
| **D6-HOLD** | 境界も写像も未決のまま | 遅延 | Fourteenth unit が空転しやすい |
| **D6-X** | Human 明示 | Human 指定 | 未記載なら採択不可 |

```text
DEC-6 concrete mapping: NOT DECIDED
SharePoint implementation: DO NOT START
本 packet は DEC-6 を Accepted にしない。
```

## 7. persistence unavailable 時の fail-closed（比較・未採択）

| ID | unavailable 時 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **UP-1** | adapter / port 不能時は FR-1 `PERSISTENCE_UNAVAILABLE`（または同等の判別可能失敗）。成功へ倒さない | Decision-AS-APP-SAVE-1 と整合 | 監査・テスト容易 | 「同等」語彙の追加は別 Acceptance |
| **UP-2** | 空成功 / no-op 成功 | UX が滑らかに見える | fail-closed 破壊 | |
| **UP-3** | 例外のみ / 結果契約なし | 実装最短 | FR-1 と非整合 | |
| **UP-HOLD** | 未決定のまま | 遅延可 | SC-1/FR-1 接続が不完全 | |
| **UP-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
MUST NOT:
  persistence unavailable を draft/finalize 成功として扱う
  接続失敗を VALIDATION_FAILED に誤写像して業務データ欠陥へ見せる
  Deploy / 実テナント到達を本 packet の前提にする
```

## 8. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  Port I/O:                 PB-1
  Error mapping:            EM-1
  Conversion location:      CV-1
  DEC-6 relation:           D6-1
  Persistence unavailable:  UP-1

Rationale（比較用）:
  SC-1 / FR-1 を port 契約の両端に固定し、
  SharePoint 固有語彙・列変換・接続失敗写像は adapter に閉じる。
  DEC-6 具体写像・Site/List/列・実装は別 Decision / DO NOT START のまま。

This is NOT Human Acceptance evidence.
Human must explicitly Accept PB-* / EM-* / CV-* / D6-* / UP-*（組み合わせ可）.
```

## 9. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| Port I/O 境界（PB-*） | **比較対象** |
| SP error → FR-1 変換責務（EM-*） | **比較対象** |
| read/write conversion 位置（CV-*） | **比較対象** |
| DEC-6 関係（D6-*） | **比較対象（具体写像は決めない）** |
| unavailable fail-closed（UP-*） | **比較対象** |
| DEC-009 / SC-1 / FR-1 本体 | OUT（LOCKED） |
| DEC-6 具体列写像 | OUT / NOT DECIDED |
| Site URL / List / Internal Name / 実列 | OUT |
| SharePoint / adapter コード実装 | OUT / DO NOT START |
| Schema / DTO コード割当 | OUT |
| FindingCode / A-5 | OUT |
| post-retention deletion | OUT / AUTO-START FORBIDDEN |
| Implementation Start | HOLD |

## 10. Human Decision（未選択）

Human は次を明示する（未記載は NOT DECIDED）。

```text
Port I/O:                 PB-1 / PB-2 / PB-3 / PB-HOLD / PB-X:<text>
Error mapping:            EM-1 / EM-2 / EM-3 / EM-HOLD / EM-X:<text>
Conversion location:      CV-1 / CV-2 / CV-3 / CV-HOLD / CV-X:<text>
DEC-6 relation:           D6-1 / D6-2 / D6-HOLD / D6-X:<text>
Persistence unavailable:  UP-1 / UP-2 / UP-3 / UP-HOLD / UP-X:<text>
```

```text
Until explicit Human Acceptance:
  Adapter boundary concrete design: HOLD / NOT DECIDED
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
  treat this compare packet as Acceptance
  re-decide DEC-009 or Decision-AS-APP-SAVE-1
  lock PB-* / EM-* / CV-* / D6-* / UP-* by Agent recommendation alone
  start SharePoint / adapter / application / DTO code
  invent Site URL / List name / Internal Column Name / tenant settings
  Accept DEC-6 concrete mapping from this packet
  assign schemaId / schemaVersion / dtoVersion into TypeScript
  reopen FindingCode / A-5
  auto-start post-retention deletion
  Deploy / change real SharePoint / Entra / M365
```

## 12. Next after Human Acceptance（将来）

```text
If Human Accepts PB-* + EM-* + CV-* + D6-* + UP-*:
  → write Acceptance LOCKED doc（別手順）
  → still NOT auto Implementation Start
  → SharePoint implementation remains DO NOT START
  → DEC-6 concrete mapping remains separate / NOT DECIDED unless D6-2 explicitly Accepted
     （D6-2 は本段階では推奨しない）
Else:
  → remain HOLD
```
