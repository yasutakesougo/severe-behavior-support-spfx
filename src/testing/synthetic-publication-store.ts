import { createControlRowIdentity } from "../domain/support-plan-row-key";
import { cloneJsonValue, storeJsonSnapshot } from "../domain/json-snapshot";
import type {
  FacilityScope,
  PublicationControl,
  PublicationPhase,
  PublicationReadRowsResult,
  PublicationWriteResult,
  SupportPlanPublicationRow,
  SupportPlanPublicationStore,
} from "../domain/support-plan-publication";
import { SyntheticSupportPlanRowStore } from "./synthetic-support-plan-row-store";

type WriteFailureMode = "FAILED" | "UNKNOWN";

type WriteFailure = Readonly<{
  writeNumber: number;
  mode: WriteFailureMode;
}>;

type BeforeWrite = (
  scope: FacilityScope,
  operationId: string,
  rows: readonly SupportPlanPublicationRow[],
) => void | Promise<void>;

export class SyntheticSupportPlanPublicationStore implements SupportPlanPublicationStore {
  private readonly controls = new Map<string, PublicationControl>();
  private readonly histories = new Map<string, PublicationControl[]>();
  private readonly etagSequences = new Map<string, number>();
  private readonly rowsByFacility = new Map<string, SupportPlanPublicationRow[]>();
  private readonly rowStore = new SyntheticSupportPlanRowStore();
  private readonly snapshotCompleteByFacility = new Map<string, boolean>();
  private writeFailure?: WriteFailure;
  private beforeWrite?: BeforeWrite;
  private afterRowsRead?: () => void;

  public readonly writeAttempts: string[] = [];

  public async ensureControl(scope: FacilityScope): Promise<PublicationControl> {
    const key = facilityKey(scope);
    const current = this.controls.get(key);
    if (current) return current;

    const initial: PublicationControl = Object.freeze({
      scope: freezeScope(scope),
      phase: "STABLE",
      revision: 0,
      etag: "etag-0",
    });
    this.controls.set(key, initial);
    this.histories.set(key, [initial]);
    this.etagSequences.set(key, 0);
    this.snapshotCompleteByFacility.set(key, true);
    return initial;
  }

  public async readControl(scope: FacilityScope): Promise<PublicationControl | undefined> {
    const control = this.controls.get(facilityKey(scope));
    return control ? snapshotControl(control) : undefined;
  }

  public async compareAndSwapControl(
    scope: FacilityScope,
    expectedEtag: string,
    next: Omit<PublicationControl, "etag">,
  ): Promise<
    Readonly<{ status: "UPDATED"; control: PublicationControl } | { status: "CONFLICT" }>
  > {
    const key = facilityKey(scope);
    const current = this.controls.get(key);
    if (!current || current.etag !== expectedEtag) return { status: "CONFLICT" };
    if (!sameScope(next.scope, scope)) return { status: "CONFLICT" };

    const sequence = (this.etagSequences.get(key) ?? 0) + 1;
    const updated: PublicationControl = Object.freeze({
      ...next,
      scope: freezeScope(scope),
      etag: "etag-" + sequence,
    });
    this.etagSequences.set(key, sequence);
    this.controls.set(key, updated);
    this.histories.get(key)?.push(updated);
    return { status: "UPDATED", control: updated };
  }

  public async writeRows(
    scope: FacilityScope,
    operationId: string,
    rows: readonly SupportPlanPublicationRow[],
  ): Promise<PublicationWriteResult> {
    this.writeAttempts.push(operationId);
    await this.beforeWrite?.(scope, operationId, rows);

    const key = facilityKey(scope);
    const facilityRows = this.rowsByFacility.get(key) ?? [];
    const failAt = this.writeFailure;

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      if (!sameScope(row.scope, scope)) {
        this.snapshotCompleteByFacility.set(key, false);
        return { status: "FAILED", reasonCode: "PUBLICATION_SCOPE_MISMATCH", persistedRows: index };
      }

      const failureAtThisWrite = failAt?.writeNumber === index + 1 ? failAt : undefined;
      if (failureAtThisWrite?.mode === "FAILED") {
        this.writeFailure = undefined;
        this.rowsByFacility.set(key, facilityRows);
        this.snapshotCompleteByFacility.set(key, false);
        return { status: "FAILED", reasonCode: "SYNTHETIC_WRITE_FAILURE", persistedRows: index };
      }

      const stored = this.rowStore.insert(row, row.payload);
      if (stored.status !== "CREATED") {
        this.rowsByFacility.set(key, facilityRows);
        this.snapshotCompleteByFacility.set(key, false);
        return {
          status: "FAILED",
          reasonCode: stored.status === "COLLISION" ? "ROWKEY_COLLISION" : "ROW_ALREADY_EXISTS",
          persistedRows: index,
        };
      }

      facilityRows.push(storeJsonSnapshot(row));
      if (failureAtThisWrite?.mode === "UNKNOWN") {
        this.writeFailure = undefined;
        this.rowsByFacility.set(key, facilityRows);
        this.snapshotCompleteByFacility.set(key, false);
        return { status: "UNKNOWN", reasonCode: "WRITE_RESULT_UNKNOWN" };
      }
    }

