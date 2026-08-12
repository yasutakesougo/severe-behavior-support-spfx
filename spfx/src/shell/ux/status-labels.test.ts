import {
  DEMO_UX_7_SLICE,
  SHELL_STATUS_LABEL_DUE_SOON,
  SHELL_STATUS_LABEL_NEEDS_REVIEW,
  SHELL_STATUS_LABEL_UNRECORDED,
  isDeprecatedPrimaryStatusLabel,
} from "./status-labels";

describe("DEMO-UX-7 status label canon", () => {
  it("locks canonical labels", () => {
    expect(SHELL_STATUS_LABEL_NEEDS_REVIEW).toBe("要確認");
    expect(SHELL_STATUS_LABEL_DUE_SOON).toBe("期限接近");
    expect(SHELL_STATUS_LABEL_UNRECORDED).toBe("未記録");
  });

  it("marks deprecated primary labels", () => {
    expect(isDeprecatedPrimaryStatusLabel("確認待ち")).toBe(true);
    expect(isDeprecatedPrimaryStatusLabel("確認対象")).toBe(true);
    expect(isDeprecatedPrimaryStatusLabel("期限間近")).toBe(true);
    expect(isDeprecatedPrimaryStatusLabel("要確認")).toBe(false);
    expect(isDeprecatedPrimaryStatusLabel("期限接近")).toBe(false);
  });

  it("keeps write / live / redesign flags off", () => {
    expect(DEMO_UX_7_SLICE.id).toBe("DEMO-UX-7");
    expect(DEMO_UX_7_SLICE.terminologyCanonAuthorized).toBe(true);
    expect(DEMO_UX_7_SLICE.todayActionNavigationAuthorized).toBe(true);
    expect(DEMO_UX_7_SLICE.saveMutationAuthorized).toBe(false);
    expect(DEMO_UX_7_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(DEMO_UX_7_SLICE.filterExecutionAuthorized).toBe(false);
    expect(DEMO_UX_7_SLICE.recordFlowRedesignAuthorized).toBe(false);
    expect(DEMO_UX_7_SLICE.visualRedesignAuthorized).toBe(false);
    expect(DEMO_UX_7_SLICE.failClosedSemanticsChangeAuthorized).toBe(false);
    expect(DEMO_UX_7_SLICE.unselectedStateRelaxationAuthorized).toBe(false);
    expect(DEMO_UX_7_SLICE.saveOutcomeUnknownNormalizationAuthorized).toBe(false);
  });
});
