# Recovery and Rollback Runbook

このRunbookは、Application RecoveryとData Recoveryを分離して扱うために使用する。

アプリを以前の版へ戻すことと、保存済みデータを復旧することは同じ操作ではない。

## Authoritative Source

Recoveryに使用する正式な参照先を記録する。

```text
currentDeploymentSource:
lastKnownGoodSource:
rollbackArtifactRegistrySource:
rollbackGateSource:
postRollbackVerificationSource:
dataRecoveryMechanismSource:
dataRecoveryAuthoritySource:
```

参照先が未決定の場合は`UNRESOLVED`とする。

Version名、ファイル名、個人の記憶、開発担当者の口頭説明だけをRecovery authorityにしない。

## A. Application Recovery

Application Recoveryでは、Last Known Goodとrollback対象を一意に特定する。

```text
OPS-REC-A1
Last Known Good application versionを特定できる。

OPS-REC-A2
Last Known Good source basisを特定できる。

OPS-REC-A3
rollback artifactを一意に識別できる。

OPS-REC-A4
artifact identityに必要なhash等を確認できる。

OPS-REC-A5
rollback対象environmentを確認できる。

OPS-REC-A6
rollback後のverification手順がある。

OPS-REC-A7
rollback実行には必要なHuman GOを要求する。
```

Version名やファイル名だけでrollback authorityを確定しない。

必要な場合は、source basis、artifact identity、hash、target environmentを同じEvidence Basisで照合する。

## Application Recovery手順

1. 現在の異常状態と影響範囲を確認する。
2. `currentDeploymentSource`で現在のapplication versionとsource basisを確認する。
3. `lastKnownGoodSource`でLast Known Good候補を確認する。
4. `rollbackArtifactRegistrySource`でrollback artifact identityとhashを確認する。
5. Evidence Basisのtarget environmentとrollback対象を照合する。
6. `rollbackGateSource`で必要なHuman rollback / Deploy Gateを確認する。
7. 明示されたHuman GOを取得した場合だけ、許可されたrollbackを実行する。
8. `postRollbackVerificationSource`に従ってrollback後のversion、稼働状態、主要確認項目を再確認する。
9. 変更後の状態に対して新しいEvidence Basisを作成する。

このRunbook自体は、rollbackやDeployを許可しない。

## B. Data Recovery

LIVE persistenceをProductionで使用する場合は、Application Recoveryとは別にData Recovery条件を満たす。

```text
OPS-REC-D1
利用可能なdata recovery mechanismを特定できる。

OPS-REC-D2
復旧可能なdata scopeを確認できる。

OPS-REC-D3
復旧後のintegrity確認方法がある。

OPS-REC-D4
missing / duplicate / partial recordを確認する方法がある。

OPS-REC-D5
data recoveryを実施できるauthorityとescalation経路を確認できる。
```

`dataRecoveryMechanismSource`と`dataRecoveryAuthoritySource`から、機構と権限経路を確認する。

具体的な復旧操作は、このRunbookだけでは許可しない。

## N/A eligibility

`OR-5D`を`N/A`にできるのは、Evidence Basisで確認した現在のoperating modeにProduction LIVE persistenceが適用されていない場合だけである。

この条件を確認できない`N/A`は`INVALID N/A`として`HOLD`とする。

Production BindingまたはLIVE WRITEを有効化する前には、`OPS-REC-D1`から`OPS-REC-D5`までを解決し、`OR-5D PASS`を必要とする。

## Application Recovery Evidence

```text
Evidence ID: OR-5
EvidenceBasisId:
Authoritative sources resolved: PASS / FAIL / UNKNOWN
Last Known Good:
  sourceBasis:
  applicationVersion:
  artifactIdentity:
  artifactHash:
Rollback target confirmed: PASS / FAIL / UNKNOWN
Human rollback/deploy gate required: YES
Rollback gate path confirmed: PASS / FAIL / UNKNOWN
Post-rollback verification path confirmed: PASS / FAIL / UNKNOWN
Result: PASS / HOLD
Residual:
```

## Data Recovery Evidence

```text
Evidence ID: OR-5D
EvidenceBasisId:
Applicability: REQUIRED / N/A
N/A eligibility confirmed: PASS / FAIL / N/A
Authoritative sources resolved: PASS / FAIL / UNKNOWN / N/A
Recovery mechanism identified: PASS / FAIL / UNKNOWN / N/A
Recoverable scope identified: PASS / FAIL / UNKNOWN / N/A
Integrity verification defined: PASS / FAIL / UNKNOWN / N/A
Missing/duplicate/partial check defined: PASS / FAIL / UNKNOWN / N/A
Authority/escalation path confirmed: PASS / FAIL / UNKNOWN / N/A
Result: PASS / HOLD / N/A
Residual:
```

## PASS条件

Application Recoveryについて、Authoritative SourceからLast Known Good、artifact identity、対象environment、Human Gate、復旧後verificationを確認できる場合に`OR-5 PASS`とする。

LIVE persistenceをProductionで有効化する場合は、Data Recovery条件もAuthoritative Sourceから確認できる場合に限り`OR-5D PASS`とする。

必要な参照先や具体的な復旧値・仕組みが未決定の場合は、推定で埋めず`UNRESOLVED`として`HOLD`にする。
