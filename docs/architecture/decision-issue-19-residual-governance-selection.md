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
| GOV-AUD-05 / DEC-012 post-retention deletion | 5年経過後の完全削除可否 | MIXED | **Accepted / LOCKED / Option C**（[`decision-gov-aud-05-dec-012-post-retention-deletion-option-c-acceptance.md`](./decision-gov-aud-05-dec-012-post-retention-deletion-option-c-acceptance.md)；初期版は経過後完全削除機能なし） |
| GOV-AUD-07 | バックアップ・復元の一次責任者 | ORG_POLICY | **Accepted / LOCKED / Option A**（[`decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md`](./decision-gov-aud-07-backup-restore-owner-option-a-acceptance.md)；DEC-015 NOT ACCEPTED） |
| GOV-AUD-08 | 復旧後の業務確認者 | ORG_POLICY | **Accepted / LOCKED / Option B**（[`decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md`](./decision-gov-aud-08-post-recovery-confirmer-option-b-acceptance.md)） |
| GOV-AUD-09 | 再開承認者 | ORG_POLICY | **Accepted / LOCKED / Option A**（[`decision-gov-aud-09-resume-approver-option-a-acceptance.md`](./decision-gov-aud-09-resume-approver-option-a-acceptance.md)） |
| GOV-AUD-10 | 重大障害時の連絡経路 | ORG_POLICY | **Accepted / LOCKED（fill-in / role names）**（[`decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md`](./decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md)） |
| GOV-STAFF-01 | 異動・退職情報の確定者 | ORG_POLICY | **Accepted / LOCKED / Option C**（[`decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md`](./decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md)） |
| GOV-STAFF-02 | Entra IDグループから削除する実施者 | ORG_POLICY | **Accepted / LOCKED / Option B**（[`decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md`](./decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md)） |
| GOV-STAFF-03 | 権限停止期限 | ORG_POLICY | **Accepted / LOCKED / Option A**（[`decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md`](./decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md)） |
| GOV-STAFF-04 | 利用者異動台帳の保存先 | ORG_POLICY | **Accepted / LOCKED / Option C**（[`decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md`](./decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md)） |
| GOV-STAFF-05 | 異動後の過去記録の閲覧範囲 | ORG_POLICY | **Accepted / LOCKED / Option C**（[`decision-gov-staff-05-post-transfer-past-record-access-option-c-acceptance.md`](./decision-gov-staff-05-post-transfer-past-record-access-option-c-acceptance.md)） |
| GOV-STAFF-06 | 資格・研修マスターの正本管理者 | ORG_POLICY | **Accepted / LOCKED / Option B**（[`decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md`](./decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md)） |
| GOV-STAFF-07 | 資格・研修情報の確認者 | ORG_POLICY | **Accepted / LOCKED / Option C**（[`decision-gov-staff-06-12-qualification-training-bundle-option-acceptance.md`](./decision-gov-staff-06-12-qualification-training-bundle-option-acceptance.md)） |
| GOV-STAFF-08 | 研修割合の分母 | ORG_POLICY / MIXED | **Accepted / LOCKED / Option C**（同上 bundle；具体閾値 NOT INVENTED） |
| GOV-STAFF-09 | 兼務者の集計 | ORG_POLICY / MIXED | **Accepted / LOCKED / Option C**（同上；二重計上防止方針 LOCKED） |
| GOV-STAFF-10 | 休職・長期不在・短期応援・派遣委託 | ORG_POLICY / MIXED | **Accepted / LOCKED / Option C-based**（同上；全区分 C） |
| GOV-STAFF-11 | 期限のない資格・研修 | ORG_POLICY | **Accepted / LOCKED / Option B**（同上；validTo/周期 NOT DETERMINED） |
| GOV-STAFF-12 | 証跡欠損時の扱い | ORG_POLICY | **Accepted / LOCKED / Option C**（同上；missing / 算定不能 / 管理者確認待ち） |
| GOV-RULE-01 | 行動関連点数の評価周期 | EVIDENCE_REQUIRED / MIXED | **SELECTED / LOCKED / HOLD**（[`decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md`](./decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md)；VALUE NOT DETERMINED） |
| GOV-RULE-02 | 観察期間の起算日 | ORG_POLICY / MIXED | **Accepted / LOCKED / Option A**（同上 bundle；支援計画の有効開始日） |
| GOV-RULE-03 | 観察期間の終了日 | ORG_POLICY / MIXED | **Accepted / LOCKED / Option A**（同上 bundle；見直し実施日の前日） |
| GOV-RULE-04 | 必要観察件数 | EVIDENCE_REQUIRED / MIXED | **SELECTED / LOCKED / HOLD**（同上 bundle；VALUE NOT DETERMINED） |
| GOV-RULE-09 | ルール内容の責任者 | ORG_POLICY | **Accepted / LOCKED / Option B**（[`decision-gov-rule-09-rule-content-owner-option-b-acceptance.md`](./decision-gov-rule-09-rule-content-owner-option-b-acceptance.md)） |
| GOV-RULE-10 | ルール変更の承認者 | ORG_POLICY | **Accepted / LOCKED / Option C**（[`decision-gov-rule-10-change-approver-option-c-acceptance.md`](./decision-gov-rule-10-change-approver-option-c-acceptance.md)） |
| GOV-RULE-11 | 制度値と法人運用値の境界 | ORG_POLICY / MIXED | **Accepted / LOCKED（fill-in）**（[`decision-gov-rule-11-value-boundary-fill-in-acceptance.md`](./decision-gov-rule-11-value-boundary-fill-in-acceptance.md)） |
| GOV-RULE-12 | 過去ルール版の訂正 | ORG_POLICY / MIXED | **Accepted / LOCKED / Option B**（[`decision-gov-rule-12-version-correction-option-b-acceptance.md`](./decision-gov-rule-12-version-correction-option-b-acceptance.md)） |
| DEC-003 org roles | 点数根拠登録・最終確認ロール | MIXED（org part） | Proposed / NOT Accepted |
| DEC-006 concrete reason codes | 対象外理由コード | EVIDENCE_REQUIRED / MIXED | Deferred |
| DEC-007 org response roles | 算定不能時の法人対応ロール | MIXED（org part） | Proposed / NOT Accepted |
| GOV-PERF-01〜11 | 性能目標・測定条件 | ORG_POLICY | OPEN / NOT SELECTED |
| DEC-015 | バックアップ・復元責任者（ledger） | ORG_POLICY | OPEN（GOV-AUD-07 と整合要） |

