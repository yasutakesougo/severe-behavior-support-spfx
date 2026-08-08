# Decision-FC-6 — businessOwnershipRef logical contract candidate packet

この文書は、**Decision-FC-6**（businessOwnershipRef logical contract）の
**Candidate Packet** である。Accepted 正本ではない。

Decision-FC-6 は、Decision-FC-3 Accepted / Option C が必須とした
`businessOwnershipRef` について、論理契約だけを扱う。

Issue #8 FindingCode catalog DEC 番号、DEC 本文の値一覧、採番、mapping、
UUID / hash / semver / DEC-number strategy、実際の identifier 値、
snapshot physical schema、storage / provider、TypeScript、validator、fixture は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-6
Status: CANDIDATE / NOT ACCEPTED
Selected: NONE
Human candidate reconstruction GO: Explicit Human FC-6 candidate reconstruction GO on 2026-08-08
main baseline: 9aced447c40bd18b698a590142aa17be79c2529c
Stale PR #126 HEAD: c66a6708d8b70f4512d1ff6b03ba2f9646e08409
Stale baseline (DO NOT REUSE as current main): 25347e78e926d14c5efacd4111961c1872e5b7ea
Historical gate violation: CONFIRMED / CONTAINED / NOT ERASED
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
  Decision-FC-3 Accepted / Option C
  Decision-FC-4 Accepted / Option C
  Decision-FC-5 Accepted / Option C
    Human Acceptance: Explicit Human Option C selection on 2026-08-08
