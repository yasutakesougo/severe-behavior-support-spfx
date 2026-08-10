# Decision-AS-CONVERSION-1 — Conversion Contract packet（MAP-AS-001〜008）

この文書は、AssessmentSnapshots Conversion Contract selection（Option A）後の
**CV-REQ MAP-AS-001〜008 Read / Write conversion** についての
比較用 Human Decision Packet である。

Selected via:
[`decision-assessment-snapshot-conversion-selection.md`](./decision-assessment-snapshot-conversion-selection.md)

Accepted 正本:
[`decision-assessment-snapshot-conversion-acceptance.md`](./decision-assessment-snapshot-conversion-acceptance.md)

Contract:
[`assessment-snapshot-conversion-contract.md`](./assessment-snapshot-conversion-contract.md)

IR:
[`decision-assessment-snapshot-conversion-independent-review.md`](./decision-assessment-snapshot-conversion-independent-review.md)

Depends on（再 Decision しない）:
[`decision-assessment-snapshot-column-names-acceptance.md`](./decision-assessment-snapshot-column-names-acceptance.md)
（NM-1 + CV-REQ + XB-1；reasonCodes Representation=JSON）
[`decision-assessment-snapshot-choice-options-acceptance.md`](./decision-assessment-snapshot-choice-options-acceptance.md)
（CO-1 + CV-CHOICE-BOTH + XB-1）
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
（LF-1 + RW-1 + MF-1 + VR-1）
[`decision-assessment-snapshot-sp-adapter-acceptance.md`](./decision-assessment-snapshot-sp-adapter-acceptance.md)
（CV-1 conversion location = adapter 内）
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)
[`decision-assessment-snapshot-column-create-vr1-evidence.md`](./decision-assessment-snapshot-column-create-vr1-evidence.md)
[`contracts-v1.md`](./contracts-v1.md)（LocalDate = `YYYY-MM-DD`）

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-CONVERSION-1
Kind: Human Decision packet（compare → CONSUMED）
Status: CONSUMED（Human Decision Accepted / LOCKED）
Baseline main: 632d28ae44e1b72929dc628caae183197a976477
Human Selection of unit: Option A — Conversion Contract（SELECTED / CONSUMED）
Human Decision: C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1
Human Selected:
  C-1 Required Text:     C-1-A
  C-2 Choice:            C-2-DERIVED
  C-3 reasonCodes:       C-3-A
  C-4 DateOnly:          C-4-A
  Boundary:              XB-1
Accepted 正本:
  decision-assessment-snapshot-conversion-acceptance.md

Agent recommendation（historical / NOT Acceptance）:
  C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1
  （strict / lossless / fail-closed；Choice = DERIVED）

Current boundary（unchanged by Acceptance for implementation）:
  Implementation Start = HOLD
  adapter / schema mapping implementation = HOLD
  SharePoint item write / column mutation = FORBIDDEN
  mapping-complete = NOT YET
  Deploy / real data = NO-GO
  Agent SharePoint / M365 mutation = FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
AssessmentSnapshots CV-REQ MAP-AS-001〜008 について、
SharePoint persistence value と logical / domain value の間の
Read Conversion / Write Conversion をどう明示固定するか。

本 Decision ≠ adapter Implementation Start
本 Decision ≠ mapping-complete PASS
本 Decision ≠ MAP-AS-009 / 010 / ENV adoption
```

## 2. Re-Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| CV-REQ Internal Names / types | OBSERVED / CONFIRMED | COLUMN-NAMES-1 + VR-1 evidence |
| reasonCodes Representation | JSON | COLUMN-NAMES-1 |
| recordStatus / result Choice stored↔display | OBSERVED / CONFIRMED | CHOICE-OPTIONS-1 + VR-1 |
| periodStart / periodEnd Column Type | DateOnly | COLUMN-NAMES-1 + VR-1 |
| RW-1 / MF-1 / CV-1 | LOCKED | DEC6-MAPPING-1 / SP-ADAPTER-1 |
| LocalDate logical form | `YYYY-MM-DD` | contracts-v1 / complete-contract |
| domain validator | `validateAssessmentSnapshot` | complete-contract / PR-J |
| MAP-AS-009 / 010 / ENV | OUT of this Decision | selection / CV-REQ |

```text
MUST NOT re-open:
  Internal Names / Display Names / Column Types
  Choice stored values / Display labels
  reasonCodes Representation family（JSON）
  DateOnly column type
  DEC-6 LF/RW/MF/VR axes themselves
  SP-ADAPTER boundary
  findingIds / supersedesSnapshotId / ENV adoption
