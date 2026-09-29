import {
  VP1_DEMO_ROLE_HINT,
  VP1_DEMO_ROLE_LEGEND,
  VP1_DEMO_SAFETY_NOTICE,
  VP1_DEMO_SETTINGS_LABEL,
  VP1_DEMO_UI_POLICY,
} from "./vp1-demo-separation";

describe("VP-1 demo/developer UI separation", () => {
  it("keeps a compact synthetic/no-save safety message", () => {
    expect(VP1_DEMO_SAFETY_NOTICE).toContain("デモ環境");
    expect(VP1_DEMO_SAFETY_NOTICE).toContain("合成データ");
    expect(VP1_DEMO_SAFETY_NOTICE).toContain("保存されません");
  });

  it("keeps presentation-role switching explicitly non-authoritative", () => {
    expect(VP1_DEMO_ROLE_LEGEND).toContain("デモ専用");
    expect(VP1_DEMO_ROLE_HINT).toContain("権限判定");
    expect(VP1_DEMO_ROLE_HINT).toContain("Entra");
    expect(VP1_DEMO_ROLE_HINT).toContain("影響しません");
  });

  it("locks VP-1 to presentation-only behavior", () => {
    expect(VP1_DEMO_UI_POLICY).toEqual({
      businessChromeFirst: true,
      compactSafetyNoticeRequired: true,
      demoControlsSecondary: true,
      demoControlsDisclosureRequired: true,
      secondarySurfaceLabel: VP1_DEMO_SETTINGS_LABEL,
      presentationRoleOnly: true,
      liveTenantIoAuthorized: false,
    });
  });

  it("names the secondary demo settings surface", () => {
    expect(VP1_DEMO_UI_POLICY.secondarySurfaceLabel).toBe("表示・検証設定");
    expect(VP1_DEMO_UI_POLICY.demoControlsDisclosureRequired).toBe(true);
  });
});
