# SECURITY.md

- 文書: `SECURITY.md`
- 位置づけ: Codex Security / Security Scan 向けの**セキュリティ入口**（要約・索引）
- 方針: **新しいセキュリティ思想やルールを発明しない**。既存正本を読みやすい入口へ整理する
- Unit: SECURITY-PREP-1
- 詳細の正本は `docs/` / `.agents/` 側に残す。本ファイルと個別正本が競合する場合は、Accepted / LOCKED Decision と明示的な状態遷移を優先する

```text
candidate finding
  ≠ verified vulnerability
  ≠ fix authorization
  ≠ production GO
```

read-only first → 状況整理 → 影響確認 → 分類 → 安全な次の行動 → Human GO → mutation

## 1. System / architecture

| 要素 | 意味 | 主な正本 |
|---|---|---|
| SPFx | SharePoint Framework 上の法人アプリ（isolated `spfx/`） | `spfx/README.md`, scaffold / binder Decision 群 |
| SharePoint Online | List / site 上の業務データ永続化先 | `docs/architecture/contracts-v1.md`, SharePoint mapping / adapter docs |
| site boundary | 事業所（Site）単位の分離。サイト越境アクセスを許可しない | `#21-A/#21-B`, `contracts-v1.md` Authorization / SiteContext |
| current-user permissions | 現ユーザーの membership / Role / 選択サイトに基づく認可 | `evaluateAccess` / `AuthorizationContext`, Issue #21 |

アプリは同一 Microsoft 365 テナント内の複数事業所で利用する。認可の真理値は presentation（#28）と分離する。

## 2. Trust boundaries

| 境界 | 扱い |
|---|---|
| browser ↔ SharePoint | ブラウザ上の SPFx が SharePoint REST 等へ到達する。認証トークン／Cookie をログや fixture に出さない |
| site A ↔ site B | `SiteId` / membership / `SelectedSiteId` で分離。未選択・非所属は fail-closed |
| SPFx ↔ Lists | adapter / binder が contracts と列名を明示変換。推測 Internal Name で越境しない |
| synthetic fixture ↔ production data | `synthetic-*` のみ。実データ・現行 fixture・個人属性を持ち込まない |

## 3. Security invariants

既存正本から抽出した不変条件。緩和しない。

| Invariant | 根拠（入口） |
|---|---|
| fail-closed | 権限不明・取得失敗・未知 Role / 未選択サイトを許可へ倒さない（`contracts-v1.md`, quality-gates, AI governance） |
| unauthorized write 禁止 | 権限外の閲覧・更新は P0（`docs/development/quality-gates.md`） |
| token / Cookie / Secret 非記録 | AuditEvent Privacy / value safety、DEC-AA-001、permission-matrix。要件台帳の NFR-SEC 系（ログへの認証情報非出力）に対応 |
| site boundary 越境禁止 | Authorization / SiteContext、事業所間分離（quality-gates / PR template） |
| mutation は明示権限が必要 | DEC-AI-ORG-003、permission-matrix、staff-confidence（P-SC-5） |
| 個人情報の GitHub 転記禁止 | staff-confidence P-SC-7、PR template、quality-gates |

監査ログ構造のトレーサビリティ例: `NFR-SEC-008` → `AuditEvent` / `validateAuditEvent`（`docs/architecture/domain-reconstruction-foundation.md`）。

## 4. Finding criteria（verified finding にする条件）

Security Scan の候補を verified とするには、次を満たすこと。

1. **実際に到達可能** — 実行パスまたは確実な呼び出し経路がある
2. **attacker-controlled input がある** — または権限境界を跨ぐ入力がある
3. **security boundary を越える** — §2 のいずれかを侵害する、または §3 の invariant を破る
4. **evidence を示せる** — source → sink → path を説明できる

```text
怪しいパターンの列挙だけでは verified vulnerability にしない
プロジェクト固有の文脈（synthetic / demo / fail-closed / Human GO）で検証する
```

## 5. Non-findings / exclusions

原則として finding にしない（または Informational / non-finding に落とす）。

