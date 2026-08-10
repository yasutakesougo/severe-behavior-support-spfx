# Decision-AS-ADAPTER-EC3-EC4-1 — Human Decision Packet

この文書は、Decision-AS-ADAPTER-START-1（**AIS-1-B**）の Entry Criteria
**EC-3**（adapter client / transport）と **EC-4**（P2-002 clear / omit mechanics）
を比較した **Decision Packet** である。

Selected via:
[`decision-assessment-snapshot-adapter-ec3-ec4-selection.md`](./decision-assessment-snapshot-adapter-ec3-ec4-selection.md)

Acceptance 正本:
[`decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md`](./decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md)

EC-3 comparison:
[`decision-assessment-snapshot-adapter-ec3-transport-comparison.md`](./decision-assessment-snapshot-adapter-ec3-transport-comparison.md)

EC-4 comparison:
[`decision-assessment-snapshot-adapter-ec4-clear-omit-comparison.md`](./decision-assessment-snapshot-adapter-ec4-clear-omit-comparison.md)

IR（candidate）:
[`decision-assessment-snapshot-adapter-ec3-ec4-independent-review.md`](./decision-assessment-snapshot-adapter-ec3-ec4-independent-review.md)

Acceptance IR:
[`decision-assessment-snapshot-adapter-ec3-ec4-acceptance-independent-review.md`](./decision-assessment-snapshot-adapter-ec3-ec4-acceptance-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
[`assessment-snapshot-map010-column-contract.md`](./assessment-snapshot-map010-column-contract.md)
[`decision-assessment-snapshot-mapping-complete-determination.md`](./decision-assessment-snapshot-mapping-complete-determination.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-EC3-EC4-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0
Human Decision: ACCEPT-RECOMMENDED
Human Selected:
  TC-1 Transport / client:     TC-1-A
  DP-1 Dependency posture:     DP-1-A
  CO-1 Clear / omit mechanics: CO-1-A
  SV-1 Verification:           SV-1-A
  Boundary:                    XB-1
Accepted 正本:
  decision-assessment-snapshot-adapter-ec3-ec4-acceptance.md
PR: #213

Entry Criteria living（AIS-1-B）:
  EC-1 = MET
  EC-2 = MET
  EC-3 = MET
  EC-4 = MET
  EC-5..EC-8 = still required at Implementation Start gate

P2-002: CLOSED
Implementation Start: HOLD
adapter / DTO / schema wiring: HOLD
runtime dependency addition: NOT AUTHORIZED
SharePoint / M365 mutation by Agent: FORBIDDEN
Deploy / real data: NO-GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
AIS-1-B の未充足 Entry Criteria について:

EC-3:
  AssessmentSnapshot SharePoint adapter の
  client / transport 方式を何に明示選択するか。

EC-4:
  MAP-AS-010 supersedesSnapshotId の
  optional absence / clear / omit を、
  選択した client API 上でどう定義し、
  合成証拠で検証するか。
```

## 2. Re-Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| AIS-1-B | 条件付きGO | ADAPTER-START-1 |
| Port / conversion / errors | PB-1 + CV-1 + EM-1 | SP-ADAPTER-1 |
| MAP-AS-010 column contract | O-1-A / R-1-A / W-1-A | MAP010-COLUMN-1 |
| W-1-B omit-only never-clear | NOT SELECTED | MAP010-COLUMN-1 |
| mapping-complete | PASS / COMPLETE | determination |
| package.json SharePoint runtime deps | NONE | inspected baseline |

## 3. Compare summary（historical）

### EC-3 — TC / DP

| ID | Content | Result |
|---|---|---|
| **TC-1-A** | SharePoint REST List Items；host = SPFx `SPHttpClient` when available；no install now | **SELECTED / Accepted** |
| TC-1-B | PnPjs `@pnp/sp`（new runtime dep） | NOT SELECTED |
| TC-1-C | raw `fetch` + REST only | NOT SELECTED |
| TC-1-D | Microsoft Graph | NOT SELECTED |
| **DP-1-A** | no runtime dependency addition authorized by this Decision | **SELECTED / Accepted** |
| DP-1-B / DP-1-C | authorize `@microsoft/sp-http` or `@pnp/sp` now | NOT SELECTED |

### EC-4 — CO / SV

| ID | Content | Result |
|---|---|---|
| **CO-1-A** | Create absent = omit preferred；Update clear = JSON `null`；Update omit ≠ clear；`""`/ws/logical null FAIL-CLOSED | **SELECTED / Accepted** |
| CO-1-B | omit-only never clear | NOT SELECTED |
| CO-1-C | clear via `""` | NOT SELECTED |
| **SV-1-A** | synthetic / local body matrix；no tenant write | **SELECTED / Accepted** |
| SV-1-B | Agent live tenant write | NOT SELECTED |

### Boundary

| ID | Content | Result |
|---|---|---|
| **XB-1** | Acceptance ≠ Implementation Start；≠ Deploy；≠ runtime dependency install | **SELECTED / Accepted** |

## 4. Accepted create vs update matrix（CO-1-A）

| Logical input | Create transport | Update transport | Gate |
|---|---|---|---|
| `undefined` / absent | omit `supersedesSnapshotId` preferred | send `"supersedesSnapshotId": null`（clear） | allow |
| valid non-empty string | send exact Text | send exact Text | allow |
| intend “leave prior unchanged” | N/A | omit field | allow only when not expressing logical absence clear |
| `""` / whitespace-only | — | — | **fail-closed**（no transport） |
| logical `null` | — | — | **fail-closed**（no transport） |

## 5. Agent recommendation vs Human Decision

```text
Agent recommendation（historical）:
  TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1

Human Decision（Accepted / LOCKED）:
  ACCEPT-RECOMMENDED
  same set — see Acceptance 正本

Agent recommendation alone is NOT Human Acceptance evidence.
```

## 6. Explicit OUT / non-authorization

```text
This CONSUMED packet / Acceptance does NOT authorize:
  Implementation Start
  adapter / DTO / schema wiring
  npm install / runtime dependency addition
  SharePoint / M365 / Entra mutation
  Deploy / real data
  Ready / Merge without separate Human authorization
  Issue mutation / 一括 Close
  waiving EC-5..EC-8
```

## 7. Next

```text
Decision-AS-ADAPTER-EC3-EC4-1: Accepted / LOCKED
  / TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1
EC-3: MET
EC-4: MET
P2-002: CLOSED
Implementation Start: HOLD
Next gate: AIS-1-B Implementation Start gate
  （EC-5..EC-8 preserved；separate Human GO）
```
