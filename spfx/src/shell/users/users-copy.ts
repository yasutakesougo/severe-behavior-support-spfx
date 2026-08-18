/**
 * DEMO-UX-2 / DEMO-UX-3 / DEMO-UX-8 — fail-closed presentation copy.
 * FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 1: detail-preview note is fixture-derived.
 */

import type { UserListRow } from "./users-types";

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

const USERS_DETAIL_PREVIEW_NOTE_PREFIX = "合成詳細プレビューがある利用者のみ一覧から表示できます";
const USERS_DETAIL_PREVIEW_NOTE_SUFFIX = "業務データの詳細画面には接続されていません。";

/**
 * DEMO-UX-13 / POLISH-1 Unit 1: list detail note from fixture labels, not hardcoded names.
 * Empty labels keep the generic fail-closed sentence (no implied full-roster detail path).
 */
export function formatUsersDetailPreviewNote(labels: readonly string[]): string {
  if (labels.length === 0) {
    return `${USERS_DETAIL_PREVIEW_NOTE_PREFIX}。${USERS_DETAIL_PREVIEW_NOTE_SUFFIX}`;
  }
  return `${USERS_DETAIL_PREVIEW_NOTE_PREFIX}（現在は ${labels.join("・")}）。${USERS_DETAIL_PREVIEW_NOTE_SUFFIX}`;
}

/**
 * Resolve person labels in `detailPreviewUserIds` order. Unknown ids are dropped.
 * Missing/empty ids yield no names (do not infer A/C).
 */
export function personLabelsForDetailPreview(
  rows: readonly UserListRow[],
  detailPreviewUserIds: readonly string[] | undefined,
): readonly string[] {
  if (!detailPreviewUserIds || detailPreviewUserIds.length === 0) {
    return [];
  }
  const byId = new Map<string, string>();
  for (const row of rows) {
    byId.set(row.id, row.personLabel);
  }
  const labels: string[] = [];
  for (const userId of detailPreviewUserIds) {
    const label = byId.get(userId);
    if (label !== undefined && labels.indexOf(label) < 0) {
      labels.push(label);
    }
  }
  return labels;
}

/**
 * DEMO-UX-13: generic fallback when no preview ids are supplied.
 * Prefer `formatUsersDetailPreviewNote` with runtime labels in the list.
 */
export const DEMO_USERS_DETAIL_DISABLED_NOTE = formatUsersDetailPreviewNote([]);

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
