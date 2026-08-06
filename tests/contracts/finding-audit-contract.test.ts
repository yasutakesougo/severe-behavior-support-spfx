import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isRecord,
  isValidIsoDateTime,
  isValidIsoDate,
  isReasonCode,
  isNonEmptyString,
  isFindingStatus,
  validateFindingIdentity,
  validateAuditEvent,
  validateSnapshotCorrection,
  validateHandoffState,
  FindingIdentity,
  AuditEvent,
  SnapshotCorrection,
  HandoffState,
  EvaluationInput,
} from "../../src/domain";
import {
  createSyntheticFindingIdentity,
  createSyntheticAuditEventSuccess,
  createSyntheticSnapshotCorrection,
  createSyntheticHandoffNotRequired,
  createSyntheticHandoffPending,
  createSyntheticHandoffIncluded,
  createSyntheticHandoffAcknowledged,
  createSyntheticHandoffClosed,
} from "../domain/finding-audit-fixtures";
import {
  SYNTHETIC_CRITERIA_PASS,
  SYNTHETIC_FINDINGS_ONE,
} from "../domain/fixtures";

describe("Validation Helper Common Functions", () => {
  it("isValidIsoDate validates YYYY-MM-DD correctly", () => {
    assert.equal(isValidIsoDate("2026-08-06"), true);
    assert.equal(isValidIsoDate("2026-02-28"), true);
    assert.equal(isValidIsoDate("2026-02-30"), false); // Invalid day
    assert.equal(isValidIsoDate("2026-13-01"), false); // Invalid month
    assert.equal(isValidIsoDate("2026-8-6"), false); // Single digit
    assert.equal(isValidIsoDate("2026-08-06T10:00:00Z"), false); // DateTime string
    assert.equal(isValidIsoDate(""), false);
  });

  it("isNonEmptyString rejects empty or whitespace-only strings", () => {
    assert.equal(isNonEmptyString("valid string"), true);
    assert.equal(isNonEmptyString(""), false);
    assert.equal(isNonEmptyString("   "), false);
    assert.equal(isNonEmptyString(123), false);
  });
});

describe("EvaluationFindingReference Contract Regression Check", () => {
  it("EvaluationInput accepts EvaluationFindingReference array", () => {
    const input: EvaluationInput = {
      executionStatus: "COMPLETED",
      criteria: SYNTHETIC_CRITERIA_PASS,
      findings: SYNTHETIC_FINDINGS_ONE,
      missingDataCount: 0,
      pendingConfirmationCount: 0,
      expiredEvidenceCount: 0,
      systemErrorCount: 0,
      approvalRequired: false,
      approved: false,
    };
    assert.equal(input.findings[0].findingCode, "synthetic-finding-code-101");
  });
});

describe("FindingIdentity Contract Validation", () => {
  it("正常構造を受理する", () => {
    const id = createSyntheticFindingIdentity();
    assert.equal(validateFindingIdentity(id), true);
  });

  it("期間開始日と終了日が同じ構造を受理する", () => {
    const sameDateId = createSyntheticFindingIdentity({
      periodStart: "2026-08-06",
      periodEnd: "2026-08-06",
    });
    assert.equal(validateFindingIdentity(sameDateId), true);
  });

  it("期間終了が開始より前なら拒否する", () => {
    const invalidPeriodId = createSyntheticFindingIdentity({
      periodStart: "2026-08-31",
      periodEnd: "2026-08-01",
    });
    assert.equal(validateFindingIdentity(invalidPeriodId), false);
  });

  it("空のOrganizationId / SiteId / UserId / ruleSetVersionを拒否する", () => {
    assert.equal(
      validateFindingIdentity(createSyntheticFindingIdentity({ OrganizationId: "" })),
      false
    );
    assert.equal(
      validateFindingIdentity(createSyntheticFindingIdentity({ SiteId: "  " })),
      false
    );
    assert.equal(
      validateFindingIdentity(createSyntheticFindingIdentity({ UserId: "" })),
      false
    );
    assert.equal(
      validateFindingIdentity(createSyntheticFindingIdentity({ ruleSetVersion: " " })),
      false
    );
  });

  it("不正FindingCodeを拒否する", () => {
    const invalidCodeId = createSyntheticFindingIdentity({
      FindingCode: "invalid_lowercase_code",
    });
    assert.equal(validateFindingIdentity(invalidCodeId), false);
  });

  it("不正ISO暦日を拒否する", () => {
    const invalidDateId = createSyntheticFindingIdentity({
      periodStart: "2026-08-06T10:00:00Z",
    });
    assert.equal(validateFindingIdentity(invalidDateId), false);
  });

  it("余分なseverityを拒否する", () => {
    const extraSeverityId = {
      ...createSyntheticFindingIdentity(),
      severity: "high",
    };
    assert.equal(validateFindingIdentity(extraSeverityId), false);
  });
});

