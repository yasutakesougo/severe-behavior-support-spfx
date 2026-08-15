# VISUAL-POLISH-3 — Users Implementation Start

```text
Unit: VISUAL-POLISH-3 — Users
Status: IMPLEMENTATION COMPLETE / HANDOFF PENDING
Baseline main: eda85db15b054cb3dbcde18fe8c59b506183de88
Human Implementation Start: GO received
Kind: Users list / User Detail presentation-only polish
DADS React Storybook: Visual / Interaction / Accessibility reference only
New RC: NOT AUTHORIZED
Visual Acceptance: NOT AUTHORIZED
Deploy / SharePoint / M365 / Entra mutation: FORBIDDEN
```

## Scope

This slice applies the VISUAL-POLISH-1 Foundation tokens to the existing
Users list and User Detail surfaces. It preserves the existing DADS-UX-3
structure, primitives, and synthetic presentation behavior.

In scope:

- Users list and User Detail typography roles
- spacing, surface, border, radius, and limited elevation presentation
- status badge host presentation without changing status meaning or shape
- filter, detail, back, and plan/procedure action default, hover, focus,
  active, and disabled presentation
- existing Users presentation-boundary metadata and regression coverage

## Preserved invariants

```text
Users list / User Detail IA and navigation semantics: unchanged
status vocabulary（要確認 / 未記録 / 期限接近）: unchanged
permissions / fail-closed behavior: unchanged
save 5-state: unchanged
synthetic fixtures and data-demo-ux smoke hooks: preserved
SectionLabelStrip remains a non-interactive section-order primitive
live Users data / SharePoint adapter I/O: unauthorized
```

## Explicit OUT

```text
Records / Review / Support Plan implementation
domain / contracts / schema changes
auth / permission judgment changes
live SharePoint REST / binder / adapter I/O
React 18 / Fluent UI v9 / DADS React dependency
new RC / Visual Acceptance / Deploy
```

## Expected changed files

```text
spfx/src/shell/users/UsersUx.module.scss
spfx/src/shell/users/UserDetailUx.module.scss
spfx/src/shell/users/users-fixture.ts
spfx/src/shell/users/index.ts
spfx/src/shell/users/users.test.ts
docs/architecture/visual-polish-3-users-implementation-start.md
```

Verification is required before any later Fresh Review, Ready, or Visual
Acceptance gate.
