# FindingIdentity 組立 技術契約

この文書は、Issue #24 / FindingCode写像・Identity組立（狭域）に関する技術契約正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24
Decision comment: 5210065336
Implementation Start comment: 5210078985
基準 main: baeafd0b86c0fc26c0eeba7b565c9c534b440311
input contract: FindingIdentity / validateFindingIdentity (Issue #27 / PR #41)
handoff: deriveStableFindingId (Issue #24 / PR-C)
Implementation Start: GO（承認範囲のみ）
```

上位入口: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 目的

呼び出し側が渡す部品（**FindingCode を含む**）から `FindingIdentity` を
例外なしで検証・組立する。

本契約は **Identity 組立** のみを固定する。
FindingCode 業務カタログ、再発判定、AssessmentSnapshot、lifecycle、完全 Finding は扱わない。

## 関数

```ts
assembleFindingIdentity(input: unknown): AssembleFindingIdentityResult
```

```ts
AssembleFindingIdentityResult =
  | { ok: true; identity: FindingIdentity }
  | { ok: false; code: "MALFORMED_INPUT" | "UNSUPPORTED_IDENTITY_VALUE" }
```

- 例外を投げない。
- 値の trim / NFKC / 大小折りたたみは行わない。
- FindingCode を推測・生成・カタログ変換しない。
- `deriveStableFindingId` を再定義しない。

## 入力（すべて必須）

| フィールド | 検証 |
|---|---|
| `OrganizationId` | `isNonEmptyString` |
| `SiteId` | `isNonEmptyString` |
| `UserId` | `isNonEmptyString` |
| `FindingCode` | `isReasonCode`（外部必須入力） |
| `ruleSetVersion` | `isNonEmptyString` |
| `periodStart` | `isValidIsoDate` |
| `periodEnd` | `isValidIsoDate` かつ `periodEnd >= periodStart` |

キー集合は既存 `validateFindingIdentity` と同一（ちょうど7、追加キー禁止）。

## FindingCode 境界

```text
FindingCode は呼び出し側が必ず渡す。
形式検証は isReasonCode のみ。
業務カタログの採択・採番・criterionId 写像表は対象外。
EvaluationFindingReference.findingCode からの暗黙変換は行わない。
```

## fail-closed

| code | 条件 |
|---|---|
| `MALFORMED_INPUT` | `validateFindingIdentity(input) !== true` |
| `UNSUPPORTED_IDENTITY_VALUE` | 契約は通るが未 trim、または C0/DEL/C1 制御文字を含む |

制御文字パターン（安定ID契約と同一）:

```text
/[\u0000-\u001F\u007F-\u009F]/u
```

部分組立・黙っての正規化・フォールバック Identity は禁止する。
成功時の各フィールド値は入力値と同一文字列とする。

## deriveStableFindingId への受け渡し

```text
assembleFindingIdentity(input).ok === true
  ⇒ deriveStableFindingId(identity).ok === true
```

- 成功 `identity` を改変せず渡す。
- `assembleAndDerive*` 合成ラッパは本単位で新設しない。
- 安定IDのハッシュ規則は [`finding-stable-id.md`](./finding-stable-id.md) のまま。

## 実装配置

- `src/domain/finding-audit.ts` — `assembleFindingIdentity` / Result 型
- `tests/contracts/finding-audit-contract.test.ts`

## 対象外 / HOLD

- FindingCode 業務カタログの新規採択
- FindingCode 採番 / criterionId 写像表
- finding 再発判定
- AssessmentSnapshot 候補生成・保存
- FindingStatus / lifecycle 再定義
- `decideFindingGeneration` / `deriveStableFindingId` / `transitionFindingStatus` の再定義
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
