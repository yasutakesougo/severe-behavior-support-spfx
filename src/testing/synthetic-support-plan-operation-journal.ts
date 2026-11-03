import { isCanonicalSupportPlanRowKey } from "../domain/support-plan-row-key";
import { storeJsonSnapshot } from "../domain/json-snapshot";
import type {
  CreatePublicationIntentResult,
  PublicationOperationIntent,
  PublicationOperationJournal,
  PublicationOperationState,
  TransitionPublicationIntentResult,
} from "../domain/publication-operation-journal";

type FacilityScope = Readonly<{ organizationId: string; siteId: string }>;

/**
 * Test adapter modeling durable journal storage across Publisher instances.
 * It is process-local test state and is not a production persistence backend.
 */
export class SyntheticSupportPlanOperationJournal implements PublicationOperationJournal {
  private readonly entries = new Map<string, PublicationOperationIntent>();
  private readonly etags = new Map<string, number>();

  public async createIntent(
    input: Omit<PublicationOperationIntent, "state" | "etag">,
  ): Promise<CreatePublicationIntentResult> {
    if (!input || !isValidScope(input.scope) || !isNonEmptyString(input.operationId)) {
      throw new TypeError("Invalid synthetic publication journal key");
    }
    const key = operationKey(input.scope, input.operationId);
    const existing = this.entries.get(key);
    if (existing) return { status: "EXISTS", entry: snapshot(existing) };
    if (!isValidInput(input)) throw new TypeError("Invalid synthetic publication journal intent");

    const entry = storeJsonSnapshot({
      ...input,
      state: "PREPARED" as const,
      etag: this.nextEtag(key),
    });
    this.entries.set(key, entry);
    return { status: "CREATED", entry: snapshot(entry) };
  }

  public async read(
    scope: FacilityScope,
    operationId: string,
  ): Promise<PublicationOperationIntent | undefined> {
    const entry = this.entries.get(operationKey(scope, operationId));
    return entry ? snapshot(entry) : undefined;
  }

  public async readLatestCommittedRowIntent(
    scope: FacilityScope,
    rowKey: string,
  ): Promise<PublicationOperationIntent["expectedRows"][number] | undefined> {
    if (!isValidScope(scope) || !isNonEmptyString(rowKey)) {
      throw new TypeError("Invalid synthetic publication journal row lookup");
    }
    let latest: PublicationOperationIntent["expectedRows"][number] | undefined;
    let latestRevision = -1;
    for (const entry of this.entries.values()) {
      if (
        entry.state !== "COMMITTED" ||
        !sameScope(entry.scope, scope) ||
        !Number.isSafeInteger(entry.expectedControlRevision)
      ) {
        continue;
      }
      for (const row of entry.expectedRows) {
        if (row.rowKey !== rowKey) continue;
        if (entry.expectedControlRevision > latestRevision) {
          latest = row;
          latestRevision = entry.expectedControlRevision;
        } else if (
          entry.expectedControlRevision === latestRevision &&
          latest &&
          !sameRowIntent(latest, row)
        ) {
          throw new Error("Ambiguous committed journal row history");
        }
      }
    }
    return latest ? storeJsonSnapshot(latest) : undefined;
  }

  public async transition(
    scope: FacilityScope,
    operationId: string,
    expectedEtag: string,
    state: PublicationOperationState,
    reasonCode?: string,
  ): Promise<TransitionPublicationIntentResult> {
    const key = operationKey(scope, operationId);
    const current = this.entries.get(key);
    if (
      !current ||
      current.etag !== expectedEtag ||
      !sameScope(current.scope, scope) ||
      !canTransition(current.state, state) ||
      (state === "RECOVERY_REQUIRED" && !isNonEmptyString(reasonCode))
    ) {
      return { status: "CONFLICT" };
    }
    const next = storeJsonSnapshot({
      ...current,
      state,
      etag: this.nextEtag(key),
      ...(reasonCode ? { reasonCode } : { reasonCode: undefined }),
    });
    this.entries.set(key, next);
    return { status: "UPDATED", entry: snapshot(next) };
  }

  private nextEtag(key: string): string {
    const sequence = (this.etags.get(key) ?? 0) + 1;
    this.etags.set(key, sequence);
    return `journal-etag-${sequence}`;
  }
}

function canTransition(
  current: PublicationOperationState,
  next: PublicationOperationState,
): boolean {
  const transitions: Readonly<
    Record<PublicationOperationState, readonly PublicationOperationState[]>
  > = {
    PREPARED: ["UPDATING", "CONFLICT", "RECOVERY_REQUIRED"],
    UPDATING: ["COMMIT_READY", "CONFLICT", "RECOVERY_REQUIRED"],
    COMMIT_READY: ["COMMITTED", "RECOVERY_REQUIRED"],
    COMMITTED: [],
    CONFLICT: [],
    RECOVERY_REQUIRED: ["COMMITTED"],
  };
  return transitions[current].includes(next);
}

function isValidInput(input: Omit<PublicationOperationIntent, "state" | "etag">): boolean {
  return (
    Boolean(input) &&
    sameScope(input.scope, input.scope) &&
    isNonEmptyString(input.operationId) &&
    isNonEmptyString(input.startedAt) &&
    Number.isSafeInteger(input.expectedControlRevision) &&
    input.expectedControlRevision >= 0 &&
    isDigest(input.requestDigest) &&
    Array.isArray(input.expectedRows) &&
    input.expectedRows.length > 0 &&
    input.expectedRows.every(
      (row) =>
        sameScope(row.scope, input.scope) &&
        isCanonicalSupportPlanRowKey(row.rowKind, row.canonicalKey) &&
        row.rowKey.length > 0 &&
        isDigest(row.payloadDigest),
    )
  );
}

function sameScope(left: FacilityScope, right: FacilityScope): boolean {
  return (
    isValidScope(left) &&
    isValidScope(right) &&
    left.organizationId === right.organizationId &&
    left.siteId === right.siteId
  );
}

function isValidScope(value: unknown): value is FacilityScope {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    isNonEmptyString((value as FacilityScope).organizationId) &&
    isNonEmptyString((value as FacilityScope).siteId)
  );
}

function operationKey(scope: FacilityScope, operationId: string): string {
  return JSON.stringify([scope.organizationId, scope.siteId, operationId]);
}

function snapshot(entry: PublicationOperationIntent): PublicationOperationIntent {
  return storeJsonSnapshot(entry);
}

function sameRowIntent(
  left: PublicationOperationIntent["expectedRows"][number],
  right: PublicationOperationIntent["expectedRows"][number],
): boolean {
  return (
    left.rowKind === right.rowKind &&
    left.rowKey === right.rowKey &&
    left.canonicalKey === right.canonicalKey &&
    left.scope.organizationId === right.scope.organizationId &&
    left.scope.siteId === right.scope.siteId &&
    left.payloadDigest === right.payloadDigest
  );
}

function isDigest(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
