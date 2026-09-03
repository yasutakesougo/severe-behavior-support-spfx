# SBS-MGMT-PLAN-ACTIVATION-C — Staff 確認用画面（Apply 前）

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-PLAN-ACTIVATION-C
tracking issue: #583
kind: local staff confirmation screen / Actual Staff Plan-Transition arrival
presentationOnly: true
LIVE WRITE / Deploy / SharePoint: NOT AUTHORIZED
Simulation substitute: FORBIDDEN
Human Ready GO: NOT RECEIVED / NOT ELIGIBLE
```

## 起動方法（手元）

リポジトリ根で、この確認画面を含むブランチを checkout する。

```bash
# 初回のみ（esbuild / sass が無いとき）
npm install esbuild sass --no-save

node spfx/smoke/sbs-mgmt-loop-b/serve-smoke.mjs
```

ブラウザで開く（Apply 直前。推奨）:

```text
http://127.0.0.1:4194/index.html?staffPlanTransition=beforeApply&presentationRole=PLANNER
```

合成データのみ。本番には保存されません。`Ctrl+C` でサーバ停止。

## この URL で見えるもの

入場時点で Definition の Before-Apply です。LOOP-B の「変更が必要」入力は不要です。

```text
現在適用中: 版3
版4 は下書きです。まだ適用開始されていません。
[版 4 を適用開始する]
```

画面は⑥ 次版準備へスクロールします。

## Staff 質問（Plan-Transition T1–T5）

| ID | 質問 | この画面での見方 |
|---|---|---|
| T1 | 今使っている計画は何版か | 版3・適用中 |
| T2 | 次の版はどの状態か | 版4・下書き・未適用 |
| T3 | 次の版を使い始めるために何が必要か | `版 4 を適用開始する` を押す |
| T4 | Apply 後、現在版が切り替わったか | 押したあと: 現在適用中 版4 |
| T5 | 旧版がどうなったか | 版3: 過去版 |

## 冷起動 URL（使わないでよい）

```text
http://127.0.0.1:4194/index.html?viewMode=ready&siteSelection=SITE-ISG&destination=users&presentationRole=PLANNER
```

こちらは Draft 未生成です。Apply は出ません。T3–T5 の確認には使わない。

## Gate

```text
この画面 = Human staff session 用確認 surface
Actual Staff Plan-Transition Check = HOLD until Human records T1–T5
Human Ready GO = NOT ELIGIBLE until that check
Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
Agent は staff 回答を代行しない
```
