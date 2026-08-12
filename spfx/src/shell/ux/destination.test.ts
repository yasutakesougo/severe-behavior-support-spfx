import {
  destinationCopyIsFailClosed,
  headingForShellDestination,
  isShellPrimaryNavigationId,
  labelForShellDestination,
  SHELL_DEFAULT_DESTINATION,
  SHELL_DESTINATION_DISCONNECTED_BODY,
  SHELL_DESTINATION_DISCONNECTED_NOTE,
  SHELL_DESTINATION_IDS,
} from "./destination";
import { SHELL_PRIMARY_NAV_ITEMS } from "./primary-navigation";

describe("SHELL-UX-7 destination presentation", () => {
  it("locks destination ids to existing primary navigation vocabulary", () => {
    expect(SHELL_DESTINATION_IDS).toEqual(["overview", "users", "records"]);
    expect(SHELL_DEFAULT_DESTINATION).toBe("overview");
    expect(SHELL_PRIMARY_NAV_ITEMS.map((item) => item.id)).toEqual(SHELL_DESTINATION_IDS);
    expect(isShellPrimaryNavigationId("overview")).toBe(true);
    expect(isShellPrimaryNavigationId("users")).toBe(true);
    expect(isShellPrimaryNavigationId("records")).toBe(true);
    expect(isShellPrimaryNavigationId("plans")).toBe(false);
    expect(isShellPrimaryNavigationId("administration")).toBe(false);
    expect(isShellPrimaryNavigationId("dashboard")).toBe(false);
  });

  it("exposes destination headings matching primary nav labels", () => {
    expect(labelForShellDestination("overview")).toBe("概要");
    expect(labelForShellDestination("users")).toBe("利用者");
    expect(labelForShellDestination("records")).toBe("記録");
    expect(headingForShellDestination("overview")).toBe("概要");
    expect(headingForShellDestination("users")).toBe("利用者");
    expect(headingForShellDestination("records")).toBe("記録");
  });

  it("keeps disconnected copy fail-closed and non-usable", () => {
    const combined = `${SHELL_DESTINATION_DISCONNECTED_BODY}\n${SHELL_DESTINATION_DISCONNECTED_NOTE}`;
    expect(destinationCopyIsFailClosed(combined)).toBe(true);
    expect(combined).toContain("業務データには接続されていません");
    expect(combined).toContain("利用可能な業務画面ではありません");
    expect(destinationCopyIsFailClosed("利用可能です。業務データに接続されています。")).toBe(false);
  });

  it("does not invent Plans or Administration destinations", () => {
    const labels = SHELL_PRIMARY_NAV_ITEMS.map((item) => item.label);
    expect(labels).not.toContain("支援計画");
    expect(labels).not.toContain("管理");
    expect(labels).not.toContain("Plans");
    expect(labels).not.toContain("Administration");
  });
});
