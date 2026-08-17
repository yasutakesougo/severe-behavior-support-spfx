/**
 * DEMO-UX-4 — fail-closed presentation copy.
 */

export const DEMO_SUPPORT_PLAN_PRESENTATION_NOTE =
  "この画面は合成データによる支援計画の表示確認用です。業務データには接続されていません。";

export const DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE =
  "作成・編集・保存は接続されていません。表示専用です。";

export const DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE =
  "計画の確認専用です。作成・編集・保存操作はありません。承認・変更権限は追加しません。";

/** Fail-closed copy must not claim usable business UI or live connection. */
export function supportPlanCopyIsFailClosed(text: string): boolean {
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
