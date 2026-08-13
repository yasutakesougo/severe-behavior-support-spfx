## 目的

FIELD-WORKFLOW-1 assessment（PR #345）および契約 Issue A（#347）/ Issue B（#352）完了後に残る

**PRESENTATION GAP / FLOW GAP**

のうち、**現場向け支援手順確認 → ProcedureRecord 記録 → Review 材料** の UI を、A/B 契約を正本として実装するための Issue とする。

対象 FW: **FW-01 / FW-02 / FW-03 / FW-07 / FW-08 / FW-09**

本Issueは起票・設計境界の固定から開始する。**起票時点では Implementation Start・Deploy・SharePoint write・#68/#69/#299/#347/#352 Close は含まない。**

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
assessment: docs/architecture/field-workflow-1-assessment.md
Issue A: #347
  A2 SELECTED / LOCKED
  SupportPlanVersionProcedureBinding MERGED（PR #350）
  Schema: severe-behavior-support.support-plan.version-procedure-binding @ 1.0.0
Issue B: #352
  Decision-FIELD-WORKFLOW-CONTRACT-B-PKG-1 = SELECTED / LOCKED
  ProcedureRecord MERGED（PR #354）
  Schema: severe-behavior-support.procedure-record.record @ 1.0.0
observed main (post-#354 tip at filing): 7c8880acccbecb4171c13dcbbe9454c3df13f505
FIELD-WORKFLOW-1 remaining: PRESENTATION / FLOW GAP for field UI path
Target PR (when Human GO): field-workflow-ui
```

## Why this Issue next（and why not #68 / #69）

契約 A/B で固定・実装済み:

```text
planId + planVersion ↔ ProcedureId + ProcedureVersion
ProcedureRecord + result 3値 + performedAt/recordedAt + FW-05
```

未充足（FIELD-WORKFLOW success criteria）:

```text
現在の支援手順を現場用に即時確認できる（FW-01）
「この手順を記録」で context 再選択なし（FW-02）
result 選択中心の入力（FW-03）
Review → 元 ProcedureRecord → plan/version 追跡（FW-07）
~390px / keyboard-only field flow（FW-08）
save_failed 入力保持 / save_outcome_unknown 即時再送禁止（FW-09）
```

既存 UI Issue との分離:

| Issue | 中心 | 本 Issue C との関係 |
|---|---|---|
| #68 field-ui | 利用者 → 時間順支援手順閲覧 → ABC/観察へ | **related only**（閲覧中心。ProcedureRecord 記録フローではない） |
| #69 recording-ui | ABC・観察記録の保存 | **related only**（別業務契約。支援手順記録ではない） |
| **本 Issue C** | 利用者 → 現在の支援手順 → ProcedureRecord 記録 → Review | **正本 UI Issue** |

#68 / #69 を auto-close しない。本Issueの完了でそれらを閉じない。

## Upstream prerequisites（must already be true）

1. A2 SELECTED / LOCKED — 手順本文は presentation projection（契約へ昇格しない）。
2. `SupportPlanVersionProcedureBinding` が存在する。
3. `ProcedureRecord` 契約・validator・FW-05 helpers が MERGED（PR #354）。
4. result 3値は正当な事実記録であり、職員失敗 status ではない。
5. `performedAt` / `recordedAt` / Tokyo `LocalDate` 意味が LOCKED。
6. historical lookup 不成立時は fail-closed（v3 fallback 禁止）。
7. DADS App Shell IA / save 5-state / INV-07 / INV-10 / INV-17 を壊さない。

## 担当範囲（Issue C only）

### Fixed scope（設計境界確定済み）

- 利用者 → 現在の支援手順 → 「この手順を記録」
- ProcedureRecord の plan / version / procedure context を再選択なしで引き継ぐ
- result 3値を中心とした入力（作文中心にしない）
- `PERFORMED_WITH_ADAPTATION` / `NOT_PERFORMED` を失敗扱い・赤失敗ステータス化しない
- v2 記録を v3 Active に付け替えない（FW-05）
- historical lookup 不成立時は fail-closed（最新版 fallback 禁止）
- `performedAt` / `recordedAt` / Tokyo `LocalDate` を維持
- Review → 元 ProcedureRecord → plan/version を追跡（自動で「変更すべき」判定しない）
- 約 390px・keyboard-only の field flow
- `save_failed` 時の入力保持
- `save_outcome_unknown` 時の即時再送禁止
- DADS IA、save 5-state、INV-07 / INV-10 / INV-17 を維持

### In scope after Human Implementation Start GO

- 現場向け支援手順 summary presentation（A2 projection: 場面→実施→避ける→補足）
- 「この手順を記録」CTA と context handoff
- ProcedureRecord 入力 UI（result 中心）
- Review materials drill-down（記録 → plan/version）
- ~390px field-flow smoke / keyboard-only 主要操作
- save 5-state を ProcedureRecord 保存経路へ配線（synthetic / authorized path only）
- synthetic fixture graph での Users → 手順 → 記録 → Review 一連確認

### Explicit OUT of scope

```text
ProcedureRecord / SupportPlanVersionProcedureBinding 契約の再設計（A/B 正本）
手順本文の契約昇格（A1）— A2 維持
ABC / Observation 入力・保存の本格実装（#69 正本）
#68 の時間順支援手順閲覧全体の置き換え
live SharePoint list/column mutation / adapter production write
Deploy / App Catalog / production write
#68 / #69 / #299 / #347 / #352 Close（auto-close 禁止）
生活介護個別支援計画ほか FIELD-WORKFLOW-1 out-of-scope 領域
```

## 正本境界

```text
本Issue（UI Issue C）:
FIELD-WORKFLOW presentation / flow（FW-01/02/03/07/08/09）

#347 / Issue A:
SupportPlanVersionProcedureBinding（契約正本）

#352 / Issue B:
ProcedureRecord + result + clocks + FW-05（契約正本）

#68 field-ui:
利用者・支援手順閲覧（related only / do not auto-close）

#69 recording-ui:
ABC・観察保存（related only / do not auto-close）

#28 spfx-shell:
DADS IA / save 5-state / fail-closed chrome（壊さない）
```

## Dependencies

```text
Upstream:
- PR #345 assessment（MERGED）
- #347 Issue A + A2 + PR #350（MERGED）
- #352 Issue B + B-PKG-1 + PR #354（MERGED）
- main tip: 7c8880acccbecb4171c13dcbbe9454c3df13f505

Blocks:
- FIELD-WORKFLOW UI Implementation Start（別途 Human GO）
- FW-01/02/03/07/08/09 success criteria の UI 完了

Related (do not auto-close):
- #68 field-ui
- #69 recording-ui
- #347 Contract Issue A
- #352 Contract Issue B
- #299（参照のみ。本Issueで reopen/close しない）
```

## 必須成果（実装 GO 前でも固定するもの）

- [x] A/B 契約を UI 正本として固定（本 Issue body）
- [x] #68 / #69 は related only / auto-close 禁止を明示
- [x] FW-01/02/03/07/08/09 の担当範囲を固定
- [x] save 5-state / fail-closed / INV-07/10/17 / DADS IA 維持を固定
- [x] SharePoint / Deploy / production write = NO-GO を固定
- [ ] Implementation Start は別途 Human GO まで HOLD

## 実装開始条件（Human GO）

```text
Implementation Start: NO-GO until explicit Human GO on this Issue
SharePoint / M365 / Entra / Deploy / real data: NO-GO
#68 / #69 / #299 / #347 / #352 Close: NO-GO（auto-close 禁止）
Ready / Merge of implementation PR: HUMAN-ONLY
```

## 完了条件（この Issue 自体・段階的）

### Filing / design stage

- [x] 本 Issue が GitHub に存在する（#356 OPEN）
- [x] A/B 正本参照と FW 範囲が文書化されている
- [x] #68 / #69 related-only / auto-close 禁止が明記されている
- [x] Implementation / Deploy / SharePoint に踏み込んでいない

### Implementation stage（別 Human GO 後）

- [ ] Users → 現在の支援手順 → 「この手順を記録」→ result 入力 → save が一連で動く（synthetic）
- [ ] context 再選択なし / FW-05 付け替えなし / historical fail-closed
- [ ] Review → ProcedureRecord → plan/version 追跡
- [ ] ~390px + keyboard-only 主要操作
- [ ] save_failed 入力保持 / save_outcome_unknown 即時再送禁止
- [ ] DADS IA / 5-state / INV-07/10/17 維持

## 現在判定

```text
Filing: COMPLETE（#356 OPEN）
Design source: FIELD-WORKFLOW-1 assessment + A/B LOCKED contracts
Design boundary: FIXED
Implementation: HOLD / NO-GO
Tests executed: 0（Issue C）
Production: NO-GO
SharePoint write: NO-GO
Next: Human 「Issue #356 FIELD-WORKFLOW UI Implementation Start GO」（別途・未受領）
```

## 禁止

- A/B 契約を UI 都合で再定義すること
- `PERFORMED_WITH_ADAPTATION` / `NOT_PERFORMED` を失敗扱いすること
- v2 記録を v3 Active へ付け替えること
- historical lookup 失敗時に最新版 fallback すること
- #68 / #69 / #299 / #347 / #352 を auto-close すること
- Deploy / SharePoint write / App Catalog / production write
- 起票のみの段階で Implementation を開始すること
