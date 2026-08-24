# RELEASE-CURRENT-RC Exact Scope Definition — 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: RELEASE-CURRENT-RC-EXACT-SCOPE-DEFINITION-1
Kind: read-only Exact Scope Definition
MODE: READ-ONLY DEFINITION
BASE: main@145dcb349f80590b91a7267caf79fdc1587064a5
  Merge pull request #502 (VP-7 optical alignment)
Code / SCSS / TSX mutation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Deep Scan execution: NOT AUTHORIZED
Deploy / SharePoint / Graph / Entra / Production Binding / LIVE WRITE: FORBIDDEN
NEXT: Independent Definition Review
Agent: STOP on Deep Scan / tenant access / Ready / Merge / Issue mutation
```

## 0. Purpose and priority / execution split

This Definition fixes the **exact boundaries** for clearing the three
current-main Release blockers recorded as UNVERIFIED / RELEASE-GAP.

```text
Importance (Release Readiness):
  U1 / U2 / U3 = P0 Release blockers

Next executable work (this unit):
  Exact Scope Definition only = P1 process gate

Priority ≠ execution order
Do not start Deep Scan, tenant isolation evidence, or artifact rebuild
from this Definition alone.
```

VP-7 is **EXCLUDED / CONSUMED** (merged via PR #502 into this BASE).
Visual-polish residuals are out of this unit.

## 1. Inventory pin (CURRENT-MAIN RESIDUAL PRIORITIZATION-1)

```text
Inventory: COMPLETE
VP-7: EXCLUDED / CONSUMED
Release Readiness: HOLD
Primary blockers: U1 / U2 / U3

PR #491:
  supporting release-gate automation
  does NOT clear U1 / U2 / U3 by itself

PR #489:
  separate governance residual
  OUT of this Definition

PR #481:
  SUPERSEDE / CLOSE CANDIDATE
  no mutation authorized by this Definition

#448:
  KEEP OPEN
  remaining product / production residuals are separate
  no Issue mutation authorized
```

## 2. Exact BASE authority

```text
Definition BASE (authoritative for this unit):
  145dcb349f80590b91a7267caf79fdc1587064a5

Historical Deep Scan authority (NOT this BASE):
  8a5056c5a93fc6d3de1989d3160c9e3cf9d8aacb
  SECURITY-DEEP-SCAN-CURRENT-SHA-2
  COMPLETE / NO VERIFIED BLOCKERS
  does NOT cover main@145dcb3…

Historical artifact authority (NOT this BASE):
  SPFX-RELEASE-ARTIFACT-AUTHORITY-1 and later closeouts on earlier SHAs
  do NOT automatically transfer to this BASE
```

```text
Do NOT claim:
  "8a5056c Deep Scan covers 145dcb3"
  "prior .sppkg hash covers 145dcb3"
  "PR #491 GATE 0 automation clears U1 / U2 / U3"
  "Definition PASS = Deep Scan GO"
  "Definition PASS = Production Binding GO"
```

## 3. U1 — tenant-isolation evidence boundary

### 3.1 What U1 is

```text
U1:
  Live tenant OrganizationId / SiteId isolation
  Importance: P0 Release blocker
  Current status on this BASE: UNVERIFIED
```

U1 requires runtime evidence that the live tenant path enforces
OrganizationId / SiteId (site) isolation fail-closed, consistent with
`contracts-v1.md` Authorization / SiteContext and SECURITY.md trust
boundaries.

### 3.2 IN (evidence that may clear U1 later)

After a **separate Human GO**, evidence collection for U1 may include:

1. Exact BASE SHA pin equal to runner-confirmed `main` or the scan/evidence target SHA.
2. Site A vs Site B membership / SelectedSiteId cases that prove cross-site access is denied.
3. Fail-closed behavior when site is unselected or membership is absent.
4. Evidence Packet that records:
   - expectedMainSha / observedMainSha
   - OrganizationId / SiteId under test (non-PII identifiers only)
   - pass / fail matrix for isolation cases
   - console / network boundary notes without tokens / cookies / secrets
5. Explicit statement that fixture-only / synthetic presentation paths are
   **not** substitutes for live tenant isolation evidence.

### 3.3 OUT (cannot clear U1)

```text
contracts / adapter source review alone
synthetic fixture smoke alone
presentationRole switching alone
PR #491 GATE 0 automation alone
historical LIVE WRITE GO packets on other SHAs
Deep Scan COMPLETE alone
```

### 3.4 Environment prerequisites (U1)

```text
Human-authorized live tenant read path
Explicit U1 Evidence GO (separate from this Definition)
No App Catalog mutation
No SharePoint write / schema change
No Entra / Graph permission expansion
No Production Binding activation
No token / Cookie / Secret / personal data recorded in Evidence
```

## 4. U2 — exact-current-main Deep Scan boundary

### 4.1 What U2 is

```text
U2:
  Exact-SHA Deep Security Scan of the current application tree
  Importance: P0 Release blocker
  Current status on this BASE: UNVERIFIED / NOT EXECUTED for 145dcb3…
