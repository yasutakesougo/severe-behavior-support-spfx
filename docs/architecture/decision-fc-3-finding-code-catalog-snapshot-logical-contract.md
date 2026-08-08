# Decision-FC-3 — FindingCode catalog snapshot logical contract candidate packet

この文書は、**Decision-FC-3**（FindingCode catalog snapshot logical contract）の
**Candidate Packet** である。Accepted 正本ではない。

Decision-FC-3 は、Decision-FC-2 Accepted / Option C が固定した
**versioned immutable catalog snapshot input** について、
技術層へ渡す前に「snapshot とは何か」を論理契約として固定する。

FindingCode の具体値、コード番号、criterionId mapping、version 文字列表現、
SharePoint 保存先、runtime provider、TypeScript 実装、validator、fixture は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-3
Status: CANDIDATE / NOT ACCEPTED
Selected: NONE
Human substantive-unit selection: 2026-08-08
main baseline: 2988c8a6247d25720ecab8aba9176d47139f7a3b
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
Catalog ownership: Issue #8 / new business DEC
Delivery boundary: versioned immutable catalog snapshot input
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-fc-2-finding-code-catalog-delivery-boundary.md`](./decision-fc-2-finding-code-catalog-delivery-boundary.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`finding-identity-assembly.md`](./finding-identity-assembly.md)
- [`finding-stable-id.md`](./finding-stable-id.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

### Human unit selection（durable）

```text
Human selection: Decision-FC-3 as next substantive unit
Kind: catalog snapshot logical contract packet first（read-only / docs-only）
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent execution evidence: NOT Human Acceptance evidence
```

本 packet は logical contract 候補を固定する。Option の Accepted は別 Human Decision を要する。

## FC-1 / FC-2 から継承する固定境界

```text
Catalog ownership / change control:
  Issue #8 / new business DEC（FC-1 Option B）

Delivery boundary:
  versioned immutable catalog snapshot input（FC-2 Option C）

Repository ownership of catalog values:
  NO

Snapshot materialization / storage:
  UNDECIDED / separate technical decision

Runtime provider:
  UNDECIDED / separate technical decision

FindingCode:
  caller-supplied required input

Identity validation:
  isReasonCode only

Implicit catalog conversion:
  prohibited

FindingIdentity:
  UNCHANGED

stable Finding ID:
  UNCHANGED

assembleFindingIdentity:
  UNCHANGED
```

FC-3 は ownership も delivery boundary も変更しない。

`assembleFindingIdentity` に catalog lookup、code generation、criterionId mapping を追加しない。

## FC-3 が答える問い

FC-3 が決めるのは次である。

```text
versioned immutable catalog snapshot が、論理的に何を必須とし、
catalog version を誰の責務で一意に識別し、
immutable が何を意味し、
selected snapshot が満たすべき整合条件は何か。
また malformed / unknown / multiple snapshot を
正常 catalog とどこで fail-closed に分離するか。
```

FC-3 は、snapshot の物理 schema・保存先・provider・値一覧を決めない。

## 判断単位の分離（必須）

| Unit ID | 判断単位 | 本 packet での状態 | 混ぜてはならないもの |
|---|---|---|---|
| **Decision-FC-1** | catalog ownership / change control | **Accepted / Option B** | snapshot 論理契約 |
| **Decision-FC-2** | catalog delivery boundary | **Accepted / Option C** | snapshot 論理契約の中身 |
| **Decision-FC-3** | catalog snapshot **logical contract** | **OPEN / CANDIDATE** | version 文字列・schema・storage・provider・実装 |
| Identity 組立 | caller-supplied FindingCode 検証・組立 | **DONE / UNCHANGED** | catalog membership 判定の実装 |
| Snapshot materialization / storage / provider | 物理化・保存・供給 | **DO NOT START** | logical contract 自体 |
| FindingCode 値一覧 / 採番 / mapping | business catalog 本文 | **UNDECIDED** | FC-3 logical contract |

```text
Independent acceptance: REQUIRED
Bundle FC-3 + materialization / provider Accepted: FORBIDDEN
Bundle FC-3 + FindingCode values Accepted: FORBIDDEN
Bundle FC-3 + TypeScript / validator / fixture Accepted: FORBIDDEN
Order preference:
  FC-1 → FC-2 → FC-3 →（必要なら）materialization / schema / provider Entry Criteria
```

## Candidate Options

### Option A — Thin membership snapshot

snapshot の論理必須情報を最小化する。

```text
Required logical information:
  1. catalogVersionIdentifier（opaque）
  2. FindingCode membership set

Version uniqueness responsibility:
  catalogVersionIdentifier が catalog edition を一意に識別する

