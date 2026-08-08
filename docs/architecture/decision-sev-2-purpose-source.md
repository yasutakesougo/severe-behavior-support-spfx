# Decision-SEV-2-PURPOSE — FindingSeverity purpose source（MHLW-first）

この文書は、**Decision-SEV-2-PURPOSE** の正本である。

FindingSeverity の用途一次情報として、
**厚労省（MHLW）の制度・算定要件・評価基準を上流正本とする**方針を固定する。

本単位は **SEV-2-VOCAB の値採択ではない**。
**SEV-2-ASSIGN でもない**。
VOCAB は再評価により **Accepted / Option A（FindingSeverity NOT ADOPTED）**。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SEV-2-PURPOSE
Status: RECORDED（Human purpose-source policy）
SEV-2-VOCAB: Accepted / Option A / FindingSeverity NOT ADOPTED
SEV-2-ASSIGN: N/A / DO NOT START
SEV-2-CONCEPT-INV: COMPLETED / OFFICIAL_CONCEPT_EXISTS
  正本: decision-sev-2-concept-inv.md
Implementation: NOT STARTED
Depends on: Decision-SEV-1 Accepted（Option A）
Depends on: Decision-SEV-2-VOCAB（現正本: NOT ADOPTED）
main before this canonicalization: fba1e8e04a1fd731def03bc4c5a7f21dd3e25d8a
PR #114 / SEV-2-VOCAB HOLD: MERGED
PR #115 / SEV-2-PURPOSE: MERGED
```

上位入口:

- [`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)
- [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)
- [`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)（historical HOLD）
- [`decision-sev-2-finding-severity-boundary.md`](./decision-sev-2-finding-severity-boundary.md)
- [`decision-sev-1-finding-severity-vocabulary-ownership.md`](./decision-sev-1-finding-severity-vocabulary-ownership.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

### Human Decision（durable）

```text
Human Decision: Explicit Human purpose-source policy on 2026-08-08
FindingSeverity purpose source: MHLW / statutory-regulatory source first
Local invented severity taxonomy: FORBIDDEN
Human role:
  制度上の一次情報を選定・確認し、
  アプリがどこまで制度判定を表現するかを決定する
Agent execution evidence: NOT Human Decision evidence
```

## 固定方針

```text
Purpose source: MHLW / statutory-regulatory source first
Local invented severity taxonomy: FORBIDDEN
Generic software severity (例: low / medium / high) の暗黙採択: FORBIDDEN
AI による Severity 値発明: FORBIDDEN
```

意味:

- 現場が自由に「Severity（重大度）」を設計しない。
- 障害福祉サービスの報酬・加算は、厚労省の告示、実施上の留意事項、Q&A、届出様式などで具体化される。
- したがって FindingSeverity は、既存コードや一般的ソフトウェア設計から持ち込んだ汎用重大度ではなく、
  **制度上の正式概念が存在するときに限り** 保持対象になり得る。
- Human の役割は `low` / `medium` / `high` を考案することではない。
  制度一次資料の選定・確認と、アプリが制度判定をどこまで表現するかの決定である。

## 問いの修正（SEV-2-VOCAB 前提）

旧問い（用途確認の仮置き）:

```text
このアプリで FindingSeverity という項目は、
そもそも何のために必要なのか？
```

修正後の問い（本方針に従う）:

```text
厚労省の制度上、強度行動障害・生活介護・重度障害者支援加算等について、
段階・区分・閾値・優先度を表す正式な概念が存在し、
それを Finding に保持する必要があるか？
```

```text
「私たちは FindingSeverity を何に使いたいか」を先に考えない。
制度上の正式概念の有無と、Finding 保持の要否が先である。
```

## 調査単位 SEV-2-CONCEPT-INV（独立・結果あり）

VOCAB 再評価・ASSIGN より前の **独立調査単位**。
結果正本: [`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)

```text
Unit ID: SEV-2-CONCEPT-INV
Status: COMPLETED / OFFICIAL_CONCEPT_EXISTS
Kind: investigation（Decision Accepted ではない）
Depends on: SEV-2-PURPOSE（本方針）
Blocks: SEV-2-VOCAB Accepted、SEV-2-ASSIGN、実装（再評価前）
```

### 調査結果要約

