# Decision Packet — GOV-RULE-12 過去ルール版の訂正

この文書は、**GOV-RULE-12**（過去ルール版の訂正）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-RULE-09 / 10 / 11 の再 Decision ではない。
Agent が訂正 UI・版管理実装・ルール本文を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-rule-12-version-correction-selection.md`](./decision-gov-rule-12-version-correction-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-12
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option B
Owner: Issue #19
Selected via: Decision-GOV-RULE-12-SELECTION-1（PR #272 MERGED）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: B（訂正版を新規作成し、旧版を保持）
Option Acceptance: decision-gov-rule-12-version-correction-option-b-acceptance.md
Issue #19 design recommendation（non-binding）: B（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-12-version-correction-selection.md`](./decision-gov-rule-12-version-correction-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §B GOV-RULE-12
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-AUD-01〜10: Accepted / LOCKED（cycle complete）
GOV-RULE-05〜08: Accepted（該当分；08 = NOT ADOPTED）
GOV-RULE-09 rule content owner: Accepted / LOCKED / Option B
GOV-RULE-10 change approver: Accepted / LOCKED / Option C
GOV-RULE-11 value boundary: Accepted / LOCKED（fill-in）
GOV-RULE-12 past-version correction: Accepted / LOCKED / Option B
  = 訂正版を新規作成し、旧版を保持
GOV-STAFF / GOV-PERF: OPEN / OUT
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> 過去ルール版の訂正をどう扱いますか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-RULE-09 | ルール内容の責任者 | **OUT**（Accepted） |
| GOV-RULE-10 | ルール変更の承認者 | **OUT**（Accepted） |
| GOV-RULE-11 | 制度値と法人運用値の境界 | **OUT**（Accepted） |
| **GOV-RULE-12** | 過去ルール版の訂正 | **本 packet** |
| 訂正 UI / 版管理実装 | 画面・ストレージ | OUT |
| ルール本文 / 制度値 | 内容そのもの | OUT |
| Implementation | code / tenant mutation | HOLD |

```text
過去版訂正方針 ≠ 内容責任者（GOV-RULE-09）
過去版訂正方針 ≠ 変更承認者（GOV-RULE-10）
過去版訂正方針 ≠ 制度/運用境界（GOV-RULE-11）
訂正方針を決める ≠ 訂正画面・版管理実装開始
訂正方針を決める ≠ ルール本文の発明
```

## 3. Options（Issue #19 原文）

### Option A — 既存版を上書き

```text
Meaning:
  過去ルール版の訂正 = 既存版を上書き

Does NOT mean:
  上書き UI / 監査ログ実装 GO
  GOV-RULE-09 / 10 / 11 の再 Decision
```

### Option B — 訂正版を新規作成し、旧版を保持

```text
Meaning:
  過去ルール版の訂正 =
    訂正版を新規作成し、旧版を保持

Does NOT mean:
  版管理スキーマ / UI の発明
  Option B tip = Binding（本 packet 時点では NON-BINDING）
```

### Option C — 過去版は訂正不可

```text
Meaning:
  過去ルール版 = 訂正不可

Does NOT mean:
  新規版作成フローの発明
```

### Option D — その他（Human が明示）

```text
Requires:
  訂正方針を Human が記入
Agent MUST NOT invent the policy text
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-RULE-12 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
Option B tip の自動 Accepted
訂正 UI / 版管理 / 監査ログ実装の発明
GOV-RULE-09 / 10 / 11 の再 Decision
GOV-STAFF / GOV-PERF の同時採択
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-RULE-12 は ORG_POLICY / MIXED。
  Issue #19 の「設計上の推奨: B」は Binding ではない。
  Human が「Option B = 指定あり / まだ非Binding」と明示した。
  Agent は Option B を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨 / Human tip 指定は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  過去ルール版の訂正をどう扱いますか？

A. 既存版を上書き
B. 訂正版を新規作成し、旧版を保持
C. 過去版は訂正不可
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: B（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **B** | **Option Acceptance LOCKED（本 Decision）**。実装は別 GO |
| A / C / D / H | NOT SELECTED |

維持:

```text
GOV-RULE-05〜11 / GOV-AUD-01〜10: UNCHANGED
Implementation Start: DO NOT START
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-rule-12-version-correction-selection.md`
- SELECT Acceptance: `decision-gov-rule-12-version-correction-acceptance.md`
- Option B Acceptance: `decision-gov-rule-12-version-correction-option-b-acceptance.md`
- Issue #19 GOV-RULE-12 source options A–D
