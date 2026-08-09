# AssessmentSnapshot Schema ID — value / naming Decision proceed acceptance

```text
repository: yasutakesougo/severe-behavior-support-spfx
Human Decision: A
Decision meaning: proceed to Schema ID value / naming Decision
Status: ACCEPTED / CONSUMED（proceed gate closed）
Implementation Start: HOLD
Schema ID assignment into code / DTO / SharePoint: HOLD / NOT STARTED
Schema ID concrete value: Accepted via Decision-AS-SCHEMA-ID-1
Schema ID naming rule: Accepted via Decision-AS-SCHEMA-ID-1（NR-1）
schemaVersion / dtoVersion: HOLD / NOT DECIDED（SV-HOLD）
Schema / DTO / SharePoint / adapter implementation: HOLD / DO NOT START
FindingCode / A-5: HOLD
Deploy / real data: NO-GO
```

## Meaning of Human A

Human A authorized only the next Decision step: define and compare concrete options for the AssessmentSnapshot Schema ID value and naming rule.

That proceed gate is now **CONSUMED** by Decision-AS-SCHEMA-ID-1 Acceptance.

## Existing policy preserved

- Schema ID is a stable identifier.
- Schema ID is not the SharePoint List name and not the TypeScript type name.
- Schema Version follows SemVer.
- DTO Version equals Schema Version.
- schemaVersion / dtoVersion remain HOLD until a separate explicit Human Decision.
- TypeScript / DTO / SharePoint / application save remain NOT STARTED from this proceed alone.

## Next gate

```text
Compare packet（CONSUMED）:
  decision-assessment-snapshot-schema-id-value-naming-packet.md

Acceptance LOCKED 正本:
  decision-assessment-snapshot-schema-id-value-naming-acceptance.md

Decision-AS-SCHEMA-ID-1:
  Naming rule = NR-1 / Accepted
  Schema ID = severe-behavior-support.assessment-snapshot.snapshot / Accepted
  schemaVersion = HOLD / NOT DECIDED

Implementation Start: HOLD
Ready: NOT RUN
Merge: NOT RUN
```
