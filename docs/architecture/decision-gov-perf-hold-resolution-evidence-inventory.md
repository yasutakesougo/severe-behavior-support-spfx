# GOV-PERF HOLD Resolution — Evidence Inventory

この文書は、**Decision-GOV-PERF-HOLD-RESOLUTION-1** の
**evidence inventory** 正本である。
HOLD 解除 Acceptance / 性能試験開始ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Evidence inventory（docs-only）
Bundle: GOV-PERF-02 / 06 / 07 / 08 / 09
Baseline tip: e64ad1d035d5e071841a5d19ced5f6e3c7abf407
Observation date: 2026-08-12
PR: #286
Agent recommendation: NONE
```

## 1. Canonical Accepted inputs（再 Decision しない）

| Source | Status | Relevance |
|---|---|---|
| GOV-PERF-01 Option A = 30件 | Accepted / LOCKED | 試行版 synthetic user baseline |
| GOV-PERF-03 Option C = cold/warm 別判定 | Accepted / LOCKED | PERF-06 整合前提 |
| GOV-PERF-04 Option C = 20回以上 | Accepted / LOCKED | 測定回数（測定開始ではない） |
| GOV-PERF-05 Option D = median/p95/max | Accepted / LOCKED | PERF-06 統計前提；max≠自動FAIL |
| GOV-PERF-10 Option A = P1試行必須 | Accepted / LOCKED | 拡張規模は試行必須外 |
| Issue #19 §D 利用者一覧 3秒 / ダッシュボード 5秒 | design target text | PERF-06 packet の目標文言；適用条件は HOLD |
| Decision-AUD-RET-1 = AuditLog 最低5年 | Accepted / LOCKED | PERF-02「保持年数相当」の **関連**証跡。自動転用禁止 |
| GOV-AUD-05 retention prohibition = 5年完全削除禁止 | Accepted / LOCKED | 同上。PERF-02 値への自動昇格禁止 |

## 2. Observation artifacts

| ID | Artifact | Result summary |
|---|---|---|
| PERF-07 | [`decision-gov-perf-07-baseline-device-observation.md`](./decision-gov-perf-07-baseline-device-observation.md) | Cloud Agent VM observed；**trial 業務端末 = NOT OBSERVED** |
| PERF-08 | [`decision-gov-perf-08-browser-observation.md`](./decision-gov-perf-08-browser-observation.md) | Chrome on Cloud Agent observed；**業務端末ブラウザ = NOT OBSERVED** |
| PERF-09 | [`decision-gov-perf-09-network-observation.md`](./decision-gov-perf-09-network-observation.md) | Agent egress/DNS observed；**試行ネットワーク = NOT OBSERVED** |

## 3. Packet artifacts

| ID | Artifact | Decision change? |
|---|---|---|
| PERF-02 | [`decision-gov-perf-02-synthetic-volume-decision-packet.md`](./decision-gov-perf-02-synthetic-volume-decision-packet.md) | **NO** — HOLD / UNCHANGED |
| PERF-06 | [`decision-gov-perf-06-sla-applicability-decision-packet.md`](./decision-gov-perf-06-sla-applicability-decision-packet.md) | **NO** — HOLD / UNCHANGED |

## 4. HOLD解除可能 / 不可能（inventory判定）

| ID | Liftability now | Missing evidence for lift |
|---|---|---|
| PERF-02 | **不可能** | Human 明示の件数・版数・年数（または根拠付き fill-in） |
| PERF-06 | **不可能** | Human 明示の cold/warm × median/p95(/max) 合否適用 |
| PERF-07 | **不可能** | 試行で使用する業務PC/タブレットの read-only 観測 |
| PERF-08 | **不可能** | 業務端末のブラウザ名・版・更新方針の観測 |
| PERF-09 | **不可能** | 試行接続場所・回線・障害分離可否の観測 |

```text
Cloud Agent VM observation ≠ trial baseline
Cloud Agent observation MUST NOT be used to auto-Accept PERF-07/08/09
```

## 5. Forbidden invent from this inventory

```text
ABC / 観察 / 計画版 / 見直し件数の数値発明
AuditLog 5年を PERF-02 保持年数相当へ自動 Accepted
合否マトリクス自動採択
Edge/Chrome を業務ブラウザとして自動採択
帯域・latency 数値発明
性能試験実行 / synthetic workload 生成
```
