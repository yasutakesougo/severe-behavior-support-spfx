# GOV-AUD-05 / DEC-012 — post-retention deletion — Human Selection Packet

この文書は、GOV-RULE-01〜04 COMPLETE（PR #282 MERGED）後の
**次 residual Decision** として
**GOV-AUD-05 / DEC-012 post-retention deletion**（5年経過後の完全削除可否）を
固定する docs-only Selection Packet である。

法定保存期間中の完全削除禁止（GOV-AUD-05 / DEC-012 Option A；既 Accepted）の
**再 Decision ではない**。経過後の可否だけの最小単位。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-AUD-05-POST-RETENTION-SELECTION-1
Kind: Human Selection（#19 residual / post-retention deletion）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT post-retention deletion residual
Date: 2026-08-12
PR: #283（Selection / Packet / SELECT Acceptance / IR only）

Baseline:
  main tip = 70213c78cda0882d9eb712938e51589e40d1061b
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-05 / DEC-012 retention prohibition = Accepted / LOCKED / Option A
  GOV-STAFF-01〜12 / GOV-RULE-01〜12（該当分）= Accepted or HOLD recorded
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  #19 residual inventory: GOV-AUD-05 / DEC-012 post-retention deletion
  Prior separation: decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md
  Binding before this Decision: NONE（unit）→ now SELECTED by Human
  Prior automatic complete/physical deletion after retention: NOT ADOPTED（UNCHANGED）

Option Acceptance: Accepted / LOCKED / Option C（PR #284）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A–D: FORBIDDEN
cleanup / purge job / SharePoint mutation: FORBIDDEN
GOV-PERF auto-SELECT: FORBIDDEN
GOV-RULE-01 / 04 HOLD 解除: FORBIDDEN（別 Decision）
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-RULE-01〜04 bundle は COMPLETE（01/04 HOLD は別解除待ち）。
Human が次残件として post-retention deletion residual を明示 SELECT した。
保存期間中禁止（既 Accepted）と分離し、5年経過後の完全削除可否だけを扱う。
Option C = Accepted / LOCKED（初期版では経過後完全削除機能を持たない）。
```

## 2. Selected unit

```text
GOV-AUD-05 / DEC-012 post-retention deletion
Question:
  5年経過後に完全削除・物理削除を許可するか否か？
```

## 3. Authorized IN

```text
IN:
  post-retention deletion を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option C Acceptance（別 PR）
  保存期間中禁止 Acceptance（Option A）との分離維持
  自動完全削除 / 自動物理削除 = NOT ADOPTED の維持（再 Decision しない）
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A–D の Agent 自動 Accepted
  保存期間中禁止（既 Accepted）の再 Decision / 上書き
  5年経過後の自動完全削除 / 自動物理削除の復活採択
  cleanup / purge job / schema / SharePoint / UI 実装
  GOV-PERF SELECT / GOV-RULE-01・04 HOLD 解除
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| GOV-AUD-05 / DEC-012 retention prohibition | Accepted / Option A | during-retention ≠ post-retention |
| Decision-AUD-RET-1 | Accepted | AuditLog 最低5年；到達 alone ≠ 自動削除 |
| 自動完全削除 after retention | NOT ADOPTED | UNCHANGED |
| 自動物理削除実行 | NOT ADOPTED | UNCHANGED |
| GOV-PERF / RULE-01・04 HOLD 解除 | OPEN | 本 unit OUT |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **post-retention deletion** | 5年経過後の完全削除可否 | **SELECTED** |
| GOV-PERF-01〜11 | 性能目標 | NOT SELECTED |
| GOV-RULE-01 / 04 HOLD 解除 | 周期・件数具体値 | NOT SELECTED |
| DEC-015 ledger sync | バックアップ責任者 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-AUD-05-POST-RETENTION-SELECTION-1 = SELECTED / LOCKED
Option C = Accepted / LOCKED（Option Acceptance PR）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  cleanup / purge job = NOT AUTHORIZED
```

## 8. Next（Human only）

```text
1. Option C Acceptance PR: IR → Human Ready → Human Merge
2. After Merge: next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-aud-05-dec-012-post-retention-deletion-acceptance.md`
- Decision Packet: `decision-gov-aud-05-dec-012-post-retention-deletion-decision-packet.md`
- Independent Review: `decision-gov-aud-05-dec-012-post-retention-deletion-independent-review.md`
- Option C Acceptance: `decision-gov-aud-05-dec-012-post-retention-deletion-option-c-acceptance.md`
- Option C IR: `decision-gov-aud-05-dec-012-post-retention-deletion-option-c-independent-review.md`
- Prior: `decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
