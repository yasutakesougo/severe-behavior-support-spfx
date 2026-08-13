import * as React from "react";
import styles from "./Primitives.module.scss";

export type SectionLabelItem = Readonly<{
  id: string;
  label: string;
  current?: boolean;
  dataAttrs?: Readonly<Record<string, string | undefined>>;
}>;

export type SectionLabelStripProps = Readonly<{
  ariaLabel: string;
  items: readonly SectionLabelItem[];
  className?: string;
}>;

/**
 * DADS-05 SectionLabelStrip — INV-07 principle B.
 * Non-interactive section-order labels (not ARIA tabs).
 * Actions (e.g. open support plan) must remain separate buttons outside this strip.
 */
export const SectionLabelStrip: React.FC<SectionLabelStripProps> = ({
  ariaLabel,
  items,
  className,
}) => {
  const classes = [styles.sectionLabelStrip, className].filter(Boolean).join(" ");
  return (
    <div className={classes} aria-label={ariaLabel} data-sbs-primitive="section-label-strip">
      {items.map((item) => (
        <span
          key={item.id}
          className={item.current ? styles.sectionLabelCurrent : styles.sectionLabel}
          data-sbs-section-label={item.id}
          {...item.dataAttrs}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
};
