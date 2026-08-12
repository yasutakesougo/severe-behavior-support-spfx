# RESPONSIBLE-PERSON-DEMO-V1

この文書はPhase 1の責任者レビュー可能版の完了条件を整理します。

Tracking: #299

## Goal

責任者が、完成後の主要業務フローを画面から具体的にイメージできる状態を作ります。

## Required review path

1. 概要ダッシュボードを確認する。
2. 利用者一覧を開く。
3. 利用者詳細を開く。
4. 支援計画を確認する。
5. 日々の記録を確認する。
6. 見直し状況を確認する。
7. 期限接近や確認待ちなどの状態を確認する。

## Acceptance Criteria

- 完全合成データのみを使用する。
- 主要画面の見た目と操作順序が一貫している。
- live SharePoint / Entra未接続を完成機能と誤認させない。
- 既存のfail-closed、site selection、keyboard / focus、responsive boundaryを維持する。
- 責任者が用語、情報優先順位、操作順序、管理上必要な情報をレビューできる。
- レビュー結果を後続実装へ反映できる形で記録する。

## Explicit OUT

- SharePoint live read / write
- Entra group creation
- membership mutation
- 実利用者データ
- Production deploy
- この文書単独によるImplementation Start

## Review questions

責任者レビューでは、少なくとも次を確認します。

- 最初の画面で判断に必要な情報が見えるか。
- 現場で使う用語と一致しているか。
- 利用者を探して必要な情報へ到達しやすいか。
- 支援計画、記録、見直しの関係が分かるか。
- 期限接近や確認待ちが見落としにくいか。
- 不要な情報や誤解を招く表示がないか。
- 責任者として追加で確認したい情報があるか。
