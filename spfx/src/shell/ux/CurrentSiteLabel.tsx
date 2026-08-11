import * as React from "react";
import type { ShellSiteLabelFixture } from "./fixture";
import styles from "./ShellUx.module.scss";

export type CurrentSiteLabelProps = Readonly<{
  site: ShellSiteLabelFixture;
}>;

/**
 * Display-only current-site label.
 * Props/fixture input only — not #21 authorization truth.
 */
export const CurrentSiteLabel: React.FC<CurrentSiteLabelProps> = ({ site }) => {
  return (
    <div className={styles.currentSite} data-shell-ux="current-site-label">
      <span className={styles.currentSiteLabel}>現在の事業所（表示専用）</span>
      <span className={styles.currentSiteValue}>
        {site.siteId} / {site.displayName}
      </span>
    </div>
  );
};
