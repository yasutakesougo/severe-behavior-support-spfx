# SBS-MGMT-HOME-C — Browser smoke evidence (#554)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SBS-MGMT-HOME-C (#554)
Kind: browser smoke / Planning PC read-only Management Home
Status: PASS / VERIFIED (synthetic smoke)
Date: 2026-09-10
exact HEAD: 845362c3142403cc4282dc2bf4b30a30399065ec
base: origin/main 845cfeb0457b21472bf7cd5115f6b1687b20e527 (#599 merged)
Harness: spfx/smoke/support-plan-management-list-demo-1/
presentationOnly: true
LIVE WRITE / Deploy / SharePoint: NOT AUTHORIZED
Issue #554 close: NOT AUTHORIZED
PR #598 close / merge: NOT AUTHORIZED
Human Ready GO: NOT RECEIVED
```

## Method

```text
Runner: node spfx/smoke/support-plan-management-list-demo-1/run-smoke.mjs
Cases: 13 (9 list regressions + 4 Management Home)
Viewports: 1280×900 and 390×844
Artifacts: /opt/cursor/artifacts/sbs-mgmt-home-c-browser-smoke/
Heft: npx heft test --clean --test-path-pattern "ManagementHome|management-home"
  Successes: 442 / Failures: 0 (full SPFx suite after B2 basis prepare)
```

## Management Home matrix

| Case | Viewport | Assertion | Result |
|---|---|---|---|
| management-home-1280 | 1280×900 | 4 headings readable (h2 width ≥ 80px); 現在の計画 / 見直し / 変更対応 / 次行動 | PASS |
| management-home-390 | 390×844 | same hierarchy, no horizontal overflow | PASS |
| management-home-unavailable | 1280×900 | 確認できません + 推測していません | PASS |
| management-home-mismatch | 390×844 | fail-closed unavailable banner | PASS |

Shared list runner also PASS after locking `現在の版: v3` (stale `Version: v3` token).

## Layout finding closed in this HEAD

Concatenated smoke CSS applied `ReviewDueStateUx` `.card { display:flex; justify-content:space-between }` to Management Home cards. Desktop headings stacked as one character per line. Isolated class names (`homeCard`, `managementHomeGrid`, …) + explicit column flex.

This collision is smoke-harness specific (unhashed module class names). SPFx production CSS modules remain hashed.

## Boundary held

```text
synthetic fixture only
no LIVE WRITE / Deploy / schema / Entra / M365
PR #598 not merged, not force-pushed, not closed
domain contracts unchanged
Rendered Browser Acceptance ≠ Actual Staff Value Check
Actual Staff Re-Check remains required before Human Ready GO
```
