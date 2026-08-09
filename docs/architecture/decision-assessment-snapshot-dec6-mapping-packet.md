# Decision-AS-DEC6-MAPPING-1 — DEC-6 concrete mapping Decision packet（read-only compare）

この文書は、Fifteenth residual（SELECTED / A — DEC-6 concrete mapping）後の
**AssessmentSnapshot logical field ↔ persistence field 写像規則**についての
比較用 Human Decision Packet である。

Accepted 正本:
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: c668d820708010fd1c3e6223b1e46bd69c486ed7
Decision ID: Decision-AS-DEC6-MAPPING-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Human Decision: LF-1 + RW-1 + MF-1 + VR-1
Human Selected:
  Logical ↔ persistence:   LF-1
  Read/write conversion:    RW-1
  Missing/malformed:        MF-1
  Version handling:         VR-1
Depends on:
  decision-ilb-1-fifteenth-residual-dec6-mapping-selection.md（SELECTED / A）
  decision-assessment-snapshot-sp-adapter-acceptance.md（LOCKED — PB-1+EM-1+CV-1+D6-1+UP-1）
  decision-assessment-snapshot-application-save-acceptance.md（LOCKED — SC-1 + FR-1）
  decision-dec-009-snapshot-save-timing-acceptance.md（LOCKED — 再 Decision しない）
  decision-assessment-snapshot-schema-id-value-naming-acceptance.md
  decision-assessment-snapshot-schema-version-acceptance.md
  assessment-snapshot-complete-contract.md（PR-J domain）
  sharepoint-contract-mapping.md（DEC-6 HOLD / Contract側先例）
Implementation Start: HOLD
SharePoint implementation: DO NOT START
DEC-6 mapping rules: Accepted / LOCKED（LF-1 + RW-1 + MF-1 + VR-1）
Site URL / List name / Internal Column Name: NOT DECIDED
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
  AssessmentSnapshot の DEC-6 concrete mapping として、
  logical field ↔ persistence field / conversion / fail-closed / version
  の扱いをどう固定するか。
```

比較対象の判断単位:

```text
1. logical field ↔ persistence field 対応の形
2. read / write conversion の規則
3. missing / malformed column の fail-closed
4. schemaVersion / dtoVersion の persistence 扱い
```

```text
Historical note:
  候補・Agent recommendation は比較用。採択は Acceptance 正本のみが LOCKED である。
  本 packet は具体 Internal Column Name / Site URL / List name を発明しない。
```

## 2. 再 Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| domain 完全契約 | `validateAssessmentSnapshot` 等 | PR-J |
| Schema ID 文字列 | `…assessment-snapshot.snapshot` | Decision-AS-SCHEMA-ID-1 |
| schemaVersion / dtoVersion | `1.0.0` / `1.0.0` | Decision-AS-SCHEMA-VERSION-1 |
| Save candidate | SC-1 | Decision-AS-APP-SAVE-1 |
| Failure results | FR-1 | Decision-AS-APP-SAVE-1 |
| Port I/O | PB-1（SC-1 in / FR-1 out） | Decision-AS-SP-ADAPTER-1 |
| Error mapping | EM-1（adapter → FR-1） | Decision-AS-SP-ADAPTER-1 |
| Conversion location | CV-1（adapter 内） | Decision-AS-SP-ADAPTER-1 |
| DEC-6 relation | D6-1（境界と写像分離） | Decision-AS-SP-ADAPTER-1 |
| Unavailable | UP-1（`PERSISTENCE_UNAVAILABLE`） | Decision-AS-SP-ADAPTER-1 |
| コード割当 | NOT STARTED | living sync |

```text
MUST NOT re-open in this packet:
  DEC-009 / SC-1 / FR-1 / PB-1 / EM-1 / CV-1 / D6-1 / UP-1
  Schema ID / SemVer 文字列の変更
  FindingCode / A-5
  post-retention deletion
```

## 3. logical field ↔ persistence field（比較履歴）

| ID | 対応の形 | 結果 |
|---|---|---|
| **LF-1** | 明示 mapping 表；未確認具体値は書かない | **Accepted** |
| **LF-2** | TypeScript 名から Internal Name を推論して確定 | NOT SELECTED |
| **LF-3** | Schema ID / List 名から列を一括推論 | NOT SELECTED |
| **LF-HOLD** | 写像形も未決定 | NOT SELECTED |
| **LF-X** | Human 明示 | NOT SELECTED |

```text
NOT candidates:
  未確認 Internal Name を確定値として書く
  SupportPlan 列名を AssessmentSnapshot に流用して同一視
  Schema ID を SharePoint List name / 列名と同一視
