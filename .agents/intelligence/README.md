# External Intelligence

- 文書: `.agents/intelligence/README.md`
- 位置づけ: 再利用可能な知識の**索引と補助層**（再発見防止・検索・判断補助）
- 実行 Skill: `.agents/skills/project-intelligence/SKILL.md`
- 索引: `catalog.md`

## 固定境界

```text
External Intelligence != SSOT
External Intelligence != Human Decision
External Intelligence != Implementation authorization
```

正本は次のままである。

1. Accepted / LOCKED Decision（`docs/decisions/` 等）
2. GitHub live state（Issue / PR / CI）
3. Evidence / Evidence Packet
4. Architecture（`docs/architecture/`）

本ディレクトリは正本の上に置く検索・再利用用の索引である。Decision / Architecture 文書をここへ移動しない。本文を複製しない。

Skill は正本ではない（`.agents/skills/project-status/SKILL.md` と同型）。

## 知識の 5 状態

| State | 意味 |
|---|---|
| `OBSERVED` | 1 件の具体 Evidence から得た知見。一般ルールにしない |
| `REPEATED` | 独立した 2 件以上で同現象を確認。まだ行動規則にしない |
| `PROMOTED` | 今後の Agent 判断を変える価値があると Human 確認済みの再利用知識 |
| `LOCKED_REFERENCE` | Accepted / LOCKED Decision 等の正本を指す参照。Intelligence 側で LOCK しない |
| `DEPRECATED` | 現行実装・Decision・環境では使えない。削除せず参照先または理由を残す |

## 保存基準

次が YES なら候補:

> この知識を知らない将来の Agent が、同じ調査・失敗・判断をもう一度行う可能性が高いか。

保存する例: 再発しやすい失敗、環境固有制約、複数 slice 共通パターン、Human boundary 誤認、Evidence 読み違い、false positive / false wait、構造知識、Decision 到達用の検索キー。

保存しない例: 単発 CI 結果、一時的な main SHA、PR 全文、巨大ログ、コードそのもの、Issue / Decision 本文の複製、会話要約の大量保存。

## レイヤ分離

| 層 | 役割 |
|---|---|
| handoff | 今どこか / 次は何か / OPEN / HOLD / FORBIDDEN |
| External Intelligence | 過去から何を学んだか / 再利用パターン / 正本への検索キー |
| Decision | Human authority（Knowledge から自動遷移しない） |

handoff は `CURRENT` / `GATE` / `OPEN` / `FORBIDDEN` / `NEXT` を中心に小さく保つ。学習結果を handoff へ詰め込まない。

## ディレクトリ

| パス | 内容 |
|---|---|
| `catalog.md` | 索引のみ（知識本文ではない） |
| `promotion-policy.md` | 状態遷移と Human 確認境界 |
| `retrieval-policy.md` | ロード順と全文投入禁止 |
| `observations/` | `OBSERVED` / `REPEATED` |
| `patterns/` | 再利用パターン（未ルール） |
| `rules/` | `PROMOTED` / `LOCKED_REFERENCE` |

## v1 範囲

- Markdown + catalog
- `project-intelligence` Skill
- ベクトル DB / embedding / 自動要約 / 自動 PROMOTED 確定は入れない
- `npm run verify:intelligence` は v1.1 候補（本 v1 では追加しない）
