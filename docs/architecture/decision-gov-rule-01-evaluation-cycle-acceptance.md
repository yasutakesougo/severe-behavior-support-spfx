# GOV-RULE-01 — 行動関連点数の評価周期 Human Acceptance

この文書は、**GOV-RULE-01**（行動関連点数の評価周期）についての
**Human Acceptance evidence** である。

Evidence Packet:
[`decision-gov-rule-01-evaluation-cycle-evidence-packet.md`](./decision-gov-rule-01-evaluation-cycle-evidence-packet.md)
（PR #287 MERGED）

Evidence Bundle Selection:
[`decision-gov-rule-01-04-evidence-bundle-selection.md`](./decision-gov-rule-01-04-evidence-bundle-selection.md)

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-01
Status: Accepted / LOCKED
Human Acceptance: Explicit Human ACCEPT GOV-RULE-01 on 2026-08-12
HOLD: LIFTED（GOV-RULE-01 only）
Baseline tip: e8b2121c556216fa85a913bea37bf9080ac76180
PR: #288（Acceptance / sync / IR）

Meaning:
  アプリ独自の固定日数・固定月数による再採点周期を設定しない
  正式な障害支援区分の認定・更新認定・変更認定に基づく有効期間を正本とする
  3年は認定有効期間の基本値（アプリ固定再評価周期としてハードコードしない）
  新しい正式認定結果の有効開始日から使用する
  入力日・確認日・アプリ経過日数・3年経過だけでの自動切替をしない

Does NOT mean:
  GOV-RULE-04 具体値決定 / 観察件数発明
  3年固定再採点実装
  domain / UI / adapter implementation
  SharePoint / M365 / Entra mutation
  performance testing / Implementation Start
  Issue #19 Close / next residual auto-select

Unchanged:
  GOV-RULE-04 = HOLD / UNCHANGED
  PERF-02 / 06 / 07 / 08 / 09 = HOLD / UNCHANGED
  GOV-RULE-02 / 03 = Accepted / Option A（UNCHANGED）

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
Human Acceptance: Explicit Human ACCEPT GOV-RULE-01 on 2026-08-12
GOV-RULE-01: Accepted / LOCKED
HOLD: LIFTED（this unit only）
```

```text
Prior status: HOLD LIFT CANDIDATE（PR #287 Evidence Bundle）
Agent recommendation = NONE（≠ Human Acceptance evidence）
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-RULE-01: Accepted / LOCKED

行動関連点数の評価周期:
  アプリ独自の固定日数・固定月数による再採点周期を設定しない
  正式な障害支援区分の認定・更新認定・変更認定に基づく有効期間を正本とする
```

### 3年の扱い

```text
3年 = 認定有効期間の基本値として扱う
MUST NOT:
  3年をアプリ独自の固定再評価周期としてハードコードする
ALLOWED:
  短縮された認定期間や変更認定を許容する
```

### 新しい点数への切替

```text
新しい正式認定結果の有効開始日から使用する

自動切替しない根拠（alone）:
  入力日
  確認日
  アプリ上の経過日数
  3年経過だけ
```

### 追加評価・更新契機

```text
新たな正式認定結果、更新認定、変更認定が存在する場合に、
新しい有効期間・点数を取り込む対象とする

事業所が独自に再採点する契機を発明しない
```

### 決定境界

```text
認定・有効期間そのものの決定主体は市町村
アプリは正式な認定結果を参照・保持する
```

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  GOV-RULE-04 具体値決定 / 観察件数発明
  3年固定再採点実装
  domain / UI / adapter / schema
  SharePoint / M365 / Entra mutation
  PERF HOLD解除
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data / performance testing
```

## Conflict check

| Unit | Relation |
|---|---|
| GOV-RULE-02 / 03 Accepted Option A | **NO CONFLICT** / UNCHANGED |
| GOV-RULE-04 Accepted / LOCKED（NOT FIXED） | **NO CONFLICT**（Acceptance PR #289） |
| GOV-RULE-05〜12 | **NO CONFLICT** / UNCHANGED |
| Evidence Bundle PR #287 | **ALIGNED**（candidate → Accepted） |
| PERF-02/06/07/08/09 HOLD | **NO CONFLICT** / UNCHANGED |
| post-retention / STAFF / AUD Accepted | **NO CONFLICT** / UNCHANGED |

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-RULE-01-04-EVIDENCE-1 | **UNCHANGED**（Evidence Bundle SELECTED） |
| GOV-RULE-01 | **Accepted / LOCKED**（HOLD LIFTED） |
| GOV-RULE-04 | **Accepted / LOCKED**（Acceptance PR #289） |
| PERF HOLD Resolution | **UNCHANGED** |
| Implementation / SharePoint | **HOLD / FORBIDDEN** |

## Next

```text
GOV-RULE-01: Accepted / LOCKED
next residual: Human SELECTED GOV-RULE-04 Acceptance（PR #289）
  正本: decision-gov-rule-04-observation-count-acceptance.md
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に 3年ハードコード実装・RULE-04件数発明・
次 residual 自動 SELECT へ進まない。
