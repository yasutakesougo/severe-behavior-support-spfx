# implementation-review

## Summary
- 判定: HOLD（Implementation Gate） / PASS（Independent Scope Review）
- Gate: Independent Scope Review は通過。Implementation Gate は Human Start GO 待ちのため HOLD
- 着手可否: 実装不可。Human UI Copy Correction Start GO — SIMPLIFICATION-2 待ち
- 対象: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
- 正本: `sbs-mgmt-plan-activation-c-next-version-copy-simplification-2-scope.md`

## Checklist
- 要件: PASS — 適用後⑥が長いことに加え、版4/版4 の表示不整合がある。T1–T5 機能理解は PASS
- DEC: PASS — D5=B / D6=A は残す。統合は別 scope。conceptualNextVersion 再計算はしない
- 設計: PASS — Human 確定コピーが Scope 正本。Ponytail PASS
- Contracts: NOT APPLICABLE — presentation copy。session / CAS / schema 非変更
- Issue 分割: PASS — #583 / 本 unit のみ
- PR 境界: PASS — 本 PR は docs。実装 PR は GO 後。Apply / version transition なし
- テスト計画: PASS — B12 afterApply selector 保持 + 不整合行の非表示 + 短文2行
- HOLD 明示: PASS — Human Ready GO HOLD。実装 GO 未受領
- 対象外: PASS — Apply / version transition / session / CAS / schema / SharePoint / Deploy / LIVE WRITE / D5/D6 短縮 / 版5計算

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P2 | OPEN | Apply 後 next-version-number が 現行4 / 次版4 | `liveCurrentVersion` は Apply 後 4。`conceptualNextVersion` は fixture presentation のまま 4。現在版が 4 なら次版は本来 5 | Apply 後に行を出さない。計算ロジックは増やさない（IN） |
| F-002 | P2 | OPEN | ⑥主画面に actor/ISO（planning-pc-synthetic-staff / timestamp） | receipt 行。職員主画面の密度が高く、T1–T5 に未使用 | 主表示から降格し selector は保持（IN / 降格候補） |
| F-003 | P2 | OPEN | 適用後も「次の版の考え方」＋長文2ノートが区間 A 常時描画 | `nextVersionBlock` が activationReceipt でも区間 A を出す | 適用後のみ削除し短文2行へ畳む（IN） |

P0/P1 なし。機能欠陥ではない。F-001 は誤認を招く表示不整合であり、長さ問題に還元しない。

## HOLD
- Human UI Copy Correction Start GO — SIMPLIFICATION-2 = NOT RECEIVED
- Human Ready GO = HOLD（copy correction 前）
- D5/D6 1行統合 = 別 unit
- conceptualNextVersion 再計算 = OUT

## Approvals
- 必要な承認: Human UI Copy Correction Start GO — SIMPLIFICATION-2
- 承認状態: 未受領
- Ponytail: PASS（実装許可ではない）

## Next Actions
1. Human UI Copy Correction Start GO — SIMPLIFICATION-2
2. GO 後のみ実装（適用後⑥分岐: 不整合行非表示、長文削除、短文2行、現在版/過去版主情報、receipt 降格）
3. 実装後も T1–T5 機能は再採点せず、copy 到達だけ確認
4. Ready / Merge / Deploy / LIVE WRITE は行わない
