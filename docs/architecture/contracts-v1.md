# Contracts v1 foundation

この文書は、`severe-behavior-support-spfx`の最初のcontracts基盤の境界を固定する。

## 基本契約

- `DeploymentContext`は`OrganizationId`、`SiteId`、`TimeZone`を必須とする。
- 日付はタイムゾーンを含まないISO 8601の暦日`YYYY-MM-DD`とし、基準タイムゾーンは`Asia/Tokyo`とする。
- 認証、役割、アクセス判定は、入力が`EMPTY`、`UNKNOWN`、`FETCH_FAILED`、不一致、または未知の役割なら許可しない。
- 支援手順は、手順本文ではなく、`APPROVED`状態の`ProcedureId`と`ProcedureVersion`だけを参照する。
- 実施記録は、組織・事業所スコープ、`RecordId`、`IdempotencyKey`、承認済み手順参照、暦日、payload fingerprintを持つ。
- 既存記録の照会が`UNKNOWN`または`FETCH_FAILED`なら、新規保存を許可しない。
- 同一記録・同一冪等キー・同一fingerprintだけを再送として扱い、それ以外の既存記録との衝突は拒否する。

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

認証、SharePoint、SPFx、保存、provisioningの実装はこのPRに含めない。

contracts層にはdemo data、fallback data、実運用データ、利用者識別子、具体的な支援内容を置かない。

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
