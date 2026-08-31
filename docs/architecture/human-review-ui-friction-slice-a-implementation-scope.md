# HUMAN-REVIEW-UI-FRICTION-SLICE-A — Implementation Scope

Basis main: `af8777d3e93c73d4c1761270986092592b8376d4`

Authority:
- Human Definition Lock GO: GRANTED / CONSUMED
- Human Implementation Start GO: GRANTED / CONSUMED

Authorized correction scope:
- `spfx/src/shell/monitoring/HumanReviewView.tsx`
- `spfx/src/shell/monitoring/MonitoringView.tsx`
- focused tests for those presentation changes

Presentation goals:
- existing `personLabel` appears before canonical UserId
- canonical UserId and planId remain visible
- zero-record state explicitly states that zero matching records does not mean `NOT_PERFORMED`
- stable in-page jump to Human Review materials
- factual result labels remain unchanged
- `PERFORMED_WITH_ADAPTATION` remains non-failure-framed

Procedure friendly-label disposition:
- an existing presentation-only `sceneLabel` source exists in `ShellSupportPlanPresentation.currentProcedures`
- this exact correction does not invent or infer a label from ProcedureId
- no new domain contract is introduced
- technical ProcedureId / ProcedureVersion remain factual identity

Not authorized:
- review persistence
- plan mutation
- AI recommendation / scoring
- SharePoint / M365 / Entra mutation
- Ready / Merge / Deploy / LIVE WRITE
