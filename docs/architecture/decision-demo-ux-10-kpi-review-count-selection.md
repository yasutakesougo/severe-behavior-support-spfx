# DEMO-UX-10 — Overview KPI ↔ 見直し件数の対応明示 Selection（RPF-006）

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-10 — KPI / review count correspondence
Decision: Decision-DEMO-UX-10-KPI-REVIEW-COUNT-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-12）
Baseline main: 9dd43e285c09218531260ffb565cf906b2b09574
Predecessor: DEMO-UX-9 MERGED（PR #322 / merge 9dd43e2；tip family 2000b85）
Source feedback: RPF-006
Recheck evidence: /opt/cursor/artifacts/responsible-person-recheck-9dd43e2/
Follow-on queue（not this slice）: RPF-004 / RPF-005 / DUX7-P2-1
Implementation Start: GO（2026-08-13）— see demo-ux-10-implementation-start.md
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
SharePoint write: NOT AUTHORIZED
```

## Authority

Human は RESPONSIBLE-PERSON-DEMO-V1 Recheck（main @ `9dd43e2`）後、残り P2 の最優先として **RPF-006 Selection** を GO した。

本 Selection は **RPF-006 のみ** を SELECTED / LOCKED とする。

```text
DEMO-UX-10 Implementation Start = GO（this follow-on docs + code on PR #324）
RPF-004 / RPF-005 / DUX7-P2-1 Implementation = NOT AUTHORIZED
Deploy / SharePoint write / #299 Close = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
```

大規模ビジュアルデザイン改善は本 slice では行わない。件数の意味・母集団・画面間対応を synthetic presentation 上で説明可能にすることが目的である。

## Goal

責任者デモで、各件数について次を説明できる状態へ進める。

```text
何を数えているか
  → 対象範囲（母集団）は何か
  → 他画面のどの数字と対応するか（または対応しないか）
  → 同じラベルでも母集団が違う場合は同等指標として語らない
