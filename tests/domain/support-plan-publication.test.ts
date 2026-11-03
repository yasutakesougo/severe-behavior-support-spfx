import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  SyntheticSupportPlanPublisher,
  SyntheticSupportPlanReader,
} from "../../src/domain/support-plan-publication";
import type { RecoveryEvidence } from "../../src/domain/support-plan-publication";
import { sha256Hex } from "../../src/domain/sha256";
import {
  createHeaderRowIdentity,
  createVersionRowIdentity,
} from "../../src/domain/support-plan-row-key";
import { SyntheticSupportPlanPublicationStore } from "../../src/testing/synthetic-publication-store";
import { SyntheticSupportPlanOperationJournal } from "../../src/testing/synthetic-support-plan-operation-journal";

const scope = { organizationId: "org-a", siteId: "site-a" };

function rowFor(planId: string, version: number, userId = "user-a") {
  const identity = createVersionRowIdentity({
    organizationId: scope.organizationId,
    siteId: scope.siteId,
    userId,
    planId,
    version,
  });
  return { ...identity, scope, payload: { version } };
}

function row(version: number) {
  return rowFor("plan-a", version);
}

function headerRowFor(
  planId: string,
  version: number,
  currentVersion = version,
  userId = "user-a",
) {
  const identity = createHeaderRowIdentity({
    organizationId: scope.organizationId,
    siteId: scope.siteId,
    userId,
    planId,
  });
  return { ...identity, scope, payload: { version, currentVersion, status: "Draft" } };
}

function headerRow(version: number, currentVersion = version) {
  return headerRowFor("plan-a", version, currentVersion);
}

async function currentControl(store: SyntheticSupportPlanPublicationStore) {
  const control = await store.readControl(scope);
  assert.ok(control);
  return control;
}

const journalsByStore = new WeakMap<
  SyntheticSupportPlanPublicationStore,
  SyntheticSupportPlanOperationJournal
>();

function journalFor(
  store: SyntheticSupportPlanPublicationStore,
): SyntheticSupportPlanOperationJournal {
  let journal = journalsByStore.get(store);
  if (!journal) {
    journal = new SyntheticSupportPlanOperationJournal();
    journalsByStore.set(store, journal);
  }
  return journal;
}

async function publisherFor(
  store: SyntheticSupportPlanPublicationStore,
): Promise<SyntheticSupportPlanPublisher> {
  await store.initializeControlForTest(scope);
  return new SyntheticSupportPlanPublisher(store, journalFor(store));
}

