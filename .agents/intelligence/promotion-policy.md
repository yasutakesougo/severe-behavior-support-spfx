# Knowledge Promotion Policy

- 文書: `.agents/intelligence/promotion-policy.md`
- 位置づけ: External Intelligence の状態遷移と Human 確認境界
- 前提: External Intelligence ≠ Decision ≠ Implementation authorization

## 許可する遷移

| From | To | 誰が | 条件 |
|---|---|---|---|
| （新規） | `OBSERVED` | Agent | Evidence 1 件以上。本文は短い Finding + Evidence link |
| `OBSERVED` | `REPEATED` | Agent | 独立 context の Evidence ≥ 2。行動規則化はしない |
| `REPEATED` | `PROMOTED` | Human 確認後 | 運用ルールや権限境界を変える価値があるとき |
| （正本参照） | `LOCKED_REFERENCE` | Agent（索引追加） | Accepted / LOCKED Decision 等への参照のみ。Authority は正本側 |
| 任意 | `DEPRECATED` | Agent 提案 + 必要時 Human | replacement または reason を残す。原則削除しない |

## 禁止する遷移・解釈

```text
PROMOTED → Accepted Decision     # 自動遷移は存在しない
LOCKED_REFERENCE = Decision LOCK # Intelligence 側で LOCK しない
PROMOTED = Implementation Start  # 実装認可にならない
PROMOTED = mutation GO           # mutation 権限を付与しない
```

Decision Accepted ≠ Implementation Start と同じ原則を維持する。

## Agent がやってよいこと

- Evidence に基づき `OBSERVED` / `REPEATED` 候補を作る
- `catalog.md` に索引行を追加する提案をする
- `LOCKED_REFERENCE` として正本リンクを張る（本文複製なし）
- `PROMOTED` 候補を列挙し、Human confirmation を求める

## Agent がやってはいけないこと

- Human 確認なしに `REPEATED` → `PROMOTED` を確定する（運用・権限境界を変える場合）
- Knowledge を Decision Accepted / LOCKED に昇格する
- Knowledge を Ready / Merge / Issue mutation / Deploy の認可根拠にする
- Issue / Decision 本文を Intelligence へ複製する

## PROMOTED 確定に必要なもの

1. 対象 Knowledge-ID
2. 変更する判断パターンの短い記述
3. Evidence（`REPEATED` 以上）
4. Human の明示 confirmation（対象・範囲付き）

確認がない場合は `HOLD`（promotion 待ち）とし、現行の Decision / project-status 境界を緩和しない。