Catalog ownership: Issue #8 / new business DEC
Delivery boundary: versioned immutable catalog snapshot input
Snapshot logical contract: Complete logical contract surface
Identifier logical contract: Complete identifier logical contract
Representation ownership: Split ownership with explicit syntax-validation ceiling
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-fc-3-finding-code-catalog-snapshot-logical-contract.md`](./decision-fc-3-finding-code-catalog-snapshot-logical-contract.md)
- [`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md)
- [`decision-fc-5-catalog-version-identifier-representation-ownership.md`](./decision-fc-5-catalog-version-identifier-representation-ownership.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

### Reconstruction provenance

```text
Reconstruction basis: main 9aced447c40bd18b698a590142aa17be79c2529c
Human GO consumed: Explicit Human FC-6 candidate reconstruction GO on 2026-08-08
GO scope: docs-only Candidate Packet reconstitution only
GO does NOT accept an Option
GO does NOT start Implementation
Stale PR #126: superseded for reconstitution; do not merge as-is
Previous Option C / FC-5 invalid Accept path: NOT reused as FC-6 evidence
Historical gate violation: CONFIRMED / CONTAINED / NOT ERASED
```

### Human unit selection（durable）

```text
Human selection: Decision-FC-6 as next substantive unit
Kind: businessOwnershipRef logical contract packet first（read-only / docs-only）
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Agent execution evidence: NOT Human Acceptance evidence
Agent recommendation: NOT Human Option selection
```

本 packet は `businessOwnershipRef` 論理契約候補を、復旧後の真正 FC-5 Accepted 正本の上で再固定する。
Option の Accepted は別 Human Decision を要する。

## FC-1〜FC-5 から継承する固定境界

```text
Catalog ownership / change control:
  Issue #8 / new business DEC（FC-1 Option B）

Delivery boundary:
  versioned immutable catalog snapshot input（FC-2 Option C）

Required logical information includes:
  catalogVersionIdentifier
  FindingCode membership set
  businessOwnershipRef（FC-3 Option C）

businessOwnershipRef:
  Issue #8 business catalog edition への論理参照
  DEC 番号の推測採番はしない（FC-3）

catalogVersionIdentifier ↔ businessOwnershipRef:
  same identifier MUST NOT point to different businessOwnershipRef（FC-3 / FC-4）

Representation strategy ownership:
  Issue #8 business DEC（FC-5 Option C）

Technical syntax validation:
  non-semantic ceiling only after Accepted profile（FC-5）

FindingIdentity / stable Finding ID / assembleFindingIdentity:
  UNCHANGED
```

FC-6 は ownership / delivery / snapshot / identifier / representation ownership を変更しない。

## FC-6 が答える問い

```text
businessOwnershipRef は、論理的に何を必須とし、
catalogVersionIdentifier および catalog edition とどう対応し、
immutable が何を意味し、
missing / malformed / unknown / mismatch を
どこで fail-closed に分離するか。
```

FC-6 は、DEC 番号・台帳採番・物理 schema・identifier 方式を決めない。

## 判断単位の分離（必須）

| Unit ID | 判断単位 | 本 packet での状態 | 混ぜてはならないもの |
|---|---|---|---|
| **Decision-FC-3** | snapshot logical contract | **Accepted / Option C** | businessOwnershipRef の中身 |
| **Decision-FC-6** | **businessOwnershipRef logical contract** | **OPEN / CANDIDATE** | DEC 番号採番・値一覧・schema |
| Representation strategy | UUID / hash / semver / DEC-number | **DO NOT START** | ownership ref 契約 |
| Issue #8 FindingCode DEC 本文 | 値一覧 / 採番 / mapping | **UNDECIDED** | FC-6 |
| Snapshot materialization / schema / provider | 物理化・保存・供給 | **DO NOT START** | FC-6 |

```text
Independent acceptance: REQUIRED
Bundle FC-6 + DEC numbering Accepted: FORBIDDEN
Bundle FC-6 + FindingCode values Accepted: FORBIDDEN
Bundle FC-6 + schema / provider Accepted: FORBIDDEN
Order preference:
  FC-3 → FC-6 →（必要なら）Issue #8 DEC 本文 / representation strategy / materialization
```

## Candidate Options

### Option A — Thin ownership pointer

`businessOwnershipRef` を最小の ownership 指示子として扱う。

```text
Required logical information:
  ownership ledger identity（Issue #8 business catalog DEC 台帳への参照）
  catalog edition identity（opaque; DEC 番号表現は未決）

Relation to catalogVersionIdentifier:
  present alongside identifier
  mismatch detection is optional / deferred

Immutable meaning:
  once paired with a catalogVersionIdentifier, must not be rewritten in place

Fail-closed:
  business provenance missing / malformed（FC-3 継承）
  unknown ownership ledger: deferred
```

利点: 契約面が小さい。

欠点: edition 対応や mismatch fail-closed が弱く、監査追跡が薄い。

### Option B — Edition-bound ownership reference

Option A に加え、catalog edition との一意対応を必須化する。

```text
Required logical information:
  ownership ledger identity
  catalog edition identity

Edition mapping:
  1 catalog edition ↔ 1 businessOwnershipRef meaning
  same edition MUST NOT carry conflicting ownership refs

Relation to catalogVersionIdentifier:
  1 catalogVersionIdentifier ↔ 1 businessOwnershipRef
  mismatch is fail-closed

Immutable meaning:
  identifier / membership / businessOwnershipRef は一体で不変（FC-3 継承を明確化）

Fail-closed:
  provenance missing / malformed
  ownership ref unknown
  ownership ref mismatched to selected identifier / edition
```

利点: FC-3 / FC-4 の immutability・一意対応と整合しやすい。

欠点: ownership ref の「十分な論理内容」や ledger 未採番状態の扱いがまだ粗い。

### Option C — Complete businessOwnershipRef logical contract

Option B を含み、必須情報・対応責務・immutable・fail-closed を一つの論理契約面として固定する。

```text
Required logical information:
  1. ownershipLedgerRef
     （Issue #8 business catalog change-control ledger への論理参照。
      DEC 番号の推測採番はしない）
  2. catalogEditionRef
     （その snapshot が materialize する business catalog edition の論理参照。
      物理文字列・DEC 番号表現は未決）
  3. optional acceptedRevisionRef
     （採択改訂を区別する必要がある場合のみ。
      本 Decision では必須化しないが、使うなら opaque / immutable）

Correspondence responsibility:
  businessOwnershipRef は Issue #8 business catalog edition を指す
  technical layer は ownership ref から DEC 番号や値一覧を推定しない
  technical layer は ownership ref を生成・再採番しない

Relation to catalogVersionIdentifier:
  1 catalogVersionIdentifier ↔ 1 businessOwnershipRef
  same identifier with different businessOwnershipRef: PROHIBITED
  same businessOwnershipRef logical content with conflicting membership
    under one identifier: PROHIBITED（FC-3 / FC-4 継承）

Immutable meaning:
  once a catalogVersionIdentifier is established,
  its businessOwnershipRef logical content is immutable
  in-place rewrite: PROHIBITED
  catalog revision: new catalogVersionIdentifier required

Selected snapshot integrity:
  selected snapshot の businessOwnershipRef は present
  ownershipLedgerRef / catalogEditionRef は defined
  selected identifier と ownership ref は矛盾しない

Fail-closed boundary:
  business provenance missing
  business provenance malformed
  ownership ledger unknown
  catalog edition unknown
  ownership ref mismatched to selected catalogVersionIdentifier
  ownership ref mismatched to membership set provenance
```

物理 schema、DEC 番号、Issue #8 台帳追記手順の実装は本 Decision では決めない。

### Option D — HOLD

`businessOwnershipRef` 論理契約を現時点では採択しない。

```text
Decision-FC-6:
  HOLD

Issue #8 FindingCode DEC numbering / values:
  DO NOT START

Implementation:
  DO NOT START
```

## 比較

| 観点 | Option A | Option B | Option C | Option D |
|---|---|---|---|---|
| FC-3 required field を具体化 | 最小 | 中 | 完全論理面 | No |
| identifier との一意対応 | 弱い | Yes | Yes | No |
| immutable の明示 | 部分 | Yes | Yes | No |
| fail-closed の契約化 | 最小 | 中 | Yes | No |
| DEC 番号を今決める | No | No | No | No |
| FindingCode 値を今決める | No | No | No | No |
| UUID/hash/semver を今決める | No | No | No | No |
| Implementation Start | HOLD | HOLD | HOLD | HOLD |

## Agent recommendation（non-binding）

```text
Recommendation: Option C
Binding: NO
```

理由:

- FC-3 が必須化した `businessOwnershipRef` を、値一覧や DEC 採番へ進まずに論理契約化できる。
- FC-4 の identifier 一意対応・immutable と矛盾しない。
- FC-5 の representation ownership とも分離できる。
- technical layer が ownership ref から DEC 番号や catalog 値を推定する失敗モードを防げる。
- schema / storage / provider / 実装を先取りしない。

この recommendation は Human Decision ではない。

## FC-6 で決めないこと

```text
Issue #8 FindingCode catalog DEC number: UNASSIGNED
DEC ledger write procedure details: NOT STARTED
FindingCode values: UNDECIDED
code numbering: UNDECIDED
criterionId mapping: UNDECIDED
UUID / hash / semver / DEC-number strategy: UNDECIDED / DO NOT START
actual identifier values: UNDECIDED
ownership ref physical string format: UNDECIDED
snapshot physical schema: NOT STARTED
snapshot materialization: NOT STARTED
snapshot storage / SharePoint location: NOT STARTED / NO-GO
runtime provider: NOT STARTED
TypeScript type: NOT STARTED
validator: NOT STARTED
fixture: NOT STARTED
Implementation Start: HOLD
```

AI は上記を補完しない。

## Contract compatibility gate

どの Option を選択しても、次を満たすことを必須とする。

```text
Decision-FC-1: UNCHANGED
Decision-FC-2: UNCHANGED
Decision-FC-3: UNCHANGED
Decision-FC-4: UNCHANGED
Decision-FC-5: UNCHANGED
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FindingCode remains caller-supplied
No DEC number invention
No FindingCode value invention
No identifier inference
No ownership-ref inference of catalog values
No catalog fallback
Contract break: NO
```

## Acceptance 記録テンプレ

```text
Decision-FC-6:
  ACCEPTED | HOLD | REJECTED
Selected: A | B | C | D | (amended)

Required logical information:
  <list>

Correspondence responsibility:
  <one or more sentences>

Immutable meaning:
  <one or more sentences>

Fail-closed boundary:
  <list; Result names still UNDECIDED>

FindingIdentity: UNCHANGED
FC-1〜FC-5: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

## Human Decision Gate

```text
Decision-FC-6: CANDIDATE / NOT ACCEPTED
Selected: NONE
Independent Review: REQUIRED
Human Decision: REQUIRED
Implementation auto-start: FORBIDDEN
```

Independent Review が PASS しても、Option は自動採択しない。

## 実装ゲート

```text
Decision-FC-6: CANDIDATE / NOT ACCEPTED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN

src/** changes: prohibited
tests/** changes: prohibited
DEC numbering by AI: prohibited
FindingCode value invention: prohibited
UUID / hash / semver selection: prohibited
snapshot schema creation: prohibited
provider implementation: prohibited
storage implementation: prohibited
TypeScript type creation: prohibited
validator creation: prohibited
fixture creation: prohibited
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
Decision-FC-6: CANDIDATE / NOT ACCEPTED
Selected: NONE
→ Independent Review of this reconstituted packet
→ Human Option selection（A/B/C/D）— separate Human Decision
→ Accepted 化 — separate Human Decision
→ Implementation Start — separate Human Decision
→（Accepted の場合のみ）DEC 本文 / representation strategy / materialization は別 Human Start
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Independent Review が PASS しても、Ready / Merge / Implementation / Option 採択 / Accepted 化を自動実行しない。
Stale PR #126 を Ready / Merge しない。
