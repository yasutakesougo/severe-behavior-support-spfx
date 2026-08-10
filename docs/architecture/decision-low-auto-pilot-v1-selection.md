# LOW-AUTO-PILOT-V1 — Selection / Decision Packet

この文書は、**LOW-AUTO-PILOT-V1** の選定・Option 固定パケットである。

Canonical process SoT: [`../process/low-auto-pilot-v1.md`](../process/low-auto-pilot-v1.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: LOW-AUTO-PILOT-V1
Kind: docs-only enablement Decision packet
Status: READY_FOR_HUMAN_DECISION
Decision requested: LA1-A Option A — ACCEPT / HOLD
Recommended: LA1-A ACCEPT
Authorization effect (this packet): NONE
Implementation: DO NOT START
SharePoint / M365: UNCHANGED / FORBIDDEN
Merge: HUMAN-ONLY
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Why this unit now

| Input | State |
|---|---|
| PROCESS-OPT-V1 | ACCEPTED / LOCKED（PR #202 MERGED） |
| LOW auto-loop | DEFINED / NOT ENABLED |
| Recent LOW-class evidence | OP-3 / GOV-RULE-05 / 06 / 07 domain slices |
| Risk of broad enable | HIGH — SharePoint / 制度 / Merge 境界を誤って緩める |

観察:

- pure domain representation は連続して成功している
- それでも毎回 Human Start + next-slice selection が必要
- 全面自動化ではなく、**狭い pilot** で速度と安全境界を両立する判断が必要

## Options

### LA1-A — Option A（推奨）

```text
限定 LOW pilot を ENABLE
対象: Accepted/LOCKED + LOW + pure domain/validator/tests/export wiring
自動化: Start / verification / IR / bounded repair / next unique LOW slice
上限: 2〜4 slices / 1 batch / post-pilot Human review
維持: Merge HUMAN-ONLY; Ready auto NOT included; M365 FORBIDDEN
```

### LA1-B

```text
定義だけ維持して NOT ENABLED
```

### HOLD

```text
LA1-A を ACCEPT しない（実質 LA1-B と同趣旨）
```

## Explicit non-claims of this packet

```text
Packet creation ≠ ACCEPT
Packet IR PASS ≠ ENABLE
ACCEPT ≠ project-wide Start
ACCEPT ≠ Merge automation
ACCEPT ≠ Ready automation
ACCEPT ≠ MEDIUM/HIGH automation
Implementation of domain slices: DO NOT START in this unit
```

## Human Decision line

```text
LA1-A — Option A
Decision:
ACCEPT / HOLD
```

## Done criteria（docs-only packet）

- Option A envelope（対象 / 停止 / Human-only / pilot 上限）が固定されている
- Ready auto を本 pilot に含めないことが明示されている
- Merge = HUMAN-ONLY / M365 FORBIDDEN が明示されている
- Routine AUG 衝突が CONFLICT NOTE として記録され、本文上書きしていない
- Authorization effect of this packet = NONE
- Independent Review P0=0 / P1=0（P2 記録可）
- mechanical verification PASS
