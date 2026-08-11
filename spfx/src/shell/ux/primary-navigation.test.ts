import { isShellPrimaryNavigationEnabled, SHELL_PRIMARY_NAV_ITEMS } from "./primary-navigation";

describe("C-F′ primary navigation presentation", () => {
  it("keeps the primary navigation order fixed and destination-free", () => {
    expect(SHELL_PRIMARY_NAV_ITEMS).toEqual([
      { id: "overview", label: "概要" },
      { id: "users", label: "利用者" },
      { id: "records", label: "記録" },
    ]);
  });

  it("enables keyboard-reachable controls only after display site selection", () => {
    expect(isShellPrimaryNavigationEnabled("ready", "SITE-ISG")).toBe(true);
    expect(isShellPrimaryNavigationEnabled("ready", "SITE-HOM")).toBe(true);
    expect(isShellPrimaryNavigationEnabled("loading", "SITE-ISG")).toBe(true);
    expect(isShellPrimaryNavigationEnabled("ready", "unselected")).toBe(false);
    expect(isShellPrimaryNavigationEnabled("unauthenticated", "SITE-ISG")).toBe(false);
  });

  it("does not introduce authorization or live-I/O semantics", () => {
    expect(isShellPrimaryNavigationEnabled("access_denied", "SITE-ISG")).toBe(true);
    expect(isShellPrimaryNavigationEnabled("retrieval_failed", "SITE-ISG")).toBe(true);
    expect(isShellPrimaryNavigationEnabled("partial_retrieval_failed", "SITE-ISG")).toBe(true);
  });
});
