# project-status Evidence rules

## 目的

`project-status` が現在状態を断定するときの Evidence 優先順位と、語彙の使い分けを固定する。

## Evidence priority

高いものほど優先する。下位の記録だけで上位を上書きしない。

| Priority | Source | 使い方 |
|---|---|---|
| 1 | GitHub live state | Open/Closed、draft/ready、CI conclusion、comment 上の明示 GO |
| 2 | Current main | マージ済みの現在 tip SHA |
| 3 | Current PR HEAD | 未マージ変更の現在 tip SHA |
| 4 | Accepted / LOCKED Decision | 採用済み判断。Implementation Start ではない |
| 5 | Evidence Packet | CI / GitHub / SharePoint 観測を束ねた証跡 |
| 6 | Repository documentation | 現行 docs。live state と矛盾したら docs 側を疑う |
| 7 | Historical documentation | 履歴・過去 handoff。現在断定の単独根拠にしない |

```text
古い記録だけを根拠に現在状態を断定しない。
```

## State vocabulary

| State | いつ使うか | いつ使わないか |
|---|---|---|
| `CONFIRMED` | live state または Evidence Packet で確認済み | docs に書いてあるだけの設計意図 |
| `INTENDED` | Decision / design で意図は固定だが実環境未確認 | 実測済みの事実 |
| `UNKNOWN` | 必要な証拠が不足、または取得不能 | 「たぶんそう」という推測の言い換え |
| `HOLD` | 次工程を開始してはいけない | 単に未確認（その場合は `UNKNOWN`） |

## FALSE_WAIT 防止

```text
WAIT は待つ対象が実在すると確認できる場合のみ使用する。
確認できない場合は UNKNOWN。
```

禁止例:

- 存在しない PR / Issue / CI run / Human Decision を待つ
- 古い handoff の「待ち」を、live state 未確認のまま継承する
- `UNKNOWN` を都合よく WAIT と言い換える

正しい例:

- Open draft PR #245 の Human Ready Decision を待つ（PR の実在を live state で確認済み）
- main tip の CI conclusion が取得不能 → `UNKNOWN`（WAIT にしない）

## Decision vs Implementation

| Claim | Required evidence |
|---|---|
| Decision Accepted / LOCKED | Accepted 記録 + 対象単位が一致 |
| Implementation Start | exact-slice Human Explicit Implementation Start GO |
| Human Ready | Human Ready Decision（draft→ready） |
| Human Merge | Human Merge Decision（expected head SHA 拘束） |

```text
Decision Accepted != Implementation Start
Human Ready != Human Merge
```

## Mutation evidence

mutation を ALLOWED にするには、次がすべて必要である。

1. 明示的な Human GO
2. 対象（PR / Issue / path / environment）の一致
3. expected SHA / slice 境界の一致（必要な場合）
4. 競合する HOLD / FORBIDDEN が無いこと

欠ける場合は FORBIDDEN または `UNKNOWN` → STOP。
