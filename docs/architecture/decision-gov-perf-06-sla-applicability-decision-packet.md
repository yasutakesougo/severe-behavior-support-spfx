# Decision Packet — GOV-PERF-06 3秒・5秒目標の適用条件（HOLD / UNCHANGED）

この文書は、**GOV-PERF-06**（3秒・5秒目標の適用条件）の
**Decision Packet** である。Decision 自体は変更しない。
合否マトリクスを自動採択しない。

```text
GOV-PERF-06 = HOLD / UNCHANGED
Pass/fail matrix: NOT ACCEPTED in this packet
Agent MUST NOT auto-select which metrics are mandatory
```

Parent Selection:
[`decision-gov-perf-hold-resolution-bundle-selection.md`](./decision-gov-perf-hold-resolution-bundle-selection.md)

Evidence inventory:
[`decision-gov-perf-hold-resolution-evidence-inventory.md`](./decision-gov-perf-hold-resolution-evidence-inventory.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-PERF-06
Kind: Decision Packet（HOLD materials；no Acceptance）
Status: SELECTED / LOCKED / HOLD / UNCHANGED
Owner: Issue #19
Related Accepted（整合前提 / 再 Decision しない）:
  GOV-PERF-03 = Option C（cold と warm を別々に判定）
  GOV-PERF-05 = Option D（中央値、p95、最大値）
Design target text（Issue #19）:
  利用者一覧 = 3秒以内
  ダッシュボード = 5秒以内
Agent recommendation: NONE
max 超過 = 自動 FAIL: NOT INVENTED（PERF-05 boundary）
Implementation / performance test: NOT AUTHORIZED
```

## 1. Consistency check with Accepted PERF-03 / 05

| Constraint | Implication for PERF-06 |
|---|---|
| PERF-03 Option C | cold と warm を混合した単一値で受入判定しない |
| PERF-05 Option D | 報告統計は median / p95 / max を使う |
| PERF-05 non-claim | max 超過 = 自動 FAIL を本 packet で発明しない |
| Issue #19 3秒 / 5秒 | 画面別の目標秒数文言。適用条件は未決 |

```text
Consistency result: NO CONFLICT with Accepted 03/05
Remaining gap: which of cold/warm × median/p95(/max) are formal pass conditions
```

## 2. Decision grid（all cells VALUE NOT DETERMINED）

### 利用者一覧（目標 3秒以内）

| Metric | Formal pass condition? |
|---|---|
| cold 中央値 | **VALUE NOT DETERMINED** |
| cold p95 | **VALUE NOT DETERMINED** |
| warm 中央値 | **VALUE NOT DETERMINED** |
| warm p95 | **VALUE NOT DETERMINED** |
| cold max / warm max | **VALUE NOT DETERMINED**（報告対象になり得るが自動FAIL発明禁止） |

### ダッシュボード（目標 5秒以内）

| Metric | Formal pass condition? |
|---|---|
| cold 中央値 | **VALUE NOT DETERMINED** |
| cold p95 | **VALUE NOT DETERMINED** |
| warm 中央値 | **VALUE NOT DETERMINED** |
| warm p95 | **VALUE NOT DETERMINED** |
| cold max / warm max | **VALUE NOT DETERMINED**（同上） |

## 3. Candidate patterns for later Human Decision（NOT SELECTED）

```text
P1. median only（cold + warm separately）must meet target；p95/max report-only
P2. median + p95 must meet；max report-only
P3. all of median/p95/(optionally max) must meet
P4. Other Human-specified matrix
H. Keep HOLD

Current answer: NOT SELECTED（HOLD UNCHANGED）
Agent MUST NOT pick P1–P4.
```

## 4. Explicit FORBIDDEN

```text
合否マトリクスの自動 Acceptance
「全項目必須」「中央値だけ必須」等の推測確定
max 超過 = 自動 FAIL ルール発明
性能試験開始 / Implementation Start
```

## 5. After this packet

```text
GOV-PERF-06: HOLD / UNCHANGED
HOLD解除: 不可能（適用条件未 Human SELECT）
Next: separate Human Decision choosing a matrix consistent with PERF-03 / 05
```
