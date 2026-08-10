# Decision-ILB-1 — MAP-AS-010 Column Contract selection

この文書は、AssessmentSnapshots column path の次 substantive unit として
**Decision-AS-MAP010-COLUMN-1** を選ぶ Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_MAP010_COLUMN_CONTRACT_SELECTION
Status: SELECTED / CONSUMED
Selected unit: MAP-AS-010 supersedesSnapshotId Column Contract Decision
Follow-up Decision / Packet ID: Decision-AS-MAP010-COLUMN-1
  packet: decision-assessment-snapshot-map010-column-packet.md
  acceptance: decision-assessment-snapshot-map010-column-acceptance.md
  contract: assessment-snapshot-map010-column-contract.md
  IR: decision-assessment-snapshot-map010-column-independent-review.md
  Status: Accepted / LOCKED
        / N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1

Baseline main:
  6124127ad306848ac890a673cc8b5c0dd4c57710

Human Selection:
  MAP-AS-010 Column Contract Decision — SELECT
  Explicit Human Decision on 2026-08-10

Human Acceptance:
  Explicit Human Decision on 2026-08-10
  PR: #209
```

## Locked basis（再 Decision しない）

```text
Decision-AS-CV-EXTENSION-1: Accepted / LOCKED
  / M-1-A + X-1-B + X-2-A + X-3-B + X-4-B + X-5-B + XB-1
MAP-AS-010 disposition: PERSISTED（X-2-A）
MAP-AS-010 column contract: ACCEPTED / LOCKED（MAP010-COLUMN-1）
MAP-AS-010 column-ready: NO
MAP-AS-009: EXPLICITLY OUT
ENV-001〜003: DERIVED
Decision-AS-CONVERSION-1: Accepted / LOCKED（MAP-AS-001〜008 only）
Decision-AS-COLUMN-NAMES-1: Accepted / LOCKED（CV-REQ 001〜008 only）
DEC-009 / APP-SAVE correct-as-new-version: LOCKED
mapping-complete: NOT YET
adapter / Implementation Start: HOLD
```

## Selection meaning

```text
SELECTED / CONSUMED:
  Decision-AS-MAP010-COLUMN-1
  Status = Accepted / LOCKED
  Purpose = Internal Name / Display Name / Column Type /
            optional persistence / Read / Write conversion / failure behavior
            for MAP-AS-010 PERSISTED slot

This Selection / Acceptance does NOT authorize:
  SharePoint column create
  VR-1 execution
  mapping-complete PASS
  adapter / Implementation Start
  Deploy
```

## Options considered

| ID | unit | 結果 |
|---|---|---|
| **A** | MAP-AS-010 Column Contract Decision | **SELECTED / CONSUMED** |
| B | Immediate Human column create without contract | NOT SELECTABLE |
| C | mapping-complete determination now | NOT SELECTED（010 not column-ready） |
| HOLD | NO UNIQUE NEXT UNIT | NOT SELECTED |

## Explicit OUT

```text
SharePoint column create / mutation（this Acceptance）
MAP-AS-009 re-open
ENV re-open
adapter / DTO / schema wiring
mapping-complete PASS
Issue mutation
Deploy / real data
```

## Next

```text
Selection: SELECTED / CONSUMED
Decision-AS-MAP010-COLUMN-1: Accepted / LOCKED
  / N-1-A + N-2-A + T-1-A + O-1-A + R-1-A + W-1-A + XB-1
MAP-AS-010 column contract: ACCEPTED / LOCKED
MAP-AS-010 column-ready: NO
Physical column: NOT PRESENT
VR-1: NOT RUN
mapping-complete: NOT YET
Next gate: HUMAN READY DECISION FOR PR #209
Still HOLD / FORBIDDEN:
  SharePoint create / VR-1
  Implementation Start / adapter
  mapping-complete PASS
  Deploy / real data
```