```text
Stale marker correction（docs truth）:
  「GOV-AUD-01〜10 = 正式回答待ち」は不正確。
  01 / 02 / 03 / 04 / 05(retention) / 06 / 07(Option A) / 08(Option B) / 09(Option A) / 10(fill-in) は Accepted。
  GOV-RULE-09 = Accepted / LOCKED / Option B（法人業務責任者）。
  GOV-RULE-10 = Accepted / LOCKED / Option C（業務責任者内容確認 + 法人管理者承認）。
  GOV-RULE-11 = Accepted / LOCKED（fill-in；法人運用=GOV-RULE-05〜10 / 制度固定・事業所=確定なし）。
  GOV-RULE-12 = Accepted / LOCKED / Option B（訂正版を新規作成し、旧版を保持）。
  GOV-STAFF-01 = Accepted / LOCKED / Option C（事業所管理者が起票し、法人担当が確定）。
  GOV-STAFF-02 = Accepted / LOCKED / Option B（Microsoft 365管理者）。
  GOV-STAFF-03 = Accepted / LOCKED / Option A（異動・退職の発効日時までに権限停止）。
  GOV-STAFF-04 = Accepted / LOCKED / Option C（専用の法人共通台帳。支援内容は保存しない）。
  GOV-STAFF-05 = Accepted / LOCKED / Option C（記録時点 SiteId 維持 + 異動先は明示権限の範囲だけ）。
  GOV-STAFF-06 = Accepted / LOCKED / Option B（法人業務責任者；bundle CONFIRMED）。
  GOV-STAFF-07〜12 = Accepted / LOCKED（Decision-GOV-STAFF-06-12-BUNDLE-1）。
  GOV-RULE-01 = SELECTED / LOCKED / HOLD；GOV-RULE-02/03 = Accepted / Option A；GOV-RULE-04 = SELECTED / LOCKED / HOLD。
  GOV-RULE-05〜12 = CONFIRMED / UNCHANGED。
  post-retention deletion = Accepted / LOCKED / Option C（初期版は経過後完全削除機能なし）。
  GOV-PERF / GOV-RULE-01・04 HOLD 解除 が OPEN 残件。
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
  GOV-AUD-09 Option A = Accepted / LOCKED（PR #264 MERGED）
    （decision-gov-aud-09-resume-approver-option-a-acceptance.md）
  GOV-AUD-10 unit SELECT = MERGED（PR #265）
  GOV-AUD-10 Fill-in = Accepted / LOCKED（role names；PR #266 MERGED）
    （decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md）
  GOV-RULE-09 unit SELECT = MERGED（PR #267）
  GOV-RULE-09 Option B = Accepted / LOCKED（PR #268 MERGED）
    （decision-gov-rule-09-rule-content-owner-option-b-acceptance.md）
  GOV-RULE-10 unit SELECT + Option C = Accepted / LOCKED（PR #269 MERGED）
    （decision-gov-rule-10-change-approver-option-c-acceptance.md）
  GOV-RULE-11 unit SELECT = MERGED（PR #270）
  GOV-RULE-11 Fill-in = Accepted / LOCKED（PR #271 MERGED）
    （decision-gov-rule-11-value-boundary-fill-in-acceptance.md）
  GOV-RULE-12 unit SELECT = MERGED（PR #272）
  GOV-RULE-12 Option B = Accepted / LOCKED（PR #273 MERGED）
    （decision-gov-rule-12-version-correction-option-b-acceptance.md）
  GOV-STAFF-01 unit SELECT + Option C = Accepted / LOCKED（PR #274 MERGED）
    （decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md）
  GOV-STAFF-02 unit SELECT + Option B = Accepted / LOCKED（PR #275 MERGED）
    （decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md）
  GOV-STAFF-03 unit SELECT = MERGED（PR #276）
  GOV-STAFF-03 Option A = Accepted / LOCKED（PR #277 MERGED）
    （decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md）
  GOV-STAFF-04 unit SELECT + Option C = Accepted / LOCKED（PR #278 MERGED）
    （decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md）
  GOV-STAFF-05 unit SELECT + Option C = Accepted / LOCKED（PR #279 MERGED）
    （decision-gov-staff-05-post-transfer-past-record-access-option-c-acceptance.md）
  GOV-STAFF-06 unit SELECT + Option B = Accepted / LOCKED（PR #280 MERGED）
    （decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md）
  GOV-STAFF-06〜12 bundle SELECT + Options = Accepted / LOCKED（PR #281 MERGED）
    （decision-gov-staff-06-12-qualification-training-bundle-option-acceptance.md）
  GOV-RULE-01〜04 bundle SELECT + Options/HOLD = Accepted / LOCKED（PR #282 MERGED）
    （decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md）
  post-retention deletion unit SELECT = PR #283 MERGED
  post-retention deletion Option C = Accepted / LOCKED（PR #284）
    （decision-gov-aud-05-dec-012-post-retention-deletion-option-c-acceptance.md）

Next:
  1. post-retention Option C Acceptance PR: IR → Human Ready → Human Merge
  2. After Merge: next residual SELECT（one item；Agent auto-advance FORBIDDEN）
  3. GOV-RULE-01 / 04 HOLD 解除 = separate（根拠資料後；NOT auto）
  4. DEC-015 ledger sync = separate if needed（NOT auto-Accepted）
  5. #19 Close は残件移管完了後の別 Human disposition
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

GOV-AUD-10 history:

```text
SELECT GOV-AUD-10 → Fill-in Accepted（role names）
Acceptance: decision-gov-aud-10-incident-contact-path-fill-in-acceptance.md
第一報 / 再開判断 = 事業所管理者
技術連絡 = Microsoft 365管理者
業務連絡 = 業務責任者または指定確認者
個人情報事故の連絡 = 法人管理者
```

GOV-RULE-09 history:

```text
SELECT GOV-RULE-09 → Option B Accepted（法人業務責任者）
Acceptance: decision-gov-rule-09-rule-content-owner-option-b-acceptance.md
```

GOV-RULE-10 history:

```text
SELECT GOV-RULE-10 → Option C Accepted
  （業務責任者が内容確認し、法人管理者が承認）
