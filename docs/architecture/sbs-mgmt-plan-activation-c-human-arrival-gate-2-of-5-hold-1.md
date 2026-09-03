# Human arrival gate 2/5 HOLD — verification marker mismatch

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-HUMAN-ARRIVAL-GATE
kind: READ-ONLY isolation
date: 2026-09-03
mode: no product mutation
Proposal A product candidate = fed08fd49d12fccf323991fb95a4f5e58d6f9e55
PR #589 tip / CI authority = f85ee757a9795b62ad5da475dc0aebc78e3ad6d3 = UNCHANGED
#584 @ 5437e64 = FROZEN / historical basis only
Human arrival gate = HOLD (2/5)
Actual Staff Re-Test = NOT SCORED / NOT STARTED
Human Ready GO = NOT ELIGIBLE
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

---

## Observed Human packet

```text
1 緑の確認バナー = NO
2 【適用待機】 = NO
3 ⑤「変更が必要」 = NO
4 ⑥「適用中: 版3 / 下書き: 版4」 = YES
5 「版4を適用開始する」 = YES
RESULT = 2/5
```

5/5 必須は変更しない。4/5 では通過しない。

以前の cold / NO_CHANGE 面（Apply 欠落）とは別物。

```text
Draft v4 = PRESENT
Apply CTA = PRESENT
Proposal A copy on ⑥ = reached
```

---

## Classification

```text
PRODUCT ARRIVAL STATE
= PARTIAL CONFIRMED
  revisionDraft mounted
  Apply CTA mounted
  ≠ Apply regression
  ≠ Proposal A copy regression

VERIFICATION ARRIVAL MARKERS
= NOT CONFIRMED
  green banner absent
  【適用待機】 absent
  ⑤「変更が必要」 not confirmed by Human

DEFECT CLASS
= verification-arrival marker/path mismatch candidate
≠ product Apply lifecycle defect
≠ locked D5/D6 defect
```

---

## Code facts (READ-ONLY)

### 1–2 are harness-only

Green banner and tab title exist only in `spfx/smoke/support-plan-review-new-version-demo-1/smoke-entry.tsx`.

They mount only when:

```text
staffPlanTransition === "beforeApply"
```

exact string. `BeforeApplyDomDriver` then:

- sticky `data-sbs-mgmt-plan-activation-c-staff-check`
- `document.title` = `【適用待機】版 4 を適用開始する` after driver `ready`

`SupportPlan.tsx` does not read `staffPlanTransition` and does not paint that banner or tab title.

If the Human URL omitted `staffPlanTransition=beforeApply`, or the page was not this `smoke-entry` bundle, markers 1–2 are **absent by construction**.

Failed driver still renders a **red** banner (`staff-check=failed`). Human reported banner **absent**, so the driver component likely **did not mount**, rather than timed out.

### 4–5 are product session state

`適用中: 版 3` / `下書き: 版 4` / `[版 4 を適用開始する]` mount in `SupportPlan.tsx` when `revisionDraft` exists. That is the Proposal A 区間 B. It does not require the harness banner.

`revisionDraft` is created by the public LOOP-B CTA `data-sbs-mgmt-loop-b-action="start-revision"`, which requires `CHANGE_REQUIRED` + reason. Therefore **product Apply-直前 state can be reached without the harness query**.

B12 `run-smoke.mjs` also uses the **cold** URL (no `staffPlanTransition`) and still reaches Apply.

### 3 can fail visually even when capture is CHANGE_REQUIRED

⑤ 見直し contains two different texts:

| Surface | Source | After successful start-revision |
|---|---|---|
| 見直し状況 / `reviewStatus.reviewStatusLabel` | fixture `要確認（合成表示）` | **unchanged** |
| process kicker `reviewSummaryLabel` | `capturedReview` | `変更が必要` |
| `見直し結果:` line | `capturedReviewSummary` | `変更が必要` |

If Human scored ⑤ from the static **要確認（合成表示）** card, item 3 is NO while ⑥ Apply is YES. That is a scoring-surface mismatch, not an Apply regression.

---

## Isolation questions (next Human / harness check, not product)

```text
1. 開いた完全 URL に staffPlanTransition=beforeApply があるか
2. serve-smoke が Proposal A を含む HEAD の smoke-entry を rebuild したか
3. ページ最上部に data-sbs-mgmt-plan-activation-c-staff-check があるか（failed 含む）
4. ⑤ の採点対象が「要確認（合成表示）」ではなく「見直し結果: 変更が必要」か
5. heft / workbench / cold URL / 不完全 query を使っていないか
```

Required URL remains:

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply
```

---

## Explicit OUT this packet

```text
SupportPlan.tsx mutation = FORBIDDEN
Proposal A candidate mutation = FORBIDDEN
Apply CTA / lifecycle mutation = FORBIDDEN
Human arrival gate 5/5 definition change = FORBIDDEN
Human Ready GO = NOT ELIGIBLE
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

## NEXT

```text
Human arrival gate = HOLD (2/5)
↓
confirm URL + smoke-entry mount of BeforeApplyDomDriver
↓
re-score ⑤ on 見直し結果 / process kicker, not 要確認 fixture
↓
5/5 YES → Actual Staff Re-Test START
1–3 still NO → harness path correction (smoke-entry / serve-smoke / URL) only
```
