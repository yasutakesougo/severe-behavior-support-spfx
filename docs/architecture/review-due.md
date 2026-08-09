# 見直し期限（Review due）技術契約

## 目的

Issue #24 を候補所有者とする **見直し期限と基準時点の相対判定** の技術境界を固定する
（所有の確定は Decision-RD-1 Accepted まで待つ）。

本単位は、呼び出し側が与える `reviewDueDate` と基準時点 `asOf` について、
`Asia/Tokyo` 暦日上の前後／当日関係だけを純粋関数として契約化する。

見直し期限の算出、接近窓（制度日数）、SupportPlan Schema の再定義、UI 通知は行わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24（候補・Decision-RD-1 待ち）
Related: Issue #26 SupportPlan 契約（再定義しない / MAP-PLAN-010 再利用）
Prior units: Active plan uniqueness（#76 / #78）, Observation period（#79 / #80）
base main（着手時）: 18fd03e3d2ffabe1c761bf6307861b15209fa43f
```

上位入口:

- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)
- 暦日変換の先行契約: [`active-plan-uniqueness.md`](./active-plan-uniqueness.md)
- 先行純関数単位: [`observation-period.md`](./observation-period.md)

## 背景と前提（監査結果）

`issue-24-remaining-audit-pr-i-selection.md` 時点の整理:

```text
見直し期限: フィールド reviewDueDate? の形式検証のみ
MAP-PLAN-010: 確定（ISO DateTime? / 任意）
計算・接近/超過ポリシー: PR #39 Out of Scope
期限接近窓が制度値なら中依存
asOf 比較の狭域判定は技術分離可能
```

したがって本契約は次を分離する。

| 判断単位 | 本 PR での扱い |
|---|---|
| 純関数の asOf 相対判定境界 | **固定する**（本技術契約） |
| 見直し期限日の算出（例: Active.effectiveFrom + N日） | **OUT / 呼び出し側または別 Decision** |
| 接近窓・通知ポリシー（制度日数） | **埋め込まない / HOLD** |
| 支援運用上の見直し周期（「3ヶ月に1回程度」） | **OUT**（本純関数の対象外）。GOV-RULE-06 **Accepted**: [`decision-gov-rule-06-review-cadence-acceptance.md`](./decision-gov-rule-06-review-cadence-acceptance.md) / [`review-cadence-contract.md`](./review-cadence-contract.md) |
| SupportPlan `reviewDueDate` Schema 変更 | **OUT**（MAP-PLAN-010 確定済みを再利用） |

### Practice cadence との分離（追記）

本純関数は **caller-supplied `reviewDueDate`** の東京暦日相対判定だけを扱う。
GOV-RULE-06 の practice cadence（およそ3ヶ月）を日数固定値へ変換しない。

```text
3ヶ月に1回程度 → 90日: FORBIDDEN as meaning of this contract
89 / 90 / 91 day boundaries:
  残すなら day-based relative engine の技術境界テストへ降格
  MUST NOT represent the official 3-month practice cadence rule
