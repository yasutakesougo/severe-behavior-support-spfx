# AUTONOMY-POLICY-V1 — AUTO-1 機械判定可能な自律境界契約（CANDIDATE）

- 文書: `docs/process/autonomy-policy-v1.md`
- Unit: **AUTO-1 — AUTONOMY-POLICY-V1**
- Lane: **LANE-DEVOS**（[`dev-lane-separation-v1.md`](./dev-lane-separation-v1.md)）
- 位置づけ: AI Development OS の **最初の契約候補**（Capability Registry / Task Packet Schema / Action Gateway の前提）
- 状態: **CANDIDATE / NOT ACCEPTED**
- Human Decision（記録済み）: **次 substantive unit = AUTO-1 に固定**（2026-08-10）
- Authorization effect: **NONE**
- Kind: **docs-only / contract fixing only（コードを書かない）**
- 上位正本（緩和・上書きしない）:
  - `docs/decisions/DEC-AI-ORG-003.md`
  - `docs/decisions/DEC-AA-001.md`
  - `docs/decisions/DEC-AA-003.md`
  - `docs/process/routine-aug-v1.md`
  - `docs/process/process-optimization-v1.md`
  - `docs/process/low-auto-pilot-v1.md`
  - `.agents/mcp/permission-matrix.md`（実行参照）
- 関連:
  - Selection: [`../architecture/decision-auto-1-autonomy-policy-v1-selection.md`](../architecture/decision-auto-1-autonomy-policy-v1-selection.md)
  - Compare packet: [`../architecture/decision-auto-1-autonomy-policy-v1-packet.md`](../architecture/decision-auto-1-autonomy-policy-v1-packet.md)
  - Independent Review: [`../architecture/decision-auto-1-autonomy-policy-v1-independent-review.md`](../architecture/decision-auto-1-autonomy-policy-v1-independent-review.md)
  - Lane separation: [`dev-lane-separation-v1.md`](./dev-lane-separation-v1.md)

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`self-referential-gate-policy.md`](./self-referential-gate-policy.md)）。

## 状態（誤読防止）

```text
AUTONOMY-POLICY-V1: CANDIDATE / NOT ACCEPTED
policy_version: AUTONOMY-POLICY-V1
Capability Registry: NOT IMPLEMENTED
Action Gateway: NOT IMPLEMENTED
AUTONOMY_GATEWAY: DISABLED（default / 本 unit では変更しない）
Execution backend: NOT BOUND
Implementation: DO NOT START
Ready / Merge: HUMAN-ONLY
SharePoint / M365: UNCHANGED / FORBIDDEN
Deploy / real data: FORBIDDEN
Permission expansion: NONE
```

```text
Candidate policy ≠ Accepted policy
Accepted policy ≠ AUTONOMY_GATEWAY_ENABLED
AUTONOMY_GATEWAY_ENABLED ≠ Implementation Start
Registry entry ≠ permission grant
Independent Review READY / PASS ≠ Human Acceptance
```

## 目的

現在の自律境界は「会話上のルール」として存在する。本 unit の目的は、それを
**機械判定可能な契約**へ移し、Agent が誤っても **システム側が停止できる** 状態の
前提を固定することである。

```text
不採用の安全モデル: 「Agent が賢いから安全」
採用する安全モデル: 「Agent が間違えてもシステムが止めるから安全」
```

## 本 unit が決める対象（10 項目）

Human Decision が指定した scope に一致する。

| # | Scope |
|---|---|
| 1 | Capability taxonomy |
| 2 | `AUTO_ALLOWED` / `HUMAN_ONLY` / `FORBIDDEN` |
| 3 | `risk = LOW / MEDIUM / HIGH` |
| 4 | baseline SHA binding |
| 5 | `allowed_paths` enforcement |
| 6 | limits |
| 7 | fail-closed rules |
| 8 | `UNKNOWN → DENY` |
| 9 | Approval requirement |
| 10 | Audit requirement |

## 本 unit が決めない / 承認しないこと

