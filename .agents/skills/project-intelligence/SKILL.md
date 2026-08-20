# project-intelligence

## 目的

External Intelligence（`.agents/intelligence/`）から、タスクに必要な再利用知識だけを取り出し、再発見・境界誤認・STATE_DRIFT を防ぐ。

Skill は正本ではない。正本は GitHub live state、Accepted / LOCKED Decision、Evidence、Architecture である。Intelligence は索引と補助である。

```text
External Intelligence != SSOT
External Intelligence != Human Decision
External Intelligence != Implementation authorization
```

## 使用する場面

- 着手前に、過去の失敗・境界・構造知識を task-specific に確認したいとき
- `project-status` の補助として、検索キーから正本へ到達したいとき
- OBSERVED / REPEATED 候補を記録・提案したいとき（PROMOTED 確定はしない）
- handoff に学習結果を詰め込まず、catalog 経由で再利用したいとき

## 入力

- 対象リポジトリ
- タスク要約（主題・キーワード）
- 任意: 対象 Issue / PR / Decision パス
- 任意: 直前の `project-status` 出力
- `.agents/intelligence/catalog.md`（必須参照）

## 前提条件

- Skill 正本パス `.agents/skills/project-intelligence/SKILL.md` を参照する
- `retrieval-policy.md` / `promotion-policy.md` を推測で緩和しない
- Authority path がある Knowledge では正本を Intelligence Finding より優先する
- 共通判定語は `.agents/skills/_shared/judgement-rules.md` を参照する

## 実行手順

1. `AGENTS.md` と必要なら `project-status` で現在状態の枠を確認する
2. `.agents/intelligence/catalog.md` だけを索引として読む（全文庫をロードしない）
3. タスク語から retrieval keys を抽出し、catalog の Topic / Keys / Scope に照合する
4. ヒットした Knowledge 本文ファイルだけを開く
5. `LOCKED_REFERENCE` / Authority がある場合は正本パスを優先して確認する
6. `OBSERVED` / `REPEATED` は参考として記録し、行動規則化しない
7. `PROMOTED` 候補があっても Human confirmation なしでは確定・権限緩和しない
8. 非保存対象（単発 CI、一時 SHA、PR 全文、巨大ログ、コード本体、Issue/Decision 複製）を返さない
9. Findings と参照 KI-ID、必要な HOLD（promotion 待ち等）を出力する

## 確認項目

- catalog を先に読み、不要な本文を開いていない
- Intelligence Finding だけで live state / Decision を上書きしていない
- `LOCKED_REFERENCE` の Authority path が実在する、または欠落を `UNKNOWN` としている
- `KI-STATE-003` のような OBSERVED を PROMOTED / mutation GO として扱っていない
- Decision Accepted を Implementation Start と混同していない
- Ready / Merge / Issue mutation を Knowledge から認可していない

## 停止条件

次のいずれかで STOP する。

- `catalog.md` が存在せず retrieval できない
- Authority 正本が必要だが取得不能で断定しようとしている
- Human confirmation なしに `PROMOTED` 確定や権限境界の緩和を求められている
- Knowledge を Decision Accepted / Implementation Start / mutation GO の代替にしようとしている
- Issue / Decision 本文の複製保存を求められている
- `P0` または未解決の進行ブロッカー（`P1`）がある

## 判定基準

- `PASS`: この Skill では原則使用しない。Gate 通過や mutation 認可を意味しない
- `READY`: catalog 照合と必要本文参照が完了し、補助知識を後続（例: `project-status`）へ渡せる
- `HOLD`: promotion 待ち、Authority 不足、Human 判断未解決、または次工程開始禁止
- `FAIL`: `P0`、権限逸脱、または Intelligence を SSOT / mutation 認可として使おうとしている。`P1` は着手前ブロッカー、`P2` は記録して後続可
- `NOT APPLICABLE`: 再利用知識の参照が不要な単発質問

## 成果物

- 参照した Knowledge-ID 一覧
- タスクに効く Finding（短い）
- Authority / Evidence リンク
- Findings（`P0` / `P1` / `P2`、ある場合）
- HOLD（promotion 待ち等）
- Next Actions（read-only または明示許可済みのみ）

## 禁止事項

- Intelligence 全文を毎回 prompt へ投入すること
- Intelligence を SSOT として Decision / Issue CURRENT を上書きすること
- Human confirmation なしに `REPEATED` → `PROMOTED` を確定すること
- Knowledge から Decision Accepted / LOCKED へ自動遷移すること
- Knowledge を Implementation Start / Ready / Merge / Issue mutation の認可根拠にすること
- merge、push、deploy を実行または許可すること
- SharePoint変更、Microsoft 365変更、Entra ID変更を Agent 判断で行うこと
- 本番データ変更や物理削除を許可または手順化すること
- Issue / Decision / PR 本文や巨大ログを Intelligence へ複製すること
- #448 reconciliation や unrelated Cancellation mutation を本 Skill 実行の副作用で行うこと

## 出力形式

```md
# project-intelligence

## Summary
- 判定: READY / HOLD / FAIL / NOT APPLICABLE
- 対象タスク:
- 参照 catalog: `.agents/intelligence/catalog.md`
- 根拠:

## Retrieved
| ID | State | Finding（短い） | Authority | 使い方 |
|---|---|---|---|---|
| KI-... |  |  |  | 補助 / 正本優先 |

## Findings
| ID | 重大度 | 状態 | 内容 | 根拠 | 対応 |
|---|---|---|---|---|---|
| F-001 | P2 | OPEN |  |  |  |

## HOLD
- なし / または列挙（例: KI-STATE-003 promotion 待ち）

## Approvals
- 必要な承認: なし / PROMOTED confirmation / その他
- 承認状態:

## Next Actions
1. read-only で正本または live state を確認
2. （Human）必要な confirmation
```

例は `examples.md` を参照する。正本ポリシーは `.agents/intelligence/README.md`、`retrieval-policy.md`、`promotion-policy.md`。
