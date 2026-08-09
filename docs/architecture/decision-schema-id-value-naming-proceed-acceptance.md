# AssessmentSnapshot Schema ID — value / naming Decision proceed acceptance

```text
repository: yasutakesougo/severe-behavior-support-spfx
Human Decision: A
Decision meaning: proceed to Schema ID value / naming Decision
Status: ACCEPTED / PROCEED TO DECISION ONLY
Implementation Start: HOLD
Schema ID assignment: HOLD / NOT STARTED
Schema ID concrete value: NOT DECIDED
Schema ID naming rule: NOT DECIDED
Schema ID value invention: FORBIDDEN until the next explicit Human Decision
Schema / DTO / SharePoint / adapter implementation: HOLD / DO NOT START
FindingCode / A-5: HOLD
Deploy / real data: NO-GO
```

## Meaning of Human A

Human A authorizes only the next Decision step: define and compare concrete options for the AssessmentSnapshot Schema ID value and naming rule.

It does **not** authorize:

- assigning any concrete Schema ID;
- accepting any naming pattern;
- selecting an initial schemaVersion / dtoVersion value;
- modifying TypeScript types, validators, fixtures, or tests;
- implementing DTO / SharePoint / adapter / application save;
- restarting FindingCode or A-5.

## Existing policy preserved

- Schema ID is a stable identifier.
- Schema ID is not the SharePoint List name and not the TypeScript type name.
- Schema Version follows SemVer.
- DTO Version equals Schema Version.
- AssessmentSnapshot-specific Schema ID remains unassigned until a separate explicit Human Decision.

## Next gate

Prepare a read-only value / naming Decision packet with concrete candidate patterns and trade-offs. No candidate becomes accepted merely by appearing in that packet.
