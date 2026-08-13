import {
  SBS_BORDER_WIDTH,
  SBS_COLOR,
  SBS_FOCUS,
  SBS_FONT_SIZE,
  SBS_RADIUS,
  SBS_RAW_COLOR,
  SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP,
  SBS_SPACE,
  SBS_TOKEN_CATEGORIES,
  SBS_TOKEN_SLICE,
  resolveRawColor,
} from "./index";

describe("DADS-04 design tokens", () => {
  it("exposes the authorized token categories", () => {
    expect([...SBS_TOKEN_CATEGORIES]).toEqual([
      "spacing",
      "typography",
      "radius",
      "border",
      "surface",
      "text",
      "focus",
      "status-presentation",
      "state-presentation",
    ]);
  });

  it("keeps DADS-04 authorization boundaries closed for later units", () => {
    expect(SBS_TOKEN_SLICE.reactDirectDadsValuesAuthorized).toBe(false);
    expect(SBS_TOKEN_SLICE.primitivesAuthorized).toBe(false);
    expect(SBS_TOKEN_SLICE.accessibilityGateAuthorized).toBe(false);
    expect(SBS_TOKEN_SLICE.screenMigrationAuthorized).toBe(false);
    expect(SBS_TOKEN_SLICE.gapRemediationAuthorized).toBe(false);
    expect(SBS_TOKEN_SLICE.domainContractsMutationAuthorized).toBe(false);
    expect(SBS_TOKEN_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(SBS_TOKEN_SLICE.deployAuthorized).toBe(false);
  });

  it("separates raw values from semantic token ids", () => {
    expect(SBS_SPACE[3].value).toBe("0.75rem");
    expect(SBS_FONT_SIZE[500].value).toBe("1.25rem");
    expect(SBS_RADIUS.md.value).toBe("8px");
    expect(SBS_BORDER_WIDTH.thick.value).toBe("2px");
    expect(SBS_FOCUS.outlineWidth.value).toBe("2px");
    expect(SBS_FOCUS.ringColor.spfxTheme?.cssThemeString).toContain("themePrimary");
    expect(resolveRawColor(SBS_COLOR.feedbackInfoBorder)).toBe(SBS_RAW_COLOR.feedbackInfoBorder);
  });

  it("does not embed business status labels or recordStatus into token ids", () => {
    const ids = [
      ...Object.keys(SBS_COLOR),
      ...Object.keys(SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP),
    ].join(" ");
    expect(ids).not.toMatch(/要確認|未記録|期限接近|recordStatus|確認待ち/);
    expect(Object.keys(SBS_COLOR).some((k) => k.startsWith("feedback"))).toBe(true);
  });

  it("maps save-state presentation to feedback tokens without collapsing unknown", () => {
    expect(SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP.saving.bg).toBe("feedbackInfoBg");
    expect(SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP.save_failed.bg).toBe("feedbackDangerBg");
    expect(SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP.save_outcome_unknown.bg).toBe("feedbackWarningBg");
    expect(SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP.save_outcome_unknown.bg).not.toBe(
      SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP.save_failed.bg,
    );
  });

  it("exposes focus tokens usable for focus-visible without requiring selector change here", () => {
    expect(SBS_FOCUS.ringColor.cssVar).toBe("--sbs-color-focus-ring");
    expect(SBS_FOCUS.outlineWidth.cssVar).toBe("--sbs-focus-outline-width");
    expect(SBS_FOCUS.outlineOffset.value).toBe("2px");
  });
});
