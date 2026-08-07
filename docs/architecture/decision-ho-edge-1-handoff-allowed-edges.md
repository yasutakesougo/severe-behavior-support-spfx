# Decision-HO-EDGE-1 — Handoff allowed edges

## Status

```text
Decision-HO-EDGE-1: Accepted
Owner Issue: #17
```

This decision records the accepted allowed-edge set for the Handoff status transition pure function.

## Accepted policy

The operational preference is to keep the workflow reasonably flexible while preserving an auditable progression.

Adjacent active states may move in both directions, but `closed` remains terminal.

## Allowed edges

```text
not_required -> pending
pending -> not_required
pending -> included
included -> pending
included -> acknowledged
acknowledged -> included
acknowledged -> closed
```

## Denied edges

The allowlist above is exhaustive.

The following categories are denied.

```text
self-transitions
skipped transitions
other reverse transitions
closed -> any status
unknown or malformed status values
```

## Separation

This decision does not define roles or permissions.

`GOV-AUD-02` / Issue #19 remains the owner of role and permission decisions.

This decision also does not define persistence, SharePoint behavior, UI behavior, audit emission, or deployment.
