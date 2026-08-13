# DEMO-UX-11 — DEMO注記集約 Selection（RPF-004）

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-11 — DEMO note consolidation
Decision: Decision-DEMO-UX-11-DEMO-NOTE-CONSOLIDATION-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-13）
Baseline main: 012dc405bf9469d2c5bc1652ffc472782012db97
Predecessor: DEMO-UX-10 MERGED（PR #324 / merge 012dc40；tip 1222165）
Source feedback: RPF-004
Follow-on queue（not this slice）: RPF-005 / DUX7-P2-1 / RPF-007
Implementation Start: GO（2026-08-13）— see demo-ux-11-implementation-start.md
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
SharePoint write: NOT AUTHORIZED
```

## Authority

Human は DEMO-UX-10（RPF-006）Merge SUCCESS を確認し、残り P2 の次として **RPF-004 Selection** を GO した。

本 Selection は **RPF-004 のみ** を SELECTED / LOCKED とする。

```text
DEMO-UX-11 Implementation Start = GO（this follow-on docs + code on PR #325）
RPF-005 / DUX7-P2-1 / RPF-007 Implementation = NOT AUTHORIZED
Deploy / SharePoint write / #299 Close = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
```

大規模ビジュアルデザイン改善は本 slice では行わない。注記の**重複除去・配置整理・必要最小限化**が目的であり、色・レイアウト・バッジ階層の刷新は OUT。

## Goal

```text
global DEMO 表示は常時残す
  → 同じ意味の画面/セクション注記の重複を減らす
  → 操作誤認防止（実保存不可・live未接続）と異常状態説明は弱めない
  → 業務情報（今日やること / 利用者 / 記録 / 見直し）の優先順位を上げる
