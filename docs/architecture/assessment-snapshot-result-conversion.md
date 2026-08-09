# AssessmentSnapshot Result変換（狭域・永続なし）技術契約

この文書は、Issue #24 / AssessmentSnapshot Result変換（狭域・永続なし）の技術契約正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24
Selection comment: 5210366943
Decision comment: 5210389077
Implementation Start comment: 5210392317
基準 main: fd5fdf1f447cb5230754c878c31cdf51ee7b8bc1
親設計: docs/architecture/assessment-snapshot-result-design.md
Implementation Start: GO（承認範囲のみ）
```

上位入口: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 目的

`EvaluationDecision` を入力に、AssessmentSnapshot の **Result 候補**
（persistable / not persistable）だけを例外なしで変換する。

永続化・確定・訂正・handoff 運用は扱わない。

## 関数

```ts
toAssessmentSnapshotResultCandidate(input: unknown)
  : AssessmentSnapshotResultCandidateResult
```

入力:

```ts
{
  evaluationDecision: unknown;
  reasonCodes?: unknown;
}
```

出力:

```ts
AssessmentSnapshotResult = "NO_FINDINGS" | "FINDINGS_PRESENT" | "NOT_APPLICABLE"

AssessmentSnapshotResultCandidateResult =
  | {
      ok: true;
      persistable: true;
      result: AssessmentSnapshotResult;
      reasonCodes: readonly string[];
    }
  | {
      ok: true;
      persistable: false;
      reason: "INDETERMINATE" | "SOURCE_UNAVAILABLE";
    }
  | { ok: false; code: "MALFORMED_INPUT" | "MISSING_REASON_CODES" }
```

## 変換表

| EvaluationDecision | 結果 |
|---|---|
| `NO_FINDINGS` | PERSISTABLE `NO_FINDINGS`（reasonCodes 0件以上、省略時は `[]`） |
| `FINDINGS_PRESENT` | PERSISTABLE `FINDINGS_PRESENT`（reasonCodes 0件以上、省略時は `[]`） |
| `NOT_APPLICABLE` + reasonCodes≥1 | PERSISTABLE `NOT_APPLICABLE` |
| `NOT_APPLICABLE` + reasonCodes 不足 | `MISSING_REASON_CODES` |
| `INDETERMINATE` | NOT_PERSISTABLE `INDETERMINATE` |
| `SOURCE_UNAVAILABLE` | NOT_PERSISTABLE `SOURCE_UNAVAILABLE` |
| `demo` / `retrieval_failed` / 未知 / 非文字列 | `MALFORMED_INPUT` |

`SOURCE_UNAVAILABLE` / `INDETERMINATE` を永続 Result 3値へ倒さない。

## reasonCodes

- 各要素は `isReasonCode`
- 重複は除去（出現順維持）
- サービス別 enum は採択しない

## finding 生成資格との境界

- `decideFindingGeneration` を呼ばない・再定義しない
- criteria を見ない
- `NO_FINDINGS` / `FINDINGS_PRESENT` を生成資格結果と同一視しない

## 実装配置

- `src/domain/assessment-snapshot.ts`
- `tests/contracts/assessment-snapshot-result-conversion-contract.test.ts`
- `src/domain/index.ts` から export

## 対象外 / HOLD

- AssessmentSnapshot 保存・読込・DTO
- DEC-009 / GOV-AUD / handoff
- findingIds 必須化・完全 Finding（Entry #5: findingIds **NOT REQUIRED** / [`assessment-snapshot-finding-ids-boundary.md`](./assessment-snapshot-finding-ids-boundary.md)。完全 Finding 実装は別 HOLD）
- FindingCode カタログ
- サービス別 NOT_APPLICABLE reason enum（Entry #6: HOLD方針 = 今採択しない / [`assessment-snapshot-not-applicable-reason-hold.md`](./assessment-snapshot-not-applicable-reason-hold.md)。値一覧発明 FORBIDDEN）
- Schema / SharePoint / adapter
- deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
