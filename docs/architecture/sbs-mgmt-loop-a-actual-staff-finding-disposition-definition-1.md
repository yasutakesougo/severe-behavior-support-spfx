# SBS-MGMT-LOOP-A — Actual Staff Finding Disposition Definition-1

```text
unit = SBS-MGMT-LOOP-A-ACTUAL-STAFF-FINDING-DISPOSITION-DEFINITION-1
issue = #552
phase = DEFINITION CANDIDATE / DOCS ONLY
rebaseline main = 2c99d0c6d4dd8a4691ed64386650808d07525f38
product implementation basis under staff check = bfa7eaa2821197d68c284735ce5a6b355c3e5687
staff evidence = issuecomment-5490598734
prior locked Definition = #552 Definition Correction-3 / issuecomment-5489293623
prior Human Definition Lock = issuecomment-5489311067
Human Ready GO = NOT RECEIVED
Implementation correction authority = NOT AUTHORIZED
```

## 1. Purpose

Actual Staff Value Check Staff 1 で確認された product-clarity finding を、#552 の Human Review completion の意味を増やさずに閉じるための disposition candidate を定義する。

このDefinitionは実装を開始しない。

```text
Actual Staff evidence
  ↓
Finding disposition
  ↓
Independent Definition Review
  ↓
Human Definition Amendment Lock GO / HOLD
  ↓
STOP
```

#553 Revision Intent / Plan Draft vN+1 には進まない。

## 2. Actual Staff evidence

Staff 1 の回答は次の通り。

```text
Q1 = すぐ分かる
Q2 = すぐ分かる。色分けやはっきり区別できると良いかも。
Q3 = すぐ分かる
Q4 = 違いがわかりづらい。
     判断理由記入欄で用が足りるので、補足メモの使い分けがイメージしづらい。
Q5 = すぐ分かる
```

Disposition:

```text
Q1 = PASS
Q2 = MINOR FINDING
Q3 = PASS
Q4 = BLOCKING PRODUCT-CLARITY FINDING
Q5 = PASS
Overall = HOLD
```

このDefinitionは、Q4をblocking findingとして扱う。Q2は同じHuman Review surface内で閉じられる最小の視認性改善候補として扱う。

## 3. Product question

Human Review担当者に対して、Review completion時の人向け入力欄を2つ提示する業務上の必要性が、Actual Staff evidenceで支持されているか。

Staff 1 evidenceは次を支持する。

```text
判断理由 = 理解可能 / 入力先として十分
補足メモ = 判断理由との使い分けをイメージしづらい
```

現時点のActual Staff evidenceは、2つの入力欄を維持する追加業務価値を支持していない。

## 4. Options considered

### Option A — 2欄を維持し説明文だけ変更

```text
判断理由
補足メモ（任意）
```

評価:

```text
implementation delta = small
Staff findingへの直接性 = weak
教育・使い分けコスト = remains
```

Q4の「判断理由で用が足りる」という evidence を十分に反映しないため、第一候補としない。

### Option B — #552 human-facing inputを判断理由へ一本化

```text
判断理由
```

`MonitoringPeriodReviewOutcomeNote` contract自体は削除・変更しない。

評価:

```text
Staff findingへの直接性 = strong
新しい業務概念 = 0
既存decisionReason semantics = preserved
既存Note contract breaking change = 0
```

**RECOMMENDED CANDIDATE = Option B**

### Option C — 2欄を新しい用途定義で強く分離

例:

```text
判断理由 = Review decision rationale
補足メモ = 引継ぎ事項 / 次回確認事項
```

Actual Staff evidenceはこの追加分類を要求していない。新しい業務概念を導入するため採用候補としない。

## 5. Candidate product rule — decisionReason-centered completion

Human Definition Amendment Lock GO が与えられた場合のcandidate ruleは次とする。

```text
#552 human-facing writable text input
= decisionReason only
```

### CHANGE_REQUIRED

既存requirednessを変更しない。

```text
CHANGE_REQUIRED + blank / whitespace-only decisionReason
→ INVALID
→ partial capture = 0
```

### NO_CHANGE

既存requirednessを変更しない。

```text
NO_CHANGE + blank decisionReason
→ VALID
```

### reviewNote

`MonitoringPeriodReviewOutcomeNote` v1.0.0 を削除・再定義しない。

```text
reviewNote contract
= PRESERVED

reviewNote schema/version
= UNCHANGED

reviewNote in #552 staff-facing correction surface
= NOT USER-EDITABLE / NOT PRESENTED AS A SECOND INPUT

new #552 synthetic capture through corrected UI
= note: null
```

これは次を意味しない。

```text
MonitoringPeriodReviewOutcomeNote deletion
historical note reinterpretation
migration
SharePoint schema mutation
production data cleanup
```

## 6. Existing aggregate compatibility

既存narrow aggregate representationは互換性のため維持できる。

```text
SyntheticCapturedReview = {
  outcome,
  decisionReason,
  note: MonitoringPeriodReviewOutcomeNote | null
}
```

candidate correctionでは `note` propertyを削除しない。

Human-facing #552 correction surfaceから新規captureする場合のみ、`note = null` とする。

したがって、既存 #550 Note contract / validator / DTO / bridge は変更対象ではない。

## 7. Human-facing readback

candidate correction後のreadbackは、職員が入力したReview decisionとdecisionReasonを中心にする。

```text
見直し結果: 変更なし | 変更が必要
判断理由: <human-authored normalized reason>   // nonblank only
```

`補足メモ` を新しい #552 completion の人向けreadbackとして要求しない。

既存Note contractの存在をUI上で説明するための技術文言も追加しない。

## 8. Q2 minor finding — decision distinction

Staff 1 は `変更なし / 変更が必要` の意味自体は「すぐ分かる」と回答した。

