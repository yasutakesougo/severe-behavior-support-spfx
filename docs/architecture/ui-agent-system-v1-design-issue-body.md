## 目的

強度行動障害支援 SPFx において、**Product UI Contract**（Domain Contract → Visual Decision → Component Usage Rule → Agent Skill → Lint / Test）を SSOT として固定する **UI-AGENT-SYSTEM-V1** の設計境界を定義する。

本 Issue は **設計・正本境界の固定** までとする。Skill 実装・Component Catalog 実装・ESLint ルール追加・Storybook 導入・Figma MCP 接続・Deploy / SharePoint write / Visual Acceptance / #299 Close は **含まない**。

```text
目標 ≠ 一般的なデザインシステム SaaS の導入
目標 = 業務意味のズレを先に防ぐ Product UI Contract + Agent Skills + 決定論的ゲート
```

## 背景（なぜ今）

現状、次の正本はすでに存在する。

```text
docs/architecture/          — DADS / Visual Polish / screen convergence
docs/decisions/             — 制度・業務ルール
contracts / domain          — 業務意味・語彙
.agents/skills/             — requirements / architecture / implementation / review
spfx/src/shell/primitives/  — StatusBadge / EmptyNotice / …
scripts/a11y/               — accessibility gate
spfx/smoke/                 — browser smoke
```

一方、**最も危ない UI ズレは色や余白ではなく業務意味** である。

| 例 | ズレの種類 |
|---|---|
| 「要確認」と「未記録」 | status vocabulary |
| `save_failed` と `save_outcome_unknown` | save 5-state / fail-closed |
| CurrentProcedure と historical procedure | procedure binding |
| 現場職員と計画担当者の入口 | role / navigation |
| 支援計画と支援手順の関係 | plan ↔ procedure link |

したがって、Token 同期（Figma Variables → Tokens Studio → Style Dictionary）より **意味の同期** を先に自動化する。

## 優先順位（導入判定）

| 優先 | 導入対象 | 判定 | 本 Issue での扱い |
|---|---|---|---|
| 1 | Agent Skills `design-context` / `design-review` | **今やる** | 設計対象（Skill 仕様） |
| 2 | UI Component Catalog | **今やる** | 設計対象（正本文書） |
| 3 | ESLint 等の決定論的 UI ルール | **今やる価値大** | 設計対象（ルール境界） |
| 4 | canonical screen template / generator | 近いうち | 設計対象（境界のみ） |
| 5 | Figma MCP | Figma を正本にするなら | 設計対象（boundary のみ） |
| 6 | Storybook | 必要性を見て判断 | **新 SSOT にしない**；Catalog 実行可能化の候補として記載 |
| 7 | Chromatic | UI 安定後 | Later；本 Issue では境界のみ |
| 8 | Tokens Studio / Style Dictionary | 現時点では過剰 | **Explicit OUT** |
| 9 | Specify / Supernova / zeroheight | 今の規模では不要 | **Explicit OUT** |

## 推奨構成（UI-AGENT-SYSTEM-V1）

```text
SSOT
├─ Domain Contract          ← 既存 contracts / domain（上位）
├─ Visual Principles        ← DADS-03 Style Guide / DADS-04 tokens
├─ Component Catalog        ← NEW（本 Issue で設計）
└─ Screen Patterns          ← DADS-UX-* / Visual Polish 継承 + template 境界

Agent
├─ design-context           ← NEW Skill（本 Issue で設計）
├─ design-implementation    ← NEW Skill（本 Issue で設計；実装計画との接続）
└─ design-review            ← NEW Skill（architecture-review とは分離）

Deterministic Gates
├─ ESLint                   ← NEW UI rules（本 Issue で境界設計）
├─ TypeScript
├─ semantic tests
├─ a11y tests               ← 既存 scripts/a11y/
└─ browser smoke            ← 既存 spfx/smoke/

Optional Visual Sources
├─ Figma MCP                ← boundary のみ設計
└─ Storybook                ← Catalog 実行可能化の候補；必須ではない

Later
├─ VRT / Chromatic
└─ generator / Plop
```

## Authority Boundary（LOCKED 案）

DADS-03 / Decision-DADS-ADOPTION-V1 を継承する。

```text
制度・業務ルール
        ↓
Domain / Contracts              ← 業務上「何を意味するか」の正本
        ↓
Product UI Contract（本 Issue）  ← 意味を UI でどう表現するか
        ↑
Visual Principles（DADS-03）     ← 表示・操作の原則
        ↑
DADS                            ← 基礎・参考（Domain より上位にしない）
        ↓
SPFx / React 実装
```

### FORBIDDEN（UI Contract 主導の変更でも UNCHANGED）

