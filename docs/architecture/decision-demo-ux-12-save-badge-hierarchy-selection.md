# DEMO-UX-12 — 保存バッジ強調階層 Selection（RPF-005）

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-12 — Save badge hierarchy
Decision: Decision-DEMO-UX-12-SAVE-BADGE-HIERARCHY-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-13）
Baseline main: 23bc67a7f2e0331146cb92d7ea27c63a02dcf122
Predecessor: DEMO-UX-11 MERGED（PR #325 / merge 23bc67a；tip a816445 ancestor）
Source feedback: RPF-005
Follow-on queue（not this slice）: DUX7-P2-1 / RPF-007
Implementation Start: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
SharePoint write: NOT AUTHORIZED
```

## Authority

Human は DEMO-UX-11（RPF-004）Merge SUCCESS を確認し、残り P2 の次として **RPF-005 Selection** を GO した。

本 Selection は **RPF-005 のみ** を SELECTED / LOCKED とする。

```text
DEMO-UX-12 Implementation Start = NOT AUTHORIZED（separate Human GO）
DUX7-P2-1 / RPF-007 Implementation = NOT AUTHORIZED
Deploy / SharePoint write / #299 Close = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
```

大規模ビジュアルデザイン刷新は行わない。保存状態バッジ／説明の**強調階層**だけを直し、ready 閲覧時に業務情報より目立たないようにする。

## Goal

```text
ready 閲覧（saved / unsaved）では保存バッジを控えめにする
  → 保存失敗 / 保存結果不明 / 保存中 だけ強調する
  → 5状態 vocabulary と save_outcome_unknown 非丸めは維持する
  → 業務 KPI・今日やること・一覧が第一視線になる
```

安全境界（DEMO / synthetic / no-live / no-save / fail-closed）を弱めない。
保存結果の判定ロジックや live I/O は導入しない。

## Selection-phase investigation（LOCKED findings）

### 1. Current presentation inventory

| ID | Surface / source | What shows | Current emphasis |
|---|---|---|---|
| SB-BADGE | `SaveStateBadge.tsx` | 5状態ラベル常時表示（header） | 全状態で `font-weight: 600` + 色付き背景 + border |
| SB-DESC | `SaveStatePresentation.tsx` + `save-state.ts` | 全状態で説明文を常時表示 | バッジ直下・常時可視 |
| SB-ARIA | `ariaLiveForShellSaveState` | fail/unknown = assertive；他 = polite | a11y 階層は既に一部ある |
| SB-STYLE-U | `.saveState_unsaved` | `#f3f2f1` | medium（neutral chip） |
| SB-STYLE-G | `.saveState_saving` | `#deecf9` | medium（info chip） |
| SB-STYLE-D | `.saveState_saved` | `#dff6dd` | **success-looking / 常時目立つ** |
| SB-STYLE-F | `.saveState_save_failed` | `#fde7e9` | medium-high（error tint） |
| SB-STYLE-X | `.saveState_save_outcome_unknown` | `#fff4ce` | medium-high（warn tint） |
| SB-CHROME | `AppShellChrome` brandRow | 未認証以外で常時 `SaveStatePresentation` | ready Overview でも右上並走 |
| SB-FIXTURE | `SHELL_UX_DEFAULT_FIXTURE.saveState` | default = `unsaved` | デモ既定でもチップ強調 |

画面内の `systemState.saveStateLabel`（Records / Review / Support plan / User detail の「表示サンプル（live保存なし）」）は **別 surface**。本 slice の主対象は **header SaveStatePresentation**（RPF-005 の右上常時強調）。

### 2. Problem（RPF-005）

```text
observation:
  ready + saved（および default unsaved）でも右上バッジが常時強調され、
  異常時（保存失敗 / 保存結果不明）との差が弱い。業務 KPI と並走して目立つ。

requestedOutcome（four-perspective）:
  ready 閲覧時は控えめ、
  保存失敗 / 結果不明 / 保存中 だけ強調する階層にする。
```

