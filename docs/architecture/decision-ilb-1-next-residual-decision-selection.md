# Decision-ILB-1 後の最初の残存 Decision 選定 — Human Selection

この文書は、Decision-ILB-1 Human Policy（Option A）**FINAL CONSISTENT**
（PR #151 MERGED）後の **最初の残存 Decision 選定** の Human Decision 記録である。

Decision packet: [`decision-ilb-1-next-residual-decision-selection-packet.md`](./decision-ilb-1-next-residual-decision-selection-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_NEXT_RESIDUAL_DECISION_SELECTION
Status: SELECTED
Human Selection: Explicit Human Option C on 2026-08-09
Selected residual Decision:
  C — Decision-RD-3（見直し接近窓・期限算出・超過後）
Acceptance: decision-rd-3-monitoring-guidance-acceptance.md（Accepted / LOCKED）
Depends on:
  Decision-ILB-1 HUMAN_POLICY Accepted / LOCKED / Option A
  Consistency: FINAL CONSISTENT
  PR #151 MERGED（e2bd256… / head 4f5a833…）
Prior CONSUMED（unit selection）:
  F — Decision-ILB-1 Human Policy（Accepted / Option A / FINAL CONSISTENT）
  B — GOV-AUD-04
  E — DEC-008 submit/return
  C — Decision-OP-3
  prior-B — GOV-AUD-03
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

## Human Selection

```text
Selected: C
Decision-RD-3（モニタリング時期表示・通知 / 超過後ポリシー）
```

Human Decision（RD-3 本体・Acceptance 正本へ記録）:

```text
モニタリング時期:
  「3か月に1回程度」を目安として表示・通知する
扱い: informational only
期限超過: 採用しない
過ぎた場合の警告・業務制限: 採用しない
90日固定: 採用しない
hard due / overdue: NOT ADOPTED
FindingCode / A-5 / Implementation Start: HOLD
```

```text
Prior unit F / Decision-ILB-1 HUMAN_POLICY: CONSUMED（FINAL CONSISTENT / Option A）
Agent recommendation: NOT Human Selection evidence
Agent auto-select: FORBIDDEN
GOV-AUD-05 auto-Accepted: FORBIDDEN
他 inventory 行: NOT Accepted by this selection alone
```

## Next

```text
Acceptance: decision-rd-3-monitoring-guidance-acceptance.md（LOCKED）
Logical contract: review-monitoring-guidance-contract.md
他残存 Decision: provisional / 一件ずつ（自動選定しない）
FindingCode / A-5 / Implementation Start: HOLD
```
