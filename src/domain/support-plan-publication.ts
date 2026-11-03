import type { SupportPlanRowIdentity } from "./support-plan-row-key";
import { createVersionRowIdentity, isCanonicalSupportPlanRowKey } from "./support-plan-row-key";
import { sha256Hex } from "./sha256";
import { storeJsonSnapshot } from "./json-snapshot";
import type {
  PublicationJournalRowIntent,
  PublicationOperationIntent,
  PublicationOperationJournal,
  PublicationOperationState,
} from "./publication-operation-journal";

export type FacilityScope = Readonly<{
  organizationId: string;
  siteId: string;
}>;

export type PublicationPhase = "STABLE" | "UPDATING" | "RECOVERY_REQUIRED";

export type PublicationControl = Readonly<{
  scope: FacilityScope;
  phase: PublicationPhase;
  revision: number;
  operationId?: string;
  startedAt?: string;
  failureReason?: string;
  etag: string;
}>;

export type SupportPlanPublicationRow<TPayload = unknown> = Readonly<
  SupportPlanRowIdentity & {
    scope: FacilityScope;
    payload: TPayload;
  }
>;

export type PublicationWriteResult =
  | Readonly<{ status: "WRITTEN" }>
  | Readonly<{ status: "FAILED"; reasonCode: string; persistedRows: number }>
  | Readonly<{ status: "UNKNOWN"; reasonCode: string }>;

export type PublicationReadRowsResult =
  | Readonly<{
      status: "SUCCESS";
      rows: readonly SupportPlanPublicationRow[];
      complete: boolean;
    }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

export interface SupportPlanPublicationStore {
  readControl(scope: FacilityScope): Promise<PublicationControl | undefined>;
  compareAndSwapControl(
    scope: FacilityScope,
    expectedEtag: string,
    next: Omit<PublicationControl, "etag">,
  ): Promise<Readonly<{ status: "UPDATED"; control: PublicationControl } | { status: "CONFLICT" }>>;
  writeRows(
    scope: FacilityScope,
    operationId: string,
    rows: readonly SupportPlanPublicationRow[],
  ): Promise<PublicationWriteResult>;
  updateHeader(
    scope: FacilityScope,
    operationId: string,
    row: SupportPlanPublicationRow,
    expectedVersion: number,
  ): Promise<PublicationWriteResult>;
  readRows(scope: FacilityScope): Promise<PublicationReadRowsResult>;
}

export type PublishResult =
  | Readonly<{ status: "PUBLISHED"; revision: number }>
  | Readonly<{ status: "CONFLICT"; reasonCode: string }>
  | Readonly<{ status: "WRITE_FAILED"; reasonCode: string; controlPhase: "RECOVERY_REQUIRED" }>
  | Readonly<{ status: "PARTIAL_FAILURE"; reasonCode: string; controlPhase: "RECOVERY_REQUIRED" }>
  | Readonly<{ status: "UNKNOWN_OUTCOME"; reasonCode: string; controlPhase: "RECOVERY_REQUIRED" }>
  | Readonly<{ status: "RECOVERY_REQUIRED"; reasonCode: string }>;

export type RecoveryResult =
  | Readonly<{ status: "RECOVERED"; revision: number }>
  | Readonly<{ status: "BLOCKED"; reasonCode: string }>
  | Readonly<{ status: "CONFLICT"; reasonCode: string }>;

export type RecoveryEvidence = Readonly<{
  priorWriterStopped: boolean;
  pendingRequestsSettled: boolean;
}>;

/**
 * Storage-independent publication protocol used by synthetic tests.
 * It is not a SharePoint adapter and does not establish production ACL or writer coverage.
 */
export class SyntheticSupportPlanPublisher {
  private readonly usedOperationKeys = new Set<string>();

  public constructor(
    private readonly store: SupportPlanPublicationStore,
    private readonly journal: PublicationOperationJournal,
  ) {}

  public async publish(
    input: Readonly<{
      scope: FacilityScope;
      operationId: string;
      startedAt: string;
      rows: readonly SupportPlanPublicationRow[];
    }>,
  ): Promise<PublishResult> {
    const pinnedVersionRows: SupportPlanPublicationRow[] = [];
    const precondition = async (): Promise<PublishResult | undefined> => {
      let snapshot: PublicationReadRowsResult;
      try {
        snapshot = await this.store.readRows(input.scope);
      } catch {
        return { status: "CONFLICT", reasonCode: "PUBLICATION_SNAPSHOT_READ_FAILED" };
      }
      if (snapshot.status !== "SUCCESS") {
        return { status: "CONFLICT", reasonCode: "PUBLICATION_SNAPSHOT_UNVERIFIED" };
      }
      const snapshotError = validatePublicationSnapshot(snapshot, input.scope, []);
      if (snapshotError) {
        return { status: "CONFLICT", reasonCode: "PUBLICATION_SNAPSHOT_UNVERIFIED" };
      }

      for (const intended of input.rows) {
        const existing = snapshot.rows.find(
          (candidate) =>
            candidate.rowKey === intended.rowKey ||
            candidate.canonicalKey === intended.canonicalKey,
        );
        if (!existing) continue;
        return {
          status: "CONFLICT",
          reasonCode:
            existing.canonicalKey === intended.canonicalKey
              ? "ROW_ALREADY_EXISTS"
              : "ROWKEY_COLLISION",
        };
      }
      const availableRows = [...snapshot.rows, ...input.rows];
      for (const header of input.rows.filter((row) => row.rowKind === "H")) {
        const version = headerCurrentVersion(header.payload);
        const pinned =
          version === undefined
            ? undefined
            : findPinnedVersionRow(header, version, availableRows, input.scope);
        if (!pinned) {
          return { status: "CONFLICT", reasonCode: "HEADER_CURRENT_VERSION_UNVERIFIED" };
        }
        if (
          !input.rows.some((row) => row.rowKey === pinned.rowKey) &&
          !pinnedVersionRows.some((row) => row.rowKey === pinned.rowKey)
        ) {
          pinnedVersionRows.push(pinned);
        }
      }
      if (!(await this.verifyPriorCommittedRows(input.scope, pinnedVersionRows))) {
        return { status: "CONFLICT", reasonCode: "PINNED_VERSION_JOURNAL_MISMATCH" };
      }
      return undefined;
    };

    return this.publishWithIntent(
      input,
      input.rows,
      (rows) => this.store.writeRows(input.scope, input.operationId, rows),
      precondition,
      () => pinnedVersionRows,
    );
  }

