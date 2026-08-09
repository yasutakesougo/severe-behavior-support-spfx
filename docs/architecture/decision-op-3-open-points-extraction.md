# Decision-OP-3 — 既存資料からの未決定点抽出

この文書は、**Decision-OP-3**（観察期間 Schema / フィールド / 制度日数 / 開放終端）について、
既存正本から **未決定点だけ** を抽出した調査結果である。

値（日数・期限）の発明ではない。
Human Acceptance ではない。
Implementation Start ではない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit ID: Decision-OP-3-OPEN-POINTS
Kind: open-points extraction / source inventory
Status: CONSUMED（Decision-OP-3 Accepted / LOCKED / Option A）
main baseline: f7448d245d5744940c0b0f921b5aca57b18cb32d
Membership pure function: DONE（PR #79 / #80 / observation-period.md）
Decision-OP-1 / OP-2: Accepted（ownership 表）
Decision-OP-3: Accepted / LOCKED / Option A
  U1: fields ADOPTED（periodFrom / periodTo REQUIRED）
  U2: ISO DateTime both required
  U3: open-end NOT ADOPTED
  U4: 制度日数・既定観察窓 domain 埋め込み NOT ADOPTED
  evaluateObservationPeriodMembership: UNCHANGED
Acceptance: decision-op-3-observation-period-schema-acceptance.md
Consistency: decision-op-3-canonicalization-consistency-check.md
duration_days invention: FORBIDDEN
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Next substantive unit: NOT SELECTED
```


関連正本:

- [`observation-period.md`](./observation-period.md)
- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)
- [`implementation-entry-decision-reaudit.md`](./implementation-entry-decision-reaudit.md)
- Decision packet: [`decision-op-3-observation-period-schema-decision-packet.md`](./decision-op-3-observation-period-schema-decision-packet.md)

## 1. すでに閉じているもの（再決定しない）

| 項目 | 状態 | 正本 |
|---|---|---|
| メンバシップ純関数 | DONE | `evaluateObservationPeriodMembership` / PR #79/#80 |
| 入力境界 | caller-supplied `periodFrom` / `periodTo` / `asOf` | `observation-period.md` |
| 暦日 | `Asia/Tokyo` 閉区間 | 同上 / Active uniqueness 共用 |
| 制度日数を domain に埋め込まない | OP-2 Accepted 姿勢 | backlog / ownership |
| 所有（メンバシップ） | Issue #24 | OP-1 Accepted |
| GOV-RULE-05〜08 | Accepted（08 NOT ADOPTED） | review contracts |
| 見直し「3ヶ月に1回程度」 | practice cadence（観察期間 Schema とは別） | GOV-RULE-06 |

```text
UNCHANGED / DO NOT REOPEN in OP-3:
  evaluateObservationPeriodMembership の現行契約を壊すこと
  90日 / overdue の再導入
  FindingCode / A-5 / Implementation Start
```

## 2. 未決定点一覧（OP-3 表面）

既存 docs が明示的に HOLD / OUT / 別 Decision としている点だけを列挙する。

| # | 未決定点 | 既存の言い方 | 出典 |
|---|---|---|---|
| U1 | SupportPlan へ観察期間フィールドを追加するか | SupportPlan field addition: OUT / Decision-OP-3 | `observation-period.md` |
| U2 | 追加する場合の論理フィールド形 | 現行純関数入力は `periodFrom` / `periodTo`（ISO DateTime・`periodTo` 必須） | 同上 |
| U3 | `periodTo` 開放終端を許すか | 本単位では許可しない。必要なら別 Decision | 同上 / post-rsv |
| U4 | 制度上の観察日数・既定窓 | 埋め込まない / HOLD。Agent は日数を発明しない | 同上 / backlog |
| U5 | 期間の導出（例: Active.effectiveFrom + N日） | OUT / 呼び出し側または別 Decision | `observation-period.md` |
| U6 | SharePoint 列 / DEC-6 mapping | Schema 論理と分離。adapter は別 | foundation / DEC-6 |
| U7 | Schema 所有（#24 vs #26） | メンバシップ所有は #24。Schema は #26 関連と backlog 記載 | backlog OP-3 行 |

## 3. 混ぜてはいけない隣接単位

| 隣接 | 関係 |
|---|---|
| GOV-RULE-06（3ヶ月に1回程度） | 見直し周期。観察期間フィールドの日数ではない |
| Decision-RD-3 | 見直し接近窓。OP-3 と同時に決めない |
| RSV `effectiveTo` 開放終端 | 別 HOLD（observation `periodTo` と一括しない） |
| Observation 本文（Issue #25） | 記録本体。期間 Schema と混ぜない |
| DEC-008 / GOV-AUD-03 | ロール。OP-3 と混ぜない |

## 4. Human Decision に渡す最小セット

次だけを packet で問う（日数 N は Agent が埋めない）。

1. **U1** SupportPlan に観察期間の論理フィールドを持たせるか
2. **U2/U3** 持たせる場合、`periodTo` は必須のままか / 開放終端を許すか
3. **U4** 制度日数・既定窓を domain / Schema に採るか → 既定は **採らない**（OP-2 維持）。採るなら Human が日数と根拠を明示
4. **U5/U6/U7** は本 packet では OUT または注記のみ（導出・SharePoint・所有の詳細は後続可）

## 5. Explicit non-invention

```text
FORBIDDEN for Agent:
  観察期間 = 30日 / 90日 / 3ヶ月 等の日数発明
  Active.effectiveFrom + N の N 発明
  periodTo 開放終端を黙って採択
  evaluateObservationPeriodMembership の破壊的変更
  SharePoint 列の先行実装
  Implementation Start
```

## 6. Gate

```text
Open-points extraction: READY
Next: decision-op-3-observation-period-schema-decision-packet.md
Implementation Start: HOLD
```
