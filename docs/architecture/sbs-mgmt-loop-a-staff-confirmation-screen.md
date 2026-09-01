# SBS-MGMT-LOOP-A — Staff 確認用画面

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-A (#552)
kind: staff confirmation screen / Actual Staff Value Check setup
product basis HEAD: bfa7eaa2821197d68c284735ce5a6b355c3e5687
evidence/docs tip: e6a9b75
presentationOnly: true
LIVE WRITE / Deploy / SharePoint: NOT AUTHORIZED
Simulation substitute: FORBIDDEN
Human Ready GO: NOT RECEIVED
```

## 起動方法（Human staff session）

```bash
# 1. product basis で checkout
git checkout bfa7eaa2821197d68c284735ce5a6b355c3e5687

# 2. 依存（初回のみ）
npm ci
cd spfx && npm ci && cd ..

# 3. smoke ビルド + 確認用サーバー
node spfx/smoke/sbs-mgmt-loop-a-review-completion/run-smoke.mjs
cd spfx/smoke/sbs-mgmt-loop-a-review-completion
python3 -m http.server 8765
```

ブラウザで開く:

```text
http://localhost:8765/index.html
```

画面上部の `snapshot A` / `snapshot B` / `snapshot ZERO` で資料切替。
**合成データのみ。本番には保存されません。**

## 確認対象 UI（#552 新規）

| 要素 | 画面上の表示 |
|---|---|
| 見直し結果 | `変更なし` / `変更が必要` ボタン |
| 判断理由 | ラベル `判断理由` — 「変更が必要」の場合は必須 |
| 補足メモ | ラベル `見直しの補足メモ（任意）` — 任意 |
| 境界表示 | `本番には保存されていません` |
| 計画版 | `次の計画版はまだ作成されていません`（capture 後） |

## Staff 質問（Scope S14）

| # | 質問 | 確認手順 |
|---|---|---|
| Q1 | 誰の・どの期間の見直しか分かるか | snapshot A 初期表示 — `Aさん` `計画版 3` `2026/08/01〜2026/08/31` |
| Q2 | 変更なし / 変更が必要の意味が分かるか | 未判断状態で両ボタンが有効であること |
| Q3 | 判断理由をどこへ書くか分かるか | `判断理由` 入力欄と helper 文言 |
| Q4 | 判断理由と補足メモの違いが分かるか | capture 後 readback: `判断理由:` と `補足メモ:` が別行 |
| Q5 | この操作だけで次の計画版が作られないと分かるか | capture 後 `次の計画版はまだ作成されていません` |

## 確認用スクリーンショット（1280×900 / 390×844）

Artifact パス: `/opt/cursor/artifacts/sbs-mgmt-loop-a-staff-confirmation-screen/`

| ファイル | 用途 |
|---|---|
| `desktop-1280x900-01-undecided.png` | Q1–Q3 初期状態 |
| `desktop-1280x900-02-blank-reason-blocked.png` | 判断理由未入力ブロック |
| `desktop-1280x900-03-captured-with-reason.png` | Q4 理由/メモ readback + Q5 計画版未作成 |
| `desktop-1280x900-04-zero-record.png` | 0件時の事実表示 |
| `mobile-390x844-01-undecided.png` | モバイル Q1–Q3 |
| `mobile-390x844-03-captured-with-reason.png` | モバイル capture 後 |

## Gate

```text
この画面 = Human staff session 用確認 surface（rendered proxy ではない）
Actual Staff Value Check = HOLD / AWAITING REAL STAFF
Human Ready GO = NOT RECEIVED
Agent は staff 回答を代行しない
```
