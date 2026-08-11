/**
 * SHELL-UX — presentation-only shell view modes.
 * Panels are display chrome only; no authorization or adapter semantics.
 */

export const SHELL_VIEW_MODES = [
  "ready",
  "loading",
  "access_denied",
  "retrieval_failed",
  "partial_retrieval_failed",
  "unauthenticated",
] as const;

export type ShellViewMode = (typeof SHELL_VIEW_MODES)[number];

export function isShellViewMode(value: string): value is ShellViewMode {
  return (SHELL_VIEW_MODES as readonly string[]).indexOf(value) >= 0;
}

export function isPartialRetrievalViewMode(mode: ShellViewMode): boolean {
  return mode === "partial_retrieval_failed";
}

export function isUnauthenticatedViewMode(mode: ShellViewMode): boolean {
  return mode === "unauthenticated";
}
