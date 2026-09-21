# SBS-ROLE-TASK-FIRST-IA-V1 Implementation Scope Recovered Canonical Document (Correction-1)

## Purpose & Scope Authority

This document canonicalizes the historical recovered implementation scope for `SBS-ROLE-TASK-FIRST-IA-V1` (Definition Correction-1).
This task records and canonicalizes evidence recovered from historical definition/scope material without inventing, improving, broadening, or reinterpreting the scope boundaries.

> [!IMPORTANT]
> **Separation of Authority & State**:
> 1. **RECOVERED HISTORICAL CONTENT**: Extracted exactly from historical SBS-ROLE-TASK-FIRST-IA-V1 Implementation Scope Definition Correction-1 material.
> 2. **CURRENT REPOSITORY VERIFICATION**: Recorded against repository state at current HEAD (`1af3d67cfe05091b00478a20098e45d0d5b0289d`).
> 3. **UNRECOVERED REVIEW AUTHORITY**: Items explicitly unverified or unbacked by repository-native canonical review artifacts.

---

## 1. Source & Preservation Authority

- **Locked Definition Artifact**: [`docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md`](file:///Users/yasutakesougo/severe-behavior-support-spfx/docs/architecture/sbs-role-task-first-ia-v1-correction-2-complete-controlled-packet.md)
- **Locked Definition Blob**: `5eeb8140772ebfefe050cff93361a6d81c470f81` (VERIFIED as repository git blob)
- **Historical Claimed Preservation Basis**: `51da2b423bf5b2622a3f450d09b6f5dd2710bca7`
  - *Status*: CURRENTLY UNVERIFIED AS GIT OBJECT. Preserved strictly as a historical claimed identifier; not represented as a current git commit or object.

---

## 2. Recovered Residual Product Delta (RPD-1 .. RPD-4)

- **RPD-1**: `FIELD_STAFF` = in-flow `D-FIND-RECORD` → `D-RECORD-READ`
- **RPD-2**: `PLANNER` = `D-FIND-PERSON` → `D-PERSON`
- **RPD-3**: `ADMIN_AUDIT` = `D-FIND-PERSON` → `D-PERSON` + `D-EVIDENCE` / `D-PERSON` / `D-RECORD-READ` → `D-FIND-RECORD` → `D-RECORD-READ` + `AA-T3 D-AUDIT`
- **RPD-4**: `ScaffoldShell` / `AppShellChrome` = residual Destination state ↔ existing Product host synchronization

> [!NOTE]
> No RPD has been added or removed.

---

## 3. Recovered Exact Required & Preserve Surfaces

### Required Files (Product, Tests, Harness)

#### Product Runtime
- [`spfx/src/shell/ux/field-staff-task-navigation.ts`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/shell/ux/field-staff-task-navigation.ts)
- [`spfx/src/shell/ux/planner-task-navigation.ts`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/shell/ux/planner-task-navigation.ts)
- `spfx/src/shell/ux/admin-audit-task-navigation.ts`
- [`spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx)
- [`spfx/src/shell/ux/AppShellChrome.tsx`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/shell/ux/AppShellChrome.tsx)

#### Unit / Integration Tests
- [`spfx/src/shell/ux/field-staff-task-navigation.test.ts`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/shell/ux/field-staff-task-navigation.test.ts)
- [`spfx/src/shell/ux/planner-task-navigation.test.ts`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/shell/ux/planner-task-navigation.test.ts)
- `spfx/src/shell/ux/admin-audit-task-navigation.test.ts`
- `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.test.tsx`
- `spfx/src/shell/ux/AppShellChrome.test.tsx`

#### Browser Smoke Harness
- [`spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs)
- [`spfx/smoke/sbs-planner-top-level-ia-v1/run-smoke.mjs`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/smoke/sbs-planner-top-level-ia-v1/run-smoke.mjs)
- `spfx/smoke/sbs-admin-audit-task-first-v1/run-smoke.mjs`

### Recovered Preserve / No Change Surface
- [`spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss)
- [`spfx/src/shell/ux/primary-navigation.ts`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/shell/ux/primary-navigation.ts)
- [`spfx/src/shell/ux/destination.ts`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/src/shell/ux/destination.ts)
- [`spfx/smoke/sbs-role-task-first-ia-1/smoke-entry.tsx`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/smoke/sbs-role-task-first-ia-1/smoke-entry.tsx)
- [`spfx/smoke/sbs-planner-top-level-ia-v1/smoke-entry.tsx`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/smoke/sbs-planner-top-level-ia-v1/smoke-entry.tsx)
- `spfx/smoke/sbs-admin-audit-task-first-v1/smoke-entry.tsx`
- [`spfx/smoke/sbs-planner-pl-hta-correction-1/run-smoke.mjs`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/smoke/sbs-planner-pl-hta-correction-1/run-smoke.mjs)
- [`spfx/smoke/sbs-planner-pl-hta-correction-1/smoke-entry.tsx`](file:///Users/yasutakesougo/severe-behavior-support-spfx/spfx/smoke/sbs-planner-pl-hta-correction-1/smoke-entry.tsx)

- **Exact Conditional Files**: NONE
- **New File Requirement**: Creation of new files during future product implementation constitutes SCOPE EXPANSION and triggers immediate HOLD.

---

## 4. Current Repository Path Verification

Captured at HEAD `1af3d67cfe05091b00478a20098e45d0d5b0289d`:

| Path | Category | Repository Status |
| --- | --- | --- |
| `spfx/src/shell/ux/field-staff-task-navigation.ts` | Required Product | **EXISTS** |
| `spfx/src/shell/ux/planner-task-navigation.ts` | Required Product | **EXISTS** |
| `spfx/src/shell/ux/admin-audit-task-navigation.ts` | Required Product | **ABSENT** |
| `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx` | Required Product | **EXISTS** |
| `spfx/src/shell/ux/AppShellChrome.tsx` | Required Product | **EXISTS** |
| `spfx/src/shell/ux/field-staff-task-navigation.test.ts` | Required Test | **EXISTS** |
| `spfx/src/shell/ux/planner-task-navigation.test.ts` | Required Test | **EXISTS** |
| `spfx/src/shell/ux/admin-audit-task-navigation.test.ts` | Required Test | **ABSENT** |
| `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.test.tsx` | Required Test | **ABSENT** |
| `spfx/src/shell/ux/AppShellChrome.test.tsx` | Required Test | **ABSENT** |
| `spfx/smoke/sbs-role-task-first-ia-1/run-smoke.mjs` | Required Smoke | **EXISTS** |
| `spfx/smoke/sbs-planner-top-level-ia-v1/run-smoke.mjs` | Required Smoke | **EXISTS** |
| `spfx/smoke/sbs-admin-audit-task-first-v1/run-smoke.mjs` | Required Smoke | **ABSENT** |
| `spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss` | Preserve | **EXISTS** |
| `spfx/src/shell/ux/primary-navigation.ts` | Preserve | **EXISTS** |
| `spfx/src/shell/ux/destination.ts` | Preserve | **EXISTS** |
| `spfx/smoke/sbs-role-task-first-ia-1/smoke-entry.tsx` | Preserve | **EXISTS** |
| `spfx/smoke/sbs-planner-top-level-ia-v1/smoke-entry.tsx` | Preserve | **EXISTS** |
| `spfx/smoke/sbs-admin-audit-task-first-v1/smoke-entry.tsx` | Preserve | **ABSENT** |
| `spfx/smoke/sbs-planner-pl-hta-correction-1/run-smoke.mjs` | Preserve | **EXISTS** |
| `spfx/smoke/sbs-planner-pl-hta-correction-1/smoke-entry.tsx` | Preserve | **EXISTS** |

*Note: Absence of a path does not alter historical scope definition.*

---

## 5. Recovered Preservation Invariants

1. **Locked Definition**: NO MODIFICATION
2. **Domain Semantics**: NO CHANGE
3. **Schema**: NO CHANGE
4. **Persistence**: NO CHANGE
5. **Authorization Model**: NO EXPANSION (Presentation Role != Authorization Role)
6. **New Global Item**: NONE
7. **New Destination Outside Locked Definition**: NONE
8. **Global 「探す」**: `D-FIND-PERSON` only
9. **D-FIND-RECORD**: in-flow only
10. **D-RECORD-READ**: no create / no write
11. **Browser Smoke**: != Human Task Acceptance (Human Acceptance is SEPARATE)

---

## 6. D-GOV Boundary Rule

- Do not invent D-GOV entry mechanics.
- Do not create a new Product route solely to close D-GOV.
- If implementing the recovered scope requires D-GOV entry mechanics not established by the Locked Definition and existing Product: **HOLD** (Do not attempt to resolve within canonicalization).

---

## 7. Unrecovered Review Authority & Critical Limitations

The following claims are **UNRECOVERED** (not backed by any repository-native or recovered canonical review artifact) and must **NOT** be recorded as verified historical facts:

- `Fresh Independent Implementation Scope Re-Review-2 = PASS / REVIEW-CLEARED`
- `P0 / P1 / P2 = 0 / 0 / 0`
- `Already-Locked Destination Addition = AUTHORIZED`

---

## 8. Execution Controls & Governance Status

- **Human Implementation Start GO**: RECEIVED (Execution Suspended — DO NOT RE-CONSUME)
- **Product Implementation**: HOLD
- **Human Ready GO**: NOT AUTHORIZED
- **Human Merge GO**: NOT AUTHORIZED
- **Human Deploy GO**: NOT AUTHORIZED
