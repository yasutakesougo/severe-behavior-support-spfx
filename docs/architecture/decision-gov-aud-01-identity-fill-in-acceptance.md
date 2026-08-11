# GOV-AUD-01 — Identity Fill-in Human Acceptance

この文書は、**GOV-AUD-01 Option C** で未確定だった identity 2 項目についての
**Human Acceptance evidence** である。

Decision packet:
[`decision-gov-aud-01-identity-fill-in-packet.md`](./decision-gov-aud-01-identity-fill-in-packet.md)

Parent（再 Decision しない）:
[`decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md`](./decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md)
（PR #257 MERGED）

Owner: Issue #19

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-AUD-01-IDENTITY-1
Status: Accepted / LOCKED（identity fill-in）
Human Acceptance date: 2026-08-11
Parent: GOV-AUD-01 Accepted / LOCKED / Option C（UNCHANGED）
Baseline tip: c5ed0ed1311ebf4cb0cdb869790084ae0aadd495
PR: （identity fill-in Packet / Acceptance / IR only）

meeting_or_minutes_system_identity:
- 支援計画アセスメント会議
- 支援計画モニタリング会議

reference_id_meaning:
会議種別 + 開催日 + 利用者ID

Does NOT mean:
  Option C の再 Decision
  アプリを業務正本へ昇格
  物理 ID 形式 / 区切り / 日付 format / GUID の採択
  外部 API / connector Implementation Start
  GOV-AUD-02 / HO-1 / HO-EDGE-1 の再定義

FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
Issue #19 Close: NOT AUTHORIZED
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## Human Acceptance

```text
Human Acceptance: Explicit identity fill-in on 2026-08-11
Decision-GOV-AUD-01-IDENTITY-1: Accepted / LOCKED
GOV-AUD-01 Option C: UNCHANGED / REDECIDE しない

meeting_or_minutes_system_identity:
- 支援計画アセスメント会議
- 支援計画モニタリング会議

reference_id_meaning:
会議種別 + 開催日 + 利用者ID
```

Human Primary Input（記録）:

```text
meeting_or_minutes_system_identity:
- 支援計画アセスメント会議
- 支援計画モニタリング会議

reference_id basis:
- 開催日
- 利用者ID

reference_id_meaning（衝突回避の識別構成）:
会議種別 + 開催日 + 利用者ID
```

```text
Agent recommendation: ACCEPT Human-mirrored values
Agent recommendation ≠ Implementation Start evidence
This document records the Human Decision only.
```

## Accepted 内容

```text
identity fill-in: COMPLETE / HUMAN INPUT MIRRORED

業務正本:
  支援計画アセスメント会議
  または
  支援計画モニタリング会議
  の会議・議事録

アプリ:
  業務正本を複製しない
  会議記録への参照 + Handoff 状態のみ保持

参照対象の識別（論理 contract）:
  会議種別 + 開催日 + 利用者ID
```

日本語正本:

```text
会議・議事録の識別:
  支援計画アセスメント会議
  支援計画モニタリング会議

参照 ID の意味:
  会議種別 + 開催日 + 利用者ID
```

意味:

- Option C（会議・議事録側が業務正本 / アプリは参照 ID + 状態）は **維持**。
- 2 つの会議種別は Human 一次情報のまま記録。
- `reference_id_meaning` は論理 identity であり、同日・同一利用者で両会議が開かれても
  会議種別を含めることで衝突を避ける識別構成である。
- 保存形式・区切り文字・日付フォーマット・採番・GUID・列名は **未決 / OUT**。

## Acceptance boundary

```text
NOT derived / MUST NOT start from this Acceptance alone:
  Option C の再評価・変更
  物理 ID 形式の発明・実装
  meeting record Schema / Handoff Schema 変更
  外部 API / Teams / OneNote / SharePoint List 保存先の発明
  GOV-AUD-02〜06 再 Decision
  next residual SELECT
  Implementation Start
  SharePoint / M365 / Entra / Deploy / real data
  Issue #19 Close
```

## 既存契約との関係

| 単位 | 本 Acceptance 後 |
|---|---|
| GOV-AUD-01 Option C | **UNCHANGED / LOCKED** |
| identity fields | **PROVIDED / LOCKED（本 Acceptance）** |
| Decision-HO-1 / HO-EDGE-1 | **UNCHANGED** |
| GOV-AUD-02 | **UNCHANGED** |
| 物理 ID / Schema / connector | **HOLD / NOT STARTED** |
| next residual | **NOT SELECTED** |

## Next

```text
Strict order for this recording PR:
  1. Independent Review
  2. Human Ready（HUMAN-ONLY）
  3. Human Merge（HUMAN-ONLY） → main mirror

After Merge:
  next residual SELECT = separate Human Decision only
  Implementation Start = NOT AUTHORIZED
  Issue #19 Close = NOT AUTHORIZED
```

Agent は本 Acceptance を理由に物理形式発明・実装・次 residual 自動 SELECT へ進まない。
