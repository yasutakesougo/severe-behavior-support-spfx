import * as React from "react";
import { AppShellChrome } from "../../../shell/ux";
import {
  FIELD_STAFF_TASK_GLOBAL_ITEMS,
  applyFieldStaffSessionEvent,
  contextHintForFieldStaffGlobal,
  initialFieldStaffTaskViewState,
  locationHeadingForFieldStaffDestination,
  shellAdapterForFieldStaffDestination,
  type FieldStaffSessionEvent,
  type FieldStaffTaskDestinationId,
  type FieldStaffTaskGlobalId,
  type FieldStaffTaskViewState,
} from "../../../shell/ux/field-staff-task-navigation";
import {
  PLANNER_TASK_GLOBAL_ITEMS,
  applyPlannerBack,
  applyPlannerGlobalSelection,
  applyPlannerHomePrimaryAction,
  initialPlannerTaskViewState,
  locationHeadingForPlannerDestination,
  parsePlannerCyclePosition,
  plannerPrimaryActionDestination,
  plannerPrimaryActionLabel,
  selectPlannerRecord,
  type PlannerCyclePosition,
  type PlannerTaskGlobalId,
  type PlannerTaskViewState,
} from "../../../shell/ux/planner-task-navigation";
import type { ShellPrimaryNavigationId } from "../../../shell/ux/primary-navigation";
import type { IScaffoldShellProps } from "./IScaffoldShellProps";
import styles from "./ScaffoldShell.module.scss";

type ScaffoldShellState = FieldStaffTaskViewState & {
  shellDestination: ShellPrimaryNavigationId;
  plannerTask: PlannerTaskViewState;
};

const plannerCycleFromDemoLocation = (demoMode: boolean): PlannerCyclePosition => {
  if (!demoMode || typeof window === "undefined") {
    return "unknown";
  }
  const params = new URLSearchParams(window.location.search);
  return parsePlannerCyclePosition(params.get("sbsPlannerCycle"));
};