Acceptance: decision-gov-rule-10-change-approver-option-c-acceptance.md
```

GOV-RULE-11 history:

```text
SELECT GOV-RULE-11 → Fill-in Accepted
Acceptance: decision-gov-rule-11-value-boundary-fill-in-acceptance.md
制度上固定 / 事業所設定 = 現時点では確定なし
法人運用 = GOV-RULE-05〜10 Accepted 論理（90日変換禁止）
```

GOV-RULE-12 history:

```text
SELECT GOV-RULE-12 → Option B Accepted
  （訂正版を新規作成し、旧版を保持）
Acceptance: decision-gov-rule-12-version-correction-option-b-acceptance.md
```

GOV-STAFF-01 history:

```text
SELECT GOV-STAFF-01 → Option C Accepted
  （事業所管理者が起票し、法人担当が確定）
Acceptance: decision-gov-staff-01-transfer-retirement-confirmer-option-c-acceptance.md
```

GOV-STAFF-02 history:

```text
SELECT GOV-STAFF-02 → Option B Accepted（Microsoft 365管理者）
Acceptance: decision-gov-staff-02-entra-group-removal-operator-option-b-acceptance.md
```

GOV-STAFF-03 history:

```text
SELECT GOV-STAFF-03 → Option A Accepted
  （異動・退職の発効日時までに権限停止）
