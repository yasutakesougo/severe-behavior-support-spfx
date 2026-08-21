# LIVE-CREATE-TEST-ONLY-RUNTIME-PATH-DECISION-1

この文書は **LIVE-CREATE-TEST-ONLY-RUNTIME-PATH-DECISION-1** の
Human Selection 正本である。
判定材料は Human SELECT **B2 — ISOLATED TEST-ONLY HARNESS** である。

本記録は **architecture direction only** を固定する。
Implementation Start、code mutation、Deploy、SharePoint POST、
LIVE CREATE、Production Binding は認可しない。

準備正本（CREATE authorization は別単位）:
[`post-pr477-residual-prioritization-live-create-decision-preparation-1.md`](./post-pr477-residual-prioritization-live-create-decision-preparation-1.md)

Production Binding 正本（再 Decision しない）:
[`spfx-production-binding-decision-1.md`](./spfx-production-binding-decision-1.md)
（Option A — KEEP unbound / SELECTED / LOCKED）

fixture-only Deploy 正本（再 Decision しない）:
[`spfx-fixture-only-deploy-1.md`](./spfx-fixture-only-deploy-1.md)

GATE-3 transport closeout（再利用先; 再実装しない）:
PR #477 MERGED / `procedure-record-lifecycle-event` GATE-3 implementation

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: LIVE-CREATE-TEST-ONLY-RUNTIME-PATH-DECISION-1
Kind: Human Decision recording（docs-only）
Status: SELECTED / LOCKED
Option: B2 — ISOLATED TEST-ONLY HARNESS
Intent: Authorize B2 as the architecture direction only
Date: 2026-08-21
Issue owner: #448
Preparation basis (origin/main):
  169e7dcfb52f54069901c1ab31254eae3e6e4142
  Merge pull request #478 from
  yasutakesougo/docs/post-pr477-live-create-decision-preparation-1
GATE-3 merge basis:
  90e9db8077f24942dcf309860dad4b8f97ab1e52
  Merge pull request #477
Implementation Start: NOT AUTHORIZED
LIVE WRITE: HOLD
SharePoint POST: NOT AUTHORIZED
Production Binding: NOT ACTIVE（Option A KEEP unbound 維持）
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Human Selection

```text
Human Decision: B2 — ISOLATED TEST-ONLY HARNESS
Selection: SELECTED / LOCKED
Intent: Authorize B2 as the architecture direction only
```

## 2. Architecture direction（LOCKED）

```text
isolated test-only SPFx harness
  → existing Slice C lifecycle persistence
  → existing Slice E storage port
  → existing PR #477 GATE-3 transport
```

```text
REUSE:
  existing procedure-record-lifecycle-event GATE-3 implementation

PRESERVE:
  ScaffoldShellWebPart = fixture-only / unchanged
  Production Binding Option A = KEEP unbound / LOCKED
  normal runtime LIVE WRITE = HOLD
  production Site / List binding = NOT ACTIVE
```

B2 は production host への配線ではない。
`ScaffoldShellWebPart` を live I/O 入口に変えない。
既存 GATE-3 実装を再利用し、別経路の POST 実装を新設しない方針を固定する。

## 3. B2 requirements（direction lock; not Implementation Start）

将来の Implementation Start / Human GO が別途与えられた場合に限り、
次を B2 実装要件として拘束する。本 Decision だけでは実行しない。

```text
- separate SPFx component / entrypoint
- historical test-only Site / List only
- synthetic non-PII CANCEL only
- Human GO receipt required
- exact SHA / binding validation
- max 1 POST
- retry POST = 0
- UPDATE = 0
- DELETE = 0
- mandatory LifecycleEventId read-back
- INDETERMINATE dual-identity reconciliation
- fail closed on mismatch / unknown
```

Outcome semantics（準備正本 §4 と整合; 再定義しない）:

```text
CREATED success:
  mandatory LifecycleEventId exact read-back
INDETERMINATE:
  dual-identity reconciliation
  (LifecycleEventId + LifecycleIdempotencyKey)
  read-only only; second POST FORBIDDEN
mismatch / unknown / multi-match / malformed:
  fail closed
```

## 4. Explicit non-authorization

```text
This Decision DOES NOT authorize:
- Implementation Start
- code mutation
- package version bump
- PR
- Deploy
- App Catalog mutation
- SharePoint POST
- LIVE CREATE
- Production Binding
- Option B execution
- Issue close
```

```text
B2 SELECTED / LOCKED
  ≠ Implementation Start
  ≠ harness code
  ≠ test-only CREATE GO
  ≠ Deploy GO
  ≠ Production Binding reopen
  ≠ normal runtime LIVE WRITE
```

## 5. Separation from adjacent decisions

| Unit | State after this Decision | Notes |
|---|---|---|
| LIVE-CREATE-TEST-ONLY-RUNTIME-PATH-DECISION-1 | **SELECTED / LOCKED / B2** | architecture direction only |
| post-PR477 CREATE authorization (prep Option A/B/C) | **NOT SELECTED here** | separate Human decision + separate Human GO |
| SPFX-PRODUCTION-BINDING-DECISION-1 Option A | **UNCHANGED** | KEEP unbound / LOCKED |
| ScaffoldShellWebPart fixture-only | **UNCHANGED** | not the B2 entrypoint |
| PR #477 GATE-3 transport | **REUSE / CONSUMED** | do not reimplement |
| normal runtime LIVE WRITE | **HOLD** | preserved |

## 6. Safe next actions

```text
1. Keep Implementation Start HOLD until a separate Human GO names
   exact B2 harness scope and SHA / binding.
2. Keep LIVE CREATE HOLD until a separate CREATE authorization Decision
   and Human GO receipt name exact test-only scope.
3. Do not mutate ScaffoldShellWebPart, package version, App Catalog,
   or production Site / List binding under this Decision.
4. Optional: Independent Review of this selection recording（docs-only）.
```

## 7. Verdict

```text
LIVE-CREATE-TEST-ONLY-RUNTIME-PATH-DECISION-1:
SELECTED / LOCKED
B2 — ISOLATED TEST-ONLY HARNESS
Architecture direction: AUTHORIZED
Implementation Start: NOT AUTHORIZED
code mutation: NOT AUTHORIZED
Deploy / App Catalog: NOT AUTHORIZED
SharePoint POST / LIVE CREATE: NOT AUTHORIZED
Production Binding: NOT ACTIVE
normal runtime LIVE WRITE: HOLD
Issue close: NOT AUTHORIZED
```
