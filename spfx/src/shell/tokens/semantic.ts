/**
 * DADS-04 — semantic design tokens (corporate-app intermediate layer).
 * VISUAL-POLISH-1 — additive semantic aliases / categories (no breaking renames).
 *
 * Rules (DADS-01 / DADS-03 / VP-1):
 * - Do not embed DADS literals in React components; use these names / SCSS vars.
 * - Do not encode Domain business status (e.g. recordStatus, 要確認) into token ids.
 * - Status / save presentation maps to feedback / state presentation tokens only.
 * - Color alone must not carry meaning (labels remain presentation vocabulary).
 * - focusRing tokens support current :focus and future :focus-visible without
 *   forcing selector migration in this slice.
 * - Additive only: existing keys keep meaning; new keys extend the catalog.
 */

import {
  SBS_RAW_BORDER_WIDTH,
  SBS_RAW_COLOR,
  SBS_RAW_ELEVATION,
  SBS_RAW_FOCUS,
  SBS_RAW_FONT_SIZE,
  SBS_RAW_FONT_WEIGHT,
  SBS_RAW_RADIUS,
  SBS_RAW_SPACE,
  type SbsRawColorKey,
} from "./raw";

export type SbsSpfxThemeRef = Readonly<{
  slot: string;
  /** Exact SPFx CSS module theme string used by current shell SCSS. */
  cssThemeString: string;
  defaultRawKey: SbsRawColorKey;
}>;

export type SbsSemanticColorToken = Readonly<{
  cssVar: `--sbs-${string}`;
  /** Raw literal key when not theme-resolved at build time. */
  rawKey?: SbsRawColorKey;
  /** Prefer SPFx theme string when present (preserves SharePoint theming). */
  spfxTheme?: SbsSpfxThemeRef;
  /** Human note — presentation only. */
  note?: string;
}>;

export const SBS_TOKEN_SLICE = {
  id: "DADS-04",
  kind: "design-tokens" as const,
  intermediateLayer: true as const,
  reactDirectDadsValuesAuthorized: false as const,
  primitivesAuthorized: false as const,
  accessibilityGateAuthorized: false as const,
  screenMigrationAuthorized: false as const,
  gapRemediationAuthorized: false as const,
  domainContractsMutationAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
  deployAuthorized: false as const,
} as const;

/** VP-1 Foundations extension metadata — does not reopen DADS-UX screen migration. */
export const SBS_VISUAL_POLISH_1_SLICE = {
  id: "VISUAL-POLISH-1",
  kind: "design-tokens-extension" as const,
  additiveOnly: true as const,
  breakingRenameAuthorized: false as const,
  parallelTokenSystemAuthorized: false as const,
  screenRelayoutAuthorized: false as const,
  overviewUsersWorkflowRelayoutAuthorized: false as const,
  navigationSemanticsChangeAuthorized: false as const,
  statusVocabularyChangeAuthorized: false as const,
  saveStateCollapseAuthorized: false as const,
  failClosedChangeAuthorized: false as const,
  reactUpgradeAuthorized: false as const,
  fluentMajorUpgradeAuthorized: false as const,
  deployAuthorized: false as const,
  sharePointWriteAuthorized: false as const,
} as const;

export const SBS_SPACE = {
  1: { cssVar: "--sbs-space-1", value: SBS_RAW_SPACE[1] },
  2: { cssVar: "--sbs-space-2", value: SBS_RAW_SPACE[2] },
  3: { cssVar: "--sbs-space-3", value: SBS_RAW_SPACE[3] },
  4: { cssVar: "--sbs-space-4", value: SBS_RAW_SPACE[4] },
  5: { cssVar: "--sbs-space-5", value: SBS_RAW_SPACE[5] },
  6: { cssVar: "--sbs-space-6", value: SBS_RAW_SPACE[6] },
} as const;

export const SBS_FONT_SIZE = {
  100: { cssVar: "--sbs-font-size-100", value: SBS_RAW_FONT_SIZE[100] },
  200: { cssVar: "--sbs-font-size-200", value: SBS_RAW_FONT_SIZE[200] },
  300: { cssVar: "--sbs-font-size-300", value: SBS_RAW_FONT_SIZE[300] },
  400: { cssVar: "--sbs-font-size-400", value: SBS_RAW_FONT_SIZE[400] },
  500: { cssVar: "--sbs-font-size-500", value: SBS_RAW_FONT_SIZE[500] },
} as const;

