# Issue #28 — Close Criteria Reassessment-3（read-only）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision: Decision-ISSUE-28-CLOSE-CRITERIA-REASSESSMENT-3 = SELECTED / LOCKED
Human GO: #28 CLOSE-CRITERIA-REASSESSMENT-3 = GO
Date: 2026-08-11
Baseline tip: d2aefa129a175072858d6c12eaf7c2954932357e（PR #247 on main）
PR: #248（Reassessment docs only）
Kind: read-only reassessment
code mutation: 0
#28 Close: NOT AUTHORIZED
#21 membership lookup: OUT / membershipLookupAuthorized = false
#22 continuation: NOT AUTHORIZED
live I/O: false（unchanged）
```

Selection:
[`decision-issue-28-close-criteria-reassessment-3-selection.md`](./decision-issue-28-close-criteria-reassessment-3-selection.md)

Acceptance:
[`decision-issue-28-close-criteria-reassessment-3-acceptance.md`](./decision-issue-28-close-criteria-reassessment-3-acceptance.md)

## 1. Scope / ownership（unchanged）

```text
#28 spfx-shell:
  結果を安全に表示する共通UI境界とレイアウト

#21 OUT:
  認証・ロール・SiteContext・アクセス判定の真理値
  membership lookup

#22 OUT:
  取得・保存結果の判定 / adapter semantics
  error-code generation / failure classification