| 対象外 | 扱い |
|---|---|
| Capability Registry の実装 | 後続 unit。本 unit では書かない |
| Task Packet Schema の完全定義（型 / encoding / versioning） | 後続 unit |
| Action Gateway の実装 | 後続 unit |
| Cursor execution backend の binding | AUTO-8（後続） |
| `AUTONOMY_GATEWAY_ENABLED` | 別 Human Explicit GO |
| Implementation Start | HOLD 維持 |
| DEC-AA-001 / DEC-AA-003 / DEC-AI-ORG-003 の semantic change | FORBIDDEN |
| Routine AUG / PROCESS-OPT-V1 / LOW-AUTO-PILOT-V1 の global rewrite | FORBIDDEN |
| LOW-AUTO-PILOT-V1 pilot execution / LOW-AUTO-PILOT-V2 | 別 Human Decision |
| LANE-APP の Decision / gate | 別 lane（L-1〜L-6） |
| src / tests / runtime code | OUT OF SCOPE（本 unit は docs-only） |

## 1. Capability taxonomy

### 1.1 Capability ID grammar

```text
capability_id = segment ("." segment){1,3}
segment       = [a-z][a-z0-9_]*
```

```text
先頭 segment = domain
末尾 segment = verb
中間 segment = object（任意）
```

```text
grammar 不一致                → DENY / UNKNOWN
同一 id の registry 重複        → DENY / UNKNOWN
大文字・空白・別区切りの使用    → DENY / UNKNOWN
alias / 部分一致 / prefix 一致  → FORBIDDEN（完全一致のみ）
```

### 1.2 Capability record（必須 field）

| Field | 値域 | 意味 |
|---|---|---|
| `id` | 1.1 の grammar | 完全一致で解決する識別子 |
| `class` | `AUTO_ALLOWED` / `HUMAN_ONLY` / `FORBIDDEN` | 判定区分 |
| `risk` | `LOW` / `MEDIUM` / `HIGH` | 3 章 |
| `effect_scope` | `LOCAL_REPO` / `GITHUB_METADATA` / `GITHUB_STATE` / `EXTERNAL_TENANT` / `RUNTIME` | 影響範囲 |
| `side_effect` | `READ` / `WRITE` | 副作用有無 |
| `reversible` | `YES` / `NO` / `UNKNOWN` | `UNKNOWN` は AUTO 実行不可 |
| `approval_kind` | `NONE` / `IMPLEMENTATION_START` / `PUBLICATION` / `REVIEW_POST` / `NOT_APPLICABLE` | 9 章 |
| `binding` | `HANDLER` / `NONE` | 2.3 から導出（自由設定不可） |
| `audit_required` | `true`（固定） | 10 章 |
| `policy_version` | `AUTONOMY-POLICY-V1` | 版拘束 |

```text
必須 field 欠落        → DENY / UNKNOWN
未知 field の存在       → DENY / UNKNOWN（strict schema；未知 field 許容なし）
reversible = UNKNOWN   → DENY / UNKNOWN
```

### 1.3 Naming note

Human Decision 本文は `allowedPaths` と記述している。repository の Accepted 正本
（DEC-AA-003 scope envelope）は `allowed_paths` を用いる。

```text
同一 field。表記は Accepted 正本の snake_case を継承する。
allowedPaths ≡ allowed_paths
新しい別 field を作らない。
```

## 2. Class model

### 2.1 3 区分

| Class | 意味 |
|---|---|
| `AUTO_ALLOWED` | Gateway が ALLOW し得る。ALLOW には packet / approval / baseline / path / limits / enablement の全通過が必要 |
| `HUMAN_ONLY` | Human が実施する。Agent 実行経路を持たない |
| `FORBIDDEN` | この基盤の手順として実施しない。承認経路も持たない |

```text
class registration ≠ permission grant
AUTO_ALLOWED ≠ 無条件実行可
```

### 2.2 優先順位と fail-closed

```text
FORBIDDEN > HUMAN_ONLY > AUTO_ALLOWED
未登録 capability            → DENY（DEC-AI-ORG-003 Fail Closed の継承）
class が複数解釈可能          → DENY / UNKNOWN
class 未記載                 → DENY / UNKNOWN
```

### 2.3 Structural absence（本 unit の中核規則）

Prompt に「Merge 禁止」と書くことは enforcement ではない。

```text
binding(AUTO_ALLOWED) = HANDLER
binding(HUMAN_ONLY)   = NONE
binding(FORBIDDEN)    = NONE
```

