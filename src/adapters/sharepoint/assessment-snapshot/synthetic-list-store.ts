/**
 * In-memory AssessmentSnapshots store.
 * Synthetic / fake only — no Microsoft 365 or real tenant I/O.
 */

import type { AssessmentSnapshotPhysicalRow } from "./physical-columns";

export type SyntheticListStoreMode = "ok" | "forbidden" | "transport_error";

export type SyntheticInsertResult =
  | Readonly<{ kind: "inserted"; listItemId: number }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "transport_error" }>;

export type SyntheticUpdateResult =
  | Readonly<{ kind: "updated"; listItemId: number }>
  | Readonly<{ kind: "not_found" }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "transport_error" }>;

export type SyntheticQueryResult =
  | Readonly<{ kind: "row"; row: AssessmentSnapshotPhysicalRow }>
  | Readonly<{ kind: "not_found" }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "transport_error" }>;

export class SyntheticAssessmentSnapshotListStore {
  private nextListItemId = 1;
  private readonly rows = new Map<string, AssessmentSnapshotPhysicalRow>();
  private mode: SyntheticListStoreMode = "ok";

  setMode(mode: SyntheticListStoreMode): void {
    this.mode = mode;
  }

  getMode(): SyntheticListStoreMode {
    return this.mode;
  }

  insert(row: Omit<AssessmentSnapshotPhysicalRow, "ListItemId">): SyntheticInsertResult {
    if (this.mode === "forbidden") {
      return { kind: "forbidden" };
    }
    if (this.mode === "transport_error") {
      return { kind: "transport_error" };
    }

    const listItemId = this.nextListItemId;
    this.nextListItemId += 1;
    const stored: AssessmentSnapshotPhysicalRow = { ...row, ListItemId: listItemId };
    this.rows.set(row.snapshotId, stored);
    return { kind: "inserted", listItemId };
  }

  update(
    snapshotId: string,
    row: Omit<AssessmentSnapshotPhysicalRow, "ListItemId">,
  ): SyntheticUpdateResult {
    if (this.mode === "forbidden") {
      return { kind: "forbidden" };
    }
    if (this.mode === "transport_error") {
      return { kind: "transport_error" };
    }

    const existing = this.rows.get(snapshotId);
    if (existing === undefined || existing.ListItemId === undefined) {
      return { kind: "not_found" };
    }

    const listItemId = existing.ListItemId;
    const next: AssessmentSnapshotPhysicalRow = { ...row, ListItemId: listItemId };

    // CO-1-A update omit: if incoming row omits supersedes key, preserve prior value.
    if (!Object.prototype.hasOwnProperty.call(row, "supersedesSnapshotId")) {
      if (Object.prototype.hasOwnProperty.call(existing, "supersedesSnapshotId")) {
        (next as { supersedesSnapshotId?: string | null }).supersedesSnapshotId =
          existing.supersedesSnapshotId;
      }
    } else if (row.supersedesSnapshotId === null) {
      // explicit clear — store as absent for read→undefined
      delete (next as { supersedesSnapshotId?: string | null }).supersedesSnapshotId;
    }

    this.rows.set(snapshotId, next);
    return { kind: "updated", listItemId };
  }

  findBySnapshotId(snapshotId: string): SyntheticQueryResult {
    if (this.mode === "forbidden") {
      return { kind: "forbidden" };
    }
    if (this.mode === "transport_error") {
      return { kind: "transport_error" };
    }
    const row = this.rows.get(snapshotId);
    if (row === undefined) {
      return { kind: "not_found" };
    }
    return { kind: "row", row: { ...row } };
  }

  /** Test inspection only. */
  snapshotRows(): readonly AssessmentSnapshotPhysicalRow[] {
    return [...this.rows.values()].map((row) => ({ ...row }));
  }
}
