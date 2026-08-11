import * as React from "react";
import { CurrentSiteLabel } from "./CurrentSiteLabel";
import { DemoBanner } from "./DemoBanner";
import { PartialRetrievalPanel } from "./PartialRetrievalPanel";
import type { ShellPartialRetrievalPresentation } from "./partial-retrieval";
import { SaveStatePresentation } from "./SaveStatePresentation";
import type { ShellSaveState } from "./save-state";
import { isPartialRetrievalViewMode, type ShellViewMode } from "./shell-view-mode";
import {
  SHELL_SITE_OPTIONS,
  isSiteUnselected,
  siteOptionForId,
  type ShellSiteOption,
  type ShellSiteSelection,
} from "./site-selection";
import { SiteSelector } from "./SiteSelector";
import { SiteUnselectedStop } from "./SiteUnselectedStop";
import { StatusPanel } from "./StatusPanel";
import styles from "./ShellUx.module.scss";

export type AppShellChromeProps = Readonly<{
  demoMode: boolean;
  siteSelection: ShellSiteSelection;
  siteOptions?: readonly ShellSiteOption[];
  saveState: ShellSaveState;
  viewMode: ShellViewMode;
  correlationId: string;
  userDisplayName: string;
  partialRetrieval?: ShellPartialRetrievalPresentation;
  onSiteSelectionChange?: (next: ShellSiteSelection) => void;
  children?: React.ReactNode;
}>;

/**
 * SHELL-UX presentation chrome（SHELL-UX-4 partial-retrieval boundary）.
 * No SharePoint REST, binder wiring, membership lookup, fetch, or outcome judgment.
 */
export const AppShellChrome: React.FC<AppShellChromeProps> = (props) => {
  const {
    demoMode,
    siteSelection,
    siteOptions = SHELL_SITE_OPTIONS,
    saveState,
    viewMode,
    correlationId,
    userDisplayName,
    partialRetrieval,
    onSiteSelectionChange,
    children,
  } = props;

  const [selection, setSelection] = React.useState<ShellSiteSelection>(siteSelection);

  React.useEffect(() => {
    setSelection(siteSelection);
  }, [siteSelection]);

  const handleSelectionChange = (next: ShellSiteSelection): void => {
    setSelection(next);
    if (onSiteSelectionChange) {
      onSiteSelectionChange(next);
    }
  };

  const siteBlocked = isSiteUnselected(selection);
  const selectedSite = !siteBlocked ? siteOptionForId(selection) : undefined;
  const showPartialRetrieval = !siteBlocked && isPartialRetrievalViewMode(viewMode);
  const showReadyRegion = !siteBlocked && viewMode === "ready";

  return (
    <div className={styles.appShell} data-shell-ux="app-shell-chrome">
      <a className={styles.skipLink} href="#shell-ux-main">
        メイン内容へスキップ
      </a>

      <DemoBanner visible={demoMode} />

      <header className={styles.shellHeader} role="banner">
        <div className={styles.brandRow}>
          <p className={styles.productName}>強度行動障害支援（シェル表示）</p>
          <SaveStatePresentation state={saveState} />
        </div>
        <SiteSelector
          selection={selection}
          options={siteOptions}
          onSelectionChange={handleSelectionChange}
        />
        {selectedSite ? (
          <CurrentSiteLabel site={selectedSite} />
        ) : (
          <p className={styles.currentSite} data-shell-ux="current-site-unselected">
            <span className={styles.currentSiteLabel}>現在の事業所（表示専用）</span>
            <span className={styles.currentSiteValue}>未選択</span>
          </p>
        )}
        <p className={styles.userLine} data-shell-ux="user-display">
          表示名: {userDisplayName}
        </p>
      </header>

      <nav className={styles.shellNav} aria-label="シェル主要ナビゲーション">
        <button type="button" className={styles.navButton} disabled={siteBlocked}>
          概要
        </button>
        <button type="button" className={styles.navButton} disabled={siteBlocked}>
          利用者
        </button>
        <button type="button" className={styles.navButton} disabled={siteBlocked}>
          記録
        </button>
      </nav>

      <main id="shell-ux-main" className={styles.shellMain} tabIndex={-1}>
        {siteBlocked ? (
          <SiteUnselectedStop />
        ) : showPartialRetrieval ? (
          <PartialRetrievalPanel
            presentation={
              partialRetrieval ?? {
                succeededItems: [],
                failedItems: [],
              }
            }
            correlationId={correlationId}
          />
        ) : (
          <StatusPanel mode={viewMode} correlationId={correlationId} />
        )}
        {showReadyRegion ? (
          <div className={styles.readyRegion} data-shell-ux="ready-region">
            {children}
          </div>
        ) : null}
      </main>
    </div>
  );
};