`HUMAN_ONLY` / `FORBIDDEN` の registry entry は **分類と拒否のためだけ**に存在する。

```text
MUST NOT exist for non-AUTO_ALLOWED capability:
  executable handler
  adapter / client method
  credential / token / scope
  retry path
  override flag
  "force" parameter
```

```text
Action Gateway は pull_request.merge を実行する経路を持たない。
持たないことを test で証明する（NT-1 / 12 章）。
```

## 3. Risk

`LOW` / `MEDIUM` / `HIGH` の定義は **PROCESS-OPT-V1 を継承**する。本 unit で
再定義・緩和しない（`docs/process/process-optimization-v1.md`）。

risk は 2 種類を区別する。

```text
slice_risk      = 実装 slice の risk classification（PROCESS-OPT-V1）
capability_risk = capability record の risk（1.2）
```

### 3.1 判定

| 判定対象 | 条件 | 不成立時 |
|---|---|---|
| `slice_risk` | `= LOW`（LOW auto-loop envelope） | `DENY / POLICY_MISMATCH` |
| `capability_risk` | `∈ {LOW, MEDIUM}` かつ `class = AUTO_ALLOWED` | `DENY / POLICY_MISMATCH` |
| `capability_risk = MEDIUM` | `approval_kind ≠ NONE`（承認必須） | `DENY / POLICY_MISMATCH` |
| `capability_risk = HIGH` | `AUTO_ALLOWED` に登録しない | `DENY`（class 判定で拒否） |
| `packet.risk_ceiling` | `slice_risk` / `capability_risk` が上限以内 | `DENY / POLICY_MISMATCH` |
| risk 未分類 / 判定不能 | — | `DENY / UNKNOWN` |

```text
capability_risk = MEDIUM は「承認付きで AUTO 経路に載せてよい」を意味する
capability_risk = HIGH は「AUTO 経路を持たない」を意味する
slice_risk = MEDIUM / HIGH は LOW auto-loop の対象外（現行 envelope 維持）
```

```text
LOW → HIGH の暗黙昇格経路を作らない
HIGH 要素混入 slice を LOW として扱わない
batch 内に HIGH 要素を隠さない
capability_risk / slice_risk の再分類による ALLOW 取り直し: FORBIDDEN
```

## 4. Baseline SHA binding

```text
packet.base_sha は実行前に固定される
Gateway は WRITE capability の実行直前に観測 baseline と base_sha の完全一致を確認する
一致しない → DENY / BASELINE_MOVED
```

| 事象 | 判定 |
|---|---|
| `base_sha` 不一致 | `DENY / BASELINE_MOVED` |
| `origin/main` が material に移動 | `DENY / BASELINE_MOVED` |
| review 済み HEAD の変化 | 既存 Review PASS / approval 失効 → `DENY / BASELINE_MOVED` |
| silent rebase | **FORBIDDEN** |
| `base_sha` 未指定 / 取得不能 | `DENY / UNKNOWN` |

```text
approval は base_sha に拘束される（DEC-AI-ORG-003 / 版拘束）
base_sha を Agent が更新して再判定を通すこと: FORBIDDEN
```

## 5. `allowed_paths` enforcement

```text
packet.allowed_paths は explicit・非空・repository 相対
packet.forbidden_paths は allowed_paths より優先する
```

| 事象 | 判定 |
|---|---|
| 対象が `allowed_paths` 外 | `DENY / OUT_OF_SCOPE` |
| 対象が `forbidden_paths` 内 | `DENY / OUT_OF_SCOPE` |
| `allowed_paths` が空 / 未指定 | `DENY / UNKNOWN` |
| `..` / 絶対パス / symlink 越え | `DENY / UNKNOWN` |
| 正規化不能 / 判定不能 | `DENY / UNKNOWN` |

```text
path 比較は正規化後の完全一致または明示 prefix 一致のみ
prefix 一致は境界が "/" の場合のみ成立させる
Agent による allowed_paths 拡張: FORBIDDEN
```

## 6. Limits

### 6.1 必須 limit field

