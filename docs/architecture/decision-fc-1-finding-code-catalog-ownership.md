# Decision-FC-1 — FindingCode catalog ownership（decision packet）

この文書は、**Decision-FC-1**（FindingCode catalog ownership / change control）の
**decision packet（Candidate）** である。
Accepted 正本ではない。

FindingCode の **具体値一覧・採番・写像・実装は扱わない**。
**Decision-FC-2**（catalog delivery boundary）とは別判断単位である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-1
Decision packet: FindingCode catalog ownership
Status: OPEN / CANDIDATE / NOT ACCEPTED
Selected: NOT SELECTED
Implementation Start: HOLD
Decision-FC-2: DO NOT START（FC-1 Accepted 後のみ）
main before this packet: ecc7fcff4777a6c74ae41cea3d2125e8be95c4e9
Depends on: FindingIdentity assembly DONE（finding-identity-assembly.md / PR #66）
SEV-2 line: FindingSeverity NOT ADOPTED（Issue #8 / DEC-018）。本 packet で再開しない
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-identity-assembly.md`](./finding-identity-assembly.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)
- [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)

### Human unit selection（durable）

```text
Human selection: Decision-FC-1 as next substantive unit
Implementation Start: HOLD
Kind: ownership Decision packet first（read-only / docs-only）
Agent execution evidence: NOT Human Acceptance evidence
```

本 packet は ownership 候補を固定する。Option の Accepted は別 Human Decision を要する。

## 問い

```text
FindingCode 業務カタログの正本を誰が所有するか。
コード追加・廃止の change control を誰が持つか。
それは法人業務 DEC なのか、technical contract なのか。
```

## 前提（変更しない）

```text
FindingIdentity assembly: DONE / UNCHANGED
assembleFindingIdentity: caller-supplied FindingCode + isReasonCode のみ
FindingCode を推測・生成・カタログ変換しない（既存契約維持）
deriveStableFindingId: UNCHANGED
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Contract break: NO
src/** / tests/**: 本 packet では変更しない
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
FindingSeverity / SEV-2-ASSIGN: 再開しない（NOT ADOPTED / N/A）
```

現行正本（Identity 組立）:

- [`finding-identity-assembly.md`](./finding-identity-assembly.md)
- Decision comment `5210065336` / Implementation Start `5210078985`
- FindingCode は呼び出し側必須入力。業務カタログは対象外のまま。

## 判断単位の分離（必須）

| Unit ID | 判断単位 | 本 packet での状態 | 混ぜてはならないもの |
|---|---|---|---|
| **Decision-FC-1** | FindingCode **catalog ownership / change control** | **OPEN / CANDIDATE** | 値一覧・delivery boundary・実装 |
| **Decision-FC-2** | Catalog **delivery boundary**（domain 固定列挙 vs 外部カタログ） | **DO NOT START**（FC-1 Accepted 後のみ） | ownership 自体 |
| Identity 組立 | caller-supplied FindingCode 検証・組立 | **DONE / UNCHANGED** | カタログ正本化 |

```text
Independent acceptance: REQUIRED
Bundle FC-1 + FC-2 Accepted: FORBIDDEN
Bundle ownership + code list Accepted: FORBIDDEN
Order preference: Decision-FC-1 → Decision-FC-2 →（必要なら）実装 Entry Criteria
```

## 候補オプション（Human が選択 / 修正）

エージェントは Selected を確定しない。

| Option | 概要 | 意味 |
|---|---|---|
| **A** | **Issue #24** が FindingCode catalog ownership / change control を所有する | Finding 系所有入口（#24）配下でカタログ所有を正本化。追加・廃止は #24 Decision / comment 管理 |
| **B** | **Issue #8** に新しい DEC を追加して FindingCode catalog を正本化する | DEC 台帳方式（Decision-SEV-1 Option A と同型）。番号は採番時まで UNASSIGNED |
| **C** | **Issue #27** 配下の technical contract としてカタログ ownership を固定する | 型契約 Issue 側。業務 DEC 台帳とは分離 |
| **D** | 現時点では ownership を採択せず **HOLD** | FC-2 / 実装へ進まない |

```text
A/B/C 採択時に必須添付:
  1. ownership Issue（または DEC 台帳）の明示
  2. 追加・廃止の change control 手順（1 文以上）
  3. 法人業務 DEC か technical contract かの種別明示
  4. Identity 組立契約を再定義しないことの確認
```

## Decision-FC-1 で決めないこと

```text
FindingCode の具体的な値一覧: OUT
コード番号 / 採番規則の確定: OUT
criterionId 写像表: OUT
TypeScript enum / union: OUT
validator / fixture: OUT
Decision-FC-2（固定列挙 vs 外部カタログ）: OUT（後続）
assembleFindingIdentity の再定義: OUT
FindingSeverity / SEV-2-ASSIGN: OUT
完全 Finding 契約: OUT
SharePoint / adapter / UI / deploy / 実データ: OUT
```

## Acceptance 記録テンプレ

```text
Decision-FC-1:
ACCEPTED | HOLD | REJECTED
Selected: A | B | C | D | (amended)
Catalog ownership:
  <Issue or DEC ledger>
Change control:
  <one sentence>
Kind:
  business DEC | technical contract
Identity assembly:
  UNCHANGED
Decision-FC-2:
  DO NOT START（Accepted 後のみ候補）
Implementation Start:
  HOLD
Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
```

## 既存契約との整合

| 正本 | 整合 |
|---|---|
| [`finding-identity-assembly.md`](./finding-identity-assembly.md) | **UNCHANGED**。カタログ無し前提の caller-supplied 境界を壊さない |
| [`finding-stable-id.md`](./finding-stable-id.md) | **UNCHANGED** |
| [`finding-audit-ownership.md`](./finding-audit-ownership.md) | FindingCode 業務カタログは FC-1 / FC-2 待ちのまま |
| [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md) | FC-1 → FC-2 順を維持 |
| Decision-SEV-1 / DEC-018 | FindingSeverity 不採用。本 packet で Severity を再開しない |

## 実装ゲート

```text
Decision-FC-1: CANDIDATE / NOT ACCEPTED
Implementation Start: HOLD
src/** / tests/**: 変更しない
Decision-FC-2: DO NOT START
FindingCode 値一覧 / enum / validator / fixture: DO NOT CREATE
Next after FC-1 Accepted: Decision-FC-2 packet（別単位）
Issue #24 Close: NO-GO
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

## OUT / 混ぜないもの

- FindingCode 具体値の発明・列挙
- コード番号の推測採番
- mapping 表の作成
- TypeScript enum / validator / fixture
- FC-1 と FC-2 の一括 Accepted
- Identity 組立契約の再定義
- FindingSeverity 値定義・ASSIGN・型実装の再開
- OP-3 / RD-3 / AS-EC-1 の同時着手
- SharePoint / tenant / Microsoft 365 / Entra ID / Deploy
- real data

## Gate

```text
Next substantive unit: Decision-FC-1
Decision-FC-1 packet: OPEN / CANDIDATE / NOT ACCEPTED
Implementation Start: HOLD
Decision-FC-2: DO NOT START
Independent acceptance: REQUIRED
Issue #24 Close: NO-GO
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
tenant changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 packet では変更しない
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
FindingCode catalog invention: prohibited
AI code-list invention: prohibited
```
