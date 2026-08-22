import * as React from "react";
import {
  SHELL_SITE_SELECTION_UNSELECTED,
  type ShellSiteOption,
  type ShellSiteSelection,
} from "./site-selection";
import styles from "./ShellUx.module.scss";
import vp3Styles from "./Vp3ControlFamily.module.scss";

export type SiteSelectorProps = Readonly<{
  selection: ShellSiteSelection;
  options: readonly ShellSiteOption[];
  onSelectionChange: (next: ShellSiteSelection) => void;
}>;

/**
 * Display-only multi-site selector.
 * Does not resolve Entra / SharePoint membership (#21 OUT).
 */
export const SiteSelector: React.FC<SiteSelectorProps> = ({
  selection,
  options,
  onSelectionChange,
}) => {
  return (
    <fieldset
      className={`${styles.siteSelector} ${vp3Styles.scopeAnchor}`}
      data-shell-ux="site-selector"
    >
      <legend className={styles.siteSelectorLegend}>事業所（表示専用）</legend>
      <div className={styles.siteSelectorOptions} role="radiogroup" aria-label="事業所の表示選択">
        <label className={styles.siteOption}>
          <input
            type="radio"
            name="shell-ux-site-selection"
            value={SHELL_SITE_SELECTION_UNSELECTED}
            checked={selection === SHELL_SITE_SELECTION_UNSELECTED}
            onChange={() => onSelectionChange(SHELL_SITE_SELECTION_UNSELECTED)}
            data-shell-ux="site-option-unselected"
          />
          <span>未選択</span>
        </label>
        {options.map((option) => (
          <label key={option.siteId} className={styles.siteOption}>
            <input
              type="radio"
              name="shell-ux-site-selection"
              value={option.siteId}
              checked={selection === option.siteId}
              onChange={() => onSelectionChange(option.siteId)}
              data-shell-ux={`site-option-${option.siteId}`}
            />
            <span>
              {option.siteId} / {option.displayName}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
