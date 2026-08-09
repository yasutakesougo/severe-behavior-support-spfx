# Decision Packet — Decision-ILB-1 後の第17残存 Decision 選定

この文書は、Decision-AS-SP-PLACEMENT-1（SV-1+LV-1+CN-1+SC-1）Accepted 後の
**次 residual substantive unit 選定**のための Human Decision Packet である。

FindingCode / A-5 / Implementation Start / SharePoint 実装 / Deploy ではない。
Agent が次 Decision を自動選定・自動 Accepted しない。
tenant 変更・List/列作成を本 packet から開始しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
baseline main: 78748790a442578ed138933dcc69cad05ed11bb3
Decision ID: ILB1_SEVENTEENTH_RESIDUAL_DECISION_SELECTION
Kind: Human Decision packet（selection only）
Status: OPEN / NOT SELECTED
Depends on:
  Decision-AS-SP-PLACEMENT-1 Accepted / LOCKED（SV-1+LV-1+CN-1+SC-1）
  Decision-AS-DEC6-MAPPING-1 Accepted / LOCKED（LF-1+RW-1+MF-1+VR-1）
  Decision-AS-SP-ADAPTER-1 Accepted / LOCKED（PB-1+EM-1+CV-1+D6-1+UP-1）
Site / List / Internal Column Name values: NOT CONFIRMED / HOLD
Implementation Start: HOLD
SharePoint implementation: DO NOT START
Schema / DTO code: HOLD / NOT STARTED
tenant changes: NO-GO
Deploy / real data: NO-GO
FindingCode / A-5: HOLD
Post-retention deletion: OPEN / AUTO-START FORBIDDEN
Seventeenth residual Decision: NOT SELECTED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. 主問い

```text
Question:
  次の substantive unit はどれか。
```

現状（LOCKED / HOLD）:

```text
Placement confirmation rules: LOCKED（SV-1 / LV-1 / CN-1 / SC-1）
DEC-6 mapping rules: LOCKED（values 具体名は OPEN）
Site / List / Internal Name values: NOT CONFIRMED / HOLD
実テナント確認: まだ GO されていない
```

## 2. Options

### Option A — Tenant confirmation / primary-evidence acquisition GO

```text
Meaning:
  SV-1 / LV-1 / CN-1 に従い、実 SharePoint の一次情報を
  read-only で確認する許可だけを切り出す。
  Site / List / Internal Name を evidence として取得する準備を開く。

Candidate Decision ID（選定後）:
  Decision-AS-TENANT-CONFIRM-1

Closes only（選定後の後続 Decision 範囲の意図）:
  read-only tenant confirmation GO の判断単位

Does NOT authorize:
  tenant changes
  List / column creation
  Deploy / real data mutation
  Implementation Start
  SharePoint implementation
  Schema / DTO code assignment
  FindingCode / A-5
  post-retention deletion
```

### Option B — DEC-015 backup / recovery owner

```text
Meaning:
  バックアップ・復元責任者の判断単位を次に選ぶ。
Note:
  運用上重要だが、AssessmentSnapshot 実値ブロッカー
  （Site / List / Internal Name）を直接解消しない。
```

### Option C — post-retention deletion

```text
Meaning:
  5年経過後の完全削除方針を次に選ぶ。
Status today:
  OPEN / AUTO-START FORBIDDEN
Note:
  現時点の AssessmentSnapshot 実装準備を直接前進させない。
```

### Option D — HOLD（まだ決めない）

```text
Meaning:
  Seventeenth residual を選定しない。
  現状の HOLD / NO-GO を維持する。
```

## 3. Agent recommendation（NOT Selection）

```text
Agent recommendation: A

Rationale（比較用）:
  実装系 HOLD を解除する前に残る技術的実値ブロッカーは
  Site / List / Internal Name（NOT CONFIRMED）。
  SV-1/LV-1/CN-1 の確認許可だけを切り出せば、
  tenant 変更や実装開始を開かずに前進できる。
  DEC-015 / post-retention は重要だが本経路の直接前進ではない。

This is NOT Human Selection evidence.
Human must explicitly select A / B / C / D.
```

## 4. Human Decision（未選択）

```text
答え: A / B / C / D / （未記載 = NOT SELECTED）
```

```text
Until explicit Human Selection:
  Seventeenth residual Decision: NOT SELECTED
  Tenant confirmation GO: NOT OPENED
  Implementation Start: HOLD
  SharePoint implementation: DO NOT START
  tenant changes / List / column creation: NO-GO
  Schema / DTO code: HOLD
  Deploy / real data: NO-GO
  FindingCode / A-5: HOLD
  Post-retention deletion: OPEN / AUTO-START FORBIDDEN
```

## 5. Explicit prohibitions

```text
Do NOT:
  auto-select A from Agent recommendation
  treat this packet as Tenant confirmation GO Accepted
  start tenant confirmation / SharePoint / Entra / M365 changes
  create Lists / columns
  Implementation Start
  SharePoint implementation
  Schema / DTO code assignment
  invent Site / List / Internal Name values
  auto-start post-retention deletion
  Deploy / real data
```

## 6. Next after Human Selection（将来）

```text
If Human selects A:
  → write selection record（SELECTED / A）
  → then Decision-AS-TENANT-CONFIRM-1 read-only compare / GO packet
  → still NOT Implementation Start
  → tenant changes / List / column creation remain NO-GO
If Human selects B / C:
  → write selection record for that unit only
If Human selects D / unanswered:
  → remain NOT SELECTED / HOLD
```
