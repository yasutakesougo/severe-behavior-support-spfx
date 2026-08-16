# severe-behavior-cycle-review sample

対象例: FIELD-WORKFLOW UI 合成スモーク（live SharePoint なし）。架空の「Aさん」。

## CYCLE
- 導線: PASS（利用者詳細 → 現在の支援手順 → この手順を記録 → 戻る）
- 永続保存: NOT ASSESSED（合成保存のみ。SharePoint / adapter 書き込みは無効）
- 週次観察の追跡: NOT ASSESSED（観察履歴 UI をこのハーネスで確認していない）
- 見直しへの閉ループ: PARTIAL（Review 材料の表示はある。自動「変更すべき」判定はしていない。週次観察からの戻りは未確認）
- P0: なし（合成ハーネス上。ライブ保存不能は P0-5 にしない）

## SCORE
- in-scope assessed only: 例 55 / 100（導線・結果三値・fail-closed を PARTIAL/PASS として計上。永続保存・週次観察は分母から除外）
- excluded: OUT OF SCOPE 12, NOT ASSESSED 8, NOT SPECIFIED 4

読み方: 「55点だから危険」ではない。
使える結論は CYCLE 行である。

```text
支援手順→実施結果の導線は PASS。
ただし永続保存は NOT ASSESSED。
週次観察→見直しへの閉ループは NOT ASSESSED（Review 材料表示は PARTIAL）。
```

## Summary
- 判定: HOLD
- 対象: 合成スモーク / FIELD-WORKFLOW UI
- 根拠: 導線の UI_PATH はある。LIVE_PERSISTENCE 証跡がないためサイクル完走を PASS にできない。サイクル P0 はライブ経路欠如としては未該当

## Domain scores（例）

| 領域 | 判定の要約 | 点 |
|---|---|---|
| 1 アセスメントと支援計画 | PARTIAL（計画表示はある。アセスメントからの結線は薄い） | 10 / 20 |
| 2 支援計画シート等 | PARTIAL（期間・作成者ラベルの合成表示。mutation は表示専用） | 10 / 20 |
| 3 支援手順と現場実践 | PASS（場面→実施→避ける、文脈引き継ぎ） | 20 / 20 |
| 4 実施記録 | PARTIAL（三値と performedAt はある。永続保存は NOT ASSESSED のため領域点は導線分のみ） | 10 / 20 |
| 5 観察・評価・見直し | NOT ASSESSED が中心（分母から一部除外） | — |
| 6 支援安全性・UX | PARTIAL（未認証・取得失敗は問題なしと出さない。色以外の状態ラベルあり） | 2.5 / 5 |

OUT OF SCOPE の例（減点しない）: 国保連、家族ポータル、医療機関ログイン、バックアップ管理 UI、身体拘束記録、一般の個別支援計画全機能。

UNKNOWN / 確認不能は FAIL にしない。本サンプルの永続保存と週次観察は NOT ASSESSED。

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P2 | OPEN | 日次記録タブは自由記述スケルトンで、ProcedureRecord の正本ではない | UI_PATH | 現場導線の正本を手順記録側に固定する |
| F-002 | P1 | OPEN | ライブ永続化をこのハーネスでは実証できない | SYNTHETIC_SAVE | 許可された検証環境での LIVE_PERSISTENCE 試験を別途 |

## HOLD
- ライブテナントでの保存・再表示
- 週次観察履歴の実操作
- 管理者 / サービス管理責任者ロールでの差分

## Approvals
- 必要な承認: ライブ保存試験を行う場合の Human GO
- 承認状態: 本サンプルでは未取得（試験未実施）

## Next Actions
1. 合成導線（手順→結果三値）を回帰対象として維持する
2. 永続保存は別ハーネス / Human GO 付き検証で NOT ASSESSED を解消する
3. 生活介護総合監査プロンプトでは再採点しない
