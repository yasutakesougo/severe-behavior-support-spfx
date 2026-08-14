# STAFF-CONFIDENCE & SUSTAINABILITY V1

この文書は、法人システムのインシデント対応について、
**STAFF-CONFIDENCE & SUSTAINABILITY V1** を横断正本として固定する。

出典は Human 供給の
「インシデント対応マニュアル（STAFF-CONFIDENCE & SUSTAINABILITY V1 準拠）」である。

本 V1 は docs-only である。実装開始、権限付与、Deploy、Production GO を認可しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: STAFF-CONFIDENCE-SUSTAINABILITY-1
Kind: docs-only / cross-cutting canonical
Status: REVIEWABLE（Accepted / LOCKED ではない）
Date: 2026-08-14
Baseline main: 3f18745a1e9f3fdeb5aea04c3b316c5336ce16ae

Source:
  Human supplied
  「インシデント対応マニュアル
   （STAFF-CONFIDENCE & SUSTAINABILITY V1 準拠）」

Applies across:
  #300 LIVE-SHAREPOINT-V1
  #301 TWO-SITE-PILOT-V1
  #302 PRODUCTION-READY-V1

Does NOT mutate:
  #300 / #301 / #302 Issue body
  app code / spfx/
  domain / contracts
  permission / Entra / SharePoint / M365
  Deploy / App Catalog
  Production GO
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

```text
Implementation Start: NOT AUTHORIZED（this document alone）
Ready / Merge: separate Human decision
#300 Implementation Start: NOT AUTHORIZED by this document
#300 / #301 / #302 Close: NOT AUTHORIZED
Production GO: NOT AUTHORIZED
permission grant from this document: FORBIDDEN
```

## 1. Purpose

現場職員が技術を理解しなくても、異常を安全に止め、必要な事実だけを伝えられる状態を保つ。

保守エージェントが、同じ入口から read-only で調べ、Human GO の前に mutation しない状態を保つ。

知識がチャットや個人記憶に残らず、Decision / Issue / Evidence に残る状態を保つ。

```text
目標 ≠ 職員を技術者にすること
目標 ≠ 新しい権限を配ること
目標 ≠ #300 実装開始
目標 = 職員の安心と、保守可能な知識の置き場所を横断正本として固定すること
```

## 2. Authority boundary

| 問い | 正本 |
|---|---|
| 職員が異常時に何をするか | **本文書** |
| 保守エージェントが最初に何をするか | **本文書** |
| 重大障害時の連絡役割名 | GOV-AUD-10（UNCHANGED） |
| Finding の severity 語彙 | Decision-SEV-2-VOCAB（NOT ADOPTED） |
| Human GO / mutation 境界 | DEC-AI-ORG-003 / permission-matrix |
| 保守 MCP を採用する場合の安全境界 | [`maintenance-mcp-direction-v1.md`](./maintenance-mcp-direction-v1.md)（採用候補の境界のみ。実装開始ではない） |
| Phase 2 / 3 / 4 の Issue 範囲 | #300 / #301 / #302（body UNCHANGED） |
| 運用手順書一式の Issue 所有 | #30（本文書は横断原則。#30 Close しない） |

本文書は GOV-AUD-10、DEC-AI-ORG-003、Decision-SEV-2-VOCAB、#300 / #301 / #302 を再 Decision しない。

## 3. Principles

次を Preserved とする。本文書で緩和しない。
本文書の Status は REVIEWABLE であり、Accepted / LOCKED ではない。

```text
P-SC-1  職員に技術理解を要求しない
P-SC-2  異常時は 7項目報告で足りる
P-SC-3  相談入口は保守エージェントへ一本化する
P-SC-4  保守は read-only first
P-SC-5  mutation の前に Human GO が必要
P-SC-6  知識の置き場所は Decision / Issue / Evidence
P-SC-7  個人情報を GitHub 等へ不要転記しない
P-SC-8  本文書を根拠に新しい権限を付与しない
```

横断適用:

```text
#300 / #301 / #302 を進めるときも、上記原則は同じである。
Phase が進んだことだけを理由に、職員へ技術理解を要求しない。
Phase が進んだことだけを理由に、Human GO なし mutation を開始しない。
```

## 4. Staff flow

職員は技術原因を特定しない。画面の専門用語を説明できる必要はない。

### 4.1 職員がやること

1. 安全性が分からない異常に気づいたら、**追加操作を止める**。
2. 7項目報告を書く。分からない欄は「分からない」でよい。
3. **保守エージェントへ一度だけ**相談する。
4. 画面にすでに出ているエラーコード / 相関ID / 事業所があれば、任意の補足として書いてよい。無ければ探さない。
5. Human または保守エージェントが「続けてよい」と言うまで、推測で再操作しない。

