import * as React from "react";
import {
  bindProcedureRecordList,
  createReadOnlyProcedureRecordLookup,
  type ProcedureRecord,
  type ProcedureRecordReadTransport,
} from "../../../sbs-domain/procedure-record-read.bundle";
import styles from "./FieldStaffReadOnlyPilot.module.scss";

export type FieldStaffReadOnlyPilotAllowlist = Readonly<{
  organizationId: string;
  siteId: string;
  userId: string;
  recordId: string;
}>;

export type FieldStaffReadOnlyPilotStrings = Readonly<{
  pilotTitle: string;
  syntheticBanner: string;
  loadingLabel: string;
  emptyLabel: string;
  forbiddenLabel: string;
  fetchFailedLabel: string;
  recordHeading: string;
  personLabel: string;
  planLabel: string;
  procedureLabel: string;
  performedAtLabel: string;
  recordedAtLabel: string;
  resultLabel: string;
  resultValues: Readonly<Record<ProcedureRecord["result"], string>>;
}>;

export type FieldStaffReadOnlyPilotProps = Readonly<{
  strings: FieldStaffReadOnlyPilotStrings;
  transport?: ProcedureRecordReadTransport;
  allowlist?: FieldStaffReadOnlyPilotAllowlist;
}>;

export const SYNTHETIC_PILOT_LIST_GUID = "00000000-0000-0000-0000-000000000001";
export const SYNTHETIC_PILOT_RECORD_ID = "synthetic-procedure-record-001";

export const SYNTHETIC_PILOT_ALLOWLIST: FieldStaffReadOnlyPilotAllowlist = {
  organizationId: "synthetic-org-001",
  siteId: "SITE-ISG",
  userId: "user-a",
  recordId: SYNTHETIC_PILOT_RECORD_ID,
};

export const SYNTHETIC_PILOT_ROW: Readonly<Record<string, unknown>> = {
  prRecordId: SYNTHETIC_PILOT_RECORD_ID,
  prIdempotencyKey: "synthetic-procedure-idempotency-001",
  prPayloadFingerprint: "synthetic-procedure-fingerprint-001",
  prOrganizationId: "synthetic-org-001",
  prSiteId: "SITE-ISG",
  prUserId: "user-a",
  prProcedureId: "synthetic-procedure-p2",
  prProcedureVersion: "synthetic-procedure-p2-v1",
  prApprovalState: "APPROVED",
  prLocalDate: "2026-08-12",
  prPlanId: "synthetic-plan-001",
  prPlanVersion: "2",
  prResult: "PERFORMED_AS_PLANNED",
  prPerformedAt: "2026-08-12T14:05:00+09:00",
  prRecordedAt: "2026-08-12T15:32:00+09:00",
  prRecordedBy: "synthetic-subject-001",
};

export const SYNTHETIC_PILOT_TRANSPORT: ProcedureRecordReadTransport = {
  targetListGuid: SYNTHETIC_PILOT_LIST_GUID,
  findByRecordId: async (recordId: string) => ({
    ok: true,
    rows: recordId === SYNTHETIC_PILOT_RECORD_ID ? [SYNTHETIC_PILOT_ROW] : [],
  }),
};

type PilotState =
  | Readonly<{ kind: "loading" }>
  | Readonly<{ kind: "found"; record: ProcedureRecord }>
  | Readonly<{ kind: "empty" }>
  | Readonly<{ kind: "forbidden" }>
  | Readonly<{ kind: "fetch_failed"; code: string }>;

const INITIAL_STATE: PilotState = { kind: "loading" };

const isAllowedRecord = (
  record: ProcedureRecord,
  allowlist: FieldStaffReadOnlyPilotAllowlist,
): boolean =>
  record.OrganizationId === allowlist.organizationId &&
  record.SiteId === allowlist.siteId &&
  record.UserId === allowlist.userId &&
  record.RecordId === allowlist.recordId;

