import { DASHBOARD_UX_OVERVIEW_FIXTURE } from "../dashboard/overview-fixture";
import { DEMO_UX_REVIEW_DUE_FIXTURE } from "../review/review-due-fixture";
import {
  USERS_FILTER_CHIP_DUE_SOON,
  USERS_FILTER_CHIP_NEEDS_REVIEW,
  USERS_FILTER_CHIP_UNRECORDED,
  filterUserRowsByStatusChip,
} from "../users/users-filter";
import { DEMO_UX_USERS_FIXTURE } from "../users/users-fixture";
import {
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
} from "./status-labels";
import {
  DEMO_KPI_FAMILY_A_NOTE,
  DEMO_KPI_FAMILY_R_NOTE,
  DEMO_KPI_FAMILY_R_USERS_NOTE,
  DEMO_UX_10_SLICE,
  buildAttentionSummaryFromItems,
  countAttentionByDueState,
  countAttentionByReviewStatus,
  countRowsWithBadgeId,
} from "./kpi-review-count";

describe("DEMO-UX-10 KPI / review count correspondence", () => {
  it("keeps Family R Overview KPI counts aligned with Users filter counts", () => {
    const rows = DEMO_UX_USERS_FIXTURE.rows;
    const needsReview = filterUserRowsByStatusChip(rows, USERS_FILTER_CHIP_NEEDS_REVIEW).length;
    const unrecorded = filterUserRowsByStatusChip(rows, USERS_FILTER_CHIP_UNRECORDED).length;
    const dueSoon = filterUserRowsByStatusChip(rows, USERS_FILTER_CHIP_DUE_SOON).length;

    expect(needsReview).toBe(3);
    expect(unrecorded).toBe(2);
    expect(dueSoon).toBe(3);

    const byId: Record<string, number> = {};
    for (const card of DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards) {
      byId[card.id] = card.count;
    }
    expect(byId.needs_review).toBe(needsReview);
    expect(byId.unrecorded).toBe(unrecorded);
    expect(byId.deadline_near).toBe(dueSoon);
    expect(countRowsWithBadgeId(rows, "needs_review")).toBe(needsReview);
    expect(countRowsWithBadgeId(rows, "unrecorded")).toBe(unrecorded);
    expect(countRowsWithBadgeId(rows, "deadline_near")).toBe(dueSoon);
  });

  it("keeps Family A Review summary consistent with attentionItems labels", () => {
    const items = DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems;
    const awaiting = countAttentionByReviewStatus(items, SHELL_STATUS_LABEL_NEEDS_REVIEW);
    const dueSoon = countAttentionByDueState(items, SHELL_STATUS_LABEL_DUE_SOON);
    const summary = buildAttentionSummaryFromItems(items);

    expect(items.map((item) => item.personLabel)).toEqual(["Aさん", "Bさん", "Cさん"]);
    expect(awaiting).toBe(3);
    expect(dueSoon).toBe(2);
    expect(summary.awaitingConfirmationCountLabel).toBe(
      DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.awaitingConfirmationCountLabel,
    );
    expect(summary.dueSoonCountLabel).toBe(
      DEMO_UX_REVIEW_DUE_FIXTURE.attentionSummary.dueSoonCountLabel,
    );
    expect(summary.awaitingConfirmationCountLabel).toContain("要確認 3件");
    expect(summary.dueSoonCountLabel).toContain("期限接近 2件");
  });

  it("does not treat Family R and Family A 要確認 populations as the same set", () => {
    const rosterIds = filterUserRowsByStatusChip(
      DEMO_UX_USERS_FIXTURE.rows,
      USERS_FILTER_CHIP_NEEDS_REVIEW,
    ).map((row) => row.id);
    const attentionPeople = DEMO_UX_REVIEW_DUE_FIXTURE.attentionItems
      .filter((item) => item.reviewStatusLabel === SHELL_STATUS_LABEL_NEEDS_REVIEW)
      .map((item) => item.personLabel);

    expect(rosterIds).toEqual(["user-a", "user-c", "user-f"]);
    expect(attentionPeople).toEqual(["Aさん", "Bさん", "Cさん"]);
    expect(rosterIds).toHaveLength(attentionPeople.length);
    expect(rosterIds.indexOf("user-f") >= 0).toBe(true);
    expect(attentionPeople.indexOf("Fさん") >= 0).toBe(false);
    expect(attentionPeople.indexOf("Bさん") >= 0).toBe(true);
    expect(rosterIds.indexOf("user-b") >= 0).toBe(false);
  });

  it("exposes correspondence notes that distinguish families and units", () => {
    expect(DEMO_KPI_FAMILY_R_NOTE).toContain("利用者一覧の状態バッジ件数と同じ定義");
    expect(DEMO_KPI_FAMILY_R_NOTE).toContain("名");
    expect(DEMO_KPI_FAMILY_R_NOTE).toContain("見直し画面の件数とは母集団が異なります");
    expect(DEMO_KPI_FAMILY_A_NOTE).toContain("確認対象一覧と同じ母集団");
    expect(DEMO_KPI_FAMILY_A_NOTE).toContain("件");
    expect(DEMO_KPI_FAMILY_A_NOTE).toContain("利用者一覧の要確認/期限接近件数とは対象者が異なります");
    expect(DEMO_KPI_FAMILY_R_USERS_NOTE).toContain("概要の要確認/未記録/期限接近と同じ定義");
    expect(DEMO_KPI_FAMILY_R_NOTE).not.toContain("見直し画面の件数と同じ");
    expect(DEMO_KPI_FAMILY_A_NOTE).not.toContain("利用者一覧と同じ定義");
  });

  it("keeps DEMO-UX-10 slice flags presentation-only and write-closed", () => {
    expect(DEMO_UX_10_SLICE.id).toBe("DEMO-UX-10");
    expect(DEMO_UX_10_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_10_SLICE.kpiReviewCountCorrespondenceAuthorized).toBe(true);
    expect(DEMO_UX_10_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DEMO_UX_10_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(DEMO_UX_10_SLICE.saveMutationAuthorized).toBe(false);
    expect(DEMO_UX_10_SLICE.businessRuleCalculationAuthorized).toBe(false);
    expect(DEMO_UX_10_SLICE.govRuleDecisionAuthorized).toBe(false);
    expect(DEMO_UX_10_SLICE.usersFixtureRewriteAuthorized).toBe(false);
    expect(DEMO_UX_10_SLICE.reviewAttentionCastRewriteAuthorized).toBe(false);
    expect(DEMO_UX_10_SLICE.failClosedSemanticsChangeAuthorized).toBe(false);
    expect(DEMO_UX_10_SLICE.saveOutcomeUnknownNormalizationAuthorized).toBe(false);
  });

  it("keeps roster status card labels on DEMO-UX-7 canon", () => {
    const labels = DASHBOARD_UX_OVERVIEW_FIXTURE.kpiCards
      .filter((card) => card.id !== "today_targets")
      .map((card) => card.label);
    expect(labels).toEqual([
      SHELL_STATUS_LABEL_NEEDS_REVIEW,
      SHELL_STATUS_LABEL_UNRECORDED,
      SHELL_STATUS_LABEL_DUE_SOON,
    ]);
  });
});
