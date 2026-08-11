import * as React from "react";
import { ErrorInquiryDisplay } from "./ErrorInquiryDisplay";
import { hasShellErrorInquiry, type ShellErrorInquiryPresentation } from "./error-inquiry";
import type { ShellViewMode } from "./shell-view-mode";
import styles from "./ShellUx.module.scss";

export type StatusPanelProps = Readonly<{
  mode: ShellViewMode;
  correlationId?: string;
  errorCode?: string;
}>;

/**
 * Fail-closed status panels. SHELL-UX-5 adds error-code + correlation inquiry when props present.
 */
export const StatusPanel: React.FC<StatusPanelProps> = ({ mode, correlationId, errorCode }) => {
  if (mode === "ready" || mode === "partial_retrieval_failed" || mode === "unauthenticated") {
    return null;
  }

  const inquiry: ShellErrorInquiryPresentation | undefined =
    errorCode !== undefined && correlationId !== undefined
      ? { errorCode, correlationId }
      : undefined;

  const inquiryBlock = hasShellErrorInquiry(inquiry) ? (
    <ErrorInquiryDisplay inquiry={inquiry} />
  ) : correlationId ? (
    <p className={styles.correlation}>相関ID: {correlationId}</p>
  ) : null;

  if (mode === "loading") {
    return (
      <div
        className={styles.statusPanel}
        role="status"
        aria-live="polite"
        data-shell-ux="loading-panel"
      >
        <h2 className={styles.statusTitle}>読み込み中</h2>
        <p className={styles.statusBody}>表示を準備しています。</p>
      </div>
    );
  }

  if (mode === "access_denied") {
    return (
      <div className={styles.statusPanel} role="alert" data-shell-ux="access-denied-panel">
        <h2 className={styles.statusTitle}>アクセス不可</h2>
        <p className={styles.statusBody}>この画面を表示できません。個人情報は表示していません。</p>
        {inquiryBlock}
      </div>
    );
  }

  return (
    <div className={styles.statusPanel} role="alert" data-shell-ux="retrieval-failed-panel">
      <h2 className={styles.statusTitle}>取得失敗</h2>
      <p className={styles.statusBody}>
        データを取得できませんでした。判定していない状態として扱います。
      </p>
      {inquiryBlock}
    </div>
  );
};
