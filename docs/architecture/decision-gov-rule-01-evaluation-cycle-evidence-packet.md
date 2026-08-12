# GOV-RULE-01 — 行動関連点数の評価周期 — Evidence Packet

この文書は、**GOV-RULE-01**（行動関連点数の評価周期）の
**Evidence Packet / Decision Packet candidate** である。

**Accepted / LOCKED ではない。** HOLD LIFT CANDIDATE のみ。
Human Option Acceptance を待つ。

Parent Selection:
[`decision-gov-rule-01-04-evidence-bundle-selection.md`](./decision-gov-rule-01-04-evidence-bundle-selection.md)

```text
repository: yasutakesougo/severe-behavior-support-spfx
Decision ID: GOV-RULE-01
Kind: Evidence Packet + Decision Packet candidate
Status: HOLD LIFT CANDIDATE（≠ Accepted / LOCKED）
Prior status: SELECTED / LOCKED / HOLD（PR #282）
Owner: Issue #19
Agent recommendation: NONE（≠ Acceptance evidence）
Implementation / 3-year hardcode: FORBIDDEN
PR: pending
```

## 1. Evidence conclusion（Human Direction）

```text
行動関連項目は障害支援区分認定調査の結果に基づく制度上の項目である。

障害支援区分の認定有効期間は原則3年だが、
状態変動等により市町村審査会の意見を踏まえて短縮される場合があり、
心身状態の変化等に応じて変更認定が行われる場合もある。

したがって:
  アプリ独自の固定周期で行動関連点数を再採点しない。
```

## 2. Evidence sources（厚生労働省一次資料 framing）

本 Packet は Human Direction が示した厚生労働省一次資料枠を Evidence とする。
Agent は条文番号・告示番号を新規発明して Binding 化しない。

| Source class（Human-cited） | Role in this Packet |
|---|---|
| 「介護給付費等の支給決定等について」 | 支給決定・認定手続の制度枠 |
| 「障害支援区分に係る市町村審査会の運営について」 | 審査会意見・有効期間短縮等の運用枠 |
| 行動関連項目に関する厚生労働省告示 | 行動関連項目が制度上の調査・判定項目であることの枠 |
| 関連: 障害者総合支援法に基づく認定有効期間は「３年を基本」とする整理 | **原則3年**の制度基本値（短縮・変更認定を許容） |

```text
IMPORTANT:
  3年 = 認定有効期間の基本値
  3年 ≠ アプリの固定再評価周期
  短縮・変更認定を許容する
```

## 3. Decision Packet candidate（NOT Accepted）

```text
周期:
  固定日数・固定月数をアプリ独自に設定しない。
  正式な障害支援区分認定・更新認定・変更認定の有効期間に従う。

追加評価が必要な条件:
  新たな正式認定結果が発行された場合、
  または市町村による変更認定・更新認定が行われた場合。

根拠:
  厚生労働省
  「介護給付費等の支給決定等について」
  「障害支援区分に係る市町村審査会の運営について」
  行動関連項目に関する厚生労働省告示。

決定境界:
  認定・有効期間そのものの決定主体は市町村。
  アプリは正式な認定結果を参照・保持する。
```

## 4. Explicit non-options / FORBIDDEN from this Packet alone

```text
3年をアプリの固定再評価周期としてハードコードする
入力日・確認日・アプリ上の経過日数だけで新しい点数へ切り替える
Agent による GOV-RULE-01 Accepted / LOCKED
支援計画・観察記録実装変更 / SharePoint mutation
Implementation Start
```

## 5. HOLD lift assessment

```text
GOV-RULE-01 = HOLD LIFT CANDIDATE

Meaning:
  Evidence は Human Option Acceptance に足りる候補材料を揃えた
  Agent は Accepted / LOCKED へ変更しない
  Human Option Acceptance / Decision を待つ
```

## 6. After this Packet

```text
GOV-RULE-01 status: HOLD LIFT CANDIDATE（prior HOLD not lifted by Agent）
Next: Human Option Acceptance（separate）or keep HOLD
```