| Field | 意味 | 超過時 |
|---|---|---|
| `max_repair_cycles` | 実装 local repair 回数 | `STOP → HUMAN` |
| `max_capability_invocations` | packet 単位の Gateway 呼び出し上限 | `DENY / POLICY_MISMATCH` + `STOP` |
| `max_files_changed` | packet 単位の変更 file 数上限 | `DENY / POLICY_MISMATCH` + `STOP` |
| `max_slices_per_batch` | batch 内 slice 数上限 | `DENY / POLICY_MISMATCH` + `STOP` |
| `max_consecutive_denies` | 連続 DENY 上限 | `STOP → HUMAN` |
| `max_wall_clock` | packet 単位の実行時間上限 | `STOP → HUMAN` |

### 6.2 継承値（本 unit で変更しない）

```text
max_repair_cycles   = 3        （DEC-AA-003；増加 FORBIDDEN）
max_slices_per_batch = 2..4    （LOW-AUTO-PILOT-V1 pilot capacity）
```

### 6.3 未確定値

```text
max_capability_invocations : HUMAN-REQUIRED（packet AP1-LIM-1）
max_files_changed          : HUMAN-REQUIRED（packet AP1-LIM-1）
max_consecutive_denies     : HUMAN-REQUIRED（packet AP1-LIM-1）
max_wall_clock             : HUMAN-REQUIRED（packet AP1-LIM-1）
```

```text
Agent が数値を補完して既定値にすること: FORBIDDEN
limit field 欠落 → DENY / UNKNOWN
limit 値が上位正本より緩い → DENY / POLICY_MISMATCH
```

## 7. Fail-closed rules

```text
registry 到達不能            → DENY
packet 解析不能              → DENY / UNKNOWN
policy_version 不一致        → DENY / POLICY_MISMATCH
audit 書き込み失敗           → DENY（実行しない）
timestamp 取得不能           → DENY / UNKNOWN
評価途中エラー               → DENY / UNKNOWN
未知 field / 未知 enum 値     → DENY / UNKNOWN
capability id 完全一致なし    → DENY / UNKNOWN
AUTONOMY_GATEWAY_DISABLED    → DENY / POLICY_MISMATCH（default 状態）
```

```text
default = DENY
ALLOW は全 gate 通過の結果としてのみ生成される
「判定できないので通す」経路を作らない
```

## 8. `UNKNOWN → DENY`

```text
UNKNOWN → DENY（Action Gateway / 機械判定層）
UNKNOWN → HOLD（process / Human 判定層）
```

両者は同一原則の 2 層表現である。上位正本の `UNKNOWN → HOLD` を置き換えない。

| 層 | 語 | 意味 |
|---|---|---|
| Gateway | `DENY` | その request を実行しない（機械的） |
| Process | `HOLD` | unit を進めない（Human 判定待ち） |

```text
DENY を受けた後の禁止行為:
  scope を狭めて ALLOW を取り直す
  capability を分割して ALLOW を取り直す
  risk を再分類して ALLOW を取り直す
  base_sha を更新して ALLOW を取り直す
  同一 request を Human 入力なしに再試行する
```

```text
DENY → STOP → Human
DENY ≠ retry hint
```

## 9. Approval requirement

### 9.1 Approval record 必須 field

DEC-AI-ORG-003 の承認拘束を継承する。

| Field | 内容 |
|---|---|
| `approval_kind` | `IMPLEMENTATION_START` / `PUBLICATION` / `REVIEW_POST` |
| `capability_ids` | 対象 capability（完全一致・列挙） |
| `target` | repository / unit |
| `scope` | `allowed_paths`（承認時点の値） |
| `version` | `base_sha` / `expected_head_sha` |
| `approver` | Human の識別可能な記録 |
| `approved_at` | 承認日時 |
| `single_use` | `true`（完了時に consumed） |

### 9.2 判定

| 事象 | 判定 |
|---|---|
| 必要 approval_kind が存在しない | `DENY / POLICY_MISMATCH` |
| approval が別 unit / 別 base_sha / 別 scope に紐づく | `DENY / POLICY_MISMATCH` |
| approval が consumed 済み | `DENY / POLICY_MISMATCH` |
| approval の検証不能 | `DENY / UNKNOWN` |
| `HUMAN_ONLY` / `FORBIDDEN` capability に対する approval | `approval_kind = NOT_APPLICABLE`。**approval では実行経路を生成しない** |