```

数字だけを強制的に合わせない。業務ルールを新規推測しない。正当化のためだけの fixture 書き換えをしない。

## Selection-phase investigation（LOCKED findings）

### 1. Metric inventory（current presentation）

| Metric ID | Surface | Display label | Observed value | Unit shown |
|---|---|---|---|---|
| OV-KPI-NR | Overview「今日の支援状況」 | 要確認 | 3 | 件数（カード） |
| OV-KPI-UR | Overview「今日の支援状況」 | 未記録 | 2 | 件数（カード） |
| OV-KPI-DS | Overview「今日の支援状況」 | 期限接近 | 2 | 件数（カード） |
| US-FLT-NR | Users 状態フィルタ | 要確認 | 3 | 名 |
| US-FLT-UR | Users 状態フィルタ | 未記録 | 2 | 名 |
| US-FLT-DS | Users 状態フィルタ | 期限接近 | 3 | 名 |
| RV-SUM-NR | Review「見直し・期限の要約」 | 要確認 | 2件 | 件（合成表示） |
| RV-SUM-DS | Review「見直し・期限の要約」 | 期限接近 | 2件 | 件（合成表示） |
| RV-LIST-NR | Review「確認が必要な対象」 | 要確認バッジ行 | 3名（A/B/C） | 行 |
| RV-LIST-DS | Review「確認が必要な対象」 | 期限接近バッジ行 | 2名（A/B） | 行 |

`今日の対象=12` は本 slice の対応対象外（RPF-006 の問題核は 要確認 / 期限接近、および隣接する Users 未記録との定義説明）。

### 2. Current source for each count

| Metric ID | Source file | Generation | Derived from shared fixture? |
|---|---|---|---|
| OV-KPI-NR / UR / DS | `spfx/src/shell/dashboard/overview-fixture.ts` → `kpiCards[].count` | **Hardcoded literals**（3 / 2 / 2） | No |
| US-FLT-* | `spfx/src/shell/users/users-fixture.ts` rows + `users-filter.ts` `filterUserRowsByStatusChip` | **Derived**：`ANY badge.id === matchKey` | Yes（Users fixture only） |
| RV-SUM-NR / DS | `spfx/src/shell/review/review-due-fixture.ts` → `attentionSummary.*CountLabel` | **Hardcoded label strings**（`要確認 2件…` / `期限接近 2件…`） | No（not counted from `attentionItems`） |
| RV-LIST-* | same fixture → `attentionItems[]` labels | **Per-item presentation labels** | Yes（Review fixture only） |

UI は件数を再計算しない。Overview / Review summary は表示定数、Users のみ client-side filter で可視件数を更新する。

### 3. Population / predicate comparison

#### Family candidates（as observed — not new business rules）

| Family | Population | Predicate（presentation） | Members（ids / people） |
|---|---|---|---|
| **R — Roster status** | `DEMO_UX_USERS_FIXTURE.rows`（全8名） | `statusBadges` に該当 `badge.id` | 要確認: A,C,F / 未記録: A,E / 期限接近: B,E,H |
| **A — Review attention** | `DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems`（3行） | 行の `reviewStatusLabel` / `dueStateLabel` | 要確認: A,B,C / 期限接近: A,B |

#### Cross-surface equivalence（current）

| Pair | Same label? | Same population? | Same predicate? | Values equal? | May present as equivalent? |
|---|---|---|---|---|---|
| OV-KPI-NR ↔ US-FLT-NR | Yes | **未宣言**（Overview は独立定数） | Overview に predicate なし | 3=3 | **No**（偶然一致の可能性） |
| OV-KPI-DS ↔ US-FLT-DS | Yes | 未宣言 | Overview に predicate なし | **2≠3** | **No** |
| OV-KPI-NR ↔ RV-SUM-NR | Yes | No | No | **3≠2** | **No** |
| OV-KPI-DS ↔ RV-SUM-DS | Yes | 未宣言 | No | 2=2 | **No**（定義未共有） |
| US-FLT-NR ↔ RV-LIST-NR | Yes | **No**（R={A,C,F} vs A={A,B,C}） | Badge id vs item label | 3=3 | **No**（人数一致でも集合が違う） |
| US-FLT-DS ↔ RV-LIST-DS | Yes | **No**（R={B,E,H} vs A={A,B}） | Badge id vs item label | **3≠2** | **No** |
| RV-SUM-NR ↔ RV-LIST-NR | Yes | 同一画面の要約 vs 一覧 | Summary は硬コード、List は行ラベル | **2≠3** | **No（画面内不一致）** |
| RV-SUM-DS ↔ RV-LIST-DS | Yes | 同一 attention セット想定 | Summary 硬コード vs `dueStateLabel` 有無 | 2=2 | 値は一致するが **導出未接続** |

#### Critical observation（LOCKED）

```text
Users 要確認 = {A, C, F}
Review list 要確認 = {A, B, C}
→ 両方「3」でも同一母集団ではない。

Users 期限接近 = {B, E, H}
Review list 期限接近 = {A, B}
→ ラベル同一でも集合も件数も一致しない。

