import * as React from "react";
import { AppShellChrome } from "../../../shell/ux";
import {
  FIELD_STAFF_DEFAULT_TASK_DESTINATION,
  FIELD_STAFF_TASK_GLOBAL_ITEMS,
  contextHintForFieldStaffGlobal,
  fieldStaffTaskGlobalItem,
  locationHeadingForFieldStaffDestination,
  resolveFieldStaffTaskSelection,
  type FieldStaffSessionContext,
  type FieldStaffTaskDestinationId,
  type FieldStaffTaskGlobalId,
} from "../../../shell/ux/field-staff-task-navigation";
import type { ShellPrimaryNavigationId } from "../../../shell/ux/primary-navigation";
import type { IScaffoldShellProps } from "./IScaffoldShellProps";
import styles from "./ScaffoldShell.module.scss";

type ScaffoldShellState = Readonly<{
  activeGlobalId: FieldStaffTaskGlobalId;
  taskDestination: FieldStaffTaskDestinationId;
  shellDestination: ShellPrimaryNavigationId;
  sessionContext: FieldStaffSessionContext;
}>;

/**
 * CORR-1F FIELD_STAFF product entry. D-* Destination identity is owned here;
 * AppShellChrome remains an unchanged legacy adapter host per Scope §3.2.
 */
export default class ScaffoldShell extends React.Component<IScaffoldShellProps, ScaffoldShellState> {
  public state: ScaffoldShellState = {
    activeGlobalId: "GLOBAL-TODAY",
    taskDestination: FIELD_STAFF_DEFAULT_TASK_DESTINATION,
    shellDestination: "overview",
    sessionContext: {
      hasSupportObject: false,
      hasOccurrenceContext: false,
    },
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

  private applyTaskSelection(globalId: FieldStaffTaskGlobalId): void {
    const resolution = resolveFieldStaffTaskSelection(globalId, this.state.sessionContext);
    this.setState(
      {
        activeGlobalId: globalId,
        taskDestination: resolution.destination,
        shellDestination: resolution.shellDestination,
      },
      () => {
        this.requestLegacyShellDestination(resolution.shellDestination, resolution.destination);
      },
    );
  }

  private readonly handleTaskGlobalChange = (globalId: FieldStaffTaskGlobalId): void => {
    this.applyTaskSelection(globalId);
  };

  private readonly handleShellDestinationChange = (
    shellDestination: ShellPrimaryNavigationId,
  ): void => {
    if (shellDestination === "overview") {
      this.applyTaskSelection("GLOBAL-TODAY");
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
    const { activeGlobalId, taskDestination, shellDestination, sessionContext } = this.state;
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
        selectedDestination={shellDestination}
        onSelectedDestinationChange={this.handleShellDestinationChange}
        presentationRole="FIELD_STAFF"
      >
        <section
          ref={this.taskEntryRef}
          className={styles.scaffoldShell}
          data-role-task-ia="FIELD_STAFF"
          data-role-task-destination={taskDestination}
          data-role-task-active-global={activeGlobalId}
        >
          <p className={styles.bodyTitle} data-shell-ux="shell-host-status" hidden={true} />
          <p className={styles.taskHeading} role="heading" aria-level={1}>
            {locationHeadingForFieldStaffDestination(taskDestination)}
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
          <p className={styles.contextHint} data-role-task-context-hint={taskDestination}>
            {contextHint}
          </p>
          <p className={styles.srOnly} data-role-task-orientation="今どこ">
            今どこ: {fieldStaffTaskGlobalItem(activeGlobalId).label}（{taskDestination}）
          </p>
        </section>
      </AppShellChrome>
    );
  }
}
