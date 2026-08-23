# VP-7 Exact Scope Definition — Optical Alignment / Visual Balance

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: VP-7 — optical alignment / visual balance
Kind: read-only Exact Scope Definition
MODE: READ-ONLY DEFINITION
BASE: main@7944cea0fad20783f178ec613080283b98b5cca5
Code / SCSS / TSX mutation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Deploy / SharePoint / Graph / Entra: FORBIDDEN
NEXT: VP-7 Definition Review
Agent: STOP on implementation
```

## 1. VP-7が扱う対象

VP-7は、VP-3からVP-6までで成立した構造と視覚規則を維持したまま、数値上の整列と人間の視覚上の整列の差だけを扱う。

対象は、位置、余白、視覚的重心、コントロール群の見かけ上の均衡である。

VP-7は、新しい情報設計、CTA意味、保存状態、文言、日時表現を導入しない。

## 2. 前提として固定する既存Authority

VP-3のselected / hover / focus / disabledの視覚言語を変更しない。

VP-4のmeasure、typography、spacingの基準を変更しない。

VP-5のstatus presentation priorityとCTA priorityを変更しない。

VP-6の日本語文言と日時表現を変更しない。

5-state save semantics、handler、disabled predicate、navigation、domain、persistenceを変更しない。

## 3. Optical correctionを許可する条件

Optical correctionは、デザイントークンや既存spacingを置き換えるために使わない。

まず既存トークン、layout、alignmentで成立しているかを確認する。

そのうえで、同じ画面を見たときに視覚的な偏りが再現する場合だけ補正候補にする。

補正は、対象selectorと理由を明示できる最小単位に限定する。

「なんとなく見やすい」だけを理由にした補正は認めない。

## 4. 視覚レビューで確認する4項目

### 4.1 Optical center

幾何学的中央に配置されていても、文字やアイコンの形状により上下左右へ偏って見えないかを確認する。

補正が必要な場合は、対象要素単位の最小offsetだけを候補にする。

### 4.2 Visual weight

Primary CTA、Secondary CTA、status badge、heading、説明文の視覚的重量が、既存の優先順位と一致するかを確認する。

VP-5で固定したCTA優先順位そのものは変更しない。

### 4.3 Group balance

action row、status block、heading groupなどのまとまりが、コンテナ内で一方向に偏って見えないかを確認する。

DOM順序や業務上の操作順序は変更しない。

### 4.4 Perceived spacing

同じtoken値でも、文字密度、ボタン面積、border、shadowの影響で余白が狭すぎる、または広すぎるように見えないかを確認する。

補正はVP-4のspacing systemを壊さない範囲に限定する。

## 5. In-scope candidate surfaces

候補は、VP-4からVP-6まで継続して調整対象になった次の3 surfaceとする。

```text
spfx/src/shell/procedure/ProcedureRecordFormUx.module.scss
spfx/src/shell/procedure/ProcedureRecordCorrectionUx.module.scss
spfx/src/shell/users/SupportPlanManagementListUx.module.scss
```

Shared Shellは、VP-7 Reviewで具体的な視覚偏りが確認された場合だけ追加候補にする。

## 6. Explicit OUT

```text
新しい色体系
新しいspacing scale
新しいtypography scale
新しいCTA種別
CTAのhandler変更
CTAのenabled / disabled条件変更
save-state vocabulary / emphasis変更
status meaning変更
DOM順序変更
keyboard順序変更
navigation変更
copy / datetime変更
domain / persistence / authorization変更
SharePoint / Graph / Entra / Deploy
```

## 7. 禁止する実装パターン

viewportごとに説明できないmagic numberを増やさない。

要素ごとに独立した微調整を大量に追加しない。

transformで見た目だけ移動し、focus ringやhit areaとの位置関係を壊さない。

視覚補正を理由にcontrast、focus-visible、44px以上の操作領域など既存アクセシビリティ条件を弱めない。

Primary CTAを強く見せるために、VP-5で確定したdisabled表現を上書きしない。

## 8. Definition Reviewで確定する事項

VP-7 Definition Reviewでは、次の事項だけを判定する。

1. VP-7を独立sliceとして実施する価値があるか。
2. 3 candidate surfacesのうち、実際に補正対象とするsurfaceはどれか。
3. Before evidenceで再現する視覚偏りが存在するか。
4. selector単位の補正で閉じるか。
5. VP-3からVP-6のauthorityを再オープンせずに実装できるか。

視覚偏りが確認できないsurfaceは変更対象にしない。

## 9. Implementation Start後に要求するEvidence

Implementation Startが別GOで許可された場合だけ、次のEvidenceを要求する。

- exact HEADを固定する。
- desktop、tablet、narrowのBefore / Afterを同一条件で比較する。
- 変更selectorごとに、何が視覚的に偏っていたかを記録する。
- 数値上の整列だけでは解消しない理由を記録する。
- SCSS diffを最小化する。
- TSXを変更する場合はclassName wiringだけに限定する。
- keyboard順序が不変であることを確認する。
- focus ringとhit areaが不変であることを確認する。
- horizontal overflowが増えていないことを確認する。
- console errors = 0を確認する。
- SharePoint / Graph requests = 0のsynthetic smokeで確認する。

## 10. Acceptance Criteria

| ID | Criterion |
|---|---|
| VP-7-AC1 | 補正対象はBefore evidenceで視覚偏りを再現できるsurfaceだけである |
| VP-7-AC2 | 補正理由をselector単位で説明できる |
| VP-7-AC3 | VP-3 interaction languageを変更しない |
| VP-7-AC4 | VP-4 measure / typography / spacing authorityを変更しない |
| VP-7-AC5 | VP-5 status / CTA priorityを変更しない |
| VP-7-AC6 | VP-6 copy / datetimeを変更しない |
| VP-7-AC7 | handler / disabled predicate / navigation / domain / persistenceを変更しない |
| VP-7-AC8 | keyboard order / focus-visible / hit areaを弱めない |
| VP-7-AC9 | desktop / tablet / narrowで新しいoverflowを発生させない |
| VP-7-AC10 | 補正が不要なsurfaceは変更しない |
| VP-7-AC11 | SharePoint / Graph requests = 0 |
| VP-7-AC12 | Deploy / Production Bindingを行わない |

## 11. External referenceの扱い

Speaker Deck「美しいUIを作るためにデザイナーが意識しているちょっとした考え方」は、optical center、visual weight、perceived spacingを検討するための参考資料として扱う。

外部資料は設計Authorityではない。

本リポジトリの既存Decision、VP-3からVP-6、アクセシビリティ条件を優先する。

Reference:
https://speakerdeck.com/yuichi_hara7/mei-siiuiwozuo-rutameni-dezainagayi-shi-siteiru-tiyotutositakao-efang

## 12. Rollback boundary

後続実装のrollbackは、VP-7で追加したpresentation-only SCSSまたはclassName wiringだけに限定する。

Domain、persistence、navigation、save-state semantics、SharePoint、Graph、Deployへrollback影響を波及させない。

## 13. HOLD / STOP

| Item | Status |
|---|---|
| VP-7 Exact Scope Definition | CREATED FOR REVIEW |
| VP-7 Definition Review | NEXT |
| Implementation Start | NOT AUTHORIZED |
| Code / SCSS / TSX mutation | STOP |
| Ready / Merge | NOT AUTHORIZED BY THIS DEFINITION |
| Deploy / Production Binding | FORBIDDEN |
