# SHELL-UX-3 — Display-only Multi-Site Selector — Human Selection Packet

この文書は、Issue #28 Close criteria assessment FAIL（PR #239）後の
**次 shell UX slice** として **C-B** を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-3-MULTI-SITE-SELECTOR-1
Kind: Human Selection（Issue #28 next slice / candidate C-B）
Status: SELECTED / LOCKED（GO boundary）
Human Decision: SELECT C-B / SHELL-UX-3
Date: 2026-08-11

Baseline:
  main tip = 61a212a409b4134c802435226998753d1903ee1f
  SHELL-UX-2 = MERGED（PR #238）
  Close criteria assessment = FAIL / KEEP OPEN（PR #239；Decision-ISSUE-28-CLOSE-CRITERIA-ASSESSMENT-1）

Candidate origin:
  issue-28-close-criteria-assessment.md → C-B

Implementation Start: NOT AUTHORIZED（separate Human GO）
#28 Close: NOT AUTHORIZED
#21 authorization truth: OUT
#22 adapter continuation: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human）
```

## 1. Why this slice now

```text
Close criteria FAIL の残 candidate のうち、
C-B（複数事業所の display-only 選択 + 未選択 stop chrome）は
Issue #28 担当範囲「複数事業所所属時の明示選択」と
必須tests「事業所未選択時に業務操作を停止」に直接対応する。

#21 の所属判定・認可真理値には踏み込まず、
props / fixture 駆動の presentation だけを先に固定する。
```

## 2. Selected unit

```text
C-B / SHELL-UX-3
Display-only multi-site selector + site-unselected stop chrome
```

## 3. Authorized IN（Selection scope）

```text
IN:
  複数事業所を選択する presentation UI
  SITE-ISG / SITE-HOM の表示選択肢
  未選択状態
  未選択時の shell-level stop chrome
  keyboard / focus / a11y
  PC / tablet
  unit tests / browser smoke
  props / fixture による presentation-only 状態
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  実際の所属事業所判定
  Entra / SharePoint membership lookup
  authorization truth
  #21 semantics
  SharePoint REST
  binder wiring
  live I/O
  liveTenantIoAuthorized = true
  business data
  #22 semantics
  #28 Issue Close
  Ready / Merge auto-progress
  Implementation Start（this Selection alone）
  他 candidate（C-A / C-C〜C-H）の自動選択
```

## 5. Options considered

| ID | Unit | Result |
|---|---|---|
| **C-B** | Display-only multi-site selector + site-unselected stop chrome | **SELECTED** |
| C-A | Unauthenticated fail-closed presentation panel | NOT SELECTED |
| C-C | SITE-HOM（+ ISG）label fixture / smoke only | NOT SELECTED（C-B に包含可能な表示面あり） |
| C-D | Partial-retrieval presentation boundary | NOT SELECTED |
| C-E | Error-code + correlationId display | NOT SELECTED |
| C-F | Keyboard traversal evidence only | NOT SELECTED |
| C-G | Horizontal-scroll + 200% smoke | NOT SELECTED |
| C-H | Issue-body SoT refresh | NOT SELECTED |

## 6. Stop condition

```text
Decision-SHELL-UX-3-MULTI-SITE-SELECTOR-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO

Still NOT AUTHORIZED:
  code Implementation Start
  #28 Close
  #21 / #22 continuation
  live I/O / membership lookup
```

## Reference

- Acceptance: `decision-shell-ux-3-multi-site-selector-acceptance.md`
- Prior assessment: `issue-28-close-criteria-assessment.md`（PR #239）
- Prior: `shell-ux-2-implementation-start.md`, `shell-ux-2-browser-smoke.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
- Next gate after Selection: Human GO for Implementation Start（separate）