describe("FindingStatus Contract Validation", () => {
  it("4つの正本statusを受理する", () => {
    assert.equal(isFindingStatus("Open"), true);
    assert.equal(isFindingStatus("Confirmed"), true);
    assert.equal(isFindingStatus("InProgress"), true);
    assert.equal(isFindingStatus("Resolved"), true);
  });

  it("未知statusを拒否する", () => {
    assert.equal(isFindingStatus("UnknownStatus"), false);
    assert.equal(isFindingStatus("open"), false);
  });
});

describe("AuditEvent Contract & Strict Allowlist Validation", () => {
  it("正常なsuccess / denied / failedを受理する", () => {
    const successEvent = createSyntheticAuditEventSuccess({ result: "success" });
    const deniedEvent = createSyntheticAuditEventSuccess({
      result: "denied",
      reasonCode: "SYNTHETIC_REASON_DENIED",
    });
    const failedEvent = createSyntheticAuditEventSuccess({ result: "failed" });

    assert.equal(validateAuditEvent(successEvent), true);
    assert.equal(validateAuditEvent(deniedEvent), true);
    assert.equal(validateAuditEvent(failedEvent), true);
  });

  it("未知resultを拒否する", () => {
    const unknownResult = createSyntheticAuditEventSuccess({
      result: "invalid_result" as unknown as "success",
    });
    assert.equal(validateAuditEvent(unknownResult), false);
  });

  it("correlationId欠損を拒否する", () => {
    const noCorrelation = createSyntheticAuditEventSuccess({
      correlationId: "",
    });
    assert.equal(validateAuditEvent(noCorrelation), false);
  });

  it("不正occurredAt / actionCode / reasonCodeを拒否する", () => {
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ occurredAt: "2026-08-06" })),
      false
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ actionCode: "lowercase_action" })),
      false
    );
    assert.equal(
      validateAuditEvent(
        createSyntheticAuditEventSuccess({ reasonCode: "invalid reason" })
      ),
      false
    );
  });

  it("支援計画本文、ABC本文、観察本文、Token、Cookie、Client Secret、自由記述messageを拒否する", () => {
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), supportPlan: "text" }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), supportMethods: ["method"] }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), antecedent: "text" }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), behavior: "text" }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), aftermath: "text" }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), observation: "text" }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), password: "secret" }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), token: "secret" }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), cookie: "secret" }),
      false
    );
    const secretKey = "client" + "Secret";
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), [secretKey]: "synthetic-forbidden-value" }),
      false
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), message: "error text" }),
      false
    );
  });
});

