# OPS-READINESS-V1 EXACT SCOPE DEFINITION-1

この文書は **OPS-READINESS-V1** の exact-scope definition である。

`OPS-READINESS-V1 Definition Start GO` により、法人としてアプリを継続管理できる条件の定義作業だけを開始する。

この文書は Runbook 実装、SPFx code 変更、SharePoint / M365 / Entra mutation、GitHub ownership transfer、Production Binding、LIVE WRITE、Deploy を実行しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: OPS-READINESS-V1
Kind: Exact Scope Definition（docs-only）
Definition Start: GO RECEIVED
Definition status: CANDIDATE / NOT YET REVIEWED
Publication status: branch commit only / PR NOT CREATED
```

## 1. Authority and exact basis

```text
GitHub live main:
  7b37f156864ac615b4fa2713ff8c949e0744ecc4

Definition branch:
  docs/ops-readiness-v1-exact-scope-definition-1

Exact definition file:
  docs/architecture/ops-readiness-v1-exact-scope-definition-1.md
```

このDefinitionは、上記mainを基準にOperational Readinessの条件だけを固定する。

main以外の未マージ変更を根拠として扱わない。

過去のSecurity、Release、Demo、Tenant Isolationの判定を再解釈しない。

既存GateのPASSをOperational Readiness PASSへ読み替えない。

## 2. Purpose

OPS-READINESS-V1の目的は、特定担当者に依存せず、法人がアプリを管理、更新、停止、復旧、引き継ぎできる本番運用条件を定義することである。

Operational Readinessは、アプリの機能完成度とは別の本番条件として扱う。

```text
Application works
  !=
Organization can safely operate and maintain it
```

Operational Readinessは、Security ReadinessやRelease Readinessの代替ではない。

Operational Readinessは、Production Binding、LIVE WRITE、Deployの権限を付与しない。

## 3. Operational Readiness domains

OPS-READINESS-V1は次の7領域を対象とする。

```text
O1 法人所有
O2 権限・引き継ぎ
O3 更新・制度改定
O4 障害時停止
O5 rollback / 復旧
O6 紙・デジタル試行
O7 第三者運用テスト
```

### 3.1 O1 法人所有

コード、設定、運用資料、管理権限について、特定の個人だけが唯一の管理主体となる状態を本番運用可能とは扱わない。

法人が継続管理できる所有・管理モデルを明示する。

少なくとも、管理対象、管理主体、代替管理者、引き継ぎ経路を確認可能にする。

GitHub Organizationへの移管は将来の実装候補であり、このDefinitionだけでは実行しない。

### 3.2 O2 権限・引き継ぎ

GitHub、Microsoft 365、SharePoint、アプリ設定、運用資料について、誰が何を管理できるかを一覧化する。

担当者の異動、長期不在、退職が発生しても、管理状態を確認し、必要な引き継ぎを開始できることを要求する。

権限一覧の存在だけをPASS条件にしない。

第三者が資料を使用できることをO7で確認する。

### 3.3 O3 更新・制度改定

制度または法人運用ルールの変更は、直接本番環境へ反映しない。

変更は次の追跡可能な流れを通す。

```text
一次資料または法人決定
  -> 影響分析
  -> Definition / 設計
  -> Implementation
  -> Test
  -> Review
  -> Human GO
  -> Release
  -> 変更履歴保存
