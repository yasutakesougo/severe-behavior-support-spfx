# NEXT-VERSION-COPY-SIMPLIFICATION-2 — Boundary copy lock

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
kind: copy lock / retain existing boundary sentence
date: 2026-09-04
SupportPlan mutation HEAD = 1cde2182ff1adbbd8414a0c6fca398169d29c7b8
Human Ready GO = HOLD
```

## Finding (Human rendered check)

Human 確定コピーの末尾は:

```text
本番未保存
```

実装（適用後⑥、既存 区間 C）は:

```text
本番には保存されていません
```

意味は同じ（LIVE WRITE なし）。Human 確定 copy を **exact string** として扱うなら差分。

## Locked handling

```text
RETAIN — not a silent drift

Human visual shorthand in the confirmed after-apply card:
  本番未保存

Fail-closed boundary sentence kept on ⑥ (Apply 前 / Apply 後 共通):
  本番には保存されていません
  selector: data-sbs-mgmt-loop-b-boundary
  selector: data-sbs-mgmt-plan-activation-c-live-write="false"

Why retain
  1. 区間 C は SIMPLIFICATION-2 IN の「削除」対象ではない。RETAIN は境界表示そのもの。
  2. Apply 前⑥と同じ文。適用後だけ「本番未保存」にすると同一境界が二文になる。
  3. B12 は `本番には保存されていません` を assert している。
  4. 短文化は版4/版4不整合と重複説明の削除が主目的。境界文の置換は別 GO。

Do NOT retarget to 「本番未保存」 in this unit without a separate Human copy GO.
```

## Out of this lock

```text
過去の版
...
版 4・現行版
```

見出し「過去の版」の中に現行版が出る件は **適用後⑥のみ Scope 外**。この unit で広げない。
