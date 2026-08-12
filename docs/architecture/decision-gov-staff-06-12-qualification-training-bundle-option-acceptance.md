# GOV-STAFF-06〜12 — 資格・研修 residual bundle Human Acceptance（Options）

この文書は、**GOV-STAFF-06〜12** についての
**Option Human Acceptance evidence（bundle）** である。

Decision packet:
[`decision-gov-staff-06-12-qualification-training-bundle-decision-packet.md`](./decision-gov-staff-06-12-qualification-training-bundle-decision-packet.md)

Unit Selection:
[`decision-gov-staff-06-12-qualification-training-bundle-selection.md`](./decision-gov-staff-06-12-qualification-training-bundle-selection.md)
（同一 Draft PR；Decision-GOV-STAFF-06-12-BUNDLE-1）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-STAFF-06-12-OPTIONS-1
Status: Accepted / LOCKED（bundle Options）
Human Acceptance: Explicit Human GOV-STAFF-06〜12 Options on 2026-08-12
Baseline tip: 48dd920ea8dbb740db68709e8139b519f554b042
PR: #281（Selection / Option Acceptance / Packet sync / IR）

Accepted:
  GOV-STAFF-06 = ACCEPTED / LOCKED / Option B（CONFIRMED / UNCHANGED；PR #280）
  GOV-STAFF-07 = ACCEPTED / LOCKED / Option C
  GOV-STAFF-08 = ACCEPTED / LOCKED / Option C
  GOV-STAFF-09 = ACCEPTED / LOCKED / Option C
  GOV-STAFF-10 = ACCEPTED / LOCKED / Option C-based conditional policy
  GOV-STAFF-11 = ACCEPTED / LOCKED / Option B
  GOV-STAFF-12 = ACCEPTED / LOCKED / Option C

Does NOT mean:
  SharePoint / Entra / M365 mutation
  資格・研修マスター実装 / ACL / group 変更
  schema / Internal Name 発明
  分母・配置時間・勤務割合・確認周期の具体閾値発明
  UI / adapter / Implementation Start / Deploy
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
Human Acceptance: Explicit GOV-STAFF-06〜12 Options on 2026-08-12
Decision-GOV-STAFF-06-12-OPTIONS-1: Accepted / LOCKED
```

```text
Prior non-binding tips（Issue #19）:
  06 tip B / 07 tip C / 08 tip C / 12 tip C（他は tip なしまたは要決定）
Agent recommendation = NONE（≠ Human Acceptance evidence）
Coincidence of tip and Human Option ≠ tip-as-binding.
```

## Accepted 内容（単位別）

### GOV-STAFF-06 — Option B（CONFIRMED / UNCHANGED）

```text
資格・研修マスターの正本管理者 = 法人業務責任者
Prior: decision-gov-staff-06-qualification-training-master-owner-option-b-acceptance.md（PR #280）
本 Acceptance: CONFIRMED / UNCHANGED / 再 Decision しない
```

### GOV-STAFF-07 — Option C

```text
資格・研修情報の確認者 = 法人業務責任者または指定確認者
```

意味:

- 確認者は法人業務責任者、または法人が指定する確認者とする。
- 正本管理者（06）の再 Decision ではない。確認者 ≠ 正本管理者の自動同一化を強制しない。
- 個人名・名簿は本 Acceptance では確定しない。

### GOV-STAFF-08 — Option C

```text
研修割合の分母 =
  対象職種・雇用区分・所属期間をルールで明示した職員だけを分母へ含める
```

意味:

- 分母は「ルールで明示した職員だけ」とする（全在籍職員一律 / 対象職種だけ一律ではない）。
- **具体的な対象職種・雇用区分・所属期間の値は発明しない。**
- 別途、制度根拠・法人運用ルールに基づいて確定する。

### GOV-STAFF-09 — Option C

```text
兼務者の集計 =
  配置時間・勤務割合等の明示条件で集計対象を決定する
```

二重計上防止方針（LOCKED）:

1. 法人全体の人数分母では、同一職員を重複して人数加算しない。
2. 事業所別集計では、有効な所属・配置条件を満たす事業所だけに算入する。
3. 同一人物を複数事業所へ算入する必要がある指標では、単純人数加算ではなく、指標ごとに定義した集計方法を使用する。
4. **配置時間・勤務割合の閾値そのものは発明しない。**

### GOV-STAFF-10 — Option C-based conditional policy

```text
休職者: C
長期不在者: C
短期応援者: C
派遣・委託職員: C
```

意味:

- 全区分とも **期間・勤務実態の条件で判断する**。
- 一律に全員を分母へ含める（A）/ 一律除外（B）は採択しない。
- 判定日時点の勤務実態、対象期間、対象業務への従事実態に基づく。
- **具体的な日数・時間・勤務割合の閾値は発明しない。**

### GOV-STAFF-11 — Option B

```text
期限のない資格・研修 = 法人が定期確認日を設定する
```

意味:

- 制度上の有効期限がないことと、法人として確認不要であることを同一視しない。
- **`validTo` の物理データ表現や確認周期は本 Acceptance では確定しない。**

### GOV-STAFF-12 — Option C

```text
証跡欠損時の扱い =
  missing として扱う / 算定不能 / 管理者確認待ち
```

意味:

- 証跡がないことだけを理由に「未修了」と断定しない。
- 証跡がない状態を「修了」とも扱わない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  SharePoint / Entra / M365 mutation
  資格・研修マスター実装 / ACL / group 変更
  schema / Internal Name 発明
  分母・配置・確認周期の具体閾値発明
  UI / adapter
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / real data
  GOV-STAFF-06 re-Decision
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-STAFF-06-SELECTION-1 / Option B | **CONFIRMED / UNCHANGED**（PR #280） |
| Decision-GOV-STAFF-06-12-BUNDLE-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| GOV-STAFF-01〜05 | **UNCHANGED** |
| GOV-AUD-01〜10 / GOV-RULE-05〜12 | **UNCHANGED** |
| GOV-PERF | **OUT / NOT SELECTED** |
| SharePoint / M365 mutation | **HOLD / FORBIDDEN** |
| FindingCode / A-5 / Implementation | **HOLD** |

## Next

```text
GOV-STAFF-06〜12: Accepted / LOCKED（本 bundle）
next residual = GOV-RULE-01〜04 bundle（別 Decision；01/04 HOLD；02/03 Option A）
Issue #19 Close: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に閾値発明・マスター実装・tenant mutation・次 residual 自動 SELECT へ進まない。
