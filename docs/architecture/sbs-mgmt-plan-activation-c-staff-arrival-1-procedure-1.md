# SBS-MGMT-PLAN-ACTIVATION-C-STAFF-ARRIVAL-1 — 手動確認手順

```text
PRODUCT UNDER TEST = #584 @ 5437e64703db055eef2bf230f5a682cf0286dc1a
VERIFICATION HARNESS = this branch / exact verification HEAD (after fixation)
LIVE WRITE = false
```

## 起動

verification harness ブランチを checkout する。#584 product ファイルは `5437e64` と同一のまま。

```bash
npm ci
cd spfx && npm ci && cd ..
npm install esbuild sass --no-save
node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
```

`serve-smoke` は起動のたびに **この HEAD** の `smoke-entry.tsx` を作り直す。

## Staff Apply 前（使う URL）

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER&staffPlanTransition=beforeApply
```

到着マーカー（ページ最上部に固定）: `data-sbs-mgmt-plan-activation-c-staff-check="ready"`

ブラウザタブ: `【適用待機】版 4 を適用開始する`

その後 ⑤⑥ に:

```text
⑤ 見直し結果: 変更が必要
⑥ 版 4 は下書きです。まだ適用開始されていません。
⑥ [版 4 を適用開始する]
```

query だけでは足りない。`destination=users` が必要。harness が公開 #584 DOM を駆動する。

## ARRIVAL GATE（先に判定）

```text
[ ] 緑の確認バナーがある
[ ] タブに【適用待機】がある
[ ] ⑤ が「変更が必要」
[ ] ⑥ に版4下書きの説明がある
[ ] 「版 4 を適用開始する」がある
```

```text
5項目すべて YES
→ T1–T5 START

1つでも NO
→ HOLD
→ T1–T5 NOT SCORED
```

環境到着失敗を「職員が操作を理解できなかった」と誤分類しないため、質問や操作評価より先にこの gate を判定する。

## この画面なら未到着（T3–T5 を採点しない）

```text
⑤ 見直し結果: 変更なし
⑥ 現行は版 3（適用中）。次に重ねる概念上の版は 4 です。
⑥ [次の版を作る（表示専用）]
⑥ [版 4 を適用開始する] が無い
タブが【適用待機】ではない / 緑の固定バナーが無い
```

これは empty / NO_CHANGE session。`次の版を作る（表示専用）` は Apply の代替ではない。`変更なし` のままでは Activation-C のテスト開始条件を満たさないため、Apply 欠落として #584 を採点しない。

対処:

```text
1. verification harness ブランチを checkout
2. 古い :4194 を止める
3. この HEAD で serve-smoke を起動（起動時に bundle を作り直す）
4. 上の Staff URL を全文で開く（hard refresh）
5. 緑バナー + 変更が必要 + Apply を確認してから T1–T5
```

## Cold / 回帰（Apply が出てはいけない）

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER
```

利用者 A の計画を開いても Draft / Apply は未マウント。

## 使わないもの

```text
#584 product HEAD の変更
heft start / workbench に query だけ付ける
古い smoke-bundle.js を使い回す
PR #586 SupportPlan props 経路
```
