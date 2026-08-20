/**
 * CANCEL-SLICE-D — session-local lifecycle-event collection + read-model rebuild.
 * Existing resolver / buildTodaySupportReadModel remains the only cancelled-state authority.
 * FORBIDDEN: assigning 取消済み directly from saveState === "saved".
 */

import type {
  ProcedureRecordLifecycleEvent,
  TodaySupportItem,
} from "../../sbs-domain/kiosk-read-model.bundle";
import { getKioskSyntheticTodaySupportItems } from "./kiosk-today-support-fixture";

export function appendSessionCancellationLifecycleEvent(
  prior: readonly ProcedureRecordLifecycleEvent[],
  event: ProcedureRecordLifecycleEvent,
): readonly ProcedureRecordLifecycleEvent[] {
  if (prior.some((item) => item.LifecycleEventId === event.LifecycleEventId)) {
    return prior;
  }
  return [...prior, event];
}

/**
 * Rebuild Today Support items from synthetic baseline + session CANCEL events.
 * Status text comes only from the existing read-model/resolver path.
 */
export function rebuildTodaySupportItemsWithSessionCancellations(
  sessionLifecycleEvents: readonly ProcedureRecordLifecycleEvent[],
): readonly TodaySupportItem[] {
  return getKioskSyntheticTodaySupportItems(sessionLifecycleEvents);
}

/**
 * Test/helper guard: saved alone must not invent 取消済み.
 * Callers must recompute through rebuildTodaySupportItemsWithSessionCancellations.
 */
export function cancelledStatusFromSaveStateAlone(_saveState: string): undefined {
  return undefined;
}
