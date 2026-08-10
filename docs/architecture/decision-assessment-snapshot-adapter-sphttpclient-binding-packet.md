# Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1 — Prerequisite / Sequencing Packet

この文書は、GO-SLICE-1 後に残る **IR-P2-002**
（concrete SPFx `SPHttpClient` host seam unbound）についての
**docs-only prerequisite / sequencing Decision packet** である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-SPHTTPCLIENT-BINDING-1
Kind: Prerequisite / sequencing Decision packet（docs-only）
Status: PACKET / AWAITING HUMAN DECISION
Baseline main: fbf61635a0aaa4ead01c94e0efa70927bc1e2757

Selection:
  decision-assessment-snapshot-adapter-sphttpclient-binding-selection.md
IR:
  decision-assessment-snapshot-adapter-sphttpclient-binding-independent-review.md

Authority（再 Decision しない）:
  Decision-AS-ADAPTER-EC3-EC4-1 = ACCEPTED / LOCKED
    / TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1
  Decision-AS-ADAPTER-IMPLEMENTATION-START-1 = ACCEPTED / LOCKED / GO-SLICE-1 CONSUMED
  Decision-AS-ADAPTER-NEXT-SLICE-1 = ACCEPTED / LOCKED / ACCEPT A1
  IR-P2-001 = CLOSED / ACCEPTED RESIDUAL / NON-BLOCKING

