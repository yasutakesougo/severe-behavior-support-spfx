# project-status

## 目的

Agent が「今どこまで終わっていて、次に何をしてよいか」を自力で判定する。

長文の状況説明ではなく、固定出力（CURRENT / GATE / ALLOWED / FORBIDDEN / NEXT）で状態を返し、自動実行可能 / Human 判断必要 / 証拠不足を分離する。

Skill は正本ではない。正本は GitHub live state、Accepted / LOCKED Decision、実環境 Evidence である。

## 使用する場面

- Human が「次に進めて」「現状は？」「今どこ？」と指示したとき
- 実装・レビュー・handoff の前に、現在状態と次工程を固定したいとき
- Open PR / Issue / Decision / Evidence / CI が混在し、次アクションが曖昧なとき
- WAIT / HOLD / UNKNOWN の取り違え（FALSE_WAIT 含む）を防ぎたいとき

## 入力

- 対象リポジトリ
- 現在の GitHub live state（main SHA、Open PR、Issue、CI）
- Accepted / LOCKED Decision（ある場合）
- Evidence Packet / 観測証跡（ある場合）
- 直前の Agent 作業結果（任意）
- Human の明示 GO / STOP（ある場合）

## 前提条件

- GitHub live state を read-only で取得できる、または取得不能を `UNKNOWN` と明示できる
- Skill 正本パス `.agents/skills/project-status/SKILL.md` を参照する
- Evidence 優先順位と Human boundaries を推測で緩和しない
- 共通判定語は `.agents/skills/_shared/judgement-rules.md` を参照する

## Evidence priority

古い記録だけを根拠に現在状態を断定しない。優先順位は次のとおり。

1. GitHub live state
2. Current main
3. Current PR HEAD
4. Accepted / LOCKED Decision
5. Evidence Packet
6. Repository documentation
7. Historical documentation

詳細は `evidence.md` を参照する。

## 実行手順

1. GitHub live state を取得する（main SHA、Open PR、対象 Issue、CI）
2. Evidence priority に従い、根拠の順位を固定する
3. 各主張を `CONFIRMED` / `INTENDED` / `UNKNOWN` / `HOLD` に分類する
4. Human boundaries を適用する
   - Human Ready != Human Merge
   - Decision Accepted != Implementation Start
   - INTENDED != CONFIRMED
5. WAIT を使う場合、待つ対象が実在することを確認する。確認できない場合は `UNKNOWN`
6. Mutation 可否を判定する。明示 GO がなければ mutation は FORBIDDEN
7. ALLOWED / FORBIDDEN / NEXT を固定出力で返す
8. 自動実行可能な read-only 観測のみ実行候補とする。Human 判断が必要なら STOP

## 確認項目

- main SHA または取得不能（`UNKNOWN`）が明示されている
- Open PR / Issue を古い docs だけで断定していない
- `CONFIRMED` / `INTENDED` / `UNKNOWN` が区別されている
- Human Ready と Human Merge が混同されていない
- Decision Accepted と Implementation Start が混同されていない
- WAIT 対象が確認できない場合に `UNKNOWN` になっている（FALSE_WAIT 防止）
- 明示 GO なしで merge / Ready / SharePoint mutation / Issue mutation を許可していない
- 出力が CURRENT / GATE / ALLOWED / FORBIDDEN / NEXT 形式である

## 停止条件

次のいずれかで STOP する。

- 必要な GitHub live state が取得できず、状態を断定できない
- Human Ready / Merge / Implementation Start / Decision Acceptance が未解決
- SharePoint / Microsoft 365 / schema / permission mutation が次工程に含まれる
- 明示 GO のない mutation が要求されている
- Evidence 不足で `CONFIRMED` にできない主張を確定しようとしている
- WAIT 対象の実在を確認できない（`UNKNOWN` → STOP）
- `P0` または未解決の進行ブロッカー（`P1`）がある

## State（Evidence / 進行）

