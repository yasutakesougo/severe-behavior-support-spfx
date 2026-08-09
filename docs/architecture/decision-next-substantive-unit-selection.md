# 次 substantive unit 選定 — Human Selection

この文書は、DEC-008 正本化 **CONSISTENT** 後の
**次 substantive unit 選定** の Human Decision 記録である。

Decision packet: [`decision-next-substantive-unit-selection-packet.md`](./decision-next-substantive-unit-selection-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: NEXT_SUBSTANTIVE_UNIT_SELECTION
Status: SELECTED
Human Selection: Explicit Human Option B on 2026-08-09
Selected substantive unit:
  B — GOV-AUD-03 / Issue #19 最小単位
Scope:
  判定スナップショット訂正の承認者
FindingCode: HOLD / DO NOT CREATE
A-5: HOLD
Implementation Start: HOLD
```

## Human Selection

```text
Selected: B
GOV-AUD-03 / Issue #19 最小単位
Scope: 判定スナップショット訂正の承認者
```

理由（Human）:

```text
DEC-009 はすでに保存タイミングが Accepted 済みであり、
A（DEC-009 再選定）の優先度は低い。
次に進めるなら、AssessmentSnapshot の訂正時に
誰が承認するかという未決定の責任境界を 1 件だけ閉じる方が自然。
```

```text
Agent recommendation: NOT Human Selection evidence
```

## Notes

```text
DEC-009:
  Human-attested Accepted（保存タイミング）
  docs mirror 上の「未」表記同期は本選定の対象外（別 sync 可）
FindingCode / A-5 / Implementation: HOLD（変更しない）
```

## Next

```text
Next unit: GOV-AUD-03 Human Decision packet
  → decision-gov-aud-03-snapshot-correction-approver-decision-packet.md
Implementation Start: HOLD
```