```

## 3. Compare axes

### C-1 — Required text fields（MAP-AS-001 / 005 / 008）

対象: `snapshotId` / `ruleSetVersion` / `inputFingerprint`（SP Type = 1行テキスト）

| ID | conversion 規則 | 結果 |
|---|---|---|
| **C-1-A** | strict identity + fail-closed。string かつ trim≠"" のみ受理。trim して受理にしない。empty / whitespace-only / null / undefined / missing / non-string → fail-closed。Write は validated non-empty string をそのまま Text へ | **SELECTED / Accepted** |
| C-1-B | trim してから empty 判定し、受理時も trim 済み値へ正規化する | NOT recommended（domain は trim-to-accept しない；lossy） |
| C-1-HOLD | text conversion 未決定のまま | NOT recommended as default |
| C-1-X | Human 明示 | available |

```text
Edges covered by C-1-A:
  SP Text → logical string: typeof string && trim() !== ""；値は無改変パススルー
  logical string → SP Text: validated non-empty string を無改変パススルー
  empty string → fail-closed
  whitespace-only → fail-closed
  trim-to-accept → FORBIDDEN
  null / undefined / missing → fail-closed（必須）
  unexpected non-string → fail-closed

Authority alignment:
  domain isNonEmptyString（trim≠"" 判定；値は trim しない）
  MF-1 / RW-1 fail-closed
  NOT invented SharePoint default / silent coerce
```

### C-2 — Choice fields（MAP-AS-002 / 003）

対象: `recordStatus` / `result`（SP Type = 選択肢）

| ID | conversion 規則 | 結果 |
|---|---|---|
| **C-2-DERIVED** | CHOICE-OPTIONS-1 stored value ↔ domain enum を identity で写像。Display label は persistence key に使わない。unknown / missing / null / empty / unexpected → fail-closed（MF-1） | **SELECTED / Accepted（DERIVED / NO NEW SEMANTIC DECISION）** |
| C-2-B | unknown Choice を Display label 照合や default へ倒す | NOT SELECTABLE（silent fallback / lossy） |
| C-2-HOLD | Choice conversion 未決定 | NOT recommended（一意導出可能） |
| C-2-X | Human 明示 | available |

```text
DERIVED mapping（再 Decision しない Choice values）:

recordStatus:
  draft → "draft" / "draft" → draft
  finalized → "finalized" / "finalized" → finalized

result:
  NO_FINDINGS → "NO_FINDINGS"
  FINDINGS_PRESENT → "FINDINGS_PRESENT"
  NOT_APPLICABLE → "NOT_APPLICABLE"

Read:
  use stored Choice value only（not Display label）
  unknown stored value → fail-closed
  missing / null / empty → fail-closed（必須）

Write:
  domain enum → exact stored Choice value
  no Display label write as stored key
```

### C-3 — reasonCodes codec（MAP-AS-004）

対象: `reasonCodes`（SP Type = 複数行テキスト / Note；Representation = JSON Accepted）

| ID | conversion 規則 | 結果 |
|---|---|---|
| **C-3-A** | JSON array of strings。compact encode。decode は JSON.parse → array + string members + isReasonCode。order preserve exactly。duplicate entries → fail-closed。invalid / non-array / null / missing → fail-closed。CSV/delimiter 不採用。read-side で `normalizeReasonCodes` による修復をしない | **SELECTED / Accepted** |
| C-3-B | pretty-print JSON / alternate whitespace-significant encode | NOT recommended（encode 一意性を弱める） |
| C-3-HOLD | codec 未決定 | NOT recommended as default（Representation=JSON は Accepted） |
| C-3-X | Human 明示 | available |

```text
NOT re-Decided:
  Representation family = JSON（COLUMN-NAMES-1）

C-3-A fixes:
  encode form: JSON.stringify(string[])（compact；no CSV/delimiter）
  decode: JSON.parse；Array.isArray；every member typeof string && isReasonCode
  ordering: preserve exactly（no reorder）
  empty array "[]" → []（domain empty 可否は result 規則が別途判定）
  missing / null → fail-closed（必須スロット）
  invalid JSON → fail-closed
  non-array JSON → fail-closed
  non-string member → fail-closed
  invalid ReasonCode member → fail-closed
  duplicate entries → FAIL-CLOSED
    （persistence JSON と logical value の差異を成功扱いしない）
    （invalid persistence state を valid domain state へ coerce しない）
    （read-side で normalizeReasonCodes を修復手段として使わない）
  unknown extra structure（object/map）→ fail-closed
  CSV / delimiter / multi-value column → NOT ADOPTED

  Write source:
    validated domain snapshot reasonCodes（一意配列）を compact JSON encode
  Domain-internal normalizeReasonCodes:
    UNCHANGED by this Decision（persistence read conversion とは分離）
