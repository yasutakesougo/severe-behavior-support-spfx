# NEXT-VERSION-COPY-SIMPLIFICATION-2 — Focused Verification 1

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
kind: focused verification
date: 2026-09-04
SupportPlan mutation HEAD = 1cde2182ff1adbbd8414a0c6fca398169d29c7b8
#589 @ f85ee757 = NOT this unit's CI authority
Human Ready GO = HOLD
```

## Human rendered check (authority)

Human 確認: 狙った簡素化になっている。

⑥ に残る:

```text
⑥ 次版準備
版 4・適用中
現在適用中: 版 4
過去版: 版 3
次に変更するときは、新しい版を作ります。
現在の版はそのまま残ります。
観察の不足だけでは、この計画を無効にしません。
見直し期限の超過だけでは、この計画を無効にしません。
次の版を作る（表示専用）
本番には保存されていません
```

⑥ から消えた:

```text
次の版の考え方
次に重ねる概念上の版は 4
planning-pc-synthetic-staff / timestamp
```

適用証跡は `履歴・詳細 > 適用情報`。Scope と整合。

境界文は Human 短縮「本番未保存」ではなく既存文。`...-boundary-copy-lock-1.md` で RETAIN 固定。

「過去の版」見出しに現行版が出る件は OUT。広げない。

## Local evidence (at SupportPlan mutation HEAD)

```text
root typecheck PASS
root npm test 954/954 PASS
npx heft test --clean 427/427 PASS (support-plan.test 16 PASS)
B12 6/6 PASS
  conceptualMismatchGone
  nextVersionHeadingGone
  afterApplyShortNotes
  receiptInDetails
  receiptNotInAppliedPrimary
Functional regression = NOT OBSERVED
```

## Verdict

```text
Implementation = COMPLETE LOCALLY
Focused Verification = PASS
Rendered Visual Check = PASS
Functional regression = NOT OBSERVED
Scope = presentation copy only
Human Ready GO = HOLD
Exact-head CI = PENDING (new HEAD; #589 tip は使えない)
```
