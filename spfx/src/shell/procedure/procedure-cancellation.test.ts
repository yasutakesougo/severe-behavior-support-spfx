/**
 * CANCEL-SLICE-D presentation / draft / auth / read-model refresh tests.
 */

import {
  buildFieldStaffCancellationSyntheticAuthorization,
  FIELD_STAFF_CANCELLATION_SYNTHETIC_AUTHORIZATION,
} from "./procedure-cancellation-auth";
import {
  canConfirmCancellationOutcome,
  canRetryCancellationSave,
  createEmptyCancellationDraft,
  isCancellationDraftReadyToSave,
} from "./procedure-cancellation-draft";
import {
  FIELD_STAFF_CANCELLATION_UI_SLICE,
  presentProcedureCancellation,
} from "./procedure-cancellation";
import {
  appendSessionCancellationLifecycleEvent,
  cancelledStatusFromSaveStateAlone,
  rebuildTodaySupportItemsWithSessionCancellations,
} from "./procedure-cancellation-read-model";
import {
  FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE,
  FIELD_STAFF_PHASE8_CORRECTION_1_SLICE,
} from "./procedure-correction";
import {
  getKioskSyntheticTodaySupportItems,
  getKioskSyntheticTodaySupportReadModelInput,
  KIOSK_RECORD_1,
} from "./kiosk-today-support-fixture";
import type { ProcedureBindingContext } from "./procedure-types";
import {
  mintLifecycleEventIdentity,
  type ProcedureRecordLifecycleEvent,
} from "../../sbs-domain/kiosk-read-model.bundle";

beforeAll(() => {
  const g = globalThis as { TextEncoder?: { new (): unknown } };
  if (typeof g.TextEncoder === "undefined") {
    // Jest jsdom may omit TextEncoder; SHA-256 uses it. SPFx/browser have it.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeUtil = require("util") as { TextEncoder: { new (): unknown } };
    g.TextEncoder = nodeUtil.TextEncoder;
  }
});

function contextForItem(
  item: ReturnType<typeof getKioskSyntheticTodaySupportItems>[number],
): ProcedureBindingContext {
  return {
    userId: item.userId,
    personLabel: item.personLabel,
    planId: item.planId,
    planVersion: item.planVersion,
    planPeriodLabel: "合成計画期間",
    procedureId: item.procedure.ProcedureId,
    procedureVersion: item.procedure.ProcedureVersion,
    occurrenceId: item.occurrenceId,
    organizationId: KIOSK_RECORD_1.OrganizationId,
    siteId: KIOSK_RECORD_1.SiteId,
  };
}

describe("CANCEL-SLICE-D presentation gate", () => {
  it("owns separate metadata and does not flip correction cancellationAuthorized", () => {
    expect(FIELD_STAFF_CANCELLATION_UI_SLICE.cancellationPresentationAuthorized).toBe(true);
    expect(FIELD_STAFF_CANCELLATION_UI_SLICE.liveWriteAuthorized).toBe(false);
    expect(FIELD_STAFF_PHASE8_CORRECTION_1_SLICE.cancellationAuthorized).toBe(false);
    expect(FIELD_STAFF_CORRECTION_UI_SAVE_WIRING_1_SLICE.cancellationAuthorized).toBe(false);
  });

  it("presents cancel only for 記録済み effective RECORDED binding", () => {
    const items = getKioskSyntheticTodaySupportItems();
    const recorded = items.find((item) => item.effectiveStatus === "記録済み");
    const cancelled = items.find((item) => item.effectiveStatus === "取消済み");
    const conflict = items.find((item) => item.effectiveStatus === "確認が必要");
    expect(recorded).toBeDefined();
    expect(
      presentProcedureCancellation(recorded, contextForItem(recorded!)),
    ).toMatchObject({ recordId: recorded!.boundRecord!.RecordId });
    expect(presentProcedureCancellation(cancelled, contextForItem(cancelled!))).toBeUndefined();
    expect(presentProcedureCancellation(conflict, contextForItem(conflict!))).toBeUndefined();
  });
});

