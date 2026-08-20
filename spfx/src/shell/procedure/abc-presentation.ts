import type { ProcedureBindingContext } from "./procedure-types";

export const FIELD_STAFF_ABC_PRESENTATION_1_SLICE = {
  id: "FIELD-STAFF-ABC-PRESENTATION-1",
  presentationOnly: true as const,
  readOnly: true as const,
  observationSaveAuthorized: false as const,
  lifecycleChangeAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

export type AbcObservationPresentation = Readonly<{
  context: ProcedureBindingContext;
  occurredAt: string;
  antecedent: string;
  behavior: string;
  aftermath: string;
  intensityLabel: string;
}>;

/** Synthetic ABC context only. It is not an observation draft or saved record. */
export function presentAbcObservation(
  context: ProcedureBindingContext | undefined,
): AbcObservationPresentation | undefined {
  if (!FIELD_STAFF_ABC_PRESENTATION_1_SLICE.presentationOnly || !context) {
    return undefined;
  }

  return {
    context,
    occurredAt: "2026-08-20 10:32（合成）",
    antecedent: "予定変更を伝えた場面",
    behavior: "大きな声があり、支援者へ視線を向けた",
    aftermath: "距離を確保し、落ち着くまで見守った",
    intensityLabel: "合成表示（尺度未接続）",
  };
}
