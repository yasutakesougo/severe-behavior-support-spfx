# DEC-008 — Human Acceptance（制度上の作成者 / 独立最終承認者）

この文書は、**DEC-008** 全体についての
**Human Acceptance 要約正本** である。

詳細正本:

- 制度上の作成者:
  [`decision-dec-008-authoring-center-acceptance.md`](./decision-dec-008-authoring-center-acceptance.md)
- 独立した最終承認者:
  [`decision-dec-008-final-approver-acceptance.md`](./decision-dec-008-final-approver-acceptance.md)
- 分離 framing:
  [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)
- Issue #8 台帳登録 prep:
  [`decision-dec-008-issue8-ledger-registration.md`](./decision-dec-008-issue8-ledger-registration.md)
- 正本化・整合確認:
  [`decision-dec-008-canonicalization-consistency-check.md`](./decision-dec-008-canonicalization-consistency-check.md)
- 提出・差戻しロール Acceptance（Option C）:
  [`decision-dec-008-submit-return-roles-acceptance.md`](./decision-dec-008-submit-return-roles-acceptance.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008
Status: Accepted / LOCKED
Canonical ownership: Issue #8 / DEC-008
Human Acceptance: Explicit Human freeze on 2026-08-09
  + Explicit Human Option C on submit/return roles on 2026-08-09
LOCKED:

DEC-008
制度上の作成者:
  ACCEPTED
  強度行動障害支援者養成研修（実践研修）修了者
  = 支援計画シート等の制度上の作成者
独立した最終承認者:
  NOT ADOPTED
  → アプリ独自の最終承認者を設定しない
サービス管理責任者を最終承認者とする案:
  NOT ADOPTED / 不採用
提出ロール:
  application contract に固定しない（Option C）
差戻しロール:
  application contract に固定しない（Option C）
FindingCode:
  HOLD
A-5:
  HOLD
Implementation Start:
  HOLD
Next substantive unit:
  NOT SELECTED

Implementation auto-start: FORBIDDEN
```

## Human Acceptance（固定結論）

```text
DEC-008: Accepted / LOCKED

制度上の作成者:
  ACCEPTED
  強度行動障害支援者養成研修（実践研修）修了者
  = 支援計画シート等の制度上の作成者

独立した最終承認者:
  NOT ADOPTED
  → アプリ独自の最終承認者を設定しない

サービス管理責任者を最終承認者とする案:
  NOT ADOPTED / 不採用

提出ロール:
  application contract に固定しない（Option C）

差戻しロール:
  application contract に固定しない（Option C）
```

## 分離境界（維持）

```text
MAINTAIN:
  「制度上の作成者」と「独立した最終承認者」を分離する
  制度資料が支持しない承認フローを追加しない
  提出・差戻しを最終承認の別名として再導入しない

MUST NOT invent:
  アプリ独自の最終承認フロー
  サービス管理責任者 = 最終承認者 としての実装
  提出/差戻しロール Binding（本 scope では NOT ADOPTED）
  FindingCode values
  Implementation / 権限コード
  SharePoint / Deploy
```

## Next

```text
Issue #8 DEC-008 core: POSTED / comment 5229571943
Submit/return residual: Accepted / Option C
Consistency (submit/return): DOCS CONSISTENT
Independent Review: PASS（PR #147 / HEAD d1b5d544… / P0=0 / P1=0 / P2=0）
Path: Human Merge Decision（PR #147）
Next substantive unit: NOT SELECTED（Merge 後に Human が新たに選ぶ）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```
