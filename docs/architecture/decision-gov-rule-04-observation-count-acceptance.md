# GOV-RULE-04 — 必要観察件数 Human Acceptance

この文書は、**GOV-RULE-04**（必要観察件数）についての
**Human Acceptance evidence** である。

Evidence Packet:
[`decision-gov-rule-04-observation-count-evidence-packet.md`](./decision-gov-rule-04-observation-count-evidence-packet.md)
（PR #287 MERGED）

Evidence Bundle Selection:
[`decision-gov-rule-01-04-evidence-bundle-selection.md`](./decision-gov-rule-01-04-evidence-bundle-selection.md)

Prior unit:
GOV-RULE-01 Accepted / LOCKED（PR #288 MERGED）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-04
Status: Accepted / LOCKED
Human Acceptance: Explicit Human ACCEPT GOV-RULE-04 on 2026-08-12
HOLD: LIFTED（GOV-RULE-04 only）
Baseline tip: 8ccf603e499b83e925f7d102b5c92003c40de215
PR: #289（Acceptance / sync / IR）

Meaning:
  minimumObservationCount = NOT FIXED（最低件数は設定しない）
  件数不足 alone ≠ 見直し不成立・未完了・算定不能
  対象期間 = 前回見直し〜今回見直し（初回は Accepted 起算ルールに従う）
  1件 = 見直し判断につながる独立した事象・ケース
  同日でも別出来事・別ケースは別件；同一事象の追記/分割/重複は1件
  閾値モデル（一定件数を満たしたら見直し可能）は採用しない

Does NOT mean:
  「最低○件」への読み替え
  1日1件固定への読み替え
  同一事象の重複記録を別件として水増し
  observation / case の新しい業務分類コード発明
  記録0件時の業務判断や内容十分性の自動導出
  domain / UI / adapter implementation
  SharePoint / M365 / Entra mutation
  performance testing / Implementation Start
  Issue #19 Close / next residual auto-select

Unchanged:
  PERF-02 / 06 / 07 / 08 / 09 = HOLD / UNCHANGED
  GOV-RULE-01 / 02 / 03 = Accepted / LOCKED（UNCHANGED）
  GOV-RULE-05〜12 = CONFIRMED / UNCHANGED

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD / NOT AUTHORIZED
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human ACCEPT GOV-RULE-04 on 2026-08-12
GOV-RULE-04: Accepted / LOCKED
HOLD: LIFTED（this unit only）
```

```text
Prior status: HOLD / UNCHANGED（ORG_POLICY；Evidence Bundle PR #287）
Agent recommendation = NONE（≠ Human Acceptance evidence）
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-RULE-04: Accepted / LOCKED
minimumObservationCount = NOT FIXED
```

### 必要観察件数

```text
最低件数は設定しない
minimumObservationCount = NOT FIXED

件数不足だけを理由に、見直しを自動的に
  不成立・未完了・算定不能
とは扱わない
```

### 対象期間

```text
前回見直しから今回見直しまでの記録を対象とする

初回見直し:
  既存の Accepted / LOCKED な観察期間起算ルールと矛盾しない形で扱う
  （GOV-RULE-02 = 支援計画の有効開始日；PR #282）
  Agent が新しい起算日を発明してはならない
```

### 1件として扱う単位

```text
見直し判断につながる独立した事象・ケースを1件として扱う例:
  問題行動
  見直し判断につながる特記事項
  個別のケース

数え方にしない:
  単なる記載行数
  フォーム送信数
  追記回数
```

### 同日に複数記録がある場合

```text
同じ日であっても、別の出来事・別ケースであれば、それぞれ別件として扱う

1件として扱う（水増ししない）:
  同一事象への追記
  同一事象を複数職員が分割して記録したもの
  同一内容の重複記録
```

### Meaning（閾値モデルではない）

```text
「一定件数を満たしたら見直し可能」という閾値モデルは採用しない

見直しでは、対象期間内に存在する relevant observation / case を材料として扱う

MUST NOT auto-derive from this Decision alone:
  記録が0件の場合の業務判断
  記録内容の十分性判定
```

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  「最低○件」/「1日1件」への読み替え
  同一事象の重複を別件として水増し
  observation / case の新しい業務分類コード発明
  0件時の自動業務判断 / 内容十分性の自動導出
  domain / UI / adapter / schema
  SharePoint / M365 / Entra mutation
  PERF HOLD解除
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data / performance testing
```

## Conflict check（GOV-RULE-01〜12）

| Unit | Relation |
|---|---|
| GOV-RULE-01 Accepted（認定有効期間） | **NO CONFLICT** / UNCHANGED |
| GOV-RULE-02 Accepted Option A（起算 = 支援計画有効開始日） | **NO CONFLICT** — 初回はこれに従う；新起算日発明禁止 |
| GOV-RULE-03 Accepted Option A（終了 = 見直し実施日の前日） | **NO CONFLICT** / UNCHANGED |
| GOV-RULE-05〜12 | **NO CONFLICT** / UNCHANGED |
| Evidence Bundle（固定件数は MHLW から導出不可） | **ALIGNED** — 最低件数 NOT FIXED と整合 |
| PERF-02/06/07/08/09 HOLD | **NO CONFLICT** / UNCHANGED |

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-RULE-01-04-EVIDENCE-1 | **UNCHANGED** |
| GOV-RULE-04 | **Accepted / LOCKED**（HOLD LIFTED） |
| GOV-RULE-01〜03 / 05〜12 | **UNCHANGED** |
| PERF HOLD Resolution | **UNCHANGED** |
| Implementation / SharePoint | **HOLD / FORBIDDEN** |

## Next

```text
GOV-RULE-04: Accepted / LOCKED
GOV-RULE-01〜12（01〜04 Accepted；05〜12 CONFIRMED）: recorded
next residual SELECT（one item；Agent auto-advance FORBIDDEN）
PERF HOLDs: UNCHANGED
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に最低件数閾値実装・分類コード発明・
次 residual 自動 SELECT へ進まない。
