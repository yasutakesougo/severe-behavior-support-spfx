# Active plan uniqueness 技術契約

## 目的

Issue #24 が所有する Active 計画一意性判定の技術境界を固定する。

本書は Accepted Decision `5212085136` を正本Decisionとして使用する。

SupportPlan の型・status enum は Issue #26 の確定済み契約を再利用する。

PR-I の SupportPlan status transition へ追加実装しない。

## 判定単位

一意性は次の3項目がすべて一致する計画群の中で判定する。

```text
OrganizationId
SiteId
UserId
```

SiteId を無視した法人横断 UserId 単位の判定は行わない。

## 判定対象status

`Active` の計画だけを一意性判定対象とする。

次のstatusは一意性競合へ含めない。

```text
Draft
PendingReview
Returned
Closed
```

## 対象期間

Issue #26 の `SupportPlan` では `effectiveFrom` / `effectiveTo` は **ISO DateTime** である。

本一意性判定では、それらを瞬間値のまま比較しない。各境界を `Asia/Tokyo` の **暦日 `YYYY-MM-DD`** へ変換したうえで、Active期間を暦日の閉区間として扱う。

```text
activeDayFrom = calendarDate(effectiveFrom, Asia/Tokyo)
activeDayTo   = effectiveTo 未設定
                ? +∞（開放終端）
                : calendarDate(effectiveTo, Asia/Tokyo)
Active期間    = [activeDayFrom, activeDayTo]   // 両端含む暦日閉区間
```

同一判定単位に属する2件以上のActive計画について、暦日閉区間が1日でも共有されれば競合とする。

完全一致だけを競合条件にはしない。

同日境界の例（いずれも CONFLICT）:

```text
A.effectiveTo の東京暦日 == B.effectiveFrom の東京暦日
A と B の DateTime 瞬間が非重複でも、暦日が共有されれば CONFLICT
```

DateTime 瞬間の半開区間比較や、タイムゾーン未指定の文字列日付比較は用いない。

## 結果

純関数は入力配列全体に対して、次のいずれか1つを返す。

```text
UNIQUE
CONFLICT
MALFORMED_INPUT
```

### 単一判定単位内の意味

`UNIQUE` は、その判定単位の入力が妥当であり、Active計画間に暦日期間重複が存在しない場合に成立する。

`CONFLICT` は、同一 `OrganizationId + SiteId + UserId` に属するActive計画の暦日期間が重複する場合に成立する。

`MALFORMED_INPUT` は、判定に必要な入力が欠損・不正で安全に判定できない場合に成立する。

不正入力を無視して `UNIQUE` へ倒さない。

### 複数判定単位を含む配列の集約（必須）

入力 `readonly SupportPlan[]` は複数の `OrganizationId + SiteId + UserId` を含んでよい。関数は内部で判定単位ごとにグループ化したうえで、配列全体へ単一結果を返す。

集約の優先順位（上から適用）:

1. 入力のいずれかの要素が判定不能（必須識別子欠損、不正status、Active の不正日付、`effectiveFrom` の暦日が `effectiveTo` の暦日より後、など）なら、配列全体を `MALFORMED_INPUT` とする。
2. そうでなく、いずれかの判定単位で Active 期間競合があれば、配列全体を `CONFLICT` とする。
3. すべての判定単位が妥当かつ非競合なら、配列全体を `UNIQUE` とする。

空配列は判定単位が0件であり `UNIQUE` とする（Active 0件と同じ）。

UserId が同じでも SiteId または OrganizationId が異なれば別判定単位とし、相互の Active 期間を競合させない。

## 純関数境界

入力は Issue #26 の `SupportPlan` 契約を利用する `readonly SupportPlan[]` とする。

推奨シグネチャ（名前は実装で固定してよいが、入出力の意味は変えない）:

```ts
evaluateActivePlanUniqueness(
  plans: readonly SupportPlan[]
): "UNIQUE" | "CONFLICT" | "MALFORMED_INPUT"
```

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
```

必要な計画集合の取得責任は呼び出し側へ分離する。

## IN

- `OrganizationId + SiteId + UserId` 単位のグループ化
- 複数判定単位を含む配列の単一結果集約（MALFORMED > CONFLICT > UNIQUE）
- `Active` のみを対象とする判定
- Active期間の重複判定
- ISO DateTime → `Asia/Tokyo` 暦日変換
- 暦日閉区間境界の判定
- `effectiveTo` 未設定の開放終端
- `UNIQUE / CONFLICT / MALFORMED_INPUT`
- fail-closed
- domain純関数
- unit / contract tests

## OUT

- SupportPlan型・status enumの再定義
- SupportPlan status transitionへの変更
- Active化権限・承認ロール
- repository検索実装
- SharePoint保存・取得
- 観察期間
- 見直し期限
- RuleSetVersion選択
- SPFx / React / UI
- Entra ID / Microsoft 365
- deploy

## 必須テスト境界

- Active 0件（空配列含む） → UNIQUE
- Active 1件 → UNIQUE
- 同一判定単位で非重複Active 2件（東京暦日が隣接しない） → UNIQUE
- 同一判定単位で完全一致Active 2件 → CONFLICT
- 同一判定単位で部分重複Active 2件 → CONFLICT
- 一方の `effectiveTo` と他方の `effectiveFrom` の東京暦日が同日 → CONFLICT（DateTime瞬間が非重複でも可）
- `effectiveTo` 未設定Activeと後続Activeが東京暦日で重複 → CONFLICT
- 複数判定単位を含み、1単位だけ CONFLICT → 配列全体 CONFLICT
- 複数判定単位を含み、全単位 UNIQUE、かつ不正なし → 配列全体 UNIQUE
- 複数判定単位を含み、1件でも MALFORMED → 配列全体 MALFORMED_INPUT（CONFLICT より優先）
- UserIdが同じでもSiteIdが異なる → 相互に競合させない
- SiteIdが同じでもOrganizationIdが異なる → 相互に競合させない
- Draft / PendingReview / Returned / Closed は競合数へ含めない
- 必須識別子欠損 → MALFORMED_INPUT
- 不正日付 → MALFORMED_INPUT
- `effectiveFrom` の東京暦日が `effectiveTo` の東京暦日より後 → MALFORMED_INPUT
- 不正status等の壊れた入力をUNIQUEへ倒さない

## Entry Criteria

実装開始には次をすべて要求する。

- Accepted Decision `5212085136` が維持されている
- Issue #26 の SupportPlan 契約・status enumを再利用する
- 本技術契約と実装Scopeが一致する
- repository / SharePoint非依存の純関数として閉じる
- fail-closed結果を維持する
- 完全合成データだけを使用する
- PR-Iへ追加実装しない
- 観察期間・期限・RuleSetVersion等を混ぜない

## Gate

```text
Owner: Issue #24
Decision: 5212085136 ACCEPTED
Technical contract: FIXED in docs-only gate
Implementation Start: separate approval gate
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```
