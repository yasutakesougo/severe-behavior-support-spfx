# SBS-MGMT-LOOP-A — Implementation Scope Correction-3 (#552)

```text
repository: yasutakesougo/severe-behavior-support-spfx
tracking issue: #552
unit: SBS-MGMT-LOOP-A-IMPLEMENTATION-SCOPE-CORRECTION-3
kind: docs-only scope correction addendum
parent scope: Implementation Scope Correction-2 @ PR #565
Independent Scope Review-2: CORRECTION REQUIRED / issuecomment-5490712638
P0=0 / P1=1 / P2=0
Human Implementation Correction GO: NOT RECEIVED
```

This addendum corrects only P1-1 from Independent Scope Review-2. All other Scope Correction-2 content remains unchanged.

## C3-1 — Exact implementation correction lineage

The correction implementation must not start from `main@2c99d0c6d4dd8a4691ed64386650808d07525f38` as a standalone Product parent, because main does not contain the #552 Product implementation under staff check.

Authoritative correction target:

```text
existing implementation PR = #563
implementation branch = agent/552-sbs-mgmt-loop-a-implementation
required Product ancestor = bfa7eaa2821197d68c284735ce5a6b355c3e5687
```

`bfa7eaa…` is the exact Product implementation basis that received prior Rendered Browser Acceptance and Actual Staff Value Check Staff 1 evidence.

Current or future docs/evidence-only descendants on PR #563 may be used as the mutation parent only after read-only verification that the Product blobs in the Scope-authorized Product paths remain identical to `bfa7eaa…`.

Known docs/evidence tip before this Scope sequence:

```text
PR #563 docs/evidence tip = fff7cbb77a2669bedaebf49ee7e2e6954d41033a
Product basis = bfa7eaa2821197d68c284735ce5a6b355c3e5687
```

The docs/evidence tip is not a new Product basis.

## C3-2 — Mandatory pre-mutation fixation

After separate Human Implementation Correction GO and before any Product/test/smoke mutation, the Agent must read-only verify:

```text
1. PR #563 remains the intended correction PR / implementation lineage.
2. target branch contains bfa7eaa as Product ancestor or equivalent descendant lineage.
3. Scope-authorized Product files have expected bfa7eaa Product blobs before correction.
4. no unrelated Product mutation has entered the target lineage.
5. main remains comparison/rebaseline only unless the #552 Product implementation has separately been merged under explicit authority.
```

If any item is not confirmed:

```text
STOP
→ exact diff / lineage inspection
→ Scope Correction if necessary
```

## C3-3 — Mutation target after Human Implementation Correction GO

Only after the separate Human Implementation Correction GO:

```text
mutation target = PR #563 implementation branch/lineage
Product correction ancestor = bfa7eaa… Product basis
```

Do not create a replacement Product implementation from bare main merely because PR #565 is based on main. PR #565 is docs-only Scope evidence and is not the Product mutation branch.

The exact Product mutation surface remains Scope Correction-2 §4; verification surface remains §5; R1-R12 and F1-F10 remain unchanged.

## Gate

```text
Scope Correction-3 = APPLIED
Independent Scope Re-Review-2 = REQUIRED
Human Implementation Correction GO = NOT RECEIVED
Product / fixture / test / smoke mutation = NOT AUTHORIZED
Ready / Merge / Deploy / Production Binding / LIVE WRITE = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
#553 = NOT YET
```
