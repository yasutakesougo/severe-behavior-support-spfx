# Next gate — Pilot List names（historical；CONSUMED）

この文書は、**Decision-AS-PILOT-LIST-OWNERSHIP-1** 後に
PILOT LIST NAMES を次 gate として固定した **historical next-gate** である。

List names Acceptance 正本:
[`decision-assessment-snapshot-pilot-list-names-acceptance.md`](./decision-assessment-snapshot-pilot-list-names-acceptance.md)

Active next after names Acceptance:
[`decision-assessment-snapshot-pilot-provision-exec-next-gate.md`](./decision-assessment-snapshot-pilot-provision-exec-next-gate.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Next-gate definition（docs-only / historical）
Status: CONSUMED
  Decision-AS-PILOT-LIST-NAMES-1 = Accepted / LOCKED / LN-1 + XB-1

Was next gate:
  PILOT LIST NAMES

Now:
  List A = SupportPlans（INTENDED）
  List B = AssessmentSnapshots（INTENDED）
  Active next = EXPLICIT SITE/LIST CREATION EXECUTION
  Execution GO = NOT GIVEN / NO-GO
```

## Current state

```text
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
LOCKED INTENDED:
  SupportPlans
  AssessmentSnapshots
Active next gate:
  EXPLICIT SITE/LIST CREATION EXECUTION
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
Execution GO: NOT GIVEN / NO-GO
Site / List creation: NO-GO
auto-start: FORBIDDEN
```
