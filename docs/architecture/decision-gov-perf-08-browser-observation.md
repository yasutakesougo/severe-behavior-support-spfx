# GOV-PERF-08 — 対象ブラウザ read-only observation

この文書は、**GOV-PERF-08**（対象ブラウザ）の
**read-only observation** 結果である。
ブラウザ設定変更・自動採択・HOLD 解除 Acceptance ではない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: GOV-PERF-08
Kind: read-only observation
Observation date: 2026-08-12
Observer context: Cursor Cloud Agent VM
Baseline tip: e64ad1d035d5e071841a5d19ced5f6e3c7abf407
PR: #286
Mutation: NONE
HOLD status: UNCHANGED
```

## 1. Required fields

| Field | Required for HOLD解除 |
|---|---|
| 実際の業務端末で使用するブラウザ | YES |
| バージョン | YES |
| 更新管理方法 | YES |

## 2. Observed（Cloud Agent VM only）

```text
Browser present on Agent VM: Google Chrome
Path: /usr/local/bin/google-chrome
Version observed: 148.0.7778.96
Managed policy directory: NOT FOUND（/etc/opt/chrome/policies 等なし）
Update management method (org): NOT OBSERVED
Microsoft Edge / Firefox: NOT OBSERVED as installed primary on this VM
```

## 3. Trial / business terminal browser（required）

```text
業務端末ブラウザ名: NOT OBSERVED / VALUE NOT DETERMINED
業務端末バージョン: NOT OBSERVED / VALUE NOT DETERMINED
更新管理方法（Microsoft 365 / 組織ポリシー）: NOT OBSERVED / VALUE NOT DETERMINED
```

## 4. Judgment

```text
PERF-08 HOLD解除: 不可能（本 observation のみでは不可）
Reason:
  Agent VM の Chrome を業務ブラウザとして自動採択してはならない
  更新方針は組織運用の確認が必要
```

## 5. Non-claims

```text
This observation ≠ auto-select Edge / Chrome for PERF-08
This observation ≠ invent minimum version / update policy
This observation ≠ browser settings mutation
This observation ≠ HOLD解除 Acceptance
```