B は Users 上は deadline_near のみ、Review attention では 要確認+期限接近。
F は Users 上 needs_review、Review attention には現れない。
```

これは業務判定の新解釈を要求しない。**合成 fixture が画面ごとに独立している**という事実である。Selection は事実を固定し、presentation で誤って同一指標扱いしないことを LOCK する。

## Proposed canonical relationship（LOCKED for Implementation）

### Metric families

| Family | Canonical name（説明用） | Authoritative source | Counts |
|---|---|---|---|
| **R — Roster status counts** | 利用者一覧の状態バッジ件数（合成） | `DEMO_UX_USERS_FIXTURE` + DEMO-UX-8 filter semantics | 要確認3 / 未記録2 / 期限接近3 |
| **A — Review attention counts** | 見直し画面の確認対象件数（合成） | `DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems` | 要確認=行の `reviewStatusLabel` 件数 / 期限接近=行の `dueStateLabel` 件数 |

```text
Family R と Family A は、同一ラベルでも同等指標として提示しない。
対応関係は「別名の対応」ではなく「非対応（別母集団）」を明示する。
```

### Overview KPI mapping

| Overview card | Locked family | Locked relationship |
|---|---|---|
| 要確認 | **R** | Users フィルタ「要確認」と **同一指標** → 値は US-FLT-NR と一致させる |
| 未記録 | **R** | Users フィルタ「未記録」と **同一指標** → 値は US-FLT-UR と一致させる |
| 期限接近 | **R** | Users フィルタ「期限接近」と **同一指標** → 値は US-FLT-DS と一致させる（現行 2→**3** は定義一致のための Overview 表示定数更新） |

Overview 側の補足表示（IN）例の方向性:

```text
利用者一覧の状態バッジ件数と同じ定義（合成）
見直し画面の件数とは母集団が異なります
```

文言の最終形は Implementation で固定してよい。意味（同一=Family R / 非同一=Family A）は変更不可。

### Review mapping

| Review element | Locked predicate | Locked value（現行 fixture のまま） | Notes |
|---|---|---|---|
| 要約・要確認 | `attentionItems` のうち `reviewStatusLabel === 要確認` | **3件** | 現行 summary「2件」は一覧と矛盾 → **同一母集団の一貫性修正**（数字合わせではなく導出一致） |
| 要約・期限接近 | `attentionItems` のうち `dueStateLabel === 期限接近` | **2件** | 一覧と一致。硬コードを一覧導出または明示対応に揃える |
| 一覧 | attentionItems 全行 | A/B/C のまま | fixture 行の追加・削除・人物入替は正当化目的では禁止 |

Review 側の補足表示（IN）例の方向性:

```text
この画面の確認対象一覧の件数（合成）
利用者一覧の要確認/期限接近件数とは対象者が異なります
```

### Explicit non-alignment（must not claim）

```text
OV/US 要確認（A,C,F） ≠ Review 要確認（A,B,C）
OV/US 期限接近（B,E,H） ≠ Review 期限接近（A,B）
「両方3だから同じ」は禁止
```

### Rejected approaches（Selection OUT）

| Approach | Why rejected |
|---|---|
| Users fixture の badge を書き換えて Review 集合に合わせる | 正当化のための fixture 改変；DEMO-UX-8 アンカー破壊 |
| Review attention に F を追加し B のラベルを削って Users に合わせる | 同上；DEMO-UX-6 確認対象ストーリーを業務推測で改変 |
| Overview 期限接近を 2 のまま「Users と同じ」と書く | 虚偽の対応 |
| 要約要確認を 2 のまま残し「二重ラベルだけ数える」と新業務ルール化する | 業務ルールの新規推測 |
| 共通 Domain 計算エンジンで期限/要確認を再定義 | business-rule calculation = OUT |

### Allowed Implementation tactics（presentation-only）

```text
IN:
  - Overview kpiCards counts を Family R アンカー（3/2/3）へ更新
  - Review attentionSummary を attentionItems 件数と一貫
  - 短い対応注記 / 範囲ラベル（Overview KPI 付近・Review 要約付近）
  - 必要なら data-* / aria-label で family を識別
  - 単体テスト・smoke で「説明可能」「誤対応しない」を固定
  - feedback ledger の RPF-006 行を SELECTED→実装後更新

OUT:
  - live I/O / SharePoint write / save
  - GOV-RULE / due-window / 認可計算の新規実装
  - Users filter セマンティクス変更（ANY badge.id 維持）
  - DEMO-UX-7/8/9 導線・discard・disabled save の改変
  - RPF-004 / RPF-005 / DUX7-P2-1
  - large visual redesign / Deploy / #299 Close
