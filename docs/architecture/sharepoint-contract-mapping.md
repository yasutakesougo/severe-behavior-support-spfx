# SharePoint–Contract Mapping

## Purpose

Requirement・Contract・DTO・SharePoint列の対応を一つの正本に統合し、
Contracts / Adapter / SPFx が同一表を参照できるようにする。

本版は Issue #42 PR-A1（Contracts）範囲の **Contract側** を確定する。
SharePoint Site / List / Internal Name / Column Type / 変換は DEC-6 HOLD のため Adapter Entry Criteria へ送る。

## Scope

- SupportPlan (`severe-behavior-support.support-plan.plan` / `1.0.0`)
- SupportPlanVersion (`severe-behavior-support.support-plan.plan-version` / `1.0.0`)
- Repository結果型（Schema ID対象外の結果契約）

ABC / Finding / ExecutionRecord は先回りしない。

## Sources of Truth

- 要件正本（暫定案B）: `docs/architecture/domain-reconstruction-foundation.md`（基準SHA `bb46c6a0caac862d9a9fbb2ce31399092400aa10`）
- DEC-1〜5・7 Accepted / DEC-6 HOLD
- `src/domain/support-plan.ts` / `src/domain/support-plan-repository.ts`
- `docs/architecture/contracts-v1.md`（日付・命名境界・fail-closed）

## Mapping Rules

1. 正本で確認できない値を推測で埋めない
2. Internal Name未作成なら仮名を確定値として書かない
3. Status: 確定 / 暫定 / 未確認 / 対象外
4. Contract名とSP列名を同一視しない
5. Schema IDはSP List名、TS型名、repo名と同一視しない
6. PlanId（SupportPlan）と planId（SupportPlanVersion）の差異を明示し、本Issueでは統一しない
7. 日付形式・未入力/0は既存正本に従い再決定しない

## Type Conversion Rules

DEC-6 HOLD。Adapter着手前に確定する。Contracts実装は型変換未確定でも進行可。

## Failure Behavior

DEC-7 Accepted:

- 成功0件のみ空配列可
- 部分取得・ページング失敗・権限不足・Schema不一致・変換失敗を成功空結果へ倒さない
- `NOT_FOUND` と `ERROR` を統合しない

## Mapping Table（Contract側）

