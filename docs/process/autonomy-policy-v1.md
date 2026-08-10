# AUTO-1 — AUTONOMY-POLICY-V1（Autonomy Policy contract）

- 文書: `docs/process/autonomy-policy-v1.md`
- Unit: **AUTO-1 — AUTONOMY-POLICY-V1**
- 位置づけ: AI Development OS レーンの **autonomy policy contract 正本（candidate）**
- 状態: **CANDIDATE / PENDING HUMAN ACCEPTANCE（AUTO-1-A）**
- Human 入力（2026-08-10 / plan adoption・unit 固定；Policy Acceptance ではない）:
  - 「Cursor = Builder / Codex = Independent Reviewer」構成の plan 採用
  - 次 substantive unit = **AUTO-1 AUTONOMY-POLICY-V1** に固定
  - AUTO-1 ではコードを書かず、機械判定可能な契約のみ固定する
  - 初期 Capability set・Gateway 判定順・DENY reason の方向性
  - 特定 SDK 言語に依存しない「Cursor execution backend」抽象化
  - negative test 5 件を `LOW-AUTO-PILOT-V2` の前に置く方針
- 上位正本（本文書は緩和・上書きしない）:
  - `docs/decisions/DEC-AI-ORG-003.md`（権限マトリクス / Fail Closed）
  - `docs/decisions/DEC-AA-001.md`（Auto-Approval Policy v1）
  - `docs/decisions/DEC-AA-003.md`（AUTO-UNTIL-GATE Policy v1 / max_repair_cycles = 3）
  - `docs/process/routine-aug-v1.md`（Routine AUG v1）
  - `docs/process/process-optimization-v1.md`（PROCESS-OPT-V1 / risk model 正本）
  - `docs/process/low-auto-pilot-v1.md`（LOW-AUTO-PILOT-V1 / pilot envelope）
