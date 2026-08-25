# OPS-READINESS-V1 EXACT SCOPE DEFINITION-1

この文書は **OPS-READINESS-V1** の exact-scope definition である。

`OPS-READINESS-V1 Definition Start GO` により、法人としてアプリを継続管理できる条件の定義作業だけを開始した。

Independent Definition Review-1 の指摘を受け、`OPS-READINESS-V1 Definition Correction-1 Implementation Start GO` により、このDefinition 1ファイルだけを修正する。

この文書は Runbook 実装、SPFx code 変更、SharePoint / M365 / Entra mutation、GitHub ownership transfer、Production Binding、LIVE WRITE、Deploy を実行しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: OPS-READINESS-V1
Kind: Exact Scope Definition（docs-only）
Definition Start: GO RECEIVED / CONSUMED
Independent Definition Review-1: CORRECTION REQUIRED / HOLD
Review-1 findings: P0=0 / P1=3 / P2=1
Definition Correction-1 Implementation Start: GO RECEIVED / CONSUMED
Definition Correction-1 status: APPLIED
Definition status: CANDIDATE / RE-REVIEW REQUIRED
Publication status: branch commit only / PR NOT CREATED
```

## 1. Authority and exact basis

```text
GitHub live main at Correction-1 start:
  7b37f156864ac615b4fa2713ff8c949e0744ecc4

Definition branch:
  docs/ops-readiness-v1-exact-scope-definition-1

Original Definition commit:
  021477d445e9a2880ffa008bc550c473c828d510

Exact definition file:
  docs/architecture/ops-readiness-v1-exact-scope-definition-1.md
```

このDefinitionは、上記mainを基準にOperational Readinessの条件だけを固定する。

main以外の未マージ変更を本番状態の根拠として扱わない。

過去のSecurity、Release、Demo、Tenant Isolationの判定を再解釈しない。

既存GateのPASSをOperational Readiness PASSへ読み替えない。

Correction-1はIndependent Definition Review-1のP1-1、P1-2、P1-3、P2-1だけを閉じる。

## 2. Purpose

OPS-READINESS-V1の目的は、特定担当者に依存せず、法人がアプリを管理、更新、停止、復旧、引き継ぎできる本番運用条件を定義することである。

Operational Readinessは、アプリの機能完成度とは別の本番条件として扱う。

```text
Application works
  !=
Organization can safely operate and maintain it
```

Operational Readinessは、Security Readiness、Release Readiness、Tenant Isolation、Pilot / Field Evaluationの代替ではない。

Operational Readinessは、Production Binding、LIVE WRITE、Deployの権限を付与しない。

## 3. Operational Readiness domains

OPS-READINESS-V1は次の7領域を対象とする。

```text
O1 法人所有・継続管理性
O2 権限・引き継ぎ
O3 更新・制度改定
O4 障害時停止
O5 rollback / 復旧
O6 紙・デジタル移行とPilot評価の運用条件
O7 第三者運用テスト
```

### 3.1 O1 法人所有・継続管理性

コード、設定、運用資料、管理権限について、担当者個人の継続在籍または個人アカウントの存続だけを継続条件とする状態を、本番運用可能とは扱わない。

法人が管理権限を承継または復旧できる所有・管理モデルを要求する。

少なくとも次を確認可能にする。

```text
管理対象
現在の管理主体
法人側の責任主体
代替管理者または復旧経路
権限承継手順
担当者不在時のアクセス回復方法
```

GitHubについて、user-owned repositoryで個人Ownerだけが所有権移管または管理継続の唯一の経路となる状態は、原則としてO1 PASSにしない。

将来の候補は次のいずれかとする。

```text
A. 法人管理可能なGitHub Organization等へ移管し、法人が継続管理できる。

B. Organization移管と同等の法人継続性を証明できる代替統制を定義し、
   Humanが明示承認する。
