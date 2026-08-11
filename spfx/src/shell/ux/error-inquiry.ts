/**
 * SHELL-UX-5 — presentation-only error-code + correlationId inquiry helpers.
 * Props display only — no error-code generation, failure classification, or telemetry.
 */

export type ShellErrorInquiryPresentation = Readonly<{
  errorCode: string;
  correlationId: string;
}>;

/** Non-empty trimmed errorCode + correlationId required for the inquiry surface. */
export function hasShellErrorInquiry(
  inquiry: ShellErrorInquiryPresentation | undefined,
): inquiry is ShellErrorInquiryPresentation {
  if (inquiry === undefined) {
    return false;
  }
  return inquiry.errorCode.trim() !== "" && inquiry.correlationId.trim() !== "";
}

/** Copy-friendly inquiry text for support handoff（presentation formatting only）. */
export function formatShellErrorInquiryText(inquiry: ShellErrorInquiryPresentation): string {
  return [`エラーコード: ${inquiry.errorCode}`, `相関ID: ${inquiry.correlationId}`].join("\n");
}
