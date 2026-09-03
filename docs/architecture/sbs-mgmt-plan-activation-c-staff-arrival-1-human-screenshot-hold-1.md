# STAFF-ARRIVAL-1 — Human screenshot HOLD (NO_CHANGE surface)

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1
kind: Human rendered evidence vs harness PASS
date: 2026-09-03
product HEAD: 5437e64703db055eef2bf230f5a682cf0286dc1a
harness code HEAD: 10269a2ef5110e3b11bb74bd0e498cb371578c90
Actual Staff Check: HOLD
Human Ready GO: NOT ELIGIBLE
```

## Observed (this screenshot)

```text
⑥ 現行は版3（適用中）。次に重ねる概念上の版は4です。
⑥ [次の版を作る（表示専用）]
⑤ 見直し結果: 変更なし
⑤ [見直し材料を確認する] still primary-looking
Draft v4 copy: ABSENT
[版 4 を適用開始する]: NOT MOUNTED
URL bar crop: 127.0.0.1:4194/index.html?viewMode=rea… (query tail not visible)
```

`見直し結果: 変更なし` is `capturedReview.outcome.decision === "NO_CHANGE"`, not the fixture 要確認 label. A NO_CHANGE capture makes `revisionEligible` false, so start-revision and Apply never mount.

## Expected harness arrival (Focused Verification PASS)

```text
sticky banner at page top, data-sbs-mgmt-plan-activation-c-staff-check="ready"
browser tab: 【適用待機】版 4 を適用開始する
⑤ 見直し結果: 変更が必要
⑥ 版 4 は下書きです。まだ適用開始されていません。
⑥ [版 4 を適用開始する]
```

This screenshot matches **empty / NO_CHANGE session**, not that arrival.

## Classification

```text
PRIMARY
= observed browser is not the successful beforeApply harness state

NOT
= Apply CTA missing on a CHANGE_REQUIRED + Draft v4 surface
= #584 product regression
= harness Focused Verification withdrawn
```

Likely causes (any one is enough):

```text
1. serve-smoke / bundle is not verification HEAD 10269a2
2. URL missing staffPlanTransition=beforeApply and/or destination=users
3. Human or another action captured 変更なし after open
4. driver failed (banner would be failed / driving — not shown in this crop)
```

Agent Puppeteer @ 10269a2 still PASS. That does not overwrite this Human screen.

## Gate

```text
Focused Verification (agent) = PASS (unchanged)
This Human surface = NOT arrival
Actual Staff Plan-Transition Re-Test = HOLD / do not score T3–T5 here
Human Ready GO = NOT ELIGIBLE
#584 product HEAD = FROZEN
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

## Separation rule

```text
Do not mix:
- Agent verification arrival = PASS
- Human screenshot = HOLD / NOT arrival

Agent PASS proves the verification harness can reach arrival.
Human HOLD proves the observed Human browser did not reach arrival.
These are different evidences and must stay separated.
```

Re-test only after the ready banner + 変更が必要 + Apply are all visible on:

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply
```

from `node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs` on the verification harness branch.
