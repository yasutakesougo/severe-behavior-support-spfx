# Next gate — Explicit Site/List creation execution + VR-1 read-back

この文書は、**Decision-AS-NEW-TARGET-PROVISION-EXEC-1 Accepted / LOCKED / PX-1+VR-1+FG-1+XB-1** 後の
次 Human gate を固定する正本である。

Authorization 正本:
[`decision-assessment-snapshot-new-target-provision-exec-acceptance.md`](./decision-assessment-snapshot-new-target-provision-exec-acceptance.md)

Intended values 正本:
[`decision-assessment-snapshot-new-target-names-acceptance.md`](./decision-assessment-snapshot-new-target-names-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Next-gate definition（docs-only）
Status: FIXED / NOT STARTED
Authorization basis:
  Decision-AS-NEW-TARGET-PROVISION-EXEC-1 = Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1

Next gate:
  EXPLICIT SITE/LIST CREATION EXECUTION
  + VR-1 READ-BACK

Execution GO: NOT GIVEN / NOT STARTED
This document does NOT start tenant mutation.
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Fixed next gate

```text
Next gate:
  EXPLICIT SITE/LIST CREATION EXECUTION
  + VR-1 READ-BACK

Sequence after explicit GO:
  1. Site/List 作成実行
  2. VR-1 read-back
  3. 結果確定（CONFIRMED or STOP）
  4. STOP
```

## 2. Execution targets（LOCKED intended）

```text
実行対象:
  - LOCKED 済み intended Site の作成
  - LOCKED 済み intended Lists の作成

Intended（NAMES-1；再 Decision / 発明しない）:
  New Site URL:  https://isogokatudouhome.sharepoint.com/sites/XXXXX
  New Site name: XXXXX
  New List names:
    - XXXXX
    - YYYYY
  Status now: HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED
```

## 3. Post-execution VR-1 read-back

```text
実行後:
  - 実 tenant から Site URL / Site name を read-back
  - 実 tenant から List name(s) を read-back
  - intended と一致した場合のみ:
      SV-1 = CONFIRMED
      LV-1 = CONFIRMED

一致しない / 確認できない場合:
  SV-1 / LV-1 を CONFIRMED にしない
  → FG-1 fail-closed / STOP
```

## 4. Fail-closed（FG-1）

```text
fail-closed STOP conditions:
  - access denied
  - name conflict
  - already exists
  - ambiguous result
  - partial failure
  - evidence 不足

On STOP:
  - 代替名発明: FORBIDDEN
  - overwrite: FORBIDDEN
  - blind retry: FORBIDDEN
  - values remain NOT CONFIRMED / HOLD as applicable
```

## 5. Out of scope（unchanged）

```text
custom columns: NO-GO
Internal Column Names: OPEN / post-creation CN-1
permissions / config: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO
Schema / DTO code assignment: HOLD
FindingCode / A-5: HOLD
post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

## 6. Explicit non-start

```text
This next-gate definition alone does NOT:
  start Site / List creation
  perform tenant mutation
  mark SV-1 / LV-1 CONFIRMED
  invent or alter intended names
  create custom columns
  confirm Internal Names
  start Implementation / SharePoint code / Deploy

Requires separate explicit Human GO to enter the execution sequence.
After that GO, handle only:
  Site/List creation execution
  → VR-1 read-back
  → result lock（CONFIRMED or STOP）
  → STOP
```

## 7. Current state

```text
Decision-AS-NEW-TARGET-PROVISION-EXEC-1: Accepted / LOCKED / PX-1 + VR-1 + FG-1 + XB-1
Next gate: FIXED = EXPLICIT SITE/LIST CREATION EXECUTION + VR-1 READ-BACK
Execution GO: NOT GIVEN / NOT STARTED
Site / List creation: AUTHORIZED / NOT STARTED
SV-1 / LV-1: NOT CONFIRMED
Internal Column Names: OPEN（IN-1）
custom columns / permissions / config: NO-GO
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Deploy / real data: NO-GO
```
