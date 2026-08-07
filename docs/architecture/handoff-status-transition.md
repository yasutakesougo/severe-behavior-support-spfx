# Handoff status transition

## Purpose

This document fixes the technical contract for the pure Handoff status transition function owned by Issue #17.

Business ownership and allowed edges are already accepted decisions.
Role and permission checks remain outside this contract and are owned by `GOV-AUD-02` / Issue #19.

## Canonical status set

The status set is owned by Issue #27 and is not redefined here.

```text
not_required
pending
included
acknowledged
closed
```

## Allowed transitions

Only the following transitions are allowed.

```text
not_required -> pending
pending -> not_required
pending -> included
included -> pending
included -> acknowledged
acknowledged -> included
acknowledged -> closed
```

`closed` is terminal.

All self-transitions, skipped transitions, other reverse transitions, and transitions from `closed` are denied.

## Function contract

```ts
transitionHandoffStatus(
  currentStatus: unknown,
  targetStatus: unknown
): HandoffStatusTransitionResult
```

The function performs allow/deny evaluation only.

It must not mutate a `HandoffState`, populate timestamps or actor fields, resolve roles, persist data, call SharePoint, or emit audit events.

## Result contract

```ts
type HandoffStatusTransitionResult =
  | Readonly<{
      ok: true;
      status: HandoffStatus;
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "INVALID_TRANSITION";
    }>;
```

### `MALFORMED_INPUT`

Return `MALFORMED_INPUT` when either input is not one of the canonical `HandoffStatus` values.

Examples include `null`, `undefined`, numbers, objects, unknown strings, and casing variants.

The function must not throw for malformed input.

### `INVALID_TRANSITION`

Return `INVALID_TRANSITION` when both inputs are valid statuses but the edge is not in the accepted allowlist.

This includes self-transitions, skipped transitions, denied reverse transitions, and every transition from `closed`.

## Fail-closed rule

The allowlist is exhaustive.

Any valid edge not listed above is denied.

No edge may be inferred from Finding or SupportPlan transition contracts.

## Out of scope

- `GOV-AUD-02` role or permission checks
- timestamp and actor-field requirements on `HandoffState`
- SharePoint persistence
- repository or adapter behavior
- UI behavior
- audit-event emission
- real data
- Microsoft 365 configuration
- deployment

## Required contract tests

The implementation must cover all seven allowed edges.

It must also verify at least the following denied cases.

```text
not_required -> included
pending -> closed
included -> closed
acknowledged -> pending
closed -> acknowledged
closed -> closed
pending -> pending
unknown -> pending
pending -> unknown
null -> pending
pending -> null
```

## Entry criteria

Implementation may start only when all of the following are true.

```text
Decision-HO-1 ownership: Accepted (#17)
Allowed-edge decision: Accepted
HandoffStatus type: existing canonical contract (#27)
Technical contract: fixed by this document
Role checks: explicitly out of scope
Persistence / SharePoint / UI: explicitly out of scope
```
