# GOV-PERF HOLD Resolution Bundle — Human Selection Packet

この文書は、PR #285 MERGED 後の **次 residual** として
**GOV-PERF-02 / 06 / 07 / 08 / 09** を
**HOLD Resolution Bundle** で SELECT する docs-only Selection Packet である。

目的は、既存 HOLD を Agent の推測で解除せず、
実環境 evidence と Human Decision に必要な材料をまとめて取得すること。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-PERF-HOLD-RESOLUTION-1
Kind: Human Selection（#19 residual / PERF HOLD resolution bundle）
Status: SELECTED / LOCKED（bundle GO boundary）
Human Decision: SELECT GOV-PERF HOLD Resolution Bundle
Date: 2026-08-12
PR: #286（Selection / evidence / packets / liftability / IR）

Baseline:
  main tip = e64ad1d035d5e071841a5d19ced5f6e3c7abf407
  GOV-PERF-01〜11 bundle = MERGED（PR #285）
  GOV-PERF-01A / 03C / 04C / 05D / 10A / 11D = Accepted / LOCKED
  GOV-PERF-02 / 06 / 07 / 08 / 09 = SELECTED / LOCKED / HOLD（UNCHANGED by this Selection）

Authorized:
  docs-only Selection / evidence inventory
  PERF-07 / 08 / 09 read-only observation recording
  PERF-02 / 06 Decision Packet（値発明なし）
  HOLD解除可能 / 不可能判定
  Independent Review / Draft PR 1件

NOT AUTHORIZED:
  PERF-02具体値発明 / PERF-06合否条件自動 Acceptance
  PERF-07端末推測 / PERF-08ブラウザ自動採択 / PERF-09帯域・latency発明
  性能試験 / synthetic workload / PC・browser・network mutation
  SharePoint / M365 / Entra mutation / Implementation Start
  GOV-RULE-01 / 04 HOLD解除 / Issue #19 Close / next residual auto-select
  Ready / Merge（HUMAN-ONLY）
```

## 1. Selected units

| ID | Topic | This bundle |
|---|---|---|
| GOV-PERF-02 | 合成記録量 | **SELECTED**；Decision = **HOLD / UNCHANGED**；Packet only |
| GOV-PERF-06 | 3秒・5秒目標の適用条件 | **SELECTED**；Decision = **HOLD / UNCHANGED**；Packet only |
| GOV-PERF-07 | 基準端末 | **SELECTED**；read-only observation |
| GOV-PERF-08 | 対象ブラウザ | **SELECTED**；read-only observation |
| GOV-PERF-09 | 基準ネットワーク | **SELECTED**；read-only observation |

```text
GOV-PERF-HOLD-RESOLUTION-BUNDLE = SELECTED / LOCKED
```

## 2. HOLD liftability（本 PR 時点）

| ID | Lift now? | Reason |
|---|---|---|
| GOV-PERF-02 | **NO** | 件数・版数・年数が VALUE NOT DETERMINED。Packet のみ |
| GOV-PERF-06 | **NO** | 合否マトリクス未 Human SELECT。Packet のみ |
| GOV-PERF-07 | **NO** | 試行で使う業務PC/タブレット未観測。Cloud Agent VM ≠ 業務端末 |
| GOV-PERF-08 | **NO** | 業務端末ブラウザ・更新方針未観測 |
| GOV-PERF-09 | **NO** | 試行接続場所・回線・障害分離条件未観測 |

```text
HOLD解除 Acceptance: NOT PERFORMED in this PR
All five remain HOLD / UNCHANGED after this Selection
```

## 3. Deliverables（本 PR）

1. Evidence inventory
2. PERF-07 observation result
3. PERF-08 observation result
4. PERF-09 observation result
5. PERF-02 Decision Packet
6. PERF-06 Decision Packet
7. HOLD解除可能 / 不可能の判定（§2 + inventory）
8. Independent Review
9. docs-only Draft PR 1件
10. STOP

## 4. Next（Human only）

```text
This PR: MERGED（PR #286）
next residual: Human SELECTED GOV-RULE-01 / 04 Evidence Bundle（PR pending）
  正本: decision-gov-rule-01-04-evidence-bundle-selection.md
PERF HOLD解除 Acceptance = separate Human Decision
next residual auto-select = FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-perf-hold-resolution-bundle-acceptance.md`
- Evidence inventory: `decision-gov-perf-hold-resolution-evidence-inventory.md`
- PERF-07 obs: `decision-gov-perf-07-baseline-device-observation.md`
- PERF-08 obs: `decision-gov-perf-08-browser-observation.md`
- PERF-09 obs: `decision-gov-perf-09-network-observation.md`
- PERF-02 packet: `decision-gov-perf-02-synthetic-volume-decision-packet.md`
- PERF-06 packet: `decision-gov-perf-06-sla-applicability-decision-packet.md`
- IR: `decision-gov-perf-hold-resolution-bundle-independent-review.md`
- Parent: `decision-gov-perf-01-11-performance-bundle-option-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
