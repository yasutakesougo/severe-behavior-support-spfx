# Decision-AS-ADAPTER-START-1 — Human Decision Packet

この文書は、AssessmentSnapshot mapping-complete 後のadapter Implementation Start可否を比較したHuman Decision Packetである。

Selected via:
[`decision-assessment-snapshot-adapter-start-selection.md`](./decision-assessment-snapshot-adapter-start-selection.md)

Acceptance:
[`decision-assessment-snapshot-adapter-start-acceptance.md`](./decision-assessment-snapshot-adapter-start-acceptance.md)

Depends on:
[`decision-assessment-snapshot-mapping-complete-determination.md`](./decision-assessment-snapshot-mapping-complete-determination.md)
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-START-1
Status: CONSUMED
Human Decision: AIS-1-B
Decision status: ACCEPTED / LOCKED
Baseline main: efe765be21cbc934f4d72034002610805224af10
Implementation Start: HOLD until Entry Criteria are satisfied
```

## 問い

AssessmentSnapshotについて、mapping-complete後にadapter / DTO / schema wiringを開始してよいか。

## 再Decisionしない前提

```text
mapping-complete = PASS / COMPLETE
MAP-AS-001〜008 = PERSISTED / OBSERVED / CONFIRMED + conversion ACCEPTED / LOCKED
MAP-AS-009 = EXPLICITLY OUT
MAP-AS-010 = PERSISTED / PRESENT / OBSERVED / CONFIRMED / column-ready YES
ENV-001〜003 = DERIVED
P2-002 = OPEN / CARRY-FORWARD
```

P2-002は、optionalな`supersedesSnapshotId`が論理的に欠落した場合の、SharePoint client上のexact clear / omit transport mechanicsである。

このAPIの具体形は既存DecisionではLOCKされていない。

現行`package.json`にはSharePoint adapterクライアントのruntime dependencyが存在しない。

したがって、特定のREST / PnP API mechanicsをこのPacketで発明して固定しない。

## 比較結果

| ID | 判定 | 内容 | Human result |
|---|---|---|---|
| AIS-1-A | 即時GO | P2-002未解決のままadapter / DTO / schema実装を開始する | NOT SELECTED |
| **AIS-1-B** | **条件付きGO** | adapter client / transport方式とP2-002 exact mechanicsを先に明示・検証し、そのAccepted後に限定されたAssessmentSnapshot adapter実装を開始する | **ACCEPTED / LOCKED** |
| AIS-1-HOLD | HOLD | 実装開始を継続保留する | NOT SELECTED |

## AIS-1-B Accepted Entry Criteria

AIS-1-BのAcceptanceだけでは、直ちにコードを書き始めない。

次のEntry Criteriaをすべて満たした時点で、別ゲートでImplementation StartをGOにできる。

```text
EC-1 mapping-complete = PASS / COMPLETE
EC-2 MAP-AS-001〜010 applicable persistence contract = Accepted / Confirmed
EC-3 adapter client / transport方式 = explicitly selected
EC-4 P2-002 exact clear / omit mechanics = explicitly defined and verified
EC-5 fail-closed behavior = preserved
EC-6 synthetic data only
EC-7 SharePoint / M365 mutation by Agent = FORBIDDEN unless separately authorized
EC-8 Deploy / real data = separate GO
```

EC-1とEC-2は満たしている。

EC-3とEC-4は未充足である。

したがってImplementation StartはHOLDを維持する。

最初のimplementation sliceはAssessmentSnapshot adapter boundaryに限定する。

新しい業務Decision、SharePoint列変更、Issue一括更新、Deployを含めない。

## Explicit OUT

```text
このAcceptanceだけによるImplementation Start
adapter code mutation
SharePoint / M365 / Entra mutation
Deploy / real data
P2-002の自動Close
特定client APIの発明
Ready / Mergeの自動進行
```

## Next gate

```text
Decision-AS-ADAPTER-START-1 = ACCEPTED / LOCKED as AIS-1-B
Implementation Start = HOLD
Next substantive residual = EC-3 + EC-4
  adapter client / transport方式
  P2-002 exact clear / omit mechanics
Candidate（READY FOR HUMAN DECISION；≠ MET）:
  Decision-AS-ADAPTER-EC3-EC4-1
  decision-assessment-snapshot-adapter-ec3-ec4-packet.md
EC-3 = NOT YET
EC-4 = NOT YET
P2-002 = OPEN / CARRY-FORWARD
```
