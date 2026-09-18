# Shared Authority Boundaries

## 目的

Skill ごとに同じ権限禁止文を複製せず、エージェントが安全に継続できる範囲と Human approval が必要な境界を一か所で示す。

この文書は権限を新設・拡張しない。
操作単位の正本は `.agents/mcp/permission-matrix.md`、上位正本は `docs/decisions/DEC-AI-ORG-003.md` とする。
矛盾する場合は上位正本を優先する。

## Safe in-scope actions

明示されたタスク範囲内では、既存の権限正本が許す限り、次を不要な再承認なしで継続してよい。

- repository / Issue / PR / CI / evidence の read-only 参照
- 承認済み実装範囲でのローカルコード・文書変更
- 非破壊のローカル検証、typecheck、test、build、diff 確認
- findings、review draft、handoff draft の作成

## Human approval boundary

現在の次アクションが次の操作に到達したときは、対応する Human approval を確認してから実行する。

- GitHub 上の外部 write（Issue / PR / review / label / Ready 等）は permission matrix に従う
- Merge は明示 Human Merge GO が必要
- 検証環境 deploy は対象 artifact / environment に拘束された事前承認が必要
- Production mutation、SharePoint App Catalog、本番 SharePoint、Entra ID、Microsoft 365、本番データ、物理削除は既存正本の禁止または別承認プロセスに従う
- destructive action、権限変更、公開、material scope expansion は対応する Human approval が必要

## Transition-specific HOLD

承認不足を `HOLD` にするのは、**現在要求されている次アクションがその承認を必要とするとき**に限る。

後続工程の Merge / Deploy approval が未取得であることだけを理由に、要件整理、設計レビュー、承認済みローカル実装、非破壊検証を停止しない。

ただし、現在工程そのものに必要な承認・Decision・Evidence が不足している場合は `HOLD` とする。

## Scope and evidence

- task の hard scope、accepted / locked Decision、current GitHub state、evidence を優先する
- 既に確定している scope / authority / evidence を、状態変化がないのに再確認し続けない
- head SHA、artifact、environment、変更範囲が変わり既存承認の拘束条件を外れた場合は再評価する
- 未確認事項を推測で承認済み・確定済みに変えない

## Skill responsibility

各 Skill の `## 禁止事項` には、その Skill 固有の誤判定・責務逸脱だけを書く。

共通の merge / deploy / production / tenant mutation 禁止文を各 Skill に複製しない。
共通 Authority はこの文書と permission matrix を参照する。