### 3. Emphasis taxonomy（LOCKED）

| Tier | Meaning | States |
|---|---|---|
| **EMPHASIZED** | 目立つ視覚階層 + 説明文を残す | `save_failed`, `save_outcome_unknown`, `saving` |
| **QUIET** | 存在は分かるが業務コンテンツより目立たない | `saved`, `unsaved` |

```text
EMPHASIZED ≠ new states
EMPHASIZED ≠ progress animation / operation freeze（that is RPF-007）
QUIET ≠ remove vocabulary / hide all save chrome permanently
QUIET ≠ collapse save_outcome_unknown into saved or save_failed
```

### 4. Keep / demote / emphasize matrix（LOCKED）

| State | Label（KEEP） | Badge visual | Description | aria-live | Action |
|---|---|---|---|---|---|
| `unsaved` | 未保存 | **DEMOTE → QUIET** | QUIET（非表示または visually muted） | polite KEEP | demote |
| `saving` | 保存中 | **EMPHASIZE KEEP/raise** | KEEP visible | polite KEEP | emphasize |
| `saved` | 保存済み | **DEMOTE → QUIET** | QUIET（非表示または visually muted） | polite KEEP | demote |
| `save_failed` | 保存失敗 | **EMPHASIZE KEEP/raise** | KEEP visible | assertive KEEP | emphasize |
| `save_outcome_unknown` | 保存結果不明 | **EMPHASIZE KEEP/raise** | KEEP visible（非丸め文言） | assertive KEEP | emphasize |

**DEMOTE の意味（LOCKED）**

```text
QUIET 状態では:
  - バッジは残してよい（状態 vocabulary 維持）
  - 成功色の強い塗り・高コントラスト chip・太字の並走感を下げる
  - 説明文は隠すか、バッジよりさらに弱い補助テキストにする
  - 「保存できます」「接続済み」と読めない

EMPHASIZED 状態では:
  - バッジを QUIET より明確に目立たせる
  - 説明文を残す（特に save_outcome_unknown の非丸め）
  - fail / unknown の assertive を弱めない
```

### 5. Canonical hierarchy proposal（LOCKED for Implementation）

```text
Layer A — QUIET（ready browsing）
  states: unsaved | saved
  chrome: compact / muted badge in brandRow
  description: hidden or muted（Implementation で一方に固定）
  must not compete with Overview KPI / today-actions

Layer B — EMPHASIZED（attention）
  states: saving | save_failed | save_outcome_unknown
  chrome: stronger badge treatment than Layer A
  description: visible
  save_failed / save_outcome_unknown: aria-live=assertive KEEP
  saving: visible emphasis only（no RPF-007 progress UI）

Layer C — Vocabulary / safety（non-negotiable）
  5 ShellSaveState values remain
  labels remain distinct
  save_outcome_unknown never collapses to saved or save_failed
  no live save / REST / outcome judgment
```

実装手段（CSS class 追加、`data-emphasis`、description 条件表示など）は Implementation に委ねる。
**階層（どの状態が QUIET / EMPHASIZED か）は変更不可。**

### 6. Explicit non-changes（safety meaning）

```text
save_outcome_unknown → saved / save_failed 丸め = forbidden
5状態の削除・統合 = forbidden
SaveStatePresentation の完全除去（全状態） = forbidden
mutation enablement / live save = forbidden
「保存できます」系 copy = forbidden
DemoBanner 除去 = forbidden
DEMO-UX-7/8/9/10/11 導線・件数・注記集約の巻き戻し = forbidden
RPF-007 進行インジケータ / 操作領域一時停止 UI = OUT（本 slice では触らない）
```

## Selected scope（IN）

### RPF-005 — 保存バッジ強調階層

