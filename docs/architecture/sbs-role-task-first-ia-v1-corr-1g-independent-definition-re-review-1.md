# SBS-ROLE-TASK-FIRST-IA-V1 — CORR-1G Independent Definition Re-Review-1

Fresh Independent Definition Re-Review against the Correction-1 packet body only. This record is **not** a Human Definition Lock, does **not** consume Definition Correction-2 GO, and does **not** authorize Implementation Start.

```text
repository: yasutakesougo/severe-behavior-support-spfx
workstream: SBS-ROLE-TASK-FIRST-IA-V1
unit: CORR-1G
kind: independent definition re-review-1
date: 2026-09-16
reviewed packet path:
  docs/architecture/sbs-role-task-first-ia-v1-corr-1g-complete-controlled-packet.md
reviewed exact HEAD: 4a80746b8d837c8aceebee2e03ee3ac088166446
reviewed exact packet blob: cc7a3f92729521417f4163968e7f37b46757c127
normative surface: packet body only
kickoff / PR body / prior conversations / implementation / attachments / sidecars:
  EXCLUDED / NON-NORMATIVE
parent Correction-2 packet blob: 5eeb8140772ebfefe050cff93361a6d81c470f81
parent Human Definition Lock blob: 794d227a1e69c709e679337be6478b32de81d74a
verdict: CORRECTION REQUIRED
P0 = 0
P1 = 3
P2 = 0
Human Definition Lock Eligibility: NOT ELIGIBLE
Human Definition Lock: NOT AUTHORIZED / NOT CONSUMED
Definition Correction-2 GO: NOT RECEIVED / NOT CONSUMED
Implementation Start: NOT AUTHORIZED
Ready / Merge / Deploy / LIVE WRITE: NOT AUTHORIZED
SharePoint / M365 / Entra mutation: NOT AUTHORIZED
Product / SPFx mutation: NONE / NOT AUTHORIZED
```

This record captures the Re-Review verdict. It does not rewrite the reviewed packet. Changing the packet body would change blob `cc7a3f92…` and is Correction-2, which requires a separate Human GO plus unique closure of the leftover choices below.

---

## Review Basis Sufficiency

```text
Review Basis Sufficiency = PASS
Reviewed Basis = docs/architecture/sbs-role-task-first-ia-v1-corr-1g-complete-controlled-packet.md
Exact HEAD = 4a80746b8d837c8aceebee2e03ee3ac088166446
Exact packet blob = cc7a3f92729521417f4163968e7f37b46757c127
Normative Surface = packet body only
```

---

## P0

```text
P0 = 0
```

No P0. The packet continues to keep CORR-1G inside the parent-locked P2-1 boundary, keeps new Destinations / LIVE WRITE / PLANNER / ADMIN_AUDIT / P2-2 / P2-3 OUT, preserves insufficient-context fallbacks, and does not create Implementation Authority.

---

## P1

```text
P1 = 3
```

### P1-1 — D-PERSON「current occurrenceなし」が exhaustive release set と矛盾する

§2.1 は、一度 `support object = true` になった後は §2.4 の release event まで true を保持すると定義している。

一方、§2.2 は、

`D-PERSON: person opened but no current support occurrence → false`

と定義している。

しかし、§2.4 の exhaustive release set は次の 3 種類だけである。

- D-TODAY で明示的に deselect
- D-PERSON から D-FIND-PERSON へ Back して person context を落とす
- 別 object への replacement

したがって、sticky true object を保持した状態で「current occurrence のない person」を D-PERSON で開いた場合、

- §2.2 に従って false にする
- §2.4 に列挙されていないので true を保持する

の二通りに読める。

H-6 は「unlisted event」を対象にするため、§2.2 に明記済みのこのイベントの矛盾は解消しない。

Required Correction:

`D-PERSON open without current occurrence` を §2.4 の明示的 release event に追加するか、sticky true 時には release しないと明記する。

### P1-2 — D-UNRECORDED choice が `occurrence-true requires object-true` を満たす経路を持たない

§3.1 は `occurrence-true requires object-true` を明示している。

しかし、§3.2 は `On D-UNRECORDED, an unrecorded occurrence is chosen → occurrence true → D-RECORD-WRITE` としている。

同時に、Global `未記録` は object context の有無に関係なく D-UNRECORDED へ到達できる。

ところが、§2.2 の support-object acquisition event には `D-UNRECORDED occurrence choice` が含まれていない。

したがって object=false の状態で D-UNRECORDED に入り occurrence を選んだ場合、

- occurrence=true にする
- coupling 違反なので true にできない
- occurrence 選択と同時に対応 object も取得する

