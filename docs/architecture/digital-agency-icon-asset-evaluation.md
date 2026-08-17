# DIGITAL-AGENCY-ICON-ASSET-EVALUATION — Visual Polish 2 Precheck

- **評価対象**: デジタル庁 イラストレーション・アイコン素材 (Digital Agency Design System Asset)
- **フェーズ**: VISUAL-POLISH-2 PRECHECK
- **ステータス**: COMPLETED
- **最終判定**: `ADOPT WITH CONSTRAINTS`

---

## 1. Primary Source & License Verification (一次ソース・利用条件確認)

デジタル庁公式Webサイト（`digital.go.jp`）の「デザインシステム / イラストレーション・アイコン素材利用規約」および「ウェブアクセシビリティ導入ガイドブック」を根拠として評価を実施。

| 評価項目 | 確認結果 | 運用上の留意事項 |
| --- | --- | --- |
| **利用可能範囲** | 著作権はデジタル庁に帰属。規約の範囲内で自由利用可能 | 規約遵守の上で本SPFxに統合可能 |
| **商用利用** | **可能**（無償利用・商用利用ともに許可） | 法人・事業所での業務利用に問題なし |
| **改変・翻案** | **条件付き許可** | 原典SVGを優先。UI適合に必要な色・サイズ変更は許可するが、編集・改変時は利用条件に従い「デジタル庁素材を元に作成」等の注記要件が生じる場合がある。政府公式UIと誤認させる表現は禁止。 |
| **クレジット表記** | **無償・原則不要**（加工時の誤認防止義務あり） | 原典のまま使用する場合はクレジット省略可能 |
| **加工・公開・再配布条件** | **制限あり**（「政府公式と誤認させる表現」の禁止） | 出典・加工内容の明示義務に配慮し、本プロジェクトでは原典SVGそのままの利用（fill="currentColor" 等のCSSによる色指定）を標準とする |
| **SVG利用可否** | **可能**（公式よりSVG/PNG形式で提供） | スケーラブルかつインライン/シンボルとして利用可能 |
| **アクセシビリティ上の注意** | 視覚補足としての利用を徹底。画像のみで重要な意味を決定しない | ガイドラインに従いテキストラベルを正本（authoritative）とする |

---

## 2. Adoption Purpose & Non-Goals (採用目的と非目標)

### 採用目的 (Use For)
- **Semantic Navigation**: 「今日の支援」「記録」「支援計画」「アセスメント」等、福祉業務の主要入口を視覚的に特定しやすくする。
- **Role-Aware Entry**: 現場職員（Tablet）と計画作成者/管理者（PC）のロール別トップエントリーの識別補助。
- **Guidance / Explanation**: 操作手順や機能概念の案内に視覚的補助を付与。
- **Empty States**: データ未登録時や検索結果なし時の画面案内（イラスト・アイコン素材）。

### 非目標・禁止用途 (Do NOT Use For)
- ❌ **Critical Status Authority**: 保存成功/失敗、要確認、未実施、制度的適否などの業務状態の判定主権として使用しない。
- ❌ **Color-Only / Icon-Only Meaning**: アイコン単体や色のみで意味を決定しない。
- ❌ **Decorative Overuse**: 画面内の装飾目的だけの大量配置・無秩序なランダム配置。
- ❌ **Screen-Specific Custom Icons**: 画面ごとに開発者が自由に異なるアイコンを選択することの禁止（Canonical mapping化の義務）。

---

## 3. Role Division with Fluent UI (Fluent UI標準操作との役割分担)

既存のFluent UI v8標準アイコンとの衝突を防ぎ、メンタルモデルを分離する。

```text
+-------------------------------------------------------------------+
| Visual & Functional Role Separation                               |
+-------------------------------------------------------------------+
| Digital Agency Assets (Canonical Subset)                          |
|   - Business Concepts (支援, 記録, 計画, アセスメント, 監査)      |
|   - Role Entry Concepts (Field Tablet Entry, Admin Entry)         |
|   - Empty State / Guidance Visuals                                |
+-------------------------------------------------------------------+
| Fluent UI Standard Icons (Primary Action)                         |
|   - Chevron, Close, Search, Menu, Back, More, Filter, Edit, Delete|
|   - Form Field Actions, Standard Table Controls                   |
+-------------------------------------------------------------------+
```

- デジタル庁素材で Fluent UI の標準操作アイコン（Chevron, Close, Search等）を**全面置換しない**。

---

## 4. Accessibility & Critical Status Rules (アクセシビリティと状態決定権の原則)

DADSおよびデジタル庁「ウェブアクセシビリティ導入ガイドブック」に完全準拠する。

1. **Text Label is Authoritative (テキスト正本の原則)**:
   - アイコンはすべて補助（`supplementary`）。アイコン非表示（CSS `display: none` または画像ロード失敗）であっても業務機能・意味が100%保持されること。
   - `aria-hidden="true"` をデフォルト適用し、スクリーンリーダー重複読み上げを防止。
2. **No Icon-Only Critical Status (アイコン依存の状態表現禁止)**:
   - 「保存成功」「保存失敗」「制度上有効/無効」「要確認」等をアイコン単体で示さない。必ず明確なテキストバッジ・テキストメッセージとセットで表現する。
3. **Contrast & Sizing Boundary**:
   - Field Staff Tablet (タッチ操作・屋外/現場照度) でも識別容易なサイズ（エントリーカード用: 24px〜32px / Empty State: 48px〜64px）。
   - 色覚バリエーションに依存せず、形状（シルエット）＋テキストラベルで理解可能であること。

