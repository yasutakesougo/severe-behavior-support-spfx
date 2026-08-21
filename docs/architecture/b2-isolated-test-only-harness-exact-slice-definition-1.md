# B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1

```text
B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1

STATUS:
READ-ONLY DEFINITION COMPLETE
READY FOR INDEPENDENT DEFINITION REVIEW

BASE:
main@3e4e2dee195ce82299b62f4b668d50cb563d2c68

AUTHORITY:
LIVE-CREATE-TEST-ONLY-RUNTIME-PATH-DECISION-1
B2 — ISOLATED TEST-ONLY HARNESS
SELECTED / LOCKED

Implementation Start:
NOT AUTHORIZED

Deploy / App Catalog:
NOT AUTHORIZED

SharePoint POST / LIVE CREATE:
NOT AUTHORIZED

repository: yasutakesougo/severe-behavior-support-spfx
Unit: B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1
Kind: read-only exact-slice definition
Independent Definition Review: NOT YET COMPLETE
Human Implementation Start GO: NOT YET ELIGIBLE
Issue mutation: FORBIDDEN
Production Binding: NOT ACTIVE (Option A KEEP unbound)
```

Authority Decision:
[`live-create-test-only-runtime-path-decision-1.md`](./live-create-test-only-runtime-path-decision-1.md)

Production Binding（再 Decision しない）:
[`spfx-production-binding-decision-1.md`](./spfx-production-binding-decision-1.md)
（Option A — KEEP unbound / SELECTED / LOCKED）

GATE-3 transport closeout（再利用先; 再実装しない）:
PR #477 MERGED / `procedure-record-lifecycle-event` GATE-3 implementation

## 1. Objective

将来の別 Human GO の下でのみ、次の実行経路を可能にする。

```text
isolated test-only SPFx web part
  ↓
Human GO receipt gate
  ↓
synthetic CANCEL input
  ↓
existing Slice C
  ↓
existing Slice E
  ↓
existing PR #477 GATE-3 transport
  ↓
historical test-only lifecycle List
```

`ScaffoldShellWebPart` は完全に fixture-only のまま変更しない。これは B2 正本の明示要件である。

本定義は exact implementation slice を固定するのみである。
Implementation Start、code mutation、Deploy、SharePoint POST、LIVE CREATE、
Production Binding は認可しない。

## 2. Binding authority

```text
LIVE-CREATE-TEST-ONLY-RUNTIME-PATH-DECISION-1
Option: B2 — ISOLATED TEST-ONLY HARNESS
Status: SELECTED / LOCKED
Intent: architecture direction only
```

B2 direction lock（再定義しない）:

```text
isolated test-only SPFx harness
  → existing Slice C lifecycle persistence
  → existing Slice E storage port
  → existing PR #477 GATE-3 transport
```

```text
PRESERVE:
  ScaffoldShellWebPart = fixture-only / unchanged
  Production Binding Option A = KEEP unbound / LOCKED
  normal runtime LIVE WRITE = HOLD
  production Site / List binding = NOT ACTIVE
```

## 3. REUSE / UNCHANGED

以下は再実装しない。

```text
spfx/src/adapters/procedure-record-lifecycle-event/*
  PR #477 GATE-3 transport

src/adapters/sharepoint/procedure-record-lifecycle-event/
  cancellation-storage-port.ts
  physical-mapper.ts
  physical-schema.ts
  list-binding.ts
  transport-seam.ts

src/domain/
  procedure-record-cancellation-persistence.ts
  cancellation semantics / lifecycle identity

spfx/src/webparts/scaffoldShellWebPart/*
  COMPLETELY UNCHANGED
```

Slice C は、CREATED 後の `LifecycleEventId` mandatory read-back と、
INDETERMINATE 後の dual lookup を既に所有している。

GO gate の構造先例（purpose / GUID は流用禁止）:

```text
spfx/src/adapters/procedure-record/live-write-gate.ts
  structure only — ProcedureRecord purpose / List GUID MUST NOT be reused
```

## 4. Exact implementation slice — future GO only

将来の Implementation Start で変更可能にする範囲を以下に限定する。

### A. Slice C SPFx bridge extension

```text
MODIFY:
src/domain/procedure-record-cancellation-staff-save.ts

Purpose:
createProcedureRecordCancellationPersistencePort を
既存 SPFx cancellation bridge から利用可能にするだけ。
domain semantics は変更しない。

REGENERATE:
spfx/src/sbs-domain/cancellation-persist.bundle.js

MODIFY:
spfx/src/sbs-domain/cancellation-persist.bundle.d.ts
```

SPFx は canonical root domain を直接コンパイルできないため、
既存も esbuild bridge を採用している。

Verified @ base: staff-save は現在 in-memory factory のみを re-export する。
`createProcedureRecordCancellationPersistencePort` の bridge 露出は未完了であり、
Slice A は no-op ではない。

### B. Slice E narrow SPFx bridge

