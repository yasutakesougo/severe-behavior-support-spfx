import {
  MANAGEMENT_HOME_CONFIRMED_NONE_FIXTURE,
  MANAGEMENT_HOME_MISMATCH_FIXTURE,
  MANAGEMENT_HOME_RESOLVED_FIXTURE,
  MANAGEMENT_HOME_UNAVAILABLE_FIXTURE,
} from "./management-home-fixture";
import { buildManagementHomeReadModel } from "./management-home-read-model";

describe("SBS-MGMT-HOME-C read model", () => {
  it("uses SupportPlan.currentVersion as the current applied authority", () => {
    const result = buildManagementHomeReadModel(MANAGEMENT_HOME_RESOLVED_FIXTURE);
    expect(result.currentPlanLabel).toContain("v4");
    expect(result.revisionLabel).toContain("Draft v5");
    expect(result.revisionLabel).toContain("未適用");
    expect(result.revisionLabel).toContain("Intent CONSUMED");
  });

  it("keeps confirmed none distinct from unavailable", () => {
    const none = buildManagementHomeReadModel(MANAGEMENT_HOME_CONFIRMED_NONE_FIXTURE);
    expect(none.reviewLabel).toBe("見直し: 該当情報なし");
    expect(none.revisionLabel).toBe("変更対応: 該当情報なし");
    expect(none.unavailableSections).toEqual([]);

    const unavailable = buildManagementHomeReadModel(MANAGEMENT_HOME_UNAVAILABLE_FIXTURE);
    expect(unavailable.monitoringLabel).toBe("記録: 確認できません");
    expect(unavailable.reviewLabel).toBe("見直し: 確認できません");
    expect(unavailable.nextActionLabel).toBe("次に必要な人の行動: 情報を確認してから判断");
    expect(unavailable.unavailableSections.length).toBeGreaterThan(0);
  });

  it("fails closed on identity mismatch", () => {
    const result = buildManagementHomeReadModel(MANAGEMENT_HOME_MISMATCH_FIXTURE);
    expect(result.revisionLabel).toBe("変更対応: 確認できません");
    expect(result.unavailableSections).toContain("revision");
    expect(result.nextActionLabel).toBe("次に必要な人の行動: 情報を確認してから判断");
  });

  it("preserves the human review decision without deriving effectiveness", () => {
    const result = buildManagementHomeReadModel(MANAGEMENT_HOME_RESOLVED_FIXTURE);
    expect(result.reviewLabel).toContain("CHANGE_REQUIRED");
    expect(JSON.stringify(result)).not.toContain("EFFECTIVE");
    expect(JSON.stringify(result)).not.toContain("INEFFECTIVE");
  });
});
