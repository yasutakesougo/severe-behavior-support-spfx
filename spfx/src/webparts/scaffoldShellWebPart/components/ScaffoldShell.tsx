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
      errorCode,
      partialRetrieval,
    } = this.props;

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
      >
        <section className={styles.scaffoldShell} data-shell-ux="shell-body">
          {/*
            DADS-UX-1 / INV-19: host chrome must not use heading elements.
            Destination screens own h1/h2; this is presentation-only status copy.
          */}
          <p className={styles.bodyTitle} data-shell-ux="shell-host-status">
            {strings.ShellReadyTitle}
          </p>
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
