# SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 — Visual Decision Selection

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
Kind: Human Visual Decision（SP-LC-5 Planning-PC lifecycle UI / first visual lock）
Status: SELECTED / LOCKED
Human instruction: SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 Human Visual Decision GO
Date: 2026-08-19
Issue: #444（ui: SP-LC-5 Planning-PC lifecycle UI）
Baseline main: ea6ec1c1671041c87b9bb0222e1d23370aadb806
Depends on:
  Decision-SUPPORT-PLAN-LIFECYCLE-SEMANTICS-1 SELECTED / LOCKED
  SHELL-UX-7 SELECTED / LOCKED（Plans primary-nav NOT ADOPTED）
  DEMO-UX-7 terminology canon（Family R を上書きしない）
  PLANNING-PC-DEMO-1 MERGED（nested SupportPlan graph）
```

Depends on（再 Decision しない）:

- [`decision-support-plan-lifecycle-semantics-selection.md`](./decision-support-plan-lifecycle-semantics-selection.md)
- [`decision-shell-ux-7-navigation-destination-placeholders-selection.md`](./decision-shell-ux-7-navigation-destination-placeholders-selection.md)
- [`decision-demo-ux-7-terminology-today-actions-selection.md`](./decision-demo-ux-7-terminology-today-actions-selection.md)
- [`decision-demo-ux-4-support-plan-presentation-selection.md`](./decision-demo-ux-4-support-plan-presentation-selection.md)
- [`planning-pc-demo-1-implementation-start.md`](./planning-pc-demo-1-implementation-start.md)
- [`ui-screen-templates-v1.md`](./ui-screen-templates-v1.md)
- [`ui-component-catalog-v1.md`](./ui-component-catalog-v1.md)

Issue `#444` live 定義は **SP-LC-5 = Planning-PC lifecycle UI**。
古い routing 表（SP-LC-5 = binding / #347）は上書きしない。`#70` は reopen しない。

## Human Selection

```text
Human Decision: SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
Selected slice:
  ID: SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
  Name: Planning PC 支援計画一覧 Visual Decision
  Parent: #444 SP-LC-5
```

## Screen job

計画担当が「今だれの計画を見る／作るか」を 1 画面で判断する。

大きなダッシュボード化や 7 列以上の高密度テーブルには戻さない。

## Placement（SHELL-UX-7 維持）

```text
SharePoint chrome / 既存 primary nav（概要 / 利用者 / 記録）はそのまま
presentationRole=PLANNER かつ destination users かつ利用者未選択
  → 本一覧
FIELD_STAFF UsersList: UNCHANGED
ADMIN_AUDIT: 本 slice 対象外（既存 users のまま）
h1: 支援計画
nav ラベル「利用者」は変えない
Plans / Administration primary-nav: NOT ADOPTED
```

## Layout skeleton

Screen Template: **DestinationList** compose。

```text
SharePoint chrome（既存）
  DemoBanner（既存。画面内に複製しない）
  compact summary（Family P KPI）
  今日やること（要対応行から導出）
  縦型 row 一覧
    右端 CTA: 詳細を見る | 新規作成
```

## Family P KPI（Family R/A と母集団を混ぜない）

| KPI | 導出 |
|---|---|
| 要確認 | `attentionKind === "needs_action"` の行数 |
| 見直し時期 | `attentionKind === "review_window"` の行数 |
| 観察待ち | `attentionKind === "observation_wait"` の行数 |

件数は fixture 行から決定的に数える。見た目用のハードコード禁止。

DEMO-UX-7 の現場語彙（要確認 / 未記録 / 期限接近 = Family R）を上書きしない。
対応注記を画面に出す。

Catalog UserSummary「role で強調は変えてよい。status 語彙は変えない」は
**Family R を PLANNER 一覧で上書きしない** と読む。計画状態は別チャネル。

## 一覧 1 行の 7 要素

| # | 要素 | 意味 |
|---|---|---|
| 1 | 利用者 | `personLabel` |
| 2 | 状態 | 仕事モード。要対応とは別チャネル |
| 3 | Version | 現行版。未作成は版なし |
| 4 | 最終観察日 | 観察日 or なし |
| 5 | 見直し時期 | 「3月に1回程度」の目安表示。90日失効ではない |
| 6 | 要対応 | 今やること。空なら出さない |
| 7 | 操作 | 詳細を見る XOR 新規作成 |

## 表示状態（Schema status を増やさない）

| 表示状態 | Schema との関係 | 典型 attentionKind |
|---|---|---|
| 適用中 | `Active` の表示（D1=B） | なし |
| 見直し時期 | 見直し支援の目安に入っている。計画は無効化しない（D5=B） | `review_window` |
| 観察確認 | 観察を Review 材料として確認する（D6=A）。不足だけで無効化しない | `observation_wait` |
| 手順更新中 | 手順/版の更新作業中。状態遷移実装ではない | `needs_action` |
| 未作成 | 計画行が無い。`Draft` workflow ではない | `needs_action` |

## Locked meaning

```text
状態 ≠ 要対応
承認済み / 最終承認者を制度要件として出さない（D1=B / D2=B / DEC-008）
PendingReview / Returned を法定フローとして必須化しない（D3=B）
見直し超過や観察不足で計画を無効に見せない
色だけ（label なし）で状態/要対応を伝えない
約3か月見直し = 「見直し目安: YYYY/MM」または同等
90日失効としては扱わない
#24 起算 / approaching 計算は OUT
```

## Component mapping

既存で足りる:

- `StatusBadge`（状態 label 必須）
- `EmptyNotice`（zero-result のみ）
- UsersList 型の縦 `ul` 行 + 右端 button
- compact KPI 見た目は compose。Family R 関数は再利用しない

GAP（Implementation Start 後。新 primitive は増やさない）:

- SupportPlanManagementList surface
- Family P fixture + 導出関数
- PLANNER 分岐（AppShellChrome の users 未選択時のみ）

## Explicit OUT（Visual Decision 時点）

```text
Implementation Start
code / SCSS / fixture mutation
SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1
SharePoint 列追加 / LIVE WRITE / 保存 API / 実データ
権限変更 / 状態遷移実装 / Deploy
#24 reviewDueDate origin / approaching
Schema 1.0.0 変更 / approvedBy rename
FIELD_STAFF UsersList / save 5-state 変更
Plans / Administration primary-nav
Issue #444 close
#70 reopen
Ready / Merge auto-progress
```

## Gate

```text
SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 = SELECTED / LOCKED

This selection does NOT authorize:
  Implementation Start
  Demo Scope Freeze 単独での code mutation
  Issue #444 close
  Ready / Merge
  SharePoint / Entra mutation
  Production deploy

Next Human gates（separate）:
  #444 Visual Decision Record GO
  SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 Scope Freeze
  SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 IMPLEMENTATION START GO
```
