import * as React from "react";
import { EmptyNotice, SemanticIcon, SingleSelectListbox, StatusBadge } from "../primitives";
import { DEMO_UX_11_SLICE } from "../ux/demo-note-consolidation";
import {
  DEMO_DAILY_RECORD_DRAFT_HINT,
  DEMO_DAILY_RECORD_INCOMPLETE_EMPTY_PRIMARY,
  DEMO_DAILY_RECORD_INCOMPLETE_EMPTY_SUPPORTING,
  DEMO_DAILY_RECORD_INCOMPLETE_HINT,
  DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE,
  DEMO_DAILY_RECORD_RECENT_EMPTY_NOTE,
  DEMO_DAILY_RECORD_RECENT_HINT,
} from "./daily-record-copy";
import {
  DEMO_UX_9_SLICE,
  findIncompleteItemById,
  seedLocalDraftForIncompleteItem,
} from "./daily-record-draft";
import type { ShellDailyRecordPresentation } from "./daily-record-types";
import {
  SHELL_DEFAULT_PRESENTATION_ROLE,
  isAdminAuditPresentationRole,
  type ShellPresentationRole,
} from "../ux/presentation-role";
import styles from "./DailyRecordsUx.module.scss";

export type DailyRecordsProps = Readonly<{
  presentation: ShellDailyRecordPresentation;
  headingRef?: React.Ref<HTMLHeadingElement>;
  presentationRole?: ShellPresentationRole;
}>;

/**
 * DEMO-UX-5 presentation-only daily record screen.
 * DEMO-UX-9 adds incomplete selection → local draft input image (no save).
 * DEMO-UX-11 removes duplicate screen-level synthetic band; mutation/draft boundaries remain.
 * DADS-UX-4: presentation tokens/focus; INV-10 SingleSelectListbox; INV-17 EmptyNotice.
 * VP-F: Visual Polish foundations + kiosk visual alignment; no mutation / LIVE WRITE.
 */
