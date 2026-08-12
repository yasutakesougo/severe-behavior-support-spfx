import {
  DEMO_DAILY_RECORD_PRESENTATION_NOTE,
  dailyRecordCopyIsFailClosed,
} from "./daily-record-copy";
import { DEMO_UX_5_SLICE, DEMO_UX_DAILY_RECORD_FIXTURE } from "./daily-record-fixture";

describe("DEMO-UX-5 daily record presentation", () => {
  it("contains input, incomplete, and recent-record presentation data", () => {
    expect(DEMO_UX_DAILY_RECORD_FIXTURE.heading).toBe("日々の記録");
    expect(DEMO_UX_DAILY_RECORD_FIXTURE.incompleteItems).toHaveLength(2);
    expect(DEMO_UX_DAILY_RECORD_FIXTURE.recentRecords).toHaveLength(3);
  });

  it("separates business facts from system state", () => {
    expect(DEMO_UX_DAILY_RECORD_FIXTURE.businessFacts.recordScopeLabel).toContain("合成表示");
    expect(DEMO_UX_DAILY_RECORD_FIXTURE.systemState.saveStateLabel).toContain("live保存なし");
  });

  it("keeps fail-closed copy", () => {
    expect(dailyRecordCopyIsFailClosed(DEMO_DAILY_RECORD_PRESENTATION_NOTE)).toBe(true);
    expect(dailyRecordCopyIsFailClosed("利用可能です。業務データに接続されています。")).toBe(false);
  });

  it("keeps live data and write flags off", () => {
    expect(DEMO_UX_5_SLICE.id).toBe("DEMO-UX-5");
    expect(DEMO_UX_5_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_5_SLICE.liveDailyRecordNavigationAuthorized).toBe(false);
    expect(DEMO_UX_5_SLICE.liveTenantIoAuthorized).toBe(false);
    expect(DEMO_UX_5_SLICE.sharePointRestAuthorized).toBe(false);
    expect(DEMO_UX_5_SLICE.adapterFetchAuthorized).toBe(false);
    expect(DEMO_UX_5_SLICE.liveRecordDataAuthorized).toBe(false);
    expect(DEMO_UX_5_SLICE.dailyActivityRecordsReuseAuthorized).toBe(false);
    expect(DEMO_UX_5_SLICE.recordMutationAuthorized).toBe(false);
  });
});
