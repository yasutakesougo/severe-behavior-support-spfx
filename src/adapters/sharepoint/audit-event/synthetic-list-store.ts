/**
 * In-memory SharePoint-shaped store for SBS_AUDIT_EVENTS.
 * Synthetic / fake only — no Microsoft 365 or real tenant I/O.
 */

import type { AuditEventPhysicalRow } from "./physical-columns";

export type SyntheticListStoreMode = "ok" | "forbidden" | "transport_error";

export type SyntheticInsertResult =
  | Readonly<{ kind: "inserted"; listItemId: number }>
  | Readonly<{ kind: "unique_collision" }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "transport_error" }>;

export type SyntheticQueryResult =
  | Readonly<{ kind: "rows"; rows: readonly AuditEventPhysicalRow[] }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "transport_error" }>;

export class SyntheticAuditEventListStore {
  private nextListItemId = 1;
  private readonly rows: AuditEventPhysicalRow[] = [];
  private mode: SyntheticListStoreMode = "ok";

  setMode(mode: SyntheticListStoreMode): void {
    this.mode = mode;
  }

  getMode(): SyntheticListStoreMode {
    return this.mode;
  }

  /** Test helper: bypass uniqueness (simulates multi-match / corruption scenarios). */
  forceInsert(row: AuditEventPhysicalRow): number {
    const listItemId = this.nextListItemId;
    this.nextListItemId += 1;
    this.rows.push({
      ...row,
      ListItemId: listItemId,
      ETag: `"synthetic-etag-${listItemId}"`,
      Created: "2026-08-08T00:00:00.000Z",
      Modified: "2026-08-08T00:00:00.000Z",
      Author: "synthetic-author",
      Title: undefined,
    });
    return listItemId;
  }

  insert(row: AuditEventPhysicalRow): SyntheticInsertResult {
    if (this.mode === "forbidden") {
      return { kind: "forbidden" };
    }
    if (this.mode === "transport_error") {
      return { kind: "transport_error" };
    }

    const collision = this.rows.some(
      (existing) =>
        existing.SbsAudRecordIdentityKey === row.SbsAudRecordIdentityKey ||
        existing.SbsAudIdempotencyIdentityKey === row.SbsAudIdempotencyIdentityKey,
    );
    if (collision) {
      return { kind: "unique_collision" };
    }

    const listItemId = this.forceInsert(row);
    return { kind: "inserted", listItemId };
  }

  findByRecordIdentityKey(key: string): SyntheticQueryResult {
    return this.queryBy((row) => row.SbsAudRecordIdentityKey === key);
  }

  findByIdempotencyIdentityKey(key: string): SyntheticQueryResult {
    return this.queryBy((row) => row.SbsAudIdempotencyIdentityKey === key);
  }

  /** Test inspection only. */
  snapshotRows(): readonly AuditEventPhysicalRow[] {
    return this.rows.map((row) => ({ ...row }));
  }

  private queryBy(predicate: (row: AuditEventPhysicalRow) => boolean): SyntheticQueryResult {
    if (this.mode === "forbidden") {
      return { kind: "forbidden" };
    }
    if (this.mode === "transport_error") {
      return { kind: "transport_error" };
    }
    return { kind: "rows", rows: this.rows.filter(predicate) };
  }
}
