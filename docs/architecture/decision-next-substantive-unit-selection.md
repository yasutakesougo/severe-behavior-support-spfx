# 次 substantive unit 選定 — Human Selection

この文書は、GOV-AUD-04（Option E）**FINAL CONSISTENT**（PR #149 / #150）後の
**次 substantive unit 選定** の Human Decision 記録である。

Decision packet: [`decision-next-substantive-unit-selection-packet.md`](./decision-next-substantive-unit-selection-packet.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: NEXT_SUBSTANTIVE_UNIT_SELECTION
Status: SELECTED
Human Selection: Explicit Human Option F on 2026-08-09
Selected substantive unit:
  F — 制度要件とローカルルールの境界整理
  Decision ID: Decision-ILB-1
Scope:
  生活介護・強度行動障害支援について、
  制度上必須のルールと、
  制度が要求していない application 独自ルールを分離する
Purpose:
  残存 Decision を
  「アプリとして便利そうか」ではなく、
  「制度上必要か」
  「法人として別途 Human Decision が必要か」
  「現場裁量として残せるか」
  の順で判断できる状態にする
OUT:
  FindingCode / A-5 / Implementation Start
  SharePoint / SPFx / Entra / M365 / Deploy / real data
  日数・期限・ロール・承認者・Finding・通知条件の発明
  GOV-AUD-05 / Decision-RD-3 の自動 Accepted
  既存 Accepted Decision の再 Decision
Depends on:
  GOV-AUD-04 Accepted / LOCKED / Option E / FINAL CONSISTENT
  PR #149 MERGED（cb14c13…）/ PR #150 MERGED（f97d072…）
Prior CONSUMED:
  B — GOV-AUD-04（Accepted / Option E）
  E — DEC-008 提出・差戻し（Option C）
  C — Decision-OP-3
  prior-B — GOV-AUD-03
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
```

## Human Selection

```text
Selected: F
制度要件とローカルルールの境界整理（Decision-ILB-1）
```

理由（Human / Work Order）:

```text
アプリ独自の業務ルールを増やすことが目的ではない。
制度上決められていない事項について、
AI が値・期限・ロール・承認フロー等を補完してはならない。
残存 Decision を制度必須 / 法人 Decision / 現場裁量の順で見られるようにする。
```

```text
Prior selection B / GOV-AUD-04: CONSUMED（FINAL CONSISTENT / Option E）
Agent auto-select: FORBIDDEN
Agent recommendation: NOT Human Selection evidence
```

## Next

```text
Human Policy Acceptance: decision-ilb-1-human-policy-acceptance.md（LOCKED / Option A）
Residual inventory rows: provisional（NOT Accepted）
Next order:
  制度根拠確認 → 個別 Decision を一件ずつ判定
FindingCode / A-5 / Implementation Start: HOLD
GOV-AUD-05 / RD-3 auto-Accepted: FORBIDDEN
```
