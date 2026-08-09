# Issue #8 FindingCode DEC 本文準備 — 業務状態の洗い出し

この文書は、Option C 選択後の **次作業** である。

目的は FindingCode の命名ではない。
Issue #8 DEC 本文に入れる **「Finding として管理すべき業務状態」** を、
人の言葉で洗い出すことである。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Kind: DEC body preparation / business-state inventory
Status: OPEN — continue one business state at a time
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

いまやるのは **①〜③を1件ずつ**。
④ は Human 承認。⑤⑥ は後工程。

## 1件ずつの記録形式（必須）

次の形式でだけ確定する。Agent が空欄を補完しない。

```text
Business State:
  （人の言葉）
System behavior:
  HARD GATE | NOTICE | OTHER（Human が明示）
Finding:
  ADOPTED | NOT ADOPTED
FindingCode:
  NONE | PENDING（Finding ADOPTED のときだけ後で命名）
継続管理:
  Findingとしては行わない | Findingとして行う
```

## 確定済み（Human Decision）

### BS-001 — 有効な支援計画がないため手順記録へ進めない

```text
ID: BS-001
Status: DECIDED（Human primary information / 2026-08-09）
Finding catalog: OUT OF SCOPE（対象外）

Business State:
  有効な支援計画がないため、支援手順記録へ進めない

System behavior:
  HARD GATE
  → その場で進行を禁止する

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  Findingとしては行わない

Catalog implication:
  本状態は Finding catalog（A-1 値一覧）の対象外
  Issue #8 DEC 本文では「Finding にしない業務状態」側に記載する
```

流れ:

```text
支援計画なし
  ↓
手順記録へ進めない
  ↓
その場で止める
  ↓
Finding は生成しない
  ↓
FindingCode も作らない
```

分岐メモ（記録用）:

```text
Human Selected: A（hard gate のみ）
B（Finding として継続管理）: 選ばない
```

### BS-REF-01 — 見直し対象月に入った（参考・既存 Accepted）

FindingCode catalog 候補ではない。見本として残す。

```text
ID: BS-REF-01
Status: REFERENCE（GOV-RULE-06/07/08 Accepted — catalog 候補外）

Business State:
  見直し対象月に入った（「3ヶ月に1回程度」の見直し時期）

System behavior:
  NOTICE
  → 職員へ「見直し時期です」と知らせる

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  Findingとしては行わない（情報通知のみ）
```

## Business-state table（要約）

| ID | 業務状態（人の言葉） | System behavior | Finding | FindingCode | 継続管理 | 状態 |
|---|---|---|---|---|---|---|
| BS-001 | 有効な支援計画がないため、支援手順記録へ進めない | HARD GATE | **NOT ADOPTED** | **NONE**（catalog OUT） | Findingとしては行わない | **FIXED** |
| BS-002 | 支援手順記録時に適用すべき支援手順が確認できない | HARD GATE | **NOT ADOPTED** | **NONE**（catalog OUT） | Findingとしては行わない | **FIXED** |
| BS-003 | 支援手順記録に必要な記録項目が不足している | HARD GATE | **NOT ADOPTED** | **NONE**（catalog OUT） | Findingとしては行わない | **FIXED** |
| BS-004 | 想定結果が得られずチーム再確認・見直しが必要 | NOTICE（定期モニタリング） | **NOT ADOPTED** | **NONE**（catalog OUT） | モニタリング会議・見直しで管理 | **FIXED** |
| BS-005 | 計画に沿って支援し手順記録で経過観察している（正常サイクル） | OTHER（通常運用） | **NOT ADOPTED** | **NONE**（catalog OUT） | 手順記録とモニタリングで管理 | **FIXED** |
| BS-006 | モニタリング実施と計画見直し・更新結果を記録した | OTHER（監査証跡） | **NOT ADOPTED** | **NONE**（catalog OUT） | 監査証跡・実績記録として保持 | **FIXED** |
| BS-007 | モニタリングで決まった対応が未完了 | OTHER（モニタリング記録） | **NOT ADOPTED** | **NONE**（catalog OUT） | モニタリング記録だけで管理 | **FIXED** |
| BS-008 | （Human が提示） | | | | | **OPEN** |
| BS-REF-01 | 見直し対象月に入った | NOTICE | NOT ADOPTED | NONE | 情報通知のみ | REFERENCE |

