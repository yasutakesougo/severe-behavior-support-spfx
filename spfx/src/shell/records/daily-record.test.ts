import {
  DEMO_DAILY_RECORD_DRAFT_HINT,
  DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE,
  DEMO_DAILY_RECORD_PRESENTATION_NOTE,
  dailyRecordCopyIsFailClosed,
} from "./daily-record-copy";
import {
  DEMO_UX_9_SLICE,
  findIncompleteItemById,
  seedLocalDraftForIncompleteItem,
} from "./daily-record-draft";
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
    expect(DEMO_DAILY_RECORD_MUTATION_DISABLED_NOTE).toContain("実保存なし");
    expect(DEMO_DAILY_RECORD_DRAFT_HINT).toContain("業務データへは保存されません");
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

describe("DEMO-UX-9 daily record experience", () => {
  it("seeds local draft text from the selected incomplete item", () => {
    const itemA = DEMO_UX_DAILY_RECORD_FIXTURE.incompleteItems[0];
    const itemB = DEMO_UX_DAILY_RECORD_FIXTURE.incompleteItems[1];
    expect(itemA?.id).toBe("incomplete-a");
    expect(itemB?.id).toBe("incomplete-b");
    const seedA = seedLocalDraftForIncompleteItem(itemA);
    const seedB = seedLocalDraftForIncompleteItem(itemB);
    expect(seedA).toContain("Aさん");
    expect(seedA).toContain("未記録");
    expect(seedA).toContain("未保存");
    expect(seedB).toContain("Bさん");
    expect(seedB).toContain("要確認");
    expect(seedA).not.toEqual(seedB);
  });

  it("resolves incomplete items by id without growing the fixture set", () => {
    expect(DEMO_UX_DAILY_RECORD_FIXTURE.incompleteItems).toHaveLength(2);
    expect(
      findIncompleteItemById(DEMO_UX_DAILY_RECORD_FIXTURE.incompleteItems, "incomplete-a")
        ?.personLabel,
    ).toBe("Aさん");
    expect(
      findIncompleteItemById(DEMO_UX_DAILY_RECORD_FIXTURE.incompleteItems, "missing"),
    ).toBeUndefined();
  });

  it("authorizes local draft edit only and keeps save / write out", () => {
    expect(DEMO_UX_9_SLICE.id).toBe("DEMO-UX-9");
    expect(DEMO_UX_9_SLICE.presentationOnly).toBe(true);
    expect(DEMO_UX_9_SLICE.incompleteSelectionAuthorized).toBe(true);
    expect(DEMO_UX_9_SLICE.localDraftEditAuthorized).toBe(true);
    expect(DEMO_UX_9_SLICE.draftPersistenceAuthorized).toBe(false);
    expect(DEMO_UX_9_SLICE.autosaveAuthorized).toBe(false);
    expect(DEMO_UX_9_SLICE.saveMutationAuthorized).toBe(false);
    expect(DEMO_UX_9_SLICE.sharePointWriteAuthorized).toBe(false);
    expect(DEMO_UX_9_SLICE.recordCreationAuthorized).toBe(false);
    expect(DEMO_UX_9_SLICE.adapterFetchAuthorized).toBe(false);
    expect(DEMO_UX_9_SLICE.failClosedSemanticsChangeAuthorized).toBe(false);
    expect(DEMO_UX_9_SLICE.saveOutcomeUnknownNormalizationAuthorized).toBe(false);
  });
});