### 4.2 職員がやらなくてよいこと

```text
ログの場所を探す
GitHub を開く
SharePoint を直す
権限を変える
再保存を繰り返す
技術原因を推測する
重大度（severity）を自分で付ける
エラーコード / 相関ID / 事業所を技術調査で探し出す
```

保存結果が分からないときは、成功したつもりで再送しない。
取得失敗の画面を、判定できたことにしない。

### 4.3 「様子を見る」の正規化（NORMALIZE ONLY）

原文の「異常を感じたのに様子を見る」は、次の意味に**限定**する。

```text
ALLOWED meaning:
  安全性が不明な異常を、報告せず操作継続してはならない。
  報告するまで、独断で同じ操作・別の試し操作を続けない。

NOT the meaning:
  異常に気づいても、様子を見てから報告すればよい。
  小さく見える異常は黙って使い続けてよい。
  技術が分からないから、誰にも言わず待つ。
```

止める対象は「安全性が不明なままの継続操作」である。
業務上すでに安全と確認済みの通常作業まで、すべて停止せよという意味ではない。
安全かどうかが分からないときは、報告側へ倒す。

## 5. 7項目報告

職員から保守エージェントへ渡す最小セットは、次の **Human 定義 7 項目**とする。
意味を変えない。技術用語の理解は不要。空欄より「分からない」「なし」を使う。

| # | 項目 | 職員向けの書き方 | 書いてはいけないこと |
|---|---|---|---|
| 1 | 何が起きたか | 起きたことを業務のことばで書く | 技術原因の推測を職員に求めること |
| 2 | いつ起きたか | 分かっている日時。分からなければ「分からない」 | 推測で正確時刻を作ること |
| 3 | どの画面か | 見ていた画面の名前 / 場所が分かる範囲 | 画面 ID や URL を技術調査で探すこと |
| 4 | 直前に何をしたか | 異常の直前に行った操作 | 再現手順の完全な技術記述を要求すること |
| 5 | 何と表示されたか | 画面に出たことば / 普段と違った見え方 | 未確認情報を「保存済み」など確定値で書くこと |
| 6 | 再操作・再送したか | 「した」または「していない」。したなら何をしたか | 再操作・再送を勧めること / 様子見で正当化すること |
| 7 | スクリーンショットがあるか | 「ある」または「ない」。あるなら手元にある旨 | 個人情報が写った画像を GitHub 等へ不要転記すること |

任意の補足（必須ではない）:

```text
エラーコード / 相関ID / 事業所は、
すでに画面に表示されている、または職員がすでに知っている場合だけ、
任意の補足として書いてよい。

職員に技術情報の発見を要求しない。
無いものを探さない。
無いものを作らない。
```

```text
7項目報告 ≠ 技術インシデント票の完成
7項目報告 ≠ 個人情報の収集許可
7項目報告 ≠ GitHub Issue への原文転記許可
7項目報告 ≠ エラーコード / 相関ID / 事業所の必須化
```

## 6. Maintenance-agent flow

相談入口は保守エージェントに一本化する。
職員が複数の人・複数のエージェント・GitHub へ同時に同じ相談を広げなくてよい。

保守エージェントは、新しい権限を持たない。既存の Human GO 境界を使う。

### 6.1 必ず先にやること（read-only first）

1. 7項目報告を受ける。足りない項目は職員に技術理解を求めず、分かる範囲だけ聞く。
2. Decision / Issue / Evidence を **読む**。
3. GitHub live state、既存 docs、表示されているエラーコード / 相関IDを **読む**。
4. 観察結果を Evidence として残す準備をする。残す内容に個人情報を入れない。
5. 次に必要な Human 判断を、mutation せずに提示する。

```text
read-only first ≠ 永久に直さない
read-only first = 読む・切り分ける・提案する までを mutation より先に行う
```

### 6.2 Human GO の前にやってはいけないこと

```text
app code mutation
spfx/ mutation
domain / contract 変更
permission 変更
SharePoint / M365 / Entra mutation
Deploy / App Catalog
Issue Close
#300 / #301 / #302 body mutation
Production GO の代行
個人情報の GitHub 転記
```

明示 Human GO がある操作だけを、その GO の対象・範囲・版に拘束して行う。
GO の対象が変わったら、その GO は使わない。

### 6.3 知識の置き場所

| 置き場所 | 置くもの | 置かないもの |
|---|---|---|
| Decision | 採択した意味・境界 | 未確認の推測、live Ready/Merge 状態 |
| Issue | 残作業・追跡・所有 | 個人情報、Secrets、実データ |
| Evidence | 観察した事実（誰が・いつ・何を見たか） | 個人情報、token、実利用者の本文 |

