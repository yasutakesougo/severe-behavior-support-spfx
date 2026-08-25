# Change Management Runbook

このRunbookは、制度改定、仕様変更、アプリ更新を、現在のHuman Gateを維持したまま扱うために使用する。

変更が必要という判断と、変更を実装・Releaseする権限は分けて扱う。

## 対象となる変更

- 制度改定
- 支援業務ルールの変更
- application behaviorの変更
- dependencyやplatform変更
- security上の修正
- Runbookや運用責任構造の変更

## Acceptance Criteria

```text
OPS-AC9
制度改定情報を確認する担当または正式な経路がある。

OPS-AC10
制度変更がアプリへ影響するかを判断する手順がある。

OPS-AC11
変更前にDefinition / Implementation / Test / Reviewを行う経路がある。

OPS-AC12
本番反映前にHumanが判断するGateが維持される。
```

## 標準変更フロー

```text
Change notice
  -> source / authority確認
  -> affected area特定
  -> change required / not required判断
  -> exact-scope Definition
  -> Human Implementation Start GO
  -> implementation
  -> tests / verification
  -> independent review when required
  -> Human Ready GO
  -> Human Merge GO
  -> post-merge reconciliation
  -> separate Release / Deploy gate
```

`GO`は、明示されたGateだけに適用する。

前の工程のGOを、次の工程へ拡張解釈しない。

## 制度改定時の記録

制度改定を扱う場合は、少なくとも次を記録する。

```text
changeSource:
observedAt:
effectiveDate:
affectedDomain:
affectedFilesOrContracts:
changeRequired: YES / NO / UNKNOWN
reason:
nextGate:
```

制度上の根拠と、法人独自ルールを混同しない。

根拠が確認できない内容を「制度上必須」として実装しない。

## Evidence記録

```text
Evidence ID: OR-3
Basis:
  mainSha:
  runbookRevision:
Change intake path confirmed: PASS / FAIL / UNKNOWN
Impact assessment path confirmed: PASS / FAIL / UNKNOWN
Definition gate preserved: PASS / FAIL
Implementation Start gate preserved: PASS / FAIL
Independent review rule available: PASS / FAIL
Ready / Merge separation preserved: PASS / FAIL
Release / Deploy separation preserved: PASS / FAIL
Result: PASS / HOLD
Residual:
```

## PASS条件

変更の発見からRelease判断までの経路を、各Human Gateを飛ばさず説明・再現できる場合に`OR-3 PASS`とする。

変更が必要か判断できない場合は`UNKNOWN`として扱い、推定で実装へ進めない。
