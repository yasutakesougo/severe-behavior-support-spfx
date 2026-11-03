import type { SupportPlanRowIdentity } from "./support-plan-row-key";

export type PublicationOperationState =
  "PREPARED" | "UPDATING" | "COMMIT_READY" | "COMMITTED" | "CONFLICT" | "RECOVERY_REQUIRED";

export type PublicationJournalRowIntent = Readonly<
  SupportPlanRowIdentity & {
    scope: Readonly<{ organizationId: string; siteId: string }>;
    payloadDigest: string;
  }
>;

export type PublicationOperationIntent = Readonly<{
  scope: Readonly<{ organizationId: string; siteId: string }>;
  operationId: string;
  state: PublicationOperationState;
  startedAt: string;
  expectedControlRevision: number;
  expectedRows: readonly PublicationJournalRowIntent[];
  requestDigest: string;
  reasonCode?: string;
  etag: string;
}>;

export type CreatePublicationIntentResult =
  | Readonly<{ status: "CREATED"; entry: PublicationOperationIntent }>
  | Readonly<{ status: "EXISTS"; entry: PublicationOperationIntent }>;

export type TransitionPublicationIntentResult =
  | Readonly<{ status: "UPDATED"; entry: PublicationOperationIntent }>
  | Readonly<{ status: "CONFLICT" }>;

/**
 * Durable operation-record boundary. Implementations must provide unique
 * scoped operation IDs and conditional transitions; Publisher never replays
 * a write when an existing or uncertain intent is found.
 */
export interface PublicationOperationJournal {
  createIntent(
    input: Omit<PublicationOperationIntent, "state" | "etag">,
  ): Promise<CreatePublicationIntentResult>;
  read(
    scope: Readonly<{ organizationId: string; siteId: string }>,
    operationId: string,
  ): Promise<PublicationOperationIntent | undefined>;
  /**
   * Returns the latest COMMITTED digest for this exact scoped physical row.
   * Implementations must fail on ambiguous history and must not return a
   * PREPARED, in-flight, or recovery-required operation as committed evidence.
   */
  readLatestCommittedRowIntent(
    scope: Readonly<{ organizationId: string; siteId: string }>,
    rowKey: string,
  ): Promise<PublicationJournalRowIntent | undefined>;
  transition(
    scope: Readonly<{ organizationId: string; siteId: string }>,
    operationId: string,
    expectedEtag: string,
    state: PublicationOperationState,
    reasonCode?: string,
  ): Promise<TransitionPublicationIntentResult>;
}