```

このDefinitionは移管方式または代替統制をまだ選択しない。

GitHub ownership transfer自体は別Human GOを必要とする。

### 3.2 O2 権限・引き継ぎ

GitHub、Microsoft 365、SharePoint、アプリ設定、運用資料について、誰が何を管理できるかを一覧化する。

担当者の異動、長期不在、退職が発生しても、管理状態を確認し、必要な引き継ぎまたは復旧を開始できることを要求する。

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

直前の正常状態を一意に識別できることを要求する。

アプリのrollbackとデータのrecoveryを同一操作として扱わない。

少なくとも次を区別する。

```text
APP ROLLBACK
DATA MIGRATION / RECOVERY
```

Last Known Goodは、単なるversion名または「前の版」という表現だけでは識別したことにしない。

少なくとも次の識別情報を保持または再確認できる方式を要求する。

```text
source SHA
release / solution version
artifact identity
artifact hash where an artifact exists
target environment
relevant configuration identity
schema / data compatibility status
```

復旧対象にschema変更またはdata migrationが含まれる場合は、APP ROLLBACK可能であることをDATA RECOVERY可能と読み替えない。

復旧手順の文書が存在するだけではPASSにしない。

安全な模擬復旧または同等の実行証跡を要求する。

### 3.6 O6 紙・デジタル移行とPilot評価の運用条件

O6は、Pilot / Field Evaluation GateそのものをPASSさせる領域ではない。

O6は、紙・デジタル併用を含むPilotを安全かつ比較可能に実施し、結果を責任者が判断できるための運用条件を定義する。

Operational Readinessで要求するのは、少なくとも次である。

```text
紙を一律廃止しない方針
Pilot対象範囲の明示
評価項目の定義
評価方法の定義
紙を残す判断を許容すること
結果と残存課題の保存方法
責任者への判断材料の提示方法
```

最低限、次の観点をPilot評価項目の候補とする。

```text
入力しやすさ
記録の探しやすさ
情報共有のしやすさ
振り返りへの利用価値
紙との二重作業の増減
```

O6 PASSは「Pilotを評価できる運用条件が整った」ことを意味する。

O6 PASSは「Pilot結果が良好だった」ことを意味しない。

実際の試行結果、現場評価、採用範囲、残存リスクのPASS / HOLDは、独立した `Pilot / Field Evaluation` Gateで判定する。

### 3.7 O7 第三者運用テスト

開発担当者本人以外の職員が、運用資料だけを用いて主要な管理情報へ到達できることを確認する。

Handover Drillでは、少なくとも次を確認する。

```text
現在のアプリVersionを確認できる
管理者と権限一覧を確認できる
障害時停止の手順を説明できる
Last Known Goodを識別できる
障害時の連絡・エスカレーション経路を確認できる
```

開発担当者の口頭補助が不可欠な場合はPASSとしない。

## 4. Acceptance Criteria

OPS-READINESS-V1のAcceptance Criteriaを次のように固定する。

```text
OPS-AC1
開発担当者本人が不在でも管理情報を確認できる。

OPS-AC2
本番運用に必要な主要資産について、担当者個人の継続在籍または個人アカウントの存続を唯一の継続条件にしない。
法人が管理権限の承継または復旧を実行できる状態を証明する。

OPS-AC3
障害時または整合性不明時に新規書込みを安全側へ停止できる。

OPS-AC4
Last Known Goodを、source SHA、release / solution version、artifact identity / hash、target environment、relevant configuration、schema / data compatibilityを用いて必要十分に識別し、適用可能な復旧手順を実行または安全に検証できる。

OPS-AC5
制度改定時に、一次資料または法人決定 -> 影響分析 -> Definition / 設計 -> Implementation -> Test -> Review -> Human GO -> Release -> 変更履歴保存を追跡できる。

OPS-AC6
紙運用を一律廃止せず、Pilot対象、評価項目、評価方法、結果保存、責任者判断の手順を定義できる。
実際のPilot結果のPASS / HOLDは別のPilot / Field Evaluation Gateで判定する。

OPS-AC7
開発非担当者によるHandover Drillを実施する。

OPS-AC8
Operational Readiness FAILまたは必要証跡不足ならProduction GO eligibilityを満たさない。

OPS-AC9
Runbookの存在だけをPASS条件にしない。
実際に第三者が使用できること、または対象手順を安全に検証できることを証明する。

