import {
  SBS_PRIMITIVE_DISPOSITIONS,
  SBS_PRIMITIVE_REGISTRY,
  SBS_PRIMITIVE_SLICE,
} from "./disposition";

describe("DADS-05 shared UI primitives registry", () => {
  it("exposes KEEP / ADAPT / FIX / CONSOLIDATE dispositions", () => {
    expect([...SBS_PRIMITIVE_DISPOSITIONS]).toEqual(["KEEP", "ADAPT", "FIX", "CONSOLIDATE"]);
  });

  it("keeps later gates unauthorized", () => {
    expect(SBS_PRIMITIVE_SLICE.accessibilityGateAuthorized).toBe(false);
    expect(SBS_PRIMITIVE_SLICE.screenMigrationAuthorized).toBe(false);
    expect(SBS_PRIMITIVE_SLICE.inv19HeadingFixAuthorized).toBe(false);
    expect(SBS_PRIMITIVE_SLICE.domainContractsMutationAuthorized).toBe(false);
    expect(SBS_PRIMITIVE_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(SBS_PRIMITIVE_SLICE.deployAuthorized).toBe(false);
  });

  it("registers candidate primitives without Domain status vocabulary in ids", () => {
    const ids = SBS_PRIMITIVE_REGISTRY.map((entry) => entry.id).join(" ");
    expect(ids).toContain("StatusBadge");
    expect(ids).toContain("EmptyNotice");
    expect(ids).toContain("SingleSelectListbox");
    expect(ids).toContain("SectionLabelStrip");
    expect(ids).not.toMatch(/要確認|recordStatus|EmptyState/);
  });

  it("keeps fail-closed StatusPanel family as KEEP", () => {
    const panel = SBS_PRIMITIVE_REGISTRY.find((entry) => entry.id === "StatusPanelFamily");
    expect(panel?.disposition).toBe("KEEP");
  });

  it("marks INV-07 / INV-10 / INV-17 as FIX candidates", () => {
    const byInv = (inv: string): typeof SBS_PRIMITIVE_REGISTRY =>
      SBS_PRIMITIVE_REGISTRY.filter((entry) => entry.inventoryRefs.indexOf(inv) >= 0);
    expect(byInv("INV-07")[0]?.disposition).toBe("FIX");
    expect(byInv("INV-10")[0]?.disposition).toBe("FIX");
    expect(byInv("INV-17")[0]?.disposition).toBe("FIX");
  });
});
