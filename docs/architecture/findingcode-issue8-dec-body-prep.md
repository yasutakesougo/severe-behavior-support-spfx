# Issue #8 FindingCode DEC 本文準備 — 業務状態の洗い出し

この文書は、Option C 選択後の **次作業** である。

目的は FindingCode の命名ではない。
Issue #8 DEC 本文に入れる **「Finding として管理すべき業務状態」** を、
人の言葉で洗い出すことである。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: DEC body preparation / business-state inventory
Status: OPEN — Human input required
Selected Option: C（decision-findingcode-option-c-selection.md）
A-1〜A-4: PENDING（本文書では確定しない）
FindingCode naming: FORBIDDEN in this document
Implementation Start: HOLD
```

Live gate は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

関連:

- [`decision-findingcode-option-c-selection.md`](./decision-findingcode-option-c-selection.md)
- [`decision-findingcode-a14-bundle-content-decision-packet.md`](./decision-findingcode-a14-bundle-content-decision-packet.md)
- [`decision-fc-1-finding-code-catalog-ownership.md`](./decision-fc-1-finding-code-catalog-ownership.md)

## 進め方（守る順序）

```text
① 業務ルールを整理する（一次情報・運用の言葉）
② どの状態を継続管理すべきか決める
③ Finding にするもの／しないものを決める
④ Issue #8 DEC 本文を Human が承認する
⑤ その内容から A-1〜A-4 を確定する
⑥ Acceptance
```

いまやるのは **①〜③**。
④ は Human 承認。⑤⑥ は後工程。

## すでに決まっている例（コード名は付けない）

Accepted 済みの整理を、洗い出しの見本として再掲する。
ここから FindingCode 名を作らない。

### 例1 — 見直し通知

```text
一次情報:
  「3ヶ月に1回程度、支援を見直す」（GOV-RULE-06 Accepted）

業務ルール:
  見直し対象月に入ったら知らせる（GOV-RULE-07 Accepted / Option C）

扱い:
  情報通知である
  期限超過・違反 Finding にはしない（GOV-RULE-08 Accepted / NOT ADOPTED）

Finding にする?:
  NO（現行 scope）
```

### 例2 — 支援計画がないと進めない

```text
一次情報の候補:
  「必要な支援計画がない状態では、支援手順記録へ進めない」

Human 分岐（2026-08-09）:
  Selected: A
  A. hard gate だけでよい
     （進めない／止める。Finding としては残さない）
  B. 未作成状態を Finding として継続管理する
     （選ばない）

Finding にする?:
  NO — hard gate のみ（Human Selected A）
FindingCode:
  付けない（本状態は catalog 候補にしない）
```

## Human 入力表（空欄を Agent が埋めない）

各行について、Human が埋める。
FindingCode 名・番号は書かない。

| # | 業務状態（人の言葉） | 一次情報・根拠 | 継続管理するか | Finding にするか | しない場合の扱い | Human メモ |
|---|---|---|---|---|---|---|
| 1 | （例）見直し対象月に入った | GOV-RULE-06/07 | 通知として扱う | **NO** | 情報通知のみ | Accepted 見本 |
| 2 | 必要な支援計画がないまま手順記録へ進もうとする | （Human） | （Human） | （Human: YES/NO） | hard gate のみ / 他 | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

必要なら行を増やす。Agent は行を業務推測で埋めない。

## Finding にする／しない の判断メモ（Human 用）

Finding にしやすいもの:

- あとから見返して、未解消のまま残す意味がある状態
- 誰かが対応し、状態が変わるまで追跡したいもの

Finding にしなくてよいもの:

- その場で止めれば足りる hard gate
- 単なるお知らせ（情報通知）
- すでに「採択しない」と決めたもの（例: hard due / overdue）

## Issue #8 DEC 本文に入れる骨子（下書き枠）

Human が ①〜③ を埋めたあと、DEC 本文の骨子は次の形にする。
番号・コード名は **Human が後で** 付ける（A-1〜A-4）。

```text
Title: （Human — FindingCode business catalog DEC）
DEC number: PENDING — Human selection（A-4）

1. 目的
   Finding として継続管理する業務状態の正本

2. Finding にする業務状態
   - （Human 表の YES 行を人の言葉で列挙）

3. Finding にしない業務状態
   - （Human 表の NO 行と理由）

4. 変更管理
   追加・廃止は本 DEC の改訂による（FC-1）

5. 本 DEC では決めないもの
   - FindingCode のシステム文字列（A-1 確定まで）
   - 採番（A-2）
   - criterionId mapping（A-3）
   - A-5 representation strategy
   - Implementation Start
```

## Gate

```text
Selected Option: C
Current work: business-state inventory for Issue #8 DEC body
A-1: PENDING
A-2: PENDING
A-3: PENDING
A-4: PENDING
Acceptance: NOT STARTED
A-5: HOLD
Implementation Start: HOLD
```

## Human への次の依頼（わかりやすく）

1. 上の表に、**業務状態を人の言葉で** 足してください
2. それぞれ **Finding にする / しない** を書いてください
3. そろったら Issue #8 の DEC 本文案を Human が承認します
4. そのあとで初めて A-1〜A-4（コード名・採番など）を決めます

Agent は FindingCode 名を付けません。
