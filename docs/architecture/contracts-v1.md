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
- 両照会が同一記録を返し、`RecordId`・`IdempotencyKey`・fingerprintが完全一致した場合だけ再送として扱う。
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

## 命名境界

contractsで使用するTypeScriptプロパティ名は、JSON契約の正本として扱う。

将来追加するSharePoint列の内部名、画面表示名、Entra IDグループ名とは同一視しない。

SharePoint adapterは、外部の列名とcontractsのプロパティ名を明示的に変換する。

アプリケーションRoleは、Entra IDグループまたはSharePointグループからadapter層で変換する。

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

SPFx生成時は、SPFx 1.23.2が要求するTypeScript、React、Heft、Webpackの構成を正本とし、この暫定構成を統合または置換する。

contractsの型とテストを、SPFx固有の依存関係へ直接依存させない。
