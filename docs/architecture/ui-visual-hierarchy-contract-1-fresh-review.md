# UI-VISUAL-HIERARCHY-CONTRACT-1 — Fresh Review

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: Fresh Review（docs-only Contract materialization）
Unit: UI-VISUAL-HIERARCHY-CONTRACT-1
PR: Draft（this publication GO；番号は PR body）
Observed main:
  5890822de6e5df1e1901732a71adc66d4a9d1879
Authority:
  docs/architecture/decision-ui-visual-hierarchy-contract-1-selection.md
  docs/architecture/ui-visual-hierarchy-contract-1.md
  docs/architecture/ui-visual-hierarchy-contract-1-materialization.md
Status: PASS
Findings at review: P0 = 0 / P1 = 0 / P2 = 1 OPEN（non-blocking）
Post-correction: VH-FR-P2-1 CLOSED
  docs/architecture/ui-visual-hierarchy-contract-1-p2-purity-correction.md
Human Ready: NOT AUTHORIZED
Merge: NOT AUTHORIZED
#444 / #448 screen application: NOT AUTHORIZED
LIVE WRITE / Deploy: HOLD
```

Live gate（Ready / Merge 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Authority

Human instruction `UI-VISUAL-HIERARCHY-CONTRACT-1 FRESH REVIEW GO` が本レビューを許可する。

```text
Fresh Review PASS ≠ Human Ready GO
Fresh Review PASS ≠ Merge GO
Fresh Review PASS ≠ #444 Implementation Start
Fresh Review PASS ≠ #448 Implementation Start
Fresh Review PASS ≠ KPI strip / Plan metadata 実装
```

## Review matrix

Human 指定の 5 観点。

| # | Check | Result |
|---|---|---|
| R1 | Selection record との完全一致（N-1 / H-01..H-07 ALL ADOPT） | **PASS** |
| R2 | DADS-03 / Catalog / Templates / UI-SEM との矛盾がない | **PASS** |
| R3 | `EMPHASIS-*` と `SBS_ACTION` の名前・責務分離 | **PASS** |
| R4 | screen-specific が Contract 規則へ漏れていない | **PASS**（P2 注記あり） |
| R5 | 参照追加が既存 SSOT を置換していない | **PASS** |
| R6 | 画面コード / SCSS / fixture mutation が無い | **PASS** |
| R7 | Ready / Merge / `#444` / `#448` を本レビューが許可しない | **PASS** |

## Evidence inspected

```text
docs/architecture/decision-ui-visual-hierarchy-contract-1-selection.md
docs/architecture/decision-ui-visual-hierarchy-contract-1-packet.md
docs/architecture/ui-visual-hierarchy-contract-1.md
docs/architecture/ui-visual-hierarchy-contract-1-materialization.md
docs/architecture/dads-application-style-guide-v1.md  §4.1 / §6.2 / §7 Cards
docs/architecture/ui-component-catalog-v1.md
docs/architecture/ui-screen-templates-v1.md
docs/architecture/ui-agent-impl-3-eslint-ui-sem.md  UI-SEM-05
.agents/skills/design-context/SKILL.md
.agents/skills/design-review/SKILL.md
docs/process/development-process.md
spfx/src 差分: NONE
```

### R1 — Selection 一致

| Selection | Contract body |
|---|---|
| N-1 EMPHASIS-1/2/3 | §2 / §3 |
| H-01 Typography alias、新スケール禁止 | §4 |
| H-02 space.4+ / space.1–2、INV-22 非一括 | §5 |
| H-03 3 段ランク、裸 PRIMARY 禁止 | §2 / §3 |
| H-04 状態≠操作ウェイト、#419/#442 UNCHANGED | §6 |
| H-05 1 view に `SBS_ACTION.primary` は 1 | §7 |
| H-06 非操作 KPI は card にしない | §8 |
| H-07 LOW / MEDIUM / 件数優先、nav 不変 | §9 |

DEFER / REJECT 行は無い。N-2 / N-3 は NOT SELECTED のまま。

### R2 — 既存正本との矛盾