const presentationRoleFromDemoLocation = (demoMode: boolean): "FIELD_STAFF" | "PLANNER" => {
  if (!demoMode || typeof window === "undefined") {
    return "FIELD_STAFF";
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("sbsPresentationRole") === "PLANNER" ? "PLANNER" : "FIELD_STAFF";
};

/**
 * CORR-1G FIELD_STAFF product entry + SBS-PLANNER-TOP-LEVEL-IA-V1
 * PLANNER Task-First proof. D-* Destination identity is owned here while
 * AppShellChrome remains an unchanged legacy host/adapter.
 */
export default class ScaffoldShell extends React.Component<
  IScaffoldShellProps,
  ScaffoldShellState
> {
  public constructor(props: IScaffoldShellProps) {
    super(props);
    this.state = {
      ...initialFieldStaffTaskViewState(),
      shellDestination: "overview",
      plannerTask: initialPlannerTaskViewState(plannerCycleFromDemoLocation(props.demoMode)),
    };
  }

  private readonly taskEntryRef = React.createRef<HTMLElement>();

  private requestLegacyShellDestination(
    shellDestination: ShellPrimaryNavigationId,
    taskDestination: FieldStaffTaskDestinationId,
  ): void {
    const shell = this.taskEntryRef.current?.closest('[data-shell-ux="app-shell-chrome"]');
    const button = shell?.querySelector<HTMLButtonElement>(
      `[data-shell-ux-nav="${shellDestination}"]`,
    );
    if (!button || button.disabled) {
      return;
    }
    button.click();

    if (taskDestination === "D-UNRECORDED") {
      window.requestAnimationFrame(() => {
        const unrecorded = shell?.querySelector<HTMLButtonElement>(
          '[data-demo-ux="users-filter-chip"][data-demo-ux-filter="未記録"]',
        );
        if (unrecorded && !unrecorded.disabled) {
          unrecorded.click();
        }
      });
    }
  }

  private applySessionEvent(event: FieldStaffSessionEvent, syncAdapter: boolean): void {
    this.setState(
      (current) => {
        const next = applyFieldStaffSessionEvent(current, event);
        return {
          ...current,
          ...next,
          shellDestination: shellAdapterForFieldStaffDestination(next.destination),
        };
      },
      () => {
        if (!syncAdapter) {
          return;
        }
        this.requestLegacyShellDestination(this.state.shellDestination, this.state.destination);
      },
    );
  }

  private readonly handleTaskGlobalChange = (globalId: FieldStaffTaskGlobalId): void => {
    this.applySessionEvent({ type: "GLOBAL", globalId }, true);
  };

  private readonly handleFieldStaffSessionEvent = (event: FieldStaffSessionEvent): void => {
    this.applySessionEvent(event, false);
  };

  private readonly handlePlannerGlobalChange = (globalId: PlannerTaskGlobalId): void => {
    this.setState((current) => ({
      ...current,
      plannerTask: applyPlannerGlobalSelection(current.plannerTask, globalId),
    }));
  };

  private readonly handlePlannerPrimaryAction = (): void => {
    this.setState((current) => ({
      ...current,
      plannerTask: applyPlannerHomePrimaryAction(current.plannerTask),
    }));
  };

  private readonly handlePlannerSyntheticRecordSelect = (): void => {
    this.setState((current) => ({
      ...current,
      plannerTask: selectPlannerRecord(current.plannerTask, "synthetic-planner-record-1"),
    }));
  };

  private readonly handlePlannerBack = (): void => {
    this.setState((current) => ({
      ...current,
      plannerTask: applyPlannerBack(current.plannerTask),
    }));
  };

  private readonly handleShellDestinationChange = (
    shellDestination: ShellPrimaryNavigationId,
  ): void => {
    if (shellDestination === "overview") {
      this.setState((current) => {
        if (current.destination === "D-TODAY") {
          return { ...current, shellDestination: "overview" };
        }
        const next = applyFieldStaffSessionEvent(current, {
          type: "GLOBAL",
          globalId: "GLOBAL-TODAY",
        });
        return { ...current, ...next, shellDestination: "overview" };
      });
      return;
    }
    this.setState((current) => ({
      ...current,
      shellDestination,
    }));
  };

  public render(): React.ReactElement<IScaffoldShellProps> {
    const {
      userDisplayName,
      demoMode,
      siteSelection,
      saveState,
      viewMode,
      correlationId,
      errorCode,
      partialRetrieval,
    } = this.props;
    const { activeGlobalId, destination, sessionContext, plannerTask } = this.state;
    const contextHint = contextHintForFieldStaffGlobal(activeGlobalId, sessionContext);
    const plannerHeading = locationHeadingForPlannerDestination(plannerTask.destination);
    const plannerNextDestination = plannerPrimaryActionDestination(plannerTask.currentCycle);
    const plannerEntryRole = presentationRoleFromDemoLocation(demoMode);

    return (
      <AppShellChrome
        demoMode={demoMode}
        siteSelection={siteSelection}
        saveState={saveState}
        viewMode={viewMode}
        correlationId={correlationId}
        errorCode={errorCode}
        userDisplayName={userDisplayName}
        partialRetrieval={partialRetrieval}
        selectedDestination={this.state.shellDestination}
        onSelectedDestinationChange={this.handleShellDestinationChange}
        presentationRole={plannerEntryRole}
        fieldStaffTaskDestination={destination}
        fieldStaffSessionContext={sessionContext}
        fieldStaffChosenOccurrenceId={this.state.chosenOccurrenceId}
        onFieldStaffSessionEvent={this.handleFieldStaffSessionEvent}
      >
        <section
          ref={this.taskEntryRef}
          className={styles.scaffoldShell}
          data-role-task-ia="FIELD_STAFF"
          data-role-task-destination={destination}
          data-role-task-active-global={activeGlobalId}
          data-role-task-object={sessionContext.hasSupportObject ? "true" : "false"}
          data-role-task-occurrence={sessionContext.hasOccurrenceContext ? "true" : "false"}
        >
          <p className={styles.bodyTitle} data-shell-ux="shell-host-status" hidden={true} />
          <p className={styles.taskHeading} role="heading" aria-level={1}>
            {locationHeadingForFieldStaffDestination(destination)}
          </p>
          <nav className={styles.taskNavigation} aria-label="現場職員の業務ナビゲーション">
            {FIELD_STAFF_TASK_GLOBAL_ITEMS.map((item) => {
              const selected = item.globalId === activeGlobalId;
              return (
                <button
                  key={item.globalId}
                  type="button"
                  className={selected ? styles.taskButtonSelected : styles.taskButton}
                  data-role-task-global={item.globalId}
                  data-role-task-nav={item.sufficientDestination}
                  data-role-task-selected={selected ? "true" : "false"}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => this.handleTaskGlobalChange(item.globalId)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <p className={styles.contextHint} data-role-task-context-hint={destination}>
            {contextHint}
          </p>
          <p className={styles.srOnly} data-role-task-orientation="今どこ">
            今どこ: {locationHeadingForFieldStaffDestination(destination)}（{destination}）
          </p>
        </section>

        <section
          className={styles.scaffoldShell}
          data-role-task-ia="PLANNER"
          data-role-task-destination={plannerTask.destination}
          data-role-task-active-global={plannerTask.activeGlobalId}
          data-planner-current-cycle={plannerTask.currentCycle}
        >
          <p className={styles.taskHeading} role="heading" aria-level={1}>
            {plannerHeading}
          </p>

          <nav className={styles.taskNavigation} aria-label="計画担当の業務ナビゲーション">
            {PLANNER_TASK_GLOBAL_ITEMS.map((item) => {
              const selected = item.globalId === plannerTask.activeGlobalId;
              return (
                <button
                  key={item.globalId}
                  type="button"
                  className={selected ? styles.taskButtonSelected : styles.taskButton}
                  data-planner-global={item.globalId}
                  data-role-task-nav={item.destination}
                  data-role-task-selected={selected ? "true" : "false"}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => this.handlePlannerGlobalChange(item.globalId)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <p className={styles.contextHint} data-planner-cycle-label="true">
            現在工程: {plannerTask.currentCycle === "unknown" ? "未確定" : plannerTask.currentCycle}
          </p>

          {plannerTask.destination === "D-HOME" ? (
            <>
              <p className={styles.contextHint} data-planner-orientation="current-and-next">
                今どこ: {plannerHeading}。次の一手を現在工程から確認します。
              </p>
              <button
                type="button"
                className={styles.taskButton}
                data-planner-primary-action={plannerNextDestination}
                disabled={plannerTask.currentCycle === "unknown"}
                aria-disabled={plannerTask.currentCycle === "unknown" ? true : undefined}
                onClick={this.handlePlannerPrimaryAction}
              >
                {plannerPrimaryActionLabel(plannerTask.currentCycle)}
              </button>
              {plannerTask.currentCycle === "unknown" ? (
                <p className={styles.contextHint} data-planner-fail-closed="true">
                  現在工程が未確定のため、D-HOMEから先へは進みません。
                </p>
              ) : null}
            </>
          ) : null}

          {plannerTask.destination === "D-FIND-RECORD" ? (
            <>
              <p className={styles.contextHint} data-planner-record-index="true">
                記録の一覧・期間を確認します。ここはGlobal「探す」ではありません。
              </p>
              {demoMode ? (
                <button
                  type="button"
                  className={styles.taskButton}
                  data-planner-synthetic-record="synthetic-planner-record-1"
                  onClick={this.handlePlannerSyntheticRecordSelect}
                >
                  合成記録を見る
                </button>
              ) : null}
            </>
          ) : null}

          {plannerTask.destination === "D-RECORD-READ" ? (
            <div data-planner-record-read="true" data-planner-read-only="true">
              <p className={styles.contextHint}>選択した記録を読み取り専用で確認します。</p>
              <p className={styles.contextHint}>
                記録ID: {plannerTask.selectedRecordId ?? "未選択"}
              </p>
            </div>
          ) : null}

          {plannerTask.destination !== "D-HOME" &&
          plannerTask.destination !== "D-FIND-RECORD" &&
          plannerTask.destination !== "D-RECORD-READ" ? (
            <p className={styles.contextHint} data-planner-destination-orientation="true">
              今どこ: {plannerHeading}（{plannerTask.destination}）
            </p>
          ) : null}

          {plannerTask.previousDestination ? (
            <button
              type="button"
              className={styles.taskButton}
              data-planner-back={plannerTask.previousDestination}
              onClick={this.handlePlannerBack}
            >
              ← {locationHeadingForPlannerDestination(plannerTask.previousDestination)}
            </button>
          ) : null}

          <p className={styles.srOnly} data-role-task-orientation="今どこ">
            今どこ: {plannerHeading}（{plannerTask.destination}）
          </p>
        </section>
      </AppShellChrome>
    );
  }
}
