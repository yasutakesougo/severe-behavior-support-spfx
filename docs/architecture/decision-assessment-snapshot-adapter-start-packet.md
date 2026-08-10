# Decision-AS-ADAPTER-START-1 — Human Decision Packet

この文書は、AssessmentSnapshot mapping-complete 後のadapter Implementation Start可否を比較するHuman Decision Packetである。

Selected via:
[`decision-assessment-snapshot-adapter-start-selection.md`](./decision-assessment-snapshot-adapter-start-selection.md)

Depends on:
[`decision-assessment-snapshot-mapping-complete-determination.md`](./decision-assessment-snapshot-mapping-complete-determination.md)
[`decision-assessment-snapshot-map010-column-acceptance.md`](./decision-assessment-snapshot-map010-column-acceptance.md)
[`assessment-snapshot-sharepoint-mapping.md`](./assessment-snapshot-sharepoint-mapping.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-AS-ADAPTER-START-1
Status: CANDIDATE / NOT ACCEPTED
Baseline main: efe765be21cbc934f4d72034002610805224af10
Implementation Start: HOLD
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

## 比較

| ID | 判定 | 内容 |
|---|---|---|
| AIS-1-A | 即時GO | P2-002未解決のままadapter / DTO / schema実装を開始する |
| **AIS-1-B** | **条件付きGO候補** | adapter client / transport方式とP2-002 exact mechanicsを先に明示・検証し、そのAccepted後に限定されたAssessmentSnapshot adapter実装を開始する |
| AIS-1-HOLD | HOLD | 実装開始を継続保留する |

## AIS-1-A

推奨しない。

P2-002はmapping-complete blockerではないが、正本でadapter impl-gate residualとされている。

未決のtransport mechanicsを実装中に暗黙決定すると、Accepted済みW-1-Aの境界を迂回する。

## AIS-1-B

Agent recommendationである。

このOptionをAcceptedしても、直ちにコードを書き始める意味にはしない。

次のEntry Criteriaをすべて満たした時点でImplementation StartをGOにできる。

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

最初のimplementation sliceはAssessmentSnapshot adapter boundaryに限定する。

新しい業務Decision、SharePoint列変更、Issue一括更新、Deployを含めない。

## AIS-1-HOLD

安全な選択肢として維持する。

新しい一次情報またはtransport方式の選択が不足している場合はHOLDする。

## Human Decisionが必要な点

```text
AIS-1-A / AIS-1-B / AIS-1-HOLD
```

Agent recommendation:

```text
AIS-1-B
```

これはHuman Acceptanceではない。

## Explicit OUT

```text
このPacketだけによるImplementation Start
adapter code mutation
SharePoint / M365 / Entra mutation
Deploy / real data
P2-002の自動Close
特定client APIの発明
Ready / Mergeの自動進行
```

## Next gate

Human Acceptance of Decision-AS-ADAPTER-START-1。

AcceptanceまではImplementation Start = HOLDを維持する。