```

## Decision 単位（Implementation Start 前に分離承認）

1 つの DEC に混ぜない。

| ID | 決める内容 | 決めない内容 |
|---|---|---|
| Decision-RD-1 | 見直し期限 asOf 相対判定純関数の所有を Issue #24 とするか | 期限算出、接近窓、Schema 変更 |
| Decision-RD-2 | `reviewDueDate` / `asOf` は関数入力とし、制度接近窓を domain に埋め込まないか | 通知・UI・永続化 |
| Decision-RD-3 | 接近窓・超過後ポリシー（制度日数）の要否（別単位） | 本純関数の実装詳細・practice cadence |
| GOV-RULE-06 | 見直し周期 practice cadence（**Accepted** / [`review-cadence-contract.md`](./review-cadence-contract.md)） | 本純関数・超過定義 |
| GOV-RULE-05 | 見直し周期の基準日（**Accepted** / [`review-anchor-contract.md`](./review-anchor-contract.md)） | 本純関数・due 算出実装・超過定義 |
| GOV-RULE-07 | 通知開始（**Accepted** / Option C / [`review-notice-contract.md`](./review-notice-contract.md)） | 本純関数・due/overdue・日数接近窓 |
| GOV-RULE-08 | due / overdue 業務定義（READY_FOR_HUMAN_DECISION / [`decision-gov-rule-08-due-overdue-decision-packet.md`](./decision-gov-rule-08-due-overdue-decision-packet.md)） | 本純関数の再定義・90日規則・通知=overdue |

本 docs-only PR は **技術契約の固定**までとする。  
Decision-RD-1 / RD-2 が Accepted になるまで **Implementation Start は HOLD** とする。

Decision-RD-3 および GOV-RULE-06 は本純関数実装の前提にしない。
GOV-RULE-06 を `duration_days = 90` として本契約へ埋め込まない。

## 判定対象

入力は次の2つとする。

```text
reviewDueDate : 見直し期限（ISO DateTime・本関数では必須）
asOf          : 判定基準時点（ISO DateTime）
```

本単位では `reviewDueDate` 未設定を許可しない。SupportPlan 上の任意フィールド（キー欠落=未設定）は呼び出し側が扱う。未設定のまま本関数へ渡す場合は `MALFORMED_INPUT`（fail-closed）。

SupportPlan レコード全体、Observation 本文、ロール、永続化層、接近窓日数を入力にしない。

## 暦日変換

Issue #26 と同様、DateTime は瞬間値として受け取り、比較は `Asia/Tokyo` の暦日へ変換して行う。

```text
dueDay  = calendarDate(reviewDueDate, Asia/Tokyo)
asOfDay = calendarDate(asOf,          Asia/Tokyo)
```

DateTime 瞬間の半開区間比較や、タイムゾーン未指定の文字列日付比較は用いない。

Active plan uniqueness / observation period / Issue #26 と同一の暦日変換を **MUST** 再利用する。
実装時は `toAsiaTokyoCalendarDay`（および同等の ISO DateTime 妥当性判定）を共有し、
別パーサで MALFORMED 境界が分岐しないようにする。

## 結果

純関数は次のいずれか1つを返す。

```text
BEFORE_DUE
DUE
OVERDUE
MALFORMED_INPUT
```

意味:

- `BEFORE_DUE`: 入力が妥当で、`asOfDay < dueDay`
- `DUE`: 入力が妥当で、`asOfDay === dueDay`（東京暦日当日）
- `OVERDUE`: 入力が妥当で、`asOfDay > dueDay`
- `MALFORMED_INPUT`: 欠損・不正 DateTime 等で安全に判定できない

不正入力を無視して `BEFORE_DUE` / `DUE` / `OVERDUE` へ倒さない（fail-closed）。

接近窓（例: 期限 N 日前）を本結果集合へ混ぜない。接近判定が必要なら Decision-RD-3 後の別単位とする。
practice cadence（およそ3ヶ月）や `duration_days = 90` を本結果集合の意味にしない。

## 純関数境界

推奨シグネチャ:

```ts
evaluateReviewDueRelativeToAsOf(
  reviewDueDate: unknown,
  asOf: unknown,
): "BEFORE_DUE" | "DUE" | "OVERDUE" | "MALFORMED_INPUT"
```

規則:

1. 例外を投げない。
2. `reviewDueDate` / `asOf` のいずれかが ISO DateTime として不正なら `MALFORMED_INPUT`。
3. `asOfDay < dueDay` → `BEFORE_DUE`。
4. `asOfDay === dueDay` → `DUE`。
5. `asOfDay > dueDay` → `OVERDUE`。
6. ロール判定・永続化・adapter・時刻生成（`new Date()` による now）・制度接近窓定数・期限算出を含めない。
7. `asOf` は呼び出し側が渡す。関数内で「現在時刻」を取得しない。

判定関数自身は次へ依存しない。

```text
repository
SharePoint
adapter
Authorization
SPFx
React
UI
Microsoft 365
SupportPlan 永続化
Observation 本文
制度接近窓日数
```

## IN

- caller-supplied `reviewDueDate` / `asOf`
- ISO DateTime → `Asia/Tokyo` 暦日変換
- 東京暦日の前後／当日関係
- `BEFORE_DUE` / `DUE` / `OVERDUE` / `MALFORMED_INPUT`
- fail-closed
- domain 純関数
- unit / contract tests
- 既存 MAP-PLAN-010 `reviewDueDate?` 契約の再利用（変更しない）

## OUT

- SupportPlan 型・status enum・Schema / DTO の変更
- `reviewDueDate` の算出・既定付与
- 接近窓・通知・超過後ポリシー（制度日数）
- GOV-RULE-06 practice cadence / ReviewCadence 型の導入（[`review-cadence-contract.md`](./review-cadence-contract.md)）
- `duration_days = 90` を正式な見直し周期として保存すること
- Observation / AbcRecord の契約変更
- Active plan uniqueness / status transition / observation period の変更
- RuleSetVersion 選択
- repository / SharePoint / Authorization / UI
- Entra ID / Microsoft 365 / deploy
- Issue #24 / #26 Close

## 必須テスト境界

- asOf の東京暦日が due より前 → BEFORE_DUE
- asOf の東京暦日が due と同日 → DUE
- asOf の東京暦日が due より後 → OVERDUE
- reviewDueDate / asOf のいずれか不正 → MALFORMED_INPUT
- reviewDueDate / asOf が undefined / null / 空 → MALFORMED_INPUT
- UTC 瞬間が前日でも Tokyo 暦日へ変換されること（due / asOf 双方）
- 関数内で now / 制度接近窓定数 / 期限算出を参照しないこと

## Entry Criteria

実装開始には次をすべて要求する。

- Decision-RD-1 / RD-2 が Accepted（所有=#24、境界は入力、制度接近窓を埋め込まない）
- 本技術契約と実装 Scope が一致する
- SupportPlan Schema / MAP-PLAN-010 を本実装 PR で変更しない
- repository / SharePoint 非依存の純関数として閉じる
- fail-closed 結果を維持する
- 完全合成データだけを使用する
- Active uniqueness / status transition / observation period / RuleSetVersion を混ぜない

Decision-RD-3（接近窓ポリシー）は本純関数実装の前提にしない。

## Gate

```text
Owner: Issue #24（候補・Decision-RD-1 待ち）
Technical contract (asOf relative due comparison): FIXED in docs-only gate
Institutional approaching window: HOLD / Decision-RD-3
Practice cadence (GOV-RULE-06): Accepted / OUT of this pure function / see review-cadence-contract.md
3ヶ月 → 90日 conversion: FORBIDDEN
reviewDueDate calculation: OUT
SupportPlan Schema change: OUT（MAP-PLAN-010 再利用）
Implementation Start: HOLD until Decision-RD-1 and Decision-RD-2 Accepted
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

## 実装配置（Decision Accepted 後）

- `src/domain/support-plan.ts` または隣接 domain モジュール — 純関数 / Result 型
- `tests/contracts/*review-due*contract.test.ts`
- `toAsiaTokyoCalendarDay`（および同等の ISO DateTime 妥当性判定）を **MUST** 共有する

本 docs-only PR では `src/**` / `tests/**` を変更しない。