```

U2 requires a repository-wide Deep Scan whose **scan-target SHA equals**
the exact current-main (or the explicitly pinned application tree SHA
identical to that main for security-relevant paths).

### 4.2 IN (scope of a later Deep Scan, not authorized here)

When Human grants **exact-current-main Deep Scan GO** after this
Definition PASS:

```text
Kind: repository-wide Deep Scan of the pinned scan-target SHA
Mode: read-only
Scan target: must equal BASE main@145dcb3… at GO time,
  or a Human-reconfirmed later main SHA re-pinned by a new Definition /
  GO packet — do not silently retarget
Fixes during scan: NONE
Issues opened during scan: NONE (unless separate Human GO)
SharePoint / Graph / M365 / Entra / App Catalog mutation: NONE
Production mutation: NONE
candidate ≠ verified ≠ fix authorization ≠ Production Binding GO
```

Finding handling remains SECURITY.md rules:

```text
verified requires: reachable + attacker/boundary input + invariant breach + evidence
unverified candidate: do not mass-Issue / auto-fix / production GO
```

### 4.3 OUT

```text
security-diff-scan of a PR as substitute for repository-wide Deep Scan
npm audit alone as substitute for Deep Scan
reusing SECURITY-DEEP-SCAN-CURRENT-SHA-2 (8a5056c…) for 145dcb3…
Deep Scan during this Definition PR
Deep Scan without Human exact-current-main Deep Scan GO
mixing Deep Scan into SECURITY-PREP or unrelated PRs
```

### 4.4 Environment prerequisites (U2)

```text
Independent Definition Review: PASS for this unit
Human exact-current-main Deep Scan GO: GRANTED (separate)
Pinned scan-target SHA recorded before start
Read-only repository access sufficient for scan
No Deploy / Binding / LIVE WRITE / tenant mutation in the same GO
```

## 5. U3 — exact artifact / hash authority boundary

### 5.1 What U3 is

```text
U3:
  Current-basis artifact / hash authority for the exact BASE
  Importance: P0 Release blocker
  Current status on this BASE: UNVERIFIED for 145dcb3…
```

U3 requires that a production `.sppkg` identity (path, byte length,
SHA-256) be attributable to the exact BASE (or an explicitly identical
application tree), without claiming App Catalog object equivalence unless
separately evidenced.

### 5.2 IN (evidence that may clear U3 later)

After a **separate Human Artifact Authority / build GO**:

1. Exact BASE SHA pin.
2. Local production Heft package build from that pin.
3. Recorded package path, byte length, SHA-256.
4. Explicit note: local hash ≠ proven catalog object hash unless catalog
   evidence is separately collected.
5. `.sppkg` remains gitignored / not committed unless a separate Decision
   authorizes otherwise (default: NOT committed).

### 5.3 Relationship to PR #491

```text
PR #491 (SPFX-RELEASE-GATE-HARDENING-2-AUTOMATION-1):
  Automates deterministic, tenant-independent GATE 0 inspection subset
  Can record package-solution fields + local .sppkg length/SHA-256
  Emits machine-readable gate0 evidence JSON

Complement:
  PR #491 MAY support U3 evidence recording AFTER an artifact exists
  PR #491 does NOT:
    - clear U1
    - clear U2
    - authorize artifact build
    - authorize Deploy / Binding / LIVE WRITE
    - convert PASS_AUTOMATED_SUBSET into full GATE 0 acceptance
