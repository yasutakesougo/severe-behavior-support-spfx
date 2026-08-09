# Decision-ILB-1 — Thirteenth residual Decision selection: application save

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 9514128ee32322337126e2aadf532390f60a0552
Decision kind: residual substantive-unit selection only
Selected: A — application save
Status: SELECTED / NOT IMPLEMENTATION START
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
```

## Explicit non-authorization

```text
Application save concrete design: HOLD / NOT DECIDED
Implementation Start: HOLD
Schema ID / schemaVersion / dtoVersion code assignment: HOLD / NOT STARTED
Schema / DTO / SharePoint / adapter: HOLD
FindingCode: HOLD
A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Deploy / real data: NO-GO
```

本 Selection から Implementation Start を導出しない。
本 Selection から application save 具体設計を導出しない。
DEC-009（保存タイミング業務意味）は再 Decision しない。

## Prior state preserved

- DEC-009 Accepted / LOCKED（下書き WIP・確定時保存・元保持＋新版・上書き NOT ADOPTED・履歴保持）
- PR-J domain complete contract on main（PR #168）
- Decision-AS-SCHEMA-ID-1 Accepted / LOCKED
  `severe-behavior-support.assessment-snapshot.snapshot`
- Decision-AS-SCHEMA-VERSION-1 Accepted / LOCKED
  `schemaVersion` / `dtoVersion` = `1.0.0` / `1.0.0`
- Schema / DTO / SharePoint code assignment remains NOT STARTED
- FindingCode / A-5 remain HOLD

## Next gate

```text
Next action:
  application save read-only Decision packet / compare
  → decision-assessment-snapshot-application-save-packet.md
  Focus:
    application 層が何を save candidate として受け取るか
    どの失敗結果を返すかの境界
  Do NOT re-decide DEC-009

Not allowed from this document alone:
  adopting concrete save API / port shapes as Accepted
  modifying TypeScript / application / adapter code
  Schema / DTO / SharePoint implementation
  FindingCode / A-5
  post-retention deletion
  Implementation Start
```
