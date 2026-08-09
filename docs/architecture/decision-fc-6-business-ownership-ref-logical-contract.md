# Decision-FC-6 — businessOwnershipRef logical contract

この文書は、**Decision-FC-6**（businessOwnershipRef logical contract）の Accepted 正本である。

Decision-FC-6 は、Decision-FC-3 Accepted / Option C が必須とした `businessOwnershipRef` について、論理契約だけを固定する。

Issue #8 FindingCode catalog DEC 番号、DEC 本文の値一覧、採番、mapping、
UUID / hash / semver / DEC-number strategy、実際の identifier 値、
ownership ref の物理文字列形式、snapshot physical schema、storage / provider、
TypeScript、validator、fixture は扱わない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FC-6
Status: Accepted
Selected: Option C
Human Acceptance: Explicit Human Option C selection on 2026-08-08
Human candidate reconstruction GO: Explicit Human FC-6 candidate reconstruction GO on 2026-08-08
main baseline: 9aced447c40bd18b698a590142aa17be79c2529c
Candidate reconstitution HEAD: 5f2ba2c9e154199315104bfb7f350c99846d39cd
Stale PR #126 HEAD: c66a6708d8b70f4512d1ff6b03ba2f9646e08409
Historical gate violation: CONFIRMED / CONTAINED / NOT ERASED
Depends on:
  Decision-FC-1 Accepted / Option B
  Decision-FC-2 Accepted / Option C
  Decision-FC-3 Accepted / Option C
  Decision-FC-4 Accepted / Option C
  Decision-FC-5 Accepted / Option C
    Human Acceptance: Explicit Human Option C selection on 2026-08-08
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Identity assembly: UNCHANGED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit Human Option C selection on 2026-08-08
Decision-FC-6: Accepted
Selected: Option C
Logical contract: Complete businessOwnershipRef logical contract
Implementation Start: HOLD
```

```text
Agent recommendation: Option C
Binding: NO
Agent recommendation is not Human Acceptance evidence.
```

Stale PR #126 上の旧 candidate / 旧 baseline は Human Acceptance evidence として再利用しない。
今回の `Explicit Human Option C selection on 2026-08-08` を、再構成後 packet に対する Human Acceptance evidence とする。

## Accepted 内容

Option C — **Complete businessOwnershipRef logical contract** を採択する。

`businessOwnershipRef` は、次の論理面を一体として満たす。

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

catalogVersionIdentifier ↔ businessOwnershipRef:
  same identifier MUST NOT point to different businessOwnershipRef（FC-3 / FC-4）

Representation strategy ownership:
  Issue #8 business DEC（FC-5 Option C）

Technical syntax validation:
  non-semantic ceiling only after Accepted profile（FC-5）

FindingIdentity / stable Finding ID / assembleFindingIdentity:
  UNCHANGED
```

FC-6 Accepted は ownership / delivery / snapshot / identifier / representation ownership を変更しない。

## FC-6 で決めていないこと

```text
Issue #8 FindingCode catalog DEC number: 後続 Human Decision で DEC-019
DEC ledger write: POSTED（Issue #8 comment 5229477058）
FindingCode values: 本 Decision では未決。後続 DEC-019 で NONE
code numbering: 本 Decision では未決。後続 DEC-019 で NOT APPLICABLE
criterionId mapping: 本 Decision では未決。後続 DEC-019 で NOT APPLICABLE
Finding catalog: EMPTY / NOT ADOPTED
A-5: OUT（本 DEC-019 scope。representation strategy は別 Decision / DO NOT START）
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

## Implementation Gate

FC-6 Accepted は Implementation Start ではない。

```text
Decision-FC-6: Accepted / Option C
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
Decision-FC-6: Accepted / Option C
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
→ Independent Re-review on Accepted HEAD
→ Human Ready Decision — separate
→ Human Merge Decision — separate
→ DEC 本文 / representation strategy / materialization は別 Human Start
```

Independent Re-review が PASS しても、Ready / Merge / Implementation を自動実行しない。
Stale PR #126 を Ready / Merge しない。
