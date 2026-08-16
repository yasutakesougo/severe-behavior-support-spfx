/**
 * In-memory ProcedureRecord List store.
 * Synthetic / fake only — no Microsoft 365 or real tenant I/O.
 */

import type { ProcedureRecordPhysicalRow } from "./physical-columns";

export type SyntheticListStoreMode = "ok" | "forbidden" | "transport_error";

export type SyntheticInsertResult =
  | Readonly<{ kind: "inserted"; listItemId: number }>
  | Readonly<{ kind: "unique_collision" }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "transport_error" }>;

export type SyntheticQueryResult =
  | Readonly<{ kind: "rows"; rows: readonly ProcedureRecordPhysicalRow[] }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "transport_error" }>;

export class SyntheticProcedureRecordListStore {
  private nextListItemId = 1;
  private readonly rows: ProcedureRecordPhysicalRow[] = [];
  private mode: SyntheticListStoreMode = "ok";

  setMode(mode: SyntheticListStoreMode): void {
    this.mode = mode;
  }

  getMode(): SyntheticListStoreMode {
    return this.mode;
  }

  /** Test helper: bypass uniqueness (simulates multi-match / corruption). */
  forceInsert(row: ProcedureRecordPhysicalRow): number {
    const listItemId = this.nextListItemId;
    this.nextListItemId += 1;
    this.rows.push({
      ...row,
      ListItemId: listItemId,
    });
    return listItemId;
  }

  insert(row: Omit<ProcedureRecordPhysicalRow, "ListItemId">): SyntheticInsertResult {
    if (this.mode === "forbidden") {
      return { kind: "forbidden" };
    }
    if (this.mode === "transport_error") {
      return { kind: "transport_error" };
    }

    const collision = this.rows.some(
      (existing) =>
        existing.prRecordId === row.prRecordId ||
        existing.prIdempotencyKey === row.prIdempotencyKey,
    );
    if (collision) {
      return { kind: "unique_collision" };
    }

    const listItemId = this.forceInsert(row);
    return { kind: "inserted", listItemId };
  }

  findByRecordId(recordId: string): SyntheticQueryResult {
    return this.queryBy((row) => row.prRecordId === recordId);
  }

  findByIdempotencyKey(idempotencyKey: string): SyntheticQueryResult {
    return this.queryBy((row) => row.prIdempotencyKey === idempotencyKey);
  }

  snapshotRows(): readonly ProcedureRecordPhysicalRow[] {
    return this.rows.map((row) => ({ ...row }));
  }

  private queryBy(predicate: (row: ProcedureRecordPhysicalRow) => boolean): SyntheticQueryResult {
    if (this.mode === "forbidden") {
      return { kind: "forbidden" };
    }
    if (this.mode === "transport_error") {
      return { kind: "transport_error" };
    }
    return { kind: "rows", rows: this.rows.filter(predicate) };
  }
}
