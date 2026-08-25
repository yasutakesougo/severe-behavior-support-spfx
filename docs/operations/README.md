# Operational Readiness Runbooks

このディレクトリは、`OPS-READINESS-V1` の実装成果物をまとめる入口である。

目的は、特定の開発担当者に依存せず、法人として通常運用、変更、停止、復旧、引継ぎを継続できる状態を確認できるようにすることである。

`OPS-READINESS-V1 PASS` は、本番導入、Release、Security Acceptance、Deploy、Production Binding、LIVE WRITEの承認を意味しない。

## 適用境界

このRunbook群は、次の操作を自動的に許可しない。

- Implementation scopeの拡張
- Ready
- Merge
- Deploy
- Production Binding
- LIVE WRITE
- SharePoint、Microsoft 365、Entraのmutation
- 権限変更
- schema変更

これらは、それぞれ必要なHuman Gateで別途判断する。

## Runbook一覧

| 状況 | 参照先 |
|---|---|
| 管理責任、担当、管理権の回復・移管を確認する | `ownership.md` |
| 平常時の確認と異常検知を行う | `normal-operations.md` |
| 制度改定やアプリ更新を扱う | `change-management.md` |
| 障害時に安全に停止し、代替運用へ移る | `incident-and-safe-stop.md` |
| 正常版への復旧やデータ復旧条件を確認する | `recovery-and-rollback.md` |
| 開発担当者なしで運用情報を確認できるか試す | `handover.md` |

## Evidence Basis

Operational ReadinessのEvidenceは、少なくとも次のBasisに結び付ける。

```text
repository:
mainSha:
applicationVersion:
deployedArtifactIdentity: N/A when not applicable
targetEnvironment:
runbookRevision:
evidenceObservedAt:
observerRole:
```

Handover Drillでは、追加で`handoverParticipantRole`を記録する。

Evidence Basisが一致しない過去のPASSは、現在のPASSとして扱わない。

次の変更が発生した場合は、影響を受けるEvidenceを再評価する。

- main SHA
- application version
- deployed artifact
- target environment
- relevant Runbook revision
- rollback authority
- operational ownership structure
- incident or recovery procedure

Evidenceが古い、混在している、再現できない場合は`STALE`として扱い、再照合が終わるまで`HOLD`とする。

## 判定規則

未確認事項はfail-closedで扱う。

```text
UNKNOWN -> HOLD
UNRESOLVED -> HOLD
STALE -> HOLD
```

Definitionで明示的に`NON-BLOCKING`と分類された事項だけは、PASSを妨げない。

`OPS-READINESS-V1 PASS`には、次のEvidenceが必要である。

```text
OR-1  Ownership / Secure Handover Evidence
OR-2  Normal Operations / Detection Evidence
OR-3  Change Management Evidence
OR-4  Incident / Safe Stop / Outage Reconciliation Evidence
OR-5  Application Recovery Evidence
OR-6  Handover Drill Evidence
```

ProductionでLIVE persistenceを有効化する前には、追加で次を必要とする。

```text
OR-5D Data Recovery Evidence
```

`OR-1`から`OR-6`までがPASSし、適用対象の`UNKNOWN`、`UNRESOLVED`、`STALE`が残っていない場合に限り、`OPS-READINESS-V1 PASS`を判定できる。

## 秘密情報の扱い

Runbook本文やEvidenceへ、password、MFA情報、token、cookie、secret、recovery codeを記録しない。

引継ぎでは、credentialそのものではなく、account ownership、role、recovery path、escalation routeを記録する。