  public async updateHeader(
    input: Readonly<{
      scope: FacilityScope;
      operationId: string;
      startedAt: string;
      row: SupportPlanPublicationRow;
      expectedVersion: number;
    }>,
  ): Promise<PublishResult> {
    if (
      !isFacilityScope(input.scope) ||
      !isNonEmptyString(input.operationId) ||
      !isNonEmptyString(input.startedAt) ||
      !isWellFormedRowIdentity(input.row) ||
      input.row.rowKind !== "H" ||
      input.row.scope.organizationId !== input.scope.organizationId ||
      input.row.scope.siteId !== input.scope.siteId ||
      !Number.isSafeInteger(input.expectedVersion) ||
      input.expectedVersion < 1 ||
      !isHeaderVersion(input.row.payload, input.expectedVersion + 1)
    ) {
      return { status: "CONFLICT", reasonCode: "HEADER_ROW_REQUIRED" };
    }

    let pinnedVersionRows: readonly SupportPlanPublicationRow[] = [];
    const precondition = async (): Promise<PublishResult | undefined> => {
      let snapshot: PublicationReadRowsResult;
      try {
        snapshot = await this.store.readRows(input.scope);
      } catch {
        return { status: "CONFLICT", reasonCode: "HEADER_SNAPSHOT_READ_FAILED" };
      }
      if (snapshot.status !== "SUCCESS") {
        return { status: "CONFLICT", reasonCode: "HEADER_SNAPSHOT_UNVERIFIED" };
      }
      const snapshotError = validatePublicationSnapshot(snapshot, input.scope, []);
      if (snapshotError) {
        return { status: "CONFLICT", reasonCode: "HEADER_SNAPSHOT_UNVERIFIED" };
      }

      const matches = snapshot.rows.filter(
        (row) => row.rowKind === "H" && row.canonicalKey === input.row.canonicalKey,
      );
      if (matches.length === 0) return { status: "CONFLICT", reasonCode: "HEADER_NOT_FOUND" };
      if (matches.length > 1) return { status: "CONFLICT", reasonCode: "HEADER_AMBIGUOUS" };
      if (matches[0].rowKey !== input.row.rowKey) {
        return { status: "CONFLICT", reasonCode: "HEADER_IDENTITY_MISMATCH" };
      }
      if (!isHeaderVersion(matches[0].payload, input.expectedVersion)) {
        return { status: "CONFLICT", reasonCode: "HEADER_VERSION_MISMATCH" };
      }
      const existingCurrentVersion = headerCurrentVersion(matches[0].payload);
      const existingPinned =
        existingCurrentVersion === undefined
          ? undefined
          : findPinnedVersionRow(matches[0], existingCurrentVersion, snapshot.rows, input.scope);
      if (!existingPinned) {
        return { status: "CONFLICT", reasonCode: "HEADER_CURRENT_VERSION_UNVERIFIED" };
      }
      const nextCurrentVersion = headerCurrentVersion(input.row.payload);
      if (nextCurrentVersion === undefined) {
        return { status: "CONFLICT", reasonCode: "HEADER_CURRENT_VERSION_UNVERIFIED" };
      }
      const pinned = findPinnedVersionRow(
        input.row,
        nextCurrentVersion,
        snapshot.rows,
        input.scope,
      );
      if (!pinned) {
        return { status: "CONFLICT", reasonCode: "HEADER_CURRENT_VERSION_UNVERIFIED" };
      }
      pinnedVersionRows =
        existingPinned.rowKey === pinned.rowKey ? [pinned] : [existingPinned, pinned];
      if (!(await this.verifyPriorCommittedRows(input.scope, pinnedVersionRows))) {
        return { status: "CONFLICT", reasonCode: "PINNED_VERSION_JOURNAL_MISMATCH" };
      }
      return undefined;
    };

    return this.publishWithIntent(
      {
        scope: input.scope,
        operationId: input.operationId,
        startedAt: input.startedAt,
      },
      [input.row],
      (rows) =>
        this.store.updateHeader(input.scope, input.operationId, rows[0], input.expectedVersion),
      precondition,
      () => pinnedVersionRows,
    );
  }

  private async verifyPriorCommittedRows(
    scope: FacilityScope,
    rows: readonly SupportPlanPublicationRow[],
  ): Promise<boolean> {
    for (const row of rows) {
      let committed: PublicationJournalRowIntent | undefined;
      let payloadDigest: string;
      try {
        committed = await this.journal.readLatestCommittedRowIntent(scope, row.rowKey);
        payloadDigest = digestJsonValue(row.payload);
      } catch {
        return false;
      }
      if (
        !committed ||
        committed.rowKind !== row.rowKind ||
        committed.rowKey !== row.rowKey ||
        committed.canonicalKey !== row.canonicalKey ||
        committed.scope.organizationId !== scope.organizationId ||
        committed.scope.siteId !== scope.siteId ||
        committed.payloadDigest !== payloadDigest
      ) {
        return false;
      }
    }
    return true;
  }

