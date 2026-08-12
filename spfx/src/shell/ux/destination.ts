import {
  SHELL_PRIMARY_NAV_ITEMS,
  type ShellPrimaryNavigationId,
} from "./primary-navigation";

/**
 * SHELL-UX-7 — presentation-only destination vocabulary and fail-closed copy.
 * No business UI, live I/O, authorization judgment, or nav expansion.
 */

export const SHELL_DEFAULT_DESTINATION: ShellPrimaryNavigationId = "overview";

/** Locked to existing SHELL_PRIMARY_NAV_ITEMS — Plans / Administration OUT. */
export const SHELL_DESTINATION_IDS = SHELL_PRIMARY_NAV_ITEMS.map((item) => item.id);

export const SHELL_DESTINATION_DISCONNECTED_BODY =
  "この画面は現在、共通シェルの表示確認用です。業務データには接続されていません。";

export const SHELL_DESTINATION_DISCONNECTED_NOTE =
  "利用可能な業務画面ではありません。認証判定・実データ取得は行いません。";

export function isShellPrimaryNavigationId(value: string): value is ShellPrimaryNavigationId {
  return (SHELL_DESTINATION_IDS as readonly string[]).includes(value);
}

export function labelForShellDestination(id: ShellPrimaryNavigationId): string {
  const found = SHELL_PRIMARY_NAV_ITEMS.find((item) => item.id === id);
  return found ? found.label : id;
}

export function headingForShellDestination(id: ShellPrimaryNavigationId): string {
  return labelForShellDestination(id);
}

/** Fail-closed copy must not claim usable business UI or live connection. */
export function destinationCopyIsFailClosed(text: string): boolean {
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
  return (
    text.indexOf("業務データには接続されていません") >= 0 &&
    text.indexOf("利用可能な業務画面ではありません") >= 0
  );
}