```text
NEW:
src/adapters/sharepoint/procedure-record-lifecycle-event/
  spfx-test-harness-entry.ts

Exports only:
- bindProcedureRecordLifecycleEventList
- createProcedureRecordCancellationSharePointStoragePort
- minimum required types

NEW GENERATED:
spfx/src/sbs-domain/
  lifecycle-cancellation-storage.bundle.js
  lifecycle-cancellation-storage.bundle.d.ts

MODIFY:
spfx/src/sbs-domain/README.md
```

ここは **re-export / generated bridge のみ**。Slice E ロジックをコピーしない。
既存 Slice E は transport と binding の一致確認、schema verification、
CANCEL-only append を既に実装している。

### C. Human GO execution gate

```text
NEW:
spfx/src/adapters/procedure-record-lifecycle-event/
  test-only-live-create-gate.ts

Required packet:
- dedicated lifecycle-test-only purpose
- humanLiveCreateGo = true
- expected main SHA
- exact test-only physical Site identity
- exact lifecycle List GUID
- frozen LifecycleEventId
- frozen LifecycleIdempotencyKey
- frozen LifecyclePayloadFingerprint
- exact mutation budget:
    create = 1
    retryPost = 0
    update = 0
    delete = 0

Invalid / mismatch:
authorization = NONE
POST = 0
```

既存 ProcedureRecord 側に SHA / GUID / identity / mutation-budget を照合して
run-scoped authorization を発行する先例がある。その構造は参照できるが、
ProcedureRecord 用 purpose / GUID を流用してはいけない。

### D. Controlled GATE-3 composition

```text
NEW:
spfx/src/adapters/procedure-record-lifecycle-event/
  test-only-harness-composition.ts

Rules:
- direct synthetic authorization import はこの1ファイルだけ
- GO gate PASS 前に synthetic CREATE transport を作らない
- existing GATE-3 transport を再利用
- existing Slice E storage port を再利用
- existing Slice C persistence port を再利用
- generic CREATE API を export しない
```

## 5. Separate SPFx entrypoint

```text
NEW:
spfx/src/webparts/lifecycleCreateTestHarness/
  LifecycleCreateTestHarnessWebPart.ts
  LifecycleCreateTestHarnessWebPart.manifest.json
  components/LifecycleCreateTestHarness.tsx
  components/ILifecycleCreateTestHarnessProps.ts

MODIFY:
spfx/config/config.json
```

現在は `scaffold-shell-web-part` の1 bundle しかない。B2 はそこへ import せず、
**第二の独立 bundle** とする。

Harness は最低限、次だけにする。

```text
1. current physical target表示
2. read-only preflight
3. GO receipt input/validation
4. frozen synthetic CANCEL確認
5. explicit Execute button
6. result/evidence表示
```

禁止事項:

```text
onInit POST
render POST
automatic POST
automatic retry
URL query だけでCREATE
property default だけでCREATE
normal ScaffoldShell からの呼出
arbitrary Site/List input
arbitrary lifecycle event input
SUPERSEDE
UPDATE
DELETE
```

## 6. Synthetic input boundary

Harness は任意の利用者データを受け付けない。

```text
synthetic ProcedureRecord
synthetic AuthorizationContext
synthetic recordedBy
synthetic reason
CANCEL only
```

を構築し、実行直前に lifecycle identity を固定する。

既存 FIELD_STAFF cancellation 側にも synthetic AuthorizationContext fixture があり、
real Entra expansion は OUT とされている。

## 7. Package slice

```text
MODIFY:
spfx/config/package-solution.json

version:
1.0.0.1
→ 1.0.0.2
```

ProductId は変更しない。現在値は `4342db47-21a3-4c48-aed1-ef615f55c404`、
`skipFeatureDeployment=true` である。

これは **package metadata change の authorization** であり、
Deploy authorization ではない。

## 8. Acceptance criteria / required tests

最低限、以下を acceptance とする。

### BOUNDARY

```text
- ScaffoldShellWebPart changed files = 0
- ScaffoldShell bundle imports harness = NO
- production lifecycle barrel synthetic CREATE export = NO
```

### AUTHORIZATION

```text
- missing GO → POST 0
- malformed GO → POST 0
- SHA mismatch → POST 0
- Site mismatch → POST 0
- List GUID mismatch → POST 0
- identity mismatch → POST 0
- mutation-budget mismatch → POST 0
```

### PAYLOAD

```text
- CANCEL only
- SUPERSEDE → POST 0
- non-synthetic/unlocked input → POST 0
- extra physical key → POST 0
```

### EXECUTION

```text
- render/onInit → POST 0
- preflight → GET only
- exact authorized run → POST <= 1
- second automatic POST = impossible
- Execute disabled after one run-scoped attempt
- no automatic retry
```

### OUTCOME

```text
- CREATED + exact EventId read-back → saved
- CREATED + EMPTY → save_outcome_unknown
- CREATED + non-exact → save_failed
- 409 / timeout / thrown POST
    → INDETERMINATE dual lookup
    → second POST 0
- 401 / 403 → save_failed
- conflict/multi/malformed → save_failed
```

### ARTIFACT

```text
- candidate .sppkg includes separate harness bundle
- harness bundle contains GATE-3 fingerprints
- candidate .sppkg SHA-256 recorded
- harness bundle SHA-256 recorded
- ScaffoldShell remains fixture-only
```