```

安全境界（DEMO / synthetic / no-live / no-save / fail-closed）を弱めない。文言変更だけで意味論を変えない。

## Selection-phase investigation（LOCKED findings）

### Note classification（taxonomy）

| Class | Meaning |
|---|---|
| **global** | シェル全体で常時見える DEMO / 表示専用 chrome |
| **screen-level** | 各画面先頭の「この画面は合成…」系 |
| **section-level** | セクション直下の合成・接続・定義説明 |
| **mutation-boundary** | 作成/保存/完了など書込操作の無効境界 |
| **fail-closed** | アクセス不可・取得失敗・未選択停止・保存結果不明など異常/停止 |

### 1. Current note inventory（ready / synthetic surfaces）

#### Global

| ID | Surface / source | Text（要約） | Class |
|---|---|---|---|
| G-BANNER | `DemoBanner.tsx` | `DEMO — 合成表示専用（実データ・live SharePoint 接続なし）` | global |
| G-SITE-LEGEND | `SiteSelector` / `CurrentSiteLabel` | `事業所（表示専用）` / `現在の事業所（表示専用）` | global |
| G-SITE-OPTIONS | `site-selection.ts` | 事業所名に `（表示専用）` | global |
| G-SAVE-DESC | `save-state.ts` descriptions | 保存済み/失敗/結果不明などの説明 | fail-closed / system |
| G-UNSEL | `SiteUnselectedStop.tsx` | 事業所未選択で業務操作領域停止 | fail-closed |

#### Screen-level（ほぼ同一意味：「合成・業務データ未接続」）

| ID | Surface / source | Text（要約） | Class |
|---|---|---|---|
| S-OV-PRES | Overview `DASHBOARD_OVERVIEW_PRESENTATION_NOTE` | 合成データ表示確認・業務データ未接続 | screen-level |
| S-US-PRES | Users `DEMO_USERS_PRESENTATION_NOTE` | 同上 | screen-level |
| S-REC-PRES | Records `DEMO_DAILY_RECORD_PRESENTATION_NOTE` | 完全合成・業務データ未接続 | screen-level |
| S-REV-PRES | Review `DEMO_REVIEW_DUE_PRESENTATION_NOTE` | 完全合成・業務データ未接続 | screen-level |
| S-SP-PRES | Support plan `DEMO_SUPPORT_PLAN_PRESENTATION_NOTE` | 合成支援計画・業務データ未接続 | screen-level |
| S-UD-PRES | User detail inline note | 合成・業務データ/保存/認証未接続 | screen-level |
| S-DEST | Destination placeholder body/note | シェル表示確認・業務未接続・業務画面ではない | screen-level |

#### Section-level

| ID | Surface / source | Text（要約） | Class |
|---|---|---|---|
| SEC-OV-KPI | Overview KPI note | 件数は合成・絞り込み遷移未接続 | section-level |
| SEC-OV-FAM-R | `DEMO_KPI_FAMILY_R_NOTE` | Family R 定義・見直しと非同等（DEMO-UX-10） | section-level |
| SEC-OV-REV | Overview 見直し入口 | 期限接近/要確認を合成で確認 | section-level |
| SEC-OV-ACT | Overview today-action note | 画面間移動のみ・保存/接続なし | section-level / mutation-boundary-adjacent |
| SEC-US-FAM-R | `DEMO_KPI_FAMILY_R_USERS_NOTE` | Family R・Overview 同定義・見直し非同等 | section-level |
| SEC-US-FILTER | `DEMO_USERS_FILTER_NOTE` | 合成内絞り込み可・検索未接続 | section-level |
| SEC-US-HINT | `users-fixture.filterHint` | 状態で絞り込み（合成・概要KPIと同定義） | section-level |
| SEC-US-DETAIL | `DEMO_USERS_DETAIL_DISABLED_NOTE` | Aさんのみ詳細プレビュー・詳細未接続 | section-level |
| SEC-US-EMPTY | `DEMO_USERS_FILTER_EMPTY_NOTE` | 該当なし≠事業所に利用者なし | fail-closed-adjacent |
| SEC-REC-INCOMPLETE | incomplete hint | 選択で入力イメージ追随 | section-level（UX導線） |
| SEC-REC-DRAFT | draft hint | ローカル一時編集・離脱破棄・未保存 | mutation-boundary |
| SEC-REC-RECENT | recent hint | 閲覧サンプル・編集不可 | section-level |
| SEC-REV-CALC | calculation disabled note | 合成ラベル・期限計算/業務判定未接続 | section-level |
| SEC-REV-FAM-A | `DEMO_KPI_FAMILY_A_NOTE` | Family A 定義・Users と非同等（DEMO-UX-10） | section-level |
| SEC-REV-PROMPT | `summaryPrompt` | 責任者レビュー用合成一覧 | section-level（fixture prose） |

#### Mutation-boundary

| ID | Surface / source | Text（要約） | Class |
|---|---|---|---|
| M-REC | `DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE` | 作成・保存不可（実保存なし） | mutation-boundary |
| M-REV | `DEMO_REVIEW_DUE_MUTATION_DISABLED_NOTE` | 見直し完了/更新/評価不可 | mutation-boundary |
| M-SP | `DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE` | 作成・編集・保存未接続・表示専用 | mutation-boundary |
| M-REC-DRAFT-SEED | draft seed lines | 合成・未保存 / 保存は接続されていません | mutation-boundary（inline） |

#### Fail-closed / abnormal（thinning 禁止対象）

| ID | Surface | Class | Note |
|---|---|---|---|
| F-ACCESS | access_denied copy | fail-closed | 個人情報非表示等を弱めない |
| F-RETRIEVE | retrieval_failed / partial retrieval | fail-closed | 成功丸め禁止 |
| F-SAVE-UNKNOWN | `save_outcome_unknown` description | fail-closed | 成功/失敗へ丸めない文言を維持 |
| F-UNSEL | SiteUnselectedStop | fail-closed | 停止説明を維持 |
| F-DEST | destination disconnected | fail-closed-adjacent | 業務画面ではない明示を維持 |

#### Out of consolidation scope（fixture body / labels）

利用者行の `attentionNote`、見直し `reasonLabel`、支援計画本文の「合成サンプル」等の**業務ストーリー文言**、件数ラベルの「（合成データ）」「（合成表示）」単位接尾辞は、本 Selection の主対象外とする（chrome 注記の重複整理が主目的）。接尾辞の削除は「実データに見える」誤認リスクがあるため **削除しない**。

### 2. Duplicate clusters（same meaning repeated）

| Cluster | Meaning | Current carriers | Problem |
|---|---|---|---|
| C1 | DEMO / 合成 / live SharePoint なし | G-BANNER + S-*-PRES（全画面） | 第一視線がデモ説明に偏る |
| C2 | 業務データ未接続 | S-*-PRES + 多数の section notes | 同義反復 |
| C3 | 件数/状態は合成 | SEC-OV-KPI + SEC-OV-FAM-R + SEC-OV-REV + SEC-US-HINT | Overview 上部が注記帯になる |
| C4 | Users 絞り込みは合成内のみ | SEC-US-FILTER + SEC-US-HINT + SEC-US-FAM-R（一部） | Users 先頭が二重〜三重 |
| C5 | 記録は実保存なし | S-REC-PRES + SEC-REC-DRAFT + M-REC | 保存境界は必要だが screen と二重 |

### 3. Keep / consolidate / remove matrix（LOCKED）

| ID | Action | Rationale |
|---|---|---|
| G-BANNER | **KEEP** | global DEMO 常時判別の正本 |
| G-SITE-* | **KEEP** | 軽量 chrome；「表示専用」誤認防止 |
| G-SAVE-DESC | **KEEP** | 異常/状態説明。RPF-005（強調）は触らない |
| G-UNSEL / F-* | **KEEP** | fail-closed 弱体化禁止 |
| S-OV-PRES | **REMOVE**（画面内非表示） | C1/C2。意味は G-BANNER が担う |
| S-US-PRES | **REMOVE** | 同上 |
| S-REV-PRES | **REMOVE** | 同上 |
| S-SP-PRES | **REMOVE** | 同上 |
| S-UD-PRES | **REMOVE** | 同上。保存未接続は詳細に書込UIが無い/計画 mutation で担保 |
| S-REC-PRES | **CONSOLIDATE → REMOVE** | 記録画面は M-REC + SEC-REC-DRAFT が保存境界を担うため screen 重複は除去可 |
| S-DEST | **KEEP** | 未接続 destination 自体が fail-closed 相当 |
| SEC-OV-KPI | **REMOVE or MERGE into SEC-OV-FAM-R** | 「件数は合成」は Family R 注記と重複。Family R を残し KPI 専用注記は落とす |
| SEC-OV-FAM-R | **KEEP** | DEMO-UX-10 受入（定義・非同等） |
| SEC-OV-REV | **REMOVE** | 合成再宣言のみ；入口 CTA は残す |
| SEC-OV-ACT | **KEEP** | 今日やること＝移動のみ／保存なしの操作境界 |
| SEC-US-FAM-R | **KEEP**（短文化可） | DEMO-UX-10。S-US-PRES 除去後の Users 側定義説明 |
| SEC-US-FILTER | **CONSOLIDATE into SEC-US-HINT** | filterHint か FILTER_NOTE のどちらか一方に集約 |
| SEC-US-HINT | **KEEP（集約先）** | 操作可能であることの短い案内を残す |
| SEC-US-DETAIL | **KEEP** | 詳細プレビュー境界（DUX7-P2-1 OUT のまま明示） |
| SEC-US-EMPTY | **KEEP** | 空結果の誤認防止 |
| SEC-REC-INCOMPLETE | **KEEP** | 導線説明（DEMO再宣言ではない） |
| SEC-REC-DRAFT | **KEEP** | 一時編集≠保存の必須境界 |
| SEC-REC-RECENT | **KEEP** | 閲覧サンプル役割分離（DEMO-UX-9） |
| M-REC / M-REV / M-SP | **KEEP** | 書込ボタン隣接の必須境界 |
| SEC-REV-CALC | **KEEP**（短文化可） | 期限計算未接続の必須境界 |
| SEC-REV-FAM-A | **KEEP** | DEMO-UX-10 受入 |
| FIX-INLINE / SYS footer 合成接尾辞 | **KEEP** | 実データ誤認防止。本 slice で大量削除しない |

**REMOVE の条件（LOCKED）**

```text
REMOVE してよいのは、G-BANNER（および残置する mutation / Family / fail-closed 注記）と
意味が重複し、かつ独自の操作境界を持たない screen/section 注記のみ。

