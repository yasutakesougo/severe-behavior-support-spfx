# Self-Referential Gate Policy v1

- 文書: `docs/process/self-referential-gate-policy.md`
- 位置づけ: Gate 判定における **自己参照 stale** の運用原則
- 上位 Gate 正本: `docs/process/gate-definitions.md`
- 権限境界: `docs/decisions/DEC-AI-ORG-003.md`
- 適用範囲: repository docs / PR body / Issue comment の責務分離と、専用 sync PR の禁止

## 目的

マージ前に当該 PR 自身のライブ状態（`Merge: NO` / `NOT RUN` / `Next: Merge GO` 等）を repository docs へ書いた結果として、マージ後に同一文言が残ることは **必然的な文書遅延** である。

この遅延を Gate failure と誤判定し、専用 hygiene sync PR（例: `PR #N` → stale-cleanup `PR #N+1` → stale-cleanup `PR #N+2` → …）を連鎖させない。

## 1. 自己参照 stale の分類

| 分類 | 意味 |
|---|---|
| `EXPECTED_P2` | マージ前に自己のライブ状態を書いた結果として残る stale。想定内 |
| `NON_BLOCKING` | Gate failure / Merge 阻止の根拠にしない |

対象例:

- マージ済み PR 自身について残る `Merge: NO` / `Merge: NOT RUN`
- 同 PR について残る `Next: Merge GO` / `Ready YES / Merge NOT RUN`

## 2. Gate 判定

マージ後に当該 PR 自身の次が残っていても Gate failure にしない。

- `Merge: NO`
- `Merge: NOT RUN`
- `Next: Merge GO`

自己参照 stale は `P0` / `P1` に昇格させない。`EXPECTED_P2` / `NON_BLOCKING` として扱う。

## 3. 専用 sync PR

| 規則 | 値 |
|---|---|
| 原則 | `NO_DEDICATED_SYNC_PR` |
| 意味 | 自己参照 stale だけを消すための docs-only PR を作らない |

禁止例:

- 「PR #N が MERGED になったので、repository docs の `Merge: NOT RUN` を消すだけ」の PR

## 4. 修正タイミング

次の **substantive PR** が同じ文書を自然に変更する場合だけ、post-merge fact を opportunistic に更新する。

- 自己参照 stale 解消のみを目的に PR を開かない
- 次の実質作業が当該ファイルを触るときに、確定事実へ寄せてよい

## 5. 正本分離

### Durable facts（repository docs に残してよい）

マージ後も変わらない確定事実のみを残す。

- merge commit SHA
- Accepted Decision
- contract
- invariant
- boundary
- evidence
- PR 番号と `status: MERGED`（確定後）
- expected head（マージ前に固定した値）と merge commit の対応

例:

```text
PR #111
expected head: 21568d0...
merge commit: f4b8f378...
status: MERGED
```

### Live gate（PR body / Issue comment に限定）

横断複製しない。repository docs の durable 節へ書かない。

- `Ready: YES`
- `Merge: NOT RUN`
- `Merge: NO`
- `Next: Human Merge GO`
- その他の進行中 next-action ライブ状態

## 6. Blocking 条件

自己参照 stale は blocking に含めない。

blocking に含めるもの:

- 未承認 Decision
- contract contradiction
- invariant violation
- scope violation
- unauthorized side effect
- real data violation
- SharePoint / tenant / M365 / Entra / Deploy 境界違反

## 7. hygiene-only PR

Human が明示した場合だけ作成可能。

- AI / Background Agent が自己判断で hygiene-only sync PR を開かない
- Human が対象・範囲・理由を明示したときのみ作成してよい

## 非変更事項

本 Policy は substantive unit の選定を変更しない。

- Decision-SEV-1 / Decision-SEV-2 の Acceptance・順序・状態は本 Policy では変更しない
- 自己参照 P2 は Decision-SEV-1 の判断をブロックしない

## 関連正本

| 主題 | 正本 |
|---|---|
| Gate 通過条件 | `docs/process/gate-definitions.md` |
| Governance 入口 | `docs/process/ai-governance.md` |
| Background Agent 停止条件 | `docs/process/background-agent-contract.md` |
| Ready / Merge 権限 | `docs/decisions/DEC-AI-ORG-003.md` / `.agents/mcp/permission-matrix.md` |
