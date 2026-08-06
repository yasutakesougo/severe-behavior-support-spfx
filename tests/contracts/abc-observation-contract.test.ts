import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validateAbcRecord,
  validateObservation,
  validateLinkFailure,
  isReasonCode,
  isValidIsoDateTime,
} from "../../src/domain";
import {
  createSyntheticAbcRecord,
  createSyntheticObservation,
  createSyntheticLinkFailure,
} from "../domain/abc-observation-fixtures";

describe("ABC and Observation Contract Validation", () => {
  describe("AbcRecord Contract", () => {
    it("accepts valid ABC record structure with AbcIntensity object", () => {
      const record = createSyntheticAbcRecord();
      assert.equal(validateAbcRecord(record), true);
    });

    it("rejects record when intensity scaleCode or value is invalid", () => {
      const record1 = createSyntheticAbcRecord({
        intensity: { scaleCode: "", value: 3 },
      });
      assert.equal(validateAbcRecord(record1), false);

      const record2 = createSyntheticAbcRecord({
        intensity: { scaleCode: "SCALE", value: NaN },
      });
      assert.equal(validateAbcRecord(record2), false);
    });

    it("rejects record when occurredAt is invalid date format", () => {
      const record1 = createSyntheticAbcRecord({ occurredAt: "2026-02-31T10:00:00Z" });
      assert.equal(validateAbcRecord(record1), false);

      const record2 = createSyntheticAbcRecord({ occurredAt: "invalid-date" });
      assert.equal(validateAbcRecord(record2), false);

      const record3 = createSyntheticAbcRecord({ occurredAt: "2026-08-06" }); // missing time
      assert.equal(validateAbcRecord(record3), false);
    });

    it("rejects record when antecedent is missing or empty", () => {
      const record = createSyntheticAbcRecord({ antecedent: "   " });
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects record when behavior is missing or empty", () => {
      const record = createSyntheticAbcRecord({ behavior: "" });
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects record when aftermath is missing or empty", () => {
      const record = createSyntheticAbcRecord({ aftermath: "" });
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects record when UserId is empty", () => {
      const record = createSyntheticAbcRecord({ UserId: "" });
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects record when SiteId is empty", () => {
      const record = createSyntheticAbcRecord({ SiteId: "" });
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects record when recordedBy is empty", () => {
      const record = createSyntheticAbcRecord({ recordedBy: "" });
      assert.equal(validateAbcRecord(record), false);
    });

    it("allows Saved status with Failed linkState simultaneously", () => {
      const record = createSyntheticAbcRecord({
        saveState: { status: "Saved" },
        linkState: {
          status: "Failed",
          sourceContext: {
            sourceType: "synthetic-app",
            sourceReferenceId: "ref-123",
          },
        },
      });
      assert.equal(validateAbcRecord(record), true);
    });

    it("allows NotRequired linkState without sourceContext", () => {
      const record = createSyntheticAbcRecord({
        linkState: { status: "NotRequired" },
      });
      assert.equal(validateAbcRecord(record), true);
    });

    it("allows Pending linkState with sourceContext", () => {
      const record = createSyntheticAbcRecord({
        linkState: {
          status: "Pending",
          sourceContext: {
            sourceType: "synthetic-app",
            sourceReferenceId: "ref-123",
          },
        },
      });
      assert.equal(validateAbcRecord(record), true);
    });

    it("rejects NotRequired linkState when sourceContext is present", () => {
      const record = {
        ...createSyntheticAbcRecord(),
        linkState: {
          status: "NotRequired",
          sourceContext: {
            sourceType: "synthetic-app",
            sourceReferenceId: "ref-123",
          },
        },
      };
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects Pending linkState when sourceContext is missing", () => {
      const record = {
        ...createSyntheticAbcRecord(),
        linkState: {
          status: "Pending",
        },
      };
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects Deleted saveState missing deletedBy", () => {
      const record = {
        ...createSyntheticAbcRecord(),
        saveState: {
          status: "Deleted",
          deletedAt: "2026-08-06T12:00:00.000Z",
          deletionReason: "synthetic reason",
        },
      };
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects Deleted saveState with invalid deletedAt date", () => {
      const record = {
        ...createSyntheticAbcRecord(),
        saveState: {
          status: "Deleted",
          deletedBy: "synthetic-user",
          deletedAt: "2026-02-31T12:00:00.000Z",
          deletionReason: "synthetic reason",
        },
      };
      assert.equal(validateAbcRecord(record), false);
    });

    it("rejects Deleted saveState missing deletionReason", () => {
      const record = {
        ...createSyntheticAbcRecord(),
        saveState: {
          status: "Deleted",
          deletedBy: "synthetic-user",
          deletedAt: "2026-08-06T12:00:00.000Z",
        },
      };
      assert.equal(validateAbcRecord(record), false);
    });
  });

  describe("Observation Contract", () => {
    it("accepts valid Observation structure without correction", () => {
      const obs = createSyntheticObservation();
      assert.equal(validateObservation(obs), true);
    });

    it("accepts valid Observation structure with complete correction", () => {
      const obs = createSyntheticObservation({
        correctionOf: "synthetic-obs-old-001",
        correctionReason: "synthetic correction detail",
      });
      assert.equal(validateObservation(obs), true);
    });

    it("rejects Observation with invalid observedAt date", () => {
      const obs = createSyntheticObservation({ observedAt: "2026-13-01T10:00:00Z" });
      assert.equal(validateObservation(obs), false);
    });

    it("rejects Observation when only correctionOf is provided", () => {
      const obs = {
        ...createSyntheticObservation(),
        correctionOf: "synthetic-obs-old-001",
      };
      assert.equal(validateObservation(obs), false);
    });

    it("rejects Observation when only correctionReason is provided", () => {
      const obs = {
        ...createSyntheticObservation(),
        correctionReason: "synthetic correction detail",
      };
      assert.equal(validateObservation(obs), false);
    });
  });

  describe("LinkFailure Contract and ReasonCode Validation", () => {
    it("accepts valid LinkFailure structure with valid reasonCode", () => {
      const failure = createSyntheticLinkFailure({ reasonCode: "LINK_TARGET_NOT_FOUND" });
      assert.equal(validateLinkFailure(failure), true);
    });

    it("validates isReasonCode strictly for UPPERCASE_CODE format", () => {
      assert.equal(isReasonCode("LINK_TARGET_NOT_FOUND"), true);
      assert.equal(isReasonCode("LINK_VERSION_CONFLICT"), true);
      assert.equal(isReasonCode("利用者○○さんの支援記録を保存できなかった"), false);
      assert.equal(isReasonCode("LINK TARGET NOT FOUND"), false); // spaces
      assert.equal(isReasonCode("synthetic-invalid-email-pattern"), false);
    });

    it("rejects LinkFailure when reasonCode is free text / PII", () => {
      const failure = createSyntheticLinkFailure({
        reasonCode: "利用者○○さんの支援記録を保存できなかった",
      });
      assert.equal(validateLinkFailure(failure), false);
    });

    it("rejects LinkFailure when correlationId is missing", () => {
      const failure = {
        ...createSyntheticLinkFailure(),
        correlationId: "",
      };
      assert.equal(validateLinkFailure(failure), false);
    });

    it("rejects LinkFailure when retryCount is negative", () => {
      const failure = createSyntheticLinkFailure({ retryCount: -1 });
      assert.equal(validateLinkFailure(failure), false);
    });

    it("rejects LinkFailure when retryCount is non-integer", () => {
      const failure = createSyntheticLinkFailure({ retryCount: 1.5 });
      assert.equal(validateLinkFailure(failure), false);
    });

    it("rejects LinkFailure when status is unknown", () => {
      const failure = {
        ...createSyntheticLinkFailure(),
        status: "UNKNOWN_STATUS" as any,
      };
      assert.equal(validateLinkFailure(failure), false);
    });

    it("rejects LinkFailure containing unallowed extra properties", () => {
      const failure = {
        ...createSyntheticLinkFailure(),
        extraProp: "unallowed",
      };
      assert.equal(validateLinkFailure(failure), false);
    });

    it("rejects LinkFailure containing support text property (PII protection)", () => {
      const failure = {
        ...createSyntheticLinkFailure(),
        supportText: "synthetic support details",
      };
      assert.equal(validateLinkFailure(failure), false);
    });

    it("rejects LinkFailure containing secrets/tokens property", () => {
      const failure = {
        ...createSyntheticLinkFailure(),
        secret: "synthetic-token-secret",
      };
      assert.equal(validateLinkFailure(failure), false);
    });
  });

  describe("Date Validation Helper isValidIsoDateTime", () => {
    it("validates valid ISO-8601 strings", () => {
      assert.equal(isValidIsoDateTime("2026-08-06T10:00:00.000Z"), true);
      assert.equal(isValidIsoDateTime("2026-08-06T10:00:00Z"), true);
      assert.equal(isValidIsoDateTime("2026-08-06T19:00:00+09:00"), true);
    });

    it("rejects invalid dates and date-only strings", () => {
      assert.equal(isValidIsoDateTime("2026-02-31T10:00:00Z"), false);
      assert.equal(isValidIsoDateTime("2026-13-01T10:00:00Z"), false);
      assert.equal(isValidIsoDateTime("invalid-date"), false);
      assert.equal(isValidIsoDateTime(""), false);
      assert.equal(isValidIsoDateTime("2026-08-06"), false);
    });
  });
});
