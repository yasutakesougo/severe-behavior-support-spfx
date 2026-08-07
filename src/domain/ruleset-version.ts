import { toAsiaTokyoCalendarDay } from "./support-plan";
import { isNonEmptyString, isRecord } from "./validation";

// ==========================================
// RuleSetVersion selection (Issue #24)
// Technical contract: docs/architecture/ruleset-version-selection.md
// Decision-RSV-1: Accepted comment 5213502406
// Decision-RSV-2: Accepted comment 5213503542
// Decision-RSV-3: Accepted comment 5213504475 (multiple → CONFLICT)
// Decision-RSV-4: Accepted comment 5213505449 (none → NONE)
// ==========================================

export type SelectRuleSetVersionResult =
  | { ok: true; decision: "SELECTED"; ruleSetVersion: string }
  | { ok: false; code: "NONE" | "CONFLICT" | "MALFORMED_INPUT" };

type ParsedCandidate = Readonly<{
  ruleSetVersion: string;
  fromDay: string;
  toDay: string;
}>;

/**
 * Select the RuleSetVersion applicable at caller-supplied `asOf`.
 *
 * - Candidates are order-independent; SharePoint / array order is ignored
 * - Applicability is Asia/Tokyo closed calendar-day membership only
 * - Exactly one applicable → SELECTED; zero → NONE; two or more → CONFLICT
 * - Fail-closed: any malformed element or duplicate id → MALFORMED_INPUT
 *
 * Catalog, Schema, SharePoint persistence, FindingIdentity / AssessmentSnapshot
 * redefinition, version-string ordering, and UI are out of scope.
 */
export function selectRuleSetVersion(
  candidates: unknown,
  asOf: unknown,
): SelectRuleSetVersionResult {
  const asOfDay = toAsiaTokyoCalendarDay(asOf);
  if (asOfDay === null) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  if (!Array.isArray(candidates)) {
    return { ok: false, code: "MALFORMED_INPUT" };
  }

  const parsed: ParsedCandidate[] = [];
  const seenIds = new Set<string>();

  for (const candidate of candidates) {
    if (!isRecord(candidate)) {
      return { ok: false, code: "MALFORMED_INPUT" };
    }

    if (!isNonEmptyString(candidate.ruleSetVersion)) {
      return { ok: false, code: "MALFORMED_INPUT" };
    }

    const fromDay = toAsiaTokyoCalendarDay(candidate.effectiveFrom);
    const toDay = toAsiaTokyoCalendarDay(candidate.effectiveTo);
    if (fromDay === null || toDay === null) {
      return { ok: false, code: "MALFORMED_INPUT" };
    }

    if (fromDay > toDay) {
      return { ok: false, code: "MALFORMED_INPUT" };
    }

    if (seenIds.has(candidate.ruleSetVersion)) {
      return { ok: false, code: "MALFORMED_INPUT" };
    }
    seenIds.add(candidate.ruleSetVersion);

    parsed.push({
      ruleSetVersion: candidate.ruleSetVersion,
      fromDay,
      toDay,
    });
  }

  const applicable = parsed.filter(
    (candidate) => candidate.fromDay <= asOfDay && asOfDay <= candidate.toDay,
  );

  if (applicable.length === 0) {
    return { ok: false, code: "NONE" };
  }

  if (applicable.length > 1) {
    return { ok: false, code: "CONFLICT" };
  }

  return {
    ok: true,
    decision: "SELECTED",
    ruleSetVersion: applicable[0].ruleSetVersion,
  };
}
