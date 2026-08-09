# Decision-AS-DEC6-MAPPING-1 — DEC-6 concrete mapping Decision packet（read-only compare）

この文書は、Fifteenth residual（SELECTED / A — DEC-6 concrete mapping）後の
**AssessmentSnapshot logical field ↔ persistence field 写像規則**についての
比較用 Human Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: c668d820708010fd1c3e6223b1e46bd69c486ed7
Decision ID: Decision-AS-DEC6-MAPPING-1
Kind: Human Decision packet（compare only）
Status: OPEN / NOT ACCEPTED
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
DEC-6 concrete mapping values: HOLD / NOT DECIDED
Site URL / List name / Internal Column Name: NOT DECIDED
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
本 packet に候補・Agent recommendation が書いてあっても Accepted にはならない。
採択は明示 Human Decision / Acceptance が必要。

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

## 3. logical field ↔ persistence field（比較・未採択）

| ID | 対応の形 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **LF-1** | 明示 mapping 表（logical field → persistence field slot）。Internal Name / Site / List の具体値は未確認なら書かず Status=未確認のまま | 推測埋めを防げる | 表が空欄のまま残る | |
| **LF-2** | TypeScript フィールド名から Internal Name を推論して確定 | 実装が速い | naming 非同一視方針と衝突；発明になる | |
| **LF-3** | Schema ID / List 名から列を一括推論 | 設定が薄い | Contract≠List≠列の分離を崩す | |
| **LF-HOLD** | 写像形も未決定 | 遅延可 | DEC-6 が空転 | |
| **LF-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
NOT candidates:
  未確認 Internal Name を確定値として書く
  SupportPlan 列名を AssessmentSnapshot に流用して同一視
  Schema ID を SharePoint List name / 列名と同一視
```

## 4. read / write conversion（比較・未採択）

| ID | conversion 規則 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **RW-1** | 写像対象フィールドごとに read/write 変換規則を文書化。変換失敗は成功へ倒さない。変換は adapter 内（CV-1） | fail-closed と責務境界に整合 | 規則の粒度固定が必要 | |
| **RW-2** | write のみ定義し read は best-effort / 黙殺 | 書き込み優先で速い | 履歴・再読取で壊れる | |
| **RW-3** | Snapshot 全体を単一 opaque JSON 列へ格納 | 列設計が単純 | 列監査・部分取得・型安全が弱い；DEC-6 列変換の意味が空になる | |
| **RW-HOLD** | 未決定のまま | 遅延可 | adapter 実装誘惑が増える | |
| **RW-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
本軸で決めないもの:
  実 SharePoint Column Type のテナント確定値
  実デプロイ手順
```

## 5. missing / malformed column の fail-closed（比較・未採択）

| ID | missing / malformed 時 | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **MF-1** | 必須欠落・型不正・未知必須列は fail-closed。成功空結果や部分成功へ倒さない。adapter が FR-1 語彙へ写像（EM-1） | DEC-7 / FR-1 / EM-1 と整合 | 結果コードの詳細粒度は別固定になり得る | |
| **MF-2** | 欠落を default 合成して成功継続 | UX が滑らか | 監査・再現性破壊 | |
| **MF-3** | 不正列をスキップして残りを成功 | 部分データ salvage | 部分成功の黙殺 | |
| **MF-HOLD** | 未決定のまま | 遅延可 | unavailable 以外の失敗が不定 | |
| **MF-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
MUST NOT:
  missing / malformed を draft/finalize 成功として扱う
  変換失敗を VALIDATION_FAILED 以外へ雑に倒して業務欠陥と接続失敗を混同する
    （詳細写像は EM-1 側；本軸は成功へ倒さないこと）
  成功0件配列へ列失敗を隠す（DEC-7 先例）
