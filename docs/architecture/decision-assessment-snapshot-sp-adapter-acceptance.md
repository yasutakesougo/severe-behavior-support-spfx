# Decision-AS-SP-ADAPTER-1 — SharePoint / adapter boundary Human Acceptance

この文書は、**Decision-AS-SP-ADAPTER-1**（AssessmentSnapshot application save
contract と SharePoint persistence adapter の責務境界）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-sp-adapter-packet.md`](./decision-assessment-snapshot-sp-adapter-packet.md)

Selected via:
[`decision-ilb-1-fourteenth-residual-sharepoint-adapter-selection.md`](./decision-ilb-1-fourteenth-residual-sharepoint-adapter-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-application-save-acceptance.md`](./decision-assessment-snapshot-application-save-acceptance.md)
[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-SP-ADAPTER-1
Status: Accepted / LOCKED
Human Decision: PB-1 + EM-1 + CV-1 + D6-1 + UP-1
Human Acceptance: Explicit Human Decision on 2026-08-09

LOCKED:

Port I/O boundary:
  PB-1 — port 入力 = SC-1 語彙（validated AssessmentSnapshot + intent）
         port 出力 = FR-1 語彙
         application は SharePoint 形を見ない

Error mapping:
  EM-1 — adapter が SharePoint 固有エラーを FR-1 へ写像
         application は FR-1 のみ扱う

Conversion location:
  CV-1 — read/write conversion は adapter 内
         application / domain は論理語彙のみ

DEC-6 relation:
  D6-1 — 本 Decision は責務境界のみ
         DEC-6 具体列変換は別 Entry / 別 Human GO
         DEC-6 concrete mapping = NOT DECIDED（UNCHANGED）

Persistence unavailable:
  UP-1 — adapter / port 不能時は FR-1 PERSISTENCE_UNAVAILABLE
         （または同等の判別可能失敗）。成功へ倒さない

DEC-009 / Decision-AS-APP-SAVE-1（SC-1 + FR-1）:
  UNCHANGED / LOCKED（再 Decision しない）

Implementation Start:
  HOLD
SharePoint implementation:
  DO NOT START
DEC-6 concrete mapping:
  NOT DECIDED
TypeScript / application / adapter / tests:
  DO NOT START
Schema ID / schemaVersion / dtoVersion のコード割当:
  DO NOT START
Schema / DTO:
  HOLD
Site URL / List name / Internal Column Name / tenant:
  NOT DECIDED / NO-GO
FindingCode:
  HOLD
A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN
Deploy / real data:
  NO-GO

Closes only:
  Decision-AS-SP-ADAPTER-1 application ↔ SharePoint adapter 責務境界
Does NOT close:
  SharePoint / adapter / application 実装
  DEC-6 具体列写像
  Site / List / Internal Name / tenant 設定
  Schema / DTO コード割当
  FindingCode / A-5
  Implementation Start
  post-retention deletion
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: PB-1 + EM-1 + CV-1 + D6-1 + UP-1
Decision-AS-SP-ADAPTER-1: Accepted / LOCKED

Port I/O                 = PB-1
Error mapping            = EM-1
Conversion location      = CV-1
DEC-6 relation           = D6-1
Persistence unavailable  = UP-1
```

日本語正本:

```text
PB-1:
  persistence port の入力は SC-1 語彙
  （validated AssessmentSnapshot + explicit intent）のみ。
  出力は FR-1 語彙のみ。application は SharePoint 形を扱わない。
EM-1:
  SharePoint 固有エラーの FR-1 への写像は adapter 責務。
  application は FR-1 のみを解釈する。
CV-1:
  read / write conversion は adapter 内に閉じる。
  application / domain は論理語彙のみを扱う。
D6-1:
  本 Acceptance は責務境界のみを閉じる。
  DEC-6 具体列写像は Accepted にしない（NOT DECIDED 維持）。
UP-1:
  persistence unavailable は FR-1 PERSISTENCE_UNAVAILABLE
  （または同等の判別可能失敗）で fail-closed し、成功へ倒さない。
```

```text
Agent recommendation（PB-1 + EM-1 + CV-1 + D6-1 + UP-1）:
  NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-SP-ADAPTER-1: Accepted / LOCKED

Port I/O:                 PB-1
Error mapping:            EM-1
Conversion location:      CV-1
DEC-6 relation:           D6-1
Persistence unavailable:  UP-1

NOT SELECTED:
  PB-2 / PB-3 / PB-HOLD / PB-X
  EM-2 / EM-3 / EM-HOLD / EM-X
  CV-2 / CV-3 / CV-HOLD / CV-X
  D6-2 / D6-HOLD / D6-X
  UP-2 / UP-3 / UP-HOLD / UP-X
```

失敗時 MUST NOT（LOCKED）:

```text
SharePoint タイムアウト / 権限不足 / 接続失敗を保存成功へ倒す
部分書き込み成功を全体成功として返す
未実装 port を成功レスポンスや黙殺にする
persistence unavailable を draft/finalize 成功として扱う
接続失敗を VALIDATION_FAILED に誤写像して業務データ欠陥へ見せる
application / domain に SharePoint 列名・REST / PnP 依存を持ち込む
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-SP-ADAPTER-1 Accepted = Implementation Start
  Decision-AS-SP-ADAPTER-1 Accepted = SharePoint / adapter コード開始
  Decision-AS-SP-ADAPTER-1 Accepted = DEC-6 concrete mapping Accepted
  Decision-AS-SP-ADAPTER-1 Accepted = Site URL / List / Internal Name 確定
  Decision-AS-SP-ADAPTER-1 Accepted = Schema / DTO コード割当
  Decision-AS-SP-ADAPTER-1 Accepted = FindingCode / A-5 再開
  Decision-AS-SP-ADAPTER-1 Accepted = post-retention 開始
  Decision-AS-SP-ADAPTER-1 Accepted = DEC-009 / SC-1 / FR-1 再定義
```

## Acceptance boundary

```text
This Acceptance locks application ↔ SharePoint adapter 責務境界 only.

MUST NOT start from this Acceptance alone:
  TypeScript / application / persistence port / adapter code
  SharePoint List / column / tenant changes
  DEC-6 concrete mapping
  Schema / DTO implementation
  Schema ID / schemaVersion / dtoVersion code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Next

```text
Decision-AS-SP-ADAPTER-1: Accepted / LOCKED / PB-1 + EM-1 + CV-1 + D6-1 + UP-1
Independent Review: PASS（decision-assessment-snapshot-sp-adapter-independent-review.md）
  P0=0 / P1=0 / P2=0
Implementation Start: HOLD
SharePoint implementation: DO NOT START
DEC-6 concrete mapping: NOT DECIDED
Schema / DTO: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Next substantive unit: NOT SELECTED by this Acceptance
```

Live gate（Ready / Merge）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。
本 Acceptance 時点の Human 待ち（PR / Issue 側）:

```text
Status: READY_FOR_HUMAN_READY_DECISION
Ready: NOT RUN
Merge: NOT RUN
```
