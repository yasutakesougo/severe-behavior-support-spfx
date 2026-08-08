# Decision-FC-4 — Catalog version identifier contract candidate packet

この文書は、**Decision-FC-4**（Catalog version identifier contract）の Candidate Packet である。

Decision-FC-4 は、Decision-FC-3 Accepted / Option C が必須とした `catalogVersionIdentifier` について、論理契約だけを扱う。

実際の identifier 値、DEC 番号の自動採番、UUID / hash / semver 等の具体方式、snapshot physical schema、SharePoint storage、provider、TypeScript、validator、fixture、FindingCode values / numbering / mapping は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-4
Status: CANDIDATE / NOT ACCEPTED
Selected: NONE
Human substantive-unit selection: 2026-08-08
main baseline: 816ba40549e4650cde90e83391b7e44ff39bd705
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
  Decision-FC-3 Accepted / Option C
Catalog ownership: Issue #8 / new business DEC
Delivery boundary: versioned immutable catalog snapshot input
Snapshot logical contract: Complete logical contract surface
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

## FC-1〜FC-3 から継承する固定境界

```text
catalogVersionIdentifier:
  required logical information
  opaque to technical layer

identifier issuance / uniqueness:
  business catalog change control（Issue #8 DEC side）

technical layer:
  MUST NOT interpret
  MUST NOT re-number
  MUST NOT infer

same identifier with different logical content:
  PROHIBITED

catalog revision:
  new identifier required
```

Decision-FC-4 は FindingIdentity、stable Finding ID、`assembleFindingIdentity` を変更しない。

## FC-4 が答える問い

```text
catalogVersionIdentifier は、どの論理条件を満たせば
安全な version identifier として扱えるか。
```

対象は次の5点に限定する。

1. 一意性条件
2. opaque identifier として扱う境界
3. business catalog edition との対応責務
4. identifier reuse 禁止
5. missing / malformed / duplicate の fail-closed 境界

## Candidate Options

### Option A — Minimal opaque uniqueness contract

```text
Uniqueness:
  各 business catalog edition に対して一意

Opaque boundary:
  technical layer は値の構造を解釈しない

Edition relation:
  identifier は1つの business catalog edition を指す

Reuse:
  異なる edition への再利用は禁止

Fail-closed:
  missing
  malformed
  duplicate
```

利点は契約面が最小であること。

一方、同一 edition への複数 identifier 発行や historical stability の扱いは弱い。

### Option B — Stable edition identity contract

Option A に加え、business catalog edition と identifier の対応を安定させる。

```text
Edition → identifier:
  one-to-one

Same edition:
  新 identifier への置換禁止

Different edition:
  同一 identifier 再利用禁止

Historical stability:
  一度採択済みの対応は後から変更しない
```

利点は edition と identifier の対応を後から追跡しやすいこと。

一方、identifier 発行責務と fail-closed 条件の詳細はまだ分散する。

### Option C — Complete identifier logical contract

Option B を含み、identifier の安全条件を一つの論理契約として固定する。

```text
Uniqueness:
  identifier は全 catalog edition 空間で一意

Edition mapping:
  1 catalog edition ↔ 1 identifier

Issuance responsibility:
  Issue #8 business catalog change control

Opaque boundary:
  technical layer は identifier の内部表現を解釈しない
  technical layer は identifier を生成・再採番・推定しない

Reuse:
  prohibited across editions

Mutation:
  once associated, edition ↔ identifier relation is immutable

Fail-closed:
  identifier missing
  identifier malformed
  identifier unknown
  duplicate identifier
  same identifier mapped to different edition
  same edition mapped to multiple identifiers
```

実際の文字列表現や生成方式は本 Decision では決めない。

### Option D — HOLD

```text
Decision-FC-4:
  HOLD

Identifier physical representation:
  DO NOT START

Implementation:
  DO NOT START
```

## 比較

| 観点 | Option A | Option B | Option C | Option D |
|---|---|---|---|---|
| opaque boundary | Yes | Yes | Yes | N/A |
| editionとの一意対応 | 部分 | Yes | Yes | No |
| historical stability | 弱い | Yes | Yes | No |
| reuse禁止 | Yes | Yes | Yes | No |
| fail-closed契約 | 最小 | 中 | 完全論理面 | No |
| 具体identifier方式を決める | No | No | No | No |
| Implementation Start | HOLD | HOLD | HOLD | HOLD |

## Agent recommendation（non-binding）

```text
Recommendation: Option C
Binding: NO
```

理由:

- FC-3 の complete logical contract と整合する。
- identifier の一意性・再利用禁止・edition 対応・fail-closed を分散させずに固定できる。
- UUID / hash / semver / DEC番号などの物理方式を先取りしない。
- technical layer が identifier を解釈・推定しない境界を維持できる。

この recommendation は Human Decision ではない。

## FC-4 で決めないこと

```text
actual identifier values: UNDECIDED
identifier syntax / string representation: UNDECIDED
UUID / hash / semver / DEC-number strategy: UNDECIDED
Issue #8 FindingCode DEC number: UNASSIGNED
snapshot physical schema: NOT STARTED
snapshot materialization: NOT STARTED
snapshot storage / SharePoint location: NOT STARTED / NO-GO
runtime provider: NOT STARTED
TypeScript type: NOT STARTED
validator: NOT STARTED
fixture: NOT STARTED
FindingCode values: UNDECIDED
code numbering: UNDECIDED
criterionId mapping: UNDECIDED
Implementation Start: HOLD
```

AI は上記を補完しない。

## Contract compatibility gate

```text
Decision-FC-1: UNCHANGED
Decision-FC-2: UNCHANGED
Decision-FC-3: UNCHANGED
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
assembleFindingIdentity: UNCHANGED
FindingCode remains caller-supplied
No implicit code generation
No identifier inference
No identifier fallback
Contract break: NO
```

## Human Decision Gate

```text
Decision-FC-4: CANDIDATE / NOT ACCEPTED
Selected: NONE
Independent Review: REQUIRED
Human Decision: REQUIRED
Implementation auto-start: FORBIDDEN
```

Independent Review が PASS しても Option を自動採択しない。

## 変更禁止境界

```text
src/** changes: prohibited
tests/** changes: prohibited
identifier value invention: prohibited
identifier format selection: prohibited
DEC numbering by AI: prohibited
snapshot schema creation: prohibited
provider implementation: prohibited
storage implementation: prohibited
TypeScript type creation: prohibited
validator creation: prohibited
fixture creation: prohibited
FindingCode value invention: prohibited
SharePoint / tenant / Microsoft 365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

## 次の停止点

```text
Decision-FC-4 Candidate Packet
→ Independent Review
→ Human FC-4 Decision
```
