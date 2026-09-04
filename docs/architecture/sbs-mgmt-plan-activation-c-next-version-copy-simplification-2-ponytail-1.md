# NEXT-VERSION-COPY-SIMPLIFICATION-2 — Ponytail / Minimality Scope Check

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
kind: ponytail / minimality scope check
date: 2026-09-04
verdict: PONYTAIL PASS
Human UI Copy Correction Start GO = NOT RECEIVED
Implementation = NOT AUTHORIZED
```

## Checklist

| # | Check | Result |
|---|---|---|
| 1 | IN は Apply 後⑥ presentation のみ | PASS |
| 2 | Apply / session / CAS / schema OUT | PASS |
| 3 | D5/D6 2文は残す。統合は別 scope | PASS |
| 4 | create-cta 保持 | PASS |
| 5 | next-version-number を Apply 後に出さない（計算式は触らない） | PASS |
| 6 | receipt は DOM 保持・主画面から退避 | PASS |
| 7 | 新 UI 面を増やさない | PASS |
| 8 | SIMPLIFICATION-1 の Apply 前 区間 B を戻さない | PASS |

## Expansion risks forbidden

| Temptation | Why forbidden |
|---|---|
| conceptualNextVersion を live+1 に再計算 | 今回は行削除で足りる |
| D5/D6 を1行統合 | 別明示 GO |
| 適用証跡を消して B12 を落とす | selector 保持 |
| Apply 前 copy を再編集 | SIMPLIFICATION-1 済み |
| 「分かりやすく」情報追加 | OUT |

## Explicit non-authorization

```text
PONYTAIL PASS
≠ Implementation Start
≠ Human Ready GO
≠ Merge / Deploy / LIVE WRITE
```
