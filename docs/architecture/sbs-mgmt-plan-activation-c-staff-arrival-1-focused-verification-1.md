# SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1 — Focused Verification 1

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1
PRODUCT UNDER TEST = #584 @ 5437e64703db055eef2bf230f5a682cf0286dc1a
VERIFICATION HARNESS HEAD = 10269a2ef5110e3b11bb74bd0e498cb371578c90
command: node spfx/smoke/sbs-mgmt-loop-b/verify-staff-arrival.mjs
result: PASS
LIVE WRITE = false
```

## Matrix

| Check | Result |
|---|---|
| beforeApply query recognized | PASS (`data-sbs-mgmt-plan-activation-c-query=beforeApply`) |
| DOM driver executed | PASS (banner `ready`) |
| Draft v4 present | PASS |
| Apply CTA mounted | PASS（`版 4 を適用開始する` enabled） |
| cold URL empty session | PASS（list + opened plan: no draft / no Apply） |
| #584 product source unchanged | PASS（diff vs `5437e64` = smoke + these docs only） |

## Not claimed

```text
Actual Staff Plan-Transition Re-Test = NOT RUN (Human)
Human screenshot 2026-09-03 = HOLD / NOT arrival
  (⑤ 変更なし + ⑥ 次の版を作る — see staff-arrival-1-human-screenshot-hold-1)
Human Ready GO = NOT ELIGIBLE until a Human surface matches ready + Apply
#584 Implementation Review re-opened = NO
```
