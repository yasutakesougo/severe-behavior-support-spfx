# GOV-AUD-10 — 重大障害時の連絡経路 — Human Selection Packet

この文書は、GOV-AUD-09 Option A COMPLETE（PR #264 MERGED）後の
**次 residual Decision** として **GOV-AUD-10** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-AUD-10-SELECTION-1
Kind: Human Selection（#19 residual / GOV-AUD-10）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-AUD-10
Date: 2026-08-11
PR: #265（Selection / Packet / SELECT Acceptance / IR only）

Baseline:
  main tip = 68a659e7d854b1b93064b95d1a0dd9568baf6b78
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  GOV-AUD-01 = Accepted / LOCKED / Option C + identity fill-in
  GOV-AUD-02 / 03 / 04 / 05(retention) / 06 = Accepted
  GOV-AUD-07 = Accepted / LOCKED / Option A（Microsoft 365管理者）
  GOV-AUD-08 = Accepted / LOCKED / Option B（業務責任者または指定確認者）
  GOV-AUD-09 = Accepted / LOCKED / Option A（事業所管理者；PR #263 / #264）
  DEC-015 = NOT ACCEPTED（ledger sync 別）

Candidate origin:
  Issue #19 §C GOV-AUD-10
  #19 residual inventory row: GOV-AUD-10
  Human Decision: SELECT GOV-AUD-10

Fill-in Acceptance: Accepted / LOCKED（role names）
  （decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent invent contact paths / names / numbers: FORBIDDEN
next residual after this unit: NOT SELECTED
```

## 1. Why this residual now

```text
GOV-AUD-09 は Option A（事業所管理者）まで COMPLETE。
Human が次残件として GOV-AUD-10 を明示 SELECT した。
GOV-AUD-10 は重大障害時の連絡経路だけの最小単位であり、
GOV-AUD-07 / 08 / 09（責任者・確認者・再開承認者）と分離できる。
Issue #19 原文は A–D 択一ではなく、5 項目の fill-in である。
```

## 2. Selected unit

```text
GOV-AUD-10 — 重大障害時の連絡経路
Question:
  重大障害時の連絡経路（第一報 / 技術 / 業務 / 個人情報事故 / 再開判断）は何か？
```

## 3. Authorized IN

```text
IN:
  GOV-AUD-10 を current residual unit とする
  Decision Packet（Issue #19 原文 5 項目 fill-in + HOLD）の docs 固定
  具体連絡経路値は未記入のまま Human fill-in Acceptance 待ち
  GOV-AUD-07 / 08 / 09 Accepted との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  連絡先・役割名・電話番号・メール・チャット経路の Agent 発明
  fill-in 5 項目の Agent 自動 Accepted
  GOV-AUD-07 / 08 / 09 の再 Decision または自動上書き
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data
  Issue #19 Close
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| GOV-AUD-01〜06 | Accepted（該当分） | unrelated |
| GOV-AUD-07 | Accepted / Option A | restore owner ≠ contact path |
| GOV-AUD-08 | Accepted / Option B | confirmer ≠ contact path |
| GOV-AUD-09 | Accepted / Option A | resume approver ≠ contact path table |
| DEC-015 | OPEN / ledger | 別 sync；本 unit で触らない |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-AUD-10** | 重大障害時の連絡経路 | **SELECTED** |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| GOV-STAFF / GOV-PERF / other | other residuals | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-AUD-10-SELECTION-1 = SELECTED / LOCKED
Fill-in = Accepted / LOCKED（別 Acceptance；role names）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  next residual = NOT SELECTED
  personal contact details = NOT DEFINED
```

## 8. Next（Human only）

```text
Consumed:
  Unit Selection PR #265 = MERGED
  Human Fill-in = Accepted（role names）

Current Fill-in Acceptance PR:
  1. Independent Review → Human Ready → Human Merge
  2. After Merge: Next residual SELECT = separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-aud-10-incident-contact-path-acceptance.md`
- Decision Packet: `decision-gov-aud-10-incident-contact-path-decision-packet.md`
- Fill-in Acceptance: `decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md`
- Independent Review（Selection）: `decision-gov-aud-10-incident-contact-path-independent-review.md`
- Independent Review（Fill-in）: `decision-gov-aud-10-incident-contact-path-fill-in-independent-review.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Prior unit: `decision-gov-aud-09-resume-approver-option-a-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
