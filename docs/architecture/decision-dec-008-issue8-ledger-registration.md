# DEC-008 — Issue #8 台帳登録（正本化）

この文書は、Issue #8 への **DEC-008 Accepted 台帳登録**のための
登録文面と正本化手順である。

本環境の GitHub Issues API は Issue #8 に対して **403** のため、
Agent は Issue #8 へ直接コメントできない。
Human が Issue #8 に下記文面を投稿する。

```text
repository: yasutakesougo/severe-behavior-support-spfx
DEC: DEC-008
Title: 支援計画シート等の制度上の作成者 / 独立最終承認者
Status: Accepted（docs）/ Issue #8 ledger registration: READY_FOR_HUMAN_POST
PR: #143（docs Acceptance）
Implementation Start: HOLD
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Next substantive unit: NOT SELECTED
```

関連正本:

- [`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md)
- [`decision-dec-008-authoring-center-acceptance.md`](./decision-dec-008-authoring-center-acceptance.md)
- [`decision-dec-008-final-approver-acceptance.md`](./decision-dec-008-final-approver-acceptance.md)
- [`decision-dec-008-canonicalization-consistency-check.md`](./decision-dec-008-canonicalization-consistency-check.md)

## 1. Issue #8 に投稿する文面（そのまま貼る）

```text
DEC-008 — 支援計画シート等の制度上の作成者 / 独立最終承認者
Status: Accepted

制度上の作成者:
ACCEPTED
強度行動障害支援者養成研修（実践研修）修了者
= 支援計画シート等の制度上の作成者

独立した最終承認者:
NOT ADOPTED
→ アプリ独自の最終承認者を設定しない

サービス管理責任者を最終承認者とする案:
NOT ADOPTED / 不採用

境界:
「制度上の作成者」と「独立した最終承認者」を分離する
制度資料が支持しない承認フローを追加しない

FindingCode:
HOLD / DO NOT CREATE

A-5:
HOLD

Implementation Start:
HOLD

Next substantive unit:
NOT SELECTED

Evidence (repository mirror):
- decision-dec-008-acceptance.md
- decision-dec-008-authoring-center-acceptance.md
- decision-dec-008-final-approver-acceptance.md
- PR #143
```

## 2. 登録後に記録すること

```text
Issue #8 DEC-008 ledger: POSTED
comment ID: （Human が記入）
Canonical ownership: Issue #8 / DEC-008
repository docs: mirror
```

## 3. Gate

```text
DEC-008 docs Acceptance: LOCKED（PR #143）
Issue #8 ledger registration: READY_FOR_HUMAN_POST
Consistency check: decision-dec-008-canonicalization-consistency-check.md
Next Human:
  1) Merge PR #143（未マージなら）
  2) Post the payload to Issue #8
  3) Return comment ID
  4) Then consistency check final PASS
  5) Then choose next substantive unit（別 Decision）
FindingCode / A-5 / Implementation: HOLD
```
