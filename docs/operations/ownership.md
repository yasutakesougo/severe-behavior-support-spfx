# Ownership Runbook

このRunbookは、`OPS-READINESS-V1` のOwnershipとSecure Handoverを確認するために使用する。

## 確認対象

次の役割または正式な経路を確認する。

- 法人上のアプリ管理責任
- Microsoft 365 / SharePoint管理
- GitHub / source / release資産管理
- 障害時の連絡先
- 主担当者不在時の代替経路

個人名そのものを永続的なシステム要件にはしない。

必要なのは、担当者が変わっても役割と回復経路を確認できることである。

## Acceptance Criteria

```text
OPS-AC1
アプリの法人上の管理責任者または責任役割を確認できる。

OPS-AC2
Microsoft 365 / SharePoint側の管理担当または正式な問い合わせ経路を確認できる。

OPS-AC3
GitHub / source / release資産について、主担当者不在時にも法人が管理権を回復または移管できる正式な経路がある。

OPS-AC4
担当者不在時の代替連絡経路がある。
```

Secure Handoverでは、次を追加で満たす。

```text
OPS-OWN-SEC1
GitHub / source / release資産の管理権を法人として回復または移管できる。

OPS-OWN-SEC2
Microsoft 365 / SharePointの管理権を法人として維持または回復できる。

OPS-OWN-SEC3
個人password共有を引継ぎ方法として使用しない。

OPS-OWN-SEC4
個人MFA共有を引継ぎ方法として使用しない。

OPS-OWN-SEC5
token / cookie / secret / recovery codeをRunbookへ記録しない。

OPS-OWN-SEC6
account ownership / role / recovery path / escalation routeを管理する。
```

## Evidence記録

```text
Evidence ID: OR-1
Basis:
  mainSha:
  targetEnvironment:
  runbookRevision:
Observed roles:
  applicationOwnerRole:
  m365AdminPath:
  sourceReleaseCustodianPath:
  alternateEscalationPath:
Recovery / transfer path confirmed:
  GitHub/source/release: PASS / FAIL / UNKNOWN
  Microsoft 365/SharePoint: PASS / FAIL / UNKNOWN
Shared credential required:
  NO / YES
Secrets stored in Runbook:
  NO / YES
Result:
  PASS / HOLD
Residual:
```

## PASS条件

必要な役割と回復・移管経路を確認でき、共有credentialや秘密情報の記載を必要としない場合に`OR-1 PASS`とする。

個人アカウントに依存する資産が存在することだけでは自動FAILにしない。

ただし、主担当者不在時に法人が管理権を回復または移管できる経路を確認できない場合は`HOLD`とする。
