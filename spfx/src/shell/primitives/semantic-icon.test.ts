import { CANONICAL_SEMANTIC_ICON_KEYS, isCanonicalSemanticIconKey } from "./SemanticIcon";

describe("VP-A SemanticIcon foundation", () => {
  it("defines approved canonical semantic icon keys subset", () => {
    expect([...CANONICAL_SEMANTIC_ICON_KEYS]).toEqual([
      "todaySupport",
      "record",
      "supportPlan",
      "monitoring",
    ]);
  });

  it("validates canonical key check helper", () => {
    expect(isCanonicalSemanticIconKey("todaySupport")).toBe(true);
    expect(isCanonicalSemanticIconKey("record")).toBe(true);
    expect(isCanonicalSemanticIconKey("supportPlan")).toBe(true);
    expect(isCanonicalSemanticIconKey("monitoring")).toBe(true);
    expect(isCanonicalSemanticIconKey("saveFailed")).toBe(false);
    expect(isCanonicalSemanticIconKey("valid")).toBe(false);
    expect(isCanonicalSemanticIconKey("unknown_key")).toBe(false);
  });
});
