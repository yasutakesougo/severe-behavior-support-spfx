/** Copies JSON-shaped values without retaining caller-owned references. */
export function cloneJsonValue<T>(value: T): T {
  const ancestors = new WeakSet<object>();

  const clone = (current: unknown): unknown => {
    if (
      current === null ||
      current === undefined ||
      typeof current === "string" ||
      typeof current === "number" ||
      typeof current === "boolean"
    ) {
      return current;
    }
    if (typeof current !== "object") {
      throw new TypeError("Snapshots must contain JSON-shaped values");
    }
    if (ancestors.has(current)) throw new TypeError("Snapshots must not contain cycles");

    ancestors.add(current);
    try {
      if (Array.isArray(current)) {
        const result: unknown[] = [];
        for (let index = 0; index < current.length; index += 1) {
          if (!Object.prototype.hasOwnProperty.call(current, index)) {
            throw new TypeError("Snapshots must not contain sparse arrays");
          }
          result.push(clone(current[index]));
        }
        if (Reflect.ownKeys(current).some((key) => key !== "length" && !isArrayIndex(key))) {
          throw new TypeError("Snapshots must not contain array properties");
        }
        return result;
      }

      const prototype = Object.getPrototypeOf(current);
      if (prototype !== Object.prototype && prototype !== null) {
        throw new TypeError("Snapshots must contain plain objects");
      }
      if (Reflect.ownKeys(current).some((key) => typeof key !== "string")) {
        throw new TypeError("Snapshots must not contain symbol keys");
      }

      const result = Object.create(prototype) as Record<string, unknown>;
      for (const key of Object.keys(current)) {
        const descriptor = Object.getOwnPropertyDescriptor(current, key);
        if (!descriptor || !("value" in descriptor) || !descriptor.enumerable) {
          throw new TypeError("Snapshots must contain enumerable data properties");
        }
        Object.defineProperty(result, key, {
          value: clone(descriptor.value),
          enumerable: true,
          configurable: true,
          writable: true,
        });
      }
      return result;
    } finally {
      ancestors.delete(current);
    }
  };

  return clone(value) as T;
}

export function freezeJsonValue<T>(value: T): T {
  const visited = new WeakSet<object>();

  const freeze = (current: unknown): void => {
    if (!current || typeof current !== "object" || visited.has(current)) return;
    visited.add(current);
    for (const key of Reflect.ownKeys(current)) freeze(Reflect.get(current, key));
    Object.freeze(current);
  };

  freeze(value);
  return value;
}

export function storeJsonSnapshot<T>(value: T): T {
  return freezeJsonValue(cloneJsonValue(value));
}

function isArrayIndex(key: string | symbol): boolean {
  if (typeof key !== "string" || !/^(0|[1-9][0-9]*)$/.test(key)) return false;
  const index = Number(key);
  return Number.isSafeInteger(index) && index >= 0 && String(index) === key;
}
