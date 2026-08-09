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
First residual Decision: SELECTED / C — Decision-RD-3（Accepted / LOCKED）
Fourth residual Decision: SELECTED / A — AS-EC-1 Entry #8（Accepted / LOCKED / FINAL CONSISTENT）
Fifth residual Decision: SELECTED / A — AS-EC-1 Entry #2（Accepted / LOCKED / PASS·MET / PR-J）
Sixth residual Decision: SELECTED / A — AS-EC-1 Entry #5（Accepted / LOCKED / PASS·MET / findingIds NOT REQUIRED）
Seventh residual Decision: SELECTED / A — AS-EC-1 Entry #6（Accepted / LOCKED / PASS·MET / NOT_APPLICABLE HOLD方針）
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
| **GOV-AUD-05** | 物理削除方針 | はい（個人情報・監査・保存との関係） | Decision-AUD-RET-1（最低5年）+ 本 Acceptance | — | — | **Accepted / LOCKED（Option A）** のうち **保存期間中の完全削除禁止**（[`decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`](./decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md)）。自動物理削除 **NOT ADOPTED**。経過後の可否は別 Decision | **partial closed**（post-retention OPEN） |
| **DEC-012** | 論理削除データの完全削除方針 | はい | 同上 | — | — | **Accepted / LOCKED（Option A）** のうち **保存期間中の完全削除禁止**（GOV-AUD-05 と同一 Acceptance）。経過後の可否は別 Decision | **partial closed**（post-retention OPEN） |
| **Decision-RD-3** | 見直し接近窓・期限算出・超過後 | 部分（cadence は Accepted だが窓日数は別） | GOV-RULE-06 Accepted；08 = NOT ADOPTED | — | — | **Accepted / LOCKED**（[`decision-rd-3-monitoring-guidance-acceptance.md`](./decision-rd-3-monitoring-guidance-acceptance.md)）。informational only。期限超過・警告・業務制限・90日・hard due **NOT ADOPTED** | **closed** |
| **Decision-AS-EC-1** | AssessmentSnapshot 完全契約 Entry Criteria | 部分（業務保存・監査） | Entry #1 PASS / #2 PASS·MET（PR-J） / #3 DEC-009 Accepted / #4 GOV-AUD-03 / #5 PASS·MET（findingIds NOT REQUIRED） / #6 PASS·MET（NOT_APPLICABLE HOLD方針） / #8 plan FINAL CONSISTENT；#7 未 | はい（Entry 充足宣言） | 低 | overall Entry satisfied は別 Human 記録。Entry #6 正本 [`decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md`](./decision-as-ec-1-entry-6-not-applicable-reason-acceptance.md)。第七 residual CONSUMED | **E**（overall HOLD） |
| **DEC-009** | Snapshot 保存タイミング | 業務上必要になり得る | Human Acceptance LOCKED | — | — | **Accepted / LOCKED / Option A / FINAL CONSISTENT**（[`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md) / [`decision-dec-009-canonicalization-consistency-check.md`](./decision-dec-009-canonicalization-consistency-check.md)）。下書き / 確定時保存 / 元保持＋新版 / 上書き NOT ADOPTED / 履歴保持 | **closed** |
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
| 接近窓の固定日数（RD-3） | 通知 UX | 90日等の発明に degenerate しうる | **D**（RD-3 Accepted: 90日固定 NOT ADOPTED） |
| 物理削除の自動実行（GOV-AUD-05） | ストレージ整理 | 監査・保存義務と衝突しうる | **D**（Accepted: 自動実行 NOT ADOPTED） |
| 提出・差戻しロール Binding | ワークフロー完成度 | DEC-008 Option C と矛盾 | **D**（Accepted 維持） |
| FindingCode 値の仮埋め | 画面表示 | DEC-019 EMPTY と矛盾 | **D**（HOLD） |

## 4. NOT CONFIRMED items

| Item | Why NOT CONFIRMED | Action |
|---|---|---|
| 生活介護「少なくとも6か月に1回以上見直し」を、本アプリの HARD GATE として GOV-RULE-06（3ヶ月に1回程度）へ統合すべきか | 外部一次資料候補（例: 生活介護計画の確認項目 PDF）と、repo 正本の GOV-RULE-06（強度行動障害支援の practice cadence）は論点が異なり、統合結論を本 Work Order で確定できない | 分類 E。Human Policy Accepted 後に別問いへ |
| DEC-009 保存タイミングの実装細部（物理キー / Schema） | Acceptance は業務意味のみ | Schema / storage は別 Entry。自動実装禁止 |
| 5年経過後の完全削除・物理削除の可否 | 本 Acceptance は保存期間中禁止のみを閉じた | 別 Human Decision（OPEN）。自動開始禁止 |
| RD-3 接近窓の全国一律日数 | Decision-RD-3 Accepted: 90日固定 NOT ADOPTED | 再開しない（新 Human Decision が必要） |
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
  Auto-start post-retention deletion Decision
  Re-decide Accepted Decisions（含む Decision-RD-3 / retention prohibition）
  Invent FindingCode / days / roles / approvers / notice rules
  Implementation Start
```

## 7. Next after RD-3 / retention prohibition / DEC-009 / Entry #8 / Entry #2

```text
Order:
  1. Human Policy Accepted / FINAL CONSISTENT（DONE）
  2. First residual: Decision-RD-3 FINAL CONSISTENT（DONE）
  3. Second residual: GOV-AUD-05 / DEC-012 retention prohibition Accepted / LOCKED（DONE）
  4. Third residual: DEC-009 save timing FINAL CONSISTENT（DONE）
  5. Fourth residual: AS-EC-1 Entry #8 technical plan FINAL CONSISTENT（DONE）
     + Entry #1/#2 read-only audit（#1 PASS；#2 was PARTIAL at audit）
  6. Fifth residual: AS-EC-1 Entry #2 ownership / PR-J PASS / MET（DONE / CONSUMED）
  7. Sixth residual: AS-EC-1 Entry #5 findingIds NOT REQUIRED PASS / MET（DONE / CONSUMED）
  8. Seventh residual: AS-EC-1 Entry #6 NOT_APPLICABLE HOLD方針 PASS / MET（DONE / CONSUMED）
  9. Next residual: NOT SELECTED（Human が一件選ぶまで自動開始しない）
     remaining examples: Entry #7 / overall / post-retention
     recommended next candidate（Human only）: Entry #7
FindingCode / A-5 / Implementation: HOLD
AS-EC-1 overall: HOLD
```
