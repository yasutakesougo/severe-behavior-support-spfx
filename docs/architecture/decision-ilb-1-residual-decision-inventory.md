# Decision-ILB-1 — 残存 Decision read-only 棚卸し

この文書は、**Decision-ILB-1** のための
残存 substantive Decision 候補の **read-only 棚卸し** である。

分類（A〜E）は **provisional** であり、Accepted ではない。
既存 Accepted Decision は再 Decision しない。
制度根拠が確認できない事項は **NOT CONFIRMED** として停止する。

Decision packet: [`decision-ilb-1-institutional-local-boundary-decision-packet.md`](./decision-ilb-1-institutional-local-boundary-decision-packet.md)

```text
Status: READ-ONLY INVENTORY / ROW CLASSIFICATIONS NOT ACCEPTED
Human Policy 1–6: ACCEPTED / FINAL CONSISTENT（decision-ilb-1-human-policy-acceptance.md）
  → 分類・判断の正本方針のみ Accepted
  → 本表の provisional 行は自動 Accepted しない
Consistency: decision-ilb-1-canonicalization-consistency-check.md
main baseline: e2bd25667b23274270755bbd42866e73c501f09d
PR #151: MERGED（e2bd256… / head 4f5a833…）
First residual Decision selection: OPEN / NOT SELECTED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

## 1. Classification legend（provisional）

| Code | Meaning |
|---|---|
| A | 制度上必須（候補） |
| B | 法人として Human Decision が必要（候補） |
| C | 制度上固定されず現場裁量候補 |
| D | application に埋め込まない候補 |
| E | 根拠不足 / 要追加確認（NOT CONFIRMED） |

## 2. Residual Decision table

| ID | 何を決めようとしているか | 制度根拠が必要か | repo に制度根拠があるか | 法人ローカルになり得るか | 現場裁量の余地 | Human Decision 要否 | Provisional class |
|---|---|---|---|---|---|---|---|
| **GOV-AUD-05** | 物理削除方針 | はい（個人情報・監査・保存との関係） | 所有表のみ。物理削除必須/禁止の一次根拠は未固定 | はい（運用方針） | 低（安全性・監査と衝突しうる） | **要**（採択するなら明示） | **E**（自動開始禁止） |
| **DEC-012** | 論理削除データの完全削除方針 | はい | 所有表のみ | はい | 低 | 要（GOV-AUD-05 と分離維持） | **E** |
| **Decision-RD-3** | 見直し接近窓・期限算出・超過後 | 部分（cadence は Accepted だが窓日数は別） | GOV-RULE-06 source review: 90日必須 **NOT CONFIRMED**；08 = NOT ADOPTED | はい（接近通知の運用） | 中（ただし hard overdue と混同禁止） | 要（開始するなら明示）。08 を開始信号にしない | **E** / 開始は Human 明示時のみ |
| **Decision-AS-EC-1** | AssessmentSnapshot 完全契約 Entry Criteria | 部分（業務保存・監査） | Entry 表あり。DEC-009 行は「未」、他 docs は Human-attested Accepted と記載 — **同期 NOT CONFIRMED** | はい（Entry 充足宣言） | 低 | 要（Entry 充足の記録） | **E**（再 Decision ではなく整合確認が先） |
| **DEC-009** | Snapshot 保存タイミング | 業務上必要になり得る | 台帳行あり。Accepted 証跡の docs 同期が不一致 | はい | 中 | 要（再 Decision ではなく証跡同期 / 明示） | **E**（OUT for casual re-decision） |
| **DEC-015** | バックアップ・復元責任者 | 運用・監査 | 所有表のみ | はい | 低〜中 | 要 | **E** |
| **DEC-6** | SharePoint 列変換 | 技術/adapter | adapter Entry 前提 | 技術契約寄り | N/A | Adapter Entry + Human GO | **D** 候補（業務ルール発明ではない） |
| **FindingCode / A-5** | catalog 値・representation | 業務カタログ | DEC-019 EMPTY Accepted | はい（値を作るなら） | なし（発明禁止） | 現状 **HOLD / DO NOT CREATE** | **D**（再開しない） |
| **GOV-AUD-03/04** | 訂正承認 / 論理削除ロール | — | Accepted / Option E | — | — | **再 Decision しない** | closed |
| **DEC-008** | 作成者 / 最終承認 / 提出差戻し | — | Accepted / LOCKED | — | — | **再 Decision しない** | closed |
| **GOV-RULE-05〜08 / OP-3** | 見直し・観察 Schema | — | Accepted | — | — | **再 Decision しない** | closed |

## 3. Local-rule candidates（provisional・未 Accepted）

「制度必須と確認できないが、アプリに入れたくなりやすい」候補。

| Candidate | Why it looks local | Risk if embedded without evidence | Provisional |
|---|---|---|---|
| hard due / overdue（GOV-RULE-08） | 便利な期限表示 | 制度根拠なく違反扱い化しうる | **D**（現行 NOT ADOPTED 維持） |
| 接近窓の固定日数（RD-3） | 通知 UX | 90日等の発明に degenerate しうる | **E** |
| 物理削除の自動実行（GOV-AUD-05） | ストレージ整理 | 監査・保存義務と衝突しうる | **E** / 原則 D 寄り |
| 提出・差戻しロール Binding | ワークフロー完成度 | DEC-008 Option C と矛盾 | **D**（Accepted 維持） |
| FindingCode 値の仮埋め | 画面表示 | DEC-019 EMPTY と矛盾 | **D**（HOLD） |

## 4. NOT CONFIRMED items

| Item | Why NOT CONFIRMED | Action |
|---|---|---|
| 生活介護「少なくとも6か月に1回以上見直し」を、本アプリの HARD GATE として GOV-RULE-06（3ヶ月に1回程度）へ統合すべきか | 外部一次資料候補（例: 生活介護計画の確認項目 PDF）と、repo 正本の GOV-RULE-06（強度行動障害支援の practice cadence）は論点が異なり、統合結論を本 Work Order で確定できない | 分類 E。Human Policy Accepted 後に別問いへ |
| DEC-009 が Accepted か未か | AS-EC-1 表は「未」、一部 packet は Human-attested Accepted | 証跡同期を Human 確認。再 Decision しない |
| GOV-AUD-05 の制度上の必須形 | 所有表以外の一次根拠が repo に未固定 | 自動 Accepted 禁止 |
| RD-3 接近窓の全国一律日数 | GOV-RULE-06 source review で 90日必須は否定的 | 日数発明禁止 |
| 「現場裁量」へ自動落下してよいか | 安全性・算定・監査との衝突未確認 | Decision rule 遵守。自動 C 分類禁止 |

## 5. Institutional evidence note（repo-first）

| Source in repo | Use |
|---|---|
| [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md) | 「3ヶ月に1回程度」≠90日。Accepted cadence の根拠整理 |
| DEC-008 / GOV-AUD-03/04 Acceptances | 制度根拠未確認ロールを app に埋め込まない先例 |
| OP-3 Acceptance | 制度日数の domain 埋め込み NOT ADOPTED |

外部一次情報（検索で到達した候補。本 inventory では要件として Accepted しない）:

- 厚労省系 PDF（生活介護計画の確認項目・ガイドライン案等）への参照は、Human Policy Accepted 後の個別確認で行う。
- 本 Work Order では外部要約を制度正本にしない。

## 6. Explicit non-actions

```text
Do NOT:
  Accept individual A/B/C/D/E rows from this inventory alone
    （Human Policy Accepted 後も一件ずつ判定）
  Auto-start / auto-Accept GOV-AUD-05 or Decision-RD-3
  Re-decide Accepted Decisions
  Invent FindingCode / days / roles / approvers / notice rules
  Implementation Start
```

## 7. Next after Human Policy FINAL CONSISTENT

```text
Order:
  1. Human Policy Accepted / FINAL CONSISTENT（DONE / PR #151）
  2. 制度根拠確認
  3. 個別 Decision を一件ずつ Human 選定・判定
First residual Decision: NOT SELECTED
  → decision-ilb-1-next-residual-decision-selection-packet.md
FindingCode / A-5 / Implementation: HOLD
```
