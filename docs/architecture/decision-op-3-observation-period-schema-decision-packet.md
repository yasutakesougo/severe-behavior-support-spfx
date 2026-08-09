# Decision Packet — Decision-OP-3 観察期間 Schema（論理表現）

この文書は、**Decision-OP-3**（観察期間をデータとしてどう表現するか）の
**Human Decision Packet** である。

未決定点抽出: [`decision-op-3-open-points-extraction.md`](./decision-op-3-open-points-extraction.md)

メンバシップ純関数の再実装ではない。
制度日数・期限の発明ではない。
Accepted ではない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-OP-3
Kind: Human Decision packet
Status: CONSUMED（Human Decision Accepted / Option A）
Accepted 正本: decision-op-3-observation-period-schema-acceptance.md
Logical contract: observation-period-schema-contract.md
Owner candidates: Issue #24（メンバシップ）/ Issue #26（Schema 関連）
Membership contract: observation-period.md（UNCHANGED）
main baseline: f7448d245d5744940c0b0f921b5aca57b18cb32d
PR #145 / GOV-AUD-03: MERGED
Selected via: next substantive unit C
duration_days invention: FORBIDDEN
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation（historical）: Option A
Human Selected: Option A
```


Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-op-3-open-points-extraction.md`](./decision-op-3-open-points-extraction.md)
- [`observation-period.md`](./observation-period.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)

## 1. Current canonical state

```text
evaluateObservationPeriodMembership: DONE
  inputs: periodFrom / periodTo / asOf（ISO DateTime）
  periodTo: required（開放終端 NOT permitted in current contract）
  institutional day count in domain: NOT embedded（OP-2）
SupportPlan observation fields: absent
SharePoint columns: NOT in this packet
GOV-RULE-06「3ヶ月に1回程度」: review cadence ≠ observation Schema
```

問い（本 packet）:

> 観察期間を、SupportPlan のデータ（論理 Schema）としてどう表現しますか？
> （日数や期限は AI が発明しません）

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| OP-1 / OP-2 | 所有・caller-supplied 境界 | Accepted / 触らない |
| **OP-3** | 観察期間の論理 Schema 表現 | **本 packet** |
| 制度日数 N | 既定窓の日数 | 発明禁止。採択するなら Human が明示 |
| 期間導出（Active+N） | 自動算出 | OUT |
| SharePoint / DEC-6 | 物理列 | OUT |
| RD-3 / GOV-RULE-06 | 見直し接近窓・cadence | OUT / 混ぜない |
| RSV `effectiveTo` 開放終端 | 別 HOLD | 混ぜない |
| Implementation | Schema code / adapter | HOLD |

## 3. Options

### Option A — periodFrom / periodTo を論理フィールドとして採択（両端必須・日数非埋め込み）

```text
Meaning:
  SupportPlan 論理 Schema に観察期間を持つ
  fields: periodFrom, periodTo（ISO DateTime）
  periodTo: required（現行メンバシップ契約と整合）
  institutional day count in domain: NOT ADOPTED（OP-2 維持）
  open-ended periodTo: NOT ADOPTED
  SharePoint columns: 別 Decision（DEC-6 等）

Does NOT mean:
  N 日の既定窓を採択した
  evaluateObservationPeriodMembership を変更した
  Implementation Start
```

### Option B — SupportPlan に観察期間フィールドを追加しない（当面）

```text
Meaning:
  Schema 上は持たない
  期間は引き続き caller-supplied のみ
  メンバシップ純関数: UNCHANGED

Does NOT mean:
  観察業務そのものの廃止
```

### Option C — 開放終端を含む論理表現を採択（periodTo optional）

```text
Meaning:
  SupportPlan に観察期間を持ち、periodTo 未設定を許す
Requires:
  メンバシップ契約の別 Human GO（現行は periodTo 必須）
  本 Option だけでは純関数を自動変更しない

Still FORBIDDEN:
  Agent が開放終端の業務意味を発明すること
```

### Option D — その他（Human 明示）

```text
Requires:
  フィールド形 / 開放終端 / 制度日数の扱いを Human が明示
  制度日数を採る場合は日数と一次情報根拠を Human が記入
Agent MUST NOT invent N
```

### Option E — まだ決めない / HOLD

```text
Meaning: Decision-OP-3 は HOLD のまま
```

## 4. Agent recommendation

```text
Recommended: Option A
Reason:
  既存メンバシップ契約（periodTo 必須・caller-supplied）と整合し、
  制度日数を発明せずに「データとしてどう持つか」だけを閉じられる。
  業務上の経過観察・モニタリング接続の次ステップとして自然。
```

Agent recommendation は Human Acceptance evidence ではない。

## 5. Human Decision

```text
問:
  観察期間を SupportPlan 論理 Schema としてどう表現しますか？

A. periodFrom / periodTo（両端必須）。制度日数は domain に埋め込まない
B. SupportPlan にフィールド追加しない（当面）
C. 開放終端を許す（メンバシップ契約の別 GO が必要）
D. その他（明示）
E. まだ決めない / HOLD

答え: A（2026-08-09）
Acceptance: decision-op-3-observation-period-schema-acceptance.md
Logical contract: observation-period-schema-contract.md
```

## 6. After Decision

| Selected | Next |
|---|---|
| **A（SELECTED）** | Acceptance + 論理 Schema 契約 docs。純関数 UNCHANGED。SP 列は別 |
| B | Acceptance（フィールド追加 NOT ADOPTED）。caller-supplied 維持 |
| C | Acceptance + メンバシップ開放終端の別 Decision を必須化 |
| D | Human 明示内容で Acceptance |
| E | HOLD |

維持:

```text
日数・期限の発明: FORBIDDEN
evaluateObservationPeriodMembership: UNCHANGED
FindingCode / A-5 / Implementation: HOLD
SharePoint / Deploy: NO-GO
次 substantive unit: NOT SELECTED
```

## 7. Gate

```text
Decision-OP-3 packet: CONSUMED / Accepted Option A
Logical Schema: periodFrom / periodTo required
Open-ended periodTo: NOT ADOPTED
Institutional day count in domain: NOT ADOPTED
Implementation Start: HOLD
```
