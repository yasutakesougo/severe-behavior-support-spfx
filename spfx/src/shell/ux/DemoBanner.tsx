import * as React from "react";
import styles from "./ShellUx.module.scss";
import vp1Styles from "./Vp1DemoSeparation.module.scss";

export const VP1_DEMO_SAFETY_NOTICE =
  "デモ環境｜表示内容は合成データです。保存されません。";

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
      {VP1_DEMO_SAFETY_NOTICE}
    </div>
  );
};
