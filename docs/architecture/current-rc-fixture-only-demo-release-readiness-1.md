# CURRENT-RC FIXTURE-ONLY DEMO RELEASE READINESS-1

この文書は、Product RC `7944cea…` を **本番運用開始と分離した
fixture-only / 合成データ公開**として扱うための current-RC release-readiness
reconciliation である。既存の旧 release / fixture-only closeout を書き換えず、
current-RC の証跡と後続 gate を別 identity として記録する。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: CURRENT-RC-FIXTURE-ONLY-DEMO-RELEASE-READINESS-1
Kind: docs-only reconciliation / gate definition
Status: RECORDED / HOLD WITH CURRENT-RC EVIDENCE GAPS
Product RC: 7944cea0fad20783f178ec613080283b98b5cca5
origin/main observed: 7944cea0fad20783f178ec613080283b98b5cca5
Application mutation: NONE
External mutation: NONE
Deploy: NOT AUTHORIZED / NOT PERFORMED
```

## 1. Identity and authority separation

```text
Product RC / code basis:
  7944cea0fad20783f178ec613080283b98b5cca5

Package metadata at exact RC:
  name: severe-behavior-support-spfx-shell-client-side-solution
  ProductId: 4342db47-21a3-4c48-aed1-ef615f55c404
  version: 1.0.0.2
  zippedPackage: solution/severe-behavior-support-spfx-shell.sppkg

Current-RC Security Definition:
  recorded separately by CURRENT-RC SECURITY EXACT-SCOPE DEFINITION-1

Future Deep Scan result authority:
  NOT ESTABLISHED

Future Artifact Authority:
  NOT ESTABLISHED

Production Binding:
  existing Option A — KEEP unbound remains unchanged
  NOT ACTIVE / NOT AUTHORIZED
```

Product RC、document revision、Deep Scan result、artifact hash、App Catalog
object、Production Binding Decision は同一の basis として扱わない。
旧 `1.0.0.1` artifact、旧 hash、旧 Deep Scan は current-RC authority ではない。

## 2. Current status

```text
U1 — live tenant OrganizationId / SiteId isolation:
  UNVERIFIED
  fixture-only runtime does not establish live-tenant isolation.

U2 — exact-current-RC repository-wide Deep Scan:
  UNVERIFIED
  no successful scan of 7944cea… has been established.

U3 — current-RC .sppkg artifact identity:
  UNVERIFIED / NOT RECORDED
  no current-RC Artifact Authority has been established.

Fixture Demo Eligibility:
  NOT YET ELIGIBLE

Production Release:
  HOLD

LIVE WRITE:
  HOLD
```

`Product readiness`、`Fixture Demo Eligibility`、`Production Release` は別の
判定である。U1 を fixture-only demo の都合で PASS に変換しない。

## 3. Gate sequence

```text
1. Independent Review of CURRENT-RC SECURITY EXACT-SCOPE DEFINITION-1
2. Security Definition PASS / LOCK
3. Human Deep Scan Start GO
4. Exact-RC repository-wide Deep Scan
5. Deep Scan result closeout
6. Current-RC Artifact Authority
7. RR-2 focused reassessment
8. Read-only catalog / rollback preflight
9. Human CURRENT-RC FIXTURE-ONLY DEMO DEPLOY GO
10. Human-only App Catalog mutation for the exact ProductId
11. Post-Deploy Verification
12. Separate Host Page Placement GO, only if required
13. Demo Acceptance closeout
```

Deep Scan、Artifact Authority、Deploy、Host Page Placement、Demo Acceptance は
前段 gate を暗黙に完了させない。App Catalog mutation は SharePoint mutation
であり、この文書から実行しない。

## 4. Required evidence packet

後続 gate は次の値を同一 packet に束縛する。

```text
productRcSha
securityDefinitionRevision
deepScanResultRevision
artifactPath
artifactProductId
artifactVersion
artifactSize
artifactSha256
artifactBuildBasis
fixtureOnly: true
productionBinding: KEEP unbound
liveWrite: HOLD
rollbackCandidate
catalogReadback
hostPageReadback
runtimeVerification
demoAcceptance
```

欠落値は `UNKNOWN` とし、推測で埋めない。current-RC artifact が固定できない
場合、Demo Deploy GO は発行しない。

## 5. Safety boundary

この unit の対象外は次のとおり。

```text
source implementation
dependency upgrade / npm audit fix
package metadata bump
Production Binding
LIVE WRITE enablement
ProcedureRecord CREATE / PATCH / DELETE
SharePoint schema or list mutation
Graph / Entra mutation
App Catalog mutation
Home.aspx or other page edit
new page creation
Issue / PR / merge mutation
```

fixture demo は synthetic data のみを使用し、token、cookie、secret、個人情報、
本番データを記録・転記しない。

## 6. HOLD conditions

次のいずれかで停止する。

- exact RC が `7944cea…` と一致しない
- clean detached worktree が確認できない
- managed filesystem permission profile がない
- Security Definition の Independent Review / PASS / LOCK がない
- Human Deep Scan Start GO がない
- verified P0/P1 がある
- artifact の ProductId、version、basis、size、SHA-256 が一致しない
- rollback candidate を特定できない
- App Catalog read-back が ProductId / version / deployed state 不一致
- fixture-only、LIVE WRITE HOLD、KEEP unbound が崩れる
- runtime または acceptance の必須項目が `UNKNOWN` / `FAIL`

## 7. STOP

```text
This document is docs-only reconciliation.
Do not begin Deep Scan from this document.
Do not build or hash .sppkg from this document.
Do not Production Bind.
Do not enable LIVE WRITE.
Do not Deploy.
Do not mutate SharePoint / Graph / M365 / Entra / App Catalog.
Wait for the separately named Human gates.
```
