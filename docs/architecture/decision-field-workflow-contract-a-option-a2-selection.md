# FIELD-WORKFLOW Contract Issue A — Option A2 Selection

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-FIELD-WORKFLOW-CONTRACT-A-OPTION-A2-1
Kind: Human Selection（Issue #347 Option A1 / A2 / A3）
Status: SELECTED / LOCKED（Selection GO boundary）
Human Decision: SELECT Option A2
Date: 2026-08-13
Issue: #347（契約 Issue A 正本）
Upstream:
  PR #345 FIELD-WORKFLOW-1 assessment（MERGED）
  PR #346 Issue A filing packet（MERGED）
  Issue #347 body = filing packet full text

Baseline main tip at Selection recording start:
  26fa160（Merge PR #346）

Implementation Start: NOT AUTHORIZED（separate Human GO）
Contract / schema code mutation: NOT AUTHORIZED by this Selection alone
Issue B filing: NOT AUTHORIZED by this Selection alone
FIELD-WORKFLOW UI: NOT AUTHORIZED
Deploy / SharePoint write / App Catalog / #299 Close: NOT AUTHORIZED
Agent auto-select: FORBIDDEN（this Selection is Human GO）
```

## 1. Selected option

```text
Option A2 — SELECTED / LOCKED
```

契約層の正本は次に限定する。

```text
planId + planVersion  ↔  ProcedureId + ProcedureVersion
```

- 既存 `ApprovedProcedureReference`（APPROVED id/version 参照）境界を壊さない。
- 手順本文（場面 / 実施する支援 / 避ける対応 / 必要な補足）は **contracts 正本へ昇格しない**。
- 手順本文は **presentation projection** として扱う。
- `contracts-v1.md` の「支援手順は手順本文ではなく APPROVED の ProcedureId / ProcedureVersion だけを参照する」を維持する。

## 2. Options not selected

| ID | Meaning | Result |
|---|---|---|
| **A1** | SupportProcedure 契約に手順本文を持つ | **NOT SELECTED** |
| **A2** | id/version + plan link のみ。本文は presentation projection | **SELECTED** |
| **A3** | Human 別案 | **NOT SELECTED** |

A1 を採用しない理由（Selection 時点）:

- 今回の FIELD-WORKFLOW UI 要求だけを理由に手順本文を新たな契約正本へ昇格すると、過剰変更になる。
- 既存 `ApprovedProcedureReference` / `contracts-v1` 境界との衝突が大きい。
- 本文を契約へ昇格させる場合は、別 DEC で理由・Schema・互換方針を明示したうえで再 Selection が必要。

## 3. Mandatory locks when A2 is selected

### 3.1 手順本文の正本ソース

```text
正本ソース = リンク先 SupportPlanVersion
識別子     = planId + planVersion
本文フィールド（既存）:
  supportMethods: readonly string[]
  precautions: readonly string[]
```

- 手順本文の説明責任は **リンクされた SupportPlanVersion** に置く。
- 新規の SupportProcedure body schema（場面/実施/避ける/補足の契約フィールド）は **作らない**（A1 不採用）。
- 「最新 Active 計画の本文」を、リンク版と無関係に正本扱いしない。

### 3.2 supportMethods / precautions からの投影規則

Presentation-only（非契約）投影:

| 現場表示スロット | 投影元 | 規則 |
|---|---|---|
| 実施する支援 | `SupportPlanVersion.supportMethods` | 配列順を保持して表示する |
| 避ける対応 | `SupportPlanVersion.precautions` | 配列順を保持して表示する |
| 場面 | 契約フィールドなし | presentation label / 並びのみ。契約値として新設しない |
| 必要な補足 | 契約フィールドなし | presentation note のみ。契約値として新設しない |

追加規則:

- 投影結果を contracts / Schema / SharePoint 列へ書き戻さない。
- 空配列は空として表示する（合成文の自動生成で埋めない）。
- UI 改善のために `supportMethods` / `precautions` の意味を契約側で拡張しない（必要なら別 DEC）。

### 3.3 plan version 変更時の本文表示固定

```text
表示本文は、常に「当該手順リンクが指す planVersion」から投影する。
```

- 現場の「現在有効な支援手順」表示: Active plan の **リンクされた current planVersion** から投影。
- 計画が v2 → v3 に進んでも、v2 リンクの手順表示は **v2 本文のまま**。
- 将来の ProcedureRecord（Issue B）が planVersion を保持する場合、見直し表示も **記録側 planVersion** から投影し、最新版へ付け替えない（FW-05 と整合。Record 契約自体は Issue B）。

### 3.4 procedure id/version と表示本文の不整合防止

Fail-closed:

1. `ProcedureId` / `ProcedureVersion` は、`planId` + `planVersion` への固定リンク経由でのみ「その計画版の手順」として解決する。
2. planVersion 照会が EMPTY / UNKNOWN / FETCH_FAILED のとき、別 version の本文へ静かにフォールバックしない。
3. リンク欠落・版不一致の手順は、「現在有効な手順本文」として確定表示しない。
4. presentation は ProcedureId だけをキーに最新計画本文へ再解決しない。
5. `ApprovedProcedureReference.ApprovalState = APPROVED` 以外を現場実施手順として採用しない（既存境界維持）。

## 4. Authorized by this Selection

```text
IN（Selection boundary only）:
  Option A2 = SELECTED / LOCKED
  上記 3.1〜3.4 の表示・正本・fail-closed 規則の文書固定
  後続の最小契約形（planId+planVersion ↔ ProcedureId+ProcedureVersion）設計議論の前提
```

## 5. Explicit OUT / still NOT AUTHORIZED

```text
OUT:
  SupportProcedure body schema（A1）
  ProcedureRecord / result vocabulary / performedAt / recordedAt（Issue B）
  FIELD-WORKFLOW UI 実装
  contracts / domain / schema コード変更
  SharePoint adapter / list / column mutation
  Deploy / App Catalog / production write
  Issue #299 Close
  Issue #347 Close
  Implementation Start
```

## 6. Relation to existing正本

| 正本 | 関係 |
|---|---|
| `contracts-v1.md` procedure = id/version only | **維持** |
| `ApprovedProcedureReference` | **破壊しない** |
| `SupportPlanVersion.supportMethods` / `precautions` | 本文投影の既存ソース |
| `SupportRecordTraceRef` / HD-RA-02 | plan version 追跡意図と整合（Record 本体は Issue B） |
| Issue #347 | Option A2 Selection の対象 Issue |

## 7. Next gates（after this Selection）

```text
1. （任意）Selection Acceptance 記録 — Human
2. Issue #347 上で A2 LOCKED を確認 — Human / comment
3. 最小契約形の設計固定（plan↔procedure link のみ）— 別 Human GO
4. 契約実装 GO — 別 Human GO
5. 契約 Issue B filing — 実装前提が揃ってから
6. FIELD-WORKFLOW UI — A/B 後
```

## 8. Stop condition

```text
Decision-FIELD-WORKFLOW-CONTRACT-A-OPTION-A2-1
= SELECTED / LOCKED

HOLD:
  Implementation Start = separate Human GO
  Issue B = not filed by this Selection
  UI / Deploy / SharePoint / #299 = NO-GO
```
