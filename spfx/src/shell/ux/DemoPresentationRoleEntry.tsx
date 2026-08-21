import * as React from "react";
import {
  SHELL_PRESENTATION_ROLE_ENTRY_DIRECTIONS,
  SHELL_PRESENTATION_ROLE_ENTRY_LABELS,
  SHELL_PRESENTATION_ROLES,
  type ShellPresentationRole,
} from "./presentation-role";
import styles from "./ShellUx.module.scss";
import vp1Styles from "./Vp1DemoSeparation.module.scss";
import { VP1_DEMO_ROLE_HINT, VP1_DEMO_ROLE_LEGEND } from "./vp1-demo-separation";

export type DemoPresentationRoleEntryProps = Readonly<{
  visible: boolean;
  role: ShellPresentationRole;
  onRoleChange: (next: ShellPresentationRole) => void;
}>;

/**
 * DEMO-only presentationRole entrance.
 * Not Entra, authorization-resolver, or production host policy.
 */
export const DemoPresentationRoleEntry: React.FC<DemoPresentationRoleEntryProps> = ({
  visible,
  role,
  onRoleChange,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <fieldset
      className={`${styles.demoRoleEntry} ${vp1Styles.demoSettingsRole}`}
      data-shell-ux="demo-presentation-role-entry"
      data-vp1-demo-settings="role"
    >
      <legend className={styles.demoRoleEntryLegend}>{VP1_DEMO_ROLE_LEGEND}</legend>
      <p className={styles.demoRoleEntryHint} data-shell-ux="demo-presentation-role-hint">
        {VP1_DEMO_ROLE_HINT}
      </p>
      <div
        className={styles.demoRoleEntryOptions}
        role="radiogroup"
        aria-label={VP1_DEMO_ROLE_LEGEND}
      >
        {SHELL_PRESENTATION_ROLES.map((value) => (
          <label key={value} className={styles.demoRoleOption}>
            <input
              type="radio"
              name="shell-ux-demo-presentation-role"
              value={value}
              checked={role === value}
              onChange={() => {
                onRoleChange(value);
              }}
              data-shell-ux="demo-presentation-role-option"
              data-shell-ux-demo-role={value}
              aria-label={`${SHELL_PRESENTATION_ROLE_ENTRY_LABELS[value]}（${SHELL_PRESENTATION_ROLE_ENTRY_DIRECTIONS[value]}）`}
            />
            <span>
              {SHELL_PRESENTATION_ROLE_ENTRY_LABELS[value]}
              <span className={styles.demoRoleOptionDirection}>
                {SHELL_PRESENTATION_ROLE_ENTRY_DIRECTIONS[value]}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
};
