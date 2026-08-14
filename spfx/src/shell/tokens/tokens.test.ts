import {
  SBS_ACTION,
  SBS_BORDER_WIDTH,
  SBS_COLOR,
  SBS_ELEVATION,
  SBS_FOCUS,
  SBS_FONT_SIZE,
  SBS_RADIUS,
  SBS_RAW_COLOR,
  SBS_RAW_ELEVATION,
  SBS_RAW_SPACE,
  SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP,
  SBS_SPACE,
  SBS_STATUS_PRESENTATION,
  SBS_TOKEN_CATEGORIES,
  SBS_TOKEN_SLICE,
  SBS_TYPOGRAPHY,
  SBS_VISUAL_POLISH_1_SLICE,
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
      "elevation",
      "action",
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
      ...Object.keys(SBS_STATUS_PRESENTATION),
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

describe("VISUAL-POLISH-1 foundations tokens", () => {
  it("keeps VP-1 authorization boundaries closed", () => {
    expect(SBS_VISUAL_POLISH_1_SLICE.additiveOnly).toBe(true);
    expect(SBS_VISUAL_POLISH_1_SLICE.breakingRenameAuthorized).toBe(false);
    expect(SBS_VISUAL_POLISH_1_SLICE.parallelTokenSystemAuthorized).toBe(false);
    expect(SBS_VISUAL_POLISH_1_SLICE.screenRelayoutAuthorized).toBe(false);
    expect(SBS_VISUAL_POLISH_1_SLICE.overviewUsersWorkflowRelayoutAuthorized).toBe(false);
    expect(SBS_VISUAL_POLISH_1_SLICE.navigationSemanticsChangeAuthorized).toBe(false);
    expect(SBS_VISUAL_POLISH_1_SLICE.statusVocabularyChangeAuthorized).toBe(false);
    expect(SBS_VISUAL_POLISH_1_SLICE.saveStateCollapseAuthorized).toBe(false);
    expect(SBS_VISUAL_POLISH_1_SLICE.failClosedChangeAuthorized).toBe(false);
    expect(SBS_VISUAL_POLISH_1_SLICE.deployAuthorized).toBe(false);
  });

  it("adds space.6 = 32px without removing prior spacing steps", () => {
    expect(SBS_RAW_SPACE[1]).toBe("0.25rem");
    expect(SBS_RAW_SPACE[5]).toBe("1.5rem");
    expect(SBS_SPACE[6].value).toBe("2rem");
    expect(SBS_SPACE[6].cssVar).toBe("--sbs-space-6");
  });

  it("adds surface / surfaceHover and textSecondary / textDisabled", () => {
    expect(resolveRawColor(SBS_COLOR.surface)).toBe(SBS_RAW_COLOR.canvas);
    expect(resolveRawColor(SBS_COLOR.surface)).toBe(resolveRawColor(SBS_COLOR.surfaceCanvas));
    expect(SBS_COLOR.surfaceHover.spfxTheme?.slot).toBe("neutralLighter");
    expect(SBS_COLOR.textSecondary.spfxTheme?.slot).toBe("neutralSecondary");
    expect(SBS_COLOR.textDisabled.spfxTheme?.slot).toBe("disabledBodyText");
    expect(resolveRawColor(SBS_COLOR.textDisabled)).toBe(SBS_RAW_COLOR.neutralTertiaryDefault);
  });

  it("adds elevationNone / elevationSubtle", () => {
    expect(SBS_ELEVATION.none.value).toBe(SBS_RAW_ELEVATION.none);
    expect(SBS_ELEVATION.subtle.value).toBe(SBS_RAW_ELEVATION.subtle);
    expect(SBS_ELEVATION.subtle.value).not.toBe(SBS_ELEVATION.none.value);
  });

  it("exposes semantic typography aliases onto existing font-size scale", () => {
    expect(SBS_TYPOGRAPHY.pageTitle.fontSize).toBe(SBS_FONT_SIZE[500].value);
    expect(SBS_TYPOGRAPHY.pageTitle.fontWeight).toBe(600);
    expect(SBS_TYPOGRAPHY.sectionTitle.fontSize).toBe(SBS_FONT_SIZE[400].value);
    expect(SBS_TYPOGRAPHY.sectionTitle.fontWeight).toBe(600);
    expect(SBS_TYPOGRAPHY.body.fontSize).toBe(SBS_FONT_SIZE[200].value);
    expect(SBS_TYPOGRAPHY.meta.fontSize).toBe(SBS_FONT_SIZE[100].value);
  });

  it("exposes action hierarchy presentation tokens", () => {
    expect(SBS_ACTION.primary.weight).toBe("primary");
    expect(SBS_ACTION.secondary.weight).toBe("secondary");
    expect(SBS_ACTION.tertiary.weight).toBe("tertiary");
    expect(SBS_ACTION.primary.fontWeight).toBe(600);
  });

  it("exposes status presentation aliases without Domain label ids", () => {
    expect(SBS_STATUS_PRESENTATION.neutral.bg).toBe("surfaceSubtle");
    expect(SBS_STATUS_PRESENTATION.attention.bg).toBe("feedbackInfoBg");
    expect(SBS_STATUS_PRESENTATION.warning.bg).toBe("feedbackWarningBg");
    expect(SBS_STATUS_PRESENTATION.danger.bg).toBe("feedbackDangerBg");
    expect(SBS_STATUS_PRESENTATION.success.bg).toBe("feedbackSuccessBg");
    expect(SBS_STATUS_PRESENTATION.warning.bg).not.toBe(SBS_STATUS_PRESENTATION.danger.bg);
  });

  it("keeps radius sm/md keys and adds small/medium aliases", () => {
    expect(SBS_RADIUS.sm.value).toBe("4px");
    expect(SBS_RADIUS.md.value).toBe("8px");
    expect(SBS_RADIUS.small.value).toBe(SBS_RADIUS.sm.value);
    expect(SBS_RADIUS.medium.value).toBe(SBS_RADIUS.md.value);
  });
});
