# Decision-ILB-1 — Thirteenth residual Decision selection: application save

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 9514128ee32322337126e2aadf532390f60a0552
Decision kind: residual substantive-unit selection only
Selected: A — application save
Status: SELECTED / CONSUMED（Decision-AS-APP-SAVE-1 Accepted / LOCKED）
Human Selection: Explicit A on 2026-08-09
```

## Selected scope

```text
Thirteenth residual Decision:
  SELECTED — A / application save

Meaning:
  次に扱う substantive unit を AssessmentSnapshot application save
  の判断単位とする。
  本記録は選定のみであり、具体設計・実装を決めない。
  （境界は後続 Decision-AS-APP-SAVE-1 で Accepted）
```

## Explicit non-authorization（selection 時点 / 実装は継続 HOLD）

```text
Implementation Start: HOLD
Schema ID / schemaVersion / dtoVersion code assignment: HOLD / NOT STARTED
Schema / DTO / SharePoint / adapter: HOLD
FindingCode: HOLD
A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Deploy / real data: NO-GO
```

本 Selection から Implementation Start を導出しない。
DEC-009（保存タイミング業務意味）は再 Decision しない。

## Prior state preserved

- DEC-009 Accepted / LOCKED（下書き WIP・確定時保存・元保持＋新版・上書き NOT ADOPTED・履歴保持）
- PR-J domain complete contract on main（PR #168）
- Decision-AS-SCHEMA-ID-1 Accepted / LOCKED
- Decision-AS-SCHEMA-VERSION-1 Accepted / LOCKED（1.0.0 / 1.0.0）
- Schema / DTO / SharePoint code assignment remains NOT STARTED
- FindingCode / A-5 remain HOLD

## Next gate

```text
Selection CONSUMED → Decision-AS-APP-SAVE-1 Accepted / LOCKED
  decision-assessment-snapshot-application-save-acceptance.md
  Save candidate = SC-1
  Failure results = FR-1

Still HOLD:
  Implementation Start
  application / adapter / SharePoint / DTO code
  Schema ID / schemaVersion / dtoVersion code assignment
  FindingCode / A-5
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```
