# DEMO-UX-14 — 保存中の可観測性 Selection（RPF-007）

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-14 — Saving progress observability
Decision: Decision-DEMO-UX-14-SAVING-PROGRESS-OBSERVABILITY-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-13）
Baseline main: b7897818ea3b334f5e6c2430e656c0bf3d2078f2
Predecessor: DEMO-UX-13 MERGED（PR #328 / c92ca6c）+ closeout sync MERGED（PR #329 / b789781）
Source feedback: RPF-007（P3）
Follow-on queue（not this slice）: none required（#299 remaining backlog may still include holdovers）
Implementation Start: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
SharePoint write: NOT AUTHORIZED
```

## Authority

Human は DEMO-UX-13 closeout（PR #329）Merge SUCCESS を確認し、次として **RPF-007 Selection** を進める方針を示した。

本 Selection は **RPF-007 のみ** を SELECTED / LOCKED とする。

```text
DEMO-UX-14 Implementation Start = NOT AUTHORIZED（separate Human GO）
Deploy / SharePoint write / #299 Close = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
```

実保存・autosave・live I/O は導入しない。
`saving` 表示の**可観測性**（進行が分かること／操作を控えるべきことが分かること）だけを直す。

## Goal

```text
saveState=saving のとき
  → 静的な「保存中」文言だけでなく、進行中であることが分かる
  → 主要操作領域が一時停止している見た目になる
  → 二重操作・遷移してよいかの迷いを減らす
  → DEMO-UX-12 の EMPHASIZED 階層と 5状態 vocabulary は維持する
  → 実保存はしない（合成 presentation-only）
```

## Selection-phase investigation（LOCKED findings）

### 1. Current saving presentation inventory

| ID | Surface / source | Current behavior |
|---|---|---|
| SV-BADGE | `SaveStateBadge` / `save-state.ts` | `saving` → ラベル「保存中」 |
| SV-DESC | `SaveStatePresentation` | EMPHASIZED；説明「保存処理を表示中です。」 |
| SV-EMPH | DEMO-UX-12 | `saving` は EMPHASIZED（QUIET ではない） |
| SV-ARIA | `ariaLiveForShellSaveState` | `saving` = polite |
| SV-STYLE | `.saveState_saving` | 青系 chip；**動きなし** |
| SV-BUSY | chrome | `aria-busy` / progress indicator **なし** |
| SV-PAUSE | `AppShellChrome` ready region / primary nav | `saving` でも通常どおり操作可能（nav は unselected/viewMode でのみ disable） |
| SV-MUT | Records/Review/Support mutation | もともと disabled（実保存なし） |

### 2. Problem（RPF-007）

```text
observation:
  「保存中」は文言で分かるが、進行中であることが動き/disabled領域で伝わりにくい。

requestedOutcome（four-perspective）:
  保存中は主要操作領域を一時停止する見た目、または進行インジケータを足す。

reason:
  現場が二重送信や画面遷移をしてよいか判断しづらい。

priority: P3
```

DEMO-UX-12 は強調階層のみを直し、**進行 UI / 操作一時停止は明示 OUT** だった。

### 3. Options considered

| ID | Approach | Result |
|---|---|---|
| A | Progress cue only（badge/presentation に進行表示 + `aria-busy`） | NOT SELECTED alone（disabled 領域の要求が残る） |
| B | Operation-area pause appearance only（nav/ready 操作を一時停止見た目） | NOT SELECTED alone（「動き」の要求が残る） |
| **C** | **Both**: progress cue **and** primary interaction pause appearance while `saving` | **SELECTED** |
| D | Wire real save / autosave / disable only mutation that becomes live | NOT SELECTED（OUT / unsafe） |
| E | HOLD | NOT SELECTED（Human Selection GO） |

Option C は requestedOutcome の両要素（進行インジケータ **または** 一時停止見た目）を、薄い presentation-only で同時に満たす。

### 4. Canonical saving observability（LOCKED）

When `saveState === "saving"`（and only then）:

```text
Layer 1 — Progress cue（必須）
  SaveStatePresentation / badge に進行中シグナルを足す
  - 視覚: progress cue（CSS アニメーションまたは同等の進行表示）
  - a11y: aria-busy="true"（または同等）on save chrome
  - テキスト: 「保存中」ラベル + 説明を維持（色だけに依存しない）

Layer 2 — Interaction pause appearance（必須）
  主要操作領域を一時停止した見た目にする
  - primary nav buttons: disabled / aria-disabled
  - ready-region の主な操作コントロール（today-actions / list detail / filters 等）:
      disabled または pointer-events 停止 + 明示的 pause 注記
  - pause 注記例の意味（文言は Implementation で固定可）:
      「保存中のため操作を一時停止して表示しています（合成・実保存なし）」

Layer 3 — Non-negotiable safety
  実保存はしない
  mutation enablement はしない（Records/Review/Support の disabled を「保存可能」にしない）
  save_outcome_unknown / fail-closed / unselected を弱めない
  DEMO-UX-12 QUIET/EMPHASIZED 割り当てを崩さない
