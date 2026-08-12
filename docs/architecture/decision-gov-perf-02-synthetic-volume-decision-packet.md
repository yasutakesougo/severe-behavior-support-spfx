# Decision Packet — GOV-PERF-02 合成記録量（HOLD / UNCHANGED）

この文書は、**GOV-PERF-02**（合成記録量）の
**Decision Packet** である。Decision 自体は変更しない。

```text
GOV-PERF-02 = HOLD / UNCHANGED
Concrete values: NOT ACCEPTED in this packet
Agent MUST NOT invent counts / years
```

Parent Selection:
[`decision-gov-perf-hold-resolution-bundle-selection.md`](./decision-gov-perf-hold-resolution-bundle-selection.md)

Evidence inventory:
[`decision-gov-perf-hold-resolution-evidence-inventory.md`](./decision-gov-perf-hold-resolution-evidence-inventory.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-PERF-02
Kind: Decision Packet（HOLD materials；no Acceptance）
Status: SELECTED / LOCKED / HOLD / UNCHANGED
Owner: Issue #19
Related Accepted:
  GOV-PERF-01 = Option A（30件 synthetic users）
  Decision-AUD-RET-1 = AuditLog 最低5年（RELATED only）
  GOV-AUD-05 retention prohibition = 5年（RELATED only）
Agent recommendation: NONE
Implementation / performance test: NOT AUTHORIZED
```

## 1. Fields to decide later（Human）

| Field | Status in this packet | Evidence note |
|---|---|---|
| 利用者1人あたりABC記録件数 | **VALUE NOT DETERMINED** | 既存 design / 試行規模から確定値なし。発明禁止 |
| 観察記録件数 | **VALUE NOT DETERMINED** | 同上 |
| 支援計画の版数 | **VALUE NOT DETERMINED** | 同上 |
| 見直し履歴件数 | **VALUE NOT DETERMINED** | 同上 |
| 保持年数相当 | **VALUE NOT DETERMINED** | AuditLog 最低5年は **RELATED**（AUD-RET-1 / AUD-05）。PERF-02 へ自動転用禁止 |

## 2. Related canonical facts（自動 Accepted にしない）

```text
GOV-PERF-01: 30件 = 試行版通常規模 synthetic user baseline（Accepted）
Decision-AUD-RET-1: AuditLog minimum retention = 5 years（Accepted）
GOV-AUD-05 / DEC-012: during-retention complete deletion prohibited for 5 years（Accepted）

These DO NOT by themselves set PERF-02 synthetic volume fields.
Human must explicitly map or choose values in a later Decision.
```

## 3. Options for later Human Decision（NOT SELECTED）

```text
A. Human fill-in of all five fields with evidence
B. Partial fill-in + remaining HOLD
C. Reuse AuditLog 5年 as 保持年数相当 only（other fields still needed）
D. Other（Human explicit）
H. Keep HOLD
Current answer: H implied / HOLD UNCHANGED（本 packet では採択しない）
```

## 4. Explicit FORBIDDEN

```text
件数・版数・年数の Agent 発明
AUD-RET-1 5年の PERF-02 自動 Accepted
synthetic workload 生成
性能試験開始
```

## 5. After this packet

```text
GOV-PERF-02: HOLD / UNCHANGED
HOLD解除: 不可能（具体値未 Human SELECT）
Next: separate Human Decision after evidence / fill-in
```
