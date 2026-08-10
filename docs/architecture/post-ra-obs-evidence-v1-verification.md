# POST-RA-OBS-EVIDENCE-V1 — Verification Plan

Status: IMPLEMENTED / VERIFICATION PENDING
Base: `3ec8c2e711a88215c199375d3464ddadc7a0ba4c`

## Scope verification

Expected implementation files:

```text
src/domain/observation-evidence.ts
src/domain/index.ts
tests/domain/observation-evidence.test.ts
```

Supporting governance docs may be added under `docs/architecture/`.

## Required checks

- empty observation history
- chronological ordering by represented instant
- offset-safe ordering (`Z` and explicit offsets)
- deterministic `RecordId` tie-break for same instant
- `latestObservedAt` derivation
- input array remains unmodified
- evidence output exposes only `RecordId`, `observedAt`, `observedBy`
- no weekly compliance / violation / required-count output
- repository CI success
- independent diff review P0/P1/P2 = 0 before Human Ready

## Gate

```text
Implementation: COMPLETE on branch
Verification: PENDING CI / Independent Review
Ready: HOLD
Merge: HOLD
```