- display-only / synthetic demo UI（本番データに到達しない）
- 未接続 placeholder、live I/O 未配線の stub
- production に到達しない fixture-only path（`synthetic-*`、InMemory provider）
- 単なる style / UX / 文言ゆれ（security boundary 非侵害）
- FindingSeverity 業務語彙の不在（Decision-SEV-2-VOCAB = NOT ADOPTED。本 SECURITY 入口の severity とは別）

## 6. Severity（Security Scan 用）

本セクションの Critical / High / Medium / Low は **Security Scan finding 専用**。

混同禁止:

| 語彙 | 用途 | 正本 |
|---|---|---|
| Critical / High / Medium / Low | Codex / Security Scan finding | **本ファイル §6** |
| P0 / P1 / P2 | レビュー・Gate・工程ブロッカー | `judgement-rules.md`, quality-gates |
| FindingSeverity | 業務 Finding の重大度 | **NOT ADOPTED**（DEC-018 / SEV-2-VOCAB） |

判断基準（要約）:

| Severity | 目安 |
|---|---|
| Critical | 認証情報漏洩、権限外の永続書込／読取が到達可能、site 越境で実データへ到達 |
| High | 認可 bypass が到達可能、fail-closed の実質無効化、Secret／個人情報の永続化またはログ出力 |
| Medium | 境界侵害の経路はあるが前提条件が重い、または既存制御で部分緩和され残存リスクがある |
| Low | 防御深化の欠落、到達困難、影響が限定的 |

```text
Security Severity を P0/P1 へ自動変換しない
P0/P1 判定は quality-gates / review Skills の語彙で別途行う
```

## 7. Verification requirements

各 finding（候補・verified 問わず）に次を記録する。

| 項目 | 内容 |
|---|---|
| source | 入口（入力・権限・設定） |
| sink | 危険な操作・出力（書込、表示、ログ、外部送信） |
| path | source から sink までの経路 |
| existing control | fail-closed、認可、allowlist、Human GO 等の既存制御 |
| status | `reproduced` / `reasoned` / `unverified` |
| remaining proof gap | 未確認の前提・未実行の検証 |

`unverified` のまま Issue 化・修正着手・production GO へ進まない。

## 8. 運用（推奨）

```text
SECURITY-PREP-1（本入口）
  → standard security scan
  → Deep Security Scan（repository-wide、準備後に一度）
  → verified finding だけ分類
  → 必要なら 1 件ずつ修正（明示 Human GO）
```

- PR / コミット単位の継続監視は security-diff-scan を優先する
- Deep Scan の大量 candidate をそのまま Issue 化しない
- 修正・Deploy・SharePoint write は別 GO（`docs/decisions/DEC-AI-ORG-003.md`, `.agents/mcp/permission-matrix.md`）

## 9. Canonical references（詳細は委譲）

| 主題 | 正本 |
|---|---|
| 権限境界 | `docs/decisions/DEC-AI-ORG-003.md` |
| 操作マトリクス | `.agents/mcp/permission-matrix.md` |
| Authorization / SiteContext | `docs/architecture/contracts-v1.md`, Issue #21 docs |
| 品質・セキュリティ確認 | `docs/development/quality-gates.md` |
| Audit / Privacy | `docs/architecture/audit-event-persistence-contract.md`, Decision-AUD-SAN-VALUE-1 |
| 職員・保守境界 | `docs/architecture/staff-confidence-and-sustainable-maintenance-v1.md` |
| AI Governance 入口 | `docs/process/ai-governance.md` |
| 再現手順索引 | `AGENTS.md` |

## 本入口が承認しないこと

- Deep Scan / security-diff-scan の実行そのものの義務化を超える新プロセスの単独採択
- FindingSeverity 業務語彙の再導入
- P0/P1 と Critical/High の同一視
- 明示 Human GO なしの mutation / SharePoint write / Deploy / 本番変更
- token / secret / credential / 個人情報実データの記録
- 未検証 candidate の verified 扱い、または修正完了＝production GO の主張
