# Decision-ILB-1 — Thirty-sixth residual selection

この文書は、Decision-AS-COLUMN-EG-1 Accepted（EG-1+XB-1+AP-1）後の
次 process unit として **Issue Status Reconciliation** を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_THIRTY_SIXTH_RESIDUAL_SELECTION
Status: SELECTED
Selected unit: Issue Status Reconciliation（OPEN Issue triage / close vs body resync）
Follow-up Packet ID: Decision-ISSUE-STATUS-RECONCILE-1
  packet: issue-status-reconciliation-packet.md
  prior assessment: issue-status-reconciliation-assessment.md

Locked basis（再 Decision しない）:
  Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  Decision-AS-SCHEMA-MAPPING-NEXT-1 = Accepted / LOCKED / MT-1+IN-A+CP-1+XB-1
  Decision-AS-COLUMN-NAMES-1 = Accepted / LOCKED / NM-1+CV-REQ+XB-1
  Decision-AS-CHOICE-OPTIONS-1 = Accepted / LOCKED / CO-1+CV-CHOICE-BOTH+XB-1
  Decision-AS-COLUMN-PX-1 = Accepted / LOCKED / PX-1+XB-1+AP-1
  Decision-AS-COLUMN-EG-1 = Accepted / LOCKED / EG-1+XB-1+AP-1
  PR #192 MERGED / Current SoT tip at selection write-up:
    658c790f34adb3489808121a72c6dcccbde97d2f

Current state:
  CN-1 observation = CLOSED
  SharePoint column path Decisions through COLUMN-EG-1 = Accepted
  Human create = AUTHORIZED / NOT STARTED by Acceptance
  Implementation Start = HOLD
  Agent SharePoint mutation = FORBIDDEN
  OPEN Issues ≈ 28（Human attestation）
  Issue body Current/Gate/Dependency = STALE 多数
```

## Selection meaning

この Selection は、column path の次 substantive residual（Human create / VR-1）を
奪わずに、**独立 process debt** として Issue 状態整理だけを選ぶ。

```text
SELECTED:
  Issue Status Reconciliation
  Goal: 「いま判断が必要な Issue」と「将来の実装 Issue」を分離する
  Rule: Issue close ≠ body Current/Gate/Dependency resync
  Rule: 28件を無理に減らさない

Still NOT authorized / FORBIDDEN now:
  Agent GitHub Issue mutation（policy FORBIDDEN；Capability ≠ Authorization）
  一括 Close / 一括本文更新
  Implementation Start
  SharePoint adapter / schema mapping code start
  Agent SharePoint / tenant mutation
  treating Reconciliation as Human create completed
  treating INTENDED as CONFIRMED
  Deploy / real data
```

```text
GitHub Issue connector capability: AVAILABLE
Agent GitHub Issue mutation policy for this Selection / packet: FORBIDDEN
Capability ≠ Authorization
```

Selection ≠ Human create ≠ Implementation Start ≠ mapping-complete。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| A | Human create execution record / evidence | NOT SELECTED as this residual（parallel Human process） |
| B | VR-1 CN-1 re-observation after create | NOT SELECTED（depends on create） |
| **C** | Issue Status Reconciliation | **SELECTED** |
| D | CV extension（MAP-AS-009/010 / ENV） | NOT SELECTED as current |
| E | HOLD / no selection | NOT SELECTED |

```text
Why C now:
  CN-1 is CLOSED；column path through EG-1 is Accepted。
  prior assessment scheduled Reconciliation after CN-1。
  Human 2026-08-10 triage recommends 4-group classification
  and close-first order for #5 / #10 / #11。
  Selecting C does not block Human create as a separate process。
```

## Recommended execution order（LOCKED by packet）

| Step | Target | Action |
|---|---|---|
| ① | #5 / #10 / #11 | superseded 判定 → Close 候補（Human Close） |
| ② | #6 / #8 | OPEN 維持 + Current-state reconciliation |
| ③ | #4 / #9 / #12 / #15〜#19 | 継続必要性の再判定（今まとめて Close しない） |
| ④ | #20以降 / UI系 | 原則バックログとして OPEN 維持 |

## Next

```text
Thirty-sixth residual: SELECTED
Packet: issue-status-reconciliation-packet.md
Human execution: Issue Close / body patch（Agent mutation FORBIDDEN）
Parallel Human process（not this residual）:
  Human create under EG-1
  then VR-1 CN-1 re-observation
```
