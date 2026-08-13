# DEMO-UX-12 — Browser smoke

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-12 — Save badge hierarchy
Kind: browser smoke
Status: PASS / VERIFIED
Harness: spfx/smoke/demo-ux-12/
Port: 4194
Artifacts: /opt/cursor/artifacts/demo-ux-12-browser-smoke/
Result: 9 / 9 PASS
Verified HEAD: bf600e567664ef47bfc19bf521b94a39ef9ae305
Ready / Merge: NOT AUTHORIZED
```

## Cases

| Case | Result |
|---|---|
| save-unsaved | PASS（QUIET；description absent；label 未保存） |
| save-saving | PASS（EMPHASIZED；description visible；≠ saved） |
| save-saved | PASS（QUIET；description absent） |
| save-save_failed | PASS（EMPHASIZED；assertive） |
| save-save_outcome_unknown | PASS（EMPHASIZED；非丸め説明） |
| ready-saved-quiet-keeps-business-first | PASS（Overview Family R / action note 残存） |
| preserve-unselected-stop | PASS |
| preserve-access-denied | PASS |
| preserve-save-outcome-unknown-non-collapse | PASS |

## Companion

`spfx/smoke/shell-ux-2/` assertions updated for QUIET description absence / EMPHASIZED presence（regression harness）.

## Non-claims

```text
This smoke ≠ Ready GO
This smoke ≠ Merge GO
This smoke ≠ Deploy / SharePoint write / #299 Close
```
