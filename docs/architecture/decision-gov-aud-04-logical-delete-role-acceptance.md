# GOV-AUD-04 — 論理削除を許可するロール Human Acceptance（application 対象外）

この文書は、**GOV-AUD-04**（論理削除を許可するロール）についての
**Human Acceptance 正本（LOCKED）** である。

Decision packet: [`decision-gov-aud-04-logical-delete-role-decision-packet.md`](./decision-gov-aud-04-logical-delete-role-decision-packet.md)

Open-points: [`decision-gov-aud-04-logical-delete-role-open-points.md`](./decision-gov-aud-04-logical-delete-role-open-points.md)

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-04
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option E on 2026-08-09
Selected Option: E

LOCKED:

論理削除を許可するロール:
  当面 application 層対象外として明示する
具体的な許可ロール:
  NOT ADOPTED / NOT DEFINED
Does NOT mean:
  論理削除という概念自体の廃止
  GOV-AUD-05 物理削除方針の採択
  DEC-012 完全削除方針の採択
Boundary:
  誰が論理削除できるかを現時点の application contract に持ち込まない
  根拠のない削除権限をアプリに作らない
GOV-AUD-05:
  OUT / DO NOT START from this Acceptance alone
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
Human Acceptance: Explicit Human Option E on 2026-08-09
GOV-AUD-04: Accepted / LOCKED
Selected Option: E

論理削除を許可するロール:
  当面 application 層対象外として明示する
具体的な許可ロール:
  NOT ADOPTED / NOT DEFINED
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-AUD-04: Accepted / LOCKED
Selected: Option E

Application contract boundary:
  論理削除の「誰に許可するか」は
  当面 application 層の対象外とする

具体的な許可ロール:
  NOT ADOPTED / NOT DEFINED
  （サービス管理責任者 / PLANNER / SERVICE_MANAGER / 実践研修修了者
   を Binding しない）
```

日本語正本:

```text
論理削除を許可するロール:
  当面 application 層対象外

具体的な許可ロール:
  NOT ADOPTED / NOT DEFINED
```

意味:

- **論理削除という概念自体を廃止する決定ではない。**
- 現時点の application contract に、論理削除ロール検査を埋め込まない。
- GOV-AUD-03 Option E（訂正承認者 application 対象外）の自動コピーではないが、
  同様に根拠のない権限 Binding を避ける境界である。
- GOV-AUD-05 / DEC-012 は本 Acceptance では開始しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  論理削除機能の廃止宣言
  許可ロール（サービス管理責任者等）の発明・実装
  GOV-AUD-05 物理削除方針
  DEC-012 完全削除方針
  GOV-AUD-03 の再オープン
  FindingCode 作成
  A-5
  Implementation Start
  SharePoint / M365 / Deploy / real data
  次 substantive unit の自動選定
```

将来、制度・Human 一次情報で具体的な許可ロールが確定した場合は、
**別 Human Decision** として GOV-AUD-04 を再評価する。

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| 論理削除ロール（application） | **対象外 / NOT DEFINED** |
| GOV-AUD-05 物理削除 | **OUT / 未着手** |
| DEC-012 完全削除 | **OUT / 混ぜない** |
| GOV-AUD-03 訂正承認 | **UNCHANGED**（Option E） |
| GOV-AUD-02 Handoff roles | **UNCHANGED / 混ぜない** |
| DEC-008 | **UNCHANGED / 混ぜない** |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
PR #149: MERGED（cb14c13… / head 55112f4…）
Consistency: FINAL CONSISTENT
  → decision-gov-aud-04-canonicalization-consistency-check.md
GOV-AUD-05: DO NOT START from this Acceptance
FindingCode / A-5 / Implementation: HOLD
Next substantive unit: NOT SELECTED
  → decision-next-substantive-unit-selection-packet.md（OPEN）
```

Agent は本 Acceptance を理由に削除ロール実装や FindingCode / Implementation / GOV-AUD-05 へ自動進行しない。
