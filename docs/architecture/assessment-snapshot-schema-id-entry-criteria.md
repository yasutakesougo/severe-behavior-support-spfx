# AssessmentSnapshot Schema ID — Entry / 採番境界（read-only）

この文書は、ILB-1 **Twelfth residual SELECTED / C — Schema ID** について、
固有 Schema ID / 初回 schemaVersion 採番へ進む前の **Entry / 採番境界**を
read-only で整理する正本である。

```text
Kind: Entry / assignment-boundary record only
Status: READ-ONLY ORGANIZED / NOT ACCEPTED AS ID ASSIGNMENT
Selection: decision-ilb-1-twelfth-residual-decision-selection.md
Policy parent: assessment-snapshot-schema-dto-versioning.md（Entry #7）
DEC-1: contracts-v1.md
Schema ID concrete value: NOT ASSIGNED
schemaVersion concrete value: NOT ASSIGNED
Implementation Start: HOLD
SharePoint / DTO: DO NOT START
FindingCode / A-5: HOLD
application save Implementation Start: HOLD
Agent invention of Schema ID string: FORBIDDEN
```

## 1. 目的

```text
IN:
  Schema ID 採番に必要な前提・禁止・Entry を列挙する
OUT:
  具体 Schema ID 文字列の確定（要別 Human Acceptance）
  DTO / SharePoint 実装
  application save 実装
```

## 2. 固定前提（DONE）

| 前提 | 状態 |
|---|---|
| DEC-1 versioning 方針 | DONE（contracts-v1） |
| AS-EC-1 Entry #7（方針 = DEC-1；固有 ID 未採番で閉じた） | DONE |
| PR-J domain 完全契約（Schema ID フィールドなし） | DONE（PR #168） |
| SupportPlan Schema ID 先例 | DONE（触らない） |

## 3. Entry Criteria 表

| # | 条件 | 現状 |
|---|---|---|
| 1 | DEC-1 / Entry #7 versioning 方針が Accepted | **DONE** |
| 2 | Schema ID ≠ List名 ≠ TS 型名 が再確認されている | **DONE**（方針正本） |
| 3 | Twelfth residual で Schema ID 単位が SELECTED | **DONE** |
| 4 | 本採番境界（IN/OUT / 禁止）が正本化されている | **DONE（本文書）** |
| 5 | 具体 Schema ID 文字列の Human Acceptance | **HOLD / 未採択** |
| 6 | 初回 schemaVersion（SemVer）の Human Acceptance | **HOLD / 未採択** |
| 7 | DTO Version = Schema Version の適用宣言（採番後） | **HOLD** |
| 8 | 明示的 Human Implementation Start（型/DTO への載せる作業がある場合） | **HOLD** |

```text
Schema ID Assignment Entry: NOT MET
Reason: #5 / #6（および必要なら #7/#8）HOLD
本文書だけでは ID を採番しない
```

## 4. 採番境界

```text
MUST（採番するとき）:
  Human が具体 Schema ID 文字列を Acceptance する
  SemVer の初回 schemaVersion を Human が Acceptance する
  DTO Version = Schema Version
  SupportPlan Schema ID を変更しない

MUST NOT:
  Agent が単独で Schema ID を発明して LOCKED にする
  SharePoint List 名や `AssessmentSnapshot` 型名を Schema ID にする
  未採番のまま DTO / SharePoint 実装を開始する
  application save Implementation Start を本単位から導出する
```

## 5. 参考（先例・候補ではない）

SupportPlan（変更しない）:

```text
severe-behavior-support.support-plan.plan
severe-behavior-support.support-plan.plan-version
```

```text
上記は先例パターンの参照のみ。
AssessmentSnapshot 用文字列の提案・採択は Human Acceptance が必要。
本文書は候補を LOCKED しない。
```

## 6. application save との関係

```text
Application save（Eleventh / B）:
  Entry NOT MET / Implementation Start HOLD のまま
Schema ID（Twelfth / C）:
  application save の必須前提にはしない（application Entry #7 port とも独立）
SharePoint（D）:
  Schema ID 採番後でも別 residual / 別 GO
```

## 7. Next

```text
Schema ID Assignment Entry: NOT MET
Next Human steps（自動開始禁止）:
  1. Schema ID 文字列 + 初回 schemaVersion の Decision packet / Acceptance
  2（任意）. Implementation Start（契約面への反映が必要な場合）
Application save: HOLD
Remaining residuals: D → A
```
