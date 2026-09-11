# SBS-MGMT-HOME — 5-Persona Real-Browser Simulation 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME
kind: 5-PERSONA REAL-BROWSER SIMULATION
mode: READ-ONLY UX TEST
date: 2026-09-11
agent HEAD (docs packet): 419aaac9966b3c07a645dfbc5e4aac0f388be498
origin/main at run: efb5ef9c5bac2c1ee2778a4eb7bfcf2eac27df80
target URL:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo/SitePages/Home.aspx
loaded asset exact identity: NOT_OBSERVABLE
synthetic smoke substitute: NOT USED
LIVE WRITE / Deploy / App Catalog / schema / page edit: NOT PERFORMED
Actual Staff Value Check: NOT CONSUMED
Human Ready / Promotion: NOT IMPLIED
Simulation Outcome: BLOCKED
Blocker: SIM-AUTH-001
Cause: authenticated M365 session unavailable
Product UX verdict: NOT OBSERVED
SIM-AUTH-001 product Issue: DO NOT FILE
```

## Boundary

```text
This packet
= authenticated real SharePoint browser attempt
!= Actual Staff Value Check
!= synthetic / presentation substitute
!= Management Home product PASS
!= Human Ready / Promotion
```

```text
Simulation substitute is forbidden.
Unauthenticated login wall ≠ Home.aspx staff UX.
Do not infer binary SHA from browser display.
Do not declare Actual Staff PASS.
```

## Authenticated re-run check (2026-09-11T06:04Z)

```text
Home.aspx direct URL again
AUTH_STATE = SIGN_IN_WALL
heading = Sign in
Persona 1–5 = still HOLD
product Issue filed = NO
```

Human login had not occurred in this Computer Use session. UX timing was not started.

## Method

```text
Tool: real desktop Chrome (computer-use)
Start: direct navigation to Home.aspx
Write controls: not clicked (none reached)
Credentials: not entered (no session in this Cloud Agent environment)
Tokens / cookies / account identifiers: not recorded
```

Observed redirect (host + path only; query string omitted):

```text
login.microsoftonline.com
  /<tenant-id>/oauth2/authorize
client_id: SharePoint Online (00000003-0000-0ff1-ce00-000000000000)
```

Visible start heading: `Sign in`

## Start condition (all personas)

Every persona was required to start from the Home.aspx direct URL.

| Field | Observed |
|---|---|
| Requested URL | `.../sites/severe-support-isogo/SitePages/Home.aspx` |
| Landed surface | Microsoft account Sign in |
| SharePoint chrome | NOT RENDERED |
| SPFx shell / Management Home | NOT RENDERED |
| Heading | Sign in |
| Auth session | ABSENT |
| MFA | NOT REACHED |
| Write risk in this session | NONE (login form only; credentials not entered) |

Evidence: `/opt/cursor/artifacts/sbs_mgmt_home_unauthenticated_signin.webp`

## Persona 1 — 慎重なベテラン支援員

```text
Persona: 1 慎重なベテラン支援員
Start state: unauthenticated Microsoft Sign in
Start heading: Sign in
Task result: BLOCKED before task 1
Success / Friction / Blocked: Blocked
迷った箇所: NOT OBSERVABLE (Home.aspx 未到達)
誤解した箇所: NOT OBSERVABLE
クリックしそうになった危険操作: なし（Sign in / Next は認証操作。資格情報は未入力で停止）
必要クリック数: 0（内容操作）
必要時間の概算: ~15s で login wall 確定
重要スクリーンショット: sbs_mgmt_home_unauthenticated_signin.webp
P0 / P1 / P2: product UX findings = 0 OBSERVED
改善候補: 本 Cloud Agent 環境に read-only 認証済みブラウザセッションを供給する（Human）
```

Tasks 1–4（今日の支援 / 適用中計画 / 見るだけ安心 / Home 復帰）: **NOT RUN**.

## Persona 2 — 多忙な現場職員

```text
Persona: 2 多忙な現場職員
Start state: unauthenticated Microsoft Sign in
Start heading: Sign in
Task result: BLOCKED before 30s「今日やること」探索
Success / Friction / Blocked: Blocked
迷った箇所: NOT OBSERVABLE
誤解した箇所: NOT OBSERVABLE
クリックしそうになった危険操作: なし
必要クリック数: 0
必要時間の概算: N/A（業務画面未表示）
重要スクリーンショット: same login wall
P0 / P1 / P2: product UX findings = 0 OBSERVED
改善候補: 認証後に再実行
```

## Persona 3 — 計画・見直し担当職員

```text
Persona: 3 計画・見直し担当職員
Start state: unauthenticated Microsoft Sign in
Start heading: Sign in
Task result: BLOCKED before 対象者 / version / Draft 確認
Success / Friction / Blocked: Blocked
迷った箇所: NOT OBSERVABLE
誤解した箇所: NOT OBSERVABLE（applied vs draft は未観測）
クリックしそうになった危険操作: なし
必要クリック数: 0
必要時間の概算: N/A
重要スクリーンショット: same login wall
P0 / P1 / P2: product UX findings = 0 OBSERVED
改善候補: 認証後に再実行
```

## Persona 4 — 新人・システム不慣れ職員

```text
Persona: 4 新人・システム不慣れ職員
Start state: unauthenticated Microsoft Sign in
Start heading: Sign in
Task result: BLOCKED before 「この画面は何か」判定
Success / Friction / Blocked: Blocked
迷った箇所: NOT OBSERVABLE
誤解した箇所: NOT OBSERVABLE（0件 vs 実施できなかった は未観測）
クリックしそうになった危険操作: なし
必要クリック数: 0
必要時間の概算: N/A
重要スクリーンショット: same login wall
P0 / P1 / P2: product UX findings = 0 OBSERVED
改善候補: 認証後に再実行
```

## Persona 5 — 責任者 / サービス管理視点

```text
Persona: 5 責任者 / サービス管理視点
Start state: unauthenticated Microsoft Sign in
Start heading: Sign in
Task result: BLOCKED before Overview / 見直し対象 / drill-down
Success / Friction / Blocked: Blocked
迷った箇所: NOT OBSERVABLE
誤解した箇所: NOT OBSERVABLE（確認できない vs なし は未観測）
クリックしそうになった危険操作: なし
必要クリック数: 0
必要時間の概算: N/A
重要スクリーンショット: same login wall
P0 / P1 / P2: product UX findings = 0 OBSERVED
改善候補: 認証後に再実行
```

## Product UX findings

| ID | Severity | State | Content | Evidence |
|---|---|---|---|---|
| (none) | — | NOT OBSERVABLE | Management Home / 支援計画 shell は未描画。製品 UX の P0/P1/P2 を確定しない。 | login wall screenshot |

Simulation execution finding（**製品 finding ではない。製品バグ Issue にしない**）:

| ID | Severity | State | Content |
|---|---|---|---|
| SIM-AUTH-001 | TEST-PRECONDITION BLOCKER | OPEN | Cloud Agent ブラウザに M365 認証セッションが無い。Home.aspx 実画面に到達できない。認証済みセッション再実行で解消する。 |

## What was not done (on purpose)

```text
synthetic ManagementHome fixture walkthrough: NOT USED
spfx/smoke management-home cases: NOT USED as this simulation
source ManagementHome.tsx inspection: NOT used as persona evidence
credentials / MFA / token capture: NOT PERFORMED
Save / Apply / Create / Delete / Submit: NOT PERFORMED
plan activation / next-version preparation: NOT PERFORMED
SharePoint List write / schema / Production Binding: NOT PERFORMED
App Catalog / page edit / web part edit: NOT PERFORMED
```

## FINAL REPORT

```text
5-PERSONA REAL-BROWSER SIMULATION

