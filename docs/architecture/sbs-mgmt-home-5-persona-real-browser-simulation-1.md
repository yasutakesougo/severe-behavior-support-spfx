# SBS-MGMT-HOME — 5-Persona Real-Browser Simulation 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME
kind: 5-PERSONA REAL-BROWSER SIMULATION
mode: READ-ONLY UX TEST
date: 2026-09-11
agent HEAD (docs packet): <filled at commit>
origin/main at run: efb5ef9c5bac2c1ee2778a4eb7bfcf2eac27df80
target URL:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo/SitePages/Home.aspx
loaded asset exact identity: NOT_OBSERVABLE
synthetic smoke substitute: NOT USED
LIVE WRITE / Deploy / App Catalog / schema / page edit: NOT PERFORMED
Actual Staff Value Check: NOT CONSUMED
Human Ready / Promotion: NOT IMPLIED
Simulation Outcome: BLOCKED
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

Simulation execution finding（製品 finding ではない）:

| ID | Severity | State | Content |
|---|---|---|---|
| SIM-AUTH-001 | BLOCKER | OPEN | Cloud Agent ブラウザに M365 認証セッションが無い。Home.aspx 実画面に到達できない。 |

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

Persona 1 = HOLD
Persona 2 = HOLD
Persona 3 = HOLD
Persona 4 = HOLD
Persona 5 = HOLD

P0 = 0 OBSERVED (product UX; Home.aspx content not reached)
P1 = 0 OBSERVED
P2 = 0 OBSERVED

Cross-persona findings:
- 共通して迷った場所: NOT OBSERVABLE。全 Persona が同一 Microsoft Sign in で停止。
- 共通して理解できた場所: NOT OBSERVABLE（業務画面未表示）。
- 最も危険な誤解: NOT OBSERVABLE。推測で製品誤解を確定しない。
- 最も価値の高い改善1〜3件:
  1. Human が認証済み read-only ブラウザセッションを Cloud Agent に供給する
  2. 同一 Start URL から 5 Persona を再実行する
  3. 再実行まで Actual Staff Value Check / Human Ready を消費しない

Simulation Outcome = BLOCKED

Actual Staff Value Check = NOT CONSUMED

Human Ready / Promotion = NOT IMPLIED
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
Human:
  Provide a read-only authenticated browser session for
  isogokatudouhome.sharepoint.com / sites/severe-support-isogo
  without recording secrets in the repository.
  Then re-run this exact 5-persona protocol from Home.aspx.

Agent:
  STOP product UX scoring.
  Do not substitute smoke or local ManagementHome fixture.
  Do not Ready / Merge / Deploy.
```
