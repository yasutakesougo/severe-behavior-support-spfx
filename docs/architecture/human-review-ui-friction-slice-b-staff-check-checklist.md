# HUMAN-REVIEW-UI-FRICTION-SLICE-B — Real Staff Check Checklist

```text
Purpose: 1〜3名の実職員による synthetic 画面確認
Basis: merged Slice B (PR #538 / HEAD 95dff40…)
Prerequisite: Agent Simulation Post-Merge Value Check = PASS (simulation only)
Authority needed to CLOSE friction work: Human GO after staff results
Deploy / LIVE WRITE / SharePoint mutation: NOT AUTHORIZED by this checklist
```

## Before the session

- Use synthetic demo only（本番データ・SharePoint WRITE 不要）
- Prefer Planning PC / staff-facing harness that shows:
  - 期間モニタリング（概要）
  - 見直し資料（`#human-review-materials`）
- Prepare cases: **計画版3（1件）**, **計画版2（3件・sceneLabelなし）**, **計画版1（0件）**

## Ask each staff member（keep short）

1. これは誰の・どの計画版・どの期間の資料だと分かりますか？
2. 「期間モニタリング（概要）」と「見直し資料」の違いは分かりますか？
3. 「活動の切り替え場面（食堂→作業）」を見て、どんな支援かイメージできますか？
4. 0件のとき、「実施できなかった」と同じだと思いますか？（期待: いいえ）
5. 概要から見直し資料へ迷わず行けましたか？
6. 分かりにくい／不要／足りない情報はありますか？

## Record only

```text
PASS     → UI Friction 改善 CLOSE 候補（Human GO）
PARTIAL  → 迷った箇所だけ記録。必要なら限定 Slice
HOLD     → 実画面到達失敗・手順不足など。実装変更を急がない
```

## Explicitly do not do in this check

- Slice C の先行実装
- 本番データ確認
- Deploy / App Catalog / LIVE WRITE
- シミュレーション結果だけで Issue Close
