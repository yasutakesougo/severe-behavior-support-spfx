# ORIGIN-EVALUATION-1 — GitHub authoritative / Origin shadow evaluation

この文書は、Cursor Origin（Git forge）を **GitHub の代替正本へ移行しない**こと、
および **GitHub を authoritative repository / governance SSOT にしたまま
Origin を shadow 環境として評価する**ことを固定する docs-only Decision 正本である。

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: ORIGIN-EVALUATION-1
Kind: docs-only / governance evaluation Decision
Status: REVIEWABLE / READY FOR HUMAN ACCEPTANCE
Human Decision: NOT YET GRANTED
Authorization effect: NONE
Date: 2026-08-18
Baseline main: cd123afe8bb5154089994df0003d8fe2c370f1ea

Does NOT authorize:
  Origin enablement / codebase name claim
  GitHub → Origin mirror / sync
  Detach from GitHub
  Origin-hosted repository as SSOT
  Origin merge / force-push / Ready
  permission-matrix expansion
  GitHub replacement
  SharePoint / Entra / M365 / Deploy / production
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

Human Decision 貼り付け文面:
[`decision-origin-evaluation-1-selection.md`](./decision-origin-evaluation-1-selection.md)

## Status banner（固定）

```text
ORIGIN-EVALUATION-1:
Status:
REVIEWABLE / READY FOR HUMAN ACCEPTANCE

Human Decision:
NOT YET GRANTED

Authorization effect:
NONE

GitHub:
authoritative repository / governance SSOT

Origin:
evaluation candidate only
NOT SSOT
NOT ENABLED by this document

Implementation Start:
NOT AUTHORIZED by this document

Ready / Merge:
HUMAN-ONLY（GitHub PR 単位。DEC-AI-ORG-003）

Origin enablement / mirror / Detach:
FORBIDDEN by this document alone

SharePoint / M365 / Entra / Deploy / production:
FORBIDDEN under this document
```

```text
Agent recommendation ≠ Human Acceptance
docs-only recording ≠ Origin enablement
ORIGIN-EVALUATION-1 ACCEPT ≠ GitHub migration
ORIGIN-EVALUATION-1 ACCEPT ≠ Origin sync GO
ORIGIN-EVALUATION-1 ACCEPT ≠ permission expansion
ORIGIN-EVALUATION-1 ACCEPT ≠ Ready / Merge
```

## 1. Purpose

Git ホスティング候補としての Origin を、現行の Human GO 運用へ引きつけて評価項目として固定する。

目標:

```text
GitHub を捨てない
Origin を Agent 実行面の shadow として評価する
評価項目を今のアーキテクチャに追加する
権限・監査・branch protection が未確認のまま SSOT を移さない
```

目標ではない:

```text
GitHub → Origin 移行
Origin を governance SSOT にする
DEC-AI-ORG-003 の緩和
Agent による Origin merge / force-push
本 Decision 単独での Origin 有効化
```

## 2. Authority boundary

| 問い | 正本 |
|---|---|
| GitHub を正本にするか、Origin へ移行するか | **本文書**（Human ACCEPT 後） |
| AI 許可操作と人の承認境界 | DEC-AI-ORG-003（UNCHANGED） |
| MCP / コネクタ操作単位 | permission-matrix（UNCHANGED；未記載 = 禁止） |
| Cloud / Background Agent 実行契約 | background-agent-contract（UNCHANGED） |
| 職員 / 保守エージェント入口 | STAFF-CONFIDENCE-SUSTAINABILITY-1（UNCHANGED） |
| Merge Gate | DEC-AI-ORG-003 Solo development Merge Gate |

本文書は DEC-AI-ORG-003、DEC-AA-001、DEC-AA-003、permission-matrix、
STAFF-CONFIDENCE を再 Decision しない。緩和もしない。

```text
未記載の Origin 操作 = Fail Closed 禁止（DEC-AI-ORG-003）
本文書で permission-matrix 行を追加しない
本文書で GitHub Human Merge GO を Origin merge に置換しない
```

## 3. Evidence classes

