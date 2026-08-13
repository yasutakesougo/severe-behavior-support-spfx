export {
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  DASHBOARD_UX_SLICE,
  OverviewDashboard,
  overviewCopyIsFailClosed,
  DASHBOARD_OVERVIEW_PRESENTATION_NOTE,
  type OverviewDashboardProps,
  type ShellOverviewPresentation,
} from "../dashboard";
export {
  DEMO_UX_SLICE,
  DEMO_UX_USERS_FIXTURE,
  DEMO_UX_3_SLICE,
  DEMO_UX_8_SLICE,
  DEMO_UX_USER_DETAIL_C_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
  DEMO_UX_4_SLICE,
  DEMO_UX_SUPPORT_PLAN_FIXTURE,
  UsersList,
  UserDetail,
  SupportPlan,
  usersCopyIsFailClosed,
  supportPlanCopyIsFailClosed,
  DEMO_USERS_PRESENTATION_NOTE,
  DEMO_USERS_FILTER_NOTE,
  DEMO_SUPPORT_PLAN_PRESENTATION_NOTE,
  filterUserRowsByStatusChip,
  formatUsersFilterSummaryLabel,
  USERS_FILTER_CHIP_LABELS,
  type ShellUsersPresentation,
  type ShellUserDetailPresentation,
  type ShellSupportPlanPresentation,
  type UsersListProps,
  type UserDetailProps,
  type SupportPlanProps,
  type UsersFilterChipLabel,
} from "../users";
export {
  DEMO_UX_7_SLICE,
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
  SHELL_STATUS_LABELS_DEPRECATED_PRIMARY,
  isDeprecatedPrimaryStatusLabel,
} from "./status-labels";
export {
  DEMO_KPI_FAMILY_A_NOTE,
  DEMO_KPI_FAMILY_R_NOTE,
  DEMO_KPI_FAMILY_R_USERS_NOTE,
  DEMO_UX_10_SLICE,
  buildAttentionSummaryFromItems,
  countAttentionByDueState,
  countAttentionByReviewStatus,
  countRowsWithBadgeId,
  formatAttentionSummaryCountLabel,
} from "./kpi-review-count";
export type { OverviewActionNavigationTarget } from "../dashboard";
export {
  DailyRecords,
  DEMO_UX_5_SLICE,
  DEMO_UX_9_SLICE,
  DEMO_UX_DAILY_RECORD_FIXTURE,
  dailyRecordCopyIsFailClosed,
  DEMO_DAILY_RECORD_PRESENTATION_NOTE,
  DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE,
  seedLocalDraftForIncompleteItem,
  type DailyRecordsProps,
  type ShellDailyRecordPresentation,
  type ShellDailyRecordIncompleteItem,
  type ShellDailyRecordRecentItem,
} from "../records";
export {
  ReviewDueState,
  DEMO_UX_6_SLICE,
  DEMO_UX_REVIEW_DUE_FIXTURE,
  reviewDueCopyIsFailClosed,
  DEMO_REVIEW_DUE_PRESENTATION_NOTE,
  DEMO_REVIEW_DUE_MUTATION_DISABLED_NOTE,
  DEMO_REVIEW_DUE_CALCULATION_DISABLED_NOTE,
  type ReviewDueStateProps,
  type ShellReviewDueStatePresentation,
  type ShellReviewDueAttentionItem,
} from "../review";
export { AppShellChrome, type AppShellChromeProps } from "./AppShellChrome";
export { CurrentSiteLabel, type CurrentSiteLabelProps } from "./CurrentSiteLabel";
export { DemoBanner, type DemoBannerProps } from "./DemoBanner";
export {
  destinationCopyIsFailClosed,
  headingForShellDestination,
  isShellPrimaryNavigationId,
  labelForShellDestination,
  SHELL_DEFAULT_DESTINATION,
  SHELL_DESTINATION_DISCONNECTED_BODY,
  SHELL_DESTINATION_DISCONNECTED_NOTE,
  SHELL_DESTINATION_IDS,
} from "./destination";
export { DestinationPlaceholder, type DestinationPlaceholderProps } from "./DestinationPlaceholder";
export { ErrorInquiryDisplay, type ErrorInquiryDisplayProps } from "./ErrorInquiryDisplay";
export {
  formatShellErrorInquiryText,
  hasShellErrorInquiry,
  type ShellErrorInquiryPresentation,
} from "./error-inquiry";
export {
  SHELL_UX_DEFAULT_FIXTURE,
  SHELL_UX_PARTIAL_RETRIEVAL_FIXTURE,
  SHELL_UX_SLICE,
  type ShellSiteLabelFixture,
  type ShellUxFixture,
} from "./fixture";
export {
  SHELL_PARTIAL_RETRIEVAL_WARNING,
  hasPartialRetrievalFailure,
  type ShellPartialRetrievalPresentation,
  type ShellRetrievalItem,
} from "./partial-retrieval";
export { PartialRetrievalPanel, type PartialRetrievalPanelProps } from "./PartialRetrievalPanel";
export {
  isShellPrimaryNavigationEnabled,
  SHELL_PRIMARY_NAV_ITEMS,
  type ShellPrimaryNavigationId,
} from "./primary-navigation";
export {
  SHELL_SAVE_STATES,
  SHELL_SAVE_STATE_DESCRIPTIONS,
  SHELL_SAVE_STATE_LABELS,
  ariaLiveForShellSaveState,
  descriptionForShellSaveState,
  isShellSaveState,
  labelForShellSaveState,
  type ShellSaveState,
  type ShellSaveStateLive,
} from "./save-state";
export { SaveStateBadge, type SaveStateBadgeProps } from "./SaveStateBadge";
export { SaveStatePresentation, type SaveStatePresentationProps } from "./SaveStatePresentation";
export {
  SHELL_VIEW_MODES,
  isPartialRetrievalViewMode,
  isShellViewMode,
  isUnauthenticatedViewMode,
  type ShellViewMode,
} from "./shell-view-mode";
export {
  SHELL_SITE_IDS,
  SHELL_SITE_OPTIONS,
  SHELL_SITE_SELECTION_UNSELECTED,
  isShellSiteId,
  isShellSiteSelection,
  isSiteUnselected,
  labelForShellSiteSelection,
  siteOptionForId,
  type ShellSiteId,
  type ShellSiteOption,
  type ShellSiteSelection,
} from "./site-selection";
export { SiteSelector, type SiteSelectorProps } from "./SiteSelector";
export { SiteUnselectedStop } from "./SiteUnselectedStop";
export { StatusPanel, type StatusPanelProps } from "./StatusPanel";
export {
  SHELL_UNAUTHENTICATED_BODY,
  SHELL_UNAUTHENTICATED_TITLE,
  unauthenticatedCopyExcludesSensitiveTokens,
} from "./unauthenticated";
export { UnauthenticatedPanel } from "./UnauthenticatedPanel";
