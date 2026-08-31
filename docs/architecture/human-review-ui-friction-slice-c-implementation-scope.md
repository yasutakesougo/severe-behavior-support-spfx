# HUMAN-REVIEW-UI-FRICTION-SLICE-C — Implementation Scope

```text
Basis main: 6eb7496b1920c10acf146ea23747dd28eb677b64
Evidence basis: Slice B Human Staff Check = PARTIAL
  remaining friction = 人物識別の視認性 only
```

Authority intent:
- Evidence-justified follow-on to Slice B staff PARTIAL
- Human Definition / Implementation Start: treated as authorized for this exact person-identity visibility correction when Implementation Start is consumed on the PR

## Authorized correction only

Elevate existing `personLabel` to **primary visual identity** on:

- `MonitoringView`（期間モニタリング）
- `HumanReviewView`（見直し資料）

Presentation goals:
- Person name is the first identity cue（意識しなくても目に入る）
- Monitoring: person primary, then section title, then 計画版・期間
- Human Review: person as「対象: {personLabel}」primary, then 計画版・期間, then technical「詳細」UserId/planId
- Canonical UserId / planId remain visible as secondary technical detail（削除しない）
- No new person master, no domain identity change, no ProcedureId inference

## Authorized files

- `spfx/src/shell/monitoring/MonitoringView.tsx`
- `spfx/src/shell/monitoring/HumanReviewView.tsx`
- `spfx/src/shell/monitoring/MonitoringViewUx.module.scss`
- focused tests under `spfx/src/shell/monitoring/**`
- this scope / staff-check evidence docs

## Explicitly not authorized

- `src/domain/**`
- `HumanReviewMaterialRecord` schema
- UserId removal / replacement of canonical identity
- sceneLabel / Monitoring-summary / zero-record copy changes（Slice B 維持）
- persistence / plan mutation / AI labeling
- SharePoint / M365 / Entra / Deploy / LIVE WRITE
- broader visual redesign beyond person-identity prominence

## Success for CLOSE eligibility

Same staff re-check question 「誰の記録かすぐ分かる」→ PASS  
Then UI-friction improvement CLOSE may be requested under Human GO.