```

AIまたはWorkerは、制度変更を自動的にProductionへ適用しない。

制度上の要件と法人独自ルールを区別して記録できることを要求する。

### 3.4 O4 障害時停止

障害または整合性不明時に、新規書込みを安全側へ停止できる運用を要求する。

将来のアプリ実装候補として `MaintenanceMode` と `WriteEnabled` を扱う。

設定取得に失敗した場合の書込み許可は、将来のOPS-Fでfail-closedを原則として設計する。

このDefinitionは、その設定またはコードをまだ追加しない。

### 3.5 O5 rollback / 復旧

直前の正常状態を識別できることを要求する。

アプリのrollbackとデータのrecoveryを同一操作として扱わない。

少なくとも次を区別する。

```text
APP ROLLBACK
DATA MIGRATION / RECOVERY
```

Releaseごとにsource basis、artifact identity、Last Known Good候補を追跡できる方式を将来実装する。

復旧手順の文書が存在するだけではPASSにしない。

模擬復旧または同等の実行証跡を要求する。

### 3.6 O6 紙・デジタル試行

紙運用を一律に廃止することをOperational Readinessの目的にしない。

Pilotで、デジタル化による効果と負担を評価する。

最低限、次の観点を評価対象にする。

```text
入力しやすさ
記録の探しやすさ
情報共有のしやすさ
振り返りへの利用価値
紙との二重作業の増減
```

Pilot結果は、全面導入を自動決定しない。

責任者が採用範囲、紙を残す範囲、追加改善の必要性を判断できる証跡とする。

### 3.7 O7 第三者運用テスト

開発担当者本人以外の職員が、運用資料だけを用いて主要な管理情報へ到達できることを確認する。

Handover Drillでは、少なくとも次を確認する。

```text
現在のアプリVersionを確認できる
管理者と権限一覧を確認できる
障害時停止の手順を説明できる
Last Known Goodを確認できる
障害時の連絡・エスカレーション経路を確認できる
```

開発担当者の口頭補助が不可欠な場合はPASSとしない。

## 4. Acceptance Criteria

OPS-READINESS-V1のAcceptance Criteriaを次のように固定する。

```text
OPS-AC1
開発担当者本人が不在でも管理情報を確認できる。

OPS-AC2
個人アカウントだけを唯一の管理主体にしない。

OPS-AC3
障害時に新規書込みを安全に停止できる。

OPS-AC4
Last Known Goodを特定し、復旧手順を実行できる。

OPS-AC5
制度改定時に
一次資料 -> 影響分析 -> 修正 -> Test -> Review -> Human GO
を追跡できる。

OPS-AC6
紙運用を一律廃止せず、Pilot評価で導入価値を判定する。

OPS-AC7
開発非担当者によるHandover Drillを実施する。

OPS-AC8
Operational Readiness FAILならProduction GOは不可。

OPS-AC9
Runbookの存在だけをPASS条件にしない。
実際に第三者が使用できることを証明する。

OPS-AC10
Operational Readiness PASSは
Deploy / Production Binding / LIVE WRITEを自動承認しない。
```

## 5. Evidence model

Operational Readinessの判定は、文書の存在と実行証跡を分離する。

```text
DOCUMENTED
  手順または責任分界が定義されている。

VERIFIED
  手順が対象環境または安全な模擬条件で確認されている。

DRILLED
  開発担当者以外が手順を使用して確認できている。

PASS
  適用対象のAcceptance Criteriaを満たす証跡が揃っている。

HOLD
  未確認、矛盾、代替不能、復旧不能、または必要証跡不足がある。
```

`DOCUMENTED` を `PASS` と同義にしない。

不明な状態をPASSへ推定しない。

## 6. Future implementation slices

このDefinition後の実装候補を次の独立Sliceに分割する。

各Sliceは別のImplementation Start GOを必要とする。

### OPS-A: ownership and system overview

```text
docs/operations/
- README.md
- system-overview.md
- admin-access-matrix.md
```

目的は、システム構成、管理対象、管理主体、代替管理者を確認可能にすることである。

GitHub ownership transfer自体はOPS-Aに含めない。

### OPS-B: daily operation, incident and handover

```text
docs/operations/
- daily-operation-runbook.md
- incident-runbook.md
- handover-runbook.md
```

目的は、日常確認、障害初動、担当者交代時の手順を固定することである。

### OPS-C: release, rollback and regulatory change

```text
docs/operations/
- release-runbook.md
- rollback-runbook.md
- regulatory-change-runbook.md
```

目的は、更新、復旧、制度改定の追跡可能な手順を固定することである。

### OPS-D: readiness checklist and handover drill specification

```text
docs/operations/
- production-readiness-checklist.md
- handover-drill-specification.md
```

目的は、Operational Readinessの判定項目と第三者運用試験の実施条件を固定することである。

### OPS-E: GitHub and CI support

```text
candidate scope:
- regulatory-change Issue template
- release manifest format
- operations CI verification
```

目的は、変更履歴と運用文書の最低限の整合性を自動確認できるようにすることである。

自動検査はHuman acceptanceまたはHandover Drillを代替しない。

### OPS-F: emergency write stop

```text
candidate behavior:
- MaintenanceMode
- WriteEnabled
- fail-closed emergency stop
```

OPS-FはSPFx / persistence / configurationへの影響を持つため、DefinitionまたはExact Sliceを別途固定する。

OPS-F開始前に、既存のLIVE WRITE、authorization、save-state、Production Binding境界との整合性を独立確認する。

### OPS-G: administrator read-only system status

```text
candidate behavior:
- application version
- source / build identity where safely exposed
- environment
- write mode
- maintenance state
- required resource health
- Last Known Good reference
```

OPS-Gはread-onlyを原則とする。

Deploy、権限変更、Production Bindingなどのmutation controlを管理画面へ追加しない。

## 7. Production gate relationship

将来のProduction eligibilityは、少なくとも次の独立条件を満たす構造とする。

```text
Functional Readiness      PASS
Security Readiness        PASS
Release Readiness         PASS
Tenant Isolation          PASS
Operational Readiness     PASS
Pilot / Field Evaluation  PASS
                          ↓
             Production GO ELIGIBLE
