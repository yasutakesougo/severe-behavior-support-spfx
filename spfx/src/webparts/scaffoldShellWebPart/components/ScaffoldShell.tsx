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
import type { ShellPrimaryNavigationId } from "../../../shell/ux/primary-navigation";
import type { IScaffoldShellProps } from "./IScaffoldShellProps";
import styles from "./ScaffoldShell.module.scss";

type ScaffoldShellState = FieldStaffTaskViewState & {
  shellDestination: ShellPrimaryNavigationId;
};

/**
 * CORR-1G FIELD_STAFF product entry. D-* Destination identity and sessionContext
 * are owned here; AppShellChrome reports listed events only (Scope §3.2).
 */
export default class ScaffoldShell extends React.Component<
  IScaffoldShellProps,
  ScaffoldShellState
> {
  public state: ScaffoldShellState = {
    ...initialFieldStaffTaskViewState(),
    shellDestination: "overview",
  };

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

  private commitTaskState(next: FieldStaffTaskViewState): void {
    const shellDestination = shellAdapterForFieldStaffDestination(next.destination);
    this.setState(
      {
        ...next,
        shellDestination,
      },
      () => {
        this.requestLegacyShellDestination(shellDestination, next.destination);
      },
    );
  }

  private readonly handleTaskGlobalChange = (globalId: FieldStaffTaskGlobalId): void => {
    this.commitTaskState(applyFieldStaffSessionEvent(this.state, { type: "GLOBAL", globalId }));
  };

  private readonly handleFieldStaffSessionEvent = (event: FieldStaffSessionEvent): void => {
    this.commitTaskState(applyFieldStaffSessionEvent(this.state, event));
  };

  private readonly handleShellDestinationChange = (
    shellDestination: ShellPrimaryNavigationId,
  ): void => {
    if (shellDestination === "overview") {
      this.handleTaskGlobalChange("GLOBAL-TODAY");
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
    const { activeGlobalId, destination, sessionContext } = this.state;
    const contextHint = contextHintForFieldStaffGlobal(activeGlobalId, sessionContext);

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
        presentationRole="FIELD_STAFF"
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
      </AppShellChrome>
    );
  }
}
