# SBS-MGMT-HOME-CORRECTION-1 — Definition Start

この文書は **SBS-MGMT-HOME-CORRECTION-1** の Definition Start だけを開始する。
実装、Scope Lock、Implementation Start、Ready、Merge、Deploy、LIVE WRITE は開始しない。

```text
repository: yasutakesougo/severe-behavior-support-spfx
unit: SBS-MGMT-HOME-CORRECTION-1
kind: Definition Start（docs-only）
date: 2026-09-11
Definition Start GO: RECEIVED（Human: CORRECTION 確定 + Correction-1 へ進む）
Human Definition / Scope Lock GO: NOT RECEIVED
Independent Definition Review: REQUIRED / NOT RUN
Implementation Start GO: NOT RECEIVED
Implementation: NOT STARTED
Actual Staff Value Check: NOT CONSUMED
Human Ready / Promotion: NOT IMPLIED
SIM-AUTH-001 product Issue: DO NOT FILE
```

## 1. Why this unit exists

Authenticated 5-persona real-browser simulation は見た目不足ではなく、次の意味境界の誤認を捕捉した。

```text
閲覧
業務記録
SharePoint ページ編集
Draft / Active
未実施 / 未記録 / 未保存
件数カードの母集団
```

```text
5-PERSONA AUTHENTICATED REAL-BROWSER SIMULATION
= CORRECTION
P0 = 1
P1 = 7
P2 = 3
```

Simulation PASS ではない。Actual Staff Value Check を消費しない判断を維持する。

## 2. Primary evidence（frozen as evidence, not as product）

正本証跡:

```text
docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md
```

前提（認証ブロッカー、製品 Issue にしない）:

```text
docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-1.md
SIM-AUTH-001 = test-session precondition
```

Simulation 2 は **残す**。修正対象だけを本 Correction slice に切り出す。
Simulation 2 の本文を書き換えたり、CORRECTION 判定を PASS に戻したりしない。

## 3. Authority consumed / not consumed

CONSUMED:

```text
Human: Simulation Outcome = CORRECTION で確定してよい
Human: NEXT = SBS-MGMT-HOME-CORRECTION-1 Definition Start
```

NOT CONSUMED:

```text
Independent Definition Review PASS
Human Definition / Scope Lock GO
Human Implementation Start GO
Authenticated 5-Persona Re-Simulation PASS
Actual Staff Value Check
Human Ready / Promotion GO
Issue close
Ready / Merge / Deploy
Home.aspx edit
SharePoint 左ナビ変更
App Catalog / Production Binding / LIVE WRITE
```

## 4. Exact slice pointer

IN / OUT / 優先3群 / Re-Simulation Gate の正本は次へ委譲する。

```text
docs/architecture/sbs-mgmt-home-correction-1-scope-definition-1.md
kind: Correction Scope Definition
status: DRAFT FOR INDEPENDENT REVIEW
!= LOCKED
```

本 Definition Start は scope 文書の作成を許可する。
scope 文書の LOCK は許可しない。

## 5. Product intent（1 sentence）

職員が Home.aspx 上で、**今見ている操作が閲覧なのか、業務記録なのか、SharePoint ページ編集なのか、適用中計画なのか、未適用 Draft なのか** を取り違えないようにする。機能追加ではない。

## 6. Gate chain（not started beyond Definition Start）

```text
5-PERSONA AUTHENTICATED REAL-BROWSER SIMULATION
= CORRECTION
        ↓
SBS-MGMT-HOME-CORRECTION-1
Definition Start          ← this document
        ↓
Correction Scope Definition  ← sibling DRAFT
        ↓
Independent Definition Review
        ↓
Human Definition / Scope Lock GO
        ↓
Human Implementation Start GO
        ↓
Implementation
        ↓
Independent Implementation Review
        ↓
Authenticated 5-Persona Re-Simulation
        ↓
P0 = 0 を確認
        ↓
Actual Staff Value Check
        ↓
Human Ready / Promotion GO / HOLD
```

```text
Browser Re-Simulation PASS
!= Actual Staff Value Check
!= Human Ready
```

## 7. Forbidden from this Definition Start

```text
implementation code change
new workflow / new persistence / new state machine
plan activation / next-version preparation
SharePoint / M365 / Entra mutation
Home.aspx web part add/edit
site navigation mutation（ごみ箱・SupportPlans リスト名のサイト設定変更）
Deploy / App Catalog
LIVE WRITE
SIM-AUTH-001 の製品 Issue 化
Actual Staff PASS 宣言
```

## 8. HOLD

```text
HOLD: Independent Definition Review 未実施
HOLD: Human Definition / Scope Lock 未受領
HOLD: Implementation Start 未受領
```

## 9. Next Actions

```text
Human:
  Independent Definition Review を別経路で実施する
  Scope Lock GO は Review 後

Agent:
  Scope Definition DRAFT を Independent Review に渡す
  実装しない
  Simulation 2 を改ざんしない
  SIM-AUTH-001 を製品 Issue にしない
```