## 確定済み — BS-002

```text
ID: BS-002
Status: FIXED（Human ops confirmation / 2026-08-09）
確認問答え: A（合っている）
Finding catalog: OUT OF SCOPE（対象外）
Evidence:
  Human が運用を明示確認
  「適用すべき支援手順が確認できない
   → 支援手順記録を確定させない」
Agent invention: NO
```

```text
ID: BS-002
Status: FIXED（2026-08-09）

Business State:
  支援手順記録を行う時点で、
  適用すべき支援手順が確認できない

System behavior:
  HARD GATE
  → 支援手順記録を確定できない / 確定させない

Finding:
  NOT ADOPTED
  → Finding は作らない

FindingCode:
  NONE
  → FindingCode も作らない

継続管理:
  Findingとしては行わない

Finding catalog scope:
  OUT
```

流れ:

```text
適用すべき支援手順が確認できない
  ↓
支援手順記録を確定させない
  ↓
HARD GATE
  ↓
Finding は作らない
  ↓
FindingCode も作らない
```

### BS-002 確認問（記録）

```text
問:
  「適用すべき支援手順が確認できない場合、
   支援手順記録を確定させない」運用で合っていますか？

A. 合っている → BS-002 を FIXED へ
B. 違う → 内容を修正
C. 現場確認が必要 → HOLD

答え: A（2026-08-09）
```

## 確定済み — BS-003

```text
ID: BS-003
Status: FIXED（Human primary information / 2026-08-09）
Finding catalog: OUT OF SCOPE（対象外）
Agent invention: NO
```

```text
ID: BS-003
Status: FIXED（2026-08-09）

Business State:
  支援手順記録に必要な記録項目が不足している

System behavior:
  HARD GATE
  → 必須項目が揃うまで記録を確定させない

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  Findingとしては行わない

Finding catalog scope:
  OUT
```

流れ:

```text
必須記録項目が不足
  ↓
記録を確定させない
  ↓
HARD GATE
  ↓
Finding は作らない
  ↓
FindingCode も作らない
```

```text
BS-001〜003 まとめ:
  いずれも「その場で止める」
  Finding として継続追跡しない
  Finding catalog OUT
```

## 確定済み — BS-004

```text
ID: BS-004
Status: FIXED（Human primary information / 2026-08-09）
Finding catalog: OUT OF SCOPE（対象外）
Absorbed by:
  GOV-RULE-06 Accepted（3ヶ月に1回程度の見直し）
  GOV-RULE-07 Accepted / Option C（対象月に入ったら通知）
Boundary:
  「あとで確認が必要」≠ 即 Finding
Agent invention: NO
```

```text
ID: BS-004
Status: FIXED（2026-08-09）

Business State:
  支援を続けているが想定した結果が得られず、
  チームで再確認・見直しが必要な状態

System behavior:
  NOTICE
  → 3ヶ月に1回程度のモニタリング会議で確認する
  → 必要に応じて支援内容を更新する
  → 日々の支援手順記録は止めない

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  Findingとしては行わない
  → モニタリング会議・見直しプロセスで管理する

Finding catalog scope:
  OUT
```

流れ:

```text
想定結果が得られない / チーム再確認が必要
  ↓
定期モニタリング（3ヶ月に1回程度）で扱う
  ↓
対象月通知（GOV-RULE-07）に吸収可能
  ↓
日々の手順記録は止めない
  ↓
Finding は作らない / FindingCode も作らない
  ↓
catalog OUT
```

```text
境界メモ:
  「あとで確認が必要」だから即 Finding、ではない
  既存の見直し・通知運用に吸収できるものは catalog OUT
```

## 確定済み — BS-005

```text
ID: BS-005
Status: FIXED（Human primary information / 2026-08-09）
Finding catalog: OUT OF SCOPE（対象外）
Kind: 正常な業務サイクル（Finding ではない）
Rejected framing:
  「新しい状況が出たら即チーム確認」という別ルールを追加しない
  → 通常の支援サイクルとして整理する
Agent invention: NO
```

