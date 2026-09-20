import {
  ADMIN_AUDIT_DEFAULT_TASK_DESTINATION,
  ADMIN_AUDIT_HOME_DESTINATION,
  ADMIN_AUDIT_HOME_IDENTITY_TOKEN,
  ADMIN_AUDIT_RESTORE_FAIL_CLOSED_COPY,
  ADMIN_AUDIT_TASK_DESTINATION_IDS,
  ADMIN_AUDIT_TASK_GLOBAL_ITEMS,
  ADMIN_AUDIT_UNSUPPORTED_RESTORE_TOKENS,
  adminAuditApprovalAuthorized,
  adminAuditDeleteAuthorized,
  adminAuditDeployAuthorized,
  adminAuditEvidenceAcceptanceAuthorized,
  adminAuditGlobalIdForDestination,
  adminAuditLiveWriteAuthorized,
  adminAuditPlaceForRestoreToken,
  adminAuditPublishAuthorized,
  applyAdminAuditSessionEvent,
  contextHintForAdminAuditDestination,
  initialAdminAuditTaskViewState,
  locationHeadingForAdminAuditDestination,
  resolveAdminAuditGlobalDestination,
  restoreAdminAuditDestination,
  shellAdapterForAdminAuditDestination,
} from "./admin-audit-task-navigation";

