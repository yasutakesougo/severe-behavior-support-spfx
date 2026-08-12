# GOV-PERF-01〜11 — 性能目標・測定条件 residual bundle Human Acceptance（Options + HOLD）

この文書は、**GOV-PERF-01〜11** についての
**Option / HOLD Human Acceptance evidence（bundle）** である。

Decision packet:
[`decision-gov-perf-01-11-performance-bundle-decision-packet.md`](./decision-gov-perf-01-11-performance-bundle-decision-packet.md)

Unit Selection:
[`decision-gov-perf-01-11-performance-bundle-selection.md`](./decision-gov-perf-01-11-performance-bundle-selection.md)
（同一 Draft PR；Decision-GOV-PERF-01-11-BUNDLE-1）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-PERF-01-11-OPTIONS-1
Status: Accepted / LOCKED（01A/03C/04C/05D/10A/11D）；HOLD（02/06/07/08/09）
Human Acceptance: Explicit Human GOV-PERF-01〜11 Options/HOLD on 2026-08-12
Baseline tip: f8202e6eb3731652a76b8af818d32c31b8ee9a5f
PR: #285（Selection / Option+HOLD Acceptance / Packet sync / IR）

Accepted / HOLD:
  GOV-PERF-01 = ACCEPTED / LOCKED / Option A
  GOV-PERF-02 = SELECTED / LOCKED / HOLD
  GOV-PERF-03 = ACCEPTED / LOCKED / Option C
  GOV-PERF-04 = ACCEPTED / LOCKED / Option C
  GOV-PERF-05 = ACCEPTED / LOCKED / Option D
  GOV-PERF-06 = SELECTED / LOCKED / HOLD
  GOV-PERF-07 = SELECTED / LOCKED / HOLD
  GOV-PERF-08 = SELECTED / LOCKED / HOLD
  GOV-PERF-09 = SELECTED / LOCKED / HOLD
  GOV-PERF-10 = ACCEPTED / LOCKED / Option A
  GOV-PERF-11 = ACCEPTED / LOCKED / Option D

Does NOT mean:
  HOLD 具体値発明
  性能試験実行
  max 超過 = 自動 FAIL ルール発明
  PERF-09 recommendation の Acceptance 昇格
  GOV-RULE-01 / 04 HOLD 解除
  SharePoint / M365 / Entra / UI / adapter / Implementation Start
  Issue #19 Close / next residual auto-select / Production GO

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD / NOT AUTHORIZED
Performance test execution: HOLD / NOT AUTHORIZED
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit GOV-PERF-01〜11 Options/HOLD on 2026-08-12
Decision-GOV-PERF-01-11-OPTIONS-1: Accepted / LOCKED（bundle Options+HOLD）
```

```text
Agent recommendation = NONE（≠ Human Acceptance evidence）
Issue #19 design tips / recommendations ≠ Binding
Concrete HOLD values MUST NOT be invented from tips or silence.
```

## Accepted / HOLD 内容（単位別）

### GOV-PERF-01 — Option A

```text
GOV-PERF-01: Accepted / LOCKED / Option A
通常規模の合成利用者数 = 30件
```

意味:

- **30件は試行版の通常規模 synthetic test baseline**。
- **本番利用者数の上限ではない**。
- Option B（50）/ C（100）/ D（その他）は採択しない。

### GOV-PERF-02 — HOLD / VALUE NOT DETERMINED

```text
GOV-PERF-02: SELECTED / LOCKED / HOLD
合成記録量: VALUE NOT DETERMINED

未確定:
  利用者1人あたりABC記録件数
  観察記録件数
  支援計画の版数
  見直し履歴件数
  保持年数相当
```

意味:

- unit は SELECTED だが、具体値は確定しない。
- Agent は件数・年数を発明しない。
- 実利用想定または測定設計の evidence 確認後、**別 Human Decision** で解除する。

### GOV-PERF-03 — Option C

```text
GOV-PERF-03: Accepted / LOCKED / Option C
正式受入のキャッシュ条件 = cold と warm を別々に判定
```

意味:

- cold / warm の結果を混合した単一値で受入判定しない。
- Option A（coldのみ）/ B（warmのみ）/ D（その他）は採択しない。

### GOV-PERF-04 — Option C

```text
GOV-PERF-04: Accepted / LOCKED / Option C
測定回数 = 20回以上
```

意味:

- 正式受入の測定回数は 20回以上とする。
- **実際の測定自体をこの Decision で開始するものではない**。
- Option A（5）/ B（10）/ D（その他）は採択しない。

### GOV-PERF-05 — Option D

```text
GOV-PERF-05: Accepted / LOCKED / Option D
合否に使う統計値 = 中央値、p95、最大値
```

意味:

- median = 通常時の代表値。
- p95 = 遅い側の実用性能確認。
- max = 外れた極端な遅延の可視化。
- **この Decision だけから max 超過 = 自動 FAIL というルールを発明しない**。
- 具体的な合否境界は GOV-PERF-06 と整合して別途確定する。
- Option A/B/C/E は採択しない。

### GOV-PERF-06 — HOLD / VALUE NOT DETERMINED

```text
GOV-PERF-06: SELECTED / LOCKED / HOLD
3秒・5秒目標の適用条件: VALUE NOT DETERMINED