古い投稿・二次記事だけで CONFIRMED にしない。

| Class | 意味 | 本 unit での使い方 |
|---|---|---|
| `CONFIRMED` | 公式 docs または本リポジトリ観測で確認済み | 評価前提として使ってよい |
| `INTENDED` | 公式 docs が能力を述べるが、本リポジトリでは未観測 | 評価項目。SSOT 変更の根拠にしない |
| `POST` | 投稿・二次報道。公式ページで日付・範囲が未固定 | ニュースとして扱う。正本にしない |
| `UNKNOWN` | 必要な証拠が不足 | HOLD。推測で満たした扱いにしない |

```text
INTENDED ≠ CONFIRMED
POST ≠ CONFIRMED
UNKNOWN → 移行しない
```

### 3.1 CONFIRMED（公式）

観測日: 2026-08-18。出典は Cursor 公式ページ。

| 事実 | 出典 |
|---|---|
| Compile 2026（2026-06）で Origin を 「a new Git platform」として発表 | `https://cursor.com/compile` |
| Origin は Cursor の git forge。early beta | `https://cursor.com/docs/origin` |
| Pro / Teams / Enterprise で利用可能。Free は対象外。段階開放 | `https://cursor.com/docs/origin` |
| GitHub リポジトリを Origin へ mirror できる | `https://cursor.com/docs/origin/mirror-github` |
| mirror 対象: Git history / branches / tags。非対象: GitHub Issues、GitHub Actions workflows / secrets | 同上 |
| mirrored PR は双方向 sync。Origin 上の操作は GitHub へ戻る | 同上、`https://cursor.com/docs/origin/pull-requests` |
| mirrored の間、GitHub が source of truth。Origin への push は GitHub へ通過 | `https://cursor.com/docs/origin/mirror-github` |
| Detach from GitHub すると Origin が source of truth になる | 同上、`https://cursor.com/docs/origin/settings` |
| Cloud agents は Origin repo で clone / branch / commit / push / open PR できる | `https://cursor.com/docs/origin/integrations` |
| Repository Settings に Rules and Protections（branch / merge protections）がある。early beta 中に UI・制御は変わりうる | `https://cursor.com/docs/origin/settings` |
| Apps: Vercel / Depot / Buildkite。Depot / Buildkite は Origin-hosted のみ。mirrored GitHub repo の CI は GitHub に残る | 同上 |
| Origin API の Apps は GitHub-mirrored repo に届かない（installations / tokens / webhooks から除外） | `https://cursor.com/docs/api/origin` |
| Origin API に required checks / actor（user / app / serviceAccount）がある | 同上 |
| standard git clone / push / pull | `https://cursor.com/docs/origin/git` |

### 3.2 POST（正本にしない）

| 主張 | 扱い |
|---|---|
| 2026-08-17 に有料ユーザー全体へ β 公開 | 投稿・報道。公式 docs は early beta + 段階開放まで。日付は POST |
| GitHub 障害と同日の公開経緯 | 二次報道。本 Decision の根拠にしない |

公式 docs が Pro / Teams / Enterprise と Vercel / Depot / Buildkite を述べていることは
CONFIRMED。公開日の「全体」範囲は POST のままにする。

### 3.3 UNKNOWN（本リポジトリ未観測）

§5 の 5 項目を含む。本リポジトリで Origin mirror を実行していないため、
製品 docs の INTENDED を本環境の CONFIRMED に昇格しない。

## 4. Current vs possible shape

現行（CONFIRMED）:

```text
Cursor / Codex
    ↓
local repository
    ↓
GitHub
    ├─ PR
    ├─ Review
    ├─ Issues
    ├─ CI
    └─ main
```

Origin が成熟したあとの製品側の可能形（INTENDED。採用しない）:

```text
Cursor Agent
    ↓
Origin Codebase
    ├─ repository
    ├─ branch
    ├─ PR
    ├─ review
    ├─ merge
    └─ CI
```

本リポジトリの Human GO 列（UNCHANGED）:

