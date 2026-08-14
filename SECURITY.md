# SECURITY.md

- 文書: `SECURITY.md`
- 位置づけ: Codex Security / Security Scan 向けの**要約・索引入口**
- 方針: **新しいセキュリティ思想やルールを発明しない**。既存正本への読みやすい入口だけを置く
- Unit: SECURITY-PREP-1
- 競合時は Accepted / LOCKED Decision と明示的な状態遷移を優先する

```text
INDEX ONLY — 本ファイルは正本ではない
本ファイルへ独自ポリシーを増殖させない
Severity / Non-findings / Finding criteria の変更は、
  先に docs/ / .agents/ の既存正本を更新してから、ここへ要約を追従させる
candidate finding ≠ verified vulnerability ≠ fix authorization ≠ production GO
```

read-only first → 状況整理 → 影響確認 → 分類 → 安全な次の行動 → Human GO → mutation

## 1. System / architecture

| 要素 | 意味 | 主な正本 |
|---|---|---|
| SPFx | isolated `spfx/` 上の法人アプリ | `spfx/README.md`, scaffold / binder Decision 群 |
| SharePoint Online | List / site 永続化 | `docs/architecture/contracts-v1.md`, mapping / adapter docs |
| site boundary | 事業所（Site）分離。越境禁止 | `#21-A/#21-B`, `contracts-v1.md` Authorization / SiteContext |
| current-user permissions | membership / Role / 選択サイトに基づく認可 | `evaluateAccess` / `AuthorizationContext`, Issue #21 |

認可の真理値は presentation（#28）と分離する。

## 2. Trust boundaries

| 境界 | 扱い |
|---|---|
| browser ↔ SharePoint | 認証トークン／Cookie をログや fixture に出さない |
| site A ↔ site B | `SiteId` / membership / `SelectedSiteId`。未選択・非所属は fail-closed |
| SPFx ↔ Lists | adapter が contracts ↔ 列名を明示変換。推測 Internal Name 禁止 |
| synthetic fixture ↔ production data | `synthetic-*` のみ。実データ・個人属性を持ち込まない |

## 3. Security invariants

既存正本から抽出した不変条件。ここだけで緩和・追加しない。

| Invariant | 根拠（入口） |
|---|---|
| fail-closed | `contracts-v1.md`, quality-gates, AI governance |
| unauthorized write 禁止 | quality-gates P0 |
| token / Cookie / Secret 非記録 | Audit Privacy / value safety、DEC-AA-001、permission-matrix（NFR-SEC 系） |
| site boundary 越境禁止 | Authorization / SiteContext、quality-gates / PR template |
| mutation は明示権限が必要 | DEC-AI-ORG-003、permission-matrix、staff-confidence P-SC-5 |
| 個人情報の GitHub 転記禁止 | staff-confidence P-SC-7、PR template、quality-gates |

トレーサビリティ例: `NFR-SEC-008` → `AuditEvent`（`domain-reconstruction-foundation.md`）。

## 4. Finding criteria（verified 条件）

Scan 運用上の確認チェック（独自脆弱性定義ではない）。verified には次が必要:

1. 実際に到達可能
2. attacker-controlled input、または権限境界を跨ぐ入力
3. §2 境界または §3 invariant の侵害
4. evidence（source → sink → path）

```text
パターン列挙だけでは verified にしない
synthetic / demo / fail-closed / Human GO の文脈で検証する
```

## 5. Non-findings / exclusions

既存境界から導く **scan 除外の目安**（独立 exclusion policy ではない）:

- display-only / synthetic demo（本番未到達）
- 未接続 placeholder / live I/O 未配線 stub
- fixture-only path（`synthetic-*`、InMemory）
- style / UX のみ（security boundary 非侵害）
- FindingSeverity 不在（SEV-2-VOCAB = NOT ADOPTED。§6 とは別）

除外を増やす・狭める場合は、先に architecture / contracts / Decision を更新する。

## 6. Severity（Security Scan 分類用）

Critical / High / Medium / Low は **Scan finding 分類の要約語彙**。正本 Decision ではない。

| 語彙 | 用途 | 権威 |
|---|---|---|
| Critical / High / Medium / Low | Scan finding 分類 | 本 §6（索引。増殖禁止） |
| P0 / P1 / P2 | Gate / レビュー | `judgement-rules.md`, quality-gates |
| FindingSeverity | 業務 Finding | **NOT ADOPTED**（DEC-018） |

目安（quality-gates のセキュリティ例と整合。ここへ新基準を足さない）:

| Severity | 目安 |
|---|---|
| Critical | 認証情報漏洩、権限外の永続 R/W 到達、site 越境で実データ到達 |
| High | 認可 bypass 到達、fail-closed 無効化、Secret／個人情報の永続化またはログ出力 |
| Medium | 境界侵害経路はあるが前提が重い、または既存制御で部分緩和 |
| Low | 防御深化の欠落、到達困難、影響限定 |

```text
Scan Severity ≠ P0/P1（自動変換しない）
本表への行追加・意味変更は、先に quality-gates / Decision を更新してから追従する
```

## 7. Verification requirements

| 項目 | 内容 |
|---|---|
| source / sink / path | 入口・危険操作・経路 |
| existing control | fail-closed、認可、allowlist、Human GO 等 |
| status | `reproduced` / `reasoned` / `unverified` |
| remaining proof gap | 未確認前提 |

`unverified` のまま Issue 化・修正・production GO へ進まない。

## 8. 運用（推奨・本PR外）

```text
SECURITY-PREP-1 → standard scan → Deep Scan（一度）
  → verified のみ分類 → 1件ずつ修正（Human GO）
```

PR 単位は security-diff-scan。Deep Scan を本入口 PR に混ぜない。修正 / Deploy / SharePoint write は別 GO。

## 9. Canonical references

| 主題 | 正本 |
|---|---|
| 権限境界 | `docs/decisions/DEC-AI-ORG-003.md` |
| 操作マトリクス | `.agents/mcp/permission-matrix.md` |
| Authorization / SiteContext | `docs/architecture/contracts-v1.md`, Issue #21 |
| 品質・セキュリティ | `docs/development/quality-gates.md` |
| Audit / Privacy | `audit-event-persistence-contract.md`, AUD-SAN-VALUE-1 |
| 職員・保守 | `staff-confidence-and-sustainable-maintenance-v1.md` |
| Governance | `docs/process/ai-governance.md` |
| 再現手順索引 | `AGENTS.md` |

## 本入口が承認しないこと

- 本ファイルを正本にして新ポリシー・新 Severity・新 exclusion を増やすこと
- Deep Scan を SECURITY-PREP PR に混在させること
- FindingSeverity 再導入、P0/P1 と Critical/High の同一視
- 明示 Human GO なしの mutation / SharePoint write / Deploy
- token / secret / 個人情報実データの記録
- unverified candidate の verified 扱い、修正完了＝production GO
