# AUTO-1 — AUTONOMY-POLICY-V1 / 次 substantive unit Human Selection

この文書は、**次 substantive unit = `AUTO-1 — AUTONOMY-POLICY-V1`** の
**Human Selection 記録**である。

Candidate policy 正本:
[`../process/autonomy-policy-v1.md`](../process/autonomy-policy-v1.md)

Compare packet:
[`decision-auto-1-autonomy-policy-v1-packet.md`](./decision-auto-1-autonomy-policy-v1-packet.md)

Independent Review:
[`decision-auto-1-autonomy-policy-v1-independent-review.md`](./decision-auto-1-autonomy-policy-v1-independent-review.md)

Lane separation:
[`../process/dev-lane-separation-v1.md`](../process/dev-lane-separation-v1.md)

Depends on（再 Decision しない）:
[`../decisions/DEC-AI-ORG-003.md`](../decisions/DEC-AI-ORG-003.md)
[`../decisions/DEC-AA-001.md`](../decisions/DEC-AA-001.md)
[`../decisions/DEC-AA-003.md`](../decisions/DEC-AA-003.md)
[`../process/routine-aug-v1.md`](../process/routine-aug-v1.md)
[`../process/process-optimization-v1.md`](../process/process-optimization-v1.md)
[`../process/low-auto-pilot-v1.md`](../process/low-auto-pilot-v1.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AUTO-1 — AUTONOMY-POLICY-V1
Kind: docs-only contract candidate（コードを書かない）
Lane: LANE-DEVOS
Unit selection: FIXED（Human Decision on 2026-08-10）
Policy Acceptance: NOT YET
Status: CANDIDATE / NOT ACCEPTED
Authorization effect: NONE
Capability Registry: NOT IMPLEMENTED
Action Gateway: NOT IMPLEMENTED
AUTONOMY_GATEWAY: DISABLED（default / 変更しない）
Execution backend: NOT BOUND
Implementation: DO NOT START
Ready: HUMAN-ONLY
Merge: HUMAN-ONLY
SharePoint / M365: UNCHANGED / FORBIDDEN
Deploy / real data: FORBIDDEN
LANE-APP: 影響なし（別 lane / 飛ばさない）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Selection（固定結論）

```text
次 substantive unit:
AUTO-1 — AUTONOMY-POLICY-V1

Cursor SDK Runner を次にはしない。
AUTO-1 ではコードを書かない。
まず機械判定可能な契約だけを固定する。
```

```text
Agent auto-select: FORBIDDEN
Agent recommendation: NOT Human Selection evidence
This document records the Human Decision only.
```

## Human が固定した点

| # | Human-fixed point | 反映先 |
|---|---|---|
| H1 | 次 unit = AUTO-1（Cursor SDK Runner ではない） | 本文書 |
| H2 | AUTO-1 は docs-only / 契約のみ。コードを書かない | policy 冒頭 / 18 章 |
| H3 | scope 10 項目（taxonomy / class / risk / baseline / paths / limits / fail-closed / UNKNOWN→DENY / approval / audit） | policy 1〜10 章 |
| H4 | `AUTO_ALLOWED` 初期候補 10 件 | policy 12.1 |
| H5 | `HUMAN_ONLY` / DENY 初期候補 9 件 | policy 12.2 / 12.3 |
| H6 | Gateway が `pull_request.merge` capability を **持たない**設計（prompt では不可） | policy 2.3 / 12.2 |
| H7 | Gateway 判定順序（capability → packet → risk → approval → baseline → path → idempotency → ALLOW） | policy 11.1 |
| H8 | DENY reason: `UNKNOWN` / `POLICY_MISMATCH` / `BASELINE_MOVED` / `HUMAN_ONLY` / `OUT_OF_SCOPE` | policy 11.2 |
| H9 | 特定 SDK 言語に依存せず `Cursor execution backend` として抽象化。TypeScript SDK は AUTO-8 の最初の backend | policy 14 章 |
| H10 | `LOW-AUTO-PILOT-V2` の前に negative test 5 件 | policy 13 章 |
| H11 | 2 lane を分ける。AUTO-1 を始めても LANE-APP の残 Decision を飛ばさない | `dev-lane-separation-v1.md` |
| H12 | 後続順序: Capability Registry → Task Packet Schema → Action Gateway contract | policy 15 章 |

## Human correction（記録）

```text
訂正対象: Python SDK が現在ある という記述
訂正内容: Cursor 公式一次情報では確認できなかった
確認済み: TypeScript SDK @cursor/sdk
結論: AUTO-1 では特定 SDK 言語に依存しない
      実装段階（AUTO-8）で TypeScript SDK を最初の backend にする
```

```text
本 repository は vendor 製品仕様を正本化しない。
上記は Human 提供の外部参照として policy 14.1 に記録する。
```

## 役割分離（記録）

```text
Cursor  = Builder（実装 slice 実行 / AUTO_ALLOWED capability のみ）
Codex   = Independent Reviewer（PR diff をコードベース・依存・test 実行と照合）
```

```text
builder backend ≠ reviewer backend
Reviewer capability = READ 系のみ
Reviewer PASS ≠ Human Acceptance
具体 vendor 名は契約に固定しない（policy 14 章の抽象で扱う）
```

## Why this unit now

| Input | State |
|---|---|
| PROCESS-OPT-V1 | ACCEPTED / LOCKED（LOW auto-loop DEFINED / NOT ENABLED） |
| LOW-AUTO-PILOT-V1 | LA1-A ACCEPTED（pilot policy）/ execution NOT STARTED |
| 現在の自律境界の実体 | 会話上のルール（機械的に強制されていない） |
| Human Decision | AUTO-1 を次 unit として固定 |

```text
現状: Prompt / docs に「Merge 禁止」と書いてある
問題: 強制していない
AUTO-1: 強制可能な契約へ移す前提を固定する
```

## Options disposition（unit 選定）

| Option | Result |
|---|---|
| AUTO-1 — AUTONOMY-POLICY-V1 | **SELECTED**（Human） |
| Cursor SDK Runner を先に実装 | **not selected** |
| Capability Registry を先に実装 | not selected（AUTO-1 の後） |
| LOW-AUTO-PILOT-V2 を先に実行 | not selected（negative test 5 件が前提） |
| LANE-APP の残 Decision を AUTO-1 で代替 | **FORBIDDEN**（LANE-SEP-V1 L-1 / L-2） |
| HOLD | not selected |

## 本 Selection が開かないもの

```text
NOT derived / MUST NOT equate:
  unit selection = AUTO-1 policy Accepted
  unit selection = Capability Registry / Action Gateway 実装 GO
  unit selection = AUTONOMY_GATEWAY_ENABLED
  unit selection = Implementation Start
  unit selection = permission expansion
  unit selection = GitHub publication / Ready / Merge automation
  unit selection = LOW-AUTO-PILOT-V1 execution / V2 開始
  unit selection = LANE-APP gate 充足（column create / VR-1 / mapping-complete / adapter Start）
  unit selection = SharePoint / M365 / Entra / Deploy / real data
```

## Done criteria（本 unit の candidate 記録）

- Human-fixed point H1〜H12 が candidate policy に写像されている
- 10 scope 項目がすべて機械判定可能な形（判定入力・判定結果・DENY reason）で記述されている
- `HUMAN_ONLY` / `FORBIDDEN` に実行経路を作らない構造規則が明示されている
- reason code が閉集合で、`POLICY_BLOCKED` が family label として分離されている
- 上位正本との conflict が register に記録され、緩和されていない
- Human 判断が必要な残点が compare packet の option として提示されている
- 数値・ID・vendor 仕様の発明がない
- src / tests / runtime 変更なし（docs-only）
- mechanical verification PASS
- Draft PR のまま Human Ready Decision で停止

## Next

```text
AUTO-1 unit selection: FIXED
AUTO-1 policy: CANDIDATE / NOT ACCEPTED
Next: AUTO-1 Human Acceptance（packet AP1-* の option 選択）
Capability Registry: 未開始（AUTO-1 Acceptance 後の別 Human Decision）
AUTONOMY_GATEWAY_ENABLED: 別 Human Explicit GO
LANE-APP: 独立して継続（AUTO-1 で飛ばさない）
Implementation Start: HOLD
Ready / Merge: HUMAN-ONLY
```
