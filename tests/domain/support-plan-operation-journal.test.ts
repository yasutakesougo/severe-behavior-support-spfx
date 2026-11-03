import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createVersionRowIdentity } from "../../src/domain/support-plan-row-key";
import { SyntheticSupportPlanOperationJournal } from "../../src/testing/synthetic-support-plan-operation-journal";

const scope = { organizationId: "org-syn", siteId: "site-syn" };
const identity = createVersionRowIdentity({
  organizationId: scope.organizationId,
  siteId: scope.siteId,
  userId: "user-syn",
  planId: "plan-syn",
  version: 1,
});

describe("synthetic durable publication operation journal", () => {
  it("stores only scoped identity and payload digest, and uses ETag-conditional state transitions", async () => {
    const journal = new SyntheticSupportPlanOperationJournal();
    const created = await journal.createIntent({
      scope,
      operationId: "op-syn-1",
      startedAt: "2026-11-03T00:00:00.000Z",
      expectedControlRevision: 4,
      expectedRows: [
        {
          ...identity,
          scope,
          payloadDigest: "a".repeat(64),
        },
      ],
      requestDigest: "b".repeat(64),
    });

    assert.equal(created.status, "CREATED");
    if (created.status !== "CREATED") return;
    assert.equal(created.entry.state, "PREPARED");
    assert.equal("payload" in created.entry.expectedRows[0], false);
    assert.equal(created.entry.scope.siteId, scope.siteId);

    assert.deepEqual(await journal.transition(scope, "op-syn-1", "stale-etag", "UPDATING"), {
      status: "CONFLICT",
    });
    const updated = await journal.transition(scope, "op-syn-1", created.entry.etag, "UPDATING");
    assert.equal(updated.status, "UPDATED");
    if (updated.status !== "UPDATED") return;
    assert.notEqual(updated.entry.etag, created.entry.etag);

    const duplicate = await journal.createIntent({
      scope,
      operationId: "op-syn-1",
      startedAt: "2026-11-03T00:00:00.000Z",
      expectedControlRevision: 4,
      expectedRows: [],
      requestDigest: "c".repeat(64),
    });
    assert.equal(duplicate.status, "EXISTS");
    assert.deepEqual(await journal.read(scope, "op-syn-1"), updated.entry);
  });
});
