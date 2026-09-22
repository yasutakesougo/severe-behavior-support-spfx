# CURRENT-MAIN-HUMAN-ACCEPTANCE-CORRECTION-1 Implementation Plan

> **Execution note:** Follow the locked Human Definition / Scope Lock and the explicit Human Implementation Start GO. Keep Ready, Merge, Deploy, tenant mutation, and Human Acceptance Re-Run separate.

**Goal:** Correct only HA-F001 through HA-F003 and add a synthetic, human-observable acceptance basis for HA-F004 without changing authorization, schema, production data, or historical evidence.

**Architecture:** Reuse the existing planner `D-PLAN` destination, existing ADMIN_AUDIT read-oriented presentation role, and existing monitoring result contract. Keep fixture and traceability attributes available for automation while making the human-facing route/action/state meaning explicit.

**Tech Stack:** TypeScript, React, SPFx shell, existing Node test suites, existing synthetic browser smoke harnesses.

**Spec:** Human-provided Definition Draft-1, Fresh Independent Definition Review-1 (`PASS / REVIEW-CLEARED`), Human Definition / Scope Lock GO, Product Basis `521bc3ac94a8a6ab37a588419a51b7882421b714`.

## Global Constraints

- Product basis is the exact current-main commit above; work only in the clean managed worktree.
- No new Destination, router architecture, state ownership model, authorization model, schema value, tenant data, live write, deploy, or historical evidence rewrite.
- HA-F004 remains acceptance-state insufficiency, not a product defect. Use only the existing synthetic `0件` and `NOT_PERFORMED` contract values.
- No Human PASS, Ready, Merge, Deploy, or Acceptance Re-Run is claimed by implementation or automated verification.

## Tasks

### 1. Lock the failing behavioral tests

- Add a planner navigation test proving that opening the lawful existing plan from the existing `探す` flow enters the existing `D-PLAN` meaning while retaining lawful context and without adding a Destination.
- Add an ADMIN_AUDIT overview test proving the record-related action is human-readable as confirmation/read-only meaning rather than a write instruction, while the navigation remains presentation-only.
- Add a monitoring acceptance-basis test proving one synthetic session can expose both the existing zero-record state and the existing `NOT_PERFORMED` fact without equating them.
- Run the focused tests and confirm the new assertions fail before implementation.

### 2. Implement the bounded correction

- Update the planner session transition used by the existing-plan entry so the already-defined `D-PLAN` is the current task location; keep `D-FIND-PERSON` for the list/search surface and preserve fail-closed context behavior.
- Add role-scoped ADMIN_AUDIT action copy at the existing Overview presentation boundary; do not change authorization or the underlying synthetic navigation target.
- Add a compact human-readable evidence-first cue on the relevant read surface, retaining data attributes and traceability metadata for automation.
- Extend the existing synthetic monitoring smoke path with an observable `0件`/`実施できなかった` comparison using the existing contract and no persistence.

### 3. Verify and report boundaries

- Run focused TypeScript/React tests, root tests/typecheck/lint, and the relevant synthetic browser smoke suites under Node `22.23.1`.
- Inspect the diff and scope checks for only the named correction surfaces.
- Report exact HEAD/tree identity, changed files, verification results, and explicitly leave Ready/Merge/Deploy/Human Acceptance Re-Run unconsumed.