1. header `SaveStatePresentation` / `SaveStateBadge` の視覚階層を上表に合わせる
2. `saved` / `unsaved` を QUIET にする（ready で業務情報より目立たない）
3. `save_failed` / `save_outcome_unknown` / `saving` を EMPHASIZED にする
4. EMPHASIZED では説明文を残す；QUIET では説明を隠すか muted にする
5. `aria-live` の fail/unknown=assertive / 他=polite を維持する
6. 関連 unit / smoke を階層に合わせて更新し、非丸めと QUIET/EMPHASIZED 差を確認する

色の最終値・description の「hidden vs muted」は Implementation で固定してよい。
QUIET / EMPHASIZED の状態割り当ては変更不可。

## Exact OUT

```text
save / create mutation enablement = OUT
live I/O / SharePoint write = OUT
save-outcome judgment logic = OUT
RPF-007 保存中進行表示 / 操作領域一時停止 = OUT
DUX7-P2-1 詳細プレビュー拡張 = OUT
large visual redesign（shell 全体の色・レイアウト刷新） = OUT
DemoBanner / DEMO-UX-11 note consolidation 巻き戻し = OUT
Family R/A 定義変更 = OUT
business-rule / GOV-RULE changes = OUT
Deploy = OUT
#299 Close = OUT
Implementation Start / Ready / Merge auto-advance = OUT
```

## Must preserve（non-negotiable）

- SHELL-UX-2 の 5状態 vocabulary（labels 区別）
- `save_outcome_unknown` 非丸め（label / description / independent state）
- fail-closed / unselected / access_denied / retrieval_failed
- DemoBanner KEEP（DEMO-UX-11）
- mutation-boundary（実保存不可）
- DEMO-UX-7 today-action navigation
- DEMO-UX-8 users filters
- DEMO-UX-9 daily-record experience
- DEMO-UX-10 Family R / Family A
- DEMO-UX-11 note consolidation（screen-level 帯を戻さない）

## Acceptance criteria

Implementation Start 後の受入は次をすべて満たすこと。

1. **QUIET on ready**
   `saved` および `unsaved` 表示時、header 保存 chrome が Overview KPI / 今日やることより目立たない（強い成功色チップ＋常時説明の並走感がない）。

2. **EMPHASIZE abnormal / in-progress**
   `save_failed` / `save_outcome_unknown` / `saving` は QUIET 状態より明確に強調され、説明文が読める。

3. **Vocabulary intact**
   5状態がすべて表示可能で、ラベルが互いに区別できる。

4. **Non-collapse**
   `save_outcome_unknown` が `saved` または `save_failed` に丸められない（文言・`data-save-state`）。

5. **a11y**
   fail / unknown は `aria-live="assertive"`；他は polite（または同等の安全な告知）。

6. **Safety / prior UX non-regression**
   no-live / no-save / DemoBanner / DEMO-UX-7〜11 の受入意味を壊さない。

7. **検証**
   unit および browser smoke で QUIET vs EMPHASIZED と非丸めを確認する。

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

次の Human gate は **DEMO-UX-12 Implementation Start GO** のみ。

## Evidence referenced

```text
flow feedback:
  docs/architecture/responsible-person-demo-v1-flow-review-feedback-record.md
four-perspective detail:
  /opt/cursor/artifacts/human-ui-review-screenshots/four-perspective-review.md（RPF-005）
recheck:
  /opt/cursor/artifacts/responsible-person-recheck-9dd43e2/recheck-report.md（RPF-005）
predecessor merge:
  PR #325 / 23bc67a7f2e0331146cb92d7ea27c63a02dcf122
  tip a816445e93ca6a3a051cac34ad0a83bdf9b09166（ancestor）
prior save-state:
  docs/architecture/decision-shell-ux-2-save-state-presentation-selection.md
  spfx/src/shell/ux/SaveStateBadge.tsx
  spfx/src/shell/ux/SaveStatePresentation.tsx
  spfx/src/shell/ux/save-state.ts
  spfx/src/shell/ux/ShellUx.module.scss（.saveState*）
  spfx/src/shell/ux/AppShellChrome.tsx
```
