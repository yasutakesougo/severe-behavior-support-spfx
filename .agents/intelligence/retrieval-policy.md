# Knowledge Retrieval Policy

- 文書: `.agents/intelligence/retrieval-policy.md`
- 位置づけ: External Intelligence のロード順と全文投入禁止
- 索引: `catalog.md`

## 目標

```text
小さい机 + 大きい図書館
```

毎回の prompt へ知識庫全文（例: 数十万文字）を入れない。

目標構成:

```text
AGENTS.md（短い索引）
+ project-status（現在状態）
+ intelligence/catalog.md（索引）
+ task-specific Knowledge 本文のみ
+ current GitHub live state
```

## ロード順

1. `AGENTS.md`
2. `.agents/skills/project-status/SKILL.md`（状態判定が必要なとき）
3. `.agents/intelligence/catalog.md`
4. タスク語で catalog を検索し、ヒットした Knowledge 本文だけ読む
5. Authority path があれば**正本を優先**して読む（Intelligence は補助）

## 検索のやり方

タスクから retrieval keys を抽出する。例:

```text
task: Cancellation
keys: cancellation, lifecycle, authorization, correction, replay
```

`catalog.md` の Topic / Keys / Scope に照合する。ヒットした ID の本文ファイルだけ開く。

## 禁止

- `.agents/intelligence/**` の全ファイルを毎回全文ロードする
- catalog を読まずに observations / patterns / rules を横断読みする（探索が目的の設計作業を除く）
- Intelligence Finding だけで Decision / live state を上書きする
- 非保存対象（単発 CI、一時 SHA、PR 全文、巨大ログ、コード本体、Issue/Decision 複製）を retrieval 結果として返す

## handoff との関係

handoff は現在状態の引き継ぎに限定する。過去学習の一覧を handoff に埋め込まない。学習の再利用が必要なら本 policy に従い catalog から取得する。
