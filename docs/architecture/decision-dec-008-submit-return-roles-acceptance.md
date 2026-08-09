# DEC-008 — 提出・差戻しロール Human Acceptance（アプリ非埋め込み）

この文書は、**DEC-008** のうち
**支援計画シートの提出ロール / 差戻しロール** についての
**Human Acceptance 正本（LOCKED）** である。

Decision packet: [`decision-dec-008-submit-return-roles-decision-packet.md`](./decision-dec-008-submit-return-roles-decision-packet.md)

Open-points: [`decision-dec-008-submit-return-roles-open-points.md`](./decision-dec-008-submit-return-roles-open-points.md)

分離正本: [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)

整合確認: [`decision-dec-008-submit-return-roles-canonicalization-consistency-check.md`](./decision-dec-008-submit-return-roles-canonicalization-consistency-check.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008 / SUBMIT_RETURN_ROLES
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option C on 2026-08-09
Selected Option: C
Independent Review: PASS
  PR #147 / HEAD d1b5d544d900a548110bae4df110f5a73cc392bd
  P0=0 / P1=0 / P2=0
  → decision-dec-008-submit-return-roles-independent-review.md

LOCKED:

提出ロール:
  application contract に固定しない
  NOT ADOPTED（アプリ埋め込み）
差戻しロール:
  application contract に固定しない
  NOT ADOPTED（アプリ埋め込み）
制度上の作成者:
  UNCHANGED — 実践研修修了者
独立した最終承認者:
  NOT ADOPTED / 再導入しない
evaluate / transitionSupportPlanStatus:
  UNCHANGED（role-free）
FindingCode:
  HOLD
A-5:
  HOLD
Implementation Start:
  HOLD

Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Acceptance: Explicit Human Option C on 2026-08-09
DEC-008 / SUBMIT_RETURN_ROLES: Accepted / LOCKED
Selected Option: C

提出ロール:
  application contract に固定しない
差戻しロール:
  application contract に固定しない
```

理由（Human）:

```text
DEC-008 ですでに「独立した最終承認者を設定しない」と確定している。
ここで提出・差戻しロールを新たに固定すると、
制度根拠のない承認ワークフローを別名で再導入する可能性がある。
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
DEC-008 / SUBMIT_RETURN_ROLES: Accepted / LOCKED
Selected: Option C

Application contract boundary:
  提出ロールを application contract に埋め込まない
  差戻しロールを application contract に埋め込まない

Meaning:
  Draft → PendingReview / PendingReview → Returned の許可遷移辺は維持
  ただし「誰が提出/差戻しできるか」をアプリ固有ロールとして Binding しない
  support-plan-status-transition.md の role-free 契約を維持する
```

日本語正本:

```text
提出ロール:
  application contract に固定しない
差戻しロール:
  application contract に固定しない
制度上の作成者:
  UNCHANGED — 実践研修修了者
独立した最終承認者:
  NOT ADOPTED / 再導入しない
```

意味:

- **提出・差戻しの状態遷移辺を削除する決定ではない。**
- アプリに提出者/差戻し者ロール検査を埋め込まない。
- 独立最終承認者 NOT ADOPTED を、提出・差戻しの名目で再導入しない。
- 制度上の作成者（実践研修修了者）Acceptance は UNCHANGED。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  制度上の作成者の再決定
  独立最終承認者の再導入
  サービス管理責任者 = 最終承認者 の復活
  提出/差戻しロール名の Agent 発明
  transitionSupportPlanStatus へのロール検査埋め込み
  FindingCode 作成
  A-5
  Implementation Start
  SharePoint / M365 / Deploy / real data
  次 substantive unit の自動選定
```

将来、制度・Human 一次情報で提出/差戻し担当をアプリ契約に載せる必要が確認された場合は、
**別 Human Decision** として再評価する。

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| 制度上の作成者 | **UNCHANGED**（実践研修修了者） |
| 独立した最終承認者 | **NOT ADOPTED / 再導入しない** |
| 提出・差戻しロール（application） | **NOT ADOPTED / 固定しない** |
| `support-plan-status-transition.md` | **UNCHANGED**（role-free / 5 辺維持） |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
Docs consistency: CONSISTENT
Independent Review: PASS（HEAD d1b5d544…）
Next: Ready 化 → Human Merge Decision（PR #147）
FindingCode / A-5 / Implementation: HOLD
Next substantive unit: NOT SELECTED（Merge 後に Human が選ぶ）
```

```text
Independent Review: NOT Human Acceptance evidence
This Acceptance records the Human Decision only.
```
