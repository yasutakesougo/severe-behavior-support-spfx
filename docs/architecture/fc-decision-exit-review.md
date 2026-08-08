# FC Decision Exit Review

この文書は、**Decision-FC-1〜FC-6 Accepted 後**の残件棚卸しと Implementation Entry Criteria 定義の正本候補である。

Implementation Start ではない。FC-7 を作成しない。FindingCode 値・採番・mapping・DEC 番号・UUID/hash/semver を採択しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Document: FC Decision Exit Review
Status: REVIEWED / NOT IMPLEMENTATION START
Scope: FC-1〜FC-6 post-acceptance exit review
main baseline: 3301ccf14766adf32fdf4c695c0bd13ae48ea749
Decision-FC-1: Accepted / Option B
Decision-FC-2: Accepted / Option C
Decision-FC-3: Accepted / Option C
Decision-FC-4: Accepted / Option C
Decision-FC-5: Accepted / Option C
Decision-FC-6: Accepted / Option C
FC Decision continuation: NO AUTOMATIC FC-7
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Historical gate violation: CONFIRMED / CONTAINED / NOT ERASED
FindingSeverity: NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
```

Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)
- [`decision-fc-2-finding-code-catalog-delivery-boundary.md`](./decision-fc-2-finding-code-catalog-delivery-boundary.md)
- [`decision-fc-3-finding-code-catalog-snapshot-logical-contract.md`](./decision-fc-3-finding-code-catalog-snapshot-logical-contract.md)
- [`decision-fc-4-catalog-version-identifier-contract.md`](./decision-fc-4-catalog-version-identifier-contract.md)
- [`decision-fc-5-catalog-version-identifier-representation-ownership.md`](./decision-fc-5-catalog-version-identifier-representation-ownership.md)
- [`decision-fc-6-business-ownership-ref-logical-contract.md`](./decision-fc-6-business-ownership-ref-logical-contract.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

## Purpose

1. 残っている Human Decision の有限リストを固定する
2. Implementation Entry Criteria を定義する（充足判定はしない）

FindingCode 系 Decision をこれ以上機械的に細分化しない。
残件に FC-N 番号を自動採番しない。

## FC-1〜FC-6 Accepted（矛盾なし確認）

| ID | Selected | 固定した単位 | 実装許可 |
|---|---|---|---|
| FC-1 | Option B | FindingCode catalog ownership = Issue #8 new business DEC | HOLD |
| FC-2 | Option C | delivery = versioned immutable catalog snapshot input | HOLD |
| FC-3 | Option C | complete snapshot logical contract surface | HOLD |
| FC-4 | Option C | complete catalogVersionIdentifier logical contract | HOLD |
| FC-5 | Option C | representation strategy ownership + syntax-validation ceiling | HOLD |
| FC-6 | Option C | complete businessOwnershipRef logical contract | HOLD |

FC-6 Accepted 要約（参照のみ・再定義しない）:

```text
businessOwnershipRef: complete logical contract
required logical information:
  - ownershipLedgerRef
  - catalogEditionRef
  - optional acceptedRevisionRef
mapping:
  1 catalogVersionIdentifier ↔ 1 businessOwnershipRef
