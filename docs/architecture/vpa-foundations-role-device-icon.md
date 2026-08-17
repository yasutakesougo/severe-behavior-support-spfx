# VP-A Foundations — Design, Role, Device & Icon Foundation

- **Unit**: VP-A Foundations + Role / Device Foundation
- **Status**: COMPLETE
- **Main Baseline**: `643a0d9d`
- **Application Mutation**: 0 (No schema/contract/persistence mutation; shared UI primitives added)
- **Deploy GO**: NONE

---

## 1. Role Foundation

以下の3つの業務Roleおよびデバイス運用方針をUI Foundationsとして正本化。

| Role ID | Primary Device | Primary Jobs / Scope | UI / UX Priority |
|---|---|---|---|
| **FIELD_STAFF** | Tablet (Field First) | 今日の支援, 記録 (経過・ABC) | タッチターゲット最適化, シングルタスク集中, 高視認性 |
| **PLANNER** | PC (Desktop) | Assessment, Support Plan, Monitoring | 情報密度可変, 計画・比較・レビューマルチカラム |
| **ADMIN_AUDIT** | PC (Desktop) | 運用状況確認, 制度適合確認, 監査ログ | 一覧性, 制度整合フィルタ, 監査証跡アクセス |

> 💡 **Invariant**: 3 Role / Device 構造は「別アプリの分岐」ではなく、**「1つのアプリケーション (One Application) + Role-aware entry + Device-aware presentation」** として同居する。

---

## 2. Device Foundation & Viewport Boundary

| Device Category | Presentation & Interaction Boundary |
|---|---|
| **Tablet** | Touch-first, 大きな操作ターゲット (44px+), 現場ワークフロー優先, 単一プライマリタスク |
| **Desktop** | 情報密度の向上許容, 比較・マルチカラムレイアウト (可読性保持前提), 計画作成補助 |
| **Narrow Viewport** | 水平ワークフロー依存の禁止 (レスポンシブ縦積み), 必須アクション到達性維持, テキスト正本 |

> ⚠️ **Critical Rule**: **Viewport breakpoint ≠ Business Role**
> - 「Narrow Viewport = FIELD_STAFF」「Desktop = PLANNER」と直結・同一視してはならない。PCでFIELD_STAFF画面を操作する場合や、大型TabletでPLANNER画面を開く場合も各Presentation原則を維持する。

---

## 3. DADS Visual Foundation

既存DADS (Digital Agency Design System) および Visual Polish 方針を継承。

1. **Content First**: 装飾ではなく業務コンテンツ・記録データの可読性を最優先
2. **Neutral Surfaces**: 過度な着色を避け、ニュートラルなサーフェス（基調背景）を使用
3. **Subtle Elevation**: 視覚的ノイズを削ぎ落とし、控えめなシャドウ（`elevationSubtle`）のみ使用
4. **Clear Hierarchy**: 主見出し (h1) は 1 画面 1 つ。セクション (h2+) による明確な文書構造
5. **Text Authoritative**: アイコンや色のみで意味を決定しない。テキストラベルを唯一の決定権とする

---

## 4. Icon Semantic Boundary & Fluent UI Role Division

### Asset Mapping Boundary
`Business Concept` → `Canonical Asset Key` → `Asset Mapping` → `Shared Icon Component (<SemanticIcon />)`

### Primary Action vs Business Concept Separation
- **Fluent UI v8 Standard Icons (UI Operation)**: Chevron, Close, Search, Menu, Back, More, Filter, Edit, Delete などの標準UI操作アイコン。全面置換禁止。
- **Canonical Semantic Icons (Business Concept)**: 今日の支援 (`todaySupport`), 記録 (`record`), 支援計画 (`supportPlan`), モニタリング (`monitoring`) などの業務概念案内および Empty state / Guidance。

### Critical Status Authority Prohibition (状態決定権の禁止)
- `SemanticIcon` は `saveFailed`, `valid`, `performed` などの批判的業務状態タイプを持たない。
- 保存・適否・エラー等の重要状態は、既存のテキストラベル、テキストメッセージ、`StatusBadge` を正本とする。

---

## 5. Accessibility Invariants (A11y 非可逆条件)

1. **`aria-hidden="true"` by Default**: 単なる装飾・補助アイコンはすべてスクリーンリーダーから隠蔽。
2. **No Icon-Only / Color-Only Meaning**: テキストラベルなしのアイコン表示を禁止。
3. **Interactive Control Boundary**: SVG要素自体を focusable コントロールにしない (`focusable="false"`)。
4. **200% Zoom / High Contrast**: 拡大・ハイコントラスト表示時もテキストラベルが隠蔽・崩落しないこと。
