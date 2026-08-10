# Canonical Decision Ledger

## Current status（reconciled 2026-08-10）

Role: Decision Ledger — KEEP OPEN

SoT tip: `e5ec0dfed61f4afdaebcf678f325faffe8e038f0`

Ledger sync rule:

* Issue #8 remains the Decision Ledger.
* Accepted / LOCKED Decision documents under `docs/architecture/` and `docs/decisions/` are the primary SoT.
* When an older Issue body entry conflicts with an Accepted / LOCKED repository Decision, the repository Decision governs until this ledger entry is synchronized.
* Status Reconciliation is not a re-Decision.

Known synchronized state:

### DEC-008

Status: Accepted / LOCKED

制度上の作成者:

* 強度行動障害支援者養成研修（実践研修）修了者
* 支援計画シート等の制度上の作成者として ACCEPTED

独立した最終承認者:

* NOT ADOPTED
* アプリ独自の最終承認者を設定しない

サービス管理責任者を独立した最終承認者とする案:

* NOT ADOPTED

提出ロール:

* application contract に固定しない
* Option C

差戻しロール:

* application contract に固定しない
* Option C

DEC-008 repository SoT:

`docs/architecture/decision-dec-008-acceptance.md`

### SharePoint / AssessmentSnapshot path

* CN-1: CLOSED / CONSUMED / DEFAULT_COLUMNS_ONLY
* Decision-AS-COLUMN-EG-1: Accepted / LOCKED
* Human column creation: separate Human process
* Agent SharePoint mutation: FORBIDDEN
* adapter / schema mapping implementation: HOLD
* INTENDED ≠ CONFIRMED until Human create + VR-1

### Process state

* PROCESS-OPT-V1: ACCEPTED / LOCKED
* LOW-AUTO-PILOT-V1 policy: ACCEPTED
* LOW-AUTO-PILOT-V1 execution: NOT STARTED
* Ready auto: NOT ACCEPTED
* Merge: HUMAN-ONLY

This Issue is NOT a Close candidate.

Do not infer unresolved DEC outcomes from this synchronization note.

Genuinely OPEN / HOLD / Deferred Decisions remain unchanged until their own Accepted / LOCKED Decision exists.

基準main:

```text
33a2064e037d56361c5bb93bddabd928ad756c3b
```

本Issueは`DEC-001`〜`DEC-017`の正本台帳とする。

Issue #19の回答を、次の状態で反映する。

```text
Proposed:
候補案。正式承認前。

Accepted:
制度根拠または正式な法人決定により確定。

Partial:
制度・技術境界はAcceptedだが、法人運用またはサービス別詳細が未承認。

Deferred:
根拠または正式決定待ち。実装で補完しない。

Rejected:
不採用。
```

## 現在の実装ゲート分類

### Batch A：業務contracts・Domain実装前

- [x] DEC-002 利用者IDの法人内採番・識別境界
- [ ] DEC-003 行動関連点数の登録・確認責任
- [ ] DEC-004 行動関連点数の評価周期・有効期間
- [x] DEC-005 点数0の業務上の意味
- [ ] DEC-006 対象外を表す正式な条件
- [ ] DEC-007 算定不能時の管理者対応
- [x] DEC-008 支援計画シートの作成者・独立最終承認者の境界
- [x] DEC-009 判定スナップショットを保存するタイミング

### Batch B：SharePoint・Entra接続前

- [ ] DEC-001 パイロット対象となる2事業所の正式承認
- [ ] DEC-010 法人管理者が閲覧できる個人情報の範囲
- [ ] DEC-013 SharePointサイトの命名規則
- [ ] DEC-014 Microsoft 365グループの命名規則
- [ ] DEC-015 バックアップと復元の責任者

### Batch C：本番開始前

- [ ] DEC-011 データ保存期間
- [ ] DEC-012 論理削除データの完全削除方針
- [ ] DEC-016 制度改定時のルール更新責任者
- [ ] DEC-017 本アプリの正式名称

チェックは総合状態`Accepted`だけに付ける。`Partial`は未完了として扱う。

---

# Decision Records

## DEC-001 パイロット対象となる2事業所