  private async publishWithIntent(
    input: Readonly<{ scope: FacilityScope; operationId: string; startedAt: string }>,
    intendedRows: readonly SupportPlanPublicationRow[],
    writeRows: (rows: readonly SupportPlanPublicationRow[]) => Promise<PublicationWriteResult>,
    precondition?: () => Promise<PublishResult | undefined>,
    additionalJournalRows: () => readonly SupportPlanPublicationRow[] = () => [],
  ): Promise<PublishResult> {
    if (
      !isFacilityScope(input.scope) ||
      !isNonEmptyString(input.operationId) ||
      !isNonEmptyString(input.startedAt) ||
      !Array.isArray(intendedRows) ||
      intendedRows.length === 0
    ) {
      return { status: "CONFLICT", reasonCode: "INVALID_PUBLICATION_INPUT" };
    }
    if (
      intendedRows.some(
        (row) =>
          !isWellFormedRowIdentity(row) ||
          row.scope.organizationId !== input.scope.organizationId ||
          row.scope.siteId !== input.scope.siteId,
      ) ||
      hasAmbiguousOrMalformedRows(intendedRows)
    ) {
      return { status: "CONFLICT", reasonCode: "PUBLICATION_SCOPE_OR_ROW_INVALID" };
    }
    const operationKey = JSON.stringify([
      input.scope.organizationId,
      input.scope.siteId,
      input.operationId,
    ]);
    if (this.usedOperationKeys.has(operationKey)) {
      return { status: "CONFLICT", reasonCode: "OPERATION_ID_REUSED" };
    }

    let current: PublicationControl | undefined;
    try {
      current = await this.store.readControl(input.scope);
    } catch {
      return { status: "CONFLICT", reasonCode: "CONTROL_READ_OR_INITIALIZE_FAILED" };
    }
    if (!current) return { status: "RECOVERY_REQUIRED", reasonCode: "CONTROL_NOT_FOUND" };
    if (!isValidControl(current, input.scope)) {
      return { status: "CONFLICT", reasonCode: "CONTROL_INVALID" };
    }
    if (current.phase !== "STABLE") {
      return {
        status: current.phase === "RECOVERY_REQUIRED" ? "RECOVERY_REQUIRED" : "CONFLICT",
        reasonCode:
          current.phase === "RECOVERY_REQUIRED" ? "RECOVERY_REQUIRED" : "PUBLICATION_IN_PROGRESS",
      };
    }
    if (current.revision > 0 && !isNonEmptyString(current.operationId)) {
      await this.markControlRecovery(
        input.scope,
        current,
        input.operationId,
        input.startedAt,
        "CONTROL_OPERATION_ID_MISSING",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "CONTROL_OPERATION_ID_MISSING" };
    }
    if (isNonEmptyString(current.operationId)) {
      let publishedIntent: PublicationOperationIntent | undefined;
      try {
        publishedIntent = await this.journal.read(input.scope, current.operationId);
      } catch {
        await this.markControlRecovery(
          input.scope,
          current,
          current.operationId,
          current.startedAt ?? input.startedAt,
          "PRIOR_CONTROL_JOURNAL_READ_FAILED",
        );
        return { status: "RECOVERY_REQUIRED", reasonCode: "PRIOR_CONTROL_JOURNAL_READ_FAILED" };
      }
      const priorOperationCommitted =
        publishedIntent?.state === "COMMITTED" &&
        publishedIntent.scope.organizationId === input.scope.organizationId &&
        publishedIntent.scope.siteId === input.scope.siteId &&
        publishedIntent.expectedControlRevision + 2 === current.revision;
      if (!priorOperationCommitted) {
        if (
          publishedIntent &&
          publishedIntent.state !== "COMMITTED" &&
          publishedIntent.state !== "CONFLICT" &&
          publishedIntent.state !== "RECOVERY_REQUIRED"
        ) {
          await this.transitionJournal(
            publishedIntent,
            "RECOVERY_REQUIRED",
            "PRIOR_CONTROL_OPERATION_UNCOMMITTED",
          );
        }
        await this.markControlRecovery(
          input.scope,
          current,
          current.operationId,
          publishedIntent?.startedAt ?? current.startedAt ?? input.startedAt,
          "PRIOR_CONTROL_OPERATION_UNCOMMITTED",
        );
        return {
          status: "RECOVERY_REQUIRED",
          reasonCode: "PRIOR_CONTROL_OPERATION_UNCOMMITTED",
        };
      }
    }
    if (current.operationId === input.operationId) {
      return { status: "CONFLICT", reasonCode: "OPERATION_ID_ALREADY_PUBLISHED" };
    }

    let priorIntent: PublicationOperationIntent | undefined;
    try {
      priorIntent = await this.journal.read(input.scope, input.operationId);
    } catch {
      await this.markControlRecovery(
        input.scope,
        current,
        input.operationId,
        input.startedAt,
        "JOURNAL_READ_OUTCOME_UNKNOWN",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "JOURNAL_READ_OUTCOME_UNKNOWN" };
    }
    if (priorIntent) {
      if (priorIntent.state === "COMMITTED" || priorIntent.state === "CONFLICT") {
        return { status: "CONFLICT", reasonCode: "OPERATION_ID_REUSED" };
      }
      if (priorIntent.state !== "RECOVERY_REQUIRED") {
        await this.transitionJournal(
          priorIntent,
          "RECOVERY_REQUIRED",
          "JOURNAL_OPERATION_REQUIRES_HOLD",
        );
      }
      await this.markControlRecovery(
        input.scope,
        current,
        priorIntent.operationId,
        priorIntent.startedAt,
        "JOURNAL_OPERATION_REQUIRES_HOLD",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "JOURNAL_OPERATION_REQUIRES_HOLD" };
    }

    if (precondition) {
      let failedPrecondition: PublishResult | undefined;
      try {
        failedPrecondition = await precondition();
      } catch {
        return { status: "CONFLICT", reasonCode: "PUBLICATION_PRECONDITION_FAILED" };
      }
      if (failedPrecondition) return failedPrecondition;
    }

    let expectedRows: readonly SupportPlanPublicationRow[];
    let journalEvidenceRows: readonly SupportPlanPublicationRow[];
    try {
      expectedRows = storeJsonSnapshot(intendedRows);
      journalEvidenceRows = storeJsonSnapshot(additionalJournalRows());
    } catch {
      return { status: "CONFLICT", reasonCode: "INVALID_PUBLICATION_PAYLOAD" };
    }
    const expectedJournalRows = [...expectedRows, ...journalEvidenceRows];
    if (
      expectedJournalRows.some(
        (row) =>
          !isWellFormedRowIdentity(row) ||
          row.scope.organizationId !== input.scope.organizationId ||
          row.scope.siteId !== input.scope.siteId,
      ) ||
      hasAmbiguousOrMalformedRows(expectedJournalRows)
    ) {
      return { status: "CONFLICT", reasonCode: "PUBLICATION_SCOPE_OR_ROW_INVALID" };
    }

    let journalRows: PublicationJournalRowIntent[];
    let requestDigest: string;
    try {
      journalRows = expectedJournalRows.map((row) => ({
        rowKind: row.rowKind,
        rowKey: row.rowKey,
        canonicalKey: row.canonicalKey,
        scope: row.scope,
        payloadDigest: digestJsonValue(row.payload),
      }));
      requestDigest = sha256Hex(
        JSON.stringify(
          journalRows
            .map((row) => [row.rowKind, row.rowKey, row.canonicalKey, row.payloadDigest])
            .sort((left, right) => String(left[1]).localeCompare(String(right[1]))),
        ),
      );
    } catch {
      return { status: "CONFLICT", reasonCode: "INVALID_PUBLICATION_PAYLOAD" };
    }
    let journalEntry: PublicationOperationIntent;
    try {
      const created = await this.journal.createIntent({
        scope: input.scope,
        operationId: input.operationId,
        startedAt: input.startedAt,
        expectedControlRevision: current.revision,
        expectedRows: journalRows,
        requestDigest,
      });
      if (created.status !== "CREATED") {
        if (created.entry.state !== "COMMITTED" && created.entry.state !== "CONFLICT") {
          if (created.entry.state !== "RECOVERY_REQUIRED") {
            await this.transitionJournal(
              created.entry,
              "RECOVERY_REQUIRED",
              "JOURNAL_OPERATION_REQUIRES_HOLD",
            );
          }
          await this.markControlRecovery(
            input.scope,
            current,
            created.entry.operationId,
            created.entry.startedAt,
            "JOURNAL_OPERATION_REQUIRES_HOLD",
          );
          return { status: "RECOVERY_REQUIRED", reasonCode: "JOURNAL_OPERATION_REQUIRES_HOLD" };
        }
        return { status: "CONFLICT", reasonCode: "OPERATION_ID_REUSED" };
      }
      journalEntry = created.entry;
    } catch {
      await this.markControlRecovery(
        input.scope,
        current,
        input.operationId,
        input.startedAt,
        "JOURNAL_CREATE_OUTCOME_UNKNOWN",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "JOURNAL_CREATE_OUTCOME_UNKNOWN" };
    }
    this.usedOperationKeys.add(operationKey);

    let updating: Awaited<ReturnType<SupportPlanPublicationStore["compareAndSwapControl"]>>;
    try {
      updating = await this.store.compareAndSwapControl(input.scope, current.etag, {
        scope: input.scope,
        phase: "UPDATING",
        revision: current.revision + 1,
        operationId: input.operationId,
        startedAt: input.startedAt,
      });
    } catch {
      await this.transitionJournal(
        journalEntry,
        "RECOVERY_REQUIRED",
        "UPDATING_CAS_OUTCOME_UNKNOWN",
      );
      await this.markControlRecovery(
        input.scope,
        current,
        input.operationId,
        input.startedAt,
        "UPDATING_CAS_OUTCOME_UNKNOWN",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "UPDATING_CAS_OUTCOME_UNKNOWN" };
    }
    if (updating.status !== "UPDATED") {
      this.usedOperationKeys.delete(operationKey);
      await this.transitionJournal(journalEntry, "CONFLICT", "CONTROL_CAS_CONFLICT");
      return { status: "CONFLICT", reasonCode: "CONTROL_CAS_CONFLICT" };
    }
    if (
      !isValidControl(updating.control, input.scope) ||
      updating.control.phase !== "UPDATING" ||
      updating.control.operationId !== input.operationId ||
      updating.control.revision !== current.revision + 1 ||
      updating.control.etag === current.etag
    ) {
      return { status: "RECOVERY_REQUIRED", reasonCode: "UPDATING_CONTROL_INVALID" };
    }

    const journalUpdating = await this.transitionJournal(journalEntry, "UPDATING");
    if (!journalUpdating) {
      await this.markControlRecovery(
        input.scope,
        updating.control,
        input.operationId,
        input.startedAt,
        "JOURNAL_UPDATING_OUTCOME_UNKNOWN",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "JOURNAL_UPDATING_OUTCOME_UNKNOWN" };
    }
    journalEntry = journalUpdating;

    let write: PublicationWriteResult;
    try {
      write = await writeRows(expectedRows);
    } catch {
      write = { status: "UNKNOWN", reasonCode: "WRITE_RESULT_UNKNOWN" };
    }
    if (
      write.status === "FAILED" &&
      (!Number.isSafeInteger(write.persistedRows) ||
        write.persistedRows < 0 ||
        write.persistedRows > expectedRows.length)
    ) {
      write = { status: "UNKNOWN", reasonCode: "INVALID_WRITE_FAILURE_RESULT" };
    }

    const markRecoveryRequired = async (reasonCode: string): Promise<boolean> => {
      const journalMarked = await this.transitionJournal(
        journalEntry,
        "RECOVERY_REQUIRED",
        reasonCode,
      );
      let transition: Awaited<ReturnType<SupportPlanPublicationStore["compareAndSwapControl"]>>;
      try {
        transition = await this.store.compareAndSwapControl(input.scope, updating.control.etag, {
          scope: input.scope,
          phase: "RECOVERY_REQUIRED",
          revision: updating.control.revision,
          operationId: input.operationId,
          startedAt: input.startedAt,
          failureReason: reasonCode,
        });
      } catch {
        return false;
      }
      return (
        journalMarked !== undefined &&
        transition.status === "UPDATED" &&
        isValidControl(transition.control, input.scope) &&
        transition.control.phase === "RECOVERY_REQUIRED" &&
        transition.control.operationId === input.operationId &&
        transition.control.revision === updating.control.revision &&
        transition.control.etag !== updating.control.etag
      );
    };

    if (write.status !== "WRITTEN") {
      const reasonCode = write.reasonCode;
      if (!(await markRecoveryRequired(reasonCode))) {
        return { status: "RECOVERY_REQUIRED", reasonCode: "CONTROL_RECOVERY_TRANSITION_FAILED" };
      }
      if (write.status === "UNKNOWN") {
        return { status: "UNKNOWN_OUTCOME", reasonCode, controlPhase: "RECOVERY_REQUIRED" };
      }
      if (write.persistedRows > 0) {
        return { status: "PARTIAL_FAILURE", reasonCode, controlPhase: "RECOVERY_REQUIRED" };
      }
      return { status: "WRITE_FAILED", reasonCode, controlPhase: "RECOVERY_REQUIRED" };
    }

    let writtenSnapshot: PublicationReadRowsResult;
    try {
      writtenSnapshot = await this.store.readRows(input.scope);
    } catch {
      await markRecoveryRequired("PUBLICATION_SNAPSHOT_READ_FAILED");
      return { status: "RECOVERY_REQUIRED", reasonCode: "PUBLICATION_SNAPSHOT_READ_FAILED" };
    }
    const snapshotError = validatePublicationSnapshot(writtenSnapshot, input.scope, expectedRows);
    const intentSnapshotError = validateJournalSnapshot(writtenSnapshot, input.scope, journalRows);
    const verifiedSnapshotError = snapshotError ?? intentSnapshotError;
    if (verifiedSnapshotError) {
      await markRecoveryRequired(verifiedSnapshotError);
      return { status: "RECOVERY_REQUIRED", reasonCode: verifiedSnapshotError };
    }

    const commitReady = await this.transitionJournal(journalEntry, "COMMIT_READY");
    if (!commitReady) {
      await markRecoveryRequired("JOURNAL_COMMIT_READY_OUTCOME_UNKNOWN");
      return { status: "RECOVERY_REQUIRED", reasonCode: "JOURNAL_COMMIT_READY_OUTCOME_UNKNOWN" };
    }
    journalEntry = commitReady;

    let afterWrite: PublicationControl | undefined;
    try {
      afterWrite = await this.store.readControl(input.scope);
    } catch {
      await this.transitionJournal(
        journalEntry,
        "RECOVERY_REQUIRED",
        "CONTROL_READ_AFTER_WRITE_FAILED",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "CONTROL_READ_AFTER_WRITE_FAILED" };
    }
    if (
      !afterWrite ||
      !isValidControl(afterWrite, input.scope) ||
      afterWrite.phase !== "UPDATING" ||
      afterWrite.operationId !== input.operationId ||
      afterWrite.revision !== updating.control.revision ||
      afterWrite.etag !== updating.control.etag
    ) {
      await this.transitionJournal(journalEntry, "RECOVERY_REQUIRED", "PUBLICATION_OWNERSHIP_LOST");
      return { status: "RECOVERY_REQUIRED", reasonCode: "PUBLICATION_OWNERSHIP_LOST" };
    }

    const committed = await this.transitionJournal(journalEntry, "COMMITTED");
    if (!committed) {
      await markRecoveryRequired("JOURNAL_COMMITTED_OUTCOME_UNKNOWN");
      return { status: "RECOVERY_REQUIRED", reasonCode: "JOURNAL_COMMITTED_OUTCOME_UNKNOWN" };
    }
    journalEntry = committed;

    let published: Awaited<ReturnType<SupportPlanPublicationStore["compareAndSwapControl"]>>;
    try {
      published = await this.store.compareAndSwapControl(input.scope, afterWrite.etag, {
        scope: input.scope,
        phase: "STABLE",
        revision: afterWrite.revision + 1,
        operationId: input.operationId,
        startedAt: input.startedAt,
      });
    } catch {
      let confirmed: PublicationControl | undefined;
      try {
        confirmed = await this.store.readControl(input.scope);
      } catch {
        // Keep the uncertain result held below.
      }
      if (
        confirmed &&
        isValidControl(confirmed, input.scope) &&
        confirmed.phase === "STABLE" &&
        confirmed.operationId === input.operationId &&
        confirmed.revision === afterWrite.revision + 1 &&
        confirmed.etag !== afterWrite.etag
      ) {
        return { status: "PUBLISHED", revision: confirmed.revision };
      }
      await this.markControlRecovery(
        input.scope,
        afterWrite,
        input.operationId,
        input.startedAt,
        "STABLE_PUBLISH_OUTCOME_UNKNOWN",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "STABLE_PUBLISH_OUTCOME_UNKNOWN" };
    }
    if (published.status !== "UPDATED") {
      await this.markControlRecovery(
        input.scope,
        afterWrite,
        input.operationId,
        input.startedAt,
        "PUBLISH_CAS_CONFLICT",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "PUBLISH_CAS_CONFLICT" };
    }
    if (
      !isValidControl(published.control, input.scope) ||
      published.control.phase !== "STABLE" ||
      published.control.revision !== afterWrite.revision + 1 ||
      published.control.operationId !== input.operationId ||
      published.control.etag === afterWrite.etag
    ) {
      await this.markControlRecovery(
        input.scope,
        published.control,
        input.operationId,
        input.startedAt,
        "STABLE_CONTROL_INVALID",
      );
      return { status: "RECOVERY_REQUIRED", reasonCode: "STABLE_CONTROL_INVALID" };
    }

    return { status: "PUBLISHED", revision: published.control.revision };
  }

