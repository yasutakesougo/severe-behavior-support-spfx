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
  PLANNER_SYNTHETIC_RECORD_IDS,
  PLANNER_TASK_GLOBAL_ITEMS,
  applyPlannerSessionEvent,
  contextHintForPlannerDestination,
  initialPlannerTaskViewState,
  locationHeadingForPlannerDestination,
  plannerRecordCreateCtaAuthorized,
  primaryActionDestinationForPlannerCycle,
  shellAdapterForPlannerDestination,
  type PlannerCyclePosition,
  type PlannerSessionEvent,
  type PlannerTaskGlobalId,
  type PlannerTaskViewState,
} from "../../../shell/ux/planner-task-navigation";
import type { ShellPresentationRole } from "../../../shell/ux/presentation-role";
import type { ShellPrimaryNavigationId } from "../../../shell/ux/primary-navigation";
import type { IScaffoldShellProps } from "./IScaffoldShellProps";
import styles from "./ScaffoldShell.module.scss";

/**
 * Smoke/test-only injection. Not part of IScaffoldShellProps (§3 OUT).
 * Product webpart entry never supplies these → FIELD_STAFF CORR-1F/1G default.
 */
type ScaffoldShellSmokeInjection = {
  presentationRole?: ShellPresentationRole;
  initialPlannerCycle?: PlannerCyclePosition;
};

type FieldStaffShellState = FieldStaffTaskViewState & {
  role: "FIELD_STAFF";
  shellDestination: ShellPrimaryNavigationId;
};

type PlannerShellState = PlannerTaskViewState & {
  role: "PLANNER";
  shellDestination: ShellPrimaryNavigationId;
};

type ScaffoldShellState = FieldStaffShellState | PlannerShellState;

const cycleOrientationLabel = (cycle: PlannerCyclePosition): string =>
  cycle === "unknown" ? "工程不明" : `現在の工程: ${cycle}`;

const nextHandOrientationLabel = (cycle: PlannerCyclePosition): string => {
  const target = primaryActionDestinationForPlannerCycle(cycle);
  if (!target) {
    return "次の一手: 工程が分かるまで進めません";
  }
  return `次の一手: ${locationHeadingForPlannerDestination(target)}（${target}）`;
};

/**
 * CORR-1G FIELD_STAFF + SBS-PLANNER-TOP-LEVEL-IA-V1 PLANNER product entry.
 * D-* Destination identity is owned here. AppShellChrome remains OUT of PLANNER mutation.
 * Cycle injection is smoke/test boundary only — no Product-visible cycle selector.
 */
export default class ScaffoldShell extends React.Component<
  IScaffoldShellProps,
  ScaffoldShellState
