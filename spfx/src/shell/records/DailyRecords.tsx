import * as React from "react";
import {
  DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE,
  DEMO_DAILY_RECORD_PRESENTATION_NOTE,
} from "./daily-record-copy";
import type { ShellDailyRecordPresentation } from "./daily-record-types";
import styles from "./DailyRecordsUx.module.scss";

export type DailyRecordsProps = Readonly<{
  presentation: ShellDailyRecordPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
}>;

/** DEMO-UX-5 presentation-only daily record screen. */
export const DailyRecords: React.FC<DailyRecordsProps> = ({ presentation, headingRef }) => {
  const {
    heading,
    inputPersonLabel,
    inputPrompt,
    incompleteItems,
    recentRecords,
    businessFacts,
    systemState,
  } = presentation;

  return (
    <section
      className={styles.dailyRecords}
      data-demo-ux="daily-records"
      aria-labelledby="demo-ux-records-heading"
    >
      <p className={styles.presentationNote} data-demo-ux="daily-record-presentation-note">
        {DEMO_DAILY_RECORD_PRESENTATION_NOTE}
      </p>
      <h1
        id="demo-ux-records-heading"
        ref={headingRef}
        tabIndex={-1}
        data-demo-ux="daily-record-heading"
      >
        {heading}
      </h1>

      <section className={styles.section} aria-labelledby="demo-ux-record-input-heading">
        <h2 id="demo-ux-record-input-heading">記録入力</h2>
        <p>{inputPrompt}</p>
        <div className={styles.inputGrid}>
          <label>
            対象
            <input type="text" value={inputPersonLabel} disabled aria-disabled="true" readOnly />
          </label>
          <label className={styles.fullWidth}>
            記録内容
            <textarea
              defaultValue="合成表示のため入力できません。"
              disabled
              aria-disabled="true"
              rows={4}
            />
          </label>
        </div>
        <p className={styles.mutationNote}>{DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE}</p>
        <div className={styles.actionRow}>
          <button type="button" disabled aria-disabled="true">
            作成する
          </button>
          <button type="button" disabled aria-disabled="true">
            保存する
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="demo-ux-record-incomplete-heading">
        <h2 id="demo-ux-record-incomplete-heading">未完了確認</h2>
        <ul className={styles.cardList} data-demo-ux="daily-record-incomplete-list">
          {incompleteItems.map((item) => (
            <li key={item.id} className={styles.card}>
              <div>
                <strong>{item.personLabel}</strong>
                <p>{item.reasonLabel}</p>
              </div>
              <span className={styles.statusBadge}>{item.statusLabel}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="demo-ux-record-recent-heading">
        <h2 id="demo-ux-record-recent-heading">最近の記録</h2>
        <ol className={styles.timeline} data-demo-ux="daily-record-recent-list">
          {recentRecords.map((record) => (
            <li key={record.id} className={styles.timelineItem}>
              <div className={styles.recordMeta}>
                <strong>{record.personLabel}</strong>
                <span>{record.recordedAtLabel}</span>
                <span>{record.recordTypeLabel}</span>
              </div>
              <p>{record.summary}</p>
            </li>
          ))}
        </ol>
      </section>

      <div className={styles.stateGrid}>
        <section className={styles.statePanel} aria-labelledby="demo-ux-record-business-heading">
          <h2 id="demo-ux-record-business-heading">制度・業務情報（合成表示）</h2>
          <dl>
            <div>
              <dt>記録対象</dt>
              <dd>{businessFacts.recordScopeLabel}</dd>
            </div>
            <div>
              <dt>担当</dt>
              <dd>{businessFacts.responsibleRoleLabel}</dd>
            </div>
          </dl>
        </section>
        <section className={styles.statePanel} aria-labelledby="demo-ux-record-system-heading">
          <h2 id="demo-ux-record-system-heading">システム状態</h2>
          <dl>
            <div>
              <dt>保存状態</dt>
              <dd>{systemState.saveStateLabel}</dd>
            </div>
            <div>
              <dt>データ元</dt>
              <dd>{systemState.dataSourceLabel}</dd>
            </div>
          </dl>
        </section>
      </div>
    </section>
  );
};
