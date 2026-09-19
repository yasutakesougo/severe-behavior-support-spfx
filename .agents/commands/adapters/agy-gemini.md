# Tool Adapter: Gemini via agy

- 文書: `.agents/commands/adapters/agy-gemini.md`
- 位置づけ: Logical Command の Gemini via agy 向け **Specialist Subagent Adapter**
- 正本: Logical Command（`.agents/commands/*.md`）
- 対応表: `.agents/commands/adapter-matrix.md`
- 権限境界: `docs/decisions/DEC-AI-ORG-003.md` / `.agents/mcp/permission-matrix.md`
- Handoff: `.agents/orchestration/handoff-format.md`

## 対象ランタイム

- Gemini via agy
- 役割は runtime 固有の Specialist Subagent / Second Opinion
- 新しい Agent Role、Gate、Permission は定義しない

## 利用位置づけ

本 Adapter は既存 Logical Command の主担当 Agent を置き換えない。
必要な工程で、cross-file analysis、failure analysis、definition/scope review、security/authority second opinion を補助する。

代表例:

| Logical Command | 補助用途 |
|---|---|
| `new-feature` | 要件・Decision の second opinion。Requirements Agent の代替ではない |
| `review-pr` | diff / contract / test / scope の second opinion。Formal Review の代替ではない |
| `audit` | evidence / authority / boundary の補助確認。Audit Agent の代替ではない |
| `release-check` | release evidence の補助確認。Human approval / release authority は持たない |

## 入力契約

原則として canonical HANDOFF を受け取る。

最低限:

- `TASK`
- `FROM` / `TO`
- exact `BASE` SHA
- `AUTHORIZATION`
- `SCOPE IN / OUT`
- `OBJECTIVE / QUESTION`
- `INPUT EVIDENCE`
- `REQUIRED OUTPUT`
- `STOP IF`

不足時は推測せず `HOLD` または `NOT ESTABLISHED` とする。

## READ ONLY 実行境界

READ-only session では、source/worktree write だけでなく Git metadata write も禁止する。

禁止:

- `git fetch`
- `git pull`
- branch / ref / worktree の作成・更新
- `git checkout` / `git switch`
- `git reset` / `git restore`
- file create / edit / delete
- generated file creation
- `git add` / `git commit` / `git push`

必要な evidence がローカルに存在しない場合、取得のために repository を変形せず `NOT ESTABLISHED` とする。
exact-SHA snapshot が与えられている場合は、その snapshot のみを review evidence とする。

## Evidence discipline

- `ABSENCE != NON-EXISTENCE`
- `INFERENCE != CONFIRMED`
- `NOT INSPECTED = NOT ESTABLISHED`
- `TECHNICAL CAPABILITY != GOVERNANCE AUTHORITY`
- `HANDOFF != AUTHORIZATION`
- `CI SUCCESS != HUMAN GO`

## 出力契約

少なくとも次を分離する。

- CONFIRMED
- INFERENCE
- NOT ESTABLISHED
- Findings（P0 / P1 / P2）
- Evidence / inspected paths
- Required Human Decision（必要時）
- Next authorized action
- Operational Compliance

Gemini 出力は判断材料であり、次を意味しない。

- Implementation Start GO
- Review PASS
- Ready GO
- Merge GO
- Deploy GO
- production mutation authorization

## Evidence

成果物または handoff に次を残す。

- review basis / exact SHA
- inspected paths
- 実行した read-only command
- findings と根拠
- 未確認事項
- operational compliance

## 停止条件

- required exact SHA / evidence が確認できない
- current authorization を越える操作が必要
- repository mutation が必要
- Formal Independent Review を本 Adapter だけで完了扱いにする要求
- Human Gate を代理する要求

## 自動実行しないもの

- repository / Git metadata mutation
- GitHub への Issue / PR / review 投稿
- Ready 化
- マージ
- deploy
- SharePoint / Entra ID / Microsoft 365 / production data mutation
- Human Gate consumption

本 Adapter の役割は READ / ANALYZE / SUGGEST / SECOND OPINION に限定する。
