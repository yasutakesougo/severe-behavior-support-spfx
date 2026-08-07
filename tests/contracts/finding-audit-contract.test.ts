import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { EvaluationInput, HandoffState } from "../../src/domain";
import {
  assembleFindingIdentity,
  decideFindingGeneration,
  decideFindingRecurrence,
  deriveStableFindingId,
  FINDING_RECURRENCE_MATCH_FIELDS,
  FINDING_STATUS_ALLOWED_TRANSITIONS,
  FINDING_STATUSES,
  isFindingStatus,
  isNonEmptyString,
  isValidIsoDate,
  sha256Hex,
  STABLE_FINDING_ID_FIELD_ORDER,
  transitionFindingStatus,
  validateAuditEvent,
  validateFindingIdentity,
  validateHandoffState,
  validateSnapshotCorrection,
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
  SYNTHETIC_CRITERIA_FAIL,
  SYNTHETIC_CRITERIA_UNKNOWN,
  SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE,
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
      false,
    );
    assert.equal(validateFindingIdentity(createSyntheticFindingIdentity({ SiteId: "  " })), false);
    assert.equal(validateFindingIdentity(createSyntheticFindingIdentity({ UserId: "" })), false);
    assert.equal(
      validateFindingIdentity(createSyntheticFindingIdentity({ ruleSetVersion: " " })),
      false,
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

describe("Finding Identity Assembly Contract", () => {
  it("正常入力をFindingIdentityへ組み立てる", () => {
    const input = createSyntheticFindingIdentity();
    const result = assembleFindingIdentity(input);

    assert.equal(result.ok, true);
    if (!result.ok) {
      return;
    }

    assert.deepEqual(result.identity, input);
    assert.equal(result.identity.FindingCode, "SYNTHETIC_FINDING_CODE_001");
  });

  it("成功時の各フィールド値は入力と同一文字列である", () => {
    const input = createSyntheticFindingIdentity({
      OrganizationId: "synthetic-org-exact",
      FindingCode: "EXTERNAL_FINDING_CODE_99",
      ruleSetVersion: "ruleset-1.2.3",
    });
    const result = assembleFindingIdentity(input);
    assert.equal(result.ok, true);
    if (!result.ok) {
      return;
    }

    assert.equal(result.identity.OrganizationId, "synthetic-org-exact");
    assert.equal(result.identity.FindingCode, "EXTERNAL_FINDING_CODE_99");
    assert.equal(result.identity.ruleSetVersion, "ruleset-1.2.3");
  });

  it("assemble成功後はderiveStableFindingIdが必ず成功する", () => {
    const cases = [
      createSyntheticFindingIdentity(),
      createSyntheticFindingIdentity({
        periodStart: "2026-08-06",
        periodEnd: "2026-08-06",
      }),
      createSyntheticFindingIdentity({
        FindingCode: "CALLER_SUPPLIED_CODE",
        UserId: "synthetic-user-002",
      }),
    ];

    for (const input of cases) {
      const assembled = assembleFindingIdentity(input);
      assert.equal(assembled.ok, true);
      if (!assembled.ok) {
        return;
      }

      const derived = deriveStableFindingId(assembled.identity);
      assert.equal(derived.ok, true);
      if (!derived.ok) {
        return;
      }
      assert.match(derived.findingId, /^finding_[0-9a-f]{64}$/);
    }
  });

  it("不正入力をMALFORMED_INPUTとして拒否する", () => {
    assert.deepEqual(assembleFindingIdentity(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(
      assembleFindingIdentity(createSyntheticFindingIdentity({ OrganizationId: "" })),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      assembleFindingIdentity(
        createSyntheticFindingIdentity({ FindingCode: "invalid_lowercase_code" }),
      ),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      assembleFindingIdentity(createSyntheticFindingIdentity({ periodEnd: "2026-07-01" })),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      assembleFindingIdentity({
        ...createSyntheticFindingIdentity(),
        severity: "high",
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
  });

  it("FindingCode欠落をMALFORMED_INPUTとして拒否する", () => {
    const { FindingCode: _removed, ...withoutCode } = createSyntheticFindingIdentity();
    assert.deepEqual(assembleFindingIdentity(withoutCode), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
  });

  it("未trimおよびC0/DEL/C1制御文字をUNSUPPORTED_IDENTITY_VALUEとして拒否する", () => {
    assert.deepEqual(
      assembleFindingIdentity(createSyntheticFindingIdentity({ UserId: "  synthetic-user-001  " })),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      assembleFindingIdentity(
        createSyntheticFindingIdentity({
          UserId: `synthetic-user${"\t"}001`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      assembleFindingIdentity(
        createSyntheticFindingIdentity({
          SiteId: `synthetic-site${"\u001f"}001`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      assembleFindingIdentity(
        createSyntheticFindingIdentity({
          ruleSetVersion: `synthetic${"\u007f"}v1.0.0`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
  });

  it("値をtrimして受理しない（正規化しない）", () => {
    const padded = createSyntheticFindingIdentity({
      OrganizationId: " synthetic-org-001",
    });
    assert.equal(validateFindingIdentity(padded), true);
    assert.deepEqual(assembleFindingIdentity(padded), {
      ok: false,
      code: "UNSUPPORTED_IDENTITY_VALUE",
    });
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
      "finding_50a23a97a173fdb265ab325320d39320fbf0062b6e919e7b7dc1cfd1d405a0e4",
    );
  });

  it("フィールド順契約を固定する", () => {
    assert.deepEqual(
      [...STABLE_FINDING_ID_FIELD_ORDER],
      [
        "OrganizationId",
        "SiteId",
        "UserId",
        "FindingCode",
        "ruleSetVersion",
        "periodStart",
        "periodEnd",
      ],
    );
  });

  it("1フィールド差で異なる安定IDを返す", () => {
    const base = deriveStableFindingId(createSyntheticFindingIdentity());
    const changedUser = deriveStableFindingId(
      createSyntheticFindingIdentity({ UserId: "synthetic-user-002" }),
    );
    const changedPeriod = deriveStableFindingId(
      createSyntheticFindingIdentity({ periodEnd: "2026-08-30" }),
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
      { ok: false, code: "INVALID_IDENTITY" },
    );
    assert.deepEqual(
      deriveStableFindingId(createSyntheticFindingIdentity({ periodEnd: "2026-07-01" })),
      { ok: false, code: "INVALID_IDENTITY" },
    );
  });

  it("未trimおよびC0/DEL/C1制御文字をUNSUPPORTED_IDENTITY_VALUEとして拒否する", () => {
    assert.deepEqual(
      deriveStableFindingId(createSyntheticFindingIdentity({ UserId: "  synthetic-user-001  " })),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          UserId: `synthetic-user${"\t"}001`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          UserId: `synthetic-user${"\n"}001`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          OrganizationId: `synthetic-org${"\r"}001`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          SiteId: `synthetic-site${"\u001f"}001`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          ruleSetVersion: `synthetic${"\u007f"}v1.0.0`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
    assert.deepEqual(
      deriveStableFindingId(
        createSyntheticFindingIdentity({
          ruleSetVersion: `synthetic${"\u0085"}v1.0.0`,
        }),
      ),
      { ok: false, code: "UNSUPPORTED_IDENTITY_VALUE" },
    );
  });

  it("pure SHA-256が固定ベクトルと一致する", () => {
    assert.equal(sha256Hex(""), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    assert.equal(
      sha256Hex("abc"),
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
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
      ],
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
          ([allowedFrom, allowedTo]) => allowedFrom === from && allowedTo === to,
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

describe("Finding Recurrence Decision Contract", () => {
  const priorResolved = {
    identity: createSyntheticFindingIdentity(),
    status: "Resolved" as const,
  };

  it("再発マッチキー契約を固定する", () => {
    assert.deepEqual(
      [...FINDING_RECURRENCE_MATCH_FIELDS],
      ["OrganizationId", "SiteId", "UserId", "FindingCode", "ruleSetVersion"],
    );
  });

  it("先行なしはNEWとする", () => {
    const candidate = createSyntheticFindingIdentity();
    assert.deepEqual(decideFindingRecurrence({ candidate }), {
      ok: true,
      decision: "NEW",
    });
    assert.deepEqual(decideFindingRecurrence({ candidate, prior: null }), {
      ok: true,
      decision: "NEW",
    });
  });

  it("Identity完全一致はSAMEとする（Q4-A）", () => {
    const identity = createSyntheticFindingIdentity();
    assert.deepEqual(
      decideFindingRecurrence({
        candidate: identity,
        prior: { identity, status: "Open" },
      }),
      { ok: true, decision: "SAME" },
    );
    assert.deepEqual(
      decideFindingRecurrence({
        candidate: { ...identity },
        prior: { identity, status: "Resolved" },
      }),
      { ok: true, decision: "SAME" },
    );
  });

  it("Resolved先行かつperiod差のみならRECURRENCEとする（Q1-C/Q3-A）", () => {
    const priorIdentity = createSyntheticFindingIdentity({
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
    });
    const candidate = createSyntheticFindingIdentity({
      periodStart: "2026-08-01",
      periodEnd: "2026-08-31",
    });
    assert.deepEqual(
      decideFindingRecurrence({
        candidate,
        prior: { identity: priorIdentity, status: "Resolved" },
      }),
      { ok: true, decision: "RECURRENCE" },
    );
  });

  it("period差だけでは再発にせず未Resolved先行はCONFLICTする（Q1-C/Q3-A）", () => {
    const priorIdentity = createSyntheticFindingIdentity({
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
    });
    const candidate = createSyntheticFindingIdentity({
      periodStart: "2026-08-01",
      periodEnd: "2026-08-31",
    });

    for (const status of ["Open", "Confirmed", "InProgress"] as const) {
      assert.deepEqual(
        decideFindingRecurrence({
          candidate,
          prior: { identity: priorIdentity, status },
        }),
        { ok: false, code: "CONFLICT_OPEN_FINDING" },
      );
    }
  });

  it("ruleSetVersion差は再発にせずNEWとする（Q2-A）", () => {
    const priorIdentity = createSyntheticFindingIdentity({
      ruleSetVersion: "synthetic-v1.0.0",
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
    });
    const candidate = createSyntheticFindingIdentity({
      ruleSetVersion: "synthetic-v2.0.0",
      periodStart: "2026-08-01",
      periodEnd: "2026-08-31",
    });
    assert.deepEqual(
      decideFindingRecurrence({
        candidate,
        prior: { identity: priorIdentity, status: "Resolved" },
      }),
      { ok: true, decision: "NEW" },
    );
  });

  it("安定IDが違うだけではRECURRENCEにしない", () => {
    const priorIdentity = createSyntheticFindingIdentity();
    const candidate = createSyntheticFindingIdentity({
      UserId: "synthetic-user-002",
      periodStart: "2026-09-01",
      periodEnd: "2026-09-30",
    });
    const priorId = deriveStableFindingId(priorIdentity);
    const candidateId = deriveStableFindingId(candidate);
    assert.equal(priorId.ok, true);
    assert.equal(candidateId.ok, true);
    if (priorId.ok && candidateId.ok) {
      assert.notEqual(priorId.findingId, candidateId.findingId);
    }
    assert.deepEqual(
      decideFindingRecurrence({
        candidate,
        prior: { identity: priorIdentity, status: "Resolved" },
      }),
      { ok: true, decision: "NEW" },
    );
  });

  it("RECURRENCE時は候補と先行の安定IDが異なる", () => {
    const priorIdentity = createSyntheticFindingIdentity({
      periodStart: "2026-07-01",
      periodEnd: "2026-07-31",
    });
    const candidate = createSyntheticFindingIdentity({
      periodStart: "2026-08-01",
      periodEnd: "2026-08-31",
    });
    const decision = decideFindingRecurrence({
      candidate,
      prior: { identity: priorIdentity, status: "Resolved" },
    });
    assert.deepEqual(decision, { ok: true, decision: "RECURRENCE" });
    const priorId = deriveStableFindingId(priorIdentity);
    const candidateId = deriveStableFindingId(candidate);
    assert.equal(priorId.ok, true);
    assert.equal(candidateId.ok, true);
    if (priorId.ok && candidateId.ok) {
      assert.notEqual(priorId.findingId, candidateId.findingId);
    }
  });

  it("不正入力をMALFORMED_INPUTとして拒否する", () => {
    assert.deepEqual(decideFindingRecurrence(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(decideFindingRecurrence({}), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(
      decideFindingRecurrence({
        candidate: createSyntheticFindingIdentity({ FindingCode: "bad" }),
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      decideFindingRecurrence({
        candidate: createSyntheticFindingIdentity(),
        prior: { identity: createSyntheticFindingIdentity() },
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      decideFindingRecurrence({
        candidate: createSyntheticFindingIdentity(),
        prior: {
          identity: createSyntheticFindingIdentity(),
          status: "Closed",
        },
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      decideFindingRecurrence({
        candidate: createSyntheticFindingIdentity(),
        prior: priorResolved,
      }),
      { ok: true, decision: "SAME" },
    );
  });
});

describe("Finding Generation Conditions Contract", () => {
  it("FAILがありUNKNOWNがなければGENERATE_REQUIREDを返す", () => {
    assert.deepEqual(decideFindingGeneration({ criteria: SYNTHETIC_CRITERIA_FAIL }), {
      ok: true,
      decision: "GENERATE_REQUIRED",
    });
  });

  it("空criteriaをEMPTY_CRITERIAとしてDO_NOT_GENERATEする", () => {
    assert.deepEqual(decideFindingGeneration({ criteria: [] }), {
      ok: true,
      decision: "DO_NOT_GENERATE",
      reason: "EMPTY_CRITERIA",
    });
  });

  it("全件NOT_APPLICABLEをALL_NOT_APPLICABLEとしてDO_NOT_GENERATEする", () => {
    assert.deepEqual(decideFindingGeneration({ criteria: SYNTHETIC_CRITERIA_ALL_NOT_APPLICABLE }), {
      ok: true,
      decision: "DO_NOT_GENERATE",
      reason: "ALL_NOT_APPLICABLE",
    });
  });

  it("UNKNOWNがある場合はFAIL併存でもHAS_UNKNOWNを優先する", () => {
    assert.deepEqual(decideFindingGeneration({ criteria: SYNTHETIC_CRITERIA_UNKNOWN }), {
      ok: true,
      decision: "DO_NOT_GENERATE",
      reason: "HAS_UNKNOWN",
    });
    assert.deepEqual(
      decideFindingGeneration({
        criteria: [
          { criterionId: "synthetic-criterion-001", status: "FAIL" },
          {
            criterionId: "synthetic-criterion-002",
            status: "UNKNOWN",
            reasonCode: "synthetic-unknown-reason",
          },
        ],
      }),
      {
        ok: true,
        decision: "DO_NOT_GENERATE",
        reason: "HAS_UNKNOWN",
      },
    );
  });

  it("FAILがなくUNKNOWNもなければNO_FAILING_CRITERIAとする", () => {
    assert.deepEqual(decideFindingGeneration({ criteria: SYNTHETIC_CRITERIA_PASS }), {
      ok: true,
      decision: "DO_NOT_GENERATE",
      reason: "NO_FAILING_CRITERIA",
    });
    assert.deepEqual(
      decideFindingGeneration({
        criteria: [
          { criterionId: "synthetic-criterion-001", status: "PASS" },
          {
            criterionId: "synthetic-criterion-002",
            status: "NOT_APPLICABLE",
            reasonCode: "synthetic-not-applicable-reason",
          },
        ],
      }),
      {
        ok: true,
        decision: "DO_NOT_GENERATE",
        reason: "NO_FAILING_CRITERIA",
      },
    );
  });

  it("不正入力をMALFORMED_INPUTとして拒否する", () => {
    assert.deepEqual(decideFindingGeneration(null), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(decideFindingGeneration({}), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(decideFindingGeneration({ criteria: "not-array" }), {
      ok: false,
      code: "MALFORMED_INPUT",
    });
    assert.deepEqual(
      decideFindingGeneration({
        criteria: [{ criterionId: "synthetic-criterion-001", status: "FAIL" }, null],
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
    assert.deepEqual(
      decideFindingGeneration({
        criteria: [
          {
            criterionId: "synthetic-criterion-001",
            status: "UNKNOWN",
          },
        ],
      }),
      { ok: false, code: "MALFORMED_INPUT" },
    );
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
      false,
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ actionCode: "lowercase_action" })),
      false,
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ reasonCode: "invalid reason" })),
      false,
    );
  });

  it("支援計画本文、ABC本文、観察本文、Token、Cookie、Client Secret、自由記述messageを拒否する", () => {
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), supportPlan: "text" }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), supportMethods: ["method"] }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), antecedent: "text" }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), behavior: "text" }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), aftermath: "text" }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), observation: "text" }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), password: "secret" }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), token: "secret" }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), cookie: "secret" }),
      false,
    );
    const secretKey = "client" + "Secret";
    assert.equal(
      validateAuditEvent({
        ...createSyntheticAuditEventSuccess(),
        [secretKey]: "synthetic-forbidden-value",
      }),
      false,
    );
    assert.equal(
      validateAuditEvent({ ...createSyntheticAuditEventSuccess(), message: "error text" }),
      false,
    );
  });

  it("任意許可フィールドの空文字を拒否する", () => {
    assert.equal(validateAuditEvent(createSyntheticAuditEventSuccess({ SiteId: "" })), false);
    assert.equal(validateAuditEvent(createSyntheticAuditEventSuccess({ actorStaffId: "" })), false);
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ targetRecordId: "" })),
      false,
    );
    assert.equal(validateAuditEvent(createSyntheticAuditEventSuccess({ appVersion: "" })), false);
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ ruleSetVersion: "" })),
      false,
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

  it("canonical targetType HandoffState を受理する", () => {
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ targetType: "HandoffState" })),
      true,
    );
  });

  it("未知 targetType を拒否する", () => {
    assert.equal(
      validateAuditEvent(
        createSyntheticAuditEventSuccess({
          targetType: "UnknownTarget" as unknown as "HandoffState",
        }),
      ),
      false,
    );
    assert.equal(
      validateAuditEvent(
        createSyntheticAuditEventSuccess({
          targetType: "synthetic-target-abc-record" as unknown as "HandoffState",
        }),
      ),
      false,
    );
  });

  it("IDENTIFIER 6フィールドの leading/trailing whitespace を拒否する", () => {
    const identifierFields = [
      "auditEventId",
      "OrganizationId",
      "SiteId",
      "actorStaffId",
      "targetRecordId",
      "correlationId",
    ] as const;

    for (const field of identifierFields) {
      assert.equal(
        validateAuditEvent(
          createSyntheticAuditEventSuccess({
            [field]: ` ${createSyntheticAuditEventSuccess()[field]}`,
          }),
        ),
        false,
        `${field} leading whitespace must be rejected`,
      );
      assert.equal(
        validateAuditEvent(
          createSyntheticAuditEventSuccess({
            [field]: `${createSyntheticAuditEventSuccess()[field]} `,
          }),
        ),
        false,
        `${field} trailing whitespace must be rejected`,
      );
    }
  });

  it("IDENTIFIER 6フィールドが safe-token validator を通る（C0/DEL/C1）", () => {
    const identifierFields = [
      "auditEventId",
      "OrganizationId",
      "SiteId",
      "actorStaffId",
      "targetRecordId",
      "correlationId",
    ] as const;
    const controlCases: ReadonlyArray<{ label: string; inject: (base: string) => string }> = [
      { label: "C0 tab", inject: (base) => `${base}\t` },
      { label: "C0 newline", inject: (base) => `${base}\n` },
      { label: "C0 unit separator", inject: (base) => `${base}\u001f` },
      { label: "DEL", inject: (base) => `${base}\u007f` },
      { label: "C1 NEL", inject: (base) => `${base}\u0085` },
    ];

    for (const field of identifierFields) {
      const baseValue = createSyntheticAuditEventSuccess()[field] as string;
      for (const controlCase of controlCases) {
        assert.equal(
          validateAuditEvent(
            createSyntheticAuditEventSuccess({
              [field]: controlCase.inject(baseValue),
            }),
          ),
          false,
          `${field} ${controlCase.label} must be rejected`,
        );
      }
    }
  });

  it("VERSION の whitespace / control character を拒否し SemVer 以外の opaque token は受理する", () => {
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ appVersion: "synthetic-app-1.0" })),
      true,
    );
    assert.equal(
      validateAuditEvent(
        createSyntheticAuditEventSuccess({ ruleSetVersion: "synthetic-rule-1.0" }),
      ),
      true,
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ appVersion: " synthetic-app-1.0" })),
      false,
    );
    assert.equal(
      validateAuditEvent(
        createSyntheticAuditEventSuccess({ ruleSetVersion: "synthetic-rule-1.0 " }),
      ),
      false,
    );
    assert.equal(
      validateAuditEvent(createSyntheticAuditEventSuccess({ appVersion: "synthetic-app-1.0\n" })),
      false,
    );
    assert.equal(
      validateAuditEvent(
        createSyntheticAuditEventSuccess({ ruleSetVersion: "synthetic-rule-1.0\u007f" }),
      ),
      false,
    );
  });

  it("whitespace 付き OrganizationId を trim 受理せず拒否する（no mutation）", () => {
    const dirty = createSyntheticAuditEventSuccess({
      OrganizationId: " synthetic-org-001",
    });
    assert.equal(validateAuditEvent(dirty), false);
    assert.equal(dirty.OrganizationId, " synthetic-org-001");
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
      validateSnapshotCorrection(createSyntheticSnapshotCorrection({ reasonCode: "" })),
      false,
    );
    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({ reasonCode: "invalid_lowercase" }),
      ),
      false,
    );
  });

  it("空または空白だけのreasonTextを拒否する", () => {
    assert.equal(
      validateSnapshotCorrection(createSyntheticSnapshotCorrection({ reasonText: "" })),
      false,
    );
    assert.equal(
      validateSnapshotCorrection(createSyntheticSnapshotCorrection({ reasonText: "   " })),
      false,
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
        createSyntheticSnapshotCorrection({ correctedAt: "invalid-date" }),
      ),
      false,
    );
    assert.equal(
      validateSnapshotCorrection(createSyntheticSnapshotCorrection({ correctedAt: "2026-08-06" })),
      false,
    );
  });

  it("correctedByの欠損・空文字を拒否する", () => {
    assert.equal(
      validateSnapshotCorrection(createSyntheticSnapshotCorrection({ correctedBy: "" })),
      false,
    );
    assert.equal(
      validateSnapshotCorrection(createSyntheticSnapshotCorrection({ correctedBy: "   " })),
      false,
    );

    const { correctedBy: _correctedBy, ...missingCorrectedBy } =
      createSyntheticSnapshotCorrection();
    assert.equal(validateSnapshotCorrection(missingCorrectedBy), false);

    assert.equal(
      validateSnapshotCorrection(
        createSyntheticSnapshotCorrection({
          correctedBy: undefined as unknown as string,
        }),
      ),
      false,
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
    assert.equal(validateHandoffState(createSyntheticHandoffIncluded({ meetingId: "" })), false);
    assert.equal(
      validateHandoffState(createSyntheticHandoffIncluded({ includedAt: "invalid-date" })),
      false,
    );
    assert.equal(validateHandoffState(createSyntheticHandoffIncluded({ includedBy: "" })), false);
  });

  it("acknowledgedでacknowledgedAt / acknowledgedBy欠損を拒否する", () => {
    assert.equal(
      validateHandoffState(createSyntheticHandoffAcknowledged({ acknowledgedAt: "" })),
      false,
    );
    assert.equal(
      validateHandoffState(createSyntheticHandoffAcknowledged({ acknowledgedBy: "" })),
      false,
    );
  });

  it("closedでclosedAt / closedBy欠損を拒否する", () => {
    assert.equal(validateHandoffState(createSyntheticHandoffClosed({ closedAt: "" })), false);
    assert.equal(validateHandoffState(createSyntheticHandoffClosed({ closedBy: "" })), false);
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
        }),
      ),
      false,
    );
  });

  it("closedAt < acknowledgedAt を拒否する", () => {
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffClosed({
          acknowledgedAt: "2026-08-06T13:00:00.000Z",
          closedAt: "2026-08-06T12:30:00.000Z",
        }),
      ),
      false,
    );
  });

  it("not_requiredへrequestedAtが混入したら拒否する", () => {
    assert.equal(
      validateHandoffState({
        ...createSyntheticHandoffNotRequired(),
        requestedAt: "2026-08-06T10:00:00.000Z",
      }),
      false,
    );
  });

  it("includedAt / acknowledgedAt / closedAt の実フィールド欠損を拒否する", () => {
    const { includedAt: _includedAt, ...missingIncludedAt } = createSyntheticHandoffIncluded();
    assert.equal(validateHandoffState(missingIncludedAt), false);

    const { acknowledgedAt: _acknowledgedAt, ...missingAcknowledgedAt } =
      createSyntheticHandoffAcknowledged();
    assert.equal(validateHandoffState(missingAcknowledgedAt), false);

    const { closedAt: _closedAt, ...missingClosedAt } = createSyntheticHandoffClosed();
    assert.equal(validateHandoffState(missingClosedAt), false);

    assert.equal(
      validateHandoffState(
        createSyntheticHandoffIncluded({
          includedAt: undefined as unknown as string,
        }),
      ),
      false,
    );
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffAcknowledged({
          acknowledgedAt: undefined as unknown as string,
        }),
      ),
      false,
    );
    assert.equal(
      validateHandoffState(
        createSyntheticHandoffClosed({
          closedAt: undefined as unknown as string,
        }),
      ),
      false,
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
