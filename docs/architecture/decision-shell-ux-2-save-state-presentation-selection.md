# SHELL-UX-2 — Save State Presentation — Human Selection Packet

この文書は、SHELL-UX-1 repository closeout COMPLETE（PR #236 / `957fc67…`）後の
**次 shell UX slice** 候補を固定する docs-only Selection Packet である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-SHELL-UX-2-SAVE-STATE-PRESENTATION-1
Kind: Human Selection（Issue #28 next slice）
Status: SELECTED / LOCKED（GO boundary）
Human Decision: SELECT SHELL-UX-2
Date: 2026-08-11
PR: #237（Selection / Acceptance only）

Baseline:
  SHELL-UX-1 repository closeout COMPLETE
  merge commit = 957fc67b051c176d1fac1bb7705562d6b32185c1
  browser smoke = 6/6 PASS
  F-001 = CLOSED / VERIFIED

Implementation Start: NOT AUTHORIZED（separate Human GO）
#28 Close: NOT AUTHORIZED
#22 adapter continuation: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human）
```

## 1. Why this slice now

```text
#28 残責務:
  SHELL-UX-1 で presentation chrome / demo / fail-closed panels /
  PC・tablet / keyboard 基盤は完了。
  Issue completion criteria はまだ残る。

#22:
  Entry Criteria FAIL が残存。
  今 #22 へ戻ると依存が増える。
  #28 を SharePoint-independent に細く完了へ近づける方が安全。

Safety boundary:
  「保存結果不明」を独立 UI 状態として先に固定すると、
  後で #22 を接続しても通信失敗を
  「保存失敗」や「保存成功」へ丸めない。
```

## 2. Selected unit

```text
SHELL-UX-2 — Save State Presentation
```

Relationship to SHELL-UX-1:

```text
SHELL-UX-1 already shipped vocabulary + SaveStateBadge chrome.
SHELL-UX-2 = deepen / complete the shared save-state presentation surface
  （共通表示コンポーネント・a11y・layout・tests/smoke）
without introducing save outcome judgment or live I/O.
```

## 3. Authorized IN（Selection scope）

```text
IN:
  未保存
  保存中
  保存済み
  保存失敗
  保存結果不明
  上記5状態の共通表示コンポーネント
  props / enum による presentation-only 表示
  keyboard / accessibility
  PC / tablet layout
  unit tests / browser smoke
```

## 4. Explicit OUT / FORBIDDEN

```text
OUT:
  SharePoint REST
  live save
  binder host wiring
  liveTenantIoAuthorized = true
  保存結果の判定ロジック
  #22 adapter semantics
  list schema / Internal Name mapping
  business-specific screens
  #21 authorization semantics
  #28 Issue Close
  Ready / Merge auto-progress
  Implementation Start（this Selection alone）
```

## 5. Options considered

| ID | Unit | Result |
|---|---|---|
| **A** | SHELL-UX-2 — Save State Presentation | **SELECTED** |
| B | Return to #22 adapter path now | NOT SELECTED |
| C | #28 Close without further slice | NOT SELECTED |
| D | HOLD / no next shell UX slice | NOT SELECTED |

## 6. Stop condition

```text
Decision-SHELL-UX-2-SAVE-STATE-PRESENTATION-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO

Still NOT AUTHORIZED:
  code Implementation Start
  #28 Close
  #22 continuation
  live save / REST / binder wiring
```

## Reference

- Acceptance: `decision-shell-ux-2-save-state-presentation-acceptance.md`
- PR: #237（Selection / Acceptance only）
- Prior closeout: `shell-ux-1-browser-smoke-p2-closeout.md`
- Prior Implementation Start: `shell-ux-1-implementation-start.md`
- Issue #28 remains OPEN; Close = NOT AUTHORIZED
- Next gate after Selection: Human GO for Implementation Start（separate）
