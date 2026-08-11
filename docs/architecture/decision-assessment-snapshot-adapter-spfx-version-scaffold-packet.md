# Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 — Human Decision Packet

この文書は、`Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1 = ACCEPTED / LOCKED / B1 PREREQUISITE-FIRST` の次 gate として、AssessmentSnapshot adapter の concrete SPFx `SPHttpClient` binding に入る前に必要な **VERSION + SCAFFOLD/DEPENDENCY RESOLUTION** を比較する docs-only Decision Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1
Status: CANDIDATE / HUMAN DECISION REQUIRED
Baseline main: 51ca9f20f3bf6dd639d97b42b904845dbd9c0ca2
Kind: docs-only Decision Packet

Implementation Start: NOT AUTHORIZED
package.json / lockfile mutation: 0 / FORBIDDEN IN THIS UNIT
npm install / generator execution: 0 / FORBIDDEN IN THIS UNIT
binder implementation: 0 / FORBIDDEN IN THIS UNIT
live tenant I/O: 0 / FORBIDDEN
SharePoint / M365 / Entra mutation: 0 / FORBIDDEN
Deploy / real data: NO-GO

Stop: HUMAN VERSION + SCAFFOLD/DEPENDENCY DECISION
```

## 1. Locked inputs

再 Decision しない前提:

```text
Decision-AS-TRANSPORT-1 = ACCEPTED / LOCKED
TR-1-A = SPFx SPHttpClient + SharePoint REST
CL-1-A = CREATE logical absence => omit supersedesSnapshotId
CL-1-B = UPDATE present -> absent => supersedesSnapshotId: null
CL-1-B = VERIFIED / LOCKED

Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1 =
  ACCEPTED / LOCKED / B1 PREREQUISITE-FIRST

B1 locked order:
  1. resolve exact SPFx / @microsoft/sp-* compatibility/version
  2. Human Decision for scaffold + dependency addition
  3. separate Human Implementation Start GO for synthetic binder slice
```

この packet は 1 と 2 の Human Decision 材料だけを作る。3 には進まない。

## 2. Current repository observation

current root `package.json` observation:

```text
Node.js = 22.23.1
TypeScript = 5.9.2
React = not installed
React DOM = not installed
@microsoft/sp-* = not installed
SPFx generator scaffold = not present at root
Heft SPFx rig/config = not present at root
```

したがって current repository root は、現時点では **SPFx scaffold ではない既存 TypeScript/domain repository** として扱う。

## 3. Official compatibility facts

Microsoft の current SPFx compatibility reference / v1.23.2 release guidance に基づく候補基準:

```text
SPFx = 1.23.2
Node.js = v22 LTS
TypeScript = 2.9 - 5.8
React = 17.0.1 exact
Toolchain = Heft-based (SPFx 1.22+)
```

SPFx v1.23.2 は 2026-06-30 release。Microsoft は SPFx package versions を target release に合わせること、minor-version upgrade では package.json 単独編集ではなく build configuration / toolchain settings も整合させる必要があると明記している。

References:

- https://learn.microsoft.com/en-us/sharepoint/dev/spfx/release-1.23.2
- https://learn.microsoft.com/en-us/sharepoint/dev/spfx/compatibility
- https://learn.microsoft.com/en-us/sharepoint/dev/spfx/toolchain/sharepoint-framework-toolchain-rushstack-heft
- https://learn.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment

### Compatibility implication

current root TypeScript `5.9.2` は SPFx 1.23.2 compatibility table の上限 `5.8` を超える。

よって次を同値に扱ってはならない:

```text
"Node 22だから root に SPFx依存を追加できる"
  !=
"current root toolchain がそのまま SPFx 1.23.2 compatible"
```

Node 22 は整合するが、TypeScript と SPFx-specific Heft scaffold/configuration は別に解決が必要。

## 4. Exact version policy candidate

version candidate `V-1`:

```text
SPFx release line: 1.23.2
@microsoft/sp-* package version policy: exact 1.23.2 alignment
Node.js: existing 22.23.1 retained where compatible
React / React DOM: exact 17.0.1 in SPFx project boundary
TypeScript in SPFx project boundary: compatible 5.8.x or generator-produced compatible version
Toolchain: Heft-based SPFx scaffold/configuration
```

Notes:

- `@microsoft/sp-http` is the framework package that supplies `SPHttpClient`; when dependency mutation is separately authorized, its version must align with the selected SPFx 1.23.2 release line.
- This Decision does **not** pre-invent the complete `@microsoft/sp-*` package inventory. The exact inventory must come from the selected scaffold/component shape and be verified before dependency mutation.
- Do not use `@latest` as an unconstrained runtime dependency policy after the Human version decision. The accepted project state must be exact-version reproducible.

## 5. Scaffold / dependency options

### Option A — isolated SPFx 1.23.2 scaffold inside the repository

```text
Selection concept:
  keep current root domain/tooling intact
  create a dedicated SPFx project boundary in a new subdirectory
  generate/use SPFx 1.23.2 Heft-compatible scaffold there
  keep SPFx TypeScript/React/@microsoft packages inside that boundary