```

### C-4 — DateOnly conversion（MAP-AS-006 / 007）

対象: `periodStart` / `periodEnd`（SP Type = 日付のみ / DateOnly）

| ID | conversion 規則 | 結果 |
|---|---|---|
| **C-4-A** | logical `YYYY-MM-DD` ↔ DateOnly 暦日の lossless 保存。時刻・TZ offset・UTC datetime への意味変更禁止。invalid / impossible / null / missing → fail-closed | **SELECTED / Accepted** |
| C-4-B | DateOnly を UTC DateTime（例: `…T00:00:00Z`）として論理値へ昇格する | NOT SELECTABLE（date-only の意味変更） |
| C-4-HOLD | date conversion 未決定 | NOT recommended as default |
| C-4-X | Human 明示 | available |

```text
C-4-A fixes:
  accepted ISO format: YYYY-MM-DD only（contracts-v1 LocalDate / isValidIsoDate）
  timezone behavior: 暦日を保存・復元する。基準解釈は contracts-v1 Asia/Tokyo（暦日意味）
  UTC conversion: FORBIDDEN as semantic rewrite of the civil date
  local-date preservation: REQUIRED
  time component: reject on logical write input；DateOnly read must not invent a different civil day
  null / missing → fail-closed（必須）
  invalid date / impossible date（e.g. 2026-02-31）→ fail-closed

Authority alignment:
  contracts-v1 LocalDate
  domain isValidIsoDate
  VR-1 evidence DateOnly OBSERVED / CONFIRMED
  MUST NOT invent SharePoint REST midnight-UTC quirks as logical datetime
```

### XB — Implementation boundary（must keep）

| ID | 内容 | 結果 |
|---|---|---|
| **XB-1** | 本 Decision ≠ adapter Implementation Start ≠ schema wiring ≠ SharePoint write ≠ Deploy ≠ mapping-complete PASS | **SELECTED / Accepted** |
| XB-2 | Conversion Acceptance と同時に adapter / schema / SharePoint write を開始 | NOT SELECTABLE |

## 4. Agent recommendation（NOT Acceptance）

```text
Agent recommendation:
  C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1

Meaning:
  strict / lossless / fail-closed conversion for Text / JSON / DateOnly
  Choice = DERIVED from Accepted Choice mappings + MF-1
  boundary remains HOLD for implementation

Agent recommendation alone is NOT Human Acceptance evidence.
```

## 5. Mapping rows status（post-Acceptance）

| Mapping ID | Logical Field | Decision Status |
|---|---|---|
| MAP-AS-001 | snapshotId | ACCEPTED / LOCKED（C-1-A） |
| MAP-AS-002 | recordStatus | ACCEPTED / LOCKED（C-2-DERIVED） |
| MAP-AS-003 | result | ACCEPTED / LOCKED（C-2-DERIVED） |
| MAP-AS-004 | reasonCodes | ACCEPTED / LOCKED（C-3-A） |
| MAP-AS-005 | ruleSetVersion | ACCEPTED / LOCKED（C-1-A） |
| MAP-AS-006 | periodStart | ACCEPTED / LOCKED（C-4-A） |
| MAP-AS-007 | periodEnd | ACCEPTED / LOCKED（C-4-A） |
| MAP-AS-008 | inputFingerprint | ACCEPTED / LOCKED（C-1-A） |

```text
Acceptance 正本: decision-assessment-snapshot-conversion-acceptance.md
Historical compare rows above remain for audit；living status = ACCEPTED / LOCKED.
```

## 6. Explicit OUT / non-authorization

```text
This CONSUMED packet / Acceptance does NOT authorize:
  mapping-complete PASS
  adapter / schema mapping code start
  DTO wiring
  SharePoint item write / column create / rename / delete
  M365 / Entra mutation
  Deploy / real data
  Issue mutation
  Ready / Merge
  MAP-AS-009 / 010 / ENV adoption or naming
```

## 7. Next

```text
Decision-AS-CONVERSION-1: Accepted / LOCKED / C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1
  → decision-assessment-snapshot-conversion-acceptance.md
Contract: assessment-snapshot-conversion-contract.md（ACCEPTED / LOCKED）
Independent Review: decision-assessment-snapshot-conversion-independent-review.md
Next gate: HUMAN READY DECISION FOR PR #207
Still HOLD / FORBIDDEN:
  Implementation Start / adapter / schema wiring
  SharePoint / M365 mutation
  mapping-complete PASS
  Deploy / real data
```