- 関連:
  - Decision packet: [`../architecture/decision-auto-1-autonomy-policy-v1-packet.md`](../architecture/decision-auto-1-autonomy-policy-v1-packet.md)
  - Background Agent 実行契約: [`background-agent-contract.md`](./background-agent-contract.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## 状態（固定）

```text
AUTO-1 unit selection: SELECTED / CONSUMED（Human 固定 2026-08-10）
AUTONOMY-POLICY-V1 contract: CANDIDATE / PENDING HUMAN ACCEPTANCE（AUTO-1-A）
Implementation（Registry / Gateway / backend）: NOT STARTED / OUT OF SCOPE（本 unit）
Enablement（Gateway 経由の実行許可）: NOT GRANTED
Ready: HUMAN-ONLY
Merge: HUMAN-ONLY
SharePoint / M365: UNCHANGED / FORBIDDEN
Deploy: FORBIDDEN
```

```text
Policy CANDIDATE ≠ ACCEPTED
Policy ACCEPTED（将来） ≠ ENABLED
Policy ACCEPTED（将来） ≠ Implementation Start
Agent recommendation / Independent Review ≠ Human Acceptance
```

## 目的

LOW-AUTO-PILOT-V1 で成立した自律運用を、「会話上のルール」から
**システムが強制できる契約**へ移すための policy contract を固定する。

```text
安全性の根拠を移す:
  「Agent が賢いから安全」
  → 「Agent が間違えてもシステムが止めるから安全」
```

AUTO-1 はコードを書かない。機械判定可能な契約（taxonomy / 分類 / 判定順 /
reason / limits / fail-closed / 監査）だけを固定する。

## 2 レーン分離（固定）

```text
法人アプリ本体レーン
└─ AssessmentSnapshot adapter
   └─ 現在: EC-3 / EC-4 Decision 待ち（本レーンの正本・gate は AUTO-1 で変更しない）

AI Development OS レーン
└─ AUTO-1 AUTONOMY-POLICY-V1
   ↓
   Capability Registry（AUTO-2 候補）
   ↓
   Task Packet Schema（AUTO-3 候補）
   ↓
   Action Gateway contract（AUTO-4 候補）
   ↓
   Cursor execution backend（AUTO-8 候補）
```

```text
AUTO-1 開始 ≠ EC-3 / EC-4 skip
AI Development OS レーン = 「開発方法」を改善するレーン
法人アプリ本体レーン = 法人アプリを完成させるレーン
両レーンの gate / Decision は相互に代替しない
```

## 役割分離（固定）

```text
Builder: Cursor（Cursor execution backend 経由）
Independent Reviewer: Codex（Builder と別系統）
Builder は自分の成果物の Independent Review を自認しない
review.request は依頼のみ（レビュー判定の代行ではない）
```

## 用語（machine-checkable 定義）

| 用語 | 定義 |
| --- | --- |
| Capability | Gateway が判定対象とする操作の最小単位。`<resource>.<verb>` 形式・小文字・ドット区切り |
| Capability Registry | Capability の閉集合正本。未登録 Capability は存在しない扱い（AUTO-2 で実体化） |
| Task Packet | Human が発行する作業単位の契約。scope / baseline / limits / 承認証跡を運ぶ（AUTO-3 で schema 化） |
| Action Gateway | すべての side-effect 要求を判定する唯一の通過点（AUTO-4 で contract 化） |
| Cursor execution backend | Builder 実行系の抽象名。特定 SDK 言語に依存しない（初期 backend 候補 = TypeScript SDK；AUTO-8） |
| baseline SHA | Task Packet が拘束される起点 commit SHA |
| verdict | Gateway の判定結果。`ALLOW` / `DENY` の 2 値のみ |
| reasonCode | DENY の理由。閉集合（後述） |

## 1. Capability taxonomy

```text
命名: <resource>.<verb>（小文字 / ドット区切り / 単数形 resource）
Capability は Registry 登録制の閉集合
未登録 Capability = 存在しない = DENY / UNKNOWN
1 Capability = 1 分類（AUTO_ALLOWED / HUMAN_ONLY / FORBIDDEN のいずれか 1 つ）
分類未指定の登録は不正 = FORBIDDEN 扱い（fail-closed）
分類が重複・矛盾した場合は厳しい側を採用:
  FORBIDDEN > HUMAN_ONLY > AUTO_ALLOWED
（DEC-AI-ORG-003「禁止 > 人の事前承認 > AI単独」と同順）
```

## 2. 分類と初期 Capability set v1

### AUTO_ALLOWED（Gateway が実行実装を持ってよい）

| Capability | 意味 | risk | 前提条件 |
| --- | --- | --- | --- |
| `repo.read` | リポジトリ読取（コード / docs / 履歴 / diff） | LOW | read-only |
| `code.edit` | working tree のローカル編集 | LOW | Task Packet の allowedPaths 内のみ |
| `test.run` | ローカル検証（typecheck / test / lint / format / check:\*） | LOW | リポジトリ外への副作用なし |
| `branch.create` | 非保護 feature branch 作成 | LOW | 保護ブランチ不可 |
| `commit.create` | ローカル commit | LOW | allowedPaths 内の変更のみ / baseline 一致 |
| `branch.push` | 非保護 feature branch への通常 push | MEDIUM | fast-forward / 非破壊のみ。force-push は未登録（= DENY / UNKNOWN） |
| `pull_request.create_draft` | Draft PR 作成 | MEDIUM | Draft のみ。Ready 化は別 Capability（HUMAN_ONLY） |
| `pull_request.update_draft` | Draft PR の更新（Draft のまま） | MEDIUM | Draft のみ |
| `ci.read` | CI 結果読取 | LOW | read-only |
| `review.request` | Independent Reviewer への review 依頼 | MEDIUM | reviewer は Builder と別系統（Codex 等） |

```text
AUTO_ALLOWED 分類 ≠ 実行有効化
有効化（ENABLED）は別 Human Explicit GO（AUTO-8 以降の enablement unit）
現行の HUMAN-ONLY / 別 GO 境界（DEC-AI-ORG-003 / Routine AUG /
PROCESS-OPT-V1 / LOW-AUTO-PILOT-V1）は本文書では緩和されない
→ Conflict register 参照（RECORDED ONLY）
```

### HUMAN_ONLY（Gateway は実行実装を持たない。人間が別経路で実施）

| Capability | 意味 |
| --- | --- |
| `pull_request.ready` | Draft → Ready for Review 遷移 |
| `pull_request.merge` | PR マージ |
| `decision.accept` | Decision の Human Acceptance |
| `decision.lock` | Decision の LOCK |

### FORBIDDEN（この基盤の手順として実施しない。人間にも Gateway 経由の実行経路を作らない）

| Capability | 意味 | 上位正本 |
| --- | --- | --- |
| `sharepoint.schema.write` | SharePoint schema / list / column 変更 | DEC-AI-ORG-003（禁止） |
| `sharepoint.permission.write` | SharePoint 権限変更 | DEC-AI-ORG-003（禁止） |
| `github.permission.write` | GitHub 権限・保護設定変更 | DEC-AI-ORG-003 系（permission mutation） |
| `secret.write` | secret / credential / token の書込・登録 | DEC-AI-ORG-003 / check:scope |
| `deploy.production` | 本番 deploy | DEC-AI-ORG-003（禁止） |

### 非保持原則（most important）

```text
Prompt に「Merge 禁止」と書くことは強制手段として認めない。

Action Gateway は HUMAN_ONLY / FORBIDDEN capability の
実行実装そのものを持たない（non-possession）。

Gateway に渡す credential / token の権限 scope も
AUTO_ALLOWED capability の実行に必要な最小権限に限定する
（merge 可能な token を Gateway に渡さない）。
```

## 3. Risk model binding

```text
risk = LOW / MEDIUM / HIGH
risk model 正本 = PROCESS-OPT-V1（再定義しない）

Capability は riskClass を持つ（上表）
Task Packet は riskCeiling を宣言する
capability.riskClass > packet.riskCeiling → DENY / POLICY_MISMATCH
HIGH capability は v1 の AUTO_ALLOWED に存在しない
risk 判定不能 → UNKNOWN → DENY
```

## 4. Baseline SHA binding

```text
Task Packet は baselineSha（+ repository / 対象 branch）を必須で持つ
baseline 検証対象の現在 SHA が baselineSha と一致しない → DENY / BASELINE_MOVED
baseline が動いた Task Packet は失効（同一 packet の再 ALLOW なし）
再開には Human による新 Task Packet 発行が必要
承認証跡も版（SHA）に拘束される（DEC-AI-ORG-003 失効規則と同じ）
```

## 5. allowedPaths enforcement

```text
Task Packet は allowedPaths（明示 path prefix / glob の閉集合）を必須で持つ
code.edit / commit.create が allowedPaths 外の path に触れる → DENY / OUT_OF_SCOPE
allowedPaths 未指定の packet で書込系 capability を要求 → DENY / OUT_OF_SCOPE
「リポジトリ全体を許可」の暗黙 default は存在しない
path 判定不能（symlink / 正規化不能等） → UNKNOWN → DENY
```

## 6. Limits（v1 defaults）

Task Packet 単位。Human は packet でより厳しく設定してよいが、
policy max を超える緩和は無効（DENY / POLICY_MISMATCH）。

| Limit | v1 値 | 根拠 / 備考 |
| --- | --- | --- |
| `max_repair_cycles` | 3 | DEC-AA-003 整合（本 policy で変更不可） |
| `max_slices_per_batch` | 4 | LOW-AUTO-PILOT-V1 capacity 整合 |
| `max_batches` | 1 | LOW-AUTO-PILOT-V1 capacity 整合 |
| `max_changed_files_per_packet` | 20 | 巨大 PR 禁止 |
| `max_diff_lines_per_packet` | 1000 | 巨大 PR 禁止 |
| `max_commits_per_packet` | 10 | slice 単位の failure attribution 維持 |
| `max_draft_prs_per_packet` | 1 | packet = 1 PR 境界 |
| `max_gateway_requests_per_packet` | 200 | 暴走 loop 停止 |

```text
limit 超過 → DENY / POLICY_MISMATCH
limit 計測不能 → UNKNOWN → DENY
数値は AUTO-1-A Acceptance 対象（Human が確定する）
```

## 7. Fail-closed rules

```text
default verdict = DENY（ALLOW は全チェック PASS 時のみ）
未登録 capability → DENY / UNKNOWN
分類未指定 / 分類矛盾 → FORBIDDEN 扱い → DENY / POLICY_MISMATCH
入力欠落・曖昧・矛盾 → DENY / UNKNOWN
Gateway 内部エラー / 評価不能 → DENY / UNKNOWN
部分実行なし: DENY は side-effect ゼロ（判定前に実行しない）
DENY 後の自動リトライで判定を変えない（新 Human Task Packet が必要）
```

## 8. UNKNOWN → DENY

```text
UNKNOWN → DENY
```

会話運用の `UNKNOWN → HOLD`（Routine AUG / LOW-AUTO-PILOT-V1）の
Gateway 版。Gateway は保留状態を持たず、不明は即 DENY とする。
（workflow 側の HOLD 運用は変更しない。）

## 9. Approval requirement

```text
Task Packet の発行自体が Human 承認行為（per-slice Implementation Start 等）
承認証跡は DEC-AI-ORG-003 の必須 6 項目を含む:
  操作 / 対象 / 範囲 / 対象の版 / 承認者 / 承認日時
承認は taskPacketId・baselineSha・allowedPaths・capability set に拘束される
承認証跡 欠落 / 対象不一致 / 範囲不一致 → DENY / HUMAN_ONLY
承認の版不一致（baseline moved） → DENY / BASELINE_MOVED
HUMAN_ONLY capability は承認があっても Gateway 経由では実行しない
（非保持原則。承認は人間の別経路実行の前提であって Gateway 入力ではない）
```

## 10. Audit requirement

```text
全 request を append-only で記録する（ALLOW / DENY の双方）
audit-before-execute: 監査記録の書込に成功するまで実行しない
監査記録を書けない場合 → DENY / UNKNOWN（実行しない）
監査記録の削除・改変は capability として存在しない（= DENY / UNKNOWN）
```

必須フィールド:

| Field | 内容 |
| --- | --- |
| `timestamp` | 判定日時（UTC） |
| `taskPacketId` | 対象 Task Packet |
| `capability` | 要求 capability |
| `requestor` | 要求元（backend / agent 識別子） |
| `verdict` | `ALLOW` / `DENY` |
| `reasonCode` | DENY 理由（ALLOW は `-`） |
| `baselineSha` | packet の baseline |
| `paths` | 触れた / 触れようとした path（該当時） |
| `idempotencyKey` | side-effect 要求の冪等キー（該当時） |

## Gateway 判定 pipeline（固定順序）

```text
request
↓ 1. capability exists?（Registry 照合）
↓ 2. task packet allows?（packet の capability set に含まれるか）
↓ 3. risk permits?（riskClass ≤ riskCeiling）
↓ 4. approval valid?（証跡 6 項目・拘束一致）
↓ 5. baseline matches?（baselineSha 一致）
↓ 6. path within scope?（allowedPaths 内）
↓ 7. idempotency valid?（key 提示・重複整合）
↓
ALLOW
```

失敗時の reasonCode（閉集合）:

| Check | 失敗時 reasonCode |
| --- | --- |
| 1. capability exists — 未登録 | `UNKNOWN` |
| 1. capability exists — 登録済み HUMAN_ONLY 分類 | `HUMAN_ONLY` |
| 1. capability exists — 登録済み FORBIDDEN 分類 | `POLICY_MISMATCH` |
| 2. task packet allows | `OUT_OF_SCOPE` |
| 3. risk permits | `POLICY_MISMATCH` |
| 4. approval valid | `HUMAN_ONLY` |
| 5. baseline matches | `BASELINE_MOVED` |
| 6. path within scope | `OUT_OF_SCOPE` |
| 7. idempotency valid | `POLICY_MISMATCH` |
| いずれかの段で判定不能 | `UNKNOWN` |

```text
verdict = ALLOW / DENY の 2 値のみ（第 3 状態なし）
reasonCode = UNKNOWN / POLICY_MISMATCH / BASELINE_MOVED / HUMAN_ONLY / OUT_OF_SCOPE
（閉集合。追加は policy 改訂 = 別 Human Decision）
最初に失敗した check の reasonCode を記録する（後段は評価しない）
```

### POLICY_BLOCKED（表示ラベル）

```text
POLICY_BLOCKED は reasonCode ではなく human-facing / test-facing の表示ラベル:
  POLICY_BLOCKED ≡ DENY ∧ reasonCode ∈ { HUMAN_ONLY, POLICY_MISMATCH, OUT_OF_SCOPE }
BASELINE_MOVED / UNKNOWN はそのまま表示する
```

### Idempotency

```text
side-effect capability（commit.create / branch.push / pull_request.* /
review.request）の要求は idempotencyKey 必須
key 欠落 → DENY / POLICY_MISMATCH
同一 key ＋ 同一 payload の再要求 → 前回結果を返す（再実行しない）
同一 key ＋ 異なる payload → DENY / POLICY_MISMATCH
```

## Negative test set（LOW-AUTO-PILOT-V2 の前提）

Gateway 実装（AUTO-4 / AUTO-8）の受入条件として固定する。
AUTO-1 では期待値のみ固定し、テストコードは書かない。

| ID | Request | 期待 verdict | 期待 reasonCode | 表示 |
| --- | --- | --- | --- | --- |
| AUTO-NT-1 | `pull_request.merge` | DENY | `HUMAN_ONLY` | POLICY_BLOCKED |
| AUTO-NT-2 | `sharepoint.schema.write` | DENY | `POLICY_MISMATCH` | POLICY_BLOCKED |
| AUTO-NT-3 | `decision.accept` | DENY | `HUMAN_ONLY` | POLICY_BLOCKED |
| AUTO-NT-4 | `code.edit`（allowedPaths 外） | DENY | `OUT_OF_SCOPE` | POLICY_BLOCKED |
| AUTO-NT-5 | `commit.create`（stale baseline） | DENY | `BASELINE_MOVED` | BASELINE_MOVED |

```text
5 件すべて DENY で PASS
＋ positive control 1 件（valid packet 内の code.edit → ALLOW）を
  実装時の test harness に含める（AUTO-NT の代替ではない）
5 件が通るまで LOW-AUTO-PILOT-V2 を開始しない
```

## Cursor execution backend（抽象化）

```text
本 policy / Registry / Gateway は特定 SDK 言語に依存しない
Builder 実行系は「Cursor execution backend」として抽象化する
一次情報で確認済み: TypeScript SDK（@cursor/sdk）
Python SDK: 一次情報で未確認（本文書は前提にしない）
最初の backend = TypeScript SDK を AUTO-8 で採択候補とする
（backend 採択は AUTO-8 の Human Decision；本文書は LOCK しない）
```

## Conflict register（上書きしない）

| ID | Current authority | AUTONOMY-POLICY-V1 | Handling |
| --- | --- | --- | --- |
| AUTO-C1 | DEC-AI-ORG-003: PR 作成・更新投稿 = 人の事前承認；PROCESS-OPT-V1 現行: Draft PR create/update = HUMAN-ONLY（別 GO） | `pull_request.create_draft` / `update_draft` を AUTO_ALLOWED に分類 | **RECORDED ONLY** — 分類 ≠ 有効化。有効化は別 Human Explicit GO ＋ 上位正本の整合更新 |
| AUTO-C2 | Routine AUG / PROCESS-OPT-V1 現行: GitHub publication（branch / commit / push） = 別 GO | `branch.push` 等を AUTO_ALLOWED に分類 | **RECORDED ONLY** — 同上 |
| AUTO-C3 | DEC-AI-ORG-003: PR レビュー投稿 = 人の事前承認 | `review.request` を AUTO_ALLOWED に分類（依頼のみ・レビュー本文投稿ではない） | **RECORDED ONLY** — 依頼と投稿の区分は AUTO-2 Registry で precise 化 |
| AUTO-C4 | Routine AUG: UNKNOWN → HOLD | Gateway: UNKNOWN → DENY | **NO CONFLICT** — workflow は HOLD 維持。Gateway は保留状態を持たないため DENY |
| AUTO-C5 | Merge / Ready = HUMAN-ONLY | `pull_request.merge` / `ready` = HUMAN_ONLY ＋ 非保持 | **NO CONFLICT** — 維持・強化 |

## OUT OF SCOPE（本 unit）

```text
Capability Registry 実体（AUTO-2）
Task Packet Schema 実体（AUTO-3）
Action Gateway contract 詳細 / 実装（AUTO-4 以降）
Cursor execution backend 実装 / SDK 採択（AUTO-8）
negative test 実装
Gateway / Registry の enablement
LOW-AUTO-PILOT-V2
application / domain code / tests
AssessmentSnapshot adapter / EC-3 / EC-4（別レーン；影響なし）
SharePoint / M365 / Entra / Deploy / real data
既存 DEC / Routine AUG / PROCESS-OPT-V1 の本文変更
Ready / Merge
```

## 効力 / 非効力

### 効力（AUTO-1-A Acceptance 後）

- Capability taxonomy / 分類 / 初期 set v1 の契約固定
- Gateway 判定 pipeline・reasonCode 閉集合・fail-closed 規則の固定
- baseline binding / allowedPaths / limits / approval / audit 要件の固定
- AUTO-NT-1〜5 を LOW-AUTO-PILOT-V2 の前提として固定

### 非効力

```text
AUTONOMY-POLICY-V1 ACCEPTED ≠ Registry / Gateway / backend の実装開始
AUTONOMY-POLICY-V1 ACCEPTED ≠ AUTO_ALLOWED capability の実行有効化
AUTONOMY-POLICY-V1 ACCEPTED ≠ 上位正本（DEC-AI-ORG-003 等）の緩和・書換
AUTONOMY-POLICY-V1 ACCEPTED ≠ EC-3 / EC-4 の skip・代替
AUTONOMY-POLICY-V1 ACCEPTED ≠ LOW-AUTO-PILOT-V2 開始
AUTONOMY-POLICY-V1 ACCEPTED ≠ 本 recording PR の Ready / Merge
```

## 次工程（Human only）

1. **AUTO-1-A** — 本 contract の Human Acceptance（limits 数値・分類の確定を含む）
2. 本 recording PR の Ready / Merge（別 Human Gate）
3. Acceptance 後: `docs/process/ai-governance.md` への登録（別 commit / 同 PR 可）
4. **AUTO-2** Capability Registry → **AUTO-3** Task Packet Schema → **AUTO-4** Action Gateway contract（各 unit selection は Human）
5. AUTO-NT-1〜5 PASS 確認 → その後にのみ LOW-AUTO-PILOT-V2 を Human 判断で検討
