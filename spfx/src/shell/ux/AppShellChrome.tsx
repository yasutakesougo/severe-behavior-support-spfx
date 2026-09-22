import * as React from "react";
import {
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  OverviewDashboard,
  type OverviewActionNavigationTarget,
  type ShellOverviewPresentation,
} from "../dashboard";
import {
  FieldStaffDayBoardBridgeContext,
  TodaySupportDayBoard,
  isFieldStaffTodayPrimaryActionStatus,
} from "../dashboard/TodaySupportDayBoard";
import { buildDemoMonitoringForVersion, MonitoringView } from "../monitoring";
import type { AdminAuditTaskDestinationId } from "./admin-audit-task-navigation";
import {
  fieldStaffDayBoardClearVisible,
  type FieldStaffSessionContext,
  type FieldStaffSessionEvent,
  type FieldStaffTaskDestinationId,
} from "./field-staff-task-navigation";
import {
  isLawfulPlannerPersonPlanContext,
  PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT,
  type PlannerPersonPlanContext,
  type PlannerSessionEvent,
  type PlannerTaskDestinationId,
} from "./planner-task-navigation";
import {
  CurrentProcedure,
  FIELD_STAFF_PHASE8_CORRECTION_1_SLICE,
  FIELD_STAFF_CANCELLATION_UI_SLICE,
  AbcObservationPresentation,
  FIELD_WORKFLOW_PROCEDURE_FIXTURE,
  ProcedureRecordCorrection,
  ProcedureRecordCancellation,
  FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
  canInvokeProcedureRecordStart,
  getKioskSyntheticTodaySupportReadModelInput,
  isProcedureRecordStartAllowed,
  presentProcedureCorrection,
  presentProcedureCancellation,
  presentAbcObservation,
  buildProcedureCorrectionOriginalBinding,
  appendSessionCancellationLifecycleEvent,
  chromeAfterCancellationPersisted,
  rebuildTodaySupportItemsWithSessionCancellations,
  ProcedureRecordForm,
  selectNextActionableOccurrence,
  type ProcedureRecordFormSaveSnapshot,
  type ProcedureRecordLifecycleEvent,
  type ShellProcedureWorkflowPresentation,
  type ReviewObservationEvidenceInput,
} from "../procedure";
import {
  DailyRecords,
  DEMO_UX_DAILY_RECORD_FIXTURE,
  type ShellDailyRecordPresentation,
} from "../records";
import {
  DEMO_UX_REVIEW_DUE_FIXTURE,
  ReviewDueState,
  type ShellReviewDueStatePresentation,
} from "../review";
import {
  collectSyntheticDetailPreviewUserIds,
  DEMO_UX_SUPPORT_PLAN_FIXTURE,
  DEMO_UX_USER_DETAIL_C_FIXTURE,
  DEMO_UX_USER_DETAIL_FIXTURE,
  DEMO_UX_USERS_FIXTURE,
  FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE,
  PLANNING_PC_DEMO_1_SLICE,
  SUPPORT_PLAN_MANAGEMENT_BACK_TO_LIST_LABEL,
  SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE,
  SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE,
  SupportPlan,
  SupportPlanManagementList,
  SupportPlanManagementNextSurface,
  UserDetail,
  UsersList,
  resolveSupportPlanManagementListNext,
  rowForUserId,
  discardUsersListRestore,
  rememberUsersFilterChip,
  rememberUsersFocusOrigin,
  rememberUserSessionSaveState,
  rememberUserSessionDraft,
  discardAllUserSessionDrafts,
  forgetUserSessionDraft,
  resolveProcedureRecordResume,
  snapshotForUser,
  shouldRetainUsersListRestore,
  USERS_FILTER_CHIP_ALL,
  type ShellSupportPlanPresentation,
  type ShellUserDetailPresentation,
  type ShellUsersPresentation,
  type SupportPlanManagementListNext,
  type SupportPlanManagementRow,
  type UsersFilterChipLabel,
  type UsersSessionDraftByUserId,
  type UsersSessionSaveStateByUserId,
} from "../users";
import { CurrentSiteLabel } from "./CurrentSiteLabel";
import { DemoBanner } from "./DemoBanner";
import { DemoPresentationRoleEntry } from "./DemoPresentationRoleEntry";
import { ADMIN_DEMO_UX_POLISH_1_SLICE, demoHoldSaveStatusNote } from "./demo-save-hold-copy";
import { DestinationPlaceholder } from "./DestinationPlaceholder";
import { SHELL_DEFAULT_DESTINATION } from "./destination";
import { shouldClearNextVersionConceptHighlight } from "./next-version-highlight";
import { PartialRetrievalPanel } from "./PartialRetrievalPanel";
import type { ShellPartialRetrievalPresentation } from "./partial-retrieval";
import { SaveStatePresentation } from "./SaveStatePresentation";
import {
  SHELL_DEFAULT_PRESENTATION_ROLE,
  isAdminAuditPresentationRole,
  isPlannerSupportPlanManagementListRole,
  type ShellPresentationRole,
} from "./presentation-role";
import type { ShellSaveState } from "./save-state";
import {
  DEMO_UX_14_SLICE,
  SAVING_INTERACTION_PAUSE_NOTE,
  isSavingInteractionPaused,
} from "./saving-progress-observability";
import {
  isPartialRetrievalViewMode,
  isUnauthenticatedViewMode,
  type ShellViewMode,
} from "./shell-view-mode";
import {
  SHELL_SITE_OPTIONS,
  isSiteUnselected,
  siteOptionForId,
  type ShellSiteOption,
  type ShellSiteSelection,
} from "./site-selection";
import {
  isShellPrimaryNavigationEnabled,
  SHELL_PRIMARY_NAV_ITEMS,
  type ShellPrimaryNavigationId,
} from "./primary-navigation";
import { SiteSelector } from "./SiteSelector";
import { SiteUnselectedStop } from "./SiteUnselectedStop";
import { StatusPanel } from "./StatusPanel";
import { UnauthenticatedPanel } from "./UnauthenticatedPanel";
import styles from "./ShellUx.module.scss";

export type AppShellChromeProps = Readonly<{
  demoMode: boolean;
  siteSelection: ShellSiteSelection;
  siteOptions?: readonly ShellSiteOption[];
  saveState: ShellSaveState;
  viewMode: ShellViewMode;
  correlationId: string;
  errorCode: string;
  userDisplayName: string;
  partialRetrieval?: ShellPartialRetrievalPresentation;
  selectedDestination?: ShellPrimaryNavigationId;
  onSiteSelectionChange?: (next: ShellSiteSelection) => void;
  onSelectedDestinationChange?: (next: ShellPrimaryNavigationId) => void;
  overviewPresentation?: ShellOverviewPresentation;
  usersPresentation?: ShellUsersPresentation;
  userDetailPresentation?: ShellUserDetailPresentation;
  /** Additional synthetic detail fixtures (e.g. Cさん for DEMO-UX-7 today-action). */
  additionalUserDetailPresentations?: readonly ShellUserDetailPresentation[];
  supportPlanPresentation?: ShellSupportPlanPresentation;
  dailyRecordPresentation?: ShellDailyRecordPresentation;
  reviewDueStatePresentation?: ShellReviewDueStatePresentation;
  procedureWorkflowPresentation?: ShellProcedureWorkflowPresentation;
  reviewObservationEvidence?: readonly ReviewObservationEvidenceInput[];
  /** Synthetic VP-G entry emphasis. Not Entra / roleResolutionAuthorized. */
  presentationRole?: ShellPresentationRole;
  /**
   * Demo presentation-role notify. ADMIN_AUDIT is included so the parent
   * owns Task-First destination state (FE-F001 close).
   */
  onPresentationRoleChange?: (next: ShellPresentationRole) => void;
  fieldStaffTaskDestination?: FieldStaffTaskDestinationId;
  fieldStaffSessionContext?: FieldStaffSessionContext;
  fieldStaffChosenOccurrenceId?: string;
  onFieldStaffSessionEvent?: (event: FieldStaffSessionEvent) => void;
  plannerTaskDestination?: PlannerTaskDestinationId;
  plannerPersonPlanContext?: PlannerPersonPlanContext;
  onPlannerSessionEvent?: (event: PlannerSessionEvent) => void;
  adminAuditTaskDestination?: AdminAuditTaskDestinationId;
  children?: React.ReactNode;
}>;

