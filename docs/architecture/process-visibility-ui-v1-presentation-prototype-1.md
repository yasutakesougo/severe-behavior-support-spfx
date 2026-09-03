# PROCESS-VISIBILITY-UI-V1 — PHASE 2 Presentation Prototype 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: desktop / mobile presentation prototype
status: CORRECTION-1 APPLIED / AWAITING Human Visual Acceptance
correction: docs/architecture/process-visibility-ui-v1-presentation-prototype-correction-1.md
definition: docs/architecture/process-visibility-ui-v1-definition-1.md
freeze: docs/architecture/process-visibility-ui-v1-information-mapping-freeze-1.md
static artifact: docs/architecture/process-visibility-ui-v1-presentation-prototype-1.html
date: 2026-09-03
Implementation Start: NOT AUTHORIZED
product mutation: 0
```

## 1. Purpose

Lock visual information architecture before Implementation Scope.

```text
presentation-only prototype
!= product SupportPlan.tsx mutation
!= new workflow / new business status
!= progress Stepper
```

## 2. Layout contract

### Shared skeleton（Desktop + Mobile — same document flow）

```text
[ Person label + 支援計画 + active version meta ]
[ 支援サイクル Process nav — 6 items ]
[ ① 計画 — Process Header + 目標・支援内容 ]
[ ② 支援 — Process Header + 現在の支援手順 ]
[ ③ 記録 — Process Header + 最近の支援結果 ]
[ ④ モニタリング — Process Header + 期間・事実資料 ]
[ ⑤ 見直し — Process Header + 判断理由 / 次にすること ]
[ ⑥ 次版準備 — Process Header + #576 lifecycle ]
[ 履歴・詳細 — versions + mutation + stateGrid（下位階層） ]
```

### Process Header pattern（同一 HTML、新 component ファイルなし）

```text
左: ①〜⑥ 工程名
右: 既存要約のみ
  ① 版3・適用中
  ② 手順 N件
  ③ 直近 N件
  ④ 根拠 N件
  ⑤ 変更が必要 / 変更なし
  ⑥ 版4・下書き・未適用
```

### Desktop（≥900px / target 1280×900）

- Single Desktop shell only（no side-by-side Mobile mock）
- Process nav: horizontal wrap
- 6 labels with ①〜⑥
- Focus target = Process section `id`

### Mobile（&lt;900px / target 390×844）

- Single Mobile shell only（Desktop strip not rendered）
- Process nav: **2列 × 3行** grid
- Body must include **all six** Process headings in order（Correction-1）
- `horizontal overflow = 0`
- No tabs, no drawer required for V1

### Nav selection semantics

```text
aria-current / 選択中
= ページ内位置
≠ 完了 / 現在工程 / 未完了（Stepper）
```

## 3. Visual separation rules

| Rule | Prototype behavior |
|---|---|
| ③ ≠ ④ | Monitoring after records, own Process Header |
| ⑤ ≠ ⑥ | Review outcome under ⑤; lifecycle CTA under ⑥ |
| 履歴・詳細 | Below ⑥; demoted; not Accordion |
| FIELD_STAFF / ADMIN_AUDIT | Not shown in this PLANNER prototype |

## 4. #576 copy placeholders（must survive）

Prototype ⑥ includes read-only placeholders for:

```text
現在適用中：版 N
版 N+1：まだ適用開始されていない
現在使用中の版 N は変更しません
CTA: 支援内容の見直しを始める（版 N+1 の下書き）
```

## 5. Static artifact

```text
docs/architecture/process-visibility-ui-v1-presentation-prototype-1.html
```

Correction-1: one responsive shell. Synthetic labels only. No SharePoint / LIVE WRITE.

## 6. Gate

```text
Prototype 1 findings = P1×2 + P2×1（Mobile）
Correction-1 = APPLIED
PHASE 2 = READY FOR exact 390 re-read + Human Visual Acceptance
Human Visual Acceptance = NOT RECEIVED
Implementation Start = NOT AUTHORIZED
```
