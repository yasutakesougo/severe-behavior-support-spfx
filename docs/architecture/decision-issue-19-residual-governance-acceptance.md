# Issue #19 — Residual Governance — Human Acceptance（SELECT）

この文書は、**Issue #19 residual governance** に対する
Human Selection の Acceptance 正本である。

Packet:
[`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)

Depends on（再 Decision しない）:
- Issue #219 Research Agent v1 COMPLETE / EXIT REVIEW PASS
- HD-RA-01〜04 Accepted / LOCKED（`post-ra-canonical-reconciliation.md`）
- SHELL-UX C-G MERGED（PR #254）
- Accepted #19-path Decisions: GOV-AUD-02 / 03 / 04 / 05(retention) / 06 / DEC-009 / RD-3 / GOV-RULE-05〜08
- Continuity KEEP OPEN: `issue-status-reconciliation-continuity-4-9-12-15-19.md`

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1
Status: Accepted / LOCKED（Selection boundary / track）
Human Decision: SELECT #19 residual governance
Human Acceptance date: 2026-08-11
Issue: #19
Baseline tip: c0e0a11e6c21bc0ac9faf0b98685d0871cadc40e
PR: #255（Selection / Acceptance only）

Selected:
  Issue #19 residual governance track

First residual Decision inside #19: CONSUMED（GOV-AUD-01 Accepted / Option C）
Implementation Start: NOT AUTHORIZED
Issue #19 Close: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
#28 further shell UX: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: SELECT #19 residual governance
Decision-ISSUE-19-RESIDUAL-GOVERNANCE-1: Accepted / LOCKED

Meaning:
  authorize the #19 residual governance track as the current substantive unit
  keep each residual answer as a later separate Human Decision
  keep Implementation Start / Issue Close unauthorized
```

## Boundary

```text
SELECT #19 residual governance ≠ any concrete GOV answer
SELECT #19 residual governance ≠ first residual SELECT
SELECT #19 residual governance ≠ Implementation Start
SELECT #19 residual governance ≠ Issue #19 Close
SELECT #19 residual governance ≠ #15〜#18 batch Close
SELECT #19 residual governance ≠ #22 adapter GO
SELECT #19 residual governance ≠ #28 next shell UX slice
SELECT #19 residual governance ≠ Research Agent v2 start
Proposed / Deferred ≠ Accepted
HD-RA-* ≠ #19 questionnaire answers
INTENDED ≠ CONFIRMED
```

## Current execution snapshot

```text
Selection = SELECTED / LOCKED
Acceptance = Accepted / LOCKED（track boundary）
Consumed on #19 path（do not re-Decision）:
  GOV-AUD-01（Option C + identity） / 02 / 03 / 04 / 05(retention prohibition) / 06
  GOV-AUD-07（Option A / Microsoft 365管理者；DEC-015 NOT ACCEPTED）
  GOV-AUD-08（Option B / 業務責任者または指定確認者）
  GOV-AUD-09（Option A / 事業所管理者）
  GOV-AUD-10（fill-in / role names；Decision-GOV-AUD-10-FILL-IN-1）
  GOV-RULE-09（Option B / 法人業務責任者）
  GOV-RULE-10（Option C / 業務責任者内容確認 + 法人管理者承認）
  GOV-RULE-11（fill-in；Decision-GOV-RULE-11-FILL-IN-1）
  GOV-RULE-12（Option B / 訂正版を新規作成し、旧版を保持）
  GOV-STAFF-01（Option C / 事業所管理者が起票し、法人担当が確定）
  GOV-STAFF-02（Option B / Microsoft 365管理者）
  GOV-STAFF-03（Option A / 異動・退職の発効日時までに権限停止）
  GOV-STAFF-04（Option C / 専用の法人共通台帳。支援内容は保存しない）
  GOV-STAFF-05（Option C / 記録時点 SiteId 維持 + 異動先は明示権限の範囲だけ）
  GOV-STAFF-06（Option B / 法人業務責任者）
  GOV-STAFF-07〜12（bundle Options Accepted；Decision-GOV-STAFF-06-12-OPTIONS-1）
  GOV-RULE-01〜04（bundle；01/04 HOLD；02/03 Option A；Decision-GOV-RULE-01-04-OPTIONS-1）
  DEC-009 / RD-3 / GOV-RULE-05 / 06 / 07 / 08
OPEN residual inventory = see Selection §4
First residual inside #19 = CONSUMED（GOV-AUD-01 Accepted / Option C）
Prior residual Option = CONSUMED（GOV-RULE-01〜04 bundle recorded；01 LIFT CANDIDATE / 04 HOLD via Evidence Bundle）
Prior residual = GOV-RULE-01/04 Evidence Bundle（PR #287 MERGED）
Current residual unit = Accepted / LOCKED（GOV-RULE-01 Acceptance；PR pending）
GOV-RULE-04 = HOLD / UNCHANGED
#22 / #28 / Research v2 = NOT SELECTED
```

## Next

```text
Consumed:
  PR #255 Ready + Merge = COMPLETE
  PR #256 GOV-AUD-01 unit SELECT = MERGED
  PR #257 GOV-AUD-01 Option C = MERGED
  PR #258 GOV-AUD-01 identity fill-in = MERGED
  PR #259 GOV-AUD-07 unit SELECT = MERGED
  PR #260 GOV-AUD-07 Option A = MERGED
  PR #261 GOV-AUD-08 unit SELECT = MERGED
  PR #262 GOV-AUD-08 Option B = MERGED
  PR #263 GOV-AUD-09 unit SELECT = MERGED
  PR #264 GOV-AUD-09 Option A = MERGED
  PR #265 GOV-AUD-10 unit SELECT = MERGED
  PR #266 GOV-AUD-10 Fill-in = MERGED
  PR #267 GOV-RULE-09 unit SELECT = MERGED
  PR #268 GOV-RULE-09 Option B = MERGED
  PR #269 GOV-RULE-10 unit SELECT + Option C = MERGED
  PR #270 GOV-RULE-11 unit SELECT = MERGED
  PR #271 GOV-RULE-11 Fill-in = MERGED
  PR #272 GOV-RULE-12 unit SELECT = MERGED
  PR #273 GOV-RULE-12 Option B = MERGED
  PR #274 GOV-STAFF-01 unit SELECT + Option C = MERGED
  PR #275 GOV-STAFF-02 unit SELECT + Option B = MERGED
  PR #276 GOV-STAFF-03 unit SELECT = MERGED
  PR #277 GOV-STAFF-03 Option A = MERGED
  PR #278 GOV-STAFF-04 unit SELECT + Option C = MERGED
  PR #279 GOV-STAFF-05 unit SELECT + Option C = MERGED
  PR #280 GOV-STAFF-06 unit SELECT + Option B = MERGED
  PR #281 GOV-STAFF-06〜12 bundle SELECT + Options = MERGED
  PR #282 GOV-RULE-01〜04 bundle SELECT + Options/HOLD = MERGED
  PR #283 post-retention deletion unit SELECT = MERGED
  PR #284 post-retention deletion Option C = MERGED
  PR #285 GOV-PERF-01〜11 bundle SELECT + Options/HOLD = MERGED
  PR #286 GOV-PERF HOLD Resolution Bundle = MERGED（解除 NOT PERFORMED）
  PR #287 GOV-RULE-01 / 04 Evidence Bundle = MERGED
  GOV-RULE-01 Acceptance = Accepted / LOCKED（PR pending）

Next:
  1. GOV-RULE-01 Acceptance PR: IR → Human Ready → Human Merge
  2. After Merge: next residual SELECT（one item；NOT auto）
  3. RULE-04 corporate ORG_POLICY Decision = separate / NOT auto
  4. PERF HOLD 解除 Acceptance remains separate / NOT auto
  5. DEC-015 ledger sync remains separate / NOT auto-Accepted
  6. #19 Close remains later / separate Human disposition
```

## Reference

- Selection: `decision-issue-19-residual-governance-selection.md`
- Issue #19 remains OPEN; Close = NOT AUTHORIZED
- Issue #219: research track complete；organization-policy residuals remain in #19