チャットだけに残した知識は、正本ではない。
古い docs だけを根拠に、現在の本番状態を CONFIRMED としない。

## 7. SC-01〜SC-05（標準インシデントケース）

SC-01〜SC-05 は Human 定義の **標準インシデントケース**である。
一般の受入試験ラベルへ再定義しない。FindingSeverity ではない。
新しい severity 語彙を導入しない。

| ID | 標準インシデントケース | 職員の扱い | 備考 |
|---|---|---|---|
| **SC-01** | 保存失敗 | 7項目報告し、独断の再送をしない | — |
| **SC-02** | 保存結果不明 | 7項目報告し、成功したつもりで再送しない | — |
| **SC-03** | 画面が開かない | 7項目報告し、技術原因の特定をしない | severity = UNDEFINED（決めない） |
| **SC-04** | 権限不足 | 7項目報告し、権限を自分で変えない | severity = UNDEFINED（決めない） |
| **SC-05** | 別事業所の情報が見える疑い | 追加操作を止め、直ちに 7項目報告する | **最重要安全試験** |

```text
SC identifiers = standard incident cases
SC identifiers ≠ generic acceptance tests
SC-05 = most important safety test
```

### 7.1 SC-03 / SC-04 の severity は UNDEFINED（NORMALIZE ONLY）

SC-03（画面が開かない）と SC-04（権限不足）について、
重大度（severity）は **未定義のまま**とする。勝手に新しい severity を決定しない。

```text
SC-03 / SC-04 の severity = UNDEFINED
FindingSeverity = NOT ADOPTED（Decision-SEV-2-VOCAB / Issue #8 / DEC-018）
本 V1 は新しい severity を決定しない
low / medium / high を職員報告の必須欄にしない
Agent は本文書を根拠に severity 語彙を発明しない
```

レビュー重大度 `P0` / `P1` / `P2` は開発 Gate の語彙であり、職員向けインシデント分類ではない。
混ぜない。

### 7.2 SC-05 — 最重要安全試験

SC-05 の標準ケースは **別事業所の情報が見える疑い**である。
本 V1 の最重要安全試験とする。

職員:

```text
追加操作を止める
7項目報告する
保守エージェントへ一本化する
他事業所データを開こうとしない
個人情報を GitHub 等へ転記しない
```

保守エージェント:

```text
read-only first
Human GO 前に mutation しない
事業所混在の疑いを、許可側へ倒さない
本文書だけを根拠に権限を増やさない
```

本番受入で SC-05 が通っていない状態を使わない。
SC-05 は #23 の事業所分離安全境界および DEC-AI-ORG-003 の Human GO 境界と矛盾させない。
本 V1 は #23 の試験実装を開始しない。

## 8. #300 / #301 / #302 横断原則

本文書は Phase 2〜4 の横断原則である。各 Issue の Goal / Scope / Acceptance / Explicit OUT を上書きしない。

| Issue | 本文書が維持すること | 本文書がしないこと |
|---|---|---|
| #300 LIVE-SHAREPOINT-V1 | read-only first、fail-closed、Human GO 前 mutation 禁止 | 実接続実装の開始、#300 Close、Production 運用開始の主張 |
| #301 TWO-SITE-PILOT-V1 | 事業所分離、職員が技術理解なしで異常を止められること | 未承認の権限拡張、パイロット結果による Decision 自動変更 |
| #302 PRODUCTION-READY-V1 | SC-05（別事業所の情報が見える疑い）を最重要安全試験として残す | Human Production GO の代行、evidence なしの 100% 宣言 |

```text
本文書 ≠ #300 Implementation Start
本文書 ≠ #301 パイロット完了
本文書 ≠ #302 Production GO
本文書 ≠ #300 / #301 / #302 body mutation
```

#300 の Explicit OUT（実利用者データによる本番運用開始、2事業所パイロット完了の主張、Production GO、この Issue 単独による Entra / SharePoint mutation 認可）は維持する。

#301 の Explicit OUT（Production deploy 完了の主張、未承認の権限拡張、パイロット結果を根拠に既存 Decision を自動変更すること）は維持する。

#302 の Explicit OUT（Human Production GO 前の本番公開、evidence なしの 100% 宣言、パイロットと本番環境の差分を無視した deploy）は維持する。

## 9. 既存正本との関係

