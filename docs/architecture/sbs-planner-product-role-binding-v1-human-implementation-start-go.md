# SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 — Human Implementation Start GO

Human Implementation Start GO consumption for SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 after Independent Scope Review-1 PASS / REVIEW-CLEARED and Human Scope Lock. This record authorizes Exact Scope §4 Product mutation and §5 verification files only.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
unit: SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
kind: Human Implementation Start GO record
mode: READ ONLY boundary record + GO consumption
date: 2026-09-18

Human speech-act (verbatim):
  SBS-PLANNER-PRODUCT-ROLE-BINDING-V1
  Human Implementation Start GO

Human Implementation Start GO: RECEIVED / CONSUMED
Implementation Start: AUTHORIZED (Exact Scope §4 / §5 only)

basis main: f323c975e9969fd02a6a27352a90ec8eb37961f8
Issue: #669 OPEN
  frozen issue body sha256: ab11548528d4ccb1cedb1826f26b703a508e2f2731e749021f92e58c6cc91707

locked packet blob: f0aa82f6edb5f8687baba6482c37d42c43dc605d
Human Definition Lock blob: 5bee146cc5c6dadc80156714b153d3876b828f6b
Independent Definition Review-1 blob: a50c0b4943c64956268bf7a9807caa9d46df2071
Exact Scope blob: b3284a0ace61c54de174290cf13dec2156a26287
Independent Scope Review-1 blob: 3fbc7dc8221587299ba18ecd77b1d4d22e202e42
Human Scope Lock blob: bce3e4497689426fa70de3b329b33eea05cd34e3
parent TOP-LEVEL-IA packet blob: 4c80f67e0a05f6ff10036ee1f44f1be9e16bab73

Independent Scope Review-1: PASS / REVIEW-CLEARED / CONSUMED
  P0 = 0
  P1 = 0
  P2 = 1 (S-P2-1; Correction NOT REQUIRED)
Human Definition Lock: RECEIVED / CONSUMED (prior)
Human Scope Lock: RECEIVED / CONSUMED (prior)
Combined Human Definition / Scope Lock: CONSUMED

H-9 durable lineage bind on this implementation base: SATISFIED
  (exact blobs placed; bodies not rewritten)

Ready / Merge / Deploy: NOT AUTHORIZED
LIVE WRITE / SharePoint / M365 / Entra: NOT AUTHORIZED
Issue #669 close: NOT AUTHORIZED
PL-HTA: NOT THIS GATE
```

This Decision consumes Human SBS-PLANNER-PRODUCT-ROLE-BINDING-V1 Implementation Start GO only. It does **not** consume Ready, Merge, Deploy, LIVE WRITE, or Issue close.

Human Implementation Start GO ≠ Ready ≠ Merge ≠ Deploy ≠ PL-HTA.

---

## AUTHORIZED

Exact Scope §4 Product IN:

```text
spfx/src/shell/ux/AppShellChrome.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.tsx
spfx/src/webparts/scaffoldShellWebPart/components/ScaffoldShell.module.scss
```

Exact Scope §5 verification IN:

```text
spfx/smoke/sbs-planner-product-role-binding-v1/smoke-entry.tsx
spfx/smoke/sbs-planner-product-role-binding-v1/run-smoke.mjs
.github/workflows/sbs-planner-product-role-binding-v1-browser-smoke.yml
```

S-P2-1 disposition (non-blocking; follow Independent Scope Review-1):

```text
parent role-change contract handles FIELD_STAFF ↔ PLANNER only
ADMIN_AUDIT stays chrome-local
```

---

## NOT AUTHORIZED

```text
ScaffoldShellWebPart.ts
IScaffoldShellProps.ts
DemoPresentationRoleEntry.tsx contract change
planner-task-navigation.ts Destination rewrite
field-staff-task-navigation.ts CORR-1F / CORR-1G rewrite
presentationRole Product prop
smoke presentationRole: "PLANNER" as FE-F002 proof
ADMIN_AUDIT Task-First / FE-F001 / FE-F003
Product-visible cycle selector
unhiding primary-navigation / demo-banner / site-selector
Ready / Merge / Deploy / LIVE WRITE
Issue #669 mutation / close
Rewrite locked packet blob f0aa82f6…
Rewrite locked Exact Scope blob b3284a0a…
```

---

## Post-GO STOP

```text
implementation + required tests / dedicated Demo-entrance smoke
  → Fresh Independent Implementation Review
  ≠ Ready / Merge / Deploy
  ≠ PL-HTA
```
