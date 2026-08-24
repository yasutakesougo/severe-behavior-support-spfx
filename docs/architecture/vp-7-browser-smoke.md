# VP-7 — Browser smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: VP-7 — optical alignment / visual balance
Kind: browser smoke / verification run
Status: PASS / VERIFIED
Date: 2026-08-24
PR: #503
Definition exact HEAD: 0f42ca3e7c77d5094620978a77f95e7d0e104150
Implementation exact HEAD: 7542797e8b95a58e26cee075bbc2eb89e9e47e03
Changed files: 1 (ProcedureRecordCorrectionUx.module.scss)

liveTenantIoAuthorized: false
sharePointRestAuthorized: false
graphRequestsAuthorized: false
deployAuthorized: false
```

## Method

```text
Harness: spfx/smoke/vp-7-optical-alignment/
Runner: node spfx/smoke/vp-7-optical-alignment/run-smoke.mjs
Fixture: synthetic Procedure Record Correction (kiosk recorded occurrence)
Before CSS: definition-base SCSS without .resultOption input margin-top rule
After CSS: exact HEAD SCSS with margin-top: sbs.$space-1 (4px)
Artifacts: /opt/cursor/artifacts/vp-7-browser-smoke/
```

## Selector under test

```scss
.resultOption input {
  margin-top: sbs.$space-1;
}
```

Optical intent: align Correction result-radio vertical position with the existing Form surface rule.

## Before / After comparison (same fixture, same viewports)

| Viewport | Before input margin-top | After input margin-top | Option hit area (W×H) unchanged | Input size (W×H) unchanged |
|---|---|---|---|---|
| desktop (1440×900) | 3px (UA default) | 4px (`$space-1`) | 956×67.8 → 956×67.8 | 13×13 → 13×13 |
| tablet (768×1024) | 3px | 4px | 700×67.8 → 700×67.8 | 13×13 → 13×13 |
| narrow (390×844) | 3px | 4px | 322×67.8 → 322×67.8 | 13×13 → 13×13 |

Screenshots (full page, result-option section visible):

- Before desktop: `/opt/cursor/artifacts/vp-7-browser-smoke/desktop-before.png`
- After desktop: `/opt/cursor/artifacts/vp-7-browser-smoke/desktop-after.png`
- Before tablet: `/opt/cursor/artifacts/vp-7-browser-smoke/tablet-before.png`
- After tablet: `/opt/cursor/artifacts/vp-7-browser-smoke/tablet-after.png`
- Before narrow: `/opt/cursor/artifacts/vp-7-browser-smoke/narrow-before.png`
- After narrow: `/opt/cursor/artifacts/vp-7-browser-smoke/narrow-after.png`

## Browser results

| Case | Assertion | Result |
|---|---|---|
| desktop-before-render | correction surface + 3 result options | PASS |
| desktop-after-render | correction surface + 3 result options | PASS |
| desktop-before/after-console-errors | console errors = 0 | PASS |
| desktop-before/after-network-boundary | SharePoint / Graph requests = 0 | PASS |
| desktop-before/after-overflow | horizontal overflow = false | PASS |
| desktop-before/after-focus-ring | radio focus-visible outline 2px solid | PASS |
| desktop-before-no-explicit-offset | before margin-top < after margin-top | PASS |
| desktop-after-space-1-offset | after margin-top = 4px (`$space-1`) | PASS |
| desktop-hit-area-unchanged | label bounding box unchanged | PASS |
| desktop-input-size-unchanged | radio input box unchanged | PASS |
| desktop-focus-ring-unchanged | outline width/style before = after | PASS |
| tablet-* (same matrix) | all assertions above | PASS |
| narrow-* (same matrix) | all assertions above | PASS |

```text
allPass: true
cases: 45 / 45
sharePointGraphRequests: 0
exactHead: 7542797e8b95a58e26cee075bbc2eb89e9e47e03
definitionBase: 0f42ca3e7c77d5094620978a77f95e7d0e104150
```

## Focus ring evidence

Radio input focused via `page.focus('[data-field-workflow="correction-result-option"] input')`.

Before and after (all viewports):

```text
outlineWidth: 2
outlineStyle: solid
outlineColor: rgb(3, 120, 124)
focusVisible: true
```

Focus ring unchanged by the optical offset.

## Boundary held

```text
No TSX / TS / JS changes exercised in smoke (SCSS-only diff)
No ShellUx.module.scss / tokens changes
No container width / padding / gap / spacing-token assignment changes
No color / shadow / font-weight changes
No SharePoint / Graph / live I/O
No horizontal overflow introduced at desktop / tablet / narrow
Hit area (label bounding box) and radio input size unchanged
```

## P1-1 closure

VP-7 Definition §9 runtime evidence requirements:

| Requirement | Status |
|---|---|
| desktop / tablet / narrow Before-After same-condition comparison | VERIFIED |
| focus ring unchanged | VERIFIED |
| hit area unchanged | VERIFIED |
| horizontal overflow unchanged | VERIFIED |
| console errors = 0 | VERIFIED |
| SharePoint requests = 0 | VERIFIED |
| Graph requests = 0 | VERIFIED |