export const FieldStaffReadOnlyPilot: React.FC<FieldStaffReadOnlyPilotProps> = ({
  strings,
  transport = SYNTHETIC_PILOT_TRANSPORT,
  allowlist = SYNTHETIC_PILOT_ALLOWLIST,
}) => {
  const binding = React.useMemo(
    () =>
      bindProcedureRecordList({
        organizationId: allowlist.organizationId,
        siteId: allowlist.siteId,
        listGuid: SYNTHETIC_PILOT_LIST_GUID,
      }),
    [allowlist.organizationId, allowlist.siteId],
  );

  const lookup = React.useMemo(
    () => (binding ? createReadOnlyProcedureRecordLookup(binding, transport) : null),
    [binding, transport],
  );

  const [state, setState] = React.useState<PilotState>(INITIAL_STATE);

  React.useEffect(() => {
    if (!lookup) {
      setState({ kind: "forbidden" });
      return undefined;
    }

    let cancelled = false;

    lookup.findByRecordId(allowlist.recordId).then(
      (result) => {
        if (cancelled) {
          return;
        }
        if (result.status === "FOUND") {
          if (isAllowedRecord(result.value, allowlist)) {
            setState({ kind: "found", record: result.value });
          } else {
            setState({ kind: "forbidden" });
          }
          return;
        }
        if (result.status === "EMPTY") {
          setState({ kind: "empty" });
          return;
        }
        if (result.status === "UNKNOWN") {
          setState({ kind: "forbidden" });
          return;
        }
        setState({ kind: "fetch_failed", code: result.code });
      },
      () => {
        if (!cancelled) {
          setState({ kind: "fetch_failed", code: "TRANSPORT_ERROR" });
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [allowlist, lookup]);

  return (
    <section
      className={styles.pilot}
      data-field-staff-read-only-pilot="true"
      data-pilot-data-source="synthetic"
      data-pilot-read-only="true"
      data-pilot-write-capability="none"
      data-pilot-record-count={state.kind === "found" ? "1" : "0"}
      aria-labelledby="field-staff-read-only-pilot-heading"
    >
      <p className={styles.banner} data-pilot-synthetic-banner="true">
        {strings.syntheticBanner}
      </p>
      <h1
        id="field-staff-read-only-pilot-heading"
        className={styles.heading}
        data-pilot-heading="true"
      >
        {strings.pilotTitle}
      </h1>

      {state.kind === "loading" ? (
        <p className={styles.status} role="status" data-pilot-state="loading">
          {strings.loadingLabel}
        </p>
      ) : null}

      {state.kind === "empty" ? (
        <p className={styles.status} role="status" data-pilot-state="empty">
          {strings.emptyLabel}
        </p>
      ) : null}

      {state.kind === "forbidden" ? (
        <p
          className={styles.status}
          role="status"
          data-pilot-state="forbidden"
          data-pilot-fail-closed="true"
        >
          {strings.forbiddenLabel}
        </p>
      ) : null}

      {state.kind === "fetch_failed" ? (
        <p
          className={styles.status}
          role="status"
          data-pilot-state="fetch_failed"
          data-pilot-fail-closed="true"
          data-pilot-failure-code={state.code}
        >
          {strings.fetchFailedLabel} ({state.code})
        </p>
      ) : null}

      {state.kind === "found" ? (
        <article
          className={styles.record}
          data-pilot-record="true"
          data-pilot-record-id={state.record.RecordId}
        >
          <h2 className={styles.recordHeading}>{strings.recordHeading}</h2>
          <dl className={styles.facts}>
            <div>
              <dt>{strings.personLabel}</dt>
              <dd data-pilot-user-id="true">{state.record.UserId}</dd>
            </div>
            <div>
              <dt>{strings.planLabel}</dt>
              <dd>
                {state.record.planId} / v{state.record.planVersion}
              </dd>
            </div>
            <div>
              <dt>{strings.procedureLabel}</dt>
              <dd>
                {state.record.Procedure.ProcedureId} / {state.record.Procedure.ProcedureVersion}
              </dd>
            </div>
            <div>
              <dt>{strings.performedAtLabel}</dt>
              <dd>{state.record.performedAt}</dd>
            </div>
            <div>
              <dt>{strings.recordedAtLabel}</dt>
              <dd>{state.record.recordedAt}</dd>
            </div>
            <div>
              <dt>{strings.resultLabel}</dt>
              <dd data-pilot-result={state.record.result}>
                {strings.resultValues[state.record.result]}
              </dd>
            </div>
          </dl>
        </article>
      ) : null}
    </section>
  );
};

export default FieldStaffReadOnlyPilot;
