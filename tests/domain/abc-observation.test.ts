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

    it("does not mutate original record input on transition failure", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const originalVersion = record.version;
      const res = transitionSaveState(record, "Deleted", {
        expectedVersion: 999, // mismatch
      });

      assert.equal(res.ok, false);
      assert.equal(record.version, originalVersion);
    });

    it("rejects expectedVersion mismatch with VERSION_CONFLICT", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionSaveState(record, "Deleted", {
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

    it("rejects invalid expectedVersion type with MALFORMED_INPUT", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionSaveState(record, "Deleted", {
        deletedBy: "synthetic-staff-001",
        deletedAt: "2026-08-06T12:00:00.000Z",
        deletionReason: "synthetic reason",
        expectedVersion: "invalid" as any,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "MALFORMED_INPUT");
      }
    });

    it("rejects Deleted -> Saved transition", () => {
      const record = createSyntheticAbcRecord({
        saveState: {
          status: "Deleted",
          deletedBy: "synthetic-staff-001",
          deletedAt: "2026-08-06T12:00:00.000Z",
          deletionReason: "synthetic deletion reason",
        },
        version: 2,
      });

      const res = transitionSaveState(record, "Saved", {
        expectedVersion: 2,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "INVALID_TRANSITION");
      }
    });

    it("rejects Deleted -> Deleted transition", () => {
      const record = createSyntheticAbcRecord({
        saveState: {
          status: "Deleted",
          deletedBy: "synthetic-staff-001",
          deletedAt: "2026-08-06T12:00:00.000Z",
          deletionReason: "synthetic deletion reason",
        },
        version: 2,
      });

      const res = transitionSaveState(record, "Deleted", {
        deletedBy: "synthetic-staff-002",
        deletedAt: "2026-08-06T13:00:00.000Z",
        deletionReason: "another reason",
        expectedVersion: 2,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "INVALID_TRANSITION");
      }
    });
  });

  describe("transitionLinkState Pure Function", () => {
    it("allows Pending -> Linked transition", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionLinkState(record, "Linked", { expectedVersion: 1 });

      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.value.linkState.status, "Linked");
        assert.equal(res.value.version, 2);
      }
    });

    it("does not mutate original record input on transition failure", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const originalVersion = record.version;
      const res = transitionLinkState(record, "Linked", { expectedVersion: 999 });

      assert.equal(res.ok, false);
      assert.equal(record.version, originalVersion);
    });

    it("rejects expectedVersion mismatch with VERSION_CONFLICT", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionLinkState(record, "Linked", { expectedVersion: 5 });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "VERSION_CONFLICT");
      }
    });

    it("rejects invalid expectedVersion type with MALFORMED_INPUT", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionLinkState(record, "Linked", { expectedVersion: null });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "MALFORMED_INPUT");
      }
    });

    it("allows Pending -> Failed transition", () => {
      const record = createSyntheticAbcRecord({ version: 1 });
      const res = transitionLinkState(record, "Failed", { expectedVersion: 1 });

      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.value.linkState.status, "Failed");
        assert.equal(res.value.version, 2);
      }
    });

    it("allows Failed -> Pending transition", () => {
      const record = createSyntheticAbcRecord({
        linkState: {
          status: "Failed",
          sourceContext: {
            sourceType: "synthetic-app",
            sourceReferenceId: "ref-001",
          },
        },
        version: 2,
      });
      const res = transitionLinkState(record, "Pending", { expectedVersion: 2 });

      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.value.linkState.status, "Pending");
        assert.equal(res.value.version, 3);
      }
    });

    it("rejects Linked -> Pending transition", () => {
      const record = createSyntheticAbcRecord({
        linkState: {
          status: "Linked",
          sourceContext: {
            sourceType: "synthetic-app",
            sourceReferenceId: "ref-001",
          },
        },
        version: 2,
      });
      const res = transitionLinkState(record, "Pending", { expectedVersion: 2 });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "ALREADY_LINKED");
      }
    });

    it("rejects transition for deleted ABC record", () => {
      const record = createSyntheticAbcRecord({
        saveState: {
          status: "Deleted",
          deletedBy: "synthetic-staff-001",
          deletedAt: "2026-08-06T12:00:00.000Z",
          deletionReason: "synthetic deletion reason",
        },
        version: 2,
      });
      const res = transitionLinkState(record, "Linked", { expectedVersion: 2 });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "TARGET_DELETED");
      }
    });
  });

  describe("transitionLinkFailureStatus Pure Function", () => {
    it("allows Open -> Retrying -> Resolved transition sequence", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });

      const res1 = transitionLinkFailureStatus(failure, "Retrying", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
        attemptedAt: "2026-08-06T12:00:00.000Z",
      });

      assert.equal(res1.ok, true);
      if (!res1.ok) return;

      assert.equal(res1.value.status, "Retrying");
      assert.equal(res1.value.version, 2);

      const res2 = transitionLinkFailureStatus(res1.value, "Resolved", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 2,
        resolvedAt: "2026-08-06T12:05:00.000Z",
      });

      assert.equal(res2.ok, true);
      if (!res2.ok) return;

      assert.equal(res2.value.status, "Resolved");
      assert.equal(res2.value.version, 3);
    });

    it("does not mutate original linkFailure input on transition failure", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });
      const originalVersion = failure.version;
      const res = transitionLinkFailureStatus(failure, "Retrying", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 999, // mismatch
      });

      assert.equal(res.ok, false);
      assert.equal(failure.version, originalVersion);
    });

    it("rejects expectedVersion mismatch with VERSION_CONFLICT", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });
      const res = transitionLinkFailureStatus(failure, "Retrying", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 10,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "VERSION_CONFLICT");
      }
    });

    it("rejects invalid expectedVersion type with MALFORMED_INPUT", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });
      const res = transitionLinkFailureStatus(failure, "Retrying", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: "invalid",
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "MALFORMED_INPUT");
      }
    });

    it("increments retryCount on Retrying -> Open transition when retry fails", () => {
      const failure = createSyntheticLinkFailure({
        status: "Retrying",
        retryCount: 1,
        version: 2,
      });

      const res = transitionLinkFailureStatus(failure, "Open", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 2,
        attemptedAt: "2026-08-06T12:10:00.000Z",
      });

      assert.equal(res.ok, true);
      if (res.ok) {
        assert.equal(res.value.status, "Open");
        assert.equal(res.value.retryCount, 2);
        assert.equal(res.value.version, 3);
      }
    });

    it("requires reason code in UPPERCASE_CODE format for Open -> Abandoned transition", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });

      const noReasonRes = transitionLinkFailureStatus(failure, "Abandoned", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
      });
      assert.equal(noReasonRes.ok, false);
      if (!noReasonRes.ok) {
        assert.equal(noReasonRes.reason, "MISSING_REASON");
      }

      const freeTextReasonRes = transitionLinkFailureStatus(failure, "Abandoned", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
        abandonedReason: "利用者○○さんの記録を破棄した", // free text PII
      });
      assert.equal(freeTextReasonRes.ok, false);
      if (!freeTextReasonRes.ok) {
        assert.equal(freeTextReasonRes.reason, "MISSING_REASON");
      }

      const validReasonRes = transitionLinkFailureStatus(failure, "Abandoned", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
        abandonedReason: "LINK_ABANDONED_MAX_RETRIES",
      });
      assert.equal(validReasonRes.ok, true);
      if (validReasonRes.ok) {
        assert.equal(validReasonRes.value.status, "Abandoned");
        assert.equal(validReasonRes.value.reasonCode, "LINK_ABANDONED_MAX_RETRIES");
      }
    });

    it("rejects Resolved -> Retrying transition", () => {
      const failure = createSyntheticLinkFailure({ status: "Resolved", version: 3 });

      const res = transitionLinkFailureStatus(failure, "Retrying", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 3,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "INVALID_TRANSITION");
      }
    });

    it("rejects Abandoned -> Resolved transition", () => {
      const failure = createSyntheticLinkFailure({ status: "Abandoned", version: 2 });

      const res = transitionLinkFailureStatus(failure, "Resolved", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 2,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "INVALID_TRANSITION");
      }
    });

    it("rejects transition on OrganizationId mismatch", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });

      const res = transitionLinkFailureStatus(failure, "Retrying", {
        OrganizationId: "mismatched-org",
        SiteId: SYNTHETIC_SITE_ID,
        expectedVersion: 1,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "CONTEXT_MISMATCH");
      }
    });

    it("rejects transition on SiteId mismatch", () => {
      const failure = createSyntheticLinkFailure({ status: "Open", version: 1 });

      const res = transitionLinkFailureStatus(failure, "Retrying", {
        OrganizationId: SYNTHETIC_ORG_ID,
        SiteId: "mismatched-site",
        expectedVersion: 1,
      });

      assert.equal(res.ok, false);
      if (!res.ok) {
        assert.equal(res.reason, "CONTEXT_MISMATCH");
      }
    });
  });
});
