# RuleSetVersion選択 技術契約

## 目的

Issue #24 を候補所有者とする **RuleSetVersion 選択** の技術境界を固定する
（所有の確定は Decision-RSV-1 Accepted まで待つ）。

本単位は、呼び出し側が与える候補集合と基準時点 `asOf` について、
有効期間メンバシップに基づく選択だけを純粋関数として契約化する。

RuleSetVersion カタログ本体、FindingIdentity / AssessmentSnapshot の再定義、
制度上の版切替方針、SharePoint 永続化は行わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24（候補・Decision-RSV-1 待ち）
Related: Issue #27 FindingIdentity.ruleSetVersion（再定義しない・呼び出し元入力文字列）
Related: Issue #26 SupportPlan 契約（RuleSetVersion 非存在・再定義しない）
Prior units:
  Active plan uniqueness（#76 / #78）
  Observation period（#79 / #80）
  Review due（#81 / #82）
base main（着手時）: 3810903b0db39464342e9429d0bc9fbd83ef2df2
```

上位入口:

- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)
- Finding 側の既存文字列契約: [`finding-identity-assembly.md`](./finding-identity-assembly.md)
- 暦日変換の先行契約: [`active-plan-uniqueness.md`](./active-plan-uniqueness.md)
- 期間メンバシップ先行単位: [`observation-period.md`](./observation-period.md)
- 直前完了単位: [`review-due.md`](./review-due.md)

## 関連Issue / PR

| 種別 | 参照 |
|---|---|
| Issue | #24（RuleSetVersion選択は後続候補・各単位 Decision まで HOLD） |
| 直前完了 | PR #82 MERGED（見直し期限 asOf 相対判定純関数） |
| 選定正本 | PR #73 / `issue-24-remaining-audit-pr-i-selection.md` |
| FindingIdentity | Issue #27 / PR #41（`ruleSetVersion` = 非空文字列） |
| 再発判定 | PR #67（Q2-A: `ruleSetVersion` 差は再発対象外。**選択は扱わない**） |

## 既存正本（再定義しない）

| 正本 | 本単位との関係 |
|---|---|
| `FindingIdentity.ruleSetVersion` | 選択結果が後段へ渡す **不透明な非空文字列**。形式・カタログを再定義しない |
| `validateFindingIdentity` / `assembleFindingIdentity` | Identity 組立は別契約。本単位は選択のみ |
| `decideFindingRecurrence` Q2-A | 版差の再発除外のみ。選択アルゴリズムではない |
| AssessmentSnapshot Result 設計の `ruleSetVersion` 言及 | 永続証跡要件の記述。選択関数ではない |
| SupportPlan / SupportPlanVersion | RuleSetVersion フィールドを持たない。本単位で追加しない |
| observation-period / review-due / active-plan-uniqueness | 暦日・fail-closed・caller-supplied `asOf` の先行パターンを再利用 |

## 監査結果

`issue-24-remaining-audit-pr-i-selection.md` および main `3810903…` 時点の read-only 監査:

```text
RuleSetVersion 選択: 未契約
SupportPlan: RuleSetVersion 非存在
domain / contracts: RuleSetVersion 実体型・有効期間 Schema なし
Finding / AuditEvent: ruleSetVersion は呼び出し元入力の非空文字列のみ
選択基準（有効期間・優先順位・該当なし）: 制度・評価運用依存 → 中〜高
配列順・version 文字列大小比較を優先順位とする正本: なし
関数内 now() 取得の正本: なし（先行 asOf 単位はすべて caller-supplied）
```

したがって本契約は次を分離する。

| 判断単位 | 本 PR での扱い |
|---|---|
| 純関数の選択境界（入力・結果・fail-closed） | **固定する**（本技術契約） |
| 所有 Issue | **Decision-RSV-1** |
| 選択基準を asOf + 候補有効期間に限定するか | **Decision-RSV-2** |
| 同一 asOf で複数適用可能時の業務扱い | **Decision-RSV-3** |
| 該当なし時の業務扱い | **Decision-RSV-4** |
| RuleSetVersion カタログ / SharePoint 列 / Schema | **OUT** |
| version 文字列・ID の大小比較による優先 | **禁止**（意味不明のまま採用しない） |

## Decision一覧（Implementation Start 前に分離承認）

1 つの DEC に混ぜない。不要な Decision は作らない。

| ID | 決める内容 | 決めない内容 |
|---|---|---|
| Decision-RSV-1 | RuleSetVersion選択純関数の所有を Issue #24 とするか | カタログ、Schema、永続化 |
| Decision-RSV-2 | 選択基準を caller-supplied `asOf` と候補の有効期間だけに限定するか | 制度版切替カレンダー本体 |
| Decision-RSV-3 | 同一 `asOf` で複数 RuleSetVersion が有効な場合の業務上の扱い（技術契約案は `CONFLICT` fail-closed） | version 文字列比較・配列順による tie-break |
| Decision-RSV-4 | 該当 RuleSetVersion が存在しない場合の扱い（技術契約案は `NONE` fail-closed） | UI 文言・代替版の自動補完 |

本 docs-only PR は **技術契約の固定**までとする。  
Decision-RSV-1〜RSV-4 が Accepted になるまで **Implementation Start は HOLD** とする。

技術契約案（RSV-3 / RSV-4）は、複数適用を `CONFLICT`・該当なしを `NONE` とし、不正入力を成功へ倒さない fail-closed を提案するだけであり、Accepted 前に実装へ埋め込まない。
（参考: Active uniqueness も集合全体を fail-closed 集約する。`selectAssessmentScoreSource` は一部不正レコードをスキップし得るため、本単位の「要素不正→集合全体 MALFORMED」とは同一実装ではない。）

## 技術境界

```text
純関数境界: domain only
依存禁止: repository / SharePoint / adapter / Authorization / SPFx / React / UI / Microsoft 365
時刻: asOf は caller-supplied。関数内で現在時刻を取得しない（new Date() now 禁止）
順序: SharePoint 取得順・配列順に依存しない
優先: version 文字列 / ID の辞書順・数値化比較を優先順位に使わない
```

## 入力

入力は次の2つとする。

```text
candidates : 候補集合（配列形状を許容するが、順序に意味を持たせない）
asOf       : 判定基準時点（ISO DateTime）
```

### 選択単位（候補要素）

呼び出し側が渡す各候補は、少なくとも次を持つ。

```text
ruleSetVersion : 不透明な非空文字列（FindingIdentity.ruleSetVersion と同型の識別子）
effectiveFrom  : 有効開始（ISO DateTime）
effectiveTo    : 有効終了（ISO DateTime・本単位では必須）
```

本単位では `effectiveTo` 未設定（開放終端）を許可しない。開放終端が必要なら別 Decision。

候補のその他属性（説明文、優先度スコア、SharePoint 行 ID、取得順）は選択に用いない。

SupportPlan レコード全体、Finding 本体、AssessmentSnapshot、ロール、永続化層を入力にしない。

### 適用対象の定義（Decision-RSV-2 前提の技術案）

`asOf` に対する **適用対象** は、次をすべて満たす候補とする。

```text
1. 候補要素として形式妥当である
2. fromDay = calendarDate(effectiveFrom, Asia/Tokyo)
   toDay   = calendarDate(effectiveTo,   Asia/Tokyo)
   asOfDay = calendarDate(asOf,          Asia/Tokyo)
