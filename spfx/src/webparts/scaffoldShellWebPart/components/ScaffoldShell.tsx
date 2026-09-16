import * as React from "react";
import { AppShellChrome } from "../../../shell/ux";
import {
  FIELD_STAFF_DEFAULT_TASK_DESTINATION,
  FIELD_STAFF_TASK_NAV_ITEMS,
  fieldStaffTaskNavigationItem,
  resolveFieldStaffTaskEntry,
  type FieldStaffTaskDestinationId,
} from "../../../shell/ux/field-staff-task-navigation";
import type { ShellPrimaryNavigationId } from "../../../shell/ux/primary-navigation";
import type { IScaffoldShellProps } from "./IScaffoldShellProps";
import styles from "./ScaffoldShell.module.scss";

type ScaffoldShellState = Readonly<{
  taskDestination: FieldStaffTaskDestinationId;
  shellDestination: ShellPrimaryNavigationId;
}>;

/**
 * FIELD_STAFF product entry for SBS-ROLE-TASK-FIRST-IA-IMPL-SLICE-1.
 * D-* is the product Destination identity. overview/users remains a temporary
 * legacy shell adapter until later role slices can retire SHELL-UX-7 safely.
 */
export default class ScaffoldShell extends React.Component<
  IScaffoldShellProps,
  ScaffoldShellState
> {
  public state: ScaffoldShellState = {
    taskDestination: FIELD_STAFF_DEFAULT_TASK_DESTINATION,
    shellDestination: fieldStaffTaskNavigationItem(FIELD_STAFF_DEFAULT_TASK_DESTINATION)
      .shellDestination,
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

  private readonly handleTaskDestinationChange = (
    taskDestination: FieldStaffTaskDestinationId,
  ): void => {
    const entry = resolveFieldStaffTaskEntry(taskDestination, false);
    this.setState(
      {
        taskDestination: entry.destination,
        shellDestination: entry.shellDestination,
      },
      () => {
        this.requestLegacyShellDestination(entry.shellDestination, entry.destination);
      },
    );
  };

  private readonly handleShellDestinationChange = (
    shellDestination: ShellPrimaryNavigationId,
  ): void => {
    this.setState((current) => {
      if (shellDestination === "overview") {
        return {
          taskDestination: "D-TODAY",
          shellDestination,
        };
      }
      if (shellDestination === "users" && current.taskDestination === "D-TODAY") {
        return {
          taskDestination: "D-PROCEDURE",
          shellDestination,
        };
      }
      return {
        ...current,
        shellDestination,
      };
    });
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
    const { taskDestination, shellDestination } = this.state;
    const activeTask = fieldStaffTaskNavigationItem(taskDestination);

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
        >
          <p className={styles.taskHeading} role="heading" aria-level={1}>
            今日の支援
          </p>
          <nav className={styles.taskNavigation} aria-label="現場職員の業務ナビゲーション">
            {FIELD_STAFF_TASK_NAV_ITEMS.map((item) => {
              const selected = item.id === taskDestination;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={selected ? styles.taskButtonSelected : styles.taskButton}
                  data-role-task-nav={item.id}
                  data-role-task-selected={selected ? "true" : "false"}
                  aria-current={selected ? "page" : undefined}
                  onClick={() => this.handleTaskDestinationChange(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <p className={styles.contextHint} data-role-task-context-hint={taskDestination}>
            {activeTask.contextHint}
          </p>
        </section>
      </AppShellChrome>
    );
  }
}
