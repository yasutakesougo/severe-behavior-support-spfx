# SBS-MGMT-HOME-CORRECTION-1 — Definition / Scope Lock 1

- 文書: `sbs-mgmt-home-correction-1-definition-scope-lock-1.md`
- 位置づけ: Human **Definition / Scope Lock GO** の受信記録と LOCKED 正本。実装は開始しない
- 対象: `#554` / SBS-MGMT-HOME Correction-1
- 作成日: 2026-09-11
- **Human Gate 受信**: `Definition / Scope Lock GO` = **RECEIVED / CONSUMED**（2026-09-11、本 run の user_query 全文 `SBS-MGMT-HOME-CORRECTION-1` + `Human Definition / Scope Lock GO`）
- **Independent Definition Re-Review-2**: `docs/architecture/sbs-mgmt-home-correction-1-independent-definition-re-review-2.md` — **PASS / REVIEW-CLEARED**（P0=0 / P1=0 / P2=1 non-blocking）
- **本 packet の Outcome**: **LOCKED**
- **Implementation Start GO**: **HOLD / NOT RECEIVED** — 本 Lock は実装・SPFx 差分・LIVE WRITE・Deploy・Issue close を許可しない
- **Actual Staff Value Check**: **NOT CONSUMED** / **NOT PASS** / **NOT INCLUDED IN THIS LOCK**
- **Simulation 2**: `docs/architecture/sbs-mgmt-home-correction-1-definition-correction-1.md` と `docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md` は **CORRECTION のまま**。本 Lock は CORRECTION 判定を覆さない

## 1. Lock 対象（LOCKED 正本）

次の 3 文書が Correction-1 の Definition / Scope 正本である。本 Lock 以降、実装 Scope はこれらを覆して新状態を発明してはならない。

| 文書 | git blob SHA @ Re-Review-2 PASS commit `38c5439` | 本 Lock 後の状態 |
|---|---|---|
| `docs/architecture/sbs-mgmt-home-correction-1-definition-start-1.md` | `92ce437c6c843576aea49376b8971abdf873b3f5` | Definition Start — Lock CONSUMED。実装は開始しない |
| `docs/architecture/sbs-mgmt-home-correction-1-definition-correction-1.md` | `debd3992dee917eecd1dbae86f137a781b764a8b` | C1–C6 正本。Lock CONSUMED |
| `docs/architecture/sbs-mgmt-home-correction-1-scope-definition-1.md` | `685b343b174ada3b911e79a6d794aaaa5cce8d22` | **LOCKED**（DRAFT 終了） |

観測正本（Lock 対象外・判定維持）:

| 文書 | git blob SHA | 判定 |
|---|---|---|
| `docs/architecture/sbs-mgmt-home-5-persona-real-browser-simulation-2.md` | `656936ec101644d1dda8ba2c9275312e16d7588a` | **CORRECTION** 維持 |
| `docs/architecture/sbs-mgmt-home-correction-1-independent-definition-re-review-2.md` | `ec593c5138ef3de3656b0fc3acbb9403a87b374b` @ `2b2fdc6` | PASS / REVIEW-CLEARED。Lock 許可の前提。本 Lock 後も判定は PASS |

SHA は Re-Review-2 が PASS した blob を固定する。本 Lock packet と各文書の NEXT 行更新は Lock 記録であり、C1–C6 の意味を変更しない。

## 2. ロックする境界（要約・正本は C1–C6 + Scope IN/OUT）

### IN（実装 Start 後に触ってよい範囲の上限）

- Management Home シェル: `spfx/src/shell/dashboard/`（`overview-fixture.ts` 含む）、`managementHomePresentation.ts`、`ManagementHomeApp.tsx`、関連テスト / smoke
- 既存 host 内ナビ（planner `data-shell-nav` 等）。site nav / Home.aspx / SharePoint chrome は触らない
- 既存 `reviewDueDate` 表示経路の copy 正規化（C2）
- 既存 `today_targets` の **UserId 部分集合** 証明、または fail-closed（C4 / RR2-P2-1）。新規集計ロジックは OUT
- 未実施 / 未記録 / 未保存 の既存ソース参照の明示（C3）。新業務状態の発明は OUT
- 計画カード: スタンドアロン「新しい計画」除去。INTENDED 文言への置換（C6）

### OUT（本 Lock でも禁止）

- SharePoint / Home.aspx / site chrome / tenant ナビ mutation
- Apply / next-version 作成 / LIVE WRITE / schema / list 変更
- `SupportPlan.currentVersion` を Draft と同一視すること
- RevisionIntent CONSUMED = Applied とすること
- Management Home を write-first にすること
- 未実施 / 未記録 / 未保存 の新業務状態発明、90 日再計算、件数 12 の人数再利用
- Actual Staff Value Check を Re-Sim PASS に含めること
- `#554` close、Ready、Merge、Deploy、Issue 大量作成

### C6 文言（本 Lock）

pixel-exact な最終コピーは **Implementation Start GO 後の実装 Scope** で決めてよい。ただし実装 Scope が採用してよい INTENDED 文言は Correction-1 C6 の次の 2 行に限る。第三の CTA 文言を新発明してはならない。

```text
次版下書き vN+1（未適用）
```

または同等:

```text
新しい計画の下書き（まだ適用されていません）
```

`N` は表示時点の現行版番号。スタンドアロン「新しい計画」は禁止。現行版が無い対象ではカードを出さない（fail-closed）。

## 3. Re-Review-2 から持ち越す非ブロッカー

**RR2-P2-1（OPEN）**: `overview-fixture.ts` の `today_targets: { count: 12 }`。

- 本 Lock のブロッカーではない
- **Implementation Start GO 後の実装 Scope 必須証明**: 12 を人数として再利用しない。既存ソースの UserId 部分集合、または fail-closed
- 新規集計 / 新データ源 = OUT

## 4. 実装を開始しない理由（本 Lock の限界）

Definition / Scope Lock は「直してよい範囲」を固定する。コードを書いてよい許可は **Implementation Start GO** のみである。

本 run は次を行わない。

- SPFx / domain の実装差分
- fixture の 12 削除を含むコード変更
- browser Re-Sim
- Actual Staff Value Check
- `#554` / `#604` の Ready / Merge / close

## 5. 次ゲート

| Gate | 状態 |
|---|---|
| Human Definition / Scope Lock GO | **RECEIVED / CONSUMED** |
| Implementation Scope Definition | **RECORDED / CANDIDATE** — Independent Review-1 = **CORRECTION** |
| Independent Implementation Scope Review-1 | **CORRECTION** — `docs/architecture/sbs-mgmt-home-correction-1-independent-implementation-scope-review-1.md` |
| Human Implementation Start GO | **HOLD / NOT RECEIVED / NOT ELIGIBLE** |
| Correction-1 implementation | **NOT STARTED** |
| Re-Sim PASS (C1) | **NOT STARTED** — P0=0 **and** P1=0 + Persona 1–5 meaning。Actual Staff を含めない |
| Actual Staff Value Check | **NOT CONSUMED** |

**NEXT**: Implementation Scope Correction-1（docs）。Human Implementation Start GO は消費しない。コードは開始しない。