```

## 4. read / write conversion（比較履歴）

| ID | conversion 規則 | 結果 |
|---|---|---|
| **RW-1** | フィールドごとの read/write 規則；失敗は成功へ倒さない；adapter 内 | **Accepted** |
| **RW-2** | write のみ / read best-effort | NOT SELECTED |
| **RW-3** | 単一 opaque JSON 列 | NOT SELECTED |
| **RW-HOLD** | 未決定のまま | NOT SELECTED |
| **RW-X** | Human 明示 | NOT SELECTED |

## 5. missing / malformed column の fail-closed（比較履歴）

| ID | missing / malformed 時 | 結果 |
|---|---|---|
| **MF-1** | fail-closed；成功空・部分成功へ倒さない；FR-1 写像（EM-1） | **Accepted** |
| **MF-2** | default 合成して成功継続 | NOT SELECTED |
| **MF-3** | 不正列スキップして残り成功 | NOT SELECTED |
| **MF-HOLD** | 未決定のまま | NOT SELECTED |
| **MF-X** | Human 明示 | NOT SELECTED |

```text
MUST NOT:
  missing / malformed を draft/finalize 成功として扱う
  成功0件配列へ列失敗を隠す（DEC-7 先例）
```

## 6. version（schemaVersion / dtoVersion）の扱い（比較履歴）

| ID | version 扱い | 結果 |
|---|---|---|
| **VR-1** | Accepted 1.0.0 照合；不一致 fail-closed；コード割当 HOLD | **Accepted** |
| **VR-2** | persistence で version を無視 | NOT SELECTED |
| **VR-3** | 未知 version を自動 migrate | NOT SELECTED |
| **VR-HOLD** | 未決定のまま | NOT SELECTED |
| **VR-X** | Human 明示 | NOT SELECTED |

## 7. Agent recommendation（historical / NOT Acceptance）

```text
Agent recommendation: LF-1 + RW-1 + MF-1 + VR-1
Human Decision: LF-1 + RW-1 + MF-1 + VR-1（Accepted / LOCKED）
Agent recommendation alone was NOT Acceptance evidence.
```

## 8. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| logical ↔ persistence 対応形（LF-*） | **Accepted / LF-1** |
| read/write conversion（RW-*） | **Accepted / RW-1** |
| missing/malformed fail-closed（MF-*） | **Accepted / MF-1** |
| version 扱い（VR-*） | **Accepted / VR-1** |
| Site URL / List name / Internal Column Name 具体値 | OUT / NOT DECIDED |
| SharePoint / adapter コード実装 | OUT / DO NOT START |
| Schema / DTO コード割当 | OUT / HOLD |
| DEC-009 / SC-1 / FR-1 / SP-ADAPTER 境界 | OUT（LOCKED） |
| FindingCode / A-5 | OUT |
| post-retention deletion | OUT / AUTO-START FORBIDDEN |
| Implementation Start | HOLD |

## 9. Human Decision（固定）

```text
Logical ↔ persistence:   LF-1
Read/write conversion:    RW-1
Missing/malformed:        MF-1
Version handling:         VR-1
```

```text
After Acceptance:
  DEC-6 mapping rules: LOCKED（Acceptance 正本）
  Site URL / List name / Internal Column Name: NOT DECIDED
  Implementation Start: HOLD
  SharePoint implementation: DO NOT START
  TypeScript / application / adapter: DO NOT START
  Schema ID / schemaVersion / dtoVersion code assignment: DO NOT START
  Schema / DTO: HOLD
  FindingCode / A-5: HOLD
  Post-retention deletion: OPEN / AUTO-START FORBIDDEN
  Deploy / real data / real tenant: NO-GO
```

## 10. Explicit prohibitions

```text
Do NOT:
  treat this compare packet alone as the LOCKED Acceptance（use Acceptance 正本）
  re-decide DEC-009 / APP-SAVE / SP-ADAPTER
  invent Site URL / List name / Internal Column Name / tenant settings
  start SharePoint / adapter / application / DTO code
  assign schemaId / schemaVersion / dtoVersion into TypeScript
  reopen FindingCode / A-5
  auto-start post-retention deletion
  Deploy / change real SharePoint / Entra / M365
```

## 11. Next after Human Decision

```text
Decision-AS-DEC6-MAPPING-1: Accepted / LOCKED / LF-1 + RW-1 + MF-1 + VR-1
  → decision-assessment-snapshot-dec6-mapping-acceptance.md
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Site / List / Internal Name: NOT DECIDED
Ready / Merge: NOT RUN by this Decision
```
