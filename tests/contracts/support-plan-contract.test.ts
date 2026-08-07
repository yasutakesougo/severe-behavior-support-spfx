import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { SupportPlan } from "../../src/domain";
import { validateSupportPlan, validateSupportPlanVersion } from "../../src/domain";
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
  it("正常なDraftを受理する", () => {
    const draft = createSyntheticDraftPlan();
    assert.equal(validateSupportPlan(draft), true);
  });

  it("正常なPendingReviewを受理する", () => {
    const pending = createSyntheticPendingReviewPlan();
    assert.equal(validateSupportPlan(pending), true);
  });

  it("正常なReturnedを受理する", () => {
    const returned = createSyntheticReturnedPlan();
    assert.equal(validateSupportPlan(returned), true);
  });

  it("正常なActiveを受理する", () => {
    const active = createSyntheticActivePlan();
    assert.equal(validateSupportPlan(active), true);
  });

  it("完全な差戻し履歴を持つ正常なActiveを受理する", () => {
    const activeWithReturnHistory = createSyntheticActivePlan({
      returnedBy: "synthetic-manager-001",
      returnedAt: "2026-08-06T12:00:00.000Z",
      returnReasonCode: "SYNTHETIC_REASON_REVISE_GOALS",
      returnReasonText: "synthetic return text detail",
    } as unknown as Partial<SupportPlan>);
    assert.equal(validateSupportPlan(activeWithReturnHistory), true);
  });

  it("正常なClosedを受理する", () => {
    const closed = createSyntheticClosedPlan();
    assert.equal(validateSupportPlan(closed), true);
  });

  it("PendingReviewでsubmittedBy欠損を拒否する", () => {
    const pendingNoSubmittedBy = createSyntheticPendingReviewPlan({
      submittedBy: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(pendingNoSubmittedBy), false);
  });

  it("PendingReviewでsubmittedAt欠損を拒否する", () => {
    const pendingNoSubmittedAt = createSyntheticPendingReviewPlan({
      submittedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(pendingNoSubmittedAt), false);
  });

  it("ReturnedのreturnedBy欠損を拒否する", () => {
    const returnedNoRetBy = createSyntheticReturnedPlan({
      returnedBy: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(returnedNoRetBy), false);
  });

  it("ReturnedのreturnedAt欠損を拒否する", () => {
    const returnedNoRetAt = createSyntheticReturnedPlan({
      returnedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(returnedNoRetAt), false);
  });

  it("ReturnedでreturnReasonCode欠損を拒否する", () => {
    const returnedNoReason = createSyntheticReturnedPlan({
      returnReasonCode: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(returnedNoReason), false);
  });

  it("ActiveでapprovedBy欠損を拒否する", () => {
    const activeNoApprovedBy = createSyntheticActivePlan({
      approvedBy: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeNoApprovedBy), false);
  });

  it("ActiveでapprovedAt欠損を拒否する", () => {
    const activeNoApprovedAt = createSyntheticActivePlan({
      approvedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeNoApprovedAt), false);
  });

  it("ActiveでeffectiveFrom欠損を拒否する", () => {
    const activeNoEffectiveFrom = createSyntheticActivePlan({
      effectiveFrom: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeNoEffectiveFrom), false);
  });

  it("ActiveのsubmittedBy欠損を拒否する", () => {
    const activeNoSubBy = createSyntheticActivePlan({
      submittedBy: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeNoSubBy), false);
  });

  it("ActiveのsubmittedAt欠損を拒否する", () => {
    const activeNoSubAt = createSyntheticActivePlan({
      submittedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeNoSubAt), false);
  });

  it("ActiveのsubmittedByだけを拒否する", () => {
    const activeSubByOnly = createSyntheticActivePlan({
      submittedBy: "synthetic-staff-001",
      submittedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(activeSubByOnly), false);
  });

  it("ActiveのsubmittedAtだけを拒否する", () => {
    const activeSubAtOnly = createSyntheticActivePlan({
      submittedBy: undefined as unknown as string,
      submittedAt: "2026-08-06T11:00:00.000Z",
    });
    assert.equal(validateSupportPlan(activeSubAtOnly), false);
  });

  it("ActiveのreturnedByだけを拒否する", () => {
    const activeRetByOnly = createSyntheticActivePlan({
      returnedBy: "synthetic-manager-001",
    } as unknown as Partial<SupportPlan>);
    assert.equal(validateSupportPlan(activeRetByOnly), false);
  });

  it("ActiveのreturnedAtだけを拒否する", () => {
    const activeRetAtOnly = createSyntheticActivePlan({
      returnedAt: "2026-08-06T12:00:00.000Z",
    } as unknown as Partial<SupportPlan>);
    assert.equal(validateSupportPlan(activeRetAtOnly), false);
  });

  it("ActiveのreturnReasonCodeだけを拒否する", () => {
    const activeRetCodeOnly = createSyntheticActivePlan({
      returnReasonCode: "SYNTHETIC_REASON_REVISE_GOALS",
    } as unknown as Partial<SupportPlan>);
    assert.equal(validateSupportPlan(activeRetCodeOnly), false);
  });

  it("Closedのpartially presented submission historyを拒否する", () => {
    const closedSubByOnly = createSyntheticClosedPlan({
      submittedBy: "synthetic-staff-001",
      submittedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(closedSubByOnly), false);
  });

  it("Closedのpartially presented return historyを拒否する", () => {
    const closedRetByOnly = createSyntheticClosedPlan({
      returnedBy: "synthetic-manager-001",
    } as unknown as Partial<SupportPlan>);
    assert.equal(validateSupportPlan(closedRetByOnly), false);
  });

  it("ClosedでclosedBy欠損を拒否する", () => {
    const closedNoClosedBy = createSyntheticClosedPlan({
      closedBy: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(closedNoClosedBy), false);
  });

  it("ClosedでclosedAt欠損を拒否する", () => {
    const closedNoClosedAt = createSyntheticClosedPlan({
      closedAt: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(closedNoClosedAt), false);
  });

  it("ClosedでeffectiveTo欠損を拒否する", () => {
    const closedNoEffectiveTo = createSyntheticClosedPlan({
      effectiveTo: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(closedNoEffectiveTo), false);
  });

  it("ClosedでcloseReasonCode欠損を拒否する", () => {
    const closedNoReason = createSyntheticClosedPlan({
      closeReasonCode: undefined as unknown as string,
    });
    assert.equal(validateSupportPlan(closedNoReason), false);
  });

  it("returnReasonTextの空文字を拒否する", () => {
    const returnedEmptyText = createSyntheticReturnedPlan({
      returnReasonText: "",
    });
    assert.equal(validateSupportPlan(returnedEmptyText), false);
  });

  it("returnReasonTextの空白だけを拒否する", () => {
    const returnedWhitespaceText = createSyntheticReturnedPlan({
      returnReasonText: "   ",
    });
    assert.equal(validateSupportPlan(returnedWhitespaceText), false);
  });

  it("closeReasonTextの空文字を拒否する", () => {
    const closedEmptyText = createSyntheticClosedPlan({
      closeReasonText: "",
    });
    assert.equal(validateSupportPlan(closedEmptyText), false);
  });

  it("closeReasonTextの空白だけを拒否する", () => {
    const closedWhitespaceText = createSyntheticClosedPlan({
      closeReasonText: "   ",
    });
    assert.equal(validateSupportPlan(closedWhitespaceText), false);
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

  it("SupportPlanVersion.versionの小数を拒否する", () => {
    const versionFloat = createSyntheticPlanVersion1({
      version: 1.2,
    });
    assert.equal(validateSupportPlanVersion(versionFloat), false);
  });

  it("SupportPlanVersion.versionの負数を拒否する", () => {
    const versionNegative = createSyntheticPlanVersion1({
      version: -1,
    });
    assert.equal(validateSupportPlanVersion(versionNegative), false);
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
