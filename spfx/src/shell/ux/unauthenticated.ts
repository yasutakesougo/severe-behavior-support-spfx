/**
 * SHELL-UX-6 — presentation-only unauthenticated fail-closed vocabulary.
 * Props display only — no auth judgment, Entra, token, role, or redirect.
 */

export const SHELL_UNAUTHENTICATED_TITLE = "未認証のため表示できません";

export const SHELL_UNAUTHENTICATED_BODY =
  "この画面を表示するには認証が必要です。個人情報および業務データは表示していません。認証判定・サインイン処理は行いません。";

/** Fail-closed copy must not include personal or business data fields. */
export function unauthenticatedCopyExcludesSensitiveTokens(text: string): boolean {
  const lowered = text.toLowerCase();
  const forbidden = [
    "表示名:",
    "利用者",
    "個人情報を表示します",
    "token",
    "entra",
    "bearer",
    "access_token",
  ];
  for (const token of forbidden) {
    if (lowered.indexOf(token.toLowerCase()) >= 0) {
      return false;
    }
  }
  return true;
}
