import {
  SHELL_SITE_IDS,
  SHELL_SITE_OPTIONS,
  SHELL_SITE_SELECTION_UNSELECTED,
  isShellSiteId,
  isShellSiteSelection,
  isSiteUnselected,
  labelForShellSiteSelection,
  siteOptionForId,
} from "./site-selection";

describe("SHELL-UX-3 site-selection presentation", () => {
  it("exposes SITE-ISG and SITE-HOM display choices", () => {
    expect(SHELL_SITE_IDS).toEqual(["SITE-ISG", "SITE-HOM"]);
    expect(SHELL_SITE_OPTIONS.map((o) => o.siteId)).toEqual(["SITE-ISG", "SITE-HOM"]);
  });

  it("treats unselected as an independent presentation state", () => {
    expect(isSiteUnselected(SHELL_SITE_SELECTION_UNSELECTED)).toBe(true);
    expect(isSiteUnselected("SITE-ISG")).toBe(false);
    expect(isSiteUnselected("SITE-HOM")).toBe(false);
    expect(labelForShellSiteSelection("unselected")).toBe("未選択");
  });

  it("labels selected sites without membership claims", () => {
    expect(labelForShellSiteSelection("SITE-ISG")).toContain("SITE-ISG");
    expect(labelForShellSiteSelection("SITE-HOM")).toContain("SITE-HOM");
    expect(siteOptionForId("SITE-HOM").displayName).toContain("本牧");
  });

  it("rejects unknown selection strings fail-closed", () => {
    expect(isShellSiteId("SITE-ISG")).toBe(true);
    expect(isShellSiteId("SITE-XXX")).toBe(false);
    expect(isShellSiteSelection("unselected")).toBe(true);
    expect(isShellSiteSelection("ALL")).toBe(false);
  });
});
