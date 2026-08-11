# Issue #28 — Close Criteria Reassessment（read-only）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision: Decision-ISSUE-28-CLOSE-CRITERIA-REASSESSMENT-1 = SELECTED / LOCKED
Human GO: #28 CLOSE-CRITERIA-REASSESSMENT = GO
Date: 2026-08-11
Baseline tip: be2af7c22ceb3b28a6631196d69d3b5ba29214c7（PR #241 on main）
Kind: read-only reassessment
code mutation: 0
#28 Close: NOT AUTHORIZED
#21 membership lookup: OUT / membershipLookupAuthorized = false
#22 continuation: NOT AUTHORIZED
live I/O: false（unchanged）
```

Selection:
[`decision-issue-28-close-criteria-reassessment-selection.md`](./decision-issue-28-close-criteria-reassessment-selection.md)

Prior assessment（pre-SHELL-UX-3）:
Decision-ISSUE-28-CLOSE-CRITERIA-ASSESSMENT-1 = FAIL / KEEP OPEN（PR #239）

## 1. Scope / ownership（unchanged）

```text
#28 spfx-shell:
  結果を安全に表示する共通UI境界とレイアウト

#21 OUT:
  認証・ロール・SiteContext・アクセス判定の真理値
  membership lookup

#22 OUT:
  取得・保存結果の判定 / adapter semantics
```

## 2. Evidence on tip `be2af7c…`

| Unit | Evidence | Status |
|---|---|---|
| SPFx 1.23.2 scaffold / isolated `spfx/` | main + Deploy path | DELIVERED |
| SHELL-UX-1 presentation chrome | PR #235 → `30a1656…`；smoke P2 `957fc67…` | PASS / VERIFIED |
| SHELL-UX-2 save-state presentation | PR #238 → `61a212a…` | PASS / VERIFIED |
| SHELL-UX-3 multi-site selector + unselected stop | PR #241 → `be2af7c…` | PASS / VERIFIED |
| Independence flags | `liveTenantIo / REST / binder / membershipLookup = false` | HELD |

## 3. Completion checkboxes（Issue body）

| # | Criterion | Result | Notes |
|---|---|---|---|
| 1 | 公式SPFx構成から生成 | **MET** | unchanged |
| 2 | 現行アプリと依存分離 | **MET** | unchanged |
| 3 | current-site label 常時表示 | **MET** | display-only；UX-3 adds unselected label path |
| 4 | fail-closed 共通化 | **MET** | loading / access-denied / retrieval-failed |
| 5 | demoバナー常時表示 | **MET** | unchanged |
| 6 | PC・tablet / keyboard 基盤 | **MET**（slice scope） | UX-3 adds site-selector keyboard smoke |
| 7 | 業務固有ロジックを含めていない | **MET in code** / Issue checkbox still `[ ]` | still no ABC/Observation/SupportPlan/Finding；process lag remains |

## 4. 担当範囲 — delta since prior FAIL

| Item | Prior | Now |
|---|---|---|
| React アプリシェル / demo / 保存5状態 / loading / access-denied / retrieval-failed / current-site | MET | **MET** |
| 複数事業所所属時の明示選択 | NOT MET | **MET**（display-only SiteSelector；#21 truth OUT） |
| 事業所未選択時の業務停止 chrome | NOT EVIDENCED | **MET**（SiteUnselectedStop + nav disabled + ready hidden） |
| SITE-ISG / SITE-HOM 表示 | HOM NOT EVIDENCED | **MET**（options + smoke selected-isg / selected-hom） |
| 認証済み利用者の表示 | PARTIAL | **PARTIAL**（displayName only；未認証画面なし） |
| 一部取得失敗の共通境界 | NOT MET | **NOT MET** |
| エラーコード表示 | NOT MET | **NOT MET**（correlationId のみ） |
| キーボードで事業所選択 | NOT EVIDENCED | **MET**（site radio Tab smoke） |
| キーボード主要ナビ完走 | NOT EVIDENCED | **PARTIAL**（nav stubs；no destinations） |

## 5. 必須tests / manual — delta

| Item | Prior | Now |
|---|---|---|
| 権限不足画面に個人情報を出さない | PASS | **PASS** |
| 取得失敗時「判定していない」 | PASS | **PASS** |
| demo常時 / 保存5状態区別 | PASS | **PASS** |
| SITE-ISG / SITE-HOM 現在事業所表示 | HOM NOT EVIDENCED | **PASS**（UX-3 smoke） |
| 事業所未選択時の業務停止 | NOT EVIDENCED | **PASS**（UX-3 smoke） |
| キーボード事業所選択 | NOT EVIDENCED | **PASS**（site selector） |
| 未認証画面 | NOT EVIDENCED | **NOT EVIDENCED** |
| 一部取得失敗を正常件数へ混ぜない | NOT EVIDENCED | **NOT EVIDENCED** |
| キーボード主要ナビ完走 | NOT EVIDENCED | **PARTIAL / NOT EVIDENCED**（stubs only） |
| 横スクロール欠落なしの証明 | NOT EVIDENCED | **NOT EVIDENCED** |
| 200％相当表示 | NOT EVIDENCED | **NOT EVIDENCED** |

## 6. Residual candidates rejudgment

| ID | Candidate | Rejudgment |
|---|---|---|
| C-A | Unauthenticated fail-closed presentation panel | **STILL OPEN** |
| C-B | Display-only multi-site selector + site-unselected stop | **CONSUMED / DELIVERED**（SHELL-UX-3 / #241） |
| C-C | SITE-HOM（+ ISG）label fixture / smoke only | **CONSUMED**（covered by SHELL-UX-3） |
| C-D | Partial-retrieval presentation boundary | **STILL OPEN** |
| C-E | Error-code + correlationId user-facing display | **STILL OPEN**（correlationId only today） |
| C-F | Keyboard traversal evidence（site select + primary nav） | **PARTIAL** — site select MET；primary-nav destinations **STILL OPEN** |
| C-G | PC/tablet horizontal-scroll + 200% zoom smoke | **STILL OPEN** |
| C-H | Issue-body SoT refresh（tip / Still OPEN / checkbox 7） | **STILL OPEN** |

## 7. Verdict

```text
Close criteria = FAIL
#28 Close = NOT AUTHORIZED
Recommendation = KEEP OPEN
```

Reason（要約）:

```text
SHELL-UX-3 により C-B / C-C と関連必須tests（SITE-ISG/HOM・未選択停止・
キーボード事業所選択）は前進した。

