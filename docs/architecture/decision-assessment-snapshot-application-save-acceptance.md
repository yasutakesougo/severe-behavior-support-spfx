# Decision-AS-APP-SAVE-1 — application save Human Acceptance

この文書は、**Decision-AS-APP-SAVE-1**（AssessmentSnapshot application 層の
save candidate / 失敗結果境界）についての **Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-application-save-packet.md`](./decision-assessment-snapshot-application-save-packet.md)

Selected via:
[`decision-ilb-1-thirteenth-residual-application-save-selection.md`](./decision-ilb-1-thirteenth-residual-application-save-selection.md)

DEC-009（再 Decision しない）:
[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-APP-SAVE-1
Status: Accepted / LOCKED
Human Decision: SC-1 + FR-1
Human Acceptance: Explicit Human Decision on 2026-08-09

LOCKED:

Save candidate:
  SC-1 — validated AssessmentSnapshot
        + explicit intent（draft / finalize / correct-as-new-version）
Failure results:
  FR-1 — 判別可能な fail-closed 結果
  初期語彙（packet 記載の例を Accepted 初期集合とする）:
    VALIDATION_FAILED
    PERSISTENCE_UNAVAILABLE
    OVERWRITE_FORBIDDEN
    MALFORMED_INTENT

DEC-009:
  UNCHANGED / LOCKED（再 Decision しない）

Implementation Start:
  HOLD
TypeScript / application / adapter / tests:
  DO NOT START
Schema ID / schemaVersion / dtoVersion のコード割当:
  DO NOT START
Schema / DTO / SharePoint:
  HOLD
FindingCode:
  HOLD
A-5:
  HOLD
Post-retention deletion:
  OPEN / AUTO-START FORBIDDEN
Deploy / real data:
  NO-GO

Closes only:
  Decision-AS-APP-SAVE-1 save candidate + failure-result 境界
Does NOT close:
  application / persistence / SharePoint 実装
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
Human Decision: SC-1 + FR-1
Decision-AS-APP-SAVE-1: Accepted / LOCKED

Save candidate = SC-1
Failure results = FR-1
```

日本語正本:

```text
SC-1:
  application は domain validateAssessmentSnapshot が ok の
  AssessmentSnapshot と、明示 intent
  （draft / finalize / correct-as-new-version）のみを
  save candidate として受け取る。
FR-1:
  失敗は判別可能な fail-closed 結果で返し、成功へ倒さない。
  初期語彙:
    VALIDATION_FAILED
    PERSISTENCE_UNAVAILABLE
    OVERWRITE_FORBIDDEN
    MALFORMED_INTENT
```

```text
Agent recommendation（SC-1 + FR-1）: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-APP-SAVE-1: Accepted / LOCKED

Save candidate:
  validated AssessmentSnapshot + explicit intent
  intents: draft | finalize | correct-as-new-version

Failure results（fail-closed / discriminated）:
  VALIDATION_FAILED
  PERSISTENCE_UNAVAILABLE
  OVERWRITE_FORBIDDEN
  MALFORMED_INTENT

NOT SELECTED:
  SC-2 / SC-3 / SC-HOLD / SC-X
  FR-2 / FR-3 / FR-HOLD / FR-X
```

失敗時 MUST NOT（LOCKED）:

```text
validate 失敗を保存成功として扱う
persistence 失敗 / port 未実装を成功レスポンスや黙殺にする
finalized 上書き要求を成功に倒す / 旧版を消す
draft を formal finalized と同一表示する
domain 禁止 Result を application で迂回する
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-APP-SAVE-1 Accepted = Implementation Start
  Decision-AS-APP-SAVE-1 Accepted = application / adapter コード開始
  Decision-AS-APP-SAVE-1 Accepted = SharePoint / DTO 実装開始
  Decision-AS-APP-SAVE-1 Accepted = schemaId / schemaVersion コード割当
  Decision-AS-APP-SAVE-1 Accepted = FindingCode / A-5 再開
  Decision-AS-APP-SAVE-1 Accepted = post-retention 開始
  Decision-AS-APP-SAVE-1 Accepted = DEC-009 再定義
```

## Acceptance boundary

```text
This Acceptance locks save candidate + failure-result 境界 only.

MUST NOT start from this Acceptance alone:
  TypeScript / application / persistence port / adapter code
  Schema / DTO / SharePoint implementation
  Schema ID / schemaVersion / dtoVersion code assignment
  FindingCode / A-5
  post-retention deletion
  Implementation Start
  Deploy / real data
```

## Next

```text
Decision-AS-APP-SAVE-1: Accepted / LOCKED / SC-1 + FR-1
Implementation Start: HOLD
Schema / DTO / SharePoint / adapter: HOLD
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Next substantive unit: NOT SELECTED by this Acceptance
Ready: NOT RUN
Merge: NOT RUN
```