REMOVE 後も、責任者デモで次を常に説明できなければならない:
  - いま見ているのは合成 DEMO である（global banner）
  - live SharePoint / 業務データに接続していない
  - 実保存できない（mutation-boundary または today-action 注記）
  - 異常状態は成功に丸めない
```

### 4. Canonical placement proposal（LOCKED for Implementation）

```text
Layer 1 — Global（常時）
  DemoBanner = sole primary DEMO / synthetic / no live SharePoint signal

Layer 2 — Screen
  ready 業務画面（Overview / Users / Records / Review / Support plan / User detail）:
    screen-level「合成・未接続」帯は置かない（Layer 1 に集約）
  disconnected destination / fail-closed panels:
    既存の停止・拒否説明を維持

Layer 3 — Section（ユニーク意味のみ）
  Overview: Family R 注記 + 今日やること操作境界注記
  Users: Family R（短）+ filter 集約ヒント + detail A-only + empty
  Records: incomplete 導線 + draft 境界 + recent 役割 + mutation 境界
  Review: calculation 境界 + Family A + mutation 境界

Layer 4 — Mutation-boundary（書込コントロール直近）
  disabled 作成/保存/見直し完了/評価 の説明は必ず残す

Layer 5 — Fail-closed（非間引き）
  access_denied / retrieval_failed / unselected / save_outcome_unknown