| 正本 | 関係 |
|---|---|
| DADS-03 §7 Cards | H-06 は「KPI をカード過剰にしない」を横断規則化。逆転ではない |
| DADS-03 §4.1 primary label | KEEP。EMPHASIS 名に使わない |
| DADS-03 §6.2 / VP-1 tokens | 新スケール禁止。既存 alias を使う |
| Catalog | 部品選択のまま。強弱を Catalog に移していない |
| Templates | 骨格と強調順のまま。destination を変えない |
| UI-SEM-05 | §9 / §11 が role で nav / destination を変えることを禁止 |

### R3 — 名前空間

```text
EMPHASIS-*     情報ランク
SBS_ACTION.*   CTA ウェイト
DADS-03 primary label  要確認 / 未記録 / 期限接近
textPrimary    色。ランク名にしない
```

§11 forbidden が混同を明示禁止している。

### R4 — SCREEN-SPECIFIC

KPI strip の具体配置、Plan metadata 非表示、row EMPHASIS 割当は §12 に owner 付きで残る。§8 / §9 は「本規則 ≠ 実装 GO」と書いてある。

P2: §9 PLANNER 行に「7 列高密度テーブルに戻さない」がある。これは `#444` Visual Decision の否定形であり、MEDIUM の言い換え以上の画面制約に近い。規則の本体（MEDIUM）は Selection どおり。配置指定ではない。

### R5 — 非置換

Catalog / Templates の registry・entry・forbidden は残っている。追加は 4 層ポインタと agent 手順の 1 行。Skill は入力を増やし、Catalog / Templates 必須を外していない。

## Findings

| Sev | ID | Status | Note |
|---|---|---|---|
| P2 | VH-FR-P2-1 | CLOSED | §9 から「7 列高密度テーブルに戻さない」を除去。横断本体は `PLANNER = MEDIUM`。記録: `ui-visual-hierarchy-contract-1-p2-purity-correction.md` |

```text
P0 = 0
P1 = 0
P2 OPEN = 0（VH-FR-P2-1 CLOSED by P2 CONTRACT-PURITY CORRECTION）
Independent Review / Fresh Review: PASS
```

## Verdict

```text
PASS

Draft PR publication: THIS GO
Ready / Merge: NOT AUTHORIZED
#444 / #448 screen application: NOT AUTHORIZED
```

## Process correction（post-review Human）

Fresh Review PASS は受理済み。Ready / Merge は **PR 作成後** のゲートである。PR が無い現時点で Ready / Merge を次工程にしない。

P2 `VH-FR-P2-1` は documented non-blocking だった。Contract purity では「7 列高密度テーブルに戻さない」は `#444` 固有の否定形であり削除候補。FAIL には戻さない。

`P2 CONTRACT-PURITY CORRECTION GO` で Contract §9 から当該句を除去した。Targeted Review PASS。記録: [`ui-visual-hierarchy-contract-1-p2-purity-correction.md`](./ui-visual-hierarchy-contract-1-p2-purity-correction.md)。

```text
CURRENT

UI-VISUAL-HIERARCHY-CONTRACT-1
MATERIALIZED
FRESH REVIEW: PASS
P2 CONTRACT-PURITY CORRECTION: COMPLETE
TARGETED REVIEW: PASS

P0: 0
P1: 0
P2 OPEN: 0
VH-FR-P2-1: CLOSED

main observed:
5890822de6e5df1e1901732a71adc66d4a9d1879

Commit / Push:
THIS GO

PR:
Draft（番号は PR body。live Ready / Merge は repository docs に書かない）

#444 / #448 application:
NOT AUTHORIZED

LIVE WRITE / Deploy:
HOLD

ACTION:
STOP
```

本 GO は Draft PR 公開まで。Ready / Merge は別 GO。

## Strict progression

```text
1. This Fresh Review = PASS
2. P2 CONTRACT-PURITY CORRECTION = COMPLETE / Targeted Review PASS
3. DRAFT PR PUBLICATION = THIS GO
4. STOP
5. Draft PR が存在してから Human Ready → Human Merge（別 GO）
6. その後の別 track
   #444 PLANNER screen-specific application
   #448 FIELD_STAFF screen-specific application
```
