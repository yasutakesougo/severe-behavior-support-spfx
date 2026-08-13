/**
 * DEMO-UX-6 — fail-closed presentation copy.
 */

export const DEMO_REVIEW_DUE_PRESENTATION_NOTE =
  "完全合成データによる表示確認です。業務データには接続されていません。";

export const DEMO_REVIEW_DUE_MUTATION_DISABLED_NOTE =
  "見直しの完了・更新・評価操作はこのデモでは実行できません。";

export const DEMO_REVIEW_DUE_CALCULATION_DISABLED_NOTE =
  "期限接近・要確認は合成表示ラベルです。期限計算や業務判定は接続されていません。";

/**
 * INV-17: attention zero-result only — not “no reviews needed” business completion.
 * Default synthetic fixture is non-empty; this copy is for empty presentation paths.
 */
export const DEMO_REVIEW_DUE_ATTENTION_EMPTY_NOTE =
  "表示する確認対象はありません（合成データ）。業務上の見直し対象が無いことを示すものではありません。";

/** Fail-closed copy must not claim usable business UI or live connection. */
export function reviewDueCopyIsFailClosed(text: string): boolean {
  const lowered = text.toLowerCase();
  const forbidden = [
    "利用可能です",
    "業務データに接続されています",
    "live sharepoint",
    "保存できます",
    "計算済みの実期限",
  ];
  for (const token of forbidden) {
    if (lowered.indexOf(token.toLowerCase()) >= 0) {
      return false;
    }
  }
  return text.indexOf("業務データには接続されていません") >= 0;
}