```text
Domain モデルの意味
Contracts 語彙の意味（recordStatus / reasonCodes / save 5-state 等）
SharePoint schema / mapping
権限モデル / Entra / role policy
fail-closed / unselected / access_denied / save_outcome_unknown 非丸め
支援計画・支援手順の業務 Decision の意味
```

意味変更が必要なら **別 Decision / 別 Issue**。

## 設計成果物（本 Issue の Must Deliver）

### 1. Component Catalog（正本）

`docs/architecture/ui-component-catalog-v1.md`（仮）として固定する内容。

**初期カタログ対象（最低限）**

| Component | 現状 | Catalog に載せる意味 |
|---|---|---|
| `StatusBadge` | `spfx/src/shell/primitives/StatusBadge.tsx` | status vocabulary の label channel |
| `EmptyNotice` | `spfx/src/shell/primitives/EmptyNotice.tsx` | zero-result ≠ failure ≠ all-clear |
| `SaveStateNotice` | 要整理（分散実装の可能性） | save 5-state の UI 表現 |
| `UserSummary` | 要整理 | 利用者サマリの意味チャネル |
| `ProcedureSummary` | 要整理 | current vs historical procedure |
| `EmptyNotice` 系パネル | StatusPanel family と分離 | fail-closed パネルは KEEP |

各エントリに最低限載せる項目:

```text
- domain meaning（contracts 語彙への参照）
- allowed props / states
- forbidden substitutions（例: color-only status）
- required a11y channel（label / live region）
- good examples / bad examples
- related smoke / a11y gate IDs
- adoption surfaces（Users / Records / Review / SupportPlan 等）
```

Storybook は **Catalog の新 SSOT にはしない**。必要なら「Catalog を実行可能にするビューア」として後続判断。

### 2. Agent Skills

#### `design-context`（Architecture Agent 所属候補）

目的: UI 作業前に repository SSOT を収集し、**visual intent と domain semantics の整合前提**を固定する。

入力:

```text
- 対象 screen / slice / Issue
- docs/architecture/ 該当文書
- contracts / domain 該当語彙
- Component Catalog 該当エントリ
- 既存 components / tests / smoke
- （任意）Figma MCP — layout / component / variables / screen reference
```

出力:

```text
- domain semantics summary（意味の正本参照）
- visual intent summary
- component mapping（既存 primitive で表現可能か）
- gaps / HOLD（意味 Decision 不足、Catalog 未整備等）
- 実装計画への引き渡し条件
```

**禁止**: Figma をそのままコード化せよ、と指示しない。

```text
Figma → visual intent 取得
      → repository domain semantics と照合
      → 既存 component で表現可能か判定
      → 実装計画を作る
```

#### `design-implementation`（Implementation Agent 所属候補）

目的: `design-context` 出力と `implementation-plan` を接続し、UI slice の Issue / PR / test 分割案を作る。

#### `design-review`（Review Agent 所属候補）

目的: UI 変更が **Product UI Contract** に沿っているかを監査する。

`architecture-review` との分離:

| Skill | 主眼 |
|---|---|
| `architecture-review` | Domain / Contracts / SharePoint / ADR / Gate |
| `design-review` | Component Catalog / Screen Patterns / semantic UI rules / a11y meaning |

`skills/design-review/`（旧参照専用）とは **別 Skill** として新設する。旧名の復活はしない。

### 3. Deterministic UI Rules（ESLint 等）

Token 同期より先に、**意味を壊す UI パターン**を機械検出する。

設計対象ルール例（採否は本 Issue で確定）:

| Rule ID | 意図 |
|---|---|
| UI-SEM-01 | status を color-only で表現しない（`StatusBadge` label 必須） |
| UI-SEM-02 | zero-result empty を failure panel と混同しない |
| UI-SEM-03 | save state を 5-state 語彙外で invent しない |
| UI-SEM-04 | raw hex / ad-hoc rem を新規 UI に持ち込まない（DADS-04 参照） |
| UI-SEM-05 | role-specific entry を navigation だけで暗黙にしない |

既存 `scripts/a11y/accessibility-gate.mjs` との役割分担:

```text
ESLint  → 静的 / 開発時 / PR diff
a11y gate → blocking acceptance（既存）
smoke   → end-to-end presentation boundary（既存）
```

### 4. Screen Patterns / Templates（境界のみ）

近いうちに導入する **canonical screen template / generator** の設計境界。

```text
template = domain-neutral layout + catalog component slots + smoke hooks
generator = Plop 等は Later
```

Visual Polish / DADS-UX-* / Support Plan UI の既存 slice パターンを継承し、新 screen 追加時の最小骨格を文書化する。

### 5. Figma MCP Boundary

Figma を Visual Decision の **optional source** として使う場合の境界。

