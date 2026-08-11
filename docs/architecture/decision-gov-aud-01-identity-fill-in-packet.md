# Decision Packet — GOV-AUD-01 Identity Fill-in

この文書は、**GOV-AUD-01 Option C**（Accepted / LOCKED）で未確定だった
identity 2 項目を、Human 一次情報に基づき具体化する **Decision Packet** である。

GOV-AUD-01 Option C の再 Decision ではない。
GOV-AUD-02 / HO-1 / HO-EDGE-1 の再定義ではない。
実装・物理 ID 形式の採択ではない。

Parent Acceptance:
[`decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md`](./decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md)
（PR #257 MERGED）

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-GOV-AUD-01-IDENTITY-1
Kind: Human Decision packet（identity fill-in only）
Status: CONSUMED（Human Acceptance）
Accepted 正本: decision-gov-aud-01-identity-fill-in-acceptance.md
IR: decision-gov-aud-01-identity-fill-in-independent-review.md
Owner: Issue #19
Parent: GOV-AUD-01 Accepted / LOCKED / Option C（PR #257）
Baseline tip: c5ed0ed1311ebf4cb0cdb869790084ae0aadd495
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
Implementation auto-start: FORBIDDEN
next residual auto-select: FORBIDDEN
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

上位入口:

- [`decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md`](./decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md)
- [`decision-gov-aud-01-handoff-canonical-source-decision-packet.md`](./decision-gov-aud-01-handoff-canonical-source-decision-packet.md)
- [`decision-issue-19-residual-governance-selection.md`](./decision-issue-19-residual-governance-selection.md)
- [`handoff-transition-role-policy.md`](./handoff-transition-role-policy.md)（GOV-AUD-02；混ぜない）

## 1. Current canonical state

```text
GOV-AUD-01: Accepted / LOCKED / Option C
  業務正本 = 既存会議・議事録側
  アプリ = 参照 ID + Handoff 状態のみ
identity（before this packet）:
  meeting_or_minutes_system_identity = NOT YET PROVIDED
  reference_id_meaning = NOT YET PROVIDED
GOV-AUD-02 / HO-1 / HO-EDGE-1: UNCHANGED
No superseding GOV-AUD-01 Decision after PR #257 on main@c5ed0ed…
```

問い（本 packet）:

> Option C を変えずに、業務正本となる会議識別と、
> アプリ参照 ID が指す意味を Human 一次情報で埋める。

## 2. 判断単位の分離（混ぜない）

| ID | 決める内容 | 本 packet |
|---|---|---|
| **Decision-GOV-AUD-01-IDENTITY-1** | identity 2 項目の Human fill-in | **本 packet** |
| GOV-AUD-01 Option C | 正本モデル（会議 SoT / アプリは ID+状態） | **REDECIDE しない** |
| GOV-AUD-02 | 状態変更ロール | OUT / UNCHANGED |
| HO-1 / HO-EDGE-1 | 遷移所有・許可辺 | OUT / UNCHANGED |
| 物理保存形式 / 区切り / 日付 format / GUID 等 | 実装境界 | **OUT** |
| next residual | 他 GOV 残件 | OUT / NOT SELECTED |

```text
identity fill-in ≠ Option C の再採択
identity fill-in ≠ アプリを業務正本へ昇格
identity fill-in ≠ ID 物理形式の決定
identity fill-in ≠ 外部 API / connector Implementation Start
```

## 3. Human Primary Input（mirror；発明なし）

```text
meeting_or_minutes_system_identity:
- 支援計画アセスメント会議
- 支援計画モニタリング会議

reference_id basis（Human）:
- 開催日
- 利用者ID

reference_id_meaning（採用・衝突回避のための識別構成）:
会議種別 + 開催日 + 利用者ID
```

注:

```text
reference_id_meaning の「会議種別 + 開催日 + 利用者ID」は、
Human が指定した 2 会議種別を、同日・同一利用者でも一意に識別するための
論理 identity contract である。
新しい業務正本の発明ではない。
Option C の意味変更ではない。
```

## 4. Proposed LOCKED values

```text
meeting_or_minutes_system_identity:
- 支援計画アセスメント会議
- 支援計画モニタリング会議

reference_id_meaning:
会議種別 + 開催日 + 利用者ID
```

意味:

```text
業務正本:
  支援計画アセスメント会議
  または
  支援計画モニタリング会議
  の会議・議事録

アプリ側:
  業務正本そのものを複製しない
  会議記録への参照 + Handoff 状態を保持

参照対象の識別（論理）:
  会議種別 + 開催日 + 利用者ID
```

## 5. Explicit OUT（今回決めない）

```text
実際の保存形式
文字列フォーマット
区切り文字
日付フォーマット
ハッシュ方式
採番方式
SharePoint 内部列名
DB キー
GUID
外部システム ID
会議 URL / Teams / OneNote / List 保存先
meeting record Schema 実装
Handoff Schema 変更
```

## 6. Explicit non-options

```text
GOV-AUD-01 Option C の再 Decision
GOV-AUD-02〜06 の再 Decision
新しい会議名称の発明（上記 2 種以外）
新しい業務フローの発明
next residual 自動 SELECT
Implementation Start / SharePoint / M365 / Deploy
```

## 7. Agent recommendation

```text
Recommended: ACCEPT Human-mirrored identity values as written
Reason:
  values are Human primary input
  collision-safe composition uses only Human-specified components
  no physical format invention
This recommendation ≠ Implementation Start
```

## 8. Human Decision

```text
問:
  Option C を維持したまま、identity 2 項目を上記 Human 値で埋めるか？

答え: YES / Accepted（2026-08-11）
Acceptance: decision-gov-aud-01-identity-fill-in-acceptance.md
```

## Reference

- Acceptance: `decision-gov-aud-01-identity-fill-in-acceptance.md`
- IR: `decision-gov-aud-01-identity-fill-in-independent-review.md`
- Parent Option C: `decision-gov-aud-01-handoff-canonical-source-option-c-acceptance.md`
