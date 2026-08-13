import * as React from "react";
import styles from "./Primitives.module.scss";

export type EmptyNoticeProps = Readonly<{
  children: React.ReactNode;
  /** When true, announces dynamic empty/zero-result (INV-17). */
  announce?: boolean;
  className?: string;
  dataAttrs?: Readonly<Record<string, string | undefined>>;
}>;

/**
 * DADS-05 EmptyNotice — lightweight empty / zero-result presentation.
 * Not a card/illustration EmptyState. Does not conflate with fail-closed alerts.
 */
export const EmptyNotice: React.FC<EmptyNoticeProps> = ({
  children,
  announce = true,
  className,
  dataAttrs,
}) => {
  const classes = [styles.emptyNotice, className].filter(Boolean).join(" ");
  return (
    <p
      className={classes}
      role={announce ? "status" : undefined}
      aria-live={announce ? "polite" : undefined}
      data-sbs-primitive="empty-notice"
      {...dataAttrs}
    >
      {children}
    </p>
  );
};
