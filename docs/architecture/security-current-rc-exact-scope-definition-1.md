# CURRENT-RC SECURITY EXACT-SCOPE DEFINITION-1

この文書は、current Product RC に対する Security Definition と、後続の
exact-SHA Deep Scan の対象境界を固定するための **docs-only definition** である。
この文書自体は Deep Scan の実行結果、Security Definition PASS、Deep Scan Start GO、
Artifact Authority、Deploy authorization を意味しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: CURRENT-RC SECURITY EXACT-SCOPE DEFINITION-1
Kind: docs-only scope definition
Product RC:
  7944cea0fad20783f178ec613080283b98b5cca5
  origin/main at definition authoring
RR-2 Definition:
  PASS / LOCKED
  focused review authority:
    5536b7402ab13ba0f52c2a6521da5e91670f9637
Definition status:
  RECORDED / AWAITING INDEPENDENT REVIEW
Deep Scan Start GO:
  NOT GRANTED
Deep Scan:
  NOT AUTHORIZED / NOT STARTED
Artifact build/hash:
  NOT AUTHORIZED / NOT STARTED
Deploy:
  NOT AUTHORIZED
External mutation:
  NONE
```

## 1. Authority identity separation

The following identities remain independent and must not be collapsed:

```text
Product RC / code basis:
  7944cea0fad20783f178ec613080283b98b5cca5

RR-2 focused Definition review authority:
  5536b7402ab13ba0f52c2a6521da5e91670f9637

This Security Exact-Scope Definition:
  this definition document revision

Future Deep Scan result authority:
  not established until a separate Human Deep Scan Start GO and
  exact-RC scan execution are completed
```

```text
Product RC != RR-2 Definition review revision
Product RC != this scope-definition document revision
Scope definition != Deep Scan execution
Deep Scan result != Artifact Authority
Artifact Authority != Production Binding or Deploy GO
```

## 2. In-scope target

The later exact-RC security review is defined as a repository-wide, read-only
review of the tracked repository tree at Product RC `7944cea…`.

```text
In scope:
  - all tracked source and test paths at 7944cea…
  - application and security-relevant configuration
  - root and SPFx dependency manifests and lockfiles
  - adapters, contracts, authorization, persistence, and runtime boundaries
  - default runtime reachability
  - any other tracked runtime path reachable from an application host or
    relevant to a security boundary
```

The review must determine reachability rather than treating a path as safe
only because it is a fixture, demo, or helper. Synthetic, display-only,
fixture-only, and test-only paths may be classified as non-production-reachable
when evidence supports that classification; they are not silently removed from
the repository-wide review.

## 3. Explicit exclusions and boundaries

The following are outside the authority of this definition and must not be
introduced into the scan target by local workspace state:

```text
Out of scan authority:
  - untracked local drafts
  - generated local smoke CSS or other untracked generated files
  - workbench.sqlite3 or other local databases
  - local WIP not present in Product RC 7944cea…
  - tokens, cookies, secrets, personal data, or production data

Out of this gate:
  - SharePoint / Graph / M365 / Entra reads or writes
  - App Catalog mutation
  - Production Binding
  - LIVE WRITE enablement
  - .sppkg build or artifact hashing
  - source fixes, dependency upgrades, or npm audit fix
  - Issue creation or finding mutation
  - Deploy or production acceptance
```

The exclusions above are scope and safety boundaries. They are not evidence
that an excluded local artifact is secure or that a missing runtime proof is
verified.

## 4. Security control basis

The later review uses the existing security authority and does not invent new
policy. The review must assess, as applicable to each reachable path:

| Control | Required question |
|---|---|
| Fail-closed authorization | Does unknown, missing, or unauthorized context fail closed? |
| Unauthorized write prevention | Can a caller reach persistent write, update, or delete without the required Human authorization boundary? |
| Organization / Site boundary | Can input or execution cross the intended organization or site boundary? |
| Secret and privacy safety | Are tokens, cookies, secrets, or personal data recorded, returned, or persisted improperly? |
| Mutation authorization | Is an external mutation gated by the explicit authorization required by the existing Decision and permission matrix? |

Primary references are `SECURITY.md`, `docs/development/quality-gates.md`,
`docs/decisions/DEC-AI-ORG-003.md`, and `.agents/mcp/permission-matrix.md`.
Existing Accepted / LOCKED Decisions remain authoritative.

## 5. Finding and evidence rules

No candidate is verified by pattern matching alone. A verified security finding
requires all of the following:

```text
1. reachable execution path
2. attacker-controlled input or a cross-boundary input
3. breach of an applicable security invariant or boundary
4. source → sink path evidence
```

The later review must keep these states separate:

```text
candidate != verified vulnerability
missing input != unverified result
unverified != pass
verified finding != fix authorization
fix authorization != production GO
```

For each candidate or verified result, record the source, sink, path,
reachability basis, existing controls, status, and remaining proof gap.
Critical / High / Medium / Low scan severity must not be mechanically
converted into P0 / P1 / P2 gate severity.

## 6. Application runtime versus toolchain findings

Application-runtime findings and toolchain/dependency advisories are separate
classification tracks.

```text
Application runtime:
  assess reachable application behavior and security-boundary impact.

Toolchain / dependency:
  record advisory presence and whether production application runtime is
  reachable through that dependency; do not automatically classify a
  toolchain advisory as an application vulnerability.
```

The later scan must not run `npm audit fix --force`, upgrade dependencies, or
alter package metadata as part of discovery or closeout.

## 7. Gate sequence

```text
1. Current-RC Security Exact-Scope Definition
   Status: RECORDED
   Target: 7944cea0fad20783f178ec613080283b98b5cca5

2. Independent Review of this Security Definition
   Status: NOT STARTED
   Requires Step 1

3. Security Definition PASS / LOCK
   Status: NOT ESTABLISHED
   Requires Step 2 PASS

4. Human Deep Scan Start GO
   Status: NOT GRANTED
   Requires Step 3

5. Exact-RC Deep Scan execution
   Status: NOT STARTED
   Requires Step 4
```

Only Step 2 is the next action after this document is recorded. Step 4 is a
separate Human-only authorization and must not be inferred from RR-2 Definition
LOCK or from this scope definition.

## 8. STOP

```text
This document defines scope only.
Do not begin the Deep Scan from this document.
Do not build .sppkg.
Do not calculate an artifact hash.
Do not modify source, dependencies, package metadata, or SR-P3 items.
Do not create or mutate findings or Issues.
Do not Production Bind.
Do not enable LIVE WRITE.
Do not Deploy.
Do not mutate SharePoint / Graph / M365 / Entra / App Catalog.
Wait for Independent Review, Security Definition PASS / LOCK,
and a separate Human Deep Scan Start GO.
CURRENT ACTION: STOP
```

## References

- [`release-readiness-2.md`](./release-readiness-2.md)
- [`SECURITY.md`](../../SECURITY.md)
- [`security-deep-scan-current-sha-2.md`](./security-deep-scan-current-sha-2.md) — historical/supporting scan authority only