| 正本 | 関係 |
|---|---|
| GOV-AUD-10 | 連絡役割名 UNCHANGED（第一報=事業所管理者、技術連絡=Microsoft 365管理者、業務連絡=業務責任者または指定確認者、個人情報事故の連絡=法人管理者、再開判断=事業所管理者）。個人名・電話・メールは依然として定めない |
| DEC-AI-ORG-003 / permission-matrix | mutation 区分 UNCHANGED。本文書は権限を増やさない |
| MAINTENANCE-MCP-DIRECTION-V1 | 保守 MCP を採用する場合の安全境界（read-only first、LLM 非正本、mutationAuthorized=false）。MCP 実装開始ではない |
| Decision-SEV-2-VOCAB | FindingSeverity NOT ADOPTED を維持。SC-03 / SC-04 の severity を発明して再導入しない |
| LIVE-SP-1 / LIVE-SP-2 | read-only first と整合。live write / Deploy は別 Human GO のまま |
| #23 | P0 安全受入の試験所有は #23 のまま。本文書は SC-05（別事業所の情報が見える疑い）を最重要安全試験として横断固定するだけ |
| #30 | 操作・障害・復旧・handoff 手順の Issue 所有は #30 のまま。本文書は職員/保守の横断原則であり、#30 文書一式の実装開始ではない |
| completion-roadmap / governance | 進捗率は Gate ではない。Phase 移行だけで mutation を開始しない |

## 10. Acceptance

本文書の Acceptance は、docs として原則が読めることの確認である。
Production 受入そのものではない。

### 10.1 STAFF-CONFIDENCE

- 職員向け手順が、技術理解なしで実行できることばで書かれている。
- Human 定義の 7項目報告が職員の最小セットとして固定されている。
- エラーコード / 相関ID / 事業所は任意補足であり、職員に技術情報の発見を要求しない。
- 「様子を見る」が、安全性不明の異常を報告せず操作継続しない意味に限定されている。
- 相談入口が保守エージェントへ一本化されている。
- SC-01〜SC-05 が標準インシデントケースとして固定され、一般受入試験へ再定義されていない。

### 10.2 MAINTENANCE-AGENT

- 最初の動作が read-only である。
- Human GO 前の mutation が禁止されている。
- 知識の置き場所が Decision / Issue / Evidence である。
- 個人情報の GitHub 等への不要転記が禁止されている。

### 10.3 SUSTAINABILITY

- 原則がチャット専用知識になっていない。
- #300 / #301 / #302 を進めても、同じ入口・同じ Human GO 境界を使う。
- 本文書から新しい権限が派生しない。
- GOV-AUD-10 / DEC-AI-ORG-003 / FindingSeverity NOT ADOPTED と矛盾しない。

### 10.4 Production acceptance（原則のみ）

本番運用可能の判断（#302）で、本 V1 が前提として残すべきこと:

```text
職員が技術理解なしで異常を止め、Human 定義の 7項目報告できる
保守エージェントが read-only first で調べ、Human GO 前に mutation しない
SC-05（別事業所の情報が見える疑い）が通っていない状態を本番受入に使わない
個人情報を GitHub 等へ不要転記しない
```

```text
本節 ≠ Human Production GO
本節 ≠ #302 Close
本節 ≠ Deploy
本節 ≠ 100% 宣言
```

#302 の Acceptance Criteria（未解決 P0 / P1 なし、本番権限境界の検証、rollback、deployment evidence、production smoke、明示 Human Production GO）は、本文書では消化しない。

## 11. Explicit OUT / FORBIDDEN

```text
app code mutation
spfx/ mutation
domain / contract 変更
permission 変更
SharePoint / Microsoft 365 / Entra mutation
Deploy / App Catalog
#300 implementation start
#300 / #301 / #302 body mutation
Issue Close
Production GO
本文書を根拠とした新しい権限付与
FindingSeverity の再導入
新しい severity 語彙の決定
個人情報・Secrets・実データの GitHub 転記
職員への技術理解の要求
相談入口の複数化（職員がどこへ言えばよいか分からなくなること）
```

## 12. Gate

```text
Implementation = docs-only only
Ready / Merge = separate Human decision
Architecture Gate: 本 V1 は運用横断原則であり、Domain / Contracts を変更しない
Implementation Gate: 本 PR では code Implementation を開始しない
Release Gate / Production GO: NOT AUTHORIZED
```

次の Human 判断（本文書では実行しない）:

```text
この docs PR の Ready
この docs PR の Merge
#300 以降の各 slice Implementation Start（既存個別 GO のまま）
#30 の運用文書実装開始
Production GO
```

## 13. Verification（this unit）

```text
changed files = 1 docs file only
  docs/architecture/staff-confidence-and-sustainable-maintenance-v1.md

app mutation: 0
spfx/ mutation: 0
domain / contract mutation: 0
permission mutation: 0
SharePoint / M365 / Entra mutation: 0
Deploy: 0
#300 / #301 / #302 body mutation: 0
Issue Close: 0
Production GO: 0
```
