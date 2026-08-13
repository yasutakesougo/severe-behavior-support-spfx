# DADS-02 — Existing UI Inventory

```text
Issue / program: DADS（法人アプリ UI 収束）
Unit: DADS-02 — Existing UI Inventory
Status: DRAFT / docs-only（this PR）
Authority: Decision-DADS-ADOPTION-V1
  docs/architecture/decision-dads-adoption-v1.md
  docs/architecture/dads-program-roadmap.md
Baseline main: 07ce66dbf9568835639e76a440445362a2aca9d7
Kind: read-only investigation + docs-only output
React / CSS / SPFx / tests / scripts mutation: 0
business/domain impact: NONE（全 inventory 項目）
implementation authorization: NONE（全 inventory 項目）
DADS-03 Style Guide Start: NOT AUTHORIZED（separate GO）
DADS-04+ / Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## 1. Purpose

既存 DEMO-UX / SPFx UI を **変更せず**、DADS-03 Application Style Guide の入力となる棚卸しを固定する。

```text
目標 ≠ DADS 全面置換・再設計
目標 = 現状 UI を PASS / ADAPT / GAP / N/A で分類し、Style Guide へ論点を渡す
```

判定原則（LOCKED by DADS-01）:

```text
「DADS と違う = 修正」にしない
DADS を Domain / Contracts / 制度 Decision の上位正本にしない
recordStatus 等の業務意味・fail-closed 意味は変更しない
既存 DEMO-UX をベースラインとして保存する
```

## 2. Method

| Step | Action |
|---|---|
| 1 | Baseline `07ce66d` 上の `spfx/src/shell/**` と host web part を読取専用で走査 |
| 2 | DEMO-UX / SHELL-UX / DASHBOARD-UX slice 文書とコードの対応を確認 |
| 3 | DADS-01 Adopt / Adapt / Application Specific 領域へマッピング |
| 4 | 各項目を PASS / ADAPT / GAP / N/A で分類（業務意味変更は禁止） |
| 5 | docs-only 成果物として本ファイルのみ追加 |

調査対象ルート:

```text
spfx/src/shell/ux/
spfx/src/shell/dashboard/
spfx/src/shell/users/
spfx/src/shell/records/
spfx/src/shell/review/
spfx/src/webparts/scaffoldShellWebPart/
```

非対象（コード変更・再設計禁止）:

```text
Domain / Contracts / SharePoint schema / adapter / permission
smoke harness の実行変更
DADS-03 本文の執筆
トークン実装（DADS-04）
```

## 3. Classification rules（this inventory）

| Class | Meaning for DADS-03 |
|---|---|
| **PASS** | 現状のまま Style Guide に継承可能。置換しないことを既定とする |
| **ADAPT** | 業務意味を変えずに、表現・構造・トークン寄せの候補。必須修正ではない |
| **GAP** | accessibility / semantics / consistency に明確な不足。Style Guide で原則化し、後続 DADS-UX で扱う候補 |
| **N/A** | DADS 対応付け不要、または後続ユニット（DADS-04 等）専任 |

全項目共通:

```text
business/domain impact: NONE
implementation authorization: NONE
```

## 4. Surface map（baseline）

| Surface | Primary path | Related slices |
|---|---|---|
| App Shell / navigation | `spfx/src/shell/ux/AppShellChrome.tsx` | SHELL-UX-1,3,7; DEMO-UX-14 |
| Overview | `spfx/src/shell/dashboard/OverviewDashboard.tsx` | DASHBOARD-UX-1; DEMO-UX-7,10,11 |
| Users list | `spfx/src/shell/users/UsersList.tsx` | DEMO-UX-2,8,10,11,13 |
| User detail | `spfx/src/shell/users/UserDetail.tsx` | DEMO-UX-3,11,13 |
| Support plan（nested） | `spfx/src/shell/users/SupportPlan.tsx` | DEMO-UX-4,11 |
| Record entry | `spfx/src/shell/records/DailyRecords.tsx` | DEMO-UX-5,9,11 |
| Review / due-state | `spfx/src/shell/review/ReviewDueState.tsx` | DEMO-UX-6,10,11 |
| Status labels | `spfx/src/shell/ux/status-labels.ts` | DEMO-UX-7 |
| Save-state | `spfx/src/shell/ux/save-state.ts`, `SaveStateBadge.tsx` | SHELL-UX-2; DEMO-UX-12,14 |
| Fail-closed panels | `StatusPanel.tsx`, `UnauthenticatedPanel.tsx`, `SiteUnselectedStop.tsx`, `PartialRetrievalPanel.tsx` | SHELL-UX-1,4,6 |
| Host scaffold | `ScaffoldShell.tsx` | SHELL-UX host |

命名上 **存在しない** 共有コンポーネント（設計候補のみ）:

```text
StatusBadge（名簿用共有） / EmptyState / AccessDenied（独立コンポーネント名）
→ docs/architecture/dashboard-design-v1.md §10 に候補記載。実装なし。
```

## 5. Inventory items

### INV-01 — App Shell landmarks / primary navigation

| Field | Value |
|---|---|
| ID | INV-01 |
| current surface/component | `AppShellChrome` — skip link, `header[role=banner]`, primary `nav`, `main#shell-ux-main` |
| current behavior | Skip link → DEMO banner → header（製品名 / save badge / site radios / display name）→ 概要・利用者・記録ナビ → main。未認証・事業所未選択・保存一時停止時はナビ無効化 |
| current source path | `spfx/src/shell/ux/AppShellChrome.tsx`; `primary-navigation.ts`; `ShellUx.module.scss` |
| related DEMO-UX slice | SHELL-UX-1, SHELL-UX-3, SHELL-UX-7; DEMO-UX-14 |
| DADS area/principle | Adapt: Navigation；Adopt: Accessibility / Focus / Interaction |
| classification | **PASS**（IA・安全境界）/ 見た目トークン寄せは ADAPT 候補だが本項目の核は PASS |
| evidence | Landmarks・`aria-current="page"`・skip link・nav disable on fail-closed / saving pause（`AppShellChrome.tsx`） |
| recommended DADS-03 treatment | App Shell IA を法人アプリ固有として継承。DADS 標準ナビへの強制置換をしない |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-02 — Product name / brand presentation in shell header

| Field | Value |
|---|---|
| ID | INV-02 |
| current surface/component | Header product name（`<p className={productName}>`） |
| current behavior | 「強度行動障害支援（シェル表示）」を banner 内テキストとして表示。見出し階層には入らない |
| current source path | `spfx/src/shell/ux/AppShellChrome.tsx`（product name ~L341） |
| related DEMO-UX slice | SHELL-UX-1 |
| DADS area/principle | Adapt: Navigation / Application Specific brand |
| classification | **ADAPT** |
| evidence | Brand は `<p>`。各 destination の `<h1>` がページ見出し |
| recommended DADS-03 treatment | ブランド／製品名の提示位置と見出し階層の関係を Style Guide で定義。業務意味は変更しない |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-03 — Destination heading focus management

| Field | Value |
|---|---|
| ID | INV-03 |
| current surface/component | Destination `<h1 tabIndex={-1}>` + `destinationHeadingRef.focus()` on navigation |
| current behavior | 画面遷移後に当該 h1 へフォーカス移動。キーボード操作の入口として機能 |
| current source path | `AppShellChrome.tsx`（focus effect ~L168–174, ~L201）；各画面 heading |
| related DEMO-UX slice | SHELL-UX-7；全 DEMO-UX destinations |
| DADS area/principle | Adopt: Focus / Heading structure |
| classification | **PASS** |
| evidence | 全主要 destination が `headingRef` を受け取り h1 に接続 |
| recommended DADS-03 treatment | 画面遷移時の見出しフォーカスを標準パターンとして継承 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-04 — Overview dashboard

| Field | Value |
|---|---|
| ID | INV-04 |
| current surface/component | `OverviewDashboard` — KPI grid, 今日やること, recent records, review CTA |
| current behavior | h1「概要」；KPI（今日の対象/要確認/未記録/期限接近）；見直し状況 CTA；今日やることナビ；最近の記録（操作なし）。合成 fixture |
| current source path | `spfx/src/shell/dashboard/OverviewDashboard.tsx`; `DashboardUx.module.scss`; fixtures/copy |
| related DEMO-UX slice | DASHBOARD-UX-1; DEMO-UX-7,10,11 |
| DADS area/principle | Adapt: Cards/lists density；Application Specific: 未記録/要確認/期限接近 |
| classification | **ADAPT** |
| evidence | dashed panel / rem spacing；KPI は非インタラクティブ `<li>`；section `aria-labelledby` |
| recommended DADS-03 treatment | Overview の情報設計・件数語彙は DEMO-UX 正本を維持。余白・カード使用方針のみ Style Guide で寄せる候補 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-05 — Users list

| Field | Value |
|---|---|
| ID | INV-05 |
| current surface/component | `UsersList` — filter chips + rows + detail buttons |
| current behavior | 合成 8 行；フィルタ（すべて/要確認/未記録/期限接近, `aria-pressed`）；詳細は fixture 許可 ID のみ有効（DEMO-UX-13） |
| current source path | `spfx/src/shell/users/UsersList.tsx`; `users-filter.ts`; `UsersUx.module.scss` |
| related DEMO-UX slice | DEMO-UX-2,8,10,11,13 |
| DADS area/principle | Adapt: Tables/lists；Application Specific status filters |
| classification | **ADAPT** |
| evidence | filter `role="group"`；badge list `aria-label`；empty note は plain `<p>` |
| recommended DADS-03 treatment | 一覧密度・フィルタ表現をアプリ IA 優先で定義。フィルタ意味（DEMO-UX-7/8）は変更しない |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-06 — User detail

| Field | Value |
|---|---|
| ID | INV-06 |
| current surface/component | `UserDetail` — back, h1 personLabel, section chrome, business/system panels |
| current behavior | 戻る→一覧；セクション見出し下に現在の支援/計画/記録/評価/履歴；businessFacts vs systemState 分離 |
| current source path | `spfx/src/shell/users/UserDetail.tsx`; `UserDetailUx.module.scss` |
| related DEMO-UX slice | DEMO-UX-3,11,13 |
| DADS area/principle | Adapt: Navigation within screen；Adopt: Heading |
| classification | **ADAPT**（画面骨格）— タブ意味論は INV-07 |
| evidence | 複数 `<h2>` + `aria-labelledby`；戻るは `disabled`/`aria-disabled` 対応 |
| recommended DADS-03 treatment | 詳細 IA を継承。見た目方言（px/radius）はトークン層で収束候補 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-07 — User detail “section tabs” semantics

| Field | Value |
|---|---|
| ID | INV-07 |
| current surface/component | `UserDetail` section label strip |
| current behavior | 「表示順」ラベル群。多くは非操作 `<span>`。支援計画のみ preview 時に `<button>`。見た目は同一クラス |
| current source path | `UserDetail.tsx` L69–96；`UserDetailUx.module.scss` |
| related DEMO-UX slice | DEMO-UX-3,4 |
| DADS area/principle | Adopt: Accessibility / Interaction principles |
| classification | **GAP** |
| evidence | `role="tablist"`/`tab`/`tabpanel` なし。button と span が同一視覚クラスで混在 |
| recommended DADS-03 treatment | 「見た目タブ ≠ ARIA tabs」を原則化。非操作ラベルか、真の tabs / in-page nav かを Style Guide で選択。業務セクション意味は変更しない |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-08 — Support plan（nested presentation）

| Field | Value |
|---|---|
| ID | INV-08 |
| current surface/component | `SupportPlan` |
| current behavior | 目標・行動・見直し表示；mutation ボタン常時 disabled；戻る→詳細 |
| current source path | `spfx/src/shell/users/SupportPlan.tsx`; `SupportPlanUx.module.scss` |
| related DEMO-UX slice | DEMO-UX-4,11 |
| DADS area/principle | Adapt: Forms/layout；Application Specific: 支援計画 |
| classification | **ADAPT** |
| evidence | fail-closed mutation；heading focus；px/radius dialect |
| recommended DADS-03 treatment | 計画画面を Application Specific として定義。実保存なし境界は PASS 継承（INV-15） |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-09 — Record entry / daily records

| Field | Value |
|---|---|
| ID | INV-09 |
| current surface/component | `DailyRecords` — incomplete list, draft fields, recent timeline |
| current behavior | 未完了選択→ローカル draft textarea；作成/保存ボタン常時 disabled；永続化なし |
| current source path | `spfx/src/shell/records/DailyRecords.tsx`; `daily-record-draft.ts`; `DailyRecordsUx.module.scss` |
| related DEMO-UX slice | DEMO-UX-5,9,11 |
| DADS area/principle | Adapt: Forms；Application Specific: 記録入力 |
| classification | **ADAPT**（画面・業務フロー提示）— listbox 意味論は INV-10 |
| evidence | native label+input/textarea；mutation disabled + notes |
| recommended DADS-03 treatment | 記録フロー優先でフォーム原則へ寄せる候補。保存意味・実保存なしは不変 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-10 — Daily records incomplete selection ARIA

| Field | Value |
|---|---|
| ID | INV-10 |
| current surface/component | Incomplete confirmation list |
| current behavior | `<ul role="listbox">` + `<li><button role="option">`。クリック選択。矢印キー roving tabindex なし |
| current source path | `DailyRecords.tsx` L71–101 |
| related DEMO-UX slice | DEMO-UX-5,9 |
| DADS area/principle | Adopt: Accessibility / Form semantics |
| classification | **GAP** |
| evidence | option が button 上；listbox キーボードパターン未実装 |
| recommended DADS-03 treatment | 選択 UI の推奨パターン（listbox 正規化 / radiogroup / 単純 button group）を Style Guide で固定。選択の業務意味は変更しない |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-11 — Review status / due-state presentation

| Field | Value |
|---|---|
| ID | INV-11 |
| current surface/component | `ReviewDueState` |
| current behavior | Family A 要約件数 + attention cards（`reviewStatusLabel` / `dueStateLabel`）；mutation 常時 disabled；計算無効 note |
| current source path | `spfx/src/shell/review/ReviewDueState.tsx`; `kpi-review-count.ts`; `ReviewDueStateUx.module.scss` |
| related DEMO-UX slice | DEMO-UX-6,10,11 |
| DADS area/principle | Application Specific: 見直し状態 / 期限接近；Adapt: status presentation |
| classification | **ADAPT** |
| evidence | DEMO-UX-10 で Family R vs Family A 母集団差を明示；rounded cards |
| recommended DADS-03 treatment | 見直し／期限の **表示語彙** を Application Specific として継承。件数母集団差の説明方針を維持。色だけに依存しない状態表現は Adopt |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-12 — Canonical status labels（要確認 / 未記録 / 期限接近）

| Field | Value |
|---|---|
| ID | INV-12 |
| current surface/component | `status-labels.ts` + consumers |
| current behavior | 正本ラベル: 要確認 / 期限接近 / 未記録。deprecated primary: 確認待ち / 確認対象 / 期限間近 |
| current source path | `spfx/src/shell/ux/status-labels.ts` |
| related DEMO-UX slice | DEMO-UX-7（+ 8,10 consumers） |
| DADS area/principle | Application Specific status presentation |
| classification | **PASS** |
| evidence | 定数 + deprecated 判定；KPI/filter/review が参照 |
| recommended DADS-03 treatment | ラベル文字列・非推奨語を Style Guide の Application Specific 章へそのまま継承。意味変更禁止 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-13 — Status badge visual primitives（shared component absence）

| Field | Value |
|---|---|
| ID | INV-13 |
| current surface/component | Inline `.statusBadge` styles（Users / Review / Records） |
| current behavior | 名簿: 角ばった border badge（radius なし）；Review: `border-radius: 4px`；Records incomplete: `border-radius: 999px` pill。共有 React `StatusBadge` なし |
| current source path | `UsersUx.module.scss` `.statusBadge`；`ReviewDueStateUx.module.scss`；`DailyRecordsUx.module.scss` L131 |
| related DEMO-UX slice | DEMO-UX-2,5,6,7 |
| DADS area/principle | Adapt: Status presentation；DADS-05 CONSOLIDATE 候補 |
| classification | **ADAPT** |
| evidence | 形状方言が 3 系統；ラベル文字は共通正本（INV-12） |
| recommended DADS-03 treatment | 「テキストラベルが正本／形状は統一候補」を定義。DADS と違う形状だけで GAP にしない。共有 primitive 化は DADS-05 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-14 — Save-state presentation（5 states + hierarchy + saving pause）

| Field | Value |
|---|---|
| ID | INV-14 |
| current surface/component | `SaveStateBadge` / `save-state.ts` / DEMO-UX-12,14 |
| current behavior | unsaved/saving/saved/save_failed/save_outcome_unknown。不明は成功・失敗へ丸めない。QUIET/EMPHASIZED。saving 中は ready content `inert` + nav disable |
| current source path | `save-state.ts`; `SaveStateBadge.tsx`; `save-badge-hierarchy.ts`; `saving-progress-observability.ts`; `AppShellChrome.tsx` |
| related DEMO-UX slice | SHELL-UX-2; DEMO-UX-12,14 |
| DADS area/principle | Application Specific save vocabulary；Adopt: Error/status presentation |
| classification | **PASS** |
| evidence | 5 状態・description・aria-live 差・pause note `role="status"` |
| recommended DADS-03 treatment | SHELL-UX 語彙を Style Guide の Application Specific として継承。丸め禁止を明記 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-15 — Disabled / fail-closed presentation

| Field | Value |
|---|---|
| ID | INV-15 |
| current surface/component | `StatusPanel`, `UnauthenticatedPanel`, `SiteUnselectedStop`, `PartialRetrievalPanel`, mutation disabled CTAs |
| current behavior | loading=`role=status`；access_denied/retrieval_failed/partial/unauth=`role=alert`；未選択で業務停止；PII 非表示；mutation CTA は disabled+aria-disabled+説明 |
| current source path | `StatusPanel.tsx`; `UnauthenticatedPanel.tsx`; `SiteUnselectedStop.tsx`; `PartialRetrievalPanel.tsx`; Records/Plan/Review buttons |
| related DEMO-UX slice | SHELL-UX-1,4,6; DEMO mutation boundary |
| DADS area/principle | Adapt: Notifications（安全境界維持）；Adopt: Error presentation |
| classification | **PASS** |
| evidence | モード分岐と inquiry 表示；保存不明非丸めと整合 |
| recommended DADS-03 treatment | fail-closed パネル群を **置換禁止の安全境界**として Style Guide に固定。見た目トークンのみ後続 ADAPT 可 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-16 — Demo banner / inquiry / partial-retrieval notifications

| Field | Value |
|---|---|
| ID | INV-16 |
| current surface/component | `DemoBanner`, `ErrorInquiryDisplay`, partial retrieval messaging |
| current behavior | DEMO 常時表示；errorCode/correlationId 照会 UI；部分取得は成功件数へ混ぜない |
| current source path | `DemoBanner.tsx`; `ErrorInquiryDisplay.tsx`; `PartialRetrievalPanel.tsx` |
| related DEMO-UX slice | SHELL-UX-1,4,5; DEMO-UX-11 |
| DADS area/principle | Adapt: Notifications |
| classification | **PASS** |
| evidence | `role="status"` / alert + live regions；照会コピー UI |
| recommended DADS-03 treatment | 通知パターンとして継承。トースト新設は必須としない |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-17 — Empty states

| Field | Value |
|---|---|
| ID | INV-17 |
| current surface/component | Ad-hoc empty notes（Users filter empty；partial succeeded-empty） |
| current behavior | フィルタ 0 件時は plain `<p>` note。共有 `EmptyState` コンポーネントなし（設計候補のみ） |
| current source path | `UsersList.tsx` L121–124；`PartialRetrievalPanel.tsx`；`dashboard-design-v1.md` §10 |
| related DEMO-UX slice | DEMO-UX-8；SHELL-UX-4 |
| DADS area/principle | Adopt: Accessibility；Adapt: empty presentation |
| classification | **GAP** |
| evidence | empty note に `role="status"` / 統一 heading 構造なし；設計候補未実装 |
| recommended DADS-03 treatment | Empty presentation 原則（文言・live region・見出し）を定義。全面カード化はしない。実装は後続 DADS-UX / DADS-05 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-18 — Forms（labels, draft fields, site radios）

| Field | Value |
|---|---|
| ID | INV-18 |
| current surface/component | DailyRecords draft；SiteSelector radios；ErrorInquiry readonly fields |
| current behavior | native `<label>` + control。Fluent form controls は shell 画面で未使用。Property pane のみ Fluent |
| current source path | `DailyRecords.tsx`; `SiteSelector.tsx`; `ErrorInquiryDisplay.tsx` |
| related DEMO-UX slice | DEMO-UX-9; SHELL-UX-3,5 |
| DADS area/principle | Adopt: Form semantics；Adapt: Forms |
| classification | **ADAPT** |
| evidence | ラベル関連付けは概ね native。エラー関連付けパターンは業務フォーム未実装（デモ境界） |
| recommended DADS-03 treatment | ラベル・説明・エラー関連付け原則を Adopt。記録フォームは業務フロー優先で Adapt |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-19 — Heading structure across destinations + scaffold host

| Field | Value |
|---|---|
| ID | INV-19 |
| current surface/component | Destination h1/h2 + `ScaffoldShell` body h2 |
| current behavior | 各 destination が h1 を所有。ready region 末尾に host の「Shell ready」系 `<h2>` が続く |
| current source path | destination screens；`ScaffoldShell.tsx` L34–36；`AppShellChrome.tsx` children 配置 ~L502 |
| related DEMO-UX slice | SHELL-UX host + all destinations |
| DADS area/principle | Adopt: Heading structure |
| classification | **GAP**（軽微〜中；ホスト見出し混入） |
| evidence | document order: destination h1 → destination h2… → scaffold h2（シェル準備文言） |
| recommended DADS-03 treatment | 1 画面 1 主見出し、ホスト補助文言は非見出しまたは明確な補足階層、を原則化。業務見出し意味は変更しない |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-20 — Keyboard / focus affordances consistency

| Field | Value |
|---|---|
| ID | INV-20 |
| current surface/component | Cross-cutting focus styles |
| current behavior | Skip link / nav / filters / site radios は多く `:focus`。Detail/Plan の back・一部 tab button は `:focus-visible`。destination heading は `:focus` |
| current source path | `ShellUx.module.scss`; `UsersUx.module.scss`; `UserDetailUx.module.scss`; `SupportPlanUx.module.scss` |
| related DEMO-UX slice | SHELL-UX-1; DEMO-UX-2..6 |
| DADS area/principle | Adopt: Focus |
| classification | **ADAPT** |
| evidence | `:focus` と `:focus-visible` の混在；動作不能ではない |
| recommended DADS-03 treatment | focus-visible 方針を Style Guide で統一候補として記載。必須置換は DADS-UX 判断 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-21 — Accessibility semantics baseline（landmarks / live regions）

| Field | Value |
|---|---|
| ID | INV-21 |
| current surface/component | Shell-wide ARIA usage |
| current behavior | banner/nav/main、aria-live、aria-current、aria-pressed、aria-busy、inert、radiogroup 等が存在 |
| current source path | `AppShellChrome.tsx` + fail-closed / save panels |
| related DEMO-UX slice | SHELL-UX-1..7; DEMO-UX-12,14 |
| DADS area/principle | Adopt: Accessibility |
| classification | **PASS**（基盤）— 個別 GAP は INV-07/10/17/19 |
| evidence | 上記 roles/live regions；smoke 群が keyboard/viewport を検証済み（履歴） |
| recommended DADS-03 treatment | 既存 landmark / live-region 基盤を継承。個別 GAP のみ後続で扱う |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-22 — Typography / spacing / layout dialects

| Field | Value |
|---|---|
| ID | INV-22 |
| current surface/component | Per-surface SCSS modules |
| current behavior | Shell/Overview/Users: rem + dashed panels。Records/Review/Plan/Detail: px + 8–12px radius。SPFx `[theme:…]` + 一部ハードコード色（#0078d4, #a4262c, #fff4ce） |
| current source path | `ShellUx.module.scss`; `DashboardUx.module.scss`; `UsersUx.module.scss`; `DailyRecordsUx.module.scss`; `ReviewDueStateUx.module.scss`; `UserDetailUx.module.scss`; `SupportPlanUx.module.scss` |
| related DEMO-UX slice | all DEMO-UX / SHELL-UX |
| DADS area/principle | Adopt: Typography / Spacing；DADS-04 tokens |
| classification | **ADAPT** |
| evidence | 2 系統の視覚方言；DADS トークン層なし（想定どおり DADS-04） |
| recommended DADS-03 treatment | 法人アプリの字階層・余白スケールを定義。方言差は「修正必須」ではなくトークン収束候補。見た目統一は a11y/構造の後（DADS-01 §7.5） |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-23 — Design token / Fluent UI package posture

| Field | Value |
|---|---|
| ID | INV-23 |
| current surface/component | SPFx theme strings；`@fluentui/react` dependency |
| current behavior | Shell React 画面は Fluent コンポーネント未使用。Property pane のみ Fluent。独自 token 中間層なし |
| current source path | `spfx/package.json`；shell TSX 全体；`ScaffoldShellWebPart.ts` |
| related DEMO-UX slice | N/A（基盤） |
| DADS area/principle | DADS-04 Design Tokens；Adopt foundation |
| classification | **N/A**（DADS-02 判定対象外 → DADS-04 専任） |
| evidence | Fluent 未使用 in shell surfaces；theme string literals |
| recommended DADS-03 treatment | Style Guide で「React に DADS 値を直書きしない／中間トークン層を正」と方針のみ記載。実装は DADS-04 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-24 — Loading presentation

| Field | Value |
|---|---|
| ID | INV-24 |
| current surface/component | `StatusPanel` mode=`loading` |
| current behavior | テキスト「読み込み中」+ `role="status"` `aria-live="polite"`。スピナーコンポーネントなし。ready まで業務面非表示 |
| current source path | `StatusPanel.tsx` |
| related DEMO-UX slice | SHELL-UX-1 |
| DADS area/principle | Adopt: Interaction / status presentation |
| classification | **PASS** |
| evidence | loading 時 ready region 非表示；個人情報なし |
| recommended DADS-03 treatment | テキスト status を許容。装飾スピナー追加は任意・非必須 |
| business/domain impact | NONE |
| implementation authorization | NONE |

### INV-25 — DestinationPlaceholder / unused nav placeholder path

| Field | Value |
|---|---|
| ID | INV-25 |
| current surface/component | `DestinationPlaceholder` |
| current behavior | SHELL-UX-7 由来。現行 3 主 destination は実画面接続済みのため通常パスでは未使用 |
| current source path | `DestinationPlaceholder.tsx`; `destination.ts` |
| related DEMO-UX slice | SHELL-UX-7 |
| DADS area/principle | N/A / Adapt residual |
| classification | **N/A** |
| evidence | overview/users/records は実コンポーネント配線 |
| recommended DADS-03 treatment | Style Guide 対象外。削除・整理は別 Issue（実装 GO 時） |
| business/domain impact | NONE |
| implementation authorization | NONE |

## 6. Counts

| Classification | Count | IDs |
|---|---|---|
| **PASS** | **8** | INV-01, INV-03, INV-12, INV-14, INV-15, INV-16, INV-21, INV-24 |
| **ADAPT** | **11** | INV-02, INV-04, INV-05, INV-06, INV-08, INV-09, INV-11, INV-13, INV-18, INV-20, INV-22 |
| **GAP** | **4** | INV-07, INV-10, INV-17, INV-19 |
| **N/A** | **2** | INV-23, INV-25 |
| **Total** | **25** | |

Notes:

- INV-01 は「核 = PASS」。見た目トークン寄せは INV-22 側で ADAPT 扱い。
- GAP はすべて presentation / a11y / structure。業務意味・fail-closed・Contracts 変更を要求しない。

## 7. High-impact GAPs

| ID | Why high-impact for DADS-03 | Not authorized here |
|---|---|---|
| **INV-07** | 詳細の主要 chrome が tabs に見えるが ARIA tabs ではない。AT/キーボード期待と視覚が乖離 | 実装修正・タブ意味の業務変更 |
| **INV-10** | 記録入口の選択 UI が listbox 意味論として不整合。フォーム原則の中核入力 | 実保存配線・選択業務意味変更 |
| **INV-17** | 空状態の一貫した意味論・通知がない。一覧/部分取得で再発しやすい | EmptyState 実装・一覧再設計 |
| **INV-19** | ホスト h2 が destination 見出し階層に混入。Heading Adopt の阻害 | Scaffold 実装変更（別 GO） |

## 8. Hand-off topics for DADS-03（Application Style Guide）

DADS-03 が決めるべき論点（実装 GO ではない）:

1. **Authority reminder** — Domain/Contracts/制度 Decision 上位、DADS は Style Guide 基礎。  
2. **Application Specific vocabulary** — 要確認 / 未記録 / 期限接近 / 見直し / 保存5状態 / DEMO・操作不可。INV-12,14,15 を正本入力に。  
3. **Keep list（PASS）** — App Shell IA、heading focus、fail-closed panels、save-state 非丸め、status label canon、landmark 基盤、loading text status。  
4. **Adapt list** — Overview/Users/Detail/Records/Review の余白・半径・badge 形状・focus-visible・フォーム原則。**業務意味は触らない。**  
5. **GAP remediation principles** — tabs vs labels；選択 UI の ARIA；Empty presentation；host heading 方針。  
6. **Primitive candidates（DADS-05 later）** — StatusBadge（表示のみ）、EmptyState、Alert/StatusPanel family consolidation。KEEP/ADAPT/FIX/CONSOLIDATE。  
7. **Token posture（DADS-04 later）** — 中間トークン層；React 直書き禁止。  
8. **Screen migration order（unchanged from DADS-01）** — App Shell → Overview → 利用者一覧 → 詳細 → 記録 → 見直し → エラー/空/通知。  
9. **Non-goals** — DEMO-UX 全面置換、DADS 見た目一致の強制、#299 Close、Deploy、SharePoint write。

## 9. Explicit non-claims

```text
This inventory ≠ DADS-03 Start
This inventory ≠ implementation authorization
This inventory ≠ “must fix because unlike DADS”
This inventory ≠ Domain / Contracts / schema / permission change
This inventory ≠ fail-closed relaxation
This inventory ≠ recordStatus / reasonCodes meaning change
This inventory ≠ Ready / Merge-as-behavior / Deploy
This inventory ≠ #299 Close
```

## 10. Verification（this unit）

```text
docs-only deliverable: docs/architecture/dads-existing-ui-inventory.md
spfx/ delta: 0（expected）
src/ delta: 0（expected）
tests/ delta: 0（expected）
scripts/ delta: 0（expected）
existing behavior mutation: 0
DADS-01 authority boundary: preserved
```

## 11. References

```text
docs/architecture/decision-dads-adoption-v1.md
docs/architecture/dads-program-roadmap.md
https://design.digital.go.jp/
https://design.digital.go.jp/dads/guidance/style-guides/
DEMO-UX / SHELL-UX decision & smoke docs under docs/architecture/
Baseline: 07ce66dbf9568835639e76a440445362a2aca9d7
```
