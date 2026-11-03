import type { SupportPlanRowIdentity } from "../domain/support-plan-row-key";
import { isCanonicalSupportPlanRowKey } from "../domain/support-plan-row-key";
import { cloneJsonValue, storeJsonSnapshot } from "../domain/json-snapshot";

export type SyntheticRowInsertResult =
  | Readonly<{ status: "CREATED" }>
  | Readonly<{ status: "CONFLICT" }>
  | Readonly<{ status: "COLLISION" }>
  | Readonly<{ status: "ERROR"; reasonCode: string }>;

export type SyntheticSupportPlanRow<TPayload = unknown> = Readonly<
  SupportPlanRowIdentity & { payload: TPayload }
>;

/**
 * In-memory unique RowKey simulation for synthetic tests only.
 * A matching RowKey never authorizes replacing its stored CanonicalKey or payload.
 */
export class SyntheticSupportPlanRowStore {
  private readonly rowsByRowKey = new Map<string, SyntheticSupportPlanRow>();

  public get size(): number {
    return this.rowsByRowKey.size;
  }

  public insert<TPayload>(
    identity: SupportPlanRowIdentity,
    payload: TPayload,
  ): SyntheticRowInsertResult {
    if (
      !identity.rowKey ||
      identity.rowKey.length > 255 ||
      !identity.canonicalKey ||
      !["H", "V", "C"].includes(identity.rowKind) ||
      !isCanonicalSupportPlanRowKey(identity.rowKind, identity.canonicalKey) ||
      !new RegExp(`^rk1:${identity.rowKind.toLowerCase()}:[\\da-f]{64}$`).test(identity.rowKey)
    ) {
      return { status: "ERROR", reasonCode: "INVALID_ROW_IDENTITY" };
    }

    const existing = this.rowsByRowKey.get(identity.rowKey);
    if (existing) {
      if (
        existing.canonicalKey !== identity.canonicalKey ||
        existing.rowKind !== identity.rowKind
      ) {
        return { status: "COLLISION" };
      }
      return { status: "CONFLICT" };
    }

    for (const row of this.rowsByRowKey.values()) {
      if (row.canonicalKey === identity.canonicalKey) return { status: "CONFLICT" };
    }

    this.rowsByRowKey.set(
      identity.rowKey,
      Object.freeze({ ...identity, payload: storeJsonSnapshot(payload) }),
    );
    return { status: "CREATED" };
  }

  public get(rowKey: string): SyntheticSupportPlanRow | undefined {
    const row = this.rowsByRowKey.get(rowKey);
    return row ? { ...row, payload: cloneJsonValue(row.payload) } : undefined;
  }

  public updateHeader<TPayload>(
    identity: SupportPlanRowIdentity,
    payload: TPayload,
    expectedVersion: number,
  ): SyntheticRowInsertResult {
    if (
      identity.rowKind !== "H" ||
      !isCanonicalSupportPlanRowKey(identity.rowKind, identity.canonicalKey) ||
      !new RegExp(`^rk1:h:[\\da-f]{64}$`).test(identity.rowKey) ||
      !Number.isSafeInteger(expectedVersion) ||
      expectedVersion < 1 ||
      !isHeaderVersion(payload, expectedVersion + 1)
    ) {
      return { status: "ERROR", reasonCode: "INVALID_HEADER_UPDATE" };
    }
    const existing = this.rowsByRowKey.get(identity.rowKey);
    if (!existing) return { status: "ERROR", reasonCode: "HEADER_NOT_FOUND" };
    if (
      existing.rowKind !== "H" ||
      existing.canonicalKey !== identity.canonicalKey ||
      !isHeaderVersion(existing.payload, expectedVersion)
    ) {
      return { status: "CONFLICT" };
    }

    this.rowsByRowKey.set(
      identity.rowKey,
      Object.freeze({ ...identity, payload: storeJsonSnapshot(payload) }),
    );
    return { status: "CREATED" };
  }
}

function isHeaderVersion(payload: unknown, expectedVersion: number): boolean {
  return (
    payload !== null &&
    typeof payload === "object" &&
    "version" in payload &&
    typeof payload.version === "number" &&
    Number.isSafeInteger(payload.version) &&
    payload.version === expectedVersion
  );
}
