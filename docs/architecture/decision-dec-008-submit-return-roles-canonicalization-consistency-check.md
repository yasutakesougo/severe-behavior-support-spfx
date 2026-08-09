# DEC-008 提出・差戻しロール — docs / transition / PR #147 整合確認

Status: **FINAL CONSISTENT**（2026-08-09）
Independent Review: **PASS**（P0=0 / P1=0 / P2=0）
  reviewed content HEAD: `d1b5d544d900a548110bae4df110f5a73cc392bd`
  → `decision-dec-008-submit-return-roles-independent-review.md`
PR #147: MERGED
  merge commit: `ce05cd0d355c108a63e17bce5af0538af779246e`
  merged head: `31e1df01ae78af7f75ba75d35d8ce01fa20465db`

Related:

- Acceptance LOCKED: `docs/architecture/decision-dec-008-submit-return-roles-acceptance.md`
- Independent Review: `docs/architecture/decision-dec-008-submit-return-roles-independent-review.md`
- Decision packet: `docs/architecture/decision-dec-008-submit-return-roles-decision-packet.md`
- Separation: `docs/architecture/decision-dec-008-support-plan-role-separation.md`
- Transition: `docs/architecture/support-plan-status-transition.md`
- PR #147: DEC-008 submit/return Option C Acceptance（MERGED）

---

## 1. Purpose

DEC-008 提出・差戻しロールを **Option C / LOCKED Accepted** として正本化したあと、
**Acceptance / 分離表 / role-free 遷移契約 / PR #147** が矛盾していないことを確認する。

この確認は **次 substantive unit 選定でも Implementation 着手でもない**。

---

## 2. Expected locked meaning

| Axis | Expected |
|---|---|
| DEC-008 / SUBMIT_RETURN_ROLES | **Accepted / LOCKED / Option C** |
| 提出ロール（application） | **固定しない / NOT ADOPTED** |
| 差戻しロール（application） | **固定しない / NOT ADOPTED** |
| 制度上の作成者 | **UNCHANGED** = 実践研修修了者 |
| 独立した最終承認者 | **NOT ADOPTED / 再導入しない** |
| `transitionSupportPlanStatus` | **UNCHANGED / role-free** |
| Draft→PendingReview / PendingReview→Returned | **辺は維持**（ロール Binding なし） |
| FindingCode | HOLD |
| A-5 | HOLD |
| Implementation Start | HOLD |
| Next substantive unit | NOT SELECTED |

---

## 3. Check matrix

| # | Source | Check | Result |
|---|---|---|---|
| C1 | Acceptance LOCKED block | wording matches Human Option C | **PASS** |
| C2 | Human reason | 最終承認者 NOT ADOPTED の別名再導入を避ける | **PASS** |
| C3 | Separation table | 提出・差戻し = NOT ADOPTED（app） | **PASS** |
| C4 | Transition contract | role-free 維持；5 辺削除なし | **PASS** |
| C5 | Institutional creator | UNCHANGED / 再決定なし | **PASS** |
| C6 | Final approver | NOT ADOPTED / 再導入なし | **PASS** |
| C7 | FindingCode / A-5 / Implementation | HOLD | **PASS** |
| C8 | PR #147 | MERGED；merge preserves LOCKED meaning | **PASS** |

```text
Docs-internal consistency: PASS
Independent Review: PASS（d1b5d544… / P0=0 / P1=0 / P2=0）
PR #147 merge: PASS（ce05cd0… / head 31e1df0…）
Contradiction found in repository docs: NONE
Verdict: FINAL CONSISTENT
```

---

## 4. Verdict rules

| Outcome | Condition | Next |
|---|---|---|
| **CONSISTENT** | C1–C8 all PASS | Human が次の substantive unit を選ぶ |
| **INCONSISTENT** | any FAIL | 矛盾箇所を特定し Human 判断 |
| **BLOCKED** | PR 未マージで意味が壊れる | Merge してから再確認 |

Current: **FINAL CONSISTENT**

---

## 5. Explicit non-goals

```text
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
独立最終承認者の再導入: FORBIDDEN
提出/差戻しロール Binding: FORBIDDEN（本 Acceptance）
transitionSupportPlanStatus 破壊: FORBIDDEN
```

---

## 6. After FINAL CONSISTENT

```text
Next substantive unit: NOT SELECTED
Agent auto-select: FORBIDDEN
FindingCode / A-5 / Implementation: HOLD
```

Human が次の substantive unit を新たに選ぶ。
