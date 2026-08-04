# 強度行動障害支援アプリ

同一法人・同一Microsoft 365テナント内の複数事業所で利用する、強度行動障害支援アプリの新規開発リポジトリです。

このリポジトリはPrivateで運用します。

現行システムのfork、複製、Git履歴の継承は行いません。

## 現在の工程

現在は、業務契約と再利用境界を設計する準備段階です。

SPFx画面、SharePoint接続、データ移行、パイロット、本番公開は開始していません。

| 対象 | 判定 |
|---|---|
| 新規リポジトリの初期化 | GO |
| 合成fixtureを前提とするcontracts設計 | 条件付きGO |
| 現行domainロジックの再構成 | HOLD |
| SPFx実装 | HOLD |
| SharePoint接続 | HOLD |
| データ移行 | NO-GO |
| パイロット・本番公開 | NO-GO |
| 現行キオスクの変更 | 禁止 |

## 再利用境界

現行システムからは、承認済みの業務上の意味と境界条件だけを参照します。

現行の画面、保存処理、SharePoint列、権限設定、公開処理、利用者識別子、事業所固有値は持ち込みません。

実在情報または匿名化状態を確認できない情報は持ち込みません。

テストデータは、実値を加工せず、合成値だけで新規作成します。

## 想定する構成

```text
docs/
  architecture/
  decisions/
src/
  domain/
  contracts/
  application/
  infrastructure/
  webparts/
tests/
  domain/
  contracts/
  fixtures/
tools/
  migration/
```

ディレクトリは、その工程を開始するときに必要なファイルとともに追加します。

空の構造だけを先行して固定しません。

## 参照元

一次棚卸しの参照元は、`yasutakesougo/audit-management-system-mvp`の`61de858fc30fff1d4eff0052082b54b591a344c3`です。

参照元の情報は、新しい設計の根拠として再確認します。

参照元のファイルを、そのままコピーする許可を意味しません。
