/**
 * Durable consume registry for B2 Human GO receipt anti-replay.
 * Ownership: harness authorization layer (not GATE-3 transport Set / not Slice C).
 */

export type TrustedReceiptRegistryEntry = Readonly<{
  handle: string;
  consumed: boolean;
  consumedAtIso?: string;
}>;

export type TrustedReceiptConsumeStore = {
  get(handle: string): TrustedReceiptRegistryEntry | undefined;
  set(handle: string, entry: TrustedReceiptRegistryEntry): void;
};

const MEMORY = new Map<string, TrustedReceiptRegistryEntry>();

export function createInMemoryTrustedReceiptConsumeStore(
  seed?: readonly TrustedReceiptRegistryEntry[],
): TrustedReceiptConsumeStore {
  const map = new Map<string, TrustedReceiptRegistryEntry>(
    (seed ?? []).map((entry) => [entry.handle, entry]),
  );
  return {
    get(handle) {
      return map.get(handle);
    },
    set(handle, entry) {
      map.set(handle, entry);
    },
  };
}

/** Process-local default used when no store is injected (tests should inject). */
export function getDefaultProcessTrustedReceiptConsumeStore(): TrustedReceiptConsumeStore {
  return {
    get(handle) {
      return MEMORY.get(handle);
    },
    set(handle, entry) {
      MEMORY.set(handle, entry);
    },
  };
}

const LOCAL_STORAGE_KEY = "b2-lifecycle-test-only-receipt-consume-v1";

export function createLocalStorageTrustedReceiptConsumeStore(
  storage: Pick<Storage, "getItem" | "setItem">,
): TrustedReceiptConsumeStore {
  const readAll = (): Record<string, TrustedReceiptRegistryEntry> => {
    try {
      const raw = storage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) {
        return {};
      }
      const parsed = JSON.parse(raw) as unknown;
      if (typeof parsed !== "object" || parsed === null) {
        return {};
      }
      const result: Record<string, TrustedReceiptRegistryEntry> = {};
      const object = parsed as Record<string, unknown>;
      for (const handle of Object.keys(object)) {
        const value = object[handle];
        if (
          typeof value === "object" &&
          value !== null &&
          (value as { handle?: unknown }).handle === handle &&
          typeof (value as { consumed?: unknown }).consumed === "boolean"
        ) {
          result[handle] = value as TrustedReceiptRegistryEntry;
        }
      }
      return result;
    } catch {
      return {};
    }
  };

  const writeAll = (all: Record<string, TrustedReceiptRegistryEntry>): void => {
    storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
  };

  return {
    get(handle) {
      return readAll()[handle];
    },
    set(handle, entry) {
      const all = readAll();
      all[handle] = entry;
      writeAll(all);
    },
  };
}

export function resetProcessTrustedReceiptConsumeStoreForTests(): void {
  MEMORY.clear();
}
