import {
  MANAGEMENT_HOME_CONFIRMED_NONE_INPUT,
  MANAGEMENT_HOME_CONFIRMED_NONE_MODEL,
  MANAGEMENT_HOME_FULLY_RESOLVED_INPUT,
  MANAGEMENT_HOME_FULLY_RESOLVED_MODEL,
  MANAGEMENT_HOME_MISMATCH_MODEL,
  MANAGEMENT_HOME_UNAVAILABLE_MODEL,
} from "./management-home-fixture";
import { buildManagementHomeReadModel } from "./management-home-read-model";

describe("SBS-MGMT-HOME-C read model", () => {
  it("uses SupportPlan.currentVersion as the only applied-version authority", () => {
    const model = MANAGEMENT_HOME_FULLY_RESOLVED_MODEL;
    expect(model.currentVersion).toBe(3);
    expect(model.draft.status).toBe("RESOLVED");
    if (model.draft.status === "RESOLVED") {
      expect(model.draft.value.candidate.version).toBe(4);
    }
    expect(model.nextAction.status).toBe("RESOLVED");
    if (model.nextAction.status === "RESOLVED") {
      expect(model.nextAction.label).toContain("未適用");
    }
  });

  it("does not reinterpret CONSUMED RevisionIntent as applied", () => {
    const model = MANAGEMENT_HOME_FULLY_RESOLVED_MODEL;
    expect(model.revisionIntent.status).toBe("RESOLVED");
    if (model.revisionIntent.status === "RESOLVED") {
      expect(model.revisionIntent.value.status).toBe("CONSUMED");
    }
    expect(model.currentVersion).toBe(3);
    expect(model.activationReceipt.status).toBe("CONFIRMED_NONE");
  });

  it("keeps confirmed zero records separate from source unavailable", () => {
    const confirmedNone = MANAGEMENT_HOME_CONFIRMED_NONE_MODEL;
    expect(confirmedNone.monitoring.status).toBe("RESOLVED");
    if (confirmedNone.monitoring.status === "RESOLVED") {
      expect(confirmedNone.monitoring.value.recordCount).toBe(0);
    }
    expect(confirmedNone.review.status).toBe("CONFIRMED_NONE");

    const unavailable = MANAGEMENT_HOME_UNAVAILABLE_MODEL;
    expect(unavailable.monitoring.status).toBe("UNAVAILABLE");
    expect(unavailable.nextAction.status).toBe("UNAVAILABLE");
  });

  it("fails closed on cross-source identity mismatch", () => {
    expect(MANAGEMENT_HOME_MISMATCH_MODEL.status).toBe("PARTIAL");
    expect(MANAGEMENT_HOME_MISMATCH_MODEL.draft.status).toBe("UNAVAILABLE");
    expect(MANAGEMENT_HOME_MISMATCH_MODEL.nextAction.status).toBe("UNAVAILABLE");
  });

  it("does not turn receipt unavailability into not-applied semantics", () => {
    const model = buildManagementHomeReadModel({
      ...MANAGEMENT_HOME_FULLY_RESOLVED_INPUT,
      activationReceipt: { status: "UNAVAILABLE", reason: "RECEIPT_SOURCE_UNAVAILABLE" },
    });
    expect(model.currentVersion).toBe(3);
    expect(model.draft.status).toBe("RESOLVED");
    expect(model.activationReceipt.status).toBe("UNAVAILABLE");
    expect(model.nextAction.status).toBe("UNAVAILABLE");
  });

  it("preserves NO_CHANGE as the human decision without creating revision state", () => {
    const reviewSource = MANAGEMENT_HOME_FULLY_RESOLVED_INPUT.review;
    expect(reviewSource.status).toBe("RESOLVED");
    if (reviewSource.status !== "RESOLVED" || reviewSource.value === null) {
      return;
    }
    const model = buildManagementHomeReadModel({
      ...MANAGEMENT_HOME_CONFIRMED_NONE_INPUT,
      review: {
        status: "RESOLVED",
        value: {
          outcome: { ...reviewSource.value.outcome, decision: "NO_CHANGE" },
          decisionReason: null,
        },
      },
    });
    expect(model.review.status).toBe("RESOLVED");
    if (model.review.status === "RESOLVED") {
      expect(model.review.value.outcome.decision).toBe("NO_CHANGE");
    }
    expect(model.revisionIntent.status).toBe("CONFIRMED_NONE");
    expect(model.draft.status).toBe("CONFIRMED_NONE");
  });

  it("keeps review unavailable distinct from confirmed no review", () => {
    const model = buildManagementHomeReadModel({
      ...MANAGEMENT_HOME_CONFIRMED_NONE_INPUT,
      review: { status: "UNAVAILABLE", reason: "REVIEW_SOURCE_UNAVAILABLE" },
    });
    expect(model.review.status).toBe("UNAVAILABLE");
    expect(model.nextAction.status).toBe("UNAVAILABLE");
  });
});
