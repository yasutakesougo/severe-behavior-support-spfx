# Issue #24 Decision-first 整理台帳

この文書は、PR #85（残責務再監査 / 次純関数単位 NONE）完了後に、
残 HOLD を **Decision 単位へ分離**して整理する正本である。

業務値・許可辺・制度日数・カタログ内容を本文書で採択しない。  
Accepted 証跡が付くまで各 Decision は **Pending**、domain 実装は **HOLD**、Deploy は **NO-GO**。

## 基準

```text
repository: yasutakesougo/severe-behavior-support-spfx
main: 18a765ca2df74683fcc1ad9e80b6abeb2b5f649f
PR #85: MERGED
Issue #24: OPEN
Next pure domain unit: NONE（[`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)）
Implementation Start (domain): HOLD
Issue #24 Close: NO-GO
Deploy: NO-GO
```

上位入口:

- [`finding-audit-ownership.md`](./finding-audit-ownership.md)
- [`issue-24-remaining-audit-post-rsv.md`](./issue-24-remaining-audit-post-rsv.md)

## 整理方針

1. 1 Decision = 1 問いに閉じる。混ぜない。
2. 方式選択と値一覧を混ぜない（特に FindingSeverity）。
3. 所有指定とロール指定を混ぜない（特に Handoff）。
4. 完了済み純関数（observation / review-due / RSV）の再実装を Decision で置き換えない。
5. Issue コメント投稿・Accepted 記録は人が行う。本 PR は台帳固定のみ。
6. Accepted 前に `src/**` / `tests/**` 実装を始めない。

## Decision 一覧（すべて Pending）

| ID | 決める内容 | 決めない内容 | 依存 | 状態 |
|---|---|---|---|---|
| Decision-RO-1 | Finding 再オープンの許可辺（所有=#24） | Severity、完全 Finding、Handoff | PR-D 許可3辺は再定義しない | Pending |
| Decision-SV-1 | FindingSeverity 正本の方式 A または B | 具体値一覧（low/medium/high 等） | Issue #8 / #27 | Pending |
| Decision-SV-2 | FindingSeverity 値一覧（SV-1 Accepted 後） | 完全 Finding 本体の全フィールド | SV-1 | Pending（着手不可） |
| Decision-FC-1 | FindingCode 業務カタログの所有・範囲 | Identity 組立の再定義、採番表本体の暗黙確定 | PR-F 完了済み | Pending |
| Decision-HO-1 | Handoff 状態遷移純関数の所有 Issue | 実行ロール（`GOV-AUD-02`） | Issue #17 案 / #27 型 | Pending |
| Decision-OP-3 | SupportPlan / SharePoint への観察期間列追加の要否 | メンバシップ純関数の再定義 | `observation-period.md` 完了 | Pending |
| Decision-RD-3 | 見直し期限の接近窓・超過後ポリシー（制度日数） | asOf 相対判定純関数の再定義 | `review-due.md` 完了 | Pending |
| Decision-AS-EC | AssessmentSnapshot 完全契約 Entry Criteria の充足方針 | 保存実装・SharePoint 列の先行 | `DEC-009` / `GOV-AUD` / Finding 境界 | Pending |

推奨着手順（人の Decision 記録）:

```text
1. Decision-RO-1
2. Decision-SV-1（方式のみ）
3. Decision-FC-1
4. Decision-HO-1
5. Decision-OP-3 / Decision-RD-3（並行可・純関数代替ではない）
6. Decision-AS-EC（DEC-009 / GOV-AUD / Finding 境界の充足確認）
7. Decision-SV-2（SV-1 Accepted 後のみ）
```

## Decision-RO-1 — Finding 再オープン

### 決める

- `Resolved` からの許可遷移辺の集合（0辺＝再オープン禁止の明示も可）
- 所有は既存どおり Issue #24 か（既定は #24。変更するなら明示）

### 決めない

- FindingSeverity
- 完全 Finding 契約
- 再発判定の再定義
- ロール / SharePoint

### 既存正本

- [`finding-lifecycle-transition.md`](./finding-lifecycle-transition.md)（許可3辺・Resolved終端）
- 再オープンは「別 Decision」と明記済み

### 投稿案（Pending・未投稿）

```text
Status: Pending Decision
ID: Decision-RO-1
Owner candidate: Issue #24

Question:
  Resolved からの再オープンを許可するか。
  許可する場合、許可辺を列挙する（例示は採択ではない）。

Must NOT invent:
  - PR-D の Open→Confirmed→InProgress→Resolved 3辺の再定義
  - Severity / 完全 Finding

OUT:
  roles / SharePoint / UI / deploy
```

## Decision-SV-1 — FindingSeverity 正本方式

### 決める

```text
A: Issue #8 へ新しい DEC を追加する
B: Issue #27 配下の technical decision として固定する
```

### 決めない

- 値一覧（`low` / `medium` / `high` 等の暗黙採択禁止）
- 完全 Finding の全フィールド

### 既存正本

- [`finding-audit-ownership.md`](./finding-audit-ownership.md) FindingSeverity Decision 節

### 投稿案（Pending・未投稿）

```text
Status: Pending Decision
ID: Decision-SV-1

Question:
  FindingSeverity の正本方式を A（Issue #8 DEC）または B（Issue #27 technical）のどちらにするか。

Must NOT decide yet:
  - 値一覧（Decision-SV-2）

OUT:
  complete Finding implementation / SharePoint / deploy
```

## Decision-SV-2 — FindingSeverity 値一覧

SV-1 Accepted 前は着手しない。本台帳では枠のみ置く。

```text
Status: Blocked by Decision-SV-1
ID: Decision-SV-2
Question: Severity 値の列挙と必須/任意
Must NOT: 方式未選択のまま値をコードへ埋め込む
```

## Decision-FC-1 — FindingCode 業務カタログ

### 決める

- カタログ正本の所有 Issue
- カタログが決める範囲（採択コード集合 / criterionId 写像 / 採番規則のどれを含むか）

### 決めない

- `assembleFindingIdentity` の再定義（FindingCode は呼び出し側必須入力のまま）
- カタログ未確定時の暫定コード埋め込み

### 既存正本

- [`finding-identity-assembly.md`](./finding-identity-assembly.md)

### 投稿案（Pending・未投稿）

```text
Status: Pending Decision
ID: Decision-FC-1

Question:
  FindingCode 業務カタログの所有と、決める範囲（集合 / 写像 / 採番）を固定する。

Reuse:
  - Identity 組立は PR-F 完了済みを再定義しない

OUT:
  SharePoint / UI / deploy / Identity 組立変更
```

## Decision-HO-1 — Handoff 遷移所有

### 決める

- Handoff 状態遷移純関数の所有 Issue（#24 へ自動割当しない）

### 決めない

- 実行ロール（`GOV-AUD-02` / Issue #19）
- 運用グラフの最終確定（Issue #17 と分離して扱う）

### 既存正本

- Issue #27: `HandoffState` 型
- Issue #17: 運用設計・状態グラフ案
- ownership: 遷移関数は所有指定まで HOLD

### 投稿案（Pending・未投稿）

```text
Status: Pending Decision
ID: Decision-HO-1

Question:
  Handoff 状態遷移純関数の所有 Issue をどれにするか。

Separation:
  - 所有（本 Decision）
  - ロール（GOV-AUD-02）は本 Decision に混ぜない

Default forbidden:
  - Issue #24 への自動割当
```

## Decision-OP-3 — 観察期間フィールド追加

### 決める

- SupportPlan / SharePoint へ観察期間列を追加するか、呼び出し側入力のままにするか

### 決めない

- `evaluateObservationPeriodMembership` の再定義
- 制度上の観察日数定数の domain 埋め込み

### 既存正本

- [`observation-period.md`](./observation-period.md)（純関数完了・OP-3 は別単位）

## Decision-RD-3 — 接近窓・超過後ポリシー

### 決める

- 接近窓（制度日数）と超過後ポリシーの要否・正本

### 決めない

- `evaluateReviewDueRelativeToAsOf` の再定義
- BEFORE_DUE / DUE / OVERDUE 結果集合への接近窓混入

### 既存正本

- [`review-due.md`](./review-due.md)（相対判定完了・RD-3 は別単位）

## Decision-AS-EC — AssessmentSnapshot Entry Criteria

### 決める（方針の明示）

[`assessment-snapshot-result-design.md`](./assessment-snapshot-result-design.md) の Entry Criteria 各項について、

- Accepted 済みか
- 実装対象外として明示するか
- 未決のまま HOLD 継続か

を項目ごとに記録する。

最低限照合する項目:

```text
DEC-009 保存タイミング
GOV-AUD-03 訂正承認境界
完全 Finding または findingIds 参照境界
サービス別 NOT_APPLICABLE reason code 正本または HOLD 方針
Schema ID / schemaVersion / DTO versioning
```

### 決めない

- Snapshot 保存実装の先行
- SharePoint 列追加
- Result変換純関数の再定義（PR-H 完了済み）

## Gate

```text
Decision-first ledger: FIXED (docs-only)
All listed Decisions: Pending（Accepted 証跡なし）
Next pure domain unit: NONE
Implementation Start (domain): HOLD
Issue #24 Close: NO-GO
SharePoint / Entra ID / Microsoft 365: NO-GO
Deploy: NO-GO
```

## OUT

- `src/**` / `tests/**` の変更
- Decision 値の推測採択・Accepted 偽証
- Issue #24 への自動コメント投稿（本 PR の範囲外）
- Handoff の #24 自動割当
- Severity 値一覧の暗黙採択
- FindingCode カタログ内容の暗黙採択
- 再オープン辺の推測採択
- OP-3 / RD-3 制度値の domain 埋め込み
- Snapshot 保存 / SharePoint / UI
- Deploy

## 次工程（人）

1. 本台帳を main へ入れた後、Issue #24（および必要な #8 / #17 / #19 / #27）へ Decision を **1件ずつ** 記録する
2. Accepted comment ID を台帳へ追記する（別 docs PR 可）
3. Accepted 済み単位だけ技術契約 → 実装の小PRへ進める
4. 未 Accepted のまま domain 実装を始めない
