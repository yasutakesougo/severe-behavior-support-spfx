# GOV-RULE-01〜04 — 観察・評価周期 residual bundle Human Acceptance（Options + HOLD）

この文書は、**GOV-RULE-01〜04** についての
**Option / HOLD Human Acceptance evidence（bundle）** である。

Decision packet:
[`decision-gov-rule-01-04-observation-cycle-bundle-decision-packet.md`](./decision-gov-rule-01-04-observation-cycle-bundle-decision-packet.md)

Unit Selection:
[`decision-gov-rule-01-04-observation-cycle-bundle-selection.md`](./decision-gov-rule-01-04-observation-cycle-bundle-selection.md)
（同一 Draft PR；Decision-GOV-RULE-01-04-BUNDLE-1）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-RULE-01-04-OPTIONS-1
Status: Accepted / LOCKED（01/02/03/04）
Human Acceptance: Explicit Human GOV-RULE-01〜04 Options/HOLD on 2026-08-12
Baseline tip: 7f4da32927392de3bc46b669016a73c404187756
PR: #282（Selection / Option+HOLD Acceptance / Packet sync / IR）

Accepted / HOLD:
  GOV-RULE-01 = ACCEPTED / LOCKED（see decision-gov-rule-01-evaluation-cycle-acceptance.md；HOLD LIFTED）
  GOV-RULE-02 = ACCEPTED / LOCKED / Option A
  GOV-RULE-03 = ACCEPTED / LOCKED / Option A
  GOV-RULE-04 = ACCEPTED / LOCKED（see decision-gov-rule-04-observation-count-acceptance.md；HOLD LIFTED）
  GOV-RULE-05〜12 = CONFIRMED / UNCHANGED

Does NOT mean:
  GOV-RULE-01 re-Decision
  GOV-RULE-05〜12 再 Decision
  HOLD 解除
  SharePoint / schema / UI / adapter / Implementation Start
  Issue #19 Close / next residual auto-select

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
Human Acceptance: Explicit GOV-RULE-01〜04 Options/HOLD on 2026-08-12
Decision-GOV-RULE-01-04-OPTIONS-1: Accepted / LOCKED（bundle Options+HOLD）
```

```text
Agent recommendation = NONE（≠ Human Acceptance evidence）
Concrete values for 01/04 MUST NOT be invented from tips or silence.
```

## Accepted / HOLD 内容（単位別）

### GOV-RULE-01 — Accepted / LOCKED（HOLD LIFTED）

```text
GOV-RULE-01: Accepted / LOCKED
正本: decision-gov-rule-01-evaluation-cycle-acceptance.md
```

意味:

- アプリ独自の固定日数・固定月数による再採点周期を設定しない。
- 正式な障害支援区分の認定・更新認定・変更認定に基づく有効期間を正本とする。
- 3年は基本値；アプリ固定再評価周期としてハードコードしない。

### GOV-RULE-02 — Option A

```text
GOV-RULE-02: Accepted / LOCKED / Option A
観察期間の起算日 = 支援計画の有効開始日
```

意味:

- 初回の観察期間は、支援計画の有効開始日を起点とする。
- 前回見直し後の次期間については、既に Accepted / LOCKED の GOV-RULE-05 等との整合を保つ。
- **本 Decision から新たな日付計算規則を発明しない。**
- Option B（前回見直し日）/ C（暦日）/ D（その他）は採択しない。

### GOV-RULE-03 — Option A

```text
GOV-RULE-03: Accepted / LOCKED / Option A
観察期間の終了日 = 見直し実施日の前日
```

意味:

- 見直し実施日そのものを、見直し判断の材料となる観察期間へ後付けで含めない。
- **観察 → 見直し判断** の時間順序を維持する。
- 時刻境界・タイムゾーン・SharePoint列型等は本 Decision では決定しない。
- Option B（実施日を含む）/ C（固定期間末日）/ D（その他）は採択しない。

### GOV-RULE-04 — Accepted / LOCKED（HOLD LIFTED）

```text
GOV-RULE-04: Accepted / LOCKED
minimumObservationCount = NOT FIXED
正本: decision-gov-rule-04-observation-count-acceptance.md
```

意味:

- 最低件数は設定しない。件数不足 alone ≠ 見直し不成立・未完了・算定不能。
- 対象期間 = 前回見直し〜今回見直し（初回は GOV-RULE-02 と整合；新起算日発明禁止）。
- 1件 = 独立した事象・ケース（行数/送信数/追記回数ではない）。
- 同日: 別ケース=別件；同一事象の追記/分割/重複=1件。
- 閾値モデルは採用しない。

### GOV-RULE-05〜12 — CONFIRMED / UNCHANGED

```text
GOV-RULE-05 = CONFIRMED / UNCHANGED
GOV-RULE-06 = CONFIRMED / UNCHANGED
GOV-RULE-07 = CONFIRMED / UNCHANGED
GOV-RULE-08 = CONFIRMED / UNCHANGED
GOV-RULE-09 = CONFIRMED / UNCHANGED
GOV-RULE-10 = CONFIRMED / UNCHANGED
GOV-RULE-11 = CONFIRMED / UNCHANGED
GOV-RULE-12 = CONFIRMED / UNCHANGED
```

既存 Accepted 内容を書き換えたり再解釈したりしない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  GOV-RULE-01 / 04 具体値発明
  GOV-RULE-05〜12 re-Decision
  HOLD 解除
  日付計算規則の新規発明（02/03 補足を超えるもの）
  SharePoint / schema / Internal Name / UI / adapter
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-RULE-01-04-BUNDLE-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| GOV-RULE-05〜12 | **CONFIRMED / UNCHANGED** |
| GOV-STAFF-01〜12 / GOV-AUD-* | **UNCHANGED** |
| GOV-PERF-01〜11 | **SELECTED / LOCKED（bundle；PR #285）** — 正本 [`decision-gov-perf-01-11-performance-bundle-option-acceptance.md`](./decision-gov-perf-01-11-performance-bundle-option-acceptance.md) |
| SharePoint / schema / Implementation | **HOLD / FORBIDDEN** |

## Next

```text
GOV-RULE-01〜04 bundle: recorded（02/03 Accepted；01/04 HOLD）
GOV-RULE-01 / 04 HOLD 解除: separate Human Decision
next residual: GOV-RULE-04 Acceptance（PR #289）
  正本: decision-gov-rule-04-observation-count-acceptance.md
  further residual SELECT: separate Human Decision
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に周期・件数発明・HOLD 解除・tenant mutation・次 residual 自動 SELECT へ進まない。