  private async transitionJournal(
    current: PublicationOperationIntent,
    state: PublicationOperationState,
    reasonCode?: string,
  ): Promise<PublicationOperationIntent | undefined> {
    try {
      const result = await this.journal.transition(
        current.scope,
        current.operationId,
        current.etag,
        state,
        reasonCode,
      );
      return result.status === "UPDATED" ? result.entry : undefined;
    } catch {
      return undefined;
    }
  }

  private async markControlRecovery(
    scope: FacilityScope,
    current: PublicationControl,
    operationId: string,
    startedAt: string,
    reasonCode: string,
  ): Promise<boolean> {
    try {
      const result = await this.store.compareAndSwapControl(scope, current.etag, {
        scope,
        phase: "RECOVERY_REQUIRED",
        revision: current.revision,
        operationId,
        startedAt,
        failureReason: reasonCode,
      });
      return (
        result.status === "UPDATED" &&
        isValidControl(result.control, scope) &&
        result.control.phase === "RECOVERY_REQUIRED" &&
        result.control.operationId === operationId &&
        result.control.etag !== current.etag
      );
    } catch {
      return false;
    }
  }

  public async recover(
    input: Readonly<{
      scope: FacilityScope;
      operationId: string;
      expectedEtag: string;
      evidence: RecoveryEvidence;
    }>,
  ): Promise<RecoveryResult> {
    if (
      !isFacilityScope(input.scope) ||
      !isNonEmptyString(input.operationId) ||
      !isNonEmptyString(input.expectedEtag) ||
      !input.evidence ||
      typeof input.evidence !== "object"
    ) {
      return { status: "BLOCKED", reasonCode: "INVALID_RECOVERY_INPUT" };
    }
    let operationIntent: PublicationOperationIntent | undefined;
    try {
      operationIntent = await this.journal.read(input.scope, input.operationId);
    } catch {
      return { status: "BLOCKED", reasonCode: "RECOVERY_JOURNAL_READ_FAILED" };
    }
    if (
      !operationIntent ||
      (operationIntent.state !== "RECOVERY_REQUIRED" && operationIntent.state !== "COMMITTED")
    ) {
      return { status: "BLOCKED", reasonCode: "RECOVERY_INTENT_UNAVAILABLE" };
    }
    let current: PublicationControl | undefined;
    try {
      current = await this.store.readControl(input.scope);
    } catch {
      return { status: "BLOCKED", reasonCode: "RECOVERY_CONTROL_READ_FAILED" };
    }
    if (
      !current ||
      !isValidControl(current, input.scope) ||
      (current.phase !== "RECOVERY_REQUIRED" &&
        !(current.phase === "UPDATING" && operationIntent.state === "COMMITTED")) ||
      current.operationId !== input.operationId ||
      current.etag !== input.expectedEtag ||
      ![
        operationIntent.expectedControlRevision,
        operationIntent.expectedControlRevision + 1,
      ].includes(current.revision)
    ) {
      return { status: "CONFLICT", reasonCode: "RECOVERY_CONTROL_MISMATCH" };
    }
    if (input.evidence.priorWriterStopped !== true) {
      return { status: "BLOCKED", reasonCode: "PRIOR_WRITER_NOT_CONFIRMED_STOPPED" };
    }
    if (input.evidence.pendingRequestsSettled !== true) {
      return { status: "BLOCKED", reasonCode: "PENDING_REQUESTS_NOT_SETTLED" };
    }
    let snapshot: PublicationReadRowsResult;
    try {
      snapshot = await this.store.readRows(input.scope);
    } catch {
      return { status: "BLOCKED", reasonCode: "RECOVERY_SNAPSHOT_READ_FAILED" };
    }
    const snapshotError = validateJournalSnapshot(
      snapshot,
      input.scope,
      operationIntent.expectedRows,
    );
    if (snapshotError) return { status: "BLOCKED", reasonCode: snapshotError };

    let afterSnapshot: PublicationControl | undefined;
    try {
      afterSnapshot = await this.store.readControl(input.scope);
    } catch {
      return { status: "BLOCKED", reasonCode: "RECOVERY_CONTROL_RECHECK_FAILED" };
    }
    if (
      !afterSnapshot ||
      !isValidControl(afterSnapshot, input.scope) ||
      afterSnapshot.phase !== current.phase ||
      afterSnapshot.operationId !== input.operationId ||
      afterSnapshot.etag !== current.etag ||
      afterSnapshot.revision !== current.revision
    ) {
      return { status: "BLOCKED", reasonCode: "RECOVERY_CONTROL_CHANGED" };
    }

    if (operationIntent.state === "RECOVERY_REQUIRED") {
      const committed = await this.transitionJournal(operationIntent, "COMMITTED");
      if (!committed) {
        return { status: "BLOCKED", reasonCode: "RECOVERY_JOURNAL_COMMIT_OUTCOME_UNKNOWN" };
      }
    }

    let recovered: Awaited<ReturnType<SupportPlanPublicationStore["compareAndSwapControl"]>>;
    try {
      recovered = await this.store.compareAndSwapControl(input.scope, afterSnapshot.etag, {
        scope: input.scope,
        phase: "STABLE",
        revision: afterSnapshot.revision + 1,
        operationId: input.operationId,
        startedAt: afterSnapshot.startedAt,
      });
    } catch {
      return { status: "BLOCKED", reasonCode: "RECOVERY_OUTCOME_UNKNOWN" };
    }
    if (recovered.status !== "UPDATED") {
      return { status: "CONFLICT", reasonCode: "RECOVERY_CAS_CONFLICT" };
    }
    if (
      !isValidControl(recovered.control, input.scope) ||
      recovered.control.phase !== "STABLE" ||
      recovered.control.revision !== afterSnapshot.revision + 1 ||
      recovered.control.operationId !== input.operationId ||
      recovered.control.etag === afterSnapshot.etag
    ) {
      return { status: "BLOCKED", reasonCode: "RECOVERY_CONTROL_INVALID" };
    }
    return { status: "RECOVERED", revision: recovered.control.revision };
  }
}

