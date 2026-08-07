# 観察期間（Observation period）技術契約

## 目的

Issue #24 を候補所有者とする **観察期間メンバシップ判定** の技術境界を固定する
（所有の確定は Decision-OP-1 Accepted まで待つ）。

本単位は、呼び出し側が与える観察期間境界と基準時点 `asOf` について、
`Asia/Tokyo` 暦日閉区間上の所属判定だけを純粋関数として契約化する。

SupportPlan への観察期間フィールド追加、制度日数の埋め込み、Observation 記録本体の再定義は行わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24（候補・Decision 待ち）
Related: Issue #26 SupportPlan 契約（再定義しない）
Related: Issue #25 Observation 記録契約（本単位の対象外）
Prior unit: Active plan uniqueness（#76 / #78）
base main（着手時）: 2ea7d269b1e392c312ca08da3deb6b7af0663dfb
```

上位入口:

- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)
- 暦日変換の先行契約: [`active-plan-uniqueness.md`](./active-plan-uniqueness.md)

## 背景と前提（監査結果）

`issue-24-remaining-audit-pr-i-selection.md` 時点の整理:

```text
観察期間: 未実装（SupportPlan に期間フィールドなし）
制度値依存がある場合: 中〜高
フィールド定義 Decision が先
```

したがって本契約は次を分離する。

| 判断単位 | 本 PR での扱い |
|---|---|
| 純関数の所属判定境界 | **固定する**（本技術契約） |
| 制度上の観察日数・窓 | **埋め込まない / HOLD** |
| SupportPlan への期間フィールド追加 | **OUT / 別 Decision** |
| 期間境界の導出（例: Active.effectiveFrom + N日） | **OUT / 呼び出し側または別 Decision** |

## Decision 単位（Implementation Start 前に分離承認）

1 つの DEC に混ぜない。

| ID | 決める内容 | 決めない内容 |
|---|---|---|
| Decision-OP-1 | 観察期間メンバシップ純関数の所有を Issue #24 とするか | フィールド追加、制度日数 |
| Decision-OP-2 | 期間境界は関数入力とし、制度日数を domain に埋め込まないか | SupportPlan Schema 変更 |
| Decision-OP-3 | SupportPlan / SharePoint への観察期間列追加の要否（別単位） | 本純関数の実装詳細 |

本 docs-only PR は **技術契約の固定**までとする。  
上記 Decision が Accepted になるまで **Implementation Start は HOLD** とする。

## 判定対象

入力は次の3つとする。

```text
periodFrom  : 観察期間開始（ISO DateTime）
periodTo    : 観察期間終了（ISO DateTime・必須）
asOf        : 判定基準時点（ISO DateTime）
```

本単位では `periodTo` 未設定（開放終端）を許可しない。開放終端が必要なら別 Decision。

SupportPlan レコード全体、Observation 本文、ロール、永続化層を入力にしない。

## 暦日変換

Issue #26 と同様、DateTime は瞬間値として受け取り、所属判定は `Asia/Tokyo` の暦日へ変換して行う。

```text
fromDay = calendarDate(periodFrom, Asia/Tokyo)
toDay   = calendarDate(periodTo,   Asia/Tokyo)
asOfDay = calendarDate(asOf,       Asia/Tokyo)
観察期間 = [fromDay, toDay]   // 両端含む暦日閉区間
```

DateTime 瞬間の半開区間比較や、タイムゾーン未指定の文字列日付比較は用いない。

Active plan uniqueness / Issue #26 と同一の暦日変換を **MUST** 再利用する。
実装時は `toAsiaTokyoCalendarDay`（および同等の ISO DateTime 妥当性判定）を共有し、
別パーサで MALFORMED 境界が分岐しないようにする。

## 結果

純関数は次のいずれか1つを返す。

```text
IN_PERIOD
OUTSIDE_PERIOD
MALFORMED_INPUT
```

意味:

- `IN_PERIOD`: 入力が妥当で、`asOfDay` が `[fromDay, toDay]` に含まれる
- `OUTSIDE_PERIOD`: 入力が妥当で、`asOfDay` が区間外
- `MALFORMED_INPUT`: 欠損・不正 DateTime、または `fromDay > toDay` 等で安全に判定できない

不正入力を無視して `IN_PERIOD` / `OUTSIDE_PERIOD` へ倒さない（fail-closed）。

## 純関数境界

推奨シグネチャ:

```ts
evaluateObservationPeriodMembership(
  periodFrom: unknown,
  periodTo: unknown,
  asOf: unknown,
): "IN_PERIOD" | "OUTSIDE_PERIOD" | "MALFORMED_INPUT"
```

規則:

1. 例外を投げない。
2. `periodFrom` / `periodTo` / `asOf` のいずれかが ISO DateTime として不正なら `MALFORMED_INPUT`。
3. 東京暦日で `fromDay > toDay` なら `MALFORMED_INPUT`。
4. `fromDay <= asOfDay <= toDay` なら `IN_PERIOD`、それ以外は `OUTSIDE_PERIOD`。
5. ロール判定・永続化・adapter・時刻生成（`new Date()` による now）・制度日数定数を含めない。
6. `asOf` は呼び出し側が渡す。関数内で「現在時刻」を取得しない。

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
SupportPlan 永続フィールド
Observation 本文
```

