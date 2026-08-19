# SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 — Fresh Review materials

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review materials（implementation PR）
Unit: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1
PR: #447（Draft）
Implementation verified HEAD: 4664c0f1b22f05d21f341f4c6334781012598fff
Selection: Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 SELECTED / LOCKED
Scope Freeze: support-plan-management-list-demo-1-scope.md
Implementation Start: support-plan-management-list-demo-1-implementation-start.md
Browser smoke: support-plan-management-list-demo-1-browser-smoke.md
Issue owner: #444 OPEN
Status: MATERIALS READY
Human Fresh Review GO: NOT AUTHORIZED by this document
Human Ready / Merge / Deploy: NOT AUTHORIZED
#444 close / #70 reopen: NOT AUTHORIZED
LIVE WRITE / SharePoint mutation: NOT AUTHORIZED
```

## Authority

Plan stop: Draft PR + Fresh Review materials. Human Fresh Review is a **separate** GO.

```text
These materials ≠ Human Fresh Review PASS
These materials ≠ Human Ready GO
These materials ≠ Merge GO
These materials ≠ Deploy
These materials ≠ #444 Close
```

## Suggested review matrix

| # | Check | Evidence |
|---|---|---|
| R1 | Scope = presentation-only Planning PC list | Implementation Start IN/OUT; slice flags |
| R2 | PLANNER × users 未選択のみ新一覧 | `isPlannerSupportPlanManagementListRole`; ADMIN/FIELD → UsersList |
| R3 | SHELL-UX-7: nav は 概要 / 利用者 / 記録 | AppShellChrome primary nav unchanged |
| R4 | `h1` = 支援計画。nav ラベル「利用者」は不変 | copy + smoke desktop-planner-list |
| R5 | FIELD_STAFF UsersList 非変更 | `git diff` empty vs `UsersList.tsx`; smoke regression |
| R6 | Family P KPI 導出（要確認=2 / 見直し時期=1 / 観察待ち=1） | `buildFamilyPCounts`; smoke `kpiNeeds=2` |
| R7 | Family R 語彙を上書きしない | Family P note copy |
| R8 | 5 状態 + 状態≠要対応 | fixture test; StatusBadge + 要対応 channel |
| R9 | 承認済み / 最終承認者なし | copy fail-closed + smoke forbidden tokens |
| R10 | 90日失効なし。見直し目安のみ | reviewWindowLabel; forbidden 90日/失効 |
| R11 | Aさん 詳細 1 操作（UserDetail 飛ばし） | `existing-plan` nav; smoke desktop-detail-one-click |
| R12 | B/C/D synthetic detail。E 新規作成 disabled | NextSurface; smoke create / synth-detail |
| R13 | Schema 1.0.0 / domain 非変更 | empty diff `src/` `contracts/` |
| R14 | a11y A11Y-HD-08 / A11Y-SPML-01 | `check:a11y` 35 checks |
| R15 | browser smoke 9/9 + PLANNING-PC 4/4 + REVIEW-NEW-VERSION 6/6 | smoke evidence docs |
| R16 | Ready / Merge / Deploy / #444 close を自動進行しない | Draft PR HOLD |

## Evidence inspected

```text
Verified implementation family: 4664c0f1b22f05d21f341f4c6334781012598fff
Core:
  spfx/src/shell/users/SupportPlanManagementList.tsx
  spfx/src/shell/users/SupportPlanManagementListUx.module.scss
  spfx/src/shell/users/SupportPlanManagementNextSurface.tsx
  spfx/src/shell/users/support-plan-management-list-*.ts
  spfx/src/shell/ux/AppShellChrome.tsx
  spfx/src/shell/ux/presentation-role.ts
  spfx/src/shell/users/SupportPlan.tsx（optional backLabel only）
Unchanged safety:
  spfx/src/shell/users/UsersList.tsx（empty diff vs main）
  src/domain / contracts（empty diff vs main）
Smoke:
  spfx/smoke/support-plan-management-list-demo-1/ 9/9 PASS
  spfx/smoke/planning-pc-demo-1/ 4/4 PASS
  spfx/smoke/support-plan-review-new-version-demo-1/ 6/6 PASS
```

## Verification recorded

```text
Root tests: 732 PASS
SPFx Heft: 285 / 285 PASS
check:a11y: PASS（35 checks）
lint / typecheck / check:scope: PASS
LIVE tenant I/O: none
```

## Known P2（non-blocking）

```text
P2-1: #444 Issue 本文への Visual Decision 追記は Human 投稿
      （docs/architecture/issue-444-visual-decision-record-draft.md）
P2-2: Demo host verification / Redeploy は Merge 後の独立 Human GO
```

## Stop / HOLD

```text
Do not submit Fresh Review PASS as Human GO from this packet
Do not Ready / Merge
Do not close #444
Do not reopen #70
Do not Deploy / LIVE WRITE
```
