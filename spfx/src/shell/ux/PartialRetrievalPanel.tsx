import * as React from "react";
import {
  SHELL_PARTIAL_RETRIEVAL_WARNING,
  hasPartialRetrievalFailure,
  type ShellPartialRetrievalPresentation,
} from "./partial-retrieval";
import styles from "./ShellUx.module.scss";

export type PartialRetrievalPanelProps = Readonly<{
  presentation: ShellPartialRetrievalPresentation;
  correlationId?: string;
}>;

/**
 * Shared presentation for 一部取得失敗.
 * Visually separates succeeded vs failed props; no fetch / judgment / aggregation.
 */
export const PartialRetrievalPanel: React.FC<PartialRetrievalPanelProps> = ({
  presentation,
  correlationId,
}) => {
  if (!hasPartialRetrievalFailure(presentation)) {
    return (
      <div className={styles.statusPanel} role="alert" data-shell-ux="partial-retrieval-invalid">
        <h2 className={styles.statusTitle}>一部取得失敗（表示不正）</h2>
        <p className={styles.statusBody}>
          失敗分が渡されていないため、一部取得失敗としては表示できません。全件正常とは扱いません。
        </p>
      </div>
    );
  }

  return (
    <div
      className={styles.partialRetrievalPanel}
      role="alert"
      aria-live="assertive"
      data-shell-ux="partial-retrieval-panel"
    >
      <h2 className={styles.statusTitle}>一部取得失敗</h2>
      <p className={styles.statusBody} data-shell-ux="partial-retrieval-warning">
        {SHELL_PARTIAL_RETRIEVAL_WARNING}
      </p>

      <section
        className={styles.partialRetrievalSection}
        data-shell-ux="partial-retrieval-succeeded"
        aria-label="取得できた項目"
      >
        <h3 className={styles.partialRetrievalHeading}>取得できた項目</h3>
        {presentation.succeededItems.length === 0 ? (
          <p className={styles.partialRetrievalEmpty}>取得できた項目はありません。</p>
        ) : (
          <ul className={styles.partialRetrievalList}>
            {presentation.succeededItems.map((item) => (
              <li key={item.id} data-shell-ux="partial-retrieval-succeeded-item">
                {item.label}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className={`${styles.partialRetrievalSection} ${styles.partialRetrievalFailedSection}`}
        data-shell-ux="partial-retrieval-failed"
        aria-label="取得できなかった項目"
      >
        <h3 className={styles.partialRetrievalHeading}>取得できなかった項目</h3>
        <ul className={styles.partialRetrievalList}>
          {presentation.failedItems.map((item) => (
            <li key={item.id} data-shell-ux="partial-retrieval-failed-item">
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      {correlationId ? <p className={styles.correlation}>相関ID: {correlationId}</p> : null}
    </div>
  );
};