```

視覚的な「黄色い注記ボックス」のデザインシステム刷新は OUT。
Implementation は既存スタイルクラスのまま、**表示する注記の数と文言重複**を減らす。

### 5. Explicit non-changes（safety meaning）

```text
DemoBanner 文言の「接続あり」「本番」化 = forbidden
save_outcome_unknown の成功/失敗丸め = forbidden
access_denied で個人情報や overview を出す = forbidden
unselected で ready-region を出す = forbidden
mutation ボタンを enabled にする = forbidden
「保存できます」「業務データに接続」系 copy = forbidden
Family R / Family A の対応意味を消す = forbidden（DEMO-UX-10 回帰）
```

## Selected scope（IN）

### RPF-004 — DEMO注記集約

1. 上記 inventory / matrix / canonical placement に従い、ready 画面の **screen-level 合成帯を除去または非表示**する
2. Overview KPI 専用の同義セクション注記（SEC-OV-KPI）と見直し入口の同義注記（SEC-OV-REV）を除去または Family R へ統合する
3. Users の filter 案内を **1系統**に集約する（FILTER_NOTE と filterHint の重複解消）
4. Records / Review / Support plan の **mutation-boundary 注記は残す**
5. DEMO-UX-10 Family R / Family A 注記は残す（短文化は可、意味削除は不可）
6. fail-closed / unselected / save_outcome_unknown の説明は弱めない
7. 関連 unit/smoke の fail-closed・導線アサーションを更新し、安全境界回帰を防ぐ

文言の最終形は Implementation で固定してよい。分類と KEEP/REMOVE 方針は変更不可。

## Exact OUT

```text
save / create mutation enablement = OUT
live I/O / SharePoint write = OUT
RPF-005 保存バッジ強調変更 = OUT
DUX7-P2-1 詳細プレビュー拡張 = OUT
RPF-007 保存中進行表示 = OUT
large visual redesign（色・レイアウト刷新） = OUT
business-rule / GOV-RULE changes = OUT
Family R/A 定義の削除 = OUT
fixture 業務ストーリー文言の大掃除 = OUT
DemoBanner 除去 = OUT
Deploy = OUT
#299 Close = OUT
Implementation Start / Ready / Merge auto-advance = OUT
```

## Must preserve（non-negotiable）

- DEMO / synthetic であることが常時判別可能（**G-BANNER KEEP**）
- SharePoint live I/O なしの明示（banner および残置境界注記）
- 実保存不可の明示（mutation-boundary / Records draft / Overview action note）
- fail-closed（`access_denied` / `retrieval_failed`）
- `siteSelection=unselected` stop
- `save_outcome_unknown` 非丸め
- DEMO-UX-7 today-action navigation
- DEMO-UX-8 users filters（件数・セマンティクス）
- DEMO-UX-9 daily-record experience（選択→draft→discard、保存 disabled）
- DEMO-UX-10 Family R / Family A 対応説明可能性

## Acceptance criteria

Implementation Start 後の受入は次をすべて満たすこと。

1. **Global 判別**
   `demoMode` 時、DemoBanner が常時表示され、合成 / 実データなし / live SharePoint なしが読める。

2. **重複削減**
   Overview / Users / Records / Review の ready 表示で、screen-level「合成・業務データ未接続」帯が重畳しない（原則 0）。
   同一画面で「合成です・未接続です」だけの注記が 3 段以上にならない。

3. **必須境界残存**
   - Records: 実保存不可（mutation および/または draft hint）
   - Review / Support plan: 書込操作不可注記
   - Overview 今日やること: 移動のみ・保存なし
   - Users: 空フィルタ誤認防止、詳細プレビュー境界

4. **DEMO-UX-10 非回帰**
   Family R / Family A の定義・非同等が説明可能（注記または同等の短文が残る）。件数対応（3/2/3 と Review 3/2）を壊さない。

5. **安全非回帰**
   access_denied / unselected / save_outcome_unknown の意味と可視説明が維持される。
   注記削減後も「実データに接続済み」「保存できる」と読めない。

6. **導線非回帰**
   DEMO-UX-7 / 8 / 9 の操作（A/B/C、フィルタ、draft discard）が維持される。

7. **検証**
   unit および browser smoke で、注記削減後も banner / mutation 境界 / fail-closed / UX-10 対応注記を確認する。

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

Human gate `DEMO-UX-11 Implementation Start GO` は 2026-08-13 に受領済み。
次の Human gate は Fresh Review / Ready（本sliceでは Ready を要求しない）。

## Evidence referenced

```text
flow feedback:
  docs/architecture/responsible-person-demo-v1-flow-review-feedback-record.md
predecessor merge:
  PR #324 / 012dc405bf9469d2c5bc1652ffc472782012db97
  tip 1222165fbacb8e39c12bf4d9693eb72c1b888653
global:
  spfx/src/shell/ux/DemoBanner.tsx
  spfx/src/shell/ux/SiteUnselectedStop.tsx
  spfx/src/shell/ux/save-state.ts
screen/section copy:
  spfx/src/shell/dashboard/overview-copy.ts
  spfx/src/shell/users/users-copy.ts
  spfx/src/shell/records/daily-record-copy.ts
  spfx/src/shell/review/review-due-copy.ts
  spfx/src/shell/users/support-plan-copy.ts
  spfx/src/shell/ux/kpi-review-count.ts
  spfx/src/shell/ux/destination.ts
surfaces:
  OverviewDashboard.tsx / UsersList.tsx / DailyRecords.tsx
  ReviewDueState.tsx / SupportPlan.tsx / UserDetail.tsx
recheck density observation:
  /opt/cursor/artifacts/responsible-person-recheck-9dd43e2/recheck-report.md（RPF-004）
```
