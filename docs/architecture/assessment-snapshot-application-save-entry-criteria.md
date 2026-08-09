# AssessmentSnapshot application save — Entry Criteria / 実装境界（read-only）

この文書は、ILB-1 **Eleventh residual SELECTED / B — application save** について、
DEC-009 の業務意味を **application 保存・確定フロー**へ落とす前の
**Entry Criteria と実装境界**を read-only で整理する正本である。

```text
Kind: Entry Criteria / implementation-boundary record only
Status: READ-ONLY ORGANIZED / NOT ACCEPTED AS IMPLEMENTATION GO
Selection: decision-ilb-1-eleventh-residual-decision-selection.md
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
FindingCode: HOLD
A-5: HOLD
Schema ID: DO NOT START
SharePoint / adapter: DO NOT START
Deploy / real data: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 目的

```text
IN:
  application save 単位の前提・境界・Entry Criteria を列挙する
  DEC-009 意味と PR-J domain 契約の接続点を固定する
OUT:
  application コード実装
  SharePoint / DTO / Schema ID 採番
  FindingCode / A-5
  Implementation Start 宣言
```

## 2. 固定前提（DONE）

| 前提 | 状態 | 正本 |
|---|---|---|
| DEC-009 保存タイミング業務意味 | Accepted / LOCKED | [`assessment-snapshot-save-timing-contract.md`](./assessment-snapshot-save-timing-contract.md) |
| PR-J domain 完全契約 | MERGED（PR #168） | [`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md) |
| Result 変換（永続なし） | MERGED（PR #72） | [`assessment-snapshot-result-conversion.md`](./assessment-snapshot-result-conversion.md) |
| findingIds | NOT REQUIRED | [`assessment-snapshot-finding-ids-boundary.md`](./assessment-snapshot-finding-ids-boundary.md) |
| NOT_APPLICABLE reason enum | HOLD方針（埋め込まない） | [`assessment-snapshot-not-applicable-reason-hold.md`](./assessment-snapshot-not-applicable-reason-hold.md) |
| Schema / DTO versioning 方針 | DEC-1；固有 ID 未採番 | [`assessment-snapshot-schema-dto-versioning.md`](./assessment-snapshot-schema-dto-versioning.md) |
| GOV-AUD-03 訂正承認 | Option E / application 対象外 | [`decision-gov-aud-03-snapshot-correction-approver-acceptance.md`](./decision-gov-aud-03-snapshot-correction-approver-acceptance.md) |
| AS-EC-1 overall | MET / Accepted | [`decision-as-ec-1-overall-entry-acceptance.md`](./decision-as-ec-1-overall-entry-acceptance.md) |

## 3. DEC-009 → application 意味マップ（境界）

| DEC-009 意味 | application 境界上の操作概念 | domain 接続 |
|---|---|---|
| 作成途中 = 下書き | draft 保存（正式記録にしない） | `recordStatus: "draft"` + `validateAssessmentSnapshot` |
| 正式記録 = 確定時保存 | finalize（draft → finalized の正式保存） | `recordStatus: "finalized"` |
| 確定後修正 = 元保持 + 新版 | correct-as-new-version | 新 `snapshotId` + `supersedesSnapshotId` + finalized |
| 上書き NOT ADOPTED | 同一 `snapshotId` の finalized 上書き禁止 | domain が自己参照リンク拒否；application も上書き成功に倒さない |
| 履歴保持 | 旧版を消さない / 置換しない | 物理削除は OUT（post-retention 別） |

```text
MUST NOT equate:
  draft save = formal finalized record
  correct-as-new-version = overwrite finalized
  validateAssessmentSnapshot ok = persistence succeeded
```

## 4. 層境界

| 層 | application save 単位での位置づけ | 今 |
|---|---|---|
| domain | `validateAssessmentSnapshot` / Result 変換 | **UNCHANGED / 再利用** |
| application | 保存・確定・新版のオーケストレーション（失敗を成功に倒さない） | **境界整理のみ** |
| persistence port（抽象） | 保存成功/失敗を返す口（実装詳細は持たない） | **要: Entry 充足前に契約化 or 明示 HOLD** |
| adapter / SharePoint / DTO | 物理写像 | **OUT（remaining D）** |
| Schema ID | 固有採番 | **OUT（remaining C）** |

