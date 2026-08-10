# Canonical project status

## Current status（reconciled 2026-08-10）

SoT tip: `e5ec0dfed61f4afdaebcf678f325faffe8e038f0`

Project location:

* CN-1 observation: CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
* AssessmentSnapshots column path: Decision-AS-COLUMN-EG-1 Accepted / LOCKED

  * EG-1 + XB-1 + AP-1
* Human column create: AUTHORIZED as a separate Human process / NOT CONFIRMED as executed
* INTENDED columns / Choice options: not CONFIRMED until Human create + VR-1
* SharePoint adapter / schema mapping implementation: HOLD
* Deploy / real data: NO-GO

Repository development:

* Accepted / LOCKED authority に基づく pure-domain 実装 slice は進行済み
* OP-3、GOV-RULE-05、GOV-RULE-06、GOV-RULE-07 の domain slice が main に反映済み
* PROCESS-OPT-V1: ACCEPTED / LOCKED
* LOW-AUTO-PILOT-V1 policy: ACCEPTED
* LOW-AUTO-PILOT-V1 execution: NOT STARTED
* LOW-AUTO-PILOT-V1 implementation: DO NOT START YET
* Ready auto: NOT ACCEPTED
* Merge: HUMAN-ONLY

Issue hygiene:

* Decision-ISSUE-STATUS-RECONCILE-1: SELECTED / Phase ②
* Phase ①:

  * #5 CLOSED / completed
  * #10 CLOSED / completed
  * #11 CLOSED / not_planned
* Phase ①b read-back: PASS
* This Issue (#6): KEEP OPEN as the 3-month trial parent
* Decision Ledger (#8): KEEP OPEN / Current-state reconciliation required
* Phase ② scope: #6 / #8 Issue body reconciliation only

Out of scope for this reconciliation:

* #4 / #9 / #12 / #15〜#19
* #20以降
* UI Issues
* SharePoint / M365 mutation
* adapter / schema mapping implementation
* Deploy / real data
* LOW-AUTO-PILOT-V1 execution start

The older pre-CN-1 markers in this Issue body, including `Implemented: 0`, old #3/#7 gate status, and early environment assumptions, must not be treated as current project truth.

Accepted / LOCKED repository documents are the primary SoT for current Decision state.

This reconciliation does not mean:

* the 3-month trial is complete
* SharePoint columns are confirmed
* adapter implementation has started
* LOW-AUTO-PILOT-V1 execution has started
* backlog Issues are complete

強度行動障害支援アプリの3か月匿名化試行は、設計・Issue整理まで進んでいる。

実装開始ゲートは未通過であり、SPFx生成、SharePoint接続、試験環境変更、本番利用は開始しない。

## 現在の状態

```text
repository: yasutakesougo/severe-behavior-support-spfx
PR #2 contracts foundation: MERGED
PR #2 merge commit: 5e820d197ce9dac1addb47e8a0e1761e2fe82866
STEP17 traceability: PASS
Requirements: 139
Designed: 114
HOLD: 25
Implemented: 0
Verified: 0
```

PR #2のマージ後監査で、次の不足が確認されている。

```text
Issue #7:
UserId契約、正式7ロール、RecordId・IdempotencyKey二重照会、追加テスト

Issue #3:
依存関係固定、@types/node整合、contracts専用GitHub Actions
```

## 現在の主要ゲート

### 業務・管理決定

Issue #19の正式回答は未実施である。

次の決定を推測で実装しない。

- 点数入力者・最終確認者
- 正式な非該当条件と理由コード
- 算定不能時の対応
- 支援計画承認者
- 職員・利用者の異動履歴
- 資格・研修割合の分母・分子
- 観察期間・見直し周期
- handoff・削除・復旧責任者
- 性能測定条件

### 開発基盤

```text
#7 contracts post-merge correction: OPEN
#3 contracts CI / toolchain: OPEN
GitHub Actions runs for contracts: 0
Independent code review: 未実施
```

### Microsoft 365試験環境

```text
#4 試験サイトA/B: 未確定
App Catalog利用可否: 未確認
Entra試験グループ: 未作成
SharePoint書き込み: 未実施
Microsoft 365変更: NO-GO
```

### データ境界

- 完全合成fixtureだけを使用する
- 実在情報を使用しない
- 実データを加工したfixtureを使用しない
- Token、Cookie、Password、Secretを保存しない
- 現行キオスク版を変更しない

## 正本識別子

```text
A事業所: SITE-ISG / ISG / /sites/sbs-isogo
B事業所: SITE-HOM / HOM / /sites/sbs-honmoku
```

町田系旧識別子は使用しない。

## 実装開始前の順序

```text
Issue #19の正式回答
        ↓
Issue #8 DEC台帳へ反映
        ↓
Issue #34 Domain Entry Criteria再判定
        ↓
Issue #7 contracts是正
        ↓
Issue #3 package固定・contracts CI
        ↓
独立レビュー
        ↓
Issue #20等の業務contracts
        ↓
完全合成fixture
        ↓
SPFx標準生成物
```

Issue #4のMicrosoft 365試験環境確認は、コード実装と分離して並行できる。

## 1か月目：1事業所目を想定した基本試作

- [x] 要件139件のトレーサビリティを固定する
- [x] contracts、domain、fixtures、adapterの責務境界を設計する
- [ ] Issue #19の実装前決定を確定する
- [ ] Issue #7のcontracts不足を是正する
- [ ] Issue #3のcontracts CIを実装する
- [ ] 完全合成fixtureファイルを作成する
- [ ] SPFx 1.23.2の標準生成物を作成する
- [ ] Node.js 22.23.1、React 17.0.1、対応TypeScriptを固定する
- [ ] 利用者一覧・利用者詳細の最小画面を作成する
- [ ] ABC記録・観察記録の最小保存フローを作成する
- [ ] 未入力、算定不能、取得失敗を区別する

## 2か月目：2事業所目への再現試験

- [ ] 1事業所目のフィードバックを整理する
- [ ] provisioningでB事業所相当へ同じ構成を再現する
- [ ] A/B事業所のデータ分離を確認する
- [ ] A/B事業所の権限分離を確認する
- [ ] URL直接指定時のアクセス拒否を確認する
- [ ] 導入手順を文書化する

## 3か月目：安定化・手順・評価

- [ ] 共通課題を修正する
- [ ] 二重登録、保存失敗、取得失敗を再試験する
- [ ] 操作手順・管理者手順・復旧手順を整備する
- [ ] 成果、費用、安全性、継続可否を報告する

## 試行の対象外

- 実在する利用者データの使用
- 本番データ移行
- 本番公開
- 加算算定の自動確定
- 国保連請求データ生成
- 外部システム連携
- 3事業所目以降の本番展開

## 開始ゲート

- [ ] Issue #11に管理者承認・予算・期間を記録する
- [ ] Issue #19の実装前決定に正式回答がある
- [ ] Issue #7の是正が完了する
- [ ] Issue #3のGitHub Actionsが成功する
- [ ] 独立レビューが完了する
- [ ] Issue #4の試験サイトA/Bと担当者が確定する
- [ ] 完全合成データだけを使用する運用が共有される

## 現在判定

```text
Planning and traceability: PASS
PR #2 foundation: MERGED / PARTIAL
Post-merge correction: HOLD
Contracts CI: MISSING
Governance decisions: HOLD
Trial approval record: HOLD
SPFx generation: HOLD
SharePoint integration: HOLD
Provisioning: HOLD
3-month trial start: NO-GO
Production: NO-GO
```

