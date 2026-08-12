# GOV-PERF-09 — 基準ネットワーク read-only observation

この文書は、**GOV-PERF-09**（基準ネットワーク）の
**read-only observation** 結果である。
ネットワーク設定変更・帯域/latency 発明・HOLD 解除 Acceptance ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: GOV-PERF-09
Kind: read-only observation
Observation date: 2026-08-12
Observer context: Cursor Cloud Agent VM
Baseline tip: e64ad1d035d5e071841a5d19ced5f6e3c7abf407
PR: #286
Mutation: NONE
HOLD status: UNCHANGED
Issue #19 temporary-outage tip: recommendation only / NOT Accepted here
```

## 1. Required fields

| Field | Required for HOLD解除 |
|---|---|
| 試行時の接続場所 | YES |
| 回線種別 | YES |
| 観測可能なネットワーク条件 | YES |
| 一時障害と通常性能を分離できるか | YES |

## 2. Observed（Cloud Agent VM / egress only）

```text
Environment class: Cloud Agent VM network path
  ≠ 試行事業所 / 在宅業務ネットワーク

hostname: cursor
DNS nameserver observed: 10.0.0.2
Egress policy (cursor-cloud environment-info): restricted=false（allow-all class）
Bandwidth / latency numeric measurement: NOT PERFORMED（発明・試験禁止）
Packet loss / outage simulation: NOT PERFORMED
```

## 3. Trial network（required）

```text
試行時の接続場所: NOT OBSERVED / VALUE NOT DETERMINED
回線種別: NOT OBSERVED / VALUE NOT DETERMINED
観測可能なネットワーク条件（試行）: NOT OBSERVED / VALUE NOT DETERMINED
一時障害と通常性能を分離できるか: NOT OBSERVED / VALUE NOT DETERMINED
```

## 4. Related non-binding tip（昇格しない）

```text
Issue #19 design recommendation:
  一時障害は通常性能から分離し、可用性として別記録する
Status in this observation: recommendation only / NOT Accepted
```

## 5. Judgment

```text
PERF-09 HOLD解除: 不可能（本 observation のみでは不可）
Reason:
  試行接続場所・回線・障害分離可否が未観測
  Agent VM egress を試行ネットワーク baseline にしてはならない
  帯域・latency 数値を発明してはならない
```

## 6. Non-claims

```text
This observation ≠ invent bandwidth / latency numbers
This observation ≠ Accept temporary-outage tip as Binding
This observation ≠ network settings mutation
This observation ≠ HOLD解除 Acceptance
This observation ≠ performance / availability test start
```
