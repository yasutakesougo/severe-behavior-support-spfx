# AssessmentSnapshot 完全契約（PR-J）技術契約

この文書は、Issue #24 / AssessmentSnapshot **完全契約**（domain）の技術契約正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24
PR letter: PR-J
Kind: complete-contract domain implementation
Implementation Start: GO（承認範囲のみ・Human A after Preflight PASS）
Selection: decision-ilb-1-tenth-residual-decision-selection.md
Depends on:
  assessment-snapshot-result-design.md
  assessment-snapshot-result-conversion.md（UNCHANGED）
  assessment-snapshot-complete-contract-technical-plan.md（Entry #8）
  assessment-snapshot-complete-contract-pr-boundary.md（Entry #2）
  assessment-snapshot-finding-ids-boundary.md（findingIds NOT REQUIRED）
  assessment-snapshot-not-applicable-reason-hold.md（enum NOT ADOPTED）
  assessment-snapshot-schema-dto-versioning.md（Schema ID 未採番）
  assessment-snapshot-save-timing-contract.md（DEC-009 意味）
  decision-as-ec-1-overall-entry-acceptance.md（overall MET）
FindingCode: HOLD
A-5: HOLD
SharePoint / DTO / Schema ID: DO NOT START
```

上位入口: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 目的

AssessmentSnapshot の **domain 完全契約面**（型・validator・合成 fixture・contract tests）を
例外なしで検証可能にする。

永続化・SharePoint・DTO・Schema ID 採番・FindingCode・承認ロールは扱わない。
Result 変換（`toAssessmentSnapshotResultCandidate`）は再定義しない。

## 型

```ts
AssessmentSnapshotRecordStatus = "draft" | "finalized"

AssessmentSnapshot = {
  snapshotId: string;
  recordStatus: AssessmentSnapshotRecordStatus;
  result: AssessmentSnapshotResult; // NO_FINDINGS | FINDINGS_PRESENT | NOT_APPLICABLE
  reasonCodes: readonly string[];
  ruleSetVersion: string;
  periodStart: string; // ISO date
  periodEnd: string;   // ISO date, periodEnd >= periodStart
  inputFingerprint: string; // opaque proof of input snapshot material（入力 Schema は定義しない）
  findingIds?: readonly string[]; // OPTIONAL（Entry #5 NOT REQUIRED）
  supersedesSnapshotId?: string; // corrected-new-version のみ。snapshotId と異なる。finalized 必須
}
```

## 関数

```ts
validateAssessmentSnapshot(input: unknown): ValidateAssessmentSnapshotResult
```

```ts
ValidateAssessmentSnapshotResult =
  | { ok: true; snapshot: AssessmentSnapshot }
  | {
      ok: false;
      code:
        | "MALFORMED_INPUT"
        | "MISSING_REASON_CODES"
        | "FORBIDDEN_RESULT"
        | "INVALID_CORRECTION_LINK";
    }
```

- 例外を投げない。
- 未知キーは拒否する（strict allowlist）。
- Schema ID / schemaVersion / dtoVersion フィールドは持たない（Entry #7: 固有 ID 未採番）。

## 検証規則

| 規則 | 内容 |
|---|---|
| result | 永続 3 値のみ。`demo` / `retrieval_failed` / `INDETERMINATE` / `SOURCE_UNAVAILABLE` / 未知 → `FORBIDDEN_RESULT` または `MALFORMED_INPUT` |
| reasonCodes | 各要素 `isReasonCode`。重複除去（出現順維持）。`NOT_APPLICABLE` は 1 件以上必須 → 不足時 `MISSING_REASON_CODES` |
| recordStatus | `draft` \| `finalized` のみ（DEC-009: draft ≠ formal finalized） |
| supersedesSnapshotId | 省略可。ある場合は非空・`!== snapshotId`・`recordStatus === "finalized"`。違反 → `INVALID_CORRECTION_LINK` |
| findingIds | 省略可。ある場合は非空文字列配列。必須化しない |
| period | `isValidIsoDate` かつ `periodEnd >= periodStart` |
| inputFingerprint | 非空文字列（入力本体 Schema は本契約外） |

## DEC-009 対応（domain 面のみ）

| 意味 | domain 表現 |
|---|---|
| 作成途中 = 下書き | `recordStatus: "draft"` |
| 正式記録 = 確定 | `recordStatus: "finalized"` |
| 確定後修正 = 元保持 + 新版 | 新 Snapshot（別 `snapshotId`）+ `supersedesSnapshotId` |
| 上書き NOT ADOPTED | 同一 `snapshotId` への置換を validator が表現しない。`supersedesSnapshotId === snapshotId` 拒否 |

application の保存・確定フローは本契約外（別 GO）。

## Result 変換との接続

```text
UNCHANGED:
  toAssessmentSnapshotResultCandidate
  AssessmentSnapshotResult 3 値
  reasonCodes 構造規則

接続点:
  完全契約の result / reasonCodes は Result 変換の PERSISTABLE 出力と同型
  Result 変換を本 PR で再実装・再定義しない
```

## 実装配置

- `src/domain/assessment-snapshot.ts` — 型 / `validateAssessmentSnapshot`
- `tests/contracts/assessment-snapshot-complete-contract.test.ts`
- 既存 `tests/contracts/assessment-snapshot-result-conversion-contract.test.ts` — 回帰

## 対象外 / HOLD

```text
SharePoint / DTO / provider: DO NOT START
AssessmentSnapshot Schema ID 採番: DO NOT START
FindingCode / A-5: HOLD
サービス別 NOT_APPLICABLE reason enum: FORBIDDEN（Entry #6）
findingIds REQUIRED: NOT ADOPTED（Entry #5）
application 保存・確定・訂正承認 Binding: OUT
実データ / deploy / Entra / M365: NO-GO
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
Result conversion semantics: UNCHANGED
```