未確定:
  利用者一覧 3秒以内 — cold中央値 / cold p95 / warm中央値 / warm p95
  ダッシュボード 5秒以内 — cold中央値 / cold p95 / warm中央値 / warm p95
```

意味:

- unit は SELECTED だが、適用条件は確定しない。
- 「全項目必須」「中央値だけ必須」等を推測しない。
- PERF-03 / 05 の Accepted 内容と整合させた **別 Human Decision** で解除する。

### GOV-PERF-07 — HOLD / VALUE NOT DETERMINED

```text
GOV-PERF-07: SELECTED / LOCKED / HOLD
基準端末: VALUE NOT DETERMINED

未確定:
  業務PC / 業務タブレット / CPU / メモリ / 画面幅 / OS
```

意味:

- 実際の試験対象端末を read-only observation してから決定する。
- Agent は機種・CPU・メモリ・OS を発明しない。
- 端末購入・設定変更はこの Decision に含まない。

### GOV-PERF-08 — HOLD / VALUE NOT DETERMINED

```text
GOV-PERF-08: SELECTED / LOCKED / HOLD
対象ブラウザ: VALUE NOT DETERMINED

未確定:
  ブラウザ名
  最低バージョンまたは更新方針
```

意味:

- 実際の管理端末・Microsoft 365運用条件を確認してから決定する。
- Agent は Edge / Chrome 等を自動採択しない。

### GOV-PERF-09 — HOLD / VALUE NOT DETERMINED

```text
GOV-PERF-09: SELECTED / LOCKED / HOLD
基準ネットワーク: VALUE NOT DETERMINED

未確定:
  接続場所 / 回線種別 / レイテンシの扱い / 一時障害の扱い
```

意味:

- Issue #19 の既存 design recommendation
  （一時障害は通常性能から分離し、可用性として別記録する）は
  **recommendation のまま**とし、本 bundle で正式 Acceptance に昇格させない。
- Agent はネットワーク条件・帯域・latency 数値を発明しない。

### GOV-PERF-10 — Option A

```text
GOV-PERF-10: Accepted / LOCKED / Option A
拡張・ストレス条件 =
  P1通常規模だけを試行版の必須条件とする
```

意味:

- 3か月匿名化試行版の必須性能受入 = P1通常規模。
- P2 / P3 を禁止するものではない。
- P2 / P3 を本番前ゲートから永久に除外する決定ではない。
- Production GO を与えるものではない。
- P2 / P3 の正式な本番前要求は必要時に別 Decision。

### GOV-PERF-11 — Option D

```text
GOV-PERF-11: Accepted / LOCKED / Option D
目標超過時の判断者 =
  開発担当が分析し、業務責任者・法人管理者が延期または継続を判断する
```

意味:

- 開発担当単独では性能目標超過を受容できない。
- Option A/B/C/E は採択しない。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  HOLD（02/06/07/08/09）具体値発明
  性能試験実行 / synthetic data generation（既存認可超過）
  max=自動 FAIL / 合否マトリクス発明
  PERF-09 recommendation Acceptance 昇格
  端末購入・設定変更 / ブラウザ自動採択 / ネットワーク値発明
  GOV-RULE-01 / 04 HOLD 解除
  SharePoint / M365 / Entra / UI / adapter
  FindingCode / A-5
  Issue #19 Close
  next residual auto-select
  Implementation Start / Deploy / Production
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| Decision-GOV-PERF-01-11-BUNDLE-1 | **UNCHANGED**（unit SELECTED / LOCKED；同一 PR） |
| post-retention deletion Option C | **UNCHANGED** |
| GOV-RULE-01 / 04 HOLD | **UNCHANGED**（OUT） |
| GOV-STAFF / GOV-AUD Accepted | **UNCHANGED** |
| Issue #19 PERF tips | **NON-BINDING**（Human Accepted のみ Binding） |
| 性能試験 / Implementation | **HOLD / FORBIDDEN** |

## Next

```text
GOV-PERF-01〜11 bundle: MERGED（PR #285）
  Accepted: 01A / 03C / 04C / 05D / 10A / 11D
  HOLD: 02 / 06 / 07 / 08 / 09（UNCHANGED）
next residual: Human SELECTED GOV-PERF HOLD Resolution Bundle（PR pending）
  正本: decision-gov-perf-hold-resolution-bundle-selection.md
  HOLD解除 Acceptance: NOT PERFORMED
GOV-RULE-01 / 04 HOLD 解除: separate
Issue #19 Close: NOT AUTHORIZED
Implementation Start / performance test: NOT AUTHORIZED
```

Agent は本 Acceptance を理由に HOLD 値発明・性能試験・tenant mutation・
次 residual 自動 SELECT へ進まない。
