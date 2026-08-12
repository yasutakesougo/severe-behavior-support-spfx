# DEMO-UX-9 — Daily record experience Selection（RPF-002）

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-9 — Daily record experience cleanup
Decision: Decision-DEMO-UX-9-DAILY-RECORD-EXPERIENCE-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-12）
Baseline main: aed5b05d16b8ae6c5733cbb2cf1163c502a70ee9
Predecessor: DEMO-UX-8 MERGED（PR #321 / merge aed5b05；tip fcd2d9c63696253e4d51aee5fdb8492174474dc4）
Source feedback: RPF-002
Follow-on queue（not this slice）: RPF-004 / RPF-005 / RPF-006（deferred）
Implementation Start: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
SharePoint write: NOT AUTHORIZED
```

## Authority

Human は DEMO-UX-8（RPF-003）Merge SUCCESS を確認し、予定どおり次 slice を **RPF-002 Selection** とすると判断した。

本 Selection は **RPF-002 のみ** を SELECTED / LOCKED とする。

```text
RPF-002 Implementation Start = NOT AUTHORIZED
Deploy / SharePoint write / #299 Close = NOT AUTHORIZED
```

大規模ビジュアルデザイン改善は本 slice では行わない。業務導線一周（未記録→記録画面→入力イメージ）を先に通す。

## Goal

責任者・現場職員が、合成デモ上で次を実操作で説明できる状態へ進める。

```text
未記録 / 未完了を見つける
  → 記録画面へ進む（既存 Overview A 導線を含む）
  → 未完了確認から対象を選ぶ
  → 記録入力イメージ（対象・文面）が更新される
  → 「書いて保存する完成形」ではなく「入力イメージまで通るデモ」として説明できる
```

無効フォーム中心で運用完成度を誤解させない。実保存は行わない。

## Selected scope（IN）

### RPF-002 — 記録画面の体験整理（実保存 HOLD）

Daily Records 画面で、次を presentation-only / synthetic として固定する。

#### 1. 未完了確認を導線の正面にする

| Element | Locked behavior |
|---|---|
| 未完了確認リスト | 選択可能（single-select） |
| 既定選択 | なし、または incomplete-a（Aさん / 未記録）を default としてよい |
| 選択効果 | 記録入力イメージの対象者・文面プレースホルダが選択対象に追随する |
| 件数アンカー | 現行 fixture の incompleteItems（A=未記録 / B=要確認）を不用意に増やさない |

未完了行の選択は **local presentation state** のみ。live directory / SharePoint lookup を呼ばない。

#### 2. 「閲覧サンプル」と「入力イメージ」を役割分離する

画面内の役割を次に固定する（大規模リデザインではなく、見出し・注記・順序・活性状態で区別する）。

| Region | Role | Locked presentation |
|---|---|---|
| 未完了確認 | 導線（選ぶ） | 選択可能；primary next step |
| 記録入力イメージ | 入力イメージ（書く想定） | 対象者表示 + 合成 draft 文面；local draft edit を許可してよい |
| 最近の記録 | 閲覧サンプル | 既存 recentRecords を閲覧専用のまま維持 |
| 作成する / 保存する | 実保存境界 | **disabled のまま**；実保存しないことを明示 |

#### 3. 入力イメージ（local draft）境界

```text
localDraftEditAuthorized = true（client-side only）
draftPersistence = none（画面離脱で破棄してよい）
saveMutationAuthorized = false
sharePointWriteAuthorized = false
createButton = disabled
saveButton = disabled
saveOutcomeUnknownNormalization = forbidden
```

local draft は「入力できる見た目」までを許可する。成功トースト・保存済みへの丸め・live I/O は禁止。

#### 4. 既存導線との接続

| Entry | Expected |
|---|---|
| Overview A「記録する」 | 既存どおり records へ遷移（DEMO-UX-7 維持） |
| 記録到達後 | 未完了確認が次アクションとして認識できる |
| Users list 未記録フィルタ | DEMO-UX-8 を壊さない（本 slice で必須接続はしない） |

#### 5. Copy / fail-closed

- 「作成・保存は接続されていません / live保存なし」系の明示を維持または強化する
- 入力イメージを「業務データへ保存済み」と誤認させない
- `access_denied` / `retrieval_failed` / `siteSelection=unselected` / `save_outcome_unknown` を正常状態へ丸めない

## Explicit OUT

```text
real save / create mutation = OUT
SharePoint write / binder / adapter live I/O = OUT
DailyActivityRecords reuse / schema mutation = OUT
live record list query = OUT
enabling Create/Save as real mutation = OUT
large visual redesign（color / spacing / cards / typography overhaul） = OUT
RPF-004 DEMO note consolidation = OUT
RPF-005 save-badge hierarchy = OUT
RPF-006 Overview↔review count mapping = OUT
Users detail-preview expansion = OUT
business-rule calculation changes = OUT
Production deploy = OUT
#299 Close = OUT
Implementation Start / Ready / Merge auto-advance = OUT
```

## Must preserve（non-negotiable）

- `access_denied`
- `retrieval_failed`
- `save_outcome_unknown`（成功/失敗へ丸めない）
- `siteSelection=unselected` stop
- DEMO / synthetic / no live SharePoint 明示
- DEMO-UX-7 A/B/C today-action navigation
- DEMO-UX-8 users list status filter
- DEMO-UX-7 terminology canon（要確認 / 期限接近 / 未記録）

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

次の Human gate は `DEMO-UX-9 Implementation Start GO`（＝ RPF-002 Implementation Start）。

## Evidence referenced

```text
flow feedback record:
  docs/architecture/responsible-person-demo-v1-flow-review-feedback-record.md
four-perspective review:
  /opt/cursor/artifacts/human-ui-review-screenshots/four-perspective-review.md
  RPF-002 requestedOutcome:
    閲覧サンプルと将来入力UIの役割分離、または未完了一覧起点の導線前面化
  ledger requestedOutcome:
    未記録選択→記録画面→入力イメージまで通す。実保存 HOLD
predecessor merge:
  PR #321 / merge aed5b05d16b8ae6c5733cbb2cf1163c502a70ee9
  expected tip fcd2d9c63696253e4d51aee5fdb8492174474dc4
current records surface:
  spfx/src/shell/records/DailyRecords.tsx
  spfx/src/shell/records/daily-record-fixture.ts
```
