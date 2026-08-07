# Handoff transition role policy

## Purpose

This document fixes the technical role-policy contract derived from `GOV-AUD-02`.

The policy answers only which application roles are required for an already-approved Handoff status edge.

It does not perform authentication, tenant/site matching, Entra ID group mapping, persistence, or UI authorization.

## Governance source

```text
GOV-AUD-02: Accepted
Issue #19 comment: 5215209914
Decision-HO-EDGE-1: Accepted
Handoff transition implementation: PR #90 MERGED
```

## Required roles by edge

```text
not_required -> pending:       PLANNER / SERVICE_MANAGER
pending -> not_required:       PLANNER / SERVICE_MANAGER
pending -> included:           PLANNER / SERVICE_MANAGER
included -> pending:           PLANNER / SERVICE_MANAGER
included -> acknowledged:      PLANNER / SERVICE_MANAGER
acknowledged -> included:      PLANNER / SERVICE_MANAGER
acknowledged -> closed:        SERVICE_MANAGER
```

`SUPPORTER`, `VIEWER`, `SITE_ADMIN`, `ORG_ADMIN`, and `SYSTEM_ADMIN` are not granted Handoff business-state authority by this policy.

## Composition with transition validation

Role policy must not make a denied status edge valid.

The caller first evaluates the status edge using the accepted Handoff transition contract.

Only an allowed edge may return required roles.

```text
status edge allowed
AND
identity passes evaluateAccess(requiredRoles)
=> application may proceed to the later mutation boundary
```

`evaluateAccess` remains the canonical contract for authentication result handling, organization/site matching, unknown-role rejection, and required-role matching.

## Function contract

```ts
getHandoffTransitionRequiredRoles(
  currentStatus: unknown,
  targetStatus: unknown
): HandoffTransitionRolePolicyResult
```

Result:

```ts
type HandoffTransitionRolePolicyResult =
  | Readonly<{
      ok: true;
      requiredRoles: readonly Role[];
    }>
  | Readonly<{
      ok: false;
      code: "MALFORMED_INPUT" | "INVALID_TRANSITION" | "POLICY_MISSING";
    }>;
```

`POLICY_MISSING` is a fail-closed guard against drift between the accepted transition allowlist and the role-policy table.

## Out of scope

```text
Entra ID group mapping
SharePoint permission mapping
HandoffState timestamp / actor mutation
repository write
AuditEvent emission
UI visibility
SITE_ADMIN / ORG_ADMIN emergency override
SYSTEM_ADMIN technical override
real data
deploy
```

No emergency override is inferred.

## Entry criteria

```text
GOV-AUD-02: Accepted
Decision-HO-EDGE-1: Accepted
Handoff transition pure function: MERGED
Role type: existing canonical 7-role contract
Access evaluator: existing fail-closed evaluateAccess
```

The narrow pure role-policy implementation may proceed when these conditions hold.