Immutable meaning:
  同一 catalogVersionIdentifier の membership set は変更しない
  改訂は新しい catalogVersionIdentifier を要する

Selected snapshot integrity:
  対象利用につき selected snapshot はちょうど 1 つ
  catalogVersionIdentifier が存在する
  membership set が定義されている

Fail-closed boundary（論理・Result名は未定義）:
  catalog unavailable
  catalog version missing
  catalog version unknown
  catalog malformed
  multiple selected / active snapshots
  FindingCode not present in selected catalog

Business provenance inside snapshot:
  NOT REQUIRED（ownership は FC-1 / Issue #8 側に残す）
```

利点: 技術層へ渡す表面が小さい。

欠点: どの business catalog edition を materialize したかの論理証跡を snapshot 自体が持たない。

### Option B — Membership + business provenance snapshot

Option A に、business ownership への論理参照を必須情報として加える。

```text
Required logical information:
  1. catalogVersionIdentifier（opaque）
  2. FindingCode membership set
  3. businessOwnershipRef
     （Issue #8 business catalog edition への論理参照。
      DEC 番号の推測採番はしない）

Version uniqueness responsibility:
  catalogVersionIdentifier が edition を一意に識別する
  businessOwnershipRef は ownership 証跡であり、version 代替にはしない

Immutable meaning:
  同一 catalogVersionIdentifier について
  membership set と businessOwnershipRef は変更しない
  改訂は新しい catalogVersionIdentifier を要する

Selected snapshot integrity:
  Option A に加え、businessOwnershipRef が存在する

Fail-closed boundary:
  Option A と同じ論理境界
  + provenance missing / malformed を malformed 系として分離可能

Business provenance inside snapshot:
  REQUIRED（論理参照のみ。保存場所・DEC番号表現は未決）
```

利点: delivery された snapshot が、FC-1 ownership へ辿れる。

欠点: provenance 表現を後続 schema で固定する必要が出る。DEC 番号未採番状態との接続を急がないこと。

### Option C — Complete logical contract surface

snapshot を「必須情報 + version 一意識別責務 + immutable の意味 + selected 整合 + fail-closed 境界」の
**一つの論理契約面**として固定する。

物理 schema / version 文字列 / storage / provider / 実装は後続とする。

```text
Required logical information:
  1. catalogVersionIdentifier（opaque; 形式は FC-3 で決めない）
  2. FindingCode membership set
     （その catalog edition に属する FindingCode の集合）
  3. businessOwnershipRef
     （Issue #8 business catalog edition への論理参照。
      DEC 番号・台帳採番は FC-3 で行わない）

Version uniqueness responsibility:
  catalogVersionIdentifier の発行・一意性は
  business catalog change control（Issue #8 DEC 側）の責務とする
  技術層は identifier を解釈・再採番・推定しない
  同一 identifier が異なる membership / provenance を指すことは禁止

Immutable meaning:
  ある catalogVersionIdentifier が一度有効な snapshot として確定したら、
  その identifier に対応する membership set と businessOwnershipRef は不変
  in-place 更新は禁止
  変更は新しい catalogVersionIdentifier の snapshot としてのみ行う
  技術層のコピー・再送は、同一 identifier の論理内容を改変してはならない

Selected snapshot integrity:
  catalog-dependent な技術操作につき selected snapshot はちょうど 1 つ
  selected snapshot は required logical information をすべて持つ
  catalogVersionIdentifier は missing / unknown ではない
  membership set は定義済みである（空集合可否は business catalog 側の別判断）
  selected は「利用時の選択状態」であり、
  永続 store 上の active フラグ設計そのものではない

Fail-closed boundary（正常 catalog と混同しない）:
  catalog unavailable
  catalog version missing
  catalog version unknown
  catalog malformed
  multiple selected / active snapshots
  FindingCode not present in selected catalog

Result names / types / schema:
  FC-3 では定義しない

Identity assembly:
  UNCHANGED
  membership 判定を assembleFindingIdentity へ混入しない
```

利点:

- FC-2 の delivery boundary が技術層へ何を保証して渡すかを固定できる。
- version 文字列・SharePoint・provider を先取りしない。
- fail-closed 境界を FC-2 後続要件から論理契約へ昇格できる。
- FindingIdentity / stable Finding ID を壊さない。

欠点:

- Accepted 後も materialization / schema / provider の別 Decision が必要。
- FindingCode 値一覧は依然 UNDECIDED。

### Option D — HOLD

catalog snapshot logical contract を現時点では採択しない。

```text
Decision-FC-3:
  HOLD

Snapshot schema / materialization / provider:
  DO NOT START

FindingCode catalog implementation:
  DO NOT START