    this.writeFailure = undefined;
    this.rowsByFacility.set(key, facilityRows);
    this.snapshotCompleteByFacility.set(key, true);
    return { status: "WRITTEN" };
  }

  public async updateHeader(
    scope: FacilityScope,
    operationId: string,
    row: SupportPlanPublicationRow,
    expectedVersion: number,
  ): Promise<PublicationWriteResult> {
    this.writeAttempts.push(operationId);
    await this.beforeWrite?.(scope, operationId, [row]);

    const key = facilityKey(scope);
    const facilityRows = this.rowsByFacility.get(key) ?? [];
    const failure = this.writeFailure?.writeNumber === 1 ? this.writeFailure : undefined;
    if (failure?.mode === "FAILED") {
      this.writeFailure = undefined;
      this.snapshotCompleteByFacility.set(key, false);
      return { status: "FAILED", reasonCode: "SYNTHETIC_WRITE_FAILURE", persistedRows: 0 };
    }
    if (row.rowKind !== "H" || !sameScope(row.scope, scope)) {
      this.snapshotCompleteByFacility.set(key, false);
      return { status: "FAILED", reasonCode: "HEADER_SCOPE_OR_KIND_INVALID", persistedRows: 0 };
    }

    const index = facilityRows.findIndex(
      (candidate) => candidate.rowKind === "H" && candidate.rowKey === row.rowKey,
    );
    if (index < 0) {
      this.snapshotCompleteByFacility.set(key, false);
      return { status: "FAILED", reasonCode: "HEADER_NOT_FOUND", persistedRows: 0 };
    }

    const updated = this.rowStore.updateHeader(row, row.payload, expectedVersion);
    if (updated.status !== "CREATED") {
      this.snapshotCompleteByFacility.set(key, false);
      return {
        status: "FAILED",
        reasonCode:
          updated.status === "CONFLICT" ? "HEADER_VERSION_MISMATCH" : "HEADER_UPDATE_INVALID",
        persistedRows: 0,
      };
    }

    facilityRows[index] = storeJsonSnapshot(row);
    this.rowsByFacility.set(key, facilityRows);
    if (failure?.mode === "UNKNOWN") {
      this.writeFailure = undefined;
      this.snapshotCompleteByFacility.set(key, false);
      return { status: "UNKNOWN", reasonCode: "WRITE_RESULT_UNKNOWN" };
    }

    this.writeFailure = undefined;
    this.snapshotCompleteByFacility.set(key, true);
    return { status: "WRITTEN" };
  }

  public async readRows(scope: FacilityScope): Promise<PublicationReadRowsResult> {
    const key = facilityKey(scope);
    const result: PublicationReadRowsResult = {
      status: "SUCCESS",
      rows: cloneJsonValue(this.rowsByFacility.get(key) ?? []),
      complete: this.snapshotCompleteByFacility.get(key) ?? false,
    };
    const hook = this.afterRowsRead;
    this.afterRowsRead = undefined;
    hook?.();
    return result;
  }

  public setBeforeWrite(hook: BeforeWrite | undefined): void {
    this.beforeWrite = hook;
  }

  public failWriteAt(writeNumber: number, mode: WriteFailureMode): void {
    this.writeFailure = { writeNumber, mode };
  }

  public setSnapshotComplete(scope: FacilityScope, complete: boolean): void {
    this.snapshotCompleteByFacility.set(facilityKey(scope), complete);
  }

  /** Injects a malformed read snapshot for fail-closed Reader tests only. */
  public setRowsForTest(scope: FacilityScope, rows: readonly SupportPlanPublicationRow[]): void {
    this.rowsByFacility.set(facilityKey(scope), storeJsonSnapshot([...rows]));
  }

  public changeControlAfterNextRowsRead(scope: FacilityScope, phase: PublicationPhase): void {
    this.afterRowsRead = () => {
      const key = facilityKey(scope);
      const current = this.controls.get(key);
      if (!current) return;
      const sequence = (this.etagSequences.get(key) ?? 0) + 1;
      const changed: PublicationControl = Object.freeze({
        scope: freezeScope(scope),
        phase,
        revision: current.revision + 1,
        operationId: "synthetic-external-writer",
        startedAt: "2026-11-02T00:00:00.000Z",
        etag: "etag-" + sequence,
      });
      this.etagSequences.set(key, sequence);
      this.controls.set(key, changed);
      this.histories.get(key)?.push(changed);
    };
  }

  public controlHistory(scope: FacilityScope): readonly PublicationControl[] {
    return [...(this.histories.get(facilityKey(scope)) ?? [])];
  }
}

function facilityKey(scope: FacilityScope): string {
  return createControlRowIdentity(scope).canonicalKey;
}

function sameScope(left: FacilityScope, right: FacilityScope): boolean {
  return left.organizationId === right.organizationId && left.siteId === right.siteId;
}

function freezeScope(scope: FacilityScope): FacilityScope {
  return Object.freeze({ organizationId: scope.organizationId, siteId: scope.siteId });
}

function snapshotControl(control: PublicationControl): PublicationControl {
  return Object.freeze({ ...control, scope: freezeScope(control.scope) });
}
