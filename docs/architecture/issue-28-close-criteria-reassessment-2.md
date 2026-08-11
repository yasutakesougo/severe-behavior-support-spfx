# Issue #28 — Close Criteria Reassessment-2（read-only）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision: Decision-ISSUE-28-CLOSE-CRITERIA-REASSESSMENT-2 = SELECTED / LOCKED
Human GO: #28 CLOSE-CRITERIA-REASSESSMENT-2 = GO
Date: 2026-08-11
Baseline tip: cc37cf0d7b71f9f5a8db57720e93f88a62050cad（PR #244 on main）
PR: #245（Reassessment-2 docs only）
Kind: read-only reassessment
code mutation: 0
#28 Close: NOT AUTHORIZED
#21 membership / authorization truth: OUT
#22 fetch / judgment / counts: OUT
live I/O: false（unchanged）
adapterFetchAuthorized: false
outcomeJudgmentAuthorized: false
membershipLookupAuthorized: false
```

Selection:
[`decision-issue-28-close-criteria-reassessment-2-selection.md`](./decision-issue-28-close-criteria-reassessment-2-selection.md)

Prior reassessment-1（pre-SHELL-UX-4）:
Decision-ISSUE-28-CLOSE-CRITERIA-REASSESSMENT-1 = FAIL / KEEP OPEN（PR #242）

## 1. Scope / ownership（unchanged）

```text
#28 spfx-shell:
  結果を安全に表示する共通UI境界とレイアウト

#21 OUT:
  認証・ロール・SiteContext・アクセス判定の真理値
  membership lookup

#22 OUT:
  取得・保存結果の判定 / adapter fetch / 件数集計
```

## 2. Evidence on tip `cc37cf0…`

| Unit | Evidence | Status |
|---|---|---|
| SPFx 1.23.2 scaffold / isolated `spfx/` | main + Deploy path | DELIVERED |
| SHELL-UX-1 presentation chrome | PR #235；smoke P2 `957fc67…` | PASS / VERIFIED |
| SHELL-UX-2 save-state presentation | PR #238 → `61a212a…` | PASS / VERIFIED |
| SHELL-UX-3 multi-site selector + unselected stop | PR #241 → `be2af7c…` | PASS / VERIFIED |
| SHELL-UX-4 partial-retrieval presentation | PR #244 → `cc37cf0…` | PASS / VERIFIED |
| Independence flags | liveTenant / REST / binder / membership / adapterFetch / outcomeJudgment = false | HELD |

## 3. Completion checkboxes（Issue body）

| # | Criterion | Result | Notes |
|---|---|---|---|
| 1 | 公式SPFx構成から生成 | **MET** | unchanged |
| 2 | 現行アプリと依存分離 | **MET** | unchanged |
| 3 | current-site label 常時表示 | **MET** | display-only |
| 4 | fail-closed 共通化 | **MET** | loading / access-denied / retrieval-failed + **partial_retrieval_failed** |
| 5 | demoバナー常時表示 | **MET** | unchanged |
| 6 | PC・tablet / keyboard 基盤 | **MET**（slice scope） | UX-1〜4 smokes |
| 7 | 業務固有ロジックを含めていない | **MET in code** / Issue checkbox still `[ ]` | process / body SoT lag remains |

## 4. 担当範囲 — delta since reassessment-1

| Item | After UX-3（reassess-1） | Now（UX-4 on tip） |
|---|---|---|
| 取得失敗・一部取得失敗の共通境界 | PARTIAL（full fail only） | **MET**（PartialRetrievalPanel；props-only） |
| 一部取得失敗を正常件数へ混ぜない | NOT EVIDENCED | **PASS**（UX-4 smoke；visual separation） |
| エラーコード・相関IDの利用者向け表示 | PARTIAL（correlationId only） | **PARTIAL**（correlationId only；**no error-code field**） |
| 未認証画面 | NOT EVIDENCED | **NOT EVIDENCED** |
| キーボード主要ナビ完走 | PARTIAL | **PARTIAL**（site select MET；nav stubs） |
| 横スクロール / 200% | NOT EVIDENCED | **NOT EVIDENCED** |

## 5. Residual candidates rejudgment

| ID | Candidate | Rejudgment |
|---|---|---|
| C-A | Unauthenticated fail-closed presentation panel | **STILL OPEN** |
| C-B | Display-only multi-site selector + unselected stop | **CONSUMED**（SHELL-UX-3） |
| C-C | SITE-HOM（+ ISG）fixture / smoke | **CONSUMED**（SHELL-UX-3） |
| C-D | Partial-retrieval presentation boundary | **CONSUMED / DELIVERED**（SHELL-UX-4 / #244） |
| C-E | Error-code + correlationId user-facing display | **STILL OPEN**（correlationId exists；error-code UX incomplete） |
| C-F′ | Primary-nav keyboard traversal evidence | **STILL OPEN** |
| C-G | PC/tablet horizontal-scroll + 200% zoom smoke | **STILL OPEN** |
| C-H | Issue-body SoT refresh（tip / Still OPEN / checkbox 7） | **STILL OPEN** |

## 6. Verdict

```text
Close criteria = FAIL
#28 Close = NOT AUTHORIZED
Recommendation = KEEP OPEN
```

Reason（要約）:

```text
SHELL-UX-4 により C-D（一部取得失敗の共通境界）は tip 上で CONSUMED。
担当範囲の「取得失敗・一部取得失敗」と
必須tests「一部取得失敗を正常件数へ混ぜない」は前進した。

しかし literal Issue #28 照合ではなお残る:
  未認証画面（C-A）
  エラーコードの利用者向け表示（C-E；相関IDのみでは不足）
  主要ナビ keyboard 完走（C-F′）
  横スクロール / 200% 証跡（C-G）
  Issue checkbox 7 / body SoT refresh（C-H）
  UI-01〜04 を個別シェルとして完了した証跡はない

したがって Close YES は出せない。
```

## 7. Residual next-slice candidates（NOT SELECTED）

この Reassessment は候補を提示するだけである。**いずれも NOT SELECTED。**

Human note（非 Selection）: FAIL の場合の第一候補として **C-E** が推奨されているが、
本 Decision では **選択しない**。

| ID | Candidate | Notes |
|---|---|---|
| C-A | Unauthenticated fail-closed presentation panel | display-only；auth detect stays #21 |
| **C-E** | Error-code + correlationId user-facing display | presentation-only；推奨残第一候補（未選択） |
| C-F′ | Primary-nav keyboard traversal evidence | beyond site select |
| C-G | PC/tablet horizontal-scroll + 200% zoom smoke | evidence deepening |
| C-H | Issue-body SoT refresh（tip `cc37cf0` / Still OPEN / checkbox 7） | docs/process only |

```text
C-B / C-C / C-D = CONSUMED
Agent auto-select: FORBIDDEN
Next Human Selection required before any Implementation Start
#22 fetch / judgment / counts: NOT AUTHORIZED
#21 semantics: NOT AUTHORIZED
```

## 8. Stop condition

```text
Reassessment-2 COMPLETE
Close: NO
code mutation: 0
live I/O unchanged: false
Await separate Human Selection for any residual candidate（e.g. C-E）
Await separate Human #28 Close GO only if a future assessment = PASS
```