Acceptance: decision-gov-staff-03-access-suspension-deadline-option-a-acceptance.md
```

GOV-STAFF-04 history:

```text
SELECT GOV-STAFF-04 → Option C Accepted
  （専用の法人共通台帳。支援内容は保存しない）
Acceptance: decision-gov-staff-04-user-transfer-ledger-storage-option-c-acceptance.md
```

GOV-STAFF-05 history:

```text
SELECT GOV-STAFF-05 → Option C Accepted
  （記録時点の SiteId を維持し、異動先の閲覧は明示権限がある範囲だけ）
Acceptance: decision-gov-staff-05-post-transfer-past-record-access-option-c-acceptance.md
```

GOV-STAFF-06 history:

```text
SELECT GOV-STAFF-06 → Option B Accepted（法人業務責任者）
Acceptance: decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md
```

GOV-STAFF-06〜12 bundle history:

```text
SELECT GOV-STAFF-06〜12 bundle
  06 CONFIRMED / Option B
  07 Option C / 08 Option C / 09 Option C
  10 Option C-based（全区分 C）
  11 Option B / 12 Option C
Acceptance: decision-gov-staff-06-12-qualification-training-bundle-option-acceptance.md
```

GOV-RULE-01〜04 bundle history:

```text
SELECT GOV-RULE-01〜04 bundle
  01 HOLD / VALUE NOT DETERMINED
  02 Option A（支援計画の有効開始日）
  03 Option A（見直し実施日の前日）
  04 HOLD / VALUE NOT DETERMINED
  05〜12 CONFIRMED / UNCHANGED
Acceptance: decision-gov-rule-01-04-observation-cycle-bundle-option-acceptance.md
```

Current residual（unit）:

```text
post-retention deletion — Accepted / LOCKED / Option C（PR #284）
Acceptance: decision-gov-aud-05-dec-012-post-retention-deletion-option-c-acceptance.md
next residual: NOT SELECTED
```

## Reference

- Acceptance: `decision-issue-19-residual-governance-acceptance.md`
- Issue #19: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/19
- Issue #219 next-unit note（#19 residual governance candidate）
- Continuity: `issue-status-reconciliation-continuity-4-9-12-15-19.md`（KEEP OPEN）
- Post-RA: `post-ra-canonical-reconciliation.md`（#19 not auto-answered）
- Ownership: `finding-audit-ownership.md`
- Prior shell tip: PR #254 / `shell` C-G evidence on main `c0e0a11…`
