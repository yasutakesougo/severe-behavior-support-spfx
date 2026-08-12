# Issue #4 — Entra Readiness Acceptance Packet（Decision B Candidate）

この文書は、Issue **#4** Entra / test-group **readiness model** に対する
Human Decision パケットである。

Readiness SoT:
[`issue-4-entra-test-group-readiness-packet.md`](./issue-4-entra-test-group-readiness-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-4-ENTRA-READINESS-1
Kind: docs-only readiness Acceptance packet
Status: CANDIDATE / NOT YET ACCEPTED
Human Decision: NOT YET GRANTED
Issue #4: OPEN / KEEP OPEN
Entra mutation: NOT AUTHORIZED
SharePoint mutation: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
Baseline tip: 8b8aa6d523070bfe6e7a952fee631c472a2df7c4
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Why this packet now

| Input | State |
|---|---|
| #21-A / #21-B | COMPLETE / MERGED（synthetic auth contracts） |
| #4 Deploy / App Catalog | CONFIRMED PASS / VERIFIED |
| #4 Entra test groups | still incomplete |
| DEC-014 | PROPOSED only → names UNKNOWN |
| Next live prerequisite | controlled Entra test-environment mutation needs a readiness packet |

## What Decision B may accept

```text
test-group readiness model structure
A/B separation intent
test-account matrix IDs T-A-01 … T-ORG-01
minimum first mutation IN/OUT shape
rollback categories
verification checklist
dependency / consumer mapping to #21 / #22 / #23
UNKNOWN / HOLD remaining for names and role-scope map
```

## What Decision B must NOT authorize

```text
Entra mutation = NOT AUTHORIZED
SharePoint mutation = NOT AUTHORIZED
Deploy = NOT AUTHORIZED
Microsoft Graph mutation = NOT AUTHORIZED
group create / delete = NOT AUTHORIZED
membership add / remove = NOT AUTHORIZED
Conditional Access change = NOT AUTHORIZED
production account changes = NOT AUTHORIZED
Issue #4 Close = NOT AUTHORIZED
DEC-014 Acceptance by implication = NOT AUTHORIZED
Decision C Mutation GO = NOT AUTHORIZED
```

## Proposed Human Decision text（Decision 2）

Human may paste / authorize exactly:

```text
Human Decision 2 — #4 ENTRA READINESS ACCEPT

I ACCEPT the Issue #4 Entra / test-group readiness model recorded in:
  docs/architecture/issue-4-entra-test-group-readiness-packet.md
  docs/architecture/decision-issue-4-entra-readiness-selection.md

Meaning:
  the readiness packet is the SoT for later Mutation GO preparation
  SITE-ISG / SITE-HOM remain the only site identities for this work
  group names that are UNKNOWN remain UNKNOWN
  role → group scope maps that are HOLD remain HOLD
  DEC-014（or equivalent）is still required before any group creation

Explicitly NOT authorized by this Decision:
  Entra mutation = NOT AUTHORIZED
  SharePoint mutation = NOT AUTHORIZED
  Deploy = NOT AUTHORIZED
  Microsoft Graph mutation = NOT AUTHORIZED
  Conditional Access change = NOT AUTHORIZED
  production / real staff membership changes = NOT AUTHORIZED
  Issue #4 Close = NOT AUTHORIZED
  Decision C Entra Mutation GO = NOT AUTHORIZED
```

HOLD alternative:

```text
Human Decision 2 — #4 ENTRA READINESS HOLD

Do not accept the readiness model yet.
Keep packet as CANDIDATE.
No Entra / SharePoint / Deploy authorization is granted.
```

## Prerequisite gap for Decision C（not requested now）

```text
Before Entra Mutation GO:
  Decision B ACCEPT
  DEC-014 Accepted names + role scope map
  exact mutation inventory with no UNKNOWN names
  exact synthetic test account list
  rollback + verification plans bound to that inventory
  explicit Human Mutation GO text
```

## Findings at packet freeze

```text
P0: 0
P1:
  I4-P1-1 OPEN — DEC-014 not Accepted
  I4-P1-2 OPEN — role scope map HOLD
P2:
  I4-P2-1 OPEN — stale /sites/sbs-* markers in Issue bodies
  I4-P2-2 OPEN — Conditional Access UNKNOWN
  I4-P2-3 OPEN — #30 procedure docs HOLD
```

## Next

```text
1. Human Decision 2: #4 ENTRA READINESS ACCEPT / HOLD
2. If ACCEPT: keep mutation = 0 until Decision C
3. Separate Human work: DEC-014 naming Decision
4. Do NOT collapse Decision B and Decision C
```
