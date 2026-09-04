# NEXT-VERSION-COPY-SIMPLIFICATION-2 — Rendered Browser Acceptance 1

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-2
kind: Rendered Browser Acceptance（RBA）
date: 2026-09-04
verdict: PASS
P0 = 0
P1 = 0
product HEAD: fb7ced5f83c2907b94e93feefc75b3b17ba1ac31
LIVE WRITE / Deploy / SharePoint / M365 / Entra = not executed
```

## Binding

```text
Human UI Copy Correction Start GO — SIMPLIFICATION-2 = RECEIVED
Proposal A product base = f85ee757a9795b62ad5da475dc0aebc78e3ad6d3
Implementation HEAD = fb7ced5f83c2907b94e93feefc75b3b17ba1ac31
```

## Matrix

| ID | Viewport | Assertion | Result |
|---|---|---|---|
| RBA-S2-1 | 1280×900 | Apply 後⑥: `現在適用中: 版 4` / `過去版: 版 3` / 短い次変更1行 / create-cta / `本番未保存` | PASS |
| RBA-S2-2 | 390×844 | 同上。overflowX = false | PASS |
| RBA-S2-3 | both | 長い NEXT_VERSION_NOTE / IMMUTABLE / `概念上の版は 4` が⑥に出ない | PASS |
| RBA-S2-4 | both | D5/D6 2文が⑥に残る | PASS |
| RBA-S2-5 | both | `適用: actor / ISO` は⑥主画面に無く、履歴・詳細「適用情報」に残る | PASS |
| B12 | 1280 + 390 × 3 paths | 6 / 6 PASS | PASS |

## Observed ⑥ text (programmatic)

```text
⑥ 次版準備
版 4・適用中
次の版の考え方
観察の不足だけでは、この計画を無効にしません。
見直し期限の超過だけでは、この計画を無効にしません。
現在適用中: 版 4
過去版: 版 3
次に変更するときは、新しい版を作ります。
次の版を作る（表示専用）
本番未保存
```

## Artifacts

```text
/opt/cursor/artifacts/simpl2-rba/desktop-1280-section6-element.png
/opt/cursor/artifacts/simpl2-rba/desktop-1280-activation-info.png
/opt/cursor/artifacts/simpl2-rba/mobile-390-section6-element.png
/opt/cursor/artifacts/simpl2-rba/desktop-1280-text.json
/opt/cursor/artifacts/simpl2-rba/mobile-390-text.json
/opt/cursor/artifacts/simpl2-b12/desktop-1280x900.png
/opt/cursor/artifacts/simpl2-b12/mobile-390x844.png
```

## Usability

```text
hierarchy: Apply 後は active / history / 次変更 / CTA が連続して読める
density: 長い概念説明と版4/版4不整合行を除去。ISO 証跡は補助へ
readability: 5秒で「今4 / 前3 / 次は表示専用」が読める
visual states: disabled create-cta 保持。primary Apply は Apply 後に消える
spacing: 390 overflowX false
```

## Findings

```text
P0 = 0
P1 = 0
```

## Gate

```text
RBA = PASS
RBA ≠ Actual Staff Re-Check
≠ Human Ready GO
≠ Merge / Deploy / LIVE WRITE
```
