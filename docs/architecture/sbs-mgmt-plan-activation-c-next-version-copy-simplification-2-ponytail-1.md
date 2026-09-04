# NEXT-VERSION-COPY-SIMPLIFICATION-2 — Ponytail / Minimality Scope Check

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
kind: ponytail / minimality scope check
date: 2026-09-04
verdict: PONYTAIL PASS
authority: Human after-apply copy (display inconsistency + density)
Human UI Copy Correction Start GO — SIMPLIFICATION-2 = NOT RECEIVED
Implementation = NOT AUTHORIZED
```

## Checklist

| # | Check | Result |
|---|---|---|
| 1 | IN は Apply 後⑥ presentation のみ | PASS |
| 2 | Apply / version transition / session / CAS / schema / SharePoint / Deploy / LIVE WRITE OUT | PASS |
| 3 | D5/D6 2文は残す。統合は別 scope | PASS |
| 4 | create-cta と 本番未保存を保持 | PASS |
| 5 | next-version-number を Apply 後に出さない。版5 計算はしない | PASS |
| 6 | 版4/版4 は長さ問題ではなく表示不整合。削除が最小 | PASS |
| 7 | 現在版 / 過去版を主情報として残す | PASS |
| 8 | receipt は DOM 保持・主画面から降格候補 | PASS |
| 9 | 長文2ノートを短文2行に畳むだけで、新情報を足さない | PASS |
| 10 | 新 UI 面を増やさない。⑥ 次版準備は既存工程スロット | PASS |
| 11 | SIMPLIFICATION-1 の Apply 前 区間 B を戻さない | PASS |

## Expansion risks forbidden

| Temptation | Why forbidden |
|---|---|
| conceptualNextVersion を live+1 にして版5を出す | 行削除で足りる。Human 明示 OUT |
| D5/D6 を1行統合 | 別明示 GO |
| 適用証跡を消して B12 を落とす | selector 保持。降格であり削除ではない |
| Apply 前 copy を再編集 | SIMPLIFICATION-1 済み |
| 「分かりやすく」情報追加 / 新カード | OUT |
| Apply ロジックや version transition を直す | 機能理解は PASS。対象外 |

## Human copy vs previous draft

前回 Scope は短文を 1 行だけ残す案だった。
Human 正本は 2 行（作ります / そのまま残ります）と、主情報の順序（現在版・過去版を先）を固定した。
これは削減範囲の確定であり、scope 拡張ではない。

## Explicit non-authorization

```text
PONYTAIL PASS
≠ Implementation Start
≠ Human UI Copy Correction Start GO
≠ Human Ready GO
≠ Merge / Deploy / LIVE WRITE
```
