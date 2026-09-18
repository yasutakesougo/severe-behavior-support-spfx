# AGENTS.md

- 文書: `AGENTS.md`
- 位置づけ: コーディングエージェント向けの**短い索引**（再現手順 + 正本参照順）
- 方針: 詳細ルールを巨大な 1 ファイルに詰め込まない。詳細は `.agents/` と `docs/` へ委譲する
- セキュリティ思想の正本入口は `SECURITY.md`（本ファイルにセキュリティ規約を複製しない）

## Install

```bash
# ルート（contracts / domain / CI）
npm ci

# SPFx 境界（isolated）
cd spfx && npm ci
```

- Node: ルート `22.23.1`（`.node-version`）。SPFx は `>=22.14.0 <23.0.0`
- 依存関係や環境の詳細は `README.md`, `spfx/README.md`

## Test / Typecheck / Lint

ルート:

```bash
npm test
npm run typecheck
npm run lint
npm run verify:ci   # skills + lint + format + typecheck + test + contracts + scope + a11y
```

個別:

```bash
npm run verify:skills
npm run check:contracts-boundaries
npm run check:scope
npm run check:a11y
```

## SPFx Heft

`spfx/` 配下:

```bash
cd spfx
npx heft test --clean
npx heft test --clean --production && npx heft package-solution --production
```

- live tenant I/O・Deploy は含まない（`spfx/README.md`）

## Browser smoke

- 対象: `spfx/smoke/**`（slice ごとの `run-smoke.mjs` / 証跡 docs）
- 例の証跡: `docs/architecture/shell-ux-*-browser-smoke.md`, `dashboard-ux-1-browser-smoke.md`
- smoke は synthetic / presentation 境界を維持する。本番データ・個人情報を使わない

## Authority boundary

共通の操作権限と Human approval 境界は `.agents/skills/_shared/authority-boundaries.md` を参照する。
操作単位の正本は `.agents/mcp/permission-matrix.md`、上位正本は `docs/decisions/DEC-AI-ORG-003.md` とする。

承認済み scope 内の read-only 参照、ローカル変更、非破壊検証は、正本が許す範囲で不要な再承認なしに継続してよい。
Ready / Merge / Deploy / production mutation / destructive action / material scope expansion は、現在その遷移に到達した時点で対応する Human approval を確認する。

token / Cookie / Secret / 個人情報の記録・転記は禁止し、詳細は `SECURITY.md` に従う。

## 正本の参照順

状態や許可を判断するときの優先順位（上ほど優先）:

1. **Decision** — Accepted / LOCKED（`docs/decisions/`, 各 architecture Decision 文書）
2. **Issue** — GitHub live state（古い docs 単独で断定しない）
3. **Evidence** — 観測証跡 / Evidence Packet（`project-status` Evidence priority）
4. **Architecture** — `docs/architecture/`
5. **Security** — `SECURITY.md` → 詳細はそこに列挙した正本

Skill / Agent / Command の詳細:

| 層 | 場所 |
|---|---|
| Agents | `.agents/agents/` |
| Commands | `.agents/commands/` |
| Skills | `.agents/skills/` |
| MCP 権限 | `.agents/mcp/permission-matrix.md` |
| 再利用知識索引（非 SSOT） | `.agents/intelligence/catalog.md` |
| Governance 入口 | `docs/process/ai-governance.md` |
| Workflow 入口 | `docs/process/ai-workflow.md` |
| Background Agent 契約 | `docs/process/background-agent-contract.md` |
| 品質ゲート | `docs/development/quality-gates.md` |

状態判定が必要なときは `.agents/skills/project-status/SKILL.md` を使う。再利用知識の取得は `.agents/skills/project-intelligence/SKILL.md`（正本ではない）。

## Security Scan との関係

- 入口: `SECURITY.md`（**索引のみ**。独自ポリシー増殖地点にしない）
- candidate ≠ verified ≠ fix authorization ≠ production GO
- Deep Scan は SECURITY-PREP Merge 後に repository-wide で一度。本入口 PR に混ぜない
- PR 単位は security-diff-scan。未検証 finding の大量 Issue 化・自動修正はしない
