/**
 * VP-A Foundations — Semantic Icon Mapping & Components
 *
 * Rules:
 * - Text label is authoritative (icon is supplementary).
 * - Default aria-hidden="true" to prevent redundant screen reader announcements.
 * - Icon type map resolves approved canonical keys only.
 * - Critical status (save success/failed, valid/invalid) must NOT use icon authority.
 * - Fluent UI operation icons (Close, Search, Chevron, Back, etc.) remain in Fluent UI.
 */

import * as React from "react";

export const CANONICAL_SEMANTIC_ICON_KEYS = [
  "todaySupport",
  "record",
  "supportPlan",
  "monitoring",
] as const;

export type CanonicalSemanticIconKey = (typeof CANONICAL_SEMANTIC_ICON_KEYS)[number];

export function isCanonicalSemanticIconKey(key: string): key is CanonicalSemanticIconKey {
  return (CANONICAL_SEMANTIC_ICON_KEYS as readonly string[]).indexOf(key) >= 0;
}

export type SemanticIconProps = Readonly<{
  name: CanonicalSemanticIconKey;
  className?: string;
  size?: number | string;
  /** Presentation-only color or token fallback. Defaults to 'currentColor'. */
  color?: string;
  /** Defaults to true (decorative). Pass false and ariaLabel if standalone. */
  ariaHidden?: boolean;
  ariaLabel?: string;
}>;

/**
 * Placeholder SVG paths for approved canonical keys (trial subset).
 * Clean, standard geometries representing business concepts.
 */
const CANONICAL_SVG_PATHS: Record<CanonicalSemanticIconKey, React.ReactNode> = {
  todaySupport: (
    // Sun / Calendar daily support concept
    <g>
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  ),
  record: (
    // Document / Pen recording concept
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 3.5L18.5 8H14V3.5zM6 20V4h7v5h5v11H6z"
      fill="currentColor"
    />
  ),
  supportPlan: (
    // Roadmap / Clipboard plan concept
    <path
      d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 16H5V5h2v2h10V5h2v14z"
      fill="currentColor"
    />
  ),
  monitoring: (
    // Pulse / Evaluation monitoring concept
    <path
      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 12h2l1.5-3 2 6 1.5-3H17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ),
};

export const SemanticIcon: React.FC<SemanticIconProps> = ({
  name,
  className,
  size = 24,
  color = "currentColor",
  ariaHidden = true,
  ariaLabel,
}) => {
  if (!isCanonicalSemanticIconKey(name)) {
    return null;
  }

  const svgContent = CANONICAL_SVG_PATHS[name];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={{ color }}
      aria-hidden={ariaHidden ? "true" : undefined}
      aria-label={!ariaHidden ? ariaLabel : undefined}
      role={!ariaHidden ? "img" : undefined}
      focusable="false"
    >
      {svgContent}
    </svg>
  );
};
