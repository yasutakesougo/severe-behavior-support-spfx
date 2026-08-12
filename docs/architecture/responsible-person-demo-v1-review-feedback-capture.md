# RESPONSIBLE-PERSON-DEMO-V1 — Review Feedback Capture

```text
Issue: #299 (RESPONSIBLE-PERSON-DEMO-V1)
Artifact: responsible-person review feedback capture protocol
Status: CANONICAL / DOCS-ONLY
Human gate: RESPONSIBLE-PERSON-DEMO-V1 Review Feedback Capture GO
Human gate date: 2026-08-12
Baseline main: da13fcbb32f065769ff768ec255f53427b294765
Code / SCSS mutation: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
SharePoint / Entra / live I/O: OUT
Production deploy: OUT
```

## 1. Purpose

Issue #299 の責任者レビュー結果を、後続の UI 変更候補へ追跡可能な形で渡すための正本ルールを固定する。

この文書はレビュー結果そのものではない。

この文書の作成だけで、責任者レビュー実施済み、UI変更承認済み、Implementation Start 承認済み、または #299 Close 可とは扱わない。

## 2. Review target

レビュー対象は current presentation surface とする。

- 概要ダッシュボード
- 利用者一覧
- 利用者詳細
- 支援計画
- 日々の記録
- 見直し状況
- `期限接近` / `確認待ち` 等の状態表示
- PC画面としての一貫性

表示は完全合成データのみを前提とする。

live SharePoint / Entra / binder / adapter I/O、実利用者データ、Production deploy はレビュー対象外であり、未接続のまま扱う。

## 3. Responsible-person review checklist

責任者レビューでは、少なくとも次を確認する。

### 3.1 業務フロー

- [ ] 概要から主要な対象・対応事項を説明できる。
- [ ] 利用者一覧から利用者詳細へ進む流れを理解できる。
- [ ] 利用者詳細から支援計画を確認する流れを理解できる。
- [ ] 日々の記録画面の目的を理解できる。
- [ ] 見直し状況と期限状態の表示目的を理解できる。

### 3.2 情報の優先順位

- [ ] 最初に見るべき情報が分かる。
- [ ] 次に行う操作または確認対象が分かる。
- [ ] 情報量が多すぎず、重要情報が埋もれていない。
- [ ] 制度・業務上の事実とシステム状態を混同しない。

### 3.3 表現・用語

- [ ] 画面名・見出し・ラベルが現場で理解できる。
- [ ] `確認待ち` / `期限接近` 等が、実計算済みの業務判定と誤解されない。
- [ ] 合成データ / presentation-only であることが説明できる。

### 3.4 UI consistency / accessibility observation

- [ ] PC画面として主要画面の見た目と操作感に一貫性がある。
- [ ] キーボード操作時のフォーカス位置を追える。
- [ ] 色だけに依存せず状態を理解できる。
- [ ] site selection / fail-closed boundary を壊しているように見えない。

## 4. Feedback classification

各指摘は次のいずれかに分類する。

```text
ACCEPT   = 現状で問題なし
CHANGE   = 後続UI変更候補
QUESTION = 業務・制度・設計上の追加確認が必要
BLOCKER  = #299 completion を妨げる重大な問題
```

`CHANGE` または `BLOCKER` を記録したこと自体は、コード変更・Implementation Start・Ready・Merge を認可しない。

## 5. Feedback record requirements

各 `CHANGE` / `QUESTION` / `BLOCKER` は、少なくとも次を記録する。

```text
feedbackId: RPF-###
reviewDate: YYYY-MM-DD
reviewerRole: responsible-person | operations | field | audit | maintenance | other
surface: overview | users | user-detail | support-plan | daily-record | review-status | cross-cutting
classification: CHANGE | QUESTION | BLOCKER
observation: what was observed
requestedOutcome: what should become easier / clearer / safer
reason: why the change or clarification is needed
evidence: screen / flow / label / review note reference
status: OPEN | SELECTED | IMPLEMENTED | VERIFIED | DEFERRED | REJECTED
followUpIssueOrPr: optional GitHub reference
```

実利用者名・実記録・個人情報は記録しない。

## 6. Mapping feedback to later UI work

後続UI変更へ進める場合は、feedbackId を失わず次の順に関連付ける。

```text
Responsible-person review
  -> feedbackId (RPF-###)
  -> Human slice selection
  -> explicit IN / OUT
  -> Implementation Start GO
  -> Draft PR
  -> Verification evidence
  -> Ready GO
  -> Merge GO
  -> feedback status = VERIFIED
```

Feedback Capture GO は上記の Human gate を省略しない。

複数指摘を一つの slice にまとめる場合も、PR body または decision docs から各 `RPF-###` へ追跡できること。

## 7. Review session record

実際のレビュー結果は次の正本へ記録する。

`docs/architecture/responsible-person-demo-v1-review-feedback-record.md`

初期状態は `Review execution status: NOT RUN` とする。

実際に責任者レビューを行うまで、結果を推測・代入しない。

## 8. #299 completion boundary

この artifact により、#299 Acceptance Criteria の「責任者レビュー結果を後続UI変更へ反映できる」ための記録・追跡方法は定義される。

ただし、この docs-only change は #299 Close を認可しない。

#299 の Close は、current main、技術 evidence、実際の review record、未解決 blocker を再確認した後の独立 Human gate とする。
