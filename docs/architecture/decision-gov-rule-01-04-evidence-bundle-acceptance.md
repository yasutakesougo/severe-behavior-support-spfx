# GOV-RULE-01 / 04 — Evidence Bundle — Human Acceptance（SELECT）

この文書は、**GOV-RULE-01 / 04 Evidence Bundle** に対する
Human Selection の Acceptance 正本である。

GOV-RULE-01 Option Acceptance / HOLD 解除 Acceptance ではない。
GOV-RULE-04 の具体値 Acceptance ではない。

Packet:
[`decision-gov-rule-01-04-evidence-bundle-selection.md`](./decision-gov-rule-01-04-evidence-bundle-selection.md)

Depends on（再 Decision しない）:
- [`decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md`](./decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md)
  （PR #282；01/04 HOLD）
- GOV-PERF HOLD Resolution MERGED（PR #286）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-01-04-EVIDENCE-1
Status: Accepted / LOCKED（Selection boundary / bundle）
Human Decision: SELECT GOV-RULE-01 / 04 Evidence Bundle
Human Acceptance date: 2026-08-12
Issue: #19
Baseline tip: 9588805ba3b9683efb4a2db5472e5a595c3c0f6e
PR: #287

Selected:
  GOV-RULE-01 / 04 Evidence Bundle（MHLW primary-source framed packets）

After this Acceptance:
  GOV-RULE-01 = Accepted / LOCKED（Acceptance PR #288）
  GOV-RULE-04 = Accepted / LOCKED（Acceptance PR #289）

GOV-RULE-01 Acceptance: PR #288
GOV-RULE-04 Acceptance: PR #289
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Next residual auto-select: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT GOV-RULE-01 / 04 Evidence Bundle
Decision-GOV-RULE-01-04-EVIDENCE-1: Accepted / LOCKED

Meaning:
  authorize docs-only Evidence Packets + traceability + lift assessment
  keep GOV-RULE-01 as HOLD LIFT CANDIDATE only
  keep GOV-RULE-04 HOLD / UNCHANGED
  do not auto-Accept / invent counts / hardcode 3-year rescoring
```

## Boundary

```text
SELECT Evidence Bundle ≠ GOV-RULE-01 Accepted / LOCKED
SELECT Evidence Bundle ≠ invent GOV-RULE-04 件数
SELECT Evidence Bundle ≠ 3年固定再採点実装
SELECT Evidence Bundle ≠ Implementation Start
SELECT Evidence Bundle ≠ Issue #19 Close
```

## Next

```text
This Evidence Bundle PR: MERGED（PR #287）
GOV-RULE-01 Acceptance: MERGED（PR #288）
GOV-RULE-04 Acceptance: PR #289
```

## Reference

- Selection: `decision-gov-rule-01-04-evidence-bundle-selection.md`
- Evidence Packets / Traceability / IR: see Selection Reference
- Prior: `decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md`