したがってsemantic vocabularyは変更しない。

```text
NO_CHANGE
CHANGE_REQUIRED
```

ただし同一surfaceで、2つの判断actionをより明確に識別できる最小のvisual distinctionを許容する。

Requirements:

```text
- 色だけに依存しない
- button labelは変更しない
- CHANGE_REQUIREDをsystem inference / error / failureに見せない
- existing design tokens / control familyを優先
- accessibility regressionを起こさない
```

許容例:

```text
border / weight / emphasis hierarchy
+ optional semantic color distinction
```

このQ2改善はP2相当であり、Q4 correctionを超える大規模UI redesignを許可しない。

## 9. CurrentCaptureEpoch / evidence semantics

#552 Definition Correction-3でLockされたCurrentCaptureEpoch semanticsは変更しない。

```text
ReviewContextKey
canonical evidence snapshot
MATCH
MISMATCH
A → B → A
```

既存R8–R12 semanticsをそのまま継承する。

このfinding dispositionを理由に、history / archive / seen-snapshot registry / localStorage / SharePoint persistenceを導入しない。

## 10. Outcome identity / atomicity

次を変更しない。

```text
MonitoringPeriodReviewOutcome v1.0.0
OutcomeId mint material
MonitoringPeriodReviewDecisionReason contract
MonitoringPeriodReviewOutcomeNote v1.0.0
LIVE_WRITE_AUTHORIZED = false
```

`decisionReason` / `reviewNote` はOutcomeId mint materialではない。

Atomic capture invariantsも維持する。

```text
CHANGE_REQUIRED + blank reason
→ INVALID
→ no Outcome-only partial capture
```

## 11. Candidate implementation boundary

Human Definition Amendment Lockと別途Scope Review / Human Implementation Correction GOが成立した場合にのみ、次の最小surfaceをCorrection候補とする。

```text
IN
- ReviewOutcomeCaptureView: second note inputを#552 staff-facing surfaceから除外
- decisionReason input / requiredness / readback維持
- note=null synthetic capture path
- Q2 buttonsの最小visual distinction
- focused tests / browser smoke updates

CONFORMANCE ONLY
- current-epoch MATCH / MISMATCH / A→B→A
- canonical evidence snapshot

OUT
- MonitoringPeriodReviewOutcomeNote contract deletion
- historical migration
- post-capture edit/amendment
- #553 RevisionIntent
- Plan Draft vN+1
- SupportPlan mutation
- SharePoint / M365 / Entra mutation
- Deploy
- Production Binding
- LIVE WRITE
- AI-generated decisionReason
- automatic CHANGE_REQUIRED inference
```

Exact physical file surfaceはImplementation Scope Correctionでcurrent implementation HEADを再読して固定する。Definition段階ではcode pathを推定して増やさない。

## 12. Verification requirements

Prior #552 R1–R12を回帰必須とする。

追加のfinding-specific acceptanceを次とする。

```text
F1  未判断surfaceで人向けtext inputが「判断理由」1欄だけである
F2  CHANGE_REQUIRED + blank reason = INVALID / partial capture 0
F3  CHANGE_REQUIRED + nonblank reason = CAPTURED
F4  NO_CHANGE + blank reason = CAPTURED
F5  corrected #552 UI capture has note = null
F6  Note v1 contract / validator / DTO compatibility is unchanged
F7  decisionReason readback is independently understandable without補足メモ欄
F8  NO_CHANGE / CHANGE_REQUIRED actions are more visually distinguishable without color-only reliance
F9  R8–R12 current-epoch behavior remains unchanged
F10 no SharePoint / LIVE WRITE / N+1 mutation
```

## 13. Rendered Browser Acceptance

Correction implementationが発生した場合、prior Rendered Browser Acceptanceを代替証跡として使用しない。

Correction exact implementation HEADで再実施する。

```text
1280 × 900
390 × 844
```

最低限確認する。

```text
判断理由1欄
補足メモ入力欄なし
CHANGE_REQUIRED blank reason block
captured reason readback
NO_CHANGE / CHANGE_REQUIRED action distinction
zero-record state
no horizontal overflow
LIVE_WRITE=false boundary
```

## 14. Actual Staff Re-Check

Correction後はreal staffによる再確認を必要とする。Simulationは代替しない。

重点質問:

```text
Q2-recheck:
「変更なし」と「変更が必要」は区別しやすいですか？

Q4-recheck:
判断した理由をどこに書けばよいか迷いませんか？
```

Q1 / Q3 / Q5はregression checkとして維持する。

Exit criteria:

```text
Q4 blocking finding = CLOSED
Q2 = PASS または non-blocking minor disposition
Q1/Q3/Q5 regression = PASS
```

## 15. Authority / gate

この文書はDefinition candidateであり、Human Definition Amendment Lockではない。

```text
Actual Staff Value Check = HOLD
Finding disposition Definition-1 = CANDIDATE
Independent Definition Review-1 = REQUIRED
Human Definition Amendment Lock GO = NOT RECEIVED
Implementation correction = NOT AUTHORIZED
Code / fixture mutation = NOT AUTHORIZED under this Definition
Human Ready GO = NOT RECEIVED / NOT ELIGIBLE
Merge = NOT AUTHORIZED
Deploy = NOT AUTHORIZED
Production Binding = NOT AUTHORIZED
SharePoint / M365 / Entra mutation = NOT AUTHORIZED
LIVE WRITE = NOT AUTHORIZED
#553 = NOT YET
```

## 16. Next gate

```text
Independent Definition Review-1
→ Correction if required
→ exact Definition re-read
→ Independent Definition Re-Review
→ separate Human Definition Amendment Lock GO / HOLD
```

Agent must STOP before implementation correction unless the downstream Human gates are separately received.