---

## 5. Candidate Concepts & Mapping Evaluation (候補エリア評価)

業務概念 10 領域に対する判定評価。無理に全領域を採用せず、適合度の高いもののみを Canonical 化する。

| # | 候補エリア | 業務概念との意味的一致 | 日本語ラベル併用 | Tablet識別 | PC過剰防止 | DADS整合 | FluentUI分離 | 色なし理解 | A11y適合 | 判定 | 採用/不採用理由 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **今日の支援** (Today Support) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | 現場職員の最優先入口。日課・支援実施の視覚的案内に最適 |
| 2 | **記録** (Daily Record) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | 経過記録・ABC記録の入口。文書・筆記モチーフと直感一致 |
| 3 | **支援計画** (Support Plan) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | 計画作成・変更の主要入口。ロードマップ/計画概念と一致 |
| 4 | **Assessment** (アセスメント) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | 分析・評価の入口。調査・チェックモチーフと整合 |
| 5 | **Monitoring / 見直し** | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | 定期評価・PDCAサイクルの入口 |
| 6 | **利用者** (Users / Clients) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | 対象者一覧・個人プロファイルの案内 |
| 7 | **管理** (Administration) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | マスタ管理・事業者設定の主要ナビゲーション |
| 8 | **監査 / 確認** (Audit / Compliance) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | 制度適合確認・監査ログの入口概念 |
| 9 | **Empty state** | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | データ未登録画面・検索結果ゼロの親しみやすい視覚案内 |
| 10| **操作案内** (Guidance / Help) | PASS | PASS | PASS | PASS | PASS | PASS | PASS | PASS | **PASS** | 初めてのユーザー向けヘルプ・導入ガイド |

---

## 6. Canonical Asset Policy & Repository Placement (管理方針とリポジトリ配置)

UIコンポーネントがSVGファイルをランダムに直接参照することを禁止し、抽象化された **Canonical Key Mapping** を通じて参照する。

### Mapping Architecture
```text
Business Concept (e.g. "todaySupport")
  └─► Canonical Asset Key (e.g. "DADS_ICON_TODAY_SUPPORT")
        └─► Shared UI Component (<DadsCanonicalIcon name="todaySupport" />)
              └─► Standardized SVG Asset Source
```

### Proposed Repository Placement (配置提案)

既存の `spfx/src/shell/` または `spfx/src/components/` 構造と整合する配置とする。

```text
spfx/src/
  assets/
    dads/
      icons/
        today-support.svg
        daily-record.svg
        support-plan.svg
        assessment.svg
        monitoring.svg
        users.svg
        administration.svg
        audit.svg
        empty-state.svg
        guidance.svg
```

---

## 7. VP-C Trial Plan (VP-C での試行範囲)

`ADOPT WITH CONSTRAINTS` の判定に伴い、本Precheck後の **VP-C (Overview + Role-aware entry concept)** にて以下の最小サブセット（4〜6アセット）の試行を行う。

### 初回試行 Canonical Asset (4選)
1. `todaySupport` (今日の支援 - Field Staff Tablet Priority)
2. `record` (記録 - Field Staff / Daily Log)
3. `supportPlan` (個別支援計画 - Planner Entry)
4. `monitoring` (モニタリング・見直し - Planner / Periodic Review)

### 試行時評価ゲート (VP-C Trial Criteria)
- Overview画面でのカード表示において、文字の視認性を阻害しないか
- High Contrast / Dark / Light テーマ切り替え時にSVGの色調調整（CSS fill/stroke）が破綻しないか
- タブレット実機サイズで過大・過小にならないか

---

## 8. Open Questions & STOP Conditions Status

| 項番 | 状況 / 項目 | 結論・扱い |
|---|---|---|
| 1 | **素材の改変・編集の必要性** | 本プロジェクトでは改変を行わず、デジタル庁提供の標準SVGをそのままアセットとして採用する（クレジット義務・誤認防止注記の発生を抑止）。 |
| 2 | **テーマカラーとの連動** | SVG参照時に `fill="currentColor"` または DADS Token (`var(--dads-token-...)`) を適用可能な単色クラス構成とする。 |
| 3 | **他システム契約への影響** | Schema Contract, Physical Schema, Kiosk persistence, Audit log 契約への変更影響 **NONE (ゼロ)**。 |

---

## 9. Final Decision & Recommendation Summary

### 最終判定: `ADOPT WITH CONSTRAINTS`

```text
DIGITAL-AGENCY-ICON-ASSET-EVALUATION

Decision:
ADOPT WITH CONSTRAINTS

Use for:
- Semantic navigation
- Role-aware entry
- Guidance / Help
- Empty states

Do not use for:
- Critical status authority
- Result authority
- Error / Warning authority
- Color-only / Icon-only meaning

UI operation icons:
- Fluent UI v8 standard icons remain primary

Canonical assets:
- Small approved subset (5〜10 assets max, initial trial 4 assets)

First implementation:
- VP-C Overview (Role-aware entry concept trial)

Schema & Persistence impact:
- NONE

Deploy impact:
- NONE
```

### 次のステップ (Next Step)
- `VISUAL-POLISH-2 PRECHECK` を本ドキュメントの記録をもって完了とし、後続の `VP-A Foundations` および `VP-B Shell/Host`, `VP-C Overview` 計画へ引き継ぐ。
