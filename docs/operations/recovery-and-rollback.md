# Recovery and Rollback Runbook

このRunbookは、Application RecoveryとData Recoveryを分離して扱うために使用する。

アプリを以前の版へ戻すことと、保存済みデータを復旧することは同じ操作ではない。

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

必要な場合は、少なくともsource basis、artifact identity、hash、target environmentを同じEvidence Basisで照合する。

## Application Recovery手順

1. 現在の異常状態と影響範囲を確認する。
2. 現在のapplication versionとsource basisを確認する。
3. Last Known Good候補を確認する。
4. rollback artifact identityとhashを確認する。
5. 対象environmentを確認する。
6. 必要なHuman rollback / Deploy Gateを取得する。
7. 許可されたrollbackを実行する。
8. rollback後のversion、稼働状態、主要確認項目を再確認する。
9. Evidence Basisを更新する。

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

現在LIVE persistenceが適用されていない場合、Data Recoveryの実行Evidenceは`N/A`とできる。

ただし、Production BindingまたはLIVE WRITEを有効化する前には`OPS-REC-D1`から`OPS-REC-D5`までを解決し、`OR-5D PASS`を必要とする。

## Application Recovery Evidence

```text
Evidence ID: OR-5
Basis:
  mainSha:
  applicationVersion:
  deployedArtifactIdentity:
  targetEnvironment:
  runbookRevision:
Last Known Good:
  sourceBasis:
  applicationVersion:
  artifactIdentity:
  artifactHash:
Rollback target confirmed: PASS / FAIL / UNKNOWN
Human rollback/deploy gate required: YES
Post-rollback verification path confirmed: PASS / FAIL / UNKNOWN
Result: PASS / HOLD
Residual:
```

## Data Recovery Evidence

```text
Evidence ID: OR-5D
Applicability: REQUIRED / N/A
Basis:
  applicationVersion:
  targetEnvironment:
  runbookRevision:
Recovery mechanism identified: PASS / FAIL / UNKNOWN
Recoverable scope identified: PASS / FAIL / UNKNOWN
Integrity verification defined: PASS / FAIL / UNKNOWN
Missing/duplicate/partial check defined: PASS / FAIL / UNKNOWN
Authority/escalation path confirmed: PASS / FAIL / UNKNOWN
Result: PASS / HOLD / N/A
Residual:
```

## PASS条件

Application Recoveryについて、Last Known Good、artifact identity、対象environment、Human Gate、復旧後verificationを確認できる場合に`OR-5 PASS`とする。

LIVE persistenceをProductionで有効化する場合は、Data Recovery条件も確認できる場合に限り`OR-5D PASS`とする。

具体的な復旧値や仕組みが未決定の場合は、推定で埋めず`UNRESOLVED`として`HOLD`にする。
