# POST-APPLY-CREATE-CTA-CLARIFICATION-1 — Scope Definition

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-POST-APPLY-CREATE-CTA-CLARIFICATION-1
kind: Scope Definition
mode: READ-ONLY / SCOPE-ONLY
date: 2026-09-04

PRODUCT UNDER TEST (frozen parent)
= 0ba2c63415c85dcb7a3cefd8566202e7f4cd67cf
PR #594 tip = FROZEN / UNCHANGED（本単位に混ぜない）

CTA-ROLE-CLARIFICATION-1
= Actual Staff Re-Check PASS (T1–T5)
= beforeApply CTA_ROLE_AMBIGUITY RESOLVED

NEW FINDING
= POST_APPLY_CREATE_CTA_ROLE_AMBIGUITY = CONFIRMED

Human Start GO — POST-APPLY-CREATE-CTA-CLARIFICATION-1
= NOT RECEIVED

Implementation
= NOT AUTHORIZED

Human Ready GO = HOLD
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## Why this unit

CTA-ROLE-CLARIFICATION-1 は beforeApply の競合 CTA を解消し、Staff T1–T5 PASS。

Staff が Apply 後に質問した:

```text
「次の版を作るは、版5に進む？」
```

これは旧bundleではない。`0ba2c63` の仕様どおり、afterApply で disabled `次の版を作る（表示専用）` が再表示される。

分類:

```text
≠ Apply defect
≠ version-transition defect
≠ CTA-ROLE-CLARIFICATION-1 regression
≠ 版5計算不足

= post-Apply display-only CTA の役割曖昧（presentation）
```

次版作成は未接続。説明を増やしたり「版5へ進む」に作り替えるより、**非機能 CTA を afterApply で非表示**にするのが最小。

---

## Exact current behavior at PUT `0ba2c63`

`SupportPlan.tsx` `nextVersionBlock` create-cta gate:

```text
{!adminRead && !revisionDraft ? ( create-cta ) : null}
```

| State | create-cta |
|---|---|
| cold / no draft / no receipt | **shown** (disabled / 表示専用) |
| beforeApply / revisionDraft | **hidden** (CTA-ROLE-CLARIFICATION-1) |
| afterApply / activationReceipt | **shown again** ← finding |

afterApply primary（RETAIN・SIMPLIFICATION-2）:

```text
現在適用中: 版 4
過去版: 版 3
次に変更するときは、新しい版を作ります。
現在の版はそのまま残ります。
D5 / D6
本番には保存されていません
```

---

## Required correction

When `activationReceipt` present (afterApply):

```text
HIDE
- 次の版を作る（表示専用）
  data-review-new-version="create-cta"
```

Do **not**:

- add 版5 calculation
- enable / rewire create-cta into real next-version creation
- change Apply / session / CAS / schema
- reopen beforeApply CTA-ROLE behavior
- reopen post-Apply SIMPLIFICATION-2 copy

---

## IN / RETAIN / OUT

### IN

- afterApply section ⑥ create-cta **visibility only**
- hide `次の版を作る（表示専用）` while `activationReceipt` exists
- presentation / visibility only

### RETAIN

- `現在適用中: 版 4`
- `過去版: 版 3`
- `次に変更するときは、新しい版を作ります。`
- `現在の版はそのまま残ります。`
- D5 / D6 notes
- `本番には保存されていません`
- beforeApply CTA-ROLE-CLARIFICATION-1 behavior (draft hides create-cta)
- cold / no-draft create-cta (disabled display-only) unchanged unless unavoidable
- Apply handler / business conditions unchanged

### OUT

- 版5 calculation
- real next-version create feature
- Apply / activation domain / version transition
- session / CAS / schema / repository
- SharePoint / Deploy / LIVE WRITE
- new component / state / workflow abstraction
- CSS unless unavoidable

---

## Likely implementation surface

```text
MODIFY
- spfx/src/shell/users/SupportPlan.tsx
  gate: !adminRead && !revisionDraft && !activationReceipt

LIKELY TEST SYNC
- spfx/smoke/sbs-mgmt-loop-b/run-smoke.mjs
  afterApply: assert create-cta absent
  cold / no-change / historical: retain createCtaDisabled
  beforeApply draft: retain createCtaAbsentWhileDraft

OPTIONAL
- support-plan-copy.ts / support-plan.test.ts
  only if copy/tests must track visibility contract
```

Minimal expression (illustrative, not authorization):

```text
{!adminRead && !revisionDraft && !activationReceipt ? ( /* create-cta */ ) : null}
```

---

## Acceptance (future implementation — do not implement now)

### STATE A — cold / no revisionDraft / no receipt

Existing: disabled create-cta remains (unchanged).

### STATE B — revisionDraft / beforeApply

Existing CTA-ROLE: create-cta absent; Apply CTA present (unchanged).

### STATE C — afterApply

MUST show SIMPLIFICATION-2 primary + D5/D6 + boundary.

MUST NOT show:

```text
次の版を作る（表示専用）
```

Staff should not be led to ask whether that control advances to 版5.

---

## Gate

```text
Human Start GO — POST-APPLY-CREATE-CTA-CLARIFICATION-1
= NOT RECEIVED

Implementation
= NOT AUTHORIZED

#594 / 0ba2c63…
= FROZEN (no commits on that tip from this unit)
```