function validatePublicationSnapshot(
  snapshot: PublicationReadRowsResult,
  scope: FacilityScope,
  intendedRows: readonly SupportPlanPublicationRow[],
): string | undefined {
  if (snapshot.status !== "SUCCESS") return "SNAPSHOT_READ_FAILED";
  if (!snapshot.complete || !Array.isArray(snapshot.rows)) return "SNAPSHOT_INCOMPLETE";
  if (hasAmbiguousOrMalformedRows(snapshot.rows)) return "AMBIGUOUS_OR_MALFORMED_SNAPSHOT";
  if (
    snapshot.rows.some(
      (row) =>
        row.scope.organizationId !== scope.organizationId || row.scope.siteId !== scope.siteId,
    )
  ) {
    return "SNAPSHOT_SCOPE_MISMATCH";
  }

  for (const expected of intendedRows) {
    const matches = snapshot.rows.filter((row) => row.rowKey === expected.rowKey);
    if (matches.length !== 1) return "RECOVERY_SNAPSHOT_MISMATCH";
    const actual = matches[0];
    if (
      actual.rowKind !== expected.rowKind ||
      actual.canonicalKey !== expected.canonicalKey ||
      !jsonValuesEqual(actual.payload, expected.payload)
    ) {
      return "RECOVERY_SNAPSHOT_MISMATCH";
    }
  }
  return undefined;
}

