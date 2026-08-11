# Issue #28 — Close Criteria Assessment（read-only）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision: Decision-ISSUE-28-CLOSE-CRITERIA-ASSESSMENT-1 = SELECTED / LOCKED
Human GO: #28 CLOSE-CRITERIA-ASSESSMENT = GO
Date: 2026-08-11
Baseline tip: 61a212a409b4134c802435226998753d1903ee1f（PR #238 on main）
Kind: read-only reconciliation
code mutation: 0
#28 Close: NOT AUTHORIZED（this assessment does not Close）
#22 continuation: NOT AUTHORIZED
live I/O: false（unchanged）
```

Selection:
[`decision-issue-28-close-criteria-assessment-selection.md`](./decision-issue-28-close-criteria-assessment-selection.md)

## 1. Scope / ownership

```text
#28 spfx-shell:
  結果を安全に表示する共通UI境界とレイアウト

#21 OUT:
  認証・ロール・SiteContext・アクセス判定の真理値

#22 OUT:
  取得・保存結果の判定 / adapter semantics
```

## 2. Evidence on tip `61a212a…`

| Unit | Evidence | Status |
|---|---|---|
| SPFx 1.23.2 scaffold / isolated `spfx/` | main + Deploy path | DELIVERED |
| SHELL-UX-1 presentation chrome | PR #235 → `30a1656…`；smoke P2 PR #236 → `957fc67…` | PASS / VERIFIED |
| SHELL-UX-2 save-state presentation | PR #238 → `61a212a…`；`shell-ux-2-browser-smoke.md` | PASS / VERIFIED |
| Independence flags | `SHELL_UX_SLICE.*Authorized = false` | HELD |

## 3. Completion checkboxes（Issue body）

| # | Criterion | Result | Notes |
|---|---|---|---|
| 1 | 公式SPFx構成から生成 | **MET** | `spfx/` Heft 1.23.2 |
| 2 | 現行アプリと依存分離 | **MET** | isolated `spfx/` package |
| 3 | current-site label 常時表示 | **MET** | display-only；#21 truth OUT |
| 4 | fail-closed 共通化 | **MET** | loading / access-denied / retrieval-failed |
| 5 | demoバナー常時表示 | **MET** | fixture `demoMode=true` |
| 6 | PC・tablet / keyboard 基盤 | **MET**（slice scope） | skip-link + tablet smoke；broader Issue tests remain |
| 7 | 業務固有ロジックを含めていない | **MET in code** / Issue checkbox still `[ ]` | no ABC/Observation/SupportPlan/Finding in shell UX；process/checkbox lag remains |

## 4. 担当範囲 residual

| Item | Result |
|---|---|
| React アプリシェル / demo / 保存5状態 / loading / access-denied / retrieval-failed / current-site label | **MET** |
| 認証済み利用者の表示 | **PARTIAL**（displayName only；未認証画面なし） |
| 複数事業所所属時の明示選択 | **NOT MET** |
| 一部取得失敗の共通境界 | **NOT MET**（full retrieval-failed only） |
| エラーコード表示 | **NOT MET**（correlationId のみ） |
| キーボードで事業所選択・主要ナビ完走 | **NOT MET / NOT EVIDENCED** |

## 5. 必須tests / manual residual

| Item | Result |
|---|---|
| 権限不足画面に個人情報を出さない | **PASS**（presentation copy + ready-region absent） |
| 取得失敗時「判定していない」 | **PASS** |
| demo常時 / 保存5状態区別 | **PASS** |
| 未認証画面 | **NOT EVIDENCED** |
| SITE-HOM 表示 | **NOT EVIDENCED**（SITE-ISG fixture only） |
| 事業所未選択時の業務停止 | **NOT EVIDENCED**（#21 truth OUT；chrome stop gate absent） |
| 一部取得失敗を正常件数へ混ぜない | **NOT EVIDENCED** |
| キーボード事業所選択・主要ナビ | **NOT EVIDENCED** |
| 横スクロール欠落なしの証明 | **NOT EVIDENCED**（tablet presence only） |
| 200％相当表示 | **NOT EVIDENCED** |

## 6. Verdict

```text
Close criteria = FAIL
#28 Close = NOT AUTHORIZED
Recommendation = KEEP OPEN
```

Reason（要約）:

```text
SHELL-UX-1 / SHELL-UX-2 は tip 上で presentation chrome を前進させている。
しかし Issue #28 本文の完了条件・担当範囲・必須tests を literal に照合すると、
未認証 / 複数事業所選択 / 一部取得失敗 / エラーコード /
キーボード事業所選択・ナビ / SITE-HOM / 200% / 横スクロール証明
などが未達または未証跡のまま残る。
したがって Close YES は出せない。
```

## 7. Residual next-slice candidates（NOT SELECTED）

この Assessment は候補を提示するだけである。**いずれも NOT SELECTED。**

| ID | Candidate | Notes |
|---|---|---|
| C-A | Unauthenticated fail-closed presentation panel | display-only；auth detect stays #21 |
| C-B | Display-only multi-site selector + site-unselected stop chrome | membership truth stays #21 |
| C-C | SITE-HOM（+ ISG）label fixture / smoke coverage | presentation only |
| C-D | Partial-retrieval presentation boundary | no count mixing；outcomes via props from #22 later |
| C-E | Error-code + correlationId user-facing display | presentation only |
| C-F | Keyboard traversal evidence（site select + primary nav） | beyond skip-link |
| C-G | PC/tablet horizontal-scroll + 200% zoom smoke assertions | evidence deepening |
| C-H | Issue-body SoT refresh（tip `61a212a` / Still OPEN / checkbox 7） | docs/process only |

```text
Agent auto-select: FORBIDDEN
Next Human Selection required before any Implementation Start
#22 return: NOT AUTHORIZED by this assessment
```

## 8. Stop condition

```text
Assessment COMPLETE
Close: NO
code mutation: 0
live I/O unchanged: false
Await separate Human Selection for any residual candidate
Await separate Human #28 Close GO only if a future assessment = PASS
```
