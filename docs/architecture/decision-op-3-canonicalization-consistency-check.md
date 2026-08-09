# Decision-OP-3 正本化 — docs / membership / PR #146 整合確認

Status: **CONSISTENT**（docs-internal / 2026-08-09）  
PR #146 merge: PENDING_AT_MERGE（未マージなら Merge 後も意味維持を確認）

Related:

- Acceptance LOCKED: `docs/architecture/decision-op-3-observation-period-schema-acceptance.md`
- Logical contract: `docs/architecture/observation-period-schema-contract.md`
- Membership: `docs/architecture/observation-period.md`
- PR #146: Decision-OP-3 Acceptance docs

---

## 1. Purpose

Decision-OP-3 を **LOCKED Accepted** として正本化したあと、
**Acceptance / 論理契約 / メンバシップ契約 / PR #146** が矛盾していないことを確認する。

この確認は **次 substantive unit 選定でも Implementation 着手でもない**。

---

## 2. Expected locked meaning

| Axis | Expected |
|---|---|
| Decision-OP-3 | **Accepted / LOCKED** |
| periodFrom | **REQUIRED** |
| periodTo | **REQUIRED** |
| Open-ended periodTo | **NOT ADOPTED** |
| 制度日数・既定観察窓の domain 埋め込み | **NOT ADOPTED** |
| evaluateObservationPeriodMembership | **UNCHANGED** |
| FindingCode | HOLD |
| A-5 | HOLD |
| Implementation Start | HOLD |
| Next substantive unit | NOT SELECTED |
| SharePoint / DEC-6 | OUT |

---

## 3. Check matrix

| # | Source | Check | Result |
|---|---|---|---|
| C1 | Acceptance LOCKED block | wording matches Human freeze | **PASS** |
| C2 | Logical Schema contract | periodFrom/periodTo REQUIRED；open-end NOT ADOPTED；day count NOT ADOPTED | **PASS** |
| C3 | Membership contract | periodTo required；no domain day constants；function UNCHANGED | **PASS** |
| C4 | Open-points U1–U4 | fields ADOPTED；open-end NOT；day count NOT | **PASS** |
| C5 | GOV-RULE-06 separation | 3ヶ月 cadence ≠ observation Schema days | **PASS** |
| C6 | FindingCode / A-5 / Implementation | HOLD | **PASS** |
| C7 | Next substantive unit | NOT SELECTED；自動選定しない | **PASS** |
| C8 | PR #146 | docs Acceptance on branch；merge preserves meaning | PENDING_AT_MERGE |

```text
Docs-internal consistency: PASS
PR #146 merge: PENDING — Human Merge GO（if still open）
Contradiction found in repository docs: NONE
Verdict (docs): CONSISTENT
Final after merge: CONSISTENT if C8 PASS
```

---

## 4. Verdict rules

| Outcome | Condition | Next |
|---|---|---|
| **CONSISTENT** | C1–C8 all PASS | Human が次の substantive unit を選ぶ |
| **INCONSISTENT** | any FAIL | 矛盾箇所を特定し Human 判断 |
| **BLOCKED** | PR 未マージで意味が壊れる | Merge してから再確認 |

Current: **DOCS CONSISTENT / MERGE PENDING**

---

## 5. Explicit non-goals

```text
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
日数・期限 invention: FORBIDDEN
evaluateObservationPeriodMembership 破壊: FORBIDDEN
```

---

## 6. After CONSISTENT（merge 後）

```text
Next substantive unit: NOT SELECTED
Selection packet: OPEN
  → decision-next-substantive-unit-selection-packet.md
Agent auto-select: FORBIDDEN
FindingCode / A-5 / Implementation: HOLD
```

Human が packet から次の substantive unit を選ぶ。
候補の自動選定はしない。