/**
 * Semantic typography roles (VP-1).
 * Map to existing font-size scale + weight — do not introduce custom fonts.
 */
export const SBS_TYPOGRAPHY = {
  pageTitle: {
    fontSizeKey: 500 as const,
    fontSize: SBS_RAW_FONT_SIZE[500],
    fontWeight: SBS_RAW_FONT_WEIGHT.semibold,
    lineHeight: 1.35,
    cssVarSize: "--sbs-font-size-page-title",
    cssVarWeight: "--sbs-font-weight-page-title",
    note: "~20px / weight 600",
  },
  sectionTitle: {
    fontSizeKey: 400 as const,
    fontSize: SBS_RAW_FONT_SIZE[400],
    fontWeight: SBS_RAW_FONT_WEIGHT.semibold,
    lineHeight: 1.4,
    cssVarSize: "--sbs-font-size-section-title",
    cssVarWeight: "--sbs-font-weight-section-title",
    note: "~16–17.6px / weight 600 (existing size.400)",
  },
  body: {
    fontSizeKey: 200 as const,
    fontSize: SBS_RAW_FONT_SIZE[200],
    fontWeight: SBS_RAW_FONT_WEIGHT.regular,
    lineHeight: 1.5,
    cssVarSize: "--sbs-font-size-body",
    cssVarWeight: "--sbs-font-weight-body",
    note: "~14px / weight 400",
  },
  meta: {
    fontSizeKey: 100 as const,
    fontSize: SBS_RAW_FONT_SIZE[100],
    fontWeight: SBS_RAW_FONT_WEIGHT.regular,
    lineHeight: 1.4,
    cssVarSize: "--sbs-font-size-meta",
    cssVarWeight: "--sbs-font-weight-meta",
    note: "~12px / weight 400",
  },
} as const;

export const SBS_RADIUS = {
  none: { cssVar: "--sbs-radius-none", value: SBS_RAW_RADIUS.none },
  sm: { cssVar: "--sbs-radius-sm", value: SBS_RAW_RADIUS.sm },
  md: { cssVar: "--sbs-radius-md", value: SBS_RAW_RADIUS.md },
  lg: { cssVar: "--sbs-radius-lg", value: SBS_RAW_RADIUS.lg },
  pill: { cssVar: "--sbs-radius-pill", value: SBS_RAW_RADIUS.pill },
  /** VP-1 semantic aliases — same values as sm/md; no rename of sm/md. */
  small: { cssVar: "--sbs-radius-sm", value: SBS_RAW_RADIUS.sm },
  medium: { cssVar: "--sbs-radius-md", value: SBS_RAW_RADIUS.md },
} as const;

export const SBS_BORDER_WIDTH = {
  thin: { cssVar: "--sbs-border-width-thin", value: SBS_RAW_BORDER_WIDTH.thin },
  thick: { cssVar: "--sbs-border-width-thick", value: SBS_RAW_BORDER_WIDTH.thick },
} as const;

export const SBS_ELEVATION = {
  none: { cssVar: "--sbs-elevation-none", value: SBS_RAW_ELEVATION.none },
  subtle: { cssVar: "--sbs-elevation-subtle", value: SBS_RAW_ELEVATION.subtle },
} as const;

export const SBS_FOCUS = {
  outlineWidth: {
    cssVar: "--sbs-focus-outline-width",
    value: SBS_RAW_FOCUS.outlineWidth,
  },
  outlineOffset: {
    cssVar: "--sbs-focus-outline-offset",
    value: SBS_RAW_FOCUS.outlineOffset,
  },
  /**
   * Ring color uses SPFx themePrimary so SharePoint theming stays intact.
   * Ready for :focus-visible migration without renaming the token.
   */
  ringColor: {
    cssVar: "--sbs-color-focus-ring",
    spfxTheme: {
      slot: "themePrimary",
      cssThemeString: "[theme:themePrimary, default: #03787c]",
      defaultRawKey: "themePrimaryDefault",
    },
  } satisfies SbsSemanticColorToken,
} as const;

/**
 * Action visual-weight tokens (VP-1). Presentation only.
 * Does not change navigation semantics or which actions exist.
 */
