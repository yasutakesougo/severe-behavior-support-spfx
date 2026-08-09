# A-4 — Issue #8 Finding catalog DEC number review

この文書は、Finding business catalog DEC の **A-4（Issue #8 DEC 番号）** について、
既存採番の確認結果と Human 選択待ちを記録する。

Agent が DEC 番号を採番・確定しない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision surface: A-4 Issue #8 FindingCode / Finding catalog DEC number
Status: SELECTED / A-4 = DEC-019
Depends on:
  Issue #8 DEC body Accepted / EMPTY
  （decision-findingcode-issue8-dec-body-acceptance.md）
A-1: NONE
A-2: NOT APPLICABLE
A-3: NOT APPLICABLE
A-4: DEC-019（Human Selected A / 2026-08-09）
A-5: OUT
DEC number invention: FORBIDDEN（本選択は Human）
Implementation Start: HOLD
```

Live gate は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

関連:

- [`decision-findingcode-issue8-dec-body-acceptance.md`](./decision-findingcode-issue8-dec-body-acceptance.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. 確認できた採番情報（repository mirror）

Issue #8 本体 API は本環境から **403 / NOT_FOUND** のため、
ライブ台帳の直接読取はできなかった。
以下は repository docs の mirror である。

```text
DEC正本台帳（docs mirror）:
  DEC-001〜DEC-018

確認済みの末尾:
  DEC-018 = FindingSeverity NOT ADOPTED
  Canonical: Issue #8 / DEC-018
  comment: 5225426738
  Numbering basis then:
    ledger was DEC-001〜DEC-017
    DEC-018 was absent before assignment

FindingCode catalog DEC:
  FC-1 Accepted / Option B = Issue #8 に新しい DEC を追加
  番号: いまも UNASSIGNED
```

根拠 docs:

- [`finding-audit-ownership.md`](./finding-audit-ownership.md) — `DEC-001〜018`
- [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md) — DEC-018 Accepted
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md) — FindingCode DEC UNASSIGNED

## 2. Human が Issue #8 で確認すること

ライブ台帳の最終確認は Human 側で行う。

```text
確認項目:
  1. Issue #8 上で最後に使われている DEC 番号は何か
  2. DEC-019 以降が既に使われていないか
  3. Finding catalog / FindingCode 用 DEC が既に無いか
```

## 3. 候補（未選択）

repository mirror だけを見ると、連番の次候補は次のとおり。

```text
Candidate next number（NOT SELECTED）:
  DEC-019

Meaning if Human selects DEC-019:
  Issue #8 ledger に Finding business catalog DEC を
  DEC-018 の次として登録する

NOT Agent decision:
  この文書は DEC-019 を採択しない
```

## 4. Human 選択

```text
問:
  Issue #8 台帳を確認したうえで、
  Finding business catalog DEC の番号をどれにしますか？

A. DEC-019 を使う
   （mirror 上の次番号。Issue #8 で未使用であることを Human が確認済み）
B. 別番号を使う
   → 使用する番号を明示（例: DEC-020）
C. まだ分からない / Issue #8 確認が必要
   → HOLD（A-4 UNASSIGNED のまま）

答え: A（2026-08-09）
A-4: DEC-019
```

## 5. Gate

```text
A-4: DEC-019（SELECTED）
DEC body Acceptance: Accepted / EMPTY / DEC-019
PR #141: MERGED（9cc7829）
Issue #8 ledger registration:
  docs prep: decision-dec-019-issue8-ledger-registration.md
  live post: PENDING — Human
After post: decision-dec-019-main-issue8-pr141-consistency-check.md
Implementation Start: HOLD
```

## Human への依頼（わかりやすく）

1. A-4 = **DEC-019** は記録済み（PR #141 MERGED）
2. Issue #8 へ DEC-019 台帳文面を投稿（正本 ownership / Human）
   — 文面: [`decision-dec-019-issue8-ledger-registration.md`](./decision-dec-019-issue8-ledger-registration.md) §1
3. comment ID を返し、docs を同期
4. main / Issue #8 / PR #141 整合確認
5. FindingCode 作成 / Implementation には自動で進まない
