# Contracts v1 foundation

この文書は、`severe-behavior-support-spfx`の最初のcontracts基盤の境界を固定する。

## 基本契約

- `DeploymentContext`は`OrganizationId`、`SiteId`、`TimeZone`を必須とする。
- 日付はタイムゾーンを含まないISO 8601の暦日`YYYY-MM-DD`とし、基準タイムゾーンは`Asia/Tokyo`とする。
- 認証、役割、アクセス判定は、入力が`EMPTY`、`UNKNOWN`、`FETCH_FAILED`、不一致、または未知の役割なら許可しない。
- 支援手順は、手順本文ではなく、`APPROVED`状態の`ProcedureId`と`ProcedureVersion`だけを参照する。
- 実施記録は、組織・事業所スコープ、`UserId`、`RecordId`、`IdempotencyKey`、承認済み手順参照、暦日、payload fingerprintを持つ。
- `UserId`は`SiteId`と分離し、氏名、生年月日、住所等の個人属性を含めない。
- 既存記録は`RecordId`と`IdempotencyKey`を独立して照会する。
- いずれかの照会が`UNKNOWN`または`FETCH_FAILED`なら、新規保存を許可しない。
- 両照会が`EMPTY`の場合だけ新規保存を許可する。
- 両照会が同一記録を返し、incomingと組織・事業所・利用者・手順版・暦日・RecordId・IdempotencyKey・fingerprintがすべて一致した場合だけ再送として扱う。
- RecordId・IdempotencyKey・fingerprintが一致しても、利用者、事業所、手順版、暦日等の不変コンテキストが異なる場合は`RECORD_CONTEXT_MISMATCH`として拒否する。
- 同じ`RecordId`・異なるキー、異なる`RecordId`・同じキー、同じキー・異なるpayload、二つの照会が異なる記録を返す状態はすべて競合として拒否する。

## 正式な業務ロール

contractsの正式なアプリケーションRoleは次の7つとする。

```text
SUPPORTER
PLANNER
SERVICE_MANAGER
SITE_ADMIN
ORG_ADMIN
SYSTEM_ADMIN
VIEWER
```

旧候補の`SUPERVISOR`、`REVIEWER`、`ADMIN`は正本として使用しない。

未知のRoleはidentity側とrequiredRoles側のどちらに含まれる場合もfail-closedで拒否する。

## Authorization / SiteContext（#21-A）

`AuthorizationContext` / `SiteContext` は認可真理値の純契約である（#28 display-only とは分離）。

```text
AuthorizationContext:
  Subject
  UserId          （SiteId と分離）
  OrganizationId
  SiteContext:
    Memberships[]  （SiteId + Roles；選択とは独立）
    SelectedSiteId （明示選択のみ；null = 未選択）
```

規則:

- 許可 SiteId token は `SITE-ISG` / `SITE-HOM` のみ（fixture / schema）。
- `SelectedSiteId` を membership 配列順や先頭要素から推論しない。
- 単一所属でも未選択なら `SITE_SELECTION_REQUIRED`。
- 選択サイトが Memberships に無い場合は `SITE_NOT_IN_MEMBERSHIP`。
- Role を display name / email / URL / SharePoint path から推論しない。
- `evaluateAuthorizationAccess` はサイト解決後に既存 `evaluateAccess` を再利用する。
- Graph / Entra / SharePoint I/O は含めない。

## Authorization Context Resolver（#21-B）

`composeAuthorizationContext` / `evaluateResolvedAuthorizationAccess` は、
provider 結果を `AuthorizationContext` へ合成する純オーケストレーションである。

```text
AuthorizationPrincipal:
  Subject
  UserId
  OrganizationId

SiteMembershipProvider.resolveMemberships(principal)
  → LookupResult<SiteMembership[]>

composeAuthorizationContext:
  principal LookupResult
  + memberships LookupResult
  + selectedSiteId（明示のみ）
  → LookupResult<AuthorizationContext>
```

規則:

- `SelectedSiteId` を membership 配列順や単一所属から推論しない。
- provider の EMPTY / UNKNOWN / FETCH_FAILED を成功へ変換しない。
- inactive / disabled は principal LookupResult 失敗へ写像する（AccountStatus 語彙を作らない）。
- zero membership は認可しない（評価は `evaluateAuthorizationAccess` に委譲）。
- `evaluateResolvedAuthorizationAccess` は合成後に `evaluateAuthorizationAccess` を再利用し、判定規則を再実装しない。
- `InMemorySiteMembershipProvider` は合成 fixture 用 double であり、Graph / Entra / SharePoint I/O を持たない。