```

この図は、各Gateの現在のPASSを宣言するものではない。

`Production GO ELIGIBLE` はProduction mutationそのものではない。

別途Human Production GOを必要とする。

Operational ReadinessだけがPASSしても他Gateを代替しない。

## 8. GitHub ownership boundary

現在のrepository ownership状態を、このDefinitionでは変更しない。

将来、個人アカウントだけが唯一の管理主体にならない構成を検討する。

候補には、法人管理可能なGitHub Organization、複数管理者、CODEOWNERS、branch protection等を含められる。

ただし、具体的な移管方式、管理者数、権限設定は別Sliceで確認してから決定する。

Definition acceptanceをGitHub ownership transfer GOとして扱わない。

## 9. Rollback boundary

アプリrollbackは、過去の正常sourceを用いた新しいreleaseとして実施できる設計を候補とする。

既存version番号を巻き戻すことを前提にしない。

データ変更を含むreleaseは、APP ROLLBACKだけで安全性を証明したことにしない。

schema変更またはdata migrationがある場合は、別途recovery条件を固定する。

破壊的schema変更よりadditive migrationを優先する方針は、将来のmigration Definitionで評価する。

## 10. Pilot boundary

PilotはProductionの代替ではない。

Pilotで合成データのみを使用する場合、その結果を実データProductionの安全性証拠へ自動昇格しない。

紙・デジタル比較は、業務全体を一律に電子化するためではなく、導入価値と残存リスクを確認するために行う。

## 11. Review requirements

このDefinitionはIndependent Definition Reviewを受ける。

Reviewでは少なくとも次を確認する。

```text
R1 O1-O7が責任者懸念を過不足なく扱っているか
R2 OPS-AC1-10が観測可能な条件になっているか
R3 DOCUMENTEDとPASSが混同されていないか
R4 Operational ReadinessがDeploy権限へ昇格していないか
R5 OPS-A〜GのSlice間で責任範囲が重複しすぎていないか
R6 OPS-Fが既存のauthorization / LIVE WRITE境界を破らない定義になっているか
R7 rollbackとdata recoveryが分離されているか
R8 Pilot結果をProduction安全性へ過剰昇格していないか
R9 Handover Drillが開発担当者本人への依存を実際に検査できるか
R10 既存Security / Release / Tenant Isolation Gateを再解釈していないか
```

P0 / P1 / P2がある場合は、Definition Acceptanceへ進まない。

## 12. Current status after this definition commit

```text
OPS-READINESS-V1:
  DEFINITION CANDIDATE

Definition Start:
  GO RECEIVED / CONSUMED FOR THIS FILE ONLY

Independent Definition Review:
  NOT STARTED

Definition Acceptance:
  NOT AUTHORIZED / NOT COMPLETED

OPS-A Implementation Start:
  NOT AUTHORIZED

OPS-B through OPS-G:
  NOT AUTHORIZED

SPFx code mutation:
  NONE

SharePoint / M365 / Entra mutation:
  NONE

GitHub ownership transfer:
  NONE

Production Binding:
  NO

LIVE WRITE:
  NO

Deploy:
  NO
```

## 13. STOP

このDefinition commitで作業を停止する。

Runbookを作成しない。

Issue template、release manifest、CI verificationを実装しない。

MaintenanceModeまたはWriteEnabledを実装しない。

管理者システム状態画面を実装しない。

GitHub ownershipを変更しない。

SharePoint、M365、Entra、App Catalogを変更しない。

Ready、Merge、Production Binding、LIVE WRITE、Deployへ進まない。

次の候補Gateは **OPS-READINESS-V1 Independent Definition Review** である。
