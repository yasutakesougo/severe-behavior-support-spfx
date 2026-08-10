# CN-1 — Internal Column Names read-only observation packet

この文書は、CN-1 を閉じるために必要な一次情報と比較条件を固定する packet である。

```text
Status: CANDIDATE / NOT ACCEPTED
Purpose: read-only observation contract
Mutation authorization: NONE
CN-1 Acceptance: NOT INCLUDED
Implementation Start: HOLD
```

## 1. Observation scope

対象はパイロット2事業所の4 Lists に限定する。

| Site | List |
|---|---|
| `/sites/severe-support-isogo` | `SupportPlans` |
| `/sites/severe-support-isogo` | `AssessmentSnapshots` |
| `/sites/severe-support-honmoku` | `SupportPlans` |
| `/sites/severe-support-honmoku` | `AssessmentSnapshots` |

## 2. Required primary evidence

各 List について、実テナントから取得した column metadata を一次情報とする。

最低限、取得できる範囲で次を記録する。

| Field | Meaning |
|---|---|
| display name | UI上の列名 |
| internal name | SharePoint が保持する内部名 |
| column type | Text / Number / Choice / DateTime 等の実型 |
| required | 必須列か |
| hidden | 非表示列か |
| read-only | 読取専用列か |
| source | 観測元と取得方法 |

Internal Name は観測値だけを記録する。

Display Name、予定schema、命名規則から Internal Name を生成・推測しない。

## 3. Comparison unit

比較単位は、同一用途の List を2事業所間で対にする。

```text
SupportPlans:
  isogo observed columns
  vs
  honmoku observed columns

AssessmentSnapshots:
  isogo observed columns
  vs
  honmoku observed columns
```

比較結果は次のいずれかに分類する。

```text
MATCH
  同じ意味の列について Internal Name と型が一致する

MISMATCH
  Internal Name、型、required 等に差異がある

MISSING
  一方に対象列が存在しない

UNOBSERVED
  一次情報を取得できない

AMBIGUOUS
  同一用途の列対応を一次情報だけでは確定できない
```

## 4. CN-1 close criteria candidate

CN-1 を CONFIRMED とする候補条件は以下である。

```text
1. 対象4 Lists の必要 column metadata が一次情報で取得されている
2. adapter / schema mapping に必要な列の Internal Name が観測済みである
3. 同一用途の2事業所間差異が明示されている
4. MISMATCH / MISSING / AMBIGUOUS がある場合、推測で吸収していない
5. Human Decision が観測 evidence を受理している
```

この packet 自体は条件を提示するだけで、CN-1 Acceptance を記録しない。

## 5. Fail-closed rules

```text
No Internal Name invention.
No Display Name -> Internal Name derivation.
No column creation.
No rename/update/delete.
No permissions/config mutation.
No adapter/schema implementation.
No Implementation Start.

Evidence insufficient => CN-1 OPEN.
Mismatch => record and STOP for Human Decision.
```

## 6. Allowed read-only methods

以下のいずれかで実 tenant metadata を取得する。

```text
Microsoft Graph list column metadata read
SharePoint REST field metadata read
PnP PowerShell read-only field enumeration
SharePoint UI/API evidence that exposes exact Internal Name
```

使用した方法、対象 Site/List、取得日時、取得結果を evidence 文書へ記録する。

## 7. Output

観測結果は次へ記録する。

`decision-assessment-snapshot-cn1-readonly-observation-evidence.md`

## 8. Current boundary

```text
CN-1: OPEN
Packet: CANDIDATE
Observation: STARTED / PARTIAL
Acceptance: NOT RUN
SharePoint adapter / schema mapping: HOLD
Implementation Start: HOLD
Deploy / real data: NO-GO
```
