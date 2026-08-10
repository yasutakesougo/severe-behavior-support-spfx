# Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1 — Selection

この文書は、**Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1** の
Selection 正本（Human Decision 待ち）である。

Packet:
[`decision-assessment-snapshot-adapter-sphttpclient-binding-packet.md`](./decision-assessment-snapshot-adapter-sphttpclient-binding-packet.md)

IR:
[`decision-assessment-snapshot-adapter-sphttpclient-binding-independent-review.md`](./decision-assessment-snapshot-adapter-sphttpclient-binding-independent-review.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1
Selection status: AWAITING HUMAN SPHTTPCLIENT BINDING PREREQUISITE DECISION
Baseline main: fbf61635a0aaa4ead01c94e0efa70927bc1e2757

IR-P2-002: OPEN / CARRY-FORWARD
GO-SLICE-1: COMPLETE / CONSUMED
IR-P2-001: CLOSED / ACCEPTED RESIDUAL / NON-BLOCKING

runtime dependency install: NOT AUTHORIZED
SPFx scaffold: NOT AUTHORIZED
Implementation Start（binder）: NOT AUTHORIZED
live read/write: NOT AUTHORIZED
Deploy / real data: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Options

| ID | unit | Result（pending Human） |
|---|---|---|
| **B1** | HOLD / PREREQUISITE-FIRST — keep seam unbound；record prerequisites + ordering；no dep/scaffold/code/live I/O；IR-P2-002 remains OPEN | Agent-recommended |
| **B2** | Define future synthetic binder Implementation Start *candidate* only；scaffold/dep install remain separate explicit Human GOs；no code now；IR-P2-002 remains OPEN until binder exists | Alternative |
| **B3** | Live binding / tenant verification stage | **NOT LEGITIMATELY SELECTABLE NOW** |

## 2. Agent recommendation

```text
Recommended option: B1 — HOLD / PREREQUISITE-FIRST

Rationale:
  1. Concrete SPHttpClient binding cannot proceed without violating DP-1-A
     until a separate runtime dependency install GO exists.
  2. SPFx scaffold is absent and not authorized.
  3. Exact @microsoft/sp-* version is UNRESOLVED；must not invent versions.
  4. B2 may define a future candidate, but still cannot authorize scaffold/dep/Impl Start；
     selecting B2 now adds little beyond B1 until those GOs exist.
  5. B3 cannot legitimately be selected now（live I/O / Deploy remain FORBIDDEN）.
  6. IR-P2-002 must remain OPEN until concrete binder exists.

Agent recommendation ≠ Human Decision.
```

## 3. Exact IN / OUT if Human selects B1

### IN

```text
IN:
  accept prerequisite / sequencing recording
  keep bindWhenAvailable = false
  keep IR-P2-002 OPEN / CARRY-FORWARD
  keep synthetic/local verification as living path
```

### OUT

```text
OUT / FORBIDDEN:
  package.json mutation / npm install
  SPFx scaffold
  binder implementation
  live tenant read/write
  Deploy / real data
  closing IR-P2-002
  MAP-AS-009 / other adapters / UI
```

## 4. Exact IN / OUT if Human selects B2

### IN

```text
IN（docs only）:
  record future synthetic binder slice candidate boundary:
    SPFx SPHttpClient host binder
    REST List Items only
    AssessmentSnapshots only
    synthetic/local verification
    no live tenant calls
  still require separate Human GOs for scaffold/dep install and Impl Start
```

### OUT

```text
OUT / FORBIDDEN by B2 selection alone:
  runtime dependency install
  SPFx scaffold execution
  binder code start
  live I/O
  Deploy
  treating B2 as Implementation Start
```

## 5. Exact IN / OUT if Human attempts B3

```text
B3 is NOT legitimately selectable now.

OUT（hard）:
  live tenant read
  live tenant write
  SharePoint / M365 / Entra mutation
  Deploy
  real data
```

## 6. Future IN / OUT boundary（after later GOs；not authorized now）

```text
Future synthetic binder slice（only after scaffold/dep GO + Impl Start GO）:
  IN:
    concrete SPHttpClient binder implementing AssessmentSnapshotListTransport
    REST List Items request path for AssessmentSnapshots
    synthetic/local tests / doubles
  OUT:
    live tenant calls（until separate live-read/write GOs）
    Deploy / real data
    MAP-AS-009
    other lists / adapters
    Graph / PnPjs
```

## 7. Gate ordering（LOCKED recommendation；gates not collapsed）

```text
1. Prerequisite Decision（this Decision）
2. SPFx scaffold + dependency version-resolution + install Human GO
3. Synthetic binder Implementation Start Human GO
4. Binder implementation + synthetic tests
5. Human Ready / Merge for binder slice
6. Separate live-read verification Human GO
7. Separate live-write / Deploy Human GO
```

## 8. Decision answers（pre-Human）

| Question | Answer |
|---|---|
| New Human Decision required? | **YES** — select B1 / B2 /（reject B3） |
| Runtime dependency install currently authorized? | **NO** |
| Implementation Start currently authorized? | **NO** |
| Live read/write currently authorized? | **NO** |
| IR-P2-002 close condition | Concrete binder exists under authorized GOs；until then **OPEN** |

## 9. Stop

```text
Stop at:
  HUMAN SPHTTPCLIENT BINDING PREREQUISITE DECISION

MUST NOT from this selection packet alone:
  implement binder
  install dependencies
  start SPFx scaffold
  start next code slice
  auto Ready / Merge
```
