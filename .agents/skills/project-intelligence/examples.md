# project-intelligence examples

## Example A — catalog hit → 正本到達

タスク: mutation 境界の確認（Ready 前）

```text
keys: Human GO, mutation, Ready, Merge
```

Retrieved:

| ID | State | 使い方 |
|---|---|---|
| KI-GOV-001 | LOCKED_REFERENCE | Authority `AGENTS.md` / DEC-AI-ORG-003 を優先 |
| KI-GOV-002 | LOCKED_REFERENCE | Ready ≠ Merge を正本で確認 |

判定: `READY`（補助知識取得完了。Ready 実行はしない）

## Example B — STATE_DRIFT 検出（PROMOTED にしない）

前提: Issue #448 が IMPLEMENTATION NOT STARTED、PR #468 が implementation として MERGED。

```text
keys: STATE_DRIFT, NOT STARTED, implementation PR
```

Retrieved:

| ID | State | 使い方 |
|---|---|---|
| KI-STATE-003 | OBSERVED | drift を記録。Issue 単独で CURRENT 断定しない |
| KI-STATE-001 | LOCKED_REFERENCE | live state 優先を正本で再確認 |

判定: `HOLD`（reconciliation / promotion は Human。本 Skill は Issue mutation しない）

## Example C — 非保存対象の拒否

要求: 「この PR の全文と CI ログを Intelligence に保存して」

判定: `FAIL` または `HOLD`

- 単発 CI / PR 全文 / 巨大ログは保存対象外（`README.md` 保存基準）
- Next: GitHub live state を都度読む。必要なら短い Finding + Evidence link のみ候補化
