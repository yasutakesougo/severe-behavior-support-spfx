# DEC-008 — 支援計画シート役割の分離（制度資格 / 実務中心者 / 最終承認者）

この文書は、**DEC-008** について、1 つの DEC 本文へ混ぜて断定しないための
**判断単位の分離正本** である。

採択・Accepted ではない。
Agent が制度上の資格要件・最終承認者を発明しない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: DEC-008（Issue #8 台帳上の既存番号）
Kind: role / qualification separation framing
Status: FRAMED / AUTHORING_CENTER Accepted / FINAL_APPROVER READY
Canonical ownership: Issue #8 / DEC-008
Related technical contract: support-plan-status-transition.md（role-free / UNCHANGED）
Finding catalog DEC-019: Accepted / EMPTY / NOT ADOPTED（別 track）
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

関連:

- 実務中心者 Acceptance:
  [`decision-dec-008-authoring-center-acceptance.md`](./decision-dec-008-authoring-center-acceptance.md)
- 次の狭域 Human Decision packet（最終承認者）:
  [`decision-dec-008-final-approver-decision-packet.md`](./decision-dec-008-final-approver-decision-packet.md)
- 実務中心者 packet（CONSUMED）:
  [`decision-dec-008-authoring-center-decision-packet.md`](./decision-dec-008-authoring-center-decision-packet.md)
- 支援計画状態遷移（ロール判定 OUT）:
  [`support-plan-status-transition.md`](./support-plan-status-transition.md)
- 見直し周期ソース（国リハ資料の扱い）:
  [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md)
- backlog: [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- ownership: [`finding-audit-ownership.md`](./finding-audit-ownership.md)

## 1. Why separate

DEC-008 は「提出・差戻し・承認ロール、制度値」を含む広い表面として言及されてきた
（[`issue-24-remaining-audit-pr-i-selection.md`](./issue-24-remaining-audit-pr-i-selection.md)）。

ここで一度に全部を確定すると、次を混同しやすい。

```text
混同しやすいもの:
  制度上の資格要件（加算・届出・通知に基づく）
  現場で実際に支援計画シートを書く中心者
  最終的に計画を有効化する承認者
  AI 要約・二次説明文
```

そのため DEC-008 は、少なくとも次の 3 軸に分けて扱う。

## 2. DEC-008 分離表（現時点）

| 軸 | 現時点の状態 | 根拠の扱い | 次 |
|---|---|---|---|
| **制度上の資格要件** | **未確定** | 生活介護・重度障害者支援加算の **現行通知本文** で確認する。公式ページ要約や AI 要約だけでは断定しない | 制度資料確認（別作業・本軸と分離維持） |
| **支援計画シート作成の実務中心者** | **Accepted** = 強度行動障害支援者養成研修（**実践研修**）修了者 | Human Option A（2026-08-09）。実務上の作成中心者のみ。制度要件にはしない | 完了（Acceptance） |
| **最終承認者** | **未決定** | 「作成者」と「最終的に有効化する人」を分離して決める。サービス管理責任者案は **未採択**（最終承認者 packet で採否を問う） | 狭域 Human Decision（下記） |

```text
DEC-008:
  制度上の資格要件:
    未確定
    → 生活介護・重度障害者支援加算の現行通知で確認する
  支援計画シート作成の実務中心者:
    強度行動障害支援者養成研修（実践研修）修了者
    → Accepted（実務上の作成中心者のみ）
  最終承認者:
    未決定
    → 「作成者」と「最終的に有効化する人」を分離して決める
```


## 3. いま断定しないこと（安全境界）

次の表現は、今回の確認範囲だけでは **DEC-008 の根拠にしない**。

```text
MUST NOT assert from AI summary / incomplete official pages alone:
  実践研修修了者が支援計画シートの作成や 3か月に1回以上の見直しを行う（制度必須として）
  実践研修修了が公的資格である
  修了者だけが作成できる
  サービス管理責任者が最終承認者である（採択済み）
  重度障害者支援加算の届出だけで役割要件が確定した
```

国リハの実践研修内容が、実践研修修了者が支援計画・評価の中核を担うという
**理解の方向性** と整合することまでは認めてよい。
ただしそれは **制度上の資格要件の確定** ではない。

```text
ALLOWED:
  実務中心者 = 実践研修修了者（Accepted / 実務上のみ）
  制度要件は現行通知確認まで未確定のまま残す
  最終承認者を作成者と分離した未決定のまま残す（次 packet で問う）

FORBIDDEN for Agent:
  invent institutional qualification rules
  invent final approver
  harden AI summary into Accepted DEC body
  equate authoring center Acceptance with institutional qualification
  start Implementation / role checks in code
```


## 4. 既存技術契約との関係

| 正本 | 関係 |
|---|---|
| [`support-plan-status-transition.md`](./support-plan-status-transition.md) | **UNCHANGED**。ロール判定は引き続き OUT |
| `createdBy` / `approvedBy` 等のフィールド形 | 形だけの契約。誰が入るかは本 DEC 未決 |
| GOV-RULE-05〜08 | 見直し周期・通知・due。作成/承認ロールとは混ぜない |
| DEC-019 Finding catalog | EMPTY / NOT ADOPTED。本 DEC と混ぜない |

## 5. 次の Human 判断（1問に絞る）

実務中心者は Accepted。制度資格要件は未確定のまま触らない。

狭域の問いだけを次 packet に置く:

> 作成した支援計画シートを、誰が確認・承認して有効化しますか？

Options: A サービス管理責任者 / B 別役割（明示） / C まだ決めない

正本: [`decision-dec-008-final-approver-decision-packet.md`](./decision-dec-008-final-approver-decision-packet.md)

## 6. Explicit non-goals

```text
FindingCode 作成: DO NOT START
A-5: OUT
Implementation Start: HOLD
制度資格要件の断定: DO NOT START（未確定のまま）
サービス管理責任者 = 最終承認者: 未採択（FINAL_APPROVER packet 待ち）
src/** / tests/** / SharePoint / Deploy: 変更しない
```