3. fromDay <= asOfDay <= toDay   // 東京暦日閉区間・両端含む
```

DateTime 瞬間の半開区間比較や、タイムゾーン未指定の文字列日付比較は用いない。

Active plan uniqueness / observation period / review due / Issue #26 と同一の暦日変換を **MUST** 再利用する。
実装時は `toAsiaTokyoCalendarDay`（および同等の ISO DateTime 妥当性判定）を共有し、
別パーサで MALFORMED 境界が分岐しないようにする。

## 結果

純関数は次のいずれか1つを返す（技術契約案。RSV-3 / RSV-4 Accepted で確定）。

```text
SELECTED         // 適用対象がちょうど1件。その ruleSetVersion を返す
NONE             // 入力妥当だが適用対象が0件（Decision-RSV-4）
CONFLICT         // 入力妥当だが適用対象が2件以上（Decision-RSV-3）
MALFORMED_INPUT  // 欠損・不正・矛盾で安全に選択できない
```

推奨 Result 形状:

```ts
SelectRuleSetVersionResult =
  | { ok: true; decision: "SELECTED"; ruleSetVersion: string }
  | { ok: false; code: "NONE" | "CONFLICT" | "MALFORMED_INPUT" }
```

- `SELECTED` の `ruleSetVersion` は入力候補の文字列と同一（trim / NFKC / 大小折りたたみなし）
- 不正入力を無視して `SELECTED` / `NONE` へ倒さない（fail-closed）
- 複数適用時に「どれか1つ」を黙って選ばない
- 該当なし時に既定版へフォールバックしない

## 純関数境界

推奨シグネチャ:

```ts
selectRuleSetVersion(
  candidates: unknown,
  asOf: unknown,
): SelectRuleSetVersionResult
```

### fail-closed規則

1. 例外を投げない。
2. `asOf` が ISO DateTime として不正なら `MALFORMED_INPUT`。
3. `candidates` が配列でないなら `MALFORMED_INPUT`。
4. いずれかの候補が形式不正（`ruleSetVersion` 非空文字列でない、DateTime 不正、`fromDay > toDay` 等）なら、集合全体を `MALFORMED_INPUT`（部分成功しない）。
5. 同一 `ruleSetVersion` 文字列が候補集合に重複して現れたら `MALFORMED_INPUT`（集合として一意でない）。
6. 適用対象が0件 → `NONE`（Decision-RSV-4 Accepted 後）。
7. 適用対象が2件以上 → `CONFLICT`（Decision-RSV-3 Accepted 後）。配列順・SharePoint順・version 文字列大小で tie-break しない。
8. 適用対象がちょうど1件 → `SELECTED`。
9. ロール判定・永続化・adapter・時刻生成（`new Date()` による now）・制度版切替定数・version 比較ソートを含めない。
10. `asOf` は呼び出し側が渡す。関数内で「現在時刻」を取得しない。

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
Finding / AssessmentSnapshot 永続化
RuleSetVersion カタログ本体
```

