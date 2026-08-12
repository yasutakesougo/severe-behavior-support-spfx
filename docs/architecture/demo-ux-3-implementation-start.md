# DEMO-UX-3 — Implementation Start

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-3 — User detail presentation
Status: Implementation Start AUTHORIZED / implementation in progress
Human Selection: SELECTED / LOCKED（Issue #299 comment 5265051876）
Human Implementation Start: GO（Issue #299 comment 5265139174 / 2026-08-12）
Baseline main: 76b5fffe727dada2f708e9e7a67d566d8845059c
Branch: chatgpt/demo-ux-3-user-detail
#299 Close: NOT AUTHORIZED
#28 Close: NOT AUTHORIZED
SharePoint / Entra mutation: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
```

## Authority

Issue #299 の Human Selection は slice 境界だけを固定する。

今回の Human instruction `つぎ` を、直前に提示された `DEMO-UX-3 Implementation Start GO` への承認として記録した。

Implementation Start は、支援計画・記録・評価の live 実装や業務データ接続を認可しない。

## Authorized IN

```text
利用者詳細の presentation-only skeleton
完全合成データ / props / fixture のみ
DEMO-UX-2 利用者一覧からの synthetic local preview
Aさんの合成詳細プレビュー
現在有効な支援を最初の主要領域として表示
支援計画 → 最近の記録 → 評価 → 履歴の情報順
制度・業務情報とシステム状態の表示分離
既存 primary navigation / fail-closed / site selection / skip link の維持
keyboard / focus / responsive / accessibility boundary の維持
fixture-driven unit tests
implementation-specific documentation
```

## Explicit OUT

```text
SharePoint REST / binder / adapter live I/O
Entra / Graph / membership mutation
実利用者データ
live user detail route / deep link
支援計画の作成・編集・保存
記録の作成・編集・保存
評価の作成・編集・保存
auth / token / role judgment
Production deploy
Issue #299 Close
Issue #28 Close
Ready / Merge auto-progress
unrelated refactor
```

## Presentation navigation boundary

DEMO-UX-2 では詳細ボタンを fail-closed で無効化していた。

DEMO-UX-3 では、責任者が一覧から詳細までの見え方を確認できるよう、`Aさん` だけ synthetic local preview を有効化する。

この画面遷移は `AppShellChrome` 内の React state だけで行う。

URL、SharePoint item ID、adapter、REST、業務データ、認可判定には接続しない。

```text
syntheticUserDetailNavigationAuthorized = true
liveUserDetailNavigationAuthorized = false
liveUsersDataAuthorized = false
sharePointRestAuthorized = false
binderHostWiringAuthorized = false
adapterFetchAuthorized = false
authJudgmentAuthorized = false
planMutationAuthorized = false
recordMutationAuthorized = false
evaluationMutationAuthorized = false
```

## Design alignment

`dashboard-design-v1.md` の利用者詳細 low-fidelity prototype を入力とする。

表示優先順は次のとおりとする。

1. 現在有効な支援
2. 支援計画
3. 最近の記録
4. 評価
5. 履歴

`制度・業務情報` と `システム状態` は別領域で表示する。

## Verification state

```text
Unit test source: added
Browser smoke: NOT RUN in this ChatGPT connector session
Heft build / test: NOT RUN locally
Reason: local execution environment has no GitHub network checkout
CI: evaluate after Draft PR creation
```

未実行の検証を PASS として扱わない。

## Stop / HOLD

```text
Do not Ready / Merge automatically
Do not Close #299 / #28
Do not enable live I/O / REST / binder wiring
Do not implement plan / record / evaluation mutation
STOP at Draft PR for CI and review
```
