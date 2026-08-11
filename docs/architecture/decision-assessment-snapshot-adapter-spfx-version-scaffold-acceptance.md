# Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 — Human Acceptance

この文書は、**Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1** についての
**Human Acceptance 正本（LOCKED）** である。

Packet:
[`decision-assessment-snapshot-adapter-spfx-version-scaffold-packet.md`](./decision-assessment-snapshot-adapter-spfx-version-scaffold-packet.md)

Selection:
[`decision-assessment-snapshot-adapter-spfx-version-scaffold-selection.md`](./decision-assessment-snapshot-adapter-spfx-version-scaffold-selection.md)

IR:
[`decision-assessment-snapshot-adapter-spfx-version-scaffold-independent-review.md`](./decision-assessment-snapshot-adapter-spfx-version-scaffold-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-sphttpclient-binding-acceptance.md`](./decision-assessment-snapshot-adapter-sphttpclient-binding-acceptance.md)
（ACCEPTED / LOCKED / B1 PREREQUISITE-FIRST）
[`decision-assessment-snapshot-transport-acceptance.md`](./decision-assessment-snapshot-transport-acceptance.md)
（TR-1-A + CL-1-A + CL-1-B）
[`decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md`](./decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md)
（TC-1-A + DP-1-A + SV-1-A + XB-1）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1
Kind: VERSION + SCAFFOLD/DEPENDENCY RESOLUTION Acceptance（docs-only）
Status: Accepted / LOCKED
Human Decision: V-1 + A + D-HOLD
Accepted / LOCKED set: V-1 + A + D-HOLD
Human Acceptance date: 2026-08-11
Baseline main: 51ca9f20f3bf6dd639d97b42b904845dbd9c0ca2
Packet HEAD: 69c38bb028ca95b37ff089f64bf1f32ce9b3ac42
Candidate packet PR: #224

Accepted options:
  V-1 — SPFx 1.23.2 exact release line
        Node 22
        React / React DOM 17.0.1 exact（SPFx boundary）
        SPFx TypeScript <= 5.8（generator-compatible）
        @microsoft/sp-* exact 1.23.2 alignment
  A — isolated SPFx 1.23.2 scaffold in dedicated subdirectory
      root TypeScript 5.9.2 unchanged
  D-HOLD — Decision only; no dependency / scaffold mutation in this unit

IR-P2-002: OPEN / CARRY-FORWARD
package.json / lockfile mutation: NOT AUTHORIZED
npm install / generator: NOT AUTHORIZED
scaffold file creation: NOT AUTHORIZED
Synthetic binder Implementation Start: NOT AUTHORIZED
live tenant read: NOT AUTHORIZED
live tenant write: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: FORBIDDEN
Deploy / real data: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: V-1 + A + D-HOLD
Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1:
  ACCEPTED / LOCKED / V-1 + A + D-HOLD
Human Acceptance date: 2026-08-11
```

日本語正本:

```text
V-1:
  SPFx = 1.23.2 exact release line
  @microsoft/sp-* = 1.23.2 系 exact alignment
  Node = 22
  React / React DOM = 17.0.1 exact（SPFx 境界内）
  SPFx 側 TypeScript = <= 5.8（generator 互換）
A:
  repo 内に隔離した専用 SPFx scaffold を採用方針とする
  root TypeScript 5.9.2 は変更しない
D-HOLD:
  今回は Decision / Acceptance 記録のみ
  generator / npm install / dependency 追加はまだ行わない
```

```text
Agent recommendation（V-1 + A + D-HOLD）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Meaning（LOCKED）

```text
Exact SPFx compatibility target and isolated scaffold boundary are LOCKED.

This Acceptance does NOT:
  create an SPFx project directory
  run Yeoman / SPFx generator
  mutate package.json / lockfile
  install React / @microsoft/sp-*
  mutate root TypeScript 5.9.2
  start binder Implementation Start
  authorize live tenant I/O or Deploy

Microsoft guidance retained:
  package version edits alone are insufficient;
  build configuration / toolchain must remain coherent with the selected SPFx release.
  That coherence is deferred to a separately authorized scaffold / dependency Implementation Start.
```

## Disposition

```text
Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 =
  ACCEPTED / LOCKED / V-1 + A + D-HOLD

IR-P2-002 = OPEN / CARRY-FORWARD

Reason:
  IR-P2-002 closes only after an actually authorized concrete
  SPHttpClient binder exists and has passed its required verification.
```

## Authorization snapshot（LOCKED by this Acceptance）

| Axis | Status |
|---|---|
| SPFx version policy | **LOCKED** — 1.23.2 exact（V-1） |
| Scaffold policy | **LOCKED** — isolated subdirectory（A） |
| Scaffold execution | **NOT AUTHORIZED**（D-HOLD） |
| Runtime dependency install | **NOT AUTHORIZED**（D-HOLD） |
| Exact `@microsoft/sp-*` inventory | **DEFERRED** to authorized scaffold/dependency Start（must remain 1.23.2-aligned） |
| Root TypeScript 5.9.2 | **UNCHANGED** |
| Synthetic binder Implementation Start | **NOT AUTHORIZED** |
| Live tenant read | **NOT AUTHORIZED** |
| Live tenant write | **NOT AUTHORIZED** |
| SharePoint / M365 / Entra mutation | **FORBIDDEN** |
| Deploy / real data | **NO-GO** |

## LOCKED SAFE ORDER（do not collapse）

```text
1. Resolve exact SPFx / @microsoft/sp-* package compatibility/version
   → LOCKED here as V-1
2. Human Decision for SPFx scaffold + dependency addition
   → LOCKED here as A + D-HOLD
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

## Next gate（exact）

```text
Next gate:
  separate scaffold / dependency Implementation Start gate

Meaning:
  prepare / obtain an explicit Human Implementation Start GO
  before creating the isolated SPFx 1.23.2 scaffold,
  before package.json / lockfile mutation,
  and before npm install / generator execution.

This Acceptance does NOT authorize that Implementation Start.
This Acceptance does NOT authorize binder Implementation Start.
```

## NOT SELECTED

```text
NOT SELECTED:
  B — convert repository root into SPFx 1.23.2 project
  C — add @microsoft/sp-* to current root without scaffold
  D-GO-NEXT as mutation authorization inside this recording unit
```

## LOCKED OUT / FORBIDDEN（preserved）

```text
LOCKED OUT / FORBIDDEN:
  src/** mutation
  tests/** mutation
  package.json / package-lock.json mutation
  npm install / uninstall
  SPFx generator / scaffold file creation
  React / @microsoft/sp-* installation
  root TypeScript version mutation
  binder implementation
  live HTTP
  SharePoint / M365 / Entra mutation
  Deploy
  real data
  MAP-AS-009
  other adapters / UI
  Issue mutation
  collapsing LOCKED SAFE ORDER gates
  treating V-1 + A + D-HOLD as scaffold execution GO
  treating V-1 + A + D-HOLD as runtime dependency install GO
  treating V-1 + A + D-HOLD as binder Implementation Start
  treating V-1 + A + D-HOLD as Deploy / real data GO
  closing IR-P2-002 without concrete authorized binder
```

## Boundary

```text
ACCEPT V-1 + A + D-HOLD ≠ scaffold execution GO
ACCEPT V-1 + A + D-HOLD ≠ runtime dependency install GO
ACCEPT V-1 + A + D-HOLD ≠ binder Implementation Start
ACCEPT V-1 + A + D-HOLD ≠ live tenant read/write authorization
ACCEPT V-1 + A + D-HOLD ≠ Deploy / real data GO
ACCEPT V-1 + A + D-HOLD ≠ closure of IR-P2-002
ACCEPT V-1 + A + D-HOLD ≠ root TypeScript downgrade authorization
```

## Closes / Does NOT close

```text
Closes:
  Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1 version + scaffold/dependency policy selection
  Human VERSION + SCAFFOLD/DEPENDENCY DECISION residual for V-1 / A-B-C / D-HOLD choice

Does NOT close / authorize:
  IR-P2-002
  scaffold file creation
  runtime dependency install
  exact @microsoft/sp-* inventory materialization
  synthetic binder Implementation Start
  binder code
  live read/write
  Deploy / real data
```

## Next

```text
Decision-AS-ADAPTER-SPFX-VERSION-SCAFFOLD-1:
  ACCEPTED / LOCKED / V-1 + A + D-HOLD
IR-P2-002: OPEN / CARRY-FORWARD
Next gate: separate scaffold / dependency Implementation Start gate
Implementation Start（scaffold/deps）: NOT AUTHORIZED
Implementation Start（binder）: NOT AUTHORIZED
Next code implementation: NONE
```
