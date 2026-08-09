# AssessmentSnapshot 保存タイミング（DEC-009）論理契約

## 目的

**DEC-009** として、AssessmentSnapshot の保存タイミング業務意味を論理契約として固定する。

AS-EC-1 全体の Entry satisfied、Schema / DTO / SharePoint storage、FindingCode、
訂正承認ロール Binding は本契約に含めない。

本単位は **Accepted logical contract** である。
保存実装・Schema・provider 実装は含めない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Contract ID: AssessmentSnapshotSaveTimingPolicy
Kind: logical contract（Implementation Start ではない）
Status: Accepted（DEC-009 Human Acceptance / Option A）
Human Acceptance: decision-dec-009-snapshot-save-timing-acceptance.md
Depends on:
  assessment-snapshot-result-design.md（Result 候補設計）
  assessment-snapshot-result-conversion.md（永続なし Result 変換）
  GOV-AUD-03 Accepted / Option E（訂正承認ロールは別単位）
Related Issues: #8 / #19 / #24
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-dec-009-snapshot-save-timing-acceptance.md`](./decision-dec-009-snapshot-save-timing-acceptance.md)
- [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md)
- [`decision-gov-aud-03-snapshot-correction-approver-acceptance.md`](./decision-gov-aud-03-snapshot-correction-approver-acceptance.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Decision 単位（混ぜない）

| ID | 決める内容 | 決めない内容 | 状態 |
|---|---|---|---|
| Result conversion | 永続なし候補変換 | 保存タイミング | **DONE** |
| **DEC-009（本契約）** | 下書き / 確定時保存 / 版管理 | Schema / storage | **Accepted / LOCKED** |
| GOV-AUD-03 | 訂正承認ロール | 保存タイミング | **Accepted / Option E** |
| Decision-AS-EC-1 | 完全契約 Entry 全体 | — | **HOLD** |

## Accepted 型

```ts
type AssessmentSnapshotSaveTimingPolicy = {
  kind: "assessment_snapshot_save_timing";
  inProgressHandling: "draft";
  formalRecordSavePoint: "on_finalize";
  postFinalizeCorrection: "retain_original_and_save_new_version";
  overwriteFinalizedRecord: "not_adopted";
  historyRetention: "retain";
};
```

| フィールド | 値 | 意味 |
|---|---|---|
| `kind` | `"assessment_snapshot_save_timing"` | 保存タイミング契約 |
| `inProgressHandling` | `"draft"` | 作成途中は下書き扱い |
| `formalRecordSavePoint` | `"on_finalize"` | 正式記録は確定時に保存 |
| `postFinalizeCorrection` | `"retain_original_and_save_new_version"` | 確定後修正は元を残し新版保存 |
| `overwriteFinalizedRecord` | `"not_adopted"` | 既存確定の上書き禁止 |
| `historyRetention` | `"retain"` | 履歴を保持 |

日本語正本:

```text
アセスメント作成途中: 下書き扱い
正式記録: 確定時に保存
確定後の修正: 元の確定記録を残す
修正後: 新しい版として保存する
既存確定記録の上書き: NOT ADOPTED
履歴: 保持する
Closes only: AssessmentSnapshot 保存タイミングの業務意味
```

### 禁止表現

```text
MUST NOT convert this contract into:
  Snapshot Schema / DTO / SharePoint Implementation Start
  AS-EC-1 overall Entry satisfied
  FindingCode / findingIds 境界の確定

MUST NOT equate:
  draft = formal finalized record
  post-finalize correction = overwrite finalized record
```

## Explicit non-goals

```text
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Decision-AS-EC-1 overall: HOLD
Schema / SharePoint / UI / provider: NOT STARTED
```