export const SBS_ACTION = {
  primary: {
    weight: "primary" as const,
    fontWeight: SBS_RAW_FONT_WEIGHT.semibold,
    note: "Single most important action on a screen — do not spam",
  },
  secondary: {
    weight: "secondary" as const,
    fontWeight: SBS_RAW_FONT_WEIGHT.regular,
    note: "Clear secondary / supporting action",
  },
  tertiary: {
    weight: "tertiary" as const,
    fontWeight: SBS_RAW_FONT_WEIGHT.regular,
    note: "Navigation / detail / back — lowest chrome weight",
  },
} as const;

export const SBS_COLOR = {
  textPrimary: {
    cssVar: "--sbs-color-text-primary",
    spfxTheme: {
      slot: "bodyText",
      cssThemeString: "[theme:bodyText, default: #323130]",
      defaultRawKey: "bodyTextDefault",
    },
  },
  textSecondary: {
    cssVar: "--sbs-color-text-secondary",
    spfxTheme: {
      slot: "neutralSecondary",
      cssThemeString: "[theme:neutralSecondary, default: #8a8886]",
      defaultRawKey: "neutralSecondaryDefault",
    },
    note: "VP-1 additive — meta / supporting copy",
  },
  textDisabled: {
    cssVar: "--sbs-color-text-disabled",
    spfxTheme: {
      slot: "disabledBodyText",
      cssThemeString: "[theme:disabledBodyText, default: #a19f9d]",
      defaultRawKey: "neutralTertiaryDefault",
    },
    note: "VP-1 additive — disabled / inert text",
  },
  borderSubtle: {
    cssVar: "--sbs-color-border-subtle",
    spfxTheme: {
      slot: "neutralLight",
      cssThemeString: "[theme:neutralLight, default: #edebe9]",
      defaultRawKey: "neutralLightDefault",
    },
  },
  borderStrong: {
    cssVar: "--sbs-color-border-strong",
    spfxTheme: {
      slot: "neutralTertiary",
      cssThemeString: "[theme:neutralTertiary, default: #a19f9d]",
      defaultRawKey: "neutralTertiaryDefault",
    },
  },
  surfaceMuted: {
    cssVar: "--sbs-color-surface-muted",
    spfxTheme: {
      slot: "neutralLighter",
      cssThemeString: "[theme:neutralLighter, default: #f3f2f1]",
      defaultRawKey: "neutralLighterDefault",
    },
  },
  surfaceSubtle: {
    cssVar: "--sbs-color-surface-subtle",
    spfxTheme: {
      slot: "neutralLighterAlt",
      cssThemeString: "[theme:neutralLighterAlt, default: #faf9f8]",
      defaultRawKey: "neutralLighterAltDefault",
    },
  },
  surfaceCanvas: {
    cssVar: "--sbs-color-surface-canvas",
    rawKey: "canvas",
  },
  /** VP-1 named default surface — same baseline as surfaceCanvas (additive alias role). */
  surface: {
    cssVar: "--sbs-color-surface",
    rawKey: "canvas",
    note: "VP-1 additive — default content surface",
  },
  surfaceHover: {
    cssVar: "--sbs-color-surface-hover",
    spfxTheme: {
      slot: "neutralLighter",
      cssThemeString: "[theme:neutralLighter, default: #f3f2f1]",
      defaultRawKey: "neutralLighterDefault",
    },
    note: "VP-1 additive — hover / press wash on neutral surfaces",
  },
  skipLinkBg: {
    cssVar: "--sbs-color-skip-link-bg",
    rawKey: "skipLinkBg",
  },
  skipLinkFg: {
    cssVar: "--sbs-color-skip-link-fg",
    rawKey: "skipLinkFg",
  },
  /** Presentation feedback — not Domain status ids. */
  feedbackInfoFg: {
    cssVar: "--sbs-color-feedback-info-fg",
    rawKey: "feedbackInfoFg",
    note: "Used by saving / info chrome presentation",
  },
  feedbackInfoBorder: {
    cssVar: "--sbs-color-feedback-info-border",
    rawKey: "feedbackInfoBorder",
  },
  feedbackInfoBg: {
    cssVar: "--sbs-color-feedback-info-bg",
    rawKey: "feedbackInfoBg",
  },
  feedbackInfoBgSubtle: {
    cssVar: "--sbs-color-feedback-info-bg-subtle",
    rawKey: "feedbackInfoBgSubtle",
  },
  feedbackInfoBgTint: {
    cssVar: "--sbs-color-feedback-info-bg-tint",
    rawKey: "feedbackInfoBgTint",
  },
  feedbackDangerFg: {
    cssVar: "--sbs-color-feedback-danger-fg",
    rawKey: "feedbackDangerFg",
    note: "Used by fail-closed / save_failed presentation; meaning stays in labels",
  },
  feedbackDangerBorder: {
    cssVar: "--sbs-color-feedback-danger-border",
    rawKey: "feedbackDangerBorder",
  },
  feedbackDangerBg: {
    cssVar: "--sbs-color-feedback-danger-bg",
    rawKey: "feedbackDangerBg",
  },
  feedbackDangerBgSubtle: {
    cssVar: "--sbs-color-feedback-danger-bg-subtle",
    rawKey: "feedbackDangerBgSubtle",
  },
  feedbackWarningFg: {
    cssVar: "--sbs-color-feedback-warning-fg",
    rawKey: "feedbackWarningFg",
    note: "Used by demo / save_outcome_unknown presentation; never collapse unknown→failed",
  },
  feedbackWarningBorder: {
    cssVar: "--sbs-color-feedback-warning-border",
    rawKey: "feedbackWarningBorder",
  },
  feedbackWarningBg: {
    cssVar: "--sbs-color-feedback-warning-bg",
    rawKey: "feedbackWarningBg",
  },
  feedbackSuccessFg: {
    cssVar: "--sbs-color-feedback-success-fg",
    rawKey: "feedbackSuccessFg",
    note: "VP-1 additive — success chrome only; not a Domain status id",
  },
  feedbackSuccessBorder: {
    cssVar: "--sbs-color-feedback-success-border",
    rawKey: "feedbackSuccessBorder",
  },
  feedbackSuccessBg: {
    cssVar: "--sbs-color-feedback-success-bg",
    rawKey: "feedbackSuccessBg",
  },
} as const satisfies Record<string, SbsSemanticColorToken>;

