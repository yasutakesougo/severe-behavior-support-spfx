# AI-AUTONOMY-CLASSIFIER-GATE-EVALUATOR-EXACT-SLICE-1

この文書は AI Autonomy Classifier / Gate Evaluator の実装境界を固定する。

Human `AI Autonomy Classifier Implementation Start GO` は受領済みである。

このGOは、この exact slice のコードとテストだけを認可する。
Ready、Merge、Deploy、LIVE WRITE、Production Binding、SharePoint / M365 / Entra mutation は認可しない。

## Classification

分類は `L3 > L2 > L1` の順に高リスク側を優先する。

L1 は docs-only、tests-only、synthetic fixtures only、formatting-only、deterministic generated artifacts、non-behavioral CSS-only、deterministic build/bridge evidence の allowlist だけで構成される場合に限る。

ファイルパスだけでは L1 を確定しない。

L2 は application/domain/business/UI/persistence/read-model/adapter/transport/runtime behavior および external production mutation を伴わない contract/schema semantics を含む。

L3 は Deploy、App Catalog、SharePoint provisioning/schema/write、LIVE WRITE/CREATE、Production Binding、permission/auth policy、M365/Entra、secret/credential expansion、workflow permission expansion、destructive operation、rollback capability removal、policy/requirement/acceptance authority change を含む。

判定不能、diff unavailable、classification evidence missing、unstated semantics required、production capability delta unknown は `UNKNOWN` として fail closed する。

## Gate Evaluator

`AUTONOMY_ELIGIBLE=true` は L1 かつ次の条件をすべて満たす場合に限る。

1. exact scope PASS
2. CI PASS
3. required tests PASS
4. contracts PASS
5. independent review PASS
6. P0 = 0
7. P1 = 0
8. required evidence HEAD SHA がすべて current HEAD SHA と一致
9. production capability delta = NONE
10. rollback available
11. required evidence に missing / stale / unparseable / indeterminate がない

L2、L3、UNKNOWN は常に `AUTONOMY_ELIGIBLE=false` とする。

## Rollback

L1 rollback available は、変更がGitに完全に表現され、external mutationとirreversible side effectがなく、直前のrepository stateをGitから回復でき、rollback evidenceがcurrent HEADへ束縛されている場合に限る。

## OUT

- GitHub Actions変更
- branch protection変更
- repository settings変更
- allow_auto_merge変更
- automatic Ready
- automatic Merge
- Deploy
- App Catalog mutation
- SharePoint mutation
- LIVE WRITE / LIVE CREATE
- Production Binding
- M365 / Entra mutation
- Issue mutation

## Implementation boundary

実装対象は pure classifier / evaluator と focused unit tests のみとする。

この実装自身は GitHub Ready / Merge / Deploy 等を実行しない。
