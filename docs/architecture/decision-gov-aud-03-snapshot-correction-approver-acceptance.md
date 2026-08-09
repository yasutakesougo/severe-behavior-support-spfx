# GOV-AUD-03 — 判定スナップショット訂正承認者 Human Acceptance（application 対象外）

この文書は、**GOV-AUD-03**（AssessmentSnapshot / 判定スナップショット訂正の承認者）についての
**Human Acceptance evidence** である。

Decision packet: [`decision-gov-aud-03-snapshot-correction-approver-decision-packet.md`](./decision-gov-aud-03-snapshot-correction-approver-decision-packet.md)

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-03
Status: Accepted
Human Acceptance: Explicit Human Option E on 2026-08-09
Selected Option: E
Meaning:
  判定スナップショット訂正の承認者は、
  当面 application 層対象外として明示する
具体的な承認ロール:
  NOT ADOPTED / NOT DEFINED
Does NOT mean:
  訂正そのものを不要にする
  訂正モデル（元 Snapshot 不変 + 置換 Snapshot + SnapshotCorrection）の廃止
Boundary:
  誰が承認するかを現時点の application contract に持ち込まない
  根拠のない承認権限をアプリに作らない
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option E on 2026-08-09
GOV-AUD-03: Accepted
Selected Option: E
判定スナップショット訂正の承認者:
  当面 application 層対象外として明示する
具体的な承認ロール:
  NOT ADOPTED / NOT DEFINED
```

理由（Human）:

```text
現時点では、訂正承認者を
サービス管理責任者、PLANNER / SERVICE_MANAGER、実践研修修了者
のいずれかにする制度・Human 一次情報が不足している。
根拠のない承認権限をアプリに作らずに済む。
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
GOV-AUD-03: Accepted
Selected: Option E

Application contract boundary:
  Snapshot 訂正の「誰が承認するか」は
  当面 application 層の対象外とする

具体的な承認ロール:
  NOT ADOPTED / NOT DEFINED
  （サービス管理責任者 / PLANNER / SERVICE_MANAGER / 実践研修修了者
   を Binding しない）
```

日本語正本:

```text
判定スナップショット訂正の承認者:
  当面 application 層対象外

具体的な承認ロール:
  NOT ADOPTED / NOT DEFINED
```

意味:

- **訂正そのものを不要にする決定ではない。**
- [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md) の訂正モデル
  （元 Snapshot 不変 + 置換 Snapshot + SnapshotCorrection）は維持対象であり、本 Acceptance で廃止しない。
- 現時点の application contract に、訂正承認ロール検査を埋め込まない。
- AS-EC-1 Entry Criteria #4 は、本 Accepted により
  **「application 層対象外として明示済み」** 経路で充足候補となる
  （Entry 全体の satisfied 宣言や Implementation Start には自動進行しない）。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  訂正機能の廃止
  承認ロール（サービス管理責任者等）の発明・実装
  DEC-009 の再定義
  GOV-AUD-04 / 05
  AS-EC-1 全体の Entry satisfied 宣言
  FindingCode 作成
  A-5
  Implementation Start
  SharePoint / M365 / Deploy / real data
```

将来、制度・Human 一次情報で具体的な承認者が確定した場合は、
**別 Human Decision** として GOV-AUD-03 を再評価する。

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| 訂正モデル（設計） | **UNCHANGED**（訂正は残る） |
| 訂正承認ロール（application） | **対象外 / NOT DEFINED** |
| DEC-008 支援計画シート作成者 | UNCHANGED / 混ぜない |
| GOV-AUD-02 Handoff roles | UNCHANGED / 混ぜない |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
GOV-AUD-03: Accepted / Option E
AS-EC-1 #4: application 対象外明示済み（候補）
AS-EC-1 overall / Implementation: NOT STARTED
FindingCode / A-5 / Implementation: HOLD
次 substantive unit: NOT SELECTED（別 Human 選定）
```

Agent は本 Acceptance を理由に承認ロール実装や FindingCode / Implementation へ自動進行しない。
