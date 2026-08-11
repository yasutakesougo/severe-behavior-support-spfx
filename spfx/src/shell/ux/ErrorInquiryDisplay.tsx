import * as React from "react";
import {
  formatShellErrorInquiryText,
  hasShellErrorInquiry,
  type ShellErrorInquiryPresentation,
} from "./error-inquiry";
import styles from "./ShellUx.module.scss";

export type ErrorInquiryDisplayProps = Readonly<{
  inquiry: ShellErrorInquiryPresentation;
}>;

/**
 * SHELL-UX-5 user-facing error-code + correlationId display.
 * Copy-friendly inquiry surface — props only; no generation / classification / telemetry.
 */
export const ErrorInquiryDisplay: React.FC<ErrorInquiryDisplayProps> = ({ inquiry }) => {
  const [copyStatus, setCopyStatus] = React.useState<"idle" | "copied" | "failed">("idle");
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  if (!hasShellErrorInquiry(inquiry)) {
    return null;
  }

  const inquiryText = formatShellErrorInquiryText(inquiry);

  const handleCopy = (): void => {
    const textarea = textAreaRef.current;
    const trySelect = (): void => {
      if (!textarea) {
        return;
      }
      textarea.focus();
      textarea.select();
    };

    const writeClipboard = navigator.clipboard?.writeText;
    if (typeof writeClipboard === "function") {
      writeClipboard
        .call(navigator.clipboard, inquiryText)
        .then(() => {
          setCopyStatus("copied");
        })
        .catch(() => {
          trySelect();
          setCopyStatus("failed");
        });
      return;
    }

    trySelect();
    setCopyStatus("failed");
  };

  const statusMessage =
    copyStatus === "copied"
      ? "問い合わせ情報をコピーしました。"
      : copyStatus === "failed"
        ? "テキストを選択しました。キーボードでコピーしてください。"
        : "";

  return (
    <section
      className={styles.errorInquiry}
      data-shell-ux="error-inquiry-display"
      aria-label="問い合わせ情報"
    >
      <h3 className={styles.errorInquiryTitle}>問い合わせ情報</h3>
      <p className={styles.errorInquiryHint}>
        サポートへ連絡するときは、次のエラーコードと相関IDを伝えてください。
      </p>

      <dl className={styles.errorInquiryList}>
        <div className={styles.errorInquiryRow}>
          <dt>エラーコード</dt>
          <dd data-shell-ux="error-code">{inquiry.errorCode}</dd>
        </div>
        <div className={styles.errorInquiryRow}>
          <dt>相関ID</dt>
          <dd data-shell-ux="correlation-id">{inquiry.correlationId}</dd>
        </div>
      </dl>

      <label className={styles.errorInquiryLabel} htmlFor="shell-ux-error-inquiry-text">
        コピー用テキスト
      </label>
      <textarea
        id="shell-ux-error-inquiry-text"
        ref={textAreaRef}
        className={styles.errorInquiryText}
        readOnly={true}
        value={inquiryText}
        rows={2}
        data-shell-ux="error-inquiry-text"
        onFocus={(event) => {
          event.currentTarget.select();
        }}
      />

      <button
        type="button"
        className={styles.errorInquiryCopyButton}
        data-shell-ux="error-inquiry-copy"
        onClick={handleCopy}
      >
        問い合わせ情報をコピー
      </button>

      <p
        className={styles.errorInquiryStatus}
        role="status"
        aria-live="polite"
        data-shell-ux="error-inquiry-copy-status"
      >
        {statusMessage}
      </p>
    </section>
  );
};
