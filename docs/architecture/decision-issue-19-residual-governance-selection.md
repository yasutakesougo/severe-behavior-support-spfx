# Issue #19 — Residual Governance — Human Selection Packet

この文書は、SHELL-UX C-G MERGED（PR #254）後の
**次 substantive unit** として **Issue #19 residual governance** を固定する
docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1
Kind: Human Selection（next substantive unit / Issue #19 track）
Status: SELECTED / LOCKED（track GO boundary）
Human Decision: SELECT #19 residual governance
Date: 2026-08-11
PR: #255（Selection / Acceptance only）

Baseline:
  main tip = c0e0a11e6c21bc0ac9faf0b98685d0871cadc40e
  SHELL-UX C-G = MERGED（PR #254）
  SHELL-UX-6 / C-A = MERGED（PR #250）
  Issue Status Reconciliation = CONSUMED / KEEP OPEN defaults for #15〜#19
  Research Agent v1 = COMPLETE / EXIT REVIEW PASS（Issue #219）
  HD-RA-01〜04 = Accepted / LOCKED（do not auto-answer #19）

Candidate origin:
  Issue #219 Next step（implementation-priority candidates）:
    #22 next adapter slice
    #28 shell UX
    #19 residual governance
  Human explicit: SELECT #19 residual governance

First residual Decision inside #19: NOT SELECTED
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
#28 further shell UX slice: NOT AUTHORIZED
Agent auto-select / auto-Accepted: FORBIDDEN
```

## 1. Why this unit now

```text
Issue #219 の実装寄与候補に #19 residual governance が明示されている。
SHELL-UX 線は C-G（horizontal-scroll + 200% smoke）まで MERGED。
#19 は KEEP OPEN のまま、未回答の法人運用・監査・性能・職員条件を保持する。
HD-RA-* は application 境界を狭めたが、#19 の未回答を自動解消しない。
次は #19 残件を一件ずつ Human Decision する track を開く。
```

## 2. Selected unit

```text
#19 residual governance
= Issue #19 に残る governance questionnaire / ORG_POLICY / MIXED 項目の
  residual Decision track
