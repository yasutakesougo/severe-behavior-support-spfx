# PROCESS-VISIBILITY-UI-V1 — Presentation Prototype Correction-1

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: PROCESS-VISIBILITY-UI-V1
kind: presentation prototype correction evidence
basis prototype: docs/architecture/process-visibility-ui-v1-presentation-prototype-1.md
html: docs/architecture/process-visibility-ui-v1-presentation-prototype-1.html
date: 2026-09-03
status: CORRECTION-1 APPLIED / READY FOR exact Mobile re-read + Human Visual Acceptance
P0 = 0
P1 closed by this correction = 2
P2 mitigated = 1
product mutation: 0
Implementation Start: NOT AUTHORIZED
```

## 1. Incoming findings（Human re-read of Prototype 1）

| ID | Severity | Finding |
|---|---|---|
| P1-1 | P1 | Mobile body omitted ②支援 and ⑤見直し → nav≠body cycle |
| P1-2 | P1 | 390px capture showed Desktop strip first with horizontal overflow; side-by-side mock ≠ real Mobile viewport |
| P2-1 | P2 | Selected「①計画」could read as Stepper「現在工程」 |

```text
Definition / Scope
= NOT invalidated by these findings
= remain REVIEW-CLEARED / Lock ELIGIBLE（Definition）
= Scope remains candidate / Implementation blocked
```

## 2. Correction-1 changes

### P1-1 — Mobile 6工程復元

Mobile（and shared responsive body）now always renders:

```text
① 計画
② 支援
③ 記録
④ モニタリング
⑤ 見直し
⑥ 次版準備
```

Recommended Mobile copy shape applied（目標・支援内容 / 現在の支援手順 / 最近の支援結果 / 期間・事実資料 / 判断理由+次にすること / #576 lifecycle）.

### P1-2 — Real responsive viewport

```text
BEFORE: Desktop frame + Mobile frame side-by-side（overflow at 390px）
AFTER:  single shell
  <900px → Mobile structure only（2×3 nav）
  ≥900px → Desktop structure only（horizontal wrap nav）
fixed 390px panel width = removed
overflow-x = hidden on html/body/shell
```

Acceptance targets for exact capture:

```text
390×844
horizontal overflow = 0
表示対象 = Mobile structure
6 process headings = all in document flow
Process nav = 2列×3行
text truncation = 0（labels remain fully readable）
```

### P2-1 — no Stepper semantics

```text
aria-current = in-page section position only
hint copy: 選択中 = いま見ているセクション位置（完了/現在工程/未完了は表示しません）
no 完了 / 現在 / 未完了 badges
```

## 4. Exact capture evidence（Correction-1）

Measured via headless Chromium against the Correction-1 HTML.

| Viewport | overflowX | delta | Mobile-only label | 6 headings in flow | nav | truncated |
|---|---|---|---|---|---|---|
| 390×844 | false | 0 | true | true（①〜⑥） | grid 2列 | [] |
| 1280×900 | false | 0 | false（Desktop-only） | true（①〜⑥） | flex wrap | [] |

Artifacts:

```text
/opt/cursor/artifacts/process-visibility-ui-v1-c1-mobile-390x844.png
/opt/cursor/artifacts/process-visibility-ui-v1-c1-mobile-390x844-viewport.png
/opt/cursor/artifacts/process-visibility-ui-v1-c1-mobile-390x844.json
/opt/cursor/artifacts/process-visibility-ui-v1-c1-desktop-1280x900.png
/opt/cursor/artifacts/process-visibility-ui-v1-c1-desktop-1280x900-viewport.png
/opt/cursor/artifacts/process-visibility-ui-v1-c1-desktop-1280x900.json
```

```text
P1-1 = CLOSED
P1-2 = CLOSED
P2-1 = MITIGATED（nav-hint + aria-current position semantics）
```

## 5. Unchanged（intentionally）

```text
Desktop IA direction = keep
6 Process Header + right-side meta pattern = keep
#576 lifecycle placeholders under ⑥ = keep
Definition / Scope / #576 gate = unchanged
SupportPlan.tsx = untouched
```

## 6. Gate

```text
Prototype 1 = SUPERSEDED by Correction-1 HTML
Prototype Correction-1 = APPLIED + exact Mobile re-read PASS
Human Visual Acceptance = NOT RECEIVED（now ELIGIBLE）
Definition Lock = still Human-owned / ELIGIBLE（not blocked by Mobile correction）
Implementation Start = NOT AUTHORIZED
#576 prerequisite = ACTIVE HOLD
```
