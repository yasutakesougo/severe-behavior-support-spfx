# finding再発判定 技術契約

この文書は、Issue #24 / finding再発判定に関する技術契約正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24
Decision comment: 5210206944
Implementation Start comment: 5210210553
基準 main: 3f6d96398655def100d8ade1e80a9161ae42f63b
Accepted boundaries: Q1-C / Q2-A / Q3-A / Q4-A
Implementation Start: GO（承認範囲のみ）
```

上位入口: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 目的

候補 `FindingIdentity` と任意の先行 finding（identity + status）を見て、
`SAME` / `RECURRENCE` / `NEW` を例外なしで判定する。

安定IDの差だけで再発を確定しない。

## 採択境界

| ID | 採択 | 意味 |
|---|---|---|
| Q1-C | ACCEPTED | period 差は再発の必要条件。十分条件ではない（Q3 と併用） |
| Q2-A | ACCEPTED | `ruleSetVersion` が異なれば再発対象外（`NEW`） |
| Q3-A | ACCEPTED | 先行が Resolved 未満の別 period 候補は fail-closed |
| Q4-A | ACCEPTED | `SAME` = Identity 7フィールド完全一致。`RECURRENCE` は条件付き別キー |

## 関数

```ts
decideFindingRecurrence(input: unknown): FindingRecurrenceDecisionResult
```

```ts
FindingRecurrenceDecisionResult =
  | { ok: true; decision: "SAME" | "RECURRENCE" | "NEW" }
  | { ok: false; code: "MALFORMED_INPUT" | "CONFLICT_OPEN_FINDING" }
```

入力:

```ts
{
  candidate: unknown; // FindingIdentity 部品（assembleFindingIdentity で検証）
  prior?: null | {
    identity: unknown;
    status: unknown; // FindingStatus
  };
}
```

- `prior` 欠落 / `null` / `undefined` → 先行なし → `NEW`
- 例外を投げない
- Finding 永続化・カタログ・adapter を含まない

## 判定手順

1. `candidate` を `assembleFindingIdentity` で検証。失敗 → `MALFORMED_INPUT`
2. `prior` なし → `NEW`
3. `prior` が record でない、または `identity` / `status` 欠落、または `status` が非 `FindingStatus`、または prior identity 組立失敗 → `MALFORMED_INPUT`
4. 7フィールド完全一致 → `SAME`（Q4-A）
5. 再発マッチキー不一致 → `NEW`（Q2-A: `ruleSetVersion` 含む）
6. period が変わっていない → `NEW`（Q1-C: period 差が必要）
7. prior.status ≠ `Resolved` → `CONFLICT_OPEN_FINDING`（Q3-A）
8. それ以外 → `RECURRENCE`

## 再発マッチキー

```text
OrganizationId
SiteId
UserId
FindingCode
ruleSetVersion
```

定数: `FINDING_RECURRENCE_MATCH_FIELDS`

period はマッチキーに含めない。`RECURRENCE` では `periodStart` / `periodEnd` のいずれかが異なること。

## 安定IDとの関係

```text
SAME        ⇔ 同一 FindingIdentity ⇔ 同一安定IDキー
RECURRENCE  ⇒ 別安定ID（period 差があるため）
別安定ID    ≠ 自動的に RECURRENCE
```

`deriveStableFindingId` は再定義しない。本関数は安定IDを計算しない。

## 実装配置

- `src/domain/finding-audit.ts` — `decideFindingRecurrence` / Result 型 / マッチキー定数
- `tests/contracts/finding-audit-contract.test.ts`

## 対象外 / HOLD

- FindingCode 業務カタログ
- FindingStatus / lifecycle 再定義（Resolved 再オープン含む）
- AssessmentSnapshot 候補生成
- 完全 Finding / FindingSeverity
- Handoff transition
- 複数 prior の探索・永続ストア照会（呼び出し側が prior を渡す）
- SharePoint / adapter / Entra ID / Microsoft 365 / deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
