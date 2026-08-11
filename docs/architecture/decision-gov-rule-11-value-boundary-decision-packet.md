# Decision Packet — GOV-RULE-11 制度値と法人運用値の境界

この文書は、**GOV-RULE-11**（制度値と法人運用値の境界）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-RULE-09 / 10 の再 Decision ではない。
GOV-RULE-12（訂正）ではない。
Accepted（fill-in）ではない。
Agent が制度値・運用値・事業所設定の分類を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-rule-11-value-boundary-selection.md`](./decision-gov-rule-11-value-boundary-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-11
Kind: Human Decision packet（narrow / fill-in classification）
Status: OPEN / Fill-in NOT FILLED
Owner: Issue #19
Selected via: Decision-GOV-RULE-11-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし / 分類の発明禁止）
Human Fill-in: NOT FILLED / NOT ACCEPTED
Issue #19 design recommendation（non-binding）: NONE recorded
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-11-value-boundary-selection.md`](./decision-gov-rule-11-value-boundary-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §B GOV-RULE-11
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜10: Accepted / LOCKED（cycle complete）
GOV-RULE-05〜08: Accepted（該当分；08 = NOT ADOPTED）
GOV-RULE-09 rule content owner: Accepted / LOCKED / Option B = 法人業務責任者
GOV-RULE-10 change approver: Accepted / LOCKED / Option C
  = 業務責任者が内容確認し、法人管理者が承認
GOV-RULE-11 value boundary: UNDECIDED（本 packet / fill-in）
GOV-RULE-12 past-version correction: OPEN / OUT
GOV-STAFF / GOV-PERF: OPEN / OUT
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> 制度値と法人運用値の境界を、Issue #19 原文の 3 分類で定めますか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-RULE-09 | ルール内容の責任者 | **OUT**（Accepted / Option B） |
| GOV-RULE-10 | ルール変更の承認者 | **OUT**（Accepted / Option C） |
| **GOV-RULE-11** | 制度値と法人運用値の境界（3 分類） | **本 packet** |
| GOV-RULE-12 | 過去ルール版の訂正 | **OUT** |
| GOV-RULE-05〜08 | 見直し基準日・周期・通知・due | **OUT**（Accepted） |
| 具体制度値・日数 | 値そのもの | OUT（分類枠のみ） |
| Implementation | code / tenant mutation | HOLD |

```text
境界分類 ≠ 内容責任者（GOV-RULE-09）
境界分類 ≠ 変更承認者（GOV-RULE-10）
境界分類 ≠ 過去版訂正方針（GOV-RULE-12）
境界を決める ≠ ルール本文・日数・制度値の発明
境界を決める ≠ 設定画面 / 実装開始
```

## 3. Fill-in fields（Issue #19 原文）

Human が各分類へ該当項目を記入する。Agent は空欄を埋めない。

```text
制度上固定し事業所変更不可:
法人運用として変更可能:
事業所設定として変更可能:
```

各分類の意味（枠のみ；値は Human 記入）:

| Field | Meaning（枠） | Does NOT mean |
|---|---|---|
| 制度上固定し事業所変更不可 | 制度上固定し、事業所が変更できない項目 | 具体制度値の発明 / 実装埋め込み |
| 法人運用として変更可能 | 法人運用として変更可能な項目 | 法人ポリシー文書の全文起草 |
| 事業所設定として変更可能 | 事業所設定として変更可能な項目 | 事業所 UI / 設定実装 GO |

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-RULE-11 fill-in は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
制度値・日数・ルール本文の Agent 発明
3 分類への Agent 自動仕分け / Accepted
GOV-RULE-12 の同時採択
GOV-STAFF / GOV-PERF の同時採択
設定画面 / ワークフロー実装の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-RULE-11 は ORG_POLICY / MIXED の fill-in 分類。
  Issue #19 に設計上の推奨分類一覧はない。
  Agent は制度値・運用値・事業所設定を Binding として確定しない。
```

Agent recommendation の欠如は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  制度値と法人運用値の境界（3 分類）をどう定めますか？

Fill-in（Issue #19 原文）:
  制度上固定し事業所変更不可: NOT FILLED
  法人運用として変更可能: NOT FILLED
  事業所設定として変更可能: NOT FILLED

H. まだ決めない / HOLD

答え: NOT FILLED / NOT ACCEPTED
```

## 7. After Decision

| Selected | Next |
|---|---|
| Fill-in values | Fill-in Acceptance → boundary LOCKED。実装は別 GO |
| H | Fill-in HOLD。unit Selection は維持可 |

維持:

```text
GOV-RULE-12: OUT / DO NOT START from this Decision alone
GOV-RULE-05〜10 / GOV-AUD-01〜10: UNCHANGED
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-rule-11-value-boundary-selection.md`
- SELECT Acceptance: `decision-gov-rule-11-value-boundary-acceptance.md`
- Issue #19 GOV-RULE-11 source fill-in fields
