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

## Authority Sourceの扱い

Runbookは「何を確認するか」だけでなく、「どの正式な情報源または連絡経路で確認するか」を記録する。

各Runbookの`Authoritative Source`欄には、法人が管理できる文書、管理画面、台帳、役割、問い合わせ経路など、再確認可能な参照先を記録する。

個人の記憶、口頭説明だけの経路、共有password、共有MFA、token、cookie、secret、recovery codeはAuthoritative Sourceとして認めない。

正式な参照先が未決定の場合は、推定で埋めず`UNRESOLVED`とする。

`UNRESOLVED`のAuthoritative Sourceが適用対象に残る場合は`HOLD`とする。

## 共通Evidence Basis

Operational ReadinessのEvidenceは、各EvidenceにBasis項目を重複して持たせず、1つの共通`OPS-EVIDENCE-BASIS-ID`へ結び付ける。

共通Basisは少なくとも次を持つ。

```text
OPS-EVIDENCE-BASIS-ID:
repository:
mainSha:
applicationVersion:
deployedArtifactIdentity: N/A only when deployment evidence is not applicable
targetEnvironment:
runbookRevision:
evidenceObservedAt:
observerRole:
```

Handover Drillでは、追加で`handoverParticipantRole`を記録する。

各`OR-*` Evidenceには、必ず次を記録する。

```text
EvidenceBasisId: <OPS-EVIDENCE-BASIS-ID>
```

存在しないBasis ID、複数のBasisを混在させたEvidence、必要項目が欠けたBasisは無効であり`HOLD`とする。

### runbookRevisionの正本

`runbookRevision`は、レビュー対象となる`docs/operations/`一式を含むGit commit SHAとする。

手入力の版番号、日付、ファイル名だけを`runbookRevision`の正本にはしない。

Runbook修正後はGit commit SHAが変わるため、影響を受けるEvidenceを再評価する。

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

## N/Aの使用条件

`N/A`は、各Runbookで適用除外条件が明示され、その条件をEvidenceで確認できる場合だけ使用できる。

適用除外条件が定義されていない項目を`N/A`にしてはならない。

適用除外条件を確認できない`N/A`は`INVALID N/A`として`HOLD`とする。

```text
UNKNOWN -> HOLD
UNRESOLVED -> HOLD
STALE -> HOLD
INVALID N/A -> HOLD
```

Definitionで明示的に`NON-BLOCKING`と分類された事項だけは、PASSを妨げない。

## OPS-READINESS-V1の判定

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

`OR-1`から`OR-6`までがPASSし、適用対象の`UNKNOWN`、`UNRESOLVED`、`STALE`、`INVALID N/A`が残っていない場合に限り、`OPS-READINESS-V1 PASS`を判定できる。

## 秘密情報の扱い

Runbook本文やEvidenceへ、password、MFA情報、token、cookie、secret、recovery codeを記録しない。

引継ぎでは、credentialそのものではなく、account ownership、role、recovery path、escalation routeを記録する。
