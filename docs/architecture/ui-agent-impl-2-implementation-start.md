# UI-AGENT-IMPL-2 — Component Catalog v1 + verify hook

```text
Program: UI-AGENT-SYSTEM-V1
Unit: UI-AGENT-IMPL-2 — Component Catalog v1 + verify hook
Status: Implementation Start（this PR）
Authority:
  docs/architecture/ui-agent-system-v1-design-issue-body.md
  docs/architecture/ui-agent-impl-1-implementation-start.md
IMPL-1: #425 MERGED
HEAD at IMPL-1 merge: 6d638cbd385aa166835597ca420b99b99f9dee6e
main at start: 33035abff773520fec33c95876240187038741b1
GitHub tracking Issue: 未採番（this agent token 403）
Kind: docs + verify hook
UI-AGENT-IMPL-3 ESLint / Storybook / Figma MCP / Deploy / SharePoint write: NOT AUTHORIZED
```

## 1. Purpose

Product UI Contract の Component Usage Rule を `docs/architecture/ui-component-catalog-v1.md` に固定し、`npm run verify:ui-catalog` で構造を機械検査する。

```text
Token 同期 ≠ 本 slice
新 primitive 抽出 ≠ 本 slice
Storybook を新 SSOT にしない
```

## 2. In scope

- Catalog v1 本文（6 entries）
- `scripts/verify-ui-catalog.mjs`
- `verify:ci` / Contracts CI / verify-skills required scripts 配線
- `design-context` / `design-review` の Catalog 参照を暫定から正本へ更新

## 3. Explicit OUT

```text
ESLint UI-SEM-*（IMPL-3）
Screen templates（IMPL-4）
Storybook / Chromatic
UserSummary / ProcedureSummary の React 抽出
application / Domain / Contracts mutation
Deploy / SharePoint write / Visual Acceptance / #299 Close
```

## 4. Acceptance

1. 6 entries が Domain meaning / forbidden / a11y / examples を持つ
2. EXISTS/PATTERN/KEEP の path が実在する
3. 要確認 ≠ 未記録、save_failed ≠ save_outcome_unknown、Current ≠ historical、EmptyNotice ≠ StatusPanel
4. Storybook を新 SSOT にしない
5. `npm run verify:ui-catalog` PASS が CI に入る

## 5. Verification（this PR）

```text
npm run verify:ui-catalog
npm run verify:skills
npm run format:check
npm run check:scope
```