```text
Design Context Agent
│
├─ repository（正本）
│   ├─ architecture docs
│   ├─ domain contracts
│   ├─ Component Catalog
│   ├─ existing components
│   └─ tests / smoke
│
└─ Figma MCP（参照）
    ├─ layout
    ├─ component
    ├─ variables
    └─ screen reference
```

Rules:

- Figma は repository SSOT を **上書きしない**
- variables は DADS-04 tokens との **差分メモ** に留める（自動 Token 同期は Later / OUT）
- MCP 接続・認証・OAuth 設定は本 Issue 範囲外（permission-matrix 準拠）

## 既存プログラムとの関係

```text
DADS（MERGED 系）
  DADS-03 Style Guide ──────────► Visual Principles 層
  DADS-04 tokens ───────────────► ESLint / template 参照
  DADS-05 primitives ───────────► Catalog 初期エントリ
  DADS-06 a11y gate ────────────► Deterministic Gates 既存
  DADS-UX-* / Visual Polish ────► Screen Patterns 継承

Support Plan UI（DADS-UX-6 等）
  presentation-only 収束 ───────► Catalog / design-review の最初の適用面

FIELD-WORKFLOW / contracts
  procedure / plan 意味 ────────► Catalog semantic rules の上位参照
```

本 Issue は DADS を置き換えない。**Agent が UI 作業で迷わないための orchestration 層** を追加する。

## Explicit OUT of scope

```text
Skill 実装（.agents/skills/design-* のファイル作成）
Component Catalog 実装 PR
ESLint ルール実装 PR
Storybook 導入 PR
Chromatic / VRT 導入
Tokens Studio / Style Dictionary / Specify / Supernova / zeroheight
Figma MCP 接続設定
generator / Plop 実装
Deploy / SharePoint write / App Catalog / Entra / M365 mutation
Visual Acceptance for new RC
#299 Close
application code mutation（本 Issue 単体）
```

## Dependencies

```text
Upstream（既存）:
- Decision-DADS-ADOPTION-V1 / DADS-03 Style Guide
- DADS-04 / DADS-05 / DADS-06
- docs/process/skill-catalog.md
- .agents/skills/architecture-review/（参照；置換しない）
- contracts-v1 / domain tests

Blocks（本 Issue 設計完了後）:
- UI-AGENT-IMPL-1: design-context / design-review Skill 導入
- UI-AGENT-IMPL-2: Component Catalog docs + verify hook
- UI-AGENT-IMPL-3: ESLint UI semantic rules
- UI-AGENT-IMPL-4: screen template docs
- （任意）Storybook / Figma MCP pilot

Related（auto-close しない）:
- Visual Polish slices
- DADS-UX-* convergence
- Support Plan UI
- FIELD-WORKFLOW UI
```

## 必須成果（Implementation GO 前でも固定）

- [ ] Product UI Contract の SSOT 4 層（Domain / Visual / Catalog / Screen Patterns）の参照順が文書化されている
- [ ] Component Catalog v1 の目次と初期 6 コンポーネントのエントリテンプレートが固定されている
- [ ] `design-context` / `design-implementation` / `design-review` の入出力・停止条件・既存 Skill との境界が固定されている
- [ ] ESLint UI semantic rules の候補一覧と a11y gate / smoke との分担が固定されている
- [ ] Figma MCP boundary（repository 正本を壊さない条件）が固定されている
- [ ] Storybook / Chromatic / Token 同期を **Later / OUT** とする理由が明記されている
- [ ] 後続 Implementation Issue 分割案（UI-AGENT-IMPL-1..4）が提示されている

## 実装開始条件

```text
Design Issue 完了（本 Issue）: docs-only 設計 PR の Human Merge GO
Implementation Start: 別 GO（UI-AGENT-IMPL-* 各 Issue）
SharePoint / M365 / Entra / Deploy / real data: NO-GO
Ready / Merge: HUMAN-ONLY
```

## 完了条件（この Issue 自体）

- [ ] 上記 Must Deliver が docs に着地している
- [ ] skill-catalog.md への追記方針（後続 PR）が記載されている
- [ ] Visual Polish / Support Plan UI へそのまま使える引き渡し条件が書かれている
- [ ] 本 Issue 範囲外（Skill 実装 / Storybook / Token 同期）に踏み込んでいない

## 現在判定

```text
Filing: THIS ISSUE
Kind: docs-only design boundary
Domain Decision: NOT REQUIRED（新業務意味の追加なし）
Implementation: HOLD / NO-GO
Tests executed: 0
Production: NO-GO
Next after design lock: UI-AGENT-IMPL-1（design-context Skill）
```

## 禁止

- 業務意味を UI 都合で変更すること
- Figma / Storybook を新 SSOT にすること
- 未設計のまま Skill / ESLint / Storybook 実装を開始すること
- Deploy / SharePoint write / #299 Close