```

Meaning:

```text
authorize the #19 residual governance track now
do NOT invent answers
do NOT batch-Accept remaining items
do NOT Close #19
first concrete residual Decision = separate Human SELECT
```

## 3. Locked basis（再 Decision しない）

| ID | Status | Notes |
|---|---|---|
| GOV-AUD-02 | Accepted | Handoff state-change roles（#19 `5215209914`） |
| GOV-AUD-03 | Accepted / Option E | Snapshot correction approver = application 対象外 |
| GOV-AUD-04 | Accepted / Option E / FINAL CONSISTENT | Logical-delete role = application 対象外 |
| GOV-AUD-05 / DEC-012（retention prohibition） | Accepted / LOCKED / Option A | 保存期間中の完全削除禁止 |
| GOV-AUD-06 / DEC-011 / Decision-AUD-RET-1 | Accepted | AuditLog 最低5年 / `occurredAt` / 自動削除しない |
| DEC-009 | Accepted / LOCKED / Option A / FINAL CONSISTENT | Snapshot save timing |
| Decision-RD-3 | Accepted / LOCKED | Monitoring guidance / informational only |
| GOV-RULE-05 | Accepted | Review anchor |
| GOV-RULE-06 | Accepted | Practice cadence |
| GOV-RULE-07 | Accepted / Option C | Notice start |
| GOV-RULE-08 | Accepted / Option A / NOT ADOPTED | hard due/overdue NOT ADOPTED |
| HD-RA-01〜04 | Accepted / LOCKED | Narrow app boundary；do not answer #19 residuals |
| Decision-HO-1 | Accepted（Owner #17） | Handoff transition ownership；≠ GOV-AUD-01 |

Batch A-1 technical boundaries（DEC-005 Accepted 等）は維持する。
法人ロール Proposed / Deferred 理由コードは再 Decision しないが、未 Accepted のまま残す。

## 4. Residual inventory（OPEN / NOT Accepted）— provisional

本表は **read-only inventory** である。行の Accepted ではない。
優先順位の確定でもない。一件ずつ Human SELECT する。

| Residual ID | Topic | Class | Status |
|---|---|---|---|
| GOV-AUD-01 | handoff の正本 | ORG_POLICY | **Accepted / LOCKED / Option C + identity fill-in LOCKED**（[`decision-gov-aud-01-identity-fill-in-acceptance.md`](./decision-gov-aud-01-identity-fill-in-acceptance.md)） |
| GOV-AUD-05 / DEC-012 post-retention deletion | 5年経過後の完全削除可否 | MIXED | OPEN / NOT SELECTED |
| GOV-AUD-07 | バックアップ・復元の一次責任者 | ORG_POLICY | **Accepted / LOCKED / Option A**（[`decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md`](./decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md)；DEC-015 NOT ACCEPTED） |
| GOV-AUD-08 | 復旧後の業務確認者 | ORG_POLICY | **Accepted / LOCKED / Option B**（[`decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md`](./decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md)） |
| GOV-AUD-09 | 再開承認者 | ORG_POLICY | **Accepted / LOCKED / Option A**（[`decision-gov-aud-09-resume-approver-option-a-acceptance.md`](./decision-gov-aud-09-resume-approver-option-a-acceptance.md)） |
| GOV-AUD-10 | 重大障害時の連絡経路 | ORG_POLICY | OPEN / NOT SELECTED |
| GOV-STAFF-01〜12 | 職員・利用者所属 / 資格 / 異動 | ORG_POLICY / MIXED / EVIDENCE_REQUIRED | OPEN / NOT SELECTED |
| GOV-RULE-01 org reminder / trigger | 評価周期の法人通知・臨時確認 | MIXED（org part） | Proposed / NOT Accepted |
| GOV-RULE-02〜04 | 観察期間起算・終了・必要件数 | EVIDENCE_REQUIRED / MIXED | OPEN / NOT SELECTED |
| GOV-RULE-09〜12 | ルール責任者・承認・境界・訂正 | ORG_POLICY / MIXED | OPEN / NOT SELECTED |
| DEC-003 org roles | 点数根拠登録・最終確認ロール | MIXED（org part） | Proposed / NOT Accepted |
| DEC-006 concrete reason codes | 対象外理由コード | EVIDENCE_REQUIRED / MIXED | Deferred |
| DEC-007 org response roles | 算定不能時の法人対応ロール | MIXED（org part） | Proposed / NOT Accepted |
| GOV-PERF-01〜11 | 性能目標・測定条件 | ORG_POLICY | OPEN / NOT SELECTED |
| DEC-015 | バックアップ・復元責任者（ledger） | ORG_POLICY | OPEN（GOV-AUD-07 と整合要） |

```text
Stale marker correction（docs truth）:
  「GOV-AUD-01〜10 = 正式回答待ち」は不正確。
  01 / 02 / 03 / 04 / 05(retention) / 06 / 07(Option A) / 08(Option B) / 09(Option A) は Accepted。
  10 および post-retention deletion が OPEN 残件。
  DEC-015 = NOT ACCEPTED（GOV-AUD-07 と整合要 / 別 sync）。
```

## 5. Authorized IN（Selection scope）

```text
IN:
  #19 residual governance track を current substantive unit とする
  OPEN residual の inventory 維持 / 更新（docs-only）
  残件を一件ずつ選ぶための Selection / Decision Packet 作成
  Accepted 済み GOV-AUD / GOV-RULE との分離維持
  stale「01〜10 全部未回答」表現の docs 同期（別 PR可）
  Human Acceptance / LOCKED 記録（残件ごと）
```

## 6. Explicit OUT / FORBIDDEN

```text
OUT:
  未回答 GOV 項目への値・ロール・日数・連絡先の発明
  residual 行の一括 Accepted / LOCKED
  First residual Decision の Agent auto-select
  Issue #19 Close
  Issue #15〜#18 batch Close
  Implementation Start（domain / SPFx / adapter）
  FindingCode / A-5 invention
  SharePoint / Microsoft 365 / Entra mutation
  Deploy / real data
  #22 adapter continuation
  #28 next shell UX slice auto-select（C-H 含む）
  Research Agent v2 / DELTA-WATCH auto-start
  treating HD-RA-* as #19 answers
  treating Proposed / Deferred as Accepted
  INTENDED = CONFIRMED
