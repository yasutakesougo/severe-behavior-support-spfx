# Decision-HO-1 — Handoff transition ownership

この文書は、Issue #24 Decision backlog 上の **Decision-HO-1** を
人が独立承認できるように固定する **Pending 判断単位** である。

所有 Issue を本 PR で採択しない。
Issue #24 へ自動割当しない。
domain 実装・許可辺・ロールを決めない。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: a289128136591648c5f57525e7186b4985a2389c
PR #88 / Decision-FLR-1: MERGED
Decision-FLR-1: Accepted（再オープン不許可・実装 NONE）
Decision-HO-1: Pending
Next pure unit: NONE
Implementation Start (domain): HOLD
Issue #24 Close: NO-GO
Deploy: NO-GO
```

上位入口:

- [`issue-24-decision-backlog.md`](./issue-24-decision-backlog.md)
- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`domain-reconstruction-foundation.md`](./domain-reconstruction-foundation.md)

## 判断単位（1 問いに閉じる）

```text
Question:
  Handoff 状態遷移純関数（allow/deny only）の所有 Issue はどれか。
```

本 Decision が決めるもの:

- 遷移純関数の **所有 Issue**（1 つ）

本 Decision が決めないもの:

- 許可遷移辺の集合（所有確定後の別 Decision）
- 実行ロール / 権限（`GOV-AUD-02` / Issue #19）
- handoff 運用設計・状態グラフの正式化（Issue #17）
- `HandoffState` 型の再定義（Issue #27 / PR #41 済み）
- SharePoint / UI / adapter / deploy / 実データ

## 既存正本（採択ではない・参照のみ）

| 対象 | 所有・正本 | 状態 |
|---|---|---|
| `HandoffState` 型 | Issue #27 / PR #41 | 完了 |
| handoff 運用設計・状態グラフ案 | Issue #17（ownership comment `5204771950`） | 案。正式化 HOLD |
| Handoff 状態遷移純関数 | **未確定** | Decision-HO-1 待ち |
| handoff 状態変更ロール | `GOV-AUD-02` / Issue #19 | 正式回答待ち |
| Finding lifecycle reopen | Decision-FLR-1 Accepted | 実装 NONE。本単位と無関係 |

状態集合（型正本。本 Decision で再定義しない）:

```text
not_required
pending
included
acknowledged
closed
```

## 分離規則（必須）

```text
1. 所有（HO-1）とロール（GOV-AUD-02）を混ぜない
2. 所有指定は GOV-AUD-02 回答を待たずに可能
3. 所有が決まっても、許可辺 Decision と技術契約が無い限り実装しない
4. Issue #24 へ自動割当しない（割当するなら人の明示 Accepted が必要）
5. Finding / SupportPlan 遷移契約を流用改変して Handoff 許可辺を推測しない
```

## 候補（採択しない・列挙のみ）

人が所有を指定するときの参照枠。本文書はいずれかを選ばない。

| 候補 | 既存関係 | 注意 |
|---|---|---|
| Issue #17 | 運用設計・状態グラフ案の所有 | 運用案と純関数所有を同一 Issue にするかは人の判断 |
| Issue #24 | Finding / SupportPlan 系純関数の所有が多い | **自動割当禁止**。明示 Accepted が無い限り選ばない |
| Issue #27 | `HandoffState` 型の所有 | 型所有と遷移純関数所有は分離してよい |
| 新規 Issue | 上記に収まらない場合 | 人が採番・命名する |

上記以外を選ぶ場合も、人の Accepted 文面で Issue 番号を明示する。

## 禁止（本 Decision 前）

- 所有未確定のまま `transitionHandoffStatus`（仮）等を実装すること
- 許可辺・自己遷移・終端の推測採択
- `GOV-AUD-02` のロール値をコードへ埋め込むこと
- Issue #24 Close
- SharePoint / Entra ID / Microsoft 365 / deploy / 実データ変更

## Accepted 後に可能になる作業（まだ開始しない）

```text
1. 所有 Issue を ownership 表へ記録
2. 許可辺 Decision（別単位。HO-1 に混ぜない）
3. 技術契約 docs（allow/deny only・ロールなし）
4. 狭域純関数 + contract tests（Entry Criteria 充足後）
```

`GOV-AUD-02` 未回答でも所有と許可辺の docs は進められる。
実装にロール判定を混ぜてはならない。

## 人向け投稿案（Pending・未投稿）

Issue コメント投稿は人が行う。エージェントは投稿しない。

```text
Status: Pending Decision
ID: Decision-HO-1
Owner: TBD（自動割当しない）

Question:
  Handoff 状態遷移純関数（allow/deny only）の所有 Issue を指定する。

Reuse / fixed:
  - HandoffState 型 = Issue #27 / PR #41（再定義しない）
  - 運用設計案 = Issue #17（本 Decision で正式化しない）

Must separate:
  - GOV-AUD-02（実行ロール）は本 Decision に含めない

Must NOT:
  - Issue #24 への自動割当
  - 許可辺の推測採択
  - domain 実装の先行開始

OUT:
  SharePoint / UI / adapter / deploy / 実データ

After Accepted:
  所有記録 →（別 Decision）許可辺 → 技術契約 → 実装 Gate
```

## 実装ゲート（現状維持）

```text
Decision-HO-1: Pending
Next pure unit: NONE
Implementation Start (next domain PR): HOLD
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

## 変更禁止境界

```text
SharePoint changes: NO-GO
Entra ID changes: NO-GO
Microsoft 365 changes: NO-GO
deploy: NO-GO
real data: prohibited
src/** / tests/**: 本 Decision 文書では変更しない
所有 Issue の推測採択: 禁止
```
