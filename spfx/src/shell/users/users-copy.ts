/**
 * DEMO-UX-2 / DEMO-UX-3 / DEMO-UX-8 — fail-closed presentation copy.
 */

export const DEMO_USERS_PRESENTATION_NOTE =
  "この画面は合成データによる表示確認用です。業務データには接続されていません。";

/**
 * DEMO-UX-8 filter boundary copy.
 * DEMO-UX-11: not rendered as a separate band; consolidated into Users filter hint.
 */
export const DEMO_USERS_FILTER_NOTE =
  "合成データ内の状態で絞り込みできます。業務データの検索には接続されていません。";

/** @deprecated Prefer consolidated filter hint after DEMO-UX-11. Kept for import compatibility. */
export const DEMO_USERS_FILTER_DISABLED_NOTE = DEMO_USERS_FILTER_NOTE;

/**
 * DEMO-UX-13: list detail opens only when a synthetic detail fixture exists for that user.
 * Default fixtures: A / C. Not a live user-detail connection.
 */
export const DEMO_USERS_DETAIL_DISABLED_NOTE =
  "合成詳細プレビューがある利用者のみ一覧から表示できます（現在は Aさん・Cさん）。業務データの詳細画面には接続されていません。";

export const DEMO_USERS_FILTER_EMPTY_NOTE =
  "合成データ内に該当する利用者はありません。事業所に利用者がいないことを示すものではありません。";

/** Fail-closed copy must not claim usable business UI or live connection. */
export function usersCopyIsFailClosed(text: string): boolean {
  const lowered = text.toLowerCase();
  const forbidden = [
    "利用可能です",
    "業務データに接続されています",
    "認証済み",
    "authorized",
    "live sharepoint",
    "完成済み",
  ];
  for (const token of forbidden) {
    if (lowered.indexOf(token.toLowerCase()) >= 0) {
      return false;
    }
  }
  return text.indexOf("業務データには接続されていません") >= 0;
}
