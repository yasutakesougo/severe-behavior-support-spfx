# DEC-003 — 点数根拠の登録・最終確認ロール — Human Selection Packet

この文書は、#19 residual DEC のうち **DEC-003 org roles** を
current residual unit として固定する docs-only Selection Packet である。

本 PR では unit Selection と org-role pair Acceptance を同一 Draft に記録する
（Human Decision 明示。DEC-007 / DEC-006 は含まない）。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-DEC-003-ORG-ROLE-SELECTION-1
Kind: Human Selection（#19 residual / DEC-003 org roles）
Status: SELECTED / LOCKED（unit GO boundary）
Human Decision: SELECT DEC-003 org roles
Date: 2026-08-19
Owner: Issue #8（ledger） / Issue #19（residual governance track）

Baseline:
  main tip = cf0d45d4ae740cdb5d3c65c262569b7012574db4
  Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1 = SELECTED / LOCKED（PR #255）
  DEC-003 technical / evidence boundary = Accepted / UNCHANGED
  DEC-003 organization policy = Proposed → this Selection
  DEC-008 = Accepted / LOCKED / UNCHANGED
  GOV-AUD-03 = Accepted / LOCKED / Option E / UNCHANGED
  DEC-015 = ALIGNED / CONSUMED（GOV-AUD-07 Option A；再 Decision しない）
  DEC-006 / DEC-007 = residual / OUT

Candidate origin:
  Issue #8 DEC-003 Organization policy status: Proposed
  Issue #19 residual DEC ACTIVE: DEC-003 org roles
  Prior non-binding proposal:
    登録・転記 = PLANNER
    最終確認・有効化 = SERVICE_MANAGER
  Binding before this Decision: NONE → unit now SELECTED by Human

Org-role Acceptance: Accepted / LOCKED
  Registration / transcription = PLANNER
  Final confirmation / activation = SERVICE_MANAGER
  （decision-dec-003-org-roles-acceptance.md）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
DEC-007 simultaneous Accepted: FORBIDDEN
DEC-006 change: FORBIDDEN
DEC-008 change: FORBIDDEN
next residual auto-select: FORBIDDEN
```

## 1. Why this residual now

```text
DEC-015 は ALIGNED / CONSUMED。
Human が次残件として DEC-003 org roles を明示 SELECT し、
同一 Decision で PLANNER / SERVICE_MANAGER を Accepted した。
DEC-003 は点数根拠の登録・転記と点数状態の最終確認・有効化だけの最小単位である。
DEC-007（算定不能対応ロール）は 003 LOCK 後の conflict check 対象であり、本 unit OUT。
DEC-006（reason catalog）は Entry #6 HOLD への ledger-sync 候補であり、本 unit OUT。
```

## 2. Selected unit

```text
DEC-003 org roles — 点数根拠の登録・転記と、点数状態の最終確認・有効化
Question:
  公式点数根拠の登録・転記と最終確認・有効化は、既存 Role の誰か？
```

## 3. Authorized IN

```text
IN:
  DEC-003 org roles を current residual unit とする
  Decision Packet（role pair + OUT）の docs 固定
  PLANNER / SERVICE_MANAGER Acceptance の docs 固定（本 PR）
  DEC-003 technical Accepted 部分との分離維持
  DEC-008 / GOV-AUD-03 / DEC-007 / DEC-006 との分離維持
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  DEC-007 の算定不能対応ロール
  DEC-008 の支援計画作成者・支援計画ライフサイクル
  GOV-AUD-03 の Snapshot 訂正責任
  SITE_ADMIN の追加（本 unit の登録・確認パスへ）
  ORG_ADMIN の追加（本 unit の登録・確認パスへ）
  reason code catalog（DEC-006）
  実装権限 / 画面・ワークフロー発明
  SharePoint / Microsoft 365 / Entra mutation
  Implementation Start / Deploy / real data / LIVE WRITE
  Issue #19 Close / reopen
  Ready / Merge（HUMAN-ONLY；本 GO では FORBIDDEN）
```

## 5. Locked basis（再 Decision しない）

| ID | Status | Separation |
|---|---|---|
| DEC-003 technical | Accepted / UNCHANGED | 公式点数は市町村認定等。事業所独自再採点しない |
| DEC-008 | Accepted / LOCKED | 支援計画シートの制度上作成者 = 実践研修修了者。独立最終承認者 NOT ADOPTED |
| GOV-AUD-03 | Accepted / LOCKED / Option E | Snapshot 訂正承認者は application 対象外 |
| Formal Role ×7 | LOCKED | 新ロール発明禁止。presentationRole ≠ application Role |
| DEC-007 | OPEN / OUT | 算定不能の起票・確認・エスカレーション |
| DEC-006 | OPEN / OUT | score-state Accepted；catalog = Entry #6 HOLD |
| GOV-PERF-02/06/07/08/09 | HOLD / OUT | 本 unit と無関係 |

## 6. Options considered（unit selection-time）

| ID | Unit | Result |
|---|---|---|
| **DEC-003 org roles** | 点数根拠の登録・転記 / 最終確認・有効化 | **SELECTED** |
| DEC-007 | 算定不能対応ロール | NOT SELECTED |
| DEC-006 | reason code catalog | NOT SELECTED |
| GOV-PERF HOLD | 性能 HOLD 解除 | NOT SELECTED |
| HOLD / no residual | — | NOT SELECTED |

## 7. Stop condition

```text
Decision-DEC-003-ORG-ROLE-SELECTION-1 = SELECTED / LOCKED
Org-role pair = Accepted / LOCKED（別 Acceptance 文書）

HOLD:
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
  DEC-007 = NOT SELECTED
  DEC-006 = NOT SELECTED
  #8 / #19 ledger reconciliation = separate GO
```

## 8. Next（Human only）

```text
1. This Draft PR: Independent Review → Human Ready → Human Merge（本 GO では実行しない）
2. After Merge: DEC-007 conflict check（SERVICE_MANAGER 意味の再利用禁止）
3. DEC-007 individual Decision = separate
4. DEC-006 ledger reconciliation to AS-EC-1 Entry #6 = separate
5. Agent auto-advance FORBIDDEN
```

## Reference

- Decision Packet: `decision-dec-003-org-roles-decision-packet.md`
- Org-role Acceptance: `decision-dec-003-org-roles-acceptance.md`
- Parent track: `decision-issue-19-residual-governance-selection.md`
- DEC-008: `decision-dec-008-acceptance.md`
- GOV-AUD-03: `decision-gov-aud-03-snapshot-correction-approver-acceptance.md`
- Issue #8: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/8
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
