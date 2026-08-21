# DEMO-1 — Browser review / smoke evidence

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: DEMO-1 — Synthetic FIELD_STAFF entry
Kind: browser review / smoke
Status: PASS / VERIFIED
Date: 2026-08-21
main basis: 3922dece1f8a76c09e385d7b786e08b375559215
  Merge pull request #490 from yasutakesougo/feat/demo-1-synthetic-entry-1
Fixture: DEMO_1_FIELD_STAFF_FIXTURE
Harness: spfx/smoke/demo-1/
Runner: node spfx/smoke/demo-1/run-smoke.mjs
Artifacts: /opt/cursor/artifacts/demo-1-browser-smoke/

presentationOnly: true
liveTenantIoAuthorized: false
sharePointRestAuthorized: false
LIVE WRITE: HOLD
Deploy: NOT AUTHORIZED
Production Binding: NOT AUTHORIZED
```

## Checklist results

| # | Check | Result |
|---|---|---|
| 1 | Overview | PASS（heading 概要；nav 概要/利用者/記録） |
| 2 | Today Support | PASS（今日の支援 first section；5 items） |
| 3 | Users | PASS（8 synthetic rows） |
| 4 | User Detail | PASS（Aさん detail via users-detail-button） |
| 5 | Current Procedure | PASS（未実施；canStart=true） |
| 6 | Record Form | PASS（支援手順の記録；save disabled until result） |
| 7 | Daily Records | PASS（日々の記録 destination） |
| 8 | Tablet width | PASS（768px；no horizontal overflow on overview/users） |
| 9 | Keyboard-only | PASS（occurrence→procedure→form；nav users/records） |
| 10 | Network / Console | PASS（SharePoint/Graph requests 0；console errors 0） |

```text
allPass: true
checks: 19 / 19
entry: SITE-ISG + FIELD_STAFF + overview
```

## Boundary held

```text
No SharePoint / Graph network I/O observed
No LIVE WRITE
No Deploy / App Catalog mutation
No Production Binding
Synthetic fixture only
save remains disabled until result selection on Record Form
```

## Method

```text
Harness mirrors ScaffoldShellWebPart DEMO_1_FIELD_STAFF_FIXTURE entry.
CSS: ShellUx + DashboardUx + TodaySupport + Users + UserDetail
     + CurrentProcedure + ProcedureRecordForm + DailyRecords (+ related)
Chrome via puppeteer-core；synthetic presentation only.
```
