import * as React from "react";
import {
  DEMO_DAILY_RECORD_DRAFT_HINT,
  DEMO_DAILY_RECORD_INCOMPLETE_HINT,
  DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE,
  DEMO_DAILY_RECORD_PRESENTATION_NOTE,
  DEMO_DAILY_RECORD_RECENT_HINT,
} from "./daily-record-copy";
import {
  DEMO_UX_9_SLICE,
  findIncompleteItemById,
  seedLocalDraftForIncompleteItem,
} from "./daily-record-draft";
import type { ShellDailyRecordPresentation } from "./daily-record-types";
import styles from "./DailyRecordsUx.module.scss";

export type DailyRecordsProps = Readonly<{
  presentation: ShellDailyRecordPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
}>;

/**
 * DEMO-UX-5 presentation-only daily record screen.
 * DEMO-UX-9 adds incomplete selection → local draft input image (no save).
 */
export const DailyRecords: React.FC<DailyRecordsProps> = ({ presentation, headingRef }) => {
  const { heading, inputPrompt, incompleteItems, recentRecords, businessFacts, systemState } =
    presentation;

  const defaultIncompleteId = incompleteItems[0]?.id;
  const [selectedIncompleteId, setSelectedIncompleteId] = React.useState<string | undefined>(
    defaultIncompleteId,
  );
  const selectedIncomplete = findIncompleteItemById(incompleteItems, selectedIncompleteId);
  const [localDraft, setLocalDraft] = React.useState(() =>
    seedLocalDraftForIncompleteItem(selectedIncomplete),
  );

  const selectIncomplete = (itemId: string): void => {
    const next = findIncompleteItemById(incompleteItems, itemId);
    setSelectedIncompleteId(itemId);
    setLocalDraft(seedLocalDraftForIncompleteItem(next));
  };

  const selectedPersonLabel = selectedIncomplete?.personLabel ?? presentation.inputPersonLabel;

  return (
    <section
      className={styles.dailyRecords}
      data-demo-ux="daily-records"
      data-demo-ux-9-slice={DEMO_UX_9_SLICE.id}
      data-demo-ux-incomplete-selected={selectedIncompleteId ?? ""}
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

      <section className={styles.section} aria-labelledby="demo-ux-record-incomplete-heading">
        <h2 id="demo-ux-record-incomplete-heading">未完了確認</h2>
        <p className={styles.sectionHint} data-demo-ux="daily-record-incomplete-hint">
          {DEMO_DAILY_RECORD_INCOMPLETE_HINT}
        </p>
        <ul
          className={styles.cardList}
          data-demo-ux="daily-record-incomplete-list"
          role="listbox"
          aria-label="未完了確認の対象選択"
        >
          {incompleteItems.map((item) => {
            const selected = item.id === selectedIncompleteId;
            return (
              <li key={item.id} className={styles.cardItem}>
                <button
                  type="button"
                  className={selected ? `${styles.card} ${styles.cardSelected}` : styles.card}
                  role="option"
                  aria-selected={selected}
                  data-demo-ux="daily-record-incomplete-item"
                  data-demo-ux-incomplete-id={item.id}
                  data-demo-ux-incomplete-selected={selected ? "true" : "false"}
                  onClick={() => {
                    selectIncomplete(item.id);
                  }}
                >
                  <div>
                    <strong>{item.personLabel}</strong>
                    <p>{item.reasonLabel}</p>
                  </div>
                  <span className={styles.statusBadge}>{item.statusLabel}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.section} aria-labelledby="demo-ux-record-input-heading">
        <h2 id="demo-ux-record-input-heading">記録入力イメージ</h2>
        <p>{inputPrompt}</p>
        <p className={styles.sectionHint} data-demo-ux="daily-record-draft-hint">
          {DEMO_DAILY_RECORD_DRAFT_HINT}
        </p>
        <div className={styles.inputGrid}>
          <label>
            対象
            <input
              type="text"
              value={selectedPersonLabel}
              disabled
              aria-disabled="true"
              readOnly
              data-demo-ux="daily-record-input-person"
            />
          </label>
          <label className={styles.fullWidth}>
            記録内容（入力イメージ・未保存）
            <textarea
              value={localDraft}
              rows={6}
              data-demo-ux="daily-record-input-draft"
              aria-label="記録内容の入力イメージ（未保存）"
              onChange={(event) => {
                setLocalDraft(event.target.value);
              }}
            />
          </label>
        </div>
        <p className={styles.mutationNote} data-demo-ux="daily-record-mutation-note">
          {DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE}
        </p>
        <div className={styles.actionRow}>
          <button
            type="button"
            disabled
            aria-disabled="true"
            data-demo-ux="daily-record-mutation-button"
            data-demo-ux-mutation="create"
          >
            作成する
          </button>
          <button
            type="button"
            disabled
            aria-disabled="true"
            data-demo-ux="daily-record-mutation-button"
            data-demo-ux-mutation="save"
          >
            保存する
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="demo-ux-record-recent-heading">
        <h2 id="demo-ux-record-recent-heading">最近の記録</h2>
        <p className={styles.sectionHint} data-demo-ux="daily-record-recent-hint">
          {DEMO_DAILY_RECORD_RECENT_HINT}
        </p>
        <ol className={styles.timeline} data-demo-ux="daily-record-recent-list">
          {recentRecords.map((record) => (
            <li
              key={record.id}
              className={styles.timelineItem}
              data-demo-ux="daily-record-recent-item"
            >
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
