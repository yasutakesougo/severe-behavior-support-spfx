# 次 substantive unit 選定 — Human Selection

この文書は、DEC-008 正本化 **CONSISTENT** / GOV-AUD-03 Accepted 後の
**次 substantive unit 選定** の Human Decision 記録である。

Decision packet: [`decision-next-substantive-unit-selection-packet.md`](./decision-next-substantive-unit-selection-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: NEXT_SUBSTANTIVE_UNIT_SELECTION
Status: SELECTED
Human Selection: Explicit Human Option C on 2026-08-09
Selected substantive unit:
  C — Decision-OP-3（観察期間 Schema）
Scope:
  観察期間をデータとしてどう表現するか
  （既存資料の未決定点抽出 → Human Decision）
日数・期限の発明: FORBIDDEN
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
```

## Human Selection

```text
Selected: C
Decision-OP-3（観察期間 Schema）
```

理由（Human）:

```text
支援計画に沿って支援手順記録を経過観察し、
モニタリングで更新する業務ルールまで Human 一次情報が固まっている。
次は「観察期間をデータとしてどう表現するか」を閉じると、
業務ルールから contract への接続が進む。
期間の日数や期限は AI 側で発明しない。
まず OP-3 の既存資料から未決定点だけを抽出して Human Decision にする。
```

```text
Prior selection B / GOV-AUD-03: CONSUMED（Accepted / Option E）
Agent recommendation: NOT Human Selection evidence
```

## Next

```text
Open-points: decision-op-3-open-points-extraction.md
Decision packet: decision-op-3-observation-period-schema-decision-packet.md
Implementation Start: HOLD
```
