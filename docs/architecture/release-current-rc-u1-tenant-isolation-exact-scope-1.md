# RELEASE-CURRENT-RC-U1-TENANT-ISOLATION-EXACT-SCOPE-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
kind: read-only Exact Scope Definition
mode: READ-ONLY DEFINITION
base: main@145dcb349f80590b91a7267caf79fdc1587064a5
expectedMainSha: 145dcb349f80590b91a7267caf79fdc1587064a5
status: READY FOR INDEPENDENT DEFINITION REVIEW
```

This document defines the U1 evidence boundary only. It authorizes no
tenant access, implementation work, permission change, or production action.

## 1. Current Release State

```text
U1: UNVERIFIED / P0
U2: ENVIRONMENT BLOCKED / UNVERIFIED / P0
U3: CONFIRMED / CLOSED for the exact target SHA
Release Readiness: HOLD
Implementation start: NOT AUTHORIZED
Tenant evidence execution: NOT AUTHORIZED by this definition
Deploy / Production Binding / LIVE WRITE: NOT AUTHORIZED
```

## 2. Purpose and Boundary

U1 is runtime evidence for live `OrganizationId` / `SiteId` isolation. The
evidence must use an authenticated existing read path and establish:

```text
authorized organization + selected site + valid membership -> permitted read
cross-site / non-member / no-selected-site context -> denied / fail closed
```

Source review, fixture smoke, presentation-role changes, and Deep Scan results
are not substitutes for live authorization evidence.

## 3. Exact-SHA Provenance

Every later evidence packet must record:

```text
expectedMainSha
observedMainSha
shaMatch
```

The expected SHA is fixed to:

```text
145dcb349f80590b91a7267caf79fdc1587064a5
```

If `shaMatch` is not `true`, the evidence is invalid, U1 remains
`UNVERIFIED`, and Release Readiness remains `HOLD`. Silent retargeting is not
permitted.

## 4. Required Evidence Cases

The following cases are the minimum later evidence scope:

| Case | Runtime context | Expected result |
| --- | --- | --- |
| U1-C1 | Authorized organization, selected site, valid membership | Permitted read |
| U1-C2 | Site A identity/context requests a Site B resource | Denied / fail closed |
| U1-C3 | No `SelectedSiteId` | Denied / fail closed |
| U1-C4 | Selected site exists but membership is absent | Denied / fail closed |
| U1-C5 | `OrganizationId` does not match | Denied / fail closed |
| U1-C6 | Fixture or presentation role is switched without live authorization context | Invalid as live authorization evidence |

For U1-C2 through U1-C5, the packet must show an authorization-boundary
denial, not merely the absence of returned data.

## 5. Evidence Packet Requirements

```text
unitId
expectedMainSha
observedMainSha
shaMatch
execution environment
authenticated tenant identity category
OrganizationId under test
SiteId under test
SelectedSiteId
case ID
expected outcome
observed outcome
PASS / FAIL
request boundary
response/status/result classification
console/network notes
explicit exclusions
Human GO reference
timestamp
```

Only identifiers and necessary classifications may be recorded. Do not record
tokens, cookies, authorization headers, session secrets, passwords, support
record contents, or unnecessary PII.

## 6. Environment Preconditions

Evidence execution requires all of the following to already be available:

```text
authenticated tenant read access: AVAILABLE / CONFIRMED
test identities and memberships: AVAILABLE / CONFIRMED
Site A / Site B evidence topology: AVAILABLE / CONFIRMED
no tenant write required: CONFIRMED
no permission expansion required: CONFIRMED
```

If any prerequisite is missing, classify U1 as `ENVIRONMENT / EVIDENCE
BLOCKED`, keep it `UNVERIFIED`, keep Release Readiness at `HOLD`, and stop.
Do not add Entra, Graph, SharePoint, or site permissions to establish the
prerequisites.

## 7. Later Allowed Activity

Only a separate Human `U1 Tenant Isolation Evidence GO` may authorize:

```text
authenticated live tenant READ
the predefined U1-C1 through U1-C6 cases only
existing identities, memberships, and permissions only
network/result observation
evidence recording
```

## 8. Forbidden Activity

```text
SharePoint list/item create, update, or delete
schema mutation
site creation
permission mutation
user/group membership mutation
Entra / Graph permission grant
App Catalog mutation
Production Binding activation
LIVE WRITE
Deploy
source/config fixes
repository mutation beyond this docs-only publication
Issue mutation
PR Ready / Merge
```

If evidence setup requires permission mutation, stop and leave U1 blocked.

## 9. Production Binding Separation

```text
U1 PASS != Production Binding GO
Production Binding != U1 PASS
```

Existing live read paths may be observed only within the separately authorized
evidence scope. If proof requires activating Production Binding, U1 is
`BLOCKED / UNVERIFIED`; this definition does not authorize Binding.

## 10. Acceptance Criteria

```text
U1-AC1  This definition authorizes no tenant access or mutation.
U1-AC2  Exact-SHA mismatch invalidates evidence.
U1-AC3  Source review cannot substitute for live evidence.
U1-AC4  Fixture/synthetic smoke cannot substitute for live evidence.
U1-AC5  Cross-site access fails closed.
U1-AC6  Missing SelectedSiteId fails closed.
U1-AC7  Missing membership fails closed.
U1-AC8  Organization mismatch fails closed.
U1-AC9  Evidence collection does not expand permissions.
U1-AC10 Tokens, secrets, and unnecessary PII are not recorded.
U1-AC11 U1 PASS does not authorize Binding, Deploy, or LIVE WRITE.
U1-AC12 Unavailable read topology leaves U1 BLOCKED / UNVERIFIED.
U1-AC13 U1 evidence affects U1 only.
U1-AC14 U2 remains ENVIRONMENT BLOCKED / UNVERIFIED independently.
```

## 11. Gate Transition

```text
NOW: read-only definition publication
NEXT: Independent Definition Review on this exact published HEAD
AFTER REVIEW PASS: separate Human U1 Tenant Isolation Evidence GO candidate
EVIDENCE GO: NOT GRANTED by this definition
CURRENT ACTION: STOP after docs-only publication
```
