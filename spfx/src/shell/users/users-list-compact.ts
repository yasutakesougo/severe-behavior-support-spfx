/**
 * FIELD-STAFF-MULTI-USER-UX-POLISH-1 Unit 5 — compact tablet Users list density.
 * Presentation-only. Does not change filter meaning, restore, overlay, or fixture catalog.
 */

export const USERS_LIST_COMPACT_TABLET_MAX_WIDTH_PX = 768;

/** ~44px touch target. Filter chips and detail buttons stay this size when compact. */
export const USERS_LIST_TOUCH_TARGET_MIN_HEIGHT = "2.75rem";

export const USERS_LIST_COMPACT_CLASS = "usersListCompact" as const;

/**
 * Compact density tokens for ≤768px. Desktop 3-column layout is unchanged.
 * Values match `UsersUx.module.scss` `$space-*` / `$font-size-meta`.
 */
export const USERS_LIST_COMPACT_DENSITY = {
  tabletMaxWidthPx: USERS_LIST_COMPACT_TABLET_MAX_WIDTH_PX,
  listGap: "0.75rem",
  listPadding: "0.75rem",
  rowPaddingBlock: "0.5rem",
  rowGap: "0.25rem 0.5rem",
  userMainGap: "0.25rem",
  metaFontSize: "0.75rem",
  keepSingleColumn: true as const,
  keepDesktopThreeColumn: true as const,
  touchTargetMinHeight: USERS_LIST_TOUCH_TARGET_MIN_HEIGHT,
} as const;

export type UsersListCompactPresentation = Readonly<{
  authorized: boolean;
  dataAttr: "true" | "false";
  classNameModifier: typeof USERS_LIST_COMPACT_CLASS | undefined;
}>;

export function presentUsersListCompact(authorized: boolean): UsersListCompactPresentation {
  if (!authorized) {
    return { authorized: false, dataAttr: "false", classNameModifier: undefined };
  }
  return {
    authorized: true,
    dataAttr: "true",
    classNameModifier: USERS_LIST_COMPACT_CLASS,
  };
}
