# Decision Packet — GOV-AUD-01 Handoff の正本

この文書は、**GOV-AUD-01**（handoff の正本）の
**Human Decision Packet** である。

Issue #19 所有の最小単位。
Decision-HO-1（遷移所有）の再定義ではない。
GOV-AUD-02（状態変更ロール）の再定義ではない。
Accepted（Option）ではない。
Agent が会議システムや台帳 Schema を発明しない。
Implementation Start ではない。

Selection:
[`decision-gov-aud-01-handoff-canonical-source-selection.md`](./decision-gov-aud-01-handoff-canonical-source-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-AUD-01
Kind: Human Decision packet（narrow）
Status: OPEN / Option NOT SELECTED
Owner: Issue #19
Selected via: Decision-GOV-AUD-01-SELECTION-1（SELECT GOV-AUD-01）
Related:
  decision-ho-1-handoff-transition-ownership.md
  handoff-status-transition.md
  handoff-transition-role-policy.md（GOV-AUD-02）
  handoff-state-mutation.md
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Human Selected Option: NOT SELECTED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-01-handoff-canonical-source-selection.md`](./decision-gov-aud-01-handoff-canonical-source-selection.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- Issue #19 §C GOV-AUD-01
- [`decision-ho-1-handoff-transition-ownership.md`](./decision-ho-1-handoff-transition-ownership.md)
- [`handoff-transition-role-policy.md`](./handoff-transition-role-policy.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Current canonical state

```text
Handoff status vocabulary: existing（#27）
Allowed edges: Decision-HO-EDGE-1 Accepted
Transition pure function: MERGED（PR #90）
Roles who may change state: GOV-AUD-02 Accepted
State mutation / audit candidate: MERGED series（persistence = separate Gate）
Handoff の業務正本（どこが SoT か）: UNDECIDED（本 packet）
SharePoint / M365 / Deploy: NO-GO
```

問い（本 packet）:

> Handoff（引継ぎ）の業務上の正本をどこに置きますか？

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| **GOV-AUD-01** | handoff の正本（SoT） | **本 packet** |
| Decision-HO-1 | 遷移純関数の所有 Issue | Accepted / 混ぜない |
| Decision-HO-EDGE-1 | 許可辺 | Accepted / 混ぜない |
| GOV-AUD-02 | 状態変更ロール | Accepted / 混ぜない |
| HandoffStatus 型 | 状態語彙 | existing / 混ぜない |
| AuditEvent persistence | 実保存 | OUT / 別 Gate |
| GOV-AUD-07〜10 | バックアップ・復旧・再開・連絡 | OUT |
| FindingCode / A-5 | catalog | HOLD |
| Implementation | code / Schema / UI / 権限実装 | HOLD |

```text
正本 ≠ 遷移許可辺
正本 ≠ 誰が状態を変えられるか（GOV-AUD-02）
正本 ≠ SharePoint List 名の発明
正本を決める ≠ Handoff 実装開始
会議を正本にする ≠ 会議システム連携の自動実装 GO
```

## 3. Options（Issue #19 原文に対応）

### Option A — アプリ内の handoff 台帳

```text
Meaning:
  Handoff の業務正本 = アプリ内の handoff 台帳

Does NOT mean:
  具体 Schema / List / Internal Name を本 Decision で採番した
  SharePoint 作成 GO
  GOV-AUD-02 ロール表の変更
  Implementation Start
```

### Option B — 既存の会議・議事録システム

```text
Meaning:
  Handoff の業務正本 = 既存の会議・議事録システム

Requires（Option Acceptance 時に Human が明示）:
  対象システムの識別（名称または公式識別子）
Agent MUST NOT invent the system name / URL / ID scheme

Does NOT mean:
  会議システムへの自動連携実装 GO
  アプリ内 HandoffState の廃止（別 Decision が必要）
```

### Option C — 既存会議を正本とし、アプリは ID と状態だけを保持

```text
Meaning:
  業務正本 = 既存会議・議事録側
  アプリは参照 ID と Handoff 状態（および受理済み契約の範囲）だけを保持

Requires（Option Acceptance 時に Human が明示）:
  参照 ID の意味（何を指すか）を Human が記述できること
Agent MUST NOT invent external ID format

Does NOT mean:
  外部システム API 実装 GO
  アプリ状態機械（HO-EDGE-1 / GOV-AUD-02）の再設計
```

### Option D — その他（Human が明示）

```text
Requires:
  正本の置き場所を Human が具体的に記入
Agent MUST NOT invent the alternate SoT
```

### Option H — まだ決めない / HOLD

```text
Meaning:
  GOV-AUD-01 Option は未決のまま
  Selection（unit）は維持してよいが Option Acceptance はしない
```

## 4. Explicit non-options（選ばない）

```text
GOV-AUD-02 / HO-1 / HO-EDGE-1 の再オープン
会議システム名・URL・ID 体系の Agent 発明
アプリ handoff 台帳の列名・List 名の Agent 発明
AuditEvent / SharePoint adapter 実装開始
GOV-AUD-07〜10 の自動開始
FindingCode / A-5 / Implementation Start
Deploy / real data / M365 mutation
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  GOV-AUD-01 は ORG_POLICY。
  正本の置き場所は法人・現場運用の一次情報で決める。
  既存 HandoffState 技術契約の存在を、Option A または C の
  Binding 推薦根拠にしない。
```

Agent recommendation の欠如は Human Acceptance evidence ではない。

## 6. Human Decision

```text
問:
  Handoff の正本をどこに置きますか？

A. アプリ内の handoff 台帳
B. 既存の会議・議事録システム（識別子を Human が明示）
C. 既存会議を正本とし、アプリは ID と状態だけを保持
D. その他（Human が明示）
H. まだ決めない / HOLD

答え: NOT SELECTED
```

## 7. After Decision

| Selected | Next |
|---|---|
| A | Option Acceptance → app ledger SoT を LOCKED。Schema/実装は別 GO |
| B | Option Acceptance → 対象システム識別を Human 記入。連携実装は別 GO |
| C | Option Acceptance → 参照 ID 意味を Human 記入。外部連携実装は別 GO |
| D | Option Acceptance → Human 記述の正本を LOCKED |
| H | Option HOLD。unit Selection は維持可 |

維持:

```text
GOV-AUD-02: UNCHANGED
Decision-HO-1 / HO-EDGE-1: UNCHANGED
Implementation Start: DO NOT START from Option alone
SharePoint / M365 / Deploy: NO-GO
next residual auto-select: FORBIDDEN
```

## Reference

- Selection: `decision-gov-aud-01-handoff-canonical-source-selection.md`
- SELECT Acceptance: `decision-gov-aud-01-handoff-canonical-source-acceptance.md`
- Issue #19 GOV-AUD-01 source options A–D
