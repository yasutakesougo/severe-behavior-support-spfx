# GOV-AUD-08 — 復旧後の業務確認者 — Human Selection Packet

この文書は、GOV-AUD-07 Option A COMPLETE（PR #260 MERGED）後の
**次 residual Decision** として **GOV-AUD-08** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-AUD-08-SELECTION-1
Kind: Human Selection（#19 residual / GOV-AUD-08）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-AUD-08
Date: 2026-08-11
PR: #261（Selection / Packet / SELECT Acceptance / IR only）

Baseline:
  main tip = 07bc46950afc69362f97ffee2fe4817f153a3adb
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01 = Accepted / LOCKED / Option C + identity fill-in（PR #257 / #258）
  GOV-AUD-02 / 03 / 04 / 05(retention) / 06 = Accepted
  GOV-AUD-07 = Accepted / LOCKED / Option A（Microsoft 365管理者；PR #259 / #260）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §C GOV-AUD-08
  #19 residual inventory row: GOV-AUD-08
  Prior non-binding recommendation at NEXT_RESIDUAL_HUMAN_SELECTION: GOV-AUD-08
  Binding before this Decision: NONE → now SELECTED by Human

Option Acceptance: Accepted / LOCKED / Option B
  （decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A–D: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-AUD-07 は Option A（Microsoft 365管理者）まで COMPLETE。
Human が次残件として GOV-AUD-08 を明示 SELECT した。
GOV-AUD-08 は復旧後の業務確認者だけの最小単位であり、
GOV-AUD-07（一次責任者）/ 09（再開承認）/ 10（連絡経路）と分離できる。
```

## 2. Selected unit

```text
GOV-AUD-08 — 復旧後の業務確認者
Question:
  復旧後の業務確認者は誰か？
```

## 3. Authorized IN

```text
IN:
  GOV-AUD-08 を current residual unit とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option 未採択のまま Human Acceptance 待ち
  GOV-AUD-07 Accepted との分離維持（確認者 ≠ 一次責任者の自動同一化禁止）
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A–D の Agent 自動 Accepted
  復旧手順・確認チェックリスト・再開条件の発明
  GOV-AUD-09 / 10 の自動 SELECT または同時 Accepted
  GOV-AUD-07 / DEC-015 の再 Decision または自動上書き
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
| GOV-AUD-07 | Accepted / Option A | primary owner ≠ confirmer |
| GOV-AUD-09 / 10 | OPEN | 本 unit OUT |
| DEC-015 | OPEN / ledger | 別 sync；本 unit で触らない |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-AUD-08** | 復旧後の業務確認者 | **SELECTED** |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| GOV-AUD-09 | 再開承認者 | NOT SELECTED |
| GOV-AUD-10 | 重大障害時の連絡経路 | NOT SELECTED |
| GOV-STAFF / GOV-PERF / other | other residuals | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-AUD-08-SELECTION-1 = SELECTED / LOCKED
Option B = Accepted / LOCKED（別 Acceptance）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
```

## 8. Next（Human only）

```text
Consumed:
  Unit Selection PR #261 = MERGED
  Human Option = B

Current Option Acceptance PR:
  1. Independent Review → Human Ready → Human Merge
  2. After Merge: Next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-aud-08-post-recovery-confirmer-acceptance.md`
- Decision Packet: `decision-gov-aud-08-post-recovery-confirmer-decision-packet.md`
- Option B Acceptance: `decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md`
- Independent Review（Selection）: `decision-gov-aud-08-post-recovery-confirmer-independent-review.md`
- Independent Review（Option B）: `decision-gov-aud-08-post-recovery-confirmer-option-b-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
