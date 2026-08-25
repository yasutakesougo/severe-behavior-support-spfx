# Handover Runbook

このRunbookは、開発担当者の口頭説明なしで、法人内の別担当者が運用情報を確認できるかを検証するために使用する。

Handover Drillの目的は、文書の存在を確認することではない。

Runbookだけで必要な判断と連絡経路へ到達できることを確認する。

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

必要な操作に正式な権限が必要な場合は、権限そのものではなく取得・escalation経路を確認する。

## Drill Task

Participantは、次を順番に確認する。

1. 現在のapplication versionを確認する方法。
2. 現在のoperating modeを確認する方法。
3. 障害発生時の最初の行動。
4. writeを安全に停止する方法、または正式な停止依頼経路。
5. Last Known Goodを特定する方法。
6. Application Recoveryの経路。
7. 必要な担当者へのescalation経路。

LIVE persistenceをProductionで使用する場合は、Data Recoveryの連絡・判断経路も追加確認する。

## PASS条件

```text
PASS:
  developerAssistance = NONE
  AND all required tasks = PASS
  AND blockingAmbiguity = NONE
```

次の場合はFAILとする。

- 開発担当者への口頭質問が必要だった。
- Runbookにない個人知識が必要だった。
- credential共有が必要だった。
- 次の行動を一意に判断できなかった。
- 必須TaskのいずれかがFAILまたはUNKNOWNだった。

## Handover Drill Evidence

```text
Evidence ID: OR-6
Evidence Basis:
  repository:
  mainSha:
  applicationVersion:
  targetEnvironment:
  runbookRevision:
Date:
Scenario:
ParticipantRole:
DeveloperAssistance: NONE / REQUIRED
Tasks:
  currentVersion: PASS / FAIL
  operatingMode: PASS / FAIL
  firstIncidentAction: PASS / FAIL
  safeStopPath: PASS / FAIL
  lastKnownGood: PASS / FAIL
  recoveryPath: PASS / FAIL
  escalationPath: PASS / FAIL
  dataRecoveryPath: PASS / FAIL / N/A
BlockingAmbiguity: NONE / details
SecretsRequired: NO / YES
Result: PASS / FAIL
Notes:
```

## Drill後の扱い

FAILは、Participantの責任として扱わない。

不足しているRunbook、所有権、復旧経路、用語、判断条件を修正対象として記録する。

Runbookを修正した場合は`runbookRevision`が変わるため、修正箇所の影響を受けるEvidenceを再評価する。

Handover Drill PASSは、Production Ready、Deploy Authorized、Production Binding Authorized、LIVE WRITE Authorizedを意味しない。
