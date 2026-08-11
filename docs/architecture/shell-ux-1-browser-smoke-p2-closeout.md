# SHELL-UX-1 — Browser smoke / IR P2 closeout

この文書は、PR #235 Independent Review の **P2（browser smoke 未実施）** を
closeout する証跡正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SHELL-UX-1
Gate: browser smoke（IR P2 on #235）closeout
Human Selection: A GO
Status: PASS / VERIFIED
Date: 2026-08-11
PR: #236
Baseline merge: 1c24f3ebad3819b12cb8ee05f83c6ff558cfbf38
SHELL-UX-1 code merge: 30a1656416e83917b5bad08b0278037c02b8e0fe（#235）
SoT tip at selection: b10168a54d6d76a4702687d70947f19f63d3ccca

Next shell UX slice: NOT SELECTED
Agent auto-select: FORBIDDEN
New Implementation Start: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED by this closeout
#22 adapter continuation: HOLD
SharePoint / M365 / Entra mutation: 0
```

## Authority

```text
Human Selection: A GO
Selected gate: SHELL-UX-1 browser smoke（IR P2）closeout
Scope: browser smoke と P2 closeout のみ

Prior IR（#235 comment 5248377987）:
  Independent Review: PASS
  P0: 0
  P1: 0
  P2: 1 OPEN — browser smoke 未実施（F-001）
```

## Method

```text
Harness: spfx/smoke/shell-ux-1/
  smoke-entry.tsx — mounts AppShellChrome with SHELL_UX_DEFAULT_FIXTURE
  index.html — local presentation stubs
  run-smoke.mjs — esbuild bundle + Chrome（puppeteer-core）assertions

Runner:
  node spfx/smoke/shell-ux-1/run-smoke.mjs

Browser: Google Chrome stable（headless）
Viewport: 1280×900（PC）+ 768×1024（tablet）
Tenant / SharePoint REST: NOT USED
binder host wiring: false
liveTenantIoAuthorized: false
```

## Cases（all PASS）

| Case | Query | Required markers | Result |
|---|---|---|---|
| ready-unsaved | viewMode=ready&saveState=unsaved | app-shell / demo-banner / current-site / save-state / ready-region / shell-body | PASS |
| loading | viewMode=loading&saveState=saving | loading-panel；ready-region absent | PASS |
| access-denied | viewMode=access_denied&saveState=save_failed | access-denied-panel；ready-region absent | PASS |
| retrieval-failed | viewMode=retrieval_failed&saveState=save_outcome_unknown | retrieval-failed-panel；ready-region absent | PASS |
| keyboard-skip-focus | Tab → skip link | focus on 「メイン内容へスキップ」 | PASS |
| tablet-ready | 768×1024 ready | app-shell-chrome present | PASS |

Artifacts（local agent）:

```text
/opt/cursor/artifacts/shell-ux-1-browser-smoke/
  ready-unsaved.png
  loading.png
  access-denied.png
  retrieval-failed.png
  keyboard-skip-focus.png
  tablet-ready.png
  smoke-report.json
```

## P2 disposition

```text
Finding F-001（IR P2 / browser smoke 未実施）
= CLOSED / VERIFIED

Independent Review residual P2 on #235
= CLOSED by this gate
```

## Explicit non-claims

```text
This closeout ≠ next shell UX slice selection
This closeout ≠ #28 Issue Close
This closeout ≠ #22 adapter continuation
This closeout ≠ Deploy / App Catalog republish
This closeout ≠ New Implementation Start
This closeout ≠ live SharePoint smoke
```

## Verdict

```text
SHELL-UX-1 browser smoke = PASS / VERIFIED
IR P2 F-001 = CLOSED / VERIFIED

Next shell UX slice = NOT SELECTED
New Implementation Start = NOT AUTHORIZED
Ready / Merge of this closeout PR = HUMAN-ONLY
```
