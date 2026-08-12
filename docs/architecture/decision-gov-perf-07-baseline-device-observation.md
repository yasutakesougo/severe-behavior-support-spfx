# GOV-PERF-07 — 基準端末 read-only observation

この文書は、**GOV-PERF-07**（基準端末）の
**read-only observation** 結果である。
端末設定変更・HOLD 解除 Acceptance・性能試験開始ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: GOV-PERF-07
Kind: read-only observation
Observation date: 2026-08-12
Observer context: Cursor Cloud Agent VM（bc-019ff308-6d42-7120-9c20-15991dfc7116）
Baseline tip: e64ad1d035d5e071841a5d19ced5f6e3c7abf407
PR: pending
Mutation: NONE
HOLD status: UNCHANGED
```

## 1. Required fields（Issue #19 / Human）

| Field | Required for HOLD解除 |
|---|---|
| 実際に試行で使用する業務PC | YES |
| 業務タブレットの有無 | YES |
| CPU | YES |
| メモリ | YES |
| 画面幅 | YES |
| OS | YES |

## 2. Observed（Cloud Agent VM only）

```text
Environment class: Cloud Agent development VM
  ≠ 試行業務PC
  ≠ 業務タブレット

OS: Ubuntu 24.04.4 LTS (noble) / Linux 6.12.94+ x86_64
CPU model: Intel(R) Xeon(R) Processor
CPU(s): 4（1 thread/core；4 cores/socket）
Memory: ~15 GiB total（observation-time free ~13 GiB）
Display: X11 DISPLAY=:1；1920x1200 @ 96 dpi（VNC-0）
Tablet device: NOT PRESENT / NOT APPLICABLE on this VM
```

## 3. Trial business device（required）

```text
業務PC（試行使用）: NOT OBSERVED / VALUE NOT DETERMINED
業務タブレットの有無: NOT OBSERVED / VALUE NOT DETERMINED
CPU（業務端末）: NOT OBSERVED / VALUE NOT DETERMINED
メモリ（業務端末）: NOT OBSERVED / VALUE NOT DETERMINED
画面幅（業務端末）: NOT OBSERVED / VALUE NOT DETERMINED
OS（業務端末）: NOT OBSERVED / VALUE NOT DETERMINED
```

## 4. Judgment

```text
PERF-07 HOLD解除: 不可能（本 observation のみでは不可）
Reason:
  Human が求めるのは「実際に試行で使用する業務PC/タブレット」
  Cloud Agent VM 仕様を業務端末 baseline として採択してはならない
```

## 5. Non-claims

```text
This observation ≠ Accept Cloud Agent VM as PERF-07 baseline
This observation ≠ invent 業務PC / tablet / CPU / memory / OS
This observation ≠ device purchase / settings mutation
This observation ≠ HOLD解除 Acceptance
This observation ≠ performance test start
```
