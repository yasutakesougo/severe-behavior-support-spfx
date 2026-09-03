# SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1 — Human Verification Correction Start GO

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1
tracking issue: #583
product PR: #584
product HEAD: 5437e64703db055eef2bf230f5a682cf0286dc1a = FROZEN
Human Verification Correction Start GO = RECEIVED / CONSUMED
authorized: verification-only path correction within Scope + Correction-1
#584 product mutation = FORBIDDEN
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```

Consumed GO does not authorize `SupportPlan.tsx`, activation domain, session contract, Ready, Merge, Deploy, or LIVE WRITE.

NEXT after implementation:

```text
Focused Verification
↓
exact verification HEAD fixation
↓
default cold path regression
↓
Human arrival gate confirmation
↓
Actual Staff Plan-Transition Re-Test (Human)
```

Human arrival gate confirmation means:

```text
[ ] 緑の確認バナーがある
[ ] タブに【適用待機】がある
[ ] ⑤ が「変更が必要」
[ ] ⑥ に版4下書きの説明がある
[ ] 「版 4 を適用開始する」がある
```

```text
5項目すべて YES
→ Actual Staff Plan-Transition Re-Test START

1つでも NO
→ HOLD
→ T1–T5 NOT SCORED
```
