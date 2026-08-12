# Issue #4 — Entra Readiness Human Acceptance

This document records the explicit Human Decision accepting the **Issue #4 Entra / test-group readiness model** only.

Depends on:
- [`decision-issue-4-entra-readiness-selection.md`](./decision-issue-4-entra-readiness-selection.md)
- [`issue-4-entra-test-group-readiness-packet.md`](./issue-4-entra-test-group-readiness-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-4-ENTRA-READINESS-1
Human Decision date: 2026-08-12
Human Decision: #4 ENTRA READINESS ACCEPT
Candidate baseline / PR #296 original HEAD: a660c80c23cc245006972342bbf6318f0fbcc78b
Status in this branch: ACCEPTED / PENDING MERGE TO MAIN
Issue #4: OPEN / KEEP OPEN
Entra mutation: NOT AUTHORIZED
SharePoint mutation: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
Decision C Entra Mutation GO: NOT AUTHORIZED
```

## Accepted Decision

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

## Remaining blockers before Decision C

```text
DEC-014 Accepted naming + role-scope map
exact group names with no UNKNOWN
exact test account identities
exact mutation inventory
rollback + verification bound to that inventory
separate explicit Human Entra Mutation GO
```

## Non-claims

```text
Readiness ACCEPT ≠ group creation
Readiness ACCEPT ≠ membership mutation
Readiness ACCEPT ≠ Graph mutation
Readiness ACCEPT ≠ SharePoint ACL mutation
Readiness ACCEPT ≠ Deploy
Readiness ACCEPT ≠ Issue #4 Close
```
