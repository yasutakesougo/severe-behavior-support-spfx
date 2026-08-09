# Decision-ILB-1 — Human Policy Acceptance（制度要件 / ローカルルール境界方針）

この文書は、**Decision-ILB-1** のうち
**残存 Decision を分類・判断する上位 Human Policy（1〜6）** についての
**Human Acceptance 正本（LOCKED）** である。

Decision packet: [`decision-ilb-1-institutional-local-boundary-decision-packet.md`](./decision-ilb-1-institutional-local-boundary-decision-packet.md)

Residual inventory（provisional）: [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ILB-1 / HUMAN_POLICY
Status: Accepted / LOCKED
Human Acceptance: Explicit Human Option A on 2026-08-09
Selected Option: A

LOCKED:

Human Policy 1–6: ACCEPTED
用途:
  残存 Decision を分類・判断する際の正本方針
基本境界:
  制度上必須 → 制度要件を優先
  制度が固定していない → application 独自ルールを原則作らない
  法人として固定が必要 → 別 Human Decision
  現場裁量が可能 → イレギュラー対応の余地を残す
  安全・算定・監査要件 → 例外による突破を許可しない
  根拠未確認 → NOT CONFIRMED のまま停止
分類 A–E:
  判断フレームとして採用
  ただし provisional な個別分類結果までは自動 Accepted しない
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD

Implementation auto-start: FORBIDDEN
GOV-AUD-05 / Decision-RD-3 auto-Accepted: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance（固定結論）

```text
Human Acceptance: Explicit Human Option A on 2026-08-09
Decision-ILB-1 HUMAN_POLICY: Accepted / LOCKED
Selected Option: A

Human Policy 1–6: ACCEPTED
用途: 残存 Decision を分類・判断する正本方針
```

理由（Human）:

```text
この Human Policy 1〜6 は、個別の業務ルールそのものではなく、
残存 Decision をどう判定するかの上位方針として妥当。
特に、GOV-AUD-05 や RD-3 の provisional 判定まで一括承認しないことがポイント。
上位方針だけ Accepted → 制度根拠を確認 → 個別 Decision を一件ずつ判定、の順序が適切。
```

```text
Agent recommendation: NOT Human Acceptance evidence
This document records the Human Decision only.
```

## Accepted Human Policy（正本）

```text
1. 生活介護事業および強度行動障害支援の制度要件に従う。
2. 制度上必要な要件は、必要に応じて application contract /
   HARD GATE / 監査証跡等へ反映する。
3. 制度が定めていない事項について、アプリ独自のローカルルールを
   原則として作らない。
4. 現場で発生するイレギュラーに対応できる融通性を残す。
5. ただし、安全性、算定要件、法令・制度要件、監査上必須の事項を
   「例外対応」の名目で突破可能にしてはならない。
6. 制度根拠が確認できない期限、日数、役職、承認者、状態、
   FindingCode、通知条件等を発明しない。
```

## Classification frame（採用・個別結果は未 Accepted）

| Code | Meaning | This Acceptance |
|---|---|---|
| A | 制度上必須 | フレームとして採用 |
| B | 法人として Human Decision が必要 | フレームとして採用 |
| C | 制度上固定されず現場裁量 | フレームとして採用 |
| D | application に埋め込まない | フレームとして採用 |
| E | 根拠不足 / 要追加確認（NOT CONFIRMED） | フレームとして採用 |

```text
Provisional inventory rows（GOV-AUD-05 / RD-3 等）:
  NOT Accepted by this document
  Must be judged one Decision at a time after institutional evidence check
```

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  GOV-AUD-05 Accepted
  Decision-RD-3 Accepted
  AS-EC-1 / DEC-009 / DEC-012 / DEC-015 の一括判定
  inventory 各行の A/B/C/D/E を Accepted に硬化
  FindingCode 作成
  A-5
  Implementation Start
  日数・期限・ロール・承認・通知条件の発明
  SharePoint / M365 / Deploy / real data
```

順序（維持）:

```text
1. 上位方針 Accepted（本文書）
2. 制度根拠を確認
3. 個別 Decision を一件ずつ判定
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| GOV-AUD-04 / 03 / DEC-008 / OP-3 / GOV-RULE-05〜08 | **UNCHANGED**（再 Decision しない） |
| GOV-AUD-05 / RD-3 | **NOT auto-Accepted** |
| inventory provisional 分類 | **provisional のまま** |
| FindingCode / A-5 / Implementation | HOLD |

## Next

```text
Decision-ILB-1 Human Policy: Accepted / LOCKED
Next:
  制度根拠確認のうえ、個別 Decision を一件ずつ Human 選定・判定
  （最初の個別 unit は別 Human Selection）
FindingCode / A-5 / Implementation: HOLD
```
