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

## provider境界

`src/contracts/ports.ts`はproviderのポートだけを定義する。認証、SharePoint、SPFx、保存、provisioningの実装はこのPRに含めない。

contracts層にはdemo data、fallback data、実運用データ、利用者識別子、具体的な支援内容を置かない。providerが結果を返せない場合は、呼び出し側が`UNKNOWN`または`FETCH_FAILED`として扱い、許可や保存へ倒さない。

## fixture境界

テストfixtureは`tests/contracts/fixtures.ts`に新規作成した合成値だけを使う。日付は固定日、識別子・fingerprint・手順参照は`synthetic-*`で表す。現行システムのコード、データ、fixtureは参照・移植しない。
