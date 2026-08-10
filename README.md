# 強度行動障害支援アプリ

同一法人・同一Microsoft 365テナント内の複数事業所で利用する、強度行動障害支援アプリの新規開発リポジトリです。

このリポジトリはPrivateで運用します。

現行システムのfork、複製、Git履歴の継承は行いません。

## 現在の工程

現在は、承認済みの業務・データ契約をSharePoint実環境へ接続する前の、schema境界確認段階です。

CN-1のread-only観測では、対象とした4つのpilot Listについて、アプリ固有のcustom columnが存在しないことを確認しました。

この観測結果は`DEFAULT_COLUMNS_ONLY`として閉鎖済みです。

SharePoint adapter、schema mapping、column provisioning、SPFx実装はまだ開始していません。

Implementation StartはHOLDです。

| 対象 | 判定 |
|---|---|
| 新規リポジトリの初期化 | GO |
| 承認済み業務・データ契約の文書化 | GO |
| 合成fixtureを前提とするcontracts設計 | 条件付きGO |
| SharePoint実環境のread-only観測 | CN-1完了 |
| SharePoint schema mapping | HOLD |
| SharePoint column provisioning | FORBIDDEN / Human GOが必要 |
| SharePoint adapter実装 | HOLD |
| SPFx実装 | HOLD |
| Implementation Start | HOLD |
| データ移行 | NO-GO |
| パイロット・本番公開 | NO-GO |
| 現行キオスクの変更 | 禁止 |

## 現在確認できているSharePoint境界

CN-1では、実テナントを変更せずに対象Listの列を観測しました。

対象ListにはSharePoint標準列のみが存在し、アプリ用のcustom columnは確認されませんでした。

したがって、存在しないInternal Nameを推測してadapterへ固定することはしません。

必要な列のDisplay Name、Internal Name、型、作成方法を決めるschema mapping / column pathは、CN-1とは別の後続unitとして扱います。

Human GOなしにSharePoint schemaを変更しません。

## 再利用境界

現行システムからは、承認済みの業務上の意味と境界条件だけを参照します。

現行の画面、保存処理、SharePoint列、権限設定、公開処理、利用者識別子、事業所固有値は持ち込みません。

実在情報または匿名化状態を確認できない情報は持ち込みません。

テストデータは、実値を加工せず、合成値だけで新規作成します。

旧実装のschemaやInternal Nameを、新しいSharePoint schemaの根拠として自動採用しません。

## リポジトリ内の正本

READMEは、プロジェクトの目的、現在地、主要な禁止境界を確認する入口です。

個別Decision、Acceptance、観測証跡、gate、handoffの詳細は`docs/`配下の文書を正本として扱います。

READMEと個別Decision文書が競合する場合は、対象Decisionの最新Accepted文書と、その後の明示的な状態遷移を優先します。

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

旧`audit-management-system-mvp`は、一次棚卸しと移行判断の参照元の一つです。

旧実装の情報は、新しい設計の根拠として必要な範囲で再確認します。

旧リポジトリの特定SHA、画面、保存処理、schema、fixture、実装を、そのまま現在の正本またはコピー元として扱いません。

現在の設計・実装判断は、このリポジトリ内でAcceptedされたDecisionと確認済みの一次情報に基づきます。