describe("ADMIN-AUDIT-TASK-FIRST-V1 task navigation", () => {
  it("AC-AA-TF-1: locks Global labels exactly", () => {
    expect(ADMIN_AUDIT_TASK_GLOBAL_ITEMS.map((item) => item.label)).toEqual([
      "運用確認",
      "証跡",
      "探す",
    ]);
  });

  it("AC-AA-TF-2: locks exact Global order", () => {
    expect(ADMIN_AUDIT_TASK_GLOBAL_ITEMS.map((item) => item.label).join("|")).toBe(
      "運用確認|証跡|探す",
    );
    expect(ADMIN_AUDIT_TASK_GLOBAL_ITEMS.map((item) => item.globalId)).toEqual([
      "GLOBAL-OPS",
      "GLOBAL-EVIDENCE",
      "GLOBAL-FIND-PERSON",
    ]);
  });

  it("AC-AA-TF-3: 運用確認 → D-OPS only", () => {
    expect(resolveAdminAuditGlobalDestination("GLOBAL-OPS")).toBe("D-OPS");
    expect(ADMIN_AUDIT_TASK_GLOBAL_ITEMS[0].sufficientDestination).toBe("D-OPS");
  });

  it("AC-AA-TF-4: 証跡 → D-EVIDENCE only", () => {
    expect(resolveAdminAuditGlobalDestination("GLOBAL-EVIDENCE")).toBe("D-EVIDENCE");
    expect(ADMIN_AUDIT_TASK_GLOBAL_ITEMS[1].sufficientDestination).toBe("D-EVIDENCE");
  });

  it("AC-AA-TF-5: 探す → D-FIND-PERSON only; not D-FIND-RECORD", () => {
    expect(resolveAdminAuditGlobalDestination("GLOBAL-FIND-PERSON")).toBe("D-FIND-PERSON");
    expect(ADMIN_AUDIT_TASK_GLOBAL_ITEMS.map((item) => item.sufficientDestination)).not.toContain(
      "D-FIND-RECORD",
    );
    expect(ADMIN_AUDIT_TASK_DESTINATION_IDS).not.toContain("D-FIND-RECORD");
  });

  it("AC-AA-TF-6: first paint is D-OPS / 運用確認", () => {
    const initial = initialAdminAuditTaskViewState();
    expect(initial.destination).toBe("D-OPS");
    expect(initial.activeGlobalId).toBe("GLOBAL-OPS");
    expect(ADMIN_AUDIT_DEFAULT_TASK_DESTINATION).toBe("D-OPS");
    expect(locationHeadingForAdminAuditDestination(initial.destination)).toBe("運用確認");
  });

  it("AC-AA-TF-7: D-HOME == D-OPS is literal identity, not a second place", () => {
    expect(ADMIN_AUDIT_HOME_DESTINATION).toBe("D-OPS");
    expect(ADMIN_AUDIT_TASK_DESTINATION_IDS).not.toContain("D-HOME");
    expect(ADMIN_AUDIT_TASK_DESTINATION_IDS).toEqual(["D-OPS", "D-EVIDENCE", "D-FIND-PERSON"]);
    expect(adminAuditPlaceForRestoreToken(ADMIN_AUDIT_HOME_IDENTITY_TOKEN)).toBe(
      ADMIN_AUDIT_HOME_DESTINATION,
    );
    expect(adminAuditPlaceForRestoreToken("D-OPS")).toBe(ADMIN_AUDIT_HOME_DESTINATION);
    const homeRestore = restoreAdminAuditDestination(ADMIN_AUDIT_HOME_IDENTITY_TOKEN);
    const opsRestore = restoreAdminAuditDestination("D-OPS");
    expect(homeRestore.status).toBe("restored");
    expect(opsRestore.status).toBe("restored");
    if (homeRestore.status === "restored" && opsRestore.status === "restored") {
      expect(homeRestore.destination).toBe(opsRestore.destination);
      expect(homeRestore.destination).toBe("D-OPS");
      expect(homeRestore.activeGlobalId).toBe("GLOBAL-OPS");
      expect(locationHeadingForAdminAuditDestination(homeRestore.destination)).toBe("運用確認");
    }
  });

  it("AC-AA-TF-10: supported Destinations restore uniquely", () => {
    expect(restoreAdminAuditDestination("D-OPS")).toMatchObject({
      status: "restored",
      destination: "D-OPS",
      activeGlobalId: "GLOBAL-OPS",
    });
    expect(restoreAdminAuditDestination("D-EVIDENCE")).toMatchObject({
      status: "restored",
      destination: "D-EVIDENCE",
      activeGlobalId: "GLOBAL-EVIDENCE",
    });
    expect(restoreAdminAuditDestination("D-FIND-PERSON")).toMatchObject({
      status: "restored",
      destination: "D-FIND-PERSON",
      activeGlobalId: "GLOBAL-FIND-PERSON",
    });
  });

  it("AC-AA-TF-11: deep-link restore of role+Destination succeeds without object", () => {
    const restored = applyAdminAuditSessionEvent(initialAdminAuditTaskViewState(), {
      type: "RESTORE",
      destinationToken: "D-EVIDENCE",
    });
    expect(restored.restoreStatus).toBe("restored");
    expect(restored.destination).toBe("D-EVIDENCE");
    expect(restored.requestedRestoreToken).toBe("D-EVIDENCE");
  });

  it("AC-AA-TF-12: invalid restore fail-closes and does not claim D-OPS success", () => {
    for (const token of ADMIN_AUDIT_UNSUPPORTED_RESTORE_TOKENS) {
      const outcome = restoreAdminAuditDestination(token);
      expect(outcome.status).toBe("fail-closed");
      if (outcome.status === "fail-closed") {
        expect(outcome.reason).toBe("unsupported-destination");
        expect(outcome.requestedRestoreToken).toBe(token);
      }
    }
    const invented = restoreAdminAuditDestination("D-INVENTED");
    expect(invented.status).toBe("fail-closed");
    const withObject = restoreAdminAuditDestination("D-OPS", { userId: "user-a" });
    expect(withObject.status).toBe("fail-closed");
    if (withObject.status === "fail-closed") {
      expect(withObject.reason).toBe("malformed-object");
    }
    const next = applyAdminAuditSessionEvent(initialAdminAuditTaskViewState(), {
      type: "RESTORE",
      destinationToken: "D-AUDIT",
    });
    expect(next.restoreStatus).toBe("fail-closed");
    expect(next.requestedRestoreToken).toBe("D-AUDIT");
    expect(next.destination).toBe("D-OPS");
    expect(next.restoreStatus).not.toBe("restored");
    expect(ADMIN_AUDIT_RESTORE_FAIL_CLOSED_COPY).toContain("推測して運用確認へ進めていません");
  });

  it("AC-AA-TF-17..20: presentation Task-First grants no authority", () => {
    expect(adminAuditApprovalAuthorized).toBe(false);
    expect(adminAuditEvidenceAcceptanceAuthorized).toBe(false);
    expect(adminAuditPublishAuthorized).toBe(false);
    expect(adminAuditDeployAuthorized).toBe(false);
    expect(adminAuditDeleteAuthorized).toBe(false);
    expect(adminAuditLiveWriteAuthorized).toBe(false);
  });

  it("maps C6 headings uniquely for this slice", () => {
    expect(locationHeadingForAdminAuditDestination("D-OPS")).toBe("運用確認");
    expect(locationHeadingForAdminAuditDestination("D-EVIDENCE")).toBe("証跡");
    expect(locationHeadingForAdminAuditDestination("D-FIND-PERSON")).toBe("利用者を探す");
    expect(contextHintForAdminAuditDestination("D-FIND-PERSON")).toContain("記録探しは Global");
  });

  it("uses SHELL-UX-7 ids as adapter transport only", () => {
    expect(shellAdapterForAdminAuditDestination("D-OPS")).toBe("overview");
    expect(shellAdapterForAdminAuditDestination("D-EVIDENCE")).toBe("records");
    expect(shellAdapterForAdminAuditDestination("D-FIND-PERSON")).toBe("users");
    expect(adminAuditGlobalIdForDestination("D-OPS")).toBe("GLOBAL-OPS");
  });

  it("applies Global clicks without minting D-FIND-RECORD", () => {
    let state = initialAdminAuditTaskViewState();
    state = applyAdminAuditSessionEvent(state, {
      type: "GLOBAL",
      globalId: "GLOBAL-EVIDENCE",
    });
    expect(state.destination).toBe("D-EVIDENCE");
    state = applyAdminAuditSessionEvent(state, {
      type: "GLOBAL",
      globalId: "GLOBAL-FIND-PERSON",
    });
    expect(state.destination).toBe("D-FIND-PERSON");
    state = applyAdminAuditSessionEvent(state, { type: "GLOBAL", globalId: "GLOBAL-OPS" });
    expect(state.destination).toBe("D-OPS");
    expect(state.activeGlobalId).toBe("GLOBAL-OPS");
  });
});
