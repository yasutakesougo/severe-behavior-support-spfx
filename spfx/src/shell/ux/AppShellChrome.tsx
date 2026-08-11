import * as React from "react";
import { CurrentSiteLabel } from "./CurrentSiteLabel";
import { DemoBanner } from "./DemoBanner";
import { PartialRetrievalPanel } from "./PartialRetrievalPanel";
import type { ShellPartialRetrievalPresentation } from "./partial-retrieval";
import { SaveStatePresentation } from "./SaveStatePresentation";
import type { ShellSaveState } from "./save-state";
import {
  isPartialRetrievalViewMode,
  isUnauthenticatedViewMode,
  type ShellViewMode,
} from "./shell-view-mode";
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
import { UnauthenticatedPanel } from "./UnauthenticatedPanel";
import styles from "./ShellUx.module.scss";

export type AppShellChromeProps = Readonly<{
  demoMode: boolean;
  siteSelection: ShellSiteSelection;
  siteOptions?: readonly ShellSiteOption[];
  saveState: ShellSaveState;
  viewMode: ShellViewMode;
  correlationId: string;
  errorCode: string;
  userDisplayName: string;
  partialRetrieval?: ShellPartialRetrievalPresentation;
  onSiteSelectionChange?: (next: ShellSiteSelection) => void;
  children?: React.ReactNode;
}>;

/**
 * SHELL-UX presentation chrome（SHELL-UX-6 unauthenticated fail-closed panel）.
 * No SharePoint REST, binder, auth judgment, Entra, token, role, or redirect.
 */
export const AppShellChrome: React.FC<AppShellChromeProps> = (props) => {
  const {
    demoMode,
    siteSelection,
    siteOptions = SHELL_SITE_OPTIONS,
    saveState,
    viewMode,
    correlationId,
    errorCode,
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

  const unauthenticated = isUnauthenticatedViewMode(viewMode);
  const siteUnselected = isSiteUnselected(selection);
  const siteBlocked = !unauthenticated && siteUnselected;
  const selectedSite =
    !unauthenticated && !siteUnselected ? siteOptionForId(selection) : undefined;
  const showPartialRetrieval =
    !unauthenticated && !siteBlocked && isPartialRetrievalViewMode(viewMode);
  const showReadyRegion = !unauthenticated && !siteBlocked && viewMode === "ready";
  const navDisabled = unauthenticated || siteBlocked;

  return (
    <div
      className={styles.appShell}
      data-shell-ux="app-shell-chrome"
      data-shell-ux-unauthenticated={unauthenticated ? "true" : "false"}
    >
      <a className={styles.skipLink} href="#shell-ux-main">
        メイン内容へスキップ
      </a>

      <DemoBanner visible={demoMode} />

      <header className={styles.shellHeader} role="banner">
        <div className={styles.brandRow}>
          <p className={styles.productName}>強度行動障害支援（シェル表示）</p>
          {!unauthenticated ? <SaveStatePresentation state={saveState} /> : null}
        </div>
        {!unauthenticated ? (
          <>
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
          </>
        ) : (
          <p className={styles.userLine} data-shell-ux="user-display-suppressed">
            表示名: （未認証のため非表示）
          </p>
        )}
      </header>

      <nav className={styles.shellNav} aria-label="シェル主要ナビゲーション">
        <button type="button" className={styles.navButton} disabled={navDisabled}>
          概要
        </button>
        <button type="button" className={styles.navButton} disabled={navDisabled}>
          利用者
        </button>
        <button type="button" className={styles.navButton} disabled={navDisabled}>
          記録
        </button>
      </nav>

      <main id="shell-ux-main" className={styles.shellMain} tabIndex={-1}>
        {unauthenticated ? (
          <UnauthenticatedPanel />
        ) : siteBlocked ? (
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
            errorCode={errorCode}
          />
        ) : (
          <StatusPanel mode={viewMode} correlationId={correlationId} errorCode={errorCode} />
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