の複数解釈が残る。

H-6 により、§2.2 にない support-object acquisition を実装者が推測で追加することもできない。

Required Correction — 次のどちらかを Definition で一意に固定する。

- A. D-UNRECORDED occurrence choice は対応する support object も同時に acquire / replace する。その場合は §2.2 にも acquisition event として列挙する。
- または B. D-UNRECORDED occurrence choice は `object=true` の場合だけ成立する。object=false 時の Product 挙動を明示する。

This Re-Review does **not** pick A or B.

### P1-3 — D-PERSON C4 Primary Action の object=false 時の挙動が未確定

§2.2 Standing Rule 7 は、`D-PERSON’s existing C4 Primary Action` を object=true で実行した場合は D-PROCEDURE としている。

一方 object=false の場合は `must not open empty D-PROCEDURE` までしか定義していない。

そのため合理的な実装として、

- Primary Action を disabled にする
- D-PERSON に stay する
- D-TODAY へ fallback する
- 別の既存導線へ戻す

が残る。

また同じ節で `Required unique path from D-PERSON (object true) to D-PROCEDURE = Global 手順` としつつ、既存 C4 Primary Action も D-PROCEDURE へ到達可能としているため、「unique path」が control path なのか Destination identity なのかも曖昧である。

Required Correction:

object=false 時の C4 Primary Action について、Product-visible behavior を 1 つに固定する。併せて `unique path` ではなく `unique Destination identity` など、Global 手順と既存 C4 Primary Action が同じ D-PROCEDURE を指す意味に統一する。

This Re-Review does **not** pick the object=false control behavior.

---

## P2

```text
P2 = 0
```

Correction-1 で追加された C6 D-PERSON identity、sticky persistence、Global 今日非 release、H-6、OUT 境界について、上記 P1 以外の独立した non-blocking finding はない。

---

## Question results

| # | Question | Result |
|---|---|---|
| 1 | CORR-2A/B を置換せず P2-1 だけを追加している | PASS |
| 2 | support-object acquisition が一意 | FAIL — P1-1 |
| 3 | D-TODAY Primary Action 後は D-PROCEDURE のみ | PASS |
| 4 | D-PERSON open + occurrence 後は D-PERSON のみ | PASS |
| 5 | first-paint auto-entry rejected | PASS |
| 6 | occurrence acquisition が一意 | FAIL — P1-2 |
| 7 | release sets exhaustive / coupling unique | FAIL — P1-1 / P1-2 |
| 8 | insufficient-context fallbacks preserved | PASS |
| 9 | C6 location identities unique | PASS |
| 10 | D-HOME = D-TODAY alias only | PASS |
| 11 | PLANNER / ADMIN_AUDIT / P2-2 / P2-3 / Open Questions OUT | PASS |
| 12 | Smoke ≠ Human Task | PASS |
| 13 | New Destination / invented auth role なし | PASS |
| 14 | React / CSS / router / file list を over-fix していない | PASS |
| 15 | 他 carry-forward 項目を side-effect で close していない | PASS |
| 16 | Implementation Start NOT AUTHORIZED | PASS |
| 17 | H-6 が unlisted context mutation を防止する | PASS。ただし listed-but-contradictory / incomplete event は防げず、P1-1 / P1-3 が残る |

---

## Verdict

```text
Verdict = CORRECTION REQUIRED
Human Definition Lock Eligibility = NOT ELIGIBLE
Human Definition Lock = NOT AUTHORIZED / NOT CONSUMED
Implementation Start = NOT AUTHORIZED
Ready / Merge = NOT AUTHORIZED
Product / SPFx / SharePoint / M365 / Entra mutation = NONE / NOT AUTHORIZED
Definition Correction-2 GO = NOT RECEIVED / NOT CONSUMED
```

---

## NEXT / STOP

```text
NEXT = CORR-1G Definition Correction-2
       (requires separate Human Definition Correction-2 GO)
Correction-2 minimum scope (after GO; this record does not apply it):
  1. D-PERSON open without current occurrence と sticky object の関係を一意化
  2. D-UNRECORDED occurrence choice と support-object coupling を一意化
     (Human must pick Required Correction A or B; this Re-Review does not pick)
  3. D-PERSON C4 Primary Action の object=false behavior を一意化
     (Human must pick one Product-visible behavior; this Re-Review does not pick)
  4. 上記以外の CORR-1G scope は変更しない
STOP = No Human Definition Lock
     = No Implementation Start
     = No Product mutation
     = No Correction-2 packet rewrite from this record
     = No Ready / Merge
```