Simulation Outcome = BLOCKED
Blocker = SIM-AUTH-001
Cause = authenticated M365 session unavailable

Persona 1–5 = HOLD
P0 / P1 / P2 = 0 OBSERVED / 0 OBSERVED / 0 OBSERVED

Product UX verdict = NOT OBSERVED
Actual Staff Value Check = NOT CONSUMED
Human Ready / Promotion = NOT IMPLIED
```

5ペルソナUX評価を**実施できなかった**。UXが悪いと判定したのではない。

Cross-persona（製品）:

```text
共通して迷った導線: NOT OBSERVED
30秒以内に把握できない情報: NOT OBSERVED
read-only / write境界: NOT OBSERVED
applied / draft / review 誤認: NOT OBSERVED
Homeへの復帰性: NOT OBSERVED
```

## HOLD

```text
HOLD: no authenticated SharePoint session in this agent environment
HOLD: Management Home start heading / subview (支援計画 vs 支援マネジメント) NOT OBSERVED
HOLD: write-vs-read CTA distinction NOT OBSERVED
HOLD: applied vs draft distinction NOT OBSERVED
```

## Next Actions

```text
NEXT = Authenticated Session Re-run
!= new Definition
!= implementation fix
!= product bug Issue for SIM-AUTH-001

Human:
  Log in to M365 yourself in the Computer Use browser.
  Do not send password or MFA code to the Agent.
  After Sign in is cleared, hand the session to the Agent.

Agent:
  After authenticated Home.aspx is visible, start UX timing.
  Auth time is excluded from task time.
  Re-run Persona 1 → 5, READ-ONLY, LIVE WRITE FORBIDDEN.
  Simulation Outcome remains PASS / CORRECTION / BLOCKED.
  Actual Staff Value Check = NOT CONSUMED.
  Do not substitute smoke or fixture.
  Do not Ready / Merge / Deploy.
  Do not file SIM-AUTH-001 as a product Issue.
```

## Authenticated Session Re-run protocol (not a Definition)

```text
SBS-MGMT-HOME
5-PERSONA AUTHENTICATED REAL-BROWSER SIMULATION

PRECONDITION
- Human logs into M365 themselves
- authenticated browser session is present
- Agent does not receive password or MFA
- start from the same Home.aspx URL

MODE
READ-ONLY
LIVE WRITE = FORBIDDEN

RE-RUN
Persona 1 → 5 in the same order

IMPORTANT
UX timing starts after Sign in is cleared.
Authentication time is not included in task time.
```
