# Completion Progress Model

この文書はロードマップ上の進捗率の読み方を定義します。

進捗率は責任者との共有を容易にする説明用の指標です。

進捗率をAcceptance、Gate、Implementation Start、Mutation GO、Ready、Merge、Production GOの根拠に使用してはいけません。

## Markers

| Marker | Meaning |
| --- | --- |
| 70〜75% | 設計・契約・SPFx shell・synthetic認可基盤が進行している現在地の概算 |
| 約85% | RESPONSIBLE-PERSON-DEMO-V1を満たし、責任者が主要業務フローを画面でレビューできる |
| 約90% | LIVE-SHAREPOINT-V1を満たし、テスト用SharePoint / Entra境界で主要業務フローが動く |
| 約95% | TWO-SITE-PILOT-V1を満たし、Isogo / Honmokuで主要業務フローと事業所分離を確認できる |
| 100% | PRODUCTION-READY-V1を満たし、本番deployとproduction smokeまで完了している |

## Rule

各Markerへの到達は、対応PhaseのAcceptance Criteriaによって判断します。

単純なIssue数、PR数、コミット数、テスト数から進捗率を自動算出しません。

未解決の安全・権限・データ分離上のblockerがある場合、数値だけを理由に次Phase完了と扱いません。
