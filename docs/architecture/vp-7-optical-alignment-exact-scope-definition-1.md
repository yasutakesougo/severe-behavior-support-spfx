# VP-7 Exact Scope Definition — Optical Alignment / Visual Balance

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: VP-7 — optical alignment / visual balance
Kind: read-only Exact Scope Definition
MODE: READ-ONLY DEFINITION
BASE: main@7944cea0fad20783f178ec613080283b98b5cca5
Definition Correction-1: APPLIED
Definition Correction-2: APPLIED
Code / SCSS / TSX mutation: NOT AUTHORIZED
Implementation Start: NOT AUTHORIZED
Deploy / SharePoint / Graph / Entra: FORBIDDEN
NEXT: VP-7 Definition focused Re-Review-2
Agent: STOP on implementation
```

## 0. Correction history

Definition Reviewで見つかった境界の曖昧さを閉じる。

| ID | Severity | Status | Correction |
|---|---|---|---|
| P1-1 | P1 | CLOSED | VP-4で固定した構造spacingと、VP-7で検討する局所optical offsetを分離した。VP-7はcontainer width / padding / gap / spacing token assignmentを変更しない。alignment propertyまたは局所offsetだけを候補にする。 |
| P2-1 | P2 | CLOSED | このDefinitionから新しい`44px`数値要件を持ち込まない。既存のhit-area / accessibility authorityを弱めない、とだけ固定する。 |
| P2-2 | P2 | CLOSED | Visual weightは診断観点に限定する。color / shadow / font-weight等によるCTA優先順位の再設計はVP-7では行わない。 |
| P1-2 | P1 | CLOSED | VP-7のchanged-areaを3つのSCSSファイルのsubsetだけに固定した。TSX、Shared Shell、tokens、その他SCSSへの拡張はVP-7では禁止する。SCSSだけで閉じない場合は別exact sliceへ戻す。 |

## 1. VP-7が扱う対象

VP-7は、VP-3からVP-6までで成立した構造と視覚規則を維持したまま、数値上の整列と人間の視覚上の整列の差だけを扱う。

対象は、alignment、局所offset、視覚的重心、コントロール群の見かけ上の均衡である。

VP-7は、新しい情報設計、CTA意味、保存状態、文言、日時表現を導入しない。

## 2. 前提として固定する既存Authority

VP-3のselected / hover / focus / disabledの視覚言語を変更しない。

VP-4のmeasure、typography、spacing scale、container width、padding、gapを変更しない。

VP-5のstatus presentation priorityとCTA priorityを変更しない。

VP-6の日本語文言と日時表現を変更しない。

5-state save semantics、handler、disabled predicate、navigation、domain、persistenceを変更しない。

## 3. Optical correctionを許可する条件

Optical correctionは、デザイントークンや既存spacingを置き換えるために使わない。

まず既存トークン、layout、alignmentで成立しているかを確認する。

そのうえで、同じ画面を見たときに視覚的な偏りが再現する場合だけ補正候補にする。

補正は、対象selectorと理由を明示できる最小単位に限定する。

候補にできるのは、既存構造spacingを変えないalignment propertyまたは局所optical offsetである。

補正は§5で固定したSCSSファイル内だけで行う。

「なんとなく見やすい」だけを理由にした補正は認めない。

## 4. 視覚レビューで確認する4項目

### 4.1 Optical center

幾何学的中央に配置されていても、文字やアイコンの形状により上下左右へ偏って見えないかを確認する。

補正が必要な場合は、対象要素単位の最小offsetだけを候補にする。

### 4.2 Visual weight

Primary CTA、Secondary CTA、status badge、heading、説明文の視覚的重量が、既存の優先順位と一致するかを確認する。

VP-5で固定したCTA優先順位そのものは変更しない。

色、shadow、font-weight、CTA分類の変更が必要なら、VP-7で実装せず別Decisionへ戻す。

### 4.3 Group balance

action row、status block、heading groupなどのまとまりが、コンテナ内で一方向に偏って見えないかを確認する。

DOM順序や業務上の操作順序は変更しない。

### 4.4 Perceived spacing

同じtoken値でも、文字密度、ボタン面積、border、shadowの影響で余白が狭すぎる、または広すぎるように見えないかを確認する。

Perceived spacingは診断観点であり、VP-4のcontainer padding / gap / spacing token assignmentを変更する許可ではない。

構造spacingの変更が必要と判定された場合は、VP-7の実装対象から外す。

## 5. Changed-area authority

VP-7で変更可能なファイルは次の3ファイルだけである。

```text
spfx/src/shell/procedure/ProcedureRecordFormUx.module.scss
spfx/src/shell/procedure/ProcedureRecordCorrectionUx.module.scss
spfx/src/shell/users/SupportPlanManagementListUx.module.scss
```

実装時のchanged-areaは、上記3ファイルのsubsetでなければならない。

Before evidenceで視覚偏りが確認できないファイルは変更しない。

上記3ファイル以外の変更が必要になった場合は、VP-7を拡張しない。

その場合は実装を停止し、別のExact Scope Definitionへ戻す。

## 6. Explicit OUT

```text
all TSX / TS / JS changes
ShellUx.module.scss
SaveStateBadge / SaveStatePresentation
spfx/src/shell/tokens/**
§5に列挙していないその他SCSS
新しい色体系
color / shadow / font-weightによるCTA優先順位の再設計
新しいspacing scale
container width / padding / gap / spacing token assignment変更
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

局所offsetを使う場合は、focus ring、hit area、overflow、隣接要素との重なりが変わらないことをEvidenceで確認する。

視覚補正を理由にcontrast、focus-visible、既存のhit-area要件などアクセシビリティ条件を弱めない。

Primary CTAを強く見せるために、VP-5で確定したdisabled表現を上書きしない。

TSX、Shared Shell、tokens、その他SCSSへ変更範囲を拡張しない。

## 8. Definition Reviewで確定する事項

VP-7 Definition Reviewでは、次の事項だけを判定する。

1. VP-7を独立sliceとして実施する価値があるか。
2. §5の3ファイルのうち、実際に補正対象とするsubsetはどれか。
3. Before evidenceで再現する視覚偏りが存在するか。
4. §5のSCSS内のalignment propertyまたは局所offsetで閉じるか。
5. VP-3からVP-6のauthorityを再オープンせずに実装できるか。

視覚偏りが確認できないsurfaceは変更対象にしない。

構造spacingまたはVP-5 priorityの変更が必要なsurfaceもVP-7では変更しない。

SCSS-onlyで閉じないsurfaceもVP-7では変更しない。

## 9. Implementation Start後に要求するEvidence

Implementation Startが別GOで許可された場合だけ、次のEvidenceを要求する。

- exact HEADを固定する。
- desktop、tablet、narrowのBefore / Afterを同一条件で比較する。
- 変更selectorごとに、何が視覚的に偏っていたかを記録する。
- 数値上の整列だけでは解消しない理由を記録する。
- diffが§5の3 SCSSファイルのsubsetだけであることを確認する。
- container width / padding / gap / spacing token assignmentが不変であることを確認する。
- color / shadow / font-weightが不変であることを確認する。
- TSX / TS / JSが不変であることを確認する。
- ShellUx.module.scssとtokensが不変であることを確認する。
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
| VP-7-AC4 | VP-4 measure / typography / spacing scale / container width / padding / gapを変更しない |
| VP-7-AC5 | VP-5 status / CTA priorityを変更しない |
| VP-7-AC6 | VP-6 copy / datetimeを変更しない |
| VP-7-AC7 | handler / disabled predicate / navigation / domain / persistenceを変更しない |
| VP-7-AC8 | keyboard order / focus-visible / hit areaを弱めない |
| VP-7-AC9 | desktop / tablet / narrowで新しいoverflowを発生させない |
| VP-7-AC10 | 補正が不要なsurfaceは変更しない |
| VP-7-AC11 | color / shadow / font-weightでVP-5 priorityを再設計しない |
| VP-7-AC12 | changed-areaは§5の3 SCSSファイルのsubsetだけである |
| VP-7-AC13 | TSX / TS / JS / ShellUx.module.scss / tokens / その他SCSSを変更しない |
| VP-7-AC14 | SharePoint / Graph requests = 0 |
| VP-7-AC15 | Deploy / Production Bindingを行わない |

## 11. External referenceの扱い

Speaker Deck「美しいUIを作るためにデザイナーが意識しているちょっとした考え方」は、optical center、visual weight、perceived spacingを検討するための参考資料として扱う。

外部資料は設計Authorityではない。

本リポジトリの既存Decision、VP-3からVP-6、アクセシビリティ条件を優先する。

Reference:
https://speakerdeck.com/yuichi_hara7/mei-siiuiwozuo-rutameni-dezainagayi-shi-siteiru-tiyotutositakao-efang

## 12. Rollback boundary

後続実装のrollbackは、§5のSCSS内でVP-7が追加したpresentation-only変更だけに限定する。

Domain、persistence、navigation、save-state semantics、SharePoint、Graph、Deployへrollback影響を波及させない。

## 13. HOLD / STOP

| Item | Status |
|---|---|
| VP-7 Exact Scope Definition | CORRECTED-2 / REVIEW READY |
| VP-7 Definition focused Re-Review-2 | NEXT |
| Implementation Start | NOT AUTHORIZED |
| Code / SCSS / TSX mutation | STOP |
| Ready / Merge | NOT AUTHORIZED BY THIS DEFINITION |
| Deploy / Production Binding | FORBIDDEN |
