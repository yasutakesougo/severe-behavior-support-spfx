import * as React from "react";
import {
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  OverviewDashboard,
  type OverviewActionNavigationTarget,
  type ShellOverviewPresentation,
} from "../dashboard";
import {
  CurrentProcedure,
  FIELD_WORKFLOW_PROCEDURE_FIXTURE,
  canInvokeProcedureRecordStart,
  getKioskSyntheticTodaySupportItems,
  isProcedureRecordStartAllowed,
  ProcedureRecordForm,
  type ShellProcedureWorkflowPresentation,
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
  SupportPlan,
  UserDetail,
  UsersList,
  type ShellSupportPlanPresentation,
  type ShellUserDetailPresentation,
  type ShellUsersPresentation,
} from "../users";
import { CurrentSiteLabel } from "./CurrentSiteLabel";
import { DemoBanner } from "./DemoBanner";
import { DestinationPlaceholder } from "./DestinationPlaceholder";
import { SHELL_DEFAULT_DESTINATION } from "./destination";
import { PartialRetrievalPanel } from "./PartialRetrievalPanel";
import type { ShellPartialRetrievalPresentation } from "./partial-retrieval";
import { SaveStatePresentation } from "./SaveStatePresentation";
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
    children,
  } = props;

  const [selection, setSelection] = React.useState<ShellSiteSelection>(siteSelection);
  const [destination, setDestination] = React.useState<ShellPrimaryNavigationId>(
    selectedDestinationProp ?? SHELL_DEFAULT_DESTINATION,
  );
  const [selectedUserDetailId, setSelectedUserDetailId] = React.useState<string | undefined>();
  const [supportPlanPreviewOpen, setSupportPlanPreviewOpen] = React.useState(false);
  const [currentProcedureOpen, setCurrentProcedureOpen] = React.useState(false);
  const [procedureRecordFormOpen, setProcedureRecordFormOpen] = React.useState(false);
  const [procedureFlowSaveState, setProcedureFlowSaveState] = React.useState<
    ShellSaveState | undefined
  >();
  const [reviewDuePreviewOpen, setReviewDuePreviewOpen] = React.useState(false);
  const [selectedOccurrenceId, setSelectedOccurrenceId] = React.useState<string | undefined>();
  const [occurrenceFlowFromOverview, setOccurrenceFlowFromOverview] = React.useState(false);
  const todaySupportItems = React.useMemo(() => getKioskSyntheticTodaySupportItems(), []);
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

  React.useEffect(() => {
    setSelection(siteSelection);
  }, [siteSelection]);

  React.useEffect(() => {
    if (selectedDestinationProp !== undefined) {
      setDestination(selectedDestinationProp);
    }
  }, [selectedDestinationProp]);

  React.useEffect(() => {
    if (destination !== "users") {
      if (selectedUserDetailId !== undefined) {
        setSelectedUserDetailId(undefined);
      }
      if (supportPlanPreviewOpen) {
        setSupportPlanPreviewOpen(false);
      }
      if (currentProcedureOpen) {
        setCurrentProcedureOpen(false);
      }
      if (procedureRecordFormOpen) {
        setProcedureRecordFormOpen(false);
      }
      if (procedureFlowSaveState !== undefined) {
        setProcedureFlowSaveState(undefined);
      }
      if (occurrenceFlowFromOverview) {
        setOccurrenceFlowFromOverview(false);
      }
    }
    if (destination !== "overview" && reviewDuePreviewOpen) {
      setReviewDuePreviewOpen(false);
    }
  }, [
    destination,
    selectedUserDetailId,
    supportPlanPreviewOpen,
    currentProcedureOpen,
    procedureRecordFormOpen,
    procedureFlowSaveState,
    reviewDuePreviewOpen,
    occurrenceFlowFromOverview,
  ]);

  React.useEffect(() => {
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
    procedureRecordFormOpen,
    reviewDuePreviewOpen,
  ]);

  const interactionPaused = isSavingInteractionPaused(effectiveSaveState);

  const handleSelectionChange = (next: ShellSiteSelection): void => {
    setSelection(next);
    if (onSiteSelectionChange) {
      onSiteSelectionChange(next);
    }
  };

  const handleDestinationChange = (next: ShellPrimaryNavigationId): void => {
    if (interactionPaused) {
      return;
    }
    if (next === destination) {
      if (
        next === "users" &&
        (selectedUserDetailId !== undefined ||
          supportPlanPreviewOpen ||
          currentProcedureOpen ||
          procedureRecordFormOpen)
      ) {
        shouldFocusDestinationRef.current = true;
        setSupportPlanPreviewOpen(false);
        setCurrentProcedureOpen(false);
        setProcedureRecordFormOpen(false);
        setProcedureFlowSaveState(undefined);
        setSelectedUserDetailId(undefined);
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
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
    setSelectedUserDetailId(undefined);
    setReviewDuePreviewOpen(false);
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
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
    setSelectedUserDetailId(userId);
  };

  const handleTodayActionNavigate = (target: OverviewActionNavigationTarget): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
    if (target.kind === "records") {
      setSelectedUserDetailId(undefined);
      setReviewDuePreviewOpen(false);
      setCurrentProcedureOpen(false);
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
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
    setSelectedUserDetailId(undefined);
  };

  const handleSupportPlanRequest = (): void => {
    if (interactionPaused || selectedUserDetailId !== supportPlanPresentation.userId) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setCurrentProcedureOpen(false);
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
    setSupportPlanPreviewOpen(true);
  };

  const handleBackToUserDetail = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
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
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
    setOccurrenceFlowFromOverview(false);
    setCurrentProcedureOpen(true);
  };

  const handleBackToTodaySupport = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setSupportPlanPreviewOpen(false);
    setCurrentProcedureOpen(false);
    setProcedureRecordFormOpen(false);
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
    setProcedureRecordFormOpen(true);
    setProcedureFlowSaveState("unsaved");
  };

  const handleBackToCurrentProcedure = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setProcedureRecordFormOpen(false);
    setProcedureFlowSaveState(undefined);
  };

  const handleReviewDueStateRequest = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setReviewDuePreviewOpen(true);
  };

  const handleBackToOverview = (): void => {
    if (interactionPaused) {
      return;
    }
    shouldFocusDestinationRef.current = true;
    setReviewDuePreviewOpen(false);
  };

  const unauthenticated = isUnauthenticatedViewMode(viewMode);
  const siteUnselected = isSiteUnselected(selection);
  const siteBlocked = !unauthenticated && siteUnselected;
  const selectedSite = !unauthenticated && !siteUnselected ? siteOptionForId(selection) : undefined;
  const showPartialRetrieval =
    !unauthenticated && !siteBlocked && isPartialRetrievalViewMode(viewMode);
  const showReadyRegion = !unauthenticated && !siteBlocked && viewMode === "ready";
  const navDisabled = !isShellPrimaryNavigationEnabled(viewMode, selection) || interactionPaused;

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
    <div
      className={styles.appShell}
      data-shell-ux="app-shell-chrome"
      data-shell-ux-unauthenticated={unauthenticated ? "true" : "false"}
      data-shell-ux-destination={destination}
      data-shell-ux-user-detail={selectedUserDetailId ?? "none"}
      data-shell-ux-support-plan={supportPlanPreviewOpen ? "open" : "closed"}
      data-shell-ux-current-procedure={currentProcedureOpen ? "open" : "closed"}
      data-shell-ux-procedure-record={procedureRecordFormOpen ? "open" : "closed"}
      data-shell-ux-review-due={reviewDuePreviewOpen ? "open" : "closed"}
      data-kiosk-occurrence-id={selectedOccurrenceId ?? ""}
      data-kiosk-occurrence-flow={occurrenceFlowFromOverview ? "true" : "false"}
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
          {!unauthenticated ? <SaveStatePresentation state={effectiveSaveState} /> : null}
        </div>
        {!unauthenticated ? (
          <>
            <SiteSelector
              selection={selection}
              options={siteOptions}
              onSelectionChange={handleSelectionChange}
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
              {destination === "overview" ? (
                reviewDuePreviewOpen ? (
                  <ReviewDueState
                    presentation={reviewDueStatePresentation}
                    headingRef={destinationHeadingRef}
                    onBackToOverview={handleBackToOverview}
                    procedureReviewMaterials={procedureWorkflowPresentation.reviewMaterials}
                  />
                ) : (
                  <OverviewDashboard
                    presentation={overviewPresentation}
                    headingRef={destinationHeadingRef}
                    todaySupportItems={todaySupportItems}
                    selectedOccurrenceId={selectedOccurrenceId}
                    onReviewDueStateRequest={handleReviewDueStateRequest}
                    onTodayActionNavigate={handleTodayActionNavigate}
                    onSelectOccurrence={(occId) => {
                      const item = todaySupportItems.find((entry) => entry.occurrenceId === occId);
                      if (!item) {
                        return;
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
                selectedUserDetail ? (
                  supportPlanPreviewOpen &&
                  supportPlanPresentation.userId === selectedUserDetail.userId ? (
                    <SupportPlan
                      presentation={supportPlanPresentation}
                      headingRef={destinationHeadingRef}
                      onBackToUserDetail={handleBackToUserDetail}
                    />
                  ) : procedureRecordFormOpen &&
                    selectedCurrentProcedure &&
                    isProcedureRecordStartAllowed(selectedCurrentProcedure) ? (
                    <ProcedureRecordForm
                      context={selectedCurrentProcedure.context}
                      headingRef={destinationHeadingRef}
                      onBackToCurrentProcedure={handleBackToCurrentProcedure}
                      onSaveStateChange={setProcedureFlowSaveState}
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
                    />
                  ) : (
                    <UserDetail
                      presentation={selectedUserDetail}
                      headingRef={destinationHeadingRef}
                      onBackToUsers={handleBackToUsers}
                      onSupportPlanRequest={
                        selectedUserDetail.userId === supportPlanPresentation.userId
                          ? handleSupportPlanRequest
                          : undefined
                      }
                      onCurrentProcedureRequest={
                        procedureWorkflowPresentation.currentByUserId[selectedUserDetail.userId]
                          ? handleCurrentProcedureRequest
                          : undefined
                      }
                    />
                  )
                ) : (
                  <UsersList
                    presentation={usersPresentation}
                    headingRef={destinationHeadingRef}
                    detailPreviewUserIds={detailPreviewUserIds}
                    onUserDetailRequest={handleUserDetailRequest}
                  />
                )
              ) : destination === "records" ? (
                <DailyRecords
                  presentation={dailyRecordPresentation}
                  headingRef={destinationHeadingRef}
                />
              ) : (
                <DestinationPlaceholder
                  destination={destination}
                  headingRef={destinationHeadingRef}
                />
              )}
              {children}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};