## 命名境界

contractsで使用するTypeScriptプロパティ名は、JSON契約の正本として扱う。

将来追加するSharePoint列の内部名、画面表示名、Entra IDグループ名とは同一視しない。

SharePoint adapterは、外部の列名とcontractsのプロパティ名を明示的に変換する。

アプリケーションRoleは、Entra IDグループまたはSharePointグループからadapter層で変換する。

`CONTRACT_VERSION`（例: `contracts-v1`）は共通Contract基盤の世代名である。

個別契約の安定識別子は Schema ID、互換性版は Schema Version（SemVer）とする（DEC-1）。

DTO Versionは Schema Versionと同一値とする。Schema IDはSharePoint List名やTypeScript型名と同一視しない。

SupportPlan系の正式値（Issue #42）:

```text
severe-behavior-support.support-plan.plan @ 1.0.0
severe-behavior-support.support-plan.plan-version @ 1.0.0
```

SupportPlanVersionProcedureBinding（Issue #347 / Option A2 / Design-FIELD-WORKFLOW-CONTRACT-A-MIN-SHAPE-1）:

```text
severe-behavior-support.support-plan.version-procedure-binding @ 1.0.0
```

ProcedureRecord（Issue #352 / Decision-FIELD-WORKFLOW-CONTRACT-B-PKG-1）:

```text
severe-behavior-support.procedure-record.record @ 1.0.0
```

AssessmentSnapshot系の正式値（Decision-AS-SCHEMA-ID-1 / Decision-AS-SCHEMA-VERSION-1）:

```text
severe-behavior-support.assessment-snapshot.snapshot @ 1.0.0
```

```text
NOTE:
  上記は論理 Schema ID / Schema Version の Accepted 値である。
  TypeScript / DTO / SharePoint への割当・実装は別 Human GO まで DO NOT START。
```

対応表のContract側正本: `docs/architecture/sharepoint-contract-mapping.md`

## 日付検証

`LocalDate`はTypeScript上のブランド付き文字列である。

実行時には、次の条件をすべて検証する。

- `YYYY-MM-DD`形式である。
- 実在する暦日である。
- 時刻、UTCサフィックス、タイムゾーンオフセットを含まない。
- 解釈基準は`Asia/Tokyo`である。

## provider境界

`src/contracts/ports.ts`はproviderのポートだけを定義する。

`ExecutionRecordProvider`は次の3操作を提供する。

```text
findByRecordId
findByIdempotencyKey
save
```

認証、SharePoint、SPFx、保存、provisioningの具体実装はcontractsに含めない。

contracts層にはdemo data、fallback data、実運用データ、実在する利用者識別子、具体的な支援内容を置かない。

providerが結果を返せない場合は、呼び出し側が`UNKNOWN`または`FETCH_FAILED`として扱い、許可や保存へ倒さない。

## fixture境界

テストfixtureは`tests/contracts/fixtures.ts`に新規作成した合成値だけを使う。

日付は固定日、識別子・fingerprint・手順参照は`synthetic-*`で表す。

現行システムのコード、データ、fixtureは参照・移植しない。

## 暫定ツールチェーン

リポジトリ直下の`package.json`は、SPFx生成前にcontractsを検証するための暫定構成である。

Node.jsは`22.23.1`に固定する。

依存パッケージは再現性を維持するため完全固定する。

```text
@types/node: 22.20.1
tsx: 4.20.3
typescript: 5.9.2
```

SPFx生成時は、SPFx 1.23.2が要求するTypeScript、React、Heft、Webpackの構成を正本とし、この暫定構成を統合または置換する。

contractsの型とテストを、SPFx固有の依存関係へ直接依存させない。

## contracts専用CI

`.github/workflows/contracts-ci.yml`は、contractsに関係するPRと`main`へのpushで次を実行する。

```text
npm ci
npm run typecheck
npm test
npm run check:contracts-boundaries
git diff --check
```

workflow権限は`contents: read`だけとする。

Secrets、deploy、publish、SharePoint接続、Entra ID変更、Microsoft 365書込みは行わない。

`scripts/ci/check-contracts-boundaries.mjs`は、`src/contracts`と`tests/contracts`について次を拒否する。

- React、SPFx、PnPjs、SharePoint REST、ブラウザglobalへの依存
- `process.env`によるsecret参照
- Token、Bearer credential、client secretの疑いがある文字列
- メールアドレス、電話番号、郵便番号の疑いがある値
- Deprecated事業所識別子
- `synthetic-`接頭辞を持たないfixture識別子
