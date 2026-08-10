# Decision-ISSUE-STATUS-RECONCILE-1 — Issue Status Reconciliation packet

この文書は、Thirty-sixth residual（SELECTED / C）の
**OPEN Issue triage / Close vs body resync** 比較・実行正本である。

Selected via:
[`decision-ilb-1-thirty-sixth-residual-issue-status-reconciliation-selection.md`](./decision-ilb-1-thirty-sixth-residual-issue-status-reconciliation-selection.md)

Prior assessment:
[`issue-status-reconciliation-assessment.md`](./issue-status-reconciliation-assessment.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: Decision-ISSUE-STATUS-RECONCILE-1
Kind: Process packet（Human-executed Issue hygiene）
Status: Phase ① → ①b = PASS；Phase ② READY / NOT STARTED
Assessment date: 2026-08-10
Assessor: Human OPEN Issue triage + repository SoT
Agent GitHub Issues API: 403（cannot read/write Issue bodies）
Agent GitHub Issue mutation: FORBIDDEN
Human GitHub Issue mutation now: Phase ② #6 / #8 Current-state patch（optional next）
Phase ① Close #5 / #10 / #11: DONE（Human）
Phase ①b read-back: PASS（Human 2026-08-10）
Phase ②: READY / NOT STARTED（stopped here by Human）
Phase ③: blocked until Phase ② complete
EG-1 Human create: parallel process；do NOT mix with this packet

Phase ①b Human attestation（2026-08-10）:
  #5 CLOSED / completed（Close comment posted）
  #10 CLOSED / completed（Close comment posted）
  #11 CLOSED / not_planned（timeline superseded；Close comment posted）
  #6 OPEN（confirmed）
  #8 OPEN（confirmed）
  reason mapping: matches close-candidates draft

Current SoT（durable）:
  main HEAD at packet write-up: 658c790f34adb3489808121a72c6dcccbde97d2f
  PR #192: MERGED（schema-mapping-next packet path）
  PR #193: MERGED（README current-state）
  Decision-AS-CN1-OBSERVATION-1: CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
  Decision-AS-COLUMN-EG-1: Accepted / LOCKED / EG-1+XB-1+AP-1
  SharePoint column path: through EG-1 Accepted
  Human create: AUTHORIZED / NOT STARTED by Acceptance
  Implementation Start: HOLD
  Deploy / real data: NO-GO
  OPEN Issues: 25 remaining of prior 28 after #5/#10/#11 Close（Human attestation）
```

## 1. Question

```text
OPEN 28件は「これから着手する仕事」ではない。

何を Close し、何を OPEN のまま本文だけ合わせ、
何を将来バックログとして残すか。

本 packet ≠ Implementation Start
本 packet ≠ Human create
本 packet ≠ SharePoint / adapter 実装
本 packet ≠ 28件一括 Close
```

## 2. Verdict

| 対象 | 判定 |
|---|---|
| 最新 Decision / column path 進行 | 整合（CN-1 CLOSED；EG-1 Accepted） |
| OPEN Issue 本文の Current / Gate / Dependency | **STALE 多数** |
| 28件をそのまま実装バックログとみなす | **誤り** |
| #5 / #10 / #11 | **Close 候補（強い）** |
| #6 / #8 | **OPEN 維持 + Status Reconciliation** |
| #4 / #9 / #12 / #15〜#19 | **OPEN 維持；継続必要性は再判定** |
| #20〜#33 / #68〜#71 / #125 | **OPEN 維持（将来実装バックログ）** |
| Agent Issue mutation | **FORBIDDEN** |
| 即時コード実装 | **NO-GO** |

```text
最大の整合性問題:
  進捗そのものより、Issue 本文が現在の正本状態に追随していないこと。

今やるべきこと:
  新しい実装ではない。
  Issue Status Reconciliation（Human）

分離規則:
  Issue を閉じること ≠ 本文を最新状態にすること
  件数削減 ≠ 整理完了
```

## 3. Four-group classification（Human attestation）

Human 2026-08-10 triage。Agent は Issue body を API 取得できないため、
区分・推奨は Human 実読結果を durable に固定する。

### Group A — 古い状態を整理する候補（Close 可否を優先確認）

| Issue | 役割（初期） | Close 推奨 | 根拠要約 |
|---|---|---|---|
| **#5** | Phase 0 再利用境界固定 | **Close 候補（強い）** | CN-1 まで閉鎖済み。SharePoint 列経路は #192 まで進行。本文基準 SHA は初期状態のまま |
| **#10** | AGENTS.md・PR テンプレート・ADR を将来リポジトリへ追加 | **Close 候補（強い）** | 現行リポジトリはその段階を大幅に通過 |
| **#11** | Codex 3か月試行の承認前前提 | **Close 候補（強い）** | 実際の開発履歴と時間軸が明確にずれる |

詳細 Close 下書き:
[`issue-status-reconciliation-close-candidates-5-10-11.md`](./issue-status-reconciliation-close-candidates-5-10-11.md)

### Group B — 正本だが本文が古い（OPEN 維持 + Status Reconciliation）

| Issue | 役割 | 推奨 |
|---|---|---|
| **#4** | （正本系） | OPEN 維持；継続必要性は Step ③ で再判定 |
| **#6** | 3か月試行の親 Issue | **OPEN 維持 + Current-state reconciliation** |
| **#8** | DEC-001〜017 Decision Ledger | **OPEN 維持 + Decision 状態 reconcile**（Close しない） |
| **#9** | （正本系） | OPEN 維持；継続必要性は Step ③ で再判定 |
| **#12** | （正本系） | OPEN 維持；継続必要性は Step ③ で再判定 |
| **#15〜#19** | 古い設計文書だが未決定の法人運用・ルール・監査・性能条件を保持 | **今まとめて Close しない** |

詳細 resync 下書き（#6 / #8 優先）:
[`issue-status-reconciliation-resync-6-8.md`](./issue-status-reconciliation-resync-6-8.md)

```text
#8 MUST remain OPEN:
  DEC ledger 役割自体は有効。
  Close ではなく最新 SoT への reconcile 対象。

#6 MUST remain OPEN as parent:
  「3か月試行」親 Issue の役割は残せる。
  本文の Implemented:0 / #7 OPEN / #3 OPEN / 試験サイト未確定等は更新対象。
```

### Group C — 今後の実装バックログ（OPEN 維持）

| Issues | 推奨 |
|---|---|
| #20, #21, #22, #23, #24, #27, #28, #30, #32, #33 | OPEN 維持 |

```text
多数 OPEN = 未着手放置、ではない。
将来実装する機能単位を先に Issue として設計済みだから。
#22 は依存モデル STALE の可能性あり（prior assessment）。
  ただし本 Phase ① の Close 対象ではない。
  body Current/Gate/Dependency 追随は Phase ② 以降の候補。
```

### Group D — 後工程・UI（OPEN 維持 / 今は着手しない）

| Issues | 推奨 |
|---|---|
| #68, #69, #70, #71, #125 | OPEN 維持 / 今は着手しない |

## 4. Recommended order（LOCKED）

| Order | Action | Gate |
|---|---|---|
| **①** | #5 / #10 / #11 を下書きどおり Human Close | **DONE** |
| **①b** | Close 後 read-back | **PASS**（#5/#10 completed；#11 not_planned；#6/#8 OPEN） |
| **②** | #6 / #8 の current-state reconciliation | **READY / NOT STARTED**；#8 は Decision Ledger として OPEN 維持 |
| **③** | #4 / #9 / #12 / #15〜#19 の個別再判定 | **② 後のみ**；一括 Close 禁止 |
| **④** | #20以降 / UI系は原則バックログ維持 | **いま触らない**；mutation 不要 |

```text
この順なら、28件を無理に減らすのではなく、
「いま判断が必要な Issue」と「将来の実装 Issue」だけが残る。

いまの停止点:
  Phase ① → ①b = PASS
  Phase ② = READY / NOT STARTED（Human stop）
  Phase ③ / EG-1 Human create / #20以降 は混ぜない。
```

## 5. Explicit non-authorization

```text
This packet does NOT authorize:
  Agent GitHub Issue create / edit / close / comment
  一括 Close / 一括本文更新
  Implementation Start
  SharePoint adapter / schema mapping code
  Agent SharePoint / M365 / Entra mutation
  treating EG-1 Acceptance as Human create completed
  treating INTENDED Internal Names as CONFIRMED
  Deploy / real data
  closing #8 because ledger text is stale
  closing #15〜#19 as a batch
  treating Reconciliation as substitute for Human create / VR-1
```

## 6. Human mutation authorization（narrow）

```text
AUTHORIZED for Human only（after reading Close/resync drafts）:
  Phase ①: DONE — Close #5 / #10 / #11
  Phase ①b: PASS — read-back recorded
  Phase ② READY / NOT STARTED: Patch Current/Gate/Dependency on #6 / #8；#8 KEEP OPEN
  Phase ③ after ②: Record keep-open / later-close judgment for
            #4 / #9 / #12 / #15〜#19 without batch Close

FORBIDDEN for Agent:
  all GitHub Issue mutations

FORBIDDEN still / do not mix now:
  Phase ③ before Phase ② complete
  touching #20以降 / UI Issues
  EG-1 Human create inside this Reconciliation flow
  Implementation Start / adapter code / Deploy / tenant mutation
```

## 7. Next

```text
Completed:
  Phase ① Close #5 / #10 / #11
  Phase ①b read-back PASS

Stop point（Human 2026-08-10）:
  Phase ② READY / NOT STARTED
  do not auto-start #6 / #8 body updates

When Human resumes:
  Phase ② #6 / #8 resync（#8 remains OPEN as Decision Ledger）
  then Phase ③ continuity re-check（no batch Close）

Do not touch now:
  Group C / D（#20以降 / UI）
  EG-1 Human create（parallel；separate）

Stop / FORBIDDEN now for Agent:
  Issue mutation
  Implementation Start
  SharePoint mutation
  Deploy / real data
```
