# NEXT-VERSION-COPY-SIMPLIFICATION-1 — Rendered Browser Acceptance 1

```text
unit: SBS-MGMT-PLAN-ACTIVATION-C-NEXT-VERSION-COPY-SIMPLIFICATION-1
kind: Rendered Browser Acceptance（RBA）
date: 2026-09-03
verdict: PASS
P0 = 0
P1 = 0
LIVE WRITE / Deploy / SharePoint / M365 / Entra = not executed
```

## Binding

```text
historical reviewed product = #584 @ 5437e64703db055eef2bf230f5a682cf0286dc1a
RBA exercised on Proposal A product candidate `fed08fd49d12fccf323991fb95a4f5e58d6f9e55`
```

## Matrix

| ID | Viewport | Assertion | Result |
|---|---|---|---|
| RBA-C1 | 1280×900 | ⑥ に locked D5/D6 2文 + `適用中: 版 3` + `下書き: 版 4` + Apply | PASS |
| RBA-C2 | 390×844 | 同上。overflowX = false | PASS |
| RBA-C3 | both | Apply 後 `現在適用中: 版 4` / `版 3: 過去版` | PASS |
| RBA-C4 | 1280×900 | cold URL: Apply unmounted / draft absent | PASS |
| B12 | 1280 + 390 × happy / NO_CHANGE / historical | 6 / 6 PASS | PASS |

## Artifacts

```text
/opt/cursor/artifacts/proposal-a-rba/desktop-1280-arrival.png
/opt/cursor/artifacts/proposal-a-rba/desktop-1280-after-apply.png
/opt/cursor/artifacts/proposal-a-rba/desktop-1280-cold.png
/opt/cursor/artifacts/proposal-a-rba/mobile-390-arrival.png
/opt/cursor/artifacts/proposal-a-rba/desktop-1280x900.png
/opt/cursor/artifacts/proposal-a-rba/mobile-390x844.png
```

## Usability

```text
hierarchy: 適用中 / 下書き / Apply が区間 B で連続して読める
density: 区間 B の重複4行を除去。区間 A locked notes は保持
readability: 5秒で3点が読める
visual states: disabled create-cta と primary Apply が区別できる
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
RBA ≠ Actual Staff Check
Exact UI-Correction HEAD Fixation = NEXT after this evidence commit
Independent Implementation Review = NEXT
Human Ready / Merge / Deploy / LIVE WRITE = NOT AUTHORIZED
```
