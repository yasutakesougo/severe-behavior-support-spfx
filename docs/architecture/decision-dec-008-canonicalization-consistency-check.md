# DEC-008 正本化 — docs / Issue #8 / PR #143 整合確認

Status: **READY_FOR_FINAL_CHECK**（Issue #8 実コメント後に最終判定）

Related:

- DEC-008 Acceptance: `docs/architecture/decision-dec-008-acceptance.md`
- Issue #8 ledger registration: `docs/architecture/decision-dec-008-issue8-ledger-registration.md`
- PR #143: DEC-008 Acceptance docs
- SupportPlan role-free contract: `docs/architecture/support-plan-status-transition.md`

---

## 1. Purpose

DEC-008 を **LOCKED Accepted** として正本化したあと、
**docs / Issue #8 / PR #143** の意味が矛盾していないことを確認する。

この確認は **次 substantive unit 選定でも FindingCode / Implementation 着手でもない**。

矛盾がなければ、次の substantive unit を **新たに選ぶ段階** に入る。

---

## 2. Expected locked meaning

| Axis | Expected |
|---|---|
| 制度上の作成者 | **ACCEPTED** = 強度行動障害支援者養成研修（実践研修）修了者 = 支援計画シート等の制度上の作成者 |
| 独立した最終承認者 | **NOT ADOPTED** → アプリ独自の最終承認者を設定しない |
| サービス管理責任者を最終承認者とする案 | **NOT ADOPTED / 不採用** |
| 分離境界 | 制度上の作成者 ≠ 独立最終承認者。制度資料が支持しない承認フローを追加しない |
| FindingCode | HOLD / DO NOT CREATE |
| A-5 | HOLD |
| Implementation Start | HOLD |
| Next substantive unit | NOT SELECTED |
| `support-plan-status-transition` | role-free / UNCHANGED |

---

## 3. Check matrix

| # | Source | Check | Result |
|---|---|---|---|
| C1 | docs Acceptance | locked wording present in `decision-dec-008-acceptance.md` | **PASS** |
| C2 | authoring Acceptance | 実践研修修了者 = 制度上の作成者 | **PASS** |
| C3 | final-approver Acceptance | independent final approver NOT ADOPTED / アプリ独自の最終承認者を設定しない | **PASS** |
| C4 | separation framing | creator vs independent approver separated; no unsupported approval flow | **PASS** |
| C5 | SupportPlan contract | role-free transition UNCHANGED; no role checks invented | **PASS** |
| C6 | FindingCode / A-5 / Implementation | HOLD / DO NOT CREATE / HOLD | **PASS** |
| C7 | Next substantive unit | NOT SELECTED；自動選定しない | **PASS** |
| C8 | PR #143 | docs Acceptance merged; meaning preserved | **PASS** — MERGED `713c40a…` / head `cfbbcd3…` |
| C9 | Issue #8 | DEC-008 Accepted comment exists; body matches §1 paste | PENDING_HUMAN_POST / VERIFY |

```text
Docs-internal consistency: PASS
PR #143 merge: PASS（713c40a0126fce50d13a8816270890e1016c443b）
Issue #8 live post: PENDING — Human
Contradiction found in repository docs: NONE
Current: DOCS+MERGE PASS / LIVE LEDGER PENDING
```


---

## 4. Verdict rules

| Outcome | Condition | Next |
|---|---|---|
| **CONSISTENT** | C1–C9 all PASS | Human が次の substantive unit を選ぶ |
| **INCONSISTENT** | any FAIL | 矛盾箇所を特定し、docs / Issue #8 のどちらを正とするか Human 判断 |
| **BLOCKED** | Issue #8 未投稿 or PR 未マージで意味が壊れる | Human が投稿/Merge してから再確認 |

Current: **DOCS PASS / LIVE LEDGER PENDING**

---

## 5. Explicit non-goals

整合確認が PASS でも、自動では進めない:

- 次 substantive unit の選定
- FindingCode 作成
- A-5
- Implementation Start
- アプリ独自の最終承認フロー追加
- サービス管理責任者 = 最終承認者 の再導入

---

## 6. After CONSISTENT

Human が次の substantive unit を新たに選ぶ。

候補の提示は、Human が求めたときだけ行う。
