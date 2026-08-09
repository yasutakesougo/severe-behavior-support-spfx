# Decision Packet — DEC-008 提出・差戻しロール

この文書は、**DEC-008** のうち
**支援計画シートの提出ロール / 差戻しロール** だけを問う
**Human Decision Packet** である。

制度上の作成者の再決定ではない。
独立最終承認者の再導入ではない。
Accepted ではない。
Agent がロール名を発明しない。
Implementation Start ではない。

未決定点抽出: [`decision-dec-008-submit-return-roles-open-points.md`](./decision-dec-008-submit-return-roles-open-points.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008 / SUBMIT_RETURN_ROLES
Kind: Human Decision packet（narrow）
Status: CONSUMED（Human Decision Accepted / Option C）
Accepted 正本: decision-dec-008-submit-return-roles-acceptance.md
Consistency: decision-dec-008-submit-return-roles-canonicalization-consistency-check.md
Separation authority: decision-dec-008-support-plan-role-separation.md
DEC-008 locked core:
  制度上の作成者 = 実践研修修了者（Accepted / UNCHANGED）
  独立した最終承認者 = NOT ADOPTED（再導入しない）
  提出・差戻しロール = NOT ADOPTED（application 非埋め込み）
Canonical ownership: Issue #8 / DEC-008（残面）
Related technical contract: support-plan-status-transition.md（role-free / UNCHANGED）
Selected via: next substantive unit E
main baseline: 42b251be83447d6e82090312ea2f18ed69968377
Decision-OP-3: FINAL CONSISTENT（PR #146 / 42b251b…）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation（historical）: NONE
Human Selected: Option C
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-dec-008-submit-return-roles-open-points.md`](./decision-dec-008-submit-return-roles-open-points.md)
- [`decision-dec-008-support-plan-role-separation.md`](./decision-dec-008-support-plan-role-separation.md)
- [`decision-dec-008-acceptance.md`](./decision-dec-008-acceptance.md)
- [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- [`decision-next-substantive-unit-selection.md`](./decision-next-substantive-unit-selection.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
DEC-008:
  制度上の作成者: ACCEPTED = 実践研修修了者
  独立した最終承認者: NOT ADOPTED
  提出ロール: Accepted / Option C — application に固定しない
  差戻しロール: Accepted / Option C — application に固定しない

SupportPlan status transition（role-free / UNCHANGED）:
  Draft → PendingReview          ← 提出に対応
  PendingReview → Returned       ← 差戻しに対応
  Returned → Draft
  PendingReview → Active         ← 有効化。本 packet OUT
  Active → Closed

AI 要約をロール根拠に硬化: FORBIDDEN
制度資料が支持しない承認フロー追加: FORBIDDEN
```

問い（本 packet）:

> 支援計画シートについて、
> 誰が提出でき、誰が差し戻せますか？

対応する遷移:

```text
提出: Draft → PendingReview
差戻し: PendingReview → Returned
```

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| 制度上の作成者 | 実践研修修了者 | **Accepted / 触らない** |
| 独立した最終承認者 | アプリ独自最終承認者 | **NOT ADOPTED / 再導入しない** |
| **提出ロール** | 誰が `Draft → PendingReview` できるか | **本 packet** |
| **差戻しロール** | 誰が `PendingReview → Returned` できるか | **本 packet** |
| 有効化ロール | `PendingReview → Active` | **OUT** |
| SupportPlan 純関数 | role-free 遷移 | **UNCHANGED**（権限埋め込みは別 GO） |
| DEC-009 | Snapshot 保存タイミング | OUT / 再 Decision しない |
| FindingCode / A-5 | catalog | HOLD |
| Implementation | code / UI / 権限実装 | HOLD |

```text
提出 ≠ 制度上の作成者（自動同一視しない）
差戻し ≠ 独立最終承認者（再導入しない）
差戻し ≠ 有効化（PendingReview → Active）
提出/差戻しの決定 ≠ transitionSupportPlanStatus へのロール検査埋め込み
```

## 3. Options

### Option A — 提出も差戻しも制度上の作成者（実践研修修了者）

```text
Meaning:
  提出ロール = 実践研修修了者
  差戻しロール = 実践研修修了者

Does NOT mean:
  独立最終承認者を置いた
  有効化ロールを決めた
  純関数にロール検査を埋め込んだ
```

### Option B — 提出は制度上の作成者、差戻しはサービス管理責任者

```text
Meaning:
  提出ロール = 実践研修修了者
  差戻しロール = サービス管理責任者

Does NOT mean:
  サービス管理責任者 = 最終承認者（NOT ADOPTED を維持）
  差戻し = 有効化
```

### Option C — 提出・差戻しロールをアプリに埋め込まない（NOT ADOPTED）

```text
Meaning:
  提出/差戻しの担当ロールをアプリ固有ロールとして採択しない
  SupportPlan 遷移の role-free 契約を維持する

Does NOT mean:
  Draft→PendingReview / PendingReview→Returned 辺を削除する
  制度上の作成者 Acceptance を取り消す
```

### Option D — 提出と差戻しを別ロールとして Human が明示

```text
Meaning:
  提出ロール名と差戻しロール名を Human がそれぞれ記入する
Requires:
  提出ロール: （Human 記入）
  差戻しロール: （Human 記入）
Agent MUST NOT invent the role names
```

### Option E — 制度資料・一次情報をさらに確認してから決める

```text
Meaning:
  提出/差戻しロールを未決定のまま残す
  追加の Human 一次情報または制度運用確認の後に再問する
```

## 4. Explicit non-options（選ばない）

```text
制度上の作成者の再決定
独立最終承認者の再導入
サービス管理責任者 = 最終承認者 の復活
PendingReview → Active の有効化ロールを本 packet で決めること
FindingCode / A-5 / Implementation Start
transitionSupportPlanStatus へのロール検査の即時埋め込み
SharePoint / M365 / Deploy / real data
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  提出・差戻しロールは Human 一次情報 / 制度運用で決める。
  Agent はロール名を発明しない。
  独立最終承認者 NOT ADOPTED を、差戻しや有効化の名目で再導入しない。
```

Agent recommendation の欠如は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  支援計画シートについて、誰が提出でき、誰が差し戻せますか？

A. 提出も差戻しも制度上の作成者（実践研修修了者）
B. 提出は制度上の作成者、差戻しはサービス管理責任者
C. 提出・差戻しロールをアプリに埋め込まない（NOT ADOPTED）
D. 提出と差戻しを別ロールとして明示（両方記入）
E. 制度資料・一次情報をさらに確認してから決める

答え: C（2026-08-09）
提出ロール: application contract に固定しない
差戻しロール: application contract に固定しない
Acceptance: decision-dec-008-submit-return-roles-acceptance.md
```

## 7. After Decision

| Selected | Next |
|---|---|
| **C（SELECTED）** | Acceptance LOCKED。整合確認 → Independent Review → Human Merge（PR #147） |
| A / B / D | （未選択） |
| E | （未選択） |

維持:

```text
制度上の作成者: 実践研修修了者（Accepted / UNCHANGED）
独立した最終承認者: NOT ADOPTED / 再導入しない
提出・差戻しロール: NOT ADOPTED（application 非埋め込み）
support-plan-status-transition.md: UNCHANGED / role-free
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

## 8. Gate

```text
DEC-008 / SUBMIT_RETURN_ROLES: CONSUMED / Accepted / Option C
Acceptance: decision-dec-008-submit-return-roles-acceptance.md
Consistency: FINAL CONSISTENT（PR #147 MERGED / ce05cd0…）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Next substantive unit: NOT SELECTED
```
