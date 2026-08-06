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
  deriveStableFindingId,
  transitionFindingStatus,
  sha256Hex,
  STABLE_FINDING_ID_FIELD_ORDER,
  FINDING_STATUS_ALLOWED_TRANSITIONS,
  FINDING_STATUSES,
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

describe("Finding Stable ID Contract", () => {
  it("同一Identityから決定的な安定IDを返す", () => {
    const identity = createSyntheticFindingIdentity();
    const first = deriveStableFindingId(identity);
    const second = deriveStableFindingId({ ...identity });

    assert.equal(first.ok, true);
    assert.equal(second.ok, true);
    if (!first.ok || !second.ok) {
      return;
    }

    assert.match(first.findingId, /^finding_[0-9a-f]{64}$/);
    assert.equal(first.findingId, second.findingId);
    assert.equal(
      first.findingId,
      "finding_50a23a97a173fdb265ab325320d39320fbf0062b6e919e7b7dc1cfd1d405a0e4"
    );
  });

  it("フィールド順契約を固定する", () => {
    assert.deepEqual([...STABLE_FINDING_ID_FIELD_ORDER], [
      "OrganizationId",
      "SiteId",
      "UserId",
      "FindingCode",
      "ruleSetVersion",
      "periodStart",
      "periodEnd",
    ]);
  });

  it("1フィールド差で異なる安定IDを返す", () => {
    const base = deriveStableFindingId(createSyntheticFindingIdentity());
    const changedUser = deriveStableFindingId(
      createSyntheticFindingIdentity({ UserId: "synthetic-user-002" })
    );
    const changedPeriod = deriveStableFindingId(
      createSyntheticFindingIdentity({ periodEnd: "2026-08-30" })
    );

    assert.equal(base.ok, true);
    assert.equal(changedUser.ok, true);
    assert.equal(changedPeriod.ok, true);
    if (!base.ok || !changedUser.ok || !changedPeriod.ok) {
      return;
    }

    assert.notEqual(base.findingId, changedUser.findingId);
    assert.notEqual(base.findingId, changedPeriod.findingId);
    assert.notEqual(changedUser.findingId, changedPeriod.findingId);
  });

  it("不正IdentityをINVALID_IDENTITYとして拒否する", () => {
    assert.deepEqual(deriveStableFindingId(null), {
      ok: false,
      code: "INVALID_IDENTITY",
    });
    assert.deepEqual(
      deriveStableFindingId(createSyntheticFindingIdentity({ OrganizationId: "" })),
      { ok: false, code: "INVALID_IDENTITY" }
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({ periodEnd: "2026-07-01" })
      ),
      { ok: false, code: "INVALID_IDENTITY" }
    );
  });

  it("未trimおよびC0/DEL/C1制御文字をUNSUPPORTED_IDENTITY_VALUEとして拒否する", () => {
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({ UserId: "  synthetic-user-001  " })
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" }
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          UserId: `synthetic-user${"\t"}001`,
        })
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" }
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          UserId: `synthetic-user${"\n"}001`,
        })
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" }
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          OrganizationId: `synthetic-org${"\r"}001`,
        })
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" }
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          SiteId: `synthetic-site${"\u001f"}001`,
        })
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" }
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          ruleSetVersion: `synthetic${"\u007f"}v1.0.0`,
        })
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" }
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          ruleSetVersion: `synthetic${"\u0085"}v1.0.0`,
        })
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" }
    );
  });

  it("pure SHA-256が固定ベクトルと一致する", () => {
    assert.equal(
      sha256Hex(""),
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    );
    assert.equal(
      sha256Hex("abc"),
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
    );
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

describe("Finding Lifecycle Transition Contract", () => {
  it("許可遷移表を3辺に固定する", () => {
    assert.deepEqual(
      FINDING_STATUS_ALLOWED_TRANSITIONS.map(([from, to]) => [from, to]),
      [
        ["Open", "Confirmed"],
        ["Confirmed", "InProgress"],
        ["InProgress", "Resolved"],
      ]
    );
  });

  it("許可3辺を成功させ targetStatus を返す", () => {
    assert.deepEqual(transitionFindingStatus("Open", "Confirmed"), {
      ok: true,
      status: "Confirmed",
    });
    assert.deepEqual(transitionFindingStatus("Confirmed", "InProgress"), {
      ok: true,
      status: "InProgress",
    });
    assert.deepEqual(transitionFindingStatus("InProgress", "Resolved"), {
      ok: true,
      status: "Resolved",
    });
  });

  it("自己遷移・スキップ・逆行・Resolvedからの遷移をINVALID_TRANSITIONとして拒否する", () => {
    assert.deepEqual(transitionFindingStatus("Open", "Open"), {
      ok: false,
      code: "INVALID_TRANSITION",
    });
    assert.deepEqual(transitionFindingStatus("Open", "InProgress"), {
      ok: false,
      code: "INVALID_TRANSITION",
    });
    assert.deepEqual(transitionFindingStatus("Open", "Resolved"), {
      ok: false,
      code: "INVALID_TRANSITION",
    });
    assert.deepEqual(transitionFindingStatus("Confirmed", "Resolved"), {
      ok: false,
      code: "INVALID_TRANSITION",
    });
    assert.deepEqual(transitionFindingStatus("Confirmed", "Open"), {
      ok: false,
      code: "INVALID_TRANSITION",
    });
    assert.deepEqual(transitionFindingStatus("InProgress", "Confirmed"), {
      ok: false,
      code: "INVALID_TRANSITION",
    });
    assert.deepEqual(transitionFindingStatus("Resolved", "Open"), {
      ok: false,
      code: "INVALID_TRANSITION",
    });
    assert.deepEqual(transitionFindingStatus("Resolved", "Resolved"), {
      ok: false,
      code: "INVALID_TRANSITION",
    });
  });

  it("非FindingStatus入力をMALFORMED_INPUTとして拒否する", () => {
    assert.deepEqual(transitionFindingStatus(null, "Confirmed"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionFindingStatus("Open", undefined), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionFindingStatus("open", "Confirmed"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionFindingStatus("Open", "confirmed"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(transitionFindingStatus("Unknown", "Confirmed"), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("許可外表の組み合わせを網羅的に拒否する（許可3辺以外）", () => {
    for (const from of FINDING_STATUSES) {
      for (const to of FINDING_STATUSES) {
        const allowed = FINDING_STATUS_ALLOWED_TRANSITIONS.some(
          ([allowedFrom, allowedTo]) => allowedFrom === from && allowedTo === to
        );
        const result = transitionFindingStatus(from, to);
        if (allowed) {
          assert.deepEqual(result, { ok: true, status: to });
        } else {
          assert.deepEqual(result, {
            ok: false,
            code: "INVALID_TRANSITION",
          });
        }
      }
    }
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

  it("任意許可フィールドの空文字を拒否する", () => {
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ SiteId: "" })),
      false
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ actorStaffId: "" })),
      false
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ targetRecordId: "" })),
      false
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ appVersion: "" })),
      false
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ ruleSetVersion: "" })),
      false
    );
  });

  it("任意許可フィールドの実フィールド欠損は受理する", () => {
    const base = createSyntheticAuditEventSuccess();
    const {
      SiteId: _siteId,
      actorStaffId: _actorStaffId,
      targetRecordId: _targetRecordId,
      appVersion: _appVersion,
      ruleSetVersion: _ruleSetVersion,
      ...minimal
    } = base;
    assert.equal(validateAuditEvent(minimal), true);
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

  it("correctedAtの不正日時を拒否する", () => {
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ correctedAt: "invalid-date" })
      ),
      false
    );
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ correctedAt: "2026-08-06" })
      ),
      false
    );
  });

  it("correctedByの欠損・空文字を拒否する", () => {
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ correctedBy: "" })
      ),
      false
    );
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ correctedBy: "   " })
      ),
      false
    );

    const { correctedBy: _correctedBy, ...missingCorrectedBy } =
      createSyntheticSnapshotCorrection();
    assert.equal(validateSnapshotCorrection(missingCorrectedBy), false);

    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({
          correctedBy: undefined as unknown as string,
        })
      ),
      false
    );
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

  it("includedAt < requestedAt を拒否する", () => {
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffIncluded({
          requestedAt: "2026-08-06T12:00:00.000Z",
          includedAt: "2026-08-06T11:00:00.000Z",
        })
      ),
      false
    );
  });

  it("closedAt < acknowledgedAt を拒否する", () => {
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffClosed({
          acknowledgedAt: "2026-08-06T13:00:00.000Z",
          closedAt: "2026-08-06T12:30:00.000Z",
        })
      ),
      false
    );
  });

  it("not_requiredへrequestedAtが混入したら拒否する", () => {
    assert.equal(
      validateHandoffState({
        ...createSyntheticHandoffNotRequired(),
        requestedAt: "2026-08-06T10:00:00.000Z",
      }),
      false
    );
  });

  it("includedAt / acknowledgedAt / closedAt の実フィールド欠損を拒否する", () => {
    const { includedAt: _includedAt, ...missingIncludedAt } =
      createSyntheticHandoffIncluded();
    assert.equal(validateHandoffState(missingIncludedAt), false);

    const { acknowledgedAt: _acknowledgedAt, ...missingAcknowledgedAt } =
      createSyntheticHandoffAcknowledged();
    assert.equal(validateHandoffState(missingAcknowledgedAt), false);

    const { closedAt: _closedAt, ...missingClosedAt } =
      createSyntheticHandoffClosed();
    assert.equal(validateHandoffState(missingClosedAt), false);

    assert.equal(
      validateHandoffState(
        createSyntheticHandoffIncluded({
          includedAt: undefined as unknown as string,
        })
      ),
      false
    );
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffAcknowledged({
          acknowledgedAt: undefined as unknown as string,
        })
      ),
      false
    );
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffClosed({
          closedAt: undefined as unknown as string,
        })
      ),
      false
    );
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
