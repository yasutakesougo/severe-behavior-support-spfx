# Issue #24 残責務再監査 / PR-I 選定

この文書は、PR-H（AssessmentSnapshot Result変換）完了後の Issue #24 残責務再監査と、
次の 1 実装単位（PR-I 候補）の Scope 固定正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 9232b8a8d549c306f88e4cbf1feae026b08e36e8
PR #72 / PR-H: MERGED
merged head: 6d30bc40148225a4c9784b3807fe59d4910a7c88
Issue #24: OPEN
deploy: NO-GO
SharePoint / M365: 変更なし
verify:contracts: PASS（基準時点の固定状態）
typecheck: PASS
tests: 254 / 254 PASS
contracts-boundaries: PASS
```

上位入口: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

除外（本監査の選定対象外・完了扱い）:

```text
Finding 生成条件（PR-E）
FindingIdentity 組立（PR-F）
finding 再発判定（PR-G）
AssessmentSnapshot Result変換・永続なし（PR-H）
```

自動的に次単位へ入れない（継続 HOLD）:

```text
Handoff 状態遷移（所有未確定・Issue #24へ自動割当しない）
AssessmentSnapshot 保存・読込・DTO・完全契約（DEC-009 / GOV-AUD）
具体的な承認ロール
制度・法人運用値
SharePoint 永続化 / adapter / Entra ID / Microsoft 365
deploy / 実データ
Issue #24 Close
```

## 監査手順結果

### 1. Issue #24 所有表上の残責務

| 単位 | 所有表状態 | Issue #19 依存 | 独立実装可否 |
|---|---|---|---|
| Finding lifecycle / 生成 / 安定ID / Identity / 再発 / Snapshot Result変換 | 完了（PR-C〜H） | なし（実装済み） | 対象外 |
| AssessmentSnapshot 完全契約・保存 | HOLD | `DEC-009` / `GOV-AUD-03` 等 | **不可** |
| FindingCode 業務カタログ | HOLD | カタログ Decision 待ち（GOV-AUD ではない） | Decision 前は不可 |
| FindingSeverity / 完全 Finding | HOLD | DEC 方式 A/B 未選択 | **不可** |
| Handoff transition | 所有未確定 | `GOV-AUD-02`（ロール） | 所有指定まで **不可** |

結論（Finding/Snapshot 軸）:

- Issue #19 未決定値を必要としない **純粋技術境界は、PR-H までに Finding/Snapshot Result 系で概ね消化済み**。
- 残る Issue #24 所有表上の単位は、いずれも Decision / GOV-AUD / 所有指定待ち。

### 2. 優先確認対象（支援計画系）と正本上の所有

優先確認リスト（本選定入力）:

1. 支援計画状態遷移
2. Active 一意性
3. 観察期間
4. 見直し期限
5. RuleSetVersion 選択

リポジトリ正本との照合:

| 候補 | 現状実装 | 正本上の位置 | Issue #19 依存 | 備考 |
|---|---|---|---|---|
| 支援計画状態遷移 | **未実装**（validator / DTO / port のみ） | Issue #26 / PR #39 Explicitly Out of Scope | ロールを除外すれば **低** | Finding lifecycle / ABC transition と同型の純粋技術境界候補 |
| Active 一意性 | **未実装**（`findCurrentByUser` port 名のみ） | 同上 | **低** | 入力集合に対する純粋判定として分離可能 |
| 観察期間 | **未実装**（SupportPlan に期間フィールドなし） | 同上 | 期間定義が制度値なら **中〜高** | フィールド定義 Decision が先 |
| 見直し期限 | フィールド `reviewDueDate?` の形式検証のみ | MAP-PLAN-010 確定 / 計算は PR #39 Out of Scope | 期限接近窓が制度値なら **中** | `asOf` 比較の狭域判定は技術分離可能 |
| RuleSetVersion 選択 | SupportPlan に非存在。Finding 側は呼び出し元入力文字列 | FindingIdentity / AuditEvent | 選択方針が制度・評価運用なら **中〜高** | 「選択」そのものは未契約 |

重要（監査時点）:

```text
finding-audit-ownership.md の Issue #24 所有表に、
支援計画状態遷移 / Active一意性 / 観察期間 / 見直し期限計算 / RuleSetVersion選択
は当初割り当てられていなかった。

