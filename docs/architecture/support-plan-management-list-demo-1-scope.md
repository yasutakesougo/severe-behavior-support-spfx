# SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 — Scope Freeze

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1
Kind: Demo Implementation Scope Freeze（presentation-only）
Status: FROZEN
Human GO: SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 Scope Freeze
Date: 2026-08-19
Issue: #444
Baseline main: ea6ec1c1671041c87b9bb0222e1d23370aadb806
Depends on: Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 SELECTED / LOCKED
```

Depends on（再 Decision しない）:

- [`decision-support-plan-management-list-ui-1-selection.md`](./decision-support-plan-management-list-ui-1-selection.md)
- [`decision-support-plan-management-list-ui-1-acceptance.md`](./decision-support-plan-management-list-ui-1-acceptance.md)

本 Scope Freeze は Implementation Start ではない。code mutation を許可しない。

## Goal

Planning PC の支援計画一覧を、現行 SPFx デモ画面上で操作・確認できる状態にする。
本番実装ではない。LIVE WRITE / SharePoint 実データ / Deploy は含めない。

## IN

```text
synthetic fixture（4〜6名。適用中 / 見直し時期 / 観察確認 / 手順更新中 / 未作成 を各 1）
支援計画一覧
compact KPI（Family P。fixture から決定的に導出）
今日やること（要対応行から導出）
Version 表示
最終観察日
見直し時期
要対応
詳細 / 新規作成の demo navigation
PLANNER + 既存 AppShellChrome のみ
FIELD_STAFF UsersList 非変更
fixture-driven unit tests
a11y gate
browser smoke（Desktop / 200% / Keyboard / focus / narrow PC）
implementation-specific documentation
```

## OUT

```text
SharePoint 列追加
LIVE WRITE
保存 API
実データ
権限変更
状態遷移実装
Deploy / Redeploy
#24 reviewDueDate origin / approaching
Schema 1.0.0 変更
approvedBy rename / delete
FIELD_STAFF 画面 / save 5-state 変更
Plans / Administration primary-nav
詳細画面の完成（既存 SupportPlan へ 1 操作、または temporary synthetic detail）
新規作成の永続化（demo-only 入口まで）
ADMIN_AUDIT 専用面
Issue #444 close
#70 reopen
Ready / Merge auto-progress
```

## Fixture minimum

| 人 | 状態 | Version | 最終観察 | 見直し時期 | 要対応 | attentionKind |
|---|---|---|---|---|---|---|
| Aさん | 適用中 | v3 | あり | 目安表示 | なし | none |
| Bさん | 見直し時期 | あり | あり | 目安到来 | 見直しの準備 | review_window |
| Cさん | 観察確認 | あり | 古い/なし | 目安表示 | 観察の確認 | observation_wait |
| Dさん | 手順更新中 | あり | あり | 目安表示 | 手順の更新確認 | needs_action |
| Eさん | 未作成 | なし | なし可 | なし | 計画の作成 | needs_action |

KPI 期待値（上表から導出。ハードコード禁止）:

- 要確認 = `needs_action` 行数 = **2**（Dさん + Eさん）
- 見直し時期 = `review_window` 行数 = **1**（Bさん）
- 観察待ち = `observation_wait` 行数 = **1**（Cさん）

計画スケッチの 1/1/1 は導出誤り。件数は常に fixture 行から数える。
今日やること: 要対応が空でない行（B/C/D/E）。

shell fixture は `src/domain` を import しない。
未作成行を domain `SupportPlan` として捏造しない。
Aさん identity は既存 `synthetic-plan-001` / v3 を再利用する。

## Navigation

```text
詳細を見る → 既存 SupportPlan（Aさん、UserDetail を飛ばし 1 操作）
詳細を見る → temporary synthetic detail（B/C/D。詳細完成は OUT）
新規作成 → demo-only 入口（disabled + 作成・保存は接続されていません）
```

## Acceptance（Visual Decision をそのまま使う）

```text
現在対応すべき利用者が分かる
現在使用中のVersionが分かる
最終観察日が分かる
見直し時期が分かる
未作成が分かる
詳細へ1操作
新規作成入口が分かる
状態と要対応が分離
承認状態を勝手に追加していない
90日失効として扱っていない
色だけで意味を伝えていない
200%でも主要情報へ到達できる
```

## Gate

```text
SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 = SCOPE FROZEN

This freeze does NOT authorize:
  Implementation Start
  code / SCSS mutation until IMPLEMENTATION START GO
  Ready / Merge
  LIVE WRITE / Deploy
  Issue mutation
```
