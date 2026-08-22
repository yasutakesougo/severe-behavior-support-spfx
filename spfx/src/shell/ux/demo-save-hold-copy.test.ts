import { SHELL_SAVE_STATE_LABELS, SHELL_SAVE_STATES } from "./save-state";
import {
  ADMIN_DEMO_UX_POLISH_1_SLICE,
  DEMO_LIVE_WRITE_HOLD_SAVE_NOTE,
  DEMO_UNRECORDED_AFTER_HOLD_SAVE_NOTE,
  demoHoldCopyAvoidsSuccessClaim,
  demoHoldSaveStatusNote,
} from "./demo-save-hold-copy";

describe("ADMIN-DEMO-UX-POLISH-1 demo save hold copy", () => {
  it("authorizes presentation copy only and keeps persistence / success claims closed", () => {
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.id).toBe("ADMIN-DEMO-UX-POLISH-1");
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.presentationOnly).toBe(true);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.demoSaveHoldCopyAuthorized).toBe(true);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.saveSuccessClaimAuthorized).toBe(false);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.liveWriteAuthorized).toBe(false);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.procedureRecordPersistenceEnablementAuthorized).toBe(false);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.unrecordedBadgeMutationAuthorized).toBe(false);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.kpiFamilyRRecountAuthorized).toBe(false);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.saveStateSemanticsChangeAuthorized).toBe(false);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.authorizationResolverChangeAuthorized).toBe(false);
    expect(ADMIN_DEMO_UX_POLISH_1_SLICE.productionRoleSwitchAuthorized).toBe(false);
  });

  it("keeps 5-state labels unchanged while HOLD save_failed uses disconnected demo copy", () => {
    expect(SHELL_SAVE_STATES).toEqual([
      "unsaved",
      "saving",
      "saved",
      "save_failed",
      "save_outcome_unknown",
    ]);
    expect(SHELL_SAVE_STATE_LABELS.save_failed).toBe("保存失敗");
    expect(demoHoldSaveStatusNote("save_failed", true)).toBe(DEMO_LIVE_WRITE_HOLD_SAVE_NOTE);
    expect(demoHoldSaveStatusNote("save_failed", false)).toBeUndefined();
    expect(demoHoldSaveStatusNote("saved", true)).toBeUndefined();
    expect(demoHoldSaveStatusNote("save_outcome_unknown", true)).toBeUndefined();
  });

  it("explains expected disconnect without claiming persistence success", () => {
    expect(DEMO_LIVE_WRITE_HOLD_SAVE_NOTE).toContain("デモでは保存しません");
    expect(DEMO_LIVE_WRITE_HOLD_SAVE_NOTE).toContain("入力内容の確認まで行えます");
    expect(DEMO_LIVE_WRITE_HOLD_SAVE_NOTE).toContain(
      "このデモでの内容は実際の業務データには反映されません",
    );
    expect(DEMO_LIVE_WRITE_HOLD_SAVE_NOTE).not.toContain("SharePoint");
    expect(demoHoldCopyAvoidsSuccessClaim(DEMO_LIVE_WRITE_HOLD_SAVE_NOTE)).toBe(true);
    expect(demoHoldCopyAvoidsSuccessClaim(DEMO_UNRECORDED_AFTER_HOLD_SAVE_NOTE)).toBe(true);
    expect(demoHoldCopyAvoidsSuccessClaim("保存成功しました")).toBe(false);
    expect(DEMO_UNRECORDED_AFTER_HOLD_SAVE_NOTE).toContain("未記録");
    expect(DEMO_UNRECORDED_AFTER_HOLD_SAVE_NOTE).not.toContain("SharePoint");
    expect(DEMO_UNRECORDED_AFTER_HOLD_SAVE_NOTE).not.toContain("本日記録した");
  });
});