しかし literal Issue #28 照合ではなお残る:
  未認証画面
  一部取得失敗境界
  エラーコード表示
  主要ナビ完走 / 横スクロール証明 / 200%
  Issue checkbox 7 / body SoT refresh
  UI-01〜04 を個別シェルとして完了した証跡はない（単一 chrome + stub nav）

したがって Close YES は出せない。
```

## 8. Residual next-slice candidates（NOT SELECTED）

この Reassessment は候補を提示するだけである。**いずれも NOT SELECTED。**

| ID | Candidate | Notes |
|---|---|---|
| C-A | Unauthenticated fail-closed presentation panel | display-only；auth detect stays #21 |
| C-D | Partial-retrieval presentation boundary | no count mixing；outcomes via props from #22 later |
| C-E | Error-code + correlationId user-facing display | presentation only |
| C-F′ | Primary-nav keyboard traversal evidence（beyond site select） | nav destinations / focus path |
| C-G | PC/tablet horizontal-scroll + 200% zoom smoke assertions | evidence deepening |
| C-H | Issue-body SoT refresh（tip `be2af7c` / Still OPEN / checkbox 7） | docs/process only |

```text
C-B = CONSUMED
C-C = CONSUMED
Agent auto-select: FORBIDDEN
Next Human Selection required before any Implementation Start
#21 membershipLookupAuthorized = false（unchanged）
#22 return: NOT AUTHORIZED
```

## 9. Stop condition

```text
Reassessment COMPLETE
Close: NO
code mutation: 0
live I/O unchanged: false
membershipLookupAuthorized: false
Await separate Human Selection for any residual candidate
Await separate Human #28 Close GO only if a future assessment = PASS
```