/**
 * Semantic status presentation aliases (VP-1).
 * Maps meaning roles → feedback / surface chrome. Does NOT rename
 * DEMO status labels (要確認 / 未記録 / 期限接近 remain in status-labels.ts).
 */
export const SBS_STATUS_PRESENTATION = {
  neutral: {
    fg: "textPrimary",
    border: "borderSubtle",
    bg: "surfaceSubtle",
    note: "Quiet / ordinary state chrome",
  },
  attention: {
    fg: "feedbackInfoFg",
    border: "feedbackInfoBorder",
    bg: "feedbackInfoBg",
    note: "Needs attention chrome — labels remain the meaning channel",
  },
  warning: {
    fg: "feedbackWarningFg",
    border: "feedbackWarningBorder",
    bg: "feedbackWarningBg",
    note: "Warning chrome; also used by save_outcome_unknown map",
  },
  danger: {
    fg: "feedbackDangerFg",
    border: "feedbackDangerBorder",
    bg: "feedbackDangerBg",
    note: "Danger / fail-closed / save_failed chrome",
  },
  success: {
    fg: "feedbackSuccessFg",
    border: "feedbackSuccessBorder",
    bg: "feedbackSuccessBg",
    note: "Success chrome — not a Domain vocabulary rename",
  },
} as const;

/**
 * Presentation mapping from existing save-state chrome to feedback tokens.
 * Does not redefine save-state vocabulary or Domain meaning.
 */
export const SBS_SAVE_STATE_PRESENTATION_TOKEN_MAP = {
  unsaved: { surface: "transparent", emphasis: "quiet" },
  saving: {
    fg: "feedbackInfoFg",
    border: "feedbackInfoBorder",
    bg: "feedbackInfoBg",
    emphasis: "emphasized",
  },
  saved: { surface: "transparent", emphasis: "quiet" },
  save_failed: {
    fg: "feedbackDangerFg",
    border: "feedbackDangerBorder",
    bg: "feedbackDangerBg",
    emphasis: "emphasized",
  },
  save_outcome_unknown: {
    fg: "feedbackWarningFg",
    border: "feedbackWarningBorder",
    bg: "feedbackWarningBg",
    emphasis: "emphasized",
  },
} as const;

export const SBS_TOKEN_CATEGORIES = [
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
] as const;

export type SbsTokenCategory = (typeof SBS_TOKEN_CATEGORIES)[number];

export function resolveRawColor(token: SbsSemanticColorToken): string {
  if (token.rawKey) {
    return SBS_RAW_COLOR[token.rawKey];
  }
  if (token.spfxTheme) {
    return SBS_RAW_COLOR[token.spfxTheme.defaultRawKey];
  }
  throw new Error("Semantic color token missing rawKey/spfxTheme");
}