```

```text
Deployment Scope != Data Access Scope != API Permission Scope
package deployed != API permission granted
PASS_AUTOMATED_SUBSET != GATE 0 full acceptance
PR #491 PASS != U1/U2/U3 PASS
```

### 5.4 OUT

```text
claiming historical BUILD 1 / catalog 1.0.0.1 hash covers 145dcb3…
committing .sppkg into git by default
App Catalog upload as part of U3 evidence
treating GATE 0 automation as Deep Scan
treating local hash as catalog object proof without catalog evidence
```

### 5.5 Environment prerequisites (U3)

```text
Human Artifact Authority / build GO (separate)
Node / SPFx toolchain capable of production package
Exact BASE checkout
Optional: PR #491 automation available for deterministic inspection
No App Catalog mutation
No Production Binding
```

## 6. Required Evidence provenance (all U*)

Every later Evidence Packet for U1 / U2 / U3 MUST record:

| Field | Requirement |
|---|---|
| unit id | `RELEASE-CURRENT-RC-…` or successor gate id |
| expectedMainSha | pinned SHA |
| observedMainSha | runner-confirmed SHA |
| shaMatch | must be true or Evidence is invalid |
| mode | read-only vs authorized mutation (default read-only) |
| GO reference | Human GO id / date / scope |
| exclusions | what was NOT tested |
| privacy | no tokens / cookies / secrets / personal data |
| result vocabulary | CONFIRMED / UNVERIFIED / HOLD — never inflate |

```text
INTENDED != CONFIRMED
UNKNOWN → HOLD for Release Readiness
older closeout docs alone != CONFIRMED on this BASE
```

## 7. Fail-closed Acceptance Criteria

| ID | Criterion |
|---|---|
| RC-AC1 | This Definition does not authorize Deep Scan, tenant access expansion, Deploy, Binding, or LIVE WRITE |
| RC-AC2 | U1 / U2 / U3 remain P0 Release blockers until each has CONFIRMED Evidence on this BASE (or a Human-reconfirmed successor SHA) |
| RC-AC3 | Historical Deep Scan `8a5056c…` is NOT reused as U2 PASS for `145dcb3…` |
| RC-AC4 | PR #491 is complementary automation only; it cannot alone clear U1 / U2 / U3 |
| RC-AC5 | PR #489 remains a separate governance residual (OUT) |
| RC-AC6 | PR #481 is SUPERSEDE / CLOSE CANDIDATE only; this Definition authorizes no Issue/PR mutation |
| RC-AC7 | #448 remains KEEP OPEN; product / production residuals stay separate |
| RC-AC8 | VP-7 is EXCLUDED / CONSUMED and not reopened here |
| RC-AC9 | Definition Review PASS enables only Independent readiness for Human Deep Scan GO — not the GO itself |
| RC-AC10 | Any Evidence Packet with sha mismatch is invalid and must not clear a blocker |

## 8. Explicit OUT / FORBIDDEN (this unit)

```text
Deep Scan execution
tenant mutation / access expansion
Production Binding
Deploy / App Catalog mutation
LIVE WRITE
SharePoint schema / list write
Entra / Graph permission grant
PR Ready / Merge (Human-only; not granted here)
Issue mutation / close (#448 / #481 / others)
code / SCSS / TSX / JS implementation
reopening VP-7
converting candidate findings to verified without evidence
mass Issue creation from unverified findings
```

## 9. Changed-area authority (this Definition PR only)

If published as a docs PR, the allowed changed-area is:

```text
docs/architecture/release-current-rc-exact-scope-definition-1.md
```

No other paths. No scripts. No SPFx. No CI workflow edits in this unit.

## 10. Definition Review checklist

Independent Definition Review judges only:

1. BASE pin is exact and current (`145dcb3…` or explicitly superseded).
2. U1 / U2 / U3 boundaries are separable and fail-closed.
3. Priority (P0 blockers) vs execution order (Definition first) is unambiguous.
4. PR #491 complement is correct and non-substituting.
5. Environment prerequisites do not smuggle mutation authority.
6. Acceptance criteria block false PASS / false GO conversion.
7. FORBIDDEN list matches Human boundaries (Ready / Merge / Deploy / Binding / LIVE WRITE / Issue mutation).

## 11. NEXT gates

```text
NOW:
  Independent Definition Review for this Exact Scope Definition

AFTER Definition Review PASS ONLY:
  Human exact-current-main Deep Scan GO  (U2 path)
  — still does not clear U1 or U3 by itself

NOT YET / SEPARATE GOs:
  U1 Evidence GO (live tenant isolation)
  U3 Artifact Authority / build GO
  any Deploy / Production Binding / LIVE WRITE GO

Release Readiness:
  HOLD until U1 / U2 / U3 are CONFIRMED on the exact BASE
```

## 12. STOP

```text
This document is READ-ONLY DEFINITION only.
Do not execute Deep Scan from this document.
Do not expand tenant access from this document.
Do not build or upload .sppkg from this document.
Do not Ready / Merge / close Issues from this document.
Do not claim Release Readiness PASS.
Agent: STOP after Definition publication / Definition Review handoff.
```
