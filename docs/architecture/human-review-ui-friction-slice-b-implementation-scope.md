# HUMAN-REVIEW-UI-FRICTION-SLICE-B — Implementation Scope

Basis main: `b7811ddf7d7834b34ebc19b9bc4d20f6accd1921`

Authority:
- Human Definition Lock GO: GRANTED / CONSUMED
- Human Implementation Start GO: GRANTED / CONSUMED

Authorized presentation-only corrections:
- use existing `ShellSupportPlanPresentation` identity and `currentProcedures` as the only scene-label source
- gate label resolution by exact `userId + planId + currentVersion` review context
- then require exactly one `procedureId + procedureVersion + planVersion` procedure match
- fail closed to canonical ProcedureId / ProcedureVersion when context or procedure match is absent, stale, mismatched, or ambiguous
- Monitoring presents period-level summary only
- Human Review owns per-record detailed evidence
- a RecordId-bound full-detail item must not render in both Monitoring and Human Review

Expected implementation files:
- `spfx/src/shell/users/SupportPlan.tsx`
- `spfx/src/shell/monitoring/MonitoringView.tsx`
- `spfx/src/shell/monitoring/HumanReviewView.tsx`
- focused tests under `spfx/src/shell/monitoring/**`

Explicitly not authorized / not changed:
- `src/domain/**` semantic contracts
- `HumanReviewMaterialRecord` schema
- persistence or review outcome writes
- plan mutation / revision
- AI recommendation, scoring, or generated labels
- SharePoint / M365 / Entra mutation
- Deploy / LIVE WRITE

Ready / Merge remain separate human gates.
