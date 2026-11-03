import type { SupportPlanRowIdentity } from "./support-plan-row-key";
import { isCanonicalSupportPlanRowKey } from "./support-plan-row-key";
import { sha256Hex } from "./sha256";
import { storeJsonSnapshot } from "./json-snapshot";

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
  ensureControl(scope: FacilityScope): Promise<PublicationControl>;
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
  private readonly expectedRowsByOperation = new Map<
    string,
    readonly SupportPlanPublicationRow[]
  >();

  public constructor(private readonly store: SupportPlanPublicationStore) {}

  public async publish(
    input: Readonly<{
      scope: FacilityScope;
      operationId: string;
      startedAt: string;
      rows: readonly SupportPlanPublicationRow[];
    }>,
  ): Promise<PublishResult> {
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
      return undefined;
    };

    return this.publishWithIntent(
      input,
      input.rows,
      (rows) => this.store.writeRows(input.scope, input.operationId, rows),
      precondition,
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
    );
  }

  private async publishWithIntent(
    input: Readonly<{ scope: FacilityScope; operationId: string; startedAt: string }>,
    intendedRows: readonly SupportPlanPublicationRow[],
    writeRows: (rows: readonly SupportPlanPublicationRow[]) => Promise<PublicationWriteResult>,
    precondition?: () => Promise<PublishResult | undefined>,
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

    let current: PublicationControl;
    try {
      current = await this.store.ensureControl(input.scope);
    } catch {
      return { status: "CONFLICT", reasonCode: "CONTROL_READ_OR_INITIALIZE_FAILED" };
    }
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
    if (current.operationId === input.operationId) {
      return { status: "CONFLICT", reasonCode: "OPERATION_ID_ALREADY_PUBLISHED" };
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
    try {
      expectedRows = storeJsonSnapshot(intendedRows);
    } catch {
      return { status: "CONFLICT", reasonCode: "INVALID_PUBLICATION_PAYLOAD" };
    }
    this.usedOperationKeys.add(operationKey);
    this.expectedRowsByOperation.set(operationKey, expectedRows);

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
      return { status: "RECOVERY_REQUIRED", reasonCode: "UPDATING_CAS_OUTCOME_UNKNOWN" };
    }
    if (updating.status !== "UPDATED") {
      this.usedOperationKeys.delete(operationKey);
      this.expectedRowsByOperation.delete(operationKey);
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
    if (snapshotError) {
      await markRecoveryRequired(snapshotError);
      return { status: "RECOVERY_REQUIRED", reasonCode: snapshotError };
    }

    let afterWrite: PublicationControl | undefined;
    try {
      afterWrite = await this.store.readControl(input.scope);
    } catch {
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
      return { status: "RECOVERY_REQUIRED", reasonCode: "PUBLICATION_OWNERSHIP_LOST" };
    }

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
      return { status: "RECOVERY_REQUIRED", reasonCode: "STABLE_PUBLISH_OUTCOME_UNKNOWN" };
    }
    if (published.status !== "UPDATED") {
      return { status: "RECOVERY_REQUIRED", reasonCode: "PUBLISH_CAS_CONFLICT" };
    }
    if (
      !isValidControl(published.control, input.scope) ||
      published.control.phase !== "STABLE" ||
      published.control.revision !== afterWrite.revision + 1 ||
      published.control.operationId !== input.operationId ||
      published.control.etag === afterWrite.etag
    ) {
      return { status: "RECOVERY_REQUIRED", reasonCode: "STABLE_CONTROL_INVALID" };
    }

    return { status: "PUBLISHED", revision: published.control.revision };
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
    const operationKey = JSON.stringify([
      input.scope.organizationId,
      input.scope.siteId,
      input.operationId,
    ]);
    const expectedRows = this.expectedRowsByOperation.get(operationKey);
    if (!expectedRows) return { status: "BLOCKED", reasonCode: "RECOVERY_INTENT_UNAVAILABLE" };
    let current: PublicationControl | undefined;
    try {
      current = await this.store.readControl(input.scope);
    } catch {
      return { status: "BLOCKED", reasonCode: "RECOVERY_CONTROL_READ_FAILED" };
    }
    if (
      !current ||
      !isValidControl(current, input.scope) ||
      current.phase !== "RECOVERY_REQUIRED" ||
      current.operationId !== input.operationId ||
      current.etag !== input.expectedEtag
    ) {
      return { status: "CONFLICT", reasonCode: "RECOVERY_CONTROL_MISMATCH" };
    }
    if (!input.evidence.priorWriterStopped) {
      return { status: "BLOCKED", reasonCode: "PRIOR_WRITER_NOT_CONFIRMED_STOPPED" };
    }
    if (!input.evidence.pendingRequestsSettled) {
      return { status: "BLOCKED", reasonCode: "PENDING_REQUESTS_NOT_SETTLED" };
    }
    let snapshot: PublicationReadRowsResult;
    try {
      snapshot = await this.store.readRows(input.scope);
    } catch {
      return { status: "BLOCKED", reasonCode: "RECOVERY_SNAPSHOT_READ_FAILED" };
    }
    const snapshotError = validatePublicationSnapshot(snapshot, input.scope, expectedRows);
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
      afterSnapshot.phase !== "RECOVERY_REQUIRED" ||
      afterSnapshot.operationId !== input.operationId ||
      afterSnapshot.etag !== current.etag ||
      afterSnapshot.revision !== current.revision
    ) {
      return { status: "BLOCKED", reasonCode: "RECOVERY_CONTROL_CHANGED" };
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

export type SyntheticReaderResult<TValue> =
  | Readonly<{ status: "RESOLVED"; revision: number; value: TValue }>
  | Readonly<{ status: "UNRESOLVED"; reasonCode: string }>;

export type PublicationResolver<TValue> = (
  rows: readonly SupportPlanPublicationRow[],
) => Readonly<{ status: "RESOLVED"; value: TValue } | { status: "UNRESOLVED" }>;

export class SyntheticSupportPlanReader<TValue> {
  public constructor(
    private readonly store: SupportPlanPublicationStore,
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
