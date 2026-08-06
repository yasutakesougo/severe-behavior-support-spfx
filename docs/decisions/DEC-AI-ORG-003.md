# DEC-AI-ORG-3: AI許可操作と人の承認境界

- ID: DEC-AI-ORG-3
- ファイル: `docs/decisions/DEC-AI-ORG-003.md`
- 状態: 承認
- 作成日: 2026-08-06
- 決定日: 2026-08-06
- 正本参照: `docs/process/ai-org-onboarding-implementation-plan.md`
- 前提:
  - DEC-AI-ORG-1 は承認済み（論理分離構成を採用）
  - DEC-AI-ORG-2 は承認済み（法人内再利用可能な論理モデルとして設計）
  - ADR-AI-ORG-1 は承認済み（既存正本を維持したハイブリッド配置）
  - ADR-AI-ORG-1 merge commit: `7513b21cf0bcac855a25a24f90668881df04b46a`
  - HOLD は維持。実装開始・ディレクトリ新設・既存正本移動は禁止継続
  - `.agents/mcp/` の作成は本 DEC では実行しない（ADR-AI-ORG-1 の将来実装条件）
  - 現在の HOLD（実装未開始）と、本 DEC が定める恒久的な権限区分を混同しない

## 判断する対象

本 DEC が決める対象は次のみとする。

- AI に許可する操作の区分原則
- 人の事前承認が必要な操作の境界
- この基盤の手順として禁止する操作
- 操作単位の権限マトリクス（初期版）の採否
- 人の事前承認の有効条件（対象・範囲・版への拘束）
- 区分重複時の優先規則
- 既存正本との優先順位

## 本 DEC で決めないこと

| 対象外 | 扱い |
|---|---|
| 各 MCP サーバの認証設定・接続実装 | 後続。本 DEC では承認しない |
| `.agents/mcp/` ディレクトリまたは権限マトリクス実体ファイルの作成 | 禁止継続。実装開始承認後 |
| Logical Command / Adapter の実装 | 後続 |
| Skill / Agent / Workflow 本文の追加 | 後続 |
| 正本の物理配置の再決定 | ADR-AI-ORG-1 済み。再オープンしない |
| 再利用範囲の再決定 | DEC-AI-ORG-2 済み。再オープンしない |
| 他アプリへの適用・移植 | 未承認継続 |
| HOLD の解除・実装開始そのもの | しない（権限区分の定義のみ） |

## 背景

- `docs/process/development-process.md` は、明示許可された範囲でのコード変更・文書変更とローカル検証を AI に認め、merge / deploy / SharePoint / Microsoft 365 / Entra ID / 本番データ変更を人の明示承認必須としている
- 計画正本は、MCP を「読取専用で一括」せず、操作単位で権限を分ける方針を採っている
- 「案作成」と「投稿・反映・実行」を混同すると、Fail Closed が崩れる
- SPFx の deploy には App Catalog 登録や SharePoint 配備が含まれる可能性があり、`deploy` と SharePoint 変更を同一行にすると区分が衝突する
- したがって本 DEC では、接続実装ではなく、操作区分の原則・初期マトリクス・承認拘束条件を固定する

## 権限区分（原則）

| 区分 | 意味 |
|---|---|
| AI単独 | AI が証跡付きで実施してよい |
| 人の事前承認 | 下書き・提案までは可。投稿・反映・実行の前に人の明示承認が必要 |
| 禁止 | この基盤の手順としては実施しない（別の承認プロセスが必要） |

### 追加原則

- 未記載操作は禁止とする（Fail Closed）
- 区分が重複する場合は、`禁止` > `人の事前承認` > `AI単独` の順に厳しい区分を優先する
- 「案作成（AI単独）」と「投稿・反映（人の事前承認）」を同一区分にしない
- Review PASS なしの Merge は認めない（人の事前承認区分）
- Review PASS は review 対象 head SHA に拘束する。merge 対象 expected head SHA と一致必須
- 人の承認は、対象・操作・範囲・版に拘束する
- 対象 SHA、artifact、環境、変更範囲のいずれかが変わった場合、既存承認および Review PASS は失効し `HOLD` へ戻す
- 現在の HOLD（実装未開始）と、本 DEC の恒久的な権限区分を混同しない
- 本 DEC と既存正本が矛盾する場合、本 DEC を優先し、後続で既存正本を整合更新する

### 既存正本との関係

- 参照正本: `docs/process/development-process.md`
- 本 DEC は、SharePoint / Microsoft 365 / Entra ID / 本番データ変更について、既存の「人の明示承認必須」より厳しい「禁止（この基盤の手順としては実施しない。別プロセスが必要）」へ強化する
- 優先順位: `DEC-AI-ORG-3` > `docs/process/development-process.md` / `docs/development/quality-gates.md`（権限境界に関する記述）
- 後続更新対象: 上記既存正本の承認境界記述を、本マトリクスへ整合させる（本 PR では変更しない）

## 人の事前承認の有効条件

承認証跡には、最低限次を含める。

