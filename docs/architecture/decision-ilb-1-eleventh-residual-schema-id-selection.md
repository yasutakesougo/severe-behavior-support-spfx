# Decision-ILB-1 — Eleventh residual Decision selection: AssessmentSnapshot Schema ID

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 08a6bde22883ea800a7b892695fed5759db07020
Decision kind: residual substantive-unit selection only
Selected: C — AssessmentSnapshot Schema ID
Status: SELECTED / NOT IMPLEMENTATION START
Human Selection: Explicit C on 2026-08-09
```

## Selected scope

```text
Eleventh residual Decision:
  SELECTED — C / AssessmentSnapshot Schema ID

Meaning:
  次に扱う substantive unit を AssessmentSnapshot Schema ID の判断単位とする。
  本記録は選定のみであり、Schema ID の値・命名・採番規則・実装を決めない。
```

## Explicit non-authorization

```text
Schema ID assignment: HOLD / NOT STARTED
Schema ID value invention: FORBIDDEN
Schema / DTO implementation: DO NOT START
SharePoint / adapter: HOLD
FindingCode: HOLD
A-5: HOLD
Application save implementation: HOLD
Deploy / real data: NO-GO
```

本 Selection から Implementation Start を導出しない。

## Prior state preserved

- PR-J domain complete contract is already implemented on main.
- `findingIds` remains OPTIONAL.
- AssessmentSnapshot Schema ID string is now Accepted via Decision-AS-SCHEMA-ID-1
  (`severe-behavior-support.assessment-snapshot.snapshot`).
- schemaVersion / dtoVersion remain HOLD / NOT DECIDED.
- SharePoint / DTO / application save remain separate units.

## Next gate

```text
Selection CONSUMED → Decision-AS-SCHEMA-ID-1 Accepted / LOCKED
  decision-assessment-snapshot-schema-id-value-naming-acceptance.md

Still HOLD:
  schemaVersion / dtoVersion
  Schema / DTO / SharePoint / adapter / application save
  Implementation Start
  FindingCode / A-5
```
