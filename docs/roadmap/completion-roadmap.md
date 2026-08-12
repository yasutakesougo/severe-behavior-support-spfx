# Completion Roadmap — MVP to Production

この文書は、強度行動障害支援SPFxアプリの現在地から本番完成までを、責任者・現場・開発で共有するための工程表です。

このロードマップは進捗管理用です。

既存のAccepted / LOCKED Decision、HOLD、Human gate、Implementation Start、SharePoint / Entra / M365 mutation、Deploy / Production GOを変更または認可しません。

## 現在地と到達目安

現在地の概算は70〜75%です。

進捗率は説明用の目安であり、Acceptance、Gate、実装認可の根拠にはしません。

| Phase | 到達目安 | 目的 | Tracking |
| --- | ---: | --- | --- |
| 現在地 | 70〜75% | 設計・契約・SPFx shell・synthetic認可基盤まで進行 | #298 |
| Phase 1 | 約85% | 責任者レビュー可能版 | #299 |
| Phase 2 | 約90% | SharePoint / Entra 実接続版 | #300 |
| Phase 3 | 約95% | Isogo / Honmoku 2事業所検証版 | #301 |
| Phase 4 | 100% | 本番運用可能版 | #302 |

## Phase 1 — RESPONSIBLE-PERSON-DEMO-V1

責任者が完成後の業務を画面で具体的にイメージできる状態を作ります。

完全合成データのみを使用します。

少なくとも次の画面と状態を、一連の流れとして確認できる状態を目標にします。

- 概要ダッシュボード
- 利用者一覧
- 利用者詳細
- 支援計画
- 日々の記録
- 見直し状況
- 期限接近、確認待ちなどの状態表示
- PC画面として一貫したデザイン

責任者にPC画面を見せながら主要業務フローを説明できれば、このPhaseの目的を満たします。

live SharePoint / Entraが未接続であることは画面または説明上で明示します。

責任者レビューでは、用語、情報の優先順位、操作順序、不要情報、管理者に必要な情報を確認します。

Tracking: #299

## Phase 2 — LIVE-SHAREPOINT-V1

責任者レビュー後に固定した主要画面を、SharePoint / Entraの実環境境界へ接続します。

主な対象は次のとおりです。

- Accepted済みSharePoint列の実在確認
- Internal Name、Column Type、Choice等の照合
- binder / mapping
- SharePoint read / write
- error、unknown、permission failure時のfail-closed
- Entra membershipからAuthorizationContextへの接続
- role / site boundaryの実環境検証

テスト用SharePointデータで主要業務フローを一周できる状態を目標にします。

権限不足や取得失敗を許可側へ倒してはいけません。

Tracking: #300

## Phase 3 — TWO-SITE-PILOT-V1

同一SPFxアプリをIsogo / Honmokuの2事業所で再現し、事業所分離と現場条件を検証します。

主な確認対象は次のとおりです。

- 同一コードでの2事業所展開
- SiteIdによる事業所分離
- role / membership / SiteIdのE2E
- 主要業務フローE2E
- 実業務PC
- 実ブラウザ
- 実ネットワーク
- performance baseline
- 通信失敗、データなし、権限拒否、更新競合などの異常系

他事業所のデータへ意図せずアクセスできないことを確認します。

2事業所で同じアプリを再現でき、主要業務フローが成立する状態を目標にします。

Tracking: #301

## Phase 4 — PRODUCTION-READY-V1

2事業所パイロット後に、本番運用可能であることを確認します。

主な確認対象は次のとおりです。

- production build
- security / authorization final verification
- audit / retention evidence
- accessibility verification
- performance acceptance
- deployment procedure
- rollback procedure
- Human Production GO
- production deployment
- production smoke
- operational handoff

このPhaseの完了を全体100%とします。

100%はコードを書き終えた状態ではありません。

主要業務フロー、権限、事業所分離、2事業所再現、性能、アクセシビリティ、監査、rollback、production deploy、production smokeまで確認された状態です。

Tracking: #302

## 推奨する実施順序

次の順序で進めます。

1. RESPONSIBLE-PERSON-DEMO-V1を完成させる。
2. 責任者レビューを実施する。
3. レビュー結果を反映し、主要UIを安定させる。
4. LIVE-SHAREPOINT-V1で実環境接続を進める。
5. TWO-SITE-PILOT-V1で2事業所検証を行う。
6. PRODUCTION-READY-V1で本番要件を検証する。
7. Human Production GO後に本番公開する。

## Governance boundary

このロードマップは、既存の個別Decisionを上書きしません。

各実装sliceは、既存のSelection、Acceptance、Independent Review、Implementation Start、Ready、Merge、Mutation GOなどのgateに従います。

ロードマップ上で次Phaseになったことだけを理由に、未認可の実装や外部mutationを開始してはいけません。

## Tracking

Parent roadmap: #298

Phase issues:

- #299 — RESPONSIBLE-PERSON-DEMO-V1
- #300 — LIVE-SHAREPOINT-V1
- #301 — TWO-SITE-PILOT-V1
- #302 — PRODUCTION-READY-V1