| 項目 | 内容 |
|---|---|
| 操作 | 実施する操作名（マトリクスの行） |
| 対象 | repository / 環境 / リソース等 |
| 範囲 | 変更または投稿の範囲 |
| 対象の版 | head SHA / artifact / version 等 |
| 承認者 | 人の識別可能な記録 |
| 承認日時 | 承認が行われた日時 |

操作別の必須拘束:

| 操作 | 承認が拘束する対象 |
|---|---|
| PR マージ | repository、PR 番号、expected head SHA。同一 head SHA に対する Review PASS が存在すること。unresolved P0 = 0、unresolved P1 = 0 |
| Review PASS | repository、PR 番号、review 対象 head SHA |
| force-push（非保護の自 feature branch） | repository、branch 名、expected remote head SHA、force-push 理由 |
| 承認済み検証環境への deploy | 対象環境、artifact 名、version または SHA |
| Issue・PR・レビュー投稿 | repository、対象番号、投稿内容の範囲 |
| 設定変更（別プロセスで扱う場合） | 対象リソース、変更項目、before / after |

### Review PASS の有効条件

- repository、PR 番号、review 対象 head SHA を記録する
- Review PASS の head SHA は、merge 対象 expected head SHA と一致必須
- head SHA が変化した場合、Review PASS は失効する
- 失効後は再レビュー完了まで `HOLD` とする
- unresolved P0 / P1 が 0 件であることを必須とする

失効規則:

- head SHA、artifact、対象環境、変更範囲のいずれかが承認時と異なる場合、既存承認は無効
- Review PASS の head SHA が merge 対象 expected head SHA と一致しない場合、Review PASS およびマージ承認は無効
- force-push により open PR の head が変わった場合、当該 PR の merge 承認および Review PASS は失効し、再レビューへ戻す
- 無効化した操作は `HOLD` とし、再承認なしに進行しない

## 選択肢

### A. 操作単位の権限マトリクス原則を採用する

上記 3 区分、Fail Closed、区分重複時の厳格優先、承認拘束条件を採用し、下記初期マトリクスを権限境界の初期正本とする。

### B. 当面は読取専用で一括する

GitHub / Notion / Microsoft 365 を含む接続を読取専用で一括管理する。

計画正本のレビュー（PR #45）および現行開発プロセスのコード変更許可と合わず、採用しない。

### C. ツールごとの個別例外を先に認める

特定ツールや運用都合で、区分原則より先に例外を固定する。

Fail Closed と矛盾しやすく、本 DEC では採用しない。

## 初期マトリクス（選択肢 A の内容）

各行は原則として 1 区分のみを持つ。条件列は区分の適用条件であり、別区分との併記ではない。

| 操作 | 区分 | 条件 / 備考 |
|---|---|---|
| GitHub 参照（Issue / PR / Actions / 差分） | AI単独 | — |
| Issue 案作成（ローカル出力） | AI単独 | — |
| Issue 投稿 | 人の事前承認 | repository、対象範囲、投稿内容の範囲を拘束 |
| PR 案作成（ローカル出力） | AI単独 | — |
| PR 作成・更新投稿 | 人の事前承認 | repository、PR/対象範囲を拘束 |
| PR レビューコメント案 | AI単独 | — |
| PR レビュー投稿 | 人の事前承認 | repository、PR 番号、投稿内容の範囲を拘束 |
| ラベル更新 | 人の事前承認 | repository、対象番号、ラベル範囲を拘束 |
| PR マージ | 人の事前承認 | repository、PR 番号、expected head SHA を拘束。同一 head SHA に対する Review PASS が存在。unresolved P0 = 0、unresolved P1 = 0 |
| ローカルのコード・文書変更 | AI単独 | **実装開始承認済み**、かつ承認済み Issue の範囲内 |
| ローカル検証（typecheck / test / build / diff 確認） | AI単独 | — |
| git commit | AI単独 | 承認済み Issue の範囲内。保護ブランチへの直接 commit は禁止 |
| branch push（非保護の feature branch） | AI単独 | 対象 branch が非保護であること。通常の fast-forward / 非破壊 push に限る |
| force-push（非保護の自 feature branch） | 人の事前承認 | 安全性優先。repository、branch 名、expected remote head SHA、理由を拘束。実施後は当該 open PR の Review PASS / merge 承認を失効させ再レビューへ戻す |
| force-push（main / 保護ブランチ） | 禁止 | — |
| 保護ブランチ / main への直接 push | 禁止 | — |
| ローカル package 生成 | AI単独 | 配布・登録を含まない |
| 承認済み検証環境への deploy | 人の事前承認 | 対象環境、artifact 名、version または SHA を拘束 |
| 本番環境への deploy | 禁止 | 別の承認プロセスが必要 |
| SharePoint App Catalog への登録・更新 | 禁止 | 別の承認プロセスが必要 |
| SharePoint 本番変更 | 禁止 | 別の承認プロセスが必要 |
| Entra ID 変更 | 禁止 | 別の承認プロセスが必要 |
| Microsoft 365 権限・テナント設定変更 | 禁止 | 別の承認プロセスが必要 |
| 本番データ変更・物理削除 | 禁止 | — |
| Notion 要件 / ADR / Meeting 参照 | AI単独 | 接続承認後に限る |
| Notion 本番ページ更新 | 禁止 | 別の承認プロセスが必要 |

