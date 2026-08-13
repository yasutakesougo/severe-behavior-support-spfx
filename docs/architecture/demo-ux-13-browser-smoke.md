# DEMO-UX-13 — Browser smoke

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-13 — Users list detail-preview expansion
Kind: browser smoke
Status: PASS / VERIFIED
Harness: spfx/smoke/demo-ux-13/
Port: 4195
Artifacts: /opt/cursor/artifacts/demo-ux-13-browser-smoke/
Result: 7 / 7 PASS
Verified HEAD: 7b8fa0b8a935415ddc1cd41c086c3148d2c8d9d8
Ready / Merge: NOT AUTHORIZED
```

## Cases

| Case | Result |
|---|---|
| users-list-ac-enabled-bdh-disabled | PASS（A/C enabled；B/D–H disabled；note updated） |
| open-c-detail-from-list-no-support-plan | PASS（C detail；no plan preview） |
| open-a-detail-keeps-support-plan | PASS（A detail；plan preview kept） |
| filter-needs-review-keeps-availability-rule | PASS（A/C true；F false） |
| preserve-overview-c-today-action | PASS |
| preserve-unselected-stop | PASS |
| preserve-access-denied | PASS |

## Non-claims

```text
This smoke ≠ Ready GO
This smoke ≠ Merge GO
This smoke ≠ Deploy / SharePoint write / #299 Close
```
