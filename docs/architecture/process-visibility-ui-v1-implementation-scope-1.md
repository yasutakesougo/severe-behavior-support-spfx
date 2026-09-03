# PROCESS-VISIBILITY-UI-V1 — Implementation Scope 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: implementation scope / start-gate definition
status: CANDIDATE / NOT STARTED
definition: docs/architecture/process-visibility-ui-v1-definition-1.md
freeze: docs/architecture/process-visibility-ui-v1-information-mapping-freeze-1.md
prototype: docs/architecture/process-visibility-ui-v1-presentation-prototype-1.md
Human Definition Lock GO: NOT RECEIVED
Human Visual Acceptance: NOT RECEIVED
Human Implementation Start GO: NOT RECEIVED
#576 Merge prerequisite: REQUIRED / NOT MET（see gate status）
Implementation: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
mutation: 0
```

## 1. Purpose

Smallest presentation-only surface realizing Definition 1 for **PLANNER only**.

```text
This Scope
!= Implementation authorization
!= Ready / Merge
```

## 2. Binding

Implementation must remain conformant with:

```text
Definition 1 + Mapping Freeze 1
Accepted Visual Acceptance（when Human grants）
#576 merged product（lifecycle invariants @ post-merge fixation）
```

If Definition / Freeze / #576 invariants change, re-evaluate Scope before Start.

## 3. Product change surface（ONLY）

```text
spfx/src/shell/users/SupportPlan.tsx
spfx/src/shell/users/support-plan-copy.ts
spfx/src/shell/users/SupportPlanUx.module.scss
spfx/src/shell/ux/presentation-role.ts
```

No other Product runtime file is authorized.

## 4. Verification surface

```text
spfx/src/shell/users/support-plan.test.ts
spfx/src/shell/ux/presentation-role.test.ts
spfx/smoke/planning-pc-demo-1/**（Process nav / mobile as needed）
spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs（lifecycle regression only; no feature expansion）
docs/architecture/*browser-smoke* updates strictly for V1 evidence
```

## 5. Allowed outcomes

| ID | Outcome |
|---|---|
| PV-1 | PLANNER block order = summary → goals → actions → procedures → records → review → nextVersion → versions → mutation（Monitoring rendered as Process ④ between records and review visually） |
| PV-2 | PLANNER Process nav = 6 labels（計画/支援/記録/モニタリング/見直し/次版準備） |
| PV-3 | MonitoringView extracted from inside records list into Process ④ wrapper with Process Header（component file unchanged） |
| PV-4 | capturedReview outcome/reason visually grouped under Process ⑤; state logic not moved |
| PV-5 | #576 safety copy stays under Process ⑥ |
| PV-6 | versions + mutation + stateGrid under 履歴・詳細 demotion（no Accordion） |
| PV-7 | Desktop sectionNavButton*; Mobile 2×3 grid styles |
| PV-8 | ADMIN_AUDIT + FIELD_STAFF orders / nav unchanged |

### Exact PLANNER order note

Render order must read as ①→⑥ then 履歴・詳細. Implementation may keep `SupportPlanBlockKey` union and compose wrappers; do not invent new domain keys.

Recommended PLANNER `supportPlanBlockOrderForRole("PLANNER")` (presentation keys only):

```text
summary → goals → actions → procedures → records → review → nextVersion → versions → mutation
```

Monitoring visual separation is **inside render composition** (records without Monitoring; Monitoring after records / before review), not a new block key unless tests require a non-domain presentation key. Prefer composition over expanding `SupportPlanBlockKey` if avoidable.

## 6. Required invariants

```text
presentationRole === PLANNER only for V1 changes
FIELD_STAFF / ADMIN_AUDIT unchanged
no new workflow / business status / progress Stepper
MonitoringView.tsx not rewritten
domain / contracts / RevisionIntent / N+1 semantics unchanged
LIVE_WRITE = false
#576 copy:
  現在適用中: 版 N
  版 N+1 は下書き / まだ適用開始されていない
  現行版は変更しない
  CTA: 支援内容の見直しを始める（版 N+1 の下書き）
```

## 7. Explicit OUT

```text
domain / schema / DTO / persistence
new component system / new Monitoring domain
Accordion 履歴・詳細（V1.1）
tabs
SharePoint / M365 / Entra / Deploy / LIVE WRITE
#576 Ready / Merge substitute
ADMIN_AUDIT presentation changes via isPlanningPcPresentationRole blanket reuse
```

## 8. Role branching rule

```text
WRONG: if (isPlanningPcPresentationRole(role)) { apply V1 order/nav }
RIGHT: if (role === "PLANNER") { apply V1 order/nav }
       ADMIN_AUDIT keeps pre-V1 planning-PC order/nav
```

## 9. Verification plan（post Start GO）

```text
unit: presentation-role + support-plan order/nav fail-closed
planning-pc smoke: Process nav focus Desktop + Mobile 2×3
B12 / sbs-mgmt-loop-b: lifecycle regression only
RBA: 1280×900 and 390×844
Independent Implementation Review
Actual Staff Process-Comprehension T1–T5
→ Ready only after Human Ready GO
```

## 10. Gate

```text
Scope = CANDIDATE
Ponytail = required next
Independent Scope Review = required
Human Implementation Start GO = NOT RECEIVED
#576 Merged = NOT MET
```
