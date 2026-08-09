# Decision Packet — GOV-AUD-04 論理削除を許可するロール

この文書は、**GOV-AUD-04**（論理削除を許可するロール）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
GOV-AUD-05（物理削除方針）ではない。
DEC-012（完全削除方針）ではない。
GOV-AUD-03 の再定義ではない。
Accepted ではない。
Agent がロール名を発明しない。
Implementation Start ではない。

未決定点抽出: [`decision-gov-aud-04-logical-delete-role-open-points.md`](./decision-gov-aud-04-logical-delete-role-open-points.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-04
Kind: Human Decision packet（narrow）
Status: OPEN / READY_FOR_HUMAN_DECISION
Owner: Issue #19
Selected via: decision-next-substantive-unit-selection.md（Option B）
Related:
  assessment-snapshot-result-design.md
  finding-audit-ownership.md（GOV-AUD-04 行）
GOV-AUD-03: Accepted / Option E（application 対象外。本 packet と混ぜない）
DEC-008: Accepted / LOCKED（提出・差戻し Option C 含む。混ぜない）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-04-logical-delete-role-open-points.md`](./decision-gov-aud-04-logical-delete-role-open-points.md)
- [`decision-next-substantive-unit-selection.md`](./decision-next-substantive-unit-selection.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md)
- [`decision-gov-aud-03-snapshot-correction-approver-acceptance.md`](./decision-gov-aud-03-snapshot-correction-approver-acceptance.md)
- [`handoff-transition-role-policy.md`](./handoff-transition-role-policy.md)（GOV-AUD-02 参考。同一視しない）
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## 1. Current canonical state

```text
GOV-AUD-04: UNDECIDED（本 packet）
GOV-AUD-05: OUT（本 packet で決めない）
GOV-AUD-03: Accepted / Option E
  訂正承認者 = 当面 application 層対象外
  具体ロール NOT ADOPTED / NOT DEFINED
GOV-AUD-02: Accepted（Handoff roles。論理削除へ自動流用しない）
DEC-008 submit/return: NOT ADOPTED（app 非埋め込み）
AUD-RET-1: Accepted（保存期間。5年到達 ≠ 自動物理削除）
AssessmentSnapshot 訂正モデル: UNCHANGED（削除モデルの再設計ではない）
```

問い（本 packet）:

> 論理削除を、誰に許可しますか？

（対象エンティティの確定が必要な場合は Option で Human が明示する。
 Agent は対象を勝手に広げない。）

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| **GOV-AUD-04** | 論理削除を許可するロール | **本 packet** |
| GOV-AUD-05 | 物理削除方針 | **OUT** |
| DEC-012 | 論理削除データの完全削除方針 | **OUT** |
| GOV-AUD-03 | Snapshot 訂正承認者 | Accepted / 混ぜない |
| GOV-AUD-02 | Handoff 状態変更ロール | Accepted / 自動流用しない |
| DEC-008 | 支援計画シート役割 | Accepted / 混ぜない |
| DEC-009 | 保存タイミング | OUT / 再 Decision しない |
| FindingCode / A-5 | catalog | HOLD |
| Implementation | code / Schema / UI / 権限実装 | HOLD |

```text
論理削除ロール ≠ 物理削除方針（GOV-AUD-05）
論理削除ロール ≠ 完全削除方針（DEC-012）
論理削除ロール ≠ Snapshot 訂正承認者（GOV-AUD-03）
論理削除ロール ≠ Handoff ロール表のコピー（GOV-AUD-02）
論理削除を許可する ≠ 削除機能の実装開始
```

## 3. Options

### Option A — サービス管理責任者

```text
Meaning:
  論理削除を許可するロール = サービス管理責任者

Does NOT mean:
  GOV-AUD-05 / 物理削除を許可した
  DEC-008 独立最終承認者を復活させた
  実装開始
```

### Option B — GOV-AUD-02 と同型の業務ロール集合（PLANNER / SERVICE_MANAGER）

```text
Meaning:
  論理削除に必要な application role を
  PLANNER または SERVICE_MANAGER とする
  （Handoff の GOV-AUD-02 を参考にするが、Handoff 辺とは別契約）

Does NOT mean:
  Handoff 遷移表のコピー採用
  Entra / SharePoint 認可の実装
```

### Option C — 実践研修修了者

```text
Meaning:
  論理削除を許可するロール =
  強度行動障害支援者養成研修（実践研修）修了者

Boundary:
  DEC-008（支援計画シート制度上の作成者）と役割は別物として明示する
```

### Option D — 別ロール / 別規則（Human が明示）

```text
Requires:
  役割名または規則を Human が記入
  必要なら対象エンティティも明示
Agent MUST NOT invent the role name
```

### Option E — 当面 application 層対象外として明示（NOT ADOPTED / NOT DEFINED）

```text
Meaning:
  論理削除を許可するロールを、
  現時点の application contract に埋め込まない
  具体的な許可ロール: NOT ADOPTED / NOT DEFINED

Does NOT mean:
  論理削除という概念自体の廃止
  GOV-AUD-05 を自動開始
  保存・削除実装の開始
```

### Option F — まだ決めない / HOLD

```text
Meaning:
  GOV-AUD-04 は未決のまま
```

## 4. Explicit non-options（選ばない）

```text
GOV-AUD-05 物理削除方針の採択
DEC-012 完全削除方針の採択
GOV-AUD-03 / DEC-008 の再オープン
FindingCode / A-5 / Implementation Start
ロール名の Agent 発明
SharePoint / M365 / Deploy / real data
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  論理削除ロールは Issue #19 / Human 一次情報で決める。
  Agent はサービス管理責任者・実践研修修了者・PLANNER 等を
  Binding 推薦値として確定しない。
  GOV-AUD-03 Option E を、論理削除へ自動コピーしない。
```

Agent recommendation の欠如は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  論理削除を、誰に許可しますか？

A. サービス管理責任者
B. PLANNER または SERVICE_MANAGER（GOV-AUD-02 同型の集合）
C. 実践研修修了者
D. 別ロール / 別規則（明示）
E. 当面 application 層対象外として明示（NOT ADOPTED / NOT DEFINED）
F. まだ決めない / HOLD

答え: （Human 記入）
対象エンティティ（必要なら）: （Human 記入）
```

## 7. After Decision

| Selected | Next |
|---|---|
| A–D | Acceptance 記録。ロール Binding を正本化。実装は別 GO |
| E | application 対象外の明示を Acceptance。ロール実装 DO NOT START |
| F | HOLD 維持 |

維持:

```text
GOV-AUD-05: OUT / DO NOT START from this Decision alone
DEC-012: OUT
GOV-AUD-03: UNCHANGED
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

## 8. Gate

```text
GOV-AUD-04: READY_FOR_HUMAN_DECISION
Open-points: decision-gov-aud-04-logical-delete-role-open-points.md
Accepted: NOT YET
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
GOV-AUD-05: DO NOT START
```
