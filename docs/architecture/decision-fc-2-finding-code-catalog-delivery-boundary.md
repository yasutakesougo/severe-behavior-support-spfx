# Decision-FC-2 — FindingCode catalog delivery boundary candidate packet

この文書は、**Decision-FC-2**（FindingCode catalog delivery boundary）の Candidate Packet である。

Decision-FC-2 は、Issue #8 の business DEC が所有する FindingCode catalog を、技術層へどの境界で渡すかだけを扱う。

FindingCode の具体値、コード番号、criterionId mapping、TypeScript enum / union、validator、fixture、実装は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-2
Status: CANDIDATE / NOT ACCEPTED
Selected: NONE
Human substantive-unit selection: 2026-08-08
main baseline: 649a9778b7f5ab4758cc8e25be5f30c289430988
Depends on: Decision-FC-1 Accepted / Option B
Catalog ownership: Issue #8 / new business DEC
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
```

上位入口:

- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`finding-identity-assembly.md`](./finding-identity-assembly.md)
- [`finding-stable-id.md`](./finding-stable-id.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## FC-1 から継承する固定境界

Decision-FC-1 Accepted / Option B により、FindingCode catalog の ownership / change control は Issue #8 の business DEC に置く。

Decision-FC-2 は、この ownership を変更しない。

既存 FindingIdentity 組立契約も変更しない。

```text
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
```

したがって、FC-2 で catalog delivery を決めても、`assembleFindingIdentity` が catalog lookup、code generation、mapping を担当する形には変更しない。

## FC-2 が答える問い

FC-2 が決めるのは次の一点である。

```text
Issue #8 の Accepted business catalog を、
技術層が参照・検証できる形へ渡す境界をどこに置くか。
```

FC-2 は、catalog の内容そのものを決めない。

## Candidate Options

### Option A — Repository fixed catalog snapshot

Accepted business catalog を repository 内の versioned catalog snapshot として保持し、技術層はその snapshot を参照する。

```text
Business ownership:
  Issue #8 DEC

Delivery boundary:
  repository versioned catalog snapshot

Catalog values:
  FC-2では未定義

Physical format:
  FC-2では未定義
```

この方式では、技術層は repository に取り込まれた snapshot を基準にできる。

一方、catalog の変更を反映するたびに repository 更新が必要になる。

### Option B — Runtime external catalog provider

Accepted business catalog は repository の固定列挙へ取り込まず、実行時に catalog provider から技術層へ供給する。

```text
Business ownership:
  Issue #8 DEC

Delivery boundary:
  runtime catalog provider

Provider implementation:
  FC-2では未定義

Physical storage:
  FC-2では未定義
```

この方式では business catalog の変更と application code release を分離しやすい。

一方、provider の取得失敗、version 不明、複数 catalog の競合を fail-closed で扱う追加契約が必要になる。

### Option C — Versioned catalog snapshot input

Issue #8 の Accepted business catalog を、**version を持つ immutable catalog snapshot** として delivery boundary へ渡す。

repository は catalog 値そのものを ownership しない。

技術層は、取得済み snapshot を明示的な入力として利用する。

```text
Business ownership:
  Issue #8 DEC

Delivery boundary:
  versioned immutable catalog snapshot input

Catalog value ownership:
  Issue #8 DEC

Snapshot materialization / storage:
  separate technical decision

Runtime provider:
  optional / separate technical decision
```

この方式では、business ownership と technical delivery を分離しながら、判定・監査時に「どの catalog version を参照したか」を固定できる。

ただし、snapshot schema、version identifier、取得失敗時の Result、保存先は FC-2 の Accepted 後に別 Entry Criteria で決める必要がある。

### Option D — HOLD

delivery boundary を現時点では採択しない。

```text
Decision-FC-2:
  HOLD

FindingCode catalog implementation:
  DO NOT START
```

## 比較

| 観点 | Option A | Option B | Option C | Option D |
|---|---|---|---|---|
| Issue #8 business ownership維持 | Yes | Yes | Yes | Yes |
| catalog変更とcode releaseの分離 | Low | High | High | N/A |
| 判定時versionの固定 | 可能 | 追加契約が必要 | 境界に組み込みやすい | N/A |
| runtime取得失敗への依存 | Low | High | delivery実装次第 | N/A |
| repositoryへ値一覧を埋め込む必要 | Yes | No | No | No |
| FindingIdentity変更 | No | No | No | No |
| stable Finding ID変更 | No | No | No | No |
| SharePoint物理設計をFC-2で決める | No | No | No | No |

## Agent recommendation（non-binding）

```text
Recommendation: Option C
Binding: NO
```

理由:

- FC-1 で確定した Issue #8 の business ownership を維持できる。
- catalog 値を TypeScript enum や repository 固定列挙へ直結させずに済む。
- versioned snapshot を明示入力にすることで、将来の再現性・監査可能性を確保しやすい。
- SharePoint、外部provider、保存形式をこの Decision で先取りしない。
- FindingIdentity / stable Finding ID / caller-supplied FindingCode 境界を変更しない。

この recommendation は Human Decision ではない。

## FC-2 で決めないこと

```text
FindingCode values: UNDECIDED
code numbering: UNDECIDED
criterionId mapping: UNDECIDED
catalog DEC number: UNASSIGNED
catalog version identifier format: UNDECIDED
snapshot schema: NOT STARTED
provider interface: NOT STARTED
TypeScript enum / union: NOT STARTED
catalog validator: NOT STARTED
fixture: NOT STARTED
SharePoint list / column: NO-GO
M365 / Entra / tenant: NO-GO
Implementation Start: HOLD
```

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
```

FC-2 Accepted を理由に既存 Identity 契約を変更してはならない。

## fail-closed requirements

後続の technical contract では、少なくとも次を正常 catalog と混同しない必要がある。

```text
catalog unavailable
catalog version missing
catalog version unknown
catalog malformed
multiple active snapshots
FindingCode not present in selected catalog
```

これらの Result 名や型は FC-2 では定義しない。

## Human Decision Gate

```text
Decision-FC-2: CANDIDATE / NOT ACCEPTED
Selected: NONE
Independent Review: REQUIRED
Human Decision: REQUIRED
Implementation auto-start: FORBIDDEN
```

Independent Review が PASS しても、Option は自動採択しない。

Human が Option を明示選択するまで Candidate 状態を維持する。

## 変更禁止境界

```text
src/** changes: prohibited
tests/** changes: prohibited
FindingCode values invention: prohibited
code numbering invention: prohibited
mapping invention: prohibited
TypeScript enum / union creation: prohibited
validator creation: prohibited
fixture creation: prohibited
FindingSeverity / SEV-2-ASSIGN restart: prohibited
SharePoint changes: NO-GO
tenant changes: NO-GO
Microsoft 365 changes: NO-GO
Entra changes: NO-GO
deploy: NO-GO
real data: prohibited
Implementation auto-start: FORBIDDEN
```

## 次の停止点

```text
Decision-FC-2 Candidate Packet
→ Independent Review
→ Human FC-2 Decision
```

Human Decision 前に implementation、catalog 値定義、Issue #8 FindingCode DEC 採番へ進まない。