```text
Status: Proposed
A事業所: 磯子区障害者地域活動ホーム / SITE-ISG / ISG
B事業所: 本牧活動ホーム / SITE-HOM / HOM
```

B事業所を含む正式なパイロット承認は、法人管理者・事業所管理者の決定待ち。

## DEC-002 利用者IDの法人内採番・識別境界

```text
Status: Accepted
```

- `UserId`は`SiteId`から分離する。
- 氏名、生年月日、住所を含めない。
- SharePointアイテムIDを業務IDとして使用しない。
- 具体的な採番サービス・重複防止実装は後続設計で決定する。

Evidence: PR #36 / main `33a2064e...`

## DEC-003 行動関連点数の登録・確認責任

```text
Type: MIXED
Evidence/technical status: Accepted
Organization policy status: Proposed
Overall: Partial
```

制度境界:

- 公式点数は市町村の認定調査結果等を根拠として判定ソフトで算出される。
- 事業所が独自に再採点する値として扱わない。
- アプリでは根拠資料、`validFrom`、`validTo`、確認日と一体で保持する。

法人運用案:

```text
登録・転記: PLANNER
最終確認・有効化: SERVICE_MANAGER
SUPPORTER / VIEWER: 閲覧のみ
ORG_ADMIN: 集計・監査を基本とする
```

正式承認者: 法人業務責任者（未指定）

## DEC-004 行動関連点数の評価周期・有効期間

```text
Type: MIXED
Evidence/technical status: Accepted
Organization policy status: Proposed
Overall: Partial
```

- アプリ独自の固定周期で公式点数を再採点しない。
- 根拠資料の`validFrom`と`validTo`を正本とする。
- 障害支援区分認定は3年を基本とするが、短縮等があるため`3年固定`をハードコードしない。
- 更新後の点数は、新しい認定の有効開始日から使用する。
- 入力日・確認日だけで新旧点数を切り替えない。
- 有効期間の欠落・重複・矛盾は`unassessable`とする。

期限前通知日数と臨時確認条件は法人運用として未決定。

## DEC-005 点数0の業務上の意味

```text
Type: EVIDENCE_REQUIRED
Status: Accepted
```

- `0`は公式評価表に存在する有効値。
- 合計点`0`も有効な計算結果。
- `0`を未入力、対象外、算定不能、取得失敗へ変換しない。
- `null`、`undefined`、空文字、不正形式、取得失敗を`0`へ変換しない。

## DEC-006 対象外を表す正式な条件

```text
Type: MIXED
Score-state boundary: Accepted
Service-specific reason codes: Deferred
Overall: Partial
```

- 行動関連12項目の点数入力には`not_applicable`という点数区分はない。
- 未確認・資料欠損・取得失敗を`not_applicable`へ変換しない。
- `not_applicable`は、そのサービス・施設・判定規則自体が適用外の場合だけ使用できる。
- 具体的理由コードはサービス・加算ごとに定義する。

## DEC-007 算定不能時の管理者対応

```text
Type: MIXED
Technical status: Accepted
Organization workflow status: Proposed
Overall: Partial
```

次の場合は点数依存判定を停止する。

```text
根拠資料なし
有効期間外
点数未確認
不正形式・範囲外
資料間の矛盾
取得失敗
```

- `eligible`、`ineligible`、`not_applicable`を確定表示しない。
- `unassessable`と理由を表示する。
- demo値、前回値、0点で補完しない。
- 修正後に新しい判定実行として再評価する。

法人運用案:

```text
確認タスク起票: PLANNERまたはSITE_ADMIN
最終確認: SERVICE_MANAGER
長期未解消: ORG_ADMINへエスカレーション
```

## DEC-008 支援計画シートの作成者・独立最終承認者の境界

Status: Accepted / LOCKED

制度上の作成者:

* 強度行動障害支援者養成研修（実践研修）修了者
* 支援計画シート等の制度上の作成者として ACCEPTED

独立した最終承認者:

* NOT ADOPTED
* アプリ独自の最終承認者を設定しない

サービス管理責任者を独立した最終承認者とする案:

* NOT ADOPTED

提出ロール:

* application contract に固定しない
* Option C

差戻しロール:

* application contract に固定しない
* Option C

DEC-008 repository SoT:

`docs/architecture/decision-dec-008-acceptance.md`

## DEC-009 判定スナップショットを保存するタイミング

```text
Status: Accepted
```

Batch A-3で、再計算、訂正、監査、handoffとの関係を決定する。

## DEC-010 法人管理者の閲覧範囲

```text
Status: Deferred
```

SharePoint・Entra接続前に、最小権限・個人情報範囲・監査目的を決定する。

## DEC-011 データ保存期間

```text
Status: Deferred
```

法人文書管理規程、請求・監査・事故対応要件を確認後に決定する。

## DEC-012 論理削除データの完全削除方針

```text
Status: Deferred
```

初期版では通常画面に物理削除機能を持たせない方針を維持する。

## DEC-013 SharePointサイトの命名規則

```text
Status: Proposed
```

```text
SITE-ISG / ISG / /sites/sbs-isogo
SITE-HOM / HOM / /sites/sbs-honmoku
```

町田系旧候補はDeprecatedとする。正式なMicrosoft 365変更は未承認。

## DEC-014 Microsoft 365グループの命名規則

```text
Status: Proposed
```

`SBS-{SiteCode}-{ROLE}`形式を候補とする。実テナント作成はNO-GO。

## DEC-015 バックアップと復元の責任者

```text
Status: Deferred
```

Batch BでMicrosoft 365管理者、業務確認者、再開承認者を分離する。

## DEC-016 制度改定時のルール更新責任者

```text
Status: Deferred
```

Batch A-2の`GOV-RULE-09〜12`と合わせて決定する。

## DEC-017 本アプリの正式名称

```text
Status: Deferred
```

本番開始前に法人承認を得る。

---

# Evidence for Batch A-1

- 厚生労働省告示第543号・別表第二
  - https://www.mhlw.go.jp/web/t_doc?dataId=83aa8497&dataType=0
- 障障発0515第1号「訪問系サービスの適切な運用について」
  - https://www.mhlw.go.jp/web/t_doc?dataId=00tc1866&dataType=1&pageNo=1
- 障発0303第1号「障害支援区分認定の実施について」
  - https://www.mhlw.go.jp/web/t_doc?dataId=00tb9882&dataType=1&pageNo=1
- 「介護給付費等の支給決定等について」
  - https://www.mhlw.go.jp/web/t_doc?dataId=00tb4786&dataType=1&pageNo=1
- 令和6年度障害福祉サービス等報酬改定の公式説明
  - https://www.mhlw.go.jp/stf/newpage_39243.html

# Threshold boundary

```text
0〜9: 10点以上条件を満たさない点数帯
10〜17: 10点以上条件を満たす点数帯
18〜24: 18点以上条件を満たす点数帯
```

点数帯は点数条件だけを表し、最終的な加算・請求・サービス適格性を表さない。

# Current gate

```text
DEC-002: Accepted
DEC-005: Accepted
DEC-003/004/006/007: Partial
Batch A-1 evidence boundary: PASS
Concrete permissions: HOLD
Service-specific not-applicable reasons: HOLD
Organization unassessable workflow: HOLD
Final eligibility / billing logic: HOLD
SharePoint / Entra changes: NO-GO
Production: NO-GO
```

次工程はBatch A-2（`DEC-008`、`GOV-RULE-02〜12`）とする。

---

## DEC-009 — Accepted

記録日: 2026-08-08 (JST)
選択: A — 最終判定確定時にAssessmentSnapshotを保存

### 決定内容

- draftは正式なAssessmentSnapshotとしない。
- review提出だけでは正式Snapshotを保存しない。
- 最終判定が確定した時点でAssessmentSnapshotを保存する。
- 未確定、取得失敗、算定不能を確定結果へ倒さない。
- 訂正は既存Snapshotの上書きではなく、別契約で扱う。

### Scope boundary

本Decisionでは次を決めない。

- AuditEvent retention
- 一般データ保持
- 物理削除
- SharePoint設定
- M365 / Entra / Deploy

### Gate

DEC-009: Accepted
Implementation: HOLD pending dependency reconciliation and Entry Criteria
Next Substantive Unit: NOT_SELECTED
Start Authorization: NOT_GRANTED