```text
Implementation Start GO
↓
Agent が branch で作業
↓
Draft PR
↓
Fresh Review
↓
Human Ready GO
↓
Ready
↓
Human Merge GO
↓
Merge
```

この列の識別子は GitHub PR 番号と expected head SHA に拘束される
（DEC-AI-ORG-003）。Origin 側 PR 番号へ置換しない。

## 5. Recommended configuration

Human ACCEPT 後も、実効構成は次のみとする。

```text
GitHub = authoritative repository / governance SSOT
Cursor
  ├─ IDE
  ├─ Agent
  └─ Origin
       └─ GitHub repo を sync して評価（別 Human GO が必要。本 Decision では認可しない）
```

```text
移行する: NO
評価項目をアーキテクチャに追加する: YES
Origin を GitHub の代替にする: NO
Origin を Agent 実行面の shadow にする: YES（有効化は別 GO）
```

GitHub が現に担っている役割（移行するとガバナンス正本の移行になる）:

- PR 番号を Decision / Evidence 識別子として利用
- main SHA を正本識別子として利用
- CI 証跡の保存
- Issue で残課題を管理
- Human GO を PR 単位・HEAD SHA 単位で拘束
- 将来の保守エージェントとの接続先

ここを変える判断は、Origin の権限管理・監査・branch protection・
データ保持・バックアップ仕様が CONFIRMED になってからでよい。
本 Decision では変えない。

## 6. Evaluation items（必須 5 点）

将来、保守エージェント基盤の候補として Origin を検討してよい条件。
5 点がすべて本リポジトリ観測で CONFIRMED になるまで、GitHub 放棄は HOLD。

| ID | 確認したいこと | 公式 docs 時点 | 本リポジトリ | 移行ブロッカー |
|---|---|---|---|---|
| OE-1 | GitHub → Origin 同期で commit SHA が完全に維持されるか | INTENDED（git history をコピーすると述べる。SHA 同一性の保証文は未確認） | UNKNOWN | Yes |
| OE-2 | GitHub PR と Origin PR / comment の同期方向 | PR 存在は CONFIRMED 双方向。comment / review / check の完全性は INTENDED | UNKNOWN | Yes |
| OE-3 | Branch protection / required checks 相当を Origin 側で強制できるか | Rules and Protections と required-check API は CONFIRMED。GitHub Actions 相当の強制力は INTENDED。mirrored repo では Depot / Buildkite 非対応 | UNKNOWN | Yes |
| OE-4 | Agent が merge や force push を勝手に実行できない権限制御があるか | Cloud agents は push / open PR 可能と CONFIRMED。merge / force-push の Human-equivalent GO 拘束は UNKNOWN | UNKNOWN | Yes |
| OE-5 | Audit log で「誰 / どの Agent が / 何をしたか」を追跡できるか | API actor（user / app / serviceAccount）は CONFIRMED。本運用の Evidence 要件を満たす audit log は UNKNOWN | UNKNOWN | Yes |

追加で移行前に CONFIRMED が必要な項目（本 5 点の外側、P2 記録）:

| ID | 内容 | 状態 |
|---|---|---|
| OE-P2-1 | データ保持 / バックアップ / リージョン | UNKNOWN |
| OE-P2-2 | mirrored repo で GitHub Issues が非同期のまま残課題正本を壊さないか | CONFIRMED 非同期。GitHub Issues を捨てると残課題正本が欠ける |
| OE-P2-3 | Origin API が mirrored repo に届かない制約と Agent/CI 連携の衝突 | CONFIRMED 制約。shadow 評価では GitHub CI を維持する |

判定規則:

```text
5 点が CONFIRMED になる
  ≠ GitHub 放棄 GO
  ≠ Origin を SSOT にする GO

5 点 CONFIRMED のあとでも、GitHub 放棄は別 Human Decision が必要
Detach from GitHub は本 unit では禁止のまま
```

## 7. Relation to maintenance-agent flow

STAFF-CONFIDENCE の後半:

```text
職員
↓
保守エージェント
↓
read-only investigation
↓
Issue / Evidence
↓
Human GO
↓
Cursor Agent
↓
PR
↓
Review
↓
Human Merge GO
```

