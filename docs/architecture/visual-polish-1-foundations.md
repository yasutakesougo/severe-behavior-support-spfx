# VISUAL-POLISH-1 — Foundations（Implementation Acceptance）

```text
Unit: VISUAL-POLISH-1 — Foundations
Status: Implementation complete（Draft PR） / Fresh Review pending
Authority:
  docs/architecture/visual-polish-1-foundations-assessment.md
  Assessment PR #367 @ dae06ada1bb28ca0e563896b96b23f48edfa097b
  Human Implementation Start GO（this wave）
Kind: additive design-token extension on DADS-04
Screen re-layout: 0
Deploy / SharePoint / App Catalog / M365 / Entra mutation: FORBIDDEN
VP-2 Overview Start: NOT AUTHORIZED
```

## 1. Purpose

共通 Visual System を DADS-04 トークン層へ **additive** に拡張し、後続 Overview / Users / Workflow polish の正本を固定する。

```text
目標 = Foundations tokens exist
目標 ≠ Overview / Users / Workflow 見た目の全面適用
目標 ≠ 業務意味・save 5-state・status vocabulary の変更
```

## 2. Base / HEAD

```text
BASE SHA (origin/main at Implementation Start):
  72cad1b3ad126e00531b4726079f248f53412cd0
Prior Visual Acceptance application RC (unchanged pin):
  8173a4c18f6ce85254467c67ce81b481a537a35d
VA-2 closeout: NOT rewritten
```

## 3. Implemented tokens

| Category | Tokens |
|---|---|
| Spacing | `space.6` = `2rem` (32px)；`space.1–5` retained |
| Surface | `surface`, `surfaceHover`（`surfaceCanvas` / muted / subtle retained） |
| Text | `textSecondary`, `textDisabled`（`textPrimary` retained） |
| Elevation | `elevationNone`, `elevationSubtle` |
| Typography | `pageTitle`, `sectionTitle`, `body`, `meta` aliases |
| Radius | `small` / `medium` aliases（`sm` / `md` retained — no rename） |
| Action | `primary`, `secondary`, `tertiary` presentation weights |
| Status presentation | `neutral`, `attention`, `warning`, `danger`, `success` aliases |
| Feedback | `feedbackSuccess*` chrome（additive） |
| Save-state map | **unchanged**（unknown ≠ failed） |

## 4. Code layout

```text
spfx/src/shell/tokens/
  raw.ts
  semantic.ts
  sbs-tokens.scss
  index.ts
  tokens.test.ts
docs/architecture/
  visual-polish-1-foundations-assessment.md
  visual-polish-1-foundations.md（this file）
```

No Overview / Users / Workflow TSX/SCSS restructure in this slice.

## 5. Explicit OUT

```text
Overview / Users / Workflow re-layout
navigation semantics change
status vocabulary change（要確認 / 未記録 / 期限接近）
save 5-state collapse / rename
fail-closed / permission / schema / SharePoint mutation
React 18 / Fluent UI v9
Deploy / App Catalog / M365 / Entra mutation
ThemeProvider mandatory rewrite
mass off-scale spacing remapping across screens
VA-1 / VA-2 closeout rewrite
VP-2 Start
```

## 6. Preserved invariants

```text
要確認 / 未記録 / 期限接近
unsaved / saving / saved / save_failed / save_outcome_unknown
save_outcome_unknown presentation ≠ save_failed
fail-closed / unselected / access_denied
destination heading focus
data-demo-ux / data-dashboard-ux smoke hooks
SPFx 1.23.2 / React 17.0.1 / Fluent UI v8
```

## 7. Acceptance checklist（VP-1 §11）

- [x] common visual tokens exist
- [x] spacing scale fixed（4–32）
- [x] typography hierarchy fixed（semantic aliases）
- [x] surface rules fixed（canvas / surface / subtle / hover）
- [x] radius / elevation rules fixed
- [x] action hierarchy fixed（presentation tokens）
- [x] semantic status presentation fixed（aliases；labels unchanged）
- [ ] existing verify suite re-run（see Draft PR Verification）
- [x] no screen large re-layout

## 8. Non-claims

```text
VP-1 Foundations ≠ Visual Acceptance for a new RC
VP-1 Foundations ≠ Deploy GO
VP-1 Foundations ≠ VP-2 Overview Start
VP-1 Foundations ≠ permission to weaken browser smoke expectations
```

## 9. Next

```text
1. Draft PR → Fresh Review
2. P0/P1 = 0 required before VP-2
3. Human GO required for VISUAL-POLISH-2 Overview
```
