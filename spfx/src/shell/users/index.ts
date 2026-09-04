export { UserDetail, type UserDetailProps } from "./UserDetail";
export { UsersList, type UsersListProps } from "./UsersList";
export {
  FIELD_STAFF_PHASE8_ROSTER_CONTEXT_PRESERVING_DISCLOSURE_1_SLICE,
  isUsersRosterDisclosureExpanded,
  toggleUsersRosterDisclosure,
  usersRosterDisclosureId,
  type UsersRosterDisclosureState,
} from "./users-roster-disclosure";
export {
  FIELD_STAFF_PHASE8_MULTI_USER_SCALE_EVIDENCE_1_SLICE,
  FIELD_STAFF_PHASE8_MULTI_USER_SCALE_FIXTURE,
  inspectScaleContextSafety,
  type ScaleContextSafetyReport,
} from "./field-staff-phase8-multi-user-scale-evidence";
export {
  ManagementHome,
  SupportPlanWithManagementHome as SupportPlan,
  type ManagementHomeProps,
} from "./ManagementHome";
export type { SupportPlanProps } from "./SupportPlan";
export {
  buildManagementHomeReadModel,
  type ManagementHomeDecisionReason,
  type ManagementHomeInput,
  type ManagementHomePresentation,
  type SourceSlot,
} from "./management-home-read-model";
export {
  SupportPlanManagementList,
  type SupportPlanManagementListProps,
} from "./SupportPlanManagementList";
export {
  SupportPlanManagementNextSurface,
  type SupportPlanManagementNextSurfaceProps,
} from "./SupportPlanManagementNextSurface";
export {
  collectSyntheticDetailPreviewUserIds,
  DEMO_UX_13_SLICE,
  isSyntheticDetailPreviewEnabled,
} from "./detail-preview";
export {
  DEMO_USERS_DETAIL_DISABLED_NOTE,
  DEMO_USERS_FILTER_DISABLED_NOTE,
  DEMO_USERS_FILTER_EMPTY_NOTE,
  DEMO_USERS_FILTER_NOTE,
  DEMO_USERS_PRESENTATION_NOTE,
  formatUsersDetailPreviewNote,
  personLabelsForDetailPreview,
  usersCopyIsFailClosed,
} from "./users-copy";
export {
  presentUsersListCompact,
  USERS_LIST_COMPACT_CLASS,
  USERS_LIST_COMPACT_DENSITY,
  USERS_LIST_COMPACT_TABLET_MAX_WIDTH_PX,
  USERS_LIST_TOUCH_TARGET_MIN_HEIGHT,
  type UsersListCompactPresentation,
} from "./users-list-compact";
export {
  discardUsersListRestore,
  rememberUsersFilterChip,
  rememberUsersFocusOrigin,
  resolveUsersListRestoreTarget,
  shouldRetainUsersListRestore,
  USERS_LIST_RESTORE_DEFAULT_CHIP,
  USERS_LIST_RESTORE_DISCARDED,
  type UsersListRestoreFocusKind,
  type UsersListRestoreState,
  type UsersListRestoreTarget,
} from "./users-list-restore";
export {
  discardAllUserSessionDrafts,
  forgetUserSessionDraft,
  isResumeWorthyDraft,
  isResumeWorthySnapshot,
  procedureBindingContextsMatch,
  rememberUserSessionDraft,
  resolveProcedureRecordResume,
  snapshotForUser,
  USERS_SESSION_DRAFT_RESUME_EMPTY,
  type ProcedureRecordResume,
  type UsersSessionDraftByUserId,
} from "./users-session-draft-resume";
export {
  FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE,
  USERS_SESSION_SAVE_OVERLAY_STATES,
  ariaLabelForUsersSessionSaveOverlay,
  overlayForUserId,
  overlayForUserSessionSaveState,
  rememberUserSessionSaveState,
  type UsersSessionSaveOverlay,
  type UsersSessionSaveOverlayState,
  type UsersSessionSaveStateByUserId,
} from "./users-session-save-overlay";
export {
  FIELD_STAFF_COMPLETION_ON_CARDS_1_SLICE,
  SYNTHETIC_RECORDED_FOR_TODAY_LABEL,
  ariaLabelForSyntheticRecordedForToday,
  isFixtureUnrecordedUserId,
  presentSyntheticRecordedForToday,
  type SyntheticRecordedForTodayPresentation,
} from "./synthetic-recorded-for-today";
export {
  FIELD_STAFF_NEXT_UNRECORDED_USER_1_SLICE,
  FIELD_STAFF_NEXT_UNRECORDED_USER_CTA_PREFIX,
  FIELD_STAFF_NEXT_UNRECORDED_USER_NONE_REASON,
  isUnrecordedUserRow,
  labelForNextUnrecordedUserCta,
  presentNextUnrecordedUserCta,
  resolveNextUnrecordedUserAction,
  selectFirstUnrecordedUser,
  selectNextUnrecordedUser,
  type NextUnrecordedUser,
  type NextUnrecordedUserAction,
  type NextUnrecordedUserCtaPresentation,
} from "./next-unrecorded-user";
export {
  DEMO_UX_8_SLICE,
  USERS_FILTER_CHIP_ALL,
  USERS_FILTER_CHIP_DUE_SOON,
  USERS_FILTER_CHIP_LABELS,
  USERS_FILTER_CHIP_NEEDS_REVIEW,
  USERS_FILTER_CHIP_UNRECORDED,
  filterUserRowsByStatusChip,
  formatUsersFilterSummaryLabel,
  isUsersFilterChipLabel,
  matchKeyForUsersFilterChip,
  type UsersFilterChipLabel,
  type UsersFilterMatchKey,
} from "./users-filter";
export {
  DEMO_SUPPORT_PLAN_MUTATION_DISABLED_NOTE,
  DEMO_SUPPORT_PLAN_ADMIN_READ_NOTE,
  DEMO_SUPPORT_PLAN_PRESENTATION_NOTE,
  SUPPORT_PLAN_ACTIVE_STATUS_LABEL,
  SUPPORT_PLAN_NOT_FINAL_APPROVAL_NOTE,
  SUPPORT_PLAN_REVIEW_MATERIALS_CTA,
  SUPPORT_PLAN_REVIEW_TO_NEXT_VERSION_CTA,
  supportPlanCopyAvoidsFinalApprovalMeaning,
  supportPlanCopyIsFailClosed,
} from "./support-plan-copy";
export {
  DEMO_UX_3_SLICE,
  DEMO_UX_USER_DETAIL_C_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
} from "./user-detail-fixture";
export {
  DEMO_UX_4_SLICE,
  DEMO_UX_SUPPORT_PLAN_FIXTURE,
  PLANNING_PC_DEMO_1_SLICE,
  SUPPORT_PLAN_REVIEW_NEW_VERSION_DEMO_1_SLICE,
} from "./support-plan-fixture";
export {
  SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE,
  SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE,
} from "./support-plan-management-list-fixture";
export {
  DEMO_KPI_FAMILY_P_NOTE,
  SUPPORT_PLAN_MANAGEMENT_BACK_TO_LIST_LABEL,
  SUPPORT_PLAN_MANAGEMENT_HEADING,
} from "./support-plan-management-list-copy";
export { resolveSupportPlanManagementListNext } from "./support-plan-management-list-nav";
export { rowForUserId } from "./support-plan-management-list-kpi";
export type {
  ShellSupportPlanManagementListPresentation,
  SupportPlanManagementListNext,
  SupportPlanManagementRow,
} from "./support-plan-management-list-types";
export type {
  ShellUserDetailPresentation,
  UserDetailBusinessFacts,
  UserDetailRecentRecord,
  UserDetailSupportItem,
  UserDetailSystemState,
} from "./user-detail-types";
export type {
  ShellSupportPlanPresentation,
  SupportPlanActionItem,
  SupportPlanBusinessFacts,
  SupportPlanCurrentProcedureSummary,
  SupportPlanGoal,
  SupportPlanReviewStatus,
  SupportPlanSystemState,
  SupportPlanVersionEntry,
} from "./support-plan-types";
export { DEMO_UX_SLICE, DEMO_UX_USERS_FIXTURE, VISUAL_POLISH_3_USERS_SLICE } from "./users-fixture";
export type {
  ShellUsersPresentation,
  UserListRow,
  UserListStatusBadge,
  UserListStatusCategory,
} from "./users-types";
