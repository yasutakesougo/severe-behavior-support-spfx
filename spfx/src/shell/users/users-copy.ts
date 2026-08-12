/**
 * DEMO-UX-2 — fail-closed presentation copy.
 */

export const DEMO_USERS_PRESENTATION_NOTE =
  "この画面は合成データによる表示確認用です。業務データには接続されていません。";

export const DEMO_USERS_FILTER_DISABLED_NOTE =
  "絞り込みは表示専用のため操作できません。";

export const DEMO_USERS_DETAIL_DISABLED_NOTE =
  "詳細画面への遷移は接続されていません。";

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
