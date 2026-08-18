# UI-AGENT-IMPL-4 — canonical screen templates

```text
Program: UI-AGENT-SYSTEM-V1
Unit: UI-AGENT-IMPL-4 — canonical screen templates
Status: Implementation Start（this PR）
Authority:
  docs/architecture/ui-agent-system-v1-design-issue-body.md
  docs/architecture/ui-component-catalog-v1.md
IMPL-1: #425 MERGED
IMPL-2: #426 MERGED
IMPL-3: #427 MERGED
main at start: 777a3e0dc01e52c976440ba8e3bfa29faa1f5edb
GitHub tracking Issue: 未採番
Kind: docs + verify hook
generator / Plop / Storybook / Figma MCP / Deploy: NOT AUTHORIZED
```

## 1. Purpose

Product UI Contract の Screen Patterns 層を `docs/architecture/ui-screen-templates-v1.md` に固定する。

```text
template = domain-neutral layout + catalog component slots + smoke hooks
generator / Plop = Later（本 slice では文書化しない・実装しない）
```

新 screen は既存 DADS-UX / Visual Polish 骨格から始める。Catalog は component usage SSOT、Templates は screen 骨格 SSOT、`lint:ui-sem` は forbidden substitution の機械ゲート。

## 2. In scope

- Screen Templates v1 本文（6 templates）
- `scripts/verify-ui-templates.mjs`
- `npm run verify:ui-templates`（verify:ci / Contracts CI / verify-skills / auto-handoff）
- `design-context` / `design-review` の Screen Patterns 参照を正本へ更新

## 3. Explicit OUT

```text
generator / Plop / コード生成
React 共通 layout 抽出
Storybook / Chromatic / Token 同期 / Figma MCP
application / Domain / Contracts mutation
Deploy / SharePoint write / Visual Acceptance / #299 Close
```

## 4. Acceptance

1. 6 templates が layout / catalog slots / forbidden / a11y / smoke hooks を持つ
2. EXISTS の path が実在する
3. host h1 汚染禁止、EmptyNotice ≠ StatusPanel、role で destination を選ばない、plan ≠ procedure
4. generator / Plop / Storybook を新 SSOT にしない
5. `npm run verify:ui-templates` PASS が CI に入る

## 5. Verification（this PR）

```text
npm run verify:ui-templates
npm run verify:ui-catalog
npm run verify:skills
npm run format:check
npm run check:scope
```
