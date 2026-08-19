# MAINTENANCE-MCP-DIRECTION-V1

この文書は、保守エージェントの外部アクセス境界について、
**採用する場合の安全境界だけ**を先に固定する方向文書である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: MAINTENANCE-MCP-DIRECTION-1
Kind: docs-only / direction (not a Contract; not Implementation Start)
Status: REVIEWABLE（Accepted / LOCKED ではない）
Date: 2026-08-14
Baseline main: 5626e6a640ee075af69815b27c57f9681d92a48b

Does NOT authorize:
  MCP server 実装
  MAINTENANCE-MCP-CONTRACT-V1 の作り込み
  SharePoint write
  GitHub mutation
  production 接続
  自動修復
  permission / Entra / M365 変更
  Deploy / App Catalog
  Production GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

```text
Implementation Start: NOT AUTHORIZED（this document alone）
Ready / Merge: separate Human decision
MAINTENANCE-MCP-CONTRACT-V1: NOT STARTED by this document
```

## 1. Decision

保守エージェントの外部アクセス境界として、
**MCP Tool Contract 方式を採用候補とする。**

```text
本 Decision ≠ MCP を今すぐ採用する承認
本 Decision ≠ MCP server / Tool 実装の開始
本 Decision = 採用する場合にぶれさせない安全境界の固定
```

## 2. Authority boundary

| 問い | 正本 |
|---|---|
| Delivery / Gate sequencing | #392 KIOSK-SPFX Delivery / Gate Sequence |
| 職員入口・read-only first・Human GO 前 mutation 禁止 | [`staff-confidence-and-sustainable-maintenance-v1.md`](./staff-confidence-and-sustainable-maintenance-v1.md) |
| AI 操作区分・人の事前承認・禁止 | [`DEC-AI-ORG-003.md`](../decisions/DEC-AI-ORG-003.md) / [`.agents/mcp/permission-matrix.md`](../../.agents/mcp/permission-matrix.md) |
| 保守 MCP を採用する場合の安全境界 | **本文書** |
| 保守 MCP Tool 契約（名前・入出力・件数） | 未作成。本文書では開始しない |
| MCP server 実装 | 未承認。本文書では開始しない |

#392 が現行の delivery / gate sequencing を所有する。
本文書が所有するのは **maintenance-agent MCP safety direction** だけであり、delivery ownership を持たない。
旧 delivery Issue #300 / #301 / #302 を現行 authority として復活させず、本文書から新しい依存を追加しない。

本文書は STAFF-CONFIDENCE V1 と DEC-AI-ORG-003 を再 Decision しない。
権限を増やさない。緩和しない。

## 3. 初期方針（固定する境界）

次の境界だけを、今の正本として残す。

```text
1. read-only first
   保守エージェントは当面 read-only。
   読む・切り分ける・提案する までを mutation より先に行う。

2. LLM の役割分離
   LLM は意図整理・Tool 選択・検索結果や Evidence の説明を担当する。
   件数計算・状態判定・正本そのものにはしない。

3. 検索・集計・決定論的判定
   検索・集計・決定論的判定は Tool / Domain 側が行う。

4. Evidence 必須
   観察結果は Evidence を必ず返す。
   チャットだけの説明を正本にしない。

5. UNKNOWN を推測で補完しない
   足りない事実を LLM が埋めて CONFIRMED にしない。

6. mutationAuthorized = false（初期既定）
   初期既定は mutation 不可。
   mutation capability は read-only 系と別設計とする。
   mutation は将来も Human GO 必須とする。
```

```text
LLM explains Evidence ≠ LLM invents Evidence
LLM selects Tools ≠ LLM becomes the count / state oracle
mutationAuthorized = false ≠ mutation を永久に捨てる
mutationAuthorized = false = 初期既定と別 Capability 化を固定する
```

## 4. 既存正本との関係

| 正本 | 関係 |
|---|---|
| #392 KIOSK-SPFX Delivery / Gate Sequence | 現行の delivery / gate sequencing SSOT。本文書は maintenance-agent MCP safety direction に直交し、delivery ownership を変更しない |
| STAFF-CONFIDENCE & SUSTAINABILITY V1 | P-SC-4 / P-SC-5（read-only first、Human GO）を維持。本文書は外部アクセス候補の境界だけを追加固定する |
| DEC-AI-ORG-003 / permission-matrix | 操作単位の権限区分 UNCHANGED。本文書は権限を増やさない |
| AI-ORG MCP 文書群 | 接続・認証・本番 MCP 接続は依然として未実施・未承認 |

## 5. 現時点で行わないこと（Explicit OUT）

```text
MCP server 実装
MAINTENANCE-MCP-CONTRACT-V1 の詳細設計・Tool 6個設計
SharePoint write
GitHub mutation
production 接続
自動修復
permission / Entra / Microsoft 365 mutation
Deploy / App Catalog
Production GO
本文書を根拠とした新しい権限付与
UNKNOWN の推測補完
LLM による件数計算・状態判定・正本化
```

## 6. Acceptance（docs-only）

- MCP Tool Contract 方式が「採用候補」であり、「今すぐ実装」ではないことが読める。
- 当面の保守エージェント境界が read-only first である。
- LLM が説明役であり、件数計算・状態判定・正本にならない。
- Evidence 必須と UNKNOWN 非推測が明示されている。
- `mutationAuthorized = false` が初期既定であり、mutation capability は別設計・Human GO 必須である。
- #392 が現行の delivery / gate sequencing SSOT であり、本文書が delivery ownership を変更しないことが読める。
- 旧 delivery Issue #300 / #301 / #302 を現行 authority として本文書から新規依存させない。
- MCP server / SharePoint write / GitHub mutation / production 接続 / 自動修復を開始しない。

## 7. Gate

```text
Implementation = docs-only only
Ready / Merge = separate Human decision
Architecture Gate: Domain / Contracts / app code を変更しない
Implementation Gate: MCP server / Tool Contract 実装を開始しない
Release Gate / Production GO: NOT AUTHORIZED
```

次の Human 判断（本文書では実行しない）:

```text
この docs PR の Ready
この docs PR の Merge
MAINTENANCE-MCP-CONTRACT-V1 の開始可否
MCP server 実装開始
mutation capability の別設計開始
```

## 8. Verification（this unit）

```text
primary file:
  docs/architecture/maintenance-mcp-direction-v1.md

allowed companion (authority cross-link only):
  docs/architecture/staff-confidence-and-sustainable-maintenance-v1.md

app mutation: 0
spfx/ mutation: 0
domain / contract mutation: 0
permission mutation: 0
MCP server / Tool 実装: 0
SharePoint / M365 / Entra mutation: 0
Deploy: 0
Production GO: 0
```
