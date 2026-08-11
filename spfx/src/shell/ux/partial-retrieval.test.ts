import {
  SHELL_PARTIAL_RETRIEVAL_WARNING,
  hasPartialRetrievalFailure,
  type ShellPartialRetrievalPresentation,
} from "./partial-retrieval";

describe("SHELL-UX-4 partial-retrieval presentation", () => {
  const sample: ShellPartialRetrievalPresentation = {
    succeededItems: [{ id: "ok-1", label: "表示項目A" }],
    failedItems: [{ id: "ng-1", label: "表示項目B" }],
  };

  it("requires failed items for partial-retrieval presentation", () => {
    expect(hasPartialRetrievalFailure(sample)).toBe(true);
    expect(
      hasPartialRetrievalFailure({
        succeededItems: sample.succeededItems,
        failedItems: [],
      }),
    ).toBe(false);
  });

  it("keeps warning copy that rejects 全件正常 misread", () => {
    expect(SHELL_PARTIAL_RETRIEVAL_WARNING).toContain("全件正常ではありません");
    expect(SHELL_PARTIAL_RETRIEVAL_WARNING).toContain("分けて表示");
  });

  it("does not collapse failed items into succeeded items", () => {
    const failedIds = sample.failedItems.map((item) => item.id);
    const succeededIds = sample.succeededItems.map((item) => item.id);
    for (const id of failedIds) {
      expect(succeededIds.indexOf(id)).toBe(-1);
    }
  });
});
