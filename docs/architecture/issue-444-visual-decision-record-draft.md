# #444 Visual Decision Record — Issue comment draft

```text
Issue: https://github.com/yasutakesougo/severe-behavior-support-spfx/issues/444
Kind: Issue comment draft（Human posts after Record GO）
Agent auto-post: FORBIDDEN
Status: DRAFT for Human
Decision: Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
Canonical docs:
  docs/architecture/decision-support-plan-management-list-ui-1-selection.md
  docs/architecture/decision-support-plan-management-list-ui-1-acceptance.md
```

以下を `#444` へ Human が投稿する。Agent は自動投稿しない。

---

```md
## SUPPORT-PLAN-MANAGEMENT-LIST-UI-1 Visual Decision Record

```text
Decision ID: Decision-SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
Kind: first Visual Decision for SP-LC-5 Planning-PC lifecycle UI
Status: SELECTED / LOCKED
Human Decision: SELECT SUPPORT-PLAN-MANAGEMENT-LIST-UI-1
Date: 2026-08-19
Canonical:
  docs/architecture/decision-support-plan-management-list-ui-1-selection.md
  docs/architecture/decision-support-plan-management-list-ui-1-acceptance.md
Implementation Start: NOT AUTHORIZED by this record
LIVE WRITE / SharePoint mutation / Deploy: NOT AUTHORIZED
#444 close / #70 reopen: NOT AUTHORIZED
```

### Locked meaning

- 画面の仕事: 計画担当が「今だれの計画を見る／作るか」を 1 画面で判断する
- 配置: PLANNER × destination `users` × 未選択。SharePoint chrome / 既存 primary nav 維持。FIELD_STAFF UsersList は触らない。`h1` は 支援計画
- compact KPI（Family P。Family R/A と混ぜない）: 要確認 / 見直し時期 / 観察待ち。件数は fixture 行から導出
- 今日やること: 要対応行から導出
- 一覧1行の7要素: 利用者 / 状態 / Version / 最終観察日 / 見直し時期 / 要対応 / 操作
- 状態: 適用中 / 見直し時期 / 観察確認 / 手順更新中 / 未作成（Schema status を増やさない）
- 状態と要対応は分離する
- 約3か月見直しは目安表示。90日失効としては扱わない
- 承認状態を制度要件として入れない（D1=B / D2=B / DEC-008）
- 大きなダッシュボード化・7列以上の高密度テーブルには戻さない
- 色だけで意味を伝えない

### Next gates（separate Human GO）

1. SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 Scope Freeze
2. SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 IMPLEMENTATION START GO
```

---

## Record boundary

```text
This draft does not authorize Issue mutation by Agent
This draft does not authorize Implementation Start
This draft does not close #444
```

Subsequent gates landed in Draft PR #447（Scope Freeze + Implementation Start + presentation demo）. Do not mix those into the Visual Decision comment body above.