IR-P2-002: OPEN / CARRY-FORWARD（this packet）
Implementation Start（binder code）: NOT AUTHORIZED by this packet
runtime dependency install: NOT AUTHORIZED（DP-1-A）
live SharePoint / M365 / Entra I/O: FORBIDDEN
Deploy / real data: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md`](./decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md)
[`decision-assessment-snapshot-adapter-ec3-transport-comparison.md`](./decision-assessment-snapshot-adapter-ec3-transport-comparison.md)
[`decision-assessment-snapshot-go-slice-1-closeout.md`](./decision-assessment-snapshot-go-slice-1-closeout.md)
[`decision-assessment-snapshot-next-slice-acceptance.md`](./decision-assessment-snapshot-next-slice-acceptance.md)

## 1. Current-state observation

| Item | Observed on baseline `fbf6163` |
|---|---|
| `src/adapters/sharepoint/assessment-snapshot/transport-seam.ts` | PRESENT |
| `AssessmentSnapshotListTransport` abstract seam | PRESENT |
| `SPFX_SPHTTPCLIENT_HOST_SEAM` | PRESENT |
| `bindWhenAvailable` | `false` |
| `@microsoft/sp-http` import | ABSENT |
| live tenant I/O in adapter | ABSENT |
| `package.json` `dependencies` | ABSENT / empty runtime deps |
| `@microsoft/sp-*` runtime packages | NOT PRESENT |
| `@pnp/*` | NOT PRESENT |
| SPFx scaffold（`config/package-solution.json`, gulp, webparts, `.yo-rc.json`） | NOT PRESENT |
| Canonical fixed `@microsoft/sp-*` version | **UNRESOLVED**（no Accepted version pin in repo authority） |
| GO-SLICE-1 synthetic repository / store | PRESENT |
| MAP-AS-009 | EXPLICITLY OUT |

```text
Repo name contains “spfx” but does not imply installed SPFx packages,
scaffold presence, or authorized dependency install.
Do NOT infer SPFx 1.23.2（or any version）from the name alone.
```

## 2. IR-P2-002 exact definition

```text
IR-P2-002:
  Concrete SPFx SPHttpClient host binding for AssessmentSnapshot
  List Items transport remains unbound.

Living facts:
  - preferred host language = SPFx SPHttpClient when available（TC-1-A）
  - seam marker exists with bindWhenAvailable = false
  - no concrete binder implementation
  - no @microsoft/sp-http import
  - no live tenant calls

Residual meaning:
  TC-1-A preferred host path is not yet concretely wired.
  This is NON-BLOCKING for GO-SLICE-1 closeout（synthetic slice COMPLETE）.
```

## 3. Answers from canonical state

| # | Question | Answer |
|---|---|---|
| 1 | Can concrete SPHttpClient binding be implemented now without violating DP-1-A? | **NO**. Concrete `SPHttpClient` use requires importing a runtime `@microsoft/sp-*` package（typically `@microsoft/sp-http`）that is not present；DP-1-A does not authorize install. |
| 2a | Does concrete binding require SPFx scaffold existence? | **YES for a real SPFx host binder**（SPHttpClient is obtained from SPFx webpart/application context）. A pure type-only stub without the package is not “concrete binding”. |
| 2b | Does it require `@microsoft/sp-http` or another `@microsoft/sp-*` package? | **YES** — concrete binding needs an installed SPFx HTTP client package. Exact package/version = **UNRESOLVED** until separate version-resolution + install GO. |
| 2c | New runtime dependency authorization required? | **YES** — separate explicit Human GO；not granted by TC-1-A, GO-SLICE-1, ACCEPT A1, or this packet. |
| 3 | Is SPFx scaffold creation currently authorized? | **NO**. |
| 4 | Is any live SharePoint call required to implement/verify binder structurally? | **NO** for structural binder + synthetic doubles. Live calls remain separately gated and FORBIDDEN now. |
| 5 | What can be verified synthetic/local only? | REST body construction（already）、FR-1 mapping、seam interface conformance、transport double behavior、fail-closed conversion、CO-1-A clear/omit. Not: real digest/auth against tenant. |
| 6 | Separate Human GOs required? | See §5 gate ordering. |
| 7 | Can IR-P2-002 close before actual binder implementation? | **NO** under B1/B2/B3 as defined. Remains **OPEN** until concrete binder exists（or a later Human Decision explicitly redefines residual closure without binding — not proposed here）. |

## 4. Option comparison（B1 / B2 / B3）

| ID | Meaning | Dependency / scaffold | Code now | Live I/O | IR-P2-002 | Selectable now? |
|---|---|---|---|---|---|---|
| **B1** | HOLD / PREREQUISITE-FIRST — keep seam unbound；record missing prerequisites and ordering | none authorized | none | none | remains **OPEN** | **YES** |
| **B2** | AUTHORIZE A FUTURE SYNTHETIC BINDER SLICE definition — narrow future Implementation Start *candidate* only | scaffold + runtime dep install remain **separate explicit Human GOs**；not granted by selecting B2 | none in this run | none | remains **OPEN** until binder exists | **YES as docs-only future-slice definition**；Impl Start still NOT authorized |
| **B3** | LIVE BINDING / TENANT VERIFICATION stage | requires prior scaffold/dep/binder GOs | none now | would need separate live-read / live-write GOs | cannot close by selecting B3 now | **NOT LEGITIMATELY SELECTABLE NOW** |

### B1 — HOLD / PREREQUISITE-FIRST

```text
IN:
  docs recording of prerequisites + ordering
  keep SPFX_SPHTTPCLIENT_HOST_SEAM.bindWhenAvailable = false
  keep synthetic verification path

OUT:
  dependency addition
  scaffold
  binder code
  live I/O
  Deploy
  closing IR-P2-002
```

### B2 — FUTURE SYNTHETIC BINDER SLICE（definition only）

```text
Future Implementation Start candidate（NOT started by this Decision）:
  concrete SPFx SPHttpClient host adapter/binder
  REST List Items transport only（TC-1-A）
  AssessmentSnapshots list only
  synthetic/local verification（SV-1-A）
  no live tenant calls

MUST still separately authorize before that candidate can start:
  SPFx scaffold existence GO（if still absent）
  runtime dependency install GO（version-resolved）
  Implementation Start GO for binder code

Selecting B2 ≠ install GO ≠ scaffold GO ≠ Implementation Start
```

### B3 — LIVE BINDING / TENANT VERIFICATION

```text
Future stage only. Separately gated.

NOT AUTHORIZED now（and not selectable as current unit）:
  live tenant read
  live tenant write
  SharePoint mutation
  M365 / Entra mutation
  Deploy
  real data

B3 cannot legitimately be selected now.
```

## 5. Prerequisite matrix

| Prerequisite | Present now? | Authorized now? | Blocks concrete binder? |
|---|---|---|---|
| TC-1-A host language selected | YES | YES（Accepted） | no |
| Abstract transport seam | YES | YES（GO-SLICE-1 delivered） | no |
| Synthetic repo/store/tests | YES | YES | no |
| SPFx scaffold in repo | NO | NO | **YES** for real host binder |
| `@microsoft/sp-*` installed | NO | NO（DP-1-A） | **YES** |
| Exact package + version pin | UNRESOLVED | NO | **YES** before install |
| Binder Implementation Start GO | NO | NO | **YES** for code |
| Live tenant read GO | NO | NO | not required for synthetic binder |
| Live tenant write GO | NO | NO | not required for synthetic binder |
| Deploy GO | NO | NO | not required for synthetic binder |

## 6. Recommended gate ordering（do not collapse）

```text
Safe sequence（canonical）:

1. Prerequisite Decision（this Decision packet / Human selection）
2. SPFx scaffold + dependency version-resolution + install Human GO
   （explicit；separate；exact @microsoft/sp-* version must be resolved first）
3. Synthetic binder Implementation Start Human GO
4. Binder implementation + synthetic/local tests
5. Human Ready / Merge for binder slice
6. Separate live-read verification Human GO
7. Separate live-write / Deploy Human GO

Gates MUST NOT be collapsed.
Selecting this packet / B1 / B2 does NOT skip to steps 2–7.
```

```text
Narrower sequence supported now?
  Only step 1（prerequisite Decision recording）.
  Steps 2+ remain unauthorized.
  No canonical authority supports binder code before scaffold/dep GO.
```

## 7. Package / version rule

```text
Do NOT invent package versions.
Exact @microsoft/sp-http（or other @microsoft/sp-*）version:
  UNRESOLVED on baseline fbf6163
  NOT fixed by repo name, Node 22.23.1 engines, or prior Accepted Decisions
Require version-resolution before any dependency installation GO.
Do NOT infer that “SPFx 1.23.2” automatically grants package install.
```

## 8. Authorization snapshot（now）

| Axis | Authorized now? |
|---|---|
| New Human Decision for this packet | **REQUIRED**（Human selection of B1/B2/B3） |
| Runtime dependency install | **NO** |
| SPFx scaffold creation | **NO** |
| Binder Implementation Start | **NO** |
| Live tenant read | **NO** |
| Live tenant write | **NO** |
| Deploy / real data | **NO** |
| Closing IR-P2-002 | **NO**（remains OPEN until concrete binder exists） |

## 9. FORBIDDEN in this packet / PR

```text
src/** mutation
tests/** mutation
package.json / package-lock.json mutation
npm install
SPFx generator / scaffold
@microsoft/sp-* import
live HTTP
SharePoint / M365 / Entra mutation
real data
Deploy
MAP-AS-009
other adapters
UI
Issue mutation
auto Ready / Merge
binder implementation start
```
