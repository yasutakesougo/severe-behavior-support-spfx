# DEC-008 残面 — 提出・差戻しロール 未決定点抽出

この文書は、**DEC-008** のうち
**支援計画シートの提出ロール / 差戻しロール** について、
既存正本から **未決定点だけ** を抽出した調査結果である。

制度上の作成者の再決定ではない。
独立最終承認者の再導入ではない。
Human Acceptance ではない。
Implementation Start ではない。
Agent がロール名を発明しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit ID: DEC-008 / SUBMIT_RETURN_ROLES / OPEN-POINTS
Kind: open-points extraction / source inventory
Status: OPEN（Decision packet へ供給）
Selected via: next substantive unit E（2026-08-09）
main baseline: 42b251be83447d6e82090312ea2f18ed69968377
DEC-008 locked core:
  制度上の作成者 = 実践研修修了者（Accepted）
  独立した最終承認者 = NOT ADOPTED
SupportPlan status transition: role-free / UNCHANGED
Decision-OP-3: FINAL CONSISTENT
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

関連正本:

- [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)
- [`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md)
- [`decision-dec-008-authoring-center-acceptance.md`](./decision-dec-008-authoring-center-acceptance.md)
- [`decision-dec-008-final-approver-acceptance.md`](./decision-dec-008-final-approver-acceptance.md)
- [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- [`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)
- Decision packet: [`decision-dec-008-submit-return-roles-decision-packet.md`](./decision-dec-008-submit-return-roles-decision-packet.md)

## 1. すでに閉じているもの（再決定しない）

| 項目 | 状態 | 正本 |
|---|---|---|
| 制度上の作成者 | **Accepted** = 実践研修修了者 | authoring-center Acceptance |
| 独立した最終承認者 | **NOT ADOPTED** | final-approver Acceptance |
| サービス管理責任者=最終承認者 | **NOT ADOPTED** | DEC-008 Acceptance |
| SupportPlan 許可遷移 5 辺 | **Accepted**（role-free） | `support-plan-status-transition.md` / `5211039927` |
| Decision-OP-3 | **FINAL CONSISTENT** | OP-3 consistency |
| GOV-AUD-03 | **Accepted / Option E** | GOV-AUD-03 Acceptance |
| FindingCode / A-5 / Implementation | **HOLD** | backlog |

## 2. 遷移辺との対応（ロールは未決）

| 業務語 | 許可遷移 | ロール判定 |
|---|---|---|
| 提出（submit） | `Draft → PendingReview` | **未決（本 unit）** |
| 差戻し（return） | `PendingReview → Returned` | **未決（本 unit）** |
| 差戻し後の再編集 | `Returned → Draft` | ロール未決。提出/差戻しと混ぜない |
| 有効化 | `PendingReview → Active` | **OUT**（独立最終承認者 NOT ADOPTED を再導入しない） |

```text
support-plan-status-transition.md:
  ロール判定・承認者判定は OUT / UNCHANGED
  本 open-points は業務ロールの Human Decision 用であり、
  純関数へのロール埋め込みを開始しない
```

## 3. 未決定点（U1–U6）

| ID | 問い | 現状 |
|---|---|---|
| **U1** | 誰が提出できるか（`Draft → PendingReview`） | UNDECIDED |
| **U2** | 誰が差し戻せるか（`PendingReview → Returned`） | UNDECIDED |
| **U3** | 提出ロールと差戻しロールを同一視するか | UNDECIDED |
| **U4** | 制度上の作成者（実践研修修了者）との関係 | 自動同一視しない。Human が決める |
| **U5** | アプリに提出/差戻しロール検査を埋め込むか | UNDECIDED（候補に NOT ADOPTED / role-free 維持あり） |
| **U6** | `PendingReview → Active` の有効化ロール | **OUT**（本 unit 対象外） |

## 4. 明示的に混ぜないもの

```text
制度上の作成者の再決定
独立最終承認者の再導入
サービス管理責任者 = 最終承認者 の復活
DEC-009 再 Decision
GOV-AUD-03 再オープン
FindingCode / A-5
Implementation Start / 権限コード / SharePoint
日数・期限 invention
```

## 5. Next

```text
Decision packet: decision-dec-008-submit-return-roles-decision-packet.md
Human Decision 待ち
FindingCode / A-5 / Implementation: HOLD
```
