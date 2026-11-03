import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { sha256Hex } from "../../src/domain/sha256";
import {
  createControlRowIdentity,
  createHeaderRowIdentity,
  createVersionRowIdentity,
} from "../../src/domain/support-plan-row-key";
import { SyntheticSupportPlanRowStore } from "../../src/testing/synthetic-support-plan-row-store";

const scope = {
  organizationId: "org-a",
  siteId: "site-a",
  userId: "user-a",
};

describe("RISK-02 RowKey and synthetic immutable row storage", () => {
  it("TC-ROWKEY-01 uses the specified kind-prefixed canonical identity and SHA-256 vectors", () => {
    assert.deepEqual(createHeaderRowIdentity({ ...scope, planId: "plan-a" }), {
      rowKind: "H",
      rowKey: "rk1:h:c4a41ae30efdab0711775a504f129e0bb4e5fb70f5694caf017c5733fe012584",
      canonicalKey: '["rk1","H","org-a","site-a","user-a","plan-a"]',
    });
    assert.deepEqual(createVersionRowIdentity({ ...scope, planId: "plan-a", version: 2 }), {
      rowKind: "V",
      rowKey: "rk1:v:43f1ac351b3e99046e7a5bf874e8a0c6b8be3ba68829e7b57850239ef2562e10",
      canonicalKey: '["rk1","V","org-a","site-a","user-a","plan-a","2"]',
    });
    assert.deepEqual(createControlRowIdentity({ organizationId: "org-a", siteId: "site-a" }), {
      rowKind: "C",
      rowKey: "rk1:c:6dfbf99b860ad62719e582da592bb5f9fc1f897e2423d083add9341f4cef6f6d",
      canonicalKey: '["rk1","C","org-a","site-a"]',
    });
  });

  it("allows a header and multiple versions for the same scoped plan", () => {
    const store = new SyntheticSupportPlanRowStore();
    const header = createHeaderRowIdentity({ ...scope, planId: "plan-a" });
    const version1 = createVersionRowIdentity({ ...scope, planId: "plan-a", version: 1 });
    const version2 = createVersionRowIdentity({ ...scope, planId: "plan-a", version: 2 });

    assert.equal(store.insert(header, { label: "header" }).status, "CREATED");
    assert.equal(store.insert(version1, { version: 1 }).status, "CREATED");
    assert.equal(store.insert(version2, { version: 2 }).status, "CREATED");
    assert.equal(store.size, 3);
  });

  it("does not normalize delimiters or canonically equivalent Unicode", () => {
    const delimited = createHeaderRowIdentity({ ...scope, planId: "x|y::z" });
    const composed = createHeaderRowIdentity({ ...scope, planId: "é" });
    const decomposed = createHeaderRowIdentity({ ...scope, planId: "e\u0301" });

    assert.notEqual(
      delimited.canonicalKey,
      createHeaderRowIdentity({ ...scope, planId: "x" }).canonicalKey,
    );
    assert.notEqual(composed.canonicalKey, decomposed.canonicalKey);
    assert.notEqual(composed.rowKey, decomposed.rowKey);
  });

  it("rejects empty, ill-formed Unicode, invalid versions, and malformed digests", () => {
    assert.throws(() => createHeaderRowIdentity({ ...scope, planId: "" }), /empty/);
    assert.throws(
      () => createHeaderRowIdentity({ ...scope, userId: "\uD800", planId: "plan-a" }),
      /Unicode/,
    );
    assert.throws(
      () => createVersionRowIdentity({ ...scope, planId: "plan-a", version: 0 }),
      /version/,
    );
    assert.throws(
      () => createHeaderRowIdentity({ ...scope, planId: "plan-a" }, () => "ABC"),
      /SHA-256/,
    );
  });

  it("returns CONFLICT for a duplicate identity without replacing payload", () => {
    const store = new SyntheticSupportPlanRowStore();
    const identity = createVersionRowIdentity({ ...scope, planId: "plan-a", version: 1 });

    assert.deepEqual(store.insert(identity, { body: "original" }), { status: "CREATED" });
    assert.deepEqual(store.insert(identity, { body: "replacement" }), { status: "CONFLICT" });
    assert.deepEqual(store.get(identity.rowKey), {
      rowKind: "V",
      rowKey: identity.rowKey,
      canonicalKey: identity.canonicalKey,
      payload: { body: "original" },
    });
  });

  it("detects injected hash collisions and preserves the original row", () => {
    const store = new SyntheticSupportPlanRowStore();
    const constantHash = () => "a".repeat(64);
    const first = createHeaderRowIdentity({ ...scope, planId: "plan-a" }, constantHash);
    const second = createHeaderRowIdentity({ ...scope, planId: "plan-b" }, constantHash);

    assert.deepEqual(store.insert(first, { body: "first" }), { status: "CREATED" });
    assert.deepEqual(store.insert(second, { body: "second" }), { status: "COLLISION" });
    assert.deepEqual(store.get(first.rowKey)?.payload, { body: "first" });
  });

  it("TC-IR-04 snapshots nested payloads on insertion and retrieval", () => {
    const store = new SyntheticSupportPlanRowStore();
    const identity = createVersionRowIdentity({ ...scope, planId: "plan-a", version: 1 });
    const input = { nested: { methods: ["original"] } };

    assert.deepEqual(store.insert(identity, input), { status: "CREATED" });
    input.nested.methods[0] = "changed through insert input";

    const firstRead = store.get(identity.rowKey);
    assert.deepEqual(firstRead?.payload, { nested: { methods: ["original"] } });
    (firstRead?.payload as { nested: { methods: string[] } }).nested.methods[0] =
      "changed through read result";

    assert.deepEqual(store.get(identity.rowKey)?.payload, { nested: { methods: ["original"] } });
  });

  it("rejects a non-canonical JSON encoding before storing it", () => {
    const store = new SyntheticSupportPlanRowStore();
    const identity = createHeaderRowIdentity({ ...scope, planId: "plan/a" });
    const nonCanonicalKey = identity.canonicalKey.replace("/", "\\/");
    const nonCanonicalIdentity = {
      ...identity,
      canonicalKey: nonCanonicalKey,
      rowKey: `rk1:h:${sha256Hex(nonCanonicalKey)}`,
    };

    assert.deepEqual(store.insert(nonCanonicalIdentity, { body: "must not store" }), {
      status: "ERROR",
      reasonCode: "INVALID_ROW_IDENTITY",
    });
    assert.equal(store.size, 0);
  });
});
