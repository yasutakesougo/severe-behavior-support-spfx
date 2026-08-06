# Finding lifecycle transition 技術契約

この文書は、Issue #24 / Finding lifecycle transition に関する技術契約正本である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24
C0 ownership comment: 5209785751
FindingStatus 型正本: Issue #27 / PR #41
Implementation Start: GO（承認範囲のみ）
```

上位入口: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 目的

`FindingStatus` の許可遷移だけを、例外を投げない domain 純粋関数として契約化する。

本契約は状態グラフの許可/拒否境界だけを固定する。

## 状態集合（再定義しない）

Issue #27 で確定済みの値のみを用いる。

```text
Open
Confirmed
InProgress
Resolved
```

`FindingStatus` 型・値一覧の再定義は行わない。

## 許可遷移表

本単位で許可する辺は次の 3 辺のみとする。

| from | to |
|---|---|
| Open | Confirmed |
| Confirmed | InProgress |
| InProgress | Resolved |

`Resolved` は本単位では終端とする。再オープンは別 Decision。

次はすべて `INVALID_TRANSITION` とする。

- 自己遷移
- スキップ（例: Open→InProgress）
- 逆行（例: Confirmed→Open）
- Resolved からの任意遷移

## 関数契約

```ts
transitionFindingStatus(
  currentStatus: unknown,
  targetStatus: unknown
): FindingStatusTransitionResult

FindingStatusTransitionResult =
  | { ok: true; status: FindingStatus }
  | { ok: false; code: "MALFORMED_INPUT" | "INVALID_TRANSITION" }
```

規則:

1. 例外を投げない。
2. `currentStatus` / `targetStatus` のいずれかが `FindingStatus` でなければ `MALFORMED_INPUT`。
3. 両方合法でも許可表外なら `INVALID_TRANSITION`。
4. 成功時 `status` は `targetStatus` と一致する。
5. ロール判定・永続化・adapter 呼び出しを含めない。

定数: `FINDING_STATUS_ALLOWED_TRANSITIONS`

## 実装配置

- `src/domain/finding-audit.ts` — `transitionFindingStatus` / Result 型 / 許可表定数
- `tests/contracts/finding-audit-contract.test.ts` — 許可・拒否・不正入力

## 対象外 / HOLD

- FindingStatus の再定義
- finding 再発判定
- finding 生成条件の業務ロジック全体
- AssessmentSnapshot 候補生成・保存
- Handoff transition
- FindingSeverity / 完全 Finding
- ロール / GOV-AUD / DEC-009
- SharePoint / adapter / Entra ID / Microsoft 365 / deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
```
