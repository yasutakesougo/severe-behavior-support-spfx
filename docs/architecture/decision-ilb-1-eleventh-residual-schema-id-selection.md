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
- AssessmentSnapshot-specific Schema ID remains unassigned.
- SharePoint / DTO / application save remain separate units.

## Next gate

```text
Next action:
  Schema ID Decision packet / read-only boundary clarification

Not allowed from this document alone:
  assigning any concrete Schema ID
  creating schemaVersion / dtoVersion values
  modifying TypeScript types or validators
  SharePoint column mapping
  adapter implementation
```