Root TypeScript 5.9.2:
  unchanged

SPFx TypeScript:
  compatible 5.8.x / generator-compatible version

Risk to existing domain/test CI:
  LOWEST of candidates

Binder path:
  after separate Human Implementation Start GO,
  bind existing accepted adapter/domain contracts through SPHttpClient
```

Advantages:

- avoids downgrading or retooling the existing root TypeScript 5.9.2 domain/test environment;
- makes the SPFx toolchain boundary explicit;
- lets generated Heft configuration and exact SPFx package family remain internally coherent;
- limits rollback to the dedicated SPFx project boundary.

Costs / open items:

- requires a new project directory and scaffold files after separate authorization;
- CI will later need an explicit policy for root checks versus SPFx-project checks;
- source-sharing/import boundary between root domain code and SPFx app must be designed during implementation planning, not silently assumed here.

**Agent recommendation: Option A.**

Recommendation is non-binding. Human Decision is required.

### Option B — convert the repository root into an SPFx 1.23.2 project

```text
Selection concept:
  make repository root itself the SPFx project
  align root TypeScript to SPFx-supported range
  add React 17.0.1 / SPFx packages / Heft rig and generated config

Root TypeScript 5.9.2:
  must change to compatible range

Risk to existing domain/test CI:
  HIGHER
```

Advantages:

- one package boundary;
- simplest path layout after conversion.

Costs / risks:

- current root TypeScript 5.9.2 is outside the SPFx 1.23.2 compatibility range;
- root conversion would mix a stable domain/test toolchain migration with the binder prerequisite task;
- larger package.json, lockfile, tsconfig, lint/build and CI blast radius;
- rollback and independent review become materially broader than the binder prerequisite itself.

Option B is technically possible only after a separately authorized migration plan. It is not the minimal-risk continuation of B1.

### Option C — add `@microsoft/sp-*` dependencies to current root only, without scaffold

```text
Selection concept:
  no generated SPFx scaffold
  add framework dependencies directly to existing root

Current root TypeScript 5.9.2:
  remains incompatible with documented SPFx 1.23.2 range

SPFx Heft rig/config/manifests:
  absent unless manually introduced
```

Assessment:

- dependency-only addition does not by itself create a complete SPFx project/toolchain;
- manually reconstructing the generator's coherent package/config set would increase configuration risk;
- current root TypeScript compatibility remains unresolved.

**Agent recommendation: DO NOT SELECT Option C.**

## 6. Human Decision choices

Human should select both version and scaffold/dependency policy.

```text
Version:
  V-1 — SPFx 1.23.2 exact release line
        Node 22
        React / React DOM 17.0.1 exact
        SPFx TypeScript <= 5.8 (generator-compatible)
        @microsoft/sp-* exact 1.23.2 alignment

Scaffold:
  A — isolated SPFx 1.23.2 scaffold in dedicated subdirectory (RECOMMENDED)
  B — convert repository root to SPFx 1.23.2
  C — root dependency-only without scaffold (DO NOT SELECT recommendation)

Dependency authorization:
  D-HOLD — Decision only; do not mutate dependencies yet
  D-GO-NEXT — after this Decision is Accepted/Locked,
              allow preparation of a separate scaffold/dependency Implementation Start packet
```

Recommended Human selection:

```text
V-1 + A + D-HOLD
```

Meaning:

```text
accept exact compatibility target and architecture boundary now;
do not run generator or npm install in this Decision PR;
next substantive unit becomes a separate scaffold/dependency Implementation Start gate.
```

## 7. Explicit non-authorization

Regardless of candidate comparison or recommendation, this packet does not authorize:

```text
package.json edit
package-lock.json / other lockfile edit
npm install / npm uninstall
Yeoman generator execution
SPFx CLI/generator scaffold creation
React installation
@microsoft/sp-* installation
TypeScript version mutation
Heft config creation
binder implementation
SPHttpClient request execution
live tenant read/write
SharePoint / M365 / Entra mutation
production data
Deploy
Ready / Merge
AUTO-2 / Capability Registry work
```

## 8. Stop condition

```text
Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1
= CANDIDATE / HUMAN DECISION REQUIRED

Required Human Decision:
  version + scaffold/dependency policy

Until explicit Human Decision:
  VERSION = NOT LOCKED
  SCAFFOLD = NOT AUTHORIZED
  DEPENDENCY MUTATION = NOT AUTHORIZED
  BINDER IMPLEMENTATION START = NOT AUTHORIZED
```
