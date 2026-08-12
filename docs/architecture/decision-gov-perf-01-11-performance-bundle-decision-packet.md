# Decision Packet — GOV-PERF-01〜11 性能目標・測定条件 residual bundle

この文書は、**GOV-PERF-01〜11**（性能目標・測定条件）の
**Human Decision Packet** である。

Issue #19 §D 所有。Human 明示 bundle。
Agent が HOLD 具体値・合否マトリクス・端末・ブラウザ・ネットワークを発明しない。
性能試験実行 / Implementation Start ではない。

Selection:
[`decision-gov-perf-01-11-performance-bundle-selection.md`](./decision-gov-perf-01-11-performance-bundle-selection.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-PERF-01〜11（bundle）
Kind: Human Decision packet（bundle）
Status: Accepted / LOCKED（01A/03C/04C/05D/10A/11D）；HOLD（02/06/07/08/09）
Owner: Issue #19
Selected via: Decision-GOV-PERF-01-11-BUNDLE-1
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Performance test execution: HOLD / NOT AUTHORIZED
Implementation auto-start: FORBIDDEN
Agent recommendation: NONE（Binding 推薦なし）
Option+HOLD Acceptance: decision-gov-perf-01-11-performance-bundle-option-acceptance.md
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Bundle decisions（Human）

| ID | Topic | Result | Meaning（正本要約） |
|---|---|---|---|
| GOV-PERF-01 | 通常規模の合成利用者数 | **Accepted / Option A** | 30件（試行版 synthetic baseline；本番上限ではない） |
| GOV-PERF-02 | 合成記録量 | **SELECTED / HOLD** | 件数・年数 = VALUE NOT DETERMINED |
| GOV-PERF-03 | 正式受入のキャッシュ条件 | **Accepted / Option C** | cold と warm を別々に判定 |
| GOV-PERF-04 | 測定回数 | **Accepted / Option C** | 20回以上（測定開始ではない） |
| GOV-PERF-05 | 合否に使う統計値 | **Accepted / Option D** | 中央値・p95・最大値（max=自動FAIL発明禁止） |
| GOV-PERF-06 | 3秒・5秒目標の適用条件 | **SELECTED / HOLD** | cold/warm × median/p95 適用 = NOT DETERMINED |
| GOV-PERF-07 | 基準端末 | **SELECTED / HOLD** | 端末仕様 = NOT DETERMINED |
| GOV-PERF-08 | 対象ブラウザ | **SELECTED / HOLD** | ブラウザ = NOT DETERMINED |
| GOV-PERF-09 | 基準ネットワーク | **SELECTED / HOLD** | ネットワーク条件 = NOT DETERMINED |
| GOV-PERF-10 | 拡張・ストレス条件 | **Accepted / Option A** | P1通常規模だけを試行版必須 |
| GOV-PERF-11 | 目標超過時の判断者 | **Accepted / Option D** | 開発分析 + 業務責任者・法人管理者が判断 |

## 2. 判断単位の分離（混ぜない）

```text
合成規模（01）≠ 記録量（02）≠ キャッシュ条件（03）≠ 測定回数（04）
統計値（05）≠ 3秒/5秒適用（06）≠ 端末（07）≠ ブラウザ（08）≠ ネットワーク（09）
拡張条件（10）≠ 超過判断者（11）
Accepted Option ≠ HOLD 解除
Accepted Option ≠ 性能試験実行
Issue #19 design tip / recommendation ≠ Binding Acceptance
```

## 3. Options / HOLD（Issue #19 + Human）

### GOV-PERF-01 — Option A

```text
Meaning:
  通常規模の合成利用者数 = 30件
補足:
  試行版の通常規模 synthetic test baseline
  本番利用者数の上限ではない
```

Issue #19 Options: A. 30件 ← **SELECTED** / B. 50件 / C. 100件 / D. その他

### GOV-PERF-02 — HOLD / VALUE NOT DETERMINED

```text
Status: SELECTED / LOCKED / HOLD
未確定:
  利用者1人あたりABC記録件数
  観察記録件数
  支援計画の版数
  見直し履歴件数
  保持年数相当
解除: 実利用想定または測定設計の evidence 確認後の別 Human Decision
Agent MUST NOT invent 件数・年数
```

### GOV-PERF-03 — Option C

```text
Meaning:
  正式受入のキャッシュ条件 = cold と warm を別々に判定
補足:
  cold / warm の結果を混合した単一値で受入判定しない
```

Issue #19 Options: A. coldのみ / B. warmのみ / C. coldとwarmを別々に判定 ← **SELECTED** / D. その他

### GOV-PERF-04 — Option C

```text
Meaning:
  測定回数 = 20回以上
補足:
  実際の測定自体をこの Decision で開始するものではない
```

Issue #19 Options: A. 5回 / B. 10回 / C. 20回以上 ← **SELECTED** / D. その他

### GOV-PERF-05 — Option D

```text
Meaning:
  合否に使う統計値 = 中央値、p95、最大値
目的:
  median = 通常時の代表値
  p95 = 遅い側の実用性能確認
  max = 外れた極端な遅延の可視化
MUST NOT:
  この Decision だけから max 超過 = 自動 FAIL ルールを発明する
  具体的合否境界は GOV-PERF-06 と整合して別途確定する
```

Issue #19 Options: A. 平均値 / B. 中央値 / C. 中央値とp95 / D. 中央値、p95、最大値 ← **SELECTED** / E. その他

### GOV-PERF-06 — HOLD / VALUE NOT DETERMINED

```text
Status: SELECTED / LOCKED / HOLD
未確定:
  利用者一覧 3秒以内: cold中央値 / cold p95 / warm中央値 / warm p95
  ダッシュボード 5秒以内: cold中央値 / cold p95 / warm中央値 / warm p95
MUST NOT:
  「全項目必須」「中央値だけ必須」等を推測する
解除: PERF-03 / 05 Accepted 内容と整合させた別 Human Decision
```

### GOV-PERF-07 — HOLD / VALUE NOT DETERMINED

```text
Status: SELECTED / LOCKED / HOLD
未確定:
  業務PC / 業務タブレット / CPU / メモリ / 画面幅 / OS
解除: 実際の試験対象端末を read-only observation してからの別 Human Decision
MUST NOT: 機種・CPU・メモリ・OS を発明する
本 Decision に含まない: 端末購入・設定変更
```

### GOV-PERF-08 — HOLD / VALUE NOT DETERMINED

```text
Status: SELECTED / LOCKED / HOLD
未確定:
  ブラウザ名
  最低バージョンまたは更新方針
解除: 実際の管理端末・Microsoft 365運用条件確認後の別 Human Decision
MUST NOT: Edge / Chrome 等を自動採択する
```

### GOV-PERF-09 — HOLD / VALUE NOT DETERMINED

```text
Status: SELECTED / LOCKED / HOLD
未確定:
  接続場所 / 回線種別 / レイテンシの扱い / 一時障害の扱い
Issue #19 design recommendation（NON-BINDING / NOT Accepted here）:
  一時障害は通常性能から分離し、可用性として別記録する
MUST NOT:
  recommendation を本 bundle で正式 Acceptance に昇格させる
  ネットワーク条件・帯域・latency 数値を発明する
```

### GOV-PERF-10 — Option A

```text
Meaning:
  P1通常規模だけを試行版の必須条件とする
補足:
  3か月匿名化試行版の必須性能受入 = P1通常規模
  P2 / P3 を禁止するものではない
  P2 / P3 を本番前ゲートから永久に除外する決定ではない
  Production GO を与えるものではない
  P2 / P3 の正式な本番前要求は必要時に別 Decision
```

Issue #19 Options: A. P1通常規模だけを試行版の必須条件とする ← **SELECTED** / B. P1とP2 / C. P1・P2・P3 / D. その他

### GOV-PERF-11 — Option D

```text
Meaning:
  目標超過時の判断者 =
    開発担当が分析し、業務責任者・法人管理者が延期または継続を判断する
補足:
  開発担当単独では性能目標超過を受容できない
```

Issue #19 Options: A. 開発担当 / B. 業務責任者 / C. 法人管理者 / D. 開発分析 + 業務責任者・法人管理者判断 ← **SELECTED** / E. その他

## 4. Explicit non-options / FORBIDDEN

```text
HOLD（02/06/07/08/09）具体値発明
PERF-05 から max=自動 FAIL 発明
PERF-09 recommendation の Acceptance 昇格
性能試験実行 / synthetic data（既存認可超過）
SharePoint / M365 / Entra / UI / adapter
Implementation Start / Deploy / Production
GOV-RULE-01 / 04 HOLD 解除
Issue #19 Close
next residual auto-select
```

## 5. Agent recommendation

```text
Recommended: NONE
Reason:
  Issue #19 tips は NON-BINDING。
  HOLD 項目は evidence 後の別 Human Decision。
  Agent は Binding 推薦値を確定しない。
```

## 6. After Decision

```text
01A/03C/04C/05D/10A/11D: Accepted / LOCKED
02/06/07/08/09: HOLD（解除は別 Human Decision）
Performance test / Implementation Start: DO NOT START
next residual auto-select: FORBIDDEN
```

## Conflict check（summary）

| Prior | Relation |
|---|---|
| GOV-AUD-05 retention / post-retention Option C | **UNCHANGED**（性能 track と独立） |
| GOV-RULE-01 / 04 HOLD | **UNCHANGED**（本 bundle OUT） |
| GOV-STAFF / GOV-AUD Accepted | **UNCHANGED** |
| Issue #19 PERF tips | recommendation only；Human Accepted のみ Binding |

## Reference

- Selection: `decision-gov-perf-01-11-performance-bundle-selection.md`
- SELECT Acceptance: `decision-gov-perf-01-11-performance-bundle-acceptance.md`
- Option+HOLD Acceptance: `decision-gov-perf-01-11-performance-bundle-option-acceptance.md`
- Issue #19 §D GOV-PERF-01〜11
