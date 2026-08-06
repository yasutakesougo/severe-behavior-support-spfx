import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  SupportPlan,
  validateSupportPlan,
  validateSupportPlanVersion,
} from "../../src/domain";
import {
  createSyntheticDraftPlan,
  createSyntheticPendingReviewPlan,
  createSyntheticReturnedPlan,
  createSyntheticActivePlan,
  createSyntheticClosedPlan,
  createSyntheticPlanVersion1,
  createSyntheticPlanVersion2,
} from "../domain/support-plan-fixtures";

describe("SupportPlan Contract & Fail-Closed Validation", () => {
  it("Draftの最小構造を受理する", () => {
    const draft = createSyntheticDraftPlan();
    assert.equal(validateSupportPlan(draft), true);
  });

  it("PendingReviewでsubmittedByを必須とする", () => {
    const pendingNoSubmittedBy = createSyntheticPendingReviewPlan({
      submittedBy: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(pendingNoSubmittedBy), false);
  });

  it("PendingReviewでsubmittedAtを必須とする", () => {
    const pendingNoSubmittedAt = createSyntheticPendingReviewPlan({
      submittedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(pendingNoSubmittedAt), false);
  });

  it("ReturnedでreturnReasonCodeを必須とする", () => {
    const returnedNoReason = createSyntheticReturnedPlan({
      returnReasonCode: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(returnedNoReason), false);
  });

  it("ActiveでapprovedByを必須とする", () => {
    const activeNoApprovedBy = createSyntheticActivePlan({
      approvedBy: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeNoApprovedBy), false);
  });

  it("ActiveでapprovedAtを必須とする", () => {
    const activeNoApprovedAt = createSyntheticActivePlan({
      approvedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeNoApprovedAt), false);
  });

  it("ActiveでeffectiveFromを必須とする", () => {
    const activeNoEffectiveFrom = createSyntheticActivePlan({
      effectiveFrom: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeNoEffectiveFrom), false);
  });

  it("ClosedでclosedAtを必須とする", () => {
    const closedNoClosedAt = createSyntheticClosedPlan({
      closedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(closedNoClosedAt), false);
  });

  it("ClosedでcloseReasonCodeを必須とする", () => {
    const closedNoReason = createSyntheticClosedPlan({
      closeReasonCode: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(closedNoReason), false);
  });

  it("currentVersion 0を拒否する", () => {
    const invalidCurrentVer = createSyntheticDraftPlan({
      currentVersion: 0,
    });
    assert.equal(validateSupportPlan(invalidCurrentVer), false);
  });

  it("currentVersionの小数を拒否する", () => {
    const floatCurrentVer = createSyntheticDraftPlan({
      currentVersion: 1.5,
    });
    assert.equal(validateSupportPlan(floatCurrentVer), false);
  });

  it("未知statusを拒否する", () => {
    const unknownStatus = createSyntheticDraftPlan({
      status: "UnknownState" as unknown as "Draft",
    });
    assert.equal(validateSupportPlan(unknownStatus), false);
  });

  it("UserIdとSiteIdを別項目として必須化する", () => {
    const noUserId = createSyntheticDraftPlan({
      UserId: "",
    });
    const noSiteId = createSyntheticDraftPlan({
      SiteId: "",
    });
    assert.equal(validateSupportPlan(noUserId), false);
    assert.equal(validateSupportPlan(noSiteId), false);
  });

  it("OrganizationId不在を拒否する", () => {
    const noOrgId = createSyntheticDraftPlan({
      OrganizationId: "",
    });
    assert.equal(validateSupportPlan(noOrgId), false);
  });

  it("DraftにapprovedByやsubmittedAtが存在する場合に拒否する", () => {
    const draftWithApprovedBy = createSyntheticDraftPlan({
      approvedBy: "synthetic-staff-001",
    } as unknown as Partial<SupportPlan>);
    assert.equal(validateSupportPlan(draftWithApprovedBy), false);
  });

  it("ClosedでeffectiveToがeffectiveFromより前の日付の場合に拒否する", () => {
    const invalidDatesClosed = createSyntheticClosedPlan({
      effectiveFrom: "2026-09-01T10:00:00.000Z",
      effectiveTo: "2026-08-01T10:00:00.000Z",
    });
    assert.equal(validateSupportPlan(invalidDatesClosed), false);
  });

  it("不正ISO日時を拒否する", () => {
    const invalidDate = createSyntheticDraftPlan({
      createdAt: "2026-08-06 10:00:00",
    });
    assert.equal(validateSupportPlan(invalidDate), false);
  });

  it("空文字を拒否する", () => {
    const emptyPlanId = createSyntheticDraftPlan({
      PlanId: "   ",
    });
    assert.equal(validateSupportPlan(emptyPlanId), false);
  });
});

describe("SupportPlanVersion Contract Validation", () => {
  it("SupportPlanVersionのplanIdを必須化する", () => {
    const noPlanId = createSyntheticPlanVersion1({
      planId: "",
    });
    assert.equal(validateSupportPlanVersion(noPlanId), false);
  });

  it("SupportPlanVersionのversion 0を拒否する", () => {
    const versionZero = createSyntheticPlanVersion1({
      version: 0,
    });
    assert.equal(validateSupportPlanVersion(versionZero), false);
  });

  it("同一planIdでも異なるversionを表現できる", () => {
    const v1 = createSyntheticPlanVersion1();
    const v2 = createSyntheticPlanVersion2();
    assert.equal(validateSupportPlanVersion(v1), true);
    assert.equal(validateSupportPlanVersion(v2), true);
    assert.equal(v1.planId, v2.planId);
    assert.notEqual(v1.version, v2.version);
  });

  it("SharePoint固有項目を契約へ含めない (PnPjs / List Internal Name check)", () => {
    const v1 = createSyntheticPlanVersion1();
    const keys = Object.keys(v1);
    assert.equal(keys.includes("Title"), false);
    assert.equal(keys.includes("OData__ColorTag"), false);
    assert.equal(keys.includes("ID"), false);
  });
});