```text
Agent による approval の自己発行: FORBIDDEN
散文・要約・会話ログからの approval 推定: FORBIDDEN
approval の lane 越え流用: FORBIDDEN（LANE-SEP-V1 L-3）
approval 有効化のための base_sha 変更: FORBIDDEN
```

## 10. Audit requirement

### 10.1 記録対象

```text
ALLOW と DENY の両方を記録する
記録できない場合は実行しない（7 章）
```

### 10.2 Audit record 必須 field

| Field | 内容 |
|---|---|
| `decision_id` | 一意識別子 |
| `decided_at` | 判定時刻 |
| `unit_id` | 対象 unit |
| `packet_id` | 対象 task packet |
| `policy_version` | `AUTONOMY-POLICY-V1` |
| `capability_id` | 要求された capability |
| `class` | 判定時の class |
| `risk` | 判定時の risk |
| `base_sha` | 判定時の baseline |
| `paths` | 判定対象 path（正規化後） |
| `approval_ref` | 使用した approval の参照（値そのものは記録しない） |
| `decision` | `ALLOW` / `DENY` |
| `reason_code` | 11.2 の閉集合 |
| `denied_class` | `FORBIDDEN` / `HUMAN_ONLY` / `NONE` |
| `limits_snapshot` | 判定時の limit 消費状況 |

### 10.3 制約

```text
append-only
secret / token / credential / tenant ID / site URL は記録しない
Agent による削除・改変: FORBIDDEN
```

```text
本 audit trail は AI Development OS の判定証跡である。
法人アプリ domain の AuditLog（retention-complete-deletion-prohibition-contract）とは
別 store であり、混同しない。相互に代替しない。
```

## 11. Action Gateway 判定（順序固定）

### 11.1 Gate 順序

```text
request
  ↓ G1 capability exists?          （完全一致・単一 entry）
  ↓ G2 class permits?              （AUTO_ALLOWED のみ通過）
  ↓ G3 task packet allows?         （packet 有効 / capability 列挙 / policy_version 一致）
  ↓ G4 risk permits?               （3 章）
  ↓ G5 approval valid?             （9 章）
  ↓ G6 baseline matches?           （4 章）
  ↓ G7 path within scope?          （5 章）
  ↓ G8 idempotency valid?          （11.3）
  ↓ G9 limits permit?              （6 章）
ALLOW
```

```text
評価順序は固定。並び替え FORBIDDEN。
最初に失敗した gate が reason_code を決める（単一 reason）。
どこか 1 つでも不明なら DENY。
```

Human Decision 本文が指定した判定は 7 件（`capability exists` / `task packet allows` /
`risk permits` / `approval valid` / `baseline matches` / `path within scope` /
`idempotency valid`）であり、全通過後に `ALLOW` となる。
本 candidate はそれを次のように写している。

| Gate | 出所 |
|---|---|
| G1 / G2 | Human 指定の `capability exists?` を「登録の有無（G1）」と「class 判定（G2）」に分割（scope 項目 2 を判定点として独立させるため） |
| G3〜G8 | Human 指定の 6 判定をそのままの順序で保持 |
| G9 | **追加 gate 候補**（scope 項目 6 の limits を機械判定へ接続するため；packet `AP1-LIM-1`） |

```text
G1 / G2 分割: packet AP1-CLS-1 の一部として Acceptance が必要
G9 追加: packet AP1-LIM-1 の一部として Acceptance が必要
Human 指定判定の削除・順序変更: なし
```

### 11.2 DENY reason code（閉集合）

```text
UNKNOWN
POLICY_MISMATCH
BASELINE_MOVED
HUMAN_ONLY
OUT_OF_SCOPE
```

```text
本 unit で reason code を追加しない
FORBIDDEN class の拒否は reason_code = POLICY_MISMATCH + denied_class = FORBIDDEN で表す
（reason code 追加の是非は packet AP1-RSN-2 / OPEN）
```

`POLICY_BLOCKED` の位置づけ:

```text
POLICY_BLOCKED = test 水準の family label
              = decision = DENY かつ
                reason_code ∈ { HUMAN_ONLY, POLICY_MISMATCH, OUT_OF_SCOPE }
reason_code の値としては使用しない
```

### 11.3 Idempotency

