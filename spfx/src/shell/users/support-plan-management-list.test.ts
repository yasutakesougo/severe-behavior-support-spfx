import {
  DEMO_KPI_FAMILY_P_NOTE,
  SUPPORT_PLAN_MANAGEMENT_CREATE_NOTE,
  SUPPORT_PLAN_MANAGEMENT_FORBIDDEN_EXPIRY_TOKENS,
  SUPPORT_PLAN_MANAGEMENT_FORBIDDEN_STATUS_TOKENS,
  SUPPORT_PLAN_MANAGEMENT_HEADING,
  SUPPORT_PLAN_MANAGEMENT_KPI_LABELS,
  SUPPORT_PLAN_MANAGEMENT_SYNTHETIC_DETAIL_NOTE,
  SUPPORT_PLAN_MANAGEMENT_WORK_STATE_LABELS,
  formatFamilyPCountLabel,
  formatSupportPlanManagementReviewWindowLabel,
  supportPlanManagementCopyAvoidsExpiryMeaning,
  supportPlanManagementCopyAvoidsFinalApprovalMeaning,
  supportPlanManagementCopyIsFailClosed,
} from "./support-plan-management-list-copy";
import {
  SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE,
  SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE,
} from "./support-plan-management-list-fixture";
import {
  buildFamilyPCountLabels,
  buildFamilyPCounts,
  selectPlannerListPrimaryActionUserId,
  selectTodayActionRows,
} from "./support-plan-management-list-kpi";
import { resolveSupportPlanManagementListNext } from "./support-plan-management-list-nav";
import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";

describe("SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1 fixture", () => {
  it("covers the five locked work states without inventing Schema statuses", () => {
    const states = SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows.map((row) => row.workState);
    expect(states).toEqual([
      "active",
      "review_window",
      "observation_check",
      "procedure_updating",
      "uncreated",
    ]);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.heading).toBe(SUPPORT_PLAN_MANAGEMENT_HEADING);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows[0]?.userId).toBe(
      DEMO_UX_SUPPORT_PLAN_FIXTURE.userId,
    );
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows[0]?.currentVersionLabel).toContain("v3");
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows[4]?.actionKind).toBe("create");
  });

  it("derives Family P KPI counts from fixture rows instead of hardcoding", () => {
    const counts = buildFamilyPCounts(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows);
    const needsActionRows = SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows.filter(
      (row) => row.attentionKind === "needs_action",
    );
    expect(counts.needs_action).toBe(needsActionRows.length);
    expect(counts.review_window).toBe(1);
    expect(counts.observation_wait).toBe(1);
    expect(counts.needs_action).toBe(2);
    const labels = buildFamilyPCountLabels(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows);
    expect(labels.needsActionLabel).toBe(
      formatFamilyPCountLabel(SUPPORT_PLAN_MANAGEMENT_KPI_LABELS.needs_action, 2),
    );
    expect(DEMO_KPI_FAMILY_P_NOTE).toContain(
      "利用者一覧の要確認/未記録/期限接近とは対象が異なります",
    );
  });

  it("builds 今日やること from non-empty 要対応 rows", () => {
    const today = selectTodayActionRows(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows);
    expect(today.map((row) => row.userId)).toEqual(["user-b", "user-c", "user-d", "user-e"]);
    expect(today.every((row) => row.attentionKind !== "none")).toBe(true);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows[0]?.attentionLabel).toBe("");
  });

  it("selects one SBS_ACTION.primary from 今日やること without mixing EMPHASIS names", () => {
    const rows = SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows;
    const today = selectTodayActionRows(rows);
    expect(selectPlannerListPrimaryActionUserId(today, rows)).toBe("user-b");
    expect(selectPlannerListPrimaryActionUserId([], rows)).toBe("user-a");
  });

  it("keeps 状態 and 要対応 on separate channels", () => {
    const procedureUpdating = SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows.find(
      (row) => row.workState === "procedure_updating",
    );
    expect(procedureUpdating?.workStateLabel).toBe(
      SUPPORT_PLAN_MANAGEMENT_WORK_STATE_LABELS.procedure_updating,
    );
    expect(procedureUpdating?.attentionLabel).toBe("手順の更新確認");
    expect(procedureUpdating?.workStateLabel).not.toBe(procedureUpdating?.attentionLabel);
  });

  it("expresses review as a month guide and not a 90-day expiry", () => {
    expect(formatSupportPlanManagementReviewWindowLabel("2026/09")).toBe("見直し目安: 2026/09");
    const joined = SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows
      .map((row) => row.reviewWindowLabel)
      .join(" ");
    expect(supportPlanManagementCopyAvoidsExpiryMeaning(joined)).toBe(true);
    expect(SUPPORT_PLAN_MANAGEMENT_FORBIDDEN_EXPIRY_TOKENS).toEqual(["90日", "失効"]);
  });

  it("does not add statutory approval labels", () => {
    const joined = JSON.stringify(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE);
    expect(supportPlanManagementCopyAvoidsFinalApprovalMeaning(joined)).toBe(true);
    expect(SUPPORT_PLAN_MANAGEMENT_FORBIDDEN_STATUS_TOKENS).toEqual(["最終承認者", "承認済み"]);
    expect(supportPlanManagementCopyIsFailClosed(SUPPORT_PLAN_MANAGEMENT_CREATE_NOTE)).toBe(true);
    expect(
      supportPlanManagementCopyIsFailClosed(SUPPORT_PLAN_MANAGEMENT_SYNTHETIC_DETAIL_NOTE),
    ).toBe(true);
  });

  it("routes Aさん to existing SupportPlan and others to demo-only next surfaces", () => {
    const [active, review, observation, updating, uncreated] =
      SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows;
    expect(resolveSupportPlanManagementListNext(active, "user-a")).toEqual({
      kind: "existing-plan",
      userId: "user-a",
    });
    expect(resolveSupportPlanManagementListNext(review, "user-a")).toEqual({
      kind: "synthetic-detail",
      userId: "user-b",
    });
    expect(resolveSupportPlanManagementListNext(observation, "user-a")).toEqual({
      kind: "synthetic-detail",
      userId: "user-c",
    });
    expect(resolveSupportPlanManagementListNext(updating, "user-a")).toEqual({
      kind: "synthetic-detail",
      userId: "user-d",
    });
    expect(resolveSupportPlanManagementListNext(uncreated, "user-a")).toEqual({
      kind: "create",
      userId: "user-e",
    });
  });

  it("does not authorize live I/O, mutation, schema, or FIELD_STAFF save changes", () => {
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.id).toBe(
      "SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1",
    );
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.presentationOnly).toBe(true);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.plannerUsersDestinationListAuthorized).toBe(
      true,
    );
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.liveWriteAuthorized).toBe(false);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.planMutationAuthorized).toBe(false);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.schemaChangeAuthorized).toBe(false);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.statusTransitionAuthorized).toBe(false);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.fieldStaffUsersListChangeAuthorized).toBe(
      false,
    );
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(
      false,
    );
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.primaryNavExpansionAuthorized).toBe(false);
    expect(SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.deployAuthorized).toBe(false);
  });
});
