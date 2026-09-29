# SBS-PLANNER — PL-HTA Re-Run Human Session Packet

Docs-only session packet for **Human PL-HTA Re-Run** against Product Basis `main@35cf211aaef9d30975775b531947ac93283d6d5e` (PR #686 merge). This record **consumes** Human PL-HTA Re-Run GO and stages usable-session materials. It does **not** establish New PL-HTA PASS, does **not** rewrite Historical PL-HTA FAIL, and does **not** authorize Deploy / LIVE WRITE.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-PLANNER
unit: SBS-PLANNER PL-HTA RE-RUN
kind: Human Task Acceptance re-run session packet
mode: docs-only GO consumption + rendered review materials
date: 2026-09-20

Product Basis (exact): 35cf211aaef9d30975775b531947ac93283d6d5e
  = Merge of PR #686 (PLANNER PL-HTA Correction-1 Product bind)
Implementation lineage HEAD (pre-merge): c65c1e9e013c18c35a34676f56b275c26a7666c8
Historical PL-HTA FAIL identity (preserved; Class H):
  bound main: 7414f9d08f6fcf64829fad66c3df2355e94b0bc7
  PL-HTA-1: FAIL
  PL-HTA-2: FAIL
  Overall: FAIL / NOT CONFIRMED
  record (lineage PR #682): docs/architecture/sbs-planner-pl-hta-human-task-acceptance-decision.md

Human speech-act (this turn):
  SBS-PLANNER PL-HTA RE-RUN
  Human PL-HTA Re-Run GO
  = GO / CONSUMED
  PL-HTA execution = AUTHORIZED
  PL-HTA result = NOT YET ESTABLISHED
  Deploy GO = NOT CONSUMED
  LIVE WRITE = HOLD

Smoke ≠ HTA: held
Dedicated Class V harness allPass @ Product Basis = observation only
  ≠ New PL-HTA PASS
  ≠ business completion
```

---

## Authority held

```text
Human PL-HTA Re-Run GO     = GO / CONSUMED
PL-HTA execution           = AUTHORIZED
PL-HTA result              = NOT YET ESTABLISHED
Historical PL-HTA FAIL     = PRESERVED
New PL-HTA PASS            = NOT YET ESTABLISHED
Deploy GO                  = NOT CONSUMED / HOLD
LIVE WRITE                 = HOLD
Ready / Merge (this packet)= NOT APPLICABLE (Product already merged via #686)
Issue close                = NOT AUTHORIZED
Production Binding         = NOT AUTHORIZED
```

Agent / Review / CI must **not** auto-promote harness PASS or this packet into New PL-HTA PASS, Deploy, or LIVE WRITE.

---

## Locked criteria (Correction-2 C9; unrewritten)

### PL-HTA-1

```text
Given: PLANNERが適用中の計画を確認する
When: 支援計画 Destination を開く
Then: Current がどれか分かり、Draft / 次版を適用中と誤認しない
And: 次の工程（モニタリングまたは見直し）が入口から辿れる
And: Global が 今の工程 と 探す のみでも、サイクル内の現在位置が分かる
```

Human checklist (this re-run; also confirm no-context fail-closed):

| ID | Human question | Status |
|---|---|---|
| PL-HTA-1a | 対象利用者・計画を選び、支援計画（D-PLAN）が実際の支援計画として読めるか | AWAITING HUMAN |
| PL-HTA-1b | 現行版 と 次版/下書き を誤認しないか | AWAITING HUMAN |
| PL-HTA-1c | ①〜⑥の流れが理解できるか | AWAITING HUMAN |
| PL-HTA-1d | 対象計画未選択では次工程を勝手に推測しないか（cycle unknown / Primary disabled） | AWAITING HUMAN |

### PL-HTA-2

```text
Given: PLANNERが期間の記録を見る
When: モニタリング Destination を開く
Then: 0件 と 実施できなかった を別意味として読める
And: Browser Smoke の PASS 表示を業務完了と取り違えない
```

| ID | Human question | Status |
|---|---|---|
| PL-HTA-2a | D-MONITOR が実際の MonitoringView として読めるか | AWAITING HUMAN |
| PL-HTA-2b | 0件 と 実施できなかった を別の意味として理解できるか | AWAITING HUMAN |
| PL-HTA-2c | Smoke の PASS 表示を業務完了と誤認しないか | AWAITING HUMAN |

---

## Evaluation method (usable session)

Synthetic Demo presentation only. No LIVE WRITE / tenant I/O / Deploy.

```text
entry = Demo presentation-role（計画担当）. Do NOT inject presentationRole.
Do NOT use ?cycle= as D-PLAN / D-MONITOR bind proof.
Lawful context acquisition = Global 探す → user-a existing-plan.
Synthetic-detail (user-b) does NOT establish context.
viewport desktop = 1280×900 (primary Human judgment)
harness (observation only) = spfx/smoke/sbs-planner-pl-hta-correction-1/
local review URL = http://127.0.0.1:4202/index.html
```

Session path for Human judgment:

1. Demo → **計画担当** → first paint（context none / cycle unknown / Primary disabled）
2. Global **探す** → list（D-FIND-PERSON; not D-PLAN）
3. user-b 詳細 → context remains none（fail-closed held）
4. user-a existing-plan → context live / cycle ②
5. **今の工程** → Primary Action → **D-PLAN** = existing SupportPlan（現行版 vs 次版/下書き、①〜⑥）
6. 版切替 / ④モニタリング in-flow → **0件** copy（≠ 実施できなかった）
7. **今の工程** → Primary Action → **D-MONITOR** = existing MonitoringView（Smoke PASS 文字列なし）

---

## Rendered review materials (Product Basis 35cf211)

Artifacts under `/opt/cursor/artifacts/sbs-planner-pl-hta-rerun-review/` (and walkthrough copies). These are **Human judgment materials**. Dedicated harness `allPass=true` is Class V observation only and is **not** New PL-HTA PASS.

| Capture | Human question aid |
|---|---|
| `01-no-context-unknown-fail-closed.png` | PL-HTA-1d — no plan selected; next step not guessed |
| `02-find-person-list-not-d-plan.png` | 探す is person list, not D-PLAN |
| `03-synthetic-detail-not-context.png` | user-b does not establish context |
| `04-existing-plan-establishes-context.png` | user-a existing-plan establishes lawful context |
| `05-d-plan-bound-support-plan.png` | PL-HTA-1a–1c — D-PLAN as SupportPlan; Current vs 次版; ①〜⑥ |
| `06-d-monitor-bound-monitoring-view.png` | PL-HTA-2a / 2c — MonitoringView; no Smoke PASS as business completion |
| `07-zero-not-not-performed.png` | PL-HTA-2b — 0件 ≠ 実施できなかった |
| `smoke-results.json` | harness observation only (`smokePassIsNotBusinessCompletion=true`) |

Walkthrough aliases:

- `/opt/cursor/artifacts/pl-hta-rerun-01-no-plan-selected-fail-closed.png`
- `/opt/cursor/artifacts/pl-hta-rerun-02-d-plan-support-plan-current-vs-draft.png`
- `/opt/cursor/artifacts/pl-hta-rerun-03-d-monitor-monitoring-view.png`
- `/opt/cursor/artifacts/pl-hta-rerun-04-zero-not-not-performed.png`

---

## Agent observation notes (NOT Human verdict)

Read-only notes to aid Human judgment. **Do not treat as PASS/FAIL.**

- No-context D-HOME: cycle=`unknown`, Primary Action disabled, copy indicates 工程不明 / 次の一手へ進めない.
- After user-a existing-plan + Primary Action: D-PLAN mounts existing SupportPlan with 現行版 labeling and ①〜⑥ process nav; Overview dashboard is not the Destination body.
- In-flow monitoring section shows explicit copy that **0件** is not **実施できなかった**.
- D-MONITOR Destination mounts MonitoringView host; body text does not present `Browser Smoke PASS` / `allPass` as business completion.
- Dedicated harness at Product Basis: `allPass=true` with `smokePassIsNotBusinessCompletion=true` — observation only.

---

## Required Human result form

When Human finishes visual judgment, record exactly:

```text
SBS-PLANNER PL-HTA RE-RUN RESULT
Product Basis
= 35cf211aaef9d30975775b531947ac93283d6d5e
PL-HTA-1
= PASS / FAIL
PL-HTA-2
= PASS / FAIL
Overall Human Task Acceptance
= PASS / FAIL / NOT CONFIRMED
Observed issue
= NONE / <具体的な違和感>
```

Until that Human result is recorded:

```text
Historical PL-HTA FAIL = PRESERVED
New PL-HTA PASS        = NOT YET ESTABLISHED
Deploy                 = HOLD
LIVE WRITE             = HOLD
```

---

## What this packet does not authorize

```text
New PL-HTA PASS inference from smoke / this packet
Historical FAIL rewritten to PASS
Deploy GO / LIVE WRITE / Production Binding
Ready / Merge of unrelated Product work
Issue mutation / existing PR mutation
ADMIN_AUDIT / AA-HTA / FE-F005..FE-F010
SharePoint / M365 / Entra / schema mutation
```

---

## Next

```text
Human:
  1. Review rendered materials (or live http://127.0.0.1:4202/index.html)
  2. Fill PL-HTA RE-RUN RESULT form
  3. If Overall PASS: separate Deploy GO remains required (not consumed here)
  4. If FAIL / NOT CONFIRMED: Historical FAIL remains; no Deploy

Agent:
  HOLD on Deploy / LIVE WRITE / New PL-HTA PASS claim
  Await Human RESULT speech-act
```