> {
  public state: ScaffoldShellState = this.createInitialState();

  private readonly taskEntryRef = React.createRef<HTMLElement>();

  private smokeInjection(): ScaffoldShellSmokeInjection {
    return this.props as IScaffoldShellProps & ScaffoldShellSmokeInjection;
  }

  private createInitialState(): ScaffoldShellState {
    const injection = this.smokeInjection();
    const role = injection.presentationRole ?? "FIELD_STAFF";
    if (role === "PLANNER") {
      const planner = initialPlannerTaskViewState(injection.initialPlannerCycle ?? "unknown");
      return {
        role: "PLANNER",
        ...planner,
        shellDestination: shellAdapterForPlannerDestination(planner.destination),
      };
    }
    const fieldStaff = initialFieldStaffTaskViewState();
    return {
      role: "FIELD_STAFF",
      ...fieldStaff,
      shellDestination: shellAdapterForFieldStaffDestination(fieldStaff.destination),
    };
  }

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

  private applyFieldStaffEvent(event: FieldStaffSessionEvent, syncAdapter: boolean): void {
    this.setState(
      (current) => {
        if (current.role !== "FIELD_STAFF") {
          return current;
        }
        const next = applyFieldStaffSessionEvent(current, event);
        return {
          role: "FIELD_STAFF" as const,
          ...next,
          shellDestination: shellAdapterForFieldStaffDestination(next.destination),
        };
      },
      () => {
        if (!syncAdapter || this.state.role !== "FIELD_STAFF") {
          return;
        }
        this.requestLegacyShellDestination(this.state.shellDestination, this.state.destination);
      },
    );
  }

  private applyPlannerEvent(event: PlannerSessionEvent): void {
    this.setState((current) => {
      if (current.role !== "PLANNER") {
        return current;
      }
      const next = applyPlannerSessionEvent(current, event);
      return {
        role: "PLANNER" as const,
        ...next,
        shellDestination: shellAdapterForPlannerDestination(next.destination),
      };
    });
  }

  private readonly handleFieldStaffGlobalChange = (globalId: FieldStaffTaskGlobalId): void => {
    this.applyFieldStaffEvent({ type: "GLOBAL", globalId }, true);
  };

  private readonly handleFieldStaffSessionEvent = (event: FieldStaffSessionEvent): void => {
    this.applyFieldStaffEvent(event, false);
  };

  private readonly handlePlannerGlobalChange = (globalId: PlannerTaskGlobalId): void => {
    this.applyPlannerEvent({ type: "GLOBAL", globalId });
  };

  private readonly handleShellDestinationChange = (
    shellDestination: ShellPrimaryNavigationId,
  ): void => {
    if (this.state.role === "PLANNER") {
      this.setState((current) => ({ ...current, shellDestination }));
      return;
    }
    if (shellDestination === "overview") {
      this.setState((current) => {
        if (current.role !== "FIELD_STAFF") {
          return current;
        }
        if (current.destination === "D-TODAY") {
          return { ...current, shellDestination: "overview" };
        }
        const next = applyFieldStaffSessionEvent(current, {
          type: "GLOBAL",
          globalId: "GLOBAL-TODAY",
        });
        return {
          role: "FIELD_STAFF" as const,
          ...next,
          shellDestination: "overview",
        };
      });
      return;
    }
    this.setState((current) => ({
      ...current,
      shellDestination,
    }));
  };

  private renderFieldStaffTaskLayer(state: FieldStaffShellState): React.ReactElement {
    const { activeGlobalId, destination, sessionContext } = state;
    const contextHint = contextHintForFieldStaffGlobal(activeGlobalId, sessionContext);
    return (
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
                onClick={() => this.handleFieldStaffGlobalChange(item.globalId)}
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
    );
  }

  private renderPlannerTaskLayer(state: PlannerShellState): React.ReactElement {
    const { activeGlobalId, destination, currentCycle, selectedRecordId } = state;
    const contextHint = contextHintForPlannerDestination(destination, currentCycle);
    const primaryTarget = primaryActionDestinationForPlannerCycle(currentCycle);
    const primaryEnabled = destination === "D-HOME" && primaryTarget !== undefined;

    return (
      <section
        ref={this.taskEntryRef}
        className={styles.scaffoldShell}
        data-role-task-ia="PLANNER"
        data-role-task-destination={destination}
        data-role-task-active-global={activeGlobalId}
        data-role-task-cycle={currentCycle}
        data-role-task-record-create={plannerRecordCreateCtaAuthorized ? "true" : "false"}
      >
        <p className={styles.bodyTitle} data-shell-ux="shell-host-status" hidden={true} />
        <p className={styles.taskHeading} role="heading" aria-level={1}>
          {locationHeadingForPlannerDestination(destination)}
        </p>
        <nav className={styles.taskNavigation} aria-label="計画担当の業務ナビゲーション">
          {PLANNER_TASK_GLOBAL_ITEMS.map((item) => {
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
                onClick={() => this.handlePlannerGlobalChange(item.globalId)}
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
          今どこ: {locationHeadingForPlannerDestination(destination)}（{destination}）
        </p>

        {destination === "D-HOME" ? (
          <div className={styles.plannerOrientation} data-role-task-home-orientation="true">
            <p className={styles.contextHint} data-role-task-cycle-display={currentCycle}>
              {cycleOrientationLabel(currentCycle)}
            </p>
            <p className={styles.contextHint} data-role-task-next-hand={primaryTarget ?? "none"}>
              {nextHandOrientationLabel(currentCycle)}
            </p>
            <button
              type="button"
              className={styles.taskButtonSelected}
              data-role-task-primary-action="true"
              disabled={!primaryEnabled}
              onClick={() => this.applyPlannerEvent({ type: "PRIMARY_ACTION" })}
            >
              次の一手へ進む
            </button>
          </div>
        ) : null}

        {destination === "D-FIND-RECORD" ? (
          <div className={styles.plannerFixtureRow} data-role-task-record-index="true">
            {PLANNER_SYNTHETIC_RECORD_IDS.map((recordId) => (
              <button
                key={recordId}
                type="button"
                className={styles.taskButton}
                data-role-task-select-record={recordId}
                onClick={() => this.applyPlannerEvent({ type: "SELECT_RECORD", recordId })}
              >
                記録を選ぶ（{recordId}）
              </button>
            ))}
            <button
              type="button"
              className={styles.taskButton}
              data-role-task-back="true"
              onClick={() => this.applyPlannerEvent({ type: "BACK" })}
            >
              戻る
            </button>
          </div>
        ) : null}

        {destination === "D-RECORD-READ" ? (
          <div data-role-task-record-read="true">
            <p className={styles.contextHint} data-role-task-selected-record={selectedRecordId}>
              選択中の記録: {selectedRecordId ?? "なし"}（読む専用）
            </p>
            {/* AC-PL-TL-9: no record-create CTA */}
            <button
              type="button"
              className={styles.taskButton}
              data-role-task-back="true"
              onClick={() => this.applyPlannerEvent({ type: "BACK" })}
            >
              戻る
            </button>
          </div>
        ) : null}

        {destination !== "D-HOME" &&
        destination !== "D-FIND-RECORD" &&
        destination !== "D-RECORD-READ" ? (
          <button
            type="button"
            className={styles.taskButton}
            data-role-task-back="true"
            onClick={() => this.applyPlannerEvent({ type: "BACK" })}
          >
            戻る
          </button>
        ) : null}
      </section>
    );
  }

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
    const presentationRole: ShellPresentationRole = this.state.role;

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
        presentationRole={presentationRole}
        fieldStaffTaskDestination={
          this.state.role === "FIELD_STAFF" ? this.state.destination : undefined
        }
        fieldStaffSessionContext={
          this.state.role === "FIELD_STAFF" ? this.state.sessionContext : undefined
        }
        fieldStaffChosenOccurrenceId={
          this.state.role === "FIELD_STAFF" ? this.state.chosenOccurrenceId : undefined
        }
        onFieldStaffSessionEvent={
          this.state.role === "FIELD_STAFF" ? this.handleFieldStaffSessionEvent : undefined
        }
      >
        {this.state.role === "PLANNER"
          ? this.renderPlannerTaskLayer(this.state)
          : this.renderFieldStaffTaskLayer(this.state)}
      </AppShellChrome>
    );
  }
}
