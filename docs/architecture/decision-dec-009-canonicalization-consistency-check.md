# DEC-009 正本化 — 整合確認

Status: **CONSISTENT**（docs-internal / 2026-08-09）

本確認は Acceptance PR 上の docs 整合である。
Merge 後の FINAL CONSISTENT は別記録で確定してよい。

## 1. 確定した範囲

DEC-009 は、AssessmentSnapshot 保存タイミングの業務意味だけを Accepted / LOCKED とする。

```text
DEC-009: Accepted / LOCKED / Option A
アセスメント作成途中: 下書き扱い
正式記録: 確定時に保存
確定後の修正: 元の確定記録を残す
修正後: 新しい版として保存する
既存確定記録の上書き: NOT ADOPTED
履歴: 保持する
```

## 2. 整合確認

| Check | Result |
|---|---|
| Human Option A が Acceptance に固定されている | **PASS** |
| 下書き ≠ 正式記録 が維持されている | **PASS** |
| 確定時保存が明示されている | **PASS** |
| 確定後修正で元記録保持 + 新版保存が明示されている | **PASS** |
| 既存確定記録の上書きが NOT ADOPTED | **PASS** |
| 履歴保持が明示されている | **PASS** |
| AS-EC-1 overall を Entry satisfied にしていない | **PASS** |
| GOV-AUD-03 Option E を再定義していない | **PASS** |
| FindingCode / A-5 / Implementation Start を開始していない | **PASS** |
| `src/**` / `tests/**` を変更していない | **PASS** |

```text
Contradiction found: NONE
Verdict: CONSISTENT（docs-internal）
FINAL CONSISTENT: after Human Merge（別記録可）
```

## 3. 開いたままの Decision / Entry

```text
Decision-AS-EC-1 overall: HOLD
AS-EC-1 remaining examples:
  Finding / findingIds 境界
  NOT_APPLICABLE reason
  Schema / DTO versioning
  型・validator・fixture 計画
post-retention deletion: OPEN（別単位）
```

## 4. 維持する HOLD

```text
FindingCode: HOLD
A-5: HOLD
Implementation Start: HOLD
SharePoint / M365 / Deploy / real data: NO-GO
```

## 5. Next

```text
Independent Review → Human Ready / Merge
→ Merge 後 FINAL CONSISTENT 同期（別 PR 可）
次 residual Decision: NOT auto-selected
```
