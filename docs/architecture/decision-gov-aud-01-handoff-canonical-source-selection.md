# GOV-AUD-01 — Handoff の正本 — Human Selection Packet

この文書は、Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1（PR #255 MERGED）後の
**first residual Decision** として **GOV-AUD-01** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-AUD-01-SELECTION-1
Kind: Human Selection（#19 first residual / GOV-AUD-01）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT GOV-AUD-01
Date: 2026-08-11
PR: （Selection / Packet / SELECT Acceptance only）

Baseline:
  main tip = 6949c5267c37e1ace16f2e6861bfdcec8db960a3
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED / MERGED（PR #255）
  GOV-AUD-02 = Accepted（roles；本単位と混ぜない）
  Decision-HO-1 = Accepted（Owner #17；transition ownership ≠ 正本）
  Decision-HO-EDGE-1 = Accepted

Candidate origin:
  Issue #19 §C GOV-AUD-01
  #19 residual inventory row: GOV-AUD-01

Option Acceptance: NOT SELECTED（別 Human Decision）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
Agent auto-select Option A–D: FORBIDDEN
```

## 1. Why this residual now

```text
#19 residual governance track は main に mirror 済み。
first residual は NOT SELECTED のまま停止していた。
Human が GOV-AUD-01 を明示 SELECT した。
GOV-AUD-01 は handoff の正本だけを決める最小単位であり、
GOV-AUD-02 / HO-1 / persistence と分離できる。
```

## 2. Selected unit

```text
GOV-AUD-01 — handoff の正本
Question:
  Handoff（引継ぎ）の業務上の正本をどこに置くか？
```

## 3. Authorized IN（Selection scope）

```text
IN:
  GOV-AUD-01 を current first residual とする
  Decision Packet（Option A–D + HOLD）の docs 固定
  Option 未採択のまま Human Acceptance 待ち
  Accepted 済み HO-1 / GOV-AUD-02 / 遷移契約との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  Option A–D の Agent 自動 Accepted
  会議システム名・ID・URL・運用手順の発明
  GOV-AUD-02 / HO-1 / HO-EDGE-1 の再 Decision
  Handoff 状態遷移・ロール・mutation・AuditEvent 実装開始
  SharePoint / Microsoft 365 / Entra mutation
  Issue #19 Close
  次 residual（GOV-AUD-07 等）の自動 SELECT
  Implementation Start / Deploy / real data
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 | SELECTED / LOCKED | parent track |
| Decision-HO-1 | Accepted（#17） | transition ownership ≠ 正本 |
| Decision-HO-EDGE-1 | Accepted | allowed edges ≠ 正本 |
| GOV-AUD-02 | Accepted | who may change state ≠ where SoT lives |
| HandoffStatus type（#27） | existing | status vocabulary ≠ SoT store |
| GOV-AUD-03 / 04 / 05(retention) / 06 | Accepted | unrelated residuals |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **GOV-AUD-01** | handoff の正本 | **SELECTED** |
| GOV-AUD-05 post-retention deletion | 5年経過後の完全削除可否 | NOT SELECTED |
| GOV-AUD-07〜10 | バックアップ / 復旧 / 再開 / 連絡 | NOT SELECTED |
| GOV-STAFF / GOV-PERF / other inventory | other residuals | NOT SELECTED |
| HOLD / no first residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-GOV-AUD-01-SELECTION-1 = SELECTED / LOCKED

HOLD:
  concrete Option A–D = NOT SELECTED
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED

Still NOT AUTHORIZED:
  treating this Selection as Option Acceptance
  inventing meeting-system identity or app ledger schema
```

## 8. Next（Human only）

```text
1. PR Independent Review → Human Ready → Human Merge（本 Selection の mirror）
2. Human SELECT one Option from Decision Packet（A–D or HOLD）
3. Option Acceptance / LOCKED for GOV-AUD-01 only
4. Next residual SELECT remains separate / Agent auto-advance FORBIDDEN
```

## Reference

- SELECT Acceptance: `decision-gov-aud-01-handoff-canonical-source-acceptance.md`
- Decision Packet: `decision-gov-aud-01-handoff-canonical-source-decision-packet.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
- HO-1: `decision-ho-1-handoff-transition-ownership.md`
- GOV-AUD-02: `handoff-transition-role-policy.md`
