# Decision-AS-ADAPTER-EC3-EC4-1 — EC-3 client / transport comparison

この文書は、AIS-1-B Entry Criterion **EC-3**
（AssessmentSnapshot SharePoint adapter client / transport 方式の明示選択）
についての比較正本である。

Packet:
[`decision-assessment-snapshot-adapter-ec3-ec4-packet.md`](./decision-assessment-snapshot-adapter-ec3-ec4-packet.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
（PB-1 + EM-1 + CV-1）
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-EC3-EC4-1
Axis: EC-3 / TC-* + DP-*
Status: CANDIDATE / READY FOR HUMAN DECISION
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
EC-3: NOT YET（recommendation ≠ MET）
Human Acceptance: NOT YET
Implementation Start: HOLD
runtime dependency addition: NOT AUTHORIZED by this comparison
SharePoint / M365 mutation: 0
```

## 1. Repository dependency baseline（inspected）

| Item | Observed | Implication |
|---|---|---|
| `package.json` `dependencies` | **absent** | no runtime SharePoint client today |
| `@microsoft/sp-http` / `@microsoft/sp-*` | **NOT PRESENT** | SPFx SPHttpClient not installed |
| `@pnp/sp` / PnPjs | **NOT PRESENT** | PnP not an existing supported dep |
| SPFx scaffold（`config/package-solution.json`, gulp, webparts） | **NOT PRESENT** | host not scaffolded |
| Existing adapter code | synthetic audit-event only | no AssessmentSnapshot transport |
| Domain / contracts boundary | `/_api/` / PnP banned in domain/contracts | transport stays in adapter layer（CV-1 / PB-1） |

```text
Prefer existing supported dependencies where possible:
  → no SharePoint client runtime dependency currently exists to reuse.
Do not add a runtime dependency in this Decision / PR:
  → TC / DP options must not authorize npm install.
```

## 2. Locked boundary premises（NOT reopened）

| Premise | Value | Authority |
|---|---|---|
| Port I/O | PB-1 — SC-1 in / FR-1 out；app は SharePoint 形を見ない | SP-ADAPTER-1 |
| Conversion location | CV-1 — read/write conversion は adapter 内 | SP-ADAPTER-1 |
| Error mapping | EM-1 — SP 固有エラー → FR-1 は adapter | SP-ADAPTER-1 |
| Port ≠ raw REST/PnP | PB-3 NOT SELECTED | SP-ADAPTER-1 |
| Synthetic-only Entry Criterion | EC-6 | AIS-1-B |
| Agent tenant mutation | EC-7 FORBIDDEN | AIS-1-B |

## 3. TC-1 — Client / transport stack

| ID | Client / transport | Runtime dep impact | Fit to baseline | Notes | Result |
|---|---|---|---|---|---|
| **TC-1-A** | SharePoint REST List Items API, invoked through SPFx `SPHttpClient` when SPFx host exists | **no install authorized now**；dep appears only with future SPFx scaffold GO | Prefer first-party SPFx client；same REST body semantics as raw REST | Selected approach language = REST + SPHttpClient host；mechanics specified against REST JSON | **RECOMMENDED** |
| TC-1-B | PnPjs（`@pnp/sp`） | **requires new runtime dependency** | Conflicts with “do not add runtime dependency” | Human PnP PowerShell was create evidence only；not a runtime app dep | NOT RECOMMENDED |
| TC-1-C | Raw `fetch` + SharePoint REST + Request Digest only | no new npm package | Zero-dep possible, but not the SPFx-native host path for this repo name / intended host | Acceptable fallback if SPFx host remains absent；same REST body as TC-1-A | NOT RECOMMENDED as primary |
| TC-1-D | Microsoft Graph list-item APIs | would require Graph client / auth surface | No prior authority in AssessmentSnapshot docs | Different API shape；out of established residual language | NOT SELECTABLE |
| TC-1-HOLD | leave EC-3 unselected | none | Blocks AIS-1-B Implementation Start indefinitely | Valid only if Human explicitly HOLDs | NOT RECOMMENDED |

```text
TC-1-A meaning（precise）:
  Transport protocol = SharePoint REST List Item create / update
    POST  /_api/web/lists/getbytitle('AssessmentSnapshots')/items
    POST  .../items({id}) with X-HTTP-Method: MERGE（or equivalent PATCH）
  Client host when available = SPFx SPHttpClient
    （digest / auth handled by SPFx context；body semantics = REST）
  This recommendation does NOT install @microsoft/sp-http.
  This recommendation does NOT scaffold SPFx.
  Until SPFx host exists, verification stays synthetic / local against REST body rules.
```

## 4. DP-1 — Dependency posture

| ID | Posture | Result |
|---|---|---|
| **DP-1-A** | This Decision does **not** authorize any runtime dependency addition / `npm install` | **RECOMMENDED** |
| DP-1-B | Authorize adding `@microsoft/sp-http` / SPFx packages in this Decision | NOT SELECTABLE（task / AIS-1-B boundary） |
| DP-1-C | Authorize adding `@pnp/sp` now | NOT SELECTABLE |
| DP-1-HOLD | defer dependency posture | redundant with DP-1-A；NOT RECOMMENDED |

## 5. Create vs update transport surface（under TC-1-A）

| Operation | REST surface（selected language） | SPHttpClient role |
|---|---|---|
| Create | `POST .../items` with JSON body fields | issues REST create；digest via SPFx |
| Update | `POST .../items({id})` + `X-HTTP-Method: MERGE` + `IF-MATCH`（or PATCH equivalent） | issues REST update |
| Read | `GET .../items({id})`（or filtered query） | issues REST read |

```text
Port layer（PB-1）still speaks SC-1 / FR-1 only.
REST / SPHttpClient details stay inside adapter（CV-1）.
```

## 6. Explicit non-claims

```text
This EC-3 comparison / recommendation does NOT:
  mark EC-3 MET
  Accept TC-1-A / DP-1-A（Human Decision required）
  authorize Implementation Start
  authorize adapter / DTO / schema code
  authorize runtime dependency installation
  authorize SharePoint / M365 writes
  authorize Deploy / real data
  select Graph / PnPjs
```

## 7. Agent recommendation（NOT Acceptance）

```text
Agent recommendation for EC-3:
  TC-1-A + DP-1-A

Human Acceptance: NOT YET
EC-3 status after this document alone: NOT YET
```
