# B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1

```text
B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1

STATUS:
IMPLEMENTATION CORRECTION IN PROGRESS
INDEPENDENT IMPLEMENTATION RE-REVIEW HOLD

BASE:
main@3e4e2dee195ce82299b62f4b668d50cb563d2c68

AUTHORITY:
LIVE-CREATE-TEST-ONLY-RUNTIME-PATH-DECISION-1
B2 — ISOLATED TEST-ONLY HARNESS
SELECTED / LOCKED

PRIOR REVIEW:
B2-ISOLATED-TEST-ONLY-HARNESS-INDEPENDENT-DEFINITION-RE-REVIEW-2
RESULT: PASS-WITH-CORRECTIONS
P0: none
P1-2: OPEN / BLOCKING (addressed in Correction-2)
P1-3: PASS
P1-4: PASS
P2-1 core: PASS
P2-a / P2-b: OPEN / non-blocking (addressed in Correction-2)

Prior Re-Review-1:
PASS-WITH-CORRECTIONS (consumed)
P1-1: CLOSED

Implementation Start GO:
RECEIVED (B2 correction implementation)

Deploy / App Catalog:
NOT AUTHORIZED

SharePoint POST / LIVE CREATE:
NOT AUTHORIZED

repository: yasutakesougo/severe-behavior-support-spfx
Unit: B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1
Kind: read-only exact-slice definition
Independent Implementation Re-Review: PASS-WITH-CORRECTIONS; corrections open
Human Implementation Start GO: RECEIVED
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

GO gate の構造先例（purpose / GUID / field-shape-only mint は流用禁止）:

```text
spfx/src/adapters/procedure-record/live-write-gate.ts
  structure only — ProcedureRecord purpose / List GUID MUST NOT be reused
  field-shape-only authorization pattern MUST NOT be copied (see §4.C CRITICAL)
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

REGENERATE / CHECK:
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

GENERATED BRIDGE DRIFT GUARD（LOCKED; P2-1 / P2-a）:

```text
named canonical entrypoint:
  src/adapters/sharepoint/procedure-record-lifecycle-event/
    spfx-test-harness-entry.ts

JS generation command (record in spfx/src/sbs-domain/README.md):
  npx esbuild \
    src/adapters/sharepoint/procedure-record-lifecycle-event/spfx-test-harness-entry.ts \
    --bundle --format=cjs --target=es2015 --platform=neutral \
    --outfile=spfx/src/sbs-domain/lifecycle-cancellation-storage.bundle.js

GENERATED DECLARATION DRIFT（LOCKED; P2-a）:
  .js AND .d.ts MUST each have a defined reproducible
  production/check path.

  Implementation MUST record in spfx/src/sbs-domain/README.md:
  - JS generation command
  - declaration production/check command
  - canonical entrypoint
  - generated outputs

  Concrete declaration tool command:
    NOT invented in this Definition
    Implementation design locks a repository-supported toolchain command

  generated outputs hand-edit:
    FORBIDDEN
    (.js and .d.ts)
    No manual drift is permitted

  acceptance:
    generation/check commands → git diff --exit-code clean
    .d.ts export surface equals allowed exports only
```

### C. Human GO execution gate

```text
NEW:
spfx/src/adapters/procedure-record-lifecycle-event/
  test-only-live-create-gate.ts
```

TRUSTED RECEIPT PROVENANCE BOUNDARY（LOCKED; P1-2 / Correction-2）:

```text
HumanGoRequestPacket
  ≠
TrustedReceiptProvenanceEvidence

HumanGoRequestPacket (field-shape / request material):
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

Reconstructing every HumanGoRequestPacket field
MUST NOT constitute Human GO authorization.
POST = 0

TrustedReceiptProvenanceEvidence:
- trust material DISTINCT from HumanGoRequestPacket
- NOT derivable / reconstructible from public/request fields alone
- harness / UI / caller / composition MUST NOT mint or issue
- issued only by Human Control authority outside the harness process
- harness may verify + consume only
- arbitrary / caller-created evidence → authorization NONE / POST = 0
- missing evidence → authorization NONE / POST = 0
- packet valid + provenance invalid/missing → authorization NONE / POST = 0

Concrete channel:
  Implementation design (deferred)
  Allowed examples (NOT selected here):
  - opaque receipt handle + external consume registry
  - signed artifact

CRITICAL:
  ProcedureRecord live-write-gate field-shape-only authorization
  pattern MUST NOT be copied for B2 harness GO.

Invalid / mismatch (packet OR provenance OR host):
authorization = NONE
POST = 0
```