```

## 7. Options considered

| ID | Unit | Result |
|---|---|---|
| A | #22 next adapter slice | NOT SELECTED |
| B | #28 further shell UX（例: C-H Issue-body SoT refresh） | NOT SELECTED |
| **C** | **#19 residual governance** | **SELECTED** |
| D | Research Agent v2 / DELTA-WATCH policy | NOT SELECTED |
| E | HOLD / no next substantive unit | NOT SELECTED |

```text
Why C now:
  Human explicit SELECT #19 residual governance
  Issue #219 lists it among post-reconciliation implementation-priority candidates
  SHELL-UX C-G MERGED；shell track continuation is optional, not forced
  Selecting C does not Close #19 and does not invent answers
```

## 8. Stop condition

```text
Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1
= SELECTED / LOCKED

HOLD:
  First residual Decision inside #19 = NOT SELECTED
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED

Still NOT AUTHORIZED:
  code / SharePoint / M365 / Deploy
  batch residual Acceptance
  treating this Selection as any concrete GOV answer
```

## 9. Next（Human only）

```text
Consumed progression:
  PR #255 IR → Ready → Merge = COMPLETE
  First residual unit SELECT = GOV-AUD-01（PR #256 MERGED）
  GOV-AUD-01 Option C = Accepted / LOCKED（PR #257 MERGED）
  GOV-AUD-01 identity fill-in = Accepted / LOCKED（PR #258 MERGED）
    （Decision-GOV-AUD-01-IDENTITY-1）
  GOV-AUD-07 unit SELECT = MERGED（PR #259）
  GOV-AUD-07 Option A = Accepted / LOCKED（PR #260 MERGED）
    （decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md）
  GOV-AUD-08 unit SELECT = MERGED（PR #261）
  GOV-AUD-08 Option B = Accepted / LOCKED（PR #262 MERGED）
    （decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md）
  GOV-AUD-09 unit SELECT = MERGED（PR #263）
  GOV-AUD-09 Option A = Accepted / LOCKED
    （decision-gov-aud-09-resume-approver-option-a-acceptance.md）

Next:
  1. GOV-AUD-09 Option A Acceptance PR: IR → Human Ready → Human Merge
  2. After Merge: 次残件を Human SELECT（Agent auto-advance FORBIDDEN）
  3. DEC-015 ledger sync = separate if needed（NOT auto-Accepted）
  4. #19 Close は残件移管完了後の別 Human disposition
```

First residual history（consumed）:

```text
SELECT GOV-AUD-01 → Option C Accepted → identity fill-in Accepted
identity: decision-gov-aud-01-identity-fill-in-acceptance.md
```

GOV-AUD-07 history:

```text
SELECT GOV-AUD-07 → Option A Accepted（Microsoft 365管理者）
Acceptance: decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md
DEC-015: NOT ACCEPTED
```

GOV-AUD-08 history:

```text
SELECT GOV-AUD-08 → Option B Accepted（業務責任者または指定確認者）
Acceptance: decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md
```

GOV-AUD-09 history:

```text
SELECT GOV-AUD-09 → Option A Accepted（事業所管理者）
Acceptance: decision-gov-aud-09-resume-approver-option-a-acceptance.md
```

## Reference

- Acceptance: `decision-issue-19-residual-governance-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
- Issue #219 next-unit note（#19 residual governance candidate）
- Continuity: `issue-status-reconciliation-continuity-4-9-12-15-19.md`（KEEP OPEN）
- Post-RA: `post-ra-canonical-reconciliation.md`（#19 not auto-answered）
- Ownership: `finding-audit-ownership.md`
- Prior shell tip: PR #254 / `shell` C-G evidence on main `c0e0a11…`