in-place rewrite: PROHIBITED
fail-closed: missing / malformed / unknown / mismatch
```

矛盾検査（Exit Review 時点）:

```text
FC-1〜FC-6: UNCHANGED / ACCEPTED
Identity assembly: UNCHANGED
FindingCode remains caller-supplied until business catalog Accepted
No identifier inference
No ownership-ref inference of catalog values
No FindingSeverity restart
Contract break: NO
```

## Classification principles

| Class | 意味 | 入れる条件 |
|---|---|---|
| **A** | Implementation 前に Human Decision 必須 | 業務意味 / 法人正本 ownership / 利用者支援上の分類 / business catalog 内容 / 技術だけでは安全に変更できない |
| **B** | Technical design として委任可能 | 業務意味を変えない / Accepted contract 内で複数方式可 / fail-closed・invariants を満たせばよい |
| **C** | Implementation 時に局所決定可 | 契約破壊しない内部分解。repository-wide durable Decision に昇格しない |
| **D** | 現時点不要 / HOLD | 前提未充足・別 Phase・実環境 Gate 待ち |

単なる技術選択を A にしない。
業務意味を変える選択を B にしない。

## Key determinations

### FindingCode business catalog values

**判定: A — Implementation 前 Human Decision 必須**

根拠:

- FC-1 Accepted は ownership / change-control（Issue #8 new DEC）のみを固定し、値一覧は OUT
- 値は利用者支援上の分類・業務意味そのもの
- 後から技術判断だけで変更すると Identity / snapshot / audit 追跡と衝突しうる
- AI / Agent による値補完は禁止

### catalogVersionIdentifier concrete representation strategy

（UUID / hash / semver / DEC-number 等）

**判定: A — Human Decision 必須（Issue #8 business DEC）**

根拠（FC-5 Accepted / Option C と整合）:

- FC-5 は representation strategy ownership を **Issue #8 business catalog change control** に置いた
- Business DEC responsibility に「UUID / hash / semver / DEC-number 等の representation strategy の採択」が含まれる
- technical layer は Accepted profile 前に UUID/hash/semver を仮定してはならない
- したがって strategy 選択自体は Technical design delegation（B）ではない

B に落ちるのは、strategy が Human Accepted された **後** の non-semantic syntax profile（charset / length / delimiter shape）だけである（FC-5: technical syntax profile change = separate technical Decision / contract amendment）。

本 Exit Review は strategy を採択しない。

## A-class — Human Decisions required before Implementation

有限リスト（FC-N 自動採番なし）:

| ID | 項目 | 根拠 | 正本 ownership 予定 |
|---|---|---|---|
| **A-1** | FindingCode business catalog values | 業務意味・分類そのもの。AI 補完禁止 | Issue #8 FindingCode business DEC 本文 |
| **A-2** | FindingCode numbering | カタログ採番規則は業務正本の一部 | Issue #8 FindingCode business DEC 本文 |
| **A-3** | criterionId mapping | FindingCode↔criterion の対応は業務意味 | Issue #8 FindingCode business DEC 本文 |
| **A-4** | Issue #8 FindingCode DEC number / ledger registration | 法人 DEC 台帳上の正本識別。FC-1 は方式のみ Accepted、番号 UNASSIGNED | Issue #8 ledger |
| **A-5** | catalogVersionIdentifier concrete representation strategy（UUID / hash / semver / DEC-number / other） | FC-5 により Issue #8 business DEC 所有。技術先取り禁止 | Issue #8 business DEC（representation strategy） |

注記:

- A-1〜A-3 は **1 つの Issue #8 FindingCode catalog DEC 本文** にまとめて Human 採択してよい（機械的に FC-7/FC-8… へ細分化しない）
- A-4 は台帳登録操作であり、値本文と同時でも、先行でもよいが Implementation Entry 前に確定が必要
- Historical pre-acceptance note: this Exit Review listed same-DEC and separate-Decision as structural options before the A-class structure was accepted.
- The later Human acceptance in [`a-class-structure-acceptance.md`](./a-class-structure-acceptance.md) is the current structural authority: **A-1〜A-4 bundle / A-5 separate**. This clarification does not reopen A-class content or select an A-5 representation strategy.
- FC-5 ownership remains with the Issue #8 business Decision; it is not transferred to the technical team.
- いずれも本 Exit Review では内容を発明・採択しない

```text
A-class count: 5
FindingCode values: UNDECIDED
FindingCode numbering: UNDECIDED
criterionId mapping: UNDECIDED
Issue #8 FindingCode DEC number: UNASSIGNED
catalogVersionIdentifier strategy: UNDECIDED / DO NOT SELECT in this review
```

## B-class — Delegated technical design

| ID | 項目 | 根拠 |
|---|---|---|
| **B-1** | identifier concrete syntax profile（Accepted strategy 後の non-semantic charset / length / delimiter） | FC-5 technical ceiling。業務 strategy を変えない |
| **B-2** | businessOwnershipRef physical representation（opaque encoding） | FC-6 は論理契約のみ固定。物理文字列は業務意味を増やさない範囲で技術設計可。DEC 番号の推測採番は禁止 |
| **B-3** | snapshot physical schema | FC-3 論理面の物理化。業務値を発明しない |
| **B-4** | snapshot materialization（synthetic / non-tenant） | delivery は FC-2 で固定済み。実 SharePoint 化は D |
| **B-5** | runtime provider interface（synthetic / test double） | 契約適合の供給口。実 tenant provider は D |
| **B-6** | storage boundary（logical / in-process / test） | 永続先の技術境界。SharePoint list 実体は D |
| **B-7** | TypeScript contract shapes | Accepted logical contract の型表現 |
| **B-8** | validator structure | fail-closed 実装構造。値一覧の発明禁止 |
| **B-9** | synthetic fixture structure | 合成データのみ。real data 禁止 |

```text
B-class count: 9
Delegation: implementation / design team may choose within Accepted FC-1〜FC-6 invariants
Must NOT invent FindingCode values / DEC numbers / representation strategy
```

## C-class — Implementation-time decisions

| ID | 項目 | 根拠 |
|---|---|---|
| **C-1** | internal helper naming | 契約面に現れない |
| **C-2** | file placement within existing package boundaries | 公開契約を変えない配置 |
| **C-3** | private function decomposition | 局所実装分解 |
| **C-4** | test case organization | 検証構造。fixture 内容の業務採択ではない |

```text
C-class count: 4
Do not promote to repository-wide durable Decision / FC-N
```

## D-class — HOLD / not required now

| ID | 項目 | 根拠 |
|---|---|---|
| **D-1** | SharePoint adapter（real） | 実環境 Gate / NO-GO |
| **D-2** | SharePoint site / list mapping（real） | tenant 依存。別 Gate |
| **D-3** | tenant / Microsoft 365 / Entra changes | 本番設定。承認必須・本線外 |
| **D-4** | deploy | リリース Gate |
| **D-5** | real data | PROHIBITED |
| **D-6** | FindingSeverity vocabulary / values / TypeScript / validator / fixture | NOT ADOPTED。再開禁止 |
| **D-7** | SEV-2-ASSIGN | N/A / DO NOT START |

```text
D-class count: 7
SharePoint / M365 / Entra / Deploy / real data: NO-GO
FindingSeverity: NOT ADOPTED / DO NOT CREATE
```

## Inventory coverage（minimum）

| 棚卸し項目 | Class |
|---|---|
| FindingCode business catalog values | A-1 |
| FindingCode numbering | A-2 |
| criterionId mapping | A-3 |
| Issue #8 FindingCode DEC number | A-4 |
| catalogVersionIdentifier concrete strategy | A-5 |
| UUID / hash / semver / DEC-number strategy | A-5（同義・採択しない） |
| identifier concrete syntax profile | B-1（strategy Accepted 後） |
| businessOwnershipRef physical representation | B-2 |
| snapshot physical schema | B-3 |
| snapshot materialization | B-4（synthetic） / D-1〜D-2（real SP） |
| runtime provider | B-5（synthetic） / D-1（real） |
| storage boundary | B-6（logical/test） / D-2（real list） |
| TypeScript contract | B-7 |
| validator | B-8 |
| fixture | B-9 |
| SharePoint adapter | D-1 |
| SharePoint site/list mapping | D-2 |
| tenant / M365 / Entra | D-3 |
| deploy | D-4 |
| real data | D-5 |

## FC Decision continuation

```text
FC Decision continuation: NO AUTOMATIC FC-7
FC-7 candidate creation: FORBIDDEN
FC-7 numbering: FORBIDDEN
Further mechanical FC subdivision: FORBIDDEN
```

残 Human Decision は A-1〜A-5 の有限リストとして扱う。
必要なら Issue #8 DEC 本文へ集約する。FC 連番を増やさない。

## Implementation Entry Criteria

**定義のみ。本文書は充足を自動判定しない。**

```text
Implementation Entry Criteria: DEFINED
Implementation Entry satisfaction: NOT EVALUATED / NOT CLAIMED
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Checklist（すべて Human が別途確認するまで未充足扱い）:

