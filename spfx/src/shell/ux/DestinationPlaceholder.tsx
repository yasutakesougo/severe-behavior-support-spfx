import * as React from "react";
import {
  headingForShellDestination,
  SHELL_DESTINATION_DISCONNECTED_BODY,
  SHELL_DESTINATION_DISCONNECTED_NOTE,
} from "./destination";
import type { ShellPrimaryNavigationId } from "./primary-navigation";
import styles from "./ShellUx.module.scss";

export type DestinationPlaceholderProps = Readonly<{
  destination: ShellPrimaryNavigationId;
  headingRef?: React.Ref<HTMLHeadingElement>;
}>;

/**
 * SHELL-UX-7 safe navigation destination placeholder.
 * Presentation-only — not a connected business screen.
 */
export const DestinationPlaceholder: React.FC<DestinationPlaceholderProps> = ({
  destination,
  headingRef,
}) => {
  const heading = headingForShellDestination(destination);

  return (
    <section
      className={styles.destinationPlaceholder}
      data-shell-ux="destination-placeholder"
      data-shell-ux-destination={destination}
      aria-labelledby="shell-ux-destination-heading"
    >
      <h1
        id="shell-ux-destination-heading"
        ref={headingRef}
        tabIndex={-1}
        className={styles.destinationHeading}
        data-shell-ux="destination-heading"
      >
        {heading}
      </h1>
      <p className={styles.destinationBody} data-shell-ux="destination-disconnected-body">
        {SHELL_DESTINATION_DISCONNECTED_BODY}
      </p>
      <p className={styles.destinationNote} data-shell-ux="destination-disconnected-note">
        {SHELL_DESTINATION_DISCONNECTED_NOTE}
      </p>
    </section>
  );
};