## 決定

**選択肢 A を承認する。**

操作単位の権限マトリクス、Fail Closed、区分重複時の厳格優先、承認の対象・範囲・版への拘束を採用する。

AI 許可操作と人の承認境界は、操作単位の権限マトリクス原則（AI単独 / 人の事前承認 / 禁止）、Fail Closed、区分重複時の厳格優先、承認拘束条件で扱う。

上記初期マトリクスを、権限境界の初期正本とする。

`git commit` および非保護 feature branch への通常の `branch push` は、実装開始承認後かつ承認済み Issue 範囲内で **AI単独** とする。

非保護の自 feature branch への `force-push` は、安全性優先のため **人の事前承認** とする。

`main` / 保護ブランチへの直接 push および force-push、本番 deploy、SharePoint App Catalog 登録・更新、SharePoint / Entra ID / Microsoft 365 変更、本番データ変更、Notion 本番ページ更新は **禁止** とする。

PR マージは、同一 head SHA に対する Review PASS（unresolved P0 / P1 = 0）と、expected head SHA 拘束の人の事前承認を必須とする。

本決定は、MCP 接続実装、認証設定、`.agents/mcp/` の作成、実装開始そのもの、ディレクトリ新設、既存正本移動を承認しない。

理由:

- 計画正本および PR #45 / PR #50 レビューの権限マトリクス方針と整合する
- 現行プロセスが認めるローカル変更・検証を、Fail Closed 下でも実施可能にする
- deploy を環境・成果物単位に分割し、SharePoint 配備との区分衝突を避ける
- force-push を人の事前承認とし、他者 commit 上書きリスクを避ける
- Review PASS と merge 承認を同一 head SHA に拘束し、古いレビュー結果の流用を防ぐ
- 選択肢 B / C は Fail Closed または実運用と合わない

## 承認記録

- 承認内容: 選択肢 A（操作単位の権限マトリクス、Fail Closed、区分重複時の厳格優先、承認の対象・範囲・版への拘束）
- 承認日: 2026-08-06
- 承認範囲の上限:
  - HOLD は維持する
  - 実装開始は承認しない
  - MCP 接続は承認しない
  - 認証設定は承認しない
  - ディレクトリ新設は承認しない
  - 既存正本移動は承認しない

## 本決定の効力と非効力

### 効力

- 以降の Governance / Workflow / Agent / Command / MCP 文書は、本マトリクス原則と矛盾しない表現にする
- 計画正本の「権限境界」判断単位を閉じる
- Decision Units（DEC-AI-ORG-1 / 2 / ADR-AI-ORG-1 / DEC-AI-ORG-3）の判断記録は揃った
- 将来 `.agents/mcp/` に置く権限マトリクス実体は、本初期マトリクスを起点としてよい（作成自体は別承認）
- 既存正本の権限記述が本 DEC と矛盾する場合、本 DEC を優先し、後続 Issue で整合更新する

### 非効力

- HOLD は維持する
- 実装開始承認にはならない
- ディレクトリ新設は引き続き禁止する
- 既存正本移動は引き続き禁止する
- MCP サーバの認証設定・接続実装は承認しない
- `.agents/mcp/` や `docs/process/ai-*.md` の作成は承認しない
- マトリクス未記載操作の実施を許可しない（Fail Closed）
- 本番 deploy / App Catalog / SharePoint / Entra / M365 / 本番データ変更 / Notion 本番更新を、この基盤の手順として許可しない
- 他アプリへの適用・移植は承認しない

## 次工程

本 DEC は `承認` 済みである。HOLD・実装禁止・ディレクトリ新設禁止・既存正本移動禁止は維持する。

Decision Units が揃ったあとの実装着手は、別途「実装開始の人の明示承認」を必要とする。

後続で、`docs/process/development-process.md` 等の既存正本を本マトリクスへ整合更新する（実装開始承認後の個別 Issue）。

## レビュー反映メモ（PR #50）

| 指摘 | 反映 |
|---|---|
| P1-1 コード変更・commit・push 未記載 | ローカル変更 / 検証 / commit / branch push / force-push を追加。commit・非保護通常 push は AI単独、main/保護への force-push は禁止 |
| P1-2 deploy と SharePoint の区分衝突 | package 生成 / 検証環境 deploy / 本番 deploy / App Catalog に分割。重複時は厳しい区分を優先。既存正本より禁止へ強化する優先順位を明記 |
| P1-3 人の事前承認の有効条件未定義 | 証跡必須項目、操作別拘束、版変更時の失効規則を追加 |
| P2-1 Notion 操作名に状態が混在 | `Notion 本番ページ更新` に改名し、区分を禁止に固定。行は 1 区分形式へ統一 |
| 再レビュー P1-1 force-push 安全条件不足 | 非保護自 feature branch の force-push を **人の事前承認**（案A）へ変更 |
| 再レビュー P1-2 Review PASS が head 非拘束 | Review PASS 有効条件を追加。PR マージは同一 head SHA の Review PASS + P0/P1 = 0 を必須化 |
