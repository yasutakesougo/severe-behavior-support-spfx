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

Active期間は `effectiveFrom` から `effectiveTo` までの閉区間として扱う。

`effectiveTo` が未設定の場合は開放終端として扱う。

同一判定単位に属する2件以上のActive計画について、期間が1日でも重複すれば競合とする。

完全一致だけを競合条件にはしない。

## 結果

純関数は少なくとも次の判別可能な結果を返す。

```text
UNIQUE
CONFLICT
MALFORMED_INPUT
```

`UNIQUE` は、入力が妥当であり、同一判定単位のActive計画間に期間重複が存在しない場合だけ返す。

`CONFLICT` は、同一 `OrganizationId + SiteId + UserId` に属するActive計画の期間が重複する場合に返す。

`MALFORMED_INPUT` は、判定に必要な入力が欠損・不正で安全に判定できない場合に返す。

不正入力を無視して `UNIQUE` へ倒さない。

## 純関数境界

入力は Issue #26 の `SupportPlan` 契約を利用する `readonly SupportPlan[]` とする。

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
- `Active` のみを対象とする判定
- Active期間の重複判定
- 閉区間境界の判定
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

- Active 0件 → UNIQUE
- Active 1件 → UNIQUE
- 同一判定単位で非重複Active 2件 → UNIQUE
- 同一判定単位で完全一致Active 2件 → CONFLICT
- 同一判定単位で部分重複Active 2件 → CONFLICT
- 一方の終了日と他方の開始日が同日 → CONFLICT
- `effectiveTo` 未設定Activeと後続Activeが重複 → CONFLICT
- UserIdが同じでもSiteIdが異なる → 相互に競合させない
- SiteIdが同じでもOrganizationIdが異なる → 相互に競合させない
- Draft / PendingReview / Returned / Closed は競合数へ含めない
- 必須識別子欠損 → MALFORMED_INPUT
- 不正日付 → MALFORMED_INPUT
- `effectiveFrom > effectiveTo` → MALFORMED_INPUT
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
