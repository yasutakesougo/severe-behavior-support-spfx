# Decision Packet — GOV-AUD-05 / DEC-012 post-retention deletion

この文書は、**GOV-AUD-05 / DEC-012 post-retention deletion**
（5年経過後の完全削除可否）の **Human Decision Packet** である。

Issue #19 所有の最小単位。
法定保存期間中の完全削除禁止（既 Accepted / Option A）の再 Decision ではない。
Agent が cleanup / purge / 自動削除を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-aud-05-dec-012-post-retention-deletion-selection.md`](./decision-gov-aud-05-dec-012-post-retention-deletion-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-05 / DEC-012 post-retention deletion
Kind: Human Decision packet（narrow）
Status: OPEN / Option NOT SELECTED
Owner: Issue #19
Selected via: Decision-GOV-AUD-05-POST-RETENTION-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: NOT SELECTED
Prior automatic complete deletion after retention: NOT ADOPTED（UNCHANGED）
Prior automatic physical deletion execution: NOT ADOPTED（UNCHANGED）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-05-dec-012-post-retention-deletion-selection.md`](./decision-gov-aud-05-dec-012-post-retention-deletion-selection.md)
- [`decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`](./decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- [`retention-complete-deletion-prohibition-contract.md`](./retention-complete-deletion-prohibition-contract.md)

## 1. Current canonical state

```text
During retention (5 years): complete deletion PROHIBITED（Accepted / LOCKED）
After retention automatic complete deletion: NOT ADOPTED（UNCHANGED）
Automatic physical deletion execution: NOT ADOPTED（UNCHANGED）
Post-retention deletion permissibility: UNDECIDED（本 packet）
SharePoint / cleanup job / Deploy: NO-GO
```

問い（本 packet）:

> 5年経過後に完全削除・物理削除を許可しますか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| GOV-AUD-05 / DEC-012 retention prohibition | 保存期間中の完全削除禁止 | **OUT**（Accepted） |
| **post-retention deletion** | 5年経過後の完全削除可否 | **本 packet** |
| 自動完全削除 after retention | 自動ジョブ | **OUT / NOT ADOPTED**（UNCHANGED） |
| cleanup / purge 実装 | code / tenant | OUT / FORBIDDEN |
| Implementation | schema / UI | HOLD |

```text
経過後可否 ≠ 保存期間中禁止の再 Decision
経過後可否を決める ≠ 自動削除ジョブの採択
経過後可否を決める ≠ cleanup 実装開始
```

## 3. Options（本 residual）

保存期間中禁止 Acceptance が分離した問いと、Issue #19 GOV-AUD-05 の扱い候補を
経過後可否向けに対応させた Options。Agent は Binding 推薦しない。

### Option A — 経過後の完全削除を許可する（法人規程と個別承認がある場合）

```text
Meaning:
  5年経過後の完全削除・物理削除 = 許可する
  実行は法人規程と個別承認がある場合に限る
Does NOT mean:
  自動完全削除 / 自動物理削除ジョブの採択
  cleanup 実装開始
```

### Option B — 経過後も完全削除を許可しない

```text
Meaning:
  5年経過後も完全削除・物理削除 = 許可しない
```

### Option C — 初期版では経過後完全削除の機能自体を持たない

```text
Meaning:
  初期版では経過後完全削除機能を持たない
  （可否の実行面を実装しない）
```

### Option D — その他（Human が明示）

```text
Requires:
  経過後削除の可否規則を Human が記入
Agent MUST NOT invent the rule
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  post-retention Option は未決のまま
  unit Selection は維持してよい
```

## 4. Explicit non-options

```text
Option の Agent 自動 Accepted
保存期間中禁止の再 Decision
自動完全削除 / 自動物理削除の復活採択（既 NOT ADOPTED）
cleanup / purge / schema / SharePoint / UI 発明
Implementation Start
FindingCode / A-5
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  post-retention deletion は MIXED / ORG_POLICY。
  自動削除は既に NOT ADOPTED。
  Agent は許可/不許可/機能なしを Binding 推薦値として確定しない。
```

Agent recommendation の欠如は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  5年経過後に完全削除・物理削除を許可しますか？

A. 許可する（法人規程と個別承認がある場合）
B. 許可しない
C. 初期版では経過後完全削除の機能自体を持たない
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: NOT SELECTED
```

## 7. After Decision

| Selected | Next |
|---|---|
| A–D | Option Acceptance → permissibility LOCKED。実装 / cleanup は別 GO |
| H | Option HOLD。unit Selection は維持可 |

維持:

```text
Retention prohibition: UNCHANGED
Automatic complete/physical deletion: NOT ADOPTED / UNCHANGED
Implementation Start: DO NOT START
cleanup / SharePoint / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-aud-05-dec-012-post-retention-deletion-selection.md`
- SELECT Acceptance: `decision-gov-aud-05-dec-012-post-retention-deletion-acceptance.md`
- Prior retention prohibition: `decision-gov-aud-05-dec-012-retention-delete-prohibition-acceptance.md`
- Issue #19 GOV-AUD-05（物理削除の扱い；本 residual は経過後可否に限定）
