import * as React from "react";
import { CurrentSiteLabel } from "./CurrentSiteLabel";
import { DemoBanner } from "./DemoBanner";
import type { ShellSiteLabelFixture } from "./fixture";
import { SaveStateBadge } from "./SaveStateBadge";
import type { ShellSaveState } from "./save-state";
import type { ShellViewMode } from "./shell-view-mode";
import { StatusPanel } from "./StatusPanel";
import styles from "./ShellUx.module.scss";

export type AppShellChromeProps = Readonly<{
  demoMode: boolean;
  currentSite: ShellSiteLabelFixture;
  saveState: ShellSaveState;
  viewMode: ShellViewMode;
  correlationId: string;
  userDisplayName: string;
  children?: React.ReactNode;
}>;

/**
 * SHELL-UX-1 presentation chrome.
 * No SharePoint REST, binder wiring, or authorization resolution.
 */
export const AppShellChrome: React.FC<AppShellChromeProps> = (props) => {
  const {
    demoMode,
    currentSite,
    saveState,
    viewMode,
    correlationId,
    userDisplayName,
    children,
  } = props;

  return (
    <div className={styles.appShell} data-shell-ux="app-shell-chrome">
      <a className={styles.skipLink} href="#shell-ux-main">
        メイン内容へスキップ
      </a>

      <DemoBanner visible={demoMode} />

      <header className={styles.shellHeader} role="banner">
        <div className={styles.brandRow}>
          <p className={styles.productName}>強度行動障害支援（シェル表示）</p>
          <SaveStateBadge state={saveState} />
        </div>
        <CurrentSiteLabel site={currentSite} />
        <p className={styles.userLine} data-shell-ux="user-display">
          表示名: {userDisplayName}
        </p>
      </header>

      <nav className={styles.shellNav} aria-label="シェル主要ナビゲーション">
        <button type="button" className={styles.navButton}>
          概要
        </button>
        <button type="button" className={styles.navButton}>
          利用者
        </button>
        <button type="button" className={styles.navButton}>
          記録
        </button>
      </nav>

      <main id="shell-ux-main" className={styles.shellMain} tabIndex={-1}>
        <StatusPanel mode={viewMode} correlationId={correlationId} />
        {viewMode === "ready" ? (
          <div className={styles.readyRegion} data-shell-ux="ready-region">
            {children}
          </div>
        ) : null}
      </main>
    </div>
  );
};