```

## Selected scope（IN）

### RPF-006 — Overview KPI ↔ 見直し件数の対応明示

1. **Metric inventory を presentation に反映**し、責任者が「何を数えているか」を画面上または隣接注記で説明できる
2. **Family R / Family A の非同等**を明示する（同じ用語ラベルでも母集団が違う）
3. **同一 Family 内は値と定義を一致**させる  
   - Overview 要確認/未記録/期限接近 ↔ Users フィルタ件数  
   - Review 要約 ↔ Review 一覧（attentionItems 導出）
4. **対応マトリクス**（少なくとも 要確認・期限接近）をデモ説明可能な形で残す（画面注記または architecture 検証メモ＋画面短注記）

## Exact OUT

```text
live I/O = OUT
SharePoint write = OUT
save / create mutation = OUT
business-rule calculation changes = OUT
GOV-RULE / due-window 再決定 = OUT
Users fixture badge rewrite for justification = OUT
Review attention cast rewrite for justification = OUT
RPF-004 DEMO注記集約 = OUT
RPF-005 保存バッジ階層 = OUT
DUX7-P2-1 詳細プレビュー拡張 = OUT
large visual redesign = OUT
Deploy = OUT
#299 Close = OUT
Implementation Start / Ready / Merge auto-advance = OUT
```

## Must preserve（non-negotiable）

- DEMO-UX-7 today-action navigation（A→記録 / B→見直し / C→詳細）
- DEMO-UX-8 users filters（すべて / 要確認 / 未記録 / 期限接近；ANY `badge.id`；件数アンカー 8/3/2/3）
- DEMO-UX-9 daily-record experience（未完了選択→入力イメージ、local draft、離脱破棄、作成/保存 disabled）
- fail-closed（`access_denied` / `retrieval_failed` を成功へ丸めない）
- `siteSelection=unselected` stop
- `save_outcome_unknown` 非丸め（成功・失敗のいずれにも丸めない）
- DEMO / synthetic / no live SharePoint 明示
- DEMO-UX-7 terminology canon（要確認 / 期限接近 / 未記録）

## Acceptance criteria

Implementation Start 後の受入は次をすべて満たすこと。

1. **説明可能性**  
   Overview / Users / Review の各「要確認」「期限接近」について、デモ実演で  
   「何を数えているか / 対象範囲 / 対応先または非対応」を矛盾なく説明できる。

2. **Family R 一致**  
   Overview KPI（要確認・未記録・期限接近）の表示件数が、Users フィルタ適用時の件数（3 / 2 / 3）と一致する。

3. **Family A 内部一貫**  
   Review 要約の要確認件数 = attentionItems の要確認ラベル行数（現行 fixture なら 3）。  
   Review 要約の期限接近件数 = attentionItems の期限接近ラベル行数（現行 fixture なら 2）。

4. **非同等の明示**  
   Overview/Users の件数を、Review の件数と「同じ指標」として主張する文言がない。  
   母集団差（例: Users 要確認に F、Review 要確認に B）を隠さない。

5. **禁則遵守**  
   Users / Review の人物集合を、対応正当化のみを目的に書き換えない。  
   業務ルール計算・live I/O・save・SharePoint write を追加しない。

6. **回帰**  
   DEMO-UX-7/8/9 の導線・フィルタ・draft discard、および fail-closed / unselected / save_outcome_unknown が維持される。

7. **検証**  
   単体テストまたは smoke で Family R 一致・Family A 内部一貫・非同等注記の存在を確認する（browser smoke 推奨）。

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

Human gate `DEMO-UX-10 Implementation Start GO` は 2026-08-13 に受領済み。  
次の Human gate は Fresh Review / Ready（本sliceでは Ready を要求しない）。

## Evidence referenced

```text
recheck report:
  /opt/cursor/artifacts/responsible-person-recheck-9dd43e2/recheck-report.md
flow feedback:
  docs/architecture/responsible-person-demo-v1-flow-review-feedback-record.md
overview fixture:
  spfx/src/shell/dashboard/overview-fixture.ts
users fixture + filter:
  spfx/src/shell/users/users-fixture.ts
  spfx/src/shell/users/users-filter.ts
review fixture + UI:
  spfx/src/shell/review/review-due-fixture.ts
  spfx/src/shell/review/ReviewDueState.tsx
predecessor selections:
  decision-demo-ux-7-terminology-today-actions-selection.md
  decision-demo-ux-8-users-list-status-filter-selection.md
  decision-demo-ux-9-daily-record-experience-selection.md
  decision-demo-ux-6-review-due-state-presentation-selection.md
baseline main:
  9dd43e285c09218531260ffb565cf906b2b09574
```
