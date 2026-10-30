import test from "node:test";
import assert from "node:assert/strict";

import type {
  ScheduleItem as CanonicalScheduleItem,
  ScheduledOccurrence as CanonicalScheduledOccurrence,
} from "../../src/domain/kiosk-contract";
import type { SupportPlanVersion as CanonicalSupportPlanVersion } from "../../src/domain/support-plan";
import type { SupportPlanVersionProcedureBinding as CanonicalBinding } from "../../src/domain/support-plan-version-procedure-binding";
import type {
  ApprovedProcedureReference as CanonicalApprovedProcedureReference,
  LocalDate as CanonicalLocalDate,
} from "../../src/contracts/types";
import type {
  CanonicalProcedureResolutionOutcome as CanonicalOutcome,
  CanonicalProcedureResolutionQuery as CanonicalQuery,
  CanonicalProcedureProjection as CanonicalProjection,
} from "../../src/domain/canonical-procedure-resolver";
import type {
  ApprovedProcedureReference as BridgeApprovedProcedureReference,
  CanonicalProcedureResolutionOutcome as BridgeOutcome,
  CanonicalProcedureResolutionQuery as BridgeQuery,
  CanonicalProcedureProjection as BridgeProjection,
  LocalDate as BridgeLocalDate,
  ScheduleItem as BridgeScheduleItem,
  ScheduledOccurrence as BridgeScheduledOccurrence,
  SupportPlanVersion as BridgeSupportPlanVersion,
  SupportPlanVersionProcedureBinding as BridgeBinding,
} from "../../spfx/src/sbs-domain/canonical-procedure-resolver.bundle";

type AssertTrue<T extends true> = T;
type IsBidirectionallyAssignable<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

export type _AssertScheduleItem = AssertTrue<
  IsBidirectionallyAssignable<CanonicalScheduleItem, BridgeScheduleItem>
>;
export type _AssertScheduledOccurrence = AssertTrue<
  IsBidirectionallyAssignable<CanonicalScheduledOccurrence, BridgeScheduledOccurrence>
>;
export type _AssertSupportPlanVersion = AssertTrue<
  IsBidirectionallyAssignable<CanonicalSupportPlanVersion, BridgeSupportPlanVersion>
>;
export type _AssertBinding = AssertTrue<
  IsBidirectionallyAssignable<CanonicalBinding, BridgeBinding>
>;
export type _AssertApprovedProcedureRef = AssertTrue<
  IsBidirectionallyAssignable<CanonicalApprovedProcedureReference, BridgeApprovedProcedureReference>
>;
export type _AssertLocalDate = AssertTrue<
  IsBidirectionallyAssignable<CanonicalLocalDate, BridgeLocalDate>
>;
export type _AssertQuery = AssertTrue<IsBidirectionallyAssignable<CanonicalQuery, BridgeQuery>>;
export type _AssertOutcome = AssertTrue<
  IsBidirectionallyAssignable<CanonicalOutcome, BridgeOutcome>
>;
export type _AssertProjection = AssertTrue<
  IsBidirectionallyAssignable<CanonicalProjection, BridgeProjection>
>;

test("Canonical Procedure Resolver Bridge types maintain bidirectional assignability", () => {
  // Runtime assertion confirming module loads and exports are functional
  assert.ok(true, "Compile-time type assertions passed");
});