OPS-AC10
Operational Readiness PASSはDeploy / Production Binding / LIVE WRITEを自動承認しない。
```

### 4.1 Acceptance Criteria applicability rule

このアプリのOPS-READINESS-V1では、`OPS-AC1` から `OPS-AC10` を原則として **ALL MANDATORY** とする。

単に「今回は不要」と判断してAcceptance Criteriaを除外してはならない。

例外的に `NOT APPLICABLE` を使用する場合は、少なくとも次を記録する。

```text
criterion ID
N/A reason
target environment / scope
why the risk does not apply
alternative control where needed
Human acceptance of the N/A classification
```

N/A根拠が不足している場合は `UNKNOWN / HOLD` とする。

`UNKNOWN` をPASSへ推定しない。

## 5. Evidence model

Operational Readinessの判定は、文書の存在と実行証跡を分離する。

```text
DOCUMENTED
  手順または責任分界が定義されている。

VERIFIED
  手順が対象環境または安全な模擬条件で確認されている。

DRILLED
  開発担当者以外が手順を使用して確認できている。

NOT APPLICABLE
  4.1の条件を満たし、HumanがN/A分類を明示承認している。

PASS
  OPS-AC1〜OPS-AC10について、PASSまたは正当に承認されたN/Aの証跡が揃っている。

HOLD
  未確認、矛盾、代替不能、復旧不能、N/A根拠不足、または必要証跡不足がある。
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

目的は、システム構成、管理対象、管理主体、法人側責任主体、代替管理者または復旧経路を確認可能にすることである。

GitHub ownership transfer自体はOPS-Aに含めない。

OPS-Aは、現在の所有状態と法人継続性Gapを文書化できる。

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

Last Known Goodの識別規則はOPS-AC4と整合させる。

### OPS-D: readiness checklist and handover drill specification

```text
docs/operations/
- production-readiness-checklist.md
- handover-drill-specification.md
```

目的は、Operational Readinessの判定項目、N/A条件、第三者運用試験の実施条件を固定することである。

### OPS-E: GitHub and CI support

```text
candidate scope:
- regulatory-change Issue template
- release manifest format
- operations CI verification
```

目的は、変更履歴と運用文書の最低限の整合性を自動確認できるようにすることである。

Release manifest候補は、Last Known Goodのsource / artifact / environment / configuration識別を支援する。

自動検査はHuman acceptance、N/A判断、Handover Drillを代替しない。

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

`Operational Readiness PASS` は、Pilotを実施・評価する運用条件が整っていることを含むが、実際のPilot / Field Evaluation PASSを含まない。

`Production GO ELIGIBLE` はProduction mutationそのものではない。

別途Human Production GOを必要とする。

Operational ReadinessだけがPASSしても他Gateを代替しない。

## 8. GitHub ownership boundary

現在のrepository ownership状態を、このDefinitionでは変更しない。

本番運用時には、担当者個人の継続在籍または個人アカウントの存続を唯一の継続条件としない。

GitHubについては、次のいずれかを本番前に証明する。

```text
A. 法人管理可能な所有・管理主体へ移行済みである。

B. Aと同等の法人継続性を持つ代替統制が定義・検証され、Humanが明示承認している。
```

候補には、法人管理可能なGitHub Organization、複数管理者、CODEOWNERS、branch protection等を含められる。

CODEOWNERSまたは複数collaboratorだけを、repository ownership continuityの証明とは扱わない。

具体的な移管方式、管理者数、権限設定、代替統制は別Sliceで確認してから決定する。

Definition acceptanceをGitHub ownership transfer GOとして扱わない。

## 9. Rollback boundary

アプリrollbackは、過去の正常sourceを用いた新しいreleaseとして実施できる設計を候補とする。

既存version番号を巻き戻すことを前提にしない。

Last Known Goodは少なくとも次を照合できるものとする。

```text
source SHA
release / solution version
artifact identity / hash
target environment
relevant configuration
schema / data compatibility
```

データ変更を含むreleaseは、APP ROLLBACKだけで安全性を証明したことにしない。

schema変更またはdata migrationがある場合は、別途recovery条件を固定する。

破壊的schema変更よりadditive migrationを優先する方針は、将来のmigration Definitionで評価する。

## 10. Pilot boundary

PilotはProductionの代替ではない。

