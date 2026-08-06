# Finding安定ID技術契約

この文書は、Issue #24 / PR-C の Finding安定ID生成に関する技術契約正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 361f5486ba1fec408355d97103aa20dcc4e65b63
Issue #24 CONDITIONAL GO comment: 5205731811
ownership: docs/architecture/finding-audit-ownership.md
input contract: FindingIdentity (Issue #27 / PR #41)
```

本契約は安定ID生成の純粋関数境界だけを固定する。
再発判定、Finding lifecycle、Handoff遷移、Severity、完全Finding、AssessmentSnapshot保存は対象外とする。

## 関数

```text
deriveStableFindingId(input: unknown): DeriveStableFindingIdResult
```

- 例外を投げない。
- 業務ロール判定を含まない。
- SharePoint / adapter / 永続化を含まない。

## CONDITIONAL項目の固定

### 1. 入力正規化規則

1. `validateFindingIdentity(input)` が `true` であること。
2. 各フィールド値は、先頭・末尾空白を含んではならない（`value === value.trim()`）。
3. 各フィールド値は、C0制御文字（`U+0000`〜`U+001F`）、DEL（`U+007F`）、C1制御文字（`U+0080`〜`U+009F`）を含んではならない。
   これにはタブ・改行・復帰、および結合区切り `U+001F` を含む。
4. Unicodeの互換正規化（NFKC等）や大小文字折りたたみは行わない。
5. 暦日は `FindingIdentity` 契約どおり `YYYY-MM-DD` の検証済み文字列をそのまま用いる。

上記を満たさない入力はID化せず fail-closed する。

判定パターン（実装正本）:

```text
/[\u0000-\u001F\u007F-\u009F]/u
```

### 2. ハッシュ入力のフィールド結合順序

次の順序で値だけを結合する。

```text
1. OrganizationId
2. SiteId
3. UserId
4. FindingCode
5. ruleSetVersion
6. periodStart
7. periodEnd
```

結合区切りは `U+001F`（Unit Separator）1文字とする。

```text
OrganizationId + U+001F + SiteId + U+001F + UserId + U+001F
+ FindingCode + U+001F + ruleSetVersion + U+001F + periodStart + U+001F + periodEnd
```

キー名はハッシュ入力に含めない。順序変更は破壊的変更とする。

### 3. ハッシュ方式

- アルゴリズム: SHA-256
- 入力エンコーディング: UTF-8（`TextEncoder`）
- 実装: domain内の pure TypeScript 実装（`src/domain/sha256.ts`）
- `node:crypto` および他の `node:` builtin は domain から使用しない
- Node / ブラウザの双方で同期利用できること（SPFx bundle 前提の runtime 非依存）

空文字列および `"abc"` の SHA-256 hex を契約テストの固定ベクトルとする。

### 4. 出力形式

```text
finding_ + lowercase hex (64 characters)
```

例（形式のみ）:

```text
finding_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

- プレフィックス `finding_` は必須とする。
- hex は小文字に限定する。
- 長さはプレフィックス除外で常に64文字とする。

### 5. 決定性

- 同一の正規化済み `FindingIdentity` は常に同一の安定IDを返す。
- いずれか1フィールドでも異なれば、別IDになることを契約テストで確認する。
- 本契約は暗号学的衝突耐性の保証文書ではなく、業務上の安定参照キー生成契約である。

### 6. fail-closed

```text
ok: true  -> findingId
ok: false -> code
```

| code | 条件 |
|---|---|
| `INVALID_IDENTITY` | `validateFindingIdentity` 失敗 |
| `UNSUPPORTED_IDENTITY_VALUE` | 検証は通るが、未trim、または C0/DEL/C1 制御文字を含む |

例外throw、部分ID、空文字ID、フォールバックIDは禁止する。

## 結果型

```text
DeriveStableFindingIdResult =
  | { ok: true; findingId: string }
  | { ok: false; code: "INVALID_IDENTITY" | "UNSUPPORTED_IDENTITY_VALUE" }
```

## 対象外 / HOLD

- finding再発判定
- Finding lifecycle transition
- finding生成条件の業務ロジック全体
- AssessmentSnapshot候補生成・保存
- Handoff遷移
- FindingSeverity / 完全Finding
- SharePoint / Entra ID / Microsoft 365 / deploy

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
