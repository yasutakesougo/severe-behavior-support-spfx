# finding 生成条件 技術契約

この文書は、Issue #24 / finding 生成条件に関する技術契約正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24
input: criteria（CriterionResult[]）
Implementation Start: GO（承認範囲のみ）
```

上位入口: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 目的

`CriterionResult` 配列だけを見て、「Finding を生成すべきか / すべきでないか」を
例外なしで判定する。

本契約は **生成資格（eligibility）** のみを固定する。
Finding 本体・FindingCode・Identity・安定ID・lifecycle・永続化は扱わない。

## 関数

```ts
decideFindingGeneration(input: unknown): FindingGenerationDecisionResult
```

入力:

```ts
{ criteria: unknown }
```

出力:

```ts
FindingGenerationDecisionResult =
  | { ok: true; decision: "GENERATE_REQUIRED" }
  | {
      ok: true;
      decision: "DO_NOT_GENERATE";
      reason:
        | "EMPTY_CRITERIA"
        | "NO_FAILING_CRITERIA"
        | "ALL_NOT_APPLICABLE"
        | "HAS_UNKNOWN";
    }
  | { ok: false; code: "MALFORMED_INPUT" }
```

## GENERATE_REQUIRED

次をすべて満たすときのみ。

1. `criteria` が配列で 1 件以上
2. 全要素が合法 `CriterionResult`
3. 1 件以上の `FAIL`
4. `UNKNOWN` が 0 件
5. 全件 `NOT_APPLICABLE` ではない

## DO_NOT_GENERATE（優先順）

1. `EMPTY_CRITERIA` — `criteria.length === 0`
2. `ALL_NOT_APPLICABLE` — 1 件以上かつすべて `NOT_APPLICABLE`
3. `HAS_UNKNOWN` — `UNKNOWN` が 1 件以上（FAIL 併存時も優先）
4. `NO_FAILING_CRITERIA` — FAIL が 0 件で上記以外

## MALFORMED_INPUT

- `input` が record でない、または `criteria` 欠落
- `criteria` が配列でない
- 要素が合法 `CriterionResult` でない

壊れた入力を `GENERATE_REQUIRED` に倒さない。

## 実装配置

- `src/domain/finding-audit.ts` — `decideFindingGeneration` / Result 型
- `src/domain/criteria.ts` — `isCriterionResult`（検証再利用）
- `tests/contracts/finding-audit-contract.test.ts`

## 対象外 / HOLD

- FindingCode 写像・採番
- FindingIdentity 組立
- `deriveStableFindingId` / `transitionFindingStatus` の再定義
- finding 再発判定
- AssessmentSnapshot 候補生成・保存
- 完全 Finding / FindingSeverity
- Handoff transition
- SharePoint / adapter / Entra ID / Microsoft 365 / deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
