# Decision-AS-CONVERSION-1 — Human Acceptance

この文書は、**Decision-AS-CONVERSION-1**（AssessmentSnapshots CV-REQ
MAP-AS-001〜008 Read / Write Conversion Contract）についての
**Human Acceptance 正本（LOCKED）** である。

Compare packet:
[`decision-assessment-snapshot-conversion-packet.md`](./decision-assessment-snapshot-conversion-packet.md)

Contract:
[`assessment-snapshot-conversion-contract.md`](./assessment-snapshot-conversion-contract.md)

Selected via:
[`decision-assessment-snapshot-conversion-selection.md`](./decision-assessment-snapshot-conversion-selection.md)

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
（CV-1）
[`assessment-snapshot-complete-contract.md`](./assessment-snapshot-complete-contract.md)
[`decision-assessment-snapshot-column-create-vr1-evidence.md`](./decision-assessment-snapshot-column-create-vr1-evidence.md)
[`contracts-v1.md`](./contracts-v1.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-CONVERSION-1
Status: Accepted / LOCKED
Human Decision: C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1
Human Acceptance: Explicit Human Decision on 2026-08-10
PR: #207

LOCKED:

C-1 Required Text（MAP-AS-001 / 005 / 008）:
  C-1-A — strict identity + fail-closed
          no trim-to-accept
          no null/default coercion
          empty / whitespace-only / null / undefined / missing / non-string → fail-closed

C-2 Choice（MAP-AS-002 / 003）:
  C-2-DERIVED — ACCEPTED AS DERIVED
                stored value ↔ domain enum identity
                Display label is not persistence key
                unknown / missing / null / empty → fail-closed
                NO NEW SEMANTIC DECISION

C-3 reasonCodes（MAP-AS-004）:
  C-3-A — JSON compact string array
          lossless unique string[] only
          ordering preserved exactly
          duplicates → FAIL-CLOSED
          invalid JSON / wrong shape / invalid member → FAIL-CLOSED
          CSV / delimiter → NOT ADOPTED
          normalizeReasonCodes MUST NOT be used as persistence read repair
          Domain-internal normalizeReasonCodes: UNCHANGED

C-4 DateOnly（MAP-AS-006 / 007）:
  C-4-A — YYYY-MM-DD civil-date semantics
          local civil day must be preserved
          UTC datetime semantic rewrite → FORBIDDEN
          invalid / missing / null → FAIL-CLOSED

Implementation / adapter / Deploy boundary:
  XB-1 — 本 Decision ≠ Implementation Start
         ≠ adapter / schema mapping code start
         ≠ SharePoint item write
         ≠ Deploy / real data
         ≠ mapping-complete PASS

P2 disposition:
  P2-001 CLOSED — reasonCodes duplicates FAIL-CLOSED
  P2-002 OPEN / CARRY-FORWARD — SharePoint client DateOnly wire-form enumeration
         Decision blocker: NO
         Does not change Accepted civil-date semantics

Implementation Start:
  HOLD
SharePoint adapter / schema mapping implementation:
  HOLD
SharePoint item write / column mutation:
  FORBIDDEN
mapping-complete:
  NOT YET
Deploy / real data:
  NO-GO
Agent SharePoint / M365 mutation:
  FORBIDDEN

Closes only:
  Decision-AS-CONVERSION-1（C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1）
  MAP-AS-001〜008 Read / Write Conversion Contract
Does NOT close:
  MAP-AS-009 / 010 / ENV adoption
  mapping-complete PASS
  adapter / schema / DTO wiring
  SharePoint item write
  Implementation Start
  Deploy / real data
Implementation auto-start: FORBIDDEN
Agent tenant mutation: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Decision: C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1
Decision-AS-CONVERSION-1: Accepted / LOCKED
MAP-AS-001〜008 Conversion Contract: ACCEPTED / LOCKED
Human Acceptance date: 2026-08-10
```

日本語正本:

```text
C-1-A:
  必須 Text は strict identity + fail-closed。
  trim-to-accept しない。null/default へ倒さない。
C-2-DERIVED:
  Choice は stored value ↔ domain enum の identity。
  Display label は persistence key ではない。
  unknown / missing / null / empty は fail-closed。
  新規意味決定ではない（DERIVED）。
C-3-A:
  reasonCodes は compact JSON string array。
  一意 string[] のみ lossless 成功。順序厳密保持。
  duplicates は FAIL-CLOSED。
  normalizeReasonCodes を persistence read 修復に使わない。
C-4-A:
  DateOnly は YYYY-MM-DD 暦日。
  local civil day を保持する。
  UTC datetime への意味変更は禁止。
XB-1:
  本 Acceptance だけでは Implementation / adapter / SharePoint write /
  Deploy / mapping-complete を開始・確定しない。
```

```text
Agent recommendation（C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1）:
  NOT Human Acceptance evidence by itself
This document records the Human Decision only.
```

## Accepted 内容

```text
Decision-AS-CONVERSION-1: Accepted / LOCKED

C-1 Required Text:     C-1-A
C-2 Choice:            C-2-DERIVED（NO NEW SEMANTIC DECISION）
C-3 reasonCodes:       C-3-A（duplicates = FAIL-CLOSED）
C-4 DateOnly:          C-4-A（YYYY-MM-DD civil-date lossless）
Boundary:              XB-1

NOT SELECTED:
  C-1-B / C-1-HOLD / C-1-X
  C-2-B / C-2-HOLD / C-2-X
  C-3-B / C-3-HOLD / C-3-X
  C-4-B / C-4-HOLD / C-4-X
  XB-2
```

### Accepted mapping coverage

| Mapping ID | Logical Field | Conversion axis | Status |
|---|---|---|---|
| MAP-AS-001 | snapshotId | C-1-A | ACCEPTED / LOCKED |
| MAP-AS-002 | recordStatus | C-2-DERIVED | ACCEPTED / LOCKED |
| MAP-AS-003 | result | C-2-DERIVED | ACCEPTED / LOCKED |
| MAP-AS-004 | reasonCodes | C-3-A | ACCEPTED / LOCKED |
| MAP-AS-005 | ruleSetVersion | C-1-A | ACCEPTED / LOCKED |
| MAP-AS-006 | periodStart | C-4-A | ACCEPTED / LOCKED |
| MAP-AS-007 | periodEnd | C-4-A | ACCEPTED / LOCKED |
| MAP-AS-008 | inputFingerprint | C-1-A | ACCEPTED / LOCKED |

```text
OUT OF THIS Acceptance:
  MAP-AS-009 findingIds
  MAP-AS-010 supersedesSnapshotId
  MAP-AS-ENV-001〜003
  MAP-AS-SYS-001 Title
```

失敗時 MUST NOT（LOCKED）:

```text
null → default
invalid → valid coerce
unknown Choice → fallback / Display-label match success
trim-to-accept for required Text
reasonCodes duplicate persistence → silent dedupe
CSV / delimiter for reasonCodes
DateOnly → UTC datetime semantic rewrite
treating this Acceptance as mapping-complete PASS
treating this Acceptance as adapter / Implementation Start
Agent による SharePoint / M365 / Entra mutation を許可する
```

### この決定からは導出しない

```text
NOT derived / MUST NOT equate:
  Decision-AS-CONVERSION-1 Accepted = mapping-complete PASS
  Decision-AS-CONVERSION-1 Accepted = adapter Implementation Start
  Decision-AS-CONVERSION-1 Accepted = schema / DTO wiring GO
  Decision-AS-CONVERSION-1 Accepted = SharePoint item write GO
  Decision-AS-CONVERSION-1 Accepted = additional SharePoint columns GO
  Decision-AS-CONVERSION-1 Accepted = MAP-AS-009 / 010 / ENV Accepted
  Decision-AS-CONVERSION-1 Accepted = Deploy / real data GO
  Decision-AS-CONVERSION-1 Accepted = P2-002 closed
```

## Acceptance boundary

```text
This Acceptance locks MAP-AS-001〜008 Read / Write Conversion Contract only.

MUST NOT start from this Acceptance alone:
  TypeScript / application / persistence port / adapter code
  Schema / DTO implementation
  SharePoint item write / column create / rename / delete
  Implementation Start
  Deploy / real data
  GitHub Issue mutation
  Ready / Merge without separate Human authorization
```

## Next

```text
Decision-AS-CONVERSION-1: Accepted / LOCKED / C-1-A + C-2-DERIVED + C-3-A + C-4-A + XB-1
MAP-AS-001〜008 Conversion Contract: ACCEPTED / LOCKED
P2-001: CLOSED
P2-002: OPEN / CARRY-FORWARD（non-blocking）
mapping-complete: NOT YET
Implementation Start: HOLD
adapter / schema mapping implementation: HOLD
SharePoint / M365 mutation: FORBIDDEN
Deploy / real data: NO-GO

Next gate detail（PR process）: separate Human Ready Decision for PR #207
Next substantive column-path residual: NOT SELECTED by this Acceptance
  remaining candidates include CV extension（MAP-AS-009/010 / ENV）
Ready: NOT RUN by this Acceptance
Merge: NOT RUN by this Acceptance
```