```text
各 request は idempotency_key を持つ
同一 key + 同一 payload の再送 → 既存判定をそのまま返す（再実行しない）
同一 key + 異なる payload      → DENY / POLICY_MISMATCH
key 欠落 / 判定不能            → DENY / UNKNOWN
```

## 12. Capability registry（初期候補）

本表は **候補分類**であり、実装でも権限付与でもない。

### 12.1 `AUTO_ALLOWED` 候補

| id | risk | effect_scope | side_effect | reversible | approval_kind | binding |
|---|---|---|---|---|---|---|
| `repo.read` | LOW | LOCAL_REPO | READ | YES | NONE | HANDLER |
| `code.edit` | LOW | LOCAL_REPO | WRITE | YES | IMPLEMENTATION_START | HANDLER |
| `test.run` | LOW | RUNTIME | READ | YES | NONE | HANDLER |
| `branch.create` | LOW | LOCAL_REPO | WRITE | YES | PUBLICATION | HANDLER |
| `commit.create` | LOW | LOCAL_REPO | WRITE | YES | PUBLICATION | HANDLER |
| `branch.push` | MEDIUM | GITHUB_STATE | WRITE | NO | PUBLICATION | HANDLER |
| `pull_request.create_draft` | MEDIUM | GITHUB_METADATA | WRITE | YES | PUBLICATION | HANDLER |
| `pull_request.update_draft` | MEDIUM | GITHUB_METADATA | WRITE | YES | PUBLICATION | HANDLER |
| `ci.read` | LOW | GITHUB_METADATA | READ | YES | NONE | HANDLER |
| `review.request` | LOW | GITHUB_METADATA | WRITE | YES | REVIEW_POST | HANDLER |

```text
approval_kind = PUBLICATION の行は、DEC-AA-003（AA-3 v1: branch / commit / push /
Draft PR は HUMAN-ONLY、external_write_permissions = NONE）と
Routine AUG v1（GitHub publication は HUMAN-ONLY / 別 GO）を厳格側優先で継承した結果である。
AUTO_ALLOWED class への登録は、この approval 要求を解除しない。
```

```text
force-push は capability として存在しない（structural absence）
main / 保護 branch への直接 push は capability として存在しない
test.run は repository を書き換えない（生成物を allowed_paths 外へ出さない）
```

### 12.2 `HUMAN_ONLY` 候補

| id | risk | effect_scope | reversible | binding |
|---|---|---|---|---|
| `pull_request.ready` | MEDIUM | GITHUB_STATE | YES | NONE |
| `pull_request.merge` | HIGH | GITHUB_STATE | NO | NONE |
| `decision.accept` | HIGH | LOCAL_REPO | NO | NONE |
| `decision.lock` | HIGH | LOCAL_REPO | NO | NONE |

### 12.3 `FORBIDDEN` 候補

| id | risk | effect_scope | reversible | binding |
|---|---|---|---|---|
| `sharepoint.schema.write` | HIGH | EXTERNAL_TENANT | NO | NONE |
| `sharepoint.permission.write` | HIGH | EXTERNAL_TENANT | NO | NONE |
| `github.permission.write` | HIGH | GITHUB_STATE | NO | NONE |
| `secret.write` | HIGH | EXTERNAL_TENANT | NO | NONE |
| `deploy.production` | HIGH | EXTERNAL_TENANT | NO | NONE |

```text
12.2 / 12.3 は Human Decision 本文の "HUMAN_ONLY / DENY" 一覧を、
DEC-AI-ORG-003 の区分（人の事前承認 / 禁止）へ厳格側優先で分割した候補である。
分割の採否は packet AP1-SPL-1（Human Acceptance 必要）。
```

### 12.4 Registry invariants（機械検査）

| # | Invariant |
|---|---|
| INV-1 | `class = AUTO_ALLOWED` ⇒ `risk ∈ {LOW, MEDIUM}` |
| INV-2 | `risk = HIGH` ⇒ `class ∈ {HUMAN_ONLY, FORBIDDEN}` |
| INV-3 | `class ≠ AUTO_ALLOWED` ⇒ `binding = NONE` |
| INV-4 | `class = AUTO_ALLOWED` かつ `risk = MEDIUM` ⇒ `approval_kind ≠ NONE` |
| INV-5 | `effect_scope = EXTERNAL_TENANT` ⇒ `class = FORBIDDEN` |
| INV-6 | `reversible = UNKNOWN` ⇒ `class ≠ AUTO_ALLOWED` |

