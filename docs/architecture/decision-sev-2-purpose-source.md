# Decision-SEV-2-PURPOSE — FindingSeverity purpose source（MHLW-first）

この文書は、**Decision-SEV-2-PURPOSE** の正本である。

FindingSeverity の用途一次情報として、
**厚労省（MHLW）の制度・算定要件・評価基準を上流正本とする**方針を固定する。

本単位は **SEV-2-VOCAB の値採択ではない**。
**SEV-2-ASSIGN でもない**。
VOCAB HOLD（V-C）は維持する。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SEV-2-PURPOSE
Status: RECORDED（Human purpose-source policy）
SEV-2-VOCAB: HOLD / V-C（維持）
SEV-2-ASSIGN: CANDIDATE / NOT SELECTED（本単位で進めない）
SEV-2-CONCEPT-INV: OPEN / NOT STARTED
Implementation: NOT STARTED
Depends on: Decision-SEV-1 Accepted（Option A）
Depends on: Decision-SEV-2-VOCAB HOLD（V-C）
main before this canonicalization: fba1e8e04a1fd731def03bc4c5a7f21dd3e25d8a
PR #114 / SEV-2-VOCAB HOLD: MERGED
```

上位入口:

- [`decision-sev-2-vocab-hold.md`](./decision-sev-2-vocab-hold.md)
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

## 調査単位 SEV-2-CONCEPT-INV（独立）

VOCAB 再評価・ASSIGN より前の **独立調査単位**。

```text
Unit ID: SEV-2-CONCEPT-INV
Status: OPEN / NOT STARTED
Kind: investigation（Decision Accepted ではない）
Depends on: SEV-2-PURPOSE（本方針）
Blocks: SEV-2-VOCAB 値採択、SEV-2-ASSIGN、実装
```

### 調査内容

厚労省の最新一次資料（告示、実施上の留意事項、Q&A、届出様式等）から、
**FindingSeverity に相当する制度上の正式概念が存在するかを確認する**。

調査対象クラス（例示。採択ではない）:

- 強度行動障害に関する制度上の判定・段階・区分
- 生活介護に関する制度上の段階・区分
- 重度障害者支援加算に関する対象区分・算定要件上の状態区分・届出上の区分

```text
例示は調査の入口であり、VOCAB 候補の採択ではない。
正式名称・値・意味・適用条件は一次資料で確認するまで固定しない。
```

### 調査結果の分岐（未実施）

| 結果 | 次判断 |
|---|---|
| 制度上の正式概念が **存在しない** | FindingSeverity 自体の **削除・不採用** も候補。値定義に進まない |
| 制度上の正式概念が **存在する** | その **正式名称・値・意味・適用条件** を SEV-2-VOCAB 候補にする。汎用 severity への丸めは後続設計判断 |

```text
Investigation result: NOT RUN
Official concept exists: UNKNOWN
FindingSeverity removal / non-adoption: CANDIDATE only if no official concept
SEV-2-VOCAB values: NOT DEFINED（HOLD 維持）
```

## 正しい順序

```text
1. SEV-2-PURPOSE（本単位）— MHLW-first purpose source を固定
2. SEV-2-CONCEPT-INV — 厚労省一次資料で正式概念の有無を調査（コード変更なし）
3. SEV-2-VOCAB 再評価
   - HOLD 継続
   - または 制度上の正式概念に基づく Acceptance
   - または FindingSeverity 不採用 / 契約からの除外
4. SEV-2-VOCAB Accepted（値定義あり）後にのみ
   SEV-2-ASSIGN を別 Human Decision として扱う
5. Issue #8 新 DEC 本文記録（値定義後。番号は UNASSIGNED）
6. 実装は別 Entry Criteria + Implementation Start
```

```text
SEV-2-ASSIGN auto progression: FORBIDDEN
Bundle with VOCAB / PURPOSE / CONCEPT-INV: FORBIDDEN
```

## 分離（維持）

| 単位 | 状態 |
|---|---|
| Decision-SEV-1 ownership | Accepted / Option A |
| **SEV-2-PURPOSE**（本単位） | **RECORDED**（MHLW-first） |
| **SEV-2-CONCEPT-INV** | **OPEN / NOT STARTED** |
| SEV-2-VOCAB | HOLD / V-C（値 NOT DEFINED） |
| SEV-2-ASSIGN | CANDIDATE / NOT SELECTED |
| TypeScript 型 / validator / 実装 | NOT STARTED |
| FindingIdentity / stable Finding ID | UNCHANGED |
| SharePoint / tenant / M365 / Entra / Deploy | NO-GO |
| real data | PROHIBITED |

## 対象外

- SEV-2-VOCAB の値採択（HOLD 維持）
- SEV-2-ASSIGN の Accepted / HOLD 判定
- TypeScript 型・validator・fixture・完全 Finding 実装
- 厚労省一次資料の内容を agent が推測で埋めること
- 汎用 severity taxonomy の発明
- SharePoint / adapter / UI / deploy / 実データ
- Issue #8 DEC 番号の推測採番

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
