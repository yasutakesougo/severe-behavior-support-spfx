# GOV-AUD-07 — バックアップ・復元の一次責任者 — Human Selection Packet

この文書は、GOV-AUD-01 identity fill-in COMPLETE（PR #258 MERGED）後の
**次 residual Decision** として **GOV-AUD-07** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-AUD-07-SELECTION-1
Kind: Human Selection（#19 residual / GOV-AUD-07）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-AUD-07
Date: 2026-08-11
PR: （Selection / Packet / SELECT Acceptance / IR only）

Baseline:
  main tip = c2199bdbf6e44854b9975b1b4aedbd05bd74affd
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01 = Accepted / LOCKED / Option C + identity fill-in（PR #257 / #258）
  GOV-AUD-02 / 03 / 04 / 05(retention) / 06 = Accepted

Candidate origin:
  Issue #19 §C GOV-AUD-07
  #19 residual inventory row: GOV-AUD-07
  related ledger label: DEC-015（整合要；本 Selection では自動 Accepted しない）

Option Acceptance: NOT SELECTED
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A–D: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-AUD-01 は Option C + identity fill-in まで COMPLETE。
Human が次残件として GOV-AUD-07 を明示 SELECT した。
GOV-AUD-07 はバックアップ・復元の一次責任者だけの最小単位であり、
GOV-AUD-08（復旧後確認）/ 09（再開承認）/ 10（連絡経路）と分離できる。
```

## 2. Selected unit

```text
GOV-AUD-07 — バックアップ・復元の一次責任者
Question:
  バックアップ・復元の一次責任者は誰か？
```

## 3. Authorized IN

```text
IN:
  GOV-AUD-07 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option 未採択のまま Human Acceptance 待ち
  DEC-015 との整合注記（自動 Accepted しない）
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A–D の Agent 自動 Accepted
  バックアップ手順・ツール・頻度・保持期間の発明
  GOV-AUD-08 / 09 / 10 の自動 SELECT または同時 Accepted
  DEC-015 の自動 Accepted（ledger 同期は別）
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01 | Accepted / Option C + identity | unrelated SoT |
| GOV-AUD-02〜06 | Accepted（該当分） | unrelated |
| GOV-AUD-08 / 09 / 10 | OPEN | 本 unit OUT |
| DEC-015 | OPEN / ledger | 整合要；自動 Accepted しない |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-AUD-07** | バックアップ・復元の一次責任者 | **SELECTED** |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| GOV-AUD-08 | 復旧後の業務確認者 | NOT SELECTED |
| GOV-AUD-09 | 再開承認者 | NOT SELECTED |
| GOV-AUD-10 | 重大障害時の連絡経路 | NOT SELECTED |
| GOV-STAFF / GOV-PERF / other | other residuals | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-AUD-07-SELECTION-1 = SELECTED / LOCKED

HOLD:
  concrete Option A–D = NOT SELECTED
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
```

## 8. Next（Human only）

```text
1. This PR Independent Review → Human Ready → Human Merge
2. After Merge: Human SELECT Option A–D or HOLD
3. Option Acceptance / LOCKED for GOV-AUD-07 only
4. DEC-015 ledger sync = separate if needed
5. Next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-aud-07-backup-restore-owner-acceptance.md`
- Decision Packet: `decision-gov-aud-07-backup-restore-owner-decision-packet.md`
- Independent Review: `decision-gov-aud-07-backup-restore-owner-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
