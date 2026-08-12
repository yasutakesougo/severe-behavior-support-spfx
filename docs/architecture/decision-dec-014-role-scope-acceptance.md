# DEC-014 + Role Scope — Human Acceptance (Option A)

This document records the explicit Human Decision accepting **DEC-014 + ROLE-SCOPE Option A**.

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-DEC-014-ROLE-SCOPE-1
Human Decision date: 2026-08-12
Human Decision: ACCEPT Option A
Baseline main: 88a69940624f7b6e5595217ae282237fd1ef1ef6
Status in this branch: ACCEPTED / PENDING MERGE TO MAIN
Issue #8 DEC-014: accepted by Human for the bounded scope below, pending repository recording merge
Issue #4: OPEN / KEEP OPEN
Entra mutation: NOT AUTHORIZED
Microsoft Graph mutation: NOT AUTHORIZED
SharePoint mutation: NOT AUTHORIZED
Deploy: NOT AUTHORIZED
Decision C Entra Mutation GO: NOT AUTHORIZED
```

## Accepted Decision

```text
Human Decision — DEC-014 + ROLE-SCOPE
ACCEPT Option A
```

### Naming pattern

```text
SBS-{SiteCode}-{ROLE}
```

### Site code mapping

```text
SITE-ISG -> ISG
SITE-HOM -> HOM
```

### Role token rule

Use the formal Role token with `_` replaced by `-`.

Examples:

```text
SERVICE_MANAGER -> SERVICE-MANAGER
SITE_ADMIN -> SITE-ADMIN
```

### Group object type

```text
Entra security group
```

### Accepted role scope and cardinality

The following five roles are site-scoped for this Decision and use one group per site:

```text
SUPPORTER
PLANNER
SERVICE_MANAGER
SITE_ADMIN
VIEWER
```

```text
scope = SITE
cardinality = one group per site per in-scope role
```

`ORG_ADMIN` and `SYSTEM_ADMIN` are explicitly outside this Decision and remain HOLD / UNKNOWN for directory group mapping.

## Exact accepted names

### SITE-ISG

```text
SBS-ISG-SUPPORTER
SBS-ISG-PLANNER
SBS-ISG-SERVICE-MANAGER
SBS-ISG-SITE-ADMIN
SBS-ISG-VIEWER
```

### SITE-HOM

```text
SBS-HOM-SUPPORTER
SBS-HOM-PLANNER
SBS-HOM-SERVICE-MANAGER
SBS-HOM-SITE-ADMIN
SBS-HOM-VIEWER
```

## Deprecated / forbidden identifiers

The following remain forbidden for new work:

```text
MCD
SITE-MCD
SBS-MCD-*
SBS-MACHIDA-*
```

## SharePoint naming boundary

This Decision does not change SharePoint URL naming and must not revive stale `/sites/sbs-*` URL candidates.
Accepted pilot SharePoint URLs remain governed by their existing Accepted pilot identity Decision.

## Explicit OUT / NOT AUTHORIZED

```text
Entra group creation
membership add/remove
Microsoft Graph write
SharePoint permission mutation
Conditional Access change
Deploy
production account changes
Issue #4 Close
#21 live principal/membership provider implementation
#22 implementation
#23 E2E execution
Decision C Entra Mutation GO
ORG_ADMIN directory-group mapping
SYSTEM_ADMIN directory-group mapping
additional naming or role-scope semantics beyond this Decision
```

## Post-decision state

After this Acceptance is merged to `main`:

```text
DEC-014 naming for the ten site-role groups = RESOLVED / ACCEPTED / LOCKED
group object type for those ten groups = Entra security group
site-role scope for SUPPORTER / PLANNER / SERVICE_MANAGER / SITE_ADMIN / VIEWER = RESOLVED
group cardinality for those roles = one group per site
exact group names = RESOLVED (10)
ORG_ADMIN = HOLD
SYSTEM_ADMIN = HOLD
Entra mutation = STILL NOT AUTHORIZED
Decision C = STILL NOT AUTHORIZED
```

## Remaining blockers before Decision C

```text
exact synthetic/test account identities
exact mutation inventory bound to the ten accepted names
before-state capture
rollback plan bound to created object IDs
read-after-write verification commands/checklist
separate explicit Human Decision C — Entra Mutation GO
```

## Effective-state rule

```text
Human ACCEPT is recorded here.
Repository Decision SoT becomes effective after this Acceptance record is merged to main.
Merge remains a separate Human gate.
```
