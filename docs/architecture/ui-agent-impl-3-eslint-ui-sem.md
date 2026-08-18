# UI-AGENT-IMPL-3 — ESLint UI semantic rules

```text
Program: UI-AGENT-SYSTEM-V1
Unit: UI-AGENT-IMPL-3 — ESLint UI semantic rules
Status: Implementation Start（this PR）
Authority:
  docs/architecture/ui-agent-system-v1-design-issue-body.md
  docs/architecture/ui-component-catalog-v1.md
IMPL-1: #425 MERGED
IMPL-2: #426 MERGED
main at start: b9650725e55515992a60ba62a70ccb29e9888c7b
GitHub tracking Issue: 未採番
Kind: deterministic UI-SEM ESLint + SCSS hex scan
UI-AGENT-IMPL-4 screen templates / Storybook / Figma MCP / Deploy: NOT AUTHORIZED
```

## 1. Purpose

Catalog の forbidden substitutions を、開発時 / CI の決定論的ルールにする。

```text
ESLint（root ESLint 10） → spfx/src/shell TS/TSX
SCSS hex scan            → UI-SEM-04（tokens と theme fallback 以外）
a11y gate                → 既存 blocking acceptance
smoke                    → presentation boundary
```

SPFx Heft ESLint は置換しない。root `lint`（src/tests/scripts）も置換しない。

## 2. Rules

| ID | ESLint rule | 検出 |
|---|---|---|
| UI-SEM-01 | `sbs-ui-sem/status-badge-label` | `StatusBadge` の label 欠落 / 空文字 |
| UI-SEM-02 | `sbs-ui-sem/empty-notice-not-fail-closed` | EmptyNotice に fail-closed 文言。StatusPanel が EmptyNotice を import |
| UI-SEM-03 | `sbs-ui-sem/save-state-vocabulary` | `save_*` の 5-state 外。発明ラベル（保存成功 等） |
| UI-SEM-04 | `sbs-ui-sem/no-raw-hex-rem` + SCSS scan | コンポーネントの raw hex。JSX `style` の ad-hoc rem。screen SCSS の raw hex |
| UI-SEM-05 | `sbs-ui-sem/presentation-role-not-nav` | primary nav に role を埋め込む。role で destination を選ぶ |

UI-SEM-04 rem: 既存 SCSS rem dialect と `users-list-compact.ts` は ADAPT として対象外。新規の TSX inline `style` rem と screen SCSS hex だけを止める。

GitHub Issue 番号（`#356`）は 3 桁数字のみのため hex とみなさない。`#fff` のように letter を含む 3 桁は色として検出する。

`spfx/src/shell/tokens/**` は DADS-04 正本のため ESLint / SCSS scan の対象外。

既存 `eslint-disable-next-line react-hooks/exhaustive-deps`（`UsersList.tsx`）は ESLint 10 で未知ルールエラーになるため、ui-sem config に no-op stub を置く。Heft の react-hooks 正本は置換しない。

EmptyNotice の fail-closed 検出は静的 JSX テキストが対象。定数参照の children は UI-SEM-02 では追わない（StatusPanel import 禁止で構造混同を止める）。

## 3. In scope

- `scripts/ui-sem/plugin.mjs`
- `scripts/ui-sem/run.mjs`
- `eslint.ui-sem.config.mjs`
- `npm run lint:ui-sem`
- `tests/ui-sem/ui-sem-rules.test.ts`
- CI / verify:ci / auto-handoff 配線

## 4. Explicit OUT

```text
Screen templates / generator（IMPL-4）
Storybook / Chromatic / Token 同期 / Figma MCP
SPFx Heft ESLint プロファイル変更
既存 SCSS rem の一括 token 化
application behavior / Domain / Contracts mutation
Deploy / SharePoint write / Visual Acceptance / #299 Close
```

## 5. Acceptance

1. UI-SEM-01..05 が RuleTester で valid/invalid を区別する
2. 現行 `spfx/src/shell` に対して lint:ui-sem PASS
3. verify:ci が lint:ui-sem を実行する
4. Heft ESLint / root lint の対象集合を広げない

## 6. Verification（this PR）

```text
npm run lint:ui-sem
npm test -- tests/ui-sem/ui-sem-rules.test.ts
npm run lint
npm run verify:skills
npm run format:check
npm run check:scope
```
