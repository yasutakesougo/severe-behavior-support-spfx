# Decision Packet — GOV-RULE-07 通知開始時期

この文書は、**GOV-RULE-07**（見直しに関する通知 / 注意の開始時期）の
**Human Decision Packet** である。

値の採択・Accepted ではない。
Agent が通知日数を発明しない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-RC-3 / GOV-RULE-07
Kind: Human Decision packet
Status: READY_FOR_HUMAN_DECISION
PR #135 / GOV-RULE-06: MERGED（Accepted）
PR #136 / GOV-RULE-05: MERGED（Accepted）
  merge commit: ed77f5e480ee8546c38809c60774fd5c512ab17e
  merged head: fb20d459fd25fca300fb5a3294632e89facd0d51
main baseline: ed77f5e480ee8546c38809c60774fd5c512ab17e
GOV-RULE-05: Accepted（main）
GOV-RULE-06: Accepted（main）
GOV-RULE-07: HOLD → 本 packet で判断単位を固定
GOV-RULE-08: HOLD
duration_days = 90: NOT AUTHORIZED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-rule-05-review-anchor-acceptance.md`](./decision-gov-rule-05-review-anchor-acceptance.md)
- [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md)
- [`review-anchor-contract.md`](./review-anchor-contract.md)
- [`review-cadence-contract.md`](./review-cadence-contract.md)
- [`review-due.md`](./review-due.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## 1. Current canonical state

```text
GOV-RULE-05 Accepted:
  初回基準日 = 支援計画の有効開始日
  2回目以降 = 前回見直し日

GOV-RULE-06 Accepted:
  「3ヶ月に1回程度」
  / calendar-month cadence
  / precision = approximate

NOT derived from 05/06:
  90日
  91日目から overdue
  3暦月経過で自動違反
  duration_days = 90
```

問い（GOV-RULE-07）:

> 見直しについて、いつから注意 / 通知を出すか。

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-RULE-05 | 基準日 | Accepted / 触らない |
| GOV-RULE-06 | practice cadence | Accepted / 触らない |
| **GOV-RULE-07** | 通知開始時期 | **本 packet** |
| GOV-RULE-08 | due / overdue 定義 | HOLD / 混ぜない |
| Decision-RD-3 | 接近窓・算出・超過後の技術ポリシー | HOLD / 混ぜない |
| Implementation | 通知 UI / job / Schema | HOLD / 混ぜない |

```text
GOV-RULE-07 ≠ GOV-RULE-08
通知開始を決めても、期限当日・期限超過の定義にはならない。
GOV-RULE-07 ≠ duration_days = 90
通知窓を 90日規則の代わりにしてはならない。
```

## 3. 依存関係上の注意

GOV-RULE-06 は **approximate** である。
したがって「期限の N 日前」型の通知は、**due の定義（GOV-RULE-08）** が無いと意味が閉じない。

```text
If notice = N days before due:
  requires GOV-RULE-08（または同等の due 定義）が先、または同時に Human が due を明示すること

If notice = relative to anchor + approximate 3-month mark:
  invents a target date from an approximate cadence — Human が明示採用する場合のみ可

If notice = calendar-month based（例: 見直し月に入ったら）:
  day-count due を必須にしない可能性あり — Human 選択肢

If notice = NOT ADOPTED / OUT for now:
  GOV-RULE-08 より先に閉じられる — Human 選択肢
```

## 4. Human が決める最小セット

Human Decision では、次を明示する。

1. **通知を採用するか**（採用 / 当面不採用）
2. 採用する場合の **起点**（due 相対 / anchor+cadence 相対 / 暦月相対 / その他）
3. 採用する場合の **量と単位**（例: N calendar days / N calendar months / 当該暦月 等）
4. **precision**（exact / approximate）— GOV-RULE-06 が approximate であることとの整合
5. GOV-RULE-08 を同時に決めるか、07 だけ先に決めて 08 を HOLD のまま残すか

Agent は具体的な N を推薦値として Binding にしない。

## 5. Option 骨格（値は Human が埋める）

### Option A — due 相対の通知（要 GOV-RULE-08）

```text
notice starts: N <unit> before due
requires: GOV-RULE-08 due definition Accepted（先または同時）
N / unit / precision: HUMAN FILLS
```

### Option B — anchor + cadence 相対の通知

```text
notice starts: N <unit> before (anchor + approximately 3 months)
risk: approximate cadence を日付目標へ硬化しうる
N / unit / precision: HUMAN FILLS
GOV-RULE-08: 別途 HOLD 可だが、overdue とは分離維持必須
```

### Option C — 暦月ベースの通知（日数 due 非依存）

```text
例の型（値は Human）:
  見直し対象の暦月に入ったら注意を出す
  または 基準月から M 暦月目の月初から
day-count due を必須化しない
precision は approximate cadence と整合しやすい
```

### Option D — 当面通知しない / NOT ADOPTED

```text
GOV-RULE-07: NOT ADOPTED or OUT for current scope
automated notice: DO NOT START
GOV-RULE-08: 引き続き別 Decision
```

### Option E — その他（Human 明示）

Human が A–D 以外を書く場合のみ。Agent が補完しない。

## 6. 禁止事項

```text
FORBIDDEN:
  Agent が通知日数（例: 14日 / 30日 / 89日）を発明して Accepted 扱いすること
  GOV-RULE-06 の「3ヶ月に1回程度」を 90日へ変換し、その前 N 日を通知にすること
  GOV-RULE-07 と GOV-RULE-08 を一括 Accepted して曖昧にすること
  evaluateReviewDueRelativeToAsOf へ接近窓定数を埋め込むこと
  Implementation / UI / SharePoint を本 packet で開始すること
```

## 7. Accepted 時に必要になる論理面（予告・未採択）

Human が採用 Option を選んだ後に、別 docs で固定しうる最小面:

```ts
// 例示。値・採用は Human Decision 後。本 packet では採択しない。
type ReviewNoticePolicy =
  | { kind: "not_adopted" }
  | {
      kind: "relative";
      relativeTo: "due" | "anchor_plus_cadence" | "calendar_month";
      offset: { unit: "day" | "month"; amount: number; precision: "exact" | "approximate" };
      direction: "before";
    };
```

本 packet の段階では型も値も Accepted にしない。

## 8. Human Decision 記録欄（未記入）

```text
Human Decision: UNRECORDED
GOV-RULE-07: HOLD / READY_FOR_HUMAN_DECISION
Selected Option: UNSELECTED
notice adopted: UNDECIDED
relativeTo: UNDECIDED
offset: UNDECIDED
precision: UNDECIDED
GOV-RULE-08 relation: HOLD（別）
Implementation Start: HOLD
```

Human が決定したら、別 Acceptance 正本（`decision-gov-rule-07-*-acceptance.md`）へ記録する。

## 9. Gate

```text
Packet: READY_FOR_HUMAN_DECISION
GOV-RULE-05 / 06: Accepted（main）
GOV-RULE-07: NOT ACCEPTED
GOV-RULE-08: HOLD
duration_days = 90: NOT AUTHORIZED
Implementation Start: HOLD
SharePoint / M365 / Deploy: NO-GO
src/** / tests/**: 本 packet では変更しない
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 packet では変更しない
evaluateReviewDueRelativeToAsOf: UNCHANGED
AI invention of notice-day constants: FORBIDDEN
```
