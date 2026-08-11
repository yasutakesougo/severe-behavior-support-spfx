import * as React from "react";
import styles from "./ShellUx.module.scss";

/**
 * Shell-level stop chrome when site selection is 未選択.
 * Presentation only — not authorization / membership truth.
 */
export const SiteUnselectedStop: React.FC = () => {
  return (
    <div
      className={styles.statusPanel}
      role="status"
      aria-live="polite"
      data-shell-ux="site-unselected-stop"
    >
      <h2 className={styles.statusTitle}>事業所が未選択です</h2>
      <p className={styles.statusBody}>
        表示用の事業所を選択するまで、業務操作領域は停止しています。所属判定や認可の結果ではありません。
      </p>
    </div>
  );
};
