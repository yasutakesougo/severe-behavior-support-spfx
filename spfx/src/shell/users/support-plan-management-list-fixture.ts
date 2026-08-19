import { DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
import {
  formatSupportPlanManagementObservationLabel,
  formatSupportPlanManagementReviewWindowLabel,
  formatSupportPlanManagementVersionLabel,
  SUPPORT_PLAN_MANAGEMENT_CREATE_ACTION_LABEL,
  SUPPORT_PLAN_MANAGEMENT_DETAIL_ACTION_LABEL,
  SUPPORT_PLAN_MANAGEMENT_HEADING,
  SUPPORT_PLAN_MANAGEMENT_WORK_STATE_LABELS,
} from "./support-plan-management-list-copy";
import type {
  ShellSupportPlanManagementListPresentation,
  SupportPlanManagementRow,
} from "./support-plan-management-list-types";

function row(
  input: Omit<SupportPlanManagementRow, "workStateLabel" | "actionLabel"> & {
    workState: SupportPlanManagementRow["workState"];
    actionKind: SupportPlanManagementRow["actionKind"];
  },
): SupportPlanManagementRow {
  return {
    ...input,
    workStateLabel: SUPPORT_PLAN_MANAGEMENT_WORK_STATE_LABELS[input.workState],
    actionLabel:
      input.actionKind === "create"
        ? SUPPORT_PLAN_MANAGEMENT_CREATE_ACTION_LABEL
        : SUPPORT_PLAN_MANAGEMENT_DETAIL_ACTION_LABEL,
  };
}

/** Synthetic 5-state roster for Planning PC list demo. Aさん reuses existing plan identity. */
export const SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE: ShellSupportPlanManagementListPresentation = {
  heading: SUPPORT_PLAN_MANAGEMENT_HEADING,
  rows: [
    row({
      userId: DEMO_UX_SUPPORT_PLAN_FIXTURE.userId,
      personLabel: DEMO_UX_SUPPORT_PLAN_FIXTURE.personLabel,
      workState: "active",
      currentVersionLabel: formatSupportPlanManagementVersionLabel(
        DEMO_UX_SUPPORT_PLAN_FIXTURE.currentVersion,
      ),
      lastObservationLabel: formatSupportPlanManagementObservationLabel("2026/08/12"),
      reviewWindowLabel: formatSupportPlanManagementReviewWindowLabel("2026/09"),
      attentionKind: "none",
      attentionLabel: "",
      actionKind: "detail",
    }),
    row({
      userId: "user-b",
      personLabel: "Bさん",
      workState: "review_window",
      currentVersionLabel: formatSupportPlanManagementVersionLabel(2),
      lastObservationLabel: formatSupportPlanManagementObservationLabel("2026/08/10"),
      reviewWindowLabel: formatSupportPlanManagementReviewWindowLabel("2026/08"),
      attentionKind: "review_window",
      attentionLabel: "見直しの準備",
      actionKind: "detail",
    }),
    row({
      userId: "user-c",
      personLabel: "Cさん",
      workState: "observation_check",
      currentVersionLabel: formatSupportPlanManagementVersionLabel(1),
      lastObservationLabel: formatSupportPlanManagementObservationLabel(undefined),
      reviewWindowLabel: formatSupportPlanManagementReviewWindowLabel("2026/10"),
      attentionKind: "observation_wait",
      attentionLabel: "観察の確認",
      actionKind: "detail",
    }),
    row({
      userId: "user-d",
      personLabel: "Dさん",
      workState: "procedure_updating",
      currentVersionLabel: formatSupportPlanManagementVersionLabel(2),
      lastObservationLabel: formatSupportPlanManagementObservationLabel("2026/08/11"),
      reviewWindowLabel: formatSupportPlanManagementReviewWindowLabel("2026/11"),
      attentionKind: "needs_action",
      attentionLabel: "手順の更新確認",
      actionKind: "detail",
    }),
    row({
      userId: "user-e",
      personLabel: "Eさん",
      workState: "uncreated",
      currentVersionLabel: formatSupportPlanManagementVersionLabel(undefined),
      lastObservationLabel: formatSupportPlanManagementObservationLabel(undefined),
      reviewWindowLabel: formatSupportPlanManagementReviewWindowLabel(undefined),
      attentionKind: "needs_action",
      attentionLabel: "計画の作成",
      actionKind: "create",
    }),
  ],
};

export const SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE = {
  id: "SUPPORT-PLAN-MANAGEMENT-LIST-DEMO-1",
  issue: "#444",
  presentationOnly: true as const,
  plannerUsersDestinationListAuthorized: true as const,
  syntheticFixtureAuthorized: true as const,
  demoNavigationAuthorized: true as const,
  liveTenantIoAuthorized: false as const,
  sharePointRestAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  planMutationAuthorized: false as const,
  schemaChangeAuthorized: false as const,
  approvedByRenameAuthorized: false as const,
  reviewDueOriginAuthorized: false as const,
  statusTransitionAuthorized: false as const,
  fieldStaffUsersListChangeAuthorized: false as const,
  saveStateSemanticsChangeAuthorized: false as const,
  primaryNavExpansionAuthorized: false as const,
  liveWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;
