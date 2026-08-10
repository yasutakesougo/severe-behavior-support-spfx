# Decision-ILB-1 — Twenty-eighth residual selection

この文書は、PR #188 MERGED 後の次 substantive unit を固定する Selection 正本候補である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Selection: Twenty-eighth residual
Status: SELECTED / OPEN
Selected unit: CN-1 — Internal Column Names read-only confirmation

Baseline:
  main = 2a0b34c9e45f9125728240b41dee26b02999fd02
  PR #188 = MERGED
  PR #187 = MERGED / Current SoT for pilot provisioning evidence
  PR #186 = CLOSED / NOT MERGED / SUPERSEDED

Locked current state:
  Site/List creation = COMPLETED
  VR-1 = PASS
  SV-1 / LV-1 = CONFIRMED
  CN-1 = OPEN / NOT CONFIRMED
  SharePoint adapter / schema mapping = HOLD until CN-1 closed
  Implementation Start = HOLD
  Deploy / real data = NO-GO
```

## Selection meaning

この Selection は、CN-1 の確認に必要な一次情報を read-only で収集し、Internal Column Name を推測せずに比較可能な evidence packet を作る作業だけを選ぶ。

```text
SELECTED:
  CN-1 Selection / Packet
  read-only observation
  evidence normalization
  cross-site / cross-list comparison

NOT selected:
  CN-1 Acceptance
  Internal Name invention
  Display Name からの逆算
  column creation / rename / update
  SharePoint adapter implementation
  schema mapping implementation
  Implementation Start
  Deploy / real data write
```

## Observation targets

```text
Site 1:
  /sites/severe-support-isogo
  Lists: SupportPlans / AssessmentSnapshots

Site 2:
  /sites/severe-support-honmoku
  Lists: SupportPlans / AssessmentSnapshots
```

CN-1 の対象値は、実テナントから観測できた column metadata のみを候補とする。

## Fail-closed boundary

```text
If column metadata cannot be read:
  CN-1 remains OPEN

If sites/lists differ:
  record mismatch
  do not normalize by assumption
  CN-1 remains OPEN unless Human Decision explicitly resolves it

If only Display Name is available:
  do not derive Internal Name

Mutation:
  0
```

## Packet

比較条件、必要 evidence、停止条件は次の packet に固定する。

`decision-assessment-snapshot-cn1-internal-column-names-packet.md`

## Current stop

```text
CN-1: SELECTED / OPEN
Acceptance: NOT RUN
Implementation Start: HOLD
SharePoint adapter / schema mapping: HOLD
```