| State | 意味 |
|---|---|
| `CONFIRMED` | Evidence で確認済み |
| `INTENDED` | 設計済みだが実環境未確認 |
| `UNKNOWN` | 必要な証拠が不足 |
| `HOLD` | 次工程を開始してはいけない |

```text
INTENDED != CONFIRMED
UNKNOWN → HOLD（進行判定）
古い docs 単独で CONFIRMED にしない
```

## Human boundaries

```text
Human Ready != Human Merge
Decision Accepted != Implementation Start
INTENDED != CONFIRMED
WAIT は待つ対象が実在すると確認できる場合のみ使用する
確認できない場合は UNKNOWN
```

Human Ready 判定材料が揃っていても、Ready 実行や Merge 実行は Human-only とする。

## Mutation

```text
明示的な GO がない変更は禁止
Decision を Agent が推測して Accepted にしない
SharePoint schema を Agent 判断で変更しない
Human-only 操作を自動実行しない
```

Human-only の例:

- Ready
- Merge
- Decision Acceptance
- Issue mutation / close
- SharePoint / Microsoft 365 / Entra ID 変更
- Deploy / 本番変更

## 判定基準

Skill 実行結果の判定語（共通規約）:

- `PASS`: この Skill では原則使用しない。状態観測 Gate の通過を意味しない
- `READY`: 固定出力が揃い、ALLOWED の範囲で次の read-only / 明示許可済み作業へ進める
- `HOLD`: Human 判断待ち、承認待ち、または次工程開始禁止。`CONFIRMED` 不足でも進行してはいけない場合を含む
- `FAIL`: `P0`、権限逸脱、または禁止 mutation を実行しようとしている。`P1` は着手前に解消すべきブロッカー、`P2` は記録して後続可
- `NOT APPLICABLE`: プロジェクト状態判定が不要な単発質問

Evidence 語彙（`CONFIRMED` / `INTENDED` / `UNKNOWN`）と進行判定語（`READY` / `HOLD` / `FAIL`）を混同しない。

## 成果物

- CURRENT（main / PR / Evidence 状態）
- GATE（HumanAction など）
- ALLOWED
- FORBIDDEN
- NEXT（Human / Agent）
- 根拠の Evidence priority メモ（必要時）
- Findings（`P0` / `P1` / `P2`、ある場合）

## 禁止事項

- 古い記録だけを根拠に現在状態を断定すること
- `INTENDED` を `CONFIRMED` として扱うこと
- Human Ready を Human Merge と同一視すること
- Decision Accepted を Implementation Start と同一視すること
- WAIT 対象未確認のまま WAIT とすること（FALSE_WAIT）
- 明示 GO なしで merge、push、deploy、Ready 化を実行または許可すること
- SharePoint変更、Microsoft 365変更、Entra ID変更を Agent 判断で行うこと
- 本番データ変更や物理削除を許可または手順化すること
- Decision を推測して Accepted / LOCKED にすること
- Issue mutation を Human-only 境界を超えて自動実行すること
- 既存実装コードや SharePoint を本 Skill 実行の副作用で変更すること

## 出力形式

最終出力は次の固定形式とする。長文レポートで代替しない。

```text
CURRENT
main: <sha or UNKNOWN>
PR: <number or none / UNKNOWN>
Evidence: CONFIRMED | INTENDED | UNKNOWN | HOLD

GATE
HumanAction: <Ready | Merge | Implementation Start | Decision | none | UNKNOWN>

ALLOWED
- <read-only / explicitly permitted actions>

FORBIDDEN
- merge
- SharePoint mutation
- implementation requiring unresolved decision
- <additional forbidden actions>

NEXT
Human:
<なし / 必要な Human 判断>

Agent:
<read-only 観測または明示許可済みの次作業 / STOP>
```

補足が必要な場合のみ、固定出力の後に短い Findings を添える。

例は `examples.md` を参照する。