Operational ReadinessのO6は、Pilotを安全かつ比較可能に実施・評価する運用条件を扱う。

実際のPilot結果の判定は `Pilot / Field Evaluation` Gateが扱う。

Pilotで合成データのみを使用する場合、その結果を実データProductionの安全性証拠へ自動昇格しない。

紙・デジタル比較は、業務全体を一律に電子化するためではなく、導入価値と残存リスクを確認するために行う。

## 11. Review requirements

このCorrection-1後のDefinitionはIndependent Definition Re-Reviewを受ける。

Re-Reviewでは少なくとも次を確認する。

```text
R1 O1-O7が責任者懸念を過不足なく扱っているか
R2 OPS-AC1-10が観測可能な条件になっているか
R3 DOCUMENTEDとPASSが混同されていないか
R4 Operational ReadinessがDeploy権限へ昇格していないか
R5 OPS-A〜GのSlice間で責任範囲が重複しすぎていないか
R6 OPS-Fが既存のauthorization / LIVE WRITE境界を破らない定義になっているか
R7 rollbackとdata recoveryが分離されているか
R8 Pilot結果をOperational ReadinessまたはProduction安全性へ二重計上していないか
R9 Handover Drillが開発担当者本人への依存を実際に検査できるか
R10 既存Security / Release / Tenant Isolation Gateを再解釈していないか
R11 法人所有・継続管理性が個人Owner依存をfail-closedに扱っているか
R12 OPS-AC1〜10のN/A規則がfail-closedであるか
R13 Last Known Goodを復旧可能性の判断に足りるidentityで識別しているか
```

P0 / P1 / P2がある場合は、Definition Acceptanceへ進まない。

## 12. Correction-1 disposition

Independent Definition Review-1の指摘を次のように処理する。

```text
P1-1 O6 / Pilot Field Evaluation responsibility collision
  -> CORRECTED
  O6 = Pilot評価の運用条件
  Pilot / Field Evaluation = 実際の試行結果判定

P1-2 Corporate ownership continuity condition insufficiently fail-closed
  -> CORRECTED
  個人の継続在籍・個人アカウント存続を唯一の継続条件にしない。
  user-owned repository + individual Owner only は原則O1 PASS不可。
  法人管理主体または同等のHuman-approved代替統制を要求する。

P1-3 Acceptance Criteria applicability / N/A rule undefined
  -> CORRECTED
  OPS-AC1〜10 = ALL MANDATORYを原則とする。
  N/Aは理由・scope・risk不適用根拠・代替統制・Human acceptanceを要求する。
  不明はUNKNOWN / HOLD。

P2-1 Last Known Good identity requirements insufficiently exact
  -> CORRECTED
  source SHA / release or solution version / artifact identity and hash /
  target environment / relevant configuration / schema-data compatibilityを要求する。
```

Correction-1の自己申告 `CORRECTED` は独立Re-ReviewのPASSを意味しない。

## 13. Current status after Correction-1

```text
OPS-READINESS-V1:
  DEFINITION CANDIDATE / CORRECTION-1 APPLIED

Definition Start:
  GO RECEIVED / CONSUMED

Independent Definition Review-1:
  CORRECTION REQUIRED / HOLD
  P0=0 / P1=3 / P2=1

Definition Correction-1 Implementation Start:
  GO RECEIVED / CONSUMED FOR THIS FILE ONLY

Definition Correction-1:
  APPLIED

Independent Definition Re-Review-1:
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

PR:
  NOT CREATED

Ready / Merge:
  NOT AUTHORIZED

Production Binding:
  NO

LIVE WRITE:
  NO

Deploy:
  NO
```

## 14. STOP

このDefinition Correction-1 commitで作業を停止する。

Runbookを作成しない。

Issue template、release manifest、CI verificationを実装しない。

MaintenanceModeまたはWriteEnabledを実装しない。

管理者システム状態画面を実装しない。

GitHub ownershipを変更しない。

SharePoint、M365、Entra、App Catalogを変更しない。

PRを作成しない。

Ready、Merge、Production Binding、LIVE WRITE、Deployへ進まない。

次の候補Gateは **OPS-READINESS-V1 Independent Definition Re-Review-1** である。
