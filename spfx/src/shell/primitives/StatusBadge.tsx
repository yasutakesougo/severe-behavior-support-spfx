import * as React from "react";
import styles from "./Primitives.module.scss";

export type StatusBadgeShape = "square" | "soft" | "pill";

export type StatusBadgeProps = Readonly<{
  label: string;
  /** Optional presentation id — not Domain recordStatus. */
  statusId?: string;
  shape?: StatusBadgeShape;
  className?: string;
  as?: "span" | "li";
  /** Host may attach smoke/test hooks without baking screen-specific defaults. */
  dataAttrs?: Readonly<Record<string, string | undefined>>;
}>;

const shapeClass: Record<StatusBadgeShape, string> = {
  square: styles.statusBadgeSquare,
  soft: styles.statusBadgeSoft,
  pill: styles.statusBadgePill,
};

/**
 * DADS-05 StatusBadge — presentation-only.
 * Label text is the meaning channel (not color-only).
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  statusId,
  shape = "square",
  className,
  as = "span",
  dataAttrs,
}) => {
  const classes = [styles.statusBadge, shapeClass[shape], className].filter(Boolean).join(" ");
  const attrs = {
    "data-sbs-primitive": "status-badge",
    "data-sbs-status-id": statusId,
    ...dataAttrs,
  };

  if (as === "li") {
    return (
      <li className={classes} {...attrs}>
        {label}
      </li>
    );
  }

  return (
    <span className={classes} {...attrs}>
      {label}
    </span>
  );
};
