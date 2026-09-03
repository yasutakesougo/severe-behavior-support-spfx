# PROCESS-VISIBILITY-UI-V1 — PHASE 2 Presentation Prototype 1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: desktop / mobile presentation prototype
status: PROTOTYPE READY / AWAITING Human Visual Acceptance
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

### Shared skeleton

```text
[ Person label + active version meta ]
[ Process nav — 6 items ]
[ ① 計画 — Process Header + summary/goals/actions ]
[ ② 支援 — Process Header + procedures ]
[ ③ 記録 — Process Header + recent records only ]
[ ④ モニタリング — Process Header + existing MonitoringView ]
[ ⑤ 見直し — Process Header + reviewStatus + capturedReview ]
[ ⑥ 次版準備 — Process Header + #576 nextVersionBlock invariants ]
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

### Desktop（1280×900）

- Process nav: existing `sectionNavButton*` horizontal wrap
- 6 labels: 計画 / 支援 / 記録 / モニタリング / 見直し / 次版準備
- Focus target = Process section `id`（heading）

### Mobile（390×844）

- Process nav: **2列 × 3行** grid
- Same 6 labels / same focus targets
- No tabs, no drawer required for V1

## 3. Visual separation rules

| Rule | Prototype behavior |
|---|---|
| ③ ≠ ④ | Monitoring is **after** records, under its own Process Header |
| ⑤ ≠ ⑥ | Review outcome/reason grouped under ⑤; lifecycle CTA under ⑥ |
| 履歴・詳細 | Below ⑥; visually demoted（smaller heading / spacing）, not Accordion |
| FIELD_STAFF / ADMIN_AUDIT | Not shown in this PLANNER prototype |

## 4. #576 copy placeholders（must survive）

Prototype ⑥ includes read-only placeholders for:

```text
現在適用中: 版 N
版 N+1 は下書きです。まだ適用開始されていません
現在使用中の版 N は変更しません
CTA: 支援内容の見直しを始める（版 N+1 の下書き）
```

## 5. Static artifact

Open:

```text
docs/architecture/process-visibility-ui-v1-presentation-prototype-1.html
```

Contains Desktop strip + Mobile 390px frame. Synthetic labels only. No SharePoint / LIVE WRITE.

## 6. Gate

```text
PHASE 2 Prototype = READY FOR 5 Persona + Human Visual Acceptance
Human Visual Acceptance = NOT RECEIVED
Implementation Start = NOT AUTHORIZED
```
