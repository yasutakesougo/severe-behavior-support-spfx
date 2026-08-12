import * as React from "react";
import {
  DASHBOARD_UX_OVERVIEW_FIXTURE,
  OverviewDashboard,
  type ShellOverviewPresentation,
} from "../dashboard";
import { DEMO_UX_USERS_FIXTURE, UsersList, type ShellUsersPresentation } from "../users";
import { CurrentSiteLabel } from "./CurrentSiteLabel";
import { DemoBanner } from "./DemoBanner";
import { DestinationPlaceholder } from "./DestinationPlaceholder";
import { SHELL_DEFAULT_DESTINATION } from "./destination";
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
import {
  isShellPrimaryNavigationEnabled,
  SHELL_PRIMARY_NAV_ITEMS,
  type ShellPrimaryNavigationId,
} from "./primary-navigation";
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
  selectedDestination?: ShellPrimaryNavigationId;
  onSiteSelectionChange?: (next: ShellSiteSelection) => void;
  onSelectedDestinationChange?: (next: ShellPrimaryNavigationId) => void;
  overviewPresentation?: ShellOverviewPresentation;
  usersPresentation?: ShellUsersPresentation;
  children?: React.ReactNode;
}>;

/**
 * SHELL-UX presentation chrome + DASHBOARD-UX-1 overview + DEMO-UX-2 users list skeletons.
 * No SharePoint REST, binder, auth judgment, Entra, token, role, or live business UI.
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
    selectedDestination: selectedDestinationProp,
    onSiteSelectionChange,
    onSelectedDestinationChange,
    overviewPresentation = DASHBOARD_UX_OVERVIEW_FIXTURE,
    usersPresentation = DEMO_UX_USERS_FIXTURE,
    children,
  } = props;

  const [selection, setSelection] = React.useState<ShellSiteSelection>(siteSelection);
  const [destination, setDestination] = React.useState<ShellPrimaryNavigationId>(
    selectedDestinationProp ?? SHELL_DEFAULT_DESTINATION,
  );
  const destinationHeadingRef = React.useRef<HTMLHeadingElement>(null);
  const shouldFocusDestinationRef = React.useRef(false);

  React.useEffect(() => {
    setSelection(siteSelection);
  }, [siteSelection]);

  React.useEffect(() => {
    if (selectedDestinationProp !== undefined) {
      setDestination(selectedDestinationProp);
    }
  }, [selectedDestinationProp]);

  React.useEffect(() => {
    if (!shouldFocusDestinationRef.current) {
      return;
    }
    shouldFocusDestinationRef.current = false;
    destinationHeadingRef.current?.focus();
  }, [destination]);

  const handleSelectionChange = (next: ShellSiteSelection): void => {
    setSelection(next);
    if (onSiteSelectionChange) {
      onSiteSelectionChange(next);
    }
  };

  const handleDestinationChange = (next: ShellPrimaryNavigationId): void => {
    if (next === destination) {
      destinationHeadingRef.current?.focus();
      return;
    }
    shouldFocusDestinationRef.current = true;
    setDestination(next);
    if (onSelectedDestinationChange) {
      onSelectedDestinationChange(next);
    }
  };

  const unauthenticated = isUnauthenticatedViewMode(viewMode);
  const siteUnselected = isSiteUnselected(selection);
  const siteBlocked = !unauthenticated && siteUnselected;
  const selectedSite = !unauthenticated && !siteUnselected ? siteOptionForId(selection) : undefined;
  const showPartialRetrieval =
    !unauthenticated && !siteBlocked && isPartialRetrievalViewMode(viewMode);
  const showReadyRegion = !unauthenticated && !siteBlocked && viewMode === "ready";
  const navDisabled = !isShellPrimaryNavigationEnabled(viewMode, selection);

  return (
    <div
      className={styles.appShell}
      data-shell-ux="app-shell-chrome"
      data-shell-ux-unauthenticated={unauthenticated ? "true" : "false"}
      data-shell-ux-destination={destination}
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

      <nav
        className={styles.shellNav}
        aria-label="シェル主要ナビゲーション"
        data-shell-ux="primary-navigation"
      >
        {SHELL_PRIMARY_NAV_ITEMS.map((item) => {
          const selected = item.id === destination;
          const className = selected
            ? `${styles.navButton} ${styles.navButtonSelected}`
            : styles.navButton;
          return (
            <button
              key={item.id}
              type="button"
              className={className}
              data-shell-ux-nav={item.id}
              data-shell-ux-nav-selected={selected ? "true" : "false"}
              aria-current={selected ? "page" : undefined}
              disabled={navDisabled}
              onClick={() => {
                if (!navDisabled) {
                  handleDestinationChange(item.id);
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
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
            {destination === "overview" ? (
              <OverviewDashboard
                presentation={overviewPresentation}
                headingRef={destinationHeadingRef}
              />
            ) : destination === "users" ? (
              <UsersList presentation={usersPresentation} headingRef={destinationHeadingRef} />
            ) : (
              <DestinationPlaceholder destination={destination} headingRef={destinationHeadingRef} />
            )}
            {children}
          </div>
        ) : null}
      </main>
    </div>
  );
};
