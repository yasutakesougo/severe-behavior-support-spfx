# PROCESS-OPT-V1 — Selection / Design Packet

この文書は、**PROCESS-OPT-V1（Process Optimization v1）** の
選定・設計固定パケットである。

Canonical process SoT: [`../process/process-optimization-v1.md`](../process/process-optimization-v1.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: PROCESS-OPT-V1
Kind: docs-only process design / proposal canonicalization
Status: PROPOSED / READY_FOR_HUMAN_DECISION
Accepted / LOCKED: NO
Implementation Start: NOT AUTHORIZED
Permission expansion: NONE
SharePoint / M365: UNCHANGED / FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Why this unit now

Recent main 上で次が揃った:

| PR | Unit / Topic | Relevance |
|---|---|---|
| #195 | DEC-AA-001 Auto-Approval Policy v1 | AUTO / HUMAN-ONLY / FORBIDDEN 分類正本 |
| #196 | DEC-AA-003 AUTO-UNTIL-GATE Policy v1 | local loop / stop-before-GitHub |
| #197 | OP-3 domain logical schema | AUG-PILOT-1 / LOW-class domain evidence |
| #198 | Routine AUG v1 | standard operating model / per-slice Start |
| #199 | GOV-RULE-06 review cadence domain | repeated LOW-class domain slice |
| #200 | GOV-RULE-05 review anchor domain | repeated LOW-class domain slice |
| #201 | GOV-RULE-07 review notice domain | repeated LOW-class domain slice |

観察:

- Accepted / LOCKED authority に対する機械的 domain representation が連続している
- それでも **per-slice Human Implementation Start** と **Human next-slice selection** が毎回必要
- Process Optimization v1 は、この Human 停止を将来減らすための **分類と候補モデル** を正本化する

## Selected option

```text
Option POV1-A — Define risk model + LOW auto-loop proposal without enabling it
```

不採用（本 unit）:

| Option | Reason |
|---|---|
| POV1-B — Immediately enable LOW Start / Ready auto | DEC-AA / Routine AUG を黙って緩和するため禁止 |
| POV1-C — Rewrite DEC-AA-001 / DEC-AA-003 semantics | OUT OF SCOPE / semantic change FORBIDDEN |
| POV1-D — Project-wide Implementation Start | HIGH / NOT GRANTED |

## Fixed design summary

1. Risk classes: **LOW / MEDIUM / HIGH**
2. LOW auto-loop: **DEFINED / NOT ENABLED**
3. Stop Conditions: explicit list + `UNKNOWN → HOLD`
4. Human Gate candidates: Start / Ready 自動化候補、Merge = HUMAN-ONLY
5. LOW batch: 2–4 related slices、slice-level attribution 維持
6. Human-facing status: GREEN / YELLOW / RED（内部 state は維持）

## Authority relationship

| Authority | Relationship |
|---|---|
| DEC-AI-ORG-003 | 最上位。矛盾時 HOLD。本 unit は緩和しない |
| DEC-AA-001 | AUTO 分類上位。semantic change しない |
| DEC-AA-003 | AUG loop 上位。semantic change しない |
| Routine AUG v1 | 現行標準運用。上書きしない。衝突は CONFLICT NOTE |
| PROCESS-OPT-V1 | 下位 proposal。Accepted 後も enable は別 GO |

## Deliverables（本 unit）

| File | Role |
|---|---|
| `docs/process/process-optimization-v1.md` | process SoT |
| `docs/architecture/decision-process-optimization-v1-selection.md` | 本 selection packet |
| `docs/architecture/decision-process-optimization-v1-independent-review.md` | Independent Review |
| `docs/process/ai-governance.md` | 最小参照追加のみ |

## Explicit non-deliverables

```text
application / domain / test code
SharePoint / M365 / Entra / Deploy
Issue mutation
Ready / Merge
DEC-AA-001 / DEC-AA-003 rewrite
Routine AUG overwrite
AUTO permission expansion
project-wide Implementation Start
```

## Human Decision requested

Human に求める判断は次のみ:

```text
PROCESS-OPT-V1 Option POV1-A を
  Accepted / LOCKED とするか
  改訂指示とするか
  却下するか
```

Accepted となっても、次は **自動では有効化されない**:

```text
LOW Implementation Start auto-allow
Ready auto-transition
next LOW slice auto-advance
```

これらは別 Human Explicit GO / 必要なら DEC-AA / Routine AUG 改訂 unit を要する。

## Done criteria（docs-only）

- risk classification が LOW / MEDIUM / HIGH で定義されている
- LOW auto-loop が DEFINED かつ NOT ENABLED と明示されている
- Stop Conditions と `UNKNOWN → HOLD` が明文化されている
- Human Gate 候補と現行 HUMAN-ONLY の差が CONFLICT NOTE として残っている
- Merge = HUMAN-ONLY、SharePoint/M365 UNCHANGED、permission expansion NONE
- Independent Review が P0=0 / P1=0（P2 は記録可）
- mechanical verification（docs-only 適用分）PASS
