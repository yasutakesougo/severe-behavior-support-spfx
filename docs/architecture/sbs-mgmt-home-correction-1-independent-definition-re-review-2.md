# SBS-MGMT-HOME-CORRECTION-1 — Independent Definition Re-Review-2

exact-file に基づく Independent Definition Re-Review-2 の記録。
Definition review を REVIEW-CLEARED とする。Re-Simulation / Actual Staff / Implementation は消費しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1
kind: independent definition re-review-2
date: 2026-09-11
branch: cursor/sbs-mgmt-home-5-persona-sim-c53a
tip at review: 38c5439eef3cac999eb477ab287970198d9b536e
verdict: PASS / REVIEW-CLEARED
P0 = 0
P1 = 0
P2 = 1 / EXPLICIT NON-BLOCKING ONLY
mutation: 0
Implementation Start: NOT AUTHORIZED
Human Definition / Scope Lock GO: ELIGIBLE / NOT RECEIVED
Actual Staff Value Check: NOT CONSUMED
Human Ready / Promotion: NOT IMPLIED
SIM-AUTH-001 product Issue: NOT CREATED
LIVE WRITE: HOLD
```

## Exact review basis

```text
Definition Start
  docs/architecture/sbs-mgmt-home-correction-1-definition-start-1.md
  SHA = 92ce437c6c843576aea49376b8971abdf873b3f5

Definition Correction-1
  docs/architecture/sbs-mgmt-home-correction-1-definition-correction-1.md
  SHA = debd3992dee917eecd1dbae86f137a781b764a8b

Correction Scope Definition
  docs/architecture/sbs-mgmt-home-correction-1-scope-definition-1.md
  SHA = 685b343b174ada3b911e79a6d794aaaa5cce8d22

Simulation 2 / primary evidence
  docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md
  SHA = 656936ec101644d1dda8ba2c9275312e16d7588a
```

Verified against committed blobs on `cursor/sbs-mgmt-home-5-persona-sim-c53a` @ `38c5439`.

## Checks

| Check | Result | Note |
|---|---|---|
| C1–C6 ingested | PASS | Correction-1 and Scope DRAFT hold the same boundaries |
| Simulation 2 finding map preserved | PASS | P0=1 / P1=7 / P2=3 not rewritten |
| Gate order | PASS | Re-Review → Human Lock → separate Implementation Start |
| Review-1 P1-1 Re-Simulation Gate | CLOSED | PASS = P0 0 / P1 0 / Persona meaning / P2 explicit non-blocking |
| Review-1 P1-2 reviewDueDate | CLOSED | raw/technical/caller-supplied out; #442 / #554 due kept |
| Review-1 P1-3 status sources | CLOSED | 未実施 / 未記録 / 未保存 fail-closed; MH does not infer |
| Review-1 P1-4 population | CLOSED | UserId vs occurrenceId; UNAVAILABLE ≠ 0 |
| Review-1 P2-1 navigation | CLOSED | in-app / existing host only |
| Review-1 P2-2 Draft wording | CLOSED | 未適用 is primary; exact copy not frozen before Lock |

```text
Definition Re-Review PASS
!= Re-Simulation PASS
!= Actual Staff PASS
```

## Findings

| ID | Severity | Status | Content |
|---|---|---|---|
| RR2-P2-1 | P2 | OPEN / NON-BLOCKING | `today_targets` is still an independent synthetic card with `count: 12` in `spfx/src/shell/dashboard/overview-fixture.ts`. Definition already forbids independent hardcoded 12 as 確定人数, new aggregation, and new data sources. Implementation Scope (after Implementation Start GO) must prove a UserId subset from existing sources or fail-closed (`確認できません`). Do not reuse 12 as 人数. |

```text
P0 = 0
P1 = 0
P2 = 1 / EXPLICIT NON-BLOCKING ONLY
```

This P2 is not a Definition Lock blocker.

## Primary evidence integrity

Simulation 2 remains:

```text
Simulation Outcome = CORRECTION
P0 = 1
P1 = 7
P2 = 3
```

Re-Review PASS does not rewrite that packet.

## Gate status

```text
Definition Start GO = CONSUMED
Independent Definition Review-1 = CORRECTION REQUIRED / CONSUMED（content-level）
Definition Correction-1 = APPLIED TO DRAFT
exact-file re-read = PASS
Independent Definition Re-Review-2 = PASS / REVIEW-CLEARED
Human Definition / Scope Lock GO = ELIGIBLE / NOT RECEIVED
Implementation Start GO = HOLD / NOT RECEIVED
Implementation = NOT STARTED
Authenticated 5-Persona Re-Simulation = NOT RUN
Actual Staff Value Check = NOT CONSUMED
Human Ready / Promotion = NOT IMPLIED
SIM-AUTH-001 product Issue = NOT CREATED
LIVE WRITE = HOLD
```

## Does NOT authorize

```text
Human Definition / Scope Lock（未受領）
Implementation Start
SPFx / domain code change
Home.aspx edit / SharePoint / M365 / Entra mutation
Ready / Merge / Deploy / LIVE WRITE
Actual Staff Value Check
```

## NEXT

```text
SBS-MGMT-HOME-CORRECTION-1
Human Definition / Scope Lock GO / HOLD

Human Definition / Scope Lock GO
  != Implementation Start GO

Lock 後も、別の明示的な Human Implementation Start GO までは
コード変更を開始しない。
```
