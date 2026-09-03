# SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1 — Exact verification HEAD fixation

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1
exact verification HEAD = 10269a2ef5110e3b11bb74bd0e498cb371578c90
product HEAD (unchanged) = 5437e64703db055eef2bf230f5a682cf0286dc1a
Focused Verification = PASS
#584 product files in this HEAD = identical to 5437e64
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

Changed paths vs product freeze (harness only):

```text
docs/architecture/sbs-mgmt-plan-activation-c-staff-arrival-1-procedure-1.md
docs/architecture/sbs-mgmt-plan-activation-c-staff-arrival-1-start-go-1.md
spfx/smoke/sbs-mgmt-loop-b/README.md
spfx/smoke/sbs-mgmt-loop-b/before-apply-dom-driver.ts
spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
spfx/smoke/sbs-mgmt-loop-b/verify-staff-arrival.mjs
spfx/smoke/support-plan-review-new-version-demo-1/smoke-entry.tsx
```

Follow-up evidence commits on this branch must not add product/runtime paths. If they do, re-fixate and do not treat 10269a2 as the verification HEAD.

NEXT:

```text
Human Actual Staff Plan-Transition Re-Test
on the beforeApply URL from serve-smoke @ this verification HEAD
↓
Human Ready GO / HOLD for #584 @ 5437e64
```
