import * as React from "react";
import { AppShellChrome } from "../../../shell/ux";
import type { IScaffoldShellProps } from "./IScaffoldShellProps";
import styles from "./ScaffoldShell.module.scss";
import { escape } from "@microsoft/sp-lodash-subset";
import * as strings from "ScaffoldShellWebPartStrings";

export default class ScaffoldShell extends React.Component<IScaffoldShellProps> {
  public render(): React.ReactElement<IScaffoldShellProps> {
    const {
      description,
      environmentMessage,
      userDisplayName,
      demoMode,
      siteSelection,
      saveState,
      viewMode,
      correlationId,
    } = this.props;

    return (
      <AppShellChrome
        demoMode={demoMode}
        siteSelection={siteSelection}
        saveState={saveState}
        viewMode={viewMode}
        correlationId={correlationId}
        userDisplayName={userDisplayName}
      >
        <section className={styles.scaffoldShell} data-shell-ux="shell-body">
          <h2 className={styles.bodyTitle}>{strings.ShellReadyTitle}</h2>
          <p className={styles.bodyCopy}>{strings.ShellReadyDescription}</p>
          <p className={styles.bodyMeta}>
            {strings.PropertyValueLabel} <strong>{escape(description)}</strong>
          </p>
          <p className={styles.bodyMeta}>{escape(environmentMessage)}</p>
        </section>
      </AppShellChrome>
    );
  }
}
