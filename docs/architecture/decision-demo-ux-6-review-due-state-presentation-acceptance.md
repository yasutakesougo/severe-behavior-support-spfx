# DEMO-UX-6 — Selection Acceptance

Decision: `Decision-DEMO-UX-6-REVIEW-DUE-STATE-PRESENTATION-1`

## Acceptance criteria for the selected slice

- [x] Review status presentation is selected as an explicit responsibility.
- [x] Due-state presentation is selected as an explicit responsibility.
- [x] `期限接近` / `確認待ち` 等は synthetic presentation label として扱う。
- [x] Presentation-only / synthetic-data boundary is explicit.
- [x] Existing Phase 1 presentation surfaces must remain intact.
- [x] Business/institutional facts and system state must remain visually distinguishable.
- [x] Live SharePoint / Entra / binder / adapter I/O is OUT.
- [x] Review / evaluation mutation is OUT.
- [x] Due-state calculation/business-rule implementation is OUT.
- [x] Real user data is OUT.
- [x] Production deploy is OUT.
- [x] Selection does not authorize Implementation Start, Ready, Merge, or #299 Close.

## Implementation acceptance target

A later authorized implementation should allow a responsible person to review, using fully synthetic data only:

1. who/what requires review attention,
2. the displayed review status,
3. the displayed due-state label,
4. enough context to explain why the item is surfaced,
5. without implying that live business rules or tenant data are active.

The exact calculation semantics for dates, thresholds, due, overdue, cadence, or observation periods are not established by this Selection document.
