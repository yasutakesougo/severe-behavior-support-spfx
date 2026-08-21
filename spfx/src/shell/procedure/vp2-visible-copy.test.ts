import {
  FIELD_WORKFLOW_CANCELLATION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CANCELLATION_SAVE_BOUNDARY_NOTE,
  FIELD_WORKFLOW_CORRECTION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE,
  FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE,
  FIELD_WORKFLOW_PRESENTATION_NOTE,
} from "./procedure-copy";
import {
  DEMO_LIVE_WRITE_HOLD_SAVE_NOTE,
  DEMO_UNRECORDED_AFTER_HOLD_SAVE_NOTE,
} from "../ux/demo-save-hold-copy";

const STAFF_FACING_COPY = [
  FIELD_WORKFLOW_PRESENTATION_NOTE,
  FIELD_WORKFLOW_MUTATION_BOUNDARY_NOTE,
  FIELD_WORKFLOW_CORRECTION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE,
  FIELD_WORKFLOW_CANCELLATION_PRESENTATION_NOTE,
  FIELD_WORKFLOW_CANCELLATION_SAVE_BOUNDARY_NOTE,
  DEMO_LIVE_WRITE_HOLD_SAVE_NOTE,
  DEMO_UNRECORDED_AFTER_HOLD_SAVE_NOTE,
] as const;

const TECHNICAL_TOKENS = [
  "FIELD-WORKFLOW",
  "live SharePoint",
  "Deploy",
  "WRITE",
  "persistProcedureRecord",
  "submitCorrection",
  "submitCancellation",
  "fake port",
  "in-memory",
  "Slice C",
  "resolver",
] as const;

describe("VP-2 staff-facing copy boundary", () => {
  it("removes developer and infrastructure vocabulary from normal copy", () => {
    for (const copy of STAFF_FACING_COPY) {
      for (const token of TECHNICAL_TOKENS) {
        expect(copy).not.toContain(token);
      }
    }
  });

  it("keeps the synthetic and no-business-data-write safety boundary", () => {
    expect(FIELD_WORKFLOW_PRESENTATION_NOTE).toContain("合成データ");
    expect(FIELD_WORKFLOW_PRESENTATION_NOTE).toContain("実際の業務データ");
    expect(DEMO_LIVE_WRITE_HOLD_SAVE_NOTE).toContain("実際の業務データ");
  });

  it("does not deny in-demo correction or cancellation save-state behavior", () => {
    expect(FIELD_WORKFLOW_CORRECTION_SAVE_BOUNDARY_NOTE).toContain("デモ内で保存状態");
    expect(FIELD_WORKFLOW_CANCELLATION_SAVE_BOUNDARY_NOTE).toContain("デモ内で保存状態");
  });
});
