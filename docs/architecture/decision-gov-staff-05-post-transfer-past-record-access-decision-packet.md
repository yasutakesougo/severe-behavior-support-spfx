# Decision Packet — GOV-STAFF-05 異動後の過去記録の閲覧範囲

この文書は、**GOV-STAFF-05**（異動後の過去記録の閲覧範囲）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-STAFF-01〜04 / 06 の再 Decision ではない。
Agent が ACL・SiteId マイグレーション・権限 UI を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-staff-05-post-transfer-past-record-access-selection.md`](./decision-gov-staff-05-post-transfer-past-record-access-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-STAFF-05
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED / Option C
Owner: Issue #19
Selected via: Decision-GOV-STAFF-05-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: C
  （記録時点の SiteId を維持し、異動先の閲覧は明示権限がある範囲だけ）
Option Acceptance: decision-gov-staff-05-post-transfer-past-record-access-option-c-acceptance.md
Issue #19 design recommendation（non-binding）: C（≠ Human Acceptance evidence）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-staff-05-post-transfer-past-record-access-selection.md`](./decision-gov-staff-05-post-transfer-past-record-access-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §A GOV-STAFF-05
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
GOV-STAFF-01〜03: Accepted / LOCKED（該当 Option）
GOV-STAFF-04 ledger storage: Accepted / LOCKED / Option C
GOV-STAFF-05 post-transfer past-record access: Accepted / LOCKED / Option C
  = 記録時点の SiteId を維持し、異動先の閲覧は明示権限がある範囲だけ
GOV-STAFF-06〜12: OPEN / OUT
SharePoint / M365 / Entra / Deploy: NO-GO
```

問い（本 packet）:

> 異動後の過去記録の閲覧範囲はどうしますか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-STAFF-01〜03 | 確定者 / Entra 削除 / 権限停止期限 | **OUT**（Accepted） |
| GOV-STAFF-04 | 利用者異動台帳の保存先 | **OUT**（Accepted） |
| **GOV-STAFF-05** | 異動後の過去記録の閲覧範囲 | **本 packet** |
| GOV-STAFF-06〜12 | 資格・研修 等 | **OUT** |
| ACL / SiteId 実装 | tenant / code | OUT / FORBIDDEN |
| Implementation | code / automation | HOLD |

```text
過去記録閲覧範囲 ≠ 台帳保存先（GOV-STAFF-04）
過去記録閲覧範囲 ≠ 権限停止期限（GOV-STAFF-03）
範囲を決める ≠ ACL / SiteId マイグレーション実装開始
記録時点 SiteId 維持 ≠ 異動先への常時閲覧許可
```

## 3. Options（Issue #19 原文）

### Option A — 異動元だけが過去記録を閲覧

```text
Meaning:
  異動後の過去記録閲覧 = 異動元だけ
```

### Option B — 異動先も過去記録を常時閲覧

```text
Meaning:
  異動後の過去記録閲覧 = 異動先も常時閲覧可
```

### Option C — 記録時点の SiteId を維持し、異動先の閲覧は明示権限がある範囲だけ

```text
Meaning:
  異動後の過去記録閲覧 =
    記録時点の SiteId を維持し、
    異動先の閲覧は明示権限がある範囲だけ

Does NOT mean:
  ACL / 権限付与 UI / SiteId マイグレーションの発明
  異動先への常時・包括閲覧
  GOV-STAFF-06〜12 を同時に決めた
```

### Option D — その他（Human が明示）

```text
Requires:
  閲覧範囲規則を Human が記入
Agent MUST NOT invent the access rule
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-STAFF-05 Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
Option tip C の自動 Accepted（Human Decision 前）
GOV-STAFF-06〜12 の同時採択
SharePoint / M365 / Entra mutation 実行
ACL・SiteId マイグレーション・権限 UI の発明
SharePoint / M365 / Deploy / real data
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-STAFF-05 は ORG_POLICY。
  Issue #19 の「設計上の推奨: C」は Binding ではない。
  Agent は SiteId 維持 + 明示権限を Binding 推薦値として確定しない。
```

Agent recommendation の欠如 / Issue 設計推奨は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  異動後の過去記録の閲覧範囲はどうしますか？

A. 異動元だけが過去記録を閲覧
B. 異動先も過去記録を常時閲覧
C. 記録時点の SiteId を維持し、異動先の閲覧は明示権限がある範囲だけ
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: C（Accepted / LOCKED）
```

## 7. After Decision

| Selected | Next |
|---|---|
| **C** | **Option Acceptance LOCKED（本 Decision）**。ACL / 実装は別 GO |
| A / B / D / H | NOT SELECTED |

維持:

```text
GOV-STAFF-01〜04: UNCHANGED
GOV-STAFF-06〜12: OUT / DO NOT START from this Decision alone
SharePoint / M365 / Entra mutation: NO-GO
Implementation Start: DO NOT START
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-staff-05-post-transfer-past-record-access-selection.md`
- SELECT Acceptance: `decision-gov-staff-05-post-transfer-past-record-access-acceptance.md`
- Option C Acceptance: `decision-gov-staff-05-post-transfer-past-record-access-option-c-acceptance.md`
- Issue #19 GOV-STAFF-05 source options A–D