function validateJournalSnapshot(
  snapshot: PublicationReadRowsResult,
  scope: FacilityScope,
  expectedRows: readonly PublicationJournalRowIntent[],
): string | undefined {
  if (snapshot.status !== "SUCCESS") return "SNAPSHOT_READ_FAILED";
  if (!snapshot.complete || !Array.isArray(snapshot.rows)) return "SNAPSHOT_INCOMPLETE";
  if (hasAmbiguousOrMalformedRows(snapshot.rows)) return "AMBIGUOUS_OR_MALFORMED_SNAPSHOT";
  if (
    snapshot.rows.some(
      (row) =>
        row.scope.organizationId !== scope.organizationId || row.scope.siteId !== scope.siteId,
    )
  ) {
    return "SNAPSHOT_SCOPE_MISMATCH";
  }

  for (const expected of expectedRows) {
    const matches = snapshot.rows.filter((row) => row.rowKey === expected.rowKey);
    if (matches.length !== 1) return "RECOVERY_SNAPSHOT_MISMATCH";
    const actual = matches[0];
    let actualDigest: string;
    try {
      actualDigest = digestJsonValue(actual.payload);
    } catch {
      return "RECOVERY_SNAPSHOT_MISMATCH";
    }
    if (
      actual.rowKind !== expected.rowKind ||
      actual.canonicalKey !== expected.canonicalKey ||
      actual.scope.organizationId !== expected.scope.organizationId ||
      actual.scope.siteId !== expected.scope.siteId ||
      actualDigest !== expected.payloadDigest
    ) {
      return "RECOVERY_SNAPSHOT_MISMATCH";
    }
  }
  return undefined;
}