```

## 6. version（schemaVersion / dtoVersion）の扱い（比較・未採択）

| ID | version 扱い | 意味 | 利点 | リスク |
|---|---|---|---|---|
| **VR-1** | persistence 上でも Accepted `1.0.0` / `1.0.0`（または明示 readable set）と照合。不一致は fail-closed。TypeScript/DTO へのコード割当は依然 HOLD | SemVer LOCKED と整合 | readable set 拡張は別 Decision | |
| **VR-2** | persistence で version を無視 | 移行が楽に見える | 破損・混在 schema を検出できない | |
| **VR-3** | 未知 version を自動 migrate して成功 | 前方互換が速い | 暗黙破壊的変換；Human Decision 欠落 | |
| **VR-HOLD** | 未決定のまま | 遅延可 | 読取経路の契約が不定 | |
| **VR-X** | Human 明示 | Human 指定 | 未記載なら採択不可 | |

```text
MUST NOT:
  本 packet で schemaVersion / dtoVersion 文字列自体を変更する
  コード割当（TypeScript フィールド追加）を本 Acceptance だけで開始する
```

## 7. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  Logical ↔ persistence:   LF-1
  Read/write conversion:    RW-1
  Missing/malformed:        MF-1
  Version handling:         VR-1

Rationale（比較用）:
  明示 mapping 表で推測埋めを避け、
  conversion と missing/malformed は adapter 内で fail-closed、
  version は Accepted 1.0.0 照合のままコード割当は HOLD。

This is NOT Human Acceptance evidence.
Human must explicitly Accept LF-* / RW-* / MF-* / VR-*（組み合わせ可）.
```

## 8. 判断単位の分離

| 決める / 決めない | 本 packet |
|---|---|
| logical ↔ persistence 対応形（LF-*） | **比較対象** |
| read/write conversion（RW-*） | **比較対象** |
| missing/malformed fail-closed（MF-*） | **比較対象** |
| version 扱い（VR-*） | **比較対象** |
| Site URL / List name / Internal Column Name 具体値 | OUT / NOT DECIDED |
| SharePoint / adapter コード実装 | OUT / DO NOT START |
| Schema / DTO コード割当 | OUT / HOLD |
| DEC-009 / SC-1 / FR-1 / SP-ADAPTER 境界 | OUT（LOCKED） |
| FindingCode / A-5 | OUT |
| post-retention deletion | OUT / AUTO-START FORBIDDEN |
| Implementation Start | HOLD |

## 9. Human Decision（未選択）

Human は次を明示する（未記載は NOT DECIDED）。

```text
Logical ↔ persistence:   LF-1 / LF-2 / LF-3 / LF-HOLD / LF-X:<text>
Read/write conversion:    RW-1 / RW-2 / RW-3 / RW-HOLD / RW-X:<text>
Missing/malformed:        MF-1 / MF-2 / MF-3 / MF-HOLD / MF-X:<text>
Version handling:         VR-1 / VR-2 / VR-3 / VR-HOLD / VR-X:<text>
```

```text
Until explicit Human Acceptance:
  Decision-AS-DEC6-MAPPING-1: OPEN / NOT ACCEPTED
  DEC-6 concrete mapping values: HOLD / NOT DECIDED
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
  treat this compare packet as Acceptance
  re-decide DEC-009 / APP-SAVE / SP-ADAPTER
  lock LF-* / RW-* / MF-* / VR-* by Agent recommendation alone
  invent Site URL / List name / Internal Column Name / tenant settings
  start SharePoint / adapter / application / DTO code
  assign schemaId / schemaVersion / dtoVersion into TypeScript
  reopen FindingCode / A-5
  auto-start post-retention deletion
  Deploy / change real SharePoint / Entra / M365
```

## 11. Next after Human Acceptance（将来）

```text
If Human Accepts LF-* + RW-* + MF-* + VR-*:
  → write Acceptance LOCKED doc（別手順）
  → still NOT auto Implementation Start
  → Site / List / Internal Name concrete values remain NOT DECIDED
     unless separately Accepted with evidence（推測埋め禁止）
  → SharePoint implementation remains DO NOT START
Else:
  → remain HOLD
```
