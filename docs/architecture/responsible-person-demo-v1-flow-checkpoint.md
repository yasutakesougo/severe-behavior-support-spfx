# RESPONSIBLE-PERSON-DEMO-V1 — Flow improvement checkpoint

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Kind: Checkpoint / handoff（docs-only）
Status: FLOW SLICES COMPLETE / NEXT HUMAN CHOICE
main SHA: 9dd43e285c09218531260ffb565cf906b2b09574
Expected tip in last merge: 2000b85f6911940d44720a2e559c76ee615354d3
Date: 2026-08-12
Deploy / SharePoint write / #299 Close: NOT AUTHORIZED
```

## CURRENT

一連のデモ導線改善は一区切り。

| feedbackId | slice | PR | Merge | Status |
|---|---|---|---|---|
| RPF-Q01 | DEMO-UX-7 | #320 | 5655fc7 | MERGED / COMPLETE |
| RPF-001 | DEMO-UX-7 | #320 | 5655fc7 | MERGED / COMPLETE |
| RPF-003 | DEMO-UX-8 | #321 | aed5b05 | MERGED / COMPLETE |
| RPF-002 | DEMO-UX-9 | #322 | 9dd43e2 | MERGED / COMPLETE |

説明できる導線（合成デモ）:

```text
朝ここを開く
  → Overview で 要確認 / 未記録 / 期限接近 を見る
  → 今日やること A/B/C で記録 / 見直し / 詳細へ進む
  → 利用者一覧で状態フィルタ（すべて/要確認/未記録/期限接近）
  → 記録画面で未完了選択 → 入力イメージ（local draft、実保存なし）
```

維持されている安全境界:

```text
fail-closed（access_denied / retrieval_failed）
事業所未選択停止
保存結果不明を成功/失敗へ丸めない
synthetic / no live SharePoint 明示
実保存なし（作成/保存 disabled）
```

## GATE

```text
Flow P1 queue（RPF-Q01/001/003/002）= COMPLETE
Next = Human choice（no auto-advance）
#299 Close = HOLD / NOT AUTHORIZED
Deploy = NOT AUTHORIZED
SharePoint write = NOT AUTHORIZED
```

## Remaining P2 backlog（候補整理）

実装 Selection は未実施。優先は Human 判断。

### A. Flow-review deferred（業務見え方）

| ID | Surface | Requested outcome | Notes |
|---|---|---|---|
| RPF-004 | cross-cutting | DEMO注記を集約し業務情報を前面へ | 大規模リデザインに広げないこと |
| RPF-005 | cross-cutting | 保存バッジは異常時のみ強調 | ready 閲覧時は控えめ |
| RPF-006 | review-status | Overview KPI と見直し件数の対応を明示 | 同一集合か別定義かを表示で説明 |
| RPF-007 | cross-cutting | 保存中の可観測性（進行/一時停止） | 元レビューは P3 寄り |

### B. Carry-over non-blocking findings（技術/範囲）

| ID | Origin | Note | Suggested disposition |
|---|---|---|---|
| DUX7-P2-1 | DEMO-UX-7 | 一覧詳細プレビューは A のみ（C は Overview 導線） | accept as-is / or small later slice |
| DUX7-P2-2 | DEMO-UX-7 | internal id `deadline_near` vs 表示「期限接近」 | rename later / accept as-is |
| DUX8-P2-1 | DEMO-UX-8 | smoke が today-action A のみ再確認 | evidence gap only; code paths intact |

### C. Open questions（再確認候補）

| ID | Question | Why it matters now |
|---|---|---|
| RPF-Q02 | 詳細→支援計画を責任者再確認の必須経路にするか | #299 完了判断の抜け漏れ防止 |
| RPF-Q03 | 異常時に primary nav を残す方針は意図どおりか | fail-closed 解釈 |

## ALLOWED next（Human が選ぶ）

1. **責任者向け再画面確認**（推奨）
   - main `@ 9dd43e2` の合成デモを一周
   - 特に: Overview A/B/C、Users フィルタ、Records 未完了→入力イメージ、fail-closed
   - 必要なら Aさん詳細→支援計画（RPF-Q02）も見る
2. **P2 Selection を1件だけ切る**
   - 候補の第一候補: RPF-004（注記集約）または RPF-006（KPI対応明示）
   - Selection GO なしで Implementation に入らない
3. **#299 Close 判定の準備**（Close 自体は別 GO）
   - 再確認結果 + P2 accept/defer 一覧を揃えてから Human Close Decision

## FORBIDDEN（現状）

```text
Deploy
SharePoint write / Entra mutation
#299 Close
Implementation Start without Selection
Ready/Merge auto-advance for unselected P2 work
実データ / live I/O 前提の確認
```

## NEXT（推奨）

Human に次のどちらかを選んでもらう。

```text
Option 1: Responsible-person re-review on current main（read-only / synthetic）
Option 2: Select one P2（prefer RPF-004 or RPF-006）as next Selection packet
```

Agent は Option 選択まで mutation を開始しない。
