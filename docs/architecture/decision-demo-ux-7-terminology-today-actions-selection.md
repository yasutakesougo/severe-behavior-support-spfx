# DEMO-UX-7 — Terminology canon + Today-actions navigation Selection

```text
Issue: #299（RESPONSIBLE-PERSON-DEMO-V1）
Unit: DEMO-UX-7 — Terminology canon + Today-actions navigation
Decision: Decision-DEMO-UX-7-TERMINOLOGY-TODAY-ACTIONS-1
Status: SELECTED / LOCKED
Human Selection: GO（2026-08-12）
Baseline main: 677d35922d6ebc761a5977e861a2e8e4eff8e4a6
Source feedback: RPF-Q01 + RPF-001
Follow-on queue（not this slice）: RPF-003 → RPF-002
Implementation Start: NOT AUTHORIZED
Ready / Merge: NOT AUTHORIZED
#299 Close: NOT AUTHORIZED
Production deploy: NOT AUTHORIZED
SharePoint write: NOT AUTHORIZED
```

## Authority

Human は four-perspective review（運営 / 現場 / 監査 / 保守）の評価に合意し、次 slice を次の順で進めると判断した。

1. RPF-Q01 用語正本
2. RPF-001 「今日やること」遷移
3. （後続）RPF-003 利用者一覧フィルタ
4. （後続）RPF-002 記録画面体験整理

本 Selection は **1 + 2 のみ** を SELECTED / LOCKED とする。

大規模ビジュアルデザイン改善は本 slice では行わない。業務導線を一周できるようにしてからまとめて整える。

## Goal

責任者・現場職員が、合成デモ上で次を実操作で説明できる状態へ進める。

```text
朝ここを開く
  → 未記録 / 要確認を見つける
  → 利用者または記録 / 見直しへ進む
  → 「仕事が流れるアプリ」として説明できる
```

「こういう画面を作っています」だけで終わらせない。

## Selected scope（IN）

### RPF-Q01 — 用語正本

画面横断で使う状態ラベルを次に統一する。

| Concept | Canonical label | Retired as primary label |
|---|---|---|
| Needs attention | `要確認` | `確認待ち`（primary badge/KPI）, `確認対象`（primary badge） |
| Due soon | `期限接近` | `期限間近` |
| Unrecorded | `未記録` | —（維持） |

適用面:

- Overview KPI / copy
- Users list badges / filter chip labels
- Review-due summary / item labels
- Today-actions wording that refers to the same concepts

許容する例外:

- 説明文の中で意味を補足する普通の日本語（例: 「確認が必要」「見直し期限が近い」）は残してよい
- primary badge / KPI / filter chip / summary count label の表記は Canonical に揃える

用語統一は live 判定ロジックの新設を意味しない。synthetic presentation labels の表記正本である。

### RPF-001 — 「今日やること」から遷移可能にする

Overview の Today actions を、保存なし・SharePoint write なしで画面間遷移できるようにする。

| Action row（synthetic） | CTA | Destination |
|---|---|---|
| Aさん / 支援記録が未入力 | 記録する | 記録画面（daily records） |
| Bさん / 支援計画の見直しまで… | 確認する | 見直し状況（review-due） |
| Cさん / 新しい計画があります | 見る | 利用者詳細（user detail） |

完了条件（Selection レベル）:

- 表示専用のまま、上記3導線で画面間を一周できる
- fail-closed / 事業所未選択 / 保存結果不明 / アクセス不可 / 取得失敗を正常状態へ丸めない
- DEMO / synthetic 明示を維持する

## Explicit OUT

```text
RPF-003 users list filter behavior = OUT（next slice）
RPF-002 daily-record experience cleanup = OUT（after RPF-003）
large visual redesign（color / spacing / cards / typography overhaul） = OUT
SharePoint / binder / adapter live I/O = OUT
SharePoint write / record mutation / review mutation = OUT
real user data = OUT
auth / Entra / role mutation = OUT
live due calculation / GOV-RULE change = OUT
Production deploy = OUT
#299 Close = OUT
Implementation Start / Ready / Merge auto-advance = OUT
```

## Must preserve（non-negotiable）

次は正常状態へ丸めない。本 slice でも維持する。

- `access_denied`
- `retrieval_failed`
- `save_outcome_unknown`
- `siteSelection=unselected` stop
- DEMO / synthetic / no live SharePoint 明示

## Gate separation

```text
Selection GO ≠ Implementation Start GO
Selection GO ≠ Verification GO
Selection GO ≠ Ready GO
Selection GO ≠ Merge GO
Selection GO ≠ #299 Close GO
```

次の Human gate は `DEMO-UX-7 Implementation Start GO`。

## Evidence referenced

```text
four-perspective review:
  /opt/cursor/artifacts/human-ui-review-screenshots/four-perspective-review.md
screenshots:
  /opt/cursor/artifacts/human-ui-review-screenshots/
visual review baseline SHA:
  677d35922d6ebc761a5977e861a2e8e4eff8e4a6
```
