import {
  SBS_A11Y_GATE_SLICE,
  SBS_A11Y_RULE_CATALOG,
  SBS_A11Y_RULE_COVERAGE,
  SBS_A11Y_RULE_SEVERITIES,
} from "./disposition";

describe("DADS-06 accessibility gate catalog", () => {
  it("keeps later / out-of-scope authorizations closed", () => {
    expect(SBS_A11Y_GATE_SLICE.screenMigrationAuthorized).toBe(false);
    expect(SBS_A11Y_GATE_SLICE.inv19HeadingFixAuthorized).toBe(false);
    expect(SBS_A11Y_GATE_SLICE.domainContractsMutationAuthorized).toBe(false);
    expect(SBS_A11Y_GATE_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(SBS_A11Y_GATE_SLICE.deployAuthorized).toBe(false);
    expect(SBS_A11Y_GATE_SLICE.newRuntimeDependencyAuthorized).toBe(false);
  });

  it("exposes severity and coverage vocabularies", () => {
    expect([...SBS_A11Y_RULE_SEVERITIES]).toEqual(["blocking", "advisory", "known_gap"]);
    expect([...SBS_A11Y_RULE_COVERAGE]).toEqual(["covered", "detect_only", "deferred"]);
  });

  it("covers required focus areas including INV-19 detection", () => {
    const focuses = new Set(SBS_A11Y_RULE_CATALOG.map((rule) => rule.focus));
    for (const focus of [
      "keyboard",
      "focus-visible",
      "heading",
      "accessible-name",
      "form-label",
      "description-error",
      "status-not-color-only",
      "disabled",
      "live-status",
      "primitive-semantics",
    ]) {
      expect(focuses.has(focus as never)).toBe(true);
    }
    const inv19 = SBS_A11Y_RULE_CATALOG.find((rule) => rule.inventoryRefs.indexOf("INV-19") >= 0);
    expect(inv19?.id).toBe("A11Y-HD-01");
    expect(inv19?.severity).toBe("known_gap");
    expect(inv19?.coverage).toBe("detect_only");
  });

  it("does not embed Domain status vocabulary in rule ids", () => {
    const blob = SBS_A11Y_RULE_CATALOG.map((rule) => rule.id).join(" ");
    expect(blob).not.toMatch(/要確認|recordStatus|access_denied/);
  });
});
