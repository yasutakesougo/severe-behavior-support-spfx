# Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 — Selection

この文書は、**Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1** の
Selection 正本である。

Packet:
[`decision-assessment-snapshot-adapter-spfx-version-scaffold-packet.md`](./decision-assessment-snapshot-adapter-spfx-version-scaffold-packet.md)

Acceptance:
[`decision-assessment-snapshot-adapter-spfx-version-scaffold-acceptance.md`](./decision-assessment-snapshot-adapter-spfx-version-scaffold-acceptance.md)

IR:
[`decision-assessment-snapshot-adapter-spfx-version-scaffold-independent-review.md`](./decision-assessment-snapshot-adapter-spfx-version-scaffold-independent-review.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1
Selection status: SELECTED / CONSUMED
Baseline main: 51ca9f20f3bf6dd639d97b42b904845dbd9c0ca2
Packet HEAD: 69c38bb028ca95b37ff089f64bf1f32ce9b3ac42
Human Decision: V-1 + A + D-HOLD
Human Acceptance date: 2026-08-11
Candidate packet PR: #224
PR: #225

Selected set:
  V-1 — SPFx 1.23.2 exact release line
  A — isolated SPFx 1.23.2 scaffold in dedicated subdirectory
  D-HOLD — Decision only; do not mutate dependencies / run generator yet

Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1:
  ACCEPTED / LOCKED / V-1 + A + D-HOLD

Root TypeScript 5.9.2: UNCHANGED
SPFx project TypeScript: <= 5.8（generator-compatible；not installed yet）
React / React DOM: 17.0.1 exact（SPFx boundary only；not installed yet）
@microsoft/sp-*: exact 1.23.2 alignment（inventory deferred；not installed yet）
Node.js: 22（existing root engines retained where compatible）

package.json / lockfile mutation: NOT AUTHORIZED
npm install / generator: NOT AUTHORIZED
scaffold file creation: NOT AUTHORIZED
binder Implementation Start: NOT AUTHORIZED
live tenant I/O: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: FORBIDDEN
Deploy / real data: NO-GO

Next gate:
  separate scaffold / dependency Implementation Start gate
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Human Selection（LOCKED）

```text
Human Decision: V-1 + A + D-HOLD

Meaning:
  lock exact SPFx compatibility target and isolated scaffold boundary now;
  do not run generator, npm install, or mutate package.json / lockfile in this unit;
  do not start binder Implementation Start;
  next substantive unit is a separate scaffold / dependency Implementation Start gate.
```

## 2. Options（historical）

| Axis | ID | Result |
|---|---|---|
| Version | **V-1** | **SELECTED / LOCKED** — SPFx 1.23.2 exact；Node 22；React/React DOM 17.0.1 exact；SPFx TS <= 5.8；`@microsoft/sp-*` exact 1.23.2 alignment |
| Scaffold | **A** | **SELECTED / LOCKED** — isolated SPFx scaffold in dedicated subdirectory；root TS 5.9.2 unchanged |
| Scaffold | B | **NOT SELECTED** — convert repository root to SPFx 1.23.2 |
| Scaffold | C | **NOT SELECTED** — root dependency-only without scaffold |
| Dependency auth | **D-HOLD** | **SELECTED / LOCKED** — Decision recording only；no dependency/scaffold mutation |
| Dependency auth | D-GO-NEXT | **NOT SELECTED** for this recording unit（next gate may prepare Implementation Start separately） |

## 3. Locked compatibility facts（not reopened）

```text
SPFx 1.23.2 compatibility reference:
  Node.js = v22 LTS
  TypeScript = 2.9 - 5.8
  React = 17.0.1 exact
  Toolchain = Heft-based（SPFx 1.22+）

Current root observation（unchanged by this Selection）:
  Node.js = 22.23.1
  TypeScript = 5.9.2
  React / React DOM = not installed
  @microsoft/sp-* = not installed
  SPFx generator scaffold = not present at root
  Heft SPFx rig/config = not present at root
```

Root TypeScript 5.9.2 remains outside the SPFx 1.23.2 documented TypeScript ceiling.
Therefore Option C / root dependency-only is rejected as an already-compatible path.

## 4. Exact IN / OUT（V-1 + A + D-HOLD）

### IN

```text
IN:
  Human Decision V-1 + A + D-HOLD recorded
  VERSION locked as SPFx 1.23.2 exact release line
  scaffold policy locked as isolated subdirectory（Option A）
  root TypeScript 5.9.2 retained
  dependency / generator / package mutation remains NOT AUTHORIZED
  binder Implementation Start remains NOT AUTHORIZED
  IR-P2-002 remains OPEN / CARRY-FORWARD
  next gate = separate scaffold / dependency Implementation Start
```

### OUT

```text
OUT / FORBIDDEN:
  package.json / lockfile mutation
  npm install / uninstall
  Yeoman / SPFx generator execution
  scaffold directory / Heft config creation in this unit
  React / @microsoft/sp-* installation in this unit
  root TypeScript downgrade
  binder implementation
  live tenant read/write
  SharePoint / M365 / Entra mutation
  Deploy / real data
  treating this Acceptance as binder Implementation Start
  collapsing LOCKED SAFE ORDER gates
```

## 5. LOCKED SAFE ORDER（do not collapse； inherited + advanced）

```text
1. Resolve exact SPFx / @microsoft/sp-* package compatibility/version
   → LOCKED here as V-1
2. Human Decision for SPFx scaffold + dependency addition
   → LOCKED here as A + D-HOLD
     （scaffold policy chosen；mutation still held）
3. Human Implementation Start GO for scaffold / dependency mutation
   → NOT AUTHORIZED here
4. Human Implementation Start GO for synthetic SPHttpClient binder slice
   → NOT AUTHORIZED here
5. Implement binder + synthetic/local tests
6. Independent Review
7. Human Ready
8. Human Merge
9. Separate live-read verification GO
10. Separate live-write / Deploy GO
```

## 6. Decision answers（after V-1 + A + D-HOLD）

| Question | Answer |
|---|---|
| Human Decision recorded? | **YES** — V-1 + A + D-HOLD |
| SPFx version policy | **LOCKED** — 1.23.2 exact |
| Scaffold policy | **LOCKED** — Option A isolated subdirectory |
| Scaffold execution authorized? | **NO**（D-HOLD） |
| Runtime dependency install authorized? | **NO**（D-HOLD） |
| Root TypeScript mutated? | **NO** |
| Binder Implementation Start authorized? | **NO** |
| Live read/write authorized? | **NO** |
| IR-P2-002 | **OPEN / CARRY-FORWARD** |

## 7. Agent recommendation（historical；not Acceptance evidence）

```text
Agent recommendation was V-1 + A + D-HOLD.
Agent recommendation ≠ Human Acceptance evidence by itself.
Human Decision = V-1 + A + D-HOLD.
```

## 8. Stop condition for this recording run

```text
MUST NOT from this Acceptance recording alone:
  create SPFx scaffold files
  run generator
  npm install
  mutate package.json / lockfile
  mutate root TypeScript
  implement binder
  start next code slice
  auto Ready / Merge
  close IR-P2-002
```
