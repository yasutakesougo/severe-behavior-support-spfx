# Decision-FC-1 — FindingCode catalog ownership

この文書は、**Decision-FC-1**（FindingCode catalog ownership / change control）の
**Accepted 正本**である。

FindingCode の **具体値一覧・採番・写像・実装は扱わない**。
**Decision-FC-2**（catalog delivery boundary）とは別判断単位である。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-1
Status: Accepted
Selected: Option B
Catalog ownership: Issue #8 / new DEC
Kind: business DEC
Implementation Start: HOLD
Decision-FC-2: DO NOT START
Issue #8 DEC number: UNASSIGNED
main before this canonicalization: ecc7fcff4777a6c74ae41cea3d2125e8be95c4e9
Prior packet head: 41c734f1e48ecff7627a026b9beca5ff481d5ef4
Depends on: FindingIdentity assembly DONE（finding-identity-assembly.md / PR #66）
Independent Review: PASS
SEV-2 line: FindingSeverity NOT ADOPTED（Issue #8 / DEC-018）。本 Decision で再開しない
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-identity-assembly.md`](./finding-identity-assembly.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)
- [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)
- [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)

### Human Acceptance（durable）

```text
Human Acceptance: Explicit Human Option B selection on 2026-08-08
Decision-FC-1: Accepted
Selected: Option B
Catalog ownership: Issue #8 / new DEC
Change control:
  FindingCode catalog の追加・廃止は Issue #8 DEC の新規採択または改訂で管理する
Kind: business DEC
Identity assembly: UNCHANGED
Decision-FC-2: DO NOT START until FC-1 canonicalized
Implementation Start: HOLD
Issue #8 DEC number: UNASSIGNED
```

```text
Agent execution evidence: NOT Human Acceptance evidence
```

## Accepted 内容

```text
Status: Accepted
Selected: Option B

Catalog ownership / change control:
  Issue #8 に新しい DEC を追加する方式

Change control:
  FindingCode catalog の追加・廃止は
  Issue #8 DEC の新規採択または改訂で管理する

Kind: business DEC

Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
Decision-FC-2: DO NOT START
```

意味:

- FindingCode 業務カタログの正本・変更管理は **Issue #8 の新規 DEC** に置く。
- Issue #24 配下でカタログ ownership を固定する方式（Option A）は **不採用**。
- Issue #27 配下の technical contract として ownership を固定する方式（Option C）は **不採用**。
- 本 Accepted は ownership / change-control 方式と種別（business DEC）のみを確定する。
- FindingCode の具体値・採番・写像・enum・validator・fixture は **決めない**。
- Identity 組立（caller-supplied FindingCode + `isReasonCode`）は **再定義しない**。
- Decision-FC-2 は本 Accepted の canonicalization 後まで **開始しない**。

## 採択しなかった方式

```text
Option A:
  Issue #24 が FindingCode catalog ownership / change control を所有する

Option C:
  Issue #27 配下の technical contract としてカタログ ownership を固定する

Option D:
  ownership を採択せず HOLD
```

## DEC 番号

```text
Issue #8 ledger 上の FindingCode catalog DEC 番号: UNASSIGNED
```

番号採番・Issue #8 本文／コメントへの台帳追記は、本 docs 正本化とは別操作とする。
本 Accepted は「Issue #8 に新しい DEC を追加する」という **方式** を固定する。
DEC 本文（値一覧等）は Decision-FC-2 以降および別 Human Decision を受けて Issue #8 に記録する。

## Decision-FC-1 で決めないこと（維持）

```text
FindingCode の具体的な値一覧: OUT
コード番号 / 採番規則の確定: OUT
criterionId 写像表: OUT
TypeScript enum / union: OUT
validator / fixture: OUT
Decision-FC-2（固定列挙 vs 外部カタログ）: OUT / DO NOT START
assembleFindingIdentity の再定義: OUT
FindingSeverity / SEV-2-ASSIGN: OUT
完全 Finding 契約: OUT
SharePoint / adapter / UI / deploy / 実データ: OUT
```

## 既存契約との整合

| 正本 | 整合 |
|---|---|
| [`finding-identity-assembly.md`](./finding-identity-assembly.md) | **UNCHANGED**。caller-supplied FindingCode + `isReasonCode` 境界を壊さない |
| [`finding-stable-id.md`](./finding-stable-id.md) | **UNCHANGED** |
| [`finding-audit-ownership.md`](./finding-audit-ownership.md) | FindingCode catalog ownership は FC-1 Accepted / Option B |
| [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md) | FC-1 → FC-2 順を維持。FC-2 は DO NOT START |
| Decision-SEV-1 Option A | 業務語彙の change control を Issue #8 DEC に寄せる方針と整合 |
| Issue #8 / DEC-018 | FindingSeverity 不採用。本 Decision で Severity を再開しない |

## 分離（維持）

| 単位 | 扱い |
|---|---|
| Catalog ownership / change control | **本 Decision（Accepted / Option B）** |
| Catalog delivery boundary | Decision-FC-2（DO NOT START） |
| FindingCode 値一覧 / 採番 / mapping | 未決（Issue #8 新 DEC 本文・後続 Decision） |
| Identity 組立 | DONE / UNCHANGED |
| TypeScript / validator / fixture / 実装 | HOLD |
| FindingSeverity / SEV-2-ASSIGN | 再開しない |
| SharePoint / M365 / Deploy | NO-GO |

## 実装ゲート

```text
Decision-FC-1: Accepted / Option B
Implementation Start: HOLD
src/** / tests/**: 変更しない
Decision-FC-2: DO NOT START
FindingCode 値一覧 / enum / validator / fixture: DO NOT CREATE
Issue #8 DEC number: UNASSIGNED（推測採番しない）
Next after this canonicalization: Decision-FC-2 packet は別 Human Start
Issue #24 Close: NO-GO
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

## 対象外

- FindingCode 具体値の発明・列挙
- コード番号の推測採番
- mapping 表の作成
- TypeScript enum / validator / fixture
- Decision-FC-2 の Accepted / 開始
- Identity 組立契約の再定義
- FindingSeverity 値定義・ASSIGN・型実装の再開
- OP-3 / RD-3 / AS-EC-1 の同時着手
- SharePoint / adapter / UI / deploy / 実データ

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
tenant changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Decision では変更しない
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
FindingCode catalog invention: prohibited
AI code-list invention: prohibited
Decision-FC-2 auto progression: FORBIDDEN
Implementation auto-start: FORBIDDEN
```
