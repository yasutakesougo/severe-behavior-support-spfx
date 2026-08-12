# Decision Packet — GOV-STAFF-06〜12 資格・研修 residual bundle

この文書は、**GOV-STAFF-06〜12**（資格・研修マスター / 確認 / 分母 / 兼務 /
休職等 / 無期限資格 / 証跡欠損）の **Human Decision Packet** である。

Issue #19 所有。Human 明示 bundle。
Agent が閾値・schema・UI・tenant mutation を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-staff-06-12-qualification-training-bundle-selection.md`](./decision-gov-staff-06-12-qualification-training-bundle-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-06〜12（bundle）
Kind: Human Decision packet（bundle）
Status: Accepted / LOCKED（unit 別 Option）
Owner: Issue #19
Selected via: Decision-GOV-STAFF-06-12-BUNDLE-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Option Acceptance: decision-gov-staff-06-12-qualification-training-bundle-option-acceptance.md
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Bundle decisions（Human）

| ID | Topic | Selected | Meaning（正本要約） |
|---|---|---|---|
| GOV-STAFF-06 | 正本管理者 | **B**（CONFIRMED / UNCHANGED） | 法人業務責任者 |
| GOV-STAFF-07 | 確認者 | **C** | 法人業務責任者または指定確認者 |
| GOV-STAFF-08 | 研修割合の分母 | **C** | 対象職種・雇用区分・所属期間をルールで明示した職員だけ |
| GOV-STAFF-09 | 兼務者の集計 | **C** | 配置時間・勤務割合等の明示条件 + 二重計上防止方針 |
| GOV-STAFF-10 | 休職・長期不在・短期応援・派遣委託 | **C-based** | 全区分: 期間・勤務実態の条件で判断 |
| GOV-STAFF-11 | 期限のない資格・研修 | **B** | 法人が定期確認日を設定する |
| GOV-STAFF-12 | 証跡欠損時の扱い | **C** | `missing` / 算定不能 / 管理者確認待ち |

## 2. 判断単位の分離（混ぜない）

```text
正本管理者（06）≠ 確認者（07）
分母規則（08）≠ 兼務集計（09）≠ 休職等扱い（10）
無期限資格の確認方針（11）≠ validTo 物理表現 / 確認周期の確定
証跡欠損（12）≠ 未修了断定 ≠ 修了扱い
方針を決める ≠ 閾値・schema・UI・tenant mutation 実装開始
```

## 3. Options（Issue #19 原文 + Human fill）

### GOV-STAFF-06 — Option B（CONFIRMED）

```text
法人業務責任者
Prior Acceptance: PR #280 MERGED
本 bundle: CONFIRMED / UNCHANGED / 再 Decision しない
```

### GOV-STAFF-07 — Option C

```text
法人業務責任者または指定確認者
≠ 正本管理者の再 Decision
≠ 個人名確定
```

### GOV-STAFF-08 — Option C

```text
対象職種・雇用区分・所属期間をルールで明示した職員だけを分母へ含める
具体値（職種・雇用区分・所属期間）: NOT INVENTED here
別途、制度根拠・法人運用ルールに基づいて確定する
```

### GOV-STAFF-09 — Option C + 二重計上防止

```text
配置時間・勤務割合等の明示条件で集計対象を決定する

二重計上防止方針（Human）:
  1. 法人全体の人数分母では、同一職員を重複して人数加算しない
  2. 事業所別集計では、有効な所属・配置条件を満たす事業所だけに算入する
  3. 同一人物を複数事業所へ算入する必要がある指標では、
     単純人数加算ではなく、指標ごとに定義した集計方法を使用する
  4. 配置時間・勤務割合の閾値そのものは発明しない
```

### GOV-STAFF-10 — Option C-based（全区分）

```text
休職者: C
長期不在者: C
短期応援者: C
派遣・委託職員: C

Meaning:
  期間・勤務実態の条件で判断する
  一律全員含める / 一律全員除外: NOT SELECTED
  判定日時点の勤務実態・対象期間・対象業務への従事実態に基づく
  具体的な日数・時間・勤務割合の閾値: NOT INVENTED
```

### GOV-STAFF-11 — Option B

```text
法人が定期確認日を設定する
制度上の有効期限がない ≠ 法人として確認不要
validTo 物理表現 / 確認周期: NOT DETERMINED here
```

### GOV-STAFF-12 — Option C

```text
missing として扱う
算定不能
管理者確認待ち

証跡なし ≠ 未修了と断定
証跡なし ≠ 修了扱い
```

## 4. Explicit non-options / FORBIDDEN

```text
SharePoint / Entra / M365 mutation
資格・研修マスター実装 / ACL / group 変更
schema / Internal Name 発明
分母・配置・確認周期の具体閾値発明
UI / adapter / Implementation Start / Deploy
Issue #19 Close
次 residual auto-select
GOV-PERF SELECT
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason: ORG_POLICY / MIXED。設計 tip は Binding ではない。
閾値・個人名・schema を Agent が Binding 推薦しない。
```

## 6. After Decision

```text
GOV-STAFF-06〜12: Accepted / LOCKED（本 bundle）
GOV-PERF: OUT / NOT SELECTED
Implementation Start: DO NOT START
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-staff-06-12-qualification-training-bundle-selection.md`
- SELECT Acceptance: `decision-gov-staff-06-12-qualification-training-bundle-acceptance.md`
- Option Acceptance: `decision-gov-staff-06-12-qualification-training-bundle-option-acceptance.md`
- Issue #19 §A GOV-STAFF-06〜12