これらは Issue #26 PR #39 の Explicitly Out of Scope として記録され、
所有を Issue #24 へ自動移転する記録はなかった。
```

Issue #24 本体コメント API は本環境から 403/NOT_FOUND で参照不能のため、
所有コメント `5204768249` の全文再読は未実施。本監査は **main / PR 上の docs** を正本とする。

### 3. Approval Dependency 照合

| 依存 | 影響する候補 | 本選定での扱い |
|---|---|---|
| Issue #19 / `GOV-AUD-01〜10` | Handoff・Snapshot保存・削除・保存期間 | 次単位へ入れない |
| `DEC-009` | Snapshot 保存タイミング | 次単位へ入れない |
| `DEC-008` / `GOV-RULE-02〜12`（PR #39 言及） | 提出・差戻し・承認ロール、制度値 | ロール・制度値は次単位へ入れない |
| 所有 Issue | 支援計画状態遷移 | Recommended: Issue #24。**GitHub Accepted 待ち** |
| 許可遷移辺 | 支援計画状態遷移 | Recommended: 下記 5 辺。**GitHub Accepted 待ち** |

## Recommended Decision（設計推奨・GitHub Accepted 未記録）

次の 2 点は設計上の推奨 Decision である。
**GitHub Issue #24 上の Accepted Decision にはまだ変更していない。**
Accepted 記録後にのみ Implementation GO へ進む。

投稿案: [`issue-24-pr-i-decision-comment-draft.md`](./issue-24-pr-i-decision-comment-draft.md)

### Decision 1: 所有

```text
PR-I ownership: Issue #24
```

境界分離:

```text
#26
  SupportPlan / SupportPlanVersion
  status enum
  Schema / DTO
  repository port
        ↓
#24
  SupportPlan status transition
  Active一意性（後続単位）
  期限・期間等の純粋ルール（後続単位）
```

状態 enum 自体は #26、状態遷移関数は #24。

### Decision 2: PR-I 許可辺（5 辺のみ）

| from | to |
|---|---|
| Draft | PendingReview |
| PendingReview | Returned |
| Returned | Draft |
| PendingReview | Active |
| Active | Closed |

それ以外は fail-closed で拒否する。特に次を許可しない:

```text
Draft → Active
Closed → Active
Active → Draft
Active → PendingReview
Returned → Active
Closed → *
自己遷移 / 上記以外のスキップ・逆行
```

### Decision 2 補足（PR-I OUT OF SCOPE）

```text
Role authorization: OUT OF SCOPE
Active uniqueness: OUT OF SCOPE
Observation / Review deadline: OUT OF SCOPE
RuleSetVersion: OUT OF SCOPE
```

PR-I は「現在状態＋要求遷移 → 許可/拒否」だけを担当する純関数として閉じる。
メタデータ付与の詳細契約は Implementation Start 後の技術契約で固定する（ロール判定は含めない）。

## 選定結果（1 件）

```text
PR-I 候補:
  SupportPlan status transition（狭域・ロールなし・永続なし）

選定理由:
  1. Issue #19 未決定値を埋め込まずに定義できる純粋技術境界である
  2. 既存 SupportPlanStatus / 状態別必須メタデータ契約を再定義しない
  3. ABC transition / Finding lifecycle と同じ fail-closed パターンへ落とせる
  4. Active一意性・観察期間・見直し期限計算・RuleSetVersion選択より前提が少ない
  5. ロール・SharePoint・Snapshot・Handoff を混ぜない
