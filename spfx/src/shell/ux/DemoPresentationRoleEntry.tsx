import * as React from "react";
import {
  SHELL_PRESENTATION_ROLE_ENTRY_DIRECTIONS,
  SHELL_PRESENTATION_ROLE_ENTRY_LABELS,
  SHELL_PRESENTATION_ROLES,
  type ShellPresentationRole,
} from "./presentation-role";
import styles from "./ShellUx.module.scss";

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
    <fieldset className={styles.demoRoleEntry} data-shell-ux="demo-presentation-role-entry">
      <legend className={styles.demoRoleEntryLegend}>デモ表示ロール（認証ではありません）</legend>
      <p className={styles.demoRoleEntryHint} data-shell-ux="demo-presentation-role-hint">
        合成デモの見え方を切り替えます。権限判定・Entra ロールにはなりません。
      </p>
      <div
        className={styles.demoRoleEntryOptions}
        role="radiogroup"
        aria-label="デモ表示ロール（認証ではありません）"
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
