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

重要:

```text
finding-audit-ownership.md の Issue #24 所有表に、
支援計画状態遷移 / Active一意性 / 観察期間 / 見直し期限計算 / RuleSetVersion選択
は現時点で割り当てられていない。

これらは Issue #26 PR #39 の Explicitly Out of Scope として記録され、
所有を Issue #24 へ自動移転する記録はない。
```

Issue #24 本体コメント API は本環境から 403/NOT_FOUND で参照不能のため、
所有コメント `5204768249` の全文再読は未実施。本監査は **main 上の docs / PR 本文** を正本とする。

### 3. Approval Dependency 照合

| 依存 | 影響する候補 | 本選定での扱い |
|---|---|---|
| Issue #19 / `GOV-AUD-01〜10` | Handoff・Snapshot保存・削除・保存期間 | 次単位へ入れない |
| `DEC-009` | Snapshot 保存タイミング | 次単位へ入れない |
| `DEC-008` / `GOV-RULE-02〜12`（PR #39 言及） | 提出・差戻し・承認ロール、制度値 | ロール・制度値は次単位へ入れない |
| 所有 Issue 未指定 | 支援計画系 5 候補全般 | **Implementation GO のブロッカー** |
| 許可遷移辺 Decision | 支援計画状態遷移 | **Implementation GO のブロッカー**（Finding lifecycle の C0 相当が未固定） |

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

### 許可遷移表（未固定・Decision 必須）

現状の状態集合（再定義しない）:

```text
Draft
PendingReview
Returned
Active
Closed
```

状態型・validator は Issue #26 / #42 で確定済み。
**許可辺一覧は未 Decision** のため、本選定では辺を確定しない。
Implementation Start 前に、Finding lifecycle の C0 相当として許可辺を固定する。

### テスト計画（実装時）

- 許可辺の成功とメタデータ付与
- 自己遷移・スキップ・逆行・Closed からの遷移拒否
- 不正 status / 必須メタデータ欠損の fail-closed
- ロール判定・永続化・時刻生成を関数内で行わないこと
- typecheck / tests / contracts-boundaries

## 判定

```text
残責務再監査: READY
Approval Dependency照合: READY
PR-I 候補選定: READY（SupportPlan status transition・狭域）
PR-I Scope固定: READY（上記）
Implementation GO: HOLD
```

### Implementation GO が HOLD である理由（必須 Decision）

1. **所有 Decision**  
   支援計画状態遷移を Issue #24 の次単位として吸収するか、Issue #26（または新規 Issue）所有のまま進めるかを明示する。  
   所有表への自動割当は行わない（Handoff と同型の規律）。

2. **許可遷移辺 Decision**  
   Draft / PendingReview / Returned / Active / Closed の許可辺を 1 表に固定する。  
   辺未固定のまま実装しない。

上記 2 点が Accepted（または実装対象外として明示）された後にのみ、Implementation Start GO とする。

## Issue #24 をどこまで安全に完了できるか

```text
安全に完了済み（純技術・#19非依存）:
  PR-C〜PR-H（Finding / Snapshot Result変換）

Issue #24 所有表上で次に進める純技術単位:
  なし（残は Decision / GOV-AUD / 所有指定待ち）

Issue #24 を拡張せずに支援計画系へ進める場合:
  所有 Decision が先（本選定の HOLD）

新しい大きな Issue へ移る前の整合的次手:
  1) 本選定の所有 + 許可辺 Decision
  2) Decision GO 後に PR-I 実装
  3) その後 Active一意性を最小単位で分離
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
