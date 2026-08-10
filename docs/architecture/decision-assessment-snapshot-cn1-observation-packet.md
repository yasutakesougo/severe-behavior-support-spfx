# Decision-AS-CN1-OBSERVATION-1 — Internal Column Names（CN-1）observation packet

この文書は、Twenty-eighth residual（SELECTED / A — CN-1）後の
**Internal Column Names read-only observation** 用 Human Decision Packet である。

Selected via:
[`decision-ilb-1-twenty-eighth-residual-cn1-selection.md`](./decision-ilb-1-twenty-eighth-residual-cn1-selection.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-sp-placement-acceptance.md`](./decision-assessment-snapshot-sp-placement-acceptance.md)
（Decision-AS-SP-PLACEMENT-1 = SV-1+LV-1+CN-1+SC-1）
[`decision-assessment-snapshot-pilot-provision-exec-acceptance.md`](./decision-assessment-snapshot-pilot-provision-exec-acceptance.md)
[`decision-assessment-snapshot-pilot-provision-vr1-evidence.md`](./decision-assessment-snapshot-pilot-provision-vr1-evidence.md)
[`decision-assessment-snapshot-pilot-list-names-acceptance.md`](./decision-assessment-snapshot-pilot-list-names-acceptance.md)
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-CN1-OBSERVATION-1
Kind: Human Decision packet（observation → CONFIRMED / HOLD）
Status: CLOSED / CONSUMED
Stop point: HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION = COMPLETE
Human Decision: Observation COMPLETE（DEFAULT_COLUMNS_ONLY / custom = 0）
Basis rule already Accepted:
  CN-1 — 実 Internal Column Name を確認して確定
         Display Name / TypeScript 名から推論しない
Closure basis:
  Human read-only observation result for in-scope Sites/Lists
  = sole closure basis for CN-1
Evidence:
  decision-assessment-snapshot-cn1-readonly-observation-evidence.md
Closure determination:
  decision-assessment-snapshot-cn1-closure-determination.md

Scope Sites（LOCKED / OBSERVED）:
  isogo  = https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
  honmoku = https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku

Scope Lists（LOCKED / OBSERVED）:
  SupportPlans
  AssessmentSnapshots

CN-1 observation: CLOSED / CONSUMED
Result class: DEFAULT_COLUMNS_ONLY
Custom application columns: 0 / NOT PRESENT
Match-existing-app-Internal-Names premise: NOT APPLICABLE / INVALIDATED
App-field Internal Names CONFIRMED for mapping: NONE
Agent environment credentials: NONE（NO_SP_ENV）
Mutation by Agent: FORBIDDEN
Mutation by Human during this observation: 0
Implementation Start: HOLD
SharePoint adapter / schema mapping impl: HOLD
  （CN-1 closed ≠ mapping-complete ≠ Implementation Start）
SharePoint schema / list / column change: FORBIDDEN
GitHub Issue mutation（bulk close / bulk body update）: FORBIDDEN
Deploy / real data: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
パイロット 2 Sites × 2 Lists について、
SharePoint が実際に保持する Internal Column Name は何か。

CN-1 ≠ custom column 作成 GO。
CN-1 ≠ adapter / schema mapping 実装開始。
CN-1 ≠ Implementation Start。
Display Name / domain field / TS property からの逆算は禁止。
```

## 2. Observation method（required）

| Rule | Value |
|---|---|
| Stop point | `HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION` |
| Method | SharePoint UI List settings / column settings（or equivalent primary metadata） |
| Mode | read-only |
| Mutation | 0 |
| Who observes | Human（Agent has NO_SP_ENV） |
| Evidence form | Human-provided primary evidence（screenshot / exported column metadata） |
| Fail-closed | 未観測列は NOT OBSERVED / HOLD。推測で埋めない |

### 2.1 Evidence shape（LOCK）

観測時に証跡化する対応は次のみとする。

```text
Display Name → Internal Name → Column Type → List → Site
```

| Capture | In / Out |
|---|---|
| Display Name | **IN** |
| Internal Name | **IN** |
| Column Type（SharePoint 表示どおり） | **IN** |
| List | **IN** |
| Site（isogo / honmoku） | **IN** |
| 列の値・行データ・個人情報 | **OUT** |
| 設定変更・権限変更・列作成/改名/削除 | **OUT** |
| Required / system vs custom（任意・補助） | optional only；必須証跡ではない |

```text
MUST cover:
  isogo / SupportPlans
  isogo / AssessmentSnapshots
  honmoku / SupportPlans
  honmoku / AssessmentSnapshots

Allowed outcome if only default columns exist:
  OBSERVED = Title + system columns only
  custom mapped columns = NOT PRESENT / NOT OBSERVED
  Do NOT invent intended Internal Names to fill mapping gaps.

Do NOT step into:
  item values / list data content
  settings mutation
  schema / list / column change
```

## 3. Compare axes（observation-time）

### CN — confirmation state

| ID | 内容 | 結果 |
|---|---|---|
| **CN-1** | 実 Internal Column Name を確認して確定（rule already Accepted） | **rule LOCKED / values OPEN** |
| CN-2 | Display Name を Internal Name とみなす | NOT SELECTED（re-Decision しない） |
| CN-3 | TypeScript / domain 名を Internal Name にする | NOT SELECTED（re-Decision しない） |

### XB — execution boundary

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | CN-1 observation ≠ column creation ≠ adapter start | **LOCKED for this packet** |
| XB-2 | observation と同時に custom columns を作成する | NOT SELECTED |
| XB-3 | observation PASS を Implementation Start とみなす | NOT SELECTED |

## 4. Observation table（Human evidence recorded）

証跡列順 = Display Name → Internal Name → Column Type → List → Site

正本 evidence:
[`decision-assessment-snapshot-cn1-readonly-observation-evidence.md`](./decision-assessment-snapshot-cn1-readonly-observation-evidence.md)

| List | Site | Observation | Custom columns | Result class |
|---|---|---|---|---|
| SupportPlans | isogo | CONFIRMED | 0 | DEFAULT_COLUMNS_ONLY |
| AssessmentSnapshots | isogo | CONFIRMED | 0 | DEFAULT_COLUMNS_ONLY |
| SupportPlans | honmoku | CONFIRMED | 0 | DEFAULT_COLUMNS_ONLY |
| AssessmentSnapshots | honmoku | CONFIRMED | 0 | DEFAULT_COLUMNS_ONLY |

```text
Human-attested Internal Name:
  タイトル → Title
Other observed Display Names only（Internal Name NOT EXPLICITLY ATTESTED）:
  更新日時 / 登録日時 / 登録者 / 更新者
Column Type: NOT PROVIDED by Human
Do not pre-fill Internal Names from:
  sharepoint-contract-mapping.md Contract Field names
  TypeScript property names
  Japanese Display Name romanization
  intended mapping drafts
```

## 5. Explicit non-authorization

```text
This OPEN packet does NOT authorize:
  Internal Names invention
  SharePoint schema / list / column change（create / rename / delete）
  permissions / Entra / Graph / tenant mutation
  SharePoint adapter / schema mapping implementation
  schema mapping concrete Internal Names LOCK as CONFIRMED without evidence
  Implementation Start（HOLD）
  Deploy / real data
  treating default-column-only Lists as mapping-complete
  GitHub Issue mutation
  Issue 一括 Close
  Issue 本文の一括更新
  Issue Status Reconciliation as current gate
```

## 6. Related process debt（not this packet）

```text
Issue Status Reconciliation:
  assessed in issue-status-reconciliation-assessment.md
  NOT part of CN-1 observation
  scheduled after CN-1 closed
  close Issue ≠ resync Current/Gate/Dependency text
```

## 7. Next

```text
Stop point: HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION = COMPLETE
Decision-AS-CN1-OBSERVATION-1: CLOSED / CONSUMED
Result: DEFAULT_COLUMNS_ONLY / custom application columns = 0
Closure: decision-assessment-snapshot-cn1-closure-determination.md
Next gate: decision-assessment-snapshot-cn1-next-gate.md
Next residual: decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md
  theme = schema mapping / column path / Implementation Start boundary
Still HOLD:
  adapter / schema mapping impl = HOLD（≠ mapping-complete）
  Implementation Start = HOLD
  SharePoint schema/list/column change = FORBIDDEN
  GitHub Issue mutation / 一括 Close / 一括本文更新 = FORBIDDEN
Independent candidate:
  Issue Status Reconciliation（not a substitute for column/mapping path）
```
