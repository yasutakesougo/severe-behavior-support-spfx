# SPFX-CURRENT-RC-FIXTURE-DEMO-ACCEPTANCE-1

この文書は current-RC `7944cea…` の fixture-only demo acceptance packet の
準備記録である。現時点では Deploy / runtime verification / Acceptance は実施していない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: SPFX-CURRENT-RC-FIXTURE-DEMO-ACCEPTANCE-1
Kind: acceptance packet template / docs-only
Status: PREPARED / NOT ACCEPTED
Product RC: 7944cea0fad20783f178ec613080283b98b5cca5
ProductId: 4342db47-21a3-4c48-aed1-ef615f55c404
Version: 1.0.0.2
fixture-only: true
Production Binding: KEEP unbound
LIVE WRITE: HOLD
```

## 1. Required preconditions

```text
Exact-RC Deep Scan closeout: REQUIRED
Current-RC Artifact Authority: REQUIRED
RR-2 fixture demo eligibility: REQUIRED
Read-only catalog identity preflight: REQUIRED
Rollback candidate: REQUIRED
Human Demo Deploy GO: REQUIRED before any App Catalog mutation
```

この packet は GO ではない。App Catalog upload / replace、site install、page
edit、Production Binding、LIVE WRITE を開始しない。

## 2. Artifact and catalog read-back

```text
Artifact SHA-256: <record after current-RC build>
Artifact size: <record after current-RC build>
Artifact build basis: 7944cea…

Catalog ProductId: <PASS / FAIL / UNKNOWN>
Catalog version: <PASS / FAIL / UNKNOWN>
Deployed: <PASS / FAIL / UNKNOWN>
CurrentVersionDeployed: <PASS / FAIL / UNKNOWN>
Catalog hash: UNKNOWN if not exposed; never inferred
```

ProductId、version、deployed state のいずれかが不一致または `UNKNOWN` の場合、
runtime verification と acceptance は `HOLD` とする。

## 3. Runtime verification checklist

```text
Host page: <exact URL and read-only evidence>
Web Part launch: <PASS / FAIL / UNKNOWN>
PLANNER entry: <PASS / FAIL / UNKNOWN>
ADMIN_AUDIT entry: <PASS / FAIL / UNKNOWN>
Primary screens: <PASS / FAIL / UNKNOWN>
Synthetic data only: <PASS / FAIL / UNKNOWN>
LIVE WRITE traffic: NONE / UNKNOWN
Graph / Entra mutation: NONE / UNKNOWN
Production Binding: NOT ACTIVE / UNKNOWN
Fatal console error: NONE / exact non-PII text
Desktop verification: <PASS / FAIL / UNKNOWN>
Tablet verification: <PASS / FAIL / UNKNOWN>
```

必須項目に `UNKNOWN` または `FAIL` があれば Acceptance は成立しない。
token、cookie、secret、個人情報、本番データを packet に記録しない。

## 4. Host Page Placement branch

既存の正しい host page に Web Part が存在する場合、App Catalog replacement だけで
検証し、page edit は行わない。

存在しない場合は次を別 Human GO とする。

```text
Host Page Placement GO: REQUIRED
Allowed: exact existing page に Scaffold Shell Web Part を1個だけ追加
Forbidden: new page、別ページ、Add-PnPApp、site install、navigation変更
```

Host Page Placement GO と Demo Deploy GO を同一視しない。

## 5. Acceptance closeout

全 precondition と verification が PASS の場合のみ、次を記録する。

```text
FINAL:
  CURRENT-RC FIXTURE DEMO DEPLOYED / ACCEPTED

Production Binding:
  KEEP unbound
LIVE WRITE:
  HOLD
Production Release:
  NOT AUTHORIZED / separate future gate
Real user data:
  NOT AUTHORIZED
```

`ACCEPTED` は full application acceptance、Production Release、Production Binding、
LIVE WRITE GO を意味しない。

## 6. STOP

```text
This packet is prepared only.
Do not fill PASS values without fresh evidence.
Do not infer catalog hash or runtime success.
Do not mutate App Catalog or pages from this document.
Do not Production Bind.
Do not enable LIVE WRITE.
```