```text
Official concept: 行動関連項目合計点数
Official thresholds: >= 10 ; >= 18（Severity enum 値ではない）
Generic severity taxonomy: NOT FOUND
low / medium / high: NOT OFFICIAL / DO NOT ADOPT
FindingSeverity = "10+" | "18+": NOT APPROPRIATE as direct adoption
```

### 調査結果の分岐（結果反映）

| 結果 | 次判断 |
|---|---|
| 制度上の正式概念が **存在しない** | （本調査では該当せず） |
| 制度上の正式概念が **存在する**（本調査） | 公式概念は **行動関連項目合計点数**。汎用 FindingSeverity taxonomy は **NOT FOUND**。次は Human SEV-2-VOCAB 再評価（Option A 不採用 / Option B 残置+写像正本化）。本調査だけでは VOCAB Accepted しない |

```text
Investigation result: COMPLETED
Official concept exists: YES（行動関連項目合計点数）
Generic FindingSeverity taxonomy: NOT FOUND
SEV-2-VOCAB: Accepted / Option A / FindingSeverity NOT ADOPTED
  正本: decision-sev-2-vocab-not-adopted.md
Issue #8 DEC path: REQUIRED for non-adoption Decision（番号 UNASSIGNED）
SEV-2-ASSIGN: N/A / DO NOT START
```

## 正しい順序

```text
1. SEV-2-PURPOSE（本単位）— MHLW-first purpose source を固定 — RECORDED
2. SEV-2-CONCEPT-INV — 厚労省一次資料で正式概念の有無を調査 — COMPLETED（[`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)）
3. SEV-2-VOCAB 再評価（Human）— **Accepted / Option A**
   - FindingSeverity 不採用 / 契約からの除外
   - 正本: [`decision-sev-2-vocab-not-adopted.md`](./decision-sev-2-vocab-not-adopted.md)
4. Issue #8 新 DEC 記録（番号は現在 UNASSIGNED）
   - 不採用 Decision を記録対象とする（Decision-SEV-1 Option A）
   - 台帳本文追記は docs 正本化とは別操作
5. 分岐後の ASSIGN / 実装
   - Option A 不採用 / 契約除外のため:
     SEV-2-ASSIGN = N/A / DO NOT START
     実装への自動進行 = FORBIDDEN
   - 代替概念（合計点 / predicates / scheme / RuleSetVersion）は
     別 Entry Criteria + Human Implementation Start まで開始しない
```

```text
SEV-2-ASSIGN auto progression: FORBIDDEN
Non-adoption → SEV-2-ASSIGN: N/A / DO NOT START
Bundle with VOCAB / PURPOSE / CONCEPT-INV: FORBIDDEN
Issue #8 DEC recording limited to "値定義後のみ": FORBIDDEN
```
## 分離（維持）

| 単位 | 状態 |
|---|---|
| Decision-SEV-1 ownership | Accepted / Option A |
| **SEV-2-PURPOSE**（本単位） | **RECORDED**（MHLW-first） |
| **SEV-2-CONCEPT-INV** | **COMPLETED / OFFICIAL_CONCEPT_EXISTS**（[`decision-sev-2-concept-inv.md`](./decision-sev-2-concept-inv.md)） |
| SEV-2-VOCAB | **Accepted / Option A / FindingSeverity NOT ADOPTED** |
| SEV-2-ASSIGN | **N/A / DO NOT START** |
| TypeScript 型 / validator / 実装 | NOT STARTED |
| FindingIdentity / stable Finding ID | UNCHANGED |
| SharePoint / tenant / M365 / Entra / Deploy | NO-GO |
| real data | PROHIBITED |

## 対象外

- SEV-2-VOCAB 値一覧の採択（不採用のため N/A）
- SEV-2-ASSIGN（N/A / DO NOT START）
- 代替概念の型・schema・実装開始
- TypeScript FindingSeverity 型・validator・fixture
- FindingSeverity = "10+" / "18+" の採択
- 汎用 severity taxonomy の発明
- SharePoint / adapter / UI / deploy / 実データ
- Issue #8 DEC 番号の推測採番
- 不採用時の Issue #8 記録経路省略（禁止。本単位で経路は固定済み）

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
tenant changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本単位では変更しない
FindingIdentity: UNCHANGED
stable Finding ID: UNCHANGED
Local invented severity taxonomy: FORBIDDEN
AI vocabulary invention: prohibited
```