```text
ID: BS-005
Status: FIXED（2026-08-09）

Business State:
  アセスメントを基に作成された支援計画シートに沿って支援を行い、
  支援手順記録によって経過観察している状態

System behavior:
  OTHER
  → 支援計画シートに沿って支援する
  → 支援手順記録を継続する
  → 記録された経過をモニタリングで確認する
  → モニタリング結果に基づいて必要な更新を行う

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  Findingとしては行わない
  → 支援手順記録とモニタリングで管理する

Finding catalog scope:
  OUT

Evidence status:
  Human一次情報
```

正常業務サイクル:

```text
アセスメント
  ↓
支援計画シート
  ↓
支援
  ↓
支援手順記録による経過観察
  ↓
モニタリング
  ↓
必要な更新
```

```text
この正常な業務サイクルそのものは Finding ではない
BS-001〜005: Finding NOT ADOPTED / FindingCode NONE / catalog OUT
Finding ADOPTED 件数: 0（まだ未提示）
```

## 確定済み — BS-006

```text
ID: BS-006
Status: FIXED（Human primary information / 2026-08-09）
Finding catalog: OUT OF SCOPE（対象外）
Kind: 監査証跡・実績記録（Finding ではない）
Boundary:
  「監査で後から確認する必要がある」
  ≠ 「未解決課題として Finding で追跡する」
Rejected framing:
  単なる「未完了通知」としては整理しない
Separate later（FindingCode ではない）:
  監査要件を満たすために「何を保存するか」
  → 今後の audit / evidence contract で扱う
Agent invention: NO
```

```text
ID: BS-006
Status: FIXED（2026-08-09）

Business State:
  モニタリングを実施し、
  支援計画シートの見直し・更新結果を記録した状態

System behavior:
  OTHER
  → モニタリング実施の事実を記録
  → 見直し・更新結果を記録
  → 重度加算の実績として後から確認可能にする

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  監査証跡・実績記録として保持

Finding catalog scope:
  OUT

Findingとの関係:
  SEPARATE

Evidence status:
  Human一次情報
```

流れ:

```text
モニタリング実施
  ↓
見直し・更新結果を記録
  ↓
監査証跡 / 重度加算実績として保持
  ↓
Finding は作らない / FindingCode も作らない
  ↓
catalog OUT
```

```text
新境界（Human一次情報）:
  継続保存が必要でも、監査証跡なら Finding とは限らない
  監査上必要 ≠ Finding
  Findingとの関係: SEPARATE
保存項目の詳細:
  FindingCode ではなく audit / evidence contract へ
```

## 確定済み — BS-007

```text
ID: BS-007
Status: FIXED（Human confirmation / 2026-08-09）
確認問答え: B
Finding catalog: OUT OF SCOPE（対象外）
Finding ADOPTED so far: 0
Meaning:
  モニタリングで決まった対応事項は、
  完了までアプリ上の「未対応」追跡は不要
  → モニタリング記録だけでよい
Agent invention: NO
```

```text
ID: BS-007
Status: FIXED（2026-08-09）

Business State:
  モニタリングで決まった対応が未完了

System behavior:
  OTHER
  → モニタリング記録で管理する
  → 別の未解決トラッキングは行わない

Finding:
  NOT ADOPTED

FindingCode:
  NONE

継続管理:
  Findingとしては行わない
  → モニタリング記録で保持する

Finding catalog scope:
  OUT
```

流れ:

```text
モニタリングで対応決定
  ↓
対応が未完了でも
  ↓
モニタリング記録で管理（B）
  ↓
Finding は作らない / FindingCode も作らない
  ↓
catalog OUT
```

### BS-007 確認問（記録）

```text
問:
  モニタリングで決まった対応事項について、
  完了するまで「未対応」として追跡する運用は必要ですか？

A. 必要 → BS-007 で Finding 候補を検討
B. 不要。モニタリング記録だけでよい → catalog OUT
C. まだ分からない → HOLD

答え: B（2026-08-09）
```

```text
Inventory so far:
  BS-001〜003 → HARD GATE
  BS-004〜005 → 通常業務（手順記録・定期モニタリング）
  BS-006 → 監査証跡（Finding SEPARATE）
  BS-007 → モニタリング記録で足りる未完了対応（Finding 不要）
  Finding ADOPTED 件数: 0
  A-1 FindingCode values: EMPTY のままで不自然ではない
  Policy: 現場一次情報から Finding 対象が出てこない限り、
          FindingCode を無理に作らない
```

