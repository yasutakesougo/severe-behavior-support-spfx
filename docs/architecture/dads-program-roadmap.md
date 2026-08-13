# DADS Program Roadmap（companion to DADS-ADOPTION-V1）

```text
Status: ROADMAP / LOCKED by Decision-DADS-ADOPTION-V1
Authority: docs/architecture/decision-dads-adoption-v1.md
Code mutation: NOT AUTHORIZED by this roadmap alone
```

## Goal

既存 DEMO-UX / SPFx shell を捨てて作り直すのではなく、**ベースラインとして保存**し、DADS を参考に **法人アプリ UI Style Guide へ収束**する。

## Issue board（recommended）

| ID | Title | Kind | Start authorized by |
|---|---|---|---|
| DADS-01 | Adoption Decision | docs-only | Human direction（this wave） |
| DADS-02 | Existing UI Inventory | read-only / docs-only | separate Human GO |
| DADS-03 | Application Style Guide | docs-only | separate Human GO |
| DADS-04 | Design Tokens | implementation | separate Human GO |
| DADS-05 | Shared UI Primitives | implementation | separate Human GO |
| DADS-06 | Accessibility Gate | test / CI | separate Human GO |
| DADS-UX-\* | Screen migration（1 slice / Issue） | implementation | separate Human GO each |
| DADS-VERIFY | Final consistency review | read-only | after DADS-UX-\* |

## Dependency

```text
DADS-01 → DADS-02 → DADS-03
                    ├→ DADS-04 → DADS-05 → DADS-UX-* → DADS-VERIFY
                    └→ DADS-06 ──↗
```

## Parallelism with DEMO-UX / #299

- DEMO-UX 全面停止は不要
- 推奨: DADS-01〜03 を短期間で固定してから、後続 DEMO-UX / DADS-UX を Style Guide に沿って継続
- 既存 smoke の業務不変条件は Merge 条件として維持（テスト改変で PASS させない）

## Non-claims

```text
This roadmap ≠ Implementation Start for DADS-04+
This roadmap ≠ Deploy / SharePoint write / #299 Close
This roadmap ≠ Domain/Contracts rewrite
```
