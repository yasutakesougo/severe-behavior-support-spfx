# Decision-SEV-2 — FindingSeverity boundary decision packet

この文書は、**Decision-SEV-2** の **decision packet（Candidate）** である。
Accepted 正本ではない。

Decision-SEV-1（Option A / Issue #8 新 DEC 方式）Accepted 後の
**次 substantive unit** として、FindingSeverity の残判断を固定する。

**必須分離:** vocabulary の正式値と、assignment algorithm / caller-supplied 境界を
**別判断単位**として扱う。一括 Accepted しない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision packet: Decision-SEV-2
Status: OPEN（単位ごとに状態が異なる）
SEV-2-PURPOSE: RECORDED（MHLW-first）— decision-sev-2-purpose-source.md
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS — decision-sev-2-concept-inv.md
SEV-2-VOCAB: HOLD（V-C）— decision-sev-2-vocab-hold.md
SEV-2-ASSIGN: CANDIDATE / NOT SELECTED
Implementation: NOT STARTED
Depends on: Decision-SEV-1 Accepted（Option A）
main before this packet: 08d4a2533f31b94ff86df50cb28c7a93b8426928
SEV-1 Accepted canonical: decision-sev-1-finding-severity-vocabulary-ownership.md
SEV-1 Human Acceptance: Explicit Human GO on 2026-08-08（Decision-SEV-1 / Option A）
SEV-2-VOCAB Human Decision: Explicit Human HOLD on 2026-08-08（V-C）
SEV-2-PURPOSE Human Decision: Explicit Human purpose-source policy on 2026-08-08
SEV-2-CONCEPT-INV Human result: Explicit Human CONCEPT-INV result on 2026-08-08
```

SEV-1 の Human Acceptance と Agent execution evidence は混同しない。
Live gate（Ready / Merge / Independent Review 進行状態）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)
- [`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)
- [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 前提（変更しない）

```text
Decision-SEV-1: Accepted / Option A
Canonical ownership / change control: Issue #8 に新しい DEC を追加する方式
Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
src/** / tests/**: 本 packet では変更しない
```

Issue #8 の新規 DEC 番号は **UNASSIGNED** のままとする。
本 packet で DEC 番号を推測採番しない。

## 判断単位の分離（必須）

| Unit ID | 判断単位 | 本 packet での状態 | 混ぜてはならないもの |
|---|---|---|---|
| **SEV-2-PURPOSE** | FindingSeverity **purpose source**（MHLW-first 方針） | **RECORDED**（[`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)） | 値一覧・assignment |
| **SEV-2-CONCEPT-INV** | 厚労省一次資料での **正式概念有無** 調査 | **COMPLETED / OFFICIAL_CONCEPT_EXISTS**（[`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)） | VOCAB Accepted・ASSIGN・実装 |
| **SEV-2-VOCAB** | FindingSeverity **正式値・意味**、または **不採用 Decision**（Issue #8 新 DEC の本文候補） | **HOLD / V-C**（[`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)） | assignment 主体・算出アルゴリズム |
| **SEV-2-ASSIGN** | Severity **assignment algorithm / caller-supplied 境界** | CANDIDATE / NOT SELECTED（VOCAB と独立。本 HOLD で確定しない） | 値一覧そのものの採択 |


```text
Independent acceptance: REQUIRED
Bundle Accepted: FORBIDDEN
Order preference:
  SEV-2-PURPOSE → SEV-2-CONCEPT-INV → SEV-2-VOCAB →
  Issue #8 DEC（Accepted values OR non-adoption）→
  SEV-2-ASSIGN（Accepted values の場合のみ）
  （値定義・ASSIGN は制度概念確認後。不採用時 ASSIGN は N/A。
   enum 検証を伴う assignment は VOCAB Accepted 後が安全）
```

旧 backlog 表記「Severity assignment boundary（値・意味・判定主体）」は、
VOCAB と ASSIGN に **分割**し、さらに PURPOSE / CONCEPT-INV を前置する。
不採用 Decision も Decision-SEV-1 Option A に従い Issue #8 新 DEC で正本化する。

---

## Unit SEV-2-VOCAB — Formal vocabulary（値・意味）

### 問い

Issue #8 新規 DEC に記録する FindingSeverity の **正式値集合** と、
各値の **業務上の意味** は何か。

### 制約

```text
Ownership: Issue #8 新 DEC（Decision-SEV-1 Option A）
Purpose source: MHLW / statutory-regulatory source first（SEV-2-PURPOSE）
Local invented severity taxonomy: FORBIDDEN
暗黙採用禁止: low / medium / high 等を正本未確定のまま使わない
FindingIdentity キーへの Severity 追加: 禁止（UNCHANGED）
stable Finding ID 入力への Severity 混入: 禁止
agent による値捏造: 禁止（制度一次資料に基づき Human が値集合を明示する）
```

### 候補オプション（Human が選択 / 修正）

値そのものは Human が明示する。エージェントは推奨値を確定しない。

| Option | 概要 | メモ |
|---|---|---|
| **V-A** | Human 提示の **閉集合 enum** を Issue #8 DEC 正本とする | 値・意味を DEC 本文に列挙。追加は DEC 改訂 |
| **V-B** | Human 提示の閉集合に、**Human が明示する追加値**を含める | 名称・意味とも **Human 提示項目**。本 packet は具体名を固定しない |
| **V-C** | 現時点では値を採択せず **HOLD** | 完全 Finding / 実装は継続不可。暗黙値は使わない |

```text
V-B 注意:
  具体 sentinel 名（例示を含む）を agent が候補として提示・固定しない。
  正本根拠のない業務値名を本 packet から採用しない。
  追加値が必要かは Human が決め、必要な場合のみ名称・意味を Human が列挙する。

V-A / V-B 採択時に必須添付:
  1. 正式値の完全列挙（文字列リテラル。すべて Human 提示）
  2. 各値の意味（1 文以上）
  3. 順序・重大度比較の要否（要なら比較規則。不要なら UNORDERED 明示）
  4. 廃止・追加の変更管理（Issue #8 DEC 改訂のみ、等）
```

### SEV-2-VOCAB で決めないこと

- domain 算出 vs caller-supplied
- TypeScript 型名・validator 実装
- SharePoint 列
- FindingCode カタログ
- 完全 Finding の他フィールド

### SEV-2-VOCAB Human Decision（記録済み）

正本: [`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)

```text
Decision-SEV-2-VOCAB: HOLD
Selected: V-C
Formal values: NOT DEFINED
Meanings: NOT DEFINED
Ordering: NOT DEFINED
Issue #8 DEC number: UNASSIGNED
Reason:
  FindingSeverity の正式値・意味について、
  厚労省制度上の正式概念が未確認のまま値を定義できない。
  AIによる値の補完・推測は行わない。
```

値採択に進む前の前提問い（purpose source 正本）:

```text
厚労省の制度上、強度行動障害・生活介護・重度障害者支援加算等について、
段階・区分・閾値・優先度を表す正式な概念が存在し、
それを Finding に保持する必要があるか？
```

purpose source / 調査単位の正本:
[`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)

### SEV-2-VOCAB Acceptance 記録テンプレ（履歴）

```text
Decision-SEV-2-VOCAB:
ACCEPTED | HOLD | REJECTED
Selected: V-A | V-B | V-C | (amended)
Formal values:
  <Human-supplied complete list>
Meanings:
  <per-value meaning>
Ordering:
  UNORDERED | <rule>
Issue #8 DEC number:
  <assigned or UNASSIGNED>
Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
```

---

## Unit SEV-2-ASSIGN — Assignment algorithm / caller-supplied 境界

### 問い

FindingSeverity を **誰が・どの境界で** 決定し、domain 純関数は何を保証するか。

### 制約

```text
VOCAB 未 Accepted のまま実装開始しない
FindingIdentity / stable Finding ID: UNCHANGED
未承認アルゴリズムの推測実装: 禁止
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
```

### 候補オプション

| Option | 概要 | domain の役割 | 呼び出し側の役割 |
|---|---|---|---|
| **A-A** | **caller-supplied** | Accepted VOCAB への所属検証のみ（fail-closed reject） | Severity 値を供給する |
| **A-B** | **domain-computed** | 明示入力から Severity を算出する純関数（アルゴリズムは別契約で固定） | 算出入力を供給。結果 Severity を上書きしない |
| **A-C** | **hybrid** | caller 提案値を検証し、追加ルールで許可/拒否（ルールは別契約） | 提案 Severity + 根拠入力を供給 |
| **A-D** | 現時点では境界を採択せず **HOLD** | なし | なし |

```text
A-B / A-C 採択時:
  算出・許可ルールの詳細は本 packet では確定しない。
  別 technical contract / Entry Criteria を要する（実装 NOT STARTED）。
A-A 採択時:
  FindingCode Identity 組立（caller-supplied + validate）と同型の狭域に寄せられる。
  それでも VOCAB Accepted が先（検証対象 enum が必要）。
```

### SEV-2-ASSIGN で決めないこと

- 正式値リスト自体（SEV-2-VOCAB）
- 算出式の詳細（A-B/A-C の場合は後続契約）
- UI / ロール / GOV-AUD
- 永続化・SharePoint

### SEV-2-ASSIGN Acceptance 記録テンプレ

```text
Decision-SEV-2-ASSIGN:
ACCEPTED | HOLD | REJECTED
Selected: A-A | A-B | A-C | A-D | (amended)
Depends on VOCAB: <Accepted ref or HOLD>
Domain responsibility:
  <one sentence>
Caller responsibility:
  <one sentence>
Implementation: NOT STARTED
Contract break: NO
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
```

---

## 推奨レビュー順

```text
1. Independent Review of this packet（判断単位分離・Option 網羅・暗黙値禁止）— done via PR #113 line
2. Human Decision of SEV-2-VOCAB — HOLD / V-C（[`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)）
3. Human purpose-source policy — SEV-2-PURPOSE（[`decision-sev-2-purpose-source.md`](./decision-sev-2-purpose-source.md)）
4. SEV-2-CONCEPT-INV — COMPLETED / OFFICIAL_CONCEPT_EXISTS（[`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)）
5. SEV-2-VOCAB を再評価（Human）
   - HOLD 継続
   - または Option A: FindingSeverity 不採用 / 契約除外
     （行動関連項目合計点 + 制度判定結果 + RuleSetVersion）
   - または Option B: FindingSeverity 残置 + MHLW 写像の別正本化
   - `"10+"` / `"18+"` / low/medium/high の即時採択は禁止
6. Issue #8 へ新規 DEC 本文を記録（番号は現在 UNASSIGNED）
   - Accepted（正式値あり）の場合
   - 不採用 Decision の場合
   の両方を対象にする（Decision-SEV-1 Option A）
7. 分岐後の ASSIGN / 実装
   - Accepted（正式値あり）後にのみ:
     SEV-2-ASSIGN を別 Human Decision として扱う
     実装 / 型追加は別 Entry Criteria + Implementation Start
   - 不採用 / 契約除外の場合:
     SEV-2-ASSIGN = N/A / DO NOT START
     実装への自動進行 = FORBIDDEN
   - HOLD 継続の場合:
     SEV-2-ASSIGN = CANDIDATE / NOT SELECTED を維持
     Issue #8 新 DEC 本文はまだ記録しない
```

```text
Next SEV action:
  Human SEV-2-VOCAB re-evaluation
SEV-2-CONCEPT-INV:
  COMPLETED / OFFICIAL_CONCEPT_EXISTS
SEV-2-ASSIGN:
  CANDIDATE / NOT SELECTED
Non-adoption path:
  Issue #8 new DEC REQUIRED
  SEV-2-ASSIGN = N/A / DO NOT START
```

VOCAB HOLD 中に ASSIGN へ進まない。
CONCEPT-INV 完了は VOCAB Accepted を含意しない。
不採用時も Issue #8 新 DEC 記録経路を省略しない。## OUT / 混ぜないもの

- SEV-2-VOCAB と SEV-2-ASSIGN の一括 Accepted
- PURPOSE / CONCEPT-INV / VOCAB / ASSIGN の一括確定
- CONCEPT-INV 完了を VOCAB Accepted とみなすこと
- FindingSeverity = `"10+"` / `"18+"` / low/medium/high の即時採択
- FindingSeverity 不採用時に Issue #8 新 DEC 記録を省略すること
- 「値定義後のみ」Issue #8 に書くこと（不採用 Decision も記録対象）
- `low` / `medium` / `high` の暗黙正本化
- ローカル発明の severity taxonomy
- FindingIdentity / stable Finding ID の変更
- `src/**` / `tests/**` 変更
- 完全 Finding 実装
- FindingCode カタログ Decision（FC-1 / FC-2）
- AssessmentSnapshot 保存・DTO
- SharePoint / tenant / Microsoft 365 / Entra ID / Deploy
- real data

## Gate

```text
Decision-SEV-1: Accepted（Option A）
Decision-SEV-2 packet: OPEN（単位別）
SEV-2-PURPOSE: RECORDED（MHLW-first）
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS
SEV-2-VOCAB: HOLD（V-C）
SEV-2-ASSIGN: CANDIDATE / NOT SELECTED
Independent acceptance: REQUIRED
Implementation: NOT STARTED
Next pure unit / Implementation Start: HOLD
Issue #24 Close: NO-GO
SharePoint / tenant / M365 / Entra / Deploy: NO-GO
real data: PROHIBITED
```

Live gate（Ready / Merge / review 進行）は PR body / Issue comment のみ。
repository docs には書かない。

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
Local invented severity taxonomy: FORBIDDEN
AI vocabulary invention: prohibited
```