```

When `saveState !== "saving"`:

```text
progress cue OFF
interaction pause OFF
既存 DEMO-UX-7〜13 挙動を維持
```

### 5. Keep / change matrix（LOCKED）

| Item | Action | Rationale |
|---|---|---|
| 5-state vocabulary | **KEEP** | SHELL-UX-2 |
| DEMO-UX-12 EMPHASIZED for `saving` | **KEEP** | 階層非回帰 |
| `saving` label「保存中」 | **KEEP** | テキスト判別 |
| `saving` description | **UPDATE allowed** | 進行/一時停止の意味を足してよい（成功丸め禁止） |
| Progress cue on saving | **ADD** | RPF-007 |
| Pause appearance on saving | **ADD** | RPF-007 |
| Real save / autosave | **OUT** | 安全境界 |
| Enabling previously disabled mutations | **OUT** | no-save |
| Pause on `saved` / `unsaved` / fail / unknown | **OUT** | saving のみ |
| Large visual redesign | **OUT** | 薄い差分に限定 |

### 6. Explicit non-changes（safety meaning）

```text
live save / SharePoint write = forbidden
autosave / persisted draft = forbidden
enabling create/save/review-complete buttons = forbidden
save_outcome_unknown → saved/failed 丸め = forbidden
treating saving as saved success = forbidden
unselected / access_denied relaxation = forbidden
DemoBanner removal = forbidden
DEMO-UX-7〜13 behavior regression = forbidden
```

## Selected scope（IN）

### RPF-007 — 保存中の可観測性

1. `saveState=saving` で SaveStatePresentation に **progress cue** を出す（`aria-busy` 含む）
2. `saveState=saving` で **primary nav + ready 主要操作**を一時停止見た目にする
3. 一時停止の合成境界注記を出し、実保存なしを明示する
4. `saving` 以外では progress/pause を出さない
5. DEMO-UX-12 の QUIET/EMPHASIZED を維持する
6. unit / browser smoke で saving vs non-saving、pause、非丸め、安全境界を確認する

実装手段（CSS animation / `data-saving-progress` / ready-region wrapper）は Implementation に委ねる。
**「saving のとき progress + pause」「他状態では出さない」「実保存なし」は変更不可。**

## Exact OUT

```text
live save / autosave / persisted draft = OUT
SharePoint read/write / live I/O = OUT
mutation enablement（作成・保存・見直し完了等）= OUT
new save states / vocabulary collapse = OUT
pause UI for non-saving states = OUT
large visual redesign = OUT
business-rule / GOV-RULE changes = OUT
Deploy = OUT
#299 Close = OUT
Implementation Start / Ready / Merge auto-advance = OUT
```

## Must preserve（non-negotiable）

- DEMO / synthetic / no live SharePoint（DemoBanner）
- 実保存不可（mutation-boundary）
- fail-closed / unselected / `save_outcome_unknown` 非丸め
- DEMO-UX-12 save badge hierarchy（QUIET/EMPHASIZED）
- DEMO-UX-7 today-actions（saving 以外）
- DEMO-UX-8 filters（saving 以外）
- DEMO-UX-9 daily-record experience（saving 以外；保存 disabled 維持）
- DEMO-UX-10 Family R / Family A
- DEMO-UX-11 note consolidation
- DEMO-UX-13 fixture-backed detail preview（saving 以外）

## Acceptance criteria

Implementation Start 後の受入は次をすべて満たすこと。

1. **Progress on saving**
   `saveState=saving` で進行中シグナルが視覚とテキスト（および `aria-busy` 等）で分かる。

2. **Pause on saving**
   `saving` 中、primary nav と ready 主要操作が一時停止見た目で、操作控える説明が読める。

3. **Scoped to saving**
   `unsaved` / `saved` / `save_failed` / `save_outcome_unknown` では progress/pause を出さない。

4. **No live save**
   mutation が enabled にならない。実保存・SharePoint 接続を主張しない。

5. **Hierarchy / vocabulary intact**
   DEMO-UX-12 EMPHASIZED/QUIET と 5状態ラベルが維持される。`saving` ≠ `saved`。

6. **Safety non-regression**
   unselected / access_denied / `save_outcome_unknown` 非丸めを壊さない。

7. **検証**
   unit および browser smoke で saving progress/pause と non-saving 非適用を確認する。

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

次の Human gate は **DEMO-UX-14 Implementation Start GO** のみ。

## Evidence referenced

```text
flow feedback:
  docs/architecture/responsible-person-demo-v1-flow-review-feedback-record.md（RPF-007）
four-perspective detail:
  /opt/cursor/artifacts/human-ui-review-screenshots/four-perspective-review.md（RPF-007）
predecessor merges:
  PR #328 / c92ca6c7d6ac67b68b0227738e8ce6df34d20297
  PR #329 / b7897818ea3b334f5e6c2430e656c0bf3d2078f2
  expected tip f91b64470264f3e3810c6161b1b32497915d27f5（ancestor）
prior hierarchy:
  docs/architecture/decision-demo-ux-12-save-badge-hierarchy-selection.md
  spfx/src/shell/ux/SaveStatePresentation.tsx
  spfx/src/shell/ux/SaveStateBadge.tsx
  spfx/src/shell/ux/save-state.ts
  spfx/src/shell/ux/AppShellChrome.tsx
```
