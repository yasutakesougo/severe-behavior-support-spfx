# Decision-FLR-1 — Finding reopen policy

この文書は、Issue #24 / Finding reopen policy（Decision-FLR-1）の
**Accepted 正本**である。

実装変更は行わない。既存 `transitionFindingStatus` を再定義しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Owner: Issue #24
Lifecycle ownership (C0): 5209785751
Decision ID: Decision-FLR-1
Alias: Decision-RO-1（Decision-first 台帳案での同一問い）
Status: Accepted
Implementation impact: NONE
Existing implementation: UNCHANGED
```

上位入口:

- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-lifecycle-transition.md`](./finding-lifecycle-transition.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## Accepted 内容

```text
Status: Accepted

Finding の再オープンは許可しない。

Resolved は終端状態として維持する。

許可遷移:
Open → Confirmed
Confirmed → InProgress
InProgress → Resolved

Resolved → * は許可しない。

既存 transitionFindingStatus の変更は不要。

新しい問題が発生した場合は、
既存 Finding を再オープンするのではなく、
Finding生成・再発判定の既存契約に従って扱う。

Implementation impact:
NONE

Existing implementation:
UNCHANGED
```

## 既存契約との整合

| 正本 | 整合 |
|---|---|
| [`finding-lifecycle-transition.md`](./finding-lifecycle-transition.md) | 許可3辺のみ。`Resolved` 終端。`Resolved → *` は `INVALID_TRANSITION` |
| `transitionFindingStatus`（`src/domain/finding-audit.ts`） | 許可表は3辺のみ。変更不要 |
| [`finding-generation-conditions.md`](./finding-generation-conditions.md) | 新規 Finding 生成は既存契約のまま |
| [`finding-recurrence.md`](./finding-recurrence.md) | 再発は `decideFindingRecurrence`。再オープン遷移ではない |

## 実装ゲート

```text
Implementation Start (本 Decision): N/A（impact NONE）
src/** / tests/**: 変更しない
Next pure unit: NONE（本 Decision では新単位を開かない）
Issue #24 Close: NO-GO（他 HOLD が残る）
SharePoint / Entra ID / Microsoft 365 / deploy: NO-GO
```

## 対象外

- FindingStatus 値一覧の再定義（Issue #27 正本のまま）
- FindingSeverity / 完全 Finding
- FindingCode 業務カタログ
- Handoff transition
- AssessmentSnapshot 保存・DTO
- ロール / GOV-AUD / DEC-009
- SharePoint / adapter / UI / deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Decision では変更しない
```