## IN

- caller-supplied `periodFrom` / `periodTo` / `asOf`
- ISO DateTime → `Asia/Tokyo` 暦日変換
- 暦日閉区間メンバシップ
- `IN_PERIOD` / `OUTSIDE_PERIOD` / `MALFORMED_INPUT`
- fail-closed
- domain 純関数
- unit / contract tests

## OUT

- SupportPlan 型・status enum・Schema / DTO の変更
- SupportPlan への観察期間フィールド追加
- 制度上の観察日数・既定窓の決定
- Active.effectiveFrom 等からの期間導出ロジック
- Observation / AbcRecord の契約変更
- Active plan uniqueness / status transition の変更
- 見直し期限 / RuleSetVersion
- repository / SharePoint / Authorization / UI
- Entra ID / Microsoft 365 / deploy
- Issue #24 / #26 Close

## 必須テスト境界

- 同一東京暦日内（from=to=asOf）→ IN_PERIOD
- asOf が from より前の東京暦日 → OUTSIDE_PERIOD
- asOf が to より後の東京暦日 → OUTSIDE_PERIOD
- asOf が from/to の間 → IN_PERIOD
- periodFrom / periodTo / asOf のいずれか不正 → MALFORMED_INPUT
- fromDay > toDay → MALFORMED_INPUT
- UTC 瞬間が前日でも Tokyo 暦日へ変換されること
- 関数内で now / 制度日数定数を参照しないこと

## Entry Criteria

実装開始には次をすべて要求する。

- Decision-OP-1 / OP-2 が Accepted（所有=#24、境界は入力、制度日数を埋め込まない）
- 本技術契約と実装 Scope が一致する
- SupportPlan フィールド追加を本実装 PR に混ぜない
- repository / SharePoint 非依存の純関数として閉じる
- fail-closed 結果を維持する
- 完全合成データだけを使用する
- Active uniqueness / status transition / 見直し期限 / RuleSetVersion を混ぜない

Decision-OP-3（フィールド追加）は本純関数実装の前提にしない。

## Gate

```text
Owner: Issue #24（Decision-OP-1 待ち）
Technical contract (caller-supplied membership): FIXED in docs-only gate
Institutional day count: HOLD
SupportPlan field addition: OUT / Decision-OP-3
Implementation Start: HOLD until Decision-OP-1 and Decision-OP-2 Accepted
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

## 実装配置（Decision Accepted 後）

- `src/domain/support-plan.ts` または隣接 domain モジュール — 純関数 / Result 型
- `tests/contracts/*observation-period*contract.test.ts`
- `toAsiaTokyoCalendarDay`（および同等の ISO DateTime 妥当性判定）を **MUST** 共有する

本 docs-only PR では `src/**` / `tests/**` を変更しない。
