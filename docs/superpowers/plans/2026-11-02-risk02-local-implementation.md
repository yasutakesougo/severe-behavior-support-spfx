# RISK-02 Local Synthetic Contract Implementation Plan

> **Execution:** Inline implementation in the dedicated codex/risk02-local-implementation worktree. No commits are permitted by the Human GO.

**Goal:** Implement the RISK-02 scope, immutable row identity, synthetic publication/read consistency, freshness controller, and production-only display gate as local code that is not connected to SharePoint or the existing synthetic UI path.

**Architecture:** Keep the current A2 DTOs and fixed plan-version link unchanged. Extend pure Repository ports with explicit scope; add deterministic RowKey and immutable in-memory synthetic storage; model facility publication and Reader double-checking without a physical SharePoint adapter; implement freshness as a deterministic controller with injected clock and verifier; expose a separate production display gate that rejects legacy/synthetic inputs.

**Tech Stack:** TypeScript, Node 22.23.1, node:test/tsx, TypeScript compiler, ESLint; existing pure sha256Hex helper.

**Spec:** /Users/yasutakesougo/Downloads/risk02-production-design-2026-11-02.md (local implementation specification only; no Design Lock or production enablement).

## Global Constraints

- Fixed source: 71900863d5f9d549daeb553f333595315f57b699.
- Preserve A2 fixed plan-version links and existing DTO field names.
- Preserve VP-1 Header/Version co-location; do not introduce a separate Version list.
- Do not adopt Manifest.
- Do not connect to SharePoint, Entra, M365, real data, or credentials.
- Do not create physical columns or ACLs; synthetic Control is in-memory only.
- Do not wire the new production display gate into the existing synthetic path.
- No commit, push, PR, merge, package upload, deployment, or rollback.
- Freshness values: maximum age 60 seconds, revalidation 30 seconds after successful verification, per-request timeout 10 seconds, at most one retry; retry exhaustion stops periodic checks until re-entry.

## Review Focus

- Same planId across distinct scope identities must not cross-read or overwrite.
- RowKey hash collision must compare the full CanonicalKey and fail without mutation.
- A competing publisher or partial/unknown write must never return Control to STABLE as if successful.
- Old generation, old request, old revision, expired token, or wrong scope must not authorize display.
- Existing synthetic/legacy display behavior must remain unchanged and isolated from the new production gate.

---

### Task 1: Scoped Repository Contract

**Files:**
- Modify: src/domain/support-plan-repository.ts
- Modify: src/integration/person-registry/person-support-plan-read-adapter.ts
- Modify: tests/integration/person-registry-support-plan-read.test.ts
- Create: tests/domain/support-plan-repository-scope.test.ts
- Create: src/testing/synthetic-support-plan-repository.ts

**Interfaces:**
- Add SupportPlanScope = { organizationId; siteId; userId }, SupportPlanIdentity = SupportPlanScope & { planId }, and SupportPlanVersionIdentity = SupportPlanIdentity & { version }.
- Header getById and findCurrentByUser, version getVersion and listVersions, and user lookup methods take explicit scope objects. Version save continues to derive identity from the unchanged SupportPlanVersion DTO.
- Synthetic store keeps rows with full identity; exact duplicate version save returns CONFLICT; ambiguous matching rows return ERROR; no existing row is overwritten.

- [x] Write failing tests for same planId in different organization/site/user scopes, exact version lookup, multiple versions, ambiguity, and duplicate-save conflict.
- [x] Run node --import tsx --test tests/domain/support-plan-repository-scope.test.ts tests/integration/person-registry-support-plan-read.test.ts; confirm expected failures before implementation.
- [x] Implement scoped types and synthetic repository; update the existing read adapter and its mock to pass the same scope.
- [x] Re-run the same tests and confirm both pass.

### Task 2: RowKey and Immutable Synthetic Row Store

**Files:**
- Create: src/domain/support-plan-row-key.ts
- Create: tests/domain/support-plan-row-key.test.ts
- Create: src/testing/synthetic-support-plan-row-store.ts

**Interfaces:**
- createSupportPlanRowIdentity(kind, scope, planId, version?, hash = sha256Hex) returns { rowKind, rowKey, canonicalKey }.
- Canonical tuples follow spec tags rk1/H, rk1/V, rk1/C; reject empty IDs, ill-formed Unicode, invalid version, malformed hash output, and a key exceeding the SharePoint candidate max length of 255.
- Synthetic row insertion compares full CanonicalKey on an existing RowKey, returns collision on mismatch, and returns CONFLICT for a repeated Header/Version identity without replacing stored payload.

