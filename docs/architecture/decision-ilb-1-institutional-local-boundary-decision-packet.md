# Decision Packet — Decision-ILB-1 制度要件とローカルルールの境界

この文書は、**Decision-ILB-1**（制度要件とローカルルールの境界整理）の
**Human Decision Packet** である。

アプリ独自ルールを増やすための packet ではない。
残存 Decision の分類結果を本 packet だけで Accepted にしない。
FindingCode / A-5 / Implementation Start ではない。
Agent が制度根拠・日数・ロール・承認フローを発明しない。

残存 Decision 棚卸し（read-only）:
[`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ILB-1
Kind: Human Decision packet（boundary framing）
Status: CONSUMED（Human Policy Accepted / Option A）
Accepted 正本: decision-ilb-1-human-policy-acceptance.md
Selected via: next substantive unit F（2026-08-09）
main baseline: f97d072948ad3e68513193fc7e0e39c8026d7e50
GOV-AUD-04: FINAL CONSISTENT / Option E
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
Individual row classification Accepted: FORBIDDEN（still）
Agent recommendation（historical）: NONE
Human Selected: Option A
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-next-substantive-unit-selection.md`](./decision-next-substantive-unit-selection.md)
- [`decision-ilb-1-residual-decision-inventory.md`](./decision-ilb-1-residual-decision-inventory.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`decision-gov-rule-06-review-cadence-source-review.md`](./decision-gov-rule-06-review-cadence-source-review.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)

## 1. Purpose

```text
Goal:
  生活介護および強度行動障害支援に関する制度要件と、
  アプリ独自のローカルルールを分離する

Non-goals:
  便利そうな業務ルールの追加
  制度未確認事項の AI 補完
  GOV-AUD-05 / RD-3 等の自動 Accepted
  FindingCode / Implementation Start
```

## 2. Human Policy（Accepted / LOCKED）

正本: [`decision-ilb-1-human-policy-acceptance.md`](./decision-ilb-1-human-policy-acceptance.md)

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

```text
Status: ACCEPTED as classification / judgment policy
Does NOT accept: inventory provisional rows（GOV-AUD-05 / RD-3 等）
```

## 3. Classification axes（候補整理用・未 Accepted）

各ルール候補を、少なくとも次のいずれかへ仮置きできること（確定ではない）。

| Code | 分類 |
|---|---|
| **A** | 制度上必須 |
| **B** | 法人として Human Decision が必要 |
| **C** | 制度上固定されておらず、現場裁量として残す |
| **D** | application に埋め込まない |
| **E** | 根拠不足 / 要追加確認（NOT CONFIRMED） |

任意の別軸（記録可）:

| Axis | 意味 |
|---|---|
| Safety constraint | 安全性上、例外突破を許さないか |
| Billing / audit requirement | 算定・監査上必須か |

## 4. Decision rule（判定順序）

```text
制度上必須か？
  YES → application で担保する必要があるか？
         → HARD GATE / validation / audit evidence 等は別 Human Decision
  NO / NOT CONFIRMED
    → 法人として固定する必要があるか？
         YES → Human Decision（分類 B）
         NO  → application 非埋め込み / 現場裁量候補（C または D）

禁止:
  「制度上必須ではない」ことだけを理由に、自動的に現場裁量（C）へ落とすこと
  安全性・権限・データ完全性・監査要件との衝突を確認せずに C/D へ落とすこと
```

## 5. Evidence rules

```text
Prefer:
  repository 内の一次資料・既存制度 source review
  厚生労働省 / こども家庭庁 / 自治体通知等の一次情報

Do NOT treat as canonical alone:
  検索結果要約
  AI 要約
  民間サイト

If not confirmed in primary sources:
  mark NOT CONFIRMED / classification E
  STOP — do not invent
```

## 6. Human Decision（最初の1問のみ）

上流の境界方針だけを問う。個別ルールの分類 Accepted は後続とする。

```text
問:
  上記 Human Policy（基本方針 1〜6）を、
  残存 Decision / ルール候補を分類する正本方針として Accepted しますか？

A. はい — Human Policy 1〜6 を Decision-ILB-1 の分類正本として Accepted する
B. いいえ — 修正方針を Human が明示する
C. まだ決めない / 追加確認が必要

答え: A（2026-08-09）
Acceptance: decision-ilb-1-human-policy-acceptance.md
Human Policy 1–6: ACCEPTED（分類正本方針）
```

```text
Selecting A does NOT mean:
  GOV-AUD-05 / Decision-RD-3 / AS-EC-1 等が Accepted になった
  個別ルールの A/B/C/D/E 分類が Accepted になった
  Implementation Start
```

## 7. Explicit non-options / prohibitions

```text
FindingCode 値作成 / Finding catalog 再開
A-5
Implementation Start
SharePoint / SPFx / Entra / M365 / Deploy / real data
90日等の日数発明 / 期限発明
承認者・ロール・Finding・通知条件の発明
GOV-AUD-05 自動 Accepted
Decision-RD-3 自動 Accepted
既存 Accepted Decision の再 Decision
inventory provisional 行の一括 Accepted
```

## 8. Gate

```text
Decision-ILB-1 HUMAN_POLICY: CONSUMED / Accepted / Option A
Acceptance: decision-ilb-1-human-policy-acceptance.md
Inventory rows: provisional（NOT Accepted）
Next order:
  制度根拠確認 → 個別 Decision を一件ずつ判定
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```
