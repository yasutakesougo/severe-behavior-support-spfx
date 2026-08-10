# Decision-AS-ADAPTER-EC3-EC4-1 — Human Decision Packet

この文書は、Decision-AS-ADAPTER-START-1（**AIS-1-B**）の Entry Criteria
**EC-3**（adapter client / transport）と **EC-4**（P2-002 clear / omit mechanics）
を比較し、Human Decision へ渡す **Decision Packet** である。

Selected via:
[`decision-assessment-snapshot-adapter-ec3-ec4-selection.md`](./decision-assessment-snapshot-adapter-ec3-ec4-selection.md)

EC-3 comparison:
[`decision-assessment-snapshot-adapter-ec3-transport-comparison.md`](./decision-assessment-snapshot-adapter-ec3-transport-comparison.md)

EC-4 comparison:
[`decision-assessment-snapshot-adapter-ec4-clear-omit-comparison.md`](./decision-assessment-snapshot-adapter-ec4-clear-omit-comparison.md)

IR:
[`decision-assessment-snapshot-adapter-ec3-ec4-independent-review.md`](./decision-assessment-snapshot-adapter-ec3-ec4-independent-review.md)

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
Kind: Human Decision packet（compare → READY FOR HUMAN DECISION）
Status: CANDIDATE / NOT ACCEPTED
Baseline main: 5bbe912d0e5e127cf1846bb0edf5ddff24ca99a0

Authority:
  Decision-AS-ADAPTER-START-1 = ACCEPTED / LOCKED as AIS-1-B

Entry Criteria living state（unchanged by this packet alone）:
  EC-1 = MET
  EC-2 = MET
  EC-3 = NOT YET
  EC-4 = NOT YET
  EC-5..EC-8 = still required at Implementation Start gate

Implementation Start: HOLD
P2-002: OPEN / CARRY-FORWARD
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

本 Packet ≠ EC-3 MET
本 Packet ≠ EC-4 MET
本 Packet ≠ P2-002 CLOSED
本 Packet ≠ Implementation Start GO
本 Packet ≠ runtime dependency install GO
```

## 2. Re-Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| AIS-1-B | 条件付きGO；EC-3/EC-4 required before impl start | ADAPTER-START-1 |
| Port / conversion / errors | PB-1 + CV-1 + EM-1 | SP-ADAPTER-1 |
| MAP-AS-010 column contract | N-1-A…W-1-A；O-1-A / R-1-A / W-1-A | MAP010-COLUMN-1 |
| W-1-B omit-only never-clear | NOT SELECTED | MAP010-COLUMN-1 |
| mapping-complete | PASS / COMPLETE | determination |
| package.json SharePoint runtime deps | NONE | inspected baseline |
| Agent recommendation ≠ Acceptance | LOCKED process rule | prior packets |

```text
FORBIDDEN in this packet:
  marking EC-3 / EC-4 MET from recommendation alone
  closing P2-002 without Human Acceptance
  adding runtime dependencies
  implementing adapter / DTO / schema
  SharePoint / M365 writes
  Deploy / real data
  converting empty/whitespace to successful absence
