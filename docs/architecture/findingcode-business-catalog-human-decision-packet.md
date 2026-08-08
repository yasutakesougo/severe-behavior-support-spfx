# FindingCode business catalog — Human Decision Packet

この文書は、A-1〜A-4 を 1 つの FindingCode business catalog Decision として Human が判断するための候補整理である。

この文書は業務 catalog の値を定義しない。

Agent は FindingCode values、numbering、criterionId mapping、Issue #8 DEC number を発明しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main baseline: 15696643d656afc9264f6950e8814b86d985082a
A-class structure: ACCEPTED
Bundle: A-1〜A-4 = one FindingCode business catalog Decision
Separate: A-5 = catalogVersionIdentifier representation strategy
Content acceptance: NO
Implementation Start: HOLD
FC-7: NOT CREATED
```

## Human Decision の対象

この Decision では、次の 4 項目を一体で確定する。

```text
A-1 FindingCode business catalog values
A-2 FindingCode numbering
A-3 criterionId mapping
A-4 Issue #8 DEC number / ledger registration
```

A-5 representation strategy は別 Decision とする。

## 現在確認できる一次情報

Issue #8 は Canonical Decision Ledger である。

Issue #8 では、未回答項目を実装時に暗黙補完しないことが固定されている。

Issue #8 の既存 Decision Records と comments には、今回必要な FindingCode values、numbering、criterionId mapping の正式な値一覧は確認できない。

したがって、Agent が既存語彙から値を類推して catalog を作成してはならない。

## Human が提示する必要がある情報

### A-1 FindingCode values

Human は採用する FindingCode の全件を提示する。

各値には少なくとも次を対応させる。

```text
FindingCode
business meaning / label
criterionId
status: active | retired
```

`active | retired` は管理上の状態欄の候補名であり、実際の採択値を意味しない。

状態表現を採用しない場合は Human が明示する。

### A-2 numbering

Human は FindingCode の採番規則を決める。

最低限、次を明示する。

```text
code uniqueness scope
reuse policy after retirement
new-code assignment authority
ordering semantics: semantic | non-semantic
```

Agent は連番、桁数、prefix、欠番処理を補完しない。

### A-3 criterionId mapping

Human は各 FindingCode と criterionId の対応を確定する。

最低限、次を明示する。

```text
FindingCode -> criterionId
one-to-one / one-to-many / many-to-one の許否
criterionId change policy
mapping conflict handling
```

既存 contracts から意味を推定して mapping を作らない。

### A-4 Issue #8 DEC / ledger registration

Human は FindingCode business catalog Decision を Issue #8 の新規 DEC として登録する。

DEC number は Human / ledger process が確定する。

Agent は DEC 番号を採番しない。

登録時に最低限、次を残す。

```text
Status: Accepted
Decision date
Human decision evidence
FindingCode values
numbering rule
criterionId mapping
change-control owner
```

## Acceptance conditions

A-1〜A-4 bundle を Accepted とできるのは、次がすべて Human により明示された場合だけとする。

```text
1. FindingCode values が全件確定している
2. numbering rule が確定している
3. criterionId mapping が全件確定している
4. Issue #8 DEC / ledger registration が確定している
5. Agent が値・番号・mapping を補完していない
```

1 件でも未確定なら bundle 全体を Accepted にしない。

## Fail-closed boundary

```text
missing FindingCode value list -> HOLD
missing numbering rule -> HOLD
missing criterionId mapping -> HOLD
missing ledger registration -> HOLD
conflicting Human sources -> HOLD
Agent-derived value / number / mapping -> REJECT AS EVIDENCE
```

## この Decision で決めないもの

```text
A-5 catalogVersionIdentifier representation strategy
UUID / hash / semver selection
identifier concrete syntax profile
businessOwnershipRef physical representation
snapshot physical schema
runtime provider
TypeScript
validator
fixture
SharePoint adapter
SharePoint site/list mapping
tenant / M365 / Entra
Deploy
real data
FindingSeverity
SEV-2-ASSIGN
```

## Implementation boundary

```text
Implementation Entry satisfaction: NOT EVALUATED / NOT CLAIMED
Implementation Start: HOLD
src/** changes: FORBIDDEN in this Decision packet
tests/** changes: FORBIDDEN in this Decision packet
```

## 次の停止点

```text
FindingCode business catalog content:
HUMAN INPUT REQUIRED

Required Human input:
- A-1 FindingCode values
- A-2 numbering rule
- A-3 criterionId mapping
- A-4 Issue #8 DEC / ledger registration decision

A-5:
HOLD / SEPARATE

Implementation Start:
HOLD
```
