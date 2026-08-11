import * as React from "react";
import styles from "./ShellUx.module.scss";

export type DemoBannerProps = Readonly<{
  visible: boolean;
}>;

export const DemoBanner: React.FC<DemoBannerProps> = ({ visible }) => {
  if (!visible) {
    return null;
  }

  return (
    <div className={styles.demoBanner} role="status" aria-live="polite" data-shell-ux="demo-banner">
      DEMO — 合成表示専用（実データ・live SharePoint 接続なし）
    </div>
  );
};
