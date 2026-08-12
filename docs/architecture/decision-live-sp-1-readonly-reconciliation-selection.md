# LIVE-SP-1 — Read-only Reconciliation — Human Selection Packet

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-LIVE-SP-1-READONLY-RECONCILIATION-1
Kind: Human Selection Packet（#300 first slice）
Status: SELECTED / LOCKED
Human instruction: #300 First Slice Selection GO
Date: 2026-08-12
Issue: #300（LIVE-SHAREPOINT-V1）
Parent roadmap: #298 / completion-roadmap.md Phase 2
Baseline main: 5ab122b11c3f476984e82bd625d29a71eb3005c1
Depends on: RESPONSIBLE-PERSON-DEMO-V1 review COMPLETE（PR #314）
```

Depends on（再 Decision しない）:
[`completion-roadmap.md`](../roadmap/completion-roadmap.md)
[`decision-assessment-snapshot-target-reuse-acceptance.md`](./decision-assessment-snapshot-target-reuse-acceptance.md)
[`decision-assessment-snapshot-adapter-sphttpclient-live-read-verification.md`](./decision-assessment-snapshot-adapter-sphttpclient-live-read-verification.md)
[`decision-assessment-snapshot-dec6-mapping-acceptance.md`](./decision-assessment-snapshot-dec6-mapping-acceptance.md)
CN-1 / EV-1 / RB-1 / XG-1 tenant-confirm boundaries

## Human Selection

```text
Human Decision: SELECT LIVE-SP-1 as #300 first slice
Selected slice:
  ID: LIVE-SP-1
  Name: Read-only Reconciliation
  Parent: #300 LIVE-SHAREPOINT-V1
```

## Why this is first

`completion-roadmap.md` Phase 2 の先頭作業は、Accepted 済み SharePoint 列の実在確認と
Internal Name / Column Type / Choice 等の照合である。

LIVE-SP-1 は、その **read-only 照合責務だけ** を #300 の最初の slice として固定する。

```text
minimum-risk order:
  1. LIVE-SP-1 read-only reconciliation  ← this Selection
  2. later live read / write / binder wiring slices
  3. Entra / AuthorizationContext connection
  4. Deploy / Production
```

## Authorized selection scope

```text
Accepted / LOCKED SharePoint 列・mapping 契約と live pilot 観測の read-only 照合
対象候補（再 Decision しない）:
  pilot Site: severe-support-isogo（既存 live-read evidence の Site）
  List: AssessmentSnapshots（既存 live-read PASS の List）
照合観点:
  List 実在
  ListItemEntityTypeFullName / metadata
  Accepted 列の Internal Name 実在
  Column Type / required / Choice 等の観測値と Accepted 契約の差分記録
Evidence bar:
  実テナント一次情報のみ（EV-1）
  Display Name / TypeScript 名からの Internal Name 推論禁止（CN-1）
Recording:
  観測結果を repository evidence docs に記録
  repository logical mapping 正本へ未確認値を確定書きしない（RB-1）
Method:
  Human または credentialed environment の GET-only 実行
  Agent VM に認証が無い場合は ENVIRONMENT BLOCKED を記録して STOP
```

## Explicit OUT（Selection 時点）

```text
LIVE-SP-1 Implementation Start
code / SCSS / adapter / binder mutation
SharePoint column / list / site create / update / delete
POST / PATCH / MERGE / DELETE
Entra / Graph / membership / role mutation
App Catalog / Deploy / Production
DailyActivityRecords /sites/welfare を新 SPFx target として再利用すること
  （Decision-AS-TARGET-REUSE-1 = B を維持）
実業務データの fixture 化
#300 Close
#299 Close（別 gate）
Ready / Merge auto-progress
```

## Preserved boundaries

```text
Decision-AS-TARGET-REUSE-1 = B（existing welfare = REFERENCE ONLY）
Decision-AS-ADAPTER-SPHTTPCLIENT-LIVE-READ-1 verification remains historical PASS evidence
CN-1 = observe real Internal Names；do not invent
fail-closed on missing / malformed fields remains required for later live slices
Phase 1 DEMO-UX presentation surfaces are not rewritten by this Selection
```

## Gate

```text
LIVE-SP-1 = SELECTED / LOCKED as #300 first slice

This selection does NOT authorize:
  Implementation Start
  live write
  column / list / site mutation
  Entra mutation
  Deploy / Production
  #300 Close

Next Human gate options:
  LIVE-SP-1 Implementation Start GO
  or LIVE-SP-1 Read-only Reconciliation Execution GO
  （credentialed / Human-executed GET-only）
```