describe("RISK-02 synthetic publication and read consistency", () => {
  it("R02-IR-01 updates an existing Header in a Publisher cycle and preserves Version insert-only", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = await publisherFor(store);
    const updateHeader = publisher as unknown as {
      updateHeader?: (input: {
        scope: typeof scope;
        operationId: string;
        startedAt: string;
        row: ReturnType<typeof headerRow>;
        expectedVersion: number;
      }) => Promise<unknown>;
    };

    assert.equal(typeof updateHeader.updateHeader, "function");
    if (!updateHeader.updateHeader) return;

    assert.deepEqual(
      await publisher.publish({
        scope,
        operationId: "op-header-create",
        startedAt: "2026-11-02T00:00:00.000Z",
        rows: [headerRow(1), row(1)],
      }),
      { status: "PUBLISHED", revision: 2 },
    );

    assert.deepEqual(
      await updateHeader.updateHeader({
        scope,
        operationId: "op-header-update",
        startedAt: "2026-11-02T00:00:01.000Z",
        row: headerRow(2, 1),
        expectedVersion: 1,
      }),
      { status: "PUBLISHED", revision: 4 },
    );
    assert.deepEqual(
      store
        .controlHistory(scope)
        .slice(-2)
        .map((control) => control.phase),
      ["UPDATING", "STABLE"],
    );

    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));
    const published = await reader.read(scope);
    assert.equal(published.status, "RESOLVED");
    if (published.status === "RESOLVED") {
      assert.deepEqual(
        published.value.find((publishedRow) => publishedRow.rowKind === "H")?.payload,
        { version: 2, currentVersion: 1, status: "Draft" },
      );
      assert.deepEqual(
        published.value.find((publishedRow) => publishedRow.rowKind === "V")?.payload,
        { version: 1 },
      );
    }

    assert.deepEqual(
      await updateHeader.updateHeader({
        scope,
        operationId: "op-header-stale",
        startedAt: "2026-11-02T00:00:02.000Z",
        row: headerRow(2, 1),
        expectedVersion: 1,
      }),
      { status: "CONFLICT", reasonCode: "HEADER_VERSION_MISMATCH" },
    );
    assert.equal((await currentControl(store)).phase, "STABLE");
    assert.equal((await currentControl(store)).revision, 4);

    assert.deepEqual(
      await updateHeader.updateHeader({
        scope,
        operationId: "op-not-a-header",
        startedAt: "2026-11-02T00:00:03.000Z",
        row: row(2) as unknown as ReturnType<typeof headerRow>,
        expectedVersion: 1,
      }),
      { status: "CONFLICT", reasonCode: "HEADER_ROW_REQUIRED" },
    );
  });

  it("R02-IR-01 allows only one competing Header update for the same expected version", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = await publisherFor(store);
    await publisher.publish({
      scope,
      operationId: "op-header-race-create",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [headerRow(1), row(1)],
    });

    const outcomes = await Promise.all([
      publisher.updateHeader({
        scope,
        operationId: "op-header-race-a",
        startedAt: "2026-11-02T00:00:01.000Z",
        row: {
          ...headerRow(2, 1),
          payload: { version: 2, currentVersion: 1, status: "Draft", title: "A" },
        },
        expectedVersion: 1,
      }),
      publisher.updateHeader({
        scope,
        operationId: "op-header-race-b",
        startedAt: "2026-11-02T00:00:02.000Z",
        row: {
          ...headerRow(2, 1),
          payload: { version: 2, currentVersion: 1, status: "Draft", title: "B" },
        },
        expectedVersion: 1,
      }),
    ]);

    assert.equal(outcomes.filter((outcome) => outcome.status === "PUBLISHED").length, 1);
    assert.equal(outcomes.filter((outcome) => outcome.status === "CONFLICT").length, 1);
    assert.equal((await currentControl(store)).phase, "STABLE");
    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));
    const published = await reader.read(scope);
    assert.equal(published.status, "RESOLVED");
    if (published.status === "RESOLVED") {
      const header = published.value.find((publishedRow) => publishedRow.rowKind === "H");
      assert.ok(header);
      assert.ok(["A", "B"].includes((header.payload as { title?: string }).title ?? ""));
    }
  });

  it("keeps the A2-pinned Version digest in a Header-only intent and hides a changed Version payload", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const journal = journalFor(store);
    const publisher = await publisherFor(store);
    await publisher.publish({
      scope,
      operationId: "op-header-digest-create",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [headerRow(1), row(1)],
    });
    assert.equal(
      (
        await publisher.updateHeader({
          scope,
          operationId: "op-header-digest-update",
          startedAt: "2026-11-02T00:00:01.000Z",
          row: headerRow(2, 1),
          expectedVersion: 1,
        })
      ).status,
      "PUBLISHED",
    );

    const intent = await journal.read(scope, "op-header-digest-update");
    assert.ok(intent);
    assert.equal(
      intent.expectedRows.some(
        (expected) => expected.rowKind === "V" && expected.rowKey === row(1).rowKey,
      ),
      true,
    );
    const reader = new SyntheticSupportPlanReader(store, journal, (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));
    assert.equal((await reader.read(scope)).status, "RESOLVED");

    const snapshot = await store.readRows(scope);
    assert.equal(snapshot.status, "SUCCESS");
    if (snapshot.status !== "SUCCESS") return;
    store.setRowsForTest(
      scope,
      snapshot.rows.map((candidate) =>
        candidate.rowKind === "V"
          ? { ...candidate, payload: { version: 1, body: "tampered" } }
          : candidate,
      ),
    );
    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "JOURNAL_SNAPSHOT_MISMATCH",
    });
  });

  it("holds a Header update if its pinned Version changes before write verification", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const journal = journalFor(store);
    const publisher = await publisherFor(store);
    await publisher.publish({
      scope,
      operationId: "op-header-pinned-race-create",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [headerRow(1), row(1)],
    });
    store.setBeforeWrite(async () => {
      const snapshot = await store.readRows(scope);
      if (snapshot.status !== "SUCCESS") return;
      store.setRowsForTest(
        scope,
        snapshot.rows.map((candidate) =>
          candidate.rowKind === "V"
            ? { ...candidate, payload: { version: 1, body: "changed-before-header-write" } }
            : candidate,
        ),
      );
    });

    const result = await publisher.updateHeader({
      scope,
      operationId: "op-header-pinned-race-update",
      startedAt: "2026-11-02T00:00:01.000Z",
      row: headerRow(2, 1),
      expectedVersion: 1,
    });

    assert.deepEqual(result, {
      status: "RECOVERY_REQUIRED",
      reasonCode: "RECOVERY_SNAPSHOT_MISMATCH",
    });
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
    const intent = await journal.read(scope, "op-header-pinned-race-update");
    assert.equal(intent?.state, "RECOVERY_REQUIRED");
  });

  it("checks committed digests for every displayed plan after a later unrelated publication", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const journal = journalFor(store);
    const publisher = await publisherFor(store);
    const otherPlanHeader = headerRowFor("plan-b", 1);
    const otherPlanVersion = rowFor("plan-b", 1);
    await publisher.publish({
      scope,
      operationId: "op-other-plan",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [otherPlanHeader, otherPlanVersion],
    });
    await publisher.publish({
      scope,
      operationId: "op-later-plan",
      startedAt: "2026-11-02T00:00:01.000Z",
      rows: [headerRow(1), row(1)],
    });
    const reader = new SyntheticSupportPlanReader(store, journal, (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));
    const snapshot = await store.readRows(scope);
    assert.equal(snapshot.status, "SUCCESS");
    if (snapshot.status !== "SUCCESS") return;
    store.setRowsForTest(
      scope,
      snapshot.rows.map((candidate) =>
        candidate.rowKey === otherPlanVersion.rowKey
          ? { ...candidate, payload: { version: 1, body: "tampered-old-plan" } }
          : candidate,
      ),
    );

    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "JOURNAL_SNAPSHOT_MISMATCH",
    });
  });

  it("does not display an initial snapshot with no committed operation journal", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    await store.initializeControlForTest(scope);
    store.setRowsForTest(scope, [headerRow(1), row(1)]);
    const reader = new SyntheticSupportPlanReader(
      store,
      new SyntheticSupportPlanOperationJournal(),
      (rows) => ({ status: "RESOLVED", value: rows }),
    );

    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "JOURNAL_OPERATION_UNVERIFIED",
    });
  });

  it("rejects publication when a Header pins a Version row that is not in the snapshot or intent", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const journal = new SyntheticSupportPlanOperationJournal();
    await store.initializeControlForTest(scope);
    const publisher = new SyntheticSupportPlanPublisher(store, journal);

    assert.deepEqual(
      await publisher.publish({
        scope,
        operationId: "op-header-version-mismatch",
        startedAt: "2026-11-02T00:00:00.000Z",
        rows: [headerRow(1), row(2)],
      }),
      { status: "CONFLICT", reasonCode: "HEADER_CURRENT_VERSION_UNVERIFIED" },
    );
    assert.deepEqual(store.writeAttempts, []);
    assert.equal(await journal.read(scope, "op-header-version-mismatch"), undefined);
    assert.equal((await currentControl(store)).revision, 0);
  });

  it("does not re-attest a tampered pinned Version from its current snapshot", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const journal = new SyntheticSupportPlanOperationJournal();
    const publisher = new SyntheticSupportPlanPublisher(store, journal);
    await store.initializeControlForTest(scope);
    assert.equal(
      (
        await publisher.publish({
          scope,
          operationId: "op-pinned-v-create",
          startedAt: "2026-11-02T00:00:00.000Z",
          rows: [headerRow(1), row(1)],
        })
      ).status,
      "PUBLISHED",
    );
    const snapshot = await store.readRows(scope);
    assert.equal(snapshot.status, "SUCCESS");
    if (snapshot.status !== "SUCCESS") return;
    store.setRowsForTest(
      scope,
      snapshot.rows.map((candidate) =>
        candidate.rowKind === "V"
          ? { ...candidate, payload: { version: 1, body: "tampered-after-commit" } }
          : candidate,
      ),
    );

    const result = await publisher.updateHeader({
      scope,
      operationId: "op-pinned-v-re-attest",
      startedAt: "2026-11-02T00:00:01.000Z",
      row: headerRow(2, 1),
      expectedVersion: 1,
    });
    assert.deepEqual(result, {
      status: "CONFLICT",
      reasonCode: "PINNED_VERSION_JOURNAL_MISMATCH",
    });
    assert.deepEqual(store.writeAttempts, ["op-pinned-v-create"]);
  });

  it("holds a stable Control whose prior operation is not committed before any new write", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const journal = new SyntheticSupportPlanOperationJournal();
    await store.initializeControlForTest(scope);
    const uncommitted = row(1);
    const payloadDigest = sha256Hex(JSON.stringify(uncommitted.payload));
    const expectedRows = [
      {
        rowKind: uncommitted.rowKind,
        rowKey: uncommitted.rowKey,
        canonicalKey: uncommitted.canonicalKey,
        scope: uncommitted.scope,
        payloadDigest,
      },
    ];
    const created = await journal.createIntent({
      scope,
      operationId: "op-stable-but-uncommitted",
      startedAt: "2026-11-02T00:00:00.000Z",
      expectedControlRevision: 0,
      expectedRows,
      requestDigest: sha256Hex(
        JSON.stringify(
          expectedRows.map((candidate) => [
            candidate.rowKind,
            candidate.rowKey,
            candidate.canonicalKey,
            candidate.payloadDigest,
          ]),
        ),
      ),
    });
    assert.equal(created.status, "CREATED");

    const initial = await currentControl(store);
    const updating = await store.compareAndSwapControl(scope, initial.etag, {
      scope,
      phase: "UPDATING",
      revision: 1,
      operationId: "op-stable-but-uncommitted",
      startedAt: "2026-11-02T00:00:00.000Z",
    });
    assert.equal(updating.status, "UPDATED");
    if (updating.status !== "UPDATED") return;
    const commitReady = await journal.transition(
      scope,
      "op-stable-but-uncommitted",
      created.entry.etag,
      "UPDATING",
    );
    assert.equal(commitReady.status, "UPDATED");
    if (commitReady.status !== "UPDATED") return;
    const ready = await journal.transition(
      scope,
      "op-stable-but-uncommitted",
      commitReady.entry.etag,
      "COMMIT_READY",
    );
    assert.equal(ready.status, "UPDATED");
    if (ready.status !== "UPDATED") return;
    const stable = await store.compareAndSwapControl(scope, updating.control.etag, {
      scope,
      phase: "STABLE",
      revision: 2,
      operationId: "op-stable-but-uncommitted",
      startedAt: "2026-11-02T00:00:00.000Z",
    });
    assert.equal(stable.status, "UPDATED");

    const publisher = new SyntheticSupportPlanPublisher(store, journal);
    const result = await publisher.publish({
      scope,
      operationId: "op-after-stable-uncommitted",
      startedAt: "2026-11-02T00:00:01.000Z",
      rows: [row(2)],
    });
    assert.deepEqual(result, {
      status: "RECOVERY_REQUIRED",
      reasonCode: "PRIOR_CONTROL_OPERATION_UNCOMMITTED",
    });
    assert.deepEqual(store.writeAttempts, []);
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
    assert.equal(
      (await journal.read(scope, "op-stable-but-uncommitted"))?.state,
      "RECOVERY_REQUIRED",
    );
  });

  it("holds a non-initial stable Control that has no operation identity", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    await store.initializeControlForTest(scope);
    const initial = await currentControl(store);
    const malformed = await store.compareAndSwapControl(scope, initial.etag, {
      scope,
      phase: "STABLE",
      revision: 1,
    });
    assert.equal(malformed.status, "UPDATED");

    const publisher = new SyntheticSupportPlanPublisher(
      store,
      new SyntheticSupportPlanOperationJournal(),
    );
    assert.deepEqual(
      await publisher.publish({
        scope,
        operationId: "op-control-without-identity",
        startedAt: "2026-11-02T00:00:01.000Z",
        rows: [row(1)],
      }),
      { status: "RECOVERY_REQUIRED", reasonCode: "CONTROL_OPERATION_ID_MISSING" },
    );
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
    assert.deepEqual(store.writeAttempts, []);
  });

  it("holds when the facility Control is missing instead of creating a stable Control", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = new SyntheticSupportPlanPublisher(
      store,
      new SyntheticSupportPlanOperationJournal(),
    );

    assert.deepEqual(
      await publisher.publish({
        scope,
        operationId: "op-missing-control",
        startedAt: "2026-11-02T00:00:00.000Z",
        rows: [row(1)],
      }),
      { status: "RECOVERY_REQUIRED", reasonCode: "CONTROL_NOT_FOUND" },
    );
    assert.equal(await store.readControl(scope), undefined);
    assert.deepEqual(store.writeAttempts, []);
  });

  it("commits the verified Journal before finalizing Control and requires explicit restart recovery", async () => {
    class InterruptFinalControlStore extends SyntheticSupportPlanPublicationStore {
      public journalStateAtFinalControlCas?: string;
      private interrupted = false;

      public constructor(private readonly journal: SyntheticSupportPlanOperationJournal) {
        super();
      }

      public override async compareAndSwapControl(
        inputScope: typeof scope,
        expectedEtag: string,
        next: Parameters<SyntheticSupportPlanPublicationStore["compareAndSwapControl"]>[2],
      ) {
        if (next.phase === "STABLE" && next.operationId && !this.interrupted) {
          this.interrupted = true;
          this.journalStateAtFinalControlCas = (
            await this.journal.read(inputScope, next.operationId)
          )?.state;
          throw new Error("synthetic interruption before final Control CAS");
        }
        return super.compareAndSwapControl(inputScope, expectedEtag, next);
      }
    }

    const journal = new SyntheticSupportPlanOperationJournal();
    const store = new InterruptFinalControlStore(journal);
    await store.initializeControlForTest(scope);
    const firstPublisher = new SyntheticSupportPlanPublisher(store, journal);
    assert.deepEqual(
      await firstPublisher.publish({
        scope,
        operationId: "op-interrupted-final-control",
        startedAt: "2026-11-02T00:00:00.000Z",
        rows: [row(1)],
      }),
      { status: "RECOVERY_REQUIRED", reasonCode: "STABLE_PUBLISH_OUTCOME_UNKNOWN" },
    );
    assert.equal(store.journalStateAtFinalControlCas, "COMMITTED");
    assert.equal((await journal.read(scope, "op-interrupted-final-control"))?.state, "COMMITTED");
    const heldControl = await currentControl(store);
    assert.equal(heldControl.phase, "RECOVERY_REQUIRED");

    const restartedPublisher = new SyntheticSupportPlanPublisher(store, journal);
    assert.deepEqual(
      await restartedPublisher.recover({
        scope,
        operationId: "op-interrupted-final-control",
        expectedEtag: heldControl.etag,
        evidence: { priorWriterStopped: true, pendingRequestsSettled: true },
      }),
      { status: "RECOVERED", revision: heldControl.revision + 1 },
    );
    assert.deepEqual(store.writeAttempts, ["op-interrupted-final-control"]);
  });

  it("records an initial journal read failure as persistent Control HOLD", async () => {
    class ReadFailingJournal extends SyntheticSupportPlanOperationJournal {
      public override async read(): Promise<undefined> {
        throw new Error("synthetic journal unavailable");
      }
    }
    const store = new SyntheticSupportPlanPublicationStore();
    await store.initializeControlForTest(scope);
    const publisher = new SyntheticSupportPlanPublisher(store, new ReadFailingJournal());

    assert.deepEqual(
      await publisher.publish({
        scope,
        operationId: "op-journal-read-failure",
        startedAt: "2026-11-02T00:00:00.000Z",
        rows: [row(1)],
      }),
      { status: "RECOVERY_REQUIRED", reasonCode: "JOURNAL_READ_OUTCOME_UNKNOWN" },
    );
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
    assert.deepEqual(store.writeAttempts, []);
  });

  it("R02-IR-01 rejects a Version re-save without replacing the stored row", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = await publisherFor(store);
    assert.equal(
      (
        await publisher.publish({
          scope,
          operationId: "op-version-create",
          startedAt: "2026-11-02T00:00:00.000Z",
          rows: [row(1)],
        })
      ).status,
      "PUBLISHED",
    );

    assert.deepEqual(
      await publisher.publish({
        scope,
        operationId: "op-version-resave",
        startedAt: "2026-11-02T00:00:01.000Z",
        rows: [{ ...row(1), payload: { version: 1, body: "replacement" } }],
      }),
      { status: "CONFLICT", reasonCode: "ROW_ALREADY_EXISTS" },
    );
    assert.equal((await currentControl(store)).phase, "STABLE");
    const stored = await store.readRows(scope);
    assert.equal(stored.status, "SUCCESS");
    if (stored.status === "SUCCESS") assert.deepEqual(stored.rows[0].payload, { version: 1 });
  });

  it("R02-IR-04 isolates Control scope from save and read aliases", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const inputScope = { ...scope };
    await store.initializeControlForTest(inputScope);
    inputScope.organizationId = "org-mutated-after-save";

    const firstRead = await store.readControl(scope);
    assert.ok(firstRead);
    assert.deepEqual(firstRead.scope, scope);
    assert.equal(Reflect.set(firstRead.scope, "siteId", "site-mutated-after-read"), false);

    const secondRead = await store.readControl(scope);
    assert.ok(secondRead);
    assert.deepEqual(secondRead.scope, scope);
  });

  it("TC-PUBLISH-01 publishes through UPDATING and exposes only the final stable revision", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = await publisherFor(store);
    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: rows.length === 2 ? "RESOLVED" : "UNRESOLVED",
      value: rows,
    }));

    const result = await publisher.publish({
      scope,
      operationId: "op-001",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [row(1), row(2)],
    });

    assert.deepEqual(result, { status: "PUBLISHED", revision: 2 });
    assert.deepEqual(
      store.controlHistory(scope).map((control) => [control.phase, control.revision]),
      [
        ["STABLE", 0],
        ["UPDATING", 1],
        ["STABLE", 2],
      ],
    );
    assert.equal((await currentControl(store)).operationId, "op-001");
    assert.deepEqual(await reader.read(scope), {
      status: "RESOLVED",
      revision: 2,
      value: [row(1), row(2)],
    });
    assert.deepEqual(
      await publisher.publish({
        scope,
        operationId: "op-001",
        startedAt: "2026-11-02T00:00:01.000Z",
        rows: [row(3)],
      }),
      { status: "CONFLICT", reasonCode: "OPERATION_ID_REUSED" },
    );
    assert.deepEqual(store.writeAttempts, ["op-001"]);
  });

  it("TC-PUBLISH-01 admits only one concurrent publisher and never retries a CAS conflict", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    let releaseWrite!: () => void;
    let signalWriteStarted!: () => void;
    const writeStarted = new Promise<void>((resolve) => {
      signalWriteStarted = resolve;
    });
    const writeGate = new Promise<void>((resolve) => {
      releaseWrite = resolve;
    });
    store.setBeforeWrite(async () => {
      signalWriteStarted();
      await writeGate;
    });

    const publisher = await publisherFor(store);
    const first = publisher.publish({
      scope,
      operationId: "op-first",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [row(1)],
    });
    await writeStarted;

    const second = await publisher.publish({
      scope,
      operationId: "op-second",
      startedAt: "2026-11-02T00:00:01.000Z",
      rows: [row(2)],
    });
    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));
    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "PUBLICATION_IN_PROGRESS",
    });
    releaseWrite();

    assert.deepEqual(second, { status: "CONFLICT", reasonCode: "PUBLICATION_IN_PROGRESS" });
    assert.deepEqual(await first, { status: "PUBLISHED", revision: 2 });
    assert.equal(
      store.controlHistory(scope).filter((control) => control.phase === "UPDATING").length,
      1,
    );
  });

  it("TC-PUBLISH-01 keeps a partial write non-stable and requires recovery evidence", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    store.failWriteAt(2, "FAILED");
    const publisher = await publisherFor(store);

    const result = await publisher.publish({
      scope,
      operationId: "op-partial",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [row(1), row(2)],
    });

    assert.equal(result.status, "PARTIAL_FAILURE");
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));
    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "RECOVERY_REQUIRED",
    });
    assert.deepEqual(
      await publisher.recover({
        scope,
        operationId: "op-partial",
        expectedEtag: (await currentControl(store)).etag,
        evidence: {
          priorWriterStopped: true,
          pendingRequestsSettled: true,
        },
      }),
      { status: "BLOCKED", reasonCode: "SNAPSHOT_INCOMPLETE" },
    );
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
  });

  it("TC-PUBLISH-01 does not treat an unknown write outcome as success or automatically retry it", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    store.failWriteAt(1, "UNKNOWN");
    const publisher = await publisherFor(store);

    const result = await publisher.publish({
      scope,
      operationId: "op-unknown",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [row(1)],
    });

    assert.equal(result.status, "UNKNOWN_OUTCOME");
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
    assert.deepEqual(store.writeAttempts, ["op-unknown"]);
  });

  it("TC-RECOVER-01 distinguishes a write failure before persistence and recovers only with complete evidence", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    store.failWriteAt(1, "FAILED");
    const publisher = await publisherFor(store);

    const result = await publisher.publish({
      scope,
      operationId: "op-failed-before-write",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [row(1)],
    });
    assert.deepEqual(result, {
      status: "WRITE_FAILED",
      reasonCode: "SYNTHETIC_WRITE_FAILURE",
      controlPhase: "RECOVERY_REQUIRED",
    });

    const current = await store.readControl(scope);
    assert.ok(current);
    assert.deepEqual(
      await publisher.recover({
        scope,
        operationId: "op-failed-before-write",
        expectedEtag: current.etag,
        evidence: {
          priorWriterStopped: true,
          pendingRequestsSettled: true,
        },
      }),
      { status: "BLOCKED", reasonCode: "SNAPSHOT_INCOMPLETE" },
    );
    store.setSnapshotComplete(scope, true);
    assert.deepEqual(
      await publisher.recover({
        scope,
        operationId: "op-failed-before-write",
        expectedEtag: current.etag,
        evidence: {
          priorWriterStopped: true,
          pendingRequestsSettled: true,
        },
      }),
      { status: "BLOCKED", reasonCode: "RECOVERY_SNAPSHOT_MISMATCH" },
    );
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
  });

  it("R02-IR-02 recovers only after rereading every intended row and matching its content", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    store.failWriteAt(1, "UNKNOWN");
    const publisher = await publisherFor(store);
    const intended = row(1);

    assert.equal(
      (
        await publisher.publish({
          scope,
          operationId: "op-verified-recovery",
          startedAt: "2026-11-02T00:00:00.000Z",
          rows: [intended],
        })
      ).status,
      "UNKNOWN_OUTCOME",
    );
    store.setSnapshotComplete(scope, true);
    const current = await currentControl(store);
    const reportedEvidence = {
      priorWriterStopped: true,
      pendingRequestsSettled: true,
    };

    assert.deepEqual(
      await publisher.recover({
        scope,
        operationId: "op-verified-recovery",
        expectedEtag: current.etag,
        evidence: reportedEvidence,
      }),
      { status: "RECOVERED", revision: current.revision + 1 },
    );
  });

  it("R02-IR-02 does not release recovery HOLD for truthy non-boolean evidence", async () => {
    const cases: ReadonlyArray<{
      operationId: string;
      evidence: RecoveryEvidence;
      reasonCode: string;
    }> = [
      {
        operationId: "op-malformed-writer-evidence",
        evidence: {
          priorWriterStopped: "false",
          pendingRequestsSettled: true,
        } as unknown as RecoveryEvidence,
        reasonCode: "PRIOR_WRITER_NOT_CONFIRMED_STOPPED",
      },
      {
        operationId: "op-malformed-request-evidence",
        evidence: {
          priorWriterStopped: true,
          pendingRequestsSettled: "false",
        } as unknown as RecoveryEvidence,
        reasonCode: "PENDING_REQUESTS_NOT_SETTLED",
      },
    ];

    for (const testCase of cases) {
      const store = new SyntheticSupportPlanPublicationStore();
      store.failWriteAt(1, "UNKNOWN");
      const publisher = await publisherFor(store);
      await publisher.publish({
        scope,
        operationId: testCase.operationId,
        startedAt: "2026-11-02T00:00:00.000Z",
        rows: [row(1)],
      });
      store.setSnapshotComplete(scope, true);
      const current = await currentControl(store);

      assert.deepEqual(
        await publisher.recover({
          scope,
          operationId: testCase.operationId,
          expectedEtag: current.etag,
          evidence: testCase.evidence,
        }),
        { status: "BLOCKED", reasonCode: testCase.reasonCode },
        testCase.operationId,
      );
      assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
    }
  });

  it("R02-IR-02 persists HOLD intent across Publisher restart and never replays an unknown write", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const journal = new SyntheticSupportPlanOperationJournal();
    await store.initializeControlForTest(scope);
    store.failWriteAt(1, "UNKNOWN");
    const firstPublisher = new SyntheticSupportPlanPublisher(store, journal);
    const operationId = "op-recovery-after-publisher-restart";

    assert.equal(
      (
        await firstPublisher.publish({
          scope,
          operationId,
          startedAt: "2026-11-02T00:00:00.000Z",
          rows: [row(1)],
        })
      ).status,
      "UNKNOWN_OUTCOME",
    );

    const persistedSnapshot = await store.readRows(scope);
    assert.equal(persistedSnapshot.status, "SUCCESS");
    if (persistedSnapshot.status !== "SUCCESS") return;
    assert.equal(persistedSnapshot.rows.length, 1);
    assert.equal(persistedSnapshot.complete, false);

    const beforeRecovery = await currentControl(store);
    assert.equal(beforeRecovery.phase, "RECOVERY_REQUIRED");
    const persistedIntent = await journal.read(scope, operationId);
    assert.ok(persistedIntent);
    assert.equal(persistedIntent.state, "RECOVERY_REQUIRED");
    assert.equal("payload" in persistedIntent.expectedRows[0], false);

    // A new Publisher instance sees the persisted intent and is prohibited from retrying it.
    const restartedPublisher = new SyntheticSupportPlanPublisher(store, journal);
    assert.equal(
      (
        await restartedPublisher.publish({
          scope,
          operationId,
          startedAt: "2026-11-02T00:00:01.000Z",
          rows: [row(1)],
        })
      ).status,
      "RECOVERY_REQUIRED",
    );
    assert.deepEqual(store.writeAttempts, [operationId]);
    assert.deepEqual(
      await restartedPublisher.recover({
        scope,
        operationId,
        expectedEtag: beforeRecovery.etag,
        evidence: { priorWriterStopped: true, pendingRequestsSettled: true },
      }),
      { status: "BLOCKED", reasonCode: "SNAPSHOT_INCOMPLETE" },
    );

    const afterRecovery = await currentControl(store);
    assert.equal(afterRecovery.phase, "RECOVERY_REQUIRED");
    assert.equal(afterRecovery.revision, beforeRecovery.revision);
    assert.equal(afterRecovery.etag, beforeRecovery.etag);
  });

  it("R02-IR-02 does not recover from a complete snapshot whose intended payload differs", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    store.failWriteAt(1, "UNKNOWN");
    const publisher = await publisherFor(store);
    const intended = row(1);

    await publisher.publish({
      scope,
      operationId: "op-mismatched-recovery",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [intended],
    });
    store.setRowsForTest(scope, [{ ...intended, payload: { version: 1, body: "changed" } }]);
    store.setSnapshotComplete(scope, true);
    const current = await currentControl(store);

    assert.deepEqual(
      await publisher.recover({
        scope,
        operationId: "op-mismatched-recovery",
        expectedEtag: current.etag,
        evidence: { priorWriterStopped: true, pendingRequestsSettled: true },
      }),
      { status: "BLOCKED", reasonCode: "RECOVERY_SNAPSHOT_MISMATCH" },
    );
    assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED");
  });

  it("R02-IR-02 rejects missing, wrong-version, wrong-scope, and duplicate recovery rows", async () => {
    const cases = [
      {
        name: "missing row",
        rows: [] as ReturnType<typeof row>[],
        reason: "RECOVERY_SNAPSHOT_MISMATCH",
      },
      { name: "wrong version", rows: [row(2)], reason: "RECOVERY_SNAPSHOT_MISMATCH" },
      {
        name: "wrong scope",
        rows: [{ ...row(1), scope: { organizationId: "org-b", siteId: "site-a" } }],
        reason: "AMBIGUOUS_OR_MALFORMED_SNAPSHOT",
      },
      {
        name: "duplicate row",
        rows: [row(1), row(1)],
        reason: "AMBIGUOUS_OR_MALFORMED_SNAPSHOT",
      },
    ];

    for (const [index, testCase] of cases.entries()) {
      const store = new SyntheticSupportPlanPublicationStore();
      store.failWriteAt(1, "UNKNOWN");
      const publisher = await publisherFor(store);
      await publisher.publish({
        scope,
        operationId: `op-recovery-shape-${index}`,
        startedAt: "2026-11-02T00:00:00.000Z",
        rows: [row(1)],
      });
      store.setRowsForTest(scope, testCase.rows);
      store.setSnapshotComplete(scope, true);
      const current = await currentControl(store);

      assert.deepEqual(
        await publisher.recover({
          scope,
          operationId: `op-recovery-shape-${index}`,
          expectedEtag: current.etag,
          evidence: { priorWriterStopped: true, pendingRequestsSettled: true },
        }),
        { status: "BLOCKED", reasonCode: testCase.reason },
        testCase.name,
      );
      assert.equal((await currentControl(store)).phase, "RECOVERY_REQUIRED", testCase.name);
    }
  });

  it("R02-IR-02 keeps recovery non-stable if Control ownership changes during snapshot verification", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    store.failWriteAt(1, "UNKNOWN");
    const publisher = await publisherFor(store);
    await publisher.publish({
      scope,
      operationId: "op-recovery-race",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [row(1)],
    });
    store.setSnapshotComplete(scope, true);
    const current = await currentControl(store);
    store.changeControlAfterNextRowsRead(scope, "UPDATING");

    assert.deepEqual(
      await publisher.recover({
        scope,
        operationId: "op-recovery-race",
        expectedEtag: current.etag,
        evidence: { priorWriterStopped: true, pendingRequestsSettled: true },
      }),
      { status: "BLOCKED", reasonCode: "RECOVERY_CONTROL_CHANGED" },
    );
    assert.notEqual((await currentControl(store)).phase, "STABLE");
  });

  it("keeps every injected row-write failure non-stable at its failure stage", async () => {
    for (const mode of ["FAILED", "UNKNOWN"] as const) {
      for (const writeNumber of [1, 2, 3]) {
        const store = new SyntheticSupportPlanPublicationStore();
        store.failWriteAt(writeNumber, mode);
        const publisher = await publisherFor(store);
        const result = await publisher.publish({
          scope,
          operationId: `op-stage-${mode.toLowerCase()}-${writeNumber}`,
          startedAt: "2026-11-02T00:00:00.000Z",
          rows: [row(1), row(2), row(3)],
        });

        assert.notEqual(result.status, "PUBLISHED", `${mode} write stage ${writeNumber}`);
        assert.equal(
          (await currentControl(store)).phase,
          "RECOVERY_REQUIRED",
          `${mode} write stage ${writeNumber}`,
        );
      }
    }
  });

  it("R02-IR-03 rejects non-canonical JSON even when the physical digest matches it", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = await publisherFor(store);
    const validRow = row(1);
    await publisher.publish({
      scope,
      operationId: "op-noncanonical-row",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [validRow],
    });
    const nonCanonicalKey = ` ${validRow.canonicalKey}`;
    store.setRowsForTest(scope, [
      {
        ...validRow,
        canonicalKey: nonCanonicalKey,
        rowKey: `rk1:v:${sha256Hex(nonCanonicalKey)}`,
      },
    ]);
    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));

    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_OR_MALFORMED_SNAPSHOT",
    });
  });

  it("TC-READ-01 does not resolve if Control changes between the before and after reads", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = await publisherFor(store);
    await publisher.publish({
      scope,
      operationId: "op-stable",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [row(1), row(2)],
    });
    store.changeControlAfterNextRowsRead(scope, "UPDATING");

    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));

    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "CONTROL_CHANGED",
    });
  });

  it("fails closed when rows are incomplete or outside the facility scope", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = await publisherFor(store);
    await publisher.publish({
      scope,
      operationId: "op-complete",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [row(1)],
    });
    store.setSnapshotComplete(scope, false);

    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));

    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "INCOMPLETE_SNAPSHOT",
    });
    assert.deepEqual(await reader.read({ organizationId: "org-other", siteId: "site-a" }), {
      status: "UNRESOLVED",
      reasonCode: "CONTROL_NOT_FOUND",
    });
  });

  it("TC-READ-01 fails closed when a snapshot contains a duplicate physical row identity", async () => {
    const store = new SyntheticSupportPlanPublicationStore();
    const publisher = await publisherFor(store);
    const onlyRow = row(1);
    await publisher.publish({
      scope,
      operationId: "op-duplicate-snapshot",
      startedAt: "2026-11-02T00:00:00.000Z",
      rows: [onlyRow],
    });
    store.setRowsForTest(scope, [onlyRow, onlyRow]);
    const reader = new SyntheticSupportPlanReader(store, journalFor(store), (rows) => ({
      status: "RESOLVED",
      value: rows,
    }));

    assert.deepEqual(await reader.read(scope), {
      status: "UNRESOLVED",
      reasonCode: "AMBIGUOUS_OR_MALFORMED_SNAPSHOT",
    });
  });
});
