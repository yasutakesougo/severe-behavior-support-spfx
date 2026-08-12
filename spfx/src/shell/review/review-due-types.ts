/**
 * DEMO-UX-6 — presentation-only review status & due-state vocabulary.
 * Synthetic fixture shapes only — not live due calculation or review mutation.
 */

export type ShellReviewDueAttentionItem = Readonly<{
  id: string;
  personLabel: string;
  subjectLabel: string;
  reviewStatusLabel: string;
  /** Optional when the item is attention-only without a due-soon label. */
  dueStateLabel?: string;
  reasonLabel: string;
}>;

export type ShellReviewDueStatePresentation = Readonly<{
  heading: string;
  summaryPrompt: string;
  attentionSummary: Readonly<{
    awaitingConfirmationCountLabel: string;
    dueSoonCountLabel: string;
  }>;
  attentionItems: readonly ShellReviewDueAttentionItem[];
  businessFacts: Readonly<{
    reviewScopeLabel: string;
    responsibleRoleLabel: string;
  }>;
  systemState: Readonly<{
    saveStateLabel: string;
    dataSourceLabel: string;
  }>;
}>;
