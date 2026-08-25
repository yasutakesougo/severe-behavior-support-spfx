# Handover Runbook

このRunbookは、開発担当者の口頭説明なしで、法人内の別担当者が運用情報を確認できるかを検証するために使用する。

Handover Drillの目的は、文書の存在を確認することではない。

Runbookだけで必要な判断と正式な参照・連絡経路へ到達できることを確認する。

## Drill条件

```text
Human developer:
説明しない。

Participant:
開発に直接関わっていない職員または管理担当。

Provided:
このdocs/operations Runbook群のみ。
```

個人password、MFA、token、cookie、secret、recovery codeは渡さない。

必要な操作に正式な権限が必要な場合は、権限そのものではなく各Runbookの`Authoritative Source`から取得・escalation経路を確認する。

Runbook内の参照先が`UNRESOLVED`の場合は、開発担当者の口頭説明で補完せずDrillをFAILとする。

## Drill Task

Participantは、次を順番に確認する。

1. `normal-operations.md`から現在のapplication versionを確認する方法と正式な参照先を特定する。
2. `normal-operations.md`から現在のoperating modeを確認する方法と正式な参照先を特定する。
3. `incident-and-safe-stop.md`から障害発生時の最初の行動を確認する。
4. `incident-and-safe-stop.md`からwriteを安全に停止する方法、または正式な停止依頼経路を確認する。
5. `recovery-and-rollback.md`からLast Known Goodの正式な参照先を特定する。
6. `recovery-and-rollback.md`からApplication Recoveryと必要なHuman Gateの経路を確認する。
7. `ownership.md`から必要な担当役割とescalation経路を確認する。

LIVE persistenceをProductionで使用する場合は、Data Recoveryの正式な参照・判断経路も追加確認する。

## N/A eligibility

`dataRecoveryPath: N/A`は、Evidence Basisで現在のoperating modeにProduction LIVE persistenceが適用されていないことを確認できる場合だけ使用できる。

条件を確認できない`N/A`は`INVALID N/A`としてDrillをFAILとする。

## PASS条件

```text
PASS:
  developerAssistance = NONE
  AND authoritativeSourcesResolved = PASS
  AND all required tasks = PASS
  AND blockingAmbiguity = NONE
  AND invalidNA = NONE
```

次の場合はFAILとする。

- 開発担当者への口頭質問が必要だった。
- Runbookにない個人知識が必要だった。
- credential共有が必要だった。
- 必要なAuthoritative Sourceが`UNRESOLVED`だった。
- 次の行動を一意に判断できなかった。
- 必須TaskのいずれかがFAILまたはUNKNOWNだった。
- 適用条件を満たさない`N/A`が使われた。

## Handover Drill Evidence

```text
Evidence ID: OR-6
EvidenceBasisId:
Date:
Scenario:
ParticipantRole:
DeveloperAssistance: NONE / REQUIRED
AuthoritativeSourcesResolved: PASS / FAIL
Tasks:
  currentVersion: PASS / FAIL
  operatingMode: PASS / FAIL
  firstIncidentAction: PASS / FAIL
  safeStopPath: PASS / FAIL
  lastKnownGood: PASS / FAIL
  recoveryPath: PASS / FAIL
  escalationPath: PASS / FAIL
  dataRecoveryPath: PASS / FAIL / N/A
DataRecovery N/A eligibility confirmed: PASS / FAIL / N/A
BlockingAmbiguity: NONE / details
InvalidNA: NONE / details
SecretsRequired: NO / YES
Result: PASS / FAIL
Notes:
```

## Drill後の扱い

FAILは、Participantの責任として扱わない。

不足しているRunbook、Authoritative Source、所有権、復旧経路、用語、判断条件を修正対象として記録する。

Runbookを修正した場合は`runbookRevision`となるGit commit SHAが変わるため、修正箇所の影響を受けるEvidenceを再評価する。

Handover Drill PASSは、Production Ready、Deploy Authorized、Production Binding Authorized、LIVE WRITE Authorizedを意味しない。