1. FC-1〜FC-6 Accepted canonical が main に存在する
2. FindingCode business catalog values の Human authority が確定している（A-1 Accepted / recorded on Issue #8）
3. 必須 A-class Decisions（A-1〜A-5）が Accepted または明示的に当該実装 slice 対象外と Human 記録されている
4. B-class technical choices は delegated と明記され、業務値・strategy を先取りしていない
5. unresolved contract contradiction が無い
6. FindingSeverity restart が無い（NOT ADOPTED 維持）
7. implicit catalog conversion が無い
8. identifier inference が無い
9. ownership-ref inference of catalog values が無い
10. fixtures は synthetic only
11. SharePoint / tenant / M365 / Entra / Deploy は別 Gate / NO-GO
12. Historical gate violation は CONFIRMED / CONTAINED / NOT ERASED（消さない）

Entry Criteria を満たしたという判定は **別 Human Decision** とする。

## Explicit prohibitions（this review）

```text
FC-7: NOT CREATED
new business values invention: FORBIDDEN
FindingCode values selection: FORBIDDEN
FindingCode numbering selection: FORBIDDEN
criterionId mapping invention: FORBIDDEN
DEC number invention: FORBIDDEN
UUID / hash / semver selection: FORBIDDEN
TypeScript / validator / fixture implementation: FORBIDDEN
src/** changes: FORBIDDEN
tests/** changes: FORBIDDEN
SharePoint / tenant / M365 / Entra / Deploy / real data: NO-GO
```

## Exit criteria（FC Decision 系終了可能条件）

FC Decision 機械連番を終了可能と判定する条件:

1. FC-1〜FC-6 Accepted に矛盾がない — **本レビューで確認**
2. 残 Human Decisions が有限リスト化されている — **A-1〜A-5**
3. 各残件が A/B/C/D に分類されている — **完了**
4. Implementation Entry Criteria が明文化されている — **DEFINED**
5. FC-7 自動開始が禁止されている — **FORBIDDEN**
6. FindingCode values の AI 補完が禁止されている — **FORBIDDEN**
7. Implementation Start は引き続き HOLD — **HOLD**

Exit Review 自体の Accepted 化、A-class の処理順、Entry Criteria 充足判定は **別 Human Decision**。

## 次の停止点

```text
FC Decision Exit Review: REVIEWED / NOT IMPLEMENTATION START
→ Independent Review of this document
→ Human Exit Review Decision（Accepted とするか）
→ Human chooses which A-class Decision to process first
→ Human judges Implementation Entry Criteria satisfaction（別）
Implementation Start: HOLD
FC-7: NOT CREATED
```

Independent Review が PASS しても Implementation Start に進まない。
