# 次 substantive unit 選定 — Human Selection

この文書は、DEC-008 提出・差戻しロール（Option C）**FINAL CONSISTENT**
（PR #147 MERGED）後の **次 substantive unit 選定** の Human Decision 記録である。

Decision packet: [`decision-next-substantive-unit-selection-packet.md`](./decision-next-substantive-unit-selection-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: NEXT_SUBSTANTIVE_UNIT_SELECTION
Status: SELECTED
Human Selection: Explicit Human Option B on 2026-08-09
Selected substantive unit:
  B — GOV-AUD-04（論理削除を許可するロール）
Scope:
  論理削除を許可するロール
OUT:
  GOV-AUD-05 物理削除方針
  FindingCode
  A-5
  Implementation Start
  SharePoint / Deploy / real data
Depends on:
  DEC-008 submit/return Accepted / LOCKED / Option C / FINAL CONSISTENT
  PR #147 MERGED（ce05cd0… / head 31e1df0…）
Prior CONSUMED:
  B（prior）— GOV-AUD-03
  C — Decision-OP-3
  E — DEC-008 提出・差戻しロール（Option C）
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

## Human Selection

```text
Selected: B
GOV-AUD-04（論理削除を許可するロール）
```

理由（Human）:

```text
GOV-AUD-03 が閉じたあとも Issue #19 の GOV-AUD 残件として明示されており、
GOV-AUD-05 の物理削除方針より先に
「誰が論理削除できるか」を分離して決める方が自然。
```

```text
Prior selection E / DEC-008 submit-return: CONSUMED（FINAL CONSISTENT / Option C）
Prior selection（GOV-AUD-03）: CONSUMED（Accepted / Option E）
Agent recommendation: NOT Human Selection evidence
```

## Next

```text
Acceptance: decision-gov-aud-04-logical-delete-role-acceptance.md（LOCKED / Option E）
GOV-AUD-05: DO NOT START from this unit
After PR #149 Merge: Next substantive unit NOT SELECTED（Human が新たに選ぶ）
FindingCode / A-5 / Implementation Start: HOLD
```