## 優先順位 / 重複時の扱い

| 状況 | 扱い |
|---|---|
| 適用対象 1件 | `SELECTED` |
| 適用対象 2件以上 | `CONFLICT`（fail-closed）。優先順位表・semver・辞書順・配列末尾優先は採用しない |
| 同一 `ruleSetVersion` の重複候補 | `MALFORMED_INPUT` |
| SharePoint / 配列の出現順が異なるだけの同等入力 | 同一結果（順序非依存） |

業務上の別 tie-break が必要なら Decision-RSV-3 で明示し、本技術案の `CONFLICT` を置き換える。推測で追加しない。

## 該当なし時の扱い

適用対象0件は `NONE`（fail-closed）。既定 RuleSetVersion への自動選択、空文字、最新版推測は禁止する。

業務上 `NONE` 以外の結果名や後段ポリシーが必要なら Decision-RSV-4 で明示する。

## IN

- caller-supplied `candidates` / `asOf`
- 候補の `ruleSetVersion` + `effectiveFrom` / `effectiveTo`
- ISO DateTime → `Asia/Tokyo` 暦日変換
- 暦日閉区間メンバシップに基づく選択
- `SELECTED` / `NONE` / `CONFLICT` / `MALFORMED_INPUT`
- fail-closed
- 配列順非依存
- version 文字列大小比較の非採用
- domain 純関数
- unit / contract tests

## OUT

- `src/**` / `tests/**` の本 docs-only PR での変更
- RuleSetVersion カタログ・採番・業務ラベル
- SupportPlan / FindingIdentity / AssessmentSnapshot / Observation の型・Schema 変更
- SharePoint 列追加・repository / adapter
- Finding 生成条件・再発判定・lifecycle の変更
- version 文字列 / ID の大小比較による優先順位
- 関数内現在時刻取得
- Authorization / SPFx / React / UI
- Entra ID / Microsoft 365 / deploy
- Issue #24 / #26 / #27 Close

## Entry Criteria

実装開始には次をすべて要求する。

- Decision-RSV-1〜RSV-4 が Accepted（所有=#24、基準=asOf+有効期間、複数時、該当なし）
- 本技術契約と実装 Scope が一致する
- FindingIdentity / SupportPlan / AssessmentSnapshot を本実装 PR で再定義しない
- repository / SharePoint 非依存の純関数として閉じる
- fail-closed 結果を維持する
- 配列順・version 文字列比較に依存しない
- 完全合成データだけを使用する
- Active uniqueness / status transition / observation period / review due を混ぜない

## 必須テスト境界

- 適用対象がちょうど1件 → SELECTED（返却文字列は入力と同一）
- 適用対象0件 → NONE
- 適用対象2件以上（期間重複） → CONFLICT
- 候補配列の順序を入れ替えても同一結果
- version 文字列の辞書順・見かけの新旧で SELECTED へ倒さないこと
- asOf / effectiveFrom / effectiveTo のいずれか不正 → MALFORMED_INPUT
- fromDay > toDay → MALFORMED_INPUT
- candidates が配列でない / 要素欠損 → MALFORMED_INPUT
- 同一 ruleSetVersion の重複候補 → MALFORMED_INPUT
- UTC 瞬間が前日でも Tokyo 暦日へ変換されること
- 関数内で now / SharePoint / 配列順 tie-break を参照しないこと

## Implementation Start Gate

```text
Owner: Issue #24（候補・Decision-RSV-1 待ち）
Technical contract (selection boundary): FIXED in docs-only gate
Selection criteria (asOf + validity period only): HOLD / Decision-RSV-2
Multiple applicable at same asOf: HOLD / Decision-RSV-3（技術案=CONFLICT）
None applicable: HOLD / Decision-RSV-4（技術案=NONE）
RuleSetVersion catalog / Schema / SharePoint: OUT
version string ordering as priority: FORBIDDEN
Implementation Start: HOLD
  （Decision-RSV-1〜RSV-4 がすべて Accepted の場合のみ GO）
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

**docs-only PR の Merge と Implementation Start GO を混同しない。**  
本契約ドキュメントが main に入っても、未 Accepted Decision がある限り実装開始は HOLD のままとする。

## 実装配置（Decision Accepted 後・参考）

- `src/domain/` 配下の純関数モジュール（配置は実装 PR で確定。既存 FindingIdentity を再定義しない）
- `tests/contracts/*ruleset-version-selection*contract.test.ts`
- `toAsiaTokyoCalendarDay`（および同等の ISO DateTime 妥当性判定）を **MUST** 共有する

本 docs-only PR では `src/**` / `tests/**` を変更しない。
