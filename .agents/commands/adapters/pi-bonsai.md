# Tool Adapter: Bonsai via Pi

- 文書: `.agents/commands/adapters/pi-bonsai.md`
- 位置づけ: Logical Command の Bonsai via Pi 向け **bounded local review Adapter**
- 正本: Logical Command（`.agents/commands/*.md`）
- 対応表: `.agents/commands/adapter-matrix.md`
- 権限境界: `docs/decisions/DEC-AI-ORG-003.md` / `.agents/mcp/permission-matrix.md`
- Handoff: `.agents/orchestration/handoff-format.md`

## 対象ランタイム

- Bonsai 2 via Pi coding agent
- local bounded evidence collection / first review
- 1–2 focused files または小さな bounded slice を既定とする
- Final Independent Reviewer ではない

## 利用位置づけ

本 Adapter は既存 Logical Command の主担当 Agent を置き換えない。

代表例:

| Logical Command | 補助用途 |
|---|---|
| `new-feature` | bounded repository evidence collection |
| `review-pr` | bounded diff / file / test-surface preflight |
| `audit` | focused evidence / boundary check |
| `release-check` | focused artifact / evidence presence check |

広い multi-file autonomous review が必要な場合は、task を分割するか別 Reviewer へ handoff する。

## 入力契約

canonical HANDOFF から最低限次を受け取る。

- `TASK`
- exact `BASE` SHA
- `AUTHORIZATION`
- `SCOPE IN / OUT`
- `OBJECTIVE / QUESTION`
- `INPUT EVIDENCE`
- `REQUIRED OUTPUT`
- `STOP IF`

## READ ONLY 実行境界

review / evidence collection では明示的な tool restriction を使う。
既定の許可 tool は read 系のみとする。

例:

`read`, `grep`, `find`, `ls`

Pi の project/local settings は convenience であり、sole security boundary としない。

より強い isolation が必要な場合:

1. exact SHA から snapshot を作る
2. snapshot に `.git` を含めない
3. Bonsai は snapshot のみを読む
4. repository mutation capability を与えない

## Evidence discipline

- `ABSENCE != NON-EXISTENCE`
- `INFERENCE != CONFIRMED`
- `NOT INSPECTED = NOT ESTABLISHED`
- `TEST EXISTS != TEST PASSED`
- `SCRIPT EXISTS != EXECUTION SUCCESS`
- `SMOKE EXISTS != SMOKE PASSED`
- `HANDOFF != AUTHORIZATION`

## 出力契約

最低限:

- CONFIRMED
- INFERENCE
- NOT ESTABLISHED
- Findings
- inspected paths
- evidence gaps
- next authorized action

Bonsai output は preflight / evidence material であり、Formal Independent Review PASS や Human GO を付与しない。

## Evidence

- exact SHA または snapshot basis
- inspected file list
- 実行した read-only tool
- findings と evidence
- evidence gap
- mutation = NONE の確認

## 停止条件

- scope が広すぎる
- required evidence が snapshot / allowed tool から確認できない
- write tool が必要
- Human Gate 判定が必要
- Formal Independent Review の代替を求められる

## 自動実行しないもの

- file write / delete / generation
- Git metadata mutation
- commit / push
- GitHub 投稿
- Ready / Merge / Deploy
- production mutation
- Human Gate consumption

本 Adapter は Local Repository Scout / bounded First Reviewer として利用する。