Origin が吸収しうる範囲は **Cursor Agent → PR → Review** の実行面に限る。
Issue / Evidence / Human GO / Merge の正本は GitHub に残す。

```text
read-only investigation の接続先を Origin だけにしない
Issue 番号の正本を Origin に移さない
Human Merge GO を Origin merge ボタンへ置換しない
```

## 8. Non-authorization（Fail Closed）

本文書および ORIGIN-EVALUATION-1 ACCEPT 単独では、次を認可しない。

- Origin の有効化、codebase name の取得、チーム Origin 権限の付与
- GitHub App 接続の新規承認、mirror に必要な GitHub admin 操作
- GitHub → Origin sync / re-sync
- Detach from GitHub（Origin を source of truth にする操作）
- Origin-hosted リポジトリの新設を本リポジトリ正本として使うこと
- Origin 上での merge / Ready / force-push
- Agent による Origin merge
- Depot / Buildkite / Vercel を本リポジトリ CI 正本にすること
- permission-matrix / DEC-AI-ORG-003 の緩和
- Issue mutation / Issue Close
- SharePoint / Microsoft 365 / Entra / Deploy / production
- token / secret / credential の記録

許可される範囲（docs-only / 評価定義）:

- 本文書の記録
- 公式 docs の read-only 参照
- 評価項目 OE-1..5 を後続 Evidence の検査リストとして使うこと

shadow 評価の実作業（mirror 作成、Agent を Origin repo へ向けること）は
**別 Human Explicit GO** が必要。ACCEPT だけでは開始しない。

## 9. Options

### A. GitHub authoritative + Origin shadow evaluation（推奨）

GitHub を SSOT のまま固定する。Origin は評価候補。有効化・同期は別 GO。
GitHub 放棄は OE-1..5 が CONFIRMED になったあとの別 Decision。

### B. 今すぐ Origin へ移行する（不採用）

ガバナンス正本（PR 番号 / main SHA / CI / Issue / Human GO）の移行になる。
OE-1..5 が UNKNOWN のため Fail Closed に反する。

### C. Origin を無視する（不採用）

製品として Agent 実行面に食い込むため、評価項目をアーキテクチャに置かないと
後続 Agent が GitHub 代替と誤認しやすい。無視は記録しない。

## 10. Decision（Human ACCEPT 後に効力）

Human が Selection packet の ACCEPT 文面を与え、本 unit が main に入ったあと:

**選択肢 A を正本とする。**

```text
GitHub = authoritative repository / governance SSOT
Origin = shadow evaluation candidate
NOT a GitHub replacement
OE-1..5 = OPEN until repository evidence is CONFIRMED
Detach from GitHub = FORBIDDEN
permission expansion = NONE
Implementation Start / Origin enablement / mirror = NOT AUTHORIZED by this Decision
```

ACCEPT 前は本文書は REVIEWABLE であり、Accepted / LOCKED ではない。
Agent は本 PR を根拠に Accepted と書いてはならない。

## 11. Findings

| ID | 重大度 | 状態 | 内容 | 対応 |
|---|---|---|---|---|
| OE-P2-1 | P2 | OPEN | 保持 / バックアップ / リージョンが未確認 | 移行 Decision 前に確認。本 unit では移行しない |
| OE-P2-2 | P2 | OPEN | Issues は mirror 対象外 | GitHub Issues を残課題正本のまま維持 |
| OE-P2-3 | P2 | OPEN | Origin API は mirrored repo に届かない | shadow 中は GitHub CI / GitHub API を維持 |

P0 / P1: なし（docs-only、権限緩和なし、移行なし）。

## 12. Next

1. Human Decision: ORIGIN-EVALUATION-1 ACCEPT または HOLD
   （文面は [`decision-origin-evaluation-1-selection.md`](./decision-origin-evaluation-1-selection.md)）
2. ACCEPT 後も Origin enablement / mirror は開始しない
3. OE-1..5 の観測は、別 Human GO があるときだけ行う
4. GitHub 放棄 Decision は作らない