RECEIPT ANTI-REPLAY BOUNDARY（LOCKED; P1-3）:

```text
one Human GO receipt
  → at most one CREATE attempt

same receipt replay:
  POST = 0

new harness instance / page reload / transport reconstruction:
  same consumed receipt MUST NOT restore write capability

ownership:
  new harness authorization layer
  NOT Slice C retry semantics
  NOT GATE-3 in-transport Set alone

persist/consume mechanism:
  Implementation design
  (invariant locked here)
```

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
- receipt-level anti-replay is enforced by harness authorization layer
  before / around transport construction
  (GATE-3 in-transport identity Set alone is NOT sufficient)
- MUST NOT mint TrustedReceiptProvenanceEvidence
```

## 5. Separate SPFx entrypoint

```text
NEW:
spfx/src/webparts/lifecycleCreateTestHarness/
  LifecycleCreateTestHarnessWebPart.ts
  LifecycleCreateTestHarnessWebPart.manifest.json
  components/LifecycleCreateTestHarness.tsx
  components/ILifecycleCreateTestHarnessProps.ts
  loc/*
    (independent harness localization artifacts;
     NOT a copy of ScaffoldShellWebPart loc/)

MODIFY:
spfx/config/config.json
  - lifecycleCreateTestHarness bundle registration
    (second independent bundle; do not import into scaffold-shell)
  - LifecycleCreateTestHarness localizedResources registration
```

現在は `scaffold-shell-web-part` の1 bundle しかない。B2 はそこへ import せず、
**第二の独立 bundle** とする。

Harness は最低限、次だけにする。

```text
1. current physical target表示
2. read-only preflight
3. GO receipt input/validation
   (HumanGoRequestPacket + TrustedReceiptProvenanceEvidence)
4. frozen synthetic CANCEL確認
5. explicit Execute button
6. result/evidence表示
```

RUNTIME HOST / EXPOSURE BOUNDARY（LOCKED; P1-4）:

```text
current runtime host/context MUST match
the exact historical test-only target

wrong site/context:
  authorization = NONE
  POST = 0

tenant-wide package availability
  ≠ harness executable authority

harness MUST NOT become an executable write surface
for normal end users solely because the solution is
tenant-available (skipFeatureDeployment=true)

toolbox / manifest hardening means:
  Implementation design
  (fail-closed acceptance locked here)
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
TrustedReceiptProvenanceEvidence mint/issue in harness / UI / caller / composition
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

`skipFeatureDeployment=true` による tenant-wide package availability は、
§5 RUNTIME HOST / EXPOSURE BOUNDARY のとおり **executable authority を付与しない**。

## 8. Acceptance criteria / required tests

最低限、以下を acceptance とする。

### BOUNDARY

```text
- ScaffoldShellWebPart changed files = 0
- ScaffoldShell bundle imports harness = NO
- production lifecycle barrel synthetic CREATE export = NO
- tenant-wide package availability ≠ harness executable authority
- wrong runtime host/site/context → authorization NONE / POST 0
- harness loc/* present (independent; not ScaffoldShell loc copy)
- config.json registers harness bundle + localizedResources
```

### AUTHORIZATION

```text
- missing GO → POST 0
- malformed GO → POST 0
- complete HumanGoRequestPacket only → POST 0
- self-constructed isomorphic HumanGoRequestPacket → POST 0
- TrustedReceiptProvenanceEvidence absent → POST 0
- arbitrary / caller-created provenance value → POST 0
- trusted provenance verification failure → POST 0
- packet valid + provenance invalid/missing → POST 0
- harness bundle contains no trusted receipt mint/issue path
- SHA mismatch → POST 0
- Site mismatch → POST 0
- List GUID mismatch → POST 0
- identity mismatch → POST 0
- mutation-budget mismatch → POST 0
- runtime host/context mismatch → POST 0
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
- one Human GO receipt → at most one CREATE attempt
- exact authorized run → POST <= 1
- same receipt replay → POST 0
- new harness instance / page reload / transport reconstruction
    with same consumed receipt → write capability NOT restored / POST 0
- second automatic POST = impossible
- Execute disabled after one receipt-scoped attempt
- no automatic retry
- anti-replay ownership = harness authorization layer
  (not GATE-3 / Slice C alone)
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

### BRIDGE / GENERATED DRIFT

```text
- lifecycle-cancellation-storage.bundle named canonical entrypoint recorded
- JS generation command recorded in spfx/src/sbs-domain/README.md
- declaration production/check command recorded
  (repository-supported toolchain; not invented in this Definition)
- generated outputs (.js and .d.ts) recorded
- generated .js / .d.ts hand-edit FORBIDDEN
- generation/check commands → git diff --exit-code clean
- .d.ts export surface equals allowed exports only
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
concrete TrustedReceiptProvenanceEvidence channel selection
  (deferred to Implementation design; boundary locked)
signing / crypto algorithm selection (deferred to Implementation design)
concrete declaration tool command selection
  (deferred; repository-supported toolchain only)
toolbox / manifest concrete knobs (deferred; fail-closed acceptance locked)
```

## 10. Rollback boundary

将来 Implementation Start 後に rollback する場合の境界（定義のみ; 実行しない）:

```text
- revert harness web part / second bundle / loc / config.json entries
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
B2 implementation correction = P1-IMP-1/2/3/4 implemented on the named branch
Signed receipt provenance = pinned-key verification; localStorage = consume-only
Independent Implementation Re-Review = NOT YET COMPLETE
Deploy / App Catalog / production binding / live mutation = FORBIDDEN

NEXT:
Independent Implementation Re-Review (focused)

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
B2-ISOLATED-TEST-ONLY-HARNESS-INDEPENDENT-DEFINITION-RE-REVIEW-3

AGENT:
Independent Reviewer

MODE:
READ-ONLY

SCOPE:
focused (not full 18-item re-open)

BASE:
main@3e4e2dee195ce82299b62f4b668d50cb563d2c68

PRIOR:
B2-ISOLATED-TEST-ONLY-HARNESS-INDEPENDENT-DEFINITION-RE-REVIEW-2
RESULT: PASS-WITH-CORRECTIONS
P1-2 OPEN / BLOCKING → Correction-2 target
P1-3 PASS
P1-4 PASS
P2-1 core PASS
P2-a / P2-b OPEN → Correction-2 target

AUTHORITY:
docs/architecture/live-create-test-only-runtime-path-decision-1.md

TARGET:
PR #480
B2-ISOLATED-TEST-ONLY-HARNESS-EXACT-SLICE-DEFINITION-1
docs/architecture/b2-isolated-test-only-harness-exact-slice-definition-1.md
(use PR HEAD after Correction-2 commit)

VERIFY:

1. P1-2 closed per Correction-2 lock
   HumanGoRequestPacket ≠ TrustedReceiptProvenanceEvidence
   reconstruct packet alone → POST 0
   no live-write-gate field-shape-only mint copy
2. P2-a closed
   .js AND .d.ts reproducible production/check path
   no invented declaration command in Definition
3. P2-b closed
   harness loc/* in exact slice
   config.json bundle + localizedResources named
4. P1-3 / P1-4 / B2 authority / Option A / ScaffoldShell fixture-only
   remain unbroken by Correction-2 text
5. Implementation Start still NOT AUTHORIZED

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

P1-2 TRUSTED RECEIPT PROVENANCE:
PASS / FAIL

P2-a GENERATED DECLARATION DRIFT:
PASS / FAIL

P2-b HARNESS LOCALIZATION SLICE:
PASS / FAIL

EXACT-SLICE MINIMALITY:
PASS / FAIL

AUTHORITY PRESERVATION:
PASS / FAIL

SECURITY / WRITE BOUNDARY:
PASS / FAIL

SCAFFOLD SHELL FIXTURE-ONLY:
PRESERVED / NOT PRESERVED

PRODUCTION BINDING OPTION A:
PRESERVED / NOT PRESERVED

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
- PR merge
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
DEFINITION CORRECTION-2 COMPLETE
READY FOR INDEPENDENT DEFINITION RE-REVIEW-3

Independent Definition Re-Review-3: NOT YET COMPLETE
Implementation Start: NOT AUTHORIZED
code mutation: NOT AUTHORIZED
Deploy / App Catalog: NOT AUTHORIZED
SharePoint POST / LIVE CREATE: NOT AUTHORIZED
Production Binding: NOT ACTIVE
normal runtime LIVE WRITE: HOLD
Issue close: NOT AUTHORIZED

Do not self-certify Independent Review PASS in the Control session
that authored this definition correction.
```
