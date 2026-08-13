/**
 * DADS-04 — raw token values (corporate-app baselines).
 *
 * These mirror current DEMO-UX / SHELL-UX presentation defaults.
 * They are NOT Domain / Contracts vocabulary and NOT a mandate to
 * match Digital Agency Design System literals in components.
 *
 * Components must consume semantic tokens (see semantic.ts / sbs-tokens.scss),
 * not these raw values directly in React.
 */

export const SBS_RAW_SPACE = {
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.5rem",
} as const;

export const SBS_RAW_FONT_SIZE = {
  100: "0.75rem",
  200: "0.875rem",
  300: "0.95rem",
  400: "1.1rem",
  500: "1.25rem",
} as const;

export const SBS_RAW_RADIUS = {
  none: "0",
  sm: "4px",
  md: "8px",
  lg: "12px",
  pill: "999px",
} as const;

export const SBS_RAW_BORDER_WIDTH = {
  thin: "1px",
  thick: "2px",
} as const;

export const SBS_RAW_FOCUS = {
  outlineWidth: "2px",
  outlineOffset: "2px",
} as const;

/**
 * Raw color literals currently used by shell presentation.
 * SPFx theme defaults are recorded alongside theme slot names in semantic.ts.
 */
export const SBS_RAW_COLOR = {
  bodyTextDefault: "#323130",
  themePrimaryDefault: "#03787c",
  themeLighterDefault: "#deecf9",
  neutralLightDefault: "#edebe9",
  neutralTertiaryDefault: "#a19f9d",
  neutralSecondaryDefault: "#8a8886",
  neutralLighterDefault: "#f3f2f1",
  neutralLighterAltDefault: "#faf9f8",
  canvas: "#ffffff",
  skipLinkBg: "#111111",
  skipLinkFg: "#ffffff",
  feedbackInfoFg: "#004578",
  feedbackInfoBorder: "#0078d4",
  feedbackInfoBg: "#deecf9",
  feedbackInfoBgSubtle: "#eff6fc",
  feedbackInfoBgTint: "#f3f9fd",
  feedbackDangerFg: "#a4262c",
  feedbackDangerBorder: "#a4262c",
  feedbackDangerBg: "#fde7e9",
  feedbackDangerBgSubtle: "#fff5f6",
  feedbackWarningFg: "#8a6116",
  feedbackWarningBorder: "#8a6116",
  feedbackWarningBg: "#fff4ce",
} as const;

export type SbsRawSpaceKey = keyof typeof SBS_RAW_SPACE;
export type SbsRawFontSizeKey = keyof typeof SBS_RAW_FONT_SIZE;
export type SbsRawRadiusKey = keyof typeof SBS_RAW_RADIUS;
export type SbsRawColorKey = keyof typeof SBS_RAW_COLOR;
