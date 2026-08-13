/**
 * DADS-04 — semantic design tokens (corporate-app intermediate layer).
 *
 * Rules (DADS-01 / DADS-03):
 * - Do not embed DADS literals in React components; use these names / SCSS vars.
 * - Do not encode Domain business status (e.g. recordStatus, 要確認) into token ids.
 * - Status / save presentation maps to feedback / state presentation tokens only.
 * - Color alone must not carry meaning (labels remain presentation vocabulary).
 * - focusRing tokens support current :focus and future :focus-visible without
 *   forcing selector migration in this slice.
 */

import {
  SBS_RAW_BORDER_WIDTH,
  SBS_RAW_COLOR,
  SBS_RAW_FOCUS,
  SBS_RAW_FONT_SIZE,
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

export const SBS_SPACE = {
  1: { cssVar: "--sbs-space-1", value: SBS_RAW_SPACE[1] },
  2: { cssVar: "--sbs-space-2", value: SBS_RAW_SPACE[2] },
  3: { cssVar: "--sbs-space-3", value: SBS_RAW_SPACE[3] },
  4: { cssVar: "--sbs-space-4", value: SBS_RAW_SPACE[4] },
  5: { cssVar: "--sbs-space-5", value: SBS_RAW_SPACE[5] },
} as const;

export const SBS_FONT_SIZE = {
  100: { cssVar: "--sbs-font-size-100", value: SBS_RAW_FONT_SIZE[100] },
  200: { cssVar: "--sbs-font-size-200", value: SBS_RAW_FONT_SIZE[200] },
  300: { cssVar: "--sbs-font-size-300", value: SBS_RAW_FONT_SIZE[300] },
  400: { cssVar: "--sbs-font-size-400", value: SBS_RAW_FONT_SIZE[400] },
  500: { cssVar: "--sbs-font-size-500", value: SBS_RAW_FONT_SIZE[500] },
} as const;

export const SBS_RADIUS = {
  none: { cssVar: "--sbs-radius-none", value: SBS_RAW_RADIUS.none },
  sm: { cssVar: "--sbs-radius-sm", value: SBS_RAW_RADIUS.sm },
  md: { cssVar: "--sbs-radius-md", value: SBS_RAW_RADIUS.md },
  lg: { cssVar: "--sbs-radius-lg", value: SBS_RAW_RADIUS.lg },
  pill: { cssVar: "--sbs-radius-pill", value: SBS_RAW_RADIUS.pill },
} as const;

export const SBS_BORDER_WIDTH = {
  thin: { cssVar: "--sbs-border-width-thin", value: SBS_RAW_BORDER_WIDTH.thin },
  thick: { cssVar: "--sbs-border-width-thick", value: SBS_RAW_BORDER_WIDTH.thick },
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

export const SBS_COLOR = {
  textPrimary: {
    cssVar: "--sbs-color-text-primary",
    spfxTheme: {
      slot: "bodyText",
      cssThemeString: "[theme:bodyText, default: #323130]",
      defaultRawKey: "bodyTextDefault",
    },
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
} as const satisfies Record<string, SbsSemanticColorToken>;

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