| Mapping ID | Requirement ID | Business Field | Contract Schema | Schema Version | Contract Field | DTO Field | Contract Type | Required | Null Allowed | Missing Value | Zero Meaning | Validation | Failure Behavior | Source | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| MAP-PLAN-001 | PLAN-001〜010 | 計画ID | severe-behavior-support.support-plan.plan | 1.0.0 | PlanId | data.PlanId | string | 必須 | 否 | 欠落拒否 | 対象外 | 非空 | 拒否 | support-plan.ts | 確定 |
| MAP-PLAN-002 | PLAN-001〜010 | 組織ID | severe-behavior-support.support-plan.plan | 1.0.0 | OrganizationId | data.OrganizationId | string | 必須 | 否 | 欠落拒否 | 対象外 | 非空 | 拒否 | contracts-v1 | 確定 |
| MAP-PLAN-003 | PLAN-001〜010 | 事業所ID | severe-behavior-support.support-plan.plan | 1.0.0 | SiteId | data.SiteId | string | 必須 | 否 | 欠落拒否 | 対象外 | 非空 | 拒否 | contracts-v1 | 確定 |
| MAP-PLAN-004 | PLAN-001〜010 | 利用者ID | severe-behavior-support.support-plan.plan | 1.0.0 | UserId | data.UserId | string | 必須 | 否 | 欠落拒否 | 対象外 | 非空 | 拒否 | contracts-v1 | 確定 |
| MAP-PLAN-005 | PLAN-001〜010 | 状態 | severe-behavior-support.support-plan.plan | 1.0.0 | status | data.status | enum | 必須 | 否 | 欠落拒否 | 対象外 | SUPPORT_PLAN_STATUSES | 未知値拒否(DEC-5-B) | support-plan.ts | 確定 |
| MAP-PLAN-006 | PLAN-001〜010 | 現行版番号 | severe-behavior-support.support-plan.plan | 1.0.0 | currentVersion | data.currentVersion | integer | 必須 | 否 | 欠落拒否 | 0は無効(>=1) | 整数>=1 | 拒否 | support-plan.ts | 確定 |
| MAP-PLAN-007 | PLAN-001〜010 | 楽観ロック版 | severe-behavior-support.support-plan.plan | 1.0.0 | version | data.version | integer | 必須 | 否 | 欠落拒否 | 0は無効 | 整数>=1 | 拒否 | support-plan.ts | 確定 |
| MAP-PLAN-008 | PLAN-001〜010 | 作成者 | severe-behavior-support.support-plan.plan | 1.0.0 | createdBy | data.createdBy | string | 必須 | 否 | 欠落拒否 | 対象外 | 非空 | 拒否 | support-plan.ts | 確定 |
| MAP-PLAN-009 | PLAN-001〜010 | 作成日時 | severe-behavior-support.support-plan.plan | 1.0.0 | createdAt | data.createdAt | ISO DateTime | 必須 | 否 | 欠落拒否 | 対象外 | isValidIsoDateTime | 拒否 | support-plan.ts | 確定 |
| MAP-PLAN-010 | PLAN-001〜010 | 見直し期限 | severe-behavior-support.support-plan.plan | 1.0.0 | reviewDueDate | data.reviewDueDate | ISO DateTime? | 任意 | 否 | キー欠落=未設定 | 対象外 | あればISO DateTime | 不正は拒否 | support-plan.ts | 確定 |
| MAP-PLAN-011 | PLAN-001〜010 | 提出履歴 | severe-behavior-support.support-plan.plan | 1.0.0 | submittedBy/At | data.* | group | 状態依存 | 否 | 状態依存 | 対象外 | all-or-nothing | 検証失敗 | support-plan.ts | 確定 |
| MAP-PLAN-012 | PLAN-001〜010 | 差戻し履歴 | severe-behavior-support.support-plan.plan | 1.0.0 | returned* | data.* | group | 状態依存 | 否 | 状態依存 | 対象外 | reasonCode形式 | 拒否 | support-plan.ts | 確定 |
| MAP-PLAN-013 | PLAN-001〜010 | 承認履歴 | severe-behavior-support.support-plan.plan | 1.0.0 | approved*/effectiveFrom | data.* | group | 状態依存 | 否 | 状態依存 | 対象外 | Active/Closed必須 | 拒否 | support-plan.ts | 確定 |
| MAP-PLAN-014 | PLAN-001〜010 | 終了履歴 | severe-behavior-support.support-plan.plan | 1.0.0 | closed*/effectiveTo/closeReason* | data.* | group | Closed必須 | 否 | 他状態禁止 | 対象外 | all-or-nothing | 拒否 | support-plan.ts | 確定 |
| MAP-VER-001 | REV-001〜002 | 版本体ID | severe-behavior-support.support-plan.plan-version | 1.0.0 | planId | data.planId | string | 必須 | 否 | 欠落拒否 | 対象外 | 非空 | 拒否 | support-plan.ts | 確定 |
| MAP-VER-002 | REV-001〜002 | 目標 | severe-behavior-support.support-plan.plan-version | 1.0.0 | goals | data.goals | string[] | 必須 | 否 | 欠落拒否 | 空配列の業務意味は後続確認 | 配列・要素非空 | 拒否 | support-plan.ts | 暫定 |
| MAP-VER-003 | REV-001〜002 | 支援方法 | severe-behavior-support.support-plan.plan-version | 1.0.0 | supportMethods | data.supportMethods | string[] | 必須 | 否 | 欠落拒否 | 同上 | 配列・要素非空 | 拒否 | support-plan.ts | 暫定 |
| MAP-VER-004 | REV-001〜002 | 留意事項 | severe-behavior-support.support-plan.plan-version | 1.0.0 | precautions | data.precautions | string[] | 必須 | 否 | 欠落拒否 | 同上 | 配列・要素非空 | 拒否 | support-plan.ts | 暫定 |
| MAP-VER-005 | REV-001〜002 | 見直し観点 | severe-behavior-support.support-plan.plan-version | 1.0.0 | reviewCriteria | data.reviewCriteria | string[] | 必須 | 否 | 欠落拒否 | 同上 | 配列・要素非空 | 拒否 | support-plan.ts | 暫定 |
| MAP-VER-006 | REV-001〜002 | 版作成者/日時 | severe-behavior-support.support-plan.plan-version | 1.0.0 | versionCreatedBy/At | data.* | string+DateTime | 必須 | 否 | 欠落拒否 | 対象外 | 非空+ISO | 拒否 | support-plan.ts | 確定 |
| MAP-REPO-001 | SAFE-003 | 単一取得結果 | 結果契約（Schema ID対象外） | — | RepositoryLookupResult | 同左 | FOUND/NOT_FOUND/ERROR | — | — | NOT_FOUND≠ERROR | 対象外 | reasonCode | 空成功へ倒さない | support-plan-repository.ts | 確定 |
| MAP-REPO-002 | SAFE-003 | 一覧取得結果 | 結果契約（Schema ID対象外） | — | RepositoryListResult | 同左 | SUCCESS/ERROR | — | — | 成功0件のみ[]可 | 対象外 | DEC-7 | 失敗≠[] | support-plan-repository.ts | 確定 |

DTO envelope fields（全SupportPlan/Version DTO共通）:

| Field | Value rule |
|---|---|
| schemaId | 上記 Contract Schema と一致 |
| schemaVersion | `1.0.0` |
| dtoVersion | schemaVersion と同一（DEC-1） |
| data | 各Contract本体 |

## Adapter deferred columns

次は Adapter Entry Criteria（DEC-6 Accepted後）:

```text
SharePoint Site
SharePoint List
Display Name
Internal Name
Column Type
Read Conversion
Write Conversion
```

AssessmentSnapshot 向け MT-1 mapping 表（Status=`未確認` / `NOT PRESENT`）:
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
Pilot Lists DEFAULT_COLUMNS_ONLY（CN-1）:
  app Internal Names = NOT PRESENT
  mapping-complete = FORBIDDEN claim
  Implementation Start / adapter code = HOLD
```

## Unresolved Items

- DEC-6 / SharePoint列設計
- goals等配列の空配列業務意味（P2）
- PlanId / planId 統一（後続MAJOR候補）
- 要件正本の `docs/requirements/` への将来移行

## Change Control

- Mapping ID単位で変更する
- 破壊的変更は DEC-3（次MAJOR安定化まで旧Schema読取専用保持）
- Schema ID/Version変更は DEC-1 に従う
- 承認前に Status を確定へ上げない
