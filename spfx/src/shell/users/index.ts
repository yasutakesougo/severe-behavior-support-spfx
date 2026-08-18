export { UserDetail, type UserDetailProps } from "./UserDetail";
export { UsersList, type UsersListProps } from "./UsersList";
export { SupportPlan, type SupportPlanProps } from "./SupportPlan";
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
  supportPlanCopyIsFailClosed,
} from "./support-plan-copy";
export {
  DEMO_UX_3_SLICE,
  DEMO_UX_USER_DETAIL_C_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
} from "./user-detail-fixture";
export { DEMO_UX_4_SLICE, DEMO_UX_SUPPORT_PLAN_FIXTURE } from "./support-plan-fixture";
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
  SupportPlanGoal,
  SupportPlanReviewStatus,
  SupportPlanSystemState,
} from "./support-plan-types";
export { DEMO_UX_SLICE, DEMO_UX_USERS_FIXTURE, VISUAL_POLISH_3_USERS_SLICE } from "./users-fixture";
export type {
  ShellUsersPresentation,
  UserListRow,
  UserListStatusBadge,
  UserListStatusCategory,
} from "./users-types";
