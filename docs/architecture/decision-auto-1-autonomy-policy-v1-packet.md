# AUTO-1 — AUTONOMY-POLICY-V1 / Human Decision packet

この文書は、**AUTO-1 — AUTONOMY-POLICY-V1**（機械判定可能な自律境界契約）についての
**比較用 Human Decision Packet** である。

Candidate policy 正本:
[`../process/autonomy-policy-v1.md`](../process/autonomy-policy-v1.md)

Selected via:
[`decision-auto-1-autonomy-policy-v1-selection.md`](./decision-auto-1-autonomy-policy-v1-selection.md)

IR:
[`decision-auto-1-autonomy-policy-v1-independent-review.md`](./decision-auto-1-autonomy-policy-v1-independent-review.md)

Lane separation:
[`../process/dev-lane-separation-v1.md`](../process/dev-lane-separation-v1.md)

Depends on（再 Decision しない）:
[`../decisions/DEC-AI-ORG-003.md`](../decisions/DEC-AI-ORG-003.md)
[`../decisions/DEC-AA-001.md`](../decisions/DEC-AA-001.md)
[`../decisions/DEC-AA-003.md`](../decisions/DEC-AA-003.md)
[`../process/routine-aug-v1.md`](../process/routine-aug-v1.md)
[`../process/process-optimization-v1.md`](../process/process-optimization-v1.md)
[`../process/low-auto-pilot-v1.md`](../process/low-auto-pilot-v1.md)
[`../../.agents/mcp/permission-matrix.md`](../../.agents/mcp/permission-matrix.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Unit: AUTO-1 — AUTONOMY-POLICY-V1
Kind: Human Decision packet（compare → Human Acceptance 待ち）
Status: OPEN / NOT CONSUMED
Baseline main: 5ddb05950a2123a1fb609698b9673102a6190721
Human Selection of unit: AUTO-1（FIXED / 2026-08-10）
Human Acceptance of policy: NOT YET

Decision axes:
  AP1-CAP-1  capability taxonomy / record fields
  AP1-CLS-1  class model / precedence / unregistered handling
  AP1-SPL-1  deny 一覧の HUMAN_ONLY / FORBIDDEN 分割
  AP1-BND-1  structural absence（binding 規則）
  AP1-APR-1  approval model
  AP1-RSK-1  risk binding
  AP1-BSL-1  baseline SHA binding
  AP1-PTH-1  allowed_paths enforcement
  AP1-LIM-1  limits（field / G9 / 数値）
  AP1-RSN-1  reason vocabulary shape（POLICY_BLOCKED）
  AP1-RSN-2  FORBIDDEN class の reason 表現
  AP1-AUD-1  audit requirement
  AP1-NEG-1  negative test gate
  AP1-LANE-1 lane separation encoding
  AP1-BKND-1 execution backend abstraction
  AP1-XB-1   boundary

Current boundary（本 packet では変更しない）:
  Capability Registry = NOT IMPLEMENTED
  Action Gateway = NOT IMPLEMENTED
  AUTONOMY_GATEWAY = DISABLED
  Execution backend = NOT BOUND
  Implementation Start = HOLD
  Ready / Merge = HUMAN-ONLY
  SharePoint / M365 / Entra = UNCHANGED / FORBIDDEN
  Deploy / real data = FORBIDDEN
  LANE-APP gate = 未充足のまま（飛ばさない）
```

Live gate（Ready / Merge / review 進行）は repository docs に書かない
（[`../process/self-referential-gate-policy.md`](../process/self-referential-gate-policy.md)）。

## 1. Question

```text
「Merge 禁止」を prompt ではなく機械判定で強制するために、
capability / class / risk / baseline / path / limits / fail-closed /
UNKNOWN / approval / audit をどう固定するか。

本 Decision ≠ Capability Registry 実装
本 Decision ≠ Action Gateway 実装
本 Decision ≠ AUTONOMY_GATEWAY_ENABLED
本 Decision ≠ Implementation Start
本 Decision ≠ LANE-APP gate 充足
```

## 2. Re-Decision しない前提（LOCKED）

| 項目 | 固定値 | 正本 |
|---|---|---|
| 権限 3 区分と Fail Closed | AI単独 / 人の事前承認 / 禁止；未記載 = 禁止 | DEC-AI-ORG-003 |
| 区分重複時の優先 | 禁止 > 人の事前承認 > AI単独 | DEC-AI-ORG-003 |
| 承認の拘束対象 | 操作 / 対象 / 範囲 / 版（head SHA） / 承認者 / 日時 | DEC-AI-ORG-003 |
| 版変化時の失効 | approval / Review PASS 失効 → HOLD | DEC-AI-ORG-003 |
| scope envelope field 名 | `unit_id` / `base_sha` / `allowed_paths` / `forbidden_paths` / `max_repair_cycles` / `external_write_permissions` / `stop_gate` 等 | DEC-AA-003 |
| `max_repair_cycles` | 3（増加 FORBIDDEN） | DEC-AA-003 |
| GitHub publication 境界 | branch / commit / push / Draft PR は HUMAN-ONLY（別 GO） | DEC-AA-003 / routine-aug-v1 |
| risk 3 段階の定義 | LOW / MEDIUM / HIGH | process-optimization-v1 |
| batch capacity | 2〜4 slice / 1 batch | low-auto-pilot-v1 |
| `UNKNOWN → HOLD`（process 層） | 維持 | 全上位正本 |
| Merge | HUMAN-ONLY | DEC-AI-ORG-003 / 全上位正本 |

```text
FORBIDDEN in this packet:
  上位正本の緩和
  permission expansion
  数値 limit の Agent 補完
  vendor 製品仕様の正本化
  capability id の alias / 部分一致許容
  reason code の暗黙追加
  LANE-APP Decision の代替
  code / test の実装
```

## 3. Compare axes

### AP1-CAP-1 — Capability taxonomy / record fields

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-CAP-1-A** | id grammar（`[a-z][a-z0-9_]*` の 2〜4 segment / 完全一致のみ）＋`id` に加えて必須 field 9 個（`class` / `risk` / `effect_scope` / `side_effect` / `reversible` / `approval_kind` / `binding` / `audit_required` / `policy_version`；計 10 field）。field 名は DEC-AA-003 の snake_case を継承 | OPEN（recommendation） |
| AP1-CAP-1-B | id のみ登録し、field を持たない（分類は別表で管理） | OPEN |
| AP1-CAP-1-HOLD | taxonomy 未確定 | OPEN |
| AP1-CAP-1-X | Human 明示の別 taxonomy | OPEN |

```text
Why A:
  判定に必要な入力（class / risk / reversible / approval_kind / binding）が
  1 レコードに揃わないと、Gateway は機械判定できない
Why not B:
  分類が別表に分散すると「未記載 → 禁止」の判定点が増え、fail-closed が崩れる
Note:
  Human 本文の allowedPaths は Accepted 正本の allowed_paths と同一 field として扱う
```

### AP1-CLS-1 — Class model / precedence / unregistered handling

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-CLS-1-A** | 3 区分（`AUTO_ALLOWED` / `HUMAN_ONLY` / `FORBIDDEN`）＋優先 `FORBIDDEN > HUMAN_ONLY > AUTO_ALLOWED` ＋未登録 → `DENY`。Human 指定の `capability exists?` を `G1` 登録判定と `G2` class 判定に分割 | OPEN（recommendation） |
| AP1-CLS-1-B | 2 区分（`AUTO_ALLOWED` / `DENY`）に統合 | OPEN |
| AP1-CLS-1-HOLD | class model 未確定 | OPEN |

```text
Why A:
  DEC-AI-ORG-003 の 3 区分をそのまま継承でき、既存正本との対応が保てる
Why not B:
  「人が実施できる」と「この基盤では実施しない」を同一扱いにすると、
  存在しない承認経路を示唆する
```

### AP1-SPL-1 — deny 一覧の HUMAN_ONLY / FORBIDDEN 分割

Classification: **DECISION_REQUIRED**

Human 本文は 9 件を `HUMAN_ONLY / DENY` として一括提示した。

| ID | 分割 | 結果 |
|---|---|---|
| **AP1-SPL-1-A** | `HUMAN_ONLY` = `pull_request.ready` / `pull_request.merge` / `decision.accept` / `decision.lock`。`FORBIDDEN` = `sharepoint.schema.write` / `sharepoint.permission.write` / `github.permission.write` / `secret.write` / `deploy.production` | OPEN（recommendation） |
| AP1-SPL-1-B | 9 件すべて `HUMAN_ONLY` | OPEN |
| AP1-SPL-1-C | 9 件すべて `FORBIDDEN` | OPEN |
| AP1-SPL-1-HOLD | 分割未確定 | OPEN |

```text
Why A:
  DEC-AI-ORG-003 は SharePoint / Entra / M365 / 本番 deploy / 本番データを
  「禁止（別の承認プロセスが必要）」としており、人の事前承認区分ではない
Why not B:
  SharePoint schema を「人が承認すれば基盤内で実施可」に見せてしまう
Why not C:
  Merge / Ready / Decision Acceptance は Human が実際に行う操作であり、
  FORBIDDEN と表現すると運用と矛盾する
OPEN（AP1-P2-3）:
  github.permission.write は Routine AUG の
  「security-boundary change = HUMAN-ONLY」とも整合し得る。
  A は厳格側（FORBIDDEN）を候補にしている
```

### AP1-BND-1 — Structural absence（binding 規則）

Classification: **DECISION_REQUIRED**（Human H6 の中核）

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-BND-1-A** | `binding(AUTO_ALLOWED) = HANDLER`、`binding(HUMAN_ONLY) = NONE`、`binding(FORBIDDEN) = NONE`。非 AUTO_ALLOWED には handler / client method / credential / retry path / override flag を持たせない | OPEN（recommendation） |
| AP1-BND-1-B | 単一 handler を持ち、実行時に class を検査して拒否する | OPEN |
| AP1-BND-1-HOLD | binding 規則未確定 | OPEN |

```text
Why A:
  Human Decision は「Gateway 自体が pull_request.merge capability を持たない」
  設計を要求している。存在しない経路は誤設定・prompt injection・bug で開かない
Why not B:
  実行経路が存在する限り、条件分岐の欠陥や flag で通過し得る
```

### AP1-APR-1 — Approval model

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-APR-1-A** | `approval_kind` = `NONE` / `IMPLEMENTATION_START` / `PUBLICATION` / `REVIEW_POST` / `NOT_APPLICABLE`。複数上位正本が競合する場合は厳格側を採る。record は DEC-AI-ORG-003 の必須項目＋`single_use` | OPEN（recommendation） |
| AP1-APR-1-B | approval を単一種類にし、対象 capability 列挙のみで拘束 | OPEN |
| AP1-APR-1-HOLD | approval model 未確定 | OPEN |

```text
Why A:
  Implementation Start と GitHub publication は上位正本で別 GO として分離されている。
  1 種類に統合すると、Start 承認が publication 承認に流用され得る
Why not B:
  DEC-AA-003 の「GitHub 公開前 STOP」を機械的に表現できない
```

### AP1-RSK-1 — Risk binding

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-RSK-1-A** | PROCESS-OPT-V1 の LOW / MEDIUM / HIGH を継承。`slice_risk` と `capability_risk` を分離し、`slice_risk = LOW` を AUTO envelope、`capability_risk ∈ {LOW, MEDIUM}` のみ `AUTO_ALLOWED`、`MEDIUM` は approval 必須、`HIGH` は `AUTO_ALLOWED` に登録しない。registry invariant `INV-1`〜`INV-6` を機械検査。未分類 → `DENY / UNKNOWN` | OPEN（recommendation） |
| AP1-RSK-1-B | AUTO-1 独自の risk 尺度を新設 | OPEN |
| AP1-RSK-1-HOLD | risk binding 未確定 | OPEN |

```text
Why A:
  risk 定義は既に Accepted / LOCKED。再定義は二重正本を作る
  slice / capability を分離しないと、GitHub publication capability が
  「常に DENY」または「LOW と偽装」のどちらかになる
Why not B:
  LOW auto-loop / LOW-AUTO-PILOT の既存 envelope と対応が取れなくなる
```

### AP1-BSL-1 — Baseline SHA binding

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-BSL-1-A** | WRITE capability 実行直前に `base_sha` 完全一致を確認。不一致 / material 移動 / reviewed HEAD 変化 → `DENY / BASELINE_MOVED`。silent rebase FORBIDDEN。Agent による `base_sha` 更新 FORBIDDEN | OPEN（recommendation） |
| AP1-BSL-1-B | merge-base 一致で許容（fast-forward 差分は許す） | OPEN |
| AP1-BSL-1-HOLD | baseline binding 未確定 | OPEN |

```text
Why A:
  DEC-AA-003 の fail-closed（base_sha mismatch → HOLD）と DEC-AI-ORG-003 の
  版拘束（head SHA 変化 → 承認失効）を機械判定へそのまま写せる
Why not B:
  「material に移動していない」の判定が Agent 裁量になり、UNKNOWN が ALLOW へ漏れる
```

### AP1-PTH-1 — `allowed_paths` enforcement

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-PTH-1-A** | explicit・非空・repository 相対。`forbidden_paths` 優先。正規化後の完全一致または `/` 境界の prefix 一致のみ。`..` / 絶対パス / symlink 越え / 正規化不能 → `DENY / UNKNOWN`。範囲外 → `DENY / OUT_OF_SCOPE`。Agent 拡張 FORBIDDEN | OPEN（recommendation） |
| AP1-PTH-1-B | glob / 正規表現による path 指定を許可 | OPEN |
| AP1-PTH-1-HOLD | enforcement 未確定 | OPEN |

```text
Why A:
  境界判定が文字列正規化だけで決まり、test 可能
Why not B:
  glob の解釈差で「範囲内かどうか」が実装依存になる
Note:
  既定 forbidden_paths 集合は本 packet では固定しない（packet 内発明を避ける）。
  packet 単位で explicit に与える
```

### AP1-LIM-1 — Limits（field / G9 / 数値）

Classification: **DECISION_REQUIRED**（数値は **HUMAN-REQUIRED**）

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-LIM-1-A** | 必須 limit field 6 個を固定し、limits を判定 gate `G9` として ALLOW 直前に評価。継承値 `max_repair_cycles = 3` / `max_slices_per_batch = 2..4`。残り 4 個の数値は Human が与える | OPEN（recommendation） |
| AP1-LIM-1-B | limit field を記録するが gate 化しない（監視のみ） | OPEN |
| AP1-LIM-1-HOLD | limits 未確定 | OPEN |

```text
Why A:
  scope 項目 6 の limits を「判定できる」形にするには gate が必要
Why not B:
  上限超過を止められないため、暴走時に機械停止できない
Human 入力が必要な値（Agent 補完 FORBIDDEN）:
  max_capability_invocations
  max_files_changed
  max_consecutive_denies
  max_wall_clock
Note:
  G9 は Human 本文の 7 判定に対する追加 gate であり、Acceptance が必要
```

### AP1-RSN-1 — Reason vocabulary shape（`POLICY_BLOCKED`）

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-RSN-1-A** | `reason_code` は Human 指定の 5 値閉集合。`POLICY_BLOCKED` は test 水準の family label（`DENY` かつ `reason_code ∈ {HUMAN_ONLY, POLICY_MISMATCH, OUT_OF_SCOPE}`） | OPEN（recommendation） |
| AP1-RSN-1-B | `POLICY_BLOCKED` を 6 番目の reason code として追加 | OPEN |
| AP1-RSN-1-HOLD | vocabulary 未確定 | OPEN |

```text
Why A:
  negative test の期待値（merge → POLICY_BLOCKED）と、
  Human 指定 reason 5 値の両方を矛盾なく満たせる
Why not B:
  HUMAN_ONLY / OUT_OF_SCOPE の粒度が失われ、監査で理由が縮退する
```

### AP1-RSN-2 — `FORBIDDEN` class の reason 表現

Classification: **DECISION_REQUIRED**（AP1-P2-1）

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-RSN-2-A** | enum は 5 値のまま。`FORBIDDEN` class 拒否は `reason_code = POLICY_MISMATCH` ＋ audit の `denied_class = FORBIDDEN` で表現 | OPEN（recommendation） |
| AP1-RSN-2-B | enum に `FORBIDDEN` を追加（6 値へ拡張） | OPEN |
| AP1-RSN-2-C | `FORBIDDEN` 拒否を `HUMAN_ONLY` として返す | OPEN |
| AP1-RSN-2-HOLD | 表現未確定 | OPEN |

```text
Why A:
  Human 指定 enum を Agent が黙って拡張しない。granularity は audit 側で保持
Why B は Human Acceptance 必須:
  enum 拡張は Human 指定集合の変更であり、Agent 判断で行わない
Why not C:
  存在しない人的承認経路を示唆する
```

### AP1-AUD-1 — Audit requirement

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-AUD-1-A** | `ALLOW` / `DENY` の両方を記録。必須 field 15 個（policy 10.2）。append-only。secret 記録禁止。audit 書き込み失敗 → `DENY`。app domain の AuditLog とは別 store | OPEN（recommendation） |
| AP1-AUD-1-B | `DENY` のみ記録 | OPEN |
| AP1-AUD-1-HOLD | audit 要件未確定 | OPEN |

```text
Why A:
  「Agent が間違えてもシステムが止める」ことを事後に検証するには、
  通過した判定の証跡も必要
Why not B:
  ALLOW の根拠（approval / base_sha / paths）が残らず、再現できない
Note:
  法人アプリ domain の AuditLog（retention 契約）と混同しない
```

### AP1-NEG-1 — Negative test gate

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-NEG-1-A** | NT-1〜NT-5 ＋構造 assertion（handler 不在 / 再取得不可 / audit 生成）を `LOW-AUTO-PILOT-V2` の前提 gate として要求 | OPEN（recommendation） |
| AP1-NEG-1-B | negative test は推奨扱い（gate にしない） | OPEN |
| AP1-NEG-1-HOLD | gate 位置未確定 | OPEN |

```text
Why A:
  Human Decision が「5 件が全部通れば安全モデルが変わる」と位置づけている
Why not B:
  強制されない test は「会話上のルール」に戻る
```

### AP1-LANE-1 — Lane separation encoding

Classification: **DECISION_REQUIRED**（rule 自体は Human directive として ACCEPTED）

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-LANE-1-A** | `dev-lane-separation-v1.md` の L-1〜L-6 ＋ `EC-3` / `EC-4` を `UNRESOLVED_REFERENCE`（推測束縛 FORBIDDEN）として固定 | OPEN（recommendation） |
| AP1-LANE-1-B | lane 規則を AUTO-1 policy 内の 1 節にのみ書く | OPEN |
| AP1-LANE-1-HOLD | encoding 未確定 | OPEN |

```text
Why A:
  lane 規則は AUTO-1 だけでなく後続 AUTO unit 全体に効く
Why not B:
  AUTO-1 が CONSUMED になった後、参照先が不明瞭になる
OPEN（LANE-P2-1）:
  EC-3 / EC-4 は repository 内に該当 ID がない。Human 明示まで UNKNOWN 保持
```

### AP1-BKND-1 — Execution backend abstraction

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-BKND-1-A** | `Cursor execution backend` として抽象化。builder / reviewer backend を分離し reviewer は READ 系 capability のみ。`PRE_ACTION` / `POST_ACTION` interception を抽象要件として要求。具体 binding は AUTO-8 | OPEN（recommendation） |
| AP1-BKND-1-B | AUTO-1 時点で TypeScript SDK を契約に固定 | OPEN |
| AP1-BKND-1-HOLD | abstraction 未確定 | OPEN |

```text
Why A:
  Human correction（Python SDK は一次情報で未確認）に従い、言語 / SDK 依存を避ける
Why not B:
  vendor API 仕様を repository の契約正本に取り込むことになる
```

### AP1-XB-1 — Boundary

Classification: **DECISION_REQUIRED**

| ID | 内容 | 結果 |
|---|---|---|
| **AP1-XB-1** | 本 Decision ≠ Registry / Gateway 実装 ≠ `AUTONOMY_GATEWAY_ENABLED` ≠ Implementation Start ≠ permission expansion ≠ Ready / Merge ≠ SharePoint / M365 / Deploy ≠ LANE-APP gate 充足 | OPEN（recommendation） |
| AP1-XB-2 | Acceptance と同時に Capability Registry 実装も認可 | OPEN |

```text
Why AP1-XB-1:
  docs-only unit で実装権限を作らない（DEC-AA / Routine AUG の per-slice Start 原則）
Why not AP1-XB-2:
  Human Decision は「AUTO-1 ではコードを書かない」と明示している
```

## 4. Agent recommendation（NOT Human Acceptance）

```text
AP1-CAP-1-A + AP1-CLS-1-A + AP1-SPL-1-A + AP1-BND-1-A + AP1-APR-1-A +
AP1-RSK-1-A + AP1-BSL-1-A + AP1-PTH-1-A + AP1-LIM-1-A + AP1-RSN-1-A +
AP1-RSN-2-A + AP1-AUD-1-A + AP1-NEG-1-A + AP1-LANE-1-A + AP1-BKND-1-A +
AP1-XB-1
```

```text
Agent recommendation ≠ Human Acceptance
本 packet は Human が option を選ぶまで CONSUMED にならない
AP1-LIM-1 の 4 数値は Human 入力が必要（Agent 補完 FORBIDDEN）
```

## 5. Done criteria（Acceptance 時）

- 16 axes すべてに Human 選択が付いている
- `AP1-LIM-1` の未確定数値が Human から与えられている、または明示的に HOLD
- 上位正本の緩和がない（conflict register が RECORDED ONLY のまま）
- reason code 集合が閉じている
- `HUMAN_ONLY` / `FORBIDDEN` に実行経路が生成されない
- LANE-APP の gate 状態が変化していない
- P2 の偽クローズがない
- docs-only（src / tests 変更なし）

## 6. Next

```text
AUTO-1 packet: OPEN / NOT CONSUMED
AUTO-1 policy: CANDIDATE / NOT ACCEPTED
Next: Human Acceptance（AP1-* の選択）
Capability Registry / Task Packet Schema / Action Gateway: 未開始
AUTONOMY_GATEWAY_ENABLED: 別 Human Explicit GO
Implementation Start: HOLD
Ready / Merge: HUMAN-ONLY
LANE-APP: 独立継続（飛ばさない）
```