export const DailyRecords: React.FC<DailyRecordsProps> = ({
  presentation,
  headingRef,
  presentationRole = SHELL_DEFAULT_PRESENTATION_ROLE,
}) => {
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
  const showIncompleteEmpty = incompleteItems.length === 0;
  const showRecentEmpty = recentRecords.length === 0;
  const adminRead = isAdminAuditPresentationRole(presentationRole);

  return (
    <section
      className={styles.dailyRecords}
      data-demo-ux="daily-records"
      data-demo-ux-9-slice={DEMO_UX_9_SLICE.id}
      data-demo-ux-11-slice={DEMO_UX_11_SLICE.id}
      data-demo-ux-incomplete-selected={selectedIncompleteId ?? ""}
      data-presentation-role={presentationRole}
      aria-labelledby="demo-ux-records-heading"
    >
      <div className={styles.headingTitleRow}>
        <SemanticIcon name="record" size={28} className={styles.titleIcon} />
        <h1
          id="demo-ux-records-heading"
          ref={headingRef}
          tabIndex={-1}
          className={styles.recordsHeading}
          data-demo-ux="daily-record-heading"
        >
          {heading}
        </h1>
      </div>

      {adminRead ? (
        <p className={styles.sectionHint} data-admin-audit-evidence-first="true">
          証跡の確認専用です。表示内容は合成データです。ここから記録の作成・保存や権限変更は行いません。
        </p>
      ) : null}

      <section className={styles.section} aria-labelledby="demo-ux-record-incomplete-heading">
        <h2 id="demo-ux-record-incomplete-heading" className={styles.sectionHeading}>
          未完了確認
        </h2>
        {!showIncompleteEmpty ? (
          <p className={styles.sectionHint} data-demo-ux="daily-record-incomplete-hint">
            {DEMO_DAILY_RECORD_INCOMPLETE_HINT}
          </p>
        ) : null}
        {showIncompleteEmpty ? (
          // INV-17: incomplete zero-result only — not mutation failure / “all clear”.
          <EmptyNotice
            announce
            dataAttrs={{ "data-demo-ux": "daily-record-incomplete-empty-note" }}
          >
            <span data-demo-ux="daily-record-incomplete-empty-primary">
              {DEMO_DAILY_RECORD_INCOMPLETE_EMPTY_PRIMARY}
            </span>
            <br />
            <span data-demo-ux="daily-record-incomplete-empty-supporting">
              {DEMO_DAILY_RECORD_INCOMPLETE_EMPTY_SUPPORTING}
            </span>
          </EmptyNotice>
        ) : (
          // INV-10: SingleSelectListbox (listbox/option + keyboard); not button+option hybrid.
          <SingleSelectListbox
            ariaLabel="未完了確認の対象選択"
            listDataAttrs={{ "data-demo-ux": "daily-record-incomplete-list" }}
            value={selectedIncompleteId}
            onChange={selectIncomplete}
            options={incompleteItems.map((item) => {
              const selected = item.id === selectedIncompleteId;
              return {
                id: item.id,
                label: item.personLabel,
                description: item.reasonLabel,
                trailing: <StatusBadge shape="pill" label={item.statusLabel} />,
                dataAttrs: {
                  "data-demo-ux": "daily-record-incomplete-item",
                  "data-demo-ux-incomplete-id": item.id,
                  "data-demo-ux-incomplete-selected": selected ? "true" : "false",
                },
              };
            })}
          />
        )}
      </section>

      {adminRead ? (
        <section className={styles.section} aria-labelledby="demo-ux-record-input-heading">
          <h2 id="demo-ux-record-input-heading" className={styles.sectionHeading}>
            記録の確認
          </h2>
          <p className={styles.sectionHint} data-admin-audit-readonly-evidence="true">
            ADMIN_AUDITでは、既存の表示内容を確認します。記録の入力欄は表示しません。
          </p>
        </section>
      ) : (
        <section className={styles.section} aria-labelledby="demo-ux-record-input-heading">
          <h2 id="demo-ux-record-input-heading" className={styles.sectionHeading}>
            記録入力イメージ
          </h2>
          <p className={styles.inputPrompt}>{inputPrompt}</p>
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
      )}

      <section className={styles.section} aria-labelledby="demo-ux-record-recent-heading">
        <h2 id="demo-ux-record-recent-heading" className={styles.sectionHeading}>
          最近の記録
        </h2>
        <p className={styles.sectionHint} data-demo-ux="daily-record-recent-hint">
          {DEMO_DAILY_RECORD_RECENT_HINT}
        </p>
        {showRecentEmpty ? (
          // INV-17: recent zero-result only — not retrieval failure.
          <EmptyNotice announce dataAttrs={{ "data-demo-ux": "daily-record-recent-empty-note" }}>
            {DEMO_DAILY_RECORD_RECENT_EMPTY_NOTE}
          </EmptyNotice>
        ) : (
          <ol className={styles.timeline} data-demo-ux="daily-record-recent-list">
            {recentRecords.map((record) => (
              <li
                key={record.id}
                className={styles.timelineItem}
                data-demo-ux="daily-record-recent-item"
              >
                <div className={styles.recordMeta}>
                  <span className={styles.recordPerson}>{record.personLabel}</span>
                  <span className={styles.recordTime}>{record.recordedAtLabel}</span>
                  <span className={styles.recordType}>{record.recordTypeLabel}</span>
                </div>
                <p className={styles.recordSummary}>{record.summary}</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className={styles.stateGrid}>
        <section className={styles.statePanel} aria-labelledby="demo-ux-record-business-heading">
          <h2 id="demo-ux-record-business-heading" className={styles.sectionHeading}>
            制度・業務情報（合成表示）
          </h2>
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
          <h2 id="demo-ux-record-system-heading" className={styles.sectionHeading}>
            システム状態
          </h2>
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