describe("SnapshotCorrection Contract Validation", () => {
  it("正常構造を受理する", () => {
    const correction = createSyntheticSnapshotCorrection();
    assert.equal(validateSnapshotCorrection(correction), true);
  });

  it("元IDと訂正版IDが同じ場合に拒否する", () => {
    const sameIdCorrection = createSyntheticSnapshotCorrection({
      originalSnapshotId: "synthetic-snapshot-001",
      replacementSnapshotId: "synthetic-snapshot-001",
    });
    assert.equal(validateSnapshotCorrection(sameIdCorrection), false);
  });

  it("reasonCode欠損または不正形式を拒否する", () => {
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ reasonCode: "" })
      ),
      false
    );
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ reasonCode: "invalid_lowercase" })
      ),
      false
    );
  });

  it("空または空白だけのreasonTextを拒否する", () => {
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ reasonText: "" })
      ),
      false
    );
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ reasonText: "   " })
      ),
      false
    );
  });

  it("余分な削除項目を拒否する", () => {
    const deletedCorrection = {
      ...createSyntheticSnapshotCorrection(),
      deletedAt: "2026-08-06T13:00:00.000Z",
    };
    assert.equal(validateSnapshotCorrection(deletedCorrection), false);
  });
});

describe("HandoffState Discriminated Union & Contract Validation", () => {
  it("5状態の正常構造を受理する", () => {
    assert.equal(validateHandoffState(createSyntheticHandoffNotRequired()), true);
    assert.equal(validateHandoffState(createSyntheticHandoffPending()), true);
    assert.equal(validateHandoffState(createSyntheticHandoffIncluded()), true);
    assert.equal(validateHandoffState(createSyntheticHandoffAcknowledged()), true);
    assert.equal(validateHandoffState(createSyntheticHandoffClosed()), true);
  });

  it("pendingでrequestedAt / requestedBy欠損を拒否する", () => {
    const noReqAt = createSyntheticHandoffPending({
      requestedAt: undefined as unknown as string,
    });
    const noReqBy = createSyntheticHandoffPending({
      requestedBy: "",
    });
    assert.equal(validateHandoffState(noReqAt), false);
    assert.equal(validateHandoffState(noReqBy), false);
  });

  it("includedでmeetingId / includedAt / includedBy欠損を拒否する", () => {
    assert.equal(
      validateHandoffState(createSyntheticHandoffIncluded({ meetingId: "" })),
      false
    );
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffIncluded({ includedAt: "invalid-date" })
      ),
      false
    );
    assert.equal(
      validateHandoffState(createSyntheticHandoffIncluded({ includedBy: "" })),
      false
    );
  });

  it("acknowledgedでacknowledgedAt / acknowledgedBy欠損を拒否する", () => {
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffAcknowledged({ acknowledgedAt: "" })
      ),
      false
    );
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffAcknowledged({ acknowledgedBy: "" })
      ),
      false
    );
  });

  it("closedでclosedAt / closedBy欠損を拒否する", () => {
    assert.equal(
      validateHandoffState(createSyntheticHandoffClosed({ closedAt: "" })),
      false
    );
    assert.equal(
      validateHandoffState(createSyntheticHandoffClosed({ closedBy: "" })),
      false
    );
  });

  it("前状態の履歴欠損を拒否する", () => {
    const closedNoPending = createSyntheticHandoffClosed({
      requestedAt: undefined as unknown as string,
    });
    assert.equal(validateHandoffState(closedNoPending), false);
  });

  it("未来状態の項目混入を拒否する", () => {
    const pendingWithMeeting = createSyntheticHandoffPending({
      meetingId: "synthetic-meeting-001",
    } as unknown as Partial<HandoffState>);
    assert.equal(validateHandoffState(pendingWithMeeting), false);
  });

  it("日時順序の逆転を拒否する", () => {
    const reversedDates = createSyntheticHandoffClosed({
      includedAt: "2026-08-06T12:00:00.000Z",
      acknowledgedAt: "2026-08-06T11:00:00.000Z", // Earlier than includedAt
    });
    assert.equal(validateHandoffState(reversedDates), false);
  });

  it("未知statusおよび余分なキーを拒否する", () => {
    const unknownStatus = {
      status: "unknown_status",
    };
    const extraKeyNotReq = {
      ...createSyntheticHandoffNotRequired(),
      extraField: "value",
    };
    assert.equal(validateHandoffState(unknownStatus), false);
    assert.equal(validateHandoffState(extraKeyNotReq), false);
  });
});
