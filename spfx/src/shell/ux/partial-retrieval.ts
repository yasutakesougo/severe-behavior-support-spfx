/**
 * SHELL-UX-4 — presentation-only partial-retrieval vocabulary.
 * Props display only — no adapter fetch, outcome judgment, or count aggregation.
 */

export type ShellRetrievalItem = Readonly<{
  id: string;
  label: string;
}>;

export type ShellPartialRetrievalPresentation = Readonly<{
  succeededItems: readonly ShellRetrievalItem[];
  failedItems: readonly ShellRetrievalItem[];
}>;

/** Partial-retrieval presentation requires at least one failed item (props invariant). */
export function hasPartialRetrievalFailure(
  presentation: ShellPartialRetrievalPresentation,
): boolean {
  return presentation.failedItems.length > 0;
}

export const SHELL_PARTIAL_RETRIEVAL_WARNING =
  "一部の取得に失敗しています。全件正常ではありません。正常取得分と失敗分を分けて表示しています。";
