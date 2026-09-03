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

到着マーカー: `data-sbs-mgmt-plan-activation-c-staff-check="ready"`

その後 ⑥ に:

```text
版 4 は下書きです。まだ適用開始されていません。
[版 4 を適用開始する]
```

query だけでは足りない。`destination=users` が必要。harness が公開 #584 DOM を駆動する。

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
