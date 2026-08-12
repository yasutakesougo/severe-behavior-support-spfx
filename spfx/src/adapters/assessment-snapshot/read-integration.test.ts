import {
  createAssessmentSnapshotReadIntegration,
  type AssessmentSnapshotReadTransport,
} from "./read-integration";
import type { AssessmentSnapshotTransportReadResult } from "./transport-types";

const VALID_FIELDS: Readonly<Record<string, unknown>> = {
  snapshotId: "snap-001",
  recordStatus: "finalized",
  result: "NO_FINDINGS",
  reasonCodes: "[]",
  ruleSetVersion: "1.0.0",
  periodStart: "2026-01-01",
  periodEnd: "2026-01-31T00:00:00Z",
  inputFingerprint: "fp-001",
  supersedesSnapshotId: null,
};

function transportReturning(
  result: AssessmentSnapshotTransportReadResult,
): AssessmentSnapshotReadTransport {
  return {
    async getBySnapshotId() {
      return result;
    },
  };
}

describe("LIVE-SP-2 AssessmentSnapshots read integration", () => {
  it("returns a validated read model and preserves civil dates", async () => {
    const transport = transportReturning({
      ok: true,
      listItemId: 9,
      fields: VALID_FIELDS,
    });
    const integration = createAssessmentSnapshotReadIntegration(transport);

    await expect(integration.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "success",
      snapshot: {
        listItemId: 9,
        snapshotId: "snap-001",
        recordStatus: "finalized",
        result: "NO_FINDINGS",
        reasonCodes: [],
        ruleSetVersion: "1.0.0",
        periodStart: "2026-01-01",
        periodEnd: "2026-01-31",
        inputFingerprint: "fp-001",
      },
    });
  });

  it("separates not_found, forbidden, and retrieval_failed", async () => {
    const notFound = createAssessmentSnapshotReadIntegration(
      transportReturning({ ok: false, failure: "NOT_FOUND" }),
    );
    const forbidden = createAssessmentSnapshotReadIntegration(
      transportReturning({ ok: false, failure: "FORBIDDEN" }),
    );
    const unavailable = createAssessmentSnapshotReadIntegration(
      transportReturning({ ok: false, failure: "PERSISTENCE_UNAVAILABLE" }),
    );
    const transportError = createAssessmentSnapshotReadIntegration(
      transportReturning({ ok: false, failure: "TRANSPORT_ERROR" }),
    );

    await expect(notFound.readBySnapshotId("snap-001")).resolves.toEqual({ status: "not_found" });
    await expect(forbidden.readBySnapshotId("snap-001")).resolves.toEqual({ status: "forbidden" });
    await expect(unavailable.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "retrieval_failed",
    });
    await expect(transportError.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "retrieval_failed",
    });
  });

  it("fails closed for missing required fields and snapshotId mismatch", async () => {
    const missing = createAssessmentSnapshotReadIntegration(
      transportReturning({
        ok: true,
        listItemId: 9,
        fields: { ...VALID_FIELDS, inputFingerprint: undefined },
      }),
    );
    const mismatch = createAssessmentSnapshotReadIntegration(
      transportReturning({
        ok: true,
        listItemId: 9,
        fields: { ...VALID_FIELDS, snapshotId: "snap-other" },
      }),
    );

    await expect(missing.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "retrieval_failed",
    });
    await expect(mismatch.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "retrieval_failed",
    });
  });

  it("fails closed for unknown Choice, duplicate reasonCodes, and invalid DateOnly", async () => {
    const unknownChoice = createAssessmentSnapshotReadIntegration(
      transportReturning({
        ok: true,
        listItemId: 9,
        fields: { ...VALID_FIELDS, recordStatus: "確定" },
      }),
    );
    const duplicateReasonCodes = createAssessmentSnapshotReadIntegration(
      transportReturning({
        ok: true,
        listItemId: 9,
        fields: { ...VALID_FIELDS, reasonCodes: '["ABC_01","ABC_01"]' },
      }),
    );
    const invalidDate = createAssessmentSnapshotReadIntegration(
      transportReturning({
        ok: true,
        listItemId: 9,
        fields: { ...VALID_FIELDS, periodStart: "2026-02-30" },
      }),
    );

    await expect(unknownChoice.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "retrieval_failed",
    });
    await expect(duplicateReasonCodes.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "retrieval_failed",
    });
    await expect(invalidDate.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "retrieval_failed",
    });
  });

  it("fails closed when the transport throws or the requested id is blank", async () => {
    const throwing: AssessmentSnapshotReadTransport = {
      async getBySnapshotId() {
        throw new Error("synthetic retrieval failure");
      },
    };
    const integration = createAssessmentSnapshotReadIntegration(throwing);

    await expect(integration.readBySnapshotId("snap-001")).resolves.toEqual({
      status: "retrieval_failed",
    });
    await expect(integration.readBySnapshotId("   ")).resolves.toEqual({
      status: "retrieval_failed",
    });
  });

  it("exposes a read-only facade with no create/update capability", () => {
    const integration = createAssessmentSnapshotReadIntegration(
      transportReturning({ ok: false, failure: "NOT_FOUND" }),
    );

    expect(Object.keys(integration)).toEqual(["readBySnapshotId"]);
    expect("createItem" in integration).toBe(false);
    expect("updateItem" in integration).toBe(false);
  });
});
