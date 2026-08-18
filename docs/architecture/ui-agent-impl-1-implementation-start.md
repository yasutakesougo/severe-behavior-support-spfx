# UI-AGENT-IMPL-1 — design-context + design-review

```text
Program: UI-AGENT-SYSTEM-V1
Unit: UI-AGENT-IMPL-1 — Agent Skills design-context / design-review
Status: Implementation Start（this PR）
Authority:
  docs/architecture/ui-agent-system-v1-design-issue-body.md
  docs/architecture/ui-agent-system-v1-design-issue-filing.md
  docs/process/skill-catalog.md
Design PR: #424 MERGED
Design HEAD: 2f3167612728d16a6ce61a3637bf3fcea85c4790
GitHub tracking Issue: 未採番（this agent token 403）
Kind: Skill / catalog / workflow wiring
UI-AGENT-IMPL-2 Catalog / IMPL-3 ESLint / Storybook / Figma MCP / Deploy / SharePoint write: NOT AUTHORIZED
```

## 1. Purpose

Product UI Contract の最初の自動化として、Agent Skills `design-context` と `design-review` を導入する。

```text
Token 同期 ≠ 本 slice
意味の同期 = Domain Contract → Visual Decision → Component Usage Rule → Skill → Lint/Test
本 slice = Skill 層のみ
```

## 2. In scope

- `.agents/skills/design-context/`
- `.agents/skills/design-review/`
- Skill catalog / verify-skills expected set
- Architecture / Review Agent 所属
- `review-pr` の UI 差分時 Fallback
- development-process / ai-workflow の UI slice 追加手順

## 3. Explicit OUT

```text
design-implementation Skill 実装（後続。当面 implementation-plan に内包）
Component Catalog v1 本文
ESLint UI semantic rules
Storybook / Chromatic / Tokens Studio
Figma MCP 接続設定
application / SPFx / Domain / Contracts コード変更
Deploy / SharePoint write / Visual Acceptance / #299 Close
```

## 4. Catalog 未着地での実行

Component Catalog v1 は IMPL-2。本 Skill は暫定正本として次を使う。

```text
Domain / Contracts
DADS-03 Style Guide
DADS-04 tokens
DADS-05 primitives（StatusBadge / EmptyNotice 等）
a11y gate / smoke
```

Catalog 不在は FAIL 理由にしない。GAP として HOLD または P2。

## 5. Acceptance

1. `design-context` / `design-review` が導入済み（verify:skills 完全一致）
2. 旧 `skills/design-review/` は参照専用のまま。新 Skill と混同しない
3. `architecture-review` を置換しない
4. `ui-review` は後続のまま
5. Figma コード化を禁止したまま
6. 非 UI PR では `design-review` が `NOT APPLICABLE` を出せる

## 6. Verification（this PR）

```text
npm run verify:skills
npm run format:check
npm run check:scope
```