## 5. Entry Criteria 表

| # | 条件 | 現状 |
|---|---|---|
| 1 | DEC-009 業務意味が Accepted | **DONE** |
| 2 | PR-J domain `AssessmentSnapshot` / `validateAssessmentSnapshot` が main にある | **DONE**（PR #168） |
| 3 | Result 変換が main にあり UNCHANGED 前提 | **DONE** |
| 4 | GOV-AUD-03 が application 対象外として Accepted | **DONE**（Option E） |
| 5 | findingIds REQUIRED 化をしないことが固定 | **DONE**（Entry #5） |
| 6 | application save の実装境界（本表・IN/OUT）が正本化されている | **DONE（本文書）** |
| 7 | persistence port / fail-closed 保存結果契約が定義されている、または「抽象 port なしでは実装しない」と明示 HOLD | **HOLD / 未定義** |
| 8 | 合成 fixture / contract tests 計画（application 面）が存在する | **HOLD / 未作成** |
| 9 | 明示的 Human Implementation Start GO | **HOLD** |

```text
Application Save Entry Criteria: NOT MET
Reason: #7 / #8 / #9 remain HOLD
本文書の存在（#6）だけでは Implementation Start しない
```

## 6. 実装境界（GO 後でも維持する OUT）

```text
IN（将来 Implementation Start 時の想定範囲）:
  application オーケストレーション（draft / finalize / correct-as-new-version）
  domain validator 呼び出し
  抽象 persistence port への委譲（定義済みの場合）
  fail-closed（保存失敗を成功表示しない）
  合成 fixture / contract tests（application 面）

OUT / HOLD（本単位でも・GO 後も混在禁止）:
  SharePoint List 書込 / DTO / DEC-6
  AssessmentSnapshot 固有 Schema ID 採番
  FindingCode 値発明 / A-5
  訂正承認ロール Binding（GOV-AUD-03 Option E）
  findingIds REQUIRED 化
  サービス別 NOT_APPLICABLE enum 埋め込み
  post-retention 物理削除
  Deploy / real data / Entra / M365
  PR-J domain 契約の再定義
```

## 7. 失敗時境界（設計固定・実装しない）

| 状況 | application がやってはいけないこと |
|---|---|
| `validateAssessmentSnapshot` 失敗 | 保存成功として扱う |
| persistence 失敗 / 未実装 port | 成功レスポンスや黙殺 |
| finalized 上書き要求 | 成功に倒す / 旧版消去 |
| draft を formal と同一視 | UI・API で確定済みと表示 |
| INDETERMINATE / SOURCE_UNAVAILABLE を Result へ倒す | domain 禁止を application で迂回 |

## 8. Remaining residual との分離

| Residual | 関係 |
|---|---|
| **B application save（本単位）** | application オーケストレーション境界 |
| **C Schema ID** | 固有 Schema 採番。本 Entry の必須前提にしない |
| **D SharePoint / adapter** | 物理永続。本 Entry の必須前提にしない（抽象 port 経由まで） |
| **A post-retention** | 経過後削除。本単位と混ぜない |

## 9. Explicit non-actions

```text
Do NOT:
  Accept Implementation Start from this document alone
  Start src/application/** or persistence adapter code
  Invent Schema ID / FindingCode / reason enum
  Require SharePoint for Entry #1〜#6 DONE 判定
  Auto-select C / D / A
```

## 10. Next

```text
Application Save Entry Criteria: NOT MET（#7/#8/#9 HOLD）
Implementation Start: HOLD
Recommended next Human steps（自動開始禁止）:
  1. persistence port / fail-closed 保存結果契約を正本化する（Entry #7）
  2. application 面の fixture / contract tests 計画を正本化する（Entry #8）
  3. 明示 Implementation Start GO（Entry #9）— 別判断
Remaining recommended order after this track: C → D → A
```