## Finding にする／しない の判断メモ（Human 用）

Finding にしやすいもの:

- あとから見返して、未解消のまま残す意味がある状態
- 誰かが対応し、状態が変わるまで追跡したいもの

Finding にしなくてよいもの:

- その場で止めれば足りる hard gate
- 単なるお知らせ（情報通知）
- すでに「採択しない」と決めたもの（例: hard due / overdue）

## Issue #8 DEC 本文に入れる骨子（下書き枠）

Human が必要件数の ①〜③ を埋めたあと、DEC 本文の骨子は次の形にする。
番号・コード名は **Human が後で** 付ける（A-1〜A-4）。

```text
Title: （Human — FindingCode business catalog DEC）
DEC number: PENDING — Human selection（A-4）

1. 目的
   Finding として継続管理する業務状態の正本

2. Finding にする業務状態
   - （現時点）なし
   - Finding ADOPTED 件数: 0
   - したがって A-1 FindingCode values は空でもよい
     （現場一次情報から対象が出るまでコードを作らない）

3. Finding にしない業務状態（Finding catalog 対象外）
   - BS-001: 有効な支援計画がないため手順記録へ進めない
     （HARD GATE / Finding NOT ADOPTED / FindingCode NONE / catalog OUT）
   - BS-002: 適用すべき支援手順が確認できないため手順記録を確定させない
     （HARD GATE / Finding NOT ADOPTED / FindingCode NONE / catalog OUT）
   - BS-003: 支援手順記録に必要な記録項目が不足している
     （HARD GATE / Finding NOT ADOPTED / FindingCode NONE / catalog OUT）
   - BS-004: 想定結果が得られずチーム再確認・見直しが必要
     （NOTICE / 定期モニタリング吸収 / Finding NOT ADOPTED / catalog OUT）
   - BS-005: 計画に沿って支援し手順記録で経過観察している（正常サイクル）
     （OTHER / Finding ではない / catalog OUT）
   - BS-006: モニタリング実施と計画見直し・更新結果を記録した
     （OTHER / 監査証跡 / Finding NOT ADOPTED / catalog OUT）
   - BS-007: モニタリングで決まった対応が未完了
     （モニタリング記録で足りる / Finding NOT ADOPTED / catalog OUT）
   - （その他 NOT ADOPTED 行）

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
Current work: business-state inventory（1件ずつ）
BS-001: FIXED（HARD GATE / catalog OUT）
BS-002: FIXED（HARD GATE / catalog OUT）
BS-003: FIXED（HARD GATE / catalog OUT）
BS-004: FIXED（NOTICE / 定期モニタリング吸収 / catalog OUT）
BS-005: FIXED（OTHER / 正常業務サイクル / catalog OUT）
BS-001〜003: FIXED（HARD GATE / catalog OUT）
BS-004〜005: FIXED（通常業務 / catalog OUT）
BS-006: FIXED（監査証跡 / SEPARATE / catalog OUT）
BS-007: FIXED（モニタリング記録で足りる未完了対応 / catalog OUT）
BS-001〜007: Finding NOT ADOPTED / FindingCode NONE / catalog OUT
BS inventory: PAUSED（BS-008 以降は増やさない — Finding 探索の逆転を避ける）
Finding ADOPTED 件数: 0
A-1 FindingCode values: EMPTY OK（無理に作らない）
DEC body Acceptance: Option A / EMPTY / NOT ADOPTED
  decision-findingcode-issue8-dec-body-acceptance.md
Boundary: 監査上必要 ≠ Finding / 継続保存 ≠ Finding / 未完了対応 ≠ 即 Finding
Audit save details: separate audit / evidence contract（FindingCode ではない）
A-1: NONE（Accepted）
A-2: NOT APPLICABLE（Accepted）
A-3: NOT APPLICABLE（Accepted）
A-4: UNASSIGNED
Acceptance: Accepted（DEC body）
A-5: HOLD
Implementation Start: HOLD
```

## Human への次の依頼（わかりやすく）

1. 洗い出しは停止のまま（Finding ADOPTED = 0）
2. 任意: A-4 Issue #8 DEC 番号を Human が採番
3. Finding 対象が新たに出たら別 Decision で再評価
4. Implementation Start は HOLD。Agent はコードを作らない