- [x] Add literal-vector tests, delimiter/Unicode scope tests, invalid-input tests, and forced-hash-collision/duplicate-version behavior tests.
- [x] Run the targeted Node tests and confirm RED for the missing behavior.
- [x] Implement the pure RowKey builder and synthetic immutable row store.
- [x] Re-run targeted tests and confirm GREEN.

### Task 3: Synthetic Publication Control, Publisher, and Reader

**Files:**
- Create: src/domain/support-plan-publication.ts
- Create: tests/domain/support-plan-publication.test.ts
- Create: src/testing/synthetic-publication-store.ts

**Interfaces:**
- Control phases are STABLE, UPDATING, and RECOVERY_REQUIRED; Control contains facility scope, revision, operationId, startedAt, failure reason, and synthetic ETag.
- Publisher uses compare-and-swap on the expected Control ETag; no retry on conflict. It increments revision when entering UPDATING and again when successfully publishing STABLE.
- Reader reads Control, reads scoped rows, then reads Control again; only matching STABLE revision with complete unambiguous rows can resolve.
- Partial failure stays non-STABLE; unknown completion requires idempotency-key reconciliation; no automatic rollback or ownership stealing.

- [x] Add success, concurrent publisher, write failure, partial/unknown outcome, recovery-required, and mid-read revision-change tests.
- [x] Run the targeted tests and confirm RED.
- [x] Implement only the storage-independent synthetic contracts and in-memory implementation.
- [x] Re-run targeted tests and confirm GREEN.

### Task 4: Freshness Controller and Production Display Gate

**Files:**
- Create: src/domain/support-plan-freshness.ts
- Create: tests/domain/support-plan-freshness.test.ts
- Create: src/domain/production-procedure-display.ts
- Create: tests/domain/production-procedure-display.test.ts

**Interfaces:**
- Controller receives an injected verifier and wall/monotonic clock plus timer scheduler; it exposes enter, hide, resume, and render-time getDisplayPermit operations.
- Every request binds target scope/key, generation, requestId, minimum known revision, start timestamps, completion timestamps, and expiry. Responses are checked at acceptance and display.
- Values: TTL 60s from request start; next check 30s after successful completion; timeout 10s; initial attempt plus one retry; one cycle per generation; retry exhaustion stops until re-entry.
- Hidden/pagehide invalidates generation, clears visible payload and timers, and aborts where available. Duplicate visible/pageshow events coalesce. Resume starts a fresh generation.
- Production display function accepts only explicit RESOLVED + a current verification token; it rejects synthetic/legacy/undefined status and expired, wrong-scope, wrong-generation, old-request, or stale-revision responses. It is not wired into current synthetic UI.

- [x] Add deterministic fake-clock tests for TTL boundary, delayed timer, request timeout, one retry maximum, no periodic retry after exhaustion, re-entry recovery, duplicate resume, hidden late response, A→B target switch, older revision response after newer revision, and render-time denial.
- [x] Add TC-UI-PRODUCTION-LEGACY-REJECT-01 and TC-UI-SAME-TARGET-REENTRY-01 as pure gate/controller behavior tests.
- [x] Ran the freshness case as RED against the missing controller; the display-gate tests were separated into their own file and were not given a separate RED run.
- [x] Implement the isolated controller and gate; do not modify CurrentProcedure.tsx or wire into the current synthetic path.
- [x] Re-run tests and confirm GREEN.

### Task 5: Full Local Verification and Review Packet

**Files:**
- Review all files above; no other source/config/dependency changes.

- [x] Run root `npm test` (1069/1069), `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run check:contracts-boundaries`, and `npm run check:scope`.
- [x] Do not run an SPFx build: this implementation remains in root-domain synthetic modules. `spfx`'s `build` script also runs production tests and `package-solution`; no SPFx build, bundle, or package generation was run.
- [x] Run `git diff --check`, review tracked and untracked changes, and record final status. The worktree contains 17 changed paths, including the added JSON snapshot helper; no package, lockfile, or configuration changed.
- [x] Report synthetic results separately from real ACL/API/browser/OS-suspend evidence; RISK-02 and Production readiness remain OPEN.