/**
 * SHELL-UX presentation chrome + Phase 1 synthetic presentation slices.
 * No SharePoint REST, binder, auth judgment, Entra, token, role, or live business UI.
 */
export const AppShellChrome: React.FC<AppShellChromeProps> = (props) => {
  const {
    demoMode,
    siteSelection,
    siteOptions = SHELL_SITE_OPTIONS,
    saveState,
    viewMode,
    correlationId,
    errorCode,
    userDisplayName,
    partialRetrieval,
    selectedDestination: selectedDestinationProp,
    onSiteSelectionChange,
    onSelectedDestinationChange,
    overviewPresentation = DASHBOARD_UX_OVERVIEW_FIXTURE,
    usersPresentation = DEMO_UX_USERS_FIXTURE,
    userDetailPresentation = DEMO_UX_USER_DETAIL_FIXTURE,
    additionalUserDetailPresentations = [DEMO_UX_USER_DETAIL_C_FIXTURE],
    supportPlanPresentation = DEMO_UX_SUPPORT_PLAN_FIXTURE,
    dailyRecordPresentation = DEMO_UX_DAILY_RECORD_FIXTURE,
    reviewDueStatePresentation = DEMO_UX_REVIEW_DUE_FIXTURE,
    procedureWorkflowPresentation = FIELD_WORKFLOW_PROCEDURE_FIXTURE,
    reviewObservationEvidence = FIELD_WORKFLOW_REVIEW_OBSERVATION_EVIDENCE,
    presentationRole = SHELL_DEFAULT_PRESENTATION_ROLE,
    onPresentationRoleChange,
    fieldStaffTaskDestination,
    fieldStaffSessionContext,
    fieldStaffChosenOccurrenceId,
    onFieldStaffSessionEvent,
    plannerTaskDestination,
    plannerPersonPlanContext,
    onPlannerSessionEvent,
    adminAuditTaskDestination,
    children,
  } = props;

  const [activePresentationRole, setActivePresentationRole] =
    React.useState<ShellPresentationRole>(presentationRole);

  const [selection, setSelection] = React.useState<ShellSiteSelection>(siteSelection);
  const [destination, setDestination] = React.useState<ShellPrimaryNavigationId>(
    selectedDestinationProp ?? SHELL_DEFAULT_DESTINATION,
  );
  const [selectedUserDetailId, setSelectedUserDetailId] = React.useState<string | undefined>();
  const [plannerListNext, setPlannerListNext] = React.useState<
    SupportPlanManagementListNext | undefined
  >();
  const [plannerListOrigin, setPlannerListOrigin] = React.useState(false);
  const [supportPlanPreviewOpen, setSupportPlanPreviewOpen] = React.useState(false);
  const [currentProcedureOpen, setCurrentProcedureOpen] = React.useState(false);
  const [procedureCorrectionOpen, setProcedureCorrectionOpen] = React.useState(false);
  const [procedureCancellationOpen, setProcedureCancellationOpen] = React.useState(false);
  const [procedureRecordFormOpen, setProcedureRecordFormOpen] = React.useState(false);
  const [abcObservationOpen, setAbcObservationOpen] = React.useState(false);
  const [procedureFlowSaveState, setProcedureFlowSaveState] = React.useState<
    ShellSaveState | undefined
  >();
  const [sessionSaveStateByUserId, setSessionSaveStateByUserId] =
    React.useState<UsersSessionSaveStateByUserId>({});
  const [sessionDraftByUserId, setSessionDraftByUserId] = React.useState<UsersSessionDraftByUserId>(
    {},
  );
  const [reviewDuePreviewOpen, setReviewDuePreviewOpen] = React.useState(false);
  const [reviewFromSupportPlan, setReviewFromSupportPlan] = React.useState(false);
  const [nextVersionConceptFromReview, setNextVersionConceptFromReview] = React.useState(false);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = React.useState<string | undefined>();
  const [occurrenceFlowFromOverview, setOccurrenceFlowFromOverview] = React.useState(false);
  const [usersFilterChip, setUsersFilterChip] =
    React.useState<UsersFilterChipLabel>(USERS_FILTER_CHIP_ALL);
  const [usersFocusOriginUserId, setUsersFocusOriginUserId] = React.useState<string | undefined>();
  const [restoreUsersList, setRestoreUsersList] = React.useState(false);
  const [sessionCancellationLifecycleEvents, setSessionCancellationLifecycleEvents] =
    React.useState<readonly ProcedureRecordLifecycleEvent[]>([]);
  const todaySupportItems = React.useMemo(
    () => rebuildTodaySupportItemsWithSessionCancellations(sessionCancellationLifecycleEvents),
    [sessionCancellationLifecycleEvents],
  );
  const fieldStaffAdapterActive =
    Boolean(onFieldStaffSessionEvent) && activePresentationRole === "FIELD_STAFF";
  const reportFieldStaffEvent = (event: FieldStaffSessionEvent): void => {
    onFieldStaffSessionEvent?.(event);
  };
  const reportPlannerEvent = (event: PlannerSessionEvent): void => {
    onPlannerSessionEvent?.(event);
  };
  const adminAuditAdapterActive = isAdminAuditPresentationRole(activePresentationRole);
  const plannerProductHostActive =
    activePresentationRole === "PLANNER" &&
    isLawfulPlannerPersonPlanContext(plannerPersonPlanContext) &&
    (plannerTaskDestination === "D-PLAN" || plannerTaskDestination === "D-MONITOR");
  const plannerHidesOverviewBody =
    activePresentationRole === "PLANNER" &&
    (plannerTaskDestination === "D-PLAN" ||
      plannerTaskDestination === "D-MONITOR" ||
      plannerTaskDestination === "D-ASSESS" ||
      plannerTaskDestination === "D-REVIEW" ||
      plannerTaskDestination === "D-NEXT");
  const handleFieldStaffClearChosenOccurrence = (): void => {
    reportFieldStaffEvent({ type: "CLEAR_CHOSEN_OCCURRENCE" });
    setSelectedOccurrenceId(undefined);
    if (fieldStaffTaskDestination === "D-TODAY") {
      setCurrentProcedureOpen(false);
      setProcedureRecordFormOpen(false);
      setOccurrenceFlowFromOverview(false);
      setSelectedUserDetailId(undefined);
      if (destination !== "overview") {
        setDestination("overview");
        if (onSelectedDestinationChange) {
          onSelectedDestinationChange("overview");
        }
      }
    }
  };
  const cancellationLifecycleEventsForSemantics = React.useMemo(
    () =>
      getKioskSyntheticTodaySupportReadModelInput(sessionCancellationLifecycleEvents)
        .lifecycleEvents,
    [sessionCancellationLifecycleEvents],
  );
  const destinationHeadingRef = React.useRef<HTMLHeadingElement>(null);
  const readyRegionContentRef = React.useRef<HTMLDivElement>(null);
  const shouldFocusDestinationRef = React.useRef(false);

  const effectiveSaveState = procedureFlowSaveState ?? saveState;

  const userDetailById = new Map<string, ShellUserDetailPresentation>();
  userDetailById.set(userDetailPresentation.userId, userDetailPresentation);
  for (const detail of additionalUserDetailPresentations) {
    userDetailById.set(detail.userId, detail);
  }
  /** DEMO-UX-13: list detail enablement follows fixture presence only. */
  const detailPreviewUserIds = collectSyntheticDetailPreviewUserIds(
    userDetailPresentation,
    additionalUserDetailPresentations,
  );
  const selectedUserDetail = selectedUserDetailId
    ? userDetailById.get(selectedUserDetailId)
    : undefined;
  const plannerNextRow = plannerListNext
    ? rowForUserId(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows, plannerListNext.userId)
    : undefined;
  const showPlannerManagementList =
    SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.plannerUsersDestinationListAuthorized &&
    isPlannerSupportPlanManagementListRole(activePresentationRole);

  const restoreFieldStaffSufficientHost = (): boolean => {
    if (
      !fieldStaffAdapterActive ||
      (fieldStaffTaskDestination !== "D-PROCEDURE" &&
        fieldStaffTaskDestination !== "D-RECORD-WRITE")
    ) {
      return false;
    }
    const occId = fieldStaffChosenOccurrenceId;
    if (!occId) {
      return false;
    }
    const item = todaySupportItems.find((entry) => entry.occurrenceId === occId);
    if (!item || !userDetailById.has(item.userId)) {
      return false;
    }
    const wantRecordForm = fieldStaffTaskDestination === "D-RECORD-WRITE";
    const alreadyRestored =
      destination === "users" &&
      selectedUserDetailId === item.userId &&
      selectedOccurrenceId === occId &&
      currentProcedureOpen &&
      procedureRecordFormOpen === wantRecordForm &&
      occurrenceFlowFromOverview;
    if (alreadyRestored) {
      return true;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setAbcObservationOpen(false);
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    setPlannerListNext(undefined);
    setPlannerListOrigin(false);
    setSelectedOccurrenceId(occId);
    setSelectedUserDetailId(item.userId);
    setOccurrenceFlowFromOverview(true);
    setCurrentProcedureOpen(true);
    setProcedureRecordFormOpen(wantRecordForm);
    setDestination("users");
    return true;
  };

  const restorePlannerProductHost = (): boolean => {
    if (!plannerProductHostActive || !plannerPersonPlanContext) {
      return false;
    }
    const wantPlan = plannerTaskDestination === "D-PLAN";
    const alreadyRestored =
      destination === "users" &&
      selectedUserDetailId === plannerPersonPlanContext.userId &&
      (wantPlan ? supportPlanPreviewOpen : true);
    if (alreadyRestored) {
      return true;
    }
    shouldFocusDestinationRef.current = true;
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setAbcObservationOpen(false);
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    setPlannerListNext(undefined);
    setPlannerListOrigin(true);
    setSelectedUserDetailId(plannerPersonPlanContext.userId);
    setSupportPlanPreviewOpen(wantPlan);
    setDestination("users");
    return true;
  };

  const discardUsersListRestoreState = (): void => {
    const discarded = discardUsersListRestore();
    setUsersFilterChip(discarded.filterChip);
    setUsersFocusOriginUserId(discarded.originUserId);
    setRestoreUsersList(false);
  };

  const requestUsersListRestore = (): void => {
    if (!FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.listScrollRestoreAuthorized) {
      shouldFocusDestinationRef.current = true;
      setRestoreUsersList(false);
      return;
    }
    shouldFocusDestinationRef.current = false;
    setRestoreUsersList(true);
  };

  React.useEffect(() => {
    setActivePresentationRole(presentationRole);
  }, [presentationRole]);

  React.useEffect(() => {
    if (!isPlannerSupportPlanManagementListRole(activePresentationRole)) {
      setPlannerListNext(undefined);
      setPlannerListOrigin(false);
    }
  }, [activePresentationRole]);

  React.useEffect(() => {
    setSelection(siteSelection);
    setSessionSaveStateByUserId({});
    setSessionDraftByUserId(discardAllUserSessionDrafts());
    discardUsersListRestoreState();
  }, [siteSelection]);

  React.useEffect(() => {
    if (selectedDestinationProp !== undefined) {
      setDestination(selectedDestinationProp);
    }
  }, [selectedDestinationProp]);

  React.useEffect(() => {
    const retainFieldStaffSufficientHost =
      fieldStaffAdapterActive &&
      (fieldStaffTaskDestination === "D-PROCEDURE" ||
        fieldStaffTaskDestination === "D-RECORD-WRITE");
    if (destination !== "users" && !retainFieldStaffSufficientHost && !plannerProductHostActive) {
      if (selectedUserDetailId !== undefined) {
        setSelectedUserDetailId(undefined);
      }
      if (supportPlanPreviewOpen) {
        setSupportPlanPreviewOpen(false);
      }
      if (currentProcedureOpen) {
        setCurrentProcedureOpen(false);
      }
      if (procedureCorrectionOpen) {
        setProcedureCorrectionOpen(false);
        setProcedureCancellationOpen(false);
      }
      if (procedureCancellationOpen) {
        setProcedureCancellationOpen(false);
      }
      if (procedureRecordFormOpen) {
        setProcedureRecordFormOpen(false);
      }
      if (abcObservationOpen) {
        setAbcObservationOpen(false);
      }
      if (procedureFlowSaveState !== undefined) {
        setProcedureFlowSaveState(undefined);
      }
      if (Object.keys(sessionSaveStateByUserId).length > 0) {
        setSessionSaveStateByUserId({});
      }
      if (Object.keys(sessionDraftByUserId).length > 0) {
        setSessionDraftByUserId(discardAllUserSessionDrafts());
      }
      if (occurrenceFlowFromOverview) {
        setOccurrenceFlowFromOverview(false);
      }
      if (!shouldRetainUsersListRestore(destination)) {
        if (
          usersFilterChip !== USERS_FILTER_CHIP_ALL ||
          usersFocusOriginUserId !== undefined ||
          restoreUsersList
        ) {
          discardUsersListRestoreState();
        }
      }
      if (
        nextVersionConceptFromReview &&
        shouldClearNextVersionConceptHighlight({
          destination,
          freshSupportPlanEntry: false,
        })
      ) {
        setNextVersionConceptFromReview(false);
      }
    }
    if (destination !== "overview" && reviewDuePreviewOpen && !reviewFromSupportPlan) {
      setReviewDuePreviewOpen(false);
    }
    if (destination !== "users" && reviewFromSupportPlan) {
      setReviewFromSupportPlan(false);
      if (reviewDuePreviewOpen) {
        setReviewDuePreviewOpen(false);
      }
    }
  }, [
    destination,
    selectedUserDetailId,
    supportPlanPreviewOpen,
    currentProcedureOpen,
    procedureCorrectionOpen,
    procedureCancellationOpen,
    procedureRecordFormOpen,
    abcObservationOpen,
    procedureFlowSaveState,
    sessionSaveStateByUserId,
    sessionDraftByUserId,
    reviewDuePreviewOpen,
    reviewFromSupportPlan,
    occurrenceFlowFromOverview,
    usersFilterChip,
    usersFocusOriginUserId,
    restoreUsersList,
    nextVersionConceptFromReview,
    fieldStaffAdapterActive,
    fieldStaffTaskDestination,
    plannerProductHostActive,
  ]);

  React.useEffect(() => {
    if (!fieldStaffAdapterActive) {
      return;
    }
    if (
      fieldStaffTaskDestination !== "D-PROCEDURE" &&
      fieldStaffTaskDestination !== "D-RECORD-WRITE"
    ) {
      return;
    }
    restoreFieldStaffSufficientHost();
  }, [
    fieldStaffAdapterActive,
    fieldStaffTaskDestination,
    fieldStaffChosenOccurrenceId,
    destination,
  ]);

  React.useEffect(() => {
    if (!plannerProductHostActive) {
      return;
    }
    restorePlannerProductHost();
  }, [plannerProductHostActive, plannerTaskDestination, plannerPersonPlanContext, destination]);

  React.useEffect(() => {
    if (restoreUsersList) {
      return;
    }
    if (!shouldFocusDestinationRef.current) {
      return;
    }
    shouldFocusDestinationRef.current = false;
    destinationHeadingRef.current?.focus();
  }, [
    destination,
    selectedUserDetailId,
    supportPlanPreviewOpen,
    currentProcedureOpen,
    procedureCorrectionOpen,
    procedureCancellationOpen,
    procedureRecordFormOpen,
    abcObservationOpen,
    reviewDuePreviewOpen,
    reviewFromSupportPlan,
    restoreUsersList,
  ]);

  const interactionPaused = isSavingInteractionPaused(effectiveSaveState);

  const handleSelectionChange = (next: ShellSiteSelection): void => {
    setSelection(next);
    setSessionSaveStateByUserId({});
    setSessionDraftByUserId(discardAllUserSessionDrafts());
    discardUsersListRestoreState();
    if (onSiteSelectionChange) {
      onSiteSelectionChange(next);
    }
  };

  const handleProcedureFlowSaveStateChange = (state: ShellSaveState): void => {
    setProcedureFlowSaveState(state);
    setSessionSaveStateByUserId((prev) =>
      rememberUserSessionSaveState(prev, selectedUserDetailId, state),
    );
  };

  const handleProcedureDraftSnapshotChange = (snapshot: ProcedureRecordFormSaveSnapshot): void => {
    if (!FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.perUserDraftResumeAuthorized) {
      return;
    }
    setSessionDraftByUserId((prev) =>
      rememberUserSessionDraft(prev, selectedUserDetailId, snapshot),
    );
  };

  const handleDestinationChange = (next: ShellPrimaryNavigationId): void => {
    if (interactionPaused) {
      return;
    }
    if (
      next === "users" &&
      fieldStaffAdapterActive &&
      (fieldStaffTaskDestination === "D-PROCEDURE" ||
        fieldStaffTaskDestination === "D-RECORD-WRITE") &&
      restoreFieldStaffSufficientHost()
    ) {
      if (destination !== "users" && onSelectedDestinationChange) {
        onSelectedDestinationChange("users");
      }
      return;
    }
    if (next === destination) {
      if (
        next === "users" &&
        (selectedUserDetailId !== undefined ||
          plannerListNext !== undefined ||
          supportPlanPreviewOpen ||
          currentProcedureOpen ||
          procedureCorrectionOpen ||
          procedureCancellationOpen ||
          procedureRecordFormOpen ||
          reviewFromSupportPlan)
      ) {
        setSupportPlanPreviewOpen(false);
        setCurrentProcedureOpen(false);
        setProcedureCorrectionOpen(false);
        setProcedureCancellationOpen(false);
        setProcedureRecordFormOpen(false);
        setProcedureFlowSaveState(undefined);
        setReviewDuePreviewOpen(false);
        setReviewFromSupportPlan(false);
        setNextVersionConceptFromReview(false);
        setSelectedUserDetailId(undefined);
        setPlannerListNext(undefined);
        setPlannerListOrigin(false);
        requestUsersListRestore();
        return;
      }
      if (next === "overview" && reviewDuePreviewOpen) {
        shouldFocusDestinationRef.current = true;
        setReviewDuePreviewOpen(false);
        return;
      }
      destinationHeadingRef.current?.focus();
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setSelectedUserDetailId(undefined);
    setPlannerListNext(undefined);
    setPlannerListOrigin(false);
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    setNextVersionConceptFromReview(false);
    setDestination(next);
    if (onSelectedDestinationChange) {
      onSelectedDestinationChange(next);
    }
  };

  const handleUserDetailRequest = (userId: string): void => {
    if (interactionPaused || !userDetailById.has(userId)) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setUsersFocusOriginUserId(rememberUsersFocusOrigin(userId));
    setRestoreUsersList(false);
    setPlannerListNext(undefined);
    setPlannerListOrigin(false);
    setSelectedUserDetailId(userId);
    if (fieldStaffAdapterActive) {
      const dayOccurrence = todaySupportItems.find((item) => item.userId === userId);
      reportFieldStaffEvent({
        type: "PERSON_OPEN",
        userId,
        hasCurrentDayOccurrence: Boolean(dayOccurrence),
        occurrenceId: dayOccurrence?.occurrenceId,
      });
    }
  };

  const handleTodayActionNavigate = (target: OverviewActionNavigationTarget): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    if (target.kind === "records") {
      setSelectedUserDetailId(undefined);
      setReviewDuePreviewOpen(false);
      setCurrentProcedureOpen(false);
      setProcedureCorrectionOpen(false);
      setProcedureCancellationOpen(false);
      setOccurrenceFlowFromOverview(false);
      setDestination("records");
      if (onSelectedDestinationChange) {
        onSelectedDestinationChange("records");
      }
      return;
    }
    if (target.kind === "review_due") {
      setSelectedUserDetailId(undefined);
      setCurrentProcedureOpen(false);
      setProcedureCorrectionOpen(false);
      setProcedureCancellationOpen(false);
      setOccurrenceFlowFromOverview(false);
      setDestination("overview");
      if (onSelectedDestinationChange) {
        onSelectedDestinationChange("overview");
      }
      setReviewDuePreviewOpen(true);
      return;
    }
    if (target.kind === "occurrence") {
      if (!userDetailById.has(target.userId)) {
        return;
      }
      setReviewDuePreviewOpen(false);
      setSelectedOccurrenceId(target.occurrenceId);
      setSelectedUserDetailId(target.userId);
      setOccurrenceFlowFromOverview(true);
      setCurrentProcedureOpen(true);
      setDestination("users");
      if (onSelectedDestinationChange) {
        onSelectedDestinationChange("users");
      }
      return;
    }
    if (!userDetailById.has(target.userId)) {
      return;
    }
    setReviewDuePreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setOccurrenceFlowFromOverview(false);
    setSelectedUserDetailId(target.userId);
    setDestination("users");
    if (onSelectedDestinationChange) {
      onSelectedDestinationChange("users");
    }
  };

  const handleBackToUsers = (): void => {
    if (interactionPaused) {
      return;
    }
    requestUsersListRestore();
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    setSelectedUserDetailId(undefined);
    setPlannerListNext(undefined);
    setPlannerListOrigin(false);
    if (fieldStaffAdapterActive && fieldStaffTaskDestination === "D-PERSON") {
      reportFieldStaffEvent({ type: "PERSON_BACK" });
    }
  };

  const handlePlannerListRowAction = (row: SupportPlanManagementRow): void => {
    if (interactionPaused || !SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.demoNavigationAuthorized) {
      return;
    }
    const fixtureRow = rowForUserId(SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE.rows, row.userId);
    if (!fixtureRow) {
      return;
    }
    const next = resolveSupportPlanManagementListNext(fixtureRow, supportPlanPresentation.userId);
    shouldFocusDestinationRef.current = true;
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    if (next.kind === "existing-plan") {
      setPlannerListOrigin(true);
      setPlannerListNext(undefined);
      setSelectedUserDetailId(next.userId);
      setSupportPlanPreviewOpen(true);
      reportPlannerEvent({
        type: "SET_PERSON_PLAN_CONTEXT",
        context: PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT,
      });
      reportPlannerEvent({ type: "OPEN_PERSON_PLAN" });
      return;
    }
    setPlannerListOrigin(false);
    setSelectedUserDetailId(undefined);
    setSupportPlanPreviewOpen(false);
    setPlannerListNext(next);
    reportPlannerEvent({ type: "SET_PERSON_PLAN_CONTEXT" });
  };

  const handleBackToPlannerList = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    setNextVersionConceptFromReview(false);
    setSelectedUserDetailId(undefined);
    setPlannerListNext(undefined);
    setPlannerListOrigin(false);
    reportPlannerEvent({ type: "SET_PERSON_PLAN_CONTEXT" });
  };

  const handleSupportPlanRequest = (): void => {
    if (interactionPaused || selectedUserDetailId !== supportPlanPresentation.userId) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    if (
      shouldClearNextVersionConceptHighlight({
        destination: "users",
        freshSupportPlanEntry: true,
      })
    ) {
      setNextVersionConceptFromReview(false);
    }
    setSupportPlanPreviewOpen(true);
    reportPlannerEvent({
      type: "SET_PERSON_PLAN_CONTEXT",
      context: PLANNER_DEMO_LAWFUL_PERSON_PLAN_CONTEXT,
    });
    reportPlannerEvent({ type: "OPEN_PERSON_PLAN" });
  };

  const handleBackToUserDetail = (): void => {
    if (interactionPaused) {
      return;
    }
    if (plannerListOrigin) {
      handleBackToPlannerList();
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    setNextVersionConceptFromReview(false);
    reportPlannerEvent({ type: "SET_PERSON_PLAN_CONTEXT" });
  };

  const handleCurrentProcedureRequest = (): void => {
    if (
      interactionPaused ||
      !selectedUserDetailId ||
      !procedureWorkflowPresentation.currentByUserId[selectedUserDetailId]
    ) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setOccurrenceFlowFromOverview(false);
    setCurrentProcedureOpen(true);
    if (fieldStaffAdapterActive) {
      reportFieldStaffEvent({ type: "PERSON_C4_PROCEDURE" });
    }
  };

  const handleBackToTodaySupport = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setAbcObservationOpen(false);
    setProcedureFlowSaveState(undefined);
    setOccurrenceFlowFromOverview(false);
    setSelectedUserDetailId(undefined);
    setDestination("overview");
    if (onSelectedDestinationChange) {
      onSelectedDestinationChange("overview");
    }
  };

  const selectedOccurrenceItem = selectedOccurrenceId
    ? todaySupportItems.find((item) => item.occurrenceId === selectedOccurrenceId)
    : undefined;

  const selectedCurrentProcedureBase = selectedUserDetailId
    ? procedureWorkflowPresentation.currentByUserId[selectedUserDetailId]
    : undefined;

  const selectedCurrentProcedure =
    selectedCurrentProcedureBase && occurrenceFlowFromOverview && selectedOccurrenceItem
      ? {
          ...selectedCurrentProcedureBase,
          canStartProcedureRecord: selectedOccurrenceItem.canStartProcedureRecord,
          occurrenceStatus: selectedOccurrenceItem.effectiveStatus,
          context: {
            ...selectedCurrentProcedureBase.context,
            occurrenceId: selectedOccurrenceItem.occurrenceId,
            userId: selectedOccurrenceItem.userId,
            personLabel: selectedOccurrenceItem.personLabel,
            procedureId: selectedOccurrenceItem.procedure.ProcedureId,
            procedureVersion: selectedOccurrenceItem.procedure.ProcedureVersion,
            planId: selectedOccurrenceItem.planId,
            planVersion: selectedOccurrenceItem.planVersion,
          },
        }
      : selectedCurrentProcedureBase;

  const procedureRecordResume = selectedCurrentProcedure
    ? resolveProcedureRecordResume({
        authorized: FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.perUserDraftResumeAuthorized,
        snapshot: snapshotForUser(sessionDraftByUserId, selectedUserDetailId),
        currentContext: selectedCurrentProcedure.context,
      })
    : undefined;
  const procedureCorrectionPresentation = presentProcedureCorrection(
    occurrenceFlowFromOverview ? selectedOccurrenceItem : undefined,
    selectedCurrentProcedure?.context,
  );
  const procedureCancellationPresentation = presentProcedureCancellation(
    occurrenceFlowFromOverview ? selectedOccurrenceItem : undefined,
    selectedCurrentProcedure?.context,
  );
  const procedureCorrectionOriginalBinding =
    occurrenceFlowFromOverview && selectedOccurrenceItem?.boundRecord && selectedCurrentProcedure
      ? buildProcedureCorrectionOriginalBinding(
          selectedCurrentProcedure.context,
          selectedOccurrenceItem.boundRecord,
        )
      : undefined;
  const abcObservationPresentation = presentAbcObservation(selectedCurrentProcedure?.context);

  const handleRecordProcedureRequest = (): void => {
    if (
      !canInvokeProcedureRecordStart({
        interactionPaused,
        currentProcedureOpen,
        selectedUserDetailId,
        presentation: selectedCurrentProcedure,
      })
    ) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    if (
      FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.perUserDraftResumeAuthorized &&
      snapshotForUser(sessionDraftByUserId, selectedUserDetailId) &&
      procedureRecordResume &&
      !procedureRecordResume.resumed
    ) {
      setSessionDraftByUserId((prev) => forgetUserSessionDraft(prev, selectedUserDetailId));
    }
    setProcedureRecordFormOpen(true);
    setProcedureFlowSaveState(
      procedureRecordResume?.resumed ? procedureRecordResume.saveState : "unsaved",
    );
    if (fieldStaffAdapterActive) {
      reportFieldStaffEvent({ type: "PROCEDURE_COMPLETE" });
    }
  };

  const handleBackToCurrentProcedure = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
  };

  const handleProcedureCorrectionRequest = (): void => {
    if (
      interactionPaused ||
      !FIELD_STAFF_PHASE8_CORRECTION_1_SLICE.correctionEntryAuthorized ||
      !procedureCorrectionPresentation
    ) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setCurrentProcedureOpen(false);
    setProcedureRecordFormOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureCorrectionOpen(true);
  };

  const handleProcedureCancellationRequest = (): void => {
    if (
      interactionPaused ||
      !FIELD_STAFF_CANCELLATION_UI_SLICE.cancellationPresentationAuthorized ||
      !procedureCancellationPresentation ||
      !selectedOccurrenceItem?.boundRecord
    ) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setCurrentProcedureOpen(false);
    setProcedureRecordFormOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(true);
  };

  const handleBackToCurrentProcedureFromCancellation = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setProcedureCancellationOpen(false);
    setProcedureFlowSaveState(undefined);
    setCurrentProcedureOpen(true);
  };

  const handleCancellationPersisted = (event: ProcedureRecordLifecycleEvent): void => {
    setSessionCancellationLifecycleEvents((prior) =>
      appendSessionCancellationLifecycleEvent(prior, event),
    );
    // Close cancel UI and open CurrentProcedure so destination shows resolver-derived 取消済み.
    // Status text must not be set from saveState; rebuild above remains the authority.
    const chrome = chromeAfterCancellationPersisted();
    shouldFocusDestinationRef.current = true;
    setProcedureCancellationOpen(chrome.procedureCancellationOpen);
    setProcedureFlowSaveState(undefined);
    setCurrentProcedureOpen(chrome.currentProcedureOpen);
  };

  const handleAbcObservationRequest = (): void => {
    if (interactionPaused || !abcObservationPresentation) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setCurrentProcedureOpen(false);
    setProcedureRecordFormOpen(false);
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setAbcObservationOpen(true);
  };

  const handleBackToCurrentProcedureFromAbc = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setAbcObservationOpen(false);
    setCurrentProcedureOpen(true);
  };

  const handleBackToCurrentProcedureFromCorrection = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureFlowSaveState(undefined);
    setCurrentProcedureOpen(true);
  };

  const handleNextActionableOccurrence = (): void => {
    if (
      interactionPaused ||
      !FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextActionableOccurrenceAuthorized ||
      !occurrenceFlowFromOverview ||
      !selectedOccurrenceId
    ) {
      return;
    }
    const next = selectNextActionableOccurrence(todaySupportItems, selectedOccurrenceId);
    if (!next) {
      handleBackToTodaySupport();
      return;
    }
    if (!userDetailById.has(next.userId)) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setProcedureCorrectionOpen(false);
    setProcedureCancellationOpen(false);
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
    setSupportPlanPreviewOpen(false);
    setSelectedOccurrenceId(next.occurrenceId);
    setSelectedUserDetailId(next.userId);
    setOccurrenceFlowFromOverview(true);
    setCurrentProcedureOpen(true);
  };

  const handleReviewDueStateRequest = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setReviewFromSupportPlan(false);
    setReviewDuePreviewOpen(true);
  };

  const handleReviewMaterialsFromPlan = (): void => {
    if (interactionPaused || !supportPlanPreviewOpen) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setReviewFromSupportPlan(true);
    setReviewDuePreviewOpen(true);
    setNextVersionConceptFromReview(false);
  };

  const handleBackToSupportPlanFromReview = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
  };

  const handleNextVersionConceptFromReview = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    setNextVersionConceptFromReview(true);
  };

  const handleBackToOverview = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setReviewDuePreviewOpen(false);
    setReviewFromSupportPlan(false);
    setNextVersionConceptFromReview(false);
  };

  const unauthenticated = isUnauthenticatedViewMode(viewMode);
  const siteUnselected = isSiteUnselected(selection);
  const siteBlocked = !unauthenticated && siteUnselected;
  const selectedSite = !unauthenticated && !siteUnselected ? siteOptionForId(selection) : undefined;
  const showPartialRetrieval =
    !unauthenticated && !siteBlocked && isPartialRetrievalViewMode(viewMode);
  const showReadyRegion = !unauthenticated && !siteBlocked && viewMode === "ready";
  const navDisabled = !isShellPrimaryNavigationEnabled(viewMode, selection) || interactionPaused;
  const plannerMonitoringResult = React.useMemo(
    () => buildDemoMonitoringForVersion(supportPlanPresentation.currentVersion),
    [supportPlanPresentation.currentVersion],
  );

  React.useEffect(() => {
    const node = readyRegionContentRef.current;
    if (!node) {
      return;
    }
    if (interactionPaused) {
      node.setAttribute("inert", "");
    } else {
      node.removeAttribute("inert");
    }
  }, [interactionPaused, showReadyRegion, destination]);

  return (
    <FieldStaffDayBoardBridgeContext.Provider
      value={{
        onClearChosenOccurrence: fieldStaffAdapterActive
          ? handleFieldStaffClearChosenOccurrence
          : undefined,
        clearVisible:
          fieldStaffAdapterActive &&
          fieldStaffDayBoardClearVisible(
            fieldStaffTaskDestination ?? "D-FIND-PERSON",
            fieldStaffChosenOccurrenceId ?? selectedOccurrenceId,
          ),
        useTaskFirstCta: fieldStaffAdapterActive,
      }}
    >
      <div
        className={styles.appShell}
        data-shell-ux="app-shell-chrome"
        data-shell-ux-unauthenticated={unauthenticated ? "true" : "false"}
        data-shell-ux-destination={destination}
        data-shell-ux-user-detail={selectedUserDetailId ?? "none"}
        data-shell-ux-support-plan={supportPlanPreviewOpen ? "open" : "closed"}
        data-shell-ux-current-procedure={currentProcedureOpen ? "open" : "closed"}
        data-shell-ux-procedure-correction={procedureCorrectionOpen ? "open" : "closed"}
        data-shell-ux-procedure-cancellation={procedureCancellationOpen ? "open" : "closed"}
        data-shell-ux-procedure-record={procedureRecordFormOpen ? "open" : "closed"}
        data-shell-ux-abc-observation={abcObservationOpen ? "open" : "closed"}
        data-shell-ux-review-due={reviewDuePreviewOpen ? "open" : "closed"}
        data-planning-pc-review-from-plan={reviewFromSupportPlan ? "true" : "false"}
        data-review-new-version-from-review={nextVersionConceptFromReview ? "true" : "false"}
        data-planning-pc-demo-slice={PLANNING_PC_DEMO_1_SLICE.id}
        data-support-plan-mgmt-demo-slice={SUPPORT_PLAN_MANAGEMENT_LIST_DEMO_1_SLICE.id}
        data-admin-demo-ux-polish-1-slice={ADMIN_DEMO_UX_POLISH_1_SLICE.id}
        data-kiosk-occurrence-id={selectedOccurrenceId ?? ""}
        data-kiosk-occurrence-flow={occurrenceFlowFromOverview ? "true" : "false"}
        data-shell-ux-presentation-role={activePresentationRole}
        data-admin-audit-task-destination={adminAuditTaskDestination ?? "none"}
        data-admin-audit-adapter={adminAuditAdapterActive ? "true" : "false"}
        data-shell-ux-saving-pause={interactionPaused ? "true" : "false"}
        data-demo-ux-7-today-nav="true"
        data-demo-ux-14-slice={DEMO_UX_14_SLICE.id}
        data-field-workflow-slice="FIELD-WORKFLOW-UI"
      >
        <a className={styles.skipLink} href="#shell-ux-main">
          メイン内容へスキップ
        </a>

        <DemoBanner visible={demoMode} />

        <header className={styles.shellHeader} role="banner">
          <div className={styles.brandRow}>
            <p className={styles.productName}>強度行動障害支援（シェル表示）</p>
            {!unauthenticated ? (
              <SaveStatePresentation
                state={effectiveSaveState}
                description={demoHoldSaveStatusNote(effectiveSaveState, demoMode)}
              />
            ) : null}
          </div>
          {!unauthenticated ? (
            <>
              <SiteSelector
                selection={selection}
                options={siteOptions}
                onSelectionChange={handleSelectionChange}
              />
              <DemoPresentationRoleEntry
                visible={demoMode}
                role={activePresentationRole}
                onRoleChange={(next) => {
                  if (interactionPaused) {
                    return;
                  }
                  setActivePresentationRole(next);
                  setNextVersionConceptFromReview(false);
                  onPresentationRoleChange?.(next);
                }}
              />
              {selectedSite ? (
                <CurrentSiteLabel site={selectedSite} />
              ) : (
                <p className={styles.currentSite} data-shell-ux="current-site-unselected">
                  <span className={styles.currentSiteLabel}>現在の事業所（表示専用）</span>
                  <span className={styles.currentSiteValue}>未選択</span>
                </p>
              )}
              <p className={styles.userLine} data-shell-ux="user-display">
                表示名: {userDisplayName}
              </p>
            </>
          ) : (
            <p className={styles.userLine} data-shell-ux="user-display-suppressed">
              表示名: （未認証のため非表示）
            </p>
          )}
        </header>

        {adminAuditAdapterActive ? null : (
          <nav
            className={styles.shellNav}
            aria-label="シェル主要ナビゲーション"
            data-shell-ux="primary-navigation"
          >
            {SHELL_PRIMARY_NAV_ITEMS.map((item) => {
              const selected = item.id === destination;
              const className = selected
                ? `${styles.navButton} ${styles.navButtonSelected}`
                : styles.navButton;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={className}
                  data-shell-ux-nav={item.id}
                  data-shell-ux-nav-selected={selected ? "true" : "false"}
                  data-shell-ux-nav-saving-paused={interactionPaused ? "true" : "false"}
                  aria-current={selected ? "page" : undefined}
                  disabled={navDisabled}
                  aria-disabled={navDisabled ? true : undefined}
                  onClick={() => {
                    if (!navDisabled) {
                      handleDestinationChange(item.id);
                    }
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}

        <main id="shell-ux-main" className={styles.shellMain} tabIndex={-1}>
          {unauthenticated ? (
            <UnauthenticatedPanel />
          ) : siteBlocked ? (
            <SiteUnselectedStop />
          ) : showPartialRetrieval ? (
            <PartialRetrievalPanel
              presentation={
                partialRetrieval ?? {
                  succeededItems: [],
                  failedItems: [],
                }
              }
              correlationId={correlationId}
              errorCode={errorCode}
            />
          ) : (
            <StatusPanel mode={viewMode} correlationId={correlationId} errorCode={errorCode} />
          )}
          {showReadyRegion ? (
            <div
              className={
                interactionPaused
                  ? `${styles.readyRegion} ${styles.readyRegionSavingPaused}`
                  : styles.readyRegion
              }
              data-shell-ux="ready-region"
              data-shell-ux-saving-pause={interactionPaused ? "true" : "false"}
              aria-busy={interactionPaused ? true : undefined}
            >
              {interactionPaused ? (
                <p
                  className={styles.savingInteractionPauseNote}
                  data-shell-ux="saving-interaction-pause-note"
                  role="status"
                >
                  {SAVING_INTERACTION_PAUSE_NOTE}
                </p>
              ) : null}
              <div
                ref={readyRegionContentRef}
                className={interactionPaused ? styles.readyRegionSavingPausedContent : ""}
                data-shell-ux="ready-region-content"
              >
                {adminAuditAdapterActive ? children : null}
                {destination === "overview" && !plannerHidesOverviewBody ? (
                  reviewDuePreviewOpen ? (
                    <ReviewDueState
                      presentation={reviewDueStatePresentation}
                      headingRef={destinationHeadingRef}
                      onBackToOverview={handleBackToOverview}
                      procedureReviewMaterials={procedureWorkflowPresentation.reviewMaterials}
                      reviewObservationEvidence={reviewObservationEvidence}
                      presentationRole={activePresentationRole}
                    />
                  ) : (
                    <OverviewDashboard
                      presentation={overviewPresentation}
                      headingRef={destinationHeadingRef}
                      todaySupportItems={todaySupportItems}
                      selectedOccurrenceId={selectedOccurrenceId}
                      onReviewDueStateRequest={handleReviewDueStateRequest}
                      onTodayActionNavigate={handleTodayActionNavigate}
                      presentationRole={activePresentationRole}
                      onSelectOccurrence={(occId) => {
                        const item = todaySupportItems.find(
                          (entry) => entry.occurrenceId === occId,
                        );
                        if (!item) {
                          return;
                        }
                        if (
                          fieldStaffAdapterActive &&
                          isFieldStaffTodayPrimaryActionStatus(item.effectiveStatus)
                        ) {
                          reportFieldStaffEvent({
                            type: "SELECT_OCCURRENCE",
                            occurrenceId: occId,
                          });
                        }
                        handleTodayActionNavigate({
                          kind: "occurrence",
                          occurrenceId: occId,
                          userId: item.userId,
                        });
                      }}
                    />
                  )
                ) : destination === "users" ? (
                  plannerTaskDestination === "D-MONITOR" &&
                  isLawfulPlannerPersonPlanContext(plannerPersonPlanContext) ? (
                    <div data-role-task-product-body="D-MONITOR">
                      {plannerMonitoringResult.status === "RESOLVED" ? (
                        <MonitoringView
                          model={plannerMonitoringResult.value}
                          personLabel={supportPlanPresentation.personLabel}
                          procedureLabelContext={{
                            userId: supportPlanPresentation.userId,
                            planId: supportPlanPresentation.planId,
                            currentVersion: supportPlanPresentation.currentVersion,
                            currentProcedures: supportPlanPresentation.currentProcedures,
                          }}
                        />
                      ) : (
                        <p role="status" data-monitoring-malformed="true">
                          モニタリング入力を確認できません。記録または期間条件を確認してください（合成）。
                        </p>
                      )}
                    </div>
                  ) : selectedUserDetail ? (
                    reviewDuePreviewOpen && reviewFromSupportPlan ? (
                      <ReviewDueState
                        presentation={reviewDueStatePresentation}
                        headingRef={destinationHeadingRef}
                        backLabel="← 支援計画"
                        onBackToOverview={handleBackToSupportPlanFromReview}
                        onNextVersionConceptRequest={handleNextVersionConceptFromReview}
                        procedureReviewMaterials={procedureWorkflowPresentation.reviewMaterials}
                        reviewObservationEvidence={reviewObservationEvidence}
                        presentationRole={activePresentationRole}
                      />
                    ) : supportPlanPreviewOpen &&
                      supportPlanPresentation.userId === selectedUserDetail.userId ? (
                      <SupportPlan
                        presentation={supportPlanPresentation}
                        headingRef={destinationHeadingRef}
                        onBackToUserDetail={handleBackToUserDetail}
                        backLabel={
                          plannerListOrigin ? SUPPORT_PLAN_MANAGEMENT_BACK_TO_LIST_LABEL : undefined
                        }
                        onReviewMaterialsRequest={handleReviewMaterialsFromPlan}
                        nextVersionConceptHighlighted={nextVersionConceptFromReview}
                        presentationRole={activePresentationRole}
                        onActivePlannerSectionChange={(sectionId) => {
                          reportPlannerEvent({
                            type: "SET_PROCESS_SECTION",
                            sectionId,
                          });
                        }}
                      />
                    ) : abcObservationOpen && abcObservationPresentation ? (
                      <AbcObservationPresentation
                        presentation={abcObservationPresentation}
                        headingRef={destinationHeadingRef}
                        onBackToCurrentProcedure={handleBackToCurrentProcedureFromAbc}
                      />
                    ) : procedureRecordFormOpen &&
                      selectedCurrentProcedure &&
                      isProcedureRecordStartAllowed(selectedCurrentProcedure) ? (
                      <ProcedureRecordForm
                        context={selectedCurrentProcedure.context}
                        headingRef={destinationHeadingRef}
                        initialDraft={
                          procedureRecordResume?.resumed ? procedureRecordResume.draft : undefined
                        }
                        initialSaveState={procedureRecordResume?.saveState ?? "unsaved"}
                        onBackToCurrentProcedure={handleBackToCurrentProcedure}
                        onSaveStateChange={handleProcedureFlowSaveStateChange}
                        onDraftSnapshotChange={handleProcedureDraftSnapshotChange}
                        draftResumeAuthorized={
                          FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.perUserDraftResumeAuthorized
                        }
                        nextOccurrenceNavigationAuthorized={
                          FIELD_STAFF_MULTI_USER_UX_POLISH_1_SLICE.nextActionableOccurrenceAuthorized &&
                          occurrenceFlowFromOverview
                        }
                        todaySupportItems={
                          occurrenceFlowFromOverview ? todaySupportItems : undefined
                        }
                        onNextActionableOccurrence={handleNextActionableOccurrence}
                        onReturnToTodaySupportDayBoard={handleBackToTodaySupport}
                      />
                    ) : procedureCancellationOpen &&
                      procedureCancellationPresentation &&
                      selectedOccurrenceItem?.boundRecord ? (
                      <ProcedureRecordCancellation
                        presentation={procedureCancellationPresentation}
                        originalRecord={selectedOccurrenceItem.boundRecord}
                        lifecycleEventsForSemantics={cancellationLifecycleEventsForSemantics}
                        headingRef={destinationHeadingRef}
                        onBackToCurrentProcedure={handleBackToCurrentProcedureFromCancellation}
                        onSaveStateChange={handleProcedureFlowSaveStateChange}
                        onCancellationPersisted={handleCancellationPersisted}
                      />
                    ) : procedureCorrectionOpen && procedureCorrectionPresentation ? (
                      <ProcedureRecordCorrection
                        presentation={procedureCorrectionPresentation}
                        originalBinding={procedureCorrectionOriginalBinding}
                        headingRef={destinationHeadingRef}
                        onBackToCurrentProcedure={handleBackToCurrentProcedureFromCorrection}
                        onSaveStateChange={handleProcedureFlowSaveStateChange}
                      />
                    ) : currentProcedureOpen && selectedCurrentProcedure ? (
                      <CurrentProcedure
                        presentation={selectedCurrentProcedure}
                        headingRef={destinationHeadingRef}
                        backLabel={occurrenceFlowFromOverview ? "← 今日の支援" : "← 利用者詳細"}
                        onBackToUserDetail={
                          occurrenceFlowFromOverview
                            ? handleBackToTodaySupport
                            : handleBackToUserDetail
                        }
                        onRecordProcedureRequest={
                          isProcedureRecordStartAllowed(selectedCurrentProcedure)
                            ? handleRecordProcedureRequest
                            : undefined
                        }
                        onCorrectionRequest={
                          procedureCorrectionPresentation
                            ? handleProcedureCorrectionRequest
                            : undefined
                        }
                        onCancellationRequest={
                          procedureCancellationPresentation
                            ? handleProcedureCancellationRequest
                            : undefined
                        }
                        onAbcObservationRequest={handleAbcObservationRequest}
                      />
                    ) : (
                      <UserDetail
                        presentation={selectedUserDetail}
                        headingRef={destinationHeadingRef}
                        presentationRole={activePresentationRole}
                        onBackToUsers={handleBackToUsers}
                        onSupportPlanRequest={
                          selectedUserDetail.userId === supportPlanPresentation.userId
                            ? handleSupportPlanRequest
                            : undefined
                        }
                        onCurrentProcedureRequest={
                          fieldStaffAdapterActive && !fieldStaffSessionContext?.hasSupportObject
                            ? undefined
                            : procedureWorkflowPresentation.currentByUserId[
                                  selectedUserDetail.userId
                                ]
                              ? handleCurrentProcedureRequest
                              : undefined
                        }
                      />
                    )
                  ) : plannerListNext &&
                    plannerNextRow &&
                    plannerListNext.kind !== "existing-plan" ? (
                    <SupportPlanManagementNextSurface
                      kind={plannerListNext.kind === "create" ? "create" : "synthetic-detail"}
                      row={plannerNextRow}
                      headingRef={destinationHeadingRef}
                      onBackToList={handleBackToPlannerList}
                    />
                  ) : showPlannerManagementList ? (
                    <SupportPlanManagementList
                      presentation={SUPPORT_PLAN_MANAGEMENT_LIST_FIXTURE}
                      headingRef={destinationHeadingRef}
                      onRowAction={handlePlannerListRowAction}
                    />
                  ) : (
                    <>
                      {fieldStaffAdapterActive && fieldStaffTaskDestination === "D-UNRECORDED" ? (
                        <TodaySupportDayBoard
                          items={todaySupportItems.filter(
                            (item) => item.effectiveStatus === "未実施",
                          )}
                          selectedOccurrenceId={
                            fieldStaffChosenOccurrenceId ?? selectedOccurrenceId
                          }
                          onSelectOccurrence={(occId) => {
                            const item = todaySupportItems.find(
                              (entry) => entry.occurrenceId === occId,
                            );
                            if (!item) {
                              return;
                            }
                            reportFieldStaffEvent({
                              type: "SELECT_OCCURRENCE",
                              occurrenceId: occId,
                            });
                            setSelectedOccurrenceId(occId);
                            setSelectedUserDetailId(item.userId);
                            setOccurrenceFlowFromOverview(true);
                            setCurrentProcedureOpen(true);
                            if (item.canStartProcedureRecord) {
                              setProcedureRecordFormOpen(true);
                            }
                            setDestination("users");
                            if (onSelectedDestinationChange) {
                              onSelectedDestinationChange("users");
                            }
                          }}
                          onClearChosenOccurrence={handleFieldStaffClearChosenOccurrence}
                          occurrenceCtaMode="task-first"
                        />
                      ) : null}
                      <UsersList
                        presentation={usersPresentation}
                        headingRef={destinationHeadingRef}
                        detailPreviewUserIds={detailPreviewUserIds}
                        onUserDetailRequest={handleUserDetailRequest}
                        sessionSaveStateByUserId={sessionSaveStateByUserId}
                        filterChip={usersFilterChip}
                        onFilterChipChange={(chip) => {
                          setUsersFilterChip(rememberUsersFilterChip(chip));
                        }}
                        restoreOriginUserId={usersFocusOriginUserId}
                        restoreListRequested={restoreUsersList}
                        onRestoreListConsumed={() => {
                          setRestoreUsersList(false);
                        }}
                      />
                    </>
                  )
                ) : destination === "records" ? (
                  <DailyRecords
                    presentation={dailyRecordPresentation}
                    headingRef={destinationHeadingRef}
                    presentationRole={activePresentationRole}
                  />
                ) : (
                  <DestinationPlaceholder
                    destination={destination}
                    headingRef={destinationHeadingRef}
                  />
                )}
                {adminAuditAdapterActive ? null : children}
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </FieldStaffDayBoardBridgeContext.Provider>
  );
};
