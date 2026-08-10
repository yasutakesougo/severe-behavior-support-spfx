# Decision-ILB-1 — Twenty-eighth residual selection

この文書は、PR #187 / #188 MERGED 後の
次 substantive unit を固定する Selection 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: ILB1_TWENTY_EIGHTH_RESIDUAL_SELECTION
Status: SELECTED / CONSUMED
Selected unit: CN-1 Internal Column Names confirmation（read-only observation）
Follow-up Decision / Packet ID: Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED

Locked basis（再 Decision しない）:
  Decision-AS-SP-PLACEMENT-1 = Accepted / LOCKED / SV-1 + LV-1 + CN-1 + SC-1
  Decision-AS-PILOT-PROVISION-EXEC-1 = Accepted / LOCKED
    / PX-1 + VR-1 + FG-1 + XB-1 + EG-1 + AP-1
  Decision-AS-PILOT-LIST-NAMES-1 = Accepted / LOCKED / LN-1 + XB-1
  Decision-AS-PILOT-LIST-OWNERSHIP-1 = Accepted / LOCKED
  Decision-AS-PILOT-FACILITY-IDENTITY-1 = Accepted / LOCKED
  PR #187 = MERGED / Current SoT
  PR #186 = CLOSED / NOT MERGED / SUPERSEDED by PR #187
  Independent Review #187 = PASS
  Independent Review #188 = PASS

Current state:
  Site / List creation = COMPLETED
  SV-1 / LV-1 = CONFIRMED
  VR-1 = PASS
  CN-1 observation = CLOSED / CONSUMED
  Stop point: HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION = COMPLETE
  Result class: DEFAULT_COLUMNS_ONLY
  Custom application columns = 0 / NOT PRESENT
  Match-existing-app-Internal-Names premise = NOT APPLICABLE / INVALIDATED
  SharePoint adapter / schema mapping impl = HOLD（≠ mapping-complete）
  Implementation Start = HOLD
```

## Selection meaning

この Selection は、パイロット Site / List 上の
**Internal Column Names（CN-1）の read-only observation / confirmation**
だけを次 substantive unit として選ぶ。

```text
SELECTED / CONSUMED:
  Decision-AS-CN1-OBSERVATION-1 = CLOSED / CONSUMED
  Stop point: HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION = COMPLETE
  Method: Human SharePoint UI / column settings read-only primary evidence
  Mutation: 0
  Evidence shape LOCK:
    Display Name → Internal Name → Column Type → List → Site
  Evidence: decision-assessment-snapshot-cn1-readonly-observation-evidence.md
  Closure: decision-assessment-snapshot-cn1-closure-determination.md
  Result: DEFAULT_COLUMNS_ONLY / custom application columns = 0
  Internal Name invention: FORBIDDEN
  Display Name / TypeScript 名からの逆算: FORBIDDEN
  Values / row data / settings mutation: OUT OF SCOPE

Closure meaning:
  observation residual closed with observed world-state
  ≠ app-field Internal Names CONFIRMED for adapter mapping
  ≠ mapping-complete
  ≠ Implementation Start

Still NOT authorized / FORBIDDEN now:
  Implementation Start（HOLD）
  Issue 一括 Close
  Issue 本文の一括更新
  SharePoint schema / list / column change
  GitHub Issue mutation
  SharePoint adapter / schema mapping implementation
  permissions / Entra / Graph / tenant mutation
  Deploy / real data
  treating DEFAULT_COLUMNS_ONLY as mapping-complete
```

Selection CONSUMED ≠ mapping-complete ≠ adapter start ≠ Implementation Start。

## Options considered（selection-time）

| ID | unit | 結果 |
|---|---|---|
| **A** | CN-1 Internal Column Names confirmation（read-only） | **SELECTED** |
| B | SharePoint adapter / schema mapping implementation | NOT SELECTED（HOLD until CN-1 closed） |
| C | Issue Status Reconciliation（#6 / #8 / #22 Current status sync） | NOT SELECTED as current gate（scheduled after CN-1） |
| D | Implementation Start | NOT SELECTED（HOLD） |
| E | HOLD / no selection | NOT SELECTED |

## Process debt（explicitly deferred）

```text
Issue Status Reconciliation:
  Status: ASSESSED / NOT SELECTED as current substantive gate
  Assessment: docs/architecture/issue-status-reconciliation-assessment.md
  Target Issues (Human attestation): #6 / #8 / #22（and other OPEN STALE bodies）
  Rule: Issue close ≠ body Current/Gate/Dependency resync
  Timing: after CN-1 Selection / Packet / observation cycle
  GitHub Issue mutation in this Selection: NONE
```

## Next

```text
Stop point: HUMAN_CN1_INTERNAL_NAME_READ_ONLY_OBSERVATION = COMPLETE
Twenty-eighth residual: CONSUMED
Decision-AS-CN1-OBSERVATION-1: CLOSED / CONSUMED
Next gate: decision-assessment-snapshot-cn1-next-gate.md
Next residual: decision-ilb-1-twenty-ninth-residual-schema-mapping-selection.md
  SELECTED / OPEN
  theme = schema mapping / column path / Implementation Start boundary

Still HOLD:
  SharePoint adapter / schema mapping impl = HOLD
  Implementation Start = HOLD
  Deploy / real data = NO-GO
  SharePoint schema/list/column change = FORBIDDEN
  GitHub Issue mutation / 一括 Close / 一括本文更新 = FORBIDDEN

Independent next-unit candidate:
  Issue Status Reconciliation（Current/Gate/Dependency resync only）
```
