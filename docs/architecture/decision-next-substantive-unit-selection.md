# 次 substantive unit 選定 — Human Selection

この文書は、Decision-OP-3 正本化 **FINAL CONSISTENT**（PR #146 MERGED）後の
**次 substantive unit 選定** の Human Decision 記録である。

Decision packet: [`decision-next-substantive-unit-selection-packet.md`](./decision-next-substantive-unit-selection-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: NEXT_SUBSTANTIVE_UNIT_SELECTION
Status: SELECTED
Human Selection: Explicit Human Option E on 2026-08-09
Selected substantive unit:
  E — DEC-008 残面（提出・差戻しロールのみ）
Scope:
  支援計画シートの提出ロール
  支援計画シートの差戻しロール
OUT:
  制度上の作成者の再決定
  独立最終承認者の再導入
  FindingCode
  A-5
  Implementation Start
Depends on:
  Decision-OP-3 Accepted / LOCKED / FINAL CONSISTENT
  PR #146 MERGED（42b251b… / head 974d083…）
Prior CONSUMED:
  B — GOV-AUD-03
  C — Decision-OP-3
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

## Human Selection

```text
Selected: E
DEC-008 残面（提出・差戻しロールのみ）
```

理由（Human）:

```text
packet の A DEC-009 は既存正本ではすでに Accepted 済みなので、
再 Decision に戻さない方がよい。
また、直前に GOV-AUD-03 を閉じたばかりなので、
次は支援計画の実際の業務フローに残る
「誰が提出し、誰が差し戻せるか」だけを狭く決めるのが自然。
```

```text
Prior selection C / Decision-OP-3: CONSUMED（FINAL CONSISTENT）
Prior selection B / GOV-AUD-03: CONSUMED（Accepted / Option E）
Option A / DEC-009: OUT for re-decision（Human: already Accepted）
Agent recommendation: NOT Human Selection evidence
```

## Next

```text
Acceptance: decision-dec-008-submit-return-roles-acceptance.md（LOCKED / Option C）
Consistency: DOCS CONSISTENT / MERGE PENDING
Path: Independent Review → Human Merge Decision（PR #147）
After merge: Next substantive unit NOT SELECTED（Human が新たに選ぶ）
FindingCode / A-5 / Implementation Start: HOLD
```
