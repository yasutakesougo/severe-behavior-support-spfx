# MCP Permission Matrix

- 文書: `.agents/mcp/permission-matrix.md`
- 位置づけ: MCP / コネクタ利用時の**操作単位権限**の実行参照
- 実装単位: AI-ORG-IMPL-4
- 上位正本: `docs/decisions/DEC-AI-ORG-003.md`（DEC-AI-ORG-3）
- 配置根拠: `docs/decisions/ADR-AI-ORG-001.md`

## 重要な限定

- 本文書は**権限分類の文書のみ**である。
- MCP 接続・認証・OAuth・コネクタ設定を行わない。
- token / secret / credential / tenant ID / site URL 等は記録しない。
- 実行手順・認証方法は記載しない。
- 新しい権限の追加、既存禁止操作の緩和、DEC-AI-ORG-3 の変更は行わない。
- 上位正本と矛盾する場合は **DEC-AI-ORG-3 を優先**する。

## 権限区分

| 区分 | 意味 |
|---|---|
| AI単独 | AI が証跡付きで実施してよい |
| 人の事前承認 | 下書き・提案までは可。投稿・反映・実行の前に人の明示承認が必要 |
| 禁止 | この基盤の手順としては実施しない（別の承認プロセスが必要） |

## 共通規則（DEC-AI-ORG-3 準拠）

- 未記載操作は **禁止**（Fail Closed）
- 区分が重複する場合の優先順: `禁止` > `人の事前承認` > `AI単独`
- 「案作成（AI単独）」と「投稿・反映（人の事前承認）」を同一区分にしない
- Review PASS なしの Merge は認めない
- 人の承認は対象・操作・範囲・版（head SHA / artifact / 環境）に拘束する
- head SHA、artifact、環境、変更範囲のいずれかが変化した場合、既存承認および Review PASS は失効し `HOLD` へ戻す

## 操作単位マトリクス

各行は原則として 1 区分のみ。条件列は区分の適用条件であり、別区分との併記ではない。

### GitHub

| 操作 | 区分 | 条件 / 備考 |
|---|---|---|
| GitHub 参照（Issue / PR / Actions / 差分） | AI単独 | — |
| Issue 案のローカル作成 | AI単独 | — |
| Issue 投稿 | 人の事前承認 | repository、対象範囲、投稿内容の範囲を拘束 |
| PR 案のローカル作成 | AI単独 | — |
| PR 作成・本文更新 | 人の事前承認 | repository、PR/対象範囲を拘束 |
| review 案作成 | AI単独 | — |
| review 投稿 | 人の事前承認 | repository、PR 番号、投稿内容の範囲を拘束 |
| ラベル変更 | 人の事前承認 | repository、対象番号、ラベル範囲を拘束 |
| Ready 化 | 人の事前承認 | repository、PR 番号、expected head SHA を拘束。DEC 上は PR 状態更新に相当 |
| マージ | 人の事前承認 | repository、PR 番号、expected head SHA。同一 head SHA の Review PASS。unresolved P0 = 0、unresolved P1 = 0 |

### Git / ローカル

| 操作 | 区分 | 条件 / 備考 |
|---|---|---|
| ローカルのコード・文書変更 | AI単独 | **実装開始承認済み**、かつ承認済み Issue の範囲内 |
| ローカル検証（typecheck / test / build / diff 確認） | AI単独 | — |
| git commit | AI単独 | 承認済み Issue の範囲内。保護ブランチへの直接 commit は禁止 |
| 非保護ブランチへの通常 push | AI単独 | 非保護 feature branch。fast-forward / 非破壊 push に限る |
| force-push（非保護の自 feature branch） | 人の事前承認 | repository、branch 名、expected remote head SHA、理由を拘束。実施後は当該 open PR の Review PASS / merge 承認を失効 |
| force-push（main / 保護ブランチ） | 禁止 | — |
| 保護ブランチ / main への直接 push | 禁止 | — |
| ローカル package 生成 | AI単独 | 配布・登録を含まない |

### Deploy

| 操作 | 区分 | 条件 / 備考 |
|---|---|---|
| 承認済み検証環境への deploy | 人の事前承認 | 対象環境、artifact 名、version または SHA を拘束 |
| 本番環境への deploy | 禁止 | 別の承認プロセスが必要 |

### SharePoint / Entra / Microsoft 365 / データ

| 操作 | 区分 | 条件 / 備考 |
|---|---|---|
| SharePoint App Catalog への登録・更新 | 禁止 | 別の承認プロセスが必要 |
| SharePoint 変更（本番） | 禁止 | 別の承認プロセスが必要 |
| Entra ID 変更 | 禁止 | 別の承認プロセスが必要 |
| Microsoft 365 設定変更 | 禁止 | 権限・テナント設定を含む。別の承認プロセスが必要 |
| 本番データ変更 | 禁止 | — |
| 物理削除 | 禁止 | — |

### Notion

| 操作 | 区分 | 条件 / 備考 |
|---|---|---|
| Notion 要件 / ADR / Meeting 参照 | AI単独 | 接続承認後に限る（接続設定自体は本文書の対象外） |
| Notion 本番ページ更新 | 禁止 | 別の承認プロセスが必要 |

## 承認拘束（要約）

承認証跡に最低限含める項目（DEC-AI-ORG-3）:

| 項目 | 内容 |
|---|---|
| 操作 | マトリクスの操作名 |
| 対象 | repository / 環境 / リソース等 |
| 範囲 | 変更または投稿の範囲 |
| 対象の版 | head SHA / artifact / version 等 |
| 承認者 | 人の識別可能な記録 |
| 承認日時 | 承認が行われた日時 |

## 本文書に含めないもの

- MCP サーバの接続先・認証・OAuth・コネクタ設定
- token / secret / credential / tenant ID / site URL
- 操作の実行手順・コマンド例による自動実行手順
- DEC-AI-ORG-3 にない新権限の追加
- 禁止操作の緩和

## 関連正本

| 主題 | 正本 |
|---|---|
| 権限境界（上位） | `docs/decisions/DEC-AI-ORG-003.md` |
| Governance 入口 | `docs/process/ai-governance.md` |
| Workflow 入口 | `docs/process/ai-workflow.md` |
| Role 入口 | `docs/process/ai-role.md` |
| 配置 | `docs/decisions/ADR-AI-ORG-001.md` |
