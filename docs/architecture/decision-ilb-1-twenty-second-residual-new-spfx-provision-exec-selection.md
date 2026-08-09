# Decision-ILB-1 — twenty-second residual selection

```text
Status: SELECTED / OPEN
Substantive unit: Decision-AS-NEW-TARGET-PROVISION-EXEC-1
Kind: Human Decision packet only
Implementation Start: HOLD
Tenant mutation: NO-GO until separate Human Acceptance
```

## Selection

PR #185 merge 後の単一 residual unit として、**新 SPFx deployment target の Site / List provisioning execution authorization** を選定する。

この selection は Human Acceptance、tenant mutation、Site/List 作成、Implementation Start のいずれでもない。

## Locked basis（再 Decision しない）

- Decision-AS-TARGET-REUSE-1 = B / existing `/sites/welfare` は REFERENCE ONLY
- Decision-AS-NEW-TARGET-PROVISION-1 = ST-1 + LT-1 + NM-1 + EX-1
- Decision-AS-NEW-TARGET-NAMES-1 = SU-1 + LN-1 + IN-1 + XB-1
- intended Site/List strings = HUMAN-PROVIDED / INTENDED / NOT CREATED / NOT CONFIRMED
- Internal Column Names = OPEN / post-creation CN-1

## Boundary

本 unit で判断するのは **Site + List の実作成 authorization のみ**。

本 unit では custom column creation、Internal Name 固定、SharePoint implementation、Schema/DTO code、Deploy、real data、FindingCode/A-5、post-retention deletion、Implementation Start を扱わない。

Compare packet:
[`decision-assessment-snapshot-new-target-provision-exec-packet.md`](./decision-assessment-snapshot-new-target-provision-exec-packet.md)
