import {
  formatShellErrorInquiryText,
  hasShellErrorInquiry,
  type ShellErrorInquiryPresentation,
} from "./error-inquiry";

describe("SHELL-UX-5 error-inquiry presentation", () => {
  const sample: ShellErrorInquiryPresentation = {
    errorCode: "SHELL-UX-5-SYNTH-E001",
    correlationId: "shell-ux-5-synth-corr",
  };

  it("requires both errorCode and correlationId for inquiry presentation", () => {
    expect(hasShellErrorInquiry(sample)).toBe(true);
    expect(hasShellErrorInquiry({ errorCode: "", correlationId: sample.correlationId })).toBe(
      false,
    );
    expect(hasShellErrorInquiry({ errorCode: sample.errorCode, correlationId: "  " })).toBe(false);
    expect(hasShellErrorInquiry(undefined)).toBe(false);
  });

  it("formats copy-friendly inquiry text with both fields", () => {
    const text = formatShellErrorInquiryText(sample);
    expect(text).toContain("エラーコード: SHELL-UX-5-SYNTH-E001");
    expect(text).toContain("相関ID: shell-ux-5-synth-corr");
    expect(text.indexOf("\n")).toBeGreaterThan(0);
  });

  it("does not invent generation or classification semantics", () => {
    // Presentation helpers only format props; they must not map/classify failures.
    const other: ShellErrorInquiryPresentation = {
      errorCode: "DISPLAY-ONLY-CODE",
      correlationId: "display-only-corr",
    };
    expect(formatShellErrorInquiryText(other)).toBe(
      "エラーコード: DISPLAY-ONLY-CODE\n相関ID: display-only-corr",
    );
  });
});
