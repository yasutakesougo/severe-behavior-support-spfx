# Next gate — Pilot List names（after ownership check）

この文書は、**Decision-AS-PILOT-FACILITY-IDENTITY-1 Accepted / LOCKED /
PO-1+FK-1+SN-1+LN-D+XB-1** 後の次 Human gate を固定する正本である。

Identity / Site naming 正本:
[`decision-assessment-snapshot-pilot-facility-identity-acceptance.md`](./decision-assessment-snapshot-pilot-facility-identity-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Next-gate definition（docs-only）
Status: FIXED / OWNERSHIP CONSUMED
Authorization basis:
  Decision-AS-PILOT-FACILITY-IDENTITY-1 = Accepted / LOCKED
    / PO-1 + FK-1 + SN-1 + LN-D + XB-1
  Decision-AS-PILOT-LIST-OWNERSHIP-1 = Accepted / LOCKED
    / LO-1 + VP-1 + EX-1 + NB-1 + XB-1

Next gate:
  PILOT LIST NAMES
  → decision-assessment-snapshot-pilot-list-names-next-gate.md

Ownership:
  List A = SupportPlan + SupportPlanVersion
  List B = AssessmentSnapshot

List naming GO: NOT GIVEN / NOT STARTED
Creation GO: NOT GIVEN / NO-GO
This document does NOT invent List names and does NOT start tenant mutation.
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Fixed next gate

```text
Next gate:
  PILOT LIST NAMES（after List ownership / responsibility check）

Sequence:
  1. 2つの List それぞれの正本責務を確認する → DONE
  2. Human が ownership pairing を Accept する → DONE（LO-1+VP-1+EX-1+NB-1+XB-1）
  3. 全事業所で共通利用する List name(s) を別 Human Decision で採択する → CURRENT
  4. STOP（作成はさらに別 Human execution gate）

Current step:
  DONE through List names Accept
  Active next = EXPLICIT SITE/LIST CREATION EXECUTION（NO-GO）

NOT next without explicit execution GO:
  Site/List creation
  creating with XXXXX / YYYYY
```

## 2. Locked Site identity（do not re-decide）

```text
Pilot 1:
  Facility: 磯子活動ホーム
  facilityKey: isogo
  Site name: 強度行動障害支援 - 磯子活動ホーム
  Site URL:  https://isogokatudouhome.sharepoint.com/sites/severe-support-isogo

Pilot 2:
  Facility: 本牧活動ホーム
  facilityKey: honmoku
  Site name: 強度行動障害支援 - 本牧活動ホーム
  Site URL:  https://isogokatudouhome.sharepoint.com/sites/severe-support-honmoku

Status: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED
```

## 3. Out of scope（unchanged）

```text
Site / List creation: NO-GO
custom columns: NO-GO
Internal Column Names: OPEN / post-creation CN-1
permissions / config: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO
Schema / DTO code assignment: HOLD
FindingCode / A-5: HOLD
post-retention deletion: OPEN / AUTO-START FORBIDDEN
Common management site naming / creation: 別 Human Decision
```

## 4. Explicit non-start

```text
This next-gate definition alone does NOT:
  invent or Accept List names
  create Site / List / columns
  perform tenant mutation
  mark SV-1 / LV-1 CONFIRMED
  authorize PROVISION-EXEC Execution GO
  start Implementation / SharePoint code / Deploy

Requires separate explicit Human Decision for List names.
Creation remains a later Human execution gate after List names exist.
```

## 5. Current state

```text
Decision-AS-PILOT-FACILITY-IDENTITY-1: Accepted / LOCKED / PO-1 + FK-1 + SN-1 + LN-D + XB-1
Decision-AS-PILOT-LIST-OWNERSHIP-1: Accepted / LOCKED / LO-1 + VP-1 + EX-1 + NB-1 + XB-1
  List A = SupportPlan + SupportPlanVersion
  List B = AssessmentSnapshot
Decision-AS-PILOT-LIST-NAMES-1: Accepted / LOCKED / LN-1 + XB-1
  SupportPlans / AssessmentSnapshots
Next gate: FIXED = EXPLICIT SITE/LIST CREATION EXECUTION
  → decision-assessment-snapshot-pilot-provision-exec-next-gate.md
Execution GO: NOT GIVEN / NO-GO
Site / List creation: NO-GO
Placeholder creation: FORBIDDEN
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO

Current stop:
  waiting for explicit Site/List creation execution GO
  auto-start: FORBIDDEN
```
