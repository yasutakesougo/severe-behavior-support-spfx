import * as React from "react";
import { SHELL_UNAUTHENTICATED_BODY, SHELL_UNAUTHENTICATED_TITLE } from "./unauthenticated";
import styles from "./ShellUx.module.scss";

/**
 * SHELL-UX-6 unauthenticated fail-closed presentation panel.
 * Props/fixture driven — no auth judgment, Entra, token, role, or redirect.
 */
export const UnauthenticatedPanel: React.FC = () => {
  return (
    <div
      className={styles.unauthenticatedPanel}
      role="alert"
      aria-live="assertive"
      data-shell-ux="unauthenticated-panel"
    >
      <h2 className={styles.statusTitle}>{SHELL_UNAUTHENTICATED_TITLE}</h2>
      <p className={styles.statusBody} data-shell-ux="unauthenticated-body">
        {SHELL_UNAUTHENTICATED_BODY}
      </p>
      <p className={styles.unauthenticatedNote} data-shell-ux="unauthenticated-no-pii">
        個人情報・業務データは表示していません。
      </p>
    </div>
  );
};
