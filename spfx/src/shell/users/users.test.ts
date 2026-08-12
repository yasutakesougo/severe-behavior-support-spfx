import {
  DEMO_USERS_PRESENTATION_NOTE,
  usersCopyIsFailClosed,
} from "./users-copy";
import { DEMO_UX_SLICE, DEMO_UX_USERS_FIXTURE } from "./users-fixture";

describe("DEMO-UX-2 users list fixture boundary", () => {
  it("uses synthetic rows for responsible-person review density", () => {
    expect(DEMO_UX_USERS_FIXTURE.summaryLabel).toBe("全8名（合成データ）");
    expect(DEMO_UX_USERS_FIXTURE.rows).toHaveLength(8);
    expect(DEMO_UX_USERS_FIXTURE.rows.map((row) => row.personLabel)).toEqual([
      "Aさん",
      "Bさん",
      "Cさん",
      "Dさん",
      "Eさん",
      "Fさん",
      "Gさん",
      "Hさん",
    ]);
  });

  it("includes textual status badges without live identifiers", () => {
    const badgeLabels: string[] = [];
    for (const row of DEMO_UX_USERS_FIXTURE.rows) {
      for (const badge of row.statusBadges) {
        badgeLabels.push(badge.label);
      }
    }
    expect(badgeLabels).toContain("要確認");
    expect(badgeLabels).toContain("未記録");
    expect(badgeLabels).toContain("期限間近");
    expect(badgeLabels).toContain("通常");
    expect(DEMO_UX_USERS_FIXTURE.rows[0]?.attentionNote).toBe("支援記録が未入力");
  });

  it("keeps presentation copy fail-closed", () => {
    expect(usersCopyIsFailClosed(DEMO_USERS_PRESENTATION_NOTE)).toBe(true);
    expect(DEMO_USERS_PRESENTATION_NOTE).toContain("業務データには接続されていません");
    expect(usersCopyIsFailClosed("利用可能です。業務データに接続されています。")).toBe(false);
  });

  it("does not authorize live I/O, adapter fetch, auth judgment, or detail navigation", () => {
    expect(DEMO_UX_SLICE.id).toBe("DEMO-UX-2");
    expect(DEMO_UX_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.sharePointRestAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.binderHostWiringAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.adapterFetchAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.authJudgmentAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.liveUsersDataAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.userDetailNavigationAuthorized).toBe(false);
    expect(DEMO_UX_SLICE.filterExecutionAuthorized).toBe(false);
  });
});
