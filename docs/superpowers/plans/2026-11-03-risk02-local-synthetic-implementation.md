# RISK-02 Local Synthetic Implementation Plan

**Basis:** `507c8c758056b54e26b71a82b8871bda96f9fa57`
**Design:** `docs/superpowers/specs/2026-11-03-risk02-production-connectivity-design.md`
**Design SHA-256:** `f7122b1baab806c2cb5e219525f5a79ad135d7d2a008b0c1c75c873a683f8509`

## Scope and boundaries

Implement only the four locally testable design slices approved for RISK-02:

1. Person mapping configuration injection, no implicit default, and exact source/organization/scope/type/site matching before repository access.
2. A durable-operation Journal port with a synthetic persistence adapter; PREPARED/UPDATING/COMMIT_READY/COMMITTED/RECOVERY_REQUIRED transitions; restart and ambiguous-write tests that remain HOLD and never replay writes.
3. A Graph-shaped read port and mock query adapter for indexed PlanKey filtering, full continuation paging, exact scope/plan/version validation, and fail-closed incomplete/duplicate/invalid-page/threshold cases. No HTTP client or tenant endpoint.
4. Production display boundary and SPFx re-entry, expiry, generation, revision, and delayed-response tests. Keep the Production gate isolated from the current synthetic route.

No live tenant/API connection, SharePoint mutation, identity/permission change, production wiring, deployment, push, PR, merge, or commit. Do not add production mapping values or physical SharePoint schema assumptions. Preserve the existing dirty implementation worktree.

## TDD task sequence

### 1. Person mapping

- Tests: `tests/integration/person-registry-support-plan-read.test.ts`
- Implementation: `src/integration/person-registry/person-support-plan-read-adapter.ts`; add adjacent parser/config module only if it keeps the boundary clearer.
- Add failing cases for absent/malformed configuration, every mapping-field mismatch, cross-organization/site mapping, registry conflict, and repository non-invocation; then add passing explicit test-only configuration cases.

### 2. Publication Journal

- Tests: `tests/domain/support-plan-publication.test.ts`
- Implementation: `src/domain/support-plan-publication.ts`; add `src/testing/synthetic-support-plan-operation-journal.ts` and connect it from `src/testing/synthetic-publication-store.ts` or a local test fixture.
- Journal only identity/scope/revision/digest metadata, never plan payloads or credentials. Persist intent before Control CAS and update Journal phases conditionally. After publisher reconstruction, use the same Journal port; missing/mismatched intent, unknown outcomes, partial writes, or uncertain transitions must HOLD and must not call a writer again.
- Require each Header `currentVersion` to resolve to exactly one same-scope Version row. Before a later Header operation reuses an existing Version, match its current digest to earlier COMMITTED Journal evidence; only the operation creating a new Version may attest that row for the first time. Reader verifies every snapshot row against its latest committed digest before resolving.
- Never create a missing Control from the Publisher path. Fixture setup initializes Control explicitly. Verify the current stable Control's operation is COMMITTED and revision-matched before another write. Commit the verified Journal intent while Control remains UPDATING; only then CAS Control to STABLE. After restart, committed Journal plus non-stable Control requires explicit evidence-based recovery.

### 3. Graph-shaped search and paging

- Tests: add `tests/integration/support-plan-graph-query.test.ts`.
- Implementation: add `src/integration/sharepoint/support-plan-query.ts` and a deterministic `src/testing/mock-graph-list-port.ts` only where needed by tests.
- Start with one indexed PlanKey filter, bind continuations to the explicit synthetic list collection, follow only returned links until terminal page or the 25-page limit, and reject repeated/foreign/malformed links, page failures, incomplete results, duplicate identities, malformed rows, scope or plan mismatch, and threshold/limit uncertainty. This is a mock adapter, not a production Graph transport.

### 4. Display boundary and asynchronous regressions

- Tests: extend `tests/domain/production-procedure-display.test.ts`, `spfx/src/shell/procedure/canonical-procedure-adapter.test.tsx`, and `spfx/src/shell/procedure/CurrentProcedure.test.tsx` only where necessary.
- Implementation: change the production display gate or canonical adapter only if a new test demonstrates a gap in the approved contract. First render after re-entry/target change must not expose the old body; older generation/revision responses and expired tokens remain hidden.

## Verification and review

- Use Node `22.23.1` and the repository's exact generated SPFx build prerequisite.
- Establish baseline `npm run verify:ci` and SPFx tests before implementation; record prerequisite failures separately from code failures.
- Run focused failing-then-passing tests per slice, then root `npm run verify:ci` and SPFx `npm run build`.
- Freeze the final uncommitted diff and request an independent read-only review in a separate context. Fix only in-scope findings test-first and rerun affected checks plus full verification when code changes.
- Preserve command logs, exit codes, base/HEAD, final changed paths, clean/dirty status, and final diff SHA-256 under `/tmp/risk02-local-synthetic-20261103/evidence`.

## Review focus

- No old or cross-scope Person mapping can call the repository.
- Journal state and actual rows are reconciled; existing pinned Versions cannot be re-attested from snapshot contents alone. Missing Control, process restart, partial writes, and response loss never trigger an automatic writer replay or release HOLD.
- Paging cannot turn a partial/over-threshold/ambiguous Graph result into a successful complete list.
- Production display is hidden on the first re-entry render and rejects expired tokens and stale generation/revision responses; synthetic data never satisfies the Production gate.
