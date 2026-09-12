import * as React from "react";
import styles from "./ShellUx.module.scss";
import vp1Styles from "./Vp1DemoSeparation.module.scss";
import {
  VP1_DEMO_SAFETY_NOTICE,
  VP1_PAGE_EDIT_VS_BUSINESS_SAVE_NOTICE,
} from "./vp1-demo-separation";

export type DemoBannerProps = Readonly<{
  visible: boolean;
}>;

export const DemoBanner: React.FC<DemoBannerProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      className={`${styles.demoBanner} ${vp1Styles.demoSafetyNotice}`}
      role="status"
      aria-live="polite"
      data-shell-ux="demo-banner"
      data-vp1-demo-safety="compact"
    >
      <div>{VP1_DEMO_SAFETY_NOTICE}</div>
      <div data-vp1-page-edit-guidance="true">{VP1_PAGE_EDIT_VS_BUSINESS_SAVE_NOTICE}</div>
    </div>
  );
};
