/**
 * DASHBOARD-UX-1 — fail-closed presentation copy.
 */

export const DASHBOARD_OVERVIEW_PRESENTATION_NOTE =
  "この画面は合成データによる表示確認用です。業務データには接続されていません。";

export const DASHBOARD_OVERVIEW_ACTION_DISABLED_NOTE = "表示専用のため操作は無効です。";

export const DASHBOARD_OVERVIEW_ACTION_NAV_NOTE =
  "合成表示の画面間移動のみ可能です。保存や業務データへの接続はありません。";

export const DASHBOARD_OVERVIEW_KPI_NOTE =
  "件数は合成データです。絞り込み遷移は接続されていません。";

/** Fail-closed copy must not claim usable business UI or live connection. */
export function overviewCopyIsFailClosed(text: string): boolean {
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
