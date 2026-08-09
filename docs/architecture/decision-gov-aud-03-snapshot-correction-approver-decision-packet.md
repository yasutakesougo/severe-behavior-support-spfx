# Decision Packet — GOV-AUD-03 判定スナップショット訂正の承認者

この文書は、**GOV-AUD-03**（AssessmentSnapshot / 判定スナップショット訂正の承認者）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
DEC-009（保存タイミング）の再定義ではない。
GOV-AUD-04/05（削除）ではない。
Accepted ではない。
Agent が承認ロールを発明しない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-03
Kind: Human Decision packet（narrow）
Status: CONSUMED（Human Decision Accepted / Option E）
Accepted 正本: decision-gov-aud-03-snapshot-correction-approver-acceptance.md
Owner: Issue #19
Related design: assessment-snapshot-result-design.md
  （訂正 = 元 Snapshot 不変 + 置換 Snapshot + SnapshotCorrection）
Selected via: decision-next-substantive-unit-selection.md（Option B）
DEC-008: Accepted / LOCKED（支援計画シート作成者。本 packet と混ぜない）
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation（historical）: NONE
Human Selected: Option E
```


Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-next-substantive-unit-selection.md`](./decision-next-substantive-unit-selection.md)
- [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)
- [`handoff-transition-role-policy.md`](./handoff-transition-role-policy.md)（GOV-AUD-02 参考。同一視しない）

## 1. Current canonical state

```text
AssessmentSnapshot Result 技術設計: docs 固定（永続なし変換は別契約）
訂正モデル（設計）:
  元 Snapshot を更新しない
  完全な置換 Snapshot を新規作成
  SnapshotCorrection で original / replacement / reason / actor / timestamp を関連付け
訂正承認者: UNDECIDED（本 packet）
DEC-009 保存タイミング: Human-attested Accepted（本 packet で再定義しない）
GOV-AUD-02 handoff roles: Accepted（本 packet と混ぜない）
DEC-008 支援計画シート制度上の作成者: 実践研修修了者（本 packet と混ぜない）
AS-EC-1: HOLD（本 Acceptance だけでは完全契約実装に進まない）
```

問い（本 packet）:

> 判定スナップショット（AssessmentSnapshot）を訂正するとき、
> 誰が承認しますか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| **GOV-AUD-03** | Snapshot 訂正の承認者 | **本 packet** |
| DEC-009 | 保存タイミング | OUT（Human-attested Accepted / 再定義しない） |
| 保存・確定ロール（初回保存） | 誰が保存/確定するか | OUT / 別 GOV-AUD |
| 訂正の起票者 / 作成者 | 誰が訂正案を作るか | OUT（承認者と分離可） |
| GOV-AUD-02 | Handoff 状態変更ロール | Accepted / 混ぜない |
| GOV-AUD-04 / 05 | 論理削除・物理削除 | OUT |
| DEC-008 | 支援計画シート制度上の作成者 | Accepted / 混ぜない |
| FindingCode / A-5 | catalog | HOLD / 混ぜない |
| Implementation | code / Schema / UI / 権限実装 | HOLD / 混ぜない |

```text
訂正承認者 ≠ 支援計画シートの制度上の作成者（自動同一視しない）
訂正承認者 ≠ Handoff ロール表のコピー（自動流用しない）
訂正承認者 ≠ 保存タイミング（DEC-009）
承認する ≠ 置換 Snapshot を実装する
```

## 3. 設計上の前提（触らない）

[`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md) より:

```text
訂正時:
  元 Snapshot は不変保持
  replacement は単独で完全な AssessmentSnapshot として検証可能
  SnapshotCorrection は field patch ではない
物理削除や上書きを訂正として扱わない
```

本 packet はこの訂正モデルを再設計しない。
決めるのは **承認責任の境界** だけである。

## 4. Options

### Option A — サービス管理責任者

```text
Meaning:
  判定スナップショット訂正の承認者 = サービス管理責任者

Does NOT mean:
  DEC-008 の独立最終承認者を復活させた
  初回保存ロールまで決まった
  実装開始
```

### Option B — GOV-AUD-02 と同型の業務ロール集合（PLANNER / SERVICE_MANAGER）

```text
Meaning:
  訂正承認に必要な application role を
  PLANNER または SERVICE_MANAGER とする
  （Handoff の GOV-AUD-02 表を参考にするが、Handoff 辺とは別契約）

Does NOT mean:
  Handoff 遷移表のコピー採用
  Entra / SharePoint 認可の実装
```

### Option C — 実践研修修了者

```text
Meaning:
  訂正承認者 = 強度行動障害支援者養成研修（実践研修）修了者

Boundary:
  DEC-008（支援計画シート制度上の作成者）と役割は別物として明示する
  同じ人が兼ねることを禁止も必須化もしない（本 Option だけでは決めない）
```

### Option D — 別ロール / 別規則（Human が明示）

```text
Requires:
  役割名または規則を Human が記入
Agent MUST NOT invent the role name
```

### Option E — 当面 application 層対象外として明示

```text
Meaning:
  AS-EC-1 Entry Criteria #4 の代替経路:
  「GOV-AUD-03 Accepted」ではなく
  「application 層対象外として明示」で満たす
  domain / 技術契約では訂正承認ロールを埋め込まない

Does NOT mean:
  訂正モデル自体の廃止
  保存実装の開始
```

### Option F — まだ決めない / HOLD

```text
Meaning:
  GOV-AUD-03 は未決のまま
  AS-EC-1 Entry Criteria #4 は未充足のまま
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  承認ロールは Issue #19 / Human 一次情報で決める。
  Agent はサービス管理責任者・実践研修修了者・PLANNER 等を
  Binding 推薦値として確定しない。
```

## 6. Human Decision

```text
問:
  判定スナップショット（AssessmentSnapshot）を訂正するとき、
  誰が承認しますか？

A. サービス管理責任者
B. PLANNER または SERVICE_MANAGER（GOV-AUD-02 同型の集合）
C. 実践研修修了者
D. 別ロール / 別規則（明示）
E. 当面 application 層対象外として明示
F. まだ決めない / HOLD

答え: E（2026-08-09）
Acceptance: decision-gov-aud-03-snapshot-correction-approver-acceptance.md
Meaning:
  訂正承認者は当面 application 層対象外
  具体的な承認ロール: NOT ADOPTED / NOT DEFINED
  訂正そのものを不要にする決定ではない
```

## 7. After Decision

| Selected | Next |
|---|---|
| A–D | Acceptance 記録。AS-EC-1 #4 向けに承認境界を固定。実装は別 GO |
| **E（SELECTED）** | application 対象外の明示を Acceptance 済み。ロール実装 DO NOT START |
| F | HOLD 維持 |

維持:

```text
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
GOV-AUD-04/05: DO NOT START
DEC-009 再定義: DO NOT START
訂正モデル: UNCHANGED（廃止しない）
SharePoint / M365 / Deploy / real data: NO-GO
次 substantive unit: NOT SELECTED
```

## 8. Gate

```text
GOV-AUD-03 packet: CONSUMED / Accepted Option E
具体的な承認ロール: NOT ADOPTED / NOT DEFINED
application contract: 訂正承認者 OUT
訂正モデル: retained
Implementation Start: HOLD
```
