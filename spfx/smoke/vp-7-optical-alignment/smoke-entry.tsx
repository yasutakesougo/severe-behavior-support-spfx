/**
 * VP-7 optical alignment browser smoke — synthetic fixture only.
 * Procedure Record Correction result-option optical offset verification.
 * No SharePoint / Graph / Deploy / live I/O.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { KIOSK_RECORD_1, getKioskSyntheticTodaySupportItems } from "../../src/shell/procedure/kiosk-today-support-fixture";
import { ProcedureRecordCorrection } from "../../src/shell/procedure/ProcedureRecordCorrection";
import { buildProcedureCorrectionOriginalBinding } from "../../src/shell/procedure/procedure-correction-binding";
import { presentProcedureCorrection } from "../../src/shell/procedure/procedure-correction";

const items = getKioskSyntheticTodaySupportItems();
const recorded = items.find((item) => item.effectiveStatus === "記録済み");
if (!recorded) {
  throw new Error("VP-7 smoke fixture: recorded occurrence missing");
}

const context = {
  userId: recorded.userId,
  personLabel: recorded.personLabel,
  organizationId: "synthetic-org-001",
  siteId: "SITE-ISG",
  planId: recorded.planId,
  planVersion: recorded.planVersion,
  procedureId: recorded.procedure.ProcedureId,
  procedureVersion: recorded.procedure.ProcedureVersion,
  planPeriodLabel: "合成期間",
  occurrenceId: recorded.occurrenceId,
};

const presentation = presentProcedureCorrection(recorded, context);
const originalBinding = buildProcedureCorrectionOriginalBinding(context, KIOSK_RECORD_1);

if (!presentation || !originalBinding) {
  throw new Error("VP-7 smoke fixture: correction presentation or binding missing");
}

const SmokeApp: React.FC = () => {
  return (
    <div data-vp-7-smoke="root" data-vp-7-slice="VP-7">
      <ProcedureRecordCorrection
        presentation={presentation}
        originalBinding={originalBinding}
        nowIso={() => "2026-08-17T21:10:00+09:00"}
        initialDraft={{
          result: "PERFORMED_AS_PLANNED",
          performedAtLocal: "2026-08-17T21:05",
          reason: "",
        }}
      />
    </div>
  );
};

const root = document.getElementById("root");
if (!root) {
  throw new Error("smoke root missing");
}

ReactDOM.render(<SmokeApp />, root);
