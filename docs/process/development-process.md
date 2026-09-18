# 開発プロセス Skill 実行順

## 目的

この文書は、`severe-behavior-support-spfx`で開発プロセス Skill を適用する順番、判定の意味、AI と人の責務分担を固定します。

Skill はコード変更の代行機能ではなく、実施手順、停止条件、成果物、承認条件を再利用可能にするための正本です。

## 適用範囲

この文書は次の工程に適用します。

- 要件整理
- 決定事項の確認
- 設計
- 実装計画
- 実装開始判定
- 実装後監査
- 引き継ぎ
- リリース判定

SPFx UI 実装、SharePoint 構築、本番設定変更は、この文書だけでは着手許可になりません。

## 正本

工程判断の正本は次の資料です。

- GitHub Issue
- Pull Request
- `docs/decisions/` 配下の DEC / ADR
- `docs/architecture/` 配下の設計文書
- `docs/process/` 配下の共通規約
- `.agents/skills/` 配下の Skill

証跡が正本に存在しない場合、Skill は推測で補完せず `HOLD` とします。

## 判定語

判定語は次の 5 種類に固定します。

- `PASS`: 対象 Gate または監査が通過している
- `READY`: 次工程へ進めるが、まだ Gate 通過そのものではない
- `HOLD`: 情報不足、承認待ち、未決事項により停止する
- `FAIL`: 重大な不整合または未解決問題があり進行不可
- `NOT APPLICABLE`: この変更や工程には適用対象がない

`HOLD` は `PASS` でも `READY` でもありません。

## 重大度

重大度は次の 3 区分に固定します。

- `P0`: 権限逸脱、データ破壊、誤保存、誤公開、監査不能など即時停止が必要
- `P1`: マージ前に解消すべき要件不足、設計矛盾、互換性破壊、未検証リスク
- `P2`: 条件付きで後続 Issue に送れる改善点

`P0` が 1 件でも残る場合は `FAIL` とします。

## Authority

共通 Authority は `.agents/skills/_shared/authority-boundaries.md` を参照する。
操作単位の正本は `.agents/mcp/permission-matrix.md`、上位正本は `docs/decisions/DEC-AI-ORG-003.md` とする。

承認済み scope 内のローカル変更と非破壊検証は、正本が許す範囲で継続してよい。
Ready / Merge / Deploy / production mutation などの Human-only 境界は、その遷移に到達した時点で確認する。
後続工程の承認が未取得であることだけを理由に、現在の安全な工程を停止しない。

## Skill 実行順

次の並びは、複数の Skill が同じ変更に適用される場合の**順序制約**であり、全 Skill を毎回実行するチェックリストではない。

現在タスクの目的、変更面、Gate に必要な Skill だけを起動する。
既に確定した工程を、repository state や scope に変化がないのに再実行しない。
適用対象がない Skill は起動不要とし、既に起動された場合のみ `NOT APPLICABLE` を返してよい。

標準の順序制約は次のとおりです。

```text
/project-audit
  ↓
/requirements-review
  ↓
/decision-review
  ↓
/domain-design
  ↓
/sharepoint-design
  ↓
/schema-design
  ↓
/architecture-review
  ↓
/implementation-plan
  ↓
/implementation-review
  ↓
実装
  ↓
/contracts-review
  ↓
/test-review
  ↓
/merge-audit
  ↓
人による merge 承認
  ↓
/release-review
  ↓
/handoff-builder
```

## UI slice additional skills（UI-AGENT-SYSTEM-V1）

UI / presentation 変更を含む slice では、適用される標準工程に次を**追加**する。非 UI 変更ではこれらの Skill を起動しない。既に起動された場合は `NOT APPLICABLE` を返してよい。

```text
/architecture-review
  ↓
/design-context          （UI slice のみ。Figma は intent 参照。コード化しない）
  ↓
/implementation-plan
  ↓
...
/test-review
  ↓
/rendered-usability-review （UI 差分 + rendered 証跡時。Contract は置換しない）
  ↓
/design-review           （UI 差分時。architecture-review を置換しない）
  ↓
/merge-audit
```

`design-implementation` は後続。当面は `implementation-plan` に内包する。
`adaptive-layout-review` は後続（P2）。V1 では layout break を handoff note として記録する。
Component Catalog v1（`docs/architecture/ui-component-catalog-v1.md`）を component usage の正本とする。未掲載は GAP / HOLD。
Visual Hierarchy Contract v1（`docs/architecture/ui-visual-hierarchy-contract-1.md`）を情報の強弱の正本とする。画面の具体配置は `#444` / `#448`。
Rendered usability 境界は `docs/architecture/ui-rendered-review-v1-exact-slice-definition-1.md`。

## 初回導入の最小実用セット

初回導入では次の 4 Skill を優先します。

1. `/implementation-plan`
2. `/implementation-review`
3. `/merge-audit`
4. `/handoff-builder`

この 4 Skill は、Issue 分割、着手判定、独立監査、引き継ぎの頻度が高い現工程で最も再利用性が高いためです。

## 最初の適用順

次の実装 Issue では、次の順序で試行します。

```text
/implementation-plan
  ↓
/implementation-review
  ↓
実装
  ↓
/merge-audit
  ↓
人による merge 承認
  ↓
/handoff-builder
```

## 出力先

Skill の出力は次へ転記できる形式にします。

- GitHub Issue
- Pull Request description
- 設計文書
- Findings
- Handoff 文書

## 関連文書

- `docs/process/gate-definitions.md`
- `docs/process/skill-catalog.md`
- `.agents/skills/_shared/judgement-rules.md`
- `.agents/skills/_shared/output-format.md`
