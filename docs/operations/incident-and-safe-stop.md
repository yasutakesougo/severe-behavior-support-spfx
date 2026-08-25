# Incident and Safe Stop Runbook

このRunbookは、障害や不明な状態を認識したときに、安全に停止し、代替運用へ移り、復旧後の記録整合までつなぐために使用する。

## Authoritative Source

Incident対応に使用する正式な参照先を記録する。

```text
incidentEscalationSource:
safeStopAuthoritySource:
fallbackProcedureSource:
fallbackRecordAuthoritySource:
restartDecisionSource:
```

参照先が未決定の場合は`UNRESOLVED`とする。

個人の記憶や開発担当者の口頭説明だけを停止・再開判断の根拠にしない。

## Incidentとして扱う例

- save failure
- save outcome unknown
- unexpected authorization failure
- expected page / application unavailable
- expected versionとobserved versionの不一致
- 意図しないwriteやデータ状態
- その他、正常性を確認できない状態

正常か異常か判断できない場合は`UNKNOWN`として扱い、継続利用を自動的に許可しない。

## Safe Stopの基本手順

1. 異常を認識した操作を止める。
2. 影響範囲を推測で確定しない。
3. `safeStopAuthoritySource`で停止権限または停止依頼経路を確認する。
4. 必要に応じて新規writeを停止する。
5. 停止権限がない場合は、正式な停止依頼経路へ連絡する。
6. `fallbackProcedureSource`で現場業務に必要な代替運用を確認する。
7. 復旧判断は停止判断とは別にし、`restartDecisionSource`で正式な判断経路を確認する。

## Acceptance Criteria

```text
OPS-AC13
異常を認識した場合の連絡経路がある。

OPS-AC14
必要に応じて新規writeを停止できる、または正式な停止依頼経路がある。

OPS-AC15
停止中に紙または既存運用へ戻す方法を確認できる。

OPS-AC16
停止判断と再開判断を区別する。

OPS-AC17
停止中も必要な支援情報へアクセスする代替運用が定義されている。
```

このRunbookは、具体的なProduction mutationを自動的に許可しない。

停止や再開に別Human Gateが必要な場合は、そのGateを使用する。

## Fallback record

代替運用で記録を残す場合は、`fallbackRecordAuthoritySource`から停止中の正本が何かを確認する。

復旧後に、アプリへ必ず再入力すると仮定しない。

backfillの要否は、重複や時刻意味を確認したうえで判断する。

## Outage Record Reconciliation

```text
OPS-INC-R1
停止中に使用するfallback recordの正本を定義できる。

OPS-INC-R2
復旧後にbackfillするか否かを判断できる。

OPS-INC-R3
backfillする場合、original event timeとbackfill timeを混同しない。

OPS-INC-R4
backfill actorを確認できる。

OPS-INC-R5
duplicate recordを防止または検出できる。

OPS-INC-R6
missing recordを確認できる。

OPS-INC-R7
reconciliation完了を確認する手順がある。
```

## N/A eligibility

`Write state: N/A`は、Evidence Basisで確認したoperating modeにwrite capabilityが存在しない場合だけ使用できる。

条件を確認できない`N/A`は`INVALID N/A`として`HOLD`とする。

## Incident Evidence

Evidenceには利用者の個人情報や秘密情報を含めない。

必要な事象、時刻、状態、判断経路だけを記録する。

```text
Evidence ID: OR-4
EvidenceBasisId:
Authoritative sources resolved: PASS / FAIL / UNKNOWN
Incident type:
ObservedAt:
Write state: ENABLED / STOPPED / UNKNOWN / N/A
Write-state N/A eligibility confirmed: PASS / FAIL / N/A
Fallback path confirmed: PASS / FAIL / UNKNOWN
Fallback record authority confirmed: PASS / FAIL / UNKNOWN
Backfill decision path confirmed: PASS / FAIL / UNKNOWN
Duplicate detection path confirmed: PASS / FAIL / UNKNOWN
Missing record check path confirmed: PASS / FAIL / UNKNOWN
Reconciliation completion path confirmed: PASS / FAIL / UNKNOWN
Restart decision kept separate: PASS / FAIL
Result: PASS / HOLD
Residual:
```

## PASS条件

Authoritative Sourceから異常時の連絡、安全停止、代替運用、復旧後の記録整合までを再現できる場合に`OR-4 PASS`とする。

必要な参照先が`UNRESOLVED`、fallback記録の正本や復旧後の扱いが決まっていない、または`INVALID N/A`がある場合は`HOLD`とする。
