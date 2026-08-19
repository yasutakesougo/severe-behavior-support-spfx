# SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 — Fresh Review

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review（implementation PR）
Unit: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1
PR: #447（Draft）
HEAD: 8676665155ee141e05d639576a70f61ef6769c51
Baseline main: ea6ec1c1671041c87b9bb0222e1d23370aadb806
Human GO: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 PR #447 FRESH REVIEW GO
Review authority: #419 / Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1
UI owner: #444 OPEN（SP-LC-5）
Visual Decision: Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 SELECTED / LOCKED
Scope Freeze: support-plan-management-list-demo-1-scope.md
Implementation Start: support-plan-management-list-demo-1-implementation-start.md
Browser smoke: support-plan-management-list-demo-1-browser-smoke.md
Materials: support-plan-management-list-demo-1-fresh-review-materials.md
Status: PASS
Findings: P0 = 0 / P1 = 0 / P2 = 2 OPEN（process） / P3 = 1 OPEN（GO text vs lock）
Human Ready: NOT AUTHORIZED
Merge: NOT AUTHORIZED
LIVE WRITE: HOLD
Deploy: NOT AUTHORIZED
#444 close / #70 reopen: NOT AUTHORIZED
```

## Authority

```text
Fresh Review PASS ≠ Human Ready GO
Fresh Review PASS ≠ Merge GO
Fresh Review PASS ≠ Deploy
Fresh Review PASS ≠ LIVE WRITE
Fresh Review PASS ≠ #444 Close
Fresh Review PASS ≠ #70 reopen
```

Independent SSOT for this review is Visual Decision
`Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1`, not the abbreviated 3-state list
in the Fresh Review GO body（see P3-1）.

## Review matrix

| # | Check | Result |
|---|---|---|
| R1 | Visual hierarchy: Family P KPI → 今日やること → 支援計画一覧 | **PASS** |
| R2 | Row 7 elements: 利用者 / 状態 / Version / 最終観察日 / 見直し目安 / 要対応 / 操作 | **PASS** |
| R3 | 状態 ≠ 要対応。5 locked work states. Schema status not expanded | **PASS** |
| R4 | D1=B Active=適用開始 ≠ 最終承認。D4=A 過去版上書きなし。D5=B 見直し目安 ≠ 90日失効。D6=A 観察不足で無効化しない | **PASS** |
| R5 | DEC-008: 承認済み / 最終承認者 / サービス管理責任者の必須承認 を出さない | **PASS** |
| R6 | synthetic only。slice flags forbid live I/O / write / schema | **PASS** |
| R7 | Desktop / narrow / 200% / keyboard / focus / no required h-scroll / label not color-only | **PASS** |
| R8 | FIELD_STAFF UsersList empty diff。PLANNING-PC / REVIEW-NEW-VERSION smoke PASS。save-state files empty diff | **PASS** |
| R9 | SHELL-UX-7 nav 概要 / 利用者 / 記録。Plans nav なし。h1 支援計画 | **PASS** |
| R10 | Ready / Merge / Deploy / #444 close を自動進行しない | **PASS** |

## Evidence inspected

```text
HEAD: 8676665155ee141e05d639576a70f61ef6769c51
Core:
  spfx/src/shell/users/SupportPlanManagementList.tsx
  spfx/src/shell/users/SupportPlanManagementListUx.module.scss
  spfx/src/shell/users/SupportPlanManagementNextSurface.tsx
  spfx/src/shell/users/support-plan-management-list-*.ts
  spfx/src/shell/ux/AppShellChrome.tsx
  spfx/src/shell/ux/presentation-role.ts
  spfx/src/shell/users/SupportPlan.tsx（optional backLabel only）
Unchanged vs main:
  spfx/src/shell/users/UsersList.tsx
  spfx/src/shell/ux/save-state.ts / SaveStatePresentation.tsx
  src/ / contracts/ / spfx/src/adapters/
Smoke artifacts:
  /opt/cursor/artifacts/planner_support_plan_list_desktop.png
  /opt/cursor/artifacts/planner_support_plan_detail_one_click.png
  /opt/cursor/artifacts/planner_support_plan_create_entrance.png
  /opt/cursor/artifacts/planner_support_plan_list_200_percent.png
  /opt/cursor/artifacts/field_staff_users_list_regression.png
Issue live:
  #444 OPEN（comments: 0; Visual Decision 未投稿）
  #70 CLOSED / not_planned（reopen なし）
```

## Visual Decision alignment notes

Locked work states（label channel）:

```text
適用中 / 見直し時期 / 観察確認 / 手順更新中 / 未作成
```

Locked 要対応（empty hidden）:

```text
見直しの準備 / 観察の確認 / 手順の更新確認 / 計画の作成
```

CTA is a third channel: 詳細を見る XOR 新規作成.

Aさん row: 適用中 + Version v3 + 最終観察日 + 見直し目安 + 要対応なし.
Cさん: 観察確認（状態）≠ 観察の確認（要対応）. 計画は無効表示しない.
Eさん: 未作成（状態）≠ 計画の作成（要対応）≠ 新規作成（CTA）. 作成する is disabled.

「作成中」は Visual Decision に無い。実装は出していない（正しい）.

## Verification recorded（not re-executed in this review）

```text
lint / typecheck: PASS（known）
root tests: 732 PASS（known）
Heft: 285 / 285 PASS（known）
check:a11y: 35 PASS（known）
browser smoke: 9 / 9 PASS（known）
PLANNING-PC: 4 / 4 PASS（known）
REVIEW-NEW-VERSION: 6 / 6 PASS（known）
```

## Findings

| Sev | ID | Status | Note |
|---|---|---|---|
| P2 | SPML-P2-1 | OPEN | `#444` Visual Decision Record は draft のみ。Human 投稿待ち。Agent 投稿禁止。実装欠陥ではない |
| P2 | SPML-P2-2 | OPEN | Demo host verification / Redeploy は Merge 後の独立 Human GO。本 PR 外 |
| P3 | SPML-P3-1 | OPEN | Fresh Review GO §3 の状態「適用中 / 作成中 / 未作成」は Visual Decision の 5 状態と一致しない。実装は Visual Decision に従う。修正しない |

```text
P0 = 0
P1 = 0
P2 OPEN = 2（process / next-gate）
P3 OPEN = 1（GO text vs lock; no code change）
Independent Fresh Review: PASS
```

## Strict progression

```text
1. This Fresh Review = PASS
2. Human Ready Decision = NOT AUTHORIZED（separate）
3. Merge = NOT AUTHORIZED
4. LIVE WRITE = HOLD
5. Deploy / Redeploy = NOT AUTHORIZED
6. #444 close / #70 reopen = NOT AUTHORIZED
CURRENT ACTION: STOP
```
