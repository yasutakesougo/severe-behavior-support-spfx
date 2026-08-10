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
Status: OPEN / NOT OBSERVED
Human Decision: NOT YET
Basis rule already Accepted:
  CN-1 — 実 Internal Column Name を確認して確定
         Display Name / TypeScript 名から推論しない

Scope Sites（LOCKED / OBSERVED）:
  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo
  https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku

Scope Lists（LOCKED / OBSERVED）:
  SupportPlans
  AssessmentSnapshots

CN-1: OPEN / NOT OBSERVED
Agent environment credentials: NONE（NO_SP_ENV）
Mutation by Agent: FORBIDDEN
Implementation Start: HOLD
SharePoint adapter / schema mapping impl: HOLD until CN-1 closed
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
| Method | SharePoint UI List settings / column settings（or equivalent primary metadata） |
| Mode | read-only |
| Mutation | 0 |
| Who observes | Human（Agent has NO_SP_ENV） |
| Evidence form | Human-provided primary evidence（screenshot / exported column metadata） |
| Fail-closed | 未観測列は NOT OBSERVED / HOLD。推測で埋めない |

```text
MUST capture per List（minimum）:
  Display Name
  Internal Name
  Type（as shown by SharePoint）
  Required / optional if shown
  system vs custom if distinguishable

MUST cover:
  severe-support-isogo / SupportPlans
  severe-support-isogo / AssessmentSnapshots
  severe-support-honmoku / SupportPlans
  severe-support-honmoku / AssessmentSnapshots

Allowed outcome if only default columns exist:
  OBSERVED = Title + system columns only
  custom mapped columns = NOT PRESENT / NOT OBSERVED
  Do NOT invent intended Internal Names to fill mapping gaps.
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

## 4. Observation table（empty until Human evidence）

| Site | List | Display Name | Internal Name | Type | Notes | Status |
|---|---|---|---|---|---|---|
| severe-support-isogo | SupportPlans | — | — | — | awaiting Human evidence | NOT OBSERVED |
| severe-support-isogo | AssessmentSnapshots | — | — | — | awaiting Human evidence | NOT OBSERVED |
| severe-support-honmoku | SupportPlans | — | — | — | awaiting Human evidence | NOT OBSERVED |
| severe-support-honmoku | AssessmentSnapshots | — | — | — | awaiting Human evidence | NOT OBSERVED |

```text
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
  custom column creation / rename / delete
  permissions / Entra / Graph / tenant mutation
  SharePoint adapter implementation
  schema mapping concrete Internal Names LOCK as CONFIRMED without evidence
  Implementation Start
  Deploy / real data
  treating default-column-only Lists as mapping-complete
  Issue Status Reconciliation / Issue close / Issue body rewrite
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
Decision-AS-CN1-OBSERVATION-1: OPEN / NOT OBSERVED
Awaiting: Human read-only column metadata evidence
Until evidence posted and accepted:
  CN-1 = OPEN
  adapter / schema mapping impl = HOLD
  Implementation Start = HOLD
After CN-1 CONFIRMED（separate docs / Acceptance）:
  Issue Status Reconciliation may be selected as next process unit
```