```

## 2. Evidence on tip `d2aefa1…`

| Unit | Evidence | Status |
|---|---|---|
| SPFx 1.23.2 scaffold / isolated `spfx/` | main + Deploy path | DELIVERED |
| SHELL-UX-1 presentation chrome | PR #235；smoke P2 closeout | PASS / VERIFIED |
| SHELL-UX-2 save-state presentation | PR #238；`shell-ux-2-browser-smoke.md` | PASS / VERIFIED |
| SHELL-UX-3 multi-site selector + unselected stop | PR #241；`shell-ux-3-browser-smoke.md` | PASS / VERIFIED |
| SHELL-UX-4 partial-retrieval boundary | PR #244；`shell-ux-4-browser-smoke.md` | PASS / VERIFIED |
| SHELL-UX-5 error-code + correlationId inquiry | PR #247；`shell-ux-5-browser-smoke.md` | PASS / VERIFIED |
| Independence flags | `liveTenantIo / REST / binder / membershipLookup / fetch / judgment / generation / classification / telemetry = false` | HELD |

## 3. Completion checkboxes（Issue body）

| # | Criterion | Result | Notes |
|---|---|---|---|
| 1 | 公式SPFx構成から生成 | **MET** | unchanged |
| 2 | 現行アプリと依存分離 | **MET** | unchanged |
| 3 | current-site label 常時表示 | **MET** | display-only；UX-3 unselected path |
| 4 | fail-closed 共通化 | **MET** | loading / access-denied / retrieval-failed；UX-4 adds partial |
| 5 | demoバナー常時表示 | **MET** | unchanged |
| 6 | PC・tablet / keyboard 基盤 | **MET**（slice scope） | UX-3/4/5 deepen keyboard / tablet smoke |
| 7 | 業務固有ロジックを含めていない | **MET in code** / Issue checkbox still `[ ]` | still no ABC/Observation/SupportPlan/Finding；Issue-body SoT lag remains |

## 4. 担当範囲 — delta since SHELL-UX-3-era residual inventory

| Item | Prior（post-UX-3） | Now（tip `d2aefa1`） |
|---|---|---|
| React アプリシェル / demo / 保存5状態 / loading / access-denied / retrieval-failed / current-site | MET | **MET** |
| 複数事業所明示選択 / 未選択 stop / SITE-ISG・HOM | MET（UX-3） | **MET** |
| 一部取得失敗の共通境界 | NOT MET | **MET**（SHELL-UX-4；props-only；件数混ぜない warning） |
| エラーコード・相関IDの利用者向け表示 | NOT MET（correlationId only） | **MET**（SHELL-UX-5 inquiry display + copy） |
| 認証済み利用者の表示 | PARTIAL | **PARTIAL**（displayName only；未認証画面なし） |
| キーボードで事業所選択 | MET | **MET** |
| キーボード主要ナビ完走 | PARTIAL | **PARTIAL**（nav stubs；no destinations） |
| UI-01〜04 個別シェル完了証跡 | NOT MET | **NOT MET**（単一 chrome + stub nav） |

## 5. 必須tests / manual — delta

| Item | Prior（post-UX-3） | Now |
|---|---|---|
| 権限不足画面に個人情報を出さない | PASS | **PASS** |
| 取得失敗時「判定していない」 | PASS | **PASS** |
| demo常時 / 保存5状態区別 | PASS | **PASS** |
| SITE-ISG / SITE-HOM 現在事業所表示 | PASS | **PASS** |
| 事業所未選択時の業務停止 | PASS | **PASS** |
| キーボード事業所選択 | PASS | **PASS** |
| 一部取得失敗を正常件数へ混ぜない | NOT EVIDENCED | **PASS**（SHELL-UX-4 smoke） |
| エラーコード + 相関ID表示 / 問い合わせコピー | NOT EVIDENCED | **PASS**（SHELL-UX-5 smoke） |
| 未認証画面 | NOT EVIDENCED | **NOT EVIDENCED** |
| キーボード主要ナビ完走 | PARTIAL / NOT EVIDENCED | **PARTIAL / NOT EVIDENCED**（stubs only） |
| 横スクロール欠落なしの証明 | NOT EVIDENCED | **NOT EVIDENCED** |
| 200％相当表示 | NOT EVIDENCED | **NOT EVIDENCED** |

## 6. Residual candidates rejudgment

| ID | Candidate | Rejudgment |
|---|---|---|
| C-A | Unauthenticated fail-closed presentation panel | **STILL OPEN** |
| C-B | Display-only multi-site selector + site-unselected stop | **CONSUMED / DELIVERED**（SHELL-UX-3 / #241） |
| C-C | SITE-HOM（+ ISG）label fixture / smoke only | **CONSUMED**（SHELL-UX-3） |
| C-D | Partial-retrieval presentation boundary | **CONSUMED / DELIVERED**（SHELL-UX-4 / #244） |
| C-E | Error-code + correlationId user-facing display | **CONSUMED / DELIVERED**（SHELL-UX-5 / #247） |
| C-F′ | Primary-nav keyboard traversal evidence（beyond site select） | **STILL OPEN** |
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
SHELL-UX-4 / 5 により C-D / C-E と関連必須tests
（一部取得失敗の分離表示・エラーコード/相関ID/問い合わせコピー）は前進した。
C-B / C-C / C-D / C-E = CONSUMED。

しかし literal Issue #28 照合ではなお残る:
  未認証画面（C-A）
  主要ナビ完走（C-F′）
  横スクロール証明 / 200%（C-G）
  Issue checkbox 7 / body SoT refresh（C-H）
  UI-01〜04 を個別シェルとして完了した証跡はない（単一 chrome + stub nav）

したがって Close YES は出せない。
```

## 8. Residual next-slice candidates（NOT SELECTED）

この Reassessment は候補を提示するだけである。**いずれも NOT SELECTED。**

| ID | Candidate | Notes |
|---|---|---|
| C-A | Unauthenticated fail-closed presentation panel | display-only；auth detect stays #21 |
| C-F′ | Primary-nav keyboard traversal evidence（beyond site select） | nav destinations / focus path |
| C-G | PC/tablet horizontal-scroll + 200% zoom smoke assertions | evidence deepening |
| C-H | Issue-body SoT refresh（tip `d2aefa1` / Still OPEN / checkbox 7） | docs/process only |

```text
C-B = CONSUMED
C-C = CONSUMED
C-D = CONSUMED
C-E = CONSUMED
Agent auto-select: FORBIDDEN
Next Human Selection required before any Implementation Start
#21 membershipLookupAuthorized = false（unchanged）
#22 return: NOT AUTHORIZED
```

## 9. Stop condition

```text
Reassessment-3 COMPLETE
Close: NO
code mutation: 0
live I/O unchanged: false
membershipLookupAuthorized: false
Await separate Human Selection for any residual candidate（C-A / C-F′ / C-G / C-H）
Await separate Human #28 Close GO only if a future assessment = PASS
```
