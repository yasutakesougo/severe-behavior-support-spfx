# SBS-STATE-DISTINCTION-CORRECTION-1 — Correction Scope Definition

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-STATE-DISTINCTION-CORRECTION-1
kind: correction scope definition
status: COMPLETE / AWAITING FRESH INDEPENDENT SCOPE REVIEW
basis: UI-REVIEW-8-V1 READ ONLY Pilot (Finding = 0件と「実施できなかった」を混同するリスク)
Primary Category: States
Secondary Category: Information Units
Correction Priority: 1 / Safety / 誤判断リスク
Safety / Misjudgment Risk: YES
One-Correction Check: YES
Implementation Authority: NONE
Human Implementation Start: NOT CONSUMED
Ready / Merge / Deploy: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Definition Mutation: NONE after Scope Lock
Repository Mutation (product / schema / persistence): NONE at this gate
```

This document records the Correction Scope Definition only.

It does not authorize Product / SPFx / domain / schema / persistence mutation.

Creating or reviewing this Definition does not create Implementation Authority.

---

## 1. Purpose

既存 Human Review finding で確認された、

```text
0件 と 実施できなかった を利用者が同じ状態として解釈する可能性
```

を解消する。

本 Correction の目的は、既存の業務状態を UI 上で明確に識別できるようにすることである。

新しい業務状態を定義することは目的としない。

## 2. Basis

UI-REVIEW-8-V1 READ ONLY Pilot で、対象 finding は次のように分類された。

| Field | Value |
|---|---|
| Finding | 0件と「実施できなかった」を混同するリスクがある |
| Primary Category | States |
| Secondary Category | Information Units |
| Correction Priority | 1 / Safety / 誤判断リスク |
| Safety / Misjudgment Risk | YES |
| One-Correction Check | YES |
| Implementation Authority | NONE |

## 3. Problem

現在の UI では、少なくとも Human Review 上、

- 対象となる記録が 0件である状態
- 支援等を実施できなかった状態

を区別して理解できない可能性がある。

その結果、「実施できなかった」という業務上意味のある事実を、単なる 0件として判断する可能性がある。

## 4. Correction Objective

UI 上で、

```text
0件
```

と

```text
実施できなかった
```

を異なる意味を持つ状態として識別できるようにする。

利用者が内部データ構造や実装仕様を理解しなくても、表示された状態の違いを判断できることを目標とする。

## 5. In Scope

本 Correction の Scope は以下に限定する。

1. 0件 を示す既存 UI 表現
2. 実施できなかった を示す既存 UI 表現
3. 両者を誤認しないために必要な状態表示
4. 必要最小限のラベル、補助説明、状態表現
5. 対象 finding を検証するために必要なテスト

## 6. Out of Scope

以下は本 Correction では変更しない。

- 新しい業務状態の追加
- 既存業務状態の意味変更
- データモデル変更
- SharePoint schema 変更
- persistence contract 変更
- 記録作成ロジックの変更
- 記録件数の算出ロジック変更
- 支援実施判定ロジック変更
- Navigation 全体の変更
- Information Architecture 変更
- モニタリング／見直し資料の重複修正
- 英語 ID 表示問題の修正
- 手順 ID 中心表示の修正
- UI 全体の visual polish
- unrelated refactor

## 7. State Semantics Boundary

本 Correction は、既存システムに存在する状態の意味を変更しない。

```text
0件 が具体的にどのデータ条件を意味するかは、既存 contract を Authority とする。
実施できなかった が具体的にどのデータ条件を意味するかも、既存 contract を Authority とする。
```

Correction Scope Definition から新しい状態判定ルールを推測または追加してはならない。

既存 contract から両者の意味を確定できない場合、実装で補完せず HOLD する。

## 8. Required User Distinction

対象 UI を見た利用者が、

```text
「記録が存在しない」
```

ことと、

```text
「実施できなかった事実が記録されている」
```

ことを同一状態として認識しないことを要求する。

表示方法そのものは、この Definition では固定しない。

特定の色、アイコン、カード、バッジ、文言配置を Definition Authority としない。

## 9. Acceptance Criteria

Correction Candidate は少なくとも以下を満たすこと。

| ID | Criterion |
|---|---|
| AC1 | 0件 と 実施できなかった が UI 上で識別可能である。 |
| AC2 | 実施できなかった が単なる 0件として表示されない。 |
| AC3 | 0件 に対して、実施できなかったという意味を誤って付与しない。 |
| AC4 | 既存の状態判定ロジックを変更しない。 |
| AC5 | 既存のデータモデル、schema、persistence contract を変更しない。 |
| AC6 | 既存の他状態の意味または表示上の識別性を損なわない。 |
| AC7 | Correction が対象 finding を越えて他の Human Review findings の修正へ拡大しない。 |
| AC8 | 対象となる状態の識別について再現可能な verification evidence を残せる。 |

## 10. Verification Boundary

Verification では少なくとも以下を確認する。

- 0件 の表示
- 実施できなかった の表示
- 両状態を比較したときの識別可能性
- 既存状態への regression
- 対象 scope 外への変更がないこと

既存 contract 上の状態条件が特定できない場合、

```text
Verification = HOLD / INSUFFICIENT STATE AUTHORITY
```

とする。

## 11. Authority Boundary

```text
Definition Mutation = NONE after Scope Lock
Repository Mutation = NONE at this gate
Implementation = NOT AUTHORIZED
Human Implementation Start = NOT CONSUMED
Ready = NOT AUTHORIZED
Merge = NOT AUTHORIZED
Deploy = NOT AUTHORIZED
```

本 Definition の作成または review によって Implementation Authority は発生しない。

## 12. Fresh Independent Scope Review Questions

Fresh Independent Reviewer は次を確認する。

| ID | Question |
|---|---|
| Q1 | Correction は Finding 5 だけに限定されているか。 |
| Q2 | 0件 と 実施できなかった の識別要求が明確か。 |
| Q3 | Definition が新しい業務状態または状態判定ルールを作っていないか。 |
| Q4 | 既存 contract を状態意味の Authority として維持しているか。 |
| Q5 | Acceptance Criteria によって誤判断リスクの Correction を検証できるか。 |
| Q6 | データモデル、schema、persistence への不要な変更を禁止できているか。 |
| Q7 | 他の Human Review findings を Correction へ混入させない境界が十分か。 |
| Q8 | 実装方法を過度に固定せず、Correction Scope だけを固定しているか。 |

## 13. Review Gate

```text
PASS CONDITION = P0 0 = P1 0
P2 = PASS を妨げない改善提案として記録可能
```

P0 または P1 が存在する場合、

```text
Human Implementation Start eligibility = NOT ELIGIBLE
```

とする。

## 14. Next

```text
Correction Scope Definition = COMPLETE
NEXT = Fresh Independent Scope Review
```

その review で、

```text
P0 = 0
P1 = 0
PASS
```

となった場合のみ、

```text
Human Implementation Start decision = ELIGIBLE
```

とする。

```text
Human Implementation Start = NOT CONSUMED
Repository Mutation = NONE
STOP = Fresh Independent Scope Review 前
```