describe("CANCEL-SLICE-D synthetic authorization fixture", () => {
  it("builds FOUND AuthorizationContext aligned to bound org/site", () => {
    const auth = buildFieldStaffCancellationSyntheticAuthorization({
      organizationId: KIOSK_RECORD_1.OrganizationId,
      siteId: KIOSK_RECORD_1.SiteId,
    });
    expect(auth?.status).toBe("FOUND");
    if (auth?.status === "FOUND") {
      expect(auth.value.OrganizationId).toBe(KIOSK_RECORD_1.OrganizationId);
      expect(auth.value.SiteContext.SelectedSiteId).toBe(KIOSK_RECORD_1.SiteId);
      expect(auth.value.Subject).toBe(FIELD_STAFF_CANCELLATION_SYNTHETIC_AUTHORIZATION.subject);
    }
  });

  it("fails closed when org/site missing", () => {
    expect(
      buildFieldStaffCancellationSyntheticAuthorization({
        organizationId: " ",
        siteId: KIOSK_RECORD_1.SiteId,
      }),
    ).toBeUndefined();
  });
});

describe("CANCEL-SLICE-D draft / save guards", () => {
  it("requires trimmed reason and explicit confirm", () => {
    const empty = createEmptyCancellationDraft();
    expect(isCancellationDraftReadyToSave(empty)).toBe(false);
    expect(isCancellationDraftReadyToSave({ reason: "  ", confirmed: true })).toBe(false);
    expect(isCancellationDraftReadyToSave({ reason: "理由", confirmed: false })).toBe(false);
    expect(isCancellationDraftReadyToSave({ reason: "理由", confirmed: true })).toBe(true);
  });

  it("mirrors retry rules and allows outcome confirm only for unknown", () => {
    expect(canRetryCancellationSave("unsaved")).toBe(true);
    expect(canRetryCancellationSave("save_failed")).toBe(true);
    expect(canRetryCancellationSave("save_outcome_unknown")).toBe(false);
    expect(canConfirmCancellationOutcome("save_outcome_unknown")).toBe(true);
    expect(canConfirmCancellationOutcome("save_failed")).toBe(false);
  });
});

describe("CANCEL-SLICE-D read-model refresh boundary", () => {
  it("does not derive 取消済み from saveState alone", () => {
    expect(cancelledStatusFromSaveStateAlone("saved")).toBeUndefined();
  });

  it("reaches 取消済み only via resolver rebuild after appending CANCEL event", () => {
    const baseline = getKioskSyntheticTodaySupportItems();
    const recorded = baseline.find((item) => item.boundRecord?.RecordId === KIOSK_RECORD_1.RecordId);
    expect(recorded?.effectiveStatus).toBe("記録済み");

    const cancelIdent = mintLifecycleEventIdentity({
      eventType: "CANCEL",
      targetRecordId: KIOSK_RECORD_1.RecordId,
      recordedAt: "2026-08-20T15:00:00.000Z",
      recordedBy: "synthetic-user-001",
      reason: "テスト取消",
    });
    const cancelEvent: ProcedureRecordLifecycleEvent = {
      schemaVersion: "1.0.0",
      ...cancelIdent,
      eventType: "CANCEL",
      targetRecordId: KIOSK_RECORD_1.RecordId,
      recordedAt: "2026-08-20T15:00:00.000Z",
      recordedBy: "synthetic-user-001",
      reason: "テスト取消",
    };
    const session = appendSessionCancellationLifecycleEvent([], cancelEvent);
    const rebuilt = rebuildTodaySupportItemsWithSessionCancellations(session);
    const after = rebuilt.find((item) => item.boundRecord?.RecordId === KIOSK_RECORD_1.RecordId);
    // Bound record may still be present, but effective status must come from resolver.
    const occurrence = rebuilt.find((item) => item.occurrenceId === recorded?.occurrenceId);
    expect(occurrence?.effectiveStatus).toBe("取消済み");
    expect(occurrence?.canStartProcedureRecord).toBe(false);
    expect(
      getKioskSyntheticTodaySupportReadModelInput(session).lifecycleEvents.some(
        (event) => event.LifecycleEventId === cancelEvent.LifecycleEventId,
      ),
    ).toBe(true);
    expect(after === undefined || after.effectiveStatus === "取消済み").toBe(true);
  });
});