```

## 3. Compare summary

### EC-3 — TC / DP

| ID | Content | Agent result |
|---|---|---|
| **TC-1-A** | SharePoint REST List Items；host = SPFx `SPHttpClient` when available；no install now | **RECOMMENDED** |
| TC-1-B | PnPjs `@pnp/sp`（new runtime dep） | NOT RECOMMENDED |
| TC-1-C | raw `fetch` + REST only | NOT RECOMMENDED as primary |
| TC-1-D | Microsoft Graph | NOT SELECTABLE |
| **DP-1-A** | no runtime dependency addition authorized by this Decision | **RECOMMENDED** |
| DP-1-B / DP-1-C | authorize `@microsoft/sp-http` or `@pnp/sp` now | NOT SELECTABLE |

### EC-4 — CO / SV

| ID | Content | Agent result |
|---|---|---|
| **CO-1-A** | Create absent = omit（preferred）/null；Update clear = JSON `null`；Update omit ≠ clear；`""` FORBIDDEN as absence | **RECOMMENDED** |
| CO-1-B | omit-only never clear | NOT SELECTABLE（≠ W-1-A） |
| CO-1-C | clear via `""` | NOT SELECTABLE（≠ O-1-A / R-1-A） |
| **SV-1-A** | synthetic / local body matrix + public REST semantics；no tenant write | **RECOMMENDED** |
| SV-1-B | Agent live tenant write | NOT SELECTABLE |

### Boundary

| ID | Content | Agent result |
|---|---|---|
| **XB-1** | Acceptance of this Decision ≠ Implementation Start；≠ auto MET without Human Decision recorded；≠ Deploy；≠ dep install | **RECOMMENDED** |

## 4. Create vs update matrix（recommended CO-1-A under TC-1-A）

| Logical input | Create transport | Update transport | Gate |
|---|---|---|---|
| `undefined` / absent | omit `supersedesSnapshotId`（preferred） | send `"supersedesSnapshotId": null`（clear） | allow |
| valid non-empty string | send exact Text | send exact Text | allow |
| intend “leave prior unchanged” | N/A | omit field | allow only when logical field not being written as absent |
| `""` / whitespace-only | — | — | **fail-closed**（no transport） |
| logical `null` | — | — | **fail-closed**（no transport） |

## 5. Agent recommendation（NOT Human Acceptance）

```text
Agent recommendation:
  TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1

Japanese summary:
  EC-3: SharePoint REST を正とし、将来の SPFx SPHttpClient ホストで呼ぶ。
        今は runtime dependency を追加しない。
  EC-4: 作成時の欠落は omit（または null）。
        更新時の欠落は JSON null で clear。
        更新時の omit は「既存値維持」であり欠落表現に使わない。
        空文字 / 空白のみは fail-closed（送信しない）。
  検証: 合成ボディ行列のみ。テナント書き込みなし。

Agent recommendation alone is NOT Human Acceptance evidence.
EC-3 / EC-4 remain NOT YET until Human Acceptance is recorded.
P2-002 remains OPEN until Human Acceptance explicitly closes it.
```

## 6. Human Decision options

| ID | Human choice | Meaning |
|---|---|---|
| **ACCEPT-RECOMMENDED** | Accept TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1 | EC-3/EC-4 become MET only after Acceptance 正本 records them；P2-002 close requires explicit statement |
| ACCEPT-WITH-DELTA | Accept with Human-specified deltas | must be written into Acceptance 正本 |
| HOLD | Do not Accept | EC-3/EC-4 stay NOT YET；Implementation Start stays HOLD |
| REJECT | Reject recommendation | new compare required |

```text
Human Decision: NOT YET
Acceptance 正本: NOT CREATED
```

## 7. Impact if Human Accepts recommended set（preview only）

```text
IF Accepted as recommended（future；not claimed now）:
  EC-3 → MET
  EC-4 → MET（with SV-1-A synthetic verification recorded）
  P2-002 → may be CLOSED only if Acceptance explicitly says so
  Implementation Start → still NOT automatic
    remaining AIS-1-B gate: EC-5..EC-8 + separate Implementation Start GO
  runtime deps → still NOT installed by Acceptance alone
  adapter code → still NOT started by Acceptance alone
```

## 8. Explicit OUT / non-authorization

```text
This CANDIDATE packet does NOT authorize:
  marking EC-3 MET
  marking EC-4 MET
  closing P2-002
  Implementation Start
  adapter / DTO / schema wiring
  npm install / runtime dependency addition
  SharePoint / M365 / Entra mutation
  Deploy / real data
  Ready / Merge without separate Human authorization
  Issue mutation / 一括 Close
```

## 9. Next

```text
Decision-AS-ADAPTER-EC3-EC4-1: CANDIDATE / READY FOR HUMAN DECISION
Recommended: TC-1-A + DP-1-A + CO-1-A + SV-1-A + XB-1
EC-3: NOT YET
EC-4: NOT YET
P2-002: OPEN / CARRY-FORWARD
Implementation Start: HOLD
Next gate: HUMAN DECISION（Accept / HOLD / Reject）
Stop: Human Decision（no adapter impl auto-start）
```
