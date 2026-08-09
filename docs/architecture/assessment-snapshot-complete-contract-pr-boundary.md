# AssessmentSnapshot 完全契約 — 実装 PR 境界（AS-EC-1 Entry #2）

この文書は、**AS-EC-1 Entry #2** が要求する
AssessmentSnapshot 完全契約実装の **所有 Issue と PR 境界** の正本である。

Human Acceptance:
[`decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md`](./decision-as-ec-1-entry-2-ownership-pr-boundary-acceptance.md)

```text
Kind: ownership / PR-boundary record only
Status: Accepted as Entry #2 evidence（Option A）
Implementation Start: GO（domain complete-contract only；Human A after Preflight PASS）
Technical contract: assessment-snapshot-complete-contract.md
Selection: decision-ilb-1-tenth-residual-decision-selection.md
GitHub PR number: assigned by Implementation PR（PR-J）
SharePoint / DTO / Schema ID: DO NOT START
FindingCode / A-5: HOLD
```

## 1. 所有 Issue

```text
Owning Issue: #24
Track: AssessmentSnapshot 候補生成・完全契約
```

Issue #24 は Result 変換（狭域・永続なし / PR-H / GitHub PR #72）の所有でもある。
完全契約実装は同一 Issue 所有のまま、**別 PR 単位**として切り出す。

## 2. PR 境界（字母）

```text
PR letter: PR-J
Meaning: AssessmentSnapshot 完全契約実装の専用独立 PR 単位
GitHub PR #: 未採番（Implementation Start / Human GO 後に採番）
```

| 既存単位 | 字母 | 関係 |
|---|---|---|
| Result 技術設計 | PR-B / GitHub PR #51 | 前提（MERGED）。本境界に混ぜない |
| Result 変換（永続なし） | PR-H / GitHub PR #72 | 前提（MERGED）。本境界に混ぜない |
| Entry #8 技術計画 | docs-only（PR #159/#160） | 計画前提。本境界に混ぜない |
| **完全契約実装** | **PR-J** | **本境界。専用・独立** |

旧 Entry Criteria 文書の「PR-G」表記は所有表と衝突するため **廃止**する。
完全契約実装の字母は **PR-J** に固定する。

## 3. 独立境界ルール

```text
MUST:
  PR-J は完全契約実装専用とする
  他の実装単位（Finding / Handoff / AuditEvent / SupportPlan 等）と混在させない
  Result 変換（PR-H）や設計（PR-B）の再実装を同 PR に混ぜない
  Entry #5 / #6 / #7 / overall Entry satisfied を同 PR で勝手に閉じない

MUST NOT start from this boundary alone:
  TypeScript型実装
  validator実装
  fixture実装
  contract tests実装
  SharePoint / DTO / provider
  FindingCode / A-5
  Implementation Start
```

## 4. 実装開始条件（境界上のゲート）

```text
Entry Criteria / overall MET 後、Preflight PASS、明示 Human Implementation Start GO により
PR-J domain 完全契約実装を開始した。

GO 範囲: assessment-snapshot-complete-contract.md
Entry #2 Acceptance / 本境界記録だけでは実装を開始しない（履歴どおり）。
```

## 5. Explicit non-goals（GO 後も維持）

```text
SharePoint / DTO 実装: DO NOT START
AssessmentSnapshot Schema ID 採番: DO NOT START
FindingCode: HOLD
A-5: HOLD
application 保存・確定フロー: OUT（別 GO）
サービス別 NOT_APPLICABLE reason enum: FORBIDDEN
findingIds REQUIRED: NOT ADOPTED
```