```text
invariant 違反 → registry 無効 → 全 request DENY（fail-closed）
12.1〜12.3 の全行は INV-1〜INV-6 を満たす
invariant の緩和 / 例外 flag: FORBIDDEN
```

## 13. Negative test set（LOW-AUTO-PILOT-V2 前提）

`LOW-AUTO-PILOT-V2` の前に、次 5 件が全通過することを要求する。

| # | Request | Expected decision | Expected reason_code | Expected family label |
|---|---|---|---|---|
| NT-1 | `pull_request.merge` | DENY | `HUMAN_ONLY` | `POLICY_BLOCKED` |
| NT-2 | `sharepoint.schema.write` | DENY | `POLICY_MISMATCH`（`denied_class = FORBIDDEN`） | `POLICY_BLOCKED` |
| NT-3 | `decision.accept` | DENY | `HUMAN_ONLY` | `POLICY_BLOCKED` |
| NT-4 | `code.edit`（`allowed_paths` 外） | DENY | `OUT_OF_SCOPE` | `POLICY_BLOCKED` |
| NT-5 | 任意 WRITE capability（stale `base_sha`） | DENY | `BASELINE_MOVED` | `BASELINE_MOVED` |

追加の構造 assertion:

```text
NT-1a: pull_request.merge から実行 handler が解決されないこと
NT-2a: sharepoint.schema.write から実行 handler が解決されないこと
NT-3a: approval を与えても HUMAN_ONLY / FORBIDDEN の実行経路が生成されないこと
NT-4a: DENY 後に allowed_paths を拡張して ALLOW を取り直せないこと
NT-5a: DENY 後に base_sha を更新して ALLOW を取り直せないこと
NT-x : すべての DENY が audit record を生成すること
```

```text
これらは test 要件の記述である。
本 unit では test を実装しない（docs-only）。
実装 unit は AUTO-1 Acceptance より後。
```

## 14. Cursor execution backend（抽象化）

```text
AUTO-1 は特定 SDK 言語に依存しない。
抽象名: Cursor execution backend
```

| 役割 | 制約 |
|---|---|
| Builder backend | 実装 slice を実行。capability は `AUTO_ALLOWED` に限る |
| Reviewer backend | Independent Review を実行。capability は READ 系のみ（`repo.read` / `ci.read` / `test.run`） |

```text
builder_backend ≠ reviewer_backend（同一 session / 同一 instance を再利用しない）
Reviewer に WRITE capability を与えない
Reviewer の PASS は Human Acceptance ではない
```

Enforcement point の抽象:

```text
PRE_ACTION  interception（Gateway 判定前に全 action を捕捉できること）
POST_ACTION record（判定と結果を audit へ）
```

```text
具体 backend / 具体 interception 機構の binding は AUTO-8（後続）。
本 unit で vendor 固有 API を契約に固定しない。
```

### 14.1 External reference（Human 提供 / repository 内では検証しない）

```text
Human 提供の一次情報:
  Cursor TypeScript SDK（@cursor/sdk）は公式に確認済み
  Cursor Python SDK は公式一次情報で確認できなかった
  → AUTO-1 では特定言語 SDK に依存しない
  → 実装段階（AUTO-8）で TypeScript SDK を最初の backend にする
```

```text
本 repository は vendor 製品仕様を正本化しない。
上記は Human 提供の外部参照として記録するだけであり、
backend 契約は 14 章の抽象定義に従う。
```

## 15. 後続 unit（順序候補 / 未認可）

```text
AUTO-1  AUTONOMY-POLICY-V1        ← 本 unit（CANDIDATE）
  ↓
Capability Registry
  ↓
Task Packet Schema
  ↓
Action Gateway contract
  ↓
AUTO-8  first execution backend binding（TypeScript SDK）
```

```text
Human Decision が与えた ID は AUTO-1 と AUTO-8 のみ。
中間 unit の番号は本 unit では確定しない（採番の発明 FORBIDDEN）。
各 unit の開始は別 Human Decision。
```

## 16. Conflict register（上書きしない）