```

## 比較

| 観点 | Option A | Option B | Option C | Option D |
|---|---|---|---|---|
| FC-1 ownership 維持 | Yes | Yes | Yes | Yes |
| FC-2 delivery boundary 維持 | Yes | Yes | Yes | Yes |
| snapshot 必須情報の固定 | 最小 | 中 | 完全論理面 | No |
| business provenance を snapshot 論理面へ含む | No | Yes | Yes | N/A |
| version 一意識別責務の明示 | 部分 | 部分 | Yes | No |
| immutable の意味の明示 | 部分 | 部分 | Yes | No |
| selected snapshot 整合の明示 | 部分 | 部分 | Yes | No |
| fail-closed 境界の契約化 | 列挙のみ | 列挙+provenance | 列挙を契約面へ昇格 | No |
| version 文字列を決める | No | No | No | No |
| SharePoint / provider を決める | No | No | No | No |
| FindingIdentity 変更 | No | No | No | No |
| Implementation Start | HOLD | HOLD | HOLD | HOLD |

## Agent recommendation（non-binding）

```text
Recommendation: Option C
Binding: NO
```

理由:

- FC-2 Option C の残責務のうち、まず「snapshot と呼ぶ対象」と技術層への保証を固定するのが順序として合理的。
- version 文字列・schema・storage・provider を混ぜずに、logical contract だけを分離できる。
- fail-closed 境界を後続 technical contract へ曖昧なまま残さない。
- FindingIdentity / stable Finding ID / caller-supplied FindingCode 境界を変更しない。
- FindingCode 値一覧・採番・mapping を発明しない。

この recommendation は Human Decision ではない。

## FC-3 で決めないこと

```text
FindingCode values: UNDECIDED
code numbering: UNDECIDED
criterionId mapping: UNDECIDED
Issue #8 FindingCode catalog DEC number: UNASSIGNED
actual catalog version string representation: UNDECIDED
snapshot physical schema: NOT STARTED
snapshot materialization: NOT STARTED
snapshot storage / SharePoint location: NOT STARTED / NO-GO
runtime provider: NOT STARTED
TypeScript enum / union / types: NOT STARTED
catalog validator: NOT STARTED
fixture: NOT STARTED
assembleFindingIdentity への membership 混入: PROHIBITED
Implementation Start: HOLD
```

AI は上記を補完しない。

## Contract compatibility gate

どの Option を選択しても、次を満たすことを必須とする。

```text
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FindingCode remains caller-supplied
isReasonCode remains structural validation boundary
No implicit code generation
No implicit criterionId mapping
No catalog fallback
No repository ownership of catalog values
FC-1 ownership: UNCHANGED
FC-2 delivery boundary: UNCHANGED
Contract break: NO
```

FC-3 Accepted を理由に既存 Identity 契約や FC-1 / FC-2 Accepted を変更してはならない。

## Acceptance 記録テンプレ

```text
Decision-FC-3:
  ACCEPTED | HOLD | REJECTED
Selected: A | B | C | D | (amended)

Required logical information:
  <list>

Version uniqueness responsibility:
  <one or more sentences>

Immutable meaning:
  <one or more sentences>

Selected snapshot integrity:
  <one or more sentences>

Fail-closed boundary:
  <list; Result names still UNDECIDED>

FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FC-1 / FC-2: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

## Human Decision Gate

```text
Decision-FC-3: CANDIDATE / NOT ACCEPTED
Selected: NONE
Independent Review: REQUIRED
Human Decision: REQUIRED
Implementation auto-start: FORBIDDEN
```

Independent Review が PASS しても、Option は自動採択しない。

Human が Option を明示選択するまで Candidate 状態を維持する。

## 実装ゲート

```text
Decision-FC-3: CANDIDATE / NOT ACCEPTED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN

src/** changes: prohibited
tests/** changes: prohibited
FindingCode values invention: prohibited
code numbering invention: prohibited
mapping invention: prohibited
version string invention: prohibited
TypeScript enum / union creation: prohibited
validator creation: prohibited
fixture creation: prohibited
SharePoint / storage / provider design as Accepted: prohibited
Issue #8 FindingCode DEC numbering by AI: prohibited
```

## 継続する境界

```text
FindingSeverity: NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
SharePoint changes: NO-GO
tenant changes: NO-GO
Microsoft 365 changes: NO-GO
Entra changes: NO-GO
deploy: NO-GO
real data: PROHIBITED
```

## 次の停止点

```text
Decision-FC-3: CANDIDATE / NOT ACCEPTED
→ Independent Review of this packet
→ Human Option selection
→（Accepted の場合のみ）後続 materialization / schema / provider は別 Human Start
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Independent Review が PASS しても、Ready / Merge / Implementation / Option 採択を自動実行しない。