function digestJsonValue(value: unknown): string {
  return sha256Hex(canonicalJson(value));
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(",")}}`;
  }
  throw new TypeError("Publication payload must be JSON serializable");
}

function jsonValuesEqual(left: unknown, right: unknown): boolean {
  if (Object.is(left, right)) return true;
  if (!left || !right || typeof left !== "object" || typeof right !== "object") return false;
  if (Array.isArray(left) || Array.isArray(right)) {
    return (
      Array.isArray(left) &&
      Array.isArray(right) &&
      left.length === right.length &&
      left.every((value, index) => jsonValuesEqual(value, right[index]))
    );
  }
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key, index) =>
        key === rightKeys[index] &&
        jsonValuesEqual(
          (left as Record<string, unknown>)[key],
          (right as Record<string, unknown>)[key],
        ),
    )
  );
}

function isHeaderVersion(payload: unknown, version: number): boolean {
  return (
    payload !== null &&
    typeof payload === "object" &&
    "version" in payload &&
    typeof payload.version === "number" &&
    Number.isSafeInteger(payload.version) &&
    payload.version === version
  );
}

function headerCurrentVersion(payload: unknown): number | undefined {
  if (
    !payload ||
    typeof payload !== "object" ||
    !("currentVersion" in payload) ||
    typeof payload.currentVersion !== "number" ||
    !Number.isSafeInteger(payload.currentVersion) ||
    payload.currentVersion < 1
  ) {
    return undefined;
  }
  return payload.currentVersion;
}

function findPinnedVersionRow(
  header: SupportPlanPublicationRow,
  version: number,
  rows: readonly SupportPlanPublicationRow[],
  scope: FacilityScope,
): SupportPlanPublicationRow | undefined {
  if (
    header.rowKind !== "H" ||
    header.scope.organizationId !== scope.organizationId ||
    header.scope.siteId !== scope.siteId ||
    headerCurrentVersion(header.payload) !== version
  ) {
    return undefined;
  }
  let tuple: unknown;
  try {
    tuple = JSON.parse(header.canonicalKey);
  } catch {
    return undefined;
  }
  if (
    !Array.isArray(tuple) ||
    tuple.length !== 6 ||
    tuple.slice(2).some((part) => typeof part !== "string")
  ) {
    return undefined;
  }
  let identity: SupportPlanRowIdentity;
  try {
    identity = createVersionRowIdentity({
      organizationId: tuple[2] as string,
      siteId: tuple[3] as string,
      userId: tuple[4] as string,
      planId: tuple[5] as string,
      version,
    });
  } catch {
    return undefined;
  }
  const matches = rows.filter(
    (row) =>
      row.rowKind === "V" &&
      (row.rowKey === identity.rowKey || row.canonicalKey === identity.canonicalKey),
  );
  if (matches.length !== 1) return undefined;
  const pinned = matches[0];
  return pinned.rowKey === identity.rowKey &&
    pinned.canonicalKey === identity.canonicalKey &&
    pinned.scope.organizationId === scope.organizationId &&
    pinned.scope.siteId === scope.siteId &&
    isHeaderVersion(pinned.payload, version)
    ? pinned
    : undefined;
}

function hasValidHeaderVersionBindings(
  rows: readonly SupportPlanPublicationRow[],
  scope: FacilityScope,
): boolean {
  return rows
    .filter((row) => row.rowKind === "H")
    .every((header) => {
      const version = headerCurrentVersion(header.payload);
      return (
        version !== undefined && findPinnedVersionRow(header, version, rows, scope) !== undefined
      );
    });
}

export type SyntheticReaderResult<TValue> =
  | Readonly<{ status: "RESOLVED"; revision: number; value: TValue }>
  | Readonly<{ status: "UNRESOLVED"; reasonCode: string }>;

export type PublicationResolver<TValue> = (
  rows: readonly SupportPlanPublicationRow[],
) => Readonly<{ status: "RESOLVED"; value: TValue } | { status: "UNRESOLVED" }>;

export class SyntheticSupportPlanReader<TValue> {
  public constructor(
    private readonly store: SupportPlanPublicationStore,
    private readonly journal: PublicationOperationJournal,
    private readonly resolveRows: PublicationResolver<TValue>,
  ) {}

  public async read(scope: FacilityScope): Promise<SyntheticReaderResult<TValue>> {
    let before: PublicationControl | undefined;
    try {
      before = await this.store.readControl(scope);
    } catch {
      return { status: "UNRESOLVED", reasonCode: "CONTROL_READ_FAILED" };
    }
    if (!before) return { status: "UNRESOLVED", reasonCode: "CONTROL_NOT_FOUND" };
    if (!isValidControl(before, scope)) {
      return { status: "UNRESOLVED", reasonCode: "CONTROL_INVALID" };
    }
    if (before.phase !== "STABLE") {
      return {
        status: "UNRESOLVED",
        reasonCode: before.phase === "UPDATING" ? "PUBLICATION_IN_PROGRESS" : "RECOVERY_REQUIRED",
      };
    }
    if (!isNonEmptyString(before.operationId)) {
      return { status: "UNRESOLVED", reasonCode: "JOURNAL_OPERATION_UNVERIFIED" };
    }
    let committedIntent: PublicationOperationIntent | undefined;
    try {
      committedIntent = await this.journal.read(scope, before.operationId);
    } catch {
      return { status: "UNRESOLVED", reasonCode: "JOURNAL_READ_FAILED" };
    }
    if (
      !committedIntent ||
      committedIntent.state !== "COMMITTED" ||
      committedIntent.scope.organizationId !== scope.organizationId ||
      committedIntent.scope.siteId !== scope.siteId ||
      committedIntent.expectedControlRevision + 2 !== before.revision
    ) {
      return { status: "UNRESOLVED", reasonCode: "JOURNAL_NOT_COMMITTED" };
    }

    let snapshot: PublicationReadRowsResult;
    try {
      snapshot = await this.store.readRows(scope);
    } catch {
      return { status: "UNRESOLVED", reasonCode: "SNAPSHOT_READ_FAILED" };
    }
    if (snapshot.status !== "SUCCESS" || !snapshot.complete || !Array.isArray(snapshot.rows)) {
      return { status: "UNRESOLVED", reasonCode: "INCOMPLETE_SNAPSHOT" };
    }
    if (hasAmbiguousOrMalformedRows(snapshot.rows)) {
      return { status: "UNRESOLVED", reasonCode: "AMBIGUOUS_OR_MALFORMED_SNAPSHOT" };
    }
    if (
      snapshot.rows.some(
        (row) =>
          row.scope.organizationId !== scope.organizationId || row.scope.siteId !== scope.siteId,
      )
    ) {
      return { status: "UNRESOLVED", reasonCode: "SNAPSHOT_SCOPE_MISMATCH" };
    }
    if (validateJournalSnapshot(snapshot, scope, committedIntent.expectedRows)) {
      return { status: "UNRESOLVED", reasonCode: "JOURNAL_SNAPSHOT_MISMATCH" };
    }
    if (!hasValidHeaderVersionBindings(snapshot.rows, scope)) {
      return { status: "UNRESOLVED", reasonCode: "HEADER_VERSION_BINDING_UNVERIFIED" };
    }
    for (const row of snapshot.rows) {
      let committedRowIntent: PublicationJournalRowIntent | undefined;
      let payloadDigest: string;
      try {
        committedRowIntent = await this.journal.readLatestCommittedRowIntent(scope, row.rowKey);
        payloadDigest = digestJsonValue(row.payload);
      } catch {
        return { status: "UNRESOLVED", reasonCode: "JOURNAL_ROW_VERIFICATION_FAILED" };
      }
      if (
        !committedRowIntent ||
        committedRowIntent.rowKind !== row.rowKind ||
        committedRowIntent.rowKey !== row.rowKey ||
        committedRowIntent.canonicalKey !== row.canonicalKey ||
        committedRowIntent.scope.organizationId !== scope.organizationId ||
        committedRowIntent.scope.siteId !== scope.siteId ||
        committedRowIntent.payloadDigest !== payloadDigest
      ) {
        return { status: "UNRESOLVED", reasonCode: "JOURNAL_SNAPSHOT_MISMATCH" };
      }
    }

    let after: PublicationControl | undefined;
    try {
      after = await this.store.readControl(scope);
    } catch {
      return { status: "UNRESOLVED", reasonCode: "CONTROL_RECHECK_FAILED" };
    }
    if (
      !after ||
      !isValidControl(after, scope) ||
      after.phase !== "STABLE" ||
      after.revision !== before.revision ||
      after.etag !== before.etag
    ) {
      return { status: "UNRESOLVED", reasonCode: "CONTROL_CHANGED" };
    }

    let resolved: ReturnType<PublicationResolver<TValue>>;
    try {
      resolved = this.resolveRows(snapshot.rows);
    } catch {
      return { status: "UNRESOLVED", reasonCode: "PROCEDURE_RESOLUTION_FAILED" };
    }
    if (resolved.status !== "RESOLVED") {
      return { status: "UNRESOLVED", reasonCode: "PROCEDURE_NOT_RESOLVED" };
    }
    return { status: "RESOLVED", revision: after.revision, value: resolved.value };
  }
}

function hasAmbiguousOrMalformedRows(rows: readonly SupportPlanPublicationRow[]): boolean {
  const rowKeys = new Set<string>();
  const canonicalKeys = new Set<string>();
  for (const row of rows) {
    if (!isWellFormedRowIdentity(row)) return true;
    if (rowKeys.has(row.rowKey) || canonicalKeys.has(row.canonicalKey)) return true;
    rowKeys.add(row.rowKey);
    canonicalKeys.add(row.canonicalKey);
  }
  return false;
}

function isWellFormedRowIdentity(row: SupportPlanPublicationRow): boolean {
  if (!row || typeof row !== "object") return false;
  if (
    !row.scope ||
    typeof row.scope.organizationId !== "string" ||
    typeof row.scope.siteId !== "string" ||
    !row.scope.organizationId ||
    !row.scope.siteId ||
    typeof row.canonicalKey !== "string" ||
    typeof row.rowKey !== "string"
  ) {
    return false;
  }
  if (
    !["H", "V", "C"].includes(row.rowKind) ||
    !isCanonicalSupportPlanRowKey(row.rowKind, row.canonicalKey) ||
    row.rowKey !== `rk1:${row.rowKind.toLowerCase()}:${sha256Hex(row.canonicalKey)}`
  ) {
    return false;
  }
  let tuple: unknown;
  try {
    tuple = JSON.parse(row.canonicalKey);
  } catch {
    return false;
  }
  if (!Array.isArray(tuple) || tuple.some((part) => typeof part !== "string")) return false;
  if (tuple[0] !== "rk1" || tuple[1] !== row.rowKind) return false;
  if (tuple[2] !== row.scope.organizationId || tuple[3] !== row.scope.siteId) return false;
  if (row.rowKind === "H") return tuple.length === 6 && tuple.slice(2).every(isNonEmptyString);
  if (row.rowKind === "V") {
    return (
      tuple.length === 7 &&
      tuple.slice(2, 6).every(isNonEmptyString) &&
      /^[1-9][0-9]*$/.test(tuple[6]) &&
      Number.isSafeInteger(Number(tuple[6])) &&
      String(Number(tuple[6])) === tuple[6] &&
      isHeaderVersion(row.payload, Number(tuple[6]))
    );
  }
  return tuple.length === 4 && tuple.slice(2).every(isNonEmptyString);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isValidControl(control: PublicationControl, scope: FacilityScope): boolean {
  return (
    Boolean(control) &&
    isFacilityScope(control.scope) &&
    control.scope.organizationId === scope.organizationId &&
    control.scope.siteId === scope.siteId &&
    ["STABLE", "UPDATING", "RECOVERY_REQUIRED"].includes(control.phase) &&
    Number.isSafeInteger(control.revision) &&
    control.revision >= 0 &&
    typeof control.etag === "string" &&
    control.etag.length > 0 &&
    (control.phase === "STABLE" ||
      (isNonEmptyString(control.operationId) && isNonEmptyString(control.startedAt))) &&
    (control.phase !== "RECOVERY_REQUIRED" || isNonEmptyString(control.failureReason))
  );
}

function isFacilityScope(value: unknown): value is FacilityScope {
  if (!value || typeof value !== "object") return false;
  const scope = value as Record<string, unknown>;
  return [scope.organizationId, scope.siteId].every(
    (part) => typeof part === "string" && part.length > 0,
  );
}