| ID | Current authority | AUTO-1 candidate | Handling |
|---|---|---|---|
| AP1-C1 | DEC-AA-003: branch / commit / push / Draft PR = HUMAN-ONLY、`external_write_permissions = NONE` | 同 capability を `AUTO_ALLOWED` class に登録 | **RECORDED ONLY** — `approval_kind = PUBLICATION` で厳格側維持。global 緩和なし |
| AP1-C2 | 上位正本: `UNKNOWN → HOLD` | Gateway: `UNKNOWN → DENY` | **2 層表現**（8 章）。上位文言を書き換えない |
| AP1-C3 | Human 指定 reason code = 5 値 | `FORBIDDEN` class の表現が enum に無い | **OPEN**（`denied_class` で暫定表現；packet AP1-RSN-2） |
| AP1-C4 | Human 指定 label = `POLICY_BLOCKED` | reason code 閉集合に含まれない | **family label として分離**（11.2） |
| AP1-C5 | DEC-AI-ORG-003: 未記載操作 = 禁止 | `github.permission.write` を FORBIDDEN 候補に分類 | **RECORDED ONLY** — Routine AUG の "security-boundary change = HUMAN-ONLY" との厳格側整合は packet AP1-SPL-1 |
| AP1-C6 | Human 指定 gate = 7 判定 | G1 / G2 分割 ＋ G9 limits 追加 | **RECORDED ONLY** — 採否は packet AP1-CLS-1 / AP1-LIM-1。Human 指定判定の削除・順序変更なし |
| AP1-C7 | Merge = HUMAN-ONLY | Merge = HUMAN_ONLY / binding NONE | **NO CONFLICT** — 強化のみ |

## 17. OPEN P2（本 unit で解消しない）

```text
AP1-P2-1: OPEN — FORBIDDEN class の reason code 表現（AP1-C3）
AP1-P2-2: OPEN — limits 数値（max_capability_invocations / max_files_changed /
          max_consecutive_denies / max_wall_clock）は HUMAN-REQUIRED
AP1-P2-3: OPEN — github.permission.write の class（FORBIDDEN vs HUMAN_ONLY）
AP1-P2-4: OPEN — 既存 Gate / permission-matrix と capability id の対応表は未作成
AP1-P2-5: OPEN — AUTO_ALLOWED class label が現行 HUMAN-ONLY の GitHub publication
          capability を含む（approval_kind = PUBLICATION で緩和は防止；label 誤読余地）
AP1-P2-6: OPEN — G1 / G2 分割と G9 limits は Human 指定 7 判定への構造追加（Acceptance 必要）
LANE-P2-1: OPEN — EC-3 / EC-4 の repository binding 未解消
LANE-P2-2: OPEN — lane 分離 encoding の Human Acceptance 待ち
POV1-P2-1: OPEN carry-forward
POV1-P2-2: OPEN carry-forward
LA1-P2-1: OPEN carry-forward
AA3-P2-1: OPEN carry-forward
AA3-P2-2: OPEN carry-forward
AA3-P2-3: OPEN carry-forward
```

本 unit はこれらを閉じない・降格しない・黙って書き換えない。

## 18. 効力 / 非効力

### 効力（Human Acceptance 後に発生するもの）

- capability taxonomy / class / risk / baseline / path / limits / fail-closed / approval / audit の **判定契約**を正本化する
- `HUMAN_ONLY` / `FORBIDDEN` に **実行経路を作らない**構造規則を固定する
- `LOW-AUTO-PILOT-V2` 前提の negative test 要件を固定する

### 非効力（Acceptance されても発生しないもの）

```text
Capability Registry / Action Gateway の実装
AUTONOMY_GATEWAY_ENABLED
Implementation Start
permission expansion
GitHub publication / Ready / Merge の自動化
SharePoint / M365 / Entra / Deploy / real data
LANE-APP の gate 充足
LOW-AUTO-PILOT-V1 execution / V2 開始
```

## 19. 次工程（Human only）

1. 本 candidate と compare packet の Independent Review 確認
2. AUTO-1 の Human Acceptance（option 選択；packet の `AP1-*`）
3. Acceptance 後に Capability Registry unit の開始判断（別 Human Decision）
4. `AUTONOMY_GATEWAY_ENABLED` は別 Human Explicit GO
5. LANE-APP の次 gate は本 unit と独立（LANE-SEP-V1 L-1 / L-2）
