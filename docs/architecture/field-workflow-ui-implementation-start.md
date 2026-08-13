# FIELD-WORKFLOW UI (#356) — Implementation Start

Status: **IMPLEMENTATION AUTHORIZED** (Human GO received 2026-08-13)

```text
Issue: #356
Decision: Issue #356 FIELD-WORKFLOW UI Implementation Start GO
Target PR: field-workflow-ui
main baseline at GO: cfe09f4…（post #355） / A/B MERGED
```

## In scope

- FW-01 current procedure presentation (A2 projection)
- FW-02 「この手順を記録」+ context handoff under users destination
- FW-03 result-centric ProcedureRecord form
- FW-07 Review → ProcedureRecord → plan/version
- FW-08 ~390px / keyboard-oriented field flow
- FW-09 save_failed retain / save_outcome_unknown no immediate retry
- DADS IA / save 5-state / INV-07/10/17 preserved

## Out of scope / NO-GO

```text
SharePoint / M365 / Entra mutation
Deploy / App Catalog / production write
#68 / #69 / #299 / #347 / #352 auto-close
A1 procedure body schema promotion
ABC / Observation recording-ui (#69)
```

## Gate

```text
Implementation Start: AUTHORIZED for #356 UI slice only
Synthetic data only: REQUIRED
Ready / Merge: HUMAN-ONLY
```
