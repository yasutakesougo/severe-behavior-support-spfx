# Decision Packet — DEC-003 点数根拠の登録・最終確認ロール

この文書は、**DEC-003 org roles**（点数根拠の登録・転記と点数状態の最終確認・有効化）の
**Human Decision Packet** である。

Issue #8 ledger / Issue #19 residual の最小単位。
DEC-007（算定不能対応ロール）ではない。
DEC-008（支援計画作成者・ライフサイクル）ではない。
GOV-AUD-03（Snapshot 訂正）ではない。
DEC-006（reason code catalog）ではない。
Agent が実装権限・画面・tenant mutation を発明しない。
Implementation Start ではない。

Selection:
[`decision-dec-003-org-roles-selection.md`](./decision-dec-003-org-roles-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-003（org-role part）
Kind: Human Decision packet（narrow）
Status: Accepted / LOCKED
  Registration / transcription = PLANNER
  Final confirmation / activation = SERVICE_MANAGER
Owner: Issue #8 / Issue #19
Selected via: Decision-DEC-003-ORG-ROLE-SELECTION-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected:
  PLANNER / SERVICE_MANAGER
Option Acceptance: decision-dec-003-org-roles-acceptance.md
Issue #8 prior proposal（non-binding）: PLANNER register / SERVICE_MANAGER confirm
  （≠ Human Acceptance evidence until this packet + Acceptance）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-dec-003-org-roles-selection.md`](./decision-dec-003-org-roles-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #8 DEC-003
- Issue #19 residual DEC ACTIVE: DEC-003 org roles

## 1. Current canonical state

```text
DEC-003 technical / evidence boundary: Accepted / UNCHANGED
DEC-003 org roles: Accepted / LOCKED
  登録・転記 = PLANNER
  最終確認・有効化 = SERVICE_MANAGER
DEC-008: Accepted / LOCKED / UNCHANGED
GOV-AUD-03: Accepted / LOCKED / Option E / UNCHANGED
DEC-007: OPEN / OUT
DEC-006: OPEN / OUT（catalog = AS-EC-1 Entry #6 HOLD）
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> 公式点数根拠の登録・転記と、点数状態の最終確認・有効化は、既存 Role の誰か？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| **DEC-003 org roles** | 点数根拠の登録・転記 / 最終確認・有効化 | **本 packet** |
| DEC-003 technical | 公式点数の制度境界 | **OUT**（Accepted / UNCHANGED） |
| DEC-007 | 算定不能の起票 / 確認 / エスカレーション | **OUT** |
| DEC-008 | 支援計画作成者・独立最終承認・計画ライフサイクル | **OUT** |
| GOV-AUD-03 | Snapshot 訂正承認者 | **OUT** |
| DEC-006 | 対象外 reason code catalog | **OUT** |
| SITE_ADMIN / ORG_ADMIN | 本 unit への追加 | **OUT** |
| Implementation | code / tenant mutation | HOLD |

```text
点数根拠の最終確認 ≠ 支援計画の作成・有効化（DEC-008）
点数状態の有効化 ≠ Snapshot 訂正承認（GOV-AUD-03）
点数根拠の最終確認 ≠ 算定不能の最終確認（DEC-007）
ロールを決める ≠ 実装権限の付与
ロールを決める ≠ SITE_ADMIN / ORG_ADMIN を 003 の書き込みパスへ追加
```

## 3. Selected pair（Human）

Human は Issue #8 の Proposed 案を採択した。Agent 推薦は Binding ではない。

### Registration / transcription — PLANNER

```text
PLANNER:
  点数根拠情報の登録・転記を担当する
```

### Final confirmation / activation — SERVICE_MANAGER

```text
SERVICE_MANAGER:
  登録された点数根拠を最終確認する
  点数状態を有効化する
```

本 packet で採択しない:

```text
SITE_ADMIN を DEC-003 の登録・確認パスへ追加しない
ORG_ADMIN を DEC-003 の登録・確認パスへ追加しない
  （ORG_ADMIN の集計・監査は technical/ledger の既存記述。本 org-role pair の書き込みパスではない）
新 Role の発明
presentationRole=PLANNER を application PLANNER と同一視
```

## 4. Meaning boundary

```text
IN MEANING:
  公式点数根拠の登録・転記
  登録済み根拠の最終確認
  点数状態の有効化

OUT MEANING:
  支援計画シート等の制度上の作成（実践研修修了者 / DEC-008）
  支援計画の独立最終承認（DEC-008 = NOT ADOPTED）
  計画・手順 → 記録 → 観察 → 見直し のライフサイクル
  AssessmentSnapshot 訂正の承認（GOV-AUD-03 Option E）
  算定不能時の起票・解消確認・エスカレーション（DEC-007）
  NOT_APPLICABLE reason catalog（DEC-006 / Entry #6 HOLD）
```

## 5. DEC-007 への影響（Binding しない）

```text
DEC-003 LOCK は DEC-007 を Accepted にしない。
DEC-007 は 003 の SERVICE_MANAGER 意味を再利用しない。
対象業務が異なることを明示して、別 GO で conflict check する。

003 SERVICE_MANAGER = 点数根拠の最終確認 / 点数状態の有効化
007 の最終確認（Proposed）= 算定不能の解消確認
SITE_ADMIN は 003 に追加していない。007 の起票候補として残るが、本 packet では決めない。
```

## 6. HOLD

```text
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
UI / workflow / 権限実装: HOLD
SharePoint / M365 / Entra / Deploy / LIVE WRITE: NO-GO
DEC-007 Decision: NOT SELECTED
DEC-006 ledger sync: NOT SELECTED
#8 / #19 CURRENT STATUS reconciliation: separate GO
```