```

Active 一意性は第 2 候補（別 PR）とする。遷移成功後の整合検査として分離し、本単位へ混ぜない。

観察期間・見直し期限の制度窓・RuleSetVersion 選択方針は、本単位の対象外とし継続 HOLD。

## PR-I 候補 Scope（固定）

### 実装目的（1 文）

`SupportPlanStatus` の許可遷移と、遷移後に必要な状態別メタデータ付与だけを、例外を投げない domain 純粋関数として契約化する。

### 対象範囲

- 許可遷移表（Decision で固定した辺のみ）
- `transitionSupportPlanStatus`（名称は実装時に技術契約で確定）相当の純粋関数
- fail-closed Result（例: `MALFORMED_INPUT` / `INVALID_TRANSITION` / 必須メタデータ不足）
- 合成 fixture / contract tests
- 技術契約 docs（本選定承認後に新規作成）
- ownership / foundation の状態更新

### 対象外

- 提出・差戻し・承認・終了の **具体ロール**
- Active 一意性判定
- 観察期間の定義・計算
- 見直し期限の算出・接近/超過ポリシー（制度日数）
- RuleSetVersion 選択
- Repository / SharePoint 永続化
- DEC-008 / GOV-RULE / GOV-AUD / DEC-009
- Handoff / Finding / AssessmentSnapshot
- SPFx UI / Entra ID / Microsoft 365 / deploy / 実データ
- Issue #24 / #26 Close

### 変更対象（予定）

```text
src/domain/support-plan.ts
tests/contracts/support-plan-*-contract.test.ts（または新規 transition contract）
tests/domain/support-plan-fixtures.ts（必要時）
docs/architecture/support-plan-lifecycle-transition.md（新規・承認後）
docs/architecture/finding-audit-ownership.md または foundation（所有記録更新）
```

### 許可遷移表（Recommended・GitHub Accepted 待ち）

現状の状態集合（再定義しない）:

```text
Draft
PendingReview
Returned
Active
Closed
```

状態型・validator は Issue #26 / #42 で確定済み。
許可辺は上記 Recommended Decision 2 の **5 辺のみ**（GitHub Accepted 待ち）。

### テスト計画（実装時）

- 許可 5 辺の成功
- Draft→Active / Returned→Active / Active→Draft / Active→PendingReview / Closed→* / 自己遷移の拒否
- 不正 status の fail-closed（`MALFORMED_INPUT`）
- ロール判定・Active一意性・期限・RuleSetVersion・永続化・時刻生成を関数内で行わないこと
- typecheck / tests / contracts-boundaries

## 判定

```text
残責務再監査: READY
Approval Dependency照合: READY
PR-I 候補選定: READY（SupportPlan status transition・狭域）
PR-I Scope固定: READY（上記 + Recommended 5辺）
Recommended Decision 1（ownership=#24）: READY（設計推奨）
Recommended Decision 2（allowed 5 edges）: READY（設計推奨）
GitHub Accepted Decision: HOLD（未記録）
Implementation GO: HOLD
```

### Implementation GO が HOLD である理由

1. Recommended Decision 1/2 は設計推奨として正本へ反映済み。
2. **GitHub Issue #24 上の Accepted Decision が未記録**。
3. Issue 投稿は人の事前承認操作であり、本環境から Issue #24 への自動投稿は行わない。
4. Accepted 記録（コメント ID 付き）の後に、正本の Decision 状態を Accepted へ更新し、Implementation GO を再判定する。

## Issue #24 をどこまで安全に完了できるか

```text
安全に完了済み（純技術・#19非依存）:
  PR-C〜PR-H（Finding / Snapshot Result変換）

PR-I（SupportPlan status transition）:
  Recommended ownership=#24 / allowed 5 edges まで固定済み
  GitHub Accepted → Implementation GO → 実装 の順

後続（PR-Iに混ぜない）:
  Active一意性、観察期間、見直し期限、RuleSetVersion選択、ロール
```

## 次工程（Accepted 後）

```text
1. Issue #24 へ Decision コメントを Accepted として記録
   （案: issue-24-pr-i-decision-comment-draft.md）
2. 本正本と finding-audit-ownership.md を Accepted + comment ID 付きへ更新
3. Implementation GO 判定
4. GO 後にのみ src/** / tests/** / 技術契約実装へ着手
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** 実装: Implementation GO まで禁止（本 PR は docs-only）
```
