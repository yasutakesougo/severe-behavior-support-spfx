# GOV-AUD-04 — 論理削除を許可するロール 未決定点抽出

この文書は、**GOV-AUD-04**（論理削除を許可するロール）について、
既存正本から **未決定点だけ** を抽出した調査結果である。

GOV-AUD-05（物理削除方針）の採択ではない。
Human Acceptance ではない。
Implementation Start ではない。
Agent がロール名を発明しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit ID: GOV-AUD-04 / OPEN-POINTS
Kind: open-points extraction / source inventory
Status: CONSUMED（Decision Accepted / Option E）
Owner: Issue #19
Selected via: next substantive unit B（2026-08-09）
main / baseline: ce05cd0d355c108a63e17bce5af0538af779246e（PR #147 MERGED）
GOV-AUD-03: Accepted / Option E（application 対象外）
GOV-AUD-04: Accepted / LOCKED / Option E（application 対象外）
DEC-008 submit/return: FINAL CONSISTENT / Option C
Acceptance: decision-gov-aud-04-logical-delete-role-acceptance.md
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

関連正本:

- [`finding-audit-ownership.md`](./finding-audit-ownership.md)（GOV-AUD-04 行）
- [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md)
- [`decision-gov-aud-03-snapshot-correction-approver-acceptance.md`](./decision-gov-aud-03-snapshot-correction-approver-acceptance.md)
- [`handoff-transition-role-policy.md`](./handoff-transition-role-policy.md)（GOV-AUD-02 参考。同一視しない）
- [`decision-aud-ret-1-auditlog-retention.md`](./decision-aud-ret-1-auditlog-retention.md)
- Decision packet: [`decision-gov-aud-04-logical-delete-role-decision-packet.md`](./decision-gov-aud-04-logical-delete-role-decision-packet.md)

## 1. すでに閉じているもの（再決定しない）

| 項目 | 状態 | 正本 |
|---|---|---|
| GOV-AUD-02 Handoff roles | **Accepted** | handoff-transition-role-policy |
| GOV-AUD-03 Snapshot 訂正承認者 | **Accepted / Option E**（application 対象外） | GOV-AUD-03 Acceptance |
| DEC-008 提出・差戻し | **NOT ADOPTED**（app 非埋め込み） | DEC-008 submit/return Acceptance |
| DEC-008 独立最終承認者 | **NOT ADOPTED** | DEC-008 Acceptance |
| AUD-RET-1 保存期間 | **Accepted**（5年等）。物理削除トリガにしない | decision-aud-ret-1 |
| FindingCode / A-5 / Implementation | **HOLD** | backlog |

## 2. 所有表上の定義

[`finding-audit-ownership.md`](./finding-audit-ownership.md):

| Decision | 内容 | 正本 |
|---|---|---|
| `GOV-AUD-04` | 論理削除を許可するロール | Issue #19 |
| `GOV-AUD-05` | 物理削除方針 | Issue #19（**本 unit OUT**） |
| `DEC-012` | 論理削除データの完全削除方針 | Issue #8（**混ぜない**） |

```text
正式回答前に、具体ロール、保存期間、物理削除手順をコードへ埋め込まない。
```

## 3. 未決定点（U1–U6）

| ID | 問い | 現状 |
|---|---|---|
| **U1** | 論理削除の対象エンティティ | Binding しない（ロール自体を app に埋め込まない） |
| **U2** | 誰が論理削除を許可されるか（ロール） | **NOT ADOPTED / NOT DEFINED** |
| **U3** | 論理削除を application contract に埋め込むか / 対象外とするか | **対象外 / Option E** |
| **U4** | GOV-AUD-02（PLANNER / SERVICE_MANAGER）との関係 | Binding しない |
| **U5** | GOV-AUD-03 Option E との関係 | 別 Decision。自動流用しない |
| **U6** | GOV-AUD-05 / DEC-012（物理・完全削除） | **OUT**（本 unit で決めない） |

## 4. 明示的に混ぜないもの

```text
GOV-AUD-05 物理削除方針
DEC-012 完全削除方針
GOV-AUD-03 の再オープン
DEC-008 ロールの再決定
FindingCode / A-5
Implementation Start
SharePoint / Entra / Deploy / real data
日数・期限 invention
```

## 5. Next

```text
Acceptance: decision-gov-aud-04-logical-delete-role-acceptance.md（LOCKED / Option E）
Consistency: FINAL CONSISTENT（PR #149 / cb14c13…）
GOV-AUD-05: DO NOT START
FindingCode / A-5 / Implementation: HOLD
Next substantive unit: NOT SELECTED
```
