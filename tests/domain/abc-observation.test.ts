import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  transitionSaveState,
  transitionLinkState,
  transitionLinkFailureStatus,
} from "../../src/domain";
import {
  createSyntheticAbcRecord,
  createSyntheticLinkFailure,
  SYNTHETIC_ORG_ID,
  SYNTHETIC_SITE_ID,
} from "./abc-observation-fixtures";

describe("ABC and Observation Domain Logic & Transitions", () => {
  describe("transitionSaveState Pure Function", () => {
    it("allows Saved -> Deleted transition when required context is supplied", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionSaveState(record, "Deleted", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        deletedBy: "synthetic-staff-001",
        deletedAt: "2026-08-06T12:00:00.000Z",
        deletionReason: "synthetic deletion reason",
        expectedVersion: 1,
      });

      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.value.saveState.status, "Deleted");
        assert.equal(res.value.version, 2);
        if (res.value.saveState.status === "Deleted") {
          assert.equal(res.value.saveState.deletedBy, "synthetic-staff-001");
          assert.equal(res.value.saveState.deletionReason, "synthetic deletion reason");
        }
      }
    });

    it("rejects transition on OrganizationId mismatch with CONTEXT_MISMATCH", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionSaveState(record, "Deleted", {
        OrganizationId: "mismatched-org",
        SiteId: SYNTHETIC_SITE_ID,
        deletedBy: "synthetic-staff-001",
        deletedAt: "2026-08-06T12:00:00.000Z",
        deletionReason: "synthetic reason",
        expectedVersion: 1,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "CONTEXT_MISMATCH");
      }
    });

    it("rejects transition on SiteId mismatch with CONTEXT_MISMATCH", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionSaveState(record, "Deleted", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: "mismatched-site",
        deletedBy: "synthetic-staff-001",
        deletedAt: "2026-08-06T12:00:00.000Z",
        deletionReason: "synthetic reason",
        expectedVersion: 1,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "CONTEXT_MISMATCH");
      }
    });

    it("returns MALFORMED_INPUT when context is null, undefined, array, or primitive", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res1 = transitionSaveState(record, "Deleted", undefined);
      assert.equal(res1.ok, false);
      if (!res1.ok) assert.equal(res1.reason, "MALFORMED_INPUT");

      const res2 = transitionSaveState(record, "Deleted", null);
      assert.equal(res2.ok, false);
      if (!res2.ok) assert.equal(res2.reason, "MALFORMED_INPUT");

      const res3 = transitionSaveState(record, "Deleted", []);
      assert.equal(res3.ok, false);
      if (!res3.ok) assert.equal(res3.reason, "MALFORMED_INPUT");

      const res4 = transitionSaveState(record, "Deleted", {});
      assert.equal(res4.ok, false);
      if (!res4.ok) assert.equal(res4.reason, "MALFORMED_INPUT");
    });

    it("does not mutate original record input on transition failure", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const originalVersion = record.version;
      const res = transitionSaveState(record, "Deleted", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 999, // mismatch
      });

      assert.equal(res.ok, false);
      assert.equal(record.version, originalVersion);
    });

    it("rejects expectedVersion mismatch with VERSION_CONFLICT", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionSaveState(record, "Deleted", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        deletedBy: "synthetic-staff-001",
        deletedAt: "2026-08-06T12:00:00.000Z",
        deletionReason: "synthetic reason",
        expectedVersion: 2,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "VERSION_CONFLICT");
      }
    });
  });

  describe("transitionLinkState Pure Function", () => {
    it("allows Pending -> Linked transition", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionLinkState(record, "Linked", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
      });

      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.value.linkState.status, "Linked");
        assert.equal(res.value.version, 2);
      }
    });

    it("rejects transition on OrganizationId mismatch with CONTEXT_MISMATCH", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionLinkState(record, "Linked", {
        OrganizationId: "mismatched-org",
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "CONTEXT_MISMATCH");
      }
    });

    it("rejects transition on SiteId mismatch with CONTEXT_MISMATCH", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionLinkState(record, "Linked", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: "mismatched-site",
        expectedVersion: 1,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "CONTEXT_MISMATCH");
      }
    });

    it("returns MALFORMED_INPUT when context is invalid", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res1 = transitionLinkState(record, "Linked", undefined);
      assert.equal(res1.ok, false);
      if (!res1.ok) assert.equal(res1.reason, "MALFORMED_INPUT");

      const res2 = transitionLinkState(record, "Linked", null);
      assert.equal(res2.ok, false);
      if (!res2.ok) assert.equal(res2.reason, "MALFORMED_INPUT");

      const res3 = transitionLinkState(record, "Linked", []);
      assert.equal(res3.ok, false);
      if (!res3.ok) assert.equal(res3.reason, "MALFORMED_INPUT");
    });
  });

  describe("transitionLinkFailureStatus Pure Function (Pure Purity & Determinism)", () => {
    it("returns deterministic identical values for identical inputs (pure function test)", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });
      const context = {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
        attemptedAt: "2026-08-06T12:00:00.000Z",
      };

      const res1 = transitionLinkFailureStatus(failure, "Retrying", context);
      const res2 = transitionLinkFailureStatus(failure, "Retrying", context);

      assert.deepEqual(res1, res2);
    });

    it("rejects missing attemptedAt for Open -> Retrying transition", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });
      const res = transitionLinkFailureStatus(failure, "Retrying", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
      });
      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "MALFORMED_INPUT");
      }
    });

    it("rejects missing attemptedAt for Retrying -> Open transition", () => {
      const failure = createSyntheticLinkFailure({
        status: "Retrying",
        lastAttemptAt: "2026-08-06T11:00:00.000Z",
        version: 2,
      });
      const res = transitionLinkFailureStatus(failure, "Open", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 2,
      });
      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "MALFORMED_INPUT");
      }
    });

    it("rejects missing resolvedAt for Retrying -> Resolved transition", () => {
      const failure = createSyntheticLinkFailure({
        status: "Retrying",
        lastAttemptAt: "2026-08-06T11:00:00.000Z",
        version: 2,
      });
      const res = transitionLinkFailureStatus(failure, "Resolved", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 2,
      });
      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "MALFORMED_INPUT");
      }
    });

    it("rejects missing abandonedAt for Open -> Abandoned transition", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });
      const res = transitionLinkFailureStatus(failure, "Abandoned", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
        abandonedReason: "LINK_MAX_RETRIES_EXCEEDED",
      });
      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "MALFORMED_INPUT");
      }
    });

    it("returns MALFORMED_INPUT for null or undefined context", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });
      const res1 = transitionLinkFailureStatus(failure, "Retrying", undefined);
      assert.equal(res1.ok, false);
      if (!res1.ok) assert.equal(res1.reason, "MALFORMED_INPUT");

      const res2 = transitionLinkFailureStatus(failure, "Retrying", null);
      assert.equal(res2.ok, false);
      if (!res2.ok) assert.equal(res2.reason, "MALFORMED_INPUT");

      const res3 = transitionLinkFailureStatus(failure, "Retrying", []);
      assert.equal(res3.ok, false);
      if (!res3.ok) assert.equal(res3.reason, "MALFORMED_INPUT");
    });
  });
});
