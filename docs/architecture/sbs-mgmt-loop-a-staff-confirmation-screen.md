# SBS-MGMT-LOOP-A — Staff 確認用画面

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-LOOP-A (#552)
kind: staff confirmation screen / Actual Staff Value Check setup
product basis HEAD: 3b9222ce8798f5e1cae17f3fedd419267cea0edc
presentationOnly: true
LIVE WRITE / Deploy / SharePoint: NOT AUTHORIZED
Simulation substitute: FORBIDDEN
Human Ready GO: NOT RECEIVED / NOT ELIGIBLE
```

## 起動方法（Human staff session）

```bash
# 1. corrected product basis で checkout
git checkout 3b9222ce8798f5e1cae17f3fedd419267cea0edc

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

## 確認対象 UI（#552 corrected）

| 要素 | 画面上の表示 |
|---|---|
| 見直し結果 | `変更なし` / `変更が必要` ボタン（文言は pre-correction と同一） |
| 判断理由 | ラベル `判断理由` — 「変更が必要」の場合は必須（唯一の staff-facing 入力） |
| 補足メモ | **入力欄なし**（legacy readback のみ unit test で互換確認） |
| 境界表示 | `本番には保存されていません` |
| 計画版 | `次の計画版はまだ作成されていません`（capture 後） |

## Staff 質問（Scope S14）

| # | 質問 | 確認手順 |
|---|---|---|
| Q1 | 誰の・どの期間の見直しか分かるか | snapshot A 初期表示 — `Aさん` `計画版 3` `2026/08/01〜2026/08/31` |
| Q2 | 変更なし / 変更が必要の意味が分かるか | 未判断状態で両ボタンが有効；視覚区別（border / font weight） |
| Q3 | 判断理由をどこへ書くか分かるか | `判断理由` 入力欄と helper 文言 |
| Q4 | 判断理由のみ入力できること（補足メモ入力なし）が分かるか | 入力欄が `判断理由` のみ；`見直しの補足メモ（任意）` がない |
| Q5 | この操作だけで次の計画版が作られないと分かるか | capture 後 `次の計画版はまだ作成されていません` |

## 確認用スクリーンショット（1280×900 / 390×844）

Artifact パス: `/opt/cursor/artifacts/sbs-mgmt-loop-a-review-completion-browser-smoke/`

| ファイル | 用途 |
|---|---|
| `desktop-1280x900-01-undecided.png` | Q1–Q3 初期状態 |
| `desktop-1280x900-02-blank-reason-blocked.png` | 判断理由未入力ブロック |
| `desktop-1280x900-03-captured-with-reason.png` | Q4 理由 readback + Q5 計画版未作成 |
| `desktop-1280x900-04-zero-record.png` | 0件時の事実表示 |
| `mobile-390x844-01-undecided.png` | モバイル Q1–Q3 |
| `mobile-390x844-03-captured-with-reason.png` | モバイル capture 後 |

## Gate

```text
この画面 = Human staff session 用確認 surface（rendered proxy ではない）
Rendered Browser Acceptance @ 3b9222ce = PASS / VERIFIED
Actual Staff Value Check = HOLD / REQUIRED (Q2/Q4 priority)
Human Ready GO = NOT RECEIVED / NOT ELIGIBLE
Agent は staff 回答を代行しない
```