## 9. Explicit OUT

```text
Issue #448 mutation
Production Binding
production Site/List
App Catalog upload
Deploy
site app installation
SharePoint POST during implementation/testing
real Entra authorization
real user data / PII
B-01 retention Decision
B-02 operator/reviewer Decision
Option B LIVE CREATE GO
#443 / #444
lifecycle semantics changes
Slice A/B/C/E redesign
GATE-3 reimplementation
```

## 10. Rollback boundary

将来 Implementation Start 後に rollback する場合の境界（定義のみ; 実行しない）:

```text
- revert harness web part / second bundle / config.json entries
- revert GO gate + composition files
- revert Slice C bridge re-export + regenerated cancellation-persist bundle
- revert Slice E spfx-test-harness-entry + lifecycle-cancellation-storage bundle
- revert package-solution version bump if not Deployed
- MUST NOT touch ScaffoldShellWebPart
- MUST NOT reopen Production Binding
- MUST NOT leave synthetic CREATE export on production barrels
```

## 11. CURRENT / GATE

```text
CURRENT:
B2 exact-slice definition = COMPLETE
Independent Definition Review = NOT YET COMPLETE
Human Implementation Start GO = NOT YET ELIGIBLE

NEXT:
Independent Definition Review

Only if review returns:
PASS
+ P0 none
+ P1 none

→ Human B2 Implementation Start GO
```

この順であれば、
**architecture Decision → exact slice → independent review → Human Implementation Start**
の境界を崩さず進められる。

## 12. Independent Definition Review handoff

ここは **同じ Control セッションで PASS と自己認定しない**。
Agent Router v2 の独立性を維持するため、別 ChatGPT / Codex セッションへ
次を渡すのが適切である。

```text
B2-ISOLATED-TEST-ONLY-HARNESS-INDEPENDENT-DEFINITION-REVIEW-1

AGENT:
Independent Reviewer

MODE:
READ-ONLY

BASE:
main@3e4e2dee195ce82299b62f4b668d50cb563d2c68

AUTHORITY:
docs/architecture/live-create-test-only-runtime-path-decision-1.md

TARGET:
B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1
docs/architecture/b2-isolated-test-only-harness-exact-slice-definition-1.md

REVIEW QUESTIONS:

1. B2 SELECTED / LOCKED と完全整合しているか
2. ScaffoldShellWebPart fixture-only を破らないか
3. Production Binding Option A KEEP unbound を破らないか
4. existing GATE-3 を再実装していないか
5. canonical Slice C/E をコピーせず bridge reuse しているか
6. SPFx rootDir bridge 方針が既存 architecture と整合するか
7. synthetic CREATE mint が GO validation を迂回できない設計か
8. render/onInit/preflight から POST 到達不能か
9. arbitrary Site/List に POST できないか
10. arbitrary payload / SUPERSEDE が到達不能か
11. one-POST / zero-retry invariant を維持できるか
12. CREATED mandatory EventId read-back を維持するか
13. INDETERMINATE dual reconciliation を維持するか
14. UPDATE/DELETE が増えていないか
15. package version bump と Deploy GO が分離されているか
16. test-only web part の tenant-wide availability が
    unauthorized write capabilityを生まないか
17. bridge/generated bundle に contract drift risk がないか
18. exact slice に不足・過剰なファイルがないか

CLASSIFY:
P0
P1
P2

RETURN:

RESULT:
PASS / FAIL / PASS-WITH-CORRECTIONS

P0:
...

P1:
...

P2:
...

EXACT-SLICE MINIMALITY:
PASS / FAIL

AUTHORITY PRESERVATION:
PASS / FAIL

SECURITY / WRITE BOUNDARY:
PASS / FAIL

IMPLEMENTATION START ELIGIBILITY:
READY FOR HUMAN GO
or
HOLD

FORBIDDEN:
code mutation
commit
PR
Deploy
SharePoint POST
LIVE CREATE
Issue mutation
Production Binding

STOP:
After independent definition verdict.
```

## 13. Explicit non-authorization

```text
This exact-slice definition DOES NOT authorize:
- Implementation Start
- code mutation
- package version bump execution
- PR
- Deploy
- App Catalog mutation
- SharePoint POST
- LIVE CREATE
- Production Binding
- Option B execution
- Issue close
- Independent Definition Review PASS (self-certification)
```

## 14. STOP

```text
CURRENT ACTION: STOP

B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1:
READ-ONLY DEFINITION COMPLETE
READY FOR INDEPENDENT DEFINITION REVIEW

Independent Definition Review: NOT YET COMPLETE
Implementation Start: NOT AUTHORIZED
code mutation: NOT AUTHORIZED
Deploy / App Catalog: NOT AUTHORIZED
SharePoint POST / LIVE CREATE: NOT AUTHORIZED
Production Binding: NOT ACTIVE
normal runtime LIVE WRITE: HOLD
Issue close: NOT AUTHORIZED

Do not self-certify Independent Review PASS in the Control session
that authored this definition.
```
